import { config } from "./ConfigBuilder";
import Elevator from "./Elevator";
import FloorQueue from "./FloorQueue";

class ElevatorSystem {
    private elevators: Elevator[] = [];
    private floorQueues: FloorQueue[] = [];
    private waitingFloors: FloorQueue[] = [];
    private autoComing: boolean;
    private longestWaitTimeEl: HTMLSpanElement;
    private longestWaitTime: number;
    constructor(elevatorsCount: number, cells: HTMLDivElement[][], longestWaitTimeEl: HTMLSpanElement, autoComing: boolean, cellsOnTheLeft: number, private config: config) {
        for (let i = 1; i <= elevatorsCount; i++) {
            this.elevators.push(new Elevator(i, cells, config, this.floorQueues, cellsOnTheLeft))
        }
        for (let i = 0; i < config.floors; i++) {
            this.floorQueues.push(new FloorQueue(i, cells, config))
        }
        this.autoComing = autoComing
        this.longestWaitTimeEl = longestWaitTimeEl
        this.longestWaitTime = 0;
        this.longestWaitTimeEl.textContent = this.longestWaitTime.toString()
    }
    step() {

        for (const queue of this.floorQueues) {
            if (this.autoComing) {
                queue.step()
            }
            if (queue.hasCalledElevator && !this.waitingFloors.includes(queue)) {
                this.waitingFloors.push(queue)
            }
        }
        for (const queue of this.waitingFloors) {
            this.callElevator(queue)
        }

        // elevator is running
        for (const elevator of this.elevators) {
            elevator.step()
        }

        // increment waiting time
        for (const queue of this.floorQueues) {
            for (const person of queue.getPeople()) {
                person.incrementTime()
            }
        }

        //calculate longest waiting time
        const times = this.floorQueues.flatMap(q => q.getPeople())
            .map(p => p.getWaitingTime())
        if (times.length > 0) {
            const maxT = Math.max(...times)
            if (maxT > this.longestWaitTime) {
                this.longestWaitTime = maxT
                this.longestWaitTimeEl.textContent = maxT.toString()
            }
        }
    }
    private callElevator(queue: FloorQueue) {

        const notFullElevator = this.elevators
            .filter(e => !e.isFull())

        // all elevators are full
        if (notFullElevator.length === 0) {
            return
        }


        // first use empty elevators

        const sortedElevator = notFullElevator.sort((a, b) => {
            const aDistance = Math.abs(a.currFloor - queue.floor) / this.config.floors
            const bDistance = Math.abs(b.currFloor - queue.floor) / this.config.floors

            const aSpace = a.getNumberOfPeopleInside() / this.config.capacity
            const bSpace = b.getNumberOfPeopleInside() / this.config.capacity

            const aDirection = a.getDirectionMetrics(aDistance)
            const bDirection = b.getDirectionMetrics(bDistance)

            const aMetrics = aDistance + aSpace + aDirection
            const bMetrics = bDistance + bSpace + bDirection

            return aMetrics - bMetrics
        })

        let elevator = sortedElevator[0]
        this.waitingFloors.shift()
        elevator.call(queue)
    }
    public setAutoComing(val: boolean) {
        this.autoComing = val
    }
}

export default ElevatorSystem