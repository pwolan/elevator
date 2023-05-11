import ConfigBuilder from './ConfigBuilder'
import SimulationEngine from './SimulationEngine'
import './style.css'

const startBtn = document.getElementById('start') as HTMLButtonElement
const configBuilder = new ConfigBuilder()
let engine: SimulationEngine;

const handleStart = () => {
    const config = configBuilder.submitConfig()
    if (config === null) {
        return
    }
    if (engine) {
        engine.stop()
    } else {
        startBtn.textContent = "restart"
    }

    engine = new SimulationEngine(config)
    engine.init()
}

startBtn.addEventListener('click', handleStart)



