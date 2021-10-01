const State = {
    counting : 0,
    paused : 1
};

class Countdown {
    constructor() {
        this.state = State.paused;
        this.from = Date.now();
        this.init = 0; //initial time
        this.banked_time = 0; //time from a stop and start
        this.callbacks = {
            on_start : () => {},
            on_stop: () => {},
            time_consumer: (str) => {}
        };
    }
    bank_time() {
        const now = Date.now()
        this.banked_time += now.getTime() - this.from.getTime();
        this.from = now;
    }
    reset() {
        this.state = State.paused;
        this.from = Date.now();
        this.banked_time = 0;
    }
    add(val) { //in miliseconds
        if (this.passed_time() > this.init) {
            this.from = Date.now();
            this.banked_time = 0;
        }
        this.init += val;
    }
    start() {
        if (this.state != State.counting) {
            this.state = State.counting;
            this.from = Date.now();
            this.callbacks.on_start();
        }
    }
    stop() {
        if (this.state == State.counting) {
            this.state = State.paused;
            this.callbacks.on_stop();
            this.bank_time();
        }
    }
    passed_time() {
        if (this.state == State.counting) {
            return this.banked_time + Date.now().getTime() - this.from.getTime();
        } else {
            return this.banked_time;
        }
    }
    update() {
        var miliseconds = Math.max(0, this.init - passed_time());
        var seconds = Math.floor(miliseconds / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        miliseconds = miliseconds % 1000;
        seconds = seconds % 60;
        minutes = minutes % 60;
        miliseconds = '00' + miliseconds;
        seconds = '0' + seconds;
        minutes = '0' + minutes;
        hours = '0' + hours;
        miliseconds = miliseconds.substring(miliseconds.length - 3, miliseconds.length);
        seconds = seconds.substring(seconds.length - 2, seconds.length);
        minutes = minutes.substring(minutes.length - 2, minutes.length);
        hours = hours.substring(hours.length - 2, hours.length);

        const str = hours + ":" + minutes + ":" + seconds + "." + miliseconds;
        
        this.callbacks.time_consumer(str);
    }
}
