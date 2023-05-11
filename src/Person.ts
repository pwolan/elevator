class Person {
    private waitingTime: number;
    constructor(public id: number, public destination: number) {
        this.waitingTime = 0
    }
    incrementTime() {
        this.waitingTime++
    }
    getWaitingTime() {
        return this.waitingTime
    }
}

export default Person