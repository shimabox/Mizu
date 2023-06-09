/**
 * Atom クラス
 */
class Atom {
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
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = 24 * this.getScale() + 'px sans-serif';
    const txtSize = ctx.measureText(this.getName()).width;

    this.x = coordinate.x;
    this.y = coordinate.y;
    this.w = txtSize;
    this.h = txtSize;
    this.r = txtSize / 2;
    this.color = this.getColor();
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
   * @param {{ size: number, x: number, y: number }} props - 描画用プロパティ{ size: 文字の幅, x: x座標, y: y座標 }
   */
  fillText(ctx, name, props) {
    ctx.fillText(name, props.x, props.y);
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
   * @param {Atom} target - 対象Atom
   * @return {boolean} Atomが衝突した場合はtrue、そうでない場合はfalse
   */
  isHit(target) {
    const dx = target.x - this.x; // ターゲットとのx座標の差分を計算
    const dy = target.y - this.y; // ターゲットとのy座標の差分を計算
    const distance = Math.sqrt(dx * dx + dy * dy); // ターゲットとの距離を計算 (ピタゴラスの定理を使用)
    const hitDistance = this.r + target.r; // 当たり判定の距離を計算 (2つのAtomの半径の和)

    return distance < hitDistance; // 距離が当たり判定の距離より小さい場合、衝突していると判定
  }

  /**
   * Atomを描画
   *
   * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
   */
  render(ctx) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 24 * this.getScale() + 'px sans-serif';
    ctx.fillStyle = this.color;
    ctx.shadowColor = '#888';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 1;

    this.fillText(ctx, this.getName(), { size: this.w, x: this.x, y: this.y });
  }
}

/**
 * Hクラスは、水素原子を表現するためのクラスです。
 * Atomクラスを継承し、水素原子固有の振る舞いを提供します。
 *
 * @extends {Atom}
 */
export class H extends Atom {
  /**
   * @type {boolean} 結合済みかどうか
   */
  #isMerged = false;

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
    return this.#isMerged ? this.#mergedName : this.name;
  }

  /**
   * 水素原子の色を取得します。
   * 結合済みの場合、現在の色を返します。
   * それ以外の場合、ランダムな色を返します。
   *
   * @returns {string} Atomの色
   */
  getColor() {
    return this.#isMerged ? this.color : '#' + Math.random().toString(16).slice(-6);
  }

  /**
   * 指定された名前とサイズをもとに、キャンバスのコンテキストにテキストを描画します。
   * 結合済みの場合、"H"に対して、下添え文字"2"を追加して描画します。
   *
   * @param {CanvasRenderingContext2D} ctx - キャンバスのコンテキスト
   * @param {string} name - 描画するテキスト
   * @param {{ size: number, x: number, y: number }} props - 描画用プロパティ{ size: 文字の幅, x: x座標, y: y座標 }
   */
  fillText(ctx, name, props) {
    if (this.#isMerged) {
      ctx.fillText('H', props.x - props.size / 2, props.y);
      ctx.font = 18 * this.getScale() + 'px sans-serif';
      ctx.fillText('2', props.x, props.y + 2);
      return;
    }

    ctx.fillText(name, props.x, props.y);
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
    if (this.#isMerged && !this.#isH2Rendered) {
      // TODO: isH2Renderedでの制御はワークアラウンドっぽいのでなんとかしたい
      this.#isH2Rendered = true;
      this.initializeDrawingProperties(new Coordinate(this.x, this.y));
    }
    super.render(ctx);
  }

  /**
   * 結合済みにする
   */
  markAsMerged() {
    this.#isMerged = true;
  }

  /**
   * 結合済みかどうか
   * @returns {boolean}
   */
  isMerged() {
    return this.#isMerged;
  }

  /**
   * 他のAtomとの当たり判定
   *
   * @param {Atom} target - 対象Atom
   * @return {boolean} Atomが衝突した場合はtrue、そうでない場合はfalse
   */
  isHit(target) {
    // Hじゃない or H2(結合済みのH)であれば何もしないでfalseを返す
    if (!(target instanceof H) || target.isMerged()) {
      return false;
    }
    return super.isHit(target);
  }
}

/**
 * Oクラスは、酸素原子を表現するためのクラスです。
 * Atomクラスを継承し、酸素原子固有の振る舞いを提供します。
 *
 * @extends {Atom}
 */
export class O extends Atom {
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

  /**
   * 他のAtomとの当たり判定
   *
   * @param {Atom} target - 対象Atom
   * @return {boolean} Atomが衝突した場合はtrue、そうでない場合はfalse
   */
  isHit(target) {
    // Hじゃない or H2(結合済みのH)でなければ何もしないでfalseを返す
    if (!(target instanceof H) || !target.isMerged()) {
      return false;
    }
    return super.isHit(target);
  }
}

/**
 * H2o クラスは水分子を表現するクラスです。
 * Atomクラスを継承し、水分子固有の振る舞いを提供します。
 *
 * @extends {Atom}
 */
export class H2o extends Atom {
  /**
   * @type {boolean} 削除済み(画面から見えなくなっている)かどうか
   */
  #isDeleted = false;

  /**
   * 水分子の描画プロパティを初期化
   *
   * @param {Coordinate} coordinate - 座標
   */
  initializeDrawingProperties(coordinate) {
    const w = (Math.random() * 10 + 18) * this.getScale();
    this.x = coordinate.x;
    this.y = coordinate.y;
    this.w = w;
    this.h = w;
  }

  /**
   * 水分子を描画
   *
   * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
   */
  render(ctx) {
    const offset = this.w * 0.4;
    const gx = this.x - offset;
    const gy = this.y - offset;
    const gr = this.w / 2 + offset;
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    grad.addColorStop(1, 'rgba(0, 127, 255, 1)');

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.w / 2, 0, Math.PI * 2, true);
    ctx.fillStyle = 'rgba(0, 127, 255, 0.6)';
    ctx.shadowColor = '#007fff';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.closePath();
  }

  /**
   * 水分子の位置を更新
   */
  updatePosition() {
    const dx = Math.random() * 5;
    this.x += Math.cos((this.y + dx) / 100);
    this.y += this.w * 0.1;

    if (this.y >= this.sh) {
      this.#isDeleted = true;
    }
  }

  /**
   * 削除済み(画面から見えなくなっている)かどうか
   * @returns {boolean}
   */
  isDeleted() {
    return this.#isDeleted;
  }
}

export class AtomFactory {
  /**
   * Atomインスタンスを生成
   *
   * @param {string} name - インスタンス名
   * @param {number} width - 幅
   * @param {number} height - 高さ
   */
  static factory(name, width, height) {
    switch (name) {
      case 'H':
        return new H(width, height);
      case 'O':
        return new O(width, height);
      case 'H2o':
        return new H2o(width, height);
    }
  }
}

/**
 * 座標
 */
export class Coordinate {
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
