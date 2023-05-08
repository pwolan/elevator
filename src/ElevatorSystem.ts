import { config } from "./config";
import Elevator from "./Elevator";
import FloorQueue from "./FloorQueue";

class ElevatorSystem {
    private elevators: Elevator[] = [];
    private floorQueues: FloorQueue[] = [];
    private waitingFloors: FloorQueue[] = [];
    constructor(elevatorsCount: number, cells: HTMLDivElement[][], private config: config) {
        for (let i = 1; i <= elevatorsCount; i++) {
            this.elevators.push(new Elevator(i, cells, config, this.floorQueues))
        }
        for (let i = 0; i < config.floors; i++) {
            this.floorQueues.push(new FloorQueue(i, cells, config))
        }
    }
    step() {
        //TODO max czas oczekiwania

        // ludzie przychodza i wołają windę

        for (const queue of this.floorQueues) {
            queue.step()
            if (queue.hasCalledElevator && !this.waitingFloors.includes(queue)) {
                this.waitingFloors.push(queue)
            }
        }
        console.log(this.waitingFloors.map(f => f.floor));
        for (const queue of this.waitingFloors) {
            this.callElevator(queue)
        }

        // winda jedzie sobie
        for (const elevator of this.elevators) {
            elevator.step()
        }



    }
    private callElevator(queue: FloorQueue) {
        // trzeba ulepszyć isFull, bo mogą wysiąść w międzyczasie

        // gdy wszystkie pełne poczekaj 



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
        let elevator = sortedElevator
            .find(e => {
                if (e.direction === "none") {
                    return true
                }
                const distance = e.currPosition - queue.floor * 3
                if (distance === 0) {
                    return true
                } else if (distance > 0) {
                    return e.direction === "down"
                } else if (distance < 0) {
                    return e.direction === "up"
                }
            })
        if (!elevator) {
            elevator = sortedElevator[0]
        }
        this.waitingFloors.shift()
        elevator.call(queue)
    }
}

export default ElevatorSystem