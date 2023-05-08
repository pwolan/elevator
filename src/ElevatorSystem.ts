import { config } from "./config";
import Elevator from "./Elevator";
import FloorQueue from "./FloorQueue";

class ElevatorSystem {
    private elevators: Elevator[] = [];
    private waitingFloors: FloorQueue[] = [];
    constructor(elevatorsCount: number, cells: HTMLDivElement[][], private config: config) {
        for (let i = 1; i <= elevatorsCount; i++) {
            this.elevators.push(new Elevator(i, cells, config, this.waitingFloors))
        }
        for (let i = 0; i < config.floors; i++) {
            this.waitingFloors.push(new FloorQueue(i, cells, config))
        }
        // this.waitingFloors[3].step()
    }
    step() {




        // ludzie przychodza i wołają windę


        for (const queue of this.waitingFloors) {
            // queue.step()
            if (queue.hasCalledElevator) {
                this.callElevator(queue)
            }
        }


        // winda jedzie sobie
        for (const elevator of this.elevators) {
            elevator.step()
        }







    }
    private callElevator(queue: FloorQueue) {
        // trzeba ulepszyć isFull, bo mogą wysiąść w międzyczasie

        // najbliższy który jedzie w dobrą stronę i może zmieścić kogoś
        const notFullElevator = this.elevators
            .filter(e => !e.isFull())

        const sortedElevator = notFullElevator.sort((a, b) => {
            const a_distance = Math.abs(a.currFloor - queue.floor)
            const b_distance = Math.abs(b.currFloor - queue.floor)

            return a_distance - b_distance
        })
        let elevator = sortedElevator
            .find(e => {
                const distance = e.currFloor - queue.floor
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
        // console.log(elevator);
        elevator.call(queue)
    }
}

export default ElevatorSystem