import { JSDOM } from 'jsdom';
import { AtomFactory, Coordinate } from '../js/Atom.js';

// テスト実行前に JSDOM環境を構築
beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body><canvas id="myCanvas"></canvas></body></html>', { url: 'http://localhost' });
  global.window = dom.window;
  global.document = window.document;
});

describe('Hクラスのテスト', () => {
  test('水素原子同士が衝突する場合、isHitはtrueを返す', () => {
    const h1 = AtomFactory.factory('H', 100, 100);
    h1.initializeDrawingProperties(new Coordinate(50, 50));

    const h2 = AtomFactory.factory('H', 100, 100);
    h2.initializeDrawingProperties(new Coordinate(62, 62));

    expect(h1.isHit(h2.x, h2.y, h2.r)).toBe(true);
  });

  test('水素原子同士が衝突していない場合、isHitはfalseを返す', () => {
    const h1 = AtomFactory.factory('H', 100, 100);
    h1.initializeDrawingProperties(new Coordinate(50, 50));

    const h2 = AtomFactory.factory('H', 100, 100);
    h2.initializeDrawingProperties(new Coordinate(62, 63));

    expect(h1.isHit(h2.x, h2.y, h2.r)).toBe(false);
  });
});