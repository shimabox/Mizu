import { JSDOM } from 'jsdom';
import { AtomFactory, Coordinate } from '../js/Atom.js';

// テスト実行前に JSDOM環境を構築
beforeAll(() => {
  const dom = new JSDOM(
    '<!DOCTYPE html><html><body><canvas id="myCanvas"></canvas></body></html>',
    { url: 'http://localhost' }
  );
  global.window = dom.window;
  global.document = window.document;
});

describe('Hクラスのテスト', () => {
  test('水素原子同士が衝突する場合、isHitはtrueを返す', () => {
    const h1 = AtomFactory.factory('H', 100, 100);
    h1.initializeDrawingProperties(new Coordinate(50, 50));

    const h2 = AtomFactory.factory('H', 100, 100);
    h2.initializeDrawingProperties(new Coordinate(62, 62));

    expect(h1.isHit(h2)).toBe(true);
  });

  test('水素原子は結合済みの水素原子と衝突する場合、isHitはfalseを返す', () => {
    const h1 = AtomFactory.factory('H', 100, 100);
    h1.initializeDrawingProperties(new Coordinate(50, 50));

    const h2 = AtomFactory.factory('H', 100, 100);
    h2.initializeDrawingProperties(new Coordinate(62, 62));
    h2.markAsMerged();

    expect(h1.isHit(h2)).toBe(false);
  });

  test('水素原子同士が衝突していない場合、isHitはfalseを返す', () => {
    const h1 = AtomFactory.factory('H', 100, 100);
    h1.initializeDrawingProperties(new Coordinate(50, 50));

    const h2 = AtomFactory.factory('H', 100, 100);
    h2.initializeDrawingProperties(new Coordinate(70, 70));

    expect(h1.isHit(h2.x, h2.y, h2.r)).toBe(false);
  });

  test('水素原子は結合状態か判定可能', () => {
    const h = AtomFactory.factory('H', 100, 100);
    h.markAsMerged(); // 結合済みに変更
    h.initializeDrawingProperties(new Coordinate(50, 50));

    expect(h.isMerged()).toBe(true);
    expect(h.getName()).toBe('H2');
  });

  test('水素原子は結合状態でなければ、isMergedはfalseを返す', () => {
    const h = AtomFactory.factory('H', 100, 100);
    h.initializeDrawingProperties(new Coordinate(50, 50));

    expect(h.isMerged()).toBe(false);
  });
});

describe('Oクラスのテスト', () => {
  test('酸素原子は結合状態の水素原子と衝突した場合、isHitはtrueを返す', () => {
    const o = AtomFactory.factory('O', 100, 100);
    o.initializeDrawingProperties(new Coordinate(62, 62));

    const h = AtomFactory.factory('H', 100, 100);
    h.initializeDrawingProperties(new Coordinate(50, 50));
    h.markAsMerged();

    expect(o.isHit(h)).toBe(true);
  });

  test('酸素原子は未結合状態の水素原子と衝突した場合、isHitはfalseを返す', () => {
    const o = AtomFactory.factory('O', 100, 100);
    o.initializeDrawingProperties(new Coordinate(62, 62));

    const h = AtomFactory.factory('H', 100, 100);
    h.initializeDrawingProperties(new Coordinate(50, 50));

    expect(o.isHit(h)).toBe(false);
  });

  test('酸素原子は水素原子と衝突していない場合、isHitはfalseを返す', () => {
    const o = AtomFactory.factory('O', 100, 100);
    o.initializeDrawingProperties(new Coordinate(50, 50));

    const h = AtomFactory.factory('H', 100, 100);
    h.initializeDrawingProperties(new Coordinate(70, 70));

    expect(o.isHit(h)).toBe(false);
  });

  test('酸素原子は酸素原子と衝突した場合、isHitはfalseを返す', () => {
    const o1 = AtomFactory.factory('O', 100, 100);
    o1.initializeDrawingProperties(new Coordinate(62, 62));

    const o2 = AtomFactory.factory('O', 100, 100);
    o2.initializeDrawingProperties(new Coordinate(50, 50));

    expect(o1.isHit(o2)).toBe(false);
  });
});

describe('H2oクラスのテスト', () => {
  test('水(H2o)は画面外に出ていなければ、isDeletedでfalseを返す', () => {
    const h2o = AtomFactory.factory('H2o', 100, 100);
    h2o.initializeDrawingProperties(new Coordinate(0, 0));
    h2o.updatePosition();

    expect(h2o.isDeleted()).toBe(false);
  });

  test('水(H2o)は画面外に出た場合、isDeletedでtrueを返す', () => {
    const h2o = AtomFactory.factory('H2o', 100, 100);
    h2o.initializeDrawingProperties(new Coordinate(0, 500));
    h2o.updatePosition();

    expect(h2o.isDeleted()).toBe(true);
  });
});
