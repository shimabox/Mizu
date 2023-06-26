export class Measurement {
  /**
   * @type {HTMLElement}
   */
  static #measurement;

  /**
   * @type {string[]}
   */
  #values = [];

  constructor() {
    this.measurement = document.createElement('div');
    this.measurement.style.position = 'absolute';
    this.measurement.style.top = '0px';
    this.measurement.style.color = 'aqua';
    this.measurement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.measurement.style.padding = '3px 5px';

    document.body.appendChild(this.measurement);
  }

  /**
   * @returns {Measurement}
   */
  static factory() {
    if (!this.#measurement) {
      this.#measurement = new Measurement();
    }
    return this.#measurement;
  }

  /**
   * @param {Function} func
   * @param {string} label
   * @returns {Measurement}
   */
  measure(func, label) {
    if (typeof func !== 'function') {
      throw new Error('Argument must be a function.');
    }
    const start = performance.now();
    func();
    const end = performance.now();
    const time = (end - start).toPrecision(4);
    this.add(`${label}${time}ms`);
    return this;
  }

  /**
   * @param {string} val
   * @returns {Measurement}
   */
  add(val) {
    this.#values.push(val);
    return this;
  }

  render() {
    this.measurement.innerText = this.#values.join('\n');
    this.#values.length = 0;
  }
}
