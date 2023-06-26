import { MizuSimulator } from './Mizu.js';
import { Measurement } from './Measurement.js';

const query = window.location.search;
const urlParams = new URLSearchParams(query);
const isMeasureMode = urlParams.get('m') === '1';

window.addEventListener('DOMContentLoaded', (e) => {
  const simulator = new MizuSimulator();
  const scale = simulator.getScale();
  simulator.init(30 * scale, 50 * scale);
  const loop = () => {
    if (isMeasureMode) {
      Measurement.factory()
        .measure(() => simulator.renderFrame())
        .add(`H: ${simulator.h.length}`)
        .add(`O: ${simulator.o.length}`)
        .add(`H2o: ${simulator.h2o.length}`)
        .render();
    } else {
      simulator.renderFrame();
    }
    requestAnimationFrame(loop);
  };
  loop();
});
