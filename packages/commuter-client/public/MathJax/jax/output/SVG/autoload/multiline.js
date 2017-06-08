/*
 *  /MathJax/jax/output/SVG/autoload/multiline.js
 *
 *  Copyright (c) 2009-2016 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

MathJax.Hub.Register.StartupHook("SVG Jax Ready", function() {
  var d = "2.7.0";
  var a = MathJax.ElementJax.mml, f = MathJax.OutputJax.SVG, b = f.BBOX;
  var e = {
    newline: 0,
    nobreak: 1000000,
    goodbreak: [-200],
    badbreak: [+200],
    auto: [0],
    toobig: 800,
    nestfactor: 400,
    spacefactor: -100,
    spaceoffset: 2,
    spacelimit: 1,
    fence: 500,
    close: 500
  };
  var c = { linebreakstyle: "after" };
  a.mrow.Augment({
    SVGmultiline: function(k) {
      var o = this;
      while (
        o.inferred ||
        (o.parent && o.parent.type === "mrow" && o.isEmbellished())
      ) {
        o = o.parent;
      }
      var n =
        (o.type === "math" && o.Get("display") === "block") || o.type === "mtd";
      o.isMultiline = true;
      var p = this.getValues(
        "linebreak",
        "linebreakstyle",
        "lineleading",
        "linebreakmultchar",
        "indentalign",
        "indentshift",
        "indentalignfirst",
        "indentshiftfirst",
        "indentalignlast",
        "indentshiftlast"
      );
      if (p.linebreakstyle === a.LINEBREAKSTYLE.INFIXLINEBREAKSTYLE) {
        p.linebreakstyle = this.Get("infixlinebreakstyle");
      }
      p.lineleading = f.length2em(p.lineleading, 1, 0.5);
      k = this.SVG();
      if (n && o.type !== "mtd") {
        if (f.linebreakWidth < f.BIGDIMEN) {
          k.w = f.linebreakWidth;
        } else {
          k.w = f.cwidth;
        }
      }
      var g = {
        n: 0,
        Y: 0,
        scale: this.scale || 1,
        isTop: n,
        values: {},
        VALUES: p
      },
        m = this.SVGgetAlign(g, {}),
        i = this.SVGgetShift(g, {}, m),
        h = [],
        j = {
          index: [],
          penalty: e.nobreak,
          w: 0,
          W: i,
          shift: i,
          scanW: i,
          nest: 0
        },
        l = false;
      while (
        this.SVGbetterBreak(j, g) &&
        (j.scanW >= f.linebreakWidth || j.penalty === e.newline)
      ) {
        this.SVGaddLine(k, h, j.index, g, j.values, l);
        h = j.index.slice(0);
        l = true;
        m = this.SVGgetAlign(g, j.values);
        i = this.SVGgetShift(g, j.values, m);
        if (m === a.INDENTALIGN.CENTER) {
          i = 0;
        }
        j.W = j.shift = j.scanW = i;
        j.penalty = e.nobreak;
      }
      g.isLast = true;
      this.SVGaddLine(k, h, [], g, c, l);
      this.SVGhandleSpace(k);
      this.SVGhandleColor(k);
      k.isMultiline = true;
      this.SVGsaveData(k);
      return k;
    }
  });
  a.mbase.Augment({
    SVGlinebreakPenalty: e,
    SVGbetterBreak: function(j, g) {
      if (this.isToken) {
        return false;
      }
      if (this.isEmbellished()) {
        j.embellished = this;
        return this.CoreMO().SVGbetterBreak(j, g);
      }
      if (this.linebreakContainer) {
        return false;
      }
      var q = j.index.slice(0),
        o = j.index.shift(),
        n = this.data.length,
        l,
        r,
        k,
        p = j.index.length > 0,
        h = false;
      if (o == null) {
        o = -1;
      }
      if (!p) {
        o++;
        j.W += j.w;
        j.w = 0;
      }
      k = j.scanW = j.W;
      j.nest++;
      while (o < n && j.scanW < 1.33 * f.linebreakWidth) {
        if (this.data[o]) {
          if (this.data[o].SVGbetterBreak(j, g)) {
            h = true;
            q = [o].concat(j.index);
            l = j.W;
            r = j.w;
            if (j.penalty === e.newline) {
              j.index = q;
              if (j.nest) {
                j.nest--;
              }
              return true;
            }
          }
          k = p ? j.scanW : this.SVGaddWidth(o, j, k);
        }
        j.index = [];
        o++;
        p = false;
      }
      if (j.nest) {
        j.nest--;
      }
      j.index = q;
      if (h) {
        j.W = l;
      }
      return h;
    },
    SVGaddWidth: function(h, k, j) {
      if (this.data[h]) {
        var g = this.data[h].SVGdata;
        j += g.w + g.x;
        if (g.X) {
          j += g.X;
        }
        k.W = k.scanW = j;
        k.w = 0;
      }
      return j;
    },
    SVGaddLine: function(l, h, k, g, p, n) {
      var q = b();
      g.first = n;
      g.last = true;
      this.SVGmoveLine(h, k, q, g, p);
      q.Clean();
      var o = this.SVGgetAlign(g, p), i = this.SVGgetShift(g, p, o);
      if (g.n > 0) {
        var m = f.FONTDATA.baselineskip * g.scale;
        var j =
          (g.values.lineleading == null ? g.VALUES : g.values).lineleading *
          g.scale;
        g.Y -= Math.max(m, g.d + q.h + j);
      }
      if (q.w + i > l.w) {
        l.w = q.w + i;
      }
      l.Align(q, o, 0, g.Y, i);
      g.d = q.d;
      g.values = p;
      g.n++;
    },
    SVGgetAlign: function(j, g) {
      var k = g, h = j.values, i = j.VALUES, l;
      if (j.n === 0) {
        l = k.indentalignfirst || h.indentalignfirst || i.indentalignfirst;
      } else {
        if (j.isLast) {
          l = h.indentalignlast || i.indentalignlast;
        } else {
          l = h.indentalign || i.indentalign;
        }
      }
      if (l === a.INDENTALIGN.INDENTALIGN) {
        l = h.indentalign || i.indentalign;
      }
      if (l === a.INDENTALIGN.AUTO) {
        l = j.isTop ? this.displayAlign : a.INDENTALIGN.LEFT;
      }
      return l;
    },
    SVGgetShift: function(l, i, n) {
      var m = i, j = l.values, k = l.VALUES, h;
      if (l.n === 0) {
        h = m.indentshiftfirst || j.indentshiftfirst || k.indentshiftfirst;
      } else {
        if (l.isLast) {
          h = j.indentshiftlast || k.indentshiftlast;
        } else {
          h = j.indentshift || k.indentshift;
        }
      }
      if (h === a.INDENTSHIFT.INDENTSHIFT) {
        h = j.indentshift || k.indentshift;
      }
      if (h === "auto" || h === "") {
        h = "0";
      }
      h = f.length2em(h, 1, f.cwidth);
      if (l.isTop && this.displayIndent !== "0") {
        var g = f.length2em(this.displayIndent, 1, f.cwidth);
        h += n === a.INDENTALIGN.RIGHT ? -g : g;
      }
      return h;
    },
    SVGmoveLine: function(p, g, k, o, h) {
      var m = p[0], l = g[0];
      if (m == null) {
        m = -1;
      }
      if (l == null) {
        l = this.data.length - 1;
      }
      if (m === l && p.length > 1) {
        this.data[m].SVGmoveSlice(
          p.slice(1),
          g.slice(1),
          k,
          o,
          h,
          "paddingLeft"
        );
      } else {
        var n = o.last;
        o.last = false;
        while (m < l) {
          if (this.data[m]) {
            if (p.length <= 1) {
              this.data[m].SVGmove(k, o, h);
            } else {
              this.data[m].SVGmoveSlice(p.slice(1), [], k, o, h, "paddingLeft");
            }
          }
          m++;
          o.first = false;
          p = [];
        }
        o.last = n;
        if (this.data[m]) {
          if (g.length <= 1) {
            this.data[m].SVGmove(k, o, h);
          } else {
            this.data[m].SVGmoveSlice([], g.slice(1), k, o, h, "paddingRight");
          }
        }
      }
    },
    SVGmoveSlice: function(m, g, i, j, h, k) {
      var l = b();
      this.SVGmoveLine(m, g, l, j, h);
      l.Clean();
      if (this.href) {
        this.SVGaddHref(l);
      }
      this.SVGhandleColor(l);
      i.Add(l, i.w, 0, true);
      return l;
    },
    SVGmove: function(g, j, i) {
      if (
        !(j.first || j.last) ||
        (j.first && j.values.linebreakstyle === a.LINEBREAKSTYLE.BEFORE) ||
        (j.last && i.linebreakstyle === a.LINEBREAKSTYLE.AFTER)
      ) {
        var h = this.toSVG(this.SVGdata.HW, this.SVGdata.D);
        if (j.first || j.nextIsFirst) {
          h.x = 0;
        }
        if (j.last && h.X) {
          h.X = 0;
        }
        g.Add(h, g.w, 0, true);
      }
      if (j.first && h && h.w === 0) {
        j.nextIsFirst = true;
      } else {
        delete j.nextIsFirst;
      }
    }
  });
  a.mfenced.Augment({
    SVGbetterBreak: function(l, g) {
      var u = l.index.slice(0),
        s = l.index.shift(),
        p = this.data.length,
        o,
        v,
        n,
        t = l.index.length > 0,
        h = false;
      if (s == null) {
        s = -1;
      }
      if (!t) {
        s++;
        l.W += l.w;
        l.w = 0;
      }
      n = l.scanW = l.W;
      l.nest++;
      if (!this.dataI) {
        this.dataI = [];
        if (this.data.open) {
          this.dataI.push("open");
        }
        if (p) {
          this.dataI.push(0);
        }
        for (var r = 1; r < p; r++) {
          if (this.data["sep" + r]) {
            this.dataI.push("sep" + r);
          }
          this.dataI.push(r);
        }
        if (this.data.close) {
          this.dataI.push("close");
        }
      }
      p = this.dataI.length;
      while (s < p && l.scanW < 1.33 * f.linebreakWidth) {
        var q = this.dataI[s];
        if (this.data[q]) {
          if (this.data[q].SVGbetterBreak(l, g)) {
            h = true;
            u = [s].concat(l.index);
            o = l.W;
            v = l.w;
            if (l.penalty === e.newline) {
              l.index = u;
              if (l.nest) {
                l.nest--;
              }
              return true;
            }
          }
          n = t ? l.scanW : this.SVGaddWidth(s, l, n);
        }
        l.index = [];
        s++;
        t = false;
      }
      if (l.nest) {
        l.nest--;
      }
      l.index = u;
      if (h) {
        l.W = o;
        l.w = v;
      }
      return h;
    },
    SVGmoveLine: function(h, m, p, g, r) {
      var o = h[0], n = m[0];
      if (o == null) {
        o = -1;
      }
      if (n == null) {
        n = this.dataI.length - 1;
      }
      if (o === n && h.length > 1) {
        this.data[this.dataI[o]].SVGmoveSlice(
          h.slice(1),
          m.slice(1),
          p,
          g,
          r,
          "paddingLeft"
        );
      } else {
        var q = g.last;
        g.last = false;
        var l = this.dataI[o];
        while (o < n) {
          if (this.data[l]) {
            if (h.length <= 1) {
              this.data[l].SVGmove(p, g, r);
            } else {
              this.data[l].SVGmoveSlice(h.slice(1), [], p, g, r, "paddingLeft");
            }
          }
          o++;
          l = this.dataI[o];
          g.first = false;
          h = [];
        }
        g.last = q;
        if (this.data[l]) {
          if (m.length <= 1) {
            this.data[l].SVGmove(p, g, r);
          } else {
            this.data[l].SVGmoveSlice([], m.slice(1), p, g, r, "paddingRight");
          }
        }
      }
    }
  });
  a.msubsup.Augment({
    SVGbetterBreak: function(j, g) {
      if (!this.data[this.base]) {
        return false;
      }
      var o = j.index.slice(0),
        m = j.index.shift(),
        l,
        p,
        k,
        n = j.index.length > 0,
        h = false;
      if (!n) {
        j.W += j.w;
        j.w = 0;
      }
      k = j.scanW = j.W;
      if (m == null) {
        this.SVGdata.dw = this.SVGdata.w - this.data[this.base].SVGdata.w;
      }
      if (this.data[this.base].SVGbetterBreak(j, g)) {
        h = true;
        o = [this.base].concat(j.index);
        l = j.W;
        p = j.w;
        if (j.penalty === e.newline) {
          h = n = true;
        }
      }
      if (!n) {
        this.SVGaddWidth(this.base, j, k);
      }
      j.scanW += this.SVGdata.dw;
      j.W = j.scanW;
      j.index = [];
      if (h) {
        j.W = l;
        j.w = p;
        j.index = o;
      }
      return h;
    },
    SVGmoveLine: function(i, j, m, h, o) {
      if (this.data[this.base]) {
        if (i.length > 1) {
          this.data[this.base].SVGmoveSlice(
            i.slice(1),
            j.slice(1),
            m,
            h,
            o,
            "paddingLeft"
          );
        } else {
          if (j.length <= 1) {
            this.data[this.base].SVGmove(m, h, o);
          } else {
            this.data[this.base].SVGmoveSlice(
              [],
              j.slice(1),
              m,
              h,
              o,
              "paddingRight"
            );
          }
        }
      }
      if (j.length === 0) {
        var l = this.data[this.sup], g = this.data[this.sub], n = m.w, k;
        if (l) {
          k = l.SVGdata || {};
          m.Add(l.toSVG(), n + (k.dx || 0), k.dy);
        }
        if (g) {
          k = g.SVGdata || {};
          m.Add(g.toSVG(), n + (k.dx || 0), k.dy);
        }
      }
    }
  });
  a.mmultiscripts.Augment({
    SVGbetterBreak: function(j, h) {
      if (!this.data[this.base]) {
        return false;
      }
      var n = j.index.slice(0);
      j.index.shift();
      var l, o, k, m = j.index.length > 0, i = false;
      if (!m) {
        j.W += j.w;
        j.w = 0;
      }
      j.scanW = j.W;
      var g = this.SVGdata.w - this.data[this.base].SVGdata.w - this.SVGdata.dx;
      j.scanW += this.SVGdata.dx;
      k = j.scanW;
      if (this.data[this.base].SVGbetterBreak(j, h)) {
        i = true;
        n = [this.base].concat(j.index);
        l = j.W;
        o = j.w;
        if (j.penalty === e.newline) {
          i = m = true;
        }
      }
      if (!m) {
        this.SVGaddWidth(this.base, j, k);
      }
      j.scanW += g;
      j.W = j.scanW;
      j.index = [];
      if (i) {
        j.W = l;
        j.w = o;
        j.index = n;
      }
      return i;
    },
    SVGmoveLine: function(i, k, n, h, p) {
      var q, m = this.SVGdata;
      if (i.length < 1) {
        this.scriptBox = this.SVGgetScripts(this.SVGdata.s);
        var j = this.scriptBox[2], o = this.scriptBox[3];
        q = n.w + m.dx;
        if (o) {
          n.Add(o, q + m.delta - o.w, m.u);
        }
        if (j) {
          n.Add(j, q - j.w, -m.v);
        }
      }
      if (this.data[this.base]) {
        if (i.length > 1) {
          this.data[this.base].SVGmoveSlice(
            i.slice(1),
            k.slice(1),
            n,
            h,
            p,
            "paddingLeft"
          );
        } else {
          if (k.length <= 1) {
            this.data[this.base].SVGmove(n, h, p);
          } else {
            this.data[this.base].SVGmoveSlice(
              [],
              k.slice(1),
              n,
              h,
              p,
              "paddingRight"
            );
          }
        }
      }
      if (k.length === 0) {
        var g = this.scriptBox[0], l = this.scriptBox[1];
        q = n.w + m.s;
        if (l) {
          n.Add(l, q, m.u);
        }
        if (g) {
          n.Add(g, q - m.delta, -m.v);
        }
        delete this.scriptBox;
      }
    }
  });
  a.mo.Augment({
    SVGbetterBreak: function(i, g) {
      if (i.values && i.values.last === this) {
        return false;
      }
      var q = this.getValues(
        "linebreak",
        "linebreakstyle",
        "lineleading",
        "linebreakmultchar",
        "indentalign",
        "indentshift",
        "indentalignfirst",
        "indentshiftfirst",
        "indentalignlast",
        "indentshiftlast",
        "texClass",
        "fence"
      );
      if (q.linebreakstyle === a.LINEBREAKSTYLE.INFIXLINEBREAKSTYLE) {
        q.linebreakstyle = this.Get("infixlinebreakstyle");
      }
      if (q.texClass === a.TEXCLASS.OPEN) {
        i.nest++;
      }
      if (q.texClass === a.TEXCLASS.CLOSE && i.nest) {
        i.nest--;
      }
      var j = i.scanW, k = i.embellished;
      delete i.embellished;
      if (!k || !k.SVGdata) {
        k = this;
      }
      var m = k.SVGdata, p = m.w + m.x;
      if (q.linebreakstyle === a.LINEBREAKSTYLE.AFTER) {
        j += p;
        p = 0;
      }
      if (j - i.shift === 0 && q.linebreak !== a.LINEBREAK.NEWLINE) {
        return false;
      }
      var l = f.linebreakWidth - j;
      if (
        g.n === 0 &&
        (q.indentshiftfirst !== g.VALUES.indentshiftfirst ||
          q.indentalignfirst !== g.VALUES.indentalignfirst)
      ) {
        var n = this.SVGgetAlign(g, q), h = this.SVGgetShift(g, q, n);
        l += i.shift - h;
      }
      var o = Math.floor(l / f.linebreakWidth * 1000);
      if (o < 0) {
        o = e.toobig - 3 * o;
      }
      if (q.fence) {
        o += e.fence;
      }
      if (
        (q.linebreakstyle === a.LINEBREAKSTYLE.AFTER &&
          q.texClass === a.TEXCLASS.OPEN) ||
        q.texClass === a.TEXCLASS.CLOSE
      ) {
        o += e.close;
      }
      o += i.nest * e.nestfactor;
      var r = e[q.linebreak || a.LINEBREAK.AUTO];
      if (!MathJax.Object.isArray(r)) {
        if (l >= 0) {
          o = r * i.nest;
        }
      } else {
        o = Math.max(1, o + r[0] * i.nest);
      }
      if (o >= i.penalty) {
        return false;
      }
      i.penalty = o;
      i.values = q;
      i.W = j;
      i.w = p;
      q.lineleading = f.length2em(q.lineleading, 1, g.VALUES.lineleading);
      q.last = this;
      return true;
    }
  });
  a.mspace.Augment({
    SVGbetterBreak: function(h, g) {
      if (h.values && h.values.last === this) {
        return false;
      }
      var o = this.getValues("linebreak");
      var m = o.linebreak;
      if (!m || this.hasDimAttr()) {
        m = a.LINEBREAK.AUTO;
      }
      var i = h.scanW, k = this.SVGdata, n = k.w + k.x;
      if (i - h.shift === 0) {
        return false;
      }
      var j = f.linebreakWidth - i;
      var l = Math.floor(j / f.linebreakWidth * 1000);
      if (l < 0) {
        l = e.toobig - 3 * l;
      }
      l += h.nest * e.nestfactor;
      var p = e[m];
      if (
        m === a.LINEBREAK.AUTO &&
        n >= e.spacelimit * 1000 &&
        !this.mathbackground &&
        !this.backrgound
      ) {
        p = [(n / 1000 + e.spaceoffset) * e.spacefactor];
      }
      if (!MathJax.Object.isArray(p)) {
        if (j >= 0) {
          l = p * h.nest;
        }
      } else {
        l = Math.max(1, l + p[0] * h.nest);
      }
      if (l >= h.penalty) {
        return false;
      }
      h.penalty = l;
      h.values = o;
      h.W = i;
      h.w = n;
      o.lineleading = g.VALUES.lineleading;
      o.linebreakstyle = "before";
      o.last = this;
      return true;
    }
  });
  MathJax.Hub.Register.StartupHook("TeX mathchoice Ready", function() {
    a.TeXmathchoice.Augment({
      SVGbetterBreak: function(h, g) {
        return this.Core().SVGbetterBreak(h, g);
      },
      SVGmoveLine: function(k, g, i, j, h) {
        return this.Core().SVGmoveSlice(k, g, i, j, h);
      }
    });
  });
  a.maction.Augment({
    SVGbetterBreak: function(h, g) {
      return this.Core().SVGbetterBreak(h, g);
    },
    SVGmoveLine: function(k, g, i, j, h) {
      return this.Core().SVGmoveSlice(k, g, i, j, h);
    }
  });
  a.semantics.Augment({
    SVGbetterBreak: function(h, g) {
      return this.data[0] ? this.data[0].SVGbetterBreak(h, g) : false;
    },
    SVGmoveLine: function(k, g, i, j, h) {
      return this.data[0] ? this.data[0].SVGmoveSlice(k, g, i, j, h) : null;
    }
  });
  MathJax.Hub.Startup.signal.Post("SVG multiline Ready");
  MathJax.Ajax.loadComplete(f.autoloadDir + "/multiline.js");
});
