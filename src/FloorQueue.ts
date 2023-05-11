import { config } from "./ConfigBuilder";
import Person from "./Person";

class FloorQueue {

    private peopleInside: Person[] = []
    private _hasCalledElevator: boolean = false;
    private cell: HTMLDivElement;
    private button: HTMLDivElement;
    public floor: number
    constructor(
        floor: number,
        cells: HTMLDivElement[][],
        private conf: config
    ) {
        this.floor = floor
        const index = 3 * (this.conf.floors - floor) - 2
        this.cell = cells[index][1]
        this.button = cells[index][2]
        this.cell.style.backgroundColor = "rgb(37, 99, 235)"
        this.cell.style.color = "white"
        this.cell.textContent = "0"
        this.button.style.backgroundColor = "brown"



        this.button.addEventListener("click", () => {
            this.handleButton()
        })
    }
    handleButton() {
        const destination = this.getRandomDestination()
        this.addPerson(destination)
        this.hasCalledElevator = true

    }
    step() {
        const doPeopleCame = Math.random() * 10 < 1
        if (!doPeopleCame) return

        const n = Math.ceil(Math.random() * 4)
        for (let i = 0; i < n; i++) {
            const destination = this.getRandomDestination()
            this.addPerson(destination)
            this.hasCalledElevator = true
        }

    }
    private getRandomDestination(): number {
        let dest: number
        do {
            dest = Math.floor(Math.random() * this.conf.floors);
        } while (dest === this.floor)

        return dest
    }
    private addPerson(destination: number) {
        const id = Math.floor(Math.random() * 1000)
        this.peopleInside.push(new Person(id, destination))
        this.cell.textContent = this.peopleInside.length.toString()
    }
    public removePerson(): Person | undefined {
        const p = this.peopleInside.shift()
        this.cell.textContent = this.peopleInside.length.toString()
        return p
    }

    public get hasCalledElevator(): boolean {
        return this._hasCalledElevator
    }
    public set hasCalledElevator(called: boolean) {
        this.button.style.background = called ? "green" : "brown"
        this._hasCalledElevator = called
    }
    public getPeople(): Person[] {
        return this.peopleInside
    }

}

export default FloorQueue