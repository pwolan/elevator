import { config } from "./config";
import FloorQueue from "./FloorQueue";
import Person from "./Person";

class Elevator {
    private destinationFloors: FloorQueue[] = [];
    public currFloor = 0;
    public currPosition = 0;
    public velocity = 0;
    public direction: "up" | "down" = "up";
    private capacity;
    private numberOfPeopleInside = 0;
    private peopleInside: Person[] = [];
    private id: number;
    private column: HTMLDivElement[];
    constructor(id: number, cells: HTMLDivElement[][], private conf: config) {
        this.id = id;
        this.capacity = conf.capacity
        this.column = cells.map(row => row[3 * id + 1]).reverse().slice(1)
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
        if (!this.destinationFloors.includes(queue)) {
            this.destinationFloors.push(queue)
        }


    }

    step() {
        if (this.destinationFloors.length === 0) {

            return;
        }
        const destinationFloorsNumbers = this.destinationFloors.map(q => q.floor)
        console.log(this.currPosition);
        if (this.currPosition % 3 === 0 && destinationFloorsNumbers.includes(this.currFloor)) {
            this.velocity = 0;

            // getting out people
            this.peopleInside = this.peopleInside.filter(p => p.destination !== this.currFloor)

            // getting in people
            const floor = this.destinationFloors.find(d => d.floor === this.currFloor)
            // debuggers

            if (floor) {
                const peopleToGetIn = floor.getPeople()
                while (this.peopleInside.length < this.capacity && peopleToGetIn.length !== 0) {
                    const person = floor.removePerson()!
                    this.peopleInside.push(person)
                }
                if (peopleToGetIn.length === 0) {
                    const floorToRemove = this.destinationFloors.find(d => d.floor === this.currFloor)
                    if (floorToRemove) {
                        this.destinationFloors = this.destinationFloors.filter(d => d.floor !== this.currFloor)
                        floorToRemove.hasCalledElevator = false;

                    }
                }
            }





            this.numberOfPeopleInside = this.peopleInside.length
            this.render()


        } else {
            this.velocity = 1
            this.addToCurrPosition(this.velocity)
        }







    }
    addToCurrPosition(velocity: number) {
        this.currPosition += velocity
        if (this.currPosition < 0) {
            this.currPosition = 0
        }

        // if (this.currPosition >= (this.conf.floors - 1)*3) {
        //     this.currPosition = (this.conf.floors - 1)*3
        // }
        this.currFloor = Math.floor(this.currPosition / 3)
        this.render()
    }
    public isFull(): boolean {
        return this.capacity === this.numberOfPeopleInside
    }
}

export default Elevator