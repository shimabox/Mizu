import { JSDOM } from 'jsdom';
import { MizuSimulator } from '../js/Mizu.js';
import { H, O, H2o, Coordinate } from '../js/Atom.js';

// テスト実行前に JSDOM環境を構築
beforeAll(() => {
  const dom = new JSDOM(
    '<!DOCTYPE html><html><body><canvas id="myCanvas"></canvas></body></html>',
    { url: 'http://localhost' }
  );
  global.window = dom.window;
  global.document = window.document;
});

describe('MizuSimulatorクラスのテスト', () => {
  let simulator;

  beforeEach(() => {
    simulator = new MizuSimulator();
  });

  test('初期状態の確認', () => {
    expect(simulator.h).toEqual([]);
    expect(simulator.o).toEqual([]);
    expect(simulator.h2o).toEqual([]);
  });

  test('初期化出来る', () => {
    simulator.init(1, 1);

    expect(simulator.h.length).toEqual(1);
    expect(simulator.o.length).toEqual(1);
    expect(simulator.h2o.length).toEqual(0);
  });

  test('Atomの生成が可能', () => {
    const h = simulator.createAtom('H');
    expect(h).toBeInstanceOf(H);

    const o = simulator.createAtom('O');
    expect(o).toBeInstanceOf(O);

    const h2o = simulator.createAtom('H2o', new Coordinate(50, 50));
    expect(h2o).toBeInstanceOf(H2o);

    // 不明なAtom名が渡されたらエラーが発生すること
    expect(() => simulator.createAtom('X')).toThrow();
  });
});
