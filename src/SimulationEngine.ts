import { config } from "./ConfigBuilder";
import ElevatorSystem from "./ElevatorSystem";

class SimulationEngine {
    private cells: HTMLDivElement[][] = [];
    private system: ElevatorSystem;
    private interval: number;
    private autoComingCheckbox: HTMLInputElement;
    private statsEl: HTMLDivElement;
    private cellsOnTheLeft: number;
    constructor(private config: config) {
        this.cellsOnTheLeft = 3

    }
    init() {
        const main: HTMLDivElement = document.querySelector(this.config.mainSelector) as HTMLDivElement
        const w = this.config.elevators * 3 + this.cellsOnTheLeft
        const h = this.config.floors * 3
        main.style.gridTemplateColumns = `repeat(${w}, 30px)`

        this.renderCells(main, w, h)


        this.autoComingCheckbox = document.getElementById('auto_coming') as HTMLInputElement
        this.autoComingCheckbox.addEventListener('change', this.handleAutoComing.bind(this))
        const longestWaitTimeEl = document.getElementById('wait_time') as HTMLSpanElement

        this.statsEl = document.getElementById('stats') as HTMLDivElement
        this.statsEl.classList.remove("hidden")
        this.system = new ElevatorSystem(this.config.elevators, this.cells, longestWaitTimeEl, this.autoComingCheckbox.checked, this.cellsOnTheLeft, this.config)


        this.interval = setInterval(() => {
            this.iterate()
        }, 1000)
    }

    renderCells(main: HTMLDivElement, w: number, h: number) {
        for (let i = 0; i < h; i++) {
            let row: HTMLDivElement[] = []
            for (let j = 0; j < w; j++) {
                const el = document.createElement("div") as HTMLDivElement
                if (j < this.cellsOnTheLeft || i === h - 1) {
                    el.classList.add("cell_white")
                } else {
                    el.classList.add("cell")

                }
                row.push(el)
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