import ElevatorSystem from "./ElevatorSystem";

class SimulationEngine {
    private cells: HTMLDivElement[][] = [];
    private system: ElevatorSystem;
    constructor(private config: any) {

    }
    init() {
        const main: HTMLDivElement = document.querySelector<HTMLDivElement>(this.config.mainSelector)!
        const w = this.config.elevators * 3 + 3
        const h = this.config.floors * 3
        main.style.gridTemplateColumns = `repeat(${w}, 30px)`

        let floor = this.config.floors
        let elevators = 0
        for (let i = 0; i < h; i++) {

            let row: HTMLDivElement[] = []
            for (let j = 0; j < w; j++) {
                const el = document.createElement("div") as HTMLDivElement
                el.classList.add("cell")
                row.push(el)
                if (j === 0) {
                    el.style.backgroundColor = "white"
                    if (i % 3 === 1) {
                        el.textContent = (--floor).toString();
                    }

                } else if (j === 1) {
                    el.style.backgroundColor = "white"

                } else if (j === 2) {
                    el.style.backgroundColor = "white"

                } else if (i === h - 1) {
                    el.style.backgroundColor = "white"
                    if (j % 3 === 1) {
                        el.textContent = (++elevators).toString()
                    }
                }

                main.appendChild(el)
            }
            this.cells.push(row)
        }


        this.system = new ElevatorSystem(this.config.elevators, this.cells, this.config)


        const interval = setInterval(() => {
            this.iterate()
        }, 2000)
    }
    iterate() {
        this.system.step()

    }

}


export default SimulationEngine