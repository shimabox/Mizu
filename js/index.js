import { MizuSimulator } from './Mizu.js';

window.addEventListener('DOMContentLoaded', (e) => {
  const simulator = new MizuSimulator();
  const scale = simulator.getScale();
  simulator.init(30 * scale, 50 * scale);
  const loop = () => {
    simulator.renderFrame();
    requestAnimationFrame(loop);
  };
  loop();
});
