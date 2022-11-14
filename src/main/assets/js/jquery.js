/*! For license information please see jquery.js.LICENSE.txt */
!(function (e, t) {
  var n = e.document,
    r = e.navigator,
    i = e.location,
    o = (function () {
      var i,
        o,
        a,
        s,
        l = function (e, t) {
          return new l.fn.init(e, t, i);
        },
        u = e.jQuery,
        c = e.$,
        f = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
        d = /\S/,
        p = /^\s+/,
        h = /\s+$/,
        m = /\d/,
        g = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
        y = /^[\],:{}\s]*$/,
        v = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        b = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        x = /(?:^|:|,)(?:\s*\[)+/g,
        w = /(webkit)[ \/]([\w.]+)/,
        T = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        N = /(msie) ([\w.]+)/,
        C = /(mozilla)(?:.*? rv:([\w.]+))?/,
        E = /-([a-z]|[0-9])/gi,
        k = /^-ms-/,
        S = function (e, t) {
          return (t + '').toUpperCase();
        },
        A = r.userAgent,
        L = Object.prototype.toString,
        j = Object.prototype.hasOwnProperty,
        D = Array.prototype.push,
        F = Array.prototype.slice,
        M = String.prototype.trim,
        O = Array.prototype.indexOf,
        _ = {};
      function H() {
        if (!l.isReady) {
          try {
            n.documentElement.doScroll('left');
          } catch (e) {
            return void setTimeout(H, 1);
          }
          l.ready();
        }
      }
      return (
        (l.fn = l.prototype =
          {
            constructor: l,
            init: function (e, r, i) {
              var o, a, s, u;
              if (!e) return this;
              if (e.nodeType) return (this.context = this[0] = e), (this.length = 1), this;
              if ('body' === e && !r && n.body)
                return (this.context = n), (this[0] = n.body), (this.selector = e), (this.length = 1), this;
              if ('string' == typeof e) {
                if (
                  !(o =
                    '<' === e.charAt(0) && '>' === e.charAt(e.length - 1) && e.length >= 3
                      ? [null, e, null]
                      : f.exec(e)) ||
                  (!o[1] && r)
                )
                  return !r || r.jquery ? (r || i).find(e) : this.constructor(r).find(e);
                if (o[1])
                  return (
                    (u = (r = r instanceof l ? r[0] : r) ? r.ownerDocument || r : n),
                    (s = g.exec(e))
                      ? l.isPlainObject(r)
                        ? ((e = [n.createElement(s[1])]), l.fn.attr.call(e, r, !0))
                        : (e = [u.createElement(s[1])])
                      : (e = ((s = l.buildFragment([o[1]], [u])).cacheable ? l.clone(s.fragment) : s.fragment)
                          .childNodes),
                    l.merge(this, e)
                  );
                if ((a = n.getElementById(o[2])) && a.parentNode) {
                  if (a.id !== o[2]) return i.find(e);
                  (this.length = 1), (this[0] = a);
                }
                return (this.context = n), (this.selector = e), this;
              }
              return l.isFunction(e)
                ? i.ready(e)
                : (e.selector !== t && ((this.selector = e.selector), (this.context = e.context)),
                  l.makeArray(e, this));
            },
            selector: '',
            jquery: '1.7',
            length: 0,
            size: function () {
              return this.length;
            },
            toArray: function () {
              return F.call(this, 0);
            },
            get: function (e) {
              return null == e ? this.toArray() : e < 0 ? this[this.length + e] : this[e];
            },
            pushStack: function (e, t, n) {
              var r = this.constructor();
              return (
                l.isArray(e) ? D.apply(r, e) : l.merge(r, e),
                (r.prevObject = this),
                (r.context = this.context),
                'find' === t
                  ? (r.selector = this.selector + (this.selector ? ' ' : '') + n)
                  : t && (r.selector = this.selector + '.' + t + '(' + n + ')'),
                r
              );
            },
            each: function (e, t) {
              return l.each(this, e, t);
            },
            ready: function (e) {
              return l.bindReady(), a.add(e), this;
            },
            eq: function (e) {
              return -1 === e ? this.slice(e) : this.slice(e, +e + 1);
            },
            first: function () {
              return this.eq(0);
            },
            last: function () {
              return this.eq(-1);
            },
            slice: function () {
              return this.pushStack(F.apply(this, arguments), 'slice', F.call(arguments).join(','));
            },
            map: function (e) {
              return this.pushStack(
                l.map(this, function (t, n) {
                  return e.call(t, n, t);
                })
              );
            },
            end: function () {
              return this.prevObject || this.constructor(null);
            },
            push: D,
            sort: [].sort,
            splice: [].splice,
          }),
        (l.fn.init.prototype = l.fn),
        (l.extend = l.fn.extend =
          function () {
            var e,
              n,
              r,
              i,
              o,
              a,
              s = arguments[0] || {},
              u = 1,
              c = arguments.length,
              f = !1;
            for (
              'boolean' == typeof s && ((f = s), (s = arguments[1] || {}), (u = 2)),
                'object' == typeof s || l.isFunction(s) || (s = {}),
                c === u && ((s = this), --u);
              u < c;
              u++
            )
              if (null != (e = arguments[u]))
                for (n in e)
                  (r = s[n]),
                    s !== (i = e[n]) &&
                      (f && i && (l.isPlainObject(i) || (o = l.isArray(i)))
                        ? (o ? ((o = !1), (a = r && l.isArray(r) ? r : [])) : (a = r && l.isPlainObject(r) ? r : {}),
                          (s[n] = l.extend(f, a, i)))
                        : i !== t && (s[n] = i));
            return s;
          }),
        l.extend({
          noConflict: function (t) {
            return e.$ === l && (e.$ = c), t && e.jQuery === l && (e.jQuery = u), l;
          },
          isReady: !1,
          readyWait: 1,
          holdReady: function (e) {
            e ? l.readyWait++ : l.ready(!0);
          },
          ready: function (e) {
            if ((!0 === e && !--l.readyWait) || (!0 !== e && !l.isReady)) {
              if (!n.body) return setTimeout(l.ready, 1);
              if (((l.isReady = !0), !0 !== e && --l.readyWait > 0)) return;
              a.fireWith(n, [l]), l.fn.trigger && l(n).trigger('ready').unbind('ready');
            }
          },
          bindReady: function () {
            if (!a) {
              if (((a = l.Callbacks('once memory')), 'complete' === n.readyState)) return setTimeout(l.ready, 1);
              if (n.addEventListener)
                n.addEventListener('DOMContentLoaded', s, !1), e.addEventListener('load', l.ready, !1);
              else if (n.attachEvent) {
                n.attachEvent('onreadystatechange', s), e.attachEvent('onload', l.ready);
                var t = !1;
                try {
                  t = null == e.frameElement;
                } catch (e) {}
                n.documentElement.doScroll && t && H();
              }
            }
          },
          isFunction: function (e) {
            return 'function' === l.type(e);
          },
          isArray:
            Array.isArray ||
            function (e) {
              return 'array' === l.type(e);
            },
          isWindow: function (e) {
            return e && 'object' == typeof e && 'setInterval' in e;
          },
          isNumeric: function (e) {
            return null != e && m.test(e) && !isNaN(e);
          },
          type: function (e) {
            return null == e ? String(e) : _[L.call(e)] || 'object';
          },
          isPlainObject: function (e) {
            if (!e || 'object' !== l.type(e) || e.nodeType || l.isWindow(e)) return !1;
            try {
              if (e.constructor && !j.call(e, 'constructor') && !j.call(e.constructor.prototype, 'isPrototypeOf'))
                return !1;
            } catch (e) {
              return !1;
            }
            var n;
            for (n in e);
            return n === t || j.call(e, n);
          },
          isEmptyObject: function (e) {
            for (var t in e) return !1;
            return !0;
          },
          error: function (e) {
            throw e;
          },
          parseJSON: function (t) {
            return 'string' == typeof t && t
              ? ((t = l.trim(t)),
                e.JSON && e.JSON.parse
                  ? e.JSON.parse(t)
                  : y.test(t.replace(v, '@').replace(b, ']').replace(x, ''))
                  ? new Function('return ' + t)()
                  : void l.error('Invalid JSON: ' + t))
              : null;
          },
          parseXML: function (n) {
            var r;
            try {
              e.DOMParser
                ? (r = new DOMParser().parseFromString(n, 'text/xml'))
                : (((r = new ActiveXObject('Microsoft.XMLDOM')).async = 'false'), r.loadXML(n));
            } catch (e) {
              r = t;
            }
            return (
              (r && r.documentElement && !r.getElementsByTagName('parsererror').length) || l.error('Invalid XML: ' + n),
              r
            );
          },
          noop: function () {},
          globalEval: function (t) {
            t &&
              d.test(t) &&
              (
                e.execScript ||
                function (t) {
                  e.eval.call(e, t);
                }
              )(t);
          },
          camelCase: function (e) {
            return e.replace(k, 'ms-').replace(E, S);
          },
          nodeName: function (e, t) {
            return e.nodeName && e.nodeName.toUpperCase() === t.toUpperCase();
          },
          each: function (e, n, r) {
            var i,
              o = 0,
              a = e.length,
              s = a === t || l.isFunction(e);
            if (r)
              if (s) {
                for (i in e) if (!1 === n.apply(e[i], r)) break;
              } else for (; o < a && !1 !== n.apply(e[o++], r); );
            else if (s) {
              for (i in e) if (!1 === n.call(e[i], i, e[i])) break;
            } else for (; o < a && !1 !== n.call(e[o], o, e[o++]); );
            return e;
          },
          trim: M
            ? function (e) {
                return null == e ? '' : M.call(e);
              }
            : function (e) {
                return null == e ? '' : e.toString().replace(p, '').replace(h, '');
              },
          makeArray: function (e, t) {
            var n = t || [];
            if (null != e) {
              var r = l.type(e);
              null == e.length || 'string' === r || 'function' === r || 'regexp' === r || l.isWindow(e)
                ? D.call(n, e)
                : l.merge(n, e);
            }
            return n;
          },
          inArray: function (e, t, n) {
            var r;
            if (t) {
              if (O) return O.call(t, e, n);
              for (r = t.length, n = n ? (n < 0 ? Math.max(0, r + n) : n) : 0; n < r; n++)
                if (n in t && t[n] === e) return n;
            }
            return -1;
          },
          merge: function (e, n) {
            var r = e.length,
              i = 0;
            if ('number' == typeof n.length) for (var o = n.length; i < o; i++) e[r++] = n[i];
            else for (; n[i] !== t; ) e[r++] = n[i++];
            return (e.length = r), e;
          },
          grep: function (e, t, n) {
            var r = [];
            n = !!n;
            for (var i = 0, o = e.length; i < o; i++) n !== !!t(e[i], i) && r.push(e[i]);
            return r;
          },
          map: function (e, n, r) {
            var i,
              o,
              a = [],
              s = 0,
              u = e.length;
            if (
              e instanceof l ||
              (u !== t && 'number' == typeof u && ((u > 0 && e[0] && e[u - 1]) || 0 === u || l.isArray(e)))
            )
              for (; s < u; s++) null != (i = n(e[s], s, r)) && (a[a.length] = i);
            else for (o in e) null != (i = n(e[o], o, r)) && (a[a.length] = i);
            return a.concat.apply([], a);
          },
          guid: 1,
          proxy: function (e, n) {
            if ('string' == typeof n) {
              var r = e[n];
              (n = e), (e = r);
            }
            if (!l.isFunction(e)) return t;
            var i = F.call(arguments, 2),
              o = function () {
                return e.apply(n, i.concat(F.call(arguments)));
              };
            return (o.guid = e.guid = e.guid || o.guid || l.guid++), o;
          },
          access: function (e, n, r, i, o, a) {
            var s = e.length;
            if ('object' == typeof n) {
              for (var u in n) l.access(e, u, n[u], i, o, r);
              return e;
            }
            if (r !== t) {
              i = !a && i && l.isFunction(r);
              for (var c = 0; c < s; c++) o(e[c], n, i ? r.call(e[c], c, o(e[c], n)) : r, a);
              return e;
            }
            return s ? o(e[0], n) : t;
          },
          now: function () {
            return new Date().getTime();
          },
          uaMatch: function (e) {
            e = e.toLowerCase();
            var t = w.exec(e) || T.exec(e) || N.exec(e) || (e.indexOf('compatible') < 0 && C.exec(e)) || [];
            return { browser: t[1] || '', version: t[2] || '0' };
          },
          sub: function () {
            function e(t, n) {
              return new e.fn.init(t, n);
            }
            l.extend(!0, e, this),
              (e.superclass = this),
              (e.fn = e.prototype = this()),
              (e.fn.constructor = e),
              (e.sub = this.sub),
              (e.fn.init = function (n, r) {
                return r && r instanceof l && !(r instanceof e) && (r = e(r)), l.fn.init.call(this, n, r, t);
              }),
              (e.fn.init.prototype = e.fn);
            var t = e(n);
            return e;
          },
          browser: {},
        }),
        l.each('Boolean Number String Function Array Date RegExp Object'.split(' '), function (e, t) {
          _['[object ' + t + ']'] = t.toLowerCase();
        }),
        (o = l.uaMatch(A)).browser && ((l.browser[o.browser] = !0), (l.browser.version = o.version)),
        l.browser.webkit && (l.browser.safari = !0),
        d.test(' ') && ((p = /^[\s\xA0]+/), (h = /[\s\xA0]+$/)),
        (i = l(n)),
        n.addEventListener
          ? (s = function () {
              n.removeEventListener('DOMContentLoaded', s, !1), l.ready();
            })
          : n.attachEvent &&
            (s = function () {
              'complete' === n.readyState && (n.detachEvent('onreadystatechange', s), l.ready());
            }),
        'function' == typeof define &&
          define.amd &&
          define.amd.jQuery &&
          define('jquery', [], function () {
            return l;
          }),
        l
      );
    })(),
    a = {};
  o.Callbacks = function (e) {
    e = e
      ? a[e] ||
        (function (e) {
          var t,
            n,
            r = (a[e] = {});
          for (t = 0, n = (e = e.split(/\s+/)).length; t < n; t++) r[e[t]] = !0;
          return r;
        })(e)
      : {};
    var n,
      r,
      i,
      s,
      l,
      u = [],
      c = [],
      f = function (t) {
        var n, r, i, a;
        for (n = 0, r = t.length; n < r; n++)
          (i = t[n]), 'array' === (a = o.type(i)) ? f(i) : 'function' === a && ((e.unique && p.has(i)) || u.push(i));
      },
      d = function (t, o) {
        for (o = o || [], n = !e.memory || [t, o], r = !0, l = i || 0, i = 0, s = u.length; u && l < s; l++)
          if (!1 === u[l].apply(t, o) && e.stopOnFalse) {
            n = !0;
            break;
          }
        (r = !1),
          u &&
            (e.once ? (!0 === n ? p.disable() : (u = [])) : c && c.length && ((n = c.shift()), p.fireWith(n[0], n[1])));
      },
      p = {
        add: function () {
          if (u) {
            var e = u.length;
            f(arguments), r ? (s = u.length) : n && !0 !== n && ((i = e), d(n[0], n[1]));
          }
          return this;
        },
        remove: function () {
          if (u)
            for (var t = arguments, n = 0, i = t.length; n < i; n++)
              for (
                var o = 0;
                o < u.length && (t[n] !== u[o] || (r && o <= s && (s--, o <= l && l--), u.splice(o--, 1), !e.unique));
                o++
              );
          return this;
        },
        has: function (e) {
          if (u) for (var t = 0, n = u.length; t < n; t++) if (e === u[t]) return !0;
          return !1;
        },
        empty: function () {
          return (u = []), this;
        },
        disable: function () {
          return (u = c = n = t), this;
        },
        disabled: function () {
          return !u;
        },
        lock: function () {
          return (c = t), (n && !0 !== n) || p.disable(), this;
        },
        locked: function () {
          return !c;
        },
        fireWith: function (t, i) {
          return c && (r ? e.once || c.push([t, i]) : (e.once && n) || d(t, i)), this;
        },
        fire: function () {
          return p.fireWith(this, arguments), this;
        },
        fired: function () {
          return !!n;
        },
      };
    return p;
  };
  var s = [].slice;
  o.extend({
    Deferred: function (e) {
      var t,
        n = o.Callbacks('once memory'),
        r = o.Callbacks('once memory'),
        i = o.Callbacks('memory'),
        a = 'pending',
        s = { resolve: n, reject: r, notify: i },
        l = {
          done: n.add,
          fail: r.add,
          progress: i.add,
          state: function () {
            return a;
          },
          isResolved: n.fired,
          isRejected: r.fired,
          then: function (e, t, n) {
            return u.done(e).fail(t).progress(n), this;
          },
          always: function () {
            return u.done.apply(u, arguments).fail.apply(u, arguments);
          },
          pipe: function (e, t, n) {
            return o
              .Deferred(function (r) {
                o.each({ done: [e, 'resolve'], fail: [t, 'reject'], progress: [n, 'notify'] }, function (e, t) {
                  var n,
                    i = t[0],
                    a = t[1];
                  o.isFunction(i)
                    ? u[e](function () {
                        (n = i.apply(this, arguments)) && o.isFunction(n.promise)
                          ? n.promise().then(r.resolve, r.reject, r.notify)
                          : r[a + 'With'](this === u ? r : this, [n]);
                      })
                    : u[e](r[a]);
                });
              })
              .promise();
          },
          promise: function (e) {
            if (null == e) e = l;
            else for (var t in l) e[t] = l[t];
            return e;
          },
        },
        u = l.promise({});
      for (t in s) (u[t] = s[t].fire), (u[t + 'With'] = s[t].fireWith);
      return (
        u
          .done(
            function () {
              a = 'resolved';
            },
            r.disable,
            i.lock
          )
          .fail(
            function () {
              a = 'rejected';
            },
            n.disable,
            i.lock
          ),
        e && e.call(u, u),
        u
      );
    },
    when: function (e) {
      var t = s.call(arguments, 0),
        n = 0,
        r = t.length,
        i = new Array(r),
        a = r,
        l = r <= 1 && e && o.isFunction(e.promise) ? e : o.Deferred(),
        u = l.promise();
      function c(e) {
        return function (n) {
          (t[e] = arguments.length > 1 ? s.call(arguments, 0) : n), --a || l.resolveWith(l, t);
        };
      }
      function f(e) {
        return function (t) {
          (i[e] = arguments.length > 1 ? s.call(arguments, 0) : t), l.notifyWith(u, i);
        };
      }
      if (r > 1) {
        for (; n < r; n++)
          t[n] && t[n].promise && o.isFunction(t[n].promise) ? t[n].promise().then(c(n), l.reject, f(n)) : --a;
        a || l.resolveWith(l, t);
      } else l !== e && l.resolveWith(l, r ? [e] : []);
      return u;
    },
  }),
    (o.support = (function () {
      var e,
        t,
        r,
        i,
        a,
        s,
        l,
        u,
        c,
        f,
        d,
        p,
        h,
        m,
        g,
        y,
        v = n.createElement('div'),
        b = n.documentElement;
      if (
        (v.setAttribute('className', 't'),
        (v.innerHTML =
          "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/><nav></nav>"),
        (e = v.getElementsByTagName('*')),
        (t = v.getElementsByTagName('a')[0]),
        !e || !e.length || !t)
      )
        return {};
      (i = (r = n.createElement('select')).appendChild(n.createElement('option'))),
        (a = v.getElementsByTagName('input')[0]),
        (l = {
          leadingWhitespace: 3 === v.firstChild.nodeType,
          tbody: !v.getElementsByTagName('tbody').length,
          htmlSerialize: !!v.getElementsByTagName('link').length,
          style: /top/.test(t.getAttribute('style')),
          hrefNormalized: '/a' === t.getAttribute('href'),
          opacity: /^0.55/.test(t.style.opacity),
          cssFloat: !!t.style.cssFloat,
          unknownElems: !!v.getElementsByTagName('nav').length,
          checkOn: 'on' === a.value,
          optSelected: i.selected,
          getSetAttribute: 't' !== v.className,
          enctype: !!n.createElement('form').enctype,
          submitBubbles: !0,
          changeBubbles: !0,
          focusinBubbles: !1,
          deleteExpando: !0,
          noCloneEvent: !0,
          inlineBlockNeedsLayout: !1,
          shrinkWrapBlocks: !1,
          reliableMarginRight: !0,
        }),
        (a.checked = !0),
        (l.noCloneChecked = a.cloneNode(!0).checked),
        (r.disabled = !0),
        (l.optDisabled = !i.disabled);
      try {
        delete v.test;
      } catch (e) {
        l.deleteExpando = !1;
      }
      for (g in (!v.addEventListener &&
        v.attachEvent &&
        v.fireEvent &&
        (v.attachEvent('onclick', function () {
          l.noCloneEvent = !1;
        }),
        v.cloneNode(!0).fireEvent('onclick')),
      ((a = n.createElement('input')).value = 't'),
      a.setAttribute('type', 'radio'),
      (l.radioValue = 't' === a.value),
      a.setAttribute('checked', 'checked'),
      v.appendChild(a),
      (u = n.createDocumentFragment()).appendChild(v.lastChild),
      (l.checkClone = u.cloneNode(!0).cloneNode(!0).lastChild.checked),
      (v.innerHTML = ''),
      (v.style.width = v.style.paddingLeft = '1px'),
      (c = n.getElementsByTagName('body')[0]),
      (d = n.createElement(c ? 'div' : 'body')),
      (p = { visibility: 'hidden', width: 0, height: 0, border: 0, margin: 0, background: 'none' }),
      c && o.extend(p, { position: 'absolute', left: '-999px', top: '-999px' }),
      p))
        d.style[g] = p[g];
      if (
        (d.appendChild(v),
        (f = c || b).insertBefore(d, f.firstChild),
        (l.appendChecked = a.checked),
        (l.boxModel = 2 === v.offsetWidth),
        'zoom' in v.style &&
          ((v.style.display = 'inline'),
          (v.style.zoom = 1),
          (l.inlineBlockNeedsLayout = 2 === v.offsetWidth),
          (v.style.display = ''),
          (v.innerHTML = "<div style='width:4px;'></div>"),
          (l.shrinkWrapBlocks = 2 !== v.offsetWidth)),
        (v.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>"),
        (y = 0 === (h = v.getElementsByTagName('td'))[0].offsetHeight),
        (h[0].style.display = ''),
        (h[1].style.display = 'none'),
        (l.reliableHiddenOffsets = y && 0 === h[0].offsetHeight),
        (v.innerHTML = ''),
        n.defaultView &&
          n.defaultView.getComputedStyle &&
          (((s = n.createElement('div')).style.width = '0'),
          (s.style.marginRight = '0'),
          v.appendChild(s),
          (l.reliableMarginRight =
            0 === (parseInt((n.defaultView.getComputedStyle(s, null) || { marginRight: 0 }).marginRight, 10) || 0))),
        v.attachEvent)
      )
        for (g in { submit: 1, change: 1, focusin: 1 })
          (y = (m = 'on' + g) in v) || (v.setAttribute(m, 'return;'), (y = 'function' == typeof v[m])),
            (l[g + 'Bubbles'] = y);
      return (
        o(function () {
          var e,
            t,
            r,
            i,
            a,
            s = 'visibility:hidden;border:0;';
          (c = n.getElementsByTagName('body')[0]) &&
            (((e = n.createElement('div')).style.cssText = s + 'width:0;height:0;position:static;top:0;margin-top:1px'),
            c.insertBefore(e, c.firstChild),
            ((d = n.createElement('div')).style.cssText =
              'position:absolute;top:0;left:0;width:1px;height:1px;margin:0;' + s),
            (d.innerHTML =
              "<div style='position:absolute;top:0;left:0;width:1px;height:1px;margin:0;border:5px solid #000;padding:0;'><div></div></div><table style='position:absolute;top:0;left:0;width:1px;height:1px;margin:0;border:5px solid #000;padding:0;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>"),
            e.appendChild(d),
            (r = (t = d.firstChild).firstChild),
            (i = t.nextSibling.firstChild.firstChild),
            (a = { doesNotAddBorder: 5 !== r.offsetTop, doesAddBorderForTableAndCells: 5 === i.offsetTop }),
            (r.style.position = 'fixed'),
            (r.style.top = '20px'),
            (a.fixedPosition = 20 === r.offsetTop || 15 === r.offsetTop),
            (r.style.position = r.style.top = ''),
            (t.style.overflow = 'hidden'),
            (t.style.position = 'relative'),
            (a.subtractsBorderForOverflowNotVisible = -5 === r.offsetTop),
            (a.doesNotIncludeMarginInBodyOffset = 1 !== c.offsetTop),
            c.removeChild(e),
            (d = e = null),
            o.extend(l, a));
        }),
        (d.innerHTML = ''),
        f.removeChild(d),
        (d = u = r = i = c = s = v = a = null),
        l
      );
    })()),
    (o.boxModel = o.support.boxModel);
  var l = /^(?:\{.*\}|\[.*\])$/,
    u = /([A-Z])/g;
  function c(e, n, r) {
    if (r === t && 1 === e.nodeType) {
      var i = 'data-' + n.replace(u, '-$1').toLowerCase();
      if ('string' == typeof (r = e.getAttribute(i))) {
        try {
          r =
            'true' === r ||
            ('false' !== r && ('null' === r ? null : o.isNumeric(r) ? parseFloat(r) : l.test(r) ? o.parseJSON(r) : r));
        } catch (e) {}
        o.data(e, n, r);
      } else r = t;
    }
    return r;
  }
  function f(e) {
    for (var t in e) if (('data' !== t || !o.isEmptyObject(e[t])) && 'toJSON' !== t) return !1;
    return !0;
  }
  function d(e, t, n) {
    var r = t + 'defer',
      i = t + 'queue',
      a = t + 'mark',
      s = o._data(e, r);
    !s ||
      ('queue' !== n && o._data(e, i)) ||
      ('mark' !== n && o._data(e, a)) ||
      setTimeout(function () {
        o._data(e, i) || o._data(e, a) || (o.removeData(e, r, !0), s.fire());
      }, 0);
  }
  o.extend({
    cache: {},
    uuid: 0,
    expando: 'jQuery' + (o.fn.jquery + Math.random()).replace(/\D/g, ''),
    noData: { embed: !0, object: 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000', applet: !0 },
    hasData: function (e) {
      return !!(e = e.nodeType ? o.cache[e[o.expando]] : e[o.expando]) && !f(e);
    },
    data: function (e, n, r, i) {
      if (o.acceptData(e)) {
        o.expando;
        var a,
          s,
          l,
          u = 'string' == typeof n,
          c = e.nodeType,
          f = c ? o.cache : e,
          d = c ? e[o.expando] : e[o.expando] && o.expando,
          p = 'events' === n;
        if ((d && f[d] && (p || i || f[d].data)) || !u || r !== t)
          return (
            d || (c ? (e[o.expando] = d = ++o.uuid) : (d = o.expando)),
            f[d] || ((f[d] = {}), c || (f[d].toJSON = o.noop)),
            ('object' != typeof n && 'function' != typeof n) ||
              (i ? (f[d] = o.extend(f[d], n)) : (f[d].data = o.extend(f[d].data, n))),
            (a = s = f[d]),
            i || (s.data || (s.data = {}), (s = s.data)),
            r !== t && (s[o.camelCase(n)] = r),
            p && !s[n] ? a.events : (u ? null == (l = s[n]) && (l = s[o.camelCase(n)]) : (l = s), l)
          );
      }
    },
    removeData: function (e, t, n) {
      if (o.acceptData(e)) {
        o.expando;
        var r,
          i,
          a,
          s = e.nodeType,
          l = s ? o.cache : e,
          u = s ? e[o.expando] : o.expando;
        if (l[u]) {
          if (t && (r = n ? l[u] : l[u].data)) {
            for (
              i = 0, a = (t = o.isArray(t) ? t : (t in r) || ((t = o.camelCase(t)) in r) ? [t] : t.split(' ')).length;
              i < a;
              i++
            )
              delete r[t[i]];
            if (!(n ? f : o.isEmptyObject)(r)) return;
          }
          (n || (delete l[u].data, f(l[u]))) &&
            (o.support.deleteExpando || !l.setInterval ? delete l[u] : (l[u] = null),
            s &&
              (o.support.deleteExpando
                ? delete e[o.expando]
                : e.removeAttribute
                ? e.removeAttribute(o.expando)
                : (e[o.expando] = null)));
        }
      }
    },
    _data: function (e, t, n) {
      return o.data(e, t, n, !0);
    },
    acceptData: function (e) {
      if (e.nodeName) {
        var t = o.noData[e.nodeName.toLowerCase()];
        if (t) return !(!0 === t || e.getAttribute('classid') !== t);
      }
      return !0;
    },
  }),
    o.fn.extend({
      data: function (e, n) {
        var r,
          i,
          a,
          s = null;
        if (void 0 === e) {
          if (this.length && ((s = o.data(this[0])), 1 === this[0].nodeType && !o._data(this[0], 'parsedAttrs'))) {
            for (var l = 0, u = (i = this[0].attributes).length; l < u; l++)
              0 === (a = i[l].name).indexOf('data-') && ((a = o.camelCase(a.substring(5))), c(this[0], a, s[a]));
            o._data(this[0], 'parsedAttrs', !0);
          }
          return s;
        }
        return 'object' == typeof e
          ? this.each(function () {
              o.data(this, e);
            })
          : (((r = e.split('.'))[1] = r[1] ? '.' + r[1] : ''),
            n === t
              ? ((s = this.triggerHandler('getData' + r[1] + '!', [r[0]])) === t &&
                  this.length &&
                  ((s = o.data(this[0], e)), (s = c(this[0], e, s))),
                s === t && r[1] ? this.data(r[0]) : s)
              : this.each(function () {
                  var t = o(this),
                    i = [r[0], n];
                  t.triggerHandler('setData' + r[1] + '!', i),
                    o.data(this, e, n),
                    t.triggerHandler('changeData' + r[1] + '!', i);
                }));
      },
      removeData: function (e) {
        return this.each(function () {
          o.removeData(this, e);
        });
      },
    }),
    o.extend({
      _mark: function (e, t) {
        e && ((t = (t || 'fx') + 'mark'), o._data(e, t, (o._data(e, t) || 0) + 1));
      },
      _unmark: function (e, t, n) {
        if ((!0 !== e && ((n = t), (t = e), (e = !1)), t)) {
          var r = (n = n || 'fx') + 'mark',
            i = e ? 0 : (o._data(t, r) || 1) - 1;
          i ? o._data(t, r, i) : (o.removeData(t, r, !0), d(t, n, 'mark'));
        }
      },
      queue: function (e, t, n) {
        var r;
        if (e)
          return (
            (t = (t || 'fx') + 'queue'),
            (r = o._data(e, t)),
            n && (!r || o.isArray(n) ? (r = o._data(e, t, o.makeArray(n))) : r.push(n)),
            r || []
          );
      },
      dequeue: function (e, t) {
        t = t || 'fx';
        var n = o.queue(e, t),
          r = n.shift(),
          i = {};
        'inprogress' === r && (r = n.shift()),
          r &&
            ('fx' === t && n.unshift('inprogress'),
            o._data(e, t + '.run', i),
            r.call(
              e,
              function () {
                o.dequeue(e, t);
              },
              i
            )),
          n.length || (o.removeData(e, t + 'queue ' + t + '.run', !0), d(e, t, 'queue'));
      },
    }),
    o.fn.extend({
      queue: function (e, n) {
        return (
          'string' != typeof e && ((n = e), (e = 'fx')),
          n === t
            ? o.queue(this[0], e)
            : this.each(function () {
                var t = o.queue(this, e, n);
                'fx' === e && 'inprogress' !== t[0] && o.dequeue(this, e);
              })
        );
      },
      dequeue: function (e) {
        return this.each(function () {
          o.dequeue(this, e);
        });
      },
      delay: function (e, t) {
        return (
          (e = (o.fx && o.fx.speeds[e]) || e),
          (t = t || 'fx'),
          this.queue(t, function (t, n) {
            var r = setTimeout(t, e);
            n.stop = function () {
              clearTimeout(r);
            };
          })
        );
      },
      clearQueue: function (e) {
        return this.queue(e || 'fx', []);
      },
      promise: function (e, n) {
        'string' != typeof e && (e = t), (e = e || 'fx');
        var r,
          i = o.Deferred(),
          a = this,
          s = a.length,
          l = 1,
          u = e + 'defer',
          c = e + 'queue',
          f = e + 'mark';
        function d() {
          --l || i.resolveWith(a, [a]);
        }
        for (; s--; )
          (r =
            o.data(a[s], u, t, !0) ||
            ((o.data(a[s], c, t, !0) || o.data(a[s], f, t, !0)) && o.data(a[s], u, o.Callbacks('once memory'), !0))) &&
            (l++, r.add(d));
        return d(), i.promise();
      },
    });
  var p,
    h,
    m,
    g = /[\n\t\r]/g,
    y = /\s+/,
    v = /\r/g,
    b = /^(?:button|input)$/i,
    x = /^(?:button|input|object|select|textarea)$/i,
    w = /^a(?:rea)?$/i,
    T =
      /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
    N = o.support.getSetAttribute;
  o.fn.extend({
    attr: function (e, t) {
      return o.access(this, e, t, !0, o.attr);
    },
    removeAttr: function (e) {
      return this.each(function () {
        o.removeAttr(this, e);
      });
    },
    prop: function (e, t) {
      return o.access(this, e, t, !0, o.prop);
    },
    removeProp: function (e) {
      return (
        (e = o.propFix[e] || e),
        this.each(function () {
          try {
            (this[e] = t), delete this[e];
          } catch (e) {}
        })
      );
    },
    addClass: function (e) {
      var t, n, r, i, a, s, l;
      if (o.isFunction(e))
        return this.each(function (t) {
          o(this).addClass(e.call(this, t, this.className));
        });
      if (e && 'string' == typeof e)
        for (t = e.split(y), n = 0, r = this.length; n < r; n++)
          if (1 === (i = this[n]).nodeType)
            if (i.className || 1 !== t.length) {
              for (a = ' ' + i.className + ' ', s = 0, l = t.length; s < l; s++)
                ~a.indexOf(' ' + t[s] + ' ') || (a += t[s] + ' ');
              i.className = o.trim(a);
            } else i.className = e;
      return this;
    },
    removeClass: function (e) {
      var n, r, i, a, s, l, u;
      if (o.isFunction(e))
        return this.each(function (t) {
          o(this).removeClass(e.call(this, t, this.className));
        });
      if ((e && 'string' == typeof e) || e === t)
        for (n = (e || '').split(y), r = 0, i = this.length; r < i; r++)
          if (1 === (a = this[r]).nodeType && a.className)
            if (e) {
              for (s = (' ' + a.className + ' ').replace(g, ' '), l = 0, u = n.length; l < u; l++)
                s = s.replace(' ' + n[l] + ' ', ' ');
              a.className = o.trim(s);
            } else a.className = '';
      return this;
    },
    toggleClass: function (e, t) {
      var n = typeof e,
        r = 'boolean' == typeof t;
      return o.isFunction(e)
        ? this.each(function (n) {
            o(this).toggleClass(e.call(this, n, this.className, t), t);
          })
        : this.each(function () {
            if ('string' === n)
              for (var i, a = 0, s = o(this), l = t, u = e.split(y); (i = u[a++]); )
                (l = r ? l : !s.hasClass(i)), s[l ? 'addClass' : 'removeClass'](i);
            else
              ('undefined' !== n && 'boolean' !== n) ||
                (this.className && o._data(this, '__className__', this.className),
                (this.className = this.className || !1 === e ? '' : o._data(this, '__className__') || ''));
          });
    },
    hasClass: function (e) {
      for (var t = ' ' + e + ' ', n = 0, r = this.length; n < r; n++)
        if (1 === this[n].nodeType && (' ' + this[n].className + ' ').replace(g, ' ').indexOf(t) > -1) return !0;
      return !1;
    },
    val: function (e) {
      var n,
        r,
        i,
        a = this[0];
      return arguments.length
        ? ((i = o.isFunction(e)),
          this.each(function (r) {
            var a,
              s = o(this);
            1 === this.nodeType &&
              (null == (a = i ? e.call(this, r, s.val()) : e)
                ? (a = '')
                : 'number' == typeof a
                ? (a += '')
                : o.isArray(a) &&
                  (a = o.map(a, function (e) {
                    return null == e ? '' : e + '';
                  })),
              ((n = o.valHooks[this.nodeName.toLowerCase()] || o.valHooks[this.type]) &&
                'set' in n &&
                n.set(this, a, 'value') !== t) ||
                (this.value = a));
          }))
        : a
        ? (n = o.valHooks[a.nodeName.toLowerCase()] || o.valHooks[a.type]) &&
          'get' in n &&
          (r = n.get(a, 'value')) !== t
          ? r
          : 'string' == typeof (r = a.value)
          ? r.replace(v, '')
          : null == r
          ? ''
          : r
        : t;
    },
  }),
    o.extend({
      valHooks: {
        option: {
          get: function (e) {
            var t = e.attributes.value;
            return !t || t.specified ? e.value : e.text;
          },
        },
        select: {
          get: function (e) {
            var t,
              n,
              r,
              i,
              a = e.selectedIndex,
              s = [],
              l = e.options,
              u = 'select-one' === e.type;
            if (a < 0) return null;
            for (n = u ? a : 0, r = u ? a + 1 : l.length; n < r; n++)
              if (
                (i = l[n]).selected &&
                (o.support.optDisabled ? !i.disabled : null === i.getAttribute('disabled')) &&
                (!i.parentNode.disabled || !o.nodeName(i.parentNode, 'optgroup'))
              ) {
                if (((t = o(i).val()), u)) return t;
                s.push(t);
              }
            return u && !s.length && l.length ? o(l[a]).val() : s;
          },
          set: function (e, t) {
            var n = o.makeArray(t);
            return (
              o(e)
                .find('option')
                .each(function () {
                  this.selected = o.inArray(o(this).val(), n) >= 0;
                }),
              n.length || (e.selectedIndex = -1),
              n
            );
          },
        },
      },
      attrFn: { val: !0, css: !0, html: !0, text: !0, data: !0, width: !0, height: !0, offset: !0 },
      attr: function (e, n, r, i) {
        var a,
          s,
          l,
          u = e.nodeType;
        return e && 3 !== u && 8 !== u && 2 !== u
          ? i && n in o.attrFn
            ? o(e)[n](r)
            : 'getAttribute' in e
            ? ((l = 1 !== u || !o.isXMLDoc(e)) && ((n = n.toLowerCase()), (s = o.attrHooks[n] || (T.test(n) ? h : p))),
              r !== t
                ? null === r
                  ? (o.removeAttr(e, n), t)
                  : s && 'set' in s && l && (a = s.set(e, r, n)) !== t
                  ? a
                  : (e.setAttribute(n, '' + r), r)
                : s && 'get' in s && l && null !== (a = s.get(e, n))
                ? a
                : null === (a = e.getAttribute(n))
                ? t
                : a)
            : o.prop(e, n, r)
          : t;
      },
      removeAttr: function (e, t) {
        var n,
          r,
          i,
          a,
          s = 0;
        if (1 === e.nodeType)
          for (a = (r = (t || '').split(y)).length; s < a; s++)
            (i = r[s].toLowerCase()),
              (n = o.propFix[i] || i),
              o.attr(e, i, ''),
              e.removeAttribute(N ? i : n),
              T.test(i) && n in e && (e[n] = !1);
      },
      attrHooks: {
        type: {
          set: function (e, t) {
            if (b.test(e.nodeName) && e.parentNode) o.error("type property can't be changed");
            else if (!o.support.radioValue && 'radio' === t && o.nodeName(e, 'input')) {
              var n = e.value;
              return e.setAttribute('type', t), n && (e.value = n), t;
            }
          },
        },
        value: {
          get: function (e, t) {
            return p && o.nodeName(e, 'button') ? p.get(e, t) : t in e ? e.value : null;
          },
          set: function (e, t, n) {
            if (p && o.nodeName(e, 'button')) return p.set(e, t, n);
            e.value = t;
          },
        },
      },
      propFix: {
        tabindex: 'tabIndex',
        readonly: 'readOnly',
        for: 'htmlFor',
        class: 'className',
        maxlength: 'maxLength',
        cellspacing: 'cellSpacing',
        cellpadding: 'cellPadding',
        rowspan: 'rowSpan',
        colspan: 'colSpan',
        usemap: 'useMap',
        frameborder: 'frameBorder',
        contenteditable: 'contentEditable',
      },
      prop: function (e, n, r) {
        var i,
          a,
          s = e.nodeType;
        return e && 3 !== s && 8 !== s && 2 !== s
          ? ((1 !== s || !o.isXMLDoc(e)) && ((n = o.propFix[n] || n), (a = o.propHooks[n])),
            r !== t
              ? a && 'set' in a && (i = a.set(e, r, n)) !== t
                ? i
                : (e[n] = r)
              : a && 'get' in a && null !== (i = a.get(e, n))
              ? i
              : e[n])
          : t;
      },
      propHooks: {
        tabIndex: {
          get: function (e) {
            var n = e.getAttributeNode('tabindex');
            return n && n.specified
              ? parseInt(n.value, 10)
              : x.test(e.nodeName) || (w.test(e.nodeName) && e.href)
              ? 0
              : t;
          },
        },
      },
    }),
    (o.attrHooks.tabindex = o.propHooks.tabIndex),
    (h = {
      get: function (e, n) {
        var r,
          i = o.prop(e, n);
        return !0 === i || ('boolean' != typeof i && (r = e.getAttributeNode(n)) && !1 !== r.nodeValue)
          ? n.toLowerCase()
          : t;
      },
      set: function (e, t, n) {
        var r;
        return (
          !1 === t
            ? o.removeAttr(e, n)
            : ((r = o.propFix[n] || n) in e && (e[r] = !0), e.setAttribute(n, n.toLowerCase())),
          n
        );
      },
    }),
    N ||
      ((m = { name: !0, id: !0 }),
      (p = o.valHooks.button =
        {
          get: function (e, n) {
            var r;
            return (r = e.getAttributeNode(n)) && (m[n] ? '' !== r.nodeValue : r.specified) ? r.nodeValue : t;
          },
          set: function (e, t, r) {
            var i = e.getAttributeNode(r);
            return i || ((i = n.createAttribute(r)), e.setAttributeNode(i)), (i.nodeValue = t + '');
          },
        }),
      (o.attrHooks.tabindex.set = p.set),
      o.each(['width', 'height'], function (e, t) {
        o.attrHooks[t] = o.extend(o.attrHooks[t], {
          set: function (e, n) {
            if ('' === n) return e.setAttribute(t, 'auto'), n;
          },
        });
      }),
      (o.attrHooks.contenteditable = {
        get: p.get,
        set: function (e, t, n) {
          '' === t && (t = 'false'), p.set(e, t, n);
        },
      })),
    o.support.hrefNormalized ||
      o.each(['href', 'src', 'width', 'height'], function (e, n) {
        o.attrHooks[n] = o.extend(o.attrHooks[n], {
          get: function (e) {
            var r = e.getAttribute(n, 2);
            return null === r ? t : r;
          },
        });
      }),
    o.support.style ||
      (o.attrHooks.style = {
        get: function (e) {
          return e.style.cssText.toLowerCase() || t;
        },
        set: function (e, t) {
          return (e.style.cssText = '' + t);
        },
      }),
    o.support.optSelected ||
      (o.propHooks.selected = o.extend(o.propHooks.selected, {
        get: function (e) {
          var t = e.parentNode;
          return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null;
        },
      })),
    o.support.enctype || (o.propFix.enctype = 'encoding'),
    o.support.checkOn ||
      o.each(['radio', 'checkbox'], function () {
        o.valHooks[this] = {
          get: function (e) {
            return null === e.getAttribute('value') ? 'on' : e.value;
          },
        };
      }),
    o.each(['radio', 'checkbox'], function () {
      o.valHooks[this] = o.extend(o.valHooks[this], {
        set: function (e, t) {
          if (o.isArray(t)) return (e.checked = o.inArray(o(e).val(), t) >= 0);
        },
      });
    });
  var C = /^(?:textarea|input|select)$/i,
    E = /^([^\.]*)?(?:\.(.+))?$/,
    k = /\bhover(\.\S+)?/,
    S = /^key/,
    A = /^(?:mouse|contextmenu)|click/,
    L = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
    j = function (e) {
      var t = L.exec(e);
      return (
        t && ((t[1] = (t[1] || '').toLowerCase()), (t[3] = t[3] && new RegExp('(?:^|\\s)' + t[3] + '(?:\\s|$)'))), t
      );
    },
    D = function (e, t) {
      return (
        (!t[1] || e.nodeName.toLowerCase() === t[1]) && (!t[2] || e.id === t[2]) && (!t[3] || t[3].test(e.className))
      );
    },
    F = function (e) {
      return o.event.special.hover ? e : e.replace(k, 'mouseenter$1 mouseleave$1');
    };
  function M() {
    return !1;
  }
  function O() {
    return !0;
  }
  (o.event = {
    add: function (e, n, r, i, a) {
      var s, l, u, c, f, d, p, h, m, g, y;
      if (3 !== e.nodeType && 8 !== e.nodeType && n && r && (s = o._data(e))) {
        for (
          r.handler && (r = (m = r).handler),
            r.guid || (r.guid = o.guid++),
            (u = s.events) || (s.events = u = {}),
            (l = s.handle) ||
              ((s.handle = l =
                function (e) {
                  return void 0 === o || (e && o.event.triggered === e.type)
                    ? t
                    : o.event.dispatch.apply(l.elem, arguments);
                }),
              (l.elem = e)),
            n = F(n).split(' '),
            c = 0;
          c < n.length;
          c++
        )
          (d = (f = E.exec(n[c]) || [])[1]),
            (p = (f[2] || '').split('.').sort()),
            (y = o.event.special[d] || {}),
            (d = (a ? y.delegateType : y.bindType) || d),
            (y = o.event.special[d] || {}),
            (h = o.extend(
              { type: d, origType: f[1], data: i, handler: r, guid: r.guid, selector: a, namespace: p.join('.') },
              m
            )),
            a && ((h.quick = j(a)), !h.quick && o.expr.match.POS.test(a) && (h.isPositional = !0)),
            (g = u[d]) ||
              (((g = u[d] = []).delegateCount = 0),
              (y.setup && !1 !== y.setup.call(e, i, p, l)) ||
                (e.addEventListener ? e.addEventListener(d, l, !1) : e.attachEvent && e.attachEvent('on' + d, l))),
            y.add && (y.add.call(e, h), h.handler.guid || (h.handler.guid = r.guid)),
            a ? g.splice(g.delegateCount++, 0, h) : g.push(h),
            (o.event.global[d] = !0);
        e = null;
      }
    },
    global: {},
    remove: function (e, t, n, r) {
      var i,
        a,
        s,
        l,
        u,
        c,
        f,
        d,
        p,
        h,
        m,
        g = o.hasData(e) && o._data(e);
      if (g && (f = g.events)) {
        for (t = F(t || '').split(' '), i = 0; i < t.length; i++) {
          if (((s = (a = E.exec(t[i]) || [])[1]), (l = a[2]), !s)) {
            for (c in ((l = l ? '.' + l : ''), f)) o.event.remove(e, c + l, n, r);
            return;
          }
          if (
            ((d = o.event.special[s] || {}),
            (u = (h = f[(s = (r ? d.delegateType : d.bindType) || s)] || []).length),
            (l = l ? new RegExp('(^|\\.)' + l.split('.').sort().join('\\.(?:.*\\.)?') + '(\\.|$)') : null),
            n || l || r || d.remove)
          )
            for (c = 0; c < h.length; c++)
              (m = h[c]),
                (n && n.guid !== m.guid) ||
                  (l && !l.test(m.namespace)) ||
                  ((!r || r === m.selector || ('**' === r && m.selector)) &&
                    (h.splice(c--, 1), m.selector && h.delegateCount--, d.remove && d.remove.call(e, m)));
          else h.length = 0;
          0 === h.length &&
            u !== h.length &&
            ((d.teardown && !1 !== d.teardown.call(e, l)) || o.removeEvent(e, s, g.handle), delete f[s]);
        }
        o.isEmptyObject(f) && ((p = g.handle) && (p.elem = null), o.removeData(e, ['events', 'handle'], !0));
      }
    },
    customEvent: { getData: !0, setData: !0, changeData: !0 },
    trigger: function (n, r, i, a) {
      if (!i || (3 !== i.nodeType && 8 !== i.nodeType)) {
        var s,
          l,
          u,
          c,
          f,
          d,
          p,
          h,
          m,
          g,
          y = n.type || n,
          v = [];
        if (
          (y.indexOf('!') >= 0 && ((y = y.slice(0, -1)), (l = !0)),
          y.indexOf('.') >= 0 && ((v = y.split('.')), (y = v.shift()), v.sort()),
          (i && !o.event.customEvent[y]) || o.event.global[y])
        )
          if (
            (((n = 'object' == typeof n ? (n[o.expando] ? n : new o.Event(y, n)) : new o.Event(y)).type = y),
            (n.isTrigger = !0),
            (n.exclusive = l),
            (n.namespace = v.join('.')),
            (n.namespace_re = n.namespace ? new RegExp('(^|\\.)' + v.join('\\.(?:.*\\.)?') + '(\\.|$)') : null),
            (d = y.indexOf(':') < 0 ? 'on' + y : ''),
            (!a && i) || n.preventDefault(),
            i)
          ) {
            if (
              ((n.result = t),
              n.target || (n.target = i),
              (r = null != r ? o.makeArray(r) : []).unshift(n),
              !(p = o.event.special[y] || {}).trigger || !1 !== p.trigger.apply(i, r))
            ) {
              if (((m = [[i, p.bindType || y]]), !a && !p.noBubble && !o.isWindow(i))) {
                for (g = p.delegateType || y, f = null, c = i.parentNode; c; c = c.parentNode) m.push([c, g]), (f = c);
                f && f === i.ownerDocument && m.push([f.defaultView || f.parentWindow || e, g]);
              }
              for (
                u = 0;
                u < m.length &&
                ((c = m[u][0]),
                (n.type = m[u][1]),
                (h = (o._data(c, 'events') || {})[n.type] && o._data(c, 'handle')) && h.apply(c, r),
                (h = d && c[d]) && o.acceptData(c) && h.apply(c, r),
                !n.isPropagationStopped());
                u++
              );
              return (
                (n.type = y),
                n.isDefaultPrevented() ||
                  (p._default && !1 !== p._default.apply(i.ownerDocument, r)) ||
                  ('click' === y && o.nodeName(i, 'a')) ||
                  !o.acceptData(i) ||
                  (d &&
                    i[y] &&
                    (('focus' !== y && 'blur' !== y) || 0 !== n.target.offsetWidth) &&
                    !o.isWindow(i) &&
                    ((f = i[d]) && (i[d] = null),
                    (o.event.triggered = y),
                    i[y](),
                    (o.event.triggered = t),
                    f && (i[d] = f))),
                n.result
              );
            }
          } else for (u in (s = o.cache)) s[u].events && s[u].events[y] && o.event.trigger(n, r, s[u].handle.elem, !0);
      }
    },
    dispatch: function (n) {
      n = o.event.fix(n || e.event);
      var r,
        i,
        a,
        s,
        l,
        u,
        c,
        f,
        d,
        p,
        h = (o._data(this, 'events') || {})[n.type] || [],
        m = h.delegateCount,
        g = [].slice.call(arguments, 0),
        y = !n.exclusive && !n.namespace,
        v = (o.event.special[n.type] || {}).handle,
        b = [];
      if (((g[0] = n), (n.delegateTarget = this), m && !n.target.disabled && (!n.button || 'click' !== n.type)))
        for (a = n.target; a != this; a = a.parentNode || this) {
          for (l = {}, c = [], r = 0; r < m; r++)
            (p = l[(d = (f = h[r]).selector)]),
              f.isPositional
                ? (p = (p || (l[d] = o(d))).index(a) >= 0)
                : p === t && (p = l[d] = f.quick ? D(a, f.quick) : o(a).is(d)),
              p && c.push(f);
          c.length && b.push({ elem: a, matches: c });
        }
      for (
        h.length > m && b.push({ elem: this, matches: h.slice(m) }), r = 0;
        r < b.length && !n.isPropagationStopped();
        r++
      )
        for (u = b[r], n.currentTarget = u.elem, i = 0; i < u.matches.length && !n.isImmediatePropagationStopped(); i++)
          (f = u.matches[i]),
            (y || (!n.namespace && !f.namespace) || (n.namespace_re && n.namespace_re.test(f.namespace))) &&
              ((n.data = f.data),
              (n.handleObj = f),
              (s = (v || f.handler).apply(u.elem, g)) !== t &&
                ((n.result = s), !1 === s && (n.preventDefault(), n.stopPropagation())));
      return n.result;
    },
    props:
      'attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which'.split(
        ' '
      ),
    fixHooks: {},
    keyHooks: {
      props: 'char charCode key keyCode'.split(' '),
      filter: function (e, t) {
        return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e;
      },
    },
    mouseHooks: {
      props:
        'button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement wheelDelta'.split(
          ' '
        ),
      filter: function (e, r) {
        var i,
          o,
          a,
          s = r.button,
          l = r.fromElement;
        return (
          null == e.pageX &&
            null != r.clientX &&
            ((o = (i = e.target.ownerDocument || n).documentElement),
            (a = i.body),
            (e.pageX =
              r.clientX +
              ((o && o.scrollLeft) || (a && a.scrollLeft) || 0) -
              ((o && o.clientLeft) || (a && a.clientLeft) || 0)),
            (e.pageY =
              r.clientY +
              ((o && o.scrollTop) || (a && a.scrollTop) || 0) -
              ((o && o.clientTop) || (a && a.clientTop) || 0))),
          !e.relatedTarget && l && (e.relatedTarget = l === e.target ? r.toElement : l),
          e.which || s === t || (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0),
          e
        );
      },
    },
    fix: function (e) {
      if (e[o.expando]) return e;
      var r,
        i,
        a = e,
        s = o.event.fixHooks[e.type] || {},
        l = s.props ? this.props.concat(s.props) : this.props;
      for (e = o.Event(a), r = l.length; r; ) e[(i = l[--r])] = a[i];
      return (
        e.target || (e.target = a.srcElement || n),
        3 === e.target.nodeType && (e.target = e.target.parentNode),
        e.metaKey === t && (e.metaKey = e.ctrlKey),
        s.filter ? s.filter(e, a) : e
      );
    },
    special: {
      ready: { setup: o.bindReady },
      focus: { delegateType: 'focusin', noBubble: !0 },
      blur: { delegateType: 'focusout', noBubble: !0 },
      beforeunload: {
        setup: function (e, t, n) {
          o.isWindow(this) && (this.onbeforeunload = n);
        },
        teardown: function (e, t) {
          this.onbeforeunload === t && (this.onbeforeunload = null);
        },
      },
    },
    simulate: function (e, t, n, r) {
      var i = o.extend(new o.Event(), n, { type: e, isSimulated: !0, originalEvent: {} });
      r ? o.event.trigger(i, null, t) : o.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault();
    },
  }),
    (o.event.handle = o.event.dispatch),
    (o.removeEvent = n.removeEventListener
      ? function (e, t, n) {
          e.removeEventListener && e.removeEventListener(t, n, !1);
        }
      : function (e, t, n) {
          e.detachEvent && e.detachEvent('on' + t, n);
        }),
    (o.Event = function (e, t) {
      if (!(this instanceof o.Event)) return new o.Event(e, t);
      e && e.type
        ? ((this.originalEvent = e),
          (this.type = e.type),
          (this.isDefaultPrevented =
            e.defaultPrevented || !1 === e.returnValue || (e.getPreventDefault && e.getPreventDefault()) ? O : M))
        : (this.type = e),
        t && o.extend(this, t),
        (this.timeStamp = (e && e.timeStamp) || o.now()),
        (this[o.expando] = !0);
    }),
    (o.Event.prototype = {
      preventDefault: function () {
        this.isDefaultPrevented = O;
        var e = this.originalEvent;
        e && (e.preventDefault ? e.preventDefault() : (e.returnValue = !1));
      },
      stopPropagation: function () {
        this.isPropagationStopped = O;
        var e = this.originalEvent;
        e && (e.stopPropagation && e.stopPropagation(), (e.cancelBubble = !0));
      },
      stopImmediatePropagation: function () {
        (this.isImmediatePropagationStopped = O), this.stopPropagation();
      },
      isDefaultPrevented: M,
      isPropagationStopped: M,
      isImmediatePropagationStopped: M,
    }),
    o.each({ mouseenter: 'mouseover', mouseleave: 'mouseout' }, function (e, t) {
      o.event.special[e] = o.event.special[t] = {
        delegateType: t,
        bindType: t,
        handle: function (e) {
          var t,
            n,
            r = this,
            i = e.relatedTarget,
            a = e.handleObj;
          return (
            a.selector,
            (i && a.origType !== e.type && (i === r || o.contains(r, i))) ||
              ((t = e.type), (e.type = a.origType), (n = a.handler.apply(this, arguments)), (e.type = t)),
            n
          );
        },
      };
    }),
    o.support.submitBubbles ||
      (o.event.special.submit = {
        setup: function () {
          if (o.nodeName(this, 'form')) return !1;
          o.event.add(this, 'click._submit keypress._submit', function (e) {
            var n = e.target,
              r = o.nodeName(n, 'input') || o.nodeName(n, 'button') ? n.form : t;
            r &&
              !r._submit_attached &&
              (o.event.add(r, 'submit._submit', function (e) {
                this.parentNode && o.event.simulate('submit', this.parentNode, e, !0);
              }),
              (r._submit_attached = !0));
          });
        },
        teardown: function () {
          if (o.nodeName(this, 'form')) return !1;
          o.event.remove(this, '._submit');
        },
      }),
    o.support.changeBubbles ||
      (o.event.special.change = {
        setup: function () {
          if (C.test(this.nodeName))
            return (
              ('checkbox' !== this.type && 'radio' !== this.type) ||
                (o.event.add(this, 'propertychange._change', function (e) {
                  'checked' === e.originalEvent.propertyName && (this._just_changed = !0);
                }),
                o.event.add(this, 'click._change', function (e) {
                  this._just_changed && ((this._just_changed = !1), o.event.simulate('change', this, e, !0));
                })),
              !1
            );
          o.event.add(this, 'beforeactivate._change', function (e) {
            var t = e.target;
            C.test(t.nodeName) &&
              !t._change_attached &&
              (o.event.add(t, 'change._change', function (e) {
                this.parentNode && !e.isSimulated && o.event.simulate('change', this.parentNode, e, !0);
              }),
              (t._change_attached = !0));
          });
        },
        handle: function (e) {
          var t = e.target;
          if (this !== t || e.isSimulated || e.isTrigger || ('radio' !== t.type && 'checkbox' !== t.type))
            return e.handleObj.handler.apply(this, arguments);
        },
        teardown: function () {
          return o.event.remove(this, '._change'), C.test(this.nodeName);
        },
      }),
    o.support.focusinBubbles ||
      o.each({ focus: 'focusin', blur: 'focusout' }, function (e, t) {
        var r = 0,
          i = function (e) {
            o.event.simulate(t, e.target, o.event.fix(e), !0);
          };
        o.event.special[t] = {
          setup: function () {
            0 == r++ && n.addEventListener(e, i, !0);
          },
          teardown: function () {
            0 == --r && n.removeEventListener(e, i, !0);
          },
        };
      }),
    o.fn.extend({
      on: function (e, n, r, i, a) {
        var s, l;
        if ('object' == typeof e) {
          for (l in ('string' != typeof n && ((r = n), (n = t)), e)) this.on(l, n, r, e[l], a);
          return this;
        }
        if (
          (null == r && null == i
            ? ((i = n), (r = n = t))
            : null == i && ('string' == typeof n ? ((i = r), (r = t)) : ((i = r), (r = n), (n = t))),
          !1 === i)
        )
          i = M;
        else if (!i) return this;
        return (
          1 === a &&
            ((s = i),
            ((i = function (e) {
              return o().off(e), s.apply(this, arguments);
            }).guid = s.guid || (s.guid = o.guid++))),
          this.each(function () {
            o.event.add(this, e, i, r, n);
          })
        );
      },
      one: function (e, t, n, r) {
        return this.on.call(this, e, t, n, r, 1);
      },
      off: function (e, n, r) {
        if (e && e.preventDefault && e.handleObj) {
          var i = e.handleObj;
          return (
            o(e.delegateTarget).off(i.namespace ? i.type + '.' + i.namespace : i.type, i.selector, i.handler), this
          );
        }
        if ('object' == typeof e) {
          for (var a in e) this.off(a, n, e[a]);
          return this;
        }
        return (
          (!1 !== n && 'function' != typeof n) || ((r = n), (n = t)),
          !1 === r && (r = M),
          this.each(function () {
            o.event.remove(this, e, r, n);
          })
        );
      },
      bind: function (e, t, n) {
        return this.on(e, null, t, n);
      },
      unbind: function (e, t) {
        return this.off(e, null, t);
      },
      live: function (e, t, n) {
        return o(this.context).on(e, this.selector, t, n), this;
      },
      die: function (e, t) {
        return o(this.context).off(e, this.selector || '**', t), this;
      },
      delegate: function (e, t, n, r) {
        return this.on(t, e, n, r);
      },
      undelegate: function (e, t, n) {
        return 1 == arguments.length ? this.off(e, '**') : this.off(t, e, n);
      },
      trigger: function (e, t) {
        return this.each(function () {
          o.event.trigger(e, t, this);
        });
      },
      triggerHandler: function (e, t) {
        if (this[0]) return o.event.trigger(e, t, this[0], !0);
      },
      toggle: function (e) {
        var t = arguments,
          n = e.guid || o.guid++,
          r = 0,
          i = function (n) {
            var i = (o._data(this, 'lastToggle' + e.guid) || 0) % r;
            return o._data(this, 'lastToggle' + e.guid, i + 1), n.preventDefault(), t[i].apply(this, arguments) || !1;
          };
        for (i.guid = n; r < t.length; ) t[r++].guid = n;
        return this.click(i);
      },
      hover: function (e, t) {
        return this.mouseenter(e).mouseleave(t || e);
      },
    }),
    o.each(
      'blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'.split(
        ' '
      ),
      function (e, t) {
        (o.fn[t] = function (e, n) {
          return null == n && ((n = e), (e = null)), arguments.length > 0 ? this.bind(t, e, n) : this.trigger(t);
        }),
          o.attrFn && (o.attrFn[t] = !0),
          S.test(t) && (o.event.fixHooks[t] = o.event.keyHooks),
          A.test(t) && (o.event.fixHooks[t] = o.event.mouseHooks);
      }
    ),
    (function () {
      var e =
          /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
        r = 'sizcache' + (Math.random() + '').replace('.', ''),
        i = 0,
        a = Object.prototype.toString,
        s = !1,
        l = !0,
        u = /\\/g,
        c = /\r\n/g,
        f = /\W/;
      [0, 0].sort(function () {
        return (l = !1), 0;
      });
      var d = function (t, r, i, o) {
        i = i || [];
        var s = (r = r || n);
        if (1 !== r.nodeType && 9 !== r.nodeType) return [];
        if (!t || 'string' != typeof t) return i;
        var l,
          u,
          c,
          f,
          p,
          g,
          y,
          v,
          b = !0,
          x = d.isXML(r),
          T = [],
          N = t;
        do {
          if ((e.exec(''), (l = e.exec(N)) && ((N = l[3]), T.push(l[1]), l[2]))) {
            f = l[3];
            break;
          }
        } while (l);
        if (T.length > 1 && m.exec(t))
          if (2 === T.length && h.relative[T[0]]) u = C(T[0] + T[1], r, o);
          else
            for (u = h.relative[T[0]] ? [r] : d(T.shift(), r); T.length; )
              (t = T.shift()), h.relative[t] && (t += T.shift()), (u = C(t, u, o));
        else if (
          (!o &&
            T.length > 1 &&
            9 === r.nodeType &&
            !x &&
            h.match.ID.test(T[0]) &&
            !h.match.ID.test(T[T.length - 1]) &&
            (r = (p = d.find(T.shift(), r, x)).expr ? d.filter(p.expr, p.set)[0] : p.set[0]),
          r)
        )
          for (
            u = (p = o
              ? { expr: T.pop(), set: w(o) }
              : d.find(
                  T.pop(),
                  1 !== T.length || ('~' !== T[0] && '+' !== T[0]) || !r.parentNode ? r : r.parentNode,
                  x
                )).expr
              ? d.filter(p.expr, p.set)
              : p.set,
              T.length > 0 ? (c = w(u)) : (b = !1);
            T.length;

          )
            (y = g = T.pop()), h.relative[g] ? (y = T.pop()) : (g = ''), null == y && (y = r), h.relative[g](c, y, x);
        else c = T = [];
        if ((c || (c = u), c || d.error(g || t), '[object Array]' === a.call(c)))
          if (b)
            if (r && 1 === r.nodeType)
              for (v = 0; null != c[v]; v++)
                c[v] && (!0 === c[v] || (1 === c[v].nodeType && d.contains(r, c[v]))) && i.push(u[v]);
            else for (v = 0; null != c[v]; v++) c[v] && 1 === c[v].nodeType && i.push(u[v]);
          else i.push.apply(i, c);
        else w(c, i);
        return f && (d(f, s, i, o), d.uniqueSort(i)), i;
      };
      (d.uniqueSort = function (e) {
        if (v && ((s = l), e.sort(v), s)) for (var t = 1; t < e.length; t++) e[t] === e[t - 1] && e.splice(t--, 1);
        return e;
      }),
        (d.matches = function (e, t) {
          return d(e, null, null, t);
        }),
        (d.matchesSelector = function (e, t) {
          return d(t, null, null, [e]).length > 0;
        }),
        (d.find = function (e, t, n) {
          var r, i, o, a, s, l;
          if (!e) return [];
          for (i = 0, o = h.order.length; i < o; i++)
            if (
              ((s = h.order[i]),
              (a = h.leftMatch[s].exec(e)) &&
                ((l = a[1]),
                a.splice(1, 1),
                '\\' !== l.substr(l.length - 1) &&
                  ((a[1] = (a[1] || '').replace(u, '')), null != (r = h.find[s](a, t, n)))))
            ) {
              e = e.replace(h.match[s], '');
              break;
            }
          return r || (r = void 0 !== t.getElementsByTagName ? t.getElementsByTagName('*') : []), { set: r, expr: e };
        }),
        (d.filter = function (e, n, r, i) {
          for (var o, a, s, l, u, c, f, p, m, g = e, y = [], v = n, b = n && n[0] && d.isXML(n[0]); e && n.length; ) {
            for (s in h.filter)
              if (null != (o = h.leftMatch[s].exec(e)) && o[2]) {
                if (((c = h.filter[s]), (f = o[1]), (a = !1), o.splice(1, 1), '\\' === f.substr(f.length - 1)))
                  continue;
                if ((v === y && (y = []), h.preFilter[s]))
                  if ((o = h.preFilter[s](o, v, r, y, i, b))) {
                    if (!0 === o) continue;
                  } else a = l = !0;
                if (o)
                  for (p = 0; null != (u = v[p]); p++)
                    u &&
                      ((m = i ^ (l = c(u, o, p, v))),
                      r && null != l ? (m ? (a = !0) : (v[p] = !1)) : m && (y.push(u), (a = !0)));
                if (l !== t) {
                  if ((r || (v = y), (e = e.replace(h.match[s], '')), !a)) return [];
                  break;
                }
              }
            if (e === g) {
              if (null != a) break;
              d.error(e);
            }
            g = e;
          }
          return v;
        }),
        (d.error = function (e) {
          throw 'Syntax error, unrecognized expression: ' + e;
        });
      var p = (d.getText = function (e) {
          var t,
            n,
            r = e.nodeType,
            i = '';
          if (r) {
            if (1 === r) {
              if ('string' == typeof e.textContent) return e.textContent;
              if ('string' == typeof e.innerText) return e.innerText.replace(c, '');
              for (e = e.firstChild; e; e = e.nextSibling) i += p(e);
            } else if (3 === r || 4 === r) return e.nodeValue;
          } else for (t = 0; (n = e[t]); t++) 8 !== n.nodeType && (i += p(n));
          return i;
        }),
        h = (d.selectors = {
          order: ['ID', 'NAME', 'TAG'],
          match: {
            ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
            ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
            TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
            CHILD:
              /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
            POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
            PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/,
          },
          leftMatch: {},
          attrMap: { class: 'className', for: 'htmlFor' },
          attrHandle: {
            href: function (e) {
              return e.getAttribute('href');
            },
            type: function (e) {
              return e.getAttribute('type');
            },
          },
          relative: {
            '+': function (e, t) {
              var n = 'string' == typeof t,
                r = n && !f.test(t),
                i = n && !r;
              r && (t = t.toLowerCase());
              for (var o, a = 0, s = e.length; a < s; a++)
                if ((o = e[a])) {
                  for (; (o = o.previousSibling) && 1 !== o.nodeType; );
                  e[a] = i || (o && o.nodeName.toLowerCase() === t) ? o || !1 : o === t;
                }
              i && d.filter(t, e, !0);
            },
            '>': function (e, t) {
              var n,
                r = 'string' == typeof t,
                i = 0,
                o = e.length;
              if (r && !f.test(t)) {
                for (t = t.toLowerCase(); i < o; i++)
                  if ((n = e[i])) {
                    var a = n.parentNode;
                    e[i] = a.nodeName.toLowerCase() === t && a;
                  }
              } else {
                for (; i < o; i++) (n = e[i]) && (e[i] = r ? n.parentNode : n.parentNode === t);
                r && d.filter(t, e, !0);
              }
            },
            '': function (e, t, n) {
              var r,
                o = i++,
                a = N;
              'string' != typeof t || f.test(t) || ((r = t = t.toLowerCase()), (a = T)), a('parentNode', t, o, e, r, n);
            },
            '~': function (e, t, n) {
              var r,
                o = i++,
                a = N;
              'string' != typeof t || f.test(t) || ((r = t = t.toLowerCase()), (a = T)),
                a('previousSibling', t, o, e, r, n);
            },
          },
          find: {
            ID: function (e, t, n) {
              if (void 0 !== t.getElementById && !n) {
                var r = t.getElementById(e[1]);
                return r && r.parentNode ? [r] : [];
              }
            },
            NAME: function (e, t) {
              if (void 0 !== t.getElementsByName) {
                for (var n = [], r = t.getElementsByName(e[1]), i = 0, o = r.length; i < o; i++)
                  r[i].getAttribute('name') === e[1] && n.push(r[i]);
                return 0 === n.length ? null : n;
              }
            },
            TAG: function (e, t) {
              if (void 0 !== t.getElementsByTagName) return t.getElementsByTagName(e[1]);
            },
          },
          preFilter: {
            CLASS: function (e, t, n, r, i, o) {
              if (((e = ' ' + e[1].replace(u, '') + ' '), o)) return e;
              for (var a, s = 0; null != (a = t[s]); s++)
                a &&
                  (i ^ (a.className && (' ' + a.className + ' ').replace(/[\t\n\r]/g, ' ').indexOf(e) >= 0)
                    ? n || r.push(a)
                    : n && (t[s] = !1));
              return !1;
            },
            ID: function (e) {
              return e[1].replace(u, '');
            },
            TAG: function (e, t) {
              return e[1].replace(u, '').toLowerCase();
            },
            CHILD: function (e) {
              if ('nth' === e[1]) {
                e[2] || d.error(e[0]), (e[2] = e[2].replace(/^\+|\s*/g, ''));
                var t = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
                  ('even' === e[2] ? '2n' : 'odd' === e[2] && '2n+1') || (!/\D/.test(e[2]) && '0n+' + e[2]) || e[2]
                );
                (e[2] = t[1] + (t[2] || 1) - 0), (e[3] = t[3] - 0);
              } else e[2] && d.error(e[0]);
              return (e[0] = i++), e;
            },
            ATTR: function (e, t, n, r, i, o) {
              var a = (e[1] = e[1].replace(u, ''));
              return (
                !o && h.attrMap[a] && (e[1] = h.attrMap[a]),
                (e[4] = (e[4] || e[5] || '').replace(u, '')),
                '~=' === e[2] && (e[4] = ' ' + e[4] + ' '),
                e
              );
            },
            PSEUDO: function (t, n, r, i, o) {
              if ('not' === t[1]) {
                if (!((e.exec(t[3]) || '').length > 1 || /^\w/.test(t[3]))) {
                  var a = d.filter(t[3], n, r, !0 ^ o);
                  return r || i.push.apply(i, a), !1;
                }
                t[3] = d(t[3], null, null, n);
              } else if (h.match.POS.test(t[0]) || h.match.CHILD.test(t[0])) return !0;
              return t;
            },
            POS: function (e) {
              return e.unshift(!0), e;
            },
          },
          filters: {
            enabled: function (e) {
              return !1 === e.disabled && 'hidden' !== e.type;
            },
            disabled: function (e) {
              return !0 === e.disabled;
            },
            checked: function (e) {
              return !0 === e.checked;
            },
            selected: function (e) {
              return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected;
            },
            parent: function (e) {
              return !!e.firstChild;
            },
            empty: function (e) {
              return !e.firstChild;
            },
            has: function (e, t, n) {
              return !!d(n[3], e).length;
            },
            header: function (e) {
              return /h\d/i.test(e.nodeName);
            },
            text: function (e) {
              var t = e.getAttribute('type'),
                n = e.type;
              return 'input' === e.nodeName.toLowerCase() && 'text' === n && (t === n || null === t);
            },
            radio: function (e) {
              return 'input' === e.nodeName.toLowerCase() && 'radio' === e.type;
            },
            checkbox: function (e) {
              return 'input' === e.nodeName.toLowerCase() && 'checkbox' === e.type;
            },
            file: function (e) {
              return 'input' === e.nodeName.toLowerCase() && 'file' === e.type;
            },
            password: function (e) {
              return 'input' === e.nodeName.toLowerCase() && 'password' === e.type;
            },
            submit: function (e) {
              var t = e.nodeName.toLowerCase();
              return ('input' === t || 'button' === t) && 'submit' === e.type;
            },
            image: function (e) {
              return 'input' === e.nodeName.toLowerCase() && 'image' === e.type;
            },
            reset: function (e) {
              var t = e.nodeName.toLowerCase();
              return ('input' === t || 'button' === t) && 'reset' === e.type;
            },
            button: function (e) {
              var t = e.nodeName.toLowerCase();
              return ('input' === t && 'button' === e.type) || 'button' === t;
            },
            input: function (e) {
              return /input|select|textarea|button/i.test(e.nodeName);
            },
            focus: function (e) {
              return e === e.ownerDocument.activeElement;
            },
          },
          setFilters: {
            first: function (e, t) {
              return 0 === t;
            },
            last: function (e, t, n, r) {
              return t === r.length - 1;
            },
            even: function (e, t) {
              return t % 2 == 0;
            },
            odd: function (e, t) {
              return t % 2 == 1;
            },
            lt: function (e, t, n) {
              return t < n[3] - 0;
            },
            gt: function (e, t, n) {
              return t > n[3] - 0;
            },
            nth: function (e, t, n) {
              return n[3] - 0 === t;
            },
            eq: function (e, t, n) {
              return n[3] - 0 === t;
            },
          },
          filter: {
            PSEUDO: function (e, t, n, r) {
              var i = t[1],
                o = h.filters[i];
              if (o) return o(e, n, t, r);
              if ('contains' === i) return (e.textContent || e.innerText || p([e]) || '').indexOf(t[3]) >= 0;
              if ('not' === i) {
                for (var a = t[3], s = 0, l = a.length; s < l; s++) if (a[s] === e) return !1;
                return !0;
              }
              d.error(i);
            },
            CHILD: function (e, t) {
              var n,
                i,
                o,
                a,
                s,
                l,
                u = t[1],
                c = e;
              switch (u) {
                case 'only':
                case 'first':
                  for (; (c = c.previousSibling); ) if (1 === c.nodeType) return !1;
                  if ('first' === u) return !0;
                  c = e;
                case 'last':
                  for (; (c = c.nextSibling); ) if (1 === c.nodeType) return !1;
                  return !0;
                case 'nth':
                  if (((n = t[2]), (i = t[3]), 1 === n && 0 === i)) return !0;
                  if (((o = t[0]), (a = e.parentNode) && (a[r] !== o || !e.nodeIndex))) {
                    for (s = 0, c = a.firstChild; c; c = c.nextSibling) 1 === c.nodeType && (c.nodeIndex = ++s);
                    a[r] = o;
                  }
                  return (l = e.nodeIndex - i), 0 === n ? 0 === l : l % n == 0 && l / n >= 0;
              }
            },
            ID: function (e, t) {
              return 1 === e.nodeType && e.getAttribute('id') === t;
            },
            TAG: function (e, t) {
              return ('*' === t && 1 === e.nodeType) || (!!e.nodeName && e.nodeName.toLowerCase() === t);
            },
            CLASS: function (e, t) {
              return (' ' + (e.className || e.getAttribute('class')) + ' ').indexOf(t) > -1;
            },
            ATTR: function (e, t) {
              var n = t[1],
                r = d.attr
                  ? d.attr(e, n)
                  : h.attrHandle[n]
                  ? h.attrHandle[n](e)
                  : null != e[n]
                  ? e[n]
                  : e.getAttribute(n),
                i = r + '',
                o = t[2],
                a = t[4];
              return null == r
                ? '!=' === o
                : !o && d.attr
                ? null != r
                : '=' === o
                ? i === a
                : '*=' === o
                ? i.indexOf(a) >= 0
                : '~=' === o
                ? (' ' + i + ' ').indexOf(a) >= 0
                : a
                ? '!=' === o
                  ? i !== a
                  : '^=' === o
                  ? 0 === i.indexOf(a)
                  : '$=' === o
                  ? i.substr(i.length - a.length) === a
                  : '|=' === o && (i === a || i.substr(0, a.length + 1) === a + '-')
                : i && !1 !== r;
            },
            POS: function (e, t, n, r) {
              var i = t[2],
                o = h.setFilters[i];
              if (o) return o(e, n, t, r);
            },
          },
        }),
        m = h.match.POS,
        g = function (e, t) {
          return '\\' + (t - 0 + 1);
        };
      for (var y in h.match)
        (h.match[y] = new RegExp(h.match[y].source + /(?![^\[]*\])(?![^\(]*\))/.source)),
          (h.leftMatch[y] = new RegExp(/(^(?:.|\r|\n)*?)/.source + h.match[y].source.replace(/\\(\d+)/g, g)));
      var v,
        b,
        x,
        w = function (e, t) {
          return (e = Array.prototype.slice.call(e, 0)), t ? (t.push.apply(t, e), t) : e;
        };
      try {
        Array.prototype.slice.call(n.documentElement.childNodes, 0)[0].nodeType;
      } catch (e) {
        w = function (e, t) {
          var n = 0,
            r = t || [];
          if ('[object Array]' === a.call(e)) Array.prototype.push.apply(r, e);
          else if ('number' == typeof e.length) for (var i = e.length; n < i; n++) r.push(e[n]);
          else for (; e[n]; n++) r.push(e[n]);
          return r;
        };
      }
      function T(e, t, n, i, o, a) {
        for (var s = 0, l = i.length; s < l; s++) {
          var u = i[s];
          if (u) {
            var c = !1;
            for (u = u[e]; u; ) {
              if (u[r] === n) {
                c = i[u.sizset];
                break;
              }
              if ((1 !== u.nodeType || a || ((u[r] = n), (u.sizset = s)), u.nodeName.toLowerCase() === t)) {
                c = u;
                break;
              }
              u = u[e];
            }
            i[s] = c;
          }
        }
      }
      function N(e, t, n, i, o, a) {
        for (var s = 0, l = i.length; s < l; s++) {
          var u = i[s];
          if (u) {
            var c = !1;
            for (u = u[e]; u; ) {
              if (u[r] === n) {
                c = i[u.sizset];
                break;
              }
              if (1 === u.nodeType)
                if ((a || ((u[r] = n), (u.sizset = s)), 'string' != typeof t)) {
                  if (u === t) {
                    c = !0;
                    break;
                  }
                } else if (d.filter(t, [u]).length > 0) {
                  c = u;
                  break;
                }
              u = u[e];
            }
            i[s] = c;
          }
        }
      }
      n.documentElement.compareDocumentPosition
        ? (v = function (e, t) {
            return e === t
              ? ((s = !0), 0)
              : e.compareDocumentPosition && t.compareDocumentPosition
              ? 4 & e.compareDocumentPosition(t)
                ? -1
                : 1
              : e.compareDocumentPosition
              ? -1
              : 1;
          })
        : ((v = function (e, t) {
            if (e === t) return (s = !0), 0;
            if (e.sourceIndex && t.sourceIndex) return e.sourceIndex - t.sourceIndex;
            var n,
              r,
              i = [],
              o = [],
              a = e.parentNode,
              l = t.parentNode,
              u = a;
            if (a === l) return b(e, t);
            if (!a) return -1;
            if (!l) return 1;
            for (; u; ) i.unshift(u), (u = u.parentNode);
            for (u = l; u; ) o.unshift(u), (u = u.parentNode);
            (n = i.length), (r = o.length);
            for (var c = 0; c < n && c < r; c++) if (i[c] !== o[c]) return b(i[c], o[c]);
            return c === n ? b(e, o[c], -1) : b(i[c], t, 1);
          }),
          (b = function (e, t, n) {
            if (e === t) return n;
            for (var r = e.nextSibling; r; ) {
              if (r === t) return -1;
              r = r.nextSibling;
            }
            return 1;
          })),
        (function () {
          var e = n.createElement('div'),
            r = 'script' + new Date().getTime(),
            i = n.documentElement;
          (e.innerHTML = "<a name='" + r + "'/>"),
            i.insertBefore(e, i.firstChild),
            n.getElementById(r) &&
              ((h.find.ID = function (e, n, r) {
                if (void 0 !== n.getElementById && !r) {
                  var i = n.getElementById(e[1]);
                  return i
                    ? i.id === e[1] || (void 0 !== i.getAttributeNode && i.getAttributeNode('id').nodeValue === e[1])
                      ? [i]
                      : t
                    : [];
                }
              }),
              (h.filter.ID = function (e, t) {
                var n = void 0 !== e.getAttributeNode && e.getAttributeNode('id');
                return 1 === e.nodeType && n && n.nodeValue === t;
              })),
            i.removeChild(e),
            (i = e = null);
        })(),
        (x = n.createElement('div')).appendChild(n.createComment('')),
        x.getElementsByTagName('*').length > 0 &&
          (h.find.TAG = function (e, t) {
            var n = t.getElementsByTagName(e[1]);
            if ('*' === e[1]) {
              for (var r = [], i = 0; n[i]; i++) 1 === n[i].nodeType && r.push(n[i]);
              n = r;
            }
            return n;
          }),
        (x.innerHTML = "<a href='#'></a>"),
        x.firstChild &&
          void 0 !== x.firstChild.getAttribute &&
          '#' !== x.firstChild.getAttribute('href') &&
          (h.attrHandle.href = function (e) {
            return e.getAttribute('href', 2);
          }),
        (x = null),
        n.querySelectorAll &&
          (function () {
            var e = d,
              t = n.createElement('div');
            if (
              ((t.innerHTML = "<p class='TEST'></p>"), !t.querySelectorAll || 0 !== t.querySelectorAll('.TEST').length)
            ) {
              for (var r in ((d = function (t, r, i, o) {
                if (((r = r || n), !o && !d.isXML(r))) {
                  var a = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(t);
                  if (a && (1 === r.nodeType || 9 === r.nodeType)) {
                    if (a[1]) return w(r.getElementsByTagName(t), i);
                    if (a[2] && h.find.CLASS && r.getElementsByClassName) return w(r.getElementsByClassName(a[2]), i);
                  }
                  if (9 === r.nodeType) {
                    if ('body' === t && r.body) return w([r.body], i);
                    if (a && a[3]) {
                      var s = r.getElementById(a[3]);
                      if (!s || !s.parentNode) return w([], i);
                      if (s.id === a[3]) return w([s], i);
                    }
                    try {
                      return w(r.querySelectorAll(t), i);
                    } catch (e) {}
                  } else if (1 === r.nodeType && 'object' !== r.nodeName.toLowerCase()) {
                    var l = r,
                      u = r.getAttribute('id'),
                      c = u || '__sizzle__',
                      f = r.parentNode,
                      p = /^\s*[+~]/.test(t);
                    u ? (c = c.replace(/'/g, '\\$&')) : r.setAttribute('id', c), p && f && (r = r.parentNode);
                    try {
                      if (!p || f) return w(r.querySelectorAll("[id='" + c + "'] " + t), i);
                    } catch (e) {
                    } finally {
                      u || l.removeAttribute('id');
                    }
                  }
                }
                return e(t, r, i, o);
              }),
              e))
                d[r] = e[r];
              t = null;
            }
          })(),
        (function () {
          var e = n.documentElement,
            t = e.matchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.msMatchesSelector;
          if (t) {
            var r = !t.call(n.createElement('div'), 'div'),
              i = !1;
            try {
              t.call(n.documentElement, "[test!='']:sizzle");
            } catch (e) {
              i = !0;
            }
            d.matchesSelector = function (e, n) {
              if (((n = n.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']")), !d.isXML(e)))
                try {
                  if (i || (!h.match.PSEUDO.test(n) && !/!=/.test(n))) {
                    var o = t.call(e, n);
                    if (o || !r || (e.document && 11 !== e.document.nodeType)) return o;
                  }
                } catch (e) {}
              return d(n, null, null, [e]).length > 0;
            };
          }
        })(),
        (function () {
          var e = n.createElement('div');
          (e.innerHTML = "<div class='test e'></div><div class='test'></div>"),
            e.getElementsByClassName &&
              0 !== e.getElementsByClassName('e').length &&
              ((e.lastChild.className = 'e'),
              1 !== e.getElementsByClassName('e').length &&
                (h.order.splice(1, 0, 'CLASS'),
                (h.find.CLASS = function (e, t, n) {
                  if (void 0 !== t.getElementsByClassName && !n) return t.getElementsByClassName(e[1]);
                }),
                (e = null)));
        })(),
        n.documentElement.contains
          ? (d.contains = function (e, t) {
              return e !== t && (!e.contains || e.contains(t));
            })
          : n.documentElement.compareDocumentPosition
          ? (d.contains = function (e, t) {
              return !!(16 & e.compareDocumentPosition(t));
            })
          : (d.contains = function () {
              return !1;
            }),
        (d.isXML = function (e) {
          var t = (e ? e.ownerDocument || e : 0).documentElement;
          return !!t && 'HTML' !== t.nodeName;
        });
      var C = function (e, t, n) {
        for (var r, i = [], o = '', a = t.nodeType ? [t] : t; (r = h.match.PSEUDO.exec(e)); )
          (o += r[0]), (e = e.replace(h.match.PSEUDO, ''));
        e = h.relative[e] ? e + '*' : e;
        for (var s = 0, l = a.length; s < l; s++) d(e, a[s], i, n);
        return d.filter(o, i);
      };
      (d.attr = o.attr),
        (d.selectors.attrMap = {}),
        (o.find = d),
        (o.expr = d.selectors),
        (o.expr[':'] = o.expr.filters),
        (o.unique = d.uniqueSort),
        (o.text = d.getText),
        (o.isXMLDoc = d.isXML),
        (o.contains = d.contains);
    })();
  var _ = /Until$/,
    H = /^(?:parents|prevUntil|prevAll)/,
    B = /,/,
    P = /^.[^:#\[\.,]*$/,
    q = Array.prototype.slice,
    W = o.expr.match.POS,
    I = { children: !0, contents: !0, next: !0, prev: !0 };
  function R(e) {
    return !e || !e.parentNode || 11 === e.parentNode.nodeType;
  }
  function $(e, t, n) {
    if (((t = t || 0), o.isFunction(t)))
      return o.grep(e, function (e, r) {
        return !!t.call(e, r, e) === n;
      });
    if (t.nodeType)
      return o.grep(e, function (e, r) {
        return (e === t) === n;
      });
    if ('string' == typeof t) {
      var r = o.grep(e, function (e) {
        return 1 === e.nodeType;
      });
      if (P.test(t)) return o.filter(t, r, !n);
      t = o.filter(t, r);
    }
    return o.grep(e, function (e, r) {
      return o.inArray(e, t) >= 0 === n;
    });
  }
  function X(e) {
    var t = z.split(' '),
      n = e.createDocumentFragment();
    if (n.createElement) for (; t.length; ) n.createElement(t.pop());
    return n;
  }
  o.fn.extend({
    find: function (e) {
      var t,
        n,
        r = this;
      if ('string' != typeof e)
        return o(e).filter(function () {
          for (t = 0, n = r.length; t < n; t++) if (o.contains(r[t], this)) return !0;
        });
      var i,
        a,
        s,
        l = this.pushStack('', 'find', e);
      for (t = 0, n = this.length; t < n; t++)
        if (((i = l.length), o.find(e, this[t], l), t > 0))
          for (a = i; a < l.length; a++)
            for (s = 0; s < i; s++)
              if (l[s] === l[a]) {
                l.splice(a--, 1);
                break;
              }
      return l;
    },
    has: function (e) {
      var t = o(e);
      return this.filter(function () {
        for (var e = 0, n = t.length; e < n; e++) if (o.contains(this, t[e])) return !0;
      });
    },
    not: function (e) {
      return this.pushStack($(this, e, !1), 'not', e);
    },
    filter: function (e) {
      return this.pushStack($(this, e, !0), 'filter', e);
    },
    is: function (e) {
      return (
        !!e &&
        ('string' == typeof e
          ? W.test(e)
            ? o(e, this.context).index(this[0]) >= 0
            : o.filter(e, this).length > 0
          : this.filter(e).length > 0)
      );
    },
    closest: function (e, t) {
      var n,
        r,
        i = [],
        a = this[0];
      if (o.isArray(e)) {
        for (var s = 1; a && a.ownerDocument && a !== t; ) {
          for (n = 0; n < e.length; n++) o(a).is(e[n]) && i.push({ selector: e[n], elem: a, level: s });
          (a = a.parentNode), s++;
        }
        return i;
      }
      var l = W.test(e) || 'string' != typeof e ? o(e, t || this.context) : 0;
      for (n = 0, r = this.length; n < r; n++)
        for (a = this[n]; a; ) {
          if (l ? l.index(a) > -1 : o.find.matchesSelector(a, e)) {
            i.push(a);
            break;
          }
          if (!(a = a.parentNode) || !a.ownerDocument || a === t || 11 === a.nodeType) break;
        }
      return (i = i.length > 1 ? o.unique(i) : i), this.pushStack(i, 'closest', e);
    },
    index: function (e) {
      return e
        ? 'string' == typeof e
          ? o.inArray(this[0], o(e))
          : o.inArray(e.jquery ? e[0] : e, this)
        : this[0] && this[0].parentNode
        ? this.prevAll().length
        : -1;
    },
    add: function (e, t) {
      var n = 'string' == typeof e ? o(e, t) : o.makeArray(e && e.nodeType ? [e] : e),
        r = o.merge(this.get(), n);
      return this.pushStack(R(n[0]) || R(r[0]) ? r : o.unique(r));
    },
    andSelf: function () {
      return this.add(this.prevObject);
    },
  }),
    o.each(
      {
        parent: function (e) {
          var t = e.parentNode;
          return t && 11 !== t.nodeType ? t : null;
        },
        parents: function (e) {
          return o.dir(e, 'parentNode');
        },
        parentsUntil: function (e, t, n) {
          return o.dir(e, 'parentNode', n);
        },
        next: function (e) {
          return o.nth(e, 2, 'nextSibling');
        },
        prev: function (e) {
          return o.nth(e, 2, 'previousSibling');
        },
        nextAll: function (e) {
          return o.dir(e, 'nextSibling');
        },
        prevAll: function (e) {
          return o.dir(e, 'previousSibling');
        },
        nextUntil: function (e, t, n) {
          return o.dir(e, 'nextSibling', n);
        },
        prevUntil: function (e, t, n) {
          return o.dir(e, 'previousSibling', n);
        },
        siblings: function (e) {
          return o.sibling(e.parentNode.firstChild, e);
        },
        children: function (e) {
          return o.sibling(e.firstChild);
        },
        contents: function (e) {
          return o.nodeName(e, 'iframe') ? e.contentDocument || e.contentWindow.document : o.makeArray(e.childNodes);
        },
      },
      function (e, t) {
        o.fn[e] = function (n, r) {
          var i = o.map(this, t, n),
            a = q.call(arguments);
          return (
            _.test(e) || (r = n),
            r && 'string' == typeof r && (i = o.filter(r, i)),
            (i = this.length > 1 && !I[e] ? o.unique(i) : i),
            (this.length > 1 || B.test(r)) && H.test(e) && (i = i.reverse()),
            this.pushStack(i, e, a.join(','))
          );
        };
      }
    ),
    o.extend({
      filter: function (e, t, n) {
        return (
          n && (e = ':not(' + e + ')'),
          1 === t.length ? (o.find.matchesSelector(t[0], e) ? [t[0]] : []) : o.find.matches(e, t)
        );
      },
      dir: function (e, n, r) {
        for (var i = [], a = e[n]; a && 9 !== a.nodeType && (r === t || 1 !== a.nodeType || !o(a).is(r)); )
          1 === a.nodeType && i.push(a), (a = a[n]);
        return i;
      },
      nth: function (e, t, n, r) {
        t = t || 1;
        for (var i = 0; e && (1 !== e.nodeType || ++i !== t); e = e[n]);
        return e;
      },
      sibling: function (e, t) {
        for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
        return n;
      },
    });
  var z =
      'abbr article aside audio canvas datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video',
    V = / jQuery\d+="(?:\d+|null)"/g,
    U = /^\s+/,
    G = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    J = /<([\w:]+)/,
    Y = /<tbody/i,
    Q = /<|&#?\w+;/,
    K = /<(?:script|style)/i,
    Z = /<(?:script|object|embed|option|style)/i,
    ee = new RegExp('<(?:' + z.replace(' ', '|') + ')', 'i'),
    te = /checked\s*(?:[^=]|=\s*.checked.)/i,
    ne = /\/(java|ecma)script/i,
    re = /^\s*<!(?:\[CDATA\[|\-\-)/,
    ie = {
      option: [1, "<select multiple='multiple'>", '</select>'],
      legend: [1, '<fieldset>', '</fieldset>'],
      thead: [1, '<table>', '</table>'],
      tr: [2, '<table><tbody>', '</tbody></table>'],
      td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
      col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
      area: [1, '<map>', '</map>'],
      _default: [0, '', ''],
    },
    oe = X(n);
  function ae(e, t) {
    return o.nodeName(e, 'table')
      ? e.getElementsByTagName('tbody')[0] || e.appendChild(e.ownerDocument.createElement('tbody'))
      : e;
  }
  function se(e, t) {
    if (1 === t.nodeType && o.hasData(e)) {
      var n,
        r,
        i,
        a = o._data(e),
        s = o._data(t, a),
        l = a.events;
      if (l)
        for (n in (delete s.handle, (s.events = {}), l))
          for (r = 0, i = l[n].length; r < i; r++)
            o.event.add(t, n + (l[n][r].namespace ? '.' : '') + l[n][r].namespace, l[n][r], l[n][r].data);
      s.data && (s.data = o.extend({}, s.data));
    }
  }
  function le(e, t) {
    var n;
    1 === t.nodeType &&
      (t.clearAttributes && t.clearAttributes(),
      t.mergeAttributes && t.mergeAttributes(e),
      'object' === (n = t.nodeName.toLowerCase())
        ? (t.outerHTML = e.outerHTML)
        : 'input' !== n || ('checkbox' !== e.type && 'radio' !== e.type)
        ? 'option' === n
          ? (t.selected = e.defaultSelected)
          : ('input' !== n && 'textarea' !== n) || (t.defaultValue = e.defaultValue)
        : (e.checked && (t.defaultChecked = t.checked = e.checked), t.value !== e.value && (t.value = e.value)),
      t.removeAttribute(o.expando));
  }
  function ue(e) {
    return void 0 !== e.getElementsByTagName
      ? e.getElementsByTagName('*')
      : void 0 !== e.querySelectorAll
      ? e.querySelectorAll('*')
      : [];
  }
  function ce(e) {
    ('checkbox' !== e.type && 'radio' !== e.type) || (e.defaultChecked = e.checked);
  }
  function fe(e) {
    var t = (e.nodeName || '').toLowerCase();
    'input' === t
      ? ce(e)
      : 'script' !== t && void 0 !== e.getElementsByTagName && o.grep(e.getElementsByTagName('input'), ce);
  }
  function de(e, t) {
    t.src
      ? o.ajax({ url: t.src, async: !1, dataType: 'script' })
      : o.globalEval((t.text || t.textContent || t.innerHTML || '').replace(re, '/*$0*/')),
      t.parentNode && t.parentNode.removeChild(t);
  }
  (ie.optgroup = ie.option),
    (ie.tbody = ie.tfoot = ie.colgroup = ie.caption = ie.thead),
    (ie.th = ie.td),
    o.support.htmlSerialize || (ie._default = [1, 'div<div>', '</div>']),
    o.fn.extend({
      text: function (e) {
        return o.isFunction(e)
          ? this.each(function (t) {
              var n = o(this);
              n.text(e.call(this, t, n.text()));
            })
          : 'object' != typeof e && e !== t
          ? this.empty().append(((this[0] && this[0].ownerDocument) || n).createTextNode(e))
          : o.text(this);
      },
      wrapAll: function (e) {
        if (o.isFunction(e))
          return this.each(function (t) {
            o(this).wrapAll(e.call(this, t));
          });
        if (this[0]) {
          var t = o(e, this[0].ownerDocument).eq(0).clone(!0);
          this[0].parentNode && t.insertBefore(this[0]),
            t
              .map(function () {
                for (var e = this; e.firstChild && 1 === e.firstChild.nodeType; ) e = e.firstChild;
                return e;
              })
              .append(this);
        }
        return this;
      },
      wrapInner: function (e) {
        return o.isFunction(e)
          ? this.each(function (t) {
              o(this).wrapInner(e.call(this, t));
            })
          : this.each(function () {
              var t = o(this),
                n = t.contents();
              n.length ? n.wrapAll(e) : t.append(e);
            });
      },
      wrap: function (e) {
        return this.each(function () {
          o(this).wrapAll(e);
        });
      },
      unwrap: function () {
        return this.parent()
          .each(function () {
            o.nodeName(this, 'body') || o(this).replaceWith(this.childNodes);
          })
          .end();
      },
      append: function () {
        return this.domManip(arguments, !0, function (e) {
          1 === this.nodeType && this.appendChild(e);
        });
      },
      prepend: function () {
        return this.domManip(arguments, !0, function (e) {
          1 === this.nodeType && this.insertBefore(e, this.firstChild);
        });
      },
      before: function () {
        if (this[0] && this[0].parentNode)
          return this.domManip(arguments, !1, function (e) {
            this.parentNode.insertBefore(e, this);
          });
        if (arguments.length) {
          var e = o(arguments[0]);
          return e.push.apply(e, this.toArray()), this.pushStack(e, 'before', arguments);
        }
      },
      after: function () {
        if (this[0] && this[0].parentNode)
          return this.domManip(arguments, !1, function (e) {
            this.parentNode.insertBefore(e, this.nextSibling);
          });
        if (arguments.length) {
          var e = this.pushStack(this, 'after', arguments);
          return e.push.apply(e, o(arguments[0]).toArray()), e;
        }
      },
      remove: function (e, t) {
        for (var n, r = 0; null != (n = this[r]); r++)
          (e && !o.filter(e, [n]).length) ||
            (t || 1 !== n.nodeType || (o.cleanData(n.getElementsByTagName('*')), o.cleanData([n])),
            n.parentNode && n.parentNode.removeChild(n));
        return this;
      },
      empty: function () {
        for (var e, t = 0; null != (e = this[t]); t++)
          for (1 === e.nodeType && o.cleanData(e.getElementsByTagName('*')); e.firstChild; )
            e.removeChild(e.firstChild);
        return this;
      },
      clone: function (e, t) {
        return (
          (e = null != e && e),
          (t = null == t ? e : t),
          this.map(function () {
            return o.clone(this, e, t);
          })
        );
      },
      html: function (e) {
        if (e === t) return this[0] && 1 === this[0].nodeType ? this[0].innerHTML.replace(V, '') : null;
        if (
          'string' != typeof e ||
          K.test(e) ||
          (!o.support.leadingWhitespace && U.test(e)) ||
          ie[(J.exec(e) || ['', ''])[1].toLowerCase()]
        )
          o.isFunction(e)
            ? this.each(function (t) {
                var n = o(this);
                n.html(e.call(this, t, n.html()));
              })
            : this.empty().append(e);
        else {
          e = e.replace(G, '<$1></$2>');
          try {
            for (var n = 0, r = this.length; n < r; n++)
              1 === this[n].nodeType && (o.cleanData(this[n].getElementsByTagName('*')), (this[n].innerHTML = e));
          } catch (t) {
            this.empty().append(e);
          }
        }
        return this;
      },
      replaceWith: function (e) {
        return this[0] && this[0].parentNode
          ? o.isFunction(e)
            ? this.each(function (t) {
                var n = o(this),
                  r = n.html();
                n.replaceWith(e.call(this, t, r));
              })
            : ('string' != typeof e && (e = o(e).detach()),
              this.each(function () {
                var t = this.nextSibling,
                  n = this.parentNode;
                o(this).remove(), t ? o(t).before(e) : o(n).append(e);
              }))
          : this.length
          ? this.pushStack(o(o.isFunction(e) ? e() : e), 'replaceWith', e)
          : this;
      },
      detach: function (e) {
        return this.remove(e, !0);
      },
      domManip: function (e, n, r) {
        var i,
          a,
          s,
          l,
          u = e[0],
          c = [];
        if (!o.support.checkClone && 3 === arguments.length && 'string' == typeof u && te.test(u))
          return this.each(function () {
            o(this).domManip(e, n, r, !0);
          });
        if (o.isFunction(u))
          return this.each(function (i) {
            var a = o(this);
            (e[0] = u.call(this, i, n ? a.html() : t)), a.domManip(e, n, r);
          });
        if (this[0]) {
          if (
            ((l = u && u.parentNode),
            (a =
              1 ===
              (s = (i =
                o.support.parentNode && l && 11 === l.nodeType && l.childNodes.length === this.length
                  ? { fragment: l }
                  : o.buildFragment(e, this, c)).fragment).childNodes.length
                ? (s = s.firstChild)
                : s.firstChild))
          ) {
            n = n && o.nodeName(a, 'tr');
            for (var f = 0, d = this.length, p = d - 1; f < d; f++)
              r.call(n ? ae(this[f]) : this[f], i.cacheable || (d > 1 && f < p) ? o.clone(s, !0, !0) : s);
          }
          c.length && o.each(c, de);
        }
        return this;
      },
    }),
    (o.buildFragment = function (e, t, r) {
      var i,
        a,
        s,
        l,
        u = e[0];
      return (
        t && t[0] && (l = t[0].ownerDocument || t[0]),
        l.createDocumentFragment || (l = n),
        1 === e.length &&
          'string' == typeof u &&
          u.length < 512 &&
          l === n &&
          '<' === u.charAt(0) &&
          !Z.test(u) &&
          (o.support.checkClone || !te.test(u)) &&
          !o.support.unknownElems &&
          ee.test(u) &&
          ((a = !0), (s = o.fragments[u]) && 1 !== s && (i = s)),
        i || ((i = l.createDocumentFragment()), o.clean(e, l, i, r)),
        a && (o.fragments[u] = s ? i : 1),
        { fragment: i, cacheable: a }
      );
    }),
    (o.fragments = {}),
    o.each(
      {
        appendTo: 'append',
        prependTo: 'prepend',
        insertBefore: 'before',
        insertAfter: 'after',
        replaceAll: 'replaceWith',
      },
      function (e, t) {
        o.fn[e] = function (n) {
          var r = [],
            i = o(n),
            a = 1 === this.length && this[0].parentNode;
          if (a && 11 === a.nodeType && 1 === a.childNodes.length && 1 === i.length) return i[t](this[0]), this;
          for (var s = 0, l = i.length; s < l; s++) {
            var u = (s > 0 ? this.clone(!0) : this).get();
            o(i[s])[t](u), (r = r.concat(u));
          }
          return this.pushStack(r, e, i.selector);
        };
      }
    ),
    o.extend({
      clone: function (e, t, n) {
        var r,
          i,
          a,
          s = e.cloneNode(!0);
        if (
          !(
            (o.support.noCloneEvent && o.support.noCloneChecked) ||
            (1 !== e.nodeType && 11 !== e.nodeType) ||
            o.isXMLDoc(e)
          )
        )
          for (le(e, s), r = ue(e), i = ue(s), a = 0; r[a]; ++a) i[a] && le(r[a], i[a]);
        if (t && (se(e, s), n)) for (r = ue(e), i = ue(s), a = 0; r[a]; ++a) se(r[a], i[a]);
        return (r = i = null), s;
      },
      clean: function (e, t, r, i) {
        var a;
        void 0 === (t = t || n).createElement && (t = t.ownerDocument || (t[0] && t[0].ownerDocument) || n);
        for (var s, l, u = [], c = 0; null != (l = e[c]); c++)
          if (('number' == typeof l && (l += ''), l)) {
            if ('string' == typeof l)
              if (Q.test(l)) {
                l = l.replace(G, '<$1></$2>');
                var f = (J.exec(l) || ['', ''])[1].toLowerCase(),
                  d = ie[f] || ie._default,
                  p = d[0],
                  h = t.createElement('div');
                for (t === n ? oe.appendChild(h) : X(t).appendChild(h), h.innerHTML = d[1] + l + d[2]; p--; )
                  h = h.lastChild;
                if (!o.support.tbody) {
                  var m = Y.test(l),
                    g =
                      'table' !== f || m
                        ? '<table>' !== d[1] || m
                          ? []
                          : h.childNodes
                        : h.firstChild && h.firstChild.childNodes;
                  for (s = g.length - 1; s >= 0; --s)
                    o.nodeName(g[s], 'tbody') && !g[s].childNodes.length && g[s].parentNode.removeChild(g[s]);
                }
                !o.support.leadingWhitespace &&
                  U.test(l) &&
                  h.insertBefore(t.createTextNode(U.exec(l)[0]), h.firstChild),
                  (l = h.childNodes);
              } else l = t.createTextNode(l);
            var y;
            if (!o.support.appendChecked)
              if (l[0] && 'number' == typeof (y = l.length)) for (s = 0; s < y; s++) fe(l[s]);
              else fe(l);
            l.nodeType ? u.push(l) : (u = o.merge(u, l));
          }
        if (r)
          for (
            a = function (e) {
              return !e.type || ne.test(e.type);
            },
              c = 0;
            u[c];
            c++
          )
            if (!i || !o.nodeName(u[c], 'script') || (u[c].type && 'text/javascript' !== u[c].type.toLowerCase())) {
              if (1 === u[c].nodeType) {
                var v = o.grep(u[c].getElementsByTagName('script'), a);
                u.splice.apply(u, [c + 1, 0].concat(v));
              }
              r.appendChild(u[c]);
            } else i.push(u[c].parentNode ? u[c].parentNode.removeChild(u[c]) : u[c]);
        return u;
      },
      cleanData: function (e) {
        for (var t, n, r, i = o.cache, a = o.event.special, s = o.support.deleteExpando, l = 0; null != (r = e[l]); l++)
          if ((!r.nodeName || !o.noData[r.nodeName.toLowerCase()]) && (n = r[o.expando])) {
            if ((t = i[n]) && t.events) {
              for (var u in t.events) a[u] ? o.event.remove(r, u) : o.removeEvent(r, u, t.handle);
              t.handle && (t.handle.elem = null);
            }
            s ? delete r[o.expando] : r.removeAttribute && r.removeAttribute(o.expando), delete i[n];
          }
      },
    });
  var pe,
    he,
    me,
    ge = /alpha\([^)]*\)/i,
    ye = /opacity=([^)]*)/,
    ve = /([A-Z]|^ms)/g,
    be = /^-?\d+(?:px)?$/i,
    xe = /^-?\d/,
    we = /^([\-+])=([\-+.\de]+)/,
    Te = { position: 'absolute', visibility: 'hidden', display: 'block' },
    Ne = ['Left', 'Right'],
    Ce = ['Top', 'Bottom'];
  function Ee(e, t, n) {
    var r = 'width' === t ? e.offsetWidth : e.offsetHeight,
      i = 'width' === t ? Ne : Ce;
    return r > 0
      ? ('border' !== n &&
          o.each(i, function () {
            n || (r -= parseFloat(o.css(e, 'padding' + this)) || 0),
              'margin' === n
                ? (r += parseFloat(o.css(e, n + this)) || 0)
                : (r -= parseFloat(o.css(e, 'border' + this + 'Width')) || 0);
          }),
        r + 'px')
      : (((r = pe(e, t, t)) < 0 || null == r) && (r = e.style[t] || 0),
        (r = parseFloat(r) || 0),
        n &&
          o.each(i, function () {
            (r += parseFloat(o.css(e, 'padding' + this)) || 0),
              'padding' !== n && (r += parseFloat(o.css(e, 'border' + this + 'Width')) || 0),
              'margin' === n && (r += parseFloat(o.css(e, n + this)) || 0);
          }),
        r + 'px');
  }
  (o.fn.css = function (e, n) {
    return 2 === arguments.length && n === t
      ? this
      : o.access(this, e, n, !0, function (e, n, r) {
          return r !== t ? o.style(e, n, r) : o.css(e, n);
        });
  }),
    o.extend({
      cssHooks: {
        opacity: {
          get: function (e, t) {
            if (t) {
              var n = pe(e, 'opacity', 'opacity');
              return '' === n ? '1' : n;
            }
            return e.style.opacity;
          },
        },
      },
      cssNumber: {
        fillOpacity: !0,
        fontWeight: !0,
        lineHeight: !0,
        opacity: !0,
        orphans: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
      },
      cssProps: { float: o.support.cssFloat ? 'cssFloat' : 'styleFloat' },
      style: function (e, n, r, i) {
        if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
          var a,
            s,
            l = o.camelCase(n),
            u = e.style,
            c = o.cssHooks[l];
          if (((n = o.cssProps[l] || l), r === t)) return c && 'get' in c && (a = c.get(e, !1, i)) !== t ? a : u[n];
          if (
            ('string' == (s = typeof r) &&
              (a = we.exec(r)) &&
              ((r = +(a[1] + 1) * +a[2] + parseFloat(o.css(e, n))), (s = 'number')),
            !(
              null == r ||
              ('number' === s && isNaN(r)) ||
              ('number' !== s || o.cssNumber[l] || (r += 'px'), c && 'set' in c && (r = c.set(e, r)) === t)
            ))
          )
            try {
              u[n] = r;
            } catch (e) {}
        }
      },
      css: function (e, n, r) {
        var i, a;
        return (
          (n = o.camelCase(n)),
          (a = o.cssHooks[n]),
          'cssFloat' === (n = o.cssProps[n] || n) && (n = 'float'),
          a && 'get' in a && (i = a.get(e, !0, r)) !== t ? i : pe ? pe(e, n) : void 0
        );
      },
      swap: function (e, t, n) {
        var r = {};
        for (var i in t) (r[i] = e.style[i]), (e.style[i] = t[i]);
        for (i in (n.call(e), t)) e.style[i] = r[i];
      },
    }),
    (o.curCSS = o.css),
    o.each(['height', 'width'], function (e, t) {
      o.cssHooks[t] = {
        get: function (e, n, r) {
          var i;
          if (n)
            return 0 !== e.offsetWidth
              ? Ee(e, t, r)
              : (o.swap(e, Te, function () {
                  i = Ee(e, t, r);
                }),
                i);
        },
        set: function (e, t) {
          return be.test(t) ? ((t = parseFloat(t)) >= 0 ? t + 'px' : void 0) : t;
        },
      };
    }),
    o.support.opacity ||
      (o.cssHooks.opacity = {
        get: function (e, t) {
          return ye.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || '')
            ? parseFloat(RegExp.$1) / 100 + ''
            : t
            ? '1'
            : '';
        },
        set: function (e, t) {
          var n = e.style,
            r = e.currentStyle,
            i = o.isNumeric(t) ? 'alpha(opacity=' + 100 * t + ')' : '',
            a = (r && r.filter) || n.filter || '';
          (n.zoom = 1),
            (t >= 1 && '' === o.trim(a.replace(ge, '')) && (n.removeAttribute('filter'), r && !r.filter)) ||
              (n.filter = ge.test(a) ? a.replace(ge, i) : a + ' ' + i);
        },
      }),
    o(function () {
      o.support.reliableMarginRight ||
        (o.cssHooks.marginRight = {
          get: function (e, t) {
            var n;
            return (
              o.swap(e, { display: 'inline-block' }, function () {
                n = t ? pe(e, 'margin-right', 'marginRight') : e.style.marginRight;
              }),
              n
            );
          },
        });
    }),
    n.defaultView &&
      n.defaultView.getComputedStyle &&
      (he = function (e, n) {
        var r, i, a;
        return (
          (n = n.replace(ve, '-$1').toLowerCase()),
          (i = e.ownerDocument.defaultView)
            ? ((a = i.getComputedStyle(e, null)) &&
                ('' !== (r = a.getPropertyValue(n)) ||
                  o.contains(e.ownerDocument.documentElement, e) ||
                  (r = o.style(e, n))),
              r)
            : t
        );
      }),
    n.documentElement.currentStyle &&
      (me = function (e, t) {
        var n,
          r,
          i,
          o = e.currentStyle && e.currentStyle[t],
          a = e.style;
        return (
          null === o && a && (i = a[t]) && (o = i),
          !be.test(o) &&
            xe.test(o) &&
            ((n = a.left),
            (r = e.runtimeStyle && e.runtimeStyle.left) && (e.runtimeStyle.left = e.currentStyle.left),
            (a.left = 'fontSize' === t ? '1em' : o || 0),
            (o = a.pixelLeft + 'px'),
            (a.left = n),
            r && (e.runtimeStyle.left = r)),
          '' === o ? 'auto' : o
        );
      }),
    (pe = he || me),
    o.expr &&
      o.expr.filters &&
      ((o.expr.filters.hidden = function (e) {
        var t = e.offsetWidth,
          n = e.offsetHeight;
        return (
          (0 === t && 0 === n) ||
          (!o.support.reliableHiddenOffsets && 'none' === ((e.style && e.style.display) || o.css(e, 'display')))
        );
      }),
      (o.expr.filters.visible = function (e) {
        return !o.expr.filters.hidden(e);
      }));
  var ke,
    Se,
    Ae = /%20/g,
    Le = /\[\]$/,
    je = /\r?\n/g,
    De = /#.*$/,
    Fe = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
    Me =
      /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
    Oe = /^(?:GET|HEAD)$/,
    _e = /^\/\//,
    He = /\?/,
    Be = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    Pe = /^(?:select|textarea)/i,
    qe = /\s+/,
    We = /([?&])_=[^&]*/,
    Ie = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
    Re = o.fn.load,
    $e = {},
    Xe = {},
    ze = ['*/'] + ['*'];
  try {
    ke = i.href;
  } catch (e) {
    ((ke = n.createElement('a')).href = ''), (ke = ke.href);
  }
  function Ve(e) {
    return function (t, n) {
      if (('string' != typeof t && ((n = t), (t = '*')), o.isFunction(n)))
        for (var r, i, a = t.toLowerCase().split(qe), s = 0, l = a.length; s < l; s++)
          (r = a[s]), (i = /^\+/.test(r)) && (r = r.substr(1) || '*'), (e[r] = e[r] || [])[i ? 'unshift' : 'push'](n);
    };
  }
  function Ue(e, n, r, i, o, a) {
    (a = a || {})[(o = o || n.dataTypes[0])] = !0;
    for (var s, l = e[o], u = 0, c = l ? l.length : 0, f = e === $e; u < c && (f || !s); u++)
      'string' == typeof (s = l[u](n, r, i)) &&
        (!f || a[s] ? (s = t) : (n.dataTypes.unshift(s), (s = Ue(e, n, r, i, s, a))));
    return (!f && s) || a['*'] || (s = Ue(e, n, r, i, '*', a)), s;
  }
  function Ge(e, n) {
    var r,
      i,
      a = o.ajaxSettings.flatOptions || {};
    for (r in n) n[r] !== t && ((a[r] ? e : i || (i = {}))[r] = n[r]);
    i && o.extend(!0, e, i);
  }
  function Je(e, t, n, r) {
    if (o.isArray(t))
      o.each(t, function (t, i) {
        n || Le.test(e) ? r(e, i) : Je(e + '[' + ('object' == typeof i || o.isArray(i) ? t : '') + ']', i, n, r);
      });
    else if (n || null == t || 'object' != typeof t) r(e, t);
    else for (var i in t) Je(e + '[' + i + ']', t[i], n, r);
  }
  (Se = Ie.exec(ke.toLowerCase()) || []),
    o.fn.extend({
      load: function (e, n, r) {
        if ('string' != typeof e && Re) return Re.apply(this, arguments);
        if (!this.length) return this;
        var i = e.indexOf(' ');
        if (i >= 0) {
          var a = e.slice(i, e.length);
          e = e.slice(0, i);
        }
        var s = 'GET';
        n &&
          (o.isFunction(n)
            ? ((r = n), (n = t))
            : 'object' == typeof n && ((n = o.param(n, o.ajaxSettings.traditional)), (s = 'POST')));
        var l = this;
        return (
          o.ajax({
            url: e,
            type: s,
            dataType: 'html',
            data: n,
            complete: function (e, t, n) {
              (n = e.responseText),
                e.isResolved() &&
                  (e.done(function (e) {
                    n = e;
                  }),
                  l.html(a ? o('<div>').append(n.replace(Be, '')).find(a) : n)),
                r && l.each(r, [n, t, e]);
            },
          }),
          this
        );
      },
      serialize: function () {
        return o.param(this.serializeArray());
      },
      serializeArray: function () {
        return this.map(function () {
          return this.elements ? o.makeArray(this.elements) : this;
        })
          .filter(function () {
            return this.name && !this.disabled && (this.checked || Pe.test(this.nodeName) || Me.test(this.type));
          })
          .map(function (e, t) {
            var n = o(this).val();
            return null == n
              ? null
              : o.isArray(n)
              ? o.map(n, function (e, n) {
                  return { name: t.name, value: e.replace(je, '\r\n') };
                })
              : { name: t.name, value: n.replace(je, '\r\n') };
          })
          .get();
      },
    }),
    o.each('ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend'.split(' '), function (e, t) {
      o.fn[t] = function (e) {
        return this.bind(t, e);
      };
    }),
    o.each(['get', 'post'], function (e, n) {
      o[n] = function (e, r, i, a) {
        return (
          o.isFunction(r) && ((a = a || i), (i = r), (r = t)),
          o.ajax({ type: n, url: e, data: r, success: i, dataType: a })
        );
      };
    }),
    o.extend({
      getScript: function (e, n) {
        return o.get(e, t, n, 'script');
      },
      getJSON: function (e, t, n) {
        return o.get(e, t, n, 'json');
      },
      ajaxSetup: function (e, t) {
        return t ? Ge(e, o.ajaxSettings) : ((t = e), (e = o.ajaxSettings)), Ge(e, t), e;
      },
      ajaxSettings: {
        url: ke,
        isLocal: /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/.test(Se[1]),
        global: !0,
        type: 'GET',
        contentType: 'application/x-www-form-urlencoded',
        processData: !0,
        async: !0,
        accepts: {
          xml: 'application/xml, text/xml',
          html: 'text/html',
          text: 'text/plain',
          json: 'application/json, text/javascript',
          '*': ze,
        },
        contents: { xml: /xml/, html: /html/, json: /json/ },
        responseFields: { xml: 'responseXML', text: 'responseText' },
        converters: { '* text': e.String, 'text html': !0, 'text json': o.parseJSON, 'text xml': o.parseXML },
        flatOptions: { context: !0, url: !0 },
      },
      ajaxPrefilter: Ve($e),
      ajaxTransport: Ve(Xe),
      ajax: function (e, n) {
        'object' == typeof e && ((n = e), (e = t)), (n = n || {});
        var r,
          i,
          a,
          s,
          l,
          u,
          c,
          f,
          d = o.ajaxSetup({}, n),
          p = d.context || d,
          h = p !== d && (p.nodeType || p instanceof o) ? o(p) : o.event,
          m = o.Deferred(),
          g = o.Callbacks('once memory'),
          y = d.statusCode || {},
          v = {},
          b = {},
          x = 0,
          w = {
            readyState: 0,
            setRequestHeader: function (e, t) {
              if (!x) {
                var n = e.toLowerCase();
                (e = b[n] = b[n] || e), (v[e] = t);
              }
              return this;
            },
            getAllResponseHeaders: function () {
              return 2 === x ? i : null;
            },
            getResponseHeader: function (e) {
              var n;
              if (2 === x) {
                if (!a) for (a = {}; (n = Fe.exec(i)); ) a[n[1].toLowerCase()] = n[2];
                n = a[e.toLowerCase()];
              }
              return n === t ? null : n;
            },
            overrideMimeType: function (e) {
              return x || (d.mimeType = e), this;
            },
            abort: function (e) {
              return (e = e || 'abort'), s && s.abort(e), T(0, e), this;
            },
          };
        function T(e, n, a, u) {
          if (2 !== x) {
            (x = 2), l && clearTimeout(l), (s = t), (i = u || ''), (w.readyState = e > 0 ? 4 : 0);
            var f,
              v,
              b,
              T,
              N,
              C = n,
              E = a
                ? (function (e, n, r) {
                    var i,
                      o,
                      a,
                      s,
                      l = e.contents,
                      u = e.dataTypes,
                      c = e.responseFields;
                    for (o in c) o in r && (n[c[o]] = r[o]);
                    for (; '*' === u[0]; )
                      u.shift(), i === t && (i = e.mimeType || n.getResponseHeader('content-type'));
                    if (i)
                      for (o in l)
                        if (l[o] && l[o].test(i)) {
                          u.unshift(o);
                          break;
                        }
                    if (u[0] in r) a = u[0];
                    else {
                      for (o in r) {
                        if (!u[0] || e.converters[o + ' ' + u[0]]) {
                          a = o;
                          break;
                        }
                        s || (s = o);
                      }
                      a = a || s;
                    }
                    if (a) return a !== u[0] && u.unshift(a), r[a];
                  })(d, w, a)
                : t;
            if ((e >= 200 && e < 300) || 304 === e)
              if (
                (d.ifModified &&
                  ((T = w.getResponseHeader('Last-Modified')) && (o.lastModified[r] = T),
                  (N = w.getResponseHeader('Etag')) && (o.etag[r] = N)),
                304 === e)
              )
                (C = 'notmodified'), (f = !0);
              else
                try {
                  (v = (function (e, n) {
                    e.dataFilter && (n = e.dataFilter(n, e.dataType));
                    var r,
                      i,
                      a,
                      s,
                      l,
                      u,
                      c,
                      f,
                      d = e.dataTypes,
                      p = {},
                      h = d.length,
                      m = d[0];
                    for (r = 1; r < h; r++) {
                      if (1 === r)
                        for (i in e.converters) 'string' == typeof i && (p[i.toLowerCase()] = e.converters[i]);
                      if (((s = m), '*' === (m = d[r]))) m = s;
                      else if ('*' !== s && s !== m) {
                        if (!(u = p[(l = s + ' ' + m)] || p['* ' + m]))
                          for (c in ((f = t), p))
                            if (((a = c.split(' '))[0] === s || '*' === a[0]) && (f = p[a[1] + ' ' + m])) {
                              !0 === (c = p[c]) ? (u = f) : !0 === f && (u = c);
                              break;
                            }
                        u || f || o.error('No conversion from ' + l.replace(' ', ' to ')),
                          !0 !== u && (n = u ? u(n) : f(c(n)));
                      }
                    }
                    return n;
                  })(d, E)),
                    (C = 'success'),
                    (f = !0);
                } catch (e) {
                  (C = 'parsererror'), (b = e);
                }
            else (b = C), (C && !e) || ((C = 'error'), e < 0 && (e = 0));
            (w.status = e),
              (w.statusText = '' + (n || C)),
              f ? m.resolveWith(p, [v, C, w]) : m.rejectWith(p, [w, C, b]),
              w.statusCode(y),
              (y = t),
              c && h.trigger('ajax' + (f ? 'Success' : 'Error'), [w, d, f ? v : b]),
              g.fireWith(p, [w, C]),
              c && (h.trigger('ajaxComplete', [w, d]), --o.active || o.event.trigger('ajaxStop'));
          }
        }
        if (
          (m.promise(w),
          (w.success = w.done),
          (w.error = w.fail),
          (w.complete = g.add),
          (w.statusCode = function (e) {
            var t;
            if (e)
              if (x < 2) for (t in e) y[t] = [y[t], e[t]];
              else (t = e[w.status]), w.then(t, t);
            return this;
          }),
          (d.url = ((e || d.url) + '').replace(De, '').replace(_e, Se[1] + '//')),
          (d.dataTypes = o
            .trim(d.dataType || '*')
            .toLowerCase()
            .split(qe)),
          null == d.crossDomain &&
            ((u = Ie.exec(d.url.toLowerCase())),
            (d.crossDomain = !(
              !u ||
              (u[1] == Se[1] &&
                u[2] == Se[2] &&
                (u[3] || ('http:' === u[1] ? 80 : 443)) == (Se[3] || ('http:' === Se[1] ? 80 : 443)))
            ))),
          d.data && d.processData && 'string' != typeof d.data && (d.data = o.param(d.data, d.traditional)),
          Ue($e, d, n, w),
          2 === x)
        )
          return !1;
        if (
          ((c = d.global),
          (d.type = d.type.toUpperCase()),
          (d.hasContent = !Oe.test(d.type)),
          c && 0 == o.active++ && o.event.trigger('ajaxStart'),
          !d.hasContent &&
            (d.data && ((d.url += (He.test(d.url) ? '&' : '?') + d.data), delete d.data), (r = d.url), !1 === d.cache))
        ) {
          var N = o.now(),
            C = d.url.replace(We, '$1_=' + N);
          d.url = C + (C === d.url ? (He.test(d.url) ? '&' : '?') + '_=' + N : '');
        }
        for (f in (((d.data && d.hasContent && !1 !== d.contentType) || n.contentType) &&
          w.setRequestHeader('Content-Type', d.contentType),
        d.ifModified &&
          ((r = r || d.url),
          o.lastModified[r] && w.setRequestHeader('If-Modified-Since', o.lastModified[r]),
          o.etag[r] && w.setRequestHeader('If-None-Match', o.etag[r])),
        w.setRequestHeader(
          'Accept',
          d.dataTypes[0] && d.accepts[d.dataTypes[0]]
            ? d.accepts[d.dataTypes[0]] + ('*' !== d.dataTypes[0] ? ', ' + ze + '; q=0.01' : '')
            : d.accepts['*']
        ),
        d.headers))
          w.setRequestHeader(f, d.headers[f]);
        if (d.beforeSend && (!1 === d.beforeSend.call(p, w, d) || 2 === x)) return w.abort(), !1;
        for (f in { success: 1, error: 1, complete: 1 }) w[f](d[f]);
        if ((s = Ue(Xe, d, n, w))) {
          (w.readyState = 1),
            c && h.trigger('ajaxSend', [w, d]),
            d.async &&
              d.timeout > 0 &&
              (l = setTimeout(function () {
                w.abort('timeout');
              }, d.timeout));
          try {
            (x = 1), s.send(v, T);
          } catch (e) {
            x < 2 ? T(-1, e) : o.error(e);
          }
        } else T(-1, 'No Transport');
        return w;
      },
      param: function (e, n) {
        var r = [],
          i = function (e, t) {
            (t = o.isFunction(t) ? t() : t), (r[r.length] = encodeURIComponent(e) + '=' + encodeURIComponent(t));
          };
        if ((n === t && (n = o.ajaxSettings.traditional), o.isArray(e) || (e.jquery && !o.isPlainObject(e))))
          o.each(e, function () {
            i(this.name, this.value);
          });
        else for (var a in e) Je(a, e[a], n, i);
        return r.join('&').replace(Ae, '+');
      },
    }),
    o.extend({ active: 0, lastModified: {}, etag: {} });
  var Ye = o.now(),
    Qe = /(\=)\?(&|$)|\?\?/i;
  o.ajaxSetup({
    jsonp: 'callback',
    jsonpCallback: function () {
      return o.expando + '_' + Ye++;
    },
  }),
    o.ajaxPrefilter('json jsonp', function (t, n, r) {
      var i = 'application/x-www-form-urlencoded' === t.contentType && 'string' == typeof t.data;
      if ('jsonp' === t.dataTypes[0] || (!1 !== t.jsonp && (Qe.test(t.url) || (i && Qe.test(t.data))))) {
        var a,
          s = (t.jsonpCallback = o.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback),
          l = e[s],
          u = t.url,
          c = t.data,
          f = '$1' + s + '$2';
        return (
          !1 !== t.jsonp &&
            ((u = u.replace(Qe, f)),
            t.url === u &&
              (i && (c = c.replace(Qe, f)), t.data === c && (u += (/\?/.test(u) ? '&' : '?') + t.jsonp + '=' + s))),
          (t.url = u),
          (t.data = c),
          (e[s] = function (e) {
            a = [e];
          }),
          r.always(function () {
            (e[s] = l), a && o.isFunction(l) && e[s](a[0]);
          }),
          (t.converters['script json'] = function () {
            return a || o.error(s + ' was not called'), a[0];
          }),
          (t.dataTypes[0] = 'json'),
          'script'
        );
      }
    }),
    o.ajaxSetup({
      accepts: { script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript' },
      contents: { script: /javascript|ecmascript/ },
      converters: {
        'text script': function (e) {
          return o.globalEval(e), e;
        },
      },
    }),
    o.ajaxPrefilter('script', function (e) {
      e.cache === t && (e.cache = !1), e.crossDomain && ((e.type = 'GET'), (e.global = !1));
    }),
    o.ajaxTransport('script', function (e) {
      if (e.crossDomain) {
        var r,
          i = n.head || n.getElementsByTagName('head')[0] || n.documentElement;
        return {
          send: function (o, a) {
            ((r = n.createElement('script')).async = 'async'),
              e.scriptCharset && (r.charset = e.scriptCharset),
              (r.src = e.url),
              (r.onload = r.onreadystatechange =
                function (e, n) {
                  (n || !r.readyState || /loaded|complete/.test(r.readyState)) &&
                    ((r.onload = r.onreadystatechange = null),
                    i && r.parentNode && i.removeChild(r),
                    (r = t),
                    n || a(200, 'success'));
                }),
              i.insertBefore(r, i.firstChild);
          },
          abort: function () {
            r && r.onload(0, 1);
          },
        };
      }
    });
  var Ke,
    Ze,
    et =
      !!e.ActiveXObject &&
      function () {
        for (var e in Ke) Ke[e](0, 1);
      },
    tt = 0;
  function nt() {
    try {
      return new e.XMLHttpRequest();
    } catch (e) {}
  }
  (o.ajaxSettings.xhr = e.ActiveXObject
    ? function () {
        return (
          (!this.isLocal && nt()) ||
          (function () {
            try {
              return new e.ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {}
          })()
        );
      }
    : nt),
    (Ze = o.ajaxSettings.xhr()),
    o.extend(o.support, { ajax: !!Ze, cors: !!Ze && 'withCredentials' in Ze }),
    o.support.ajax &&
      o.ajaxTransport(function (n) {
        var r;
        if (!n.crossDomain || o.support.cors)
          return {
            send: function (i, a) {
              var s,
                l,
                u = n.xhr();
              if (
                (n.username ? u.open(n.type, n.url, n.async, n.username, n.password) : u.open(n.type, n.url, n.async),
                n.xhrFields)
              )
                for (l in n.xhrFields) u[l] = n.xhrFields[l];
              n.mimeType && u.overrideMimeType && u.overrideMimeType(n.mimeType),
                n.crossDomain || i['X-Requested-With'] || (i['X-Requested-With'] = 'XMLHttpRequest');
              try {
                for (l in i) u.setRequestHeader(l, i[l]);
              } catch (e) {}
              u.send((n.hasContent && n.data) || null),
                (r = function (e, i) {
                  var l, c, f, d, p;
                  try {
                    if (r && (i || 4 === u.readyState))
                      if (((r = t), s && ((u.onreadystatechange = o.noop), et && delete Ke[s]), i))
                        4 !== u.readyState && u.abort();
                      else {
                        (l = u.status),
                          (f = u.getAllResponseHeaders()),
                          (d = {}),
                          (p = u.responseXML) && p.documentElement && (d.xml = p),
                          (d.text = u.responseText);
                        try {
                          c = u.statusText;
                        } catch (e) {
                          c = '';
                        }
                        l || !n.isLocal || n.crossDomain ? 1223 === l && (l = 204) : (l = d.text ? 200 : 404);
                      }
                  } catch (e) {
                    i || a(-1, e);
                  }
                  d && a(l, c, d, f);
                }),
                n.async && 4 !== u.readyState
                  ? ((s = ++tt), et && (Ke || ((Ke = {}), o(e).unload(et)), (Ke[s] = r)), (u.onreadystatechange = r))
                  : r();
            },
            abort: function () {
              r && r(0, 1);
            },
          };
      });
  var rt,
    it,
    ot,
    at,
    st = {},
    lt = /^(?:toggle|show|hide)$/,
    ut = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
    ct = [
      ['height', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'],
      ['width', 'marginLeft', 'marginRight', 'paddingLeft', 'paddingRight'],
      ['opacity'],
    ];
  function ft() {
    return setTimeout(dt, 0), (at = o.now());
  }
  function dt() {
    at = t;
  }
  function pt(e, t) {
    var n = {};
    return (
      o.each(ct.concat.apply([], ct.slice(0, t)), function () {
        n[this] = e;
      }),
      n
    );
  }
  function ht(e) {
    if (!st[e]) {
      var t = n.body,
        r = o('<' + e + '>').appendTo(t),
        i = r.css('display');
      r.remove(),
        ('none' !== i && '' !== i) ||
          (rt || ((rt = n.createElement('iframe')).frameBorder = rt.width = rt.height = 0),
          t.appendChild(rt),
          (it && rt.createElement) ||
            ((it = (rt.contentWindow || rt.contentDocument).document).write(
              ('CSS1Compat' === n.compatMode ? '<!doctype html>' : '') + '<html><body>'
            ),
            it.close()),
          (r = it.createElement(e)),
          it.body.appendChild(r),
          (i = o.css(r, 'display')),
          t.removeChild(rt)),
        (st[e] = i);
    }
    return st[e];
  }
  o.fn.extend({
    show: function (e, t, n) {
      var r, i;
      if (e || 0 === e) return this.animate(pt('show', 3), e, t, n);
      for (var a = 0, s = this.length; a < s; a++)
        (r = this[a]).style &&
          ((i = r.style.display),
          o._data(r, 'olddisplay') || 'none' !== i || (i = r.style.display = ''),
          '' === i && 'none' === o.css(r, 'display') && o._data(r, 'olddisplay', ht(r.nodeName)));
      for (a = 0; a < s; a++)
        (r = this[a]).style &&
          (('' !== (i = r.style.display) && 'none' !== i) || (r.style.display = o._data(r, 'olddisplay') || ''));
      return this;
    },
    hide: function (e, t, n) {
      if (e || 0 === e) return this.animate(pt('hide', 3), e, t, n);
      for (var r, i, a = 0, s = this.length; a < s; a++)
        (r = this[a]).style &&
          ('none' === (i = o.css(r, 'display')) || o._data(r, 'olddisplay') || o._data(r, 'olddisplay', i));
      for (a = 0; a < s; a++) this[a].style && (this[a].style.display = 'none');
      return this;
    },
    _toggle: o.fn.toggle,
    toggle: function (e, t, n) {
      var r = 'boolean' == typeof e;
      return (
        o.isFunction(e) && o.isFunction(t)
          ? this._toggle.apply(this, arguments)
          : null == e || r
          ? this.each(function () {
              var t = r ? e : o(this).is(':hidden');
              o(this)[t ? 'show' : 'hide']();
            })
          : this.animate(pt('toggle', 3), e, t, n),
        this
      );
    },
    fadeTo: function (e, t, n, r) {
      return this.filter(':hidden').css('opacity', 0).show().end().animate({ opacity: t }, e, n, r);
    },
    animate: function (e, t, n, r) {
      var i = o.speed(t, n, r);
      if (o.isEmptyObject(e)) return this.each(i.complete, [!1]);
      function a() {
        !1 === i.queue && o._mark(this);
        var t,
          n,
          r,
          a,
          s,
          l,
          u,
          c,
          f,
          d = o.extend({}, i),
          p = 1 === this.nodeType,
          h = p && o(this).is(':hidden');
        for (r in ((d.animatedProperties = {}), e)) {
          if (
            (r !== (t = o.camelCase(r)) && ((e[t] = e[r]), delete e[r]),
            (n = e[t]),
            o.isArray(n)
              ? ((d.animatedProperties[t] = n[1]), (n = e[t] = n[0]))
              : (d.animatedProperties[t] = (d.specialEasing && d.specialEasing[t]) || d.easing || 'swing'),
            ('hide' === n && h) || ('show' === n && !h))
          )
            return d.complete.call(this);
          !p ||
            ('height' !== t && 'width' !== t) ||
            ((d.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY]),
            'inline' === o.css(this, 'display') &&
              'none' === o.css(this, 'float') &&
              (o.support.inlineBlockNeedsLayout && 'inline' !== ht(this.nodeName)
                ? (this.style.zoom = 1)
                : (this.style.display = 'inline-block')));
        }
        for (r in (null != d.overflow && (this.style.overflow = 'hidden'), e))
          (a = new o.fx(this, d, r)),
            (n = e[r]),
            lt.test(n)
              ? (f = o._data(this, 'toggle' + r) || ('toggle' === n ? (h ? 'show' : 'hide') : 0))
                ? (o._data(this, 'toggle' + r, 'show' === f ? 'hide' : 'show'), a[f]())
                : a[n]()
              : ((s = ut.exec(n)),
                (l = a.cur()),
                s
                  ? ((u = parseFloat(s[2])),
                    'px' !== (c = s[3] || (o.cssNumber[r] ? '' : 'px')) &&
                      (o.style(this, r, (u || 1) + c), (l = ((u || 1) / a.cur()) * l), o.style(this, r, l + c)),
                    s[1] && (u = ('-=' === s[1] ? -1 : 1) * u + l),
                    a.custom(l, u, c))
                  : a.custom(l, n, ''));
        return !0;
      }
      return (e = o.extend({}, e)), !1 === i.queue ? this.each(a) : this.queue(i.queue, a);
    },
    stop: function (e, n, r) {
      return (
        'string' != typeof e && ((r = n), (n = e), (e = t)),
        n && !1 !== e && this.queue(e || 'fx', []),
        this.each(function () {
          var t,
            n = !1,
            i = o.timers,
            a = o._data(this);
          function s(e, t, n) {
            var i = t[n];
            o.removeData(e, n, !0), i.stop(r);
          }
          if ((r || o._unmark(!0, this), null == e))
            for (t in a) a[t].stop && t.indexOf('.run') === t.length - 4 && s(this, a, t);
          else a[(t = e + '.run')] && a[t].stop && s(this, a, t);
          for (t = i.length; t--; )
            i[t].elem !== this ||
              (null != e && i[t].queue !== e) ||
              (r ? i[t](!0) : i[t].saveState(), (n = !0), i.splice(t, 1));
          (r && n) || o.dequeue(this, e);
        })
      );
    },
  }),
    o.each(
      {
        slideDown: pt('show', 1),
        slideUp: pt('hide', 1),
        slideToggle: pt('toggle', 1),
        fadeIn: { opacity: 'show' },
        fadeOut: { opacity: 'hide' },
        fadeToggle: { opacity: 'toggle' },
      },
      function (e, t) {
        o.fn[e] = function (e, n, r) {
          return this.animate(t, e, n, r);
        };
      }
    ),
    o.extend({
      speed: function (e, t, n) {
        var r =
          e && 'object' == typeof e
            ? o.extend({}, e)
            : {
                complete: n || (!n && t) || (o.isFunction(e) && e),
                duration: e,
                easing: (n && t) || (t && !o.isFunction(t) && t),
              };
        return (
          (r.duration = o.fx.off
            ? 0
            : 'number' == typeof r.duration
            ? r.duration
            : r.duration in o.fx.speeds
            ? o.fx.speeds[r.duration]
            : o.fx.speeds._default),
          (null != r.queue && !0 !== r.queue) || (r.queue = 'fx'),
          (r.old = r.complete),
          (r.complete = function (e) {
            o.isFunction(r.old) && r.old.call(this), r.queue ? o.dequeue(this, r.queue) : !1 !== e && o._unmark(this);
          }),
          r
        );
      },
      easing: {
        linear: function (e, t, n, r) {
          return n + r * e;
        },
        swing: function (e, t, n, r) {
          return (-Math.cos(e * Math.PI) / 2 + 0.5) * r + n;
        },
      },
      timers: [],
      fx: function (e, t, n) {
        (this.options = t), (this.elem = e), (this.prop = n), (t.orig = t.orig || {});
      },
    }),
    (o.fx.prototype = {
      update: function () {
        this.options.step && this.options.step.call(this.elem, this.now, this),
          (o.fx.step[this.prop] || o.fx.step._default)(this);
      },
      cur: function () {
        if (null != this.elem[this.prop] && (!this.elem.style || null == this.elem.style[this.prop]))
          return this.elem[this.prop];
        var e,
          t = o.css(this.elem, this.prop);
        return isNaN((e = parseFloat(t))) ? (t && 'auto' !== t ? t : 0) : e;
      },
      custom: function (e, n, r) {
        var i = this,
          a = o.fx;
        function s(e) {
          return i.step(e);
        }
        (this.startTime = at || ft()),
          (this.end = n),
          (this.now = this.start = e),
          (this.pos = this.state = 0),
          (this.unit = r || this.unit || (o.cssNumber[this.prop] ? '' : 'px')),
          (s.queue = this.options.queue),
          (s.elem = this.elem),
          (s.saveState = function () {
            i.options.hide && o._data(i.elem, 'fxshow' + i.prop) === t && o._data(i.elem, 'fxshow' + i.prop, i.start);
          }),
          s() && o.timers.push(s) && !ot && (ot = setInterval(a.tick, a.interval));
      },
      show: function () {
        var e = o._data(this.elem, 'fxshow' + this.prop);
        (this.options.orig[this.prop] = e || o.style(this.elem, this.prop)),
          (this.options.show = !0),
          e !== t
            ? this.custom(this.cur(), e)
            : this.custom('width' === this.prop || 'height' === this.prop ? 1 : 0, this.cur()),
          o(this.elem).show();
      },
      hide: function () {
        (this.options.orig[this.prop] = o._data(this.elem, 'fxshow' + this.prop) || o.style(this.elem, this.prop)),
          (this.options.hide = !0),
          this.custom(this.cur(), 0);
      },
      step: function (e) {
        var t,
          n,
          r,
          i = at || ft(),
          a = !0,
          s = this.elem,
          l = this.options;
        if (e || i >= l.duration + this.startTime) {
          for (t in ((this.now = this.end),
          (this.pos = this.state = 1),
          this.update(),
          (l.animatedProperties[this.prop] = !0),
          l.animatedProperties))
            !0 !== l.animatedProperties[t] && (a = !1);
          if (a) {
            if (
              (null == l.overflow ||
                o.support.shrinkWrapBlocks ||
                o.each(['', 'X', 'Y'], function (e, t) {
                  s.style['overflow' + t] = l.overflow[e];
                }),
              l.hide && o(s).hide(),
              l.hide || l.show)
            )
              for (t in l.animatedProperties)
                o.style(s, t, l.orig[t]), o.removeData(s, 'fxshow' + t, !0), o.removeData(s, 'toggle' + t, !0);
            (r = l.complete) && ((l.complete = !1), r.call(s));
          }
          return !1;
        }
        return (
          l.duration == 1 / 0
            ? (this.now = i)
            : ((n = i - this.startTime),
              (this.state = n / l.duration),
              (this.pos = o.easing[l.animatedProperties[this.prop]](this.state, n, 0, 1, l.duration)),
              (this.now = this.start + (this.end - this.start) * this.pos)),
          this.update(),
          !0
        );
      },
    }),
    o.extend(o.fx, {
      tick: function () {
        for (var e, t = o.timers, n = 0; n < t.length; n++) (e = t[n])() || t[n] !== e || t.splice(n--, 1);
        t.length || o.fx.stop();
      },
      interval: 13,
      stop: function () {
        clearInterval(ot), (ot = null);
      },
      speeds: { slow: 600, fast: 200, _default: 400 },
      step: {
        opacity: function (e) {
          o.style(e.elem, 'opacity', e.now);
        },
        _default: function (e) {
          e.elem.style && null != e.elem.style[e.prop]
            ? (e.elem.style[e.prop] = e.now + e.unit)
            : (e.elem[e.prop] = e.now);
        },
      },
    }),
    o.each(['width', 'height'], function (e, t) {
      o.fx.step[t] = function (e) {
        o.style(e.elem, t, Math.max(0, e.now));
      };
    }),
    o.expr &&
      o.expr.filters &&
      (o.expr.filters.animated = function (e) {
        return o.grep(o.timers, function (t) {
          return e === t.elem;
        }).length;
      });
  var mt = /^t(?:able|d|h)$/i,
    gt = /^(?:body|html)$/i;
  function yt(e) {
    return o.isWindow(e) ? e : 9 === e.nodeType && (e.defaultView || e.parentWindow);
  }
  'getBoundingClientRect' in n.documentElement
    ? (o.fn.offset = function (e) {
        var t,
          n = this[0];
        if (e)
          return this.each(function (t) {
            o.offset.setOffset(this, e, t);
          });
        if (!n || !n.ownerDocument) return null;
        if (n === n.ownerDocument.body) return o.offset.bodyOffset(n);
        try {
          t = n.getBoundingClientRect();
        } catch (e) {}
        var r = n.ownerDocument,
          i = r.documentElement;
        if (!t || !o.contains(i, n)) return t ? { top: t.top, left: t.left } : { top: 0, left: 0 };
        var a = r.body,
          s = yt(r),
          l = i.clientTop || a.clientTop || 0,
          u = i.clientLeft || a.clientLeft || 0,
          c = s.pageYOffset || (o.support.boxModel && i.scrollTop) || a.scrollTop,
          f = s.pageXOffset || (o.support.boxModel && i.scrollLeft) || a.scrollLeft;
        return { top: t.top + c - l, left: t.left + f - u };
      })
    : (o.fn.offset = function (e) {
        var t = this[0];
        if (e)
          return this.each(function (t) {
            o.offset.setOffset(this, e, t);
          });
        if (!t || !t.ownerDocument) return null;
        if (t === t.ownerDocument.body) return o.offset.bodyOffset(t);
        for (
          var n,
            r = t.offsetParent,
            i = t.ownerDocument,
            a = i.documentElement,
            s = i.body,
            l = i.defaultView,
            u = l ? l.getComputedStyle(t, null) : t.currentStyle,
            c = t.offsetTop,
            f = t.offsetLeft;
          (t = t.parentNode) && t !== s && t !== a && (!o.support.fixedPosition || 'fixed' !== u.position);

        )
          (n = l ? l.getComputedStyle(t, null) : t.currentStyle),
            (c -= t.scrollTop),
            (f -= t.scrollLeft),
            t === r &&
              ((c += t.offsetTop),
              (f += t.offsetLeft),
              !o.support.doesNotAddBorder ||
                (o.support.doesAddBorderForTableAndCells && mt.test(t.nodeName)) ||
                ((c += parseFloat(n.borderTopWidth) || 0), (f += parseFloat(n.borderLeftWidth) || 0)),
              (r = t.offsetParent)),
            o.support.subtractsBorderForOverflowNotVisible &&
              'visible' !== n.overflow &&
              ((c += parseFloat(n.borderTopWidth) || 0), (f += parseFloat(n.borderLeftWidth) || 0)),
            (u = n);
        return (
          ('relative' !== u.position && 'static' !== u.position) || ((c += s.offsetTop), (f += s.offsetLeft)),
          o.support.fixedPosition &&
            'fixed' === u.position &&
            ((c += Math.max(a.scrollTop, s.scrollTop)), (f += Math.max(a.scrollLeft, s.scrollLeft))),
          { top: c, left: f }
        );
      }),
    (o.offset = {
      bodyOffset: function (e) {
        var t = e.offsetTop,
          n = e.offsetLeft;
        return (
          o.support.doesNotIncludeMarginInBodyOffset &&
            ((t += parseFloat(o.css(e, 'marginTop')) || 0), (n += parseFloat(o.css(e, 'marginLeft')) || 0)),
          { top: t, left: n }
        );
      },
      setOffset: function (e, t, n) {
        var r = o.css(e, 'position');
        'static' === r && (e.style.position = 'relative');
        var i,
          a,
          s = o(e),
          l = s.offset(),
          u = o.css(e, 'top'),
          c = o.css(e, 'left'),
          f = {},
          d = {};
        ('absolute' === r || 'fixed' === r) && o.inArray('auto', [u, c]) > -1
          ? ((i = (d = s.position()).top), (a = d.left))
          : ((i = parseFloat(u) || 0), (a = parseFloat(c) || 0)),
          o.isFunction(t) && (t = t.call(e, n, l)),
          null != t.top && (f.top = t.top - l.top + i),
          null != t.left && (f.left = t.left - l.left + a),
          'using' in t ? t.using.call(e, f) : s.css(f);
      },
    }),
    o.fn.extend({
      position: function () {
        if (!this[0]) return null;
        var e = this[0],
          t = this.offsetParent(),
          n = this.offset(),
          r = gt.test(t[0].nodeName) ? { top: 0, left: 0 } : t.offset();
        return (
          (n.top -= parseFloat(o.css(e, 'marginTop')) || 0),
          (n.left -= parseFloat(o.css(e, 'marginLeft')) || 0),
          (r.top += parseFloat(o.css(t[0], 'borderTopWidth')) || 0),
          (r.left += parseFloat(o.css(t[0], 'borderLeftWidth')) || 0),
          { top: n.top - r.top, left: n.left - r.left }
        );
      },
      offsetParent: function () {
        return this.map(function () {
          for (var e = this.offsetParent || n.body; e && !gt.test(e.nodeName) && 'static' === o.css(e, 'position'); )
            e = e.offsetParent;
          return e;
        });
      },
    }),
    o.each(['Left', 'Top'], function (e, n) {
      var r = 'scroll' + n;
      o.fn[r] = function (n) {
        var i, a;
        return n === t
          ? (i = this[0])
            ? (a = yt(i))
              ? 'pageXOffset' in a
                ? a[e ? 'pageYOffset' : 'pageXOffset']
                : (o.support.boxModel && a.document.documentElement[r]) || a.document.body[r]
              : i[r]
            : null
          : this.each(function () {
              (a = yt(this)) ? a.scrollTo(e ? o(a).scrollLeft() : n, e ? n : o(a).scrollTop()) : (this[r] = n);
            });
      };
    }),
    o.each(['Height', 'Width'], function (e, n) {
      var r = n.toLowerCase();
      (o.fn['inner' + n] = function () {
        var e = this[0];
        return e ? (e.style ? parseFloat(o.css(e, r, 'padding')) : this[r]()) : null;
      }),
        (o.fn['outer' + n] = function (e) {
          var t = this[0];
          return t ? (t.style ? parseFloat(o.css(t, r, e ? 'margin' : 'border')) : this[r]()) : null;
        }),
        (o.fn[r] = function (e) {
          var i = this[0];
          if (!i) return null == e ? null : this;
          if (o.isFunction(e))
            return this.each(function (t) {
              var n = o(this);
              n[r](e.call(this, t, n[r]()));
            });
          if (o.isWindow(i)) {
            var a = i.document.documentElement['client' + n],
              s = i.document.body;
            return ('CSS1Compat' === i.document.compatMode && a) || (s && s['client' + n]) || a;
          }
          if (9 === i.nodeType)
            return Math.max(
              i.documentElement['client' + n],
              i.body['scroll' + n],
              i.documentElement['scroll' + n],
              i.body['offset' + n],
              i.documentElement['offset' + n]
            );
          if (e === t) {
            var l = o.css(i, r),
              u = parseFloat(l);
            return o.isNumeric(u) ? u : l;
          }
          return this.css(r, 'string' == typeof e ? e : e + 'px');
        });
    }),
    (e.jQuery = e.$ = o);
})(window);
