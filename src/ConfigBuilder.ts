export interface config {
  mainSelector: string
  elevators: number
  floors: number
  capacity: number
}

class ConfigBuilder {
  private floorsInput: HTMLInputElement;
  private elevatorsInput: HTMLInputElement;
  private capacityInput: HTMLInputElement;
  private floorsError: HTMLDivElement;
  private elevatorError: HTMLDivElement;
  private capacityError: HTMLDivElement;

  constructor() {
    this.floorsInput = document.getElementById('floors') as HTMLInputElement
    this.elevatorsInput = document.getElementById('elevators') as HTMLInputElement
    this.capacityInput = document.getElementById('capacity') as HTMLInputElement
    this.floorsError = document.getElementById('floors_error') as HTMLParagraphElement
    this.elevatorError = document.getElementById('elevators_error') as HTMLParagraphElement
    this.capacityError = document.getElementById('capacity_error') as HTMLParagraphElement

    this.floorsError.classList.add("hidden")
    this.elevatorError.classList.add("hidden")
    this.capacityError.classList.add("hidden")
  }
  submitConfig(): config | null {
    const elevators = this.elevatorsInput.valueAsNumber
    const floors = this.floorsInput.valueAsNumber
    const capacity = this.capacityInput.valueAsNumber

    this.renderErrors()

    const isNotValid = isNaN(elevators) || isNaN(floors) || isNaN(capacity)
    if (isNotValid) {
      return null
    }
    const c: config = {
      mainSelector: '#main',
      elevators,
      floors: floors + 1,
      capacity,
    }
    return c
  }
  renderErrors() {
    const elevators = this.elevatorsInput.valueAsNumber
    const floors = this.floorsInput.valueAsNumber
    const capacity = this.capacityInput.valueAsNumber

    if (isNaN(elevators)) {
      this.elevatorError.classList.remove("hidden")
      this.elevatorsInput.classList.add("border-red-500")
    } else {
      this.elevatorError.classList.add("hidden")
      this.elevatorsInput.classList.remove("border-red-500")
    }

    if (isNaN(floors)) {
      this.floorsError.classList.remove("hidden")
      this.floorsInput.classList.add("border-red-500")
    } else {
      this.floorsError.classList.add("hidden")
      this.floorsInput.classList.remove("border-red-500")
    }

    if (isNaN(capacity)) {
      this.capacityError.classList.remove("hidden")
      this.capacityInput.classList.add("border-red-500")
    } else {
      this.capacityError.classList.add("hidden")
      this.capacityInput.classList.remove("border-red-500")
    }
  }
}

function getConfig(): config {

  const floorsBtn = document.getElementById('floors') as HTMLInputElement
  const elevatorsBtn = document.getElementById('elevators') as HTMLInputElement
  const capacityBtn = document.getElementById('capacity') as HTMLInputElement

  // if()

  const c: config = {
    mainSelector: '#main',
    elevators: elevatorsBtn.valueAsNumber,
    floors: floorsBtn.valueAsNumber + 1,
    capacity: capacityBtn.valueAsNumber,
  }
  return c
}

export default ConfigBuilder
