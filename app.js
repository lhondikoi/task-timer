const app = new Vue({
	el: "#app",
	data: {
		questions: [],
		duration: null,
		nq: null,
		countdown: null,
		min: null,
		sec: null,
		current: null,
		masterWidth: 0,
		startSound: new Audio('./sounds/ping-82822.mp3'),
		completeSound: new Audio('./sounds/ui-click-43196.mp3'),
		resultSound: new Audio('./sounds/beep-6-96243.mp3'),
		missedSound: new Audio('./sounds/ui-click-97915.mp3'),
		started: false,
		completed: 0,
		results: false,
	},
	created() {
		window.addEventListener('keypress', this.doCommand);
	},
	destroyed() {
		window.removeEventListener('keypress', this.doCommand);
	},
	methods: {
		doCommand(e) {
			let cmd = String.fromCharCode(e.keyCode).toLowerCase();
			if (cmd == " ") {
				this.markComplete();
			}
			if (cmd == "s") {
				this.startTimer();
			}
			if (cmd == "r") {
				this.reset();
			}
			if (cmd == "t") {
				this.setTime();
			}
		},
		setTime() {
			if (this.duration && this.nq && !this.started) {
				this.countdown = Math.floor(this.nq * this.duration * 60)
				this.questions = [];
				for (let i=0; i<this.nq; i++) {
					this.questions.push({
						next: i+1,
						complete: false,
						timer: null,
						active: false,
						start: null,
						end: null,
						duration: null,
					})
				}
				// initialize current marker
				this.current = this.questions[0];
			}
		},
		startTimer() {
			if (!this.started) {
				this.startSound.play();
				// start master timer 
				if (this.countdown != null) {
					this.master = setInterval(()=>{
						this.countdown--
						if (this.countdown <= 0) {
							this.showResults();
						}
					}, 1000)
				}
				// set masterwidth time
				this.masterWidth = 100;
				// set started flag
				this.started = true;
				// set current to active
				this.current.active = true;
				this.current.start = new Date()
			}
		},
		reset() {
				clearInterval(this.master);
				clearInterval(this.iterator);
				this.started = false
				this.countdown = null;
				this.nq = null;
				this.duration = null;
				this.current = null
				this.questions = [];
				this.master = null;
				this.masterWidth = 0;
				this.results = false;
				this.completed = 0;
		},
		showResults() {
				this.resultSound.play();
				clearInterval(this.master);
				this.results = true
				this.started = false;
				this.current = null;
				this.master = null;
				this.masterWidth = 0;
		},
		markComplete() {
			if (this.current && this.started) {
				this.current.end = new Date()
				this.current.duration = this.current.end - this.current.start;
				clearTimeout(this.current.timer);
				this.current.complete = true;
				this.completed++;
				if (this.current.next == this.nq) {
					this.showResults();
				} else {
					this.completeSound.play();
					this.current = this.questions[this.current.next];
					this.current.active = true;
					this.current.start = new Date();
				}
			}
		}
	},
	watch: {
		countdown() {
			if (this.countdown) {
				this.min = Math.floor(this.countdown / 60) > 9 ? Math.floor(this.countdown / 60) : "0" + Math.floor(this.countdown / 60);  
				this.sec = Math.floor(this.countdown % 60) > 9 ? Math.floor(this.countdown % 60) : "0" + Math.floor(this.countdown % 60);
			} else {
				this.min = null;
				this.sec = null;
			}
		},
		current() {
			if (this.current && this.current.active) {
				this.current.timer = setTimeout(()=>{
					this.current = this.questions[this.current.next];
					this.current.active = true;
					this.current.start = new Date()
					this.missedSound.play()
				}, Math.floor(this.duration * 60 * 1000))
				if (this.current.next == this.nq) {
					clearTimeout(this.current.timer);
				}
			}
		}
	},
})