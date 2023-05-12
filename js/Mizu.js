/**
 * Atom クラス
 */
class Atom {
  /**
   * @type {CanvasRenderingContext2D} 描画コンテキスト
   */
  ctx;

  /**
   * @type {number} x座標
   */
  x = 0;

  /**
   * @type {number} y座標
   */
  y = 0;

  /**
   * @type {number} 横幅
   */
  w = 0;

  /**
   * @type {number} 縦幅
   */
  h = 0;

  /**
   * @type {number} 半径
   */
  r = 0;

  /**
   * @type {string} 色
   */
  color = '';

  /**
   * @type {HTMLImageElement} 画像要素
   */
  img;

  /**
   * @type {string} 名前
   */
  name = '';

  /**
   * @type {number} x軸の速度
   */
  #vx = 0;

  /**
   * @type {number} y軸の速度
   */
  #vy = 0;

  /**
   * Atom クラスのインスタンスを生成
   *
   * @param {number} sw - キャンバスの幅
   * @param {number} sh - キャンバスの高さ
   */
  constructor(sw, sh) {
    this.sw = sw;
    this.sh = sh;
  }

  /**
   * Atomの描画プロパティを初期化
   *
   * @param {Coordinate} coordinate - 座標
   */
  initializeDrawingProperties(coordinate) {
    const name = this.getName();
    const color = this.getColor();
    const canvas = document.createElement('canvas');

    const ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 24 * this.getScale() + 'px Arial';
    ctx.fillStyle = color;
    ctx.shadowColor = '#888';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 5;

    const txtSize = ctx.measureText(name).width;
    this.fillText(ctx, name, txtSize);

    const img = document.createElement('img');
    img.src = canvas.toDataURL();

    this.ctx = ctx;
    this.x = coordinate.x;
    this.y = coordinate.y;
    this.w = txtSize;
    this.h = txtSize;
    this.r = txtSize / 2;
    this.color = color;
    this.img = img;
  }

  /**
   * 名前を取得
   *
   * @return {string} Atomの名前
   */
  getName() {
    return this.name;
  }

  /**
   * 色を取得
   *
   * @return {string} Atomの色
   */
  getColor() {
    return '#' + Math.random().toString(16).slice(-6);
  }

  /**
   * 画面サイズに基づいて適切なスケール係数を返します
   *
   * @returns {number} スケール係数
   */
  getScale() {
    if (this.sw < 768) {
      return 1.0;
    }

    return 1.2;
  }

  /**
   * テキストを描画
   *
   * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
   * @param {string} name - 描画するテキスト
   * @param {number} size - テキストのサイズ
   */
  fillText(ctx, name, size) {
    ctx.fillText(name, size, size);
  }

  /**
   * Atomの位置を更新
   */
  updatePosition() {
    const { w, h, sw, sh } = this;
    const randomAngle = 2 * Math.PI * Math.random();
    const speedFactor = 0.075;

    this.#vx += speedFactor * Math.cos(randomAngle);
    this.#vy += speedFactor * Math.sin(randomAngle);

    // 速度を最大値に制限する
    const maxSpeed = 1.05;
    const currentSpeed = Math.sqrt(this.#vx * this.#vx + this.#vy * this.#vy);
    if (currentSpeed > maxSpeed) {
      this.#vx = (this.#vx / currentSpeed) * maxSpeed;
      this.#vy = (this.#vy / currentSpeed) * maxSpeed;
    }

    this.x += this.#vx;
    this.y += this.#vy;

    if (this.x > sw + w / 2) {
      // x座標が画面の右端を超えた場合
      this.x = -(w / 2); // 左端に戻す
    }
    if (this.x + w < 0) {
      // x座標が画面の左端を超えた場合
      this.x = sw + w / 2; // 右端に戻す
    }
    if (this.y > sh + h / 2) {
      // y座標が画面の下端を超えた場合
      this.y = -(h / 2); // 上端に戻す
    }
    if (this.y + h < 0) {
      // y座標が画面の上端を超えた場合
      this.y = sh + h / 2; // 下端に戻す
    }
  }

  /**
   * 他のAtomとの当たり判定
   *
   * @param {number} targetX - 対象AtomのX座標
   * @param {number} targetY - 対象AtomのY座標
   * @param {number} targetR - 対象Atomの半径
   * @return {boolean} Atomが衝突した場合はtrue、そうでない場合はfalse
   */
  isHit(targetX, targetY, targetR) {
    const dx = targetX - this.x; // ターゲットとのx座標の差分を計算
    const dy = targetY - this.y; // ターゲットとのy座標の差分を計算
    const distance = Math.sqrt(dx * dx + dy * dy); // ターゲットとの距離を計算 (ピタゴラスの定理を使用)
    const hitDistance = this.r + targetR; // 当たり判定の距離を計算 (2つのAtomの半径の和)

    return distance < hitDistance; // 距離が当たり判定の距離より小さい場合、衝突していると判定
  }

  /**
   * Atomを描画
   *
   * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
   */
  render(ctx) {
    ctx.drawImage(this.img, this.x, this.y);
  }

  /**
   * Atomの描画を消去
   */
  clear() {
    this.ctx.clearRect(this.x, this.y, this.w, this.h);
  }
}

/**
 * Hクラスは、水素原子を表現するためのクラスです。
 * Atomクラスを継承し、水素原子固有の振る舞いを提供します。
 *
 * @extends {Atom}
 */
class H extends Atom {
  /**
   * @type {boolean} 結合済みかどうか
   */
  isMerged = false;

  /**
   * @type {string} 結合後の名前
   */
  #mergedName = '';

  /**
   * @type {boolean} 結合後の状態で描画済みかどうか
   */
  #isH2Rendered = false;

  /**
   * H クラスのインスタンスを生成
   *
   * @param {number} sw - キャンバスの幅
   * @param {number} sh - キャンバスの高さ
   */
  constructor(sw, sh) {
    super(sw, sh);

    this.name = 'H';
    this.#mergedName = 'H2';
    this.#isH2Rendered = false;
  }

  /**
   * 水素原子の名前を取得します。
   * 通常の状態では 'H' を返し、結合済みの状態では 'H2' を返します。
   *
   * @returns {string} 水素原子の名前
   */
  getName() {
    return this.isMerged ? this.#mergedName : this.name;
  }

  /**
   * 水素原子の色を取得します。
   * 結合済みの場合、現在の色を返します。
   * それ以外の場合、ランダムな色を返します。
   *
   * @returns {string} Atomの色
   */
  getColor() {
    return this.isMerged ? this.color : '#' + Math.random().toString(16).slice(-6);
  }

  /**
   * 指定された名前とサイズをもとに、キャンバスのコンテキストにテキストを描画します。
   * 結合済みの場合、"H"に対して、下添え文字"2"を追加して描画します。
   *
   * @param {CanvasRenderingContext2D} ctx - キャンバスのコンテキスト
   * @param {string} name - 描画するテキスト
   * @param {number} size - テキストのサイズ
   */
  fillText(ctx, name, size) {
    if (this.isMerged) {
      ctx.fillText('H', size / 2, size / 2);
      ctx.font = 18 * this.getScale() + 'px Arial';
      ctx.fillText('2', size, Math.floor(size * (13 / 24)));
      return;
    }

    ctx.fillText(name, size, size);
  }

  /**
   * 水素原子を描画します。
   * isMerged プロパティが true の場合、H2 として描画されます。
   * H2 として描画されたら、isH2Rendered プロパティをtrueとします。
   * (isH2Rendered プロパティをtrueとするのは、isMergedがtrueのときに描画の初期化を防ぐためです)
   *
   * @param {CanvasRenderingContext2D} ctx - キャンバスの 2D 描画コンテキスト
   */
  render(ctx) {
    if (this.isMerged && !this.#isH2Rendered) {
      // TODO: isH2Renderedでの制御はワークアラウンドっぽいのでなんとかしたい
      this.#isH2Rendered = true;
      this.clear();
      this.initializeDrawingProperties(new Coordinate(this.x, this.y));
    }
    super.render(ctx);
  }
}

/**
 * Oクラスは、酸素原子を表現するためのクラスです。
 * Atomクラスを継承し、酸素原子固有の振る舞いを提供します。
 *
 * @extends {Atom}
 */
class O extends Atom {
  /**
   * Oクラスのインスタンスを生成
   *
   * @param {number} sw - キャンバスの幅
   * @param {number} sh - キャンバスの高さ
   */
  constructor(sw, sh) {
    super(sw, sh);
    this.name = 'O';
  }
}

/**
 * H2o クラスは水分子を表現するクラスです。
 * Atomクラスを継承し、水分子固有の振る舞いを提供します。
 *
 * @extends {Atom}
 */
class H2o extends Atom {
  /**
   * @type {boolean} 削除済み(画面から見えなくなっている)かどうか
   */
  isDeleted = false;

  /**
   * 水分子の描画プロパティを初期化
   *
   * @param {Coordinate} coordinate - 座標
   */
  initializeDrawingProperties(coordinate) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const color = '#007fff';
    const w = (Math.random() * 10 + 18) * this.getScale();
    const offset = w * 0.4;
    const gx = w / 2 - offset;
    const gy = w / 2 - offset;
    const gr = w / 2 + offset;
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);

    ctx.arc(w / 2, w / 2, w / 2, 0, Math.PI * 2, true);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.6;
    ctx.shadowColor = '#007fff';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    grad.addColorStop(1, 'rgba(0, 127, 255, 1)');
    ctx.fillStyle = grad;
    ctx.fill();

    const img = document.createElement('img');
    img.src = canvas.toDataURL();

    this.ctx = ctx;
    this.x = coordinate.x;
    this.y = coordinate.y;
    this.w = this.h = w;
    this.color = color;
    this.img = img;
  }

  /**
   * 水分子の位置を更新
   */
  updatePosition() {
    const dx = Math.random() * 5;
    this.x += Math.cos((this.y + dx) / 100);
    this.y += this.w * 0.1;

    if (this.y >= this.sh) {
      this.isDeleted = true;
    }
  }

  /**
   * 水分子を描画
   *
   * @param {CanvasRenderingContext2D} ctx - キャンバスのコンテキスト
   */
  render(ctx) {
    if (this.isDeleted) {
      return;
    }
    ctx.drawImage(this.img, this.x, this.y);
  }
}

/**
 * 座標
 */
class Coordinate {
  /**
   * @type {number} x座標
   */
  x = 0;

  /**
   * @type {number} y座標
   */
  y = 0;

  /**
   * インスタンスを生成
   *
   * @param {number} x - x座標
   * @param {number} y - y座標
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

/**
 * MizuSimulator クラス
 * 水(H2o)のシミュレーションを管理および制御するためのクラスです。
 */
class MizuSimulator {
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

      if (_h.isMerged) {
        continue;
      }

      for (let j = i + 1; j < atoms.length; j++) {
        const target = atoms[j];
        if (target.isMerged) {
          continue;
        }
        if (_h.isHit(target.x, target.y, target.r)) {
          _h.isMerged = true;
          _h.render(this.bufferCtx);

          // 衝突した水素原子は入れ替える
          target.clear();
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
        if (!_h2.isMerged) {
          continue;
        }

        if (_o.isHit(_h2.x, _h2.y, _h2.r)) {
          // 水になった酸素原子は詰め替える
          const oIndex = atoms.indexOf(_o);
          if (oIndex >= 0) {
            // ループ中にすでに消えているケースがある
            atoms[oIndex].clear();
            atoms[oIndex] = this.createAtom('O');
          }

          // 水になった水素原子は詰め替える
          const h2Index = hAtoms.indexOf(_h2);
          if (h2Index >= 0) {
            // ループ中にすでに消えているケースがある
            hAtoms[h2Index].clear();
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
      _h2o.render(this.bufferCtx);

      if (_h2o.isDeleted) {
        _h2o.clear();
        atoms.splice(i, 1);
      }
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
        atom = new H(this.cw, this.ch);
        break;
      case 'O':
        atom = new O(this.cw, this.ch);
        break;
      case 'H2o':
        atom = new H2o(this.cw, this.ch);
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
