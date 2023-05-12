import { config } from "./ConfigBuilder";
import FloorQueue from "./FloorQueue";
import Person from "./Person";

class Elevator {
    private destinationFloors: number[] = [];
    public currFloor = 0;
    public currPosition = 0;
    public direction: "up" | "down" | "none" = "up";
    private capacity;
    private numberOfPeopleInside = 0;
    private peopleInside: Person[] = [];
    private id: number;
    private column: HTMLDivElement[];
    constructor(id: number, cells: HTMLDivElement[][], conf: config, private queues: FloorQueue[]) {
        this.id = id;
        this.capacity = conf.capacity
        this.column = cells.map(row => row[3 * id + 1]).reverse()
        const idCell = this.column.shift()!
        idCell.textContent = this.id.toString()
        this.render()
    }
    render() {
        for (const div of this.column) {
            div.style.backgroundColor = ""
            div.textContent = ""
        }
        const elevatorEl = this.column[this.currPosition]
        elevatorEl.style.backgroundColor = "red"
        elevatorEl.textContent = this.numberOfPeopleInside.toString();

    }
    call(queue: FloorQueue) {
        if (!this.destinationFloors.includes(queue.floor)) {
            this.destinationFloors.push(queue.floor)
        }
    }

    step() {
        if (this.destinationFloors.length === 0) {
            this.direction = "none"
            return;
        }
        const isExactOnFloor = this.currPosition % 3 === 0
        const isFloorInDestinations = this.destinationFloors.includes(this.currFloor)
        if (isExactOnFloor && isFloorInDestinations) {

            // getting out people
            this.peopleInside = this.peopleInside.filter(p => p.destination !== this.currFloor)

            // getting in people
            const floor = this.destinationFloors.find(d => d === this.currFloor)
            if (floor !== undefined) {
                const peopleToGetIn = this.queues[floor].getPeople()
                while (this.peopleInside.length < this.capacity && peopleToGetIn.length !== 0) {
                    const person = this.queues[floor].removePerson()!
                    this.peopleInside.push(person)
                    this.destinationFloors.push(person.destination)
                }

                this.destinationFloors = this.destinationFloors.filter(d => d !== this.currFloor)
                this.queues[floor].hasCalledElevator = false;

                if (peopleToGetIn.length !== 0) {
                    //call again
                    this.queues[floor].hasCalledElevator = true
                }
            }


            this.numberOfPeopleInside = this.peopleInside.length
            this.render()


        } else {
            if (this.direction === "up") {
                const isDestAbove = this.destinationFloors.findIndex(d => d >= this.currFloor)
                if (isDestAbove > -1) {
                    this.addToCurrPosition(1)
                } else {
                    this.direction = "down"
                    this.addToCurrPosition(-1)
                }
            } else if (this.direction === "down") {
                const isDestBelow = this.destinationFloors.findIndex(d => d <= this.currFloor)
                if (isDestBelow > -1) {
                    this.addToCurrPosition(-1)
                } else {
                    this.addToCurrPosition(1)
                    this.direction = "up"
                }
            } else if (this.direction === "none") {
                const isDestAbove = this.destinationFloors.findIndex(d => d > this.currFloor)
                if (isDestAbove > -1) {
                    this.addToCurrPosition(1)
                    this.direction = "up"
                } else {
                    this.addToCurrPosition(-1)
                    this.direction = "down"
                }
            }
        }

    }
    addToCurrPosition(velocity: number) {
        this.currPosition += velocity
        if (this.currPosition < 0) {
            this.currPosition = 0
        }

        this.currFloor = Math.floor(this.currPosition / 3)
        this.render()
    }
    public isFull(): boolean {
        return this.capacity === this.numberOfPeopleInside
    }
    public getNumberOfPeopleInside(): number {
        return this.numberOfPeopleInside
    }
    public getDirectionMetrics(distance: number): 0 | 1 {
        if (this.direction === "none") {
            return 1
        } else if (this.direction === "up") {
            if (distance >= 0) {
                return 1
            }
        } else if (this.direction === "down") {
            if (distance <= 0) {
                return 1
            }
        }
        return 0
    }
}

export default Elevator