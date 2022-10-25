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
		completeSound: new Audio('./sounds/ui-click-97915.mp3'),
		resultSound: new Audio('./sounds/beep-6-96243.mp3'),
		missedSound: new Audio('./sounds/ui-click-43196.mp3'),
		started: false,
	},
	methods: {
		setTime() {
			if (this.duration && this.nq) {
				this.countdown = Math.floor(this.nq * this.duration * 60)
				this.questions = [];
				for (let i=0; i<this.nq; i++) {
					this.questions.push({
						next: i+1,
						complete: false,
						timer: null
					})
				}
			}
		},
		startTimer() {
			if (this.countdown) {
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
				this.current = this.questions[0];
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
		},
		showResults() {
				this.resultSound.play();
				clearInterval(this.master);
				this.started = false;
				this.countdown = null;
				this.nq = null;
				this.duration = null;
				this.current = null;
				this.master = null;
				this.iterator = null;
				this.masterWidth = 0;
		},
		markComplete() {
			if (this.current && this.started) {
				clearTimeout(this.current.timer);
				this.current.complete = true;
				if (this.current.next == this.nq) {
					this.showResults();
				} else {
					this.completeSound.play();
					this.current = this.questions[this.current.next]
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
		current(nv) {
			if (this.current) {
				console.log(this.current.next)
			} else {
				console.log(this.current)
			}
			if (this.current) {
				this.current.timer = setTimeout(()=>{
					this.current = this.questions[this.current.next];
					this.missedSound.play()
				}, Math.floor(this.duration * 60 * 1000))
				if (this.current.next == this.nq) {
					clearTimeout(this.current.timer);
				}
			}
		}
	},
})