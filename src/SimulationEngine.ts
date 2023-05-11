import { config } from "./ConfigBuilder";
import ElevatorSystem from "./ElevatorSystem";

class SimulationEngine {
    private cells: HTMLDivElement[][] = [];
    private system: ElevatorSystem;
    private interval: number;
    private autoComingCheckbox: HTMLInputElement;
    private statsEl: HTMLDivElement;
    constructor(private config: config) {

    }
    init() {
        const main: HTMLDivElement = document.querySelector(this.config.mainSelector) as HTMLDivElement
        const w = this.config.elevators * 3 + 3
        const h = this.config.floors * 3
        main.style.gridTemplateColumns = `repeat(${w}, 30px)`

        this.renderCells(main, w, h)


        this.autoComingCheckbox = document.getElementById('auto_coming') as HTMLInputElement
        this.autoComingCheckbox.addEventListener('change', this.handleAutoComing.bind(this))
        const longestWaitTimeEl = document.getElementById('wait_time') as HTMLSpanElement

        this.statsEl = document.getElementById('stats') as HTMLDivElement
        this.statsEl.classList.remove("hidden")
        this.system = new ElevatorSystem(this.config.elevators, this.cells, longestWaitTimeEl, this.autoComingCheckbox.checked, this.config)


        this.interval = setInterval(() => {
            this.iterate()
        }, 1000)
    }

    renderCells(main: HTMLDivElement, w: number, h: number) {
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

                } else if (j === 1 || j === 2) {
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
    }

    iterate() {
        this.system.step()

    }
    handleAutoComing() {
        const val = this.autoComingCheckbox.checked
        this.system.setAutoComing(val)
    }
    stop() {
        clearInterval(this.interval)
        this.autoComingCheckbox.removeEventListener('change', this.handleAutoComing)
        for (const cellsRow of this.cells) {
            for (const cell of cellsRow) {
                cell.remove()
            }
        }
        this.statsEl.classList.add("hidden")
    }

}


export default SimulationEngine