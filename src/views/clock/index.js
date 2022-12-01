class ClockView {
    constructor(state) {
        this.state = state;

        this.time = { h: null, m: null };
    }

    mount() {
        clock()
        this.state.setIntervalFunction("second", this.clock())
    }

    onClick() {

    }

    onToolbarClick() {

    }


    // your code
    clock() {
        let date = new Date('2019-11-24 10:33:18');
        let h = date.getHours();
        let m = date.getMinutes();
        if (this.time.h !== h || this.time.m !== m) {
            this.time = { h, m };
            
        }
    }
}

export default ClockView