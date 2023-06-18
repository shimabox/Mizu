import { AtomFactory, Coordinate } from './Atom.js';

/**
 * MizuSimulator クラス
 * 水(H2o)のシミュレーションを管理および制御するためのクラスです。
 */
export class MizuSimulator {
  /**
   * @type {H[]} 水素原子の配列
   */
  h = [];

  /**
   * @type {O[]} 酸素原子の配列
   */
  o = [];

  /**
   * @type {H2o[]} 水分子の配列
   */
  h2o = [];

  /**
   * @type {number} キャンバスの幅
   */
  cw;

  /**
   * @type {number} キャンバスの高さ
   */
  ch;

  /**
   * @type {CanvasRenderingContext2D} キャンバスの描画コンテキスト
   */
  ctx;

  /**
   * @type {HTMLCanvasElement} ダブルバッファリング用のオフスクリーンキャンバス
   */
  bufferCanvas;

  /**
   * @type {CanvasRenderingContext2D} オフスクリーンキャンバスの描画コンテキスト
   */
  bufferCtx;

  /**
   * MizuSimulatorのインスタンスを生成
   */
  constructor() {
    // canvas
    const c = document.querySelector('#myCanvas');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    this.cw = c.width;
    this.ch = c.height;
    this.ctx = c.getContext('2d');

    // ダブルバッファリング
    this.bufferCanvas = document.createElement('canvas');
    this.bufferCanvas.width = this.cw;
    this.bufferCanvas.height = this.ch;
    this.bufferCtx = this.bufferCanvas.getContext('2d');
  }

  /**
   * Atomの初期化
   *
   * @param {number} hLength - 初期化する水素Atomの数
   * @param {number} oLength - 初期化する酸素Atomの数
   */
  init(hLength, oLength) {
    for (let i = 0; i < hLength; i++) {
      this.h.push(this.createAtom('H'));
    }
    for (let i = 0; i < oLength; i++) {
      this.o.push(this.createAtom('O'));
    }
  }

  /**
   * 1フレームずつ描画します。
   * Atomの位置の更新と衝突判定を行い、キャンバスにAtomを描画します。
   */
  renderFrame() {
    this.bufferCtx.fillStyle = '#fff';
    this.bufferCtx.fillRect(0, 0, this.cw, this.ch);

    this.renderH(this.h);
    this.renderO(this.o, this.h, this.h2o);
    this.renderH2o(this.h2o);

    // オフスクリーンキャンバスからオンスクリーンキャンバスに描画
    this.ctx.drawImage(this.bufferCanvas, 0, 0);
  }

  /**
   * 水素原子の描画処理を行う
   *
   * @param {H[]} atoms - 水素原子の配列
   */
  renderH(atoms) {
    for (let i = 0; i < atoms.length; i++) {
      const _h = atoms[i];
      _h.updatePosition();
      _h.render(this.bufferCtx);

      if (_h.isMerged()) {
        continue;
      }

      for (let j = i + 1; j < atoms.length; j++) {
        const target = atoms[j];
        if (target.isMerged()) {
          continue;
        }
        if (_h.isHit(target.x, target.y, target.r)) {
          _h.markAsMerged();
          _h.render(this.bufferCtx);

          // 衝突した水素原子は入れ替える
          atoms[j] = this.createAtom('H');

          break;
        }
      }
    }
  }

  /**
   * 酸素原子の描画処理を行う
   *
   * @param {O[]} atoms - 酸素原子の配列
   * @param {H[]} hAtoms - 水素原子の配列
   * @param {H2o[]} h2oAtoms - 水分子の配列
   */
  renderO(atoms, hAtoms, h2oAtoms) {
    for (const _o of atoms) {
      _o.updatePosition();
      _o.render(this.bufferCtx);

      for (const _h2 of hAtoms) {
        if (!_h2.isMerged()) {
          continue;
        }

        if (_o.isHit(_h2.x, _h2.y, _h2.r)) {
          // 水になった酸素原子は詰め替える
          const oIndex = atoms.indexOf(_o);
          if (oIndex >= 0) {
            // ループ中にすでに消えているケースがある
            atoms[oIndex] = this.createAtom('O');
          }

          // 水になった水素原子は詰め替える
          const h2Index = hAtoms.indexOf(_h2);
          if (h2Index >= 0) {
            // ループ中にすでに消えているケースがある
            hAtoms[h2Index] = this.createAtom('H');
          }
          h2oAtoms.push(this.createAtom('H2o', new Coordinate(_o.x, _o.y)));
        }
      }
    }
  }

  /**
   * 水分子の描画処理を行う
   *
   * @param {H2o[]} atoms - 水分子の配列
   */
  renderH2o(atoms) {
    for (let i = atoms.length - 1; i >= 0; i--) {
      const _h2o = atoms[i];
      _h2o.updatePosition();

      if (_h2o.isDeleted()) {
        atoms.splice(i, 1);
        continue;
      }

      _h2o.render(this.bufferCtx);
    }
  }

  /**
   * Atomオブジェクトを生成
   *
   * @param {string} atomName - 生成するAtomの種類（'H', 'O', 'H2o'）
   * @param {Coordinate} [coordinate] - 座標(オプション)。'H2o'の場合、発生した場所の座標オブジェクトが渡ってきます。
   * @returns {H|O|H2o} 生成されたAtomオブジェクト
   */
  createAtom(atomName, coordinate) {
    let atom;
    switch (atomName) {
      case 'H':
      case 'O':
        atom = AtomFactory.factory(atomName, this.cw, this.ch);
        break;
      case 'H2o':
        atom = AtomFactory.factory(atomName, this.cw, this.ch);
        atom.initializeDrawingProperties(coordinate);
        return atom;
    }

    atom.initializeDrawingProperties(
      new Coordinate(this.cw * Math.random(), this.ch * Math.random())
    );
    return atom;
  }

  /**
   * 画面サイズに基づいて適切なスケール係数を返します。
   * これにより、デバイスの画面サイズに応じて適切な数の原子が表示されます。
   *
   * @returns {number} スケール係数
   */
  getScale() {
    if (this.cw < 768) {
      return 1.0;
    }
    if (this.cw >= 768 && this.cw < 1280) {
      return 1.2;
    }

    return 1.5;
  }
}
