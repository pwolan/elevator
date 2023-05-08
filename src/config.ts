export interface config {
  mainSelector: string
  elevators: number
  floors: number
  maxVelocity: number
  maxAcceleration: number
  capacity: number

}

const c: config = {
  mainSelector: '#main',
  elevators: 2,
  floors: 6,
  capacity: 5,
  maxAcceleration: 1,
  maxVelocity: 1
}
export default c