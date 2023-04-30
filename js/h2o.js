setTimeout(function () {
    //----------
    // 継承用
    //----------
    var extend = function _extend(parent, child) {
        var i,
            toStr = Object.prototype.toString,
            astr = "[object Array]",
            child = child || {};

        for (i in parent) {
            var p = parent[i],
                type = typeof p;

            //objectは再帰
            var __extend = function () {
                if (type === "object") {
                    child[i] = (toStr.call(p) === astr) ? [] : {};
                    _extend(p, child[i]);
                } else {
                    child[i] = p;
                }
            }

            if (parent.hasOwnProperty(i)) {
                if (type === "object") {
                    __extend();
                } else {
                    child[i] = p;
                }
            } else {
                // 継承先に無ければ追加
                if (typeof child[i] === "undefined") {
                    __extend();
                }
            }
        }

        return child;
    }

    //----------
    // class
    //----------
    // Atom
    var Atom = function (sw, sh) {
        this.sw = sw;
        this.sh = sh;
        this._name = '';
    }
    Atom.prototype = {
        state: function () {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                name = this.getName(),
                coordinate = this.getCoordinage(),
                color = this.getColor(),
                img = {};

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = "24px Arial";
            ctx.fillStyle = color;
            ctx.shadowColor = "#888";
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 5;

            var txtSize = ctx.measureText(name).width;
            ctx = this.fillText(ctx, name, txtSize);

            img = document.createElement('img');
            img.src = canvas.toDataURL();

            this.canvas = canvas;
            this.ctx = ctx;
            this.x = coordinate.x;
            this.y = coordinate.y;
            this.w = txtSize;
            this.h = txtSize;
            this.r = txtSize / 2;
            this.color = color;
            this.img = img;
        },
        getName: function () {
            return this._name;
        },
        getColor: function () {
            return '#' + Math.random().toString(16).slice(-6);
        },
        getCoordinage: function () {
            return { x: this.sw * Math.random(), y: this.sh * Math.random() };
        },
        fillText: function (ctx, name, size) {
            ctx.fillText(name, size, size);
            return ctx;
        },
        updatePosition: function () {
            var r = Math.random() * 4;
            var n = Math.ceil(Math.random() * 2);
            var w = this.w;
            var h = this.h;
            var sw = this.sw;
            var sh = this.sh;

            if (n % 2) {
                this.x += Math.cos((this.y + r) / 15);
                this.y += Math.cos((this.x + r) / 15);
            } else {
                this.x += Math.sin((this.y + r) / 15);
                this.y += Math.sin((this.x + r) / 15);
            }

            if (this.x > sw + w / 2) this.x = -(w / 2);
            else if ((this.x + w) < 0) this.x = sw + w / 2;
            else if (this.y > sh + h / 2) this.y = -(h / 2);
            else if ((this.y + h) < 0) this.y = sh + h / 2;
        },
        isHit: function (targetX, targetY, targetR) {
            var dx = targetX - this.x,
                dy = targetY - this.y,
                distance = Math.sqrt(dx * dx + dy * dy),
                hitDistance = this.r + targetR;

            if (distance < hitDistance) {
                return true;
            }

            return false;
        },
        render: function (ctx) { // stage
            ctx.drawImage(this.img, this.x, this.y);
        },
        clear: function () {
            this.ctx.clearRect(this.x, this.y, this.w, this.h);
        }
    }
    var Atom = new Atom();

    // H
    var H = function (sw, sh) {
        this.sw = sw;
        this.sh = sh;
        this.isMerged = false;
        this._name = 'H';
        this._mergedName = 'H2';
    };
    H.prototype = extend(Atom, {
        getName: function () {
            return this.isMerged ? this._mergedName : this._name;
        },
        getCoordinage: function () {
            if (this.isMerged) {
                return { x: this.x, y: this.y };
            }
            return { x: this.sw * Math.random(), y: this.sh * Math.random() };
        },
        getColor: function () {
            return this.isMerged ? this.color
                : '#' + Math.random().toString(16).slice(-6);
        },
        fillText: function (ctx, name, size) {
            if (this.isMerged) {
                ctx.fillText("H", size / 2, size / 2);
                ctx.font = "18px Arial";
                ctx.fillText("2", size, Math.floor(size * (13 / 24)));
                return ctx;
            }

            ctx.fillText(name, size, size);
            return ctx;
        },
        reRender: function (ctx) {
            this.clear();
            this.state();
            this.render(ctx);
        }
    });

    // O
    var O = function (sw, sh) {
        this.sw = sw;
        this.sh = sh;
        this._name = 'O';
    }
    O.prototype = extend(Atom);

    // H2o
    var H2o = function (sw, sh) {
        this.sw = sw;
        this.sh = sh;
        this.deleteFlag = false;
    };
    H2o.prototype = extend(Atom, {
        state: function (state) {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                color = '#007fff';
            w = (Math.random() * 10) + 15,
                img = {},
                offset = w * 0.4,
                gx = w / 2 - offset,
                gy = w / 2 - offset,
                gr = w / 2 + offset,
                grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);

            ctx.arc(w / 2, w / 2, w / 2, 0, Math.PI * 2, true);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.6;
            ctx.shadowColor = "#007fff";
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 5;
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
            grad.addColorStop(1, 'rgba(0, 127, 255, 1)');
            ctx.fillStyle = grad;
            ctx.fill();

            img = document.createElement('img');
            img.src = canvas.toDataURL();

            this.canvas = canvas;
            this.ctx = ctx;
            this.x = state.x;
            this.y = state.y;
            this.w = this.h = w;
            this.color = color;
            this.img = img;
        },
        updatePosition: function () {
            var dx = Math.random() * 5;
            this.y += 2;
            this.x += Math.cos((this.y + dx) / 100);
            this.y += Math.sin((this.x + dx) / 100);

            if (this.y >= this.sh) {
                this.deleteFlag = true;
            }
        },
        render: function (ctx) {
            if (this.deleteFlag) return;
            ctx.drawImage(this.img, this.x, this.y);
        }
    });

    var Main = function () {
        // const
        this.H_LENGTH = 30;
        this.O_LENGTH = 50;

        // canvas
        var c = document.querySelector('#myCanvas');
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        this.cw = c.width;
        this.ch = c.height;
        this.ctx = c.getContext('2d');

        // atom
        this.h = [];
        this.o = [];
        this.h2o = [];
    }
    Main.prototype = {
        init: function () {
            for (var i = 0; i < this.H_LENGTH; i++) {
                this.h.push(this.factory('H'));
            }
            for (var i = 0; i < this.O_LENGTH; i++) {
                this.o.push(this.factory('O'));
            }
        },
        factory: function (atomName, state) {
            var atom;
            switch (atomName) {
                case 'H':
                    atom = new H(this.cw, this.ch);
                    break;
                case 'O':
                    atom = new O(this.cw, this.ch);
                    break;
                case 'H2o':
                    atom = new H2o(this.cw, this.ch);
                    atom.state(state);
                    return atom;
            }
            atom.state();
            return atom;
        },
        render: function () {
            this.ctx.save();
            this.ctx.fillStyle = "#fff";
            this.ctx.fillRect(0, 0, this.cw, this.ch);

            for (var i = 0, hl = this.h.length; i < hl; i++) {
                var _h = this.h[i];
                _h.updatePosition();
                if (_h.isMerged) {
                    _h.render(this.ctx);
                    continue;
                }
                for (var j = i + 1; j < hl; j++) {
                    var target = this.h[j];
                    if (target.isMerged) continue;
                    if (_h.isHit(target.x, target.y, target.r)) {
                        _h.isMerged = true;
                        _h.reRender(this.ctx);
                        this.h.splice(j, 1);
                        this.h.push(this.factory('H'));
                        target.clear();
                        continue;
                    }
                }

                _h.render(this.ctx);
            }

            for (var i = 0, ol = this.o.length, hl = this.h.length; i < ol; i++) {
                var _o = this.o[i];
                _o.updatePosition();
                _o.render(this.ctx);
                for (var j = 0; j < hl; j++) {
                    var _h = this.h[j];
                    if (_h.isMerged === false) continue;
                    if (_o.isHit(_h.x, _h.y, _h.r)) {
                        this.o.splice(i, 1);
                        this.o.push(this.factory('O'));
                        _o.clear();
                        this.h.splice(j, 1);
                        this.h.push(this.factory('H'));
                        _h.clear();
                        this.h2o.push(this.factory('H2o', { x: _o.x, y: _o.y }));
                    }
                }
            }

            for (var i = 0, h2oLen = this.h2o.length; i < h2oLen; i++) {
                var _h2o = this.h2o[i];
                if (_h2o === undefined) continue;

                _h2o.updatePosition();
                _h2o.render(this.ctx);

                for (var j = h2oLen - 1; j >= 0; j--) {
                    __h2o = this.h2o[j];
                    if (__h2o === undefined) continue;
                    if (__h2o.deleteFlag === true) {
                        this.h2o.splice(j, 1);
                        __h2o.clear();
                    }
                }
            }

            this.ctx.restore();
        }
    }

    //----------
    // main
    //----------
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var Main = new Main();
    Main.init();
    (function loop() {
        requestAnimationFrame(loop);
        Main.render();
    })();

}, 0);