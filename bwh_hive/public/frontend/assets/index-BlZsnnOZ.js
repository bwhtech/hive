const __vite__mapDeps = (
	i,
	m = __vite__mapDeps,
	d = m.f ||
		(m.f = [
			"assets/ProjectsPage-Dr-0yX2r.js",
			"assets/badge-CcCP7YcG.js",
			"assets/ProjectDetailPage-B5DvpmvT.js",
		])
) => i.map((i) => d[i]);
var HE = Object.defineProperty,
	qE = Object.defineProperties;
var PE = Object.getOwnPropertyDescriptors;
var xc = Object.getOwnPropertySymbols;
var db = Object.prototype.hasOwnProperty,
	hb = Object.prototype.propertyIsEnumerable;
var ds = (n, r) => ((r = Symbol[n]) ? r : Symbol.for("Symbol." + n)),
	VE = (n) => {
		throw TypeError(n);
	},
	_h = Math.pow,
	kh = (n, r, o) =>
		r in n
			? HE(n, r, { enumerable: !0, configurable: !0, writable: !0, value: o })
			: (n[r] = o),
	P = (n, r) => {
		for (var o in r || (r = {})) db.call(r, o) && kh(n, o, r[o]);
		if (xc) for (var o of xc(r)) hb.call(r, o) && kh(n, o, r[o]);
		return n;
	},
	_e = (n, r) => qE(n, PE(r));
var Be = (n, r) => {
	var o = {};
	for (var i in n) db.call(n, i) && r.indexOf(i) < 0 && (o[i] = n[i]);
	if (n != null && xc) for (var i of xc(n)) r.indexOf(i) < 0 && hb.call(n, i) && (o[i] = n[i]);
	return o;
};
var jt = (n, r, o) => kh(n, typeof r != "symbol" ? r + "" : r, o);
var Et = (n, r, o) =>
		new Promise((i, l) => {
			var u = (p) => {
					try {
						h(o.next(p));
					} catch (f) {
						l(f);
					}
				},
				c = (p) => {
					try {
						h(o.throw(p));
					} catch (f) {
						l(f);
					}
				},
				h = (p) => (p.done ? i(p.value) : Promise.resolve(p.value).then(u, c));
			h((o = o.apply(n, r)).next());
		}),
	ui = function (n, r) {
		(this[0] = n), (this[1] = r);
	},
	Dh = (n, r, o) => {
		var i = (c, h, p, f) => {
				try {
					var y = o[c](h),
						g = (h = y.value) instanceof ui,
						S = y.done;
					Promise.resolve(g ? h[0] : h)
						.then((b) =>
							g
								? i(
										c === "return" ? c : "next",
										h[1] ? { done: b.done, value: b.value } : b,
										p,
										f
								  )
								: p({ value: b, done: S })
						)
						.catch((b) => i("throw", b, p, f));
				} catch (b) {
					f(b);
				}
			},
			l = (c) => (u[c] = (h) => new Promise((p, f) => i(c, h, p, f))),
			u = {};
		return (
			(o = o.apply(n, r)),
			(u[ds("asyncIterator")] = () => u),
			l("next"),
			l("throw"),
			l("return"),
			u
		);
	},
	Nh = (n) => {
		var r = n[ds("asyncIterator")],
			o = !1,
			i,
			l = {};
		return (
			r == null
				? ((r = n[ds("iterator")]()), (i = (u) => (l[u] = (c) => r[u](c))))
				: ((r = r.call(n)),
				  (i = (u) =>
						(l[u] = (c) => {
							if (o) {
								if (((o = !1), u === "throw")) throw c;
								return c;
							}
							return (
								(o = !0),
								{
									done: !1,
									value: new ui(
										new Promise((h) => {
											var p = r[u](c);
											p instanceof Object || VE("Object expected"), h(p);
										}),
										1
									),
								}
							);
						}))),
			(l[ds("iterator")] = () => l),
			i("next"),
			"throw" in r
				? i("throw")
				: (l.throw = (u) => {
						throw u;
				  }),
			"return" in r && i("return"),
			l
		);
	},
	pb = (n, r, o) =>
		(r = n[ds("asyncIterator")])
			? r.call(n)
			: ((n = n[ds("iterator")]()),
			  (r = {}),
			  (o = (i, l) =>
					(l = n[i]) &&
					(r[i] = (u) =>
						new Promise(
							(c, h, p) => (
								(u = l.call(n, u)),
								(p = u.done),
								Promise.resolve(u.value).then((f) => c({ value: f, done: p }), h)
							)
						))),
			  o("next"),
			  o("return"),
			  r);
function YE(n, r) {
	for (var o = 0; o < r.length; o++) {
		const i = r[o];
		if (typeof i != "string" && !Array.isArray(i)) {
			for (const l in i)
				if (l !== "default" && !(l in n)) {
					const u = Object.getOwnPropertyDescriptor(i, l);
					u &&
						Object.defineProperty(
							n,
							l,
							u.get ? u : { enumerable: !0, get: () => i[l] }
						);
				}
		}
	}
	return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
(function () {
	const r = document.createElement("link").relList;
	if (r && r.supports && r.supports("modulepreload")) return;
	for (const l of document.querySelectorAll('link[rel="modulepreload"]')) i(l);
	new MutationObserver((l) => {
		for (const u of l)
			if (u.type === "childList")
				for (const c of u.addedNodes)
					c.tagName === "LINK" && c.rel === "modulepreload" && i(c);
	}).observe(document, { childList: !0, subtree: !0 });
	function o(l) {
		const u = {};
		return (
			l.integrity && (u.integrity = l.integrity),
			l.referrerPolicy && (u.referrerPolicy = l.referrerPolicy),
			l.crossOrigin === "use-credentials"
				? (u.credentials = "include")
				: l.crossOrigin === "anonymous"
				? (u.credentials = "omit")
				: (u.credentials = "same-origin"),
			u
		);
	}
	function i(l) {
		if (l.ep) return;
		l.ep = !0;
		const u = o(l);
		fetch(l.href, u);
	}
})();
function n1(n) {
	return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Lh = { exports: {} },
	Dl = {};
var mb;
function IE() {
	if (mb) return Dl;
	mb = 1;
	var n = Symbol.for("react.transitional.element"),
		r = Symbol.for("react.fragment");
	function o(i, l, u) {
		var c = null;
		if ((u !== void 0 && (c = "" + u), l.key !== void 0 && (c = "" + l.key), "key" in l)) {
			u = {};
			for (var h in l) h !== "key" && (u[h] = l[h]);
		} else u = l;
		return (
			(l = u.ref), { $$typeof: n, type: i, key: c, ref: l !== void 0 ? l : null, props: u }
		);
	}
	return (Dl.Fragment = r), (Dl.jsx = o), (Dl.jsxs = o), Dl;
}
var gb;
function GE() {
	return gb || ((gb = 1), (Lh.exports = IE())), Lh.exports;
}
var K = GE(),
	zh = { exports: {} },
	at = {};
var yb;
function FE() {
	if (yb) return at;
	yb = 1;
	var n = Symbol.for("react.transitional.element"),
		r = Symbol.for("react.portal"),
		o = Symbol.for("react.fragment"),
		i = Symbol.for("react.strict_mode"),
		l = Symbol.for("react.profiler"),
		u = Symbol.for("react.consumer"),
		c = Symbol.for("react.context"),
		h = Symbol.for("react.forward_ref"),
		p = Symbol.for("react.suspense"),
		f = Symbol.for("react.memo"),
		y = Symbol.for("react.lazy"),
		g = Symbol.for("react.activity"),
		S = Symbol.iterator;
	function b(B) {
		return B === null || typeof B != "object"
			? null
			: ((B = (S && B[S]) || B["@@iterator"]), typeof B == "function" ? B : null);
	}
	var w = {
			isMounted: function () {
				return !1;
			},
			enqueueForceUpdate: function () {},
			enqueueReplaceState: function () {},
			enqueueSetState: function () {},
		},
		R = Object.assign,
		O = {};
	function T(B, Z, ee) {
		(this.props = B), (this.context = Z), (this.refs = O), (this.updater = ee || w);
	}
	(T.prototype.isReactComponent = {}),
		(T.prototype.setState = function (B, Z) {
			if (typeof B != "object" && typeof B != "function" && B != null)
				throw Error(
					"takes an object of state variables to update or a function which returns an object of state variables."
				);
			this.updater.enqueueSetState(this, B, Z, "setState");
		}),
		(T.prototype.forceUpdate = function (B) {
			this.updater.enqueueForceUpdate(this, B, "forceUpdate");
		});
	function L() {}
	L.prototype = T.prototype;
	function M(B, Z, ee) {
		(this.props = B), (this.context = Z), (this.refs = O), (this.updater = ee || w);
	}
	var _ = (M.prototype = new L());
	(_.constructor = M), R(_, T.prototype), (_.isPureReactComponent = !0);
	var N = Array.isArray;
	function D() {}
	var H = { H: null, A: null, T: null, S: null },
		U = Object.prototype.hasOwnProperty;
	function fe(B, Z, ee) {
		var ie = ee.ref;
		return { $$typeof: n, type: B, key: Z, ref: ie !== void 0 ? ie : null, props: ee };
	}
	function we(B, Z) {
		return fe(B.type, Z, B.props);
	}
	function se(B) {
		return typeof B == "object" && B !== null && B.$$typeof === n;
	}
	function Y(B) {
		var Z = { "=": "=0", ":": "=2" };
		return (
			"$" +
			B.replace(/[=:]/g, function (ee) {
				return Z[ee];
			})
		);
	}
	var oe = /\/+/g;
	function xe(B, Z) {
		return typeof B == "object" && B !== null && B.key != null
			? Y("" + B.key)
			: Z.toString(36);
	}
	function ge(B) {
		switch (B.status) {
			case "fulfilled":
				return B.value;
			case "rejected":
				throw B.reason;
			default:
				switch (
					(typeof B.status == "string"
						? B.then(D, D)
						: ((B.status = "pending"),
						  B.then(
								function (Z) {
									B.status === "pending" &&
										((B.status = "fulfilled"), (B.value = Z));
								},
								function (Z) {
									B.status === "pending" &&
										((B.status = "rejected"), (B.reason = Z));
								}
						  )),
					B.status)
				) {
					case "fulfilled":
						return B.value;
					case "rejected":
						throw B.reason;
				}
		}
		throw B;
	}
	function j(B, Z, ee, ie, me) {
		var ve = typeof B;
		(ve === "undefined" || ve === "boolean") && (B = null);
		var ke = !1;
		if (B === null) ke = !0;
		else
			switch (ve) {
				case "bigint":
				case "string":
				case "number":
					ke = !0;
					break;
				case "object":
					switch (B.$$typeof) {
						case n:
						case r:
							ke = !0;
							break;
						case y:
							return (ke = B._init), j(ke(B._payload), Z, ee, ie, me);
					}
			}
		if (ke)
			return (
				(me = me(B)),
				(ke = ie === "" ? "." + xe(B, 0) : ie),
				N(me)
					? ((ee = ""),
					  ke != null && (ee = ke.replace(oe, "$&/") + "/"),
					  j(me, Z, ee, "", function (Qe) {
							return Qe;
					  }))
					: me != null &&
					  (se(me) &&
							(me = we(
								me,
								ee +
									(me.key == null || (B && B.key === me.key)
										? ""
										: ("" + me.key).replace(oe, "$&/") + "/") +
									ke
							)),
					  Z.push(me)),
				1
			);
		ke = 0;
		var je = ie === "" ? "." : ie + ":";
		if (N(B))
			for (var Ee = 0; Ee < B.length; Ee++)
				(ie = B[Ee]), (ve = je + xe(ie, Ee)), (ke += j(ie, Z, ee, ve, me));
		else if (((Ee = b(B)), typeof Ee == "function"))
			for (B = Ee.call(B), Ee = 0; !(ie = B.next()).done; )
				(ie = ie.value), (ve = je + xe(ie, Ee++)), (ke += j(ie, Z, ee, ve, me));
		else if (ve === "object") {
			if (typeof B.then == "function") return j(ge(B), Z, ee, ie, me);
			throw (
				((Z = String(B)),
				Error(
					"Objects are not valid as a React child (found: " +
						(Z === "[object Object]"
							? "object with keys {" + Object.keys(B).join(", ") + "}"
							: Z) +
						"). If you meant to render a collection of children, use an array instead."
				))
			);
		}
		return ke;
	}
	function I(B, Z, ee) {
		if (B == null) return B;
		var ie = [],
			me = 0;
		return (
			j(B, ie, "", "", function (ve) {
				return Z.call(ee, ve, me++);
			}),
			ie
		);
	}
	function F(B) {
		if (B._status === -1) {
			var Z = B._result;
			(Z = Z()),
				Z.then(
					function (ee) {
						(B._status === 0 || B._status === -1) &&
							((B._status = 1), (B._result = ee));
					},
					function (ee) {
						(B._status === 0 || B._status === -1) &&
							((B._status = 2), (B._result = ee));
					}
				),
				B._status === -1 && ((B._status = 0), (B._result = Z));
		}
		if (B._status === 1) return B._result.default;
		throw B._result;
	}
	var pe =
			typeof reportError == "function"
				? reportError
				: function (B) {
						if (typeof window == "object" && typeof window.ErrorEvent == "function") {
							var Z = new window.ErrorEvent("error", {
								bubbles: !0,
								cancelable: !0,
								message:
									typeof B == "object" &&
									B !== null &&
									typeof B.message == "string"
										? String(B.message)
										: String(B),
								error: B,
							});
							if (!window.dispatchEvent(Z)) return;
						} else if (
							typeof process == "object" &&
							typeof process.emit == "function"
						) {
							process.emit("uncaughtException", B);
							return;
						}
						console.error(B);
				  },
		J = {
			map: I,
			forEach: function (B, Z, ee) {
				I(
					B,
					function () {
						Z.apply(this, arguments);
					},
					ee
				);
			},
			count: function (B) {
				var Z = 0;
				return (
					I(B, function () {
						Z++;
					}),
					Z
				);
			},
			toArray: function (B) {
				return (
					I(B, function (Z) {
						return Z;
					}) || []
				);
			},
			only: function (B) {
				if (!se(B))
					throw Error(
						"React.Children.only expected to receive a single React element child."
					);
				return B;
			},
		};
	return (
		(at.Activity = g),
		(at.Children = J),
		(at.Component = T),
		(at.Fragment = o),
		(at.Profiler = l),
		(at.PureComponent = M),
		(at.StrictMode = i),
		(at.Suspense = p),
		(at.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = H),
		(at.__COMPILER_RUNTIME = {
			__proto__: null,
			c: function (B) {
				return H.H.useMemoCache(B);
			},
		}),
		(at.cache = function (B) {
			return function () {
				return B.apply(null, arguments);
			};
		}),
		(at.cacheSignal = function () {
			return null;
		}),
		(at.cloneElement = function (B, Z, ee) {
			if (B == null)
				throw Error("The argument must be a React element, but you passed " + B + ".");
			var ie = R({}, B.props),
				me = B.key;
			if (Z != null)
				for (ve in (Z.key !== void 0 && (me = "" + Z.key), Z))
					!U.call(Z, ve) ||
						ve === "key" ||
						ve === "__self" ||
						ve === "__source" ||
						(ve === "ref" && Z.ref === void 0) ||
						(ie[ve] = Z[ve]);
			var ve = arguments.length - 2;
			if (ve === 1) ie.children = ee;
			else if (1 < ve) {
				for (var ke = Array(ve), je = 0; je < ve; je++) ke[je] = arguments[je + 2];
				ie.children = ke;
			}
			return fe(B.type, me, ie);
		}),
		(at.createContext = function (B) {
			return (
				(B = {
					$$typeof: c,
					_currentValue: B,
					_currentValue2: B,
					_threadCount: 0,
					Provider: null,
					Consumer: null,
				}),
				(B.Provider = B),
				(B.Consumer = { $$typeof: u, _context: B }),
				B
			);
		}),
		(at.createElement = function (B, Z, ee) {
			var ie,
				me = {},
				ve = null;
			if (Z != null)
				for (ie in (Z.key !== void 0 && (ve = "" + Z.key), Z))
					U.call(Z, ie) &&
						ie !== "key" &&
						ie !== "__self" &&
						ie !== "__source" &&
						(me[ie] = Z[ie]);
			var ke = arguments.length - 2;
			if (ke === 1) me.children = ee;
			else if (1 < ke) {
				for (var je = Array(ke), Ee = 0; Ee < ke; Ee++) je[Ee] = arguments[Ee + 2];
				me.children = je;
			}
			if (B && B.defaultProps)
				for (ie in ((ke = B.defaultProps), ke)) me[ie] === void 0 && (me[ie] = ke[ie]);
			return fe(B, ve, me);
		}),
		(at.createRef = function () {
			return { current: null };
		}),
		(at.forwardRef = function (B) {
			return { $$typeof: h, render: B };
		}),
		(at.isValidElement = se),
		(at.lazy = function (B) {
			return { $$typeof: y, _payload: { _status: -1, _result: B }, _init: F };
		}),
		(at.memo = function (B, Z) {
			return { $$typeof: f, type: B, compare: Z === void 0 ? null : Z };
		}),
		(at.startTransition = function (B) {
			var Z = H.T,
				ee = {};
			H.T = ee;
			try {
				var ie = B(),
					me = H.S;
				me !== null && me(ee, ie),
					typeof ie == "object" &&
						ie !== null &&
						typeof ie.then == "function" &&
						ie.then(D, pe);
			} catch (ve) {
				pe(ve);
			} finally {
				Z !== null && ee.types !== null && (Z.types = ee.types), (H.T = Z);
			}
		}),
		(at.unstable_useCacheRefresh = function () {
			return H.H.useCacheRefresh();
		}),
		(at.use = function (B) {
			return H.H.use(B);
		}),
		(at.useActionState = function (B, Z, ee) {
			return H.H.useActionState(B, Z, ee);
		}),
		(at.useCallback = function (B, Z) {
			return H.H.useCallback(B, Z);
		}),
		(at.useContext = function (B) {
			return H.H.useContext(B);
		}),
		(at.useDebugValue = function () {}),
		(at.useDeferredValue = function (B, Z) {
			return H.H.useDeferredValue(B, Z);
		}),
		(at.useEffect = function (B, Z) {
			return H.H.useEffect(B, Z);
		}),
		(at.useEffectEvent = function (B) {
			return H.H.useEffectEvent(B);
		}),
		(at.useId = function () {
			return H.H.useId();
		}),
		(at.useImperativeHandle = function (B, Z, ee) {
			return H.H.useImperativeHandle(B, Z, ee);
		}),
		(at.useInsertionEffect = function (B, Z) {
			return H.H.useInsertionEffect(B, Z);
		}),
		(at.useLayoutEffect = function (B, Z) {
			return H.H.useLayoutEffect(B, Z);
		}),
		(at.useMemo = function (B, Z) {
			return H.H.useMemo(B, Z);
		}),
		(at.useOptimistic = function (B, Z) {
			return H.H.useOptimistic(B, Z);
		}),
		(at.useReducer = function (B, Z, ee) {
			return H.H.useReducer(B, Z, ee);
		}),
		(at.useRef = function (B) {
			return H.H.useRef(B);
		}),
		(at.useState = function (B) {
			return H.H.useState(B);
		}),
		(at.useSyncExternalStore = function (B, Z, ee) {
			return H.H.useSyncExternalStore(B, Z, ee);
		}),
		(at.useTransition = function () {
			return H.H.useTransition();
		}),
		(at.version = "19.2.4"),
		at
	);
}
var bb;
function Kl() {
	return bb || ((bb = 1), (zh.exports = FE())), zh.exports;
}
var v = Kl();
const De = n1(v),
	r1 = YE({ __proto__: null, default: De }, [v]);
var jh = { exports: {} },
	Nl = {},
	Bh = { exports: {} },
	Uh = {};
var vb;
function XE() {
	return (
		vb ||
			((vb = 1),
			(function (n) {
				function r(j, I) {
					var F = j.length;
					j.push(I);
					e: for (; 0 < F; ) {
						var pe = (F - 1) >>> 1,
							J = j[pe];
						if (0 < l(J, I)) (j[pe] = I), (j[F] = J), (F = pe);
						else break e;
					}
				}
				function o(j) {
					return j.length === 0 ? null : j[0];
				}
				function i(j) {
					if (j.length === 0) return null;
					var I = j[0],
						F = j.pop();
					if (F !== I) {
						j[0] = F;
						e: for (var pe = 0, J = j.length, B = J >>> 1; pe < B; ) {
							var Z = 2 * (pe + 1) - 1,
								ee = j[Z],
								ie = Z + 1,
								me = j[ie];
							if (0 > l(ee, F))
								ie < J && 0 > l(me, ee)
									? ((j[pe] = me), (j[ie] = F), (pe = ie))
									: ((j[pe] = ee), (j[Z] = F), (pe = Z));
							else if (ie < J && 0 > l(me, F)) (j[pe] = me), (j[ie] = F), (pe = ie);
							else break e;
						}
					}
					return I;
				}
				function l(j, I) {
					var F = j.sortIndex - I.sortIndex;
					return F !== 0 ? F : j.id - I.id;
				}
				if (
					((n.unstable_now = void 0),
					typeof performance == "object" && typeof performance.now == "function")
				) {
					var u = performance;
					n.unstable_now = function () {
						return u.now();
					};
				} else {
					var c = Date,
						h = c.now();
					n.unstable_now = function () {
						return c.now() - h;
					};
				}
				var p = [],
					f = [],
					y = 1,
					g = null,
					S = 3,
					b = !1,
					w = !1,
					R = !1,
					O = !1,
					T = typeof setTimeout == "function" ? setTimeout : null,
					L = typeof clearTimeout == "function" ? clearTimeout : null,
					M = typeof setImmediate != "undefined" ? setImmediate : null;
				function _(j) {
					for (var I = o(f); I !== null; ) {
						if (I.callback === null) i(f);
						else if (I.startTime <= j) i(f), (I.sortIndex = I.expirationTime), r(p, I);
						else break;
						I = o(f);
					}
				}
				function N(j) {
					if (((R = !1), _(j), !w))
						if (o(p) !== null) (w = !0), D || ((D = !0), Y());
						else {
							var I = o(f);
							I !== null && ge(N, I.startTime - j);
						}
				}
				var D = !1,
					H = -1,
					U = 5,
					fe = -1;
				function we() {
					return O ? !0 : !(n.unstable_now() - fe < U);
				}
				function se() {
					if (((O = !1), D)) {
						var j = n.unstable_now();
						fe = j;
						var I = !0;
						try {
							e: {
								(w = !1), R && ((R = !1), L(H), (H = -1)), (b = !0);
								var F = S;
								try {
									t: {
										for (
											_(j), g = o(p);
											g !== null && !(g.expirationTime > j && we());

										) {
											var pe = g.callback;
											if (typeof pe == "function") {
												(g.callback = null), (S = g.priorityLevel);
												var J = pe(g.expirationTime <= j);
												if (
													((j = n.unstable_now()),
													typeof J == "function")
												) {
													(g.callback = J), _(j), (I = !0);
													break t;
												}
												g === o(p) && i(p), _(j);
											} else i(p);
											g = o(p);
										}
										if (g !== null) I = !0;
										else {
											var B = o(f);
											B !== null && ge(N, B.startTime - j), (I = !1);
										}
									}
									break e;
								} finally {
									(g = null), (S = F), (b = !1);
								}
								I = void 0;
							}
						} finally {
							I ? Y() : (D = !1);
						}
					}
				}
				var Y;
				if (typeof M == "function")
					Y = function () {
						M(se);
					};
				else if (typeof MessageChannel != "undefined") {
					var oe = new MessageChannel(),
						xe = oe.port2;
					(oe.port1.onmessage = se),
						(Y = function () {
							xe.postMessage(null);
						});
				} else
					Y = function () {
						T(se, 0);
					};
				function ge(j, I) {
					H = T(function () {
						j(n.unstable_now());
					}, I);
				}
				(n.unstable_IdlePriority = 5),
					(n.unstable_ImmediatePriority = 1),
					(n.unstable_LowPriority = 4),
					(n.unstable_NormalPriority = 3),
					(n.unstable_Profiling = null),
					(n.unstable_UserBlockingPriority = 2),
					(n.unstable_cancelCallback = function (j) {
						j.callback = null;
					}),
					(n.unstable_forceFrameRate = function (j) {
						0 > j || 125 < j
							? console.error(
									"forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
							  )
							: (U = 0 < j ? Math.floor(1e3 / j) : 5);
					}),
					(n.unstable_getCurrentPriorityLevel = function () {
						return S;
					}),
					(n.unstable_next = function (j) {
						switch (S) {
							case 1:
							case 2:
							case 3:
								var I = 3;
								break;
							default:
								I = S;
						}
						var F = S;
						S = I;
						try {
							return j();
						} finally {
							S = F;
						}
					}),
					(n.unstable_requestPaint = function () {
						O = !0;
					}),
					(n.unstable_runWithPriority = function (j, I) {
						switch (j) {
							case 1:
							case 2:
							case 3:
							case 4:
							case 5:
								break;
							default:
								j = 3;
						}
						var F = S;
						S = j;
						try {
							return I();
						} finally {
							S = F;
						}
					}),
					(n.unstable_scheduleCallback = function (j, I, F) {
						var pe = n.unstable_now();
						switch (
							(typeof F == "object" && F !== null
								? ((F = F.delay),
								  (F = typeof F == "number" && 0 < F ? pe + F : pe))
								: (F = pe),
							j)
						) {
							case 1:
								var J = -1;
								break;
							case 2:
								J = 250;
								break;
							case 5:
								J = 1073741823;
								break;
							case 4:
								J = 1e4;
								break;
							default:
								J = 5e3;
						}
						return (
							(J = F + J),
							(j = {
								id: y++,
								callback: I,
								priorityLevel: j,
								startTime: F,
								expirationTime: J,
								sortIndex: -1,
							}),
							F > pe
								? ((j.sortIndex = F),
								  r(f, j),
								  o(p) === null &&
										j === o(f) &&
										(R ? (L(H), (H = -1)) : (R = !0), ge(N, F - pe)))
								: ((j.sortIndex = J),
								  r(p, j),
								  w || b || ((w = !0), D || ((D = !0), Y()))),
							j
						);
					}),
					(n.unstable_shouldYield = we),
					(n.unstable_wrapCallback = function (j) {
						var I = S;
						return function () {
							var F = S;
							S = I;
							try {
								return j.apply(this, arguments);
							} finally {
								S = F;
							}
						};
					});
			})(Uh)),
		Uh
	);
}
var Sb;
function KE() {
	return Sb || ((Sb = 1), (Bh.exports = XE())), Bh.exports;
}
var Hh = { exports: {} },
	jn = {};
var xb;
function QE() {
	if (xb) return jn;
	xb = 1;
	var n = Kl();
	function r(p) {
		var f = "https://react.dev/errors/" + p;
		if (1 < arguments.length) {
			f += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var y = 2; y < arguments.length; y++)
				f += "&args[]=" + encodeURIComponent(arguments[y]);
		}
		return (
			"Minified React error #" +
			p +
			"; visit " +
			f +
			" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
		);
	}
	function o() {}
	var i = {
			d: {
				f: o,
				r: function () {
					throw Error(r(522));
				},
				D: o,
				C: o,
				L: o,
				m: o,
				X: o,
				S: o,
				M: o,
			},
			p: 0,
			findDOMNode: null,
		},
		l = Symbol.for("react.portal");
	function u(p, f, y) {
		var g = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: l,
			key: g == null ? null : "" + g,
			children: p,
			containerInfo: f,
			implementation: y,
		};
	}
	var c = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function h(p, f) {
		if (p === "font") return "";
		if (typeof f == "string") return f === "use-credentials" ? f : "";
	}
	return (
		(jn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i),
		(jn.createPortal = function (p, f) {
			var y = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
			if (!f || (f.nodeType !== 1 && f.nodeType !== 9 && f.nodeType !== 11))
				throw Error(r(299));
			return u(p, f, null, y);
		}),
		(jn.flushSync = function (p) {
			var f = c.T,
				y = i.p;
			try {
				if (((c.T = null), (i.p = 2), p)) return p();
			} finally {
				(c.T = f), (i.p = y), i.d.f();
			}
		}),
		(jn.preconnect = function (p, f) {
			typeof p == "string" &&
				(f
					? ((f = f.crossOrigin),
					  (f = typeof f == "string" ? (f === "use-credentials" ? f : "") : void 0))
					: (f = null),
				i.d.C(p, f));
		}),
		(jn.prefetchDNS = function (p) {
			typeof p == "string" && i.d.D(p);
		}),
		(jn.preinit = function (p, f) {
			if (typeof p == "string" && f && typeof f.as == "string") {
				var y = f.as,
					g = h(y, f.crossOrigin),
					S = typeof f.integrity == "string" ? f.integrity : void 0,
					b = typeof f.fetchPriority == "string" ? f.fetchPriority : void 0;
				y === "style"
					? i.d.S(p, typeof f.precedence == "string" ? f.precedence : void 0, {
							crossOrigin: g,
							integrity: S,
							fetchPriority: b,
					  })
					: y === "script" &&
					  i.d.X(p, {
							crossOrigin: g,
							integrity: S,
							fetchPriority: b,
							nonce: typeof f.nonce == "string" ? f.nonce : void 0,
					  });
			}
		}),
		(jn.preinitModule = function (p, f) {
			if (typeof p == "string")
				if (typeof f == "object" && f !== null) {
					if (f.as == null || f.as === "script") {
						var y = h(f.as, f.crossOrigin);
						i.d.M(p, {
							crossOrigin: y,
							integrity: typeof f.integrity == "string" ? f.integrity : void 0,
							nonce: typeof f.nonce == "string" ? f.nonce : void 0,
						});
					}
				} else f == null && i.d.M(p);
		}),
		(jn.preload = function (p, f) {
			if (
				typeof p == "string" &&
				typeof f == "object" &&
				f !== null &&
				typeof f.as == "string"
			) {
				var y = f.as,
					g = h(y, f.crossOrigin);
				i.d.L(p, y, {
					crossOrigin: g,
					integrity: typeof f.integrity == "string" ? f.integrity : void 0,
					nonce: typeof f.nonce == "string" ? f.nonce : void 0,
					type: typeof f.type == "string" ? f.type : void 0,
					fetchPriority: typeof f.fetchPriority == "string" ? f.fetchPriority : void 0,
					referrerPolicy:
						typeof f.referrerPolicy == "string" ? f.referrerPolicy : void 0,
					imageSrcSet: typeof f.imageSrcSet == "string" ? f.imageSrcSet : void 0,
					imageSizes: typeof f.imageSizes == "string" ? f.imageSizes : void 0,
					media: typeof f.media == "string" ? f.media : void 0,
				});
			}
		}),
		(jn.preloadModule = function (p, f) {
			if (typeof p == "string")
				if (f) {
					var y = h(f.as, f.crossOrigin);
					i.d.m(p, {
						as: typeof f.as == "string" && f.as !== "script" ? f.as : void 0,
						crossOrigin: y,
						integrity: typeof f.integrity == "string" ? f.integrity : void 0,
					});
				} else i.d.m(p);
		}),
		(jn.requestFormReset = function (p) {
			i.d.r(p);
		}),
		(jn.unstable_batchedUpdates = function (p, f) {
			return p(f);
		}),
		(jn.useFormState = function (p, f, y) {
			return c.H.useFormState(p, f, y);
		}),
		(jn.useFormStatus = function () {
			return c.H.useHostTransitionStatus();
		}),
		(jn.version = "19.2.4"),
		jn
	);
}
var wb;
function o1() {
	if (wb) return Hh.exports;
	wb = 1;
	function n() {
		if (
			!(
				typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ == "undefined" ||
				typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
			)
		)
			try {
				__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
			} catch (r) {
				console.error(r);
			}
	}
	return n(), (Hh.exports = QE()), Hh.exports;
}
var Eb;
function ZE() {
	if (Eb) return Nl;
	Eb = 1;
	var n = KE(),
		r = Kl(),
		o = o1();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var a = 2; a < arguments.length; a++)
				t += "&args[]=" + encodeURIComponent(arguments[a]);
		}
		return (
			"Minified React error #" +
			e +
			"; visit " +
			t +
			" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
		);
	}
	function l(e) {
		return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
	}
	function u(e) {
		var t = e,
			a = e;
		if (e.alternate) for (; t.return; ) t = t.return;
		else {
			e = t;
			do (t = e), (t.flags & 4098) !== 0 && (a = t.return), (e = t.return);
			while (e);
		}
		return t.tag === 3 ? a : null;
	}
	function c(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (
				(t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
				t !== null)
			)
				return t.dehydrated;
		}
		return null;
	}
	function h(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (
				(t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
				t !== null)
			)
				return t.dehydrated;
		}
		return null;
	}
	function p(e) {
		if (u(e) !== e) throw Error(i(188));
	}
	function f(e) {
		var t = e.alternate;
		if (!t) {
			if (((t = u(e)), t === null)) throw Error(i(188));
			return t !== e ? null : e;
		}
		for (var a = e, s = t; ; ) {
			var d = a.return;
			if (d === null) break;
			var m = d.alternate;
			if (m === null) {
				if (((s = d.return), s !== null)) {
					a = s;
					continue;
				}
				break;
			}
			if (d.child === m.child) {
				for (m = d.child; m; ) {
					if (m === a) return p(d), e;
					if (m === s) return p(d), t;
					m = m.sibling;
				}
				throw Error(i(188));
			}
			if (a.return !== s.return) (a = d), (s = m);
			else {
				for (var x = !1, A = d.child; A; ) {
					if (A === a) {
						(x = !0), (a = d), (s = m);
						break;
					}
					if (A === s) {
						(x = !0), (s = d), (a = m);
						break;
					}
					A = A.sibling;
				}
				if (!x) {
					for (A = m.child; A; ) {
						if (A === a) {
							(x = !0), (a = m), (s = d);
							break;
						}
						if (A === s) {
							(x = !0), (s = m), (a = d);
							break;
						}
						A = A.sibling;
					}
					if (!x) throw Error(i(189));
				}
			}
			if (a.alternate !== s) throw Error(i(190));
		}
		if (a.tag !== 3) throw Error(i(188));
		return a.stateNode.current === a ? e : t;
	}
	function y(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null; ) {
			if (((t = y(e)), t !== null)) return t;
			e = e.sibling;
		}
		return null;
	}
	var g = Object.assign,
		S = Symbol.for("react.element"),
		b = Symbol.for("react.transitional.element"),
		w = Symbol.for("react.portal"),
		R = Symbol.for("react.fragment"),
		O = Symbol.for("react.strict_mode"),
		T = Symbol.for("react.profiler"),
		L = Symbol.for("react.consumer"),
		M = Symbol.for("react.context"),
		_ = Symbol.for("react.forward_ref"),
		N = Symbol.for("react.suspense"),
		D = Symbol.for("react.suspense_list"),
		H = Symbol.for("react.memo"),
		U = Symbol.for("react.lazy"),
		fe = Symbol.for("react.activity"),
		we = Symbol.for("react.memo_cache_sentinel"),
		se = Symbol.iterator;
	function Y(e) {
		return e === null || typeof e != "object"
			? null
			: ((e = (se && e[se]) || e["@@iterator"]), typeof e == "function" ? e : null);
	}
	var oe = Symbol.for("react.client.reference");
	function xe(e) {
		if (e == null) return null;
		if (typeof e == "function")
			return e.$$typeof === oe ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case R:
				return "Fragment";
			case T:
				return "Profiler";
			case O:
				return "StrictMode";
			case N:
				return "Suspense";
			case D:
				return "SuspenseList";
			case fe:
				return "Activity";
		}
		if (typeof e == "object")
			switch (e.$$typeof) {
				case w:
					return "Portal";
				case M:
					return e.displayName || "Context";
				case L:
					return (e._context.displayName || "Context") + ".Consumer";
				case _:
					var t = e.render;
					return (
						(e = e.displayName),
						e ||
							((e = t.displayName || t.name || ""),
							(e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
						e
					);
				case H:
					return (t = e.displayName || null), t !== null ? t : xe(e.type) || "Memo";
				case U:
					(t = e._payload), (e = e._init);
					try {
						return xe(e(t));
					} catch (a) {}
			}
		return null;
	}
	var ge = Array.isArray,
		j = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
		I = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
		F = { pending: !1, data: null, method: null, action: null },
		pe = [],
		J = -1;
	function B(e) {
		return { current: e };
	}
	function Z(e) {
		0 > J || ((e.current = pe[J]), (pe[J] = null), J--);
	}
	function ee(e, t) {
		J++, (pe[J] = e.current), (e.current = t);
	}
	var ie = B(null),
		me = B(null),
		ve = B(null),
		ke = B(null);
	function je(e, t) {
		switch ((ee(ve, t), ee(me, e), ee(ie, null), t.nodeType)) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? z0(e) : 0;
				break;
			default:
				if (((e = t.tagName), (t = t.namespaceURI))) (t = z0(t)), (e = j0(t, e));
				else
					switch (e) {
						case "svg":
							e = 1;
							break;
						case "math":
							e = 2;
							break;
						default:
							e = 0;
					}
		}
		Z(ie), ee(ie, e);
	}
	function Ee() {
		Z(ie), Z(me), Z(ve);
	}
	function Qe(e) {
		e.memoizedState !== null && ee(ke, e);
		var t = ie.current,
			a = j0(t, e.type);
		t !== a && (ee(me, e), ee(ie, a));
	}
	function it(e) {
		me.current === e && (Z(ie), Z(me)), ke.current === e && (Z(ke), (Al._currentValue = F));
	}
	var re, ce;
	function de(e) {
		if (re === void 0)
			try {
				throw Error();
			} catch (a) {
				var t = a.stack.trim().match(/\n( *(at )?)/);
				(re = (t && t[1]) || ""),
					(ce =
						-1 <
						a.stack.indexOf(`
    at`)
							? " (<anonymous>)"
							: -1 < a.stack.indexOf("@")
							? "@unknown:0:0"
							: "");
			}
		return (
			`
` +
			re +
			e +
			ce
		);
	}
	var Te = !1;
	function Re(e, t) {
		if (!e || Te) return "";
		Te = !0;
		var a = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var s = {
				DetermineComponentFrameRoot: function () {
					try {
						if (t) {
							var be = function () {
								throw Error();
							};
							if (
								(Object.defineProperty(be.prototype, "props", {
									set: function () {
										throw Error();
									},
								}),
								typeof Reflect == "object" && Reflect.construct)
							) {
								try {
									Reflect.construct(be, []);
								} catch (ue) {
									var ae = ue;
								}
								Reflect.construct(e, [], be);
							} else {
								try {
									be.call();
								} catch (ue) {
									ae = ue;
								}
								e.call(be.prototype);
							}
						} else {
							try {
								throw Error();
							} catch (ue) {
								ae = ue;
							}
							(be = e()) &&
								typeof be.catch == "function" &&
								be.catch(function () {});
						}
					} catch (ue) {
						if (ue && ae && typeof ue.stack == "string") return [ue.stack, ae.stack];
					}
					return [null, null];
				},
			};
			s.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var d = Object.getOwnPropertyDescriptor(s.DetermineComponentFrameRoot, "name");
			d &&
				d.configurable &&
				Object.defineProperty(s.DetermineComponentFrameRoot, "name", {
					value: "DetermineComponentFrameRoot",
				});
			var m = s.DetermineComponentFrameRoot(),
				x = m[0],
				A = m[1];
			if (x && A) {
				var q = x.split(`
`),
					ne = A.split(`
`);
				for (d = s = 0; s < q.length && !q[s].includes("DetermineComponentFrameRoot"); )
					s++;
				for (; d < ne.length && !ne[d].includes("DetermineComponentFrameRoot"); ) d++;
				if (s === q.length || d === ne.length)
					for (s = q.length - 1, d = ne.length - 1; 1 <= s && 0 <= d && q[s] !== ne[d]; )
						d--;
				for (; 1 <= s && 0 <= d; s--, d--)
					if (q[s] !== ne[d]) {
						if (s !== 1 || d !== 1)
							do
								if ((s--, d--, 0 > d || q[s] !== ne[d])) {
									var he =
										`
` + q[s].replace(" at new ", " at ");
									return (
										e.displayName &&
											he.includes("<anonymous>") &&
											(he = he.replace("<anonymous>", e.displayName)),
										he
									);
								}
							while (1 <= s && 0 <= d);
						break;
					}
			}
		} finally {
			(Te = !1), (Error.prepareStackTrace = a);
		}
		return (a = e ? e.displayName || e.name : "") ? de(a) : "";
	}
	function ze(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5:
				return de(e.type);
			case 16:
				return de("Lazy");
			case 13:
				return e.child !== t && t !== null ? de("Suspense Fallback") : de("Suspense");
			case 19:
				return de("SuspenseList");
			case 0:
			case 15:
				return Re(e.type, !1);
			case 11:
				return Re(e.type.render, !1);
			case 1:
				return Re(e.type, !0);
			case 31:
				return de("Activity");
			default:
				return "";
		}
	}
	function Ce(e) {
		try {
			var t = "",
				a = null;
			do (t += ze(e, a)), (a = e), (e = e.return);
			while (e);
			return t;
		} catch (s) {
			return (
				`
Error generating stack: ` +
				s.message +
				`
` +
				s.stack
			);
		}
	}
	var le = Object.prototype.hasOwnProperty,
		Ae = n.unstable_scheduleCallback,
		Se = n.unstable_cancelCallback,
		Ue = n.unstable_shouldYield,
		Ye = n.unstable_requestPaint,
		qe = n.unstable_now,
		X = n.unstable_getCurrentPriorityLevel,
		Pe = n.unstable_ImmediatePriority,
		Jt = n.unstable_UserBlockingPriority,
		st = n.unstable_NormalPriority,
		Mt = n.unstable_LowPriority,
		wt = n.unstable_IdlePriority,
		dn = n.log,
		Tn = n.unstable_setDisableYieldValue,
		qn = null,
		Ze = null;
	function rt(e) {
		if ((typeof dn == "function" && Tn(e), Ze && typeof Ze.setStrictMode == "function"))
			try {
				Ze.setStrictMode(qn, e);
			} catch (t) {}
	}
	var ht = Math.clz32 ? Math.clz32 : lt,
		br = Math.log,
		hn = Math.LN2;
	function lt(e) {
		return (e >>>= 0), e === 0 ? 32 : (31 - ((br(e) / hn) | 0)) | 0;
	}
	var _t = 256,
		en = 262144,
		It = 4194304;
	function Gt(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1:
				return 1;
			case 2:
				return 2;
			case 4:
				return 4;
			case 8:
				return 8;
			case 16:
				return 16;
			case 32:
				return 32;
			case 64:
				return 64;
			case 128:
				return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
				return e & 261888;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
				return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				return e & 62914560;
			case 67108864:
				return 67108864;
			case 134217728:
				return 134217728;
			case 268435456:
				return 268435456;
			case 536870912:
				return 536870912;
			case 1073741824:
				return 0;
			default:
				return e;
		}
	}
	function Je(e, t, a) {
		var s = e.pendingLanes;
		if (s === 0) return 0;
		var d = 0,
			m = e.suspendedLanes,
			x = e.pingedLanes;
		e = e.warmLanes;
		var A = s & 134217727;
		return (
			A !== 0
				? ((s = A & ~m),
				  s !== 0
						? (d = Gt(s))
						: ((x &= A),
						  x !== 0 ? (d = Gt(x)) : a || ((a = A & ~e), a !== 0 && (d = Gt(a)))))
				: ((A = s & ~m),
				  A !== 0
						? (d = Gt(A))
						: x !== 0
						? (d = Gt(x))
						: a || ((a = s & ~e), a !== 0 && (d = Gt(a)))),
			d === 0
				? 0
				: t !== 0 &&
				  t !== d &&
				  (t & m) === 0 &&
				  ((m = d & -d), (a = t & -t), m >= a || (m === 32 && (a & 4194048) !== 0))
				? t
				: d
		);
	}
	function xt(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function Pt(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64:
				return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
				return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824:
				return -1;
			default:
				return -1;
		}
	}
	function Dt() {
		var e = It;
		return (It <<= 1), (It & 62914560) === 0 && (It = 4194304), e;
	}
	function Kn(e) {
		for (var t = [], a = 0; 31 > a; a++) t.push(e);
		return t;
	}
	function Nt(e, t) {
		(e.pendingLanes |= t),
			t !== 268435456 && ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0));
	}
	function Cn(e, t, a, s, d, m) {
		var x = e.pendingLanes;
		(e.pendingLanes = a),
			(e.suspendedLanes = 0),
			(e.pingedLanes = 0),
			(e.warmLanes = 0),
			(e.expiredLanes &= a),
			(e.entangledLanes &= a),
			(e.errorRecoveryDisabledLanes &= a),
			(e.shellSuspendCounter = 0);
		var A = e.entanglements,
			q = e.expirationTimes,
			ne = e.hiddenUpdates;
		for (a = x & ~a; 0 < a; ) {
			var he = 31 - ht(a),
				be = 1 << he;
			(A[he] = 0), (q[he] = -1);
			var ae = ne[he];
			if (ae !== null)
				for (ne[he] = null, he = 0; he < ae.length; he++) {
					var ue = ae[he];
					ue !== null && (ue.lane &= -536870913);
				}
			a &= ~be;
		}
		s !== 0 && Br(e, s, 0),
			m !== 0 && d === 0 && e.tag !== 0 && (e.suspendedLanes |= m & ~(x & ~t));
	}
	function Br(e, t, a) {
		(e.pendingLanes |= t), (e.suspendedLanes &= ~t);
		var s = 31 - ht(t);
		(e.entangledLanes |= t),
			(e.entanglements[s] = e.entanglements[s] | 1073741824 | (a & 261930));
	}
	function pn(e, t) {
		var a = (e.entangledLanes |= t);
		for (e = e.entanglements; a; ) {
			var s = 31 - ht(a),
				d = 1 << s;
			(d & t) | (e[s] & t) && (e[s] |= t), (a &= ~d);
		}
	}
	function xn(e, t) {
		var a = t & -t;
		return (a = (a & 42) !== 0 ? 1 : Xt(a)), (a & (e.suspendedLanes | t)) !== 0 ? 0 : a;
	}
	function Xt(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default:
				e = 0;
		}
		return e;
	}
	function Pn(e) {
		return (e &= -e), 2 < e ? (8 < e ? ((e & 134217727) !== 0 ? 32 : 268435456) : 8) : 2;
	}
	function Ur() {
		var e = I.p;
		return e !== 0 ? e : ((e = window.event), e === void 0 ? 32 : ab(e.type));
	}
	function wi(e, t) {
		var a = I.p;
		try {
			return (I.p = e), t();
		} finally {
			I.p = a;
		}
	}
	var or = Math.random().toString(36).slice(2),
		an = "__reactFiber$" + or,
		sn = "__reactProps$" + or,
		ar = "__reactContainer$" + or,
		$o = "__reactEvents$" + or,
		Df = "__reactListeners$" + or,
		ru = "__reactHandles$" + or,
		ea = "__reactResources$" + or,
		Wr = "__reactMarker$" + or;
	function Hs(e) {
		delete e[an], delete e[sn], delete e[$o], delete e[Df], delete e[ru];
	}
	function ta(e) {
		var t = e[an];
		if (t) return t;
		for (var a = e.parentNode; a; ) {
			if ((t = a[ar] || a[an])) {
				if (((a = t.alternate), t.child !== null || (a !== null && a.child !== null)))
					for (e = Y0(e); e !== null; ) {
						if ((a = e[an])) return a;
						e = Y0(e);
					}
				return t;
			}
			(e = a), (a = e.parentNode);
		}
		return null;
	}
	function $r(e) {
		if ((e = e[an] || e[ar])) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
				return e;
		}
		return null;
	}
	function Pa(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function na(e) {
		var t = e[ea];
		return t || (t = e[ea] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), t;
	}
	function tn(e) {
		e[Wr] = !0;
	}
	var Qn = new Set(),
		Ei = {};
	function eo(e, t) {
		ir(e, t), ir(e + "Capture", t);
	}
	function ir(e, t) {
		for (Ei[e] = t, e = 0; e < t.length; e++) Qn.add(t[e]);
	}
	var ou = RegExp(
			"^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
		),
		au = {},
		iu = {};
	function Nf(e) {
		return le.call(iu, e)
			? !0
			: le.call(au, e)
			? !1
			: ou.test(e)
			? (iu[e] = !0)
			: ((au[e] = !0), !1);
	}
	function vo(e, t, a) {
		if (Nf(t))
			if (a === null) e.removeAttribute(t);
			else {
				switch (typeof a) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var s = t.toLowerCase().slice(0, 5);
						if (s !== "data-" && s !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, "" + a);
			}
	}
	function Va(e, t, a) {
		if (a === null) e.removeAttribute(t);
		else {
			switch (typeof a) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, "" + a);
		}
	}
	function vr(e, t, a, s) {
		if (s === null) e.removeAttribute(a);
		else {
			switch (typeof s) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(a);
					return;
			}
			e.setAttributeNS(t, a, "" + s);
		}
	}
	function Zn(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined":
				return e;
			case "object":
				return e;
			default:
				return "";
		}
	}
	function su(e) {
		var t = e.type;
		return (
			(e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio")
		);
	}
	function Lf(e, t, a) {
		var s = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (
			!e.hasOwnProperty(t) &&
			typeof s != "undefined" &&
			typeof s.get == "function" &&
			typeof s.set == "function"
		) {
			var d = s.get,
				m = s.set;
			return (
				Object.defineProperty(e, t, {
					configurable: !0,
					get: function () {
						return d.call(this);
					},
					set: function (x) {
						(a = "" + x), m.call(this, x);
					},
				}),
				Object.defineProperty(e, t, { enumerable: s.enumerable }),
				{
					getValue: function () {
						return a;
					},
					setValue: function (x) {
						a = "" + x;
					},
					stopTracking: function () {
						(e._valueTracker = null), delete e[t];
					},
				}
			);
		}
	}
	function qs(e) {
		if (!e._valueTracker) {
			var t = su(e) ? "checked" : "value";
			e._valueTracker = Lf(e, t, "" + e[t]);
		}
	}
	function Ps(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var a = t.getValue(),
			s = "";
		return (
			e && (s = su(e) ? (e.checked ? "true" : "false") : e.value),
			(e = s),
			e !== a ? (t.setValue(e), !0) : !1
		);
	}
	function Ya(e) {
		if (
			((e = e || (typeof document != "undefined" ? document : void 0)),
			typeof e == "undefined")
		)
			return null;
		try {
			return e.activeElement || e.body;
		} catch (t) {
			return e.body;
		}
	}
	var So = /[\n"\\]/g;
	function Vn(e) {
		return e.replace(So, function (t) {
			return "\\" + t.charCodeAt(0).toString(16) + " ";
		});
	}
	function Vs(e, t, a, s, d, m, x, A) {
		(e.name = ""),
			x != null && typeof x != "function" && typeof x != "symbol" && typeof x != "boolean"
				? (e.type = x)
				: e.removeAttribute("type"),
			t != null
				? x === "number"
					? ((t === 0 && e.value === "") || e.value != t) && (e.value = "" + Zn(t))
					: e.value !== "" + Zn(t) && (e.value = "" + Zn(t))
				: (x !== "submit" && x !== "reset") || e.removeAttribute("value"),
			t != null
				? Ys(e, x, Zn(t))
				: a != null
				? Ys(e, x, Zn(a))
				: s != null && e.removeAttribute("value"),
			d == null && m != null && (e.defaultChecked = !!m),
			d != null && (e.checked = d && typeof d != "function" && typeof d != "symbol"),
			A != null && typeof A != "function" && typeof A != "symbol" && typeof A != "boolean"
				? (e.name = "" + Zn(A))
				: e.removeAttribute("name");
	}
	function lu(e, t, a, s, d, m, x, A) {
		if (
			(m != null &&
				typeof m != "function" &&
				typeof m != "symbol" &&
				typeof m != "boolean" &&
				(e.type = m),
			t != null || a != null)
		) {
			if (!((m !== "submit" && m !== "reset") || t != null)) {
				qs(e);
				return;
			}
			(a = a != null ? "" + Zn(a) : ""),
				(t = t != null ? "" + Zn(t) : a),
				A || t === e.value || (e.value = t),
				(e.defaultValue = t);
		}
		(s = s != null ? s : d),
			(s = typeof s != "function" && typeof s != "symbol" && !!s),
			(e.checked = A ? e.checked : !!s),
			(e.defaultChecked = !!s),
			x != null &&
				typeof x != "function" &&
				typeof x != "symbol" &&
				typeof x != "boolean" &&
				(e.name = x),
			qs(e);
	}
	function Ys(e, t, a) {
		(t === "number" && Ya(e.ownerDocument) === e) ||
			e.defaultValue === "" + a ||
			(e.defaultValue = "" + a);
	}
	function ra(e, t, a, s) {
		if (((e = e.options), t)) {
			t = {};
			for (var d = 0; d < a.length; d++) t["$" + a[d]] = !0;
			for (a = 0; a < e.length; a++)
				(d = t.hasOwnProperty("$" + e[a].value)),
					e[a].selected !== d && (e[a].selected = d),
					d && s && (e[a].defaultSelected = !0);
		} else {
			for (a = "" + Zn(a), t = null, d = 0; d < e.length; d++) {
				if (e[d].value === a) {
					(e[d].selected = !0), s && (e[d].defaultSelected = !0);
					return;
				}
				t !== null || e[d].disabled || (t = e[d]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function uu(e, t, a) {
		if (t != null && ((t = "" + Zn(t)), t !== e.value && (e.value = t), a == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = a != null ? "" + Zn(a) : "";
	}
	function Is(e, t, a, s) {
		if (t == null) {
			if (s != null) {
				if (a != null) throw Error(i(92));
				if (ge(s)) {
					if (1 < s.length) throw Error(i(93));
					s = s[0];
				}
				a = s;
			}
			a == null && (a = ""), (t = a);
		}
		(a = Zn(t)),
			(e.defaultValue = a),
			(s = e.textContent),
			s === a && s !== "" && s !== null && (e.value = s),
			qs(e);
	}
	function xo(e, t) {
		if (t) {
			var a = e.firstChild;
			if (a && a === e.lastChild && a.nodeType === 3) {
				a.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var Ri = new Set(
		"animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
			" "
		)
	);
	function cu(e, t, a) {
		var s = t.indexOf("--") === 0;
		a == null || typeof a == "boolean" || a === ""
			? s
				? e.setProperty(t, "")
				: t === "float"
				? (e.cssFloat = "")
				: (e[t] = "")
			: s
			? e.setProperty(t, a)
			: typeof a != "number" || a === 0 || Ri.has(t)
			? t === "float"
				? (e.cssFloat = a)
				: (e[t] = ("" + a).trim())
			: (e[t] = a + "px");
	}
	function Gs(e, t, a) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (((e = e.style), a != null)) {
			for (var s in a)
				!a.hasOwnProperty(s) ||
					(t != null && t.hasOwnProperty(s)) ||
					(s.indexOf("--") === 0
						? e.setProperty(s, "")
						: s === "float"
						? (e.cssFloat = "")
						: (e[s] = ""));
			for (var d in t) (s = t[d]), t.hasOwnProperty(d) && a[d] !== s && cu(e, d, s);
		} else for (var m in t) t.hasOwnProperty(m) && cu(e, m, t[m]);
	}
	function Ti(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph":
				return !1;
			default:
				return !0;
		}
	}
	var fu = new Map([
			["acceptCharset", "accept-charset"],
			["htmlFor", "for"],
			["httpEquiv", "http-equiv"],
			["crossOrigin", "crossorigin"],
			["accentHeight", "accent-height"],
			["alignmentBaseline", "alignment-baseline"],
			["arabicForm", "arabic-form"],
			["baselineShift", "baseline-shift"],
			["capHeight", "cap-height"],
			["clipPath", "clip-path"],
			["clipRule", "clip-rule"],
			["colorInterpolation", "color-interpolation"],
			["colorInterpolationFilters", "color-interpolation-filters"],
			["colorProfile", "color-profile"],
			["colorRendering", "color-rendering"],
			["dominantBaseline", "dominant-baseline"],
			["enableBackground", "enable-background"],
			["fillOpacity", "fill-opacity"],
			["fillRule", "fill-rule"],
			["floodColor", "flood-color"],
			["floodOpacity", "flood-opacity"],
			["fontFamily", "font-family"],
			["fontSize", "font-size"],
			["fontSizeAdjust", "font-size-adjust"],
			["fontStretch", "font-stretch"],
			["fontStyle", "font-style"],
			["fontVariant", "font-variant"],
			["fontWeight", "font-weight"],
			["glyphName", "glyph-name"],
			["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
			["glyphOrientationVertical", "glyph-orientation-vertical"],
			["horizAdvX", "horiz-adv-x"],
			["horizOriginX", "horiz-origin-x"],
			["imageRendering", "image-rendering"],
			["letterSpacing", "letter-spacing"],
			["lightingColor", "lighting-color"],
			["markerEnd", "marker-end"],
			["markerMid", "marker-mid"],
			["markerStart", "marker-start"],
			["overlinePosition", "overline-position"],
			["overlineThickness", "overline-thickness"],
			["paintOrder", "paint-order"],
			["panose-1", "panose-1"],
			["pointerEvents", "pointer-events"],
			["renderingIntent", "rendering-intent"],
			["shapeRendering", "shape-rendering"],
			["stopColor", "stop-color"],
			["stopOpacity", "stop-opacity"],
			["strikethroughPosition", "strikethrough-position"],
			["strikethroughThickness", "strikethrough-thickness"],
			["strokeDasharray", "stroke-dasharray"],
			["strokeDashoffset", "stroke-dashoffset"],
			["strokeLinecap", "stroke-linecap"],
			["strokeLinejoin", "stroke-linejoin"],
			["strokeMiterlimit", "stroke-miterlimit"],
			["strokeOpacity", "stroke-opacity"],
			["strokeWidth", "stroke-width"],
			["textAnchor", "text-anchor"],
			["textDecoration", "text-decoration"],
			["textRendering", "text-rendering"],
			["transformOrigin", "transform-origin"],
			["underlinePosition", "underline-position"],
			["underlineThickness", "underline-thickness"],
			["unicodeBidi", "unicode-bidi"],
			["unicodeRange", "unicode-range"],
			["unitsPerEm", "units-per-em"],
			["vAlphabetic", "v-alphabetic"],
			["vHanging", "v-hanging"],
			["vIdeographic", "v-ideographic"],
			["vMathematical", "v-mathematical"],
			["vectorEffect", "vector-effect"],
			["vertAdvY", "vert-adv-y"],
			["vertOriginX", "vert-origin-x"],
			["vertOriginY", "vert-origin-y"],
			["wordSpacing", "word-spacing"],
			["writingMode", "writing-mode"],
			["xmlnsXlink", "xmlns:xlink"],
			["xHeight", "x-height"],
		]),
		zf =
			/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function Ci(e) {
		return zf.test("" + e)
			? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
			: e;
	}
	function Sr() {}
	var Ia = null;
	function Oi(e) {
		return (
			(e = e.target || e.srcElement || window),
			e.correspondingUseElement && (e = e.correspondingUseElement),
			e.nodeType === 3 ? e.parentNode : e
		);
	}
	var oa = null,
		wo = null;
	function Ai(e) {
		var t = $r(e);
		if (t && (e = t.stateNode)) {
			var a = e[sn] || null;
			e: switch (((e = t.stateNode), t.type)) {
				case "input":
					if (
						(Vs(
							e,
							a.value,
							a.defaultValue,
							a.defaultValue,
							a.checked,
							a.defaultChecked,
							a.type,
							a.name
						),
						(t = a.name),
						a.type === "radio" && t != null)
					) {
						for (a = e; a.parentNode; ) a = a.parentNode;
						for (
							a = a.querySelectorAll(
								'input[name="' + Vn("" + t) + '"][type="radio"]'
							),
								t = 0;
							t < a.length;
							t++
						) {
							var s = a[t];
							if (s !== e && s.form === e.form) {
								var d = s[sn] || null;
								if (!d) throw Error(i(90));
								Vs(
									s,
									d.value,
									d.defaultValue,
									d.defaultValue,
									d.checked,
									d.defaultChecked,
									d.type,
									d.name
								);
							}
						}
						for (t = 0; t < a.length; t++) (s = a[t]), s.form === e.form && Ps(s);
					}
					break e;
				case "textarea":
					uu(e, a.value, a.defaultValue);
					break e;
				case "select":
					(t = a.value), t != null && ra(e, !!a.multiple, t, !1);
			}
		}
	}
	var Mi = !1;
	function Fs(e, t, a) {
		if (Mi) return e(t, a);
		Mi = !0;
		try {
			var s = e(t);
			return s;
		} finally {
			if (
				((Mi = !1),
				(oa !== null || wo !== null) &&
					($u(), oa && ((t = oa), (e = wo), (wo = oa = null), Ai(t), e)))
			)
				for (t = 0; t < e.length; t++) Ai(e[t]);
		}
	}
	function to(e, t) {
		var a = e.stateNode;
		if (a === null) return null;
		var s = a[sn] || null;
		if (s === null) return null;
		a = s[t];
		e: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(s = !s.disabled) ||
					((e = e.type),
					(s = !(
						e === "button" ||
						e === "input" ||
						e === "select" ||
						e === "textarea"
					))),
					(e = !s);
				break e;
			default:
				e = !1;
		}
		if (e) return null;
		if (a && typeof a != "function") throw Error(i(231, t, typeof a));
		return a;
	}
	var xr = !(
			typeof window == "undefined" ||
			typeof window.document == "undefined" ||
			typeof window.document.createElement == "undefined"
		),
		Xs = !1;
	if (xr)
		try {
			var no = {};
			Object.defineProperty(no, "passive", {
				get: function () {
					Xs = !0;
				},
			}),
				window.addEventListener("test", no, no),
				window.removeEventListener("test", no, no);
		} catch (e) {
			Xs = !1;
		}
	var wn = null,
		aa = null,
		Eo = null;
	function ki() {
		if (Eo) return Eo;
		var e,
			t = aa,
			a = t.length,
			s,
			d = "value" in wn ? wn.value : wn.textContent,
			m = d.length;
		for (e = 0; e < a && t[e] === d[e]; e++);
		var x = a - e;
		for (s = 1; s <= x && t[a - s] === d[m - s]; s++);
		return (Eo = d.slice(e, 1 < s ? 1 - s : void 0));
	}
	function _i(e) {
		var t = e.keyCode;
		return (
			"charCode" in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
			e === 10 && (e = 13),
			32 <= e || e === 13 ? e : 0
		);
	}
	function Di() {
		return !0;
	}
	function du() {
		return !1;
	}
	function On(e) {
		function t(a, s, d, m, x) {
			(this._reactName = a),
				(this._targetInst = d),
				(this.type = s),
				(this.nativeEvent = m),
				(this.target = x),
				(this.currentTarget = null);
			for (var A in e) e.hasOwnProperty(A) && ((a = e[A]), (this[A] = a ? a(m) : m[A]));
			return (
				(this.isDefaultPrevented = (
					m.defaultPrevented != null ? m.defaultPrevented : m.returnValue === !1
				)
					? Di
					: du),
				(this.isPropagationStopped = du),
				this
			);
		}
		return (
			g(t.prototype, {
				preventDefault: function () {
					this.defaultPrevented = !0;
					var a = this.nativeEvent;
					a &&
						(a.preventDefault
							? a.preventDefault()
							: typeof a.returnValue != "unknown" && (a.returnValue = !1),
						(this.isDefaultPrevented = Di));
				},
				stopPropagation: function () {
					var a = this.nativeEvent;
					a &&
						(a.stopPropagation
							? a.stopPropagation()
							: typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0),
						(this.isPropagationStopped = Di));
				},
				persist: function () {},
				isPersistent: Di,
			}),
			t
		);
	}
	var Ro = {
			eventPhase: 0,
			bubbles: 0,
			cancelable: 0,
			timeStamp: function (e) {
				return e.timeStamp || Date.now();
			},
			defaultPrevented: 0,
			isTrusted: 0,
		},
		Ga = On(Ro),
		Ft = g({}, Ro, { view: 0, detail: 0 }),
		E = On(Ft),
		C,
		k,
		z,
		V = g({}, Ft, {
			screenX: 0,
			screenY: 0,
			clientX: 0,
			clientY: 0,
			pageX: 0,
			pageY: 0,
			ctrlKey: 0,
			shiftKey: 0,
			altKey: 0,
			metaKey: 0,
			getModifierState: Er,
			button: 0,
			buttons: 0,
			relatedTarget: function (e) {
				return e.relatedTarget === void 0
					? e.fromElement === e.srcElement
						? e.toElement
						: e.fromElement
					: e.relatedTarget;
			},
			movementX: function (e) {
				return "movementX" in e
					? e.movementX
					: (e !== z &&
							(z && e.type === "mousemove"
								? ((C = e.screenX - z.screenX), (k = e.screenY - z.screenY))
								: (k = C = 0),
							(z = e)),
					  C);
			},
			movementY: function (e) {
				return "movementY" in e ? e.movementY : k;
			},
		}),
		W = On(V),
		$ = g({}, V, { dataTransfer: 0 }),
		Oe = On($),
		Ge = g({}, Ft, { relatedTarget: 0 }),
		Me = On(Ge),
		Ne = g({}, Ro, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
		nt = On(Ne),
		Bt = g({}, Ro, {
			clipboardData: function (e) {
				return "clipboardData" in e ? e.clipboardData : window.clipboardData;
			},
		}),
		ot = On(Bt),
		Le = g({}, Ro, { data: 0 }),
		He = On(Le),
		Kt = {
			Esc: "Escape",
			Spacebar: " ",
			Left: "ArrowLeft",
			Up: "ArrowUp",
			Right: "ArrowRight",
			Down: "ArrowDown",
			Del: "Delete",
			Win: "OS",
			Menu: "ContextMenu",
			Apps: "ContextMenu",
			Scroll: "ScrollLock",
			MozPrintableKey: "Unidentified",
		},
		An = {
			8: "Backspace",
			9: "Tab",
			12: "Clear",
			13: "Enter",
			16: "Shift",
			17: "Control",
			18: "Alt",
			19: "Pause",
			20: "CapsLock",
			27: "Escape",
			32: " ",
			33: "PageUp",
			34: "PageDown",
			35: "End",
			36: "Home",
			37: "ArrowLeft",
			38: "ArrowUp",
			39: "ArrowRight",
			40: "ArrowDown",
			45: "Insert",
			46: "Delete",
			112: "F1",
			113: "F2",
			114: "F3",
			115: "F4",
			116: "F5",
			117: "F6",
			118: "F7",
			119: "F8",
			120: "F9",
			121: "F10",
			122: "F11",
			123: "F12",
			144: "NumLock",
			145: "ScrollLock",
			224: "Meta",
		},
		ln = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
	function wr(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = ln[e]) ? !!t[e] : !1;
	}
	function Er() {
		return wr;
	}
	var Ks = g({}, Ft, {
			key: function (e) {
				if (e.key) {
					var t = Kt[e.key] || e.key;
					if (t !== "Unidentified") return t;
				}
				return e.type === "keypress"
					? ((e = _i(e)), e === 13 ? "Enter" : String.fromCharCode(e))
					: e.type === "keydown" || e.type === "keyup"
					? An[e.keyCode] || "Unidentified"
					: "";
			},
			code: 0,
			location: 0,
			ctrlKey: 0,
			shiftKey: 0,
			altKey: 0,
			metaKey: 0,
			repeat: 0,
			locale: 0,
			getModifierState: Er,
			charCode: function (e) {
				return e.type === "keypress" ? _i(e) : 0;
			},
			keyCode: function (e) {
				return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
			},
			which: function (e) {
				return e.type === "keypress"
					? _i(e)
					: e.type === "keydown" || e.type === "keyup"
					? e.keyCode
					: 0;
			},
		}),
		hu = On(Ks),
		ro = g({}, V, {
			pointerId: 0,
			width: 0,
			height: 0,
			pressure: 0,
			tangentialPressure: 0,
			tiltX: 0,
			tiltY: 0,
			twist: 0,
			pointerType: 0,
			isPrimary: 0,
		}),
		Ni = On(ro),
		Li = g({}, Ft, {
			touches: 0,
			targetTouches: 0,
			changedTouches: 0,
			altKey: 0,
			metaKey: 0,
			ctrlKey: 0,
			shiftKey: 0,
			getModifierState: Er,
		}),
		pu = On(Li),
		mu = g({}, Ro, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
		zi = On(mu),
		Fa = g({}, V, {
			deltaX: function (e) {
				return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
			},
			deltaY: function (e) {
				return "deltaY" in e
					? e.deltaY
					: "wheelDeltaY" in e
					? -e.wheelDeltaY
					: "wheelDelta" in e
					? -e.wheelDelta
					: 0;
			},
			deltaZ: 0,
			deltaMode: 0,
		}),
		To = On(Fa),
		gu = g({}, Ro, { newState: 0, oldState: 0 }),
		Rr = On(gu),
		yu = [9, 13, 27, 32],
		Tr = xr && "CompositionEvent" in window,
		ia = null;
	xr && "documentMode" in document && (ia = document.documentMode);
	var jf = xr && "TextEvent" in window && !ia,
		Hr = xr && (!Tr || (ia && 8 < ia && 11 >= ia)),
		Co = " ",
		ji = !1;
	function Xa(e, t) {
		switch (e) {
			case "keyup":
				return yu.indexOf(t.keyCode) !== -1;
			case "keydown":
				return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout":
				return !0;
			default:
				return !1;
		}
	}
	function Qs(e) {
		return (e = e.detail), typeof e == "object" && "data" in e ? e.data : null;
	}
	var Bi = !1;
	function uw(e, t) {
		switch (e) {
			case "compositionend":
				return Qs(t);
			case "keypress":
				return t.which !== 32 ? null : ((ji = !0), Co);
			case "textInput":
				return (e = t.data), e === Co && ji ? null : e;
			default:
				return null;
		}
	}
	function cw(e, t) {
		if (Bi)
			return e === "compositionend" || (!Tr && Xa(e, t))
				? ((e = ki()), (Eo = aa = wn = null), (Bi = !1), e)
				: null;
		switch (e) {
			case "paste":
				return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend":
				return Hr && t.locale !== "ko" ? null : t.data;
			default:
				return null;
		}
	}
	var fw = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0,
	};
	function Fm(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!fw[e.type] : t === "textarea";
	}
	function Xm(e, t, a, s) {
		oa ? (wo ? wo.push(s) : (wo = [s])) : (oa = s),
			(t = ic(t, "onChange")),
			0 < t.length &&
				((a = new Ga("onChange", "change", null, a, s)),
				e.push({ event: a, listeners: t }));
	}
	var Zs = null,
		Js = null;
	function dw(e) {
		M0(e, 0);
	}
	function bu(e) {
		var t = Pa(e);
		if (Ps(t)) return e;
	}
	function Km(e, t) {
		if (e === "change") return t;
	}
	var Qm = !1;
	if (xr) {
		var Bf;
		if (xr) {
			var Uf = "oninput" in document;
			if (!Uf) {
				var Zm = document.createElement("div");
				Zm.setAttribute("oninput", "return;"), (Uf = typeof Zm.oninput == "function");
			}
			Bf = Uf;
		} else Bf = !1;
		Qm = Bf && (!document.documentMode || 9 < document.documentMode);
	}
	function Jm() {
		Zs && (Zs.detachEvent("onpropertychange", Wm), (Js = Zs = null));
	}
	function Wm(e) {
		if (e.propertyName === "value" && bu(Js)) {
			var t = [];
			Xm(t, Js, e, Oi(e)), Fs(dw, t);
		}
	}
	function hw(e, t, a) {
		e === "focusin"
			? (Jm(), (Zs = t), (Js = a), Zs.attachEvent("onpropertychange", Wm))
			: e === "focusout" && Jm();
	}
	function pw(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return bu(Js);
	}
	function mw(e, t) {
		if (e === "click") return bu(t);
	}
	function gw(e, t) {
		if (e === "input" || e === "change") return bu(t);
	}
	function yw(e, t) {
		return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
	}
	var sr = typeof Object.is == "function" ? Object.is : yw;
	function Ws(e, t) {
		if (sr(e, t)) return !0;
		if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
		var a = Object.keys(e),
			s = Object.keys(t);
		if (a.length !== s.length) return !1;
		for (s = 0; s < a.length; s++) {
			var d = a[s];
			if (!le.call(t, d) || !sr(e[d], t[d])) return !1;
		}
		return !0;
	}
	function $m(e) {
		for (; e && e.firstChild; ) e = e.firstChild;
		return e;
	}
	function eg(e, t) {
		var a = $m(e);
		e = 0;
		for (var s; a; ) {
			if (a.nodeType === 3) {
				if (((s = e + a.textContent.length), e <= t && s >= t))
					return { node: a, offset: t - e };
				e = s;
			}
			e: {
				for (; a; ) {
					if (a.nextSibling) {
						a = a.nextSibling;
						break e;
					}
					a = a.parentNode;
				}
				a = void 0;
			}
			a = $m(a);
		}
	}
	function tg(e, t) {
		return e && t
			? e === t
				? !0
				: e && e.nodeType === 3
				? !1
				: t && t.nodeType === 3
				? tg(e, t.parentNode)
				: "contains" in e
				? e.contains(t)
				: e.compareDocumentPosition
				? !!(e.compareDocumentPosition(t) & 16)
				: !1
			: !1;
	}
	function ng(e) {
		e =
			e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null
				? e.ownerDocument.defaultView
				: window;
		for (var t = Ya(e.document); t instanceof e.HTMLIFrameElement; ) {
			try {
				var a = typeof t.contentWindow.location.href == "string";
			} catch (s) {
				a = !1;
			}
			if (a) e = t.contentWindow;
			else break;
			t = Ya(e.document);
		}
		return t;
	}
	function Hf(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return (
			t &&
			((t === "input" &&
				(e.type === "text" ||
					e.type === "search" ||
					e.type === "tel" ||
					e.type === "url" ||
					e.type === "password")) ||
				t === "textarea" ||
				e.contentEditable === "true")
		);
	}
	var bw = xr && "documentMode" in document && 11 >= document.documentMode,
		Ui = null,
		qf = null,
		$s = null,
		Pf = !1;
	function rg(e, t, a) {
		var s = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
		Pf ||
			Ui == null ||
			Ui !== Ya(s) ||
			((s = Ui),
			"selectionStart" in s && Hf(s)
				? (s = { start: s.selectionStart, end: s.selectionEnd })
				: ((s = (
						(s.ownerDocument && s.ownerDocument.defaultView) ||
						window
				  ).getSelection()),
				  (s = {
						anchorNode: s.anchorNode,
						anchorOffset: s.anchorOffset,
						focusNode: s.focusNode,
						focusOffset: s.focusOffset,
				  })),
			($s && Ws($s, s)) ||
				(($s = s),
				(s = ic(qf, "onSelect")),
				0 < s.length &&
					((t = new Ga("onSelect", "select", null, t, a)),
					e.push({ event: t, listeners: s }),
					(t.target = Ui))));
	}
	function Ka(e, t) {
		var a = {};
		return (
			(a[e.toLowerCase()] = t.toLowerCase()),
			(a["Webkit" + e] = "webkit" + t),
			(a["Moz" + e] = "moz" + t),
			a
		);
	}
	var Hi = {
			animationend: Ka("Animation", "AnimationEnd"),
			animationiteration: Ka("Animation", "AnimationIteration"),
			animationstart: Ka("Animation", "AnimationStart"),
			transitionrun: Ka("Transition", "TransitionRun"),
			transitionstart: Ka("Transition", "TransitionStart"),
			transitioncancel: Ka("Transition", "TransitionCancel"),
			transitionend: Ka("Transition", "TransitionEnd"),
		},
		Vf = {},
		og = {};
	xr &&
		((og = document.createElement("div").style),
		"AnimationEvent" in window ||
			(delete Hi.animationend.animation,
			delete Hi.animationiteration.animation,
			delete Hi.animationstart.animation),
		"TransitionEvent" in window || delete Hi.transitionend.transition);
	function Qa(e) {
		if (Vf[e]) return Vf[e];
		if (!Hi[e]) return e;
		var t = Hi[e],
			a;
		for (a in t) if (t.hasOwnProperty(a) && a in og) return (Vf[e] = t[a]);
		return e;
	}
	var ag = Qa("animationend"),
		ig = Qa("animationiteration"),
		sg = Qa("animationstart"),
		vw = Qa("transitionrun"),
		Sw = Qa("transitionstart"),
		xw = Qa("transitioncancel"),
		lg = Qa("transitionend"),
		ug = new Map(),
		Yf =
			"abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
				" "
			);
	Yf.push("scrollEnd");
	function qr(e, t) {
		ug.set(e, t), eo(t, [e]);
	}
	var vu =
			typeof reportError == "function"
				? reportError
				: function (e) {
						if (typeof window == "object" && typeof window.ErrorEvent == "function") {
							var t = new window.ErrorEvent("error", {
								bubbles: !0,
								cancelable: !0,
								message:
									typeof e == "object" &&
									e !== null &&
									typeof e.message == "string"
										? String(e.message)
										: String(e),
								error: e,
							});
							if (!window.dispatchEvent(t)) return;
						} else if (
							typeof process == "object" &&
							typeof process.emit == "function"
						) {
							process.emit("uncaughtException", e);
							return;
						}
						console.error(e);
				  },
		Cr = [],
		qi = 0,
		If = 0;
	function Su() {
		for (var e = qi, t = (If = qi = 0); t < e; ) {
			var a = Cr[t];
			Cr[t++] = null;
			var s = Cr[t];
			Cr[t++] = null;
			var d = Cr[t];
			Cr[t++] = null;
			var m = Cr[t];
			if (((Cr[t++] = null), s !== null && d !== null)) {
				var x = s.pending;
				x === null ? (d.next = d) : ((d.next = x.next), (x.next = d)), (s.pending = d);
			}
			m !== 0 && cg(a, d, m);
		}
	}
	function xu(e, t, a, s) {
		(Cr[qi++] = e),
			(Cr[qi++] = t),
			(Cr[qi++] = a),
			(Cr[qi++] = s),
			(If |= s),
			(e.lanes |= s),
			(e = e.alternate),
			e !== null && (e.lanes |= s);
	}
	function Gf(e, t, a, s) {
		return xu(e, t, a, s), wu(e);
	}
	function Za(e, t) {
		return xu(e, null, null, t), wu(e);
	}
	function cg(e, t, a) {
		e.lanes |= a;
		var s = e.alternate;
		s !== null && (s.lanes |= a);
		for (var d = !1, m = e.return; m !== null; )
			(m.childLanes |= a),
				(s = m.alternate),
				s !== null && (s.childLanes |= a),
				m.tag === 22 && ((e = m.stateNode), e === null || e._visibility & 1 || (d = !0)),
				(e = m),
				(m = m.return);
		return e.tag === 3
			? ((m = e.stateNode),
			  d &&
					t !== null &&
					((d = 31 - ht(a)),
					(e = m.hiddenUpdates),
					(s = e[d]),
					s === null ? (e[d] = [t]) : s.push(t),
					(t.lane = a | 536870912)),
			  m)
			: null;
	}
	function wu(e) {
		if (50 < xl) throw ((xl = 0), (eh = null), Error(i(185)));
		for (var t = e.return; t !== null; ) (e = t), (t = e.return);
		return e.tag === 3 ? e.stateNode : null;
	}
	var Pi = {};
	function ww(e, t, a, s) {
		(this.tag = e),
			(this.key = a),
			(this.sibling =
				this.child =
				this.return =
				this.stateNode =
				this.type =
				this.elementType =
					null),
			(this.index = 0),
			(this.refCleanup = this.ref = null),
			(this.pendingProps = t),
			(this.dependencies =
				this.memoizedState =
				this.updateQueue =
				this.memoizedProps =
					null),
			(this.mode = s),
			(this.subtreeFlags = this.flags = 0),
			(this.deletions = null),
			(this.childLanes = this.lanes = 0),
			(this.alternate = null);
	}
	function lr(e, t, a, s) {
		return new ww(e, t, a, s);
	}
	function Ff(e) {
		return (e = e.prototype), !(!e || !e.isReactComponent);
	}
	function Oo(e, t) {
		var a = e.alternate;
		return (
			a === null
				? ((a = lr(e.tag, t, e.key, e.mode)),
				  (a.elementType = e.elementType),
				  (a.type = e.type),
				  (a.stateNode = e.stateNode),
				  (a.alternate = e),
				  (e.alternate = a))
				: ((a.pendingProps = t),
				  (a.type = e.type),
				  (a.flags = 0),
				  (a.subtreeFlags = 0),
				  (a.deletions = null)),
			(a.flags = e.flags & 65011712),
			(a.childLanes = e.childLanes),
			(a.lanes = e.lanes),
			(a.child = e.child),
			(a.memoizedProps = e.memoizedProps),
			(a.memoizedState = e.memoizedState),
			(a.updateQueue = e.updateQueue),
			(t = e.dependencies),
			(a.dependencies =
				t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
			(a.sibling = e.sibling),
			(a.index = e.index),
			(a.ref = e.ref),
			(a.refCleanup = e.refCleanup),
			a
		);
	}
	function fg(e, t) {
		e.flags &= 65011714;
		var a = e.alternate;
		return (
			a === null
				? ((e.childLanes = 0),
				  (e.lanes = t),
				  (e.child = null),
				  (e.subtreeFlags = 0),
				  (e.memoizedProps = null),
				  (e.memoizedState = null),
				  (e.updateQueue = null),
				  (e.dependencies = null),
				  (e.stateNode = null))
				: ((e.childLanes = a.childLanes),
				  (e.lanes = a.lanes),
				  (e.child = a.child),
				  (e.subtreeFlags = 0),
				  (e.deletions = null),
				  (e.memoizedProps = a.memoizedProps),
				  (e.memoizedState = a.memoizedState),
				  (e.updateQueue = a.updateQueue),
				  (e.type = a.type),
				  (t = a.dependencies),
				  (e.dependencies =
						t === null ? null : { lanes: t.lanes, firstContext: t.firstContext })),
			e
		);
	}
	function Eu(e, t, a, s, d, m) {
		var x = 0;
		if (((s = e), typeof e == "function")) Ff(e) && (x = 1);
		else if (typeof e == "string")
			x = OE(e, a, ie.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else
			e: switch (e) {
				case fe:
					return (e = lr(31, a, t, d)), (e.elementType = fe), (e.lanes = m), e;
				case R:
					return Ja(a.children, d, m, t);
				case O:
					(x = 8), (d |= 24);
					break;
				case T:
					return (e = lr(12, a, t, d | 2)), (e.elementType = T), (e.lanes = m), e;
				case N:
					return (e = lr(13, a, t, d)), (e.elementType = N), (e.lanes = m), e;
				case D:
					return (e = lr(19, a, t, d)), (e.elementType = D), (e.lanes = m), e;
				default:
					if (typeof e == "object" && e !== null)
						switch (e.$$typeof) {
							case M:
								x = 10;
								break e;
							case L:
								x = 9;
								break e;
							case _:
								x = 11;
								break e;
							case H:
								x = 14;
								break e;
							case U:
								(x = 16), (s = null);
								break e;
						}
					(x = 29), (a = Error(i(130, e === null ? "null" : typeof e, ""))), (s = null);
			}
		return (t = lr(x, a, t, d)), (t.elementType = e), (t.type = s), (t.lanes = m), t;
	}
	function Ja(e, t, a, s) {
		return (e = lr(7, e, s, t)), (e.lanes = a), e;
	}
	function Xf(e, t, a) {
		return (e = lr(6, e, null, t)), (e.lanes = a), e;
	}
	function dg(e) {
		var t = lr(18, null, null, 0);
		return (t.stateNode = e), t;
	}
	function Kf(e, t, a) {
		return (
			(t = lr(4, e.children !== null ? e.children : [], e.key, t)),
			(t.lanes = a),
			(t.stateNode = {
				containerInfo: e.containerInfo,
				pendingChildren: null,
				implementation: e.implementation,
			}),
			t
		);
	}
	var hg = new WeakMap();
	function Or(e, t) {
		if (typeof e == "object" && e !== null) {
			var a = hg.get(e);
			return a !== void 0
				? a
				: ((t = { value: e, source: t, stack: Ce(t) }), hg.set(e, t), t);
		}
		return { value: e, source: t, stack: Ce(t) };
	}
	var Vi = [],
		Yi = 0,
		Ru = null,
		el = 0,
		Ar = [],
		Mr = 0,
		sa = null,
		oo = 1,
		ao = "";
	function Ao(e, t) {
		(Vi[Yi++] = el), (Vi[Yi++] = Ru), (Ru = e), (el = t);
	}
	function pg(e, t, a) {
		(Ar[Mr++] = oo), (Ar[Mr++] = ao), (Ar[Mr++] = sa), (sa = e);
		var s = oo;
		e = ao;
		var d = 32 - ht(s) - 1;
		(s &= ~(1 << d)), (a += 1);
		var m = 32 - ht(t) + d;
		if (30 < m) {
			var x = d - (d % 5);
			(m = (s & ((1 << x) - 1)).toString(32)),
				(s >>= x),
				(d -= x),
				(oo = (1 << (32 - ht(t) + d)) | (a << d) | s),
				(ao = m + e);
		} else (oo = (1 << m) | (a << d) | s), (ao = e);
	}
	function Qf(e) {
		e.return !== null && (Ao(e, 1), pg(e, 1, 0));
	}
	function Zf(e) {
		for (; e === Ru; ) (Ru = Vi[--Yi]), (Vi[Yi] = null), (el = Vi[--Yi]), (Vi[Yi] = null);
		for (; e === sa; )
			(sa = Ar[--Mr]),
				(Ar[Mr] = null),
				(ao = Ar[--Mr]),
				(Ar[Mr] = null),
				(oo = Ar[--Mr]),
				(Ar[Mr] = null);
	}
	function mg(e, t) {
		(Ar[Mr++] = oo),
			(Ar[Mr++] = ao),
			(Ar[Mr++] = sa),
			(oo = t.id),
			(ao = t.overflow),
			(sa = e);
	}
	var _n = null,
		Qt = null,
		vt = !1,
		la = null,
		kr = !1,
		Jf = Error(i(519));
	function ua(e) {
		var t = Error(
			i(
				418,
				1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
				""
			)
		);
		throw (tl(Or(t, e)), Jf);
	}
	function gg(e) {
		var t = e.stateNode,
			a = e.type,
			s = e.memoizedProps;
		switch (((t[an] = e), (t[sn] = s), a)) {
			case "dialog":
				mt("cancel", t), mt("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				mt("load", t);
				break;
			case "video":
			case "audio":
				for (a = 0; a < El.length; a++) mt(El[a], t);
				break;
			case "source":
				mt("error", t);
				break;
			case "img":
			case "image":
			case "link":
				mt("error", t), mt("load", t);
				break;
			case "details":
				mt("toggle", t);
				break;
			case "input":
				mt("invalid", t),
					lu(
						t,
						s.value,
						s.defaultValue,
						s.checked,
						s.defaultChecked,
						s.type,
						s.name,
						!0
					);
				break;
			case "select":
				mt("invalid", t);
				break;
			case "textarea":
				mt("invalid", t), Is(t, s.value, s.defaultValue, s.children);
		}
		(a = s.children),
			(typeof a != "string" && typeof a != "number" && typeof a != "bigint") ||
			t.textContent === "" + a ||
			s.suppressHydrationWarning === !0 ||
			N0(t.textContent, a)
				? (s.popover != null && (mt("beforetoggle", t), mt("toggle", t)),
				  s.onScroll != null && mt("scroll", t),
				  s.onScrollEnd != null && mt("scrollend", t),
				  s.onClick != null && (t.onclick = Sr),
				  (t = !0))
				: (t = !1),
			t || ua(e, !0);
	}
	function yg(e) {
		for (_n = e.return; _n; )
			switch (_n.tag) {
				case 5:
				case 31:
				case 13:
					kr = !1;
					return;
				case 27:
				case 3:
					kr = !0;
					return;
				default:
					_n = _n.return;
			}
	}
	function Ii(e) {
		if (e !== _n) return !1;
		if (!vt) return yg(e), (vt = !0), !1;
		var t = e.tag,
			a;
		if (
			((a = t !== 3 && t !== 27) &&
				((a = t === 5) &&
					((a = e.type),
					(a = !(a !== "form" && a !== "button") || mh(e.type, e.memoizedProps))),
				(a = !a)),
			a && Qt && ua(e),
			yg(e),
			t === 13)
		) {
			if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
				throw Error(i(317));
			Qt = V0(e);
		} else if (t === 31) {
			if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
				throw Error(i(317));
			Qt = V0(e);
		} else
			t === 27
				? ((t = Qt), Ea(e.type) ? ((e = Sh), (Sh = null), (Qt = e)) : (Qt = t))
				: (Qt = _n ? Dr(e.stateNode.nextSibling) : null);
		return !0;
	}
	function Wa() {
		(Qt = _n = null), (vt = !1);
	}
	function Wf() {
		var e = la;
		return e !== null && (er === null ? (er = e) : er.push.apply(er, e), (la = null)), e;
	}
	function tl(e) {
		la === null ? (la = [e]) : la.push(e);
	}
	var $f = B(null),
		$a = null,
		Mo = null;
	function ca(e, t, a) {
		ee($f, t._currentValue), (t._currentValue = a);
	}
	function ko(e) {
		(e._currentValue = $f.current), Z($f);
	}
	function ed(e, t, a) {
		for (; e !== null; ) {
			var s = e.alternate;
			if (
				((e.childLanes & t) !== t
					? ((e.childLanes |= t), s !== null && (s.childLanes |= t))
					: s !== null && (s.childLanes & t) !== t && (s.childLanes |= t),
				e === a)
			)
				break;
			e = e.return;
		}
	}
	function td(e, t, a, s) {
		var d = e.child;
		for (d !== null && (d.return = e); d !== null; ) {
			var m = d.dependencies;
			if (m !== null) {
				var x = d.child;
				m = m.firstContext;
				e: for (; m !== null; ) {
					var A = m;
					m = d;
					for (var q = 0; q < t.length; q++)
						if (A.context === t[q]) {
							(m.lanes |= a),
								(A = m.alternate),
								A !== null && (A.lanes |= a),
								ed(m.return, a, e),
								s || (x = null);
							break e;
						}
					m = A.next;
				}
			} else if (d.tag === 18) {
				if (((x = d.return), x === null)) throw Error(i(341));
				(x.lanes |= a),
					(m = x.alternate),
					m !== null && (m.lanes |= a),
					ed(x, a, e),
					(x = null);
			} else x = d.child;
			if (x !== null) x.return = d;
			else
				for (x = d; x !== null; ) {
					if (x === e) {
						x = null;
						break;
					}
					if (((d = x.sibling), d !== null)) {
						(d.return = x.return), (x = d);
						break;
					}
					x = x.return;
				}
			d = x;
		}
	}
	function Gi(e, t, a, s) {
		e = null;
		for (var d = t, m = !1; d !== null; ) {
			if (!m) {
				if ((d.flags & 524288) !== 0) m = !0;
				else if ((d.flags & 262144) !== 0) break;
			}
			if (d.tag === 10) {
				var x = d.alternate;
				if (x === null) throw Error(i(387));
				if (((x = x.memoizedProps), x !== null)) {
					var A = d.type;
					sr(d.pendingProps.value, x.value) || (e !== null ? e.push(A) : (e = [A]));
				}
			} else if (d === ke.current) {
				if (((x = d.alternate), x === null)) throw Error(i(387));
				x.memoizedState.memoizedState !== d.memoizedState.memoizedState &&
					(e !== null ? e.push(Al) : (e = [Al]));
			}
			d = d.return;
		}
		e !== null && td(t, e, a, s), (t.flags |= 262144);
	}
	function Tu(e) {
		for (e = e.firstContext; e !== null; ) {
			if (!sr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function ei(e) {
		($a = e), (Mo = null), (e = e.dependencies), e !== null && (e.firstContext = null);
	}
	function Dn(e) {
		return bg($a, e);
	}
	function Cu(e, t) {
		return $a === null && ei(e), bg(e, t);
	}
	function bg(e, t) {
		var a = t._currentValue;
		if (((t = { context: t, memoizedValue: a, next: null }), Mo === null)) {
			if (e === null) throw Error(i(308));
			(Mo = t), (e.dependencies = { lanes: 0, firstContext: t }), (e.flags |= 524288);
		} else Mo = Mo.next = t;
		return a;
	}
	var Ew =
			typeof AbortController != "undefined"
				? AbortController
				: function () {
						var e = [],
							t = (this.signal = {
								aborted: !1,
								addEventListener: function (a, s) {
									e.push(s);
								},
							});
						this.abort = function () {
							(t.aborted = !0),
								e.forEach(function (a) {
									return a();
								});
						};
				  },
		Rw = n.unstable_scheduleCallback,
		Tw = n.unstable_NormalPriority,
		mn = {
			$$typeof: M,
			Consumer: null,
			Provider: null,
			_currentValue: null,
			_currentValue2: null,
			_threadCount: 0,
		};
	function nd() {
		return { controller: new Ew(), data: new Map(), refCount: 0 };
	}
	function nl(e) {
		e.refCount--,
			e.refCount === 0 &&
				Rw(Tw, function () {
					e.controller.abort();
				});
	}
	var rl = null,
		rd = 0,
		Fi = 0,
		Xi = null;
	function Cw(e, t) {
		if (rl === null) {
			var a = (rl = []);
			(rd = 0),
				(Fi = ih()),
				(Xi = {
					status: "pending",
					value: void 0,
					then: function (s) {
						a.push(s);
					},
				});
		}
		return rd++, t.then(vg, vg), t;
	}
	function vg() {
		if (--rd === 0 && rl !== null) {
			Xi !== null && (Xi.status = "fulfilled");
			var e = rl;
			(rl = null), (Fi = 0), (Xi = null);
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function Ow(e, t) {
		var a = [],
			s = {
				status: "pending",
				value: null,
				reason: null,
				then: function (d) {
					a.push(d);
				},
			};
		return (
			e.then(
				function () {
					(s.status = "fulfilled"), (s.value = t);
					for (var d = 0; d < a.length; d++) (0, a[d])(t);
				},
				function (d) {
					for (s.status = "rejected", s.reason = d, d = 0; d < a.length; d++)
						(0, a[d])(void 0);
				}
			),
			s
		);
	}
	var Sg = j.S;
	j.S = function (e, t) {
		(r0 = qe()),
			typeof t == "object" && t !== null && typeof t.then == "function" && Cw(e, t),
			Sg !== null && Sg(e, t);
	};
	var ti = B(null);
	function od() {
		var e = ti.current;
		return e !== null ? e : Vt.pooledCache;
	}
	function Ou(e, t) {
		t === null ? ee(ti, ti.current) : ee(ti, t.pool);
	}
	function xg() {
		var e = od();
		return e === null ? null : { parent: mn._currentValue, pool: e };
	}
	var Ki = Error(i(460)),
		ad = Error(i(474)),
		Au = Error(i(542)),
		Mu = { then: function () {} };
	function wg(e) {
		return (e = e.status), e === "fulfilled" || e === "rejected";
	}
	function Eg(e, t, a) {
		switch (
			((a = e[a]), a === void 0 ? e.push(t) : a !== t && (t.then(Sr, Sr), (t = a)), t.status)
		) {
			case "fulfilled":
				return t.value;
			case "rejected":
				throw ((e = t.reason), Tg(e), e);
			default:
				if (typeof t.status == "string") t.then(Sr, Sr);
				else {
					if (((e = Vt), e !== null && 100 < e.shellSuspendCounter)) throw Error(i(482));
					(e = t),
						(e.status = "pending"),
						e.then(
							function (s) {
								if (t.status === "pending") {
									var d = t;
									(d.status = "fulfilled"), (d.value = s);
								}
							},
							function (s) {
								if (t.status === "pending") {
									var d = t;
									(d.status = "rejected"), (d.reason = s);
								}
							}
						);
				}
				switch (t.status) {
					case "fulfilled":
						return t.value;
					case "rejected":
						throw ((e = t.reason), Tg(e), e);
				}
				throw ((ri = t), Ki);
		}
	}
	function ni(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (a) {
			throw a !== null && typeof a == "object" && typeof a.then == "function"
				? ((ri = a), Ki)
				: a;
		}
	}
	var ri = null;
	function Rg() {
		if (ri === null) throw Error(i(459));
		var e = ri;
		return (ri = null), e;
	}
	function Tg(e) {
		if (e === Ki || e === Au) throw Error(i(483));
	}
	var Qi = null,
		ol = 0;
	function ku(e) {
		var t = ol;
		return (ol += 1), Qi === null && (Qi = []), Eg(Qi, e, t);
	}
	function al(e, t) {
		(t = t.props.ref), (e.ref = t !== void 0 ? t : null);
	}
	function _u(e, t) {
		throw t.$$typeof === S
			? Error(i(525))
			: ((e = Object.prototype.toString.call(t)),
			  Error(
					i(
						31,
						e === "[object Object]"
							? "object with keys {" + Object.keys(t).join(", ") + "}"
							: e
					)
			  ));
	}
	function Cg(e) {
		function t(Q, G) {
			if (e) {
				var te = Q.deletions;
				te === null ? ((Q.deletions = [G]), (Q.flags |= 16)) : te.push(G);
			}
		}
		function a(Q, G) {
			if (!e) return null;
			for (; G !== null; ) t(Q, G), (G = G.sibling);
			return null;
		}
		function s(Q) {
			for (var G = new Map(); Q !== null; )
				Q.key !== null ? G.set(Q.key, Q) : G.set(Q.index, Q), (Q = Q.sibling);
			return G;
		}
		function d(Q, G) {
			return (Q = Oo(Q, G)), (Q.index = 0), (Q.sibling = null), Q;
		}
		function m(Q, G, te) {
			return (
				(Q.index = te),
				e
					? ((te = Q.alternate),
					  te !== null
							? ((te = te.index), te < G ? ((Q.flags |= 67108866), G) : te)
							: ((Q.flags |= 67108866), G))
					: ((Q.flags |= 1048576), G)
			);
		}
		function x(Q) {
			return e && Q.alternate === null && (Q.flags |= 67108866), Q;
		}
		function A(Q, G, te, ye) {
			return G === null || G.tag !== 6
				? ((G = Xf(te, Q.mode, ye)), (G.return = Q), G)
				: ((G = d(G, te)), (G.return = Q), G);
		}
		function q(Q, G, te, ye) {
			var We = te.type;
			return We === R
				? he(Q, G, te.props.children, ye, te.key)
				: G !== null &&
				  (G.elementType === We ||
						(typeof We == "object" &&
							We !== null &&
							We.$$typeof === U &&
							ni(We) === G.type))
				? ((G = d(G, te.props)), al(G, te), (G.return = Q), G)
				: ((G = Eu(te.type, te.key, te.props, null, Q.mode, ye)),
				  al(G, te),
				  (G.return = Q),
				  G);
		}
		function ne(Q, G, te, ye) {
			return G === null ||
				G.tag !== 4 ||
				G.stateNode.containerInfo !== te.containerInfo ||
				G.stateNode.implementation !== te.implementation
				? ((G = Kf(te, Q.mode, ye)), (G.return = Q), G)
				: ((G = d(G, te.children || [])), (G.return = Q), G);
		}
		function he(Q, G, te, ye, We) {
			return G === null || G.tag !== 7
				? ((G = Ja(te, Q.mode, ye, We)), (G.return = Q), G)
				: ((G = d(G, te)), (G.return = Q), G);
		}
		function be(Q, G, te) {
			if ((typeof G == "string" && G !== "") || typeof G == "number" || typeof G == "bigint")
				return (G = Xf("" + G, Q.mode, te)), (G.return = Q), G;
			if (typeof G == "object" && G !== null) {
				switch (G.$$typeof) {
					case b:
						return (
							(te = Eu(G.type, G.key, G.props, null, Q.mode, te)),
							al(te, G),
							(te.return = Q),
							te
						);
					case w:
						return (G = Kf(G, Q.mode, te)), (G.return = Q), G;
					case U:
						return (G = ni(G)), be(Q, G, te);
				}
				if (ge(G) || Y(G)) return (G = Ja(G, Q.mode, te, null)), (G.return = Q), G;
				if (typeof G.then == "function") return be(Q, ku(G), te);
				if (G.$$typeof === M) return be(Q, Cu(Q, G), te);
				_u(Q, G);
			}
			return null;
		}
		function ae(Q, G, te, ye) {
			var We = G !== null ? G.key : null;
			if (
				(typeof te == "string" && te !== "") ||
				typeof te == "number" ||
				typeof te == "bigint"
			)
				return We !== null ? null : A(Q, G, "" + te, ye);
			if (typeof te == "object" && te !== null) {
				switch (te.$$typeof) {
					case b:
						return te.key === We ? q(Q, G, te, ye) : null;
					case w:
						return te.key === We ? ne(Q, G, te, ye) : null;
					case U:
						return (te = ni(te)), ae(Q, G, te, ye);
				}
				if (ge(te) || Y(te)) return We !== null ? null : he(Q, G, te, ye, null);
				if (typeof te.then == "function") return ae(Q, G, ku(te), ye);
				if (te.$$typeof === M) return ae(Q, G, Cu(Q, te), ye);
				_u(Q, te);
			}
			return null;
		}
		function ue(Q, G, te, ye, We) {
			if (
				(typeof ye == "string" && ye !== "") ||
				typeof ye == "number" ||
				typeof ye == "bigint"
			)
				return (Q = Q.get(te) || null), A(G, Q, "" + ye, We);
			if (typeof ye == "object" && ye !== null) {
				switch (ye.$$typeof) {
					case b:
						return (Q = Q.get(ye.key === null ? te : ye.key) || null), q(G, Q, ye, We);
					case w:
						return (
							(Q = Q.get(ye.key === null ? te : ye.key) || null), ne(G, Q, ye, We)
						);
					case U:
						return (ye = ni(ye)), ue(Q, G, te, ye, We);
				}
				if (ge(ye) || Y(ye)) return (Q = Q.get(te) || null), he(G, Q, ye, We, null);
				if (typeof ye.then == "function") return ue(Q, G, te, ku(ye), We);
				if (ye.$$typeof === M) return ue(Q, G, te, Cu(G, ye), We);
				_u(G, ye);
			}
			return null;
		}
		function Ve(Q, G, te, ye) {
			for (
				var We = null, Tt = null, Xe = G, ct = (G = 0), bt = null;
				Xe !== null && ct < te.length;
				ct++
			) {
				Xe.index > ct ? ((bt = Xe), (Xe = null)) : (bt = Xe.sibling);
				var Ct = ae(Q, Xe, te[ct], ye);
				if (Ct === null) {
					Xe === null && (Xe = bt);
					break;
				}
				e && Xe && Ct.alternate === null && t(Q, Xe),
					(G = m(Ct, G, ct)),
					Tt === null ? (We = Ct) : (Tt.sibling = Ct),
					(Tt = Ct),
					(Xe = bt);
			}
			if (ct === te.length) return a(Q, Xe), vt && Ao(Q, ct), We;
			if (Xe === null) {
				for (; ct < te.length; ct++)
					(Xe = be(Q, te[ct], ye)),
						Xe !== null &&
							((G = m(Xe, G, ct)),
							Tt === null ? (We = Xe) : (Tt.sibling = Xe),
							(Tt = Xe));
				return vt && Ao(Q, ct), We;
			}
			for (Xe = s(Xe); ct < te.length; ct++)
				(bt = ue(Xe, Q, ct, te[ct], ye)),
					bt !== null &&
						(e && bt.alternate !== null && Xe.delete(bt.key === null ? ct : bt.key),
						(G = m(bt, G, ct)),
						Tt === null ? (We = bt) : (Tt.sibling = bt),
						(Tt = bt));
			return (
				e &&
					Xe.forEach(function (Aa) {
						return t(Q, Aa);
					}),
				vt && Ao(Q, ct),
				We
			);
		}
		function tt(Q, G, te, ye) {
			if (te == null) throw Error(i(151));
			for (
				var We = null, Tt = null, Xe = G, ct = (G = 0), bt = null, Ct = te.next();
				Xe !== null && !Ct.done;
				ct++, Ct = te.next()
			) {
				Xe.index > ct ? ((bt = Xe), (Xe = null)) : (bt = Xe.sibling);
				var Aa = ae(Q, Xe, Ct.value, ye);
				if (Aa === null) {
					Xe === null && (Xe = bt);
					break;
				}
				e && Xe && Aa.alternate === null && t(Q, Xe),
					(G = m(Aa, G, ct)),
					Tt === null ? (We = Aa) : (Tt.sibling = Aa),
					(Tt = Aa),
					(Xe = bt);
			}
			if (Ct.done) return a(Q, Xe), vt && Ao(Q, ct), We;
			if (Xe === null) {
				for (; !Ct.done; ct++, Ct = te.next())
					(Ct = be(Q, Ct.value, ye)),
						Ct !== null &&
							((G = m(Ct, G, ct)),
							Tt === null ? (We = Ct) : (Tt.sibling = Ct),
							(Tt = Ct));
				return vt && Ao(Q, ct), We;
			}
			for (Xe = s(Xe); !Ct.done; ct++, Ct = te.next())
				(Ct = ue(Xe, Q, ct, Ct.value, ye)),
					Ct !== null &&
						(e && Ct.alternate !== null && Xe.delete(Ct.key === null ? ct : Ct.key),
						(G = m(Ct, G, ct)),
						Tt === null ? (We = Ct) : (Tt.sibling = Ct),
						(Tt = Ct));
			return (
				e &&
					Xe.forEach(function (UE) {
						return t(Q, UE);
					}),
				vt && Ao(Q, ct),
				We
			);
		}
		function qt(Q, G, te, ye) {
			if (
				(typeof te == "object" &&
					te !== null &&
					te.type === R &&
					te.key === null &&
					(te = te.props.children),
				typeof te == "object" && te !== null)
			) {
				switch (te.$$typeof) {
					case b:
						e: {
							for (var We = te.key; G !== null; ) {
								if (G.key === We) {
									if (((We = te.type), We === R)) {
										if (G.tag === 7) {
											a(Q, G.sibling),
												(ye = d(G, te.props.children)),
												(ye.return = Q),
												(Q = ye);
											break e;
										}
									} else if (
										G.elementType === We ||
										(typeof We == "object" &&
											We !== null &&
											We.$$typeof === U &&
											ni(We) === G.type)
									) {
										a(Q, G.sibling),
											(ye = d(G, te.props)),
											al(ye, te),
											(ye.return = Q),
											(Q = ye);
										break e;
									}
									a(Q, G);
									break;
								} else t(Q, G);
								G = G.sibling;
							}
							te.type === R
								? ((ye = Ja(te.props.children, Q.mode, ye, te.key)),
								  (ye.return = Q),
								  (Q = ye))
								: ((ye = Eu(te.type, te.key, te.props, null, Q.mode, ye)),
								  al(ye, te),
								  (ye.return = Q),
								  (Q = ye));
						}
						return x(Q);
					case w:
						e: {
							for (We = te.key; G !== null; ) {
								if (G.key === We)
									if (
										G.tag === 4 &&
										G.stateNode.containerInfo === te.containerInfo &&
										G.stateNode.implementation === te.implementation
									) {
										a(Q, G.sibling),
											(ye = d(G, te.children || [])),
											(ye.return = Q),
											(Q = ye);
										break e;
									} else {
										a(Q, G);
										break;
									}
								else t(Q, G);
								G = G.sibling;
							}
							(ye = Kf(te, Q.mode, ye)), (ye.return = Q), (Q = ye);
						}
						return x(Q);
					case U:
						return (te = ni(te)), qt(Q, G, te, ye);
				}
				if (ge(te)) return Ve(Q, G, te, ye);
				if (Y(te)) {
					if (((We = Y(te)), typeof We != "function")) throw Error(i(150));
					return (te = We.call(te)), tt(Q, G, te, ye);
				}
				if (typeof te.then == "function") return qt(Q, G, ku(te), ye);
				if (te.$$typeof === M) return qt(Q, G, Cu(Q, te), ye);
				_u(Q, te);
			}
			return (typeof te == "string" && te !== "") ||
				typeof te == "number" ||
				typeof te == "bigint"
				? ((te = "" + te),
				  G !== null && G.tag === 6
						? (a(Q, G.sibling), (ye = d(G, te)), (ye.return = Q), (Q = ye))
						: (a(Q, G), (ye = Xf(te, Q.mode, ye)), (ye.return = Q), (Q = ye)),
				  x(Q))
				: a(Q, G);
		}
		return function (Q, G, te, ye) {
			try {
				ol = 0;
				var We = qt(Q, G, te, ye);
				return (Qi = null), We;
			} catch (Xe) {
				if (Xe === Ki || Xe === Au) throw Xe;
				var Tt = lr(29, Xe, null, Q.mode);
				return (Tt.lanes = ye), (Tt.return = Q), Tt;
			}
		};
	}
	var oi = Cg(!0),
		Og = Cg(!1),
		fa = !1;
	function id(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: { pending: null, lanes: 0, hiddenCallbacks: null },
			callbacks: null,
		};
	}
	function sd(e, t) {
		(e = e.updateQueue),
			t.updateQueue === e &&
				(t.updateQueue = {
					baseState: e.baseState,
					firstBaseUpdate: e.firstBaseUpdate,
					lastBaseUpdate: e.lastBaseUpdate,
					shared: e.shared,
					callbacks: null,
				});
	}
	function da(e) {
		return { lane: e, tag: 0, payload: null, callback: null, next: null };
	}
	function ha(e, t, a) {
		var s = e.updateQueue;
		if (s === null) return null;
		if (((s = s.shared), (Ot & 2) !== 0)) {
			var d = s.pending;
			return (
				d === null ? (t.next = t) : ((t.next = d.next), (d.next = t)),
				(s.pending = t),
				(t = wu(e)),
				cg(e, null, a),
				t
			);
		}
		return xu(e, s, t, a), wu(e);
	}
	function il(e, t, a) {
		if (((t = t.updateQueue), t !== null && ((t = t.shared), (a & 4194048) !== 0))) {
			var s = t.lanes;
			(s &= e.pendingLanes), (a |= s), (t.lanes = a), pn(e, a);
		}
	}
	function ld(e, t) {
		var a = e.updateQueue,
			s = e.alternate;
		if (s !== null && ((s = s.updateQueue), a === s)) {
			var d = null,
				m = null;
			if (((a = a.firstBaseUpdate), a !== null)) {
				do {
					var x = {
						lane: a.lane,
						tag: a.tag,
						payload: a.payload,
						callback: null,
						next: null,
					};
					m === null ? (d = m = x) : (m = m.next = x), (a = a.next);
				} while (a !== null);
				m === null ? (d = m = t) : (m = m.next = t);
			} else d = m = t;
			(a = {
				baseState: s.baseState,
				firstBaseUpdate: d,
				lastBaseUpdate: m,
				shared: s.shared,
				callbacks: s.callbacks,
			}),
				(e.updateQueue = a);
			return;
		}
		(e = a.lastBaseUpdate),
			e === null ? (a.firstBaseUpdate = t) : (e.next = t),
			(a.lastBaseUpdate = t);
	}
	var ud = !1;
	function sl() {
		if (ud) {
			var e = Xi;
			if (e !== null) throw e;
		}
	}
	function ll(e, t, a, s) {
		ud = !1;
		var d = e.updateQueue;
		fa = !1;
		var m = d.firstBaseUpdate,
			x = d.lastBaseUpdate,
			A = d.shared.pending;
		if (A !== null) {
			d.shared.pending = null;
			var q = A,
				ne = q.next;
			(q.next = null), x === null ? (m = ne) : (x.next = ne), (x = q);
			var he = e.alternate;
			he !== null &&
				((he = he.updateQueue),
				(A = he.lastBaseUpdate),
				A !== x &&
					(A === null ? (he.firstBaseUpdate = ne) : (A.next = ne),
					(he.lastBaseUpdate = q)));
		}
		if (m !== null) {
			var be = d.baseState;
			(x = 0), (he = ne = q = null), (A = m);
			do {
				var ae = A.lane & -536870913,
					ue = ae !== A.lane;
				if (ue ? (yt & ae) === ae : (s & ae) === ae) {
					ae !== 0 && ae === Fi && (ud = !0),
						he !== null &&
							(he = he.next =
								{
									lane: 0,
									tag: A.tag,
									payload: A.payload,
									callback: null,
									next: null,
								});
					e: {
						var Ve = e,
							tt = A;
						ae = t;
						var qt = a;
						switch (tt.tag) {
							case 1:
								if (((Ve = tt.payload), typeof Ve == "function")) {
									be = Ve.call(qt, be, ae);
									break e;
								}
								be = Ve;
								break e;
							case 3:
								Ve.flags = (Ve.flags & -65537) | 128;
							case 0:
								if (
									((Ve = tt.payload),
									(ae = typeof Ve == "function" ? Ve.call(qt, be, ae) : Ve),
									ae == null)
								)
									break e;
								be = g({}, be, ae);
								break e;
							case 2:
								fa = !0;
						}
					}
					(ae = A.callback),
						ae !== null &&
							((e.flags |= 64),
							ue && (e.flags |= 8192),
							(ue = d.callbacks),
							ue === null ? (d.callbacks = [ae]) : ue.push(ae));
				} else
					(ue = {
						lane: ae,
						tag: A.tag,
						payload: A.payload,
						callback: A.callback,
						next: null,
					}),
						he === null ? ((ne = he = ue), (q = be)) : (he = he.next = ue),
						(x |= ae);
				if (((A = A.next), A === null)) {
					if (((A = d.shared.pending), A === null)) break;
					(ue = A),
						(A = ue.next),
						(ue.next = null),
						(d.lastBaseUpdate = ue),
						(d.shared.pending = null);
				}
			} while (!0);
			he === null && (q = be),
				(d.baseState = q),
				(d.firstBaseUpdate = ne),
				(d.lastBaseUpdate = he),
				m === null && (d.shared.lanes = 0),
				(ba |= x),
				(e.lanes = x),
				(e.memoizedState = be);
		}
	}
	function Ag(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Mg(e, t) {
		var a = e.callbacks;
		if (a !== null) for (e.callbacks = null, e = 0; e < a.length; e++) Ag(a[e], t);
	}
	var Zi = B(null),
		Du = B(0);
	function kg(e, t) {
		(e = Ho), ee(Du, e), ee(Zi, t), (Ho = e | t.baseLanes);
	}
	function cd() {
		ee(Du, Ho), ee(Zi, Zi.current);
	}
	function fd() {
		(Ho = Du.current), Z(Zi), Z(Du);
	}
	var ur = B(null),
		_r = null;
	function pa(e) {
		var t = e.alternate;
		ee(un, un.current & 1),
			ee(ur, e),
			_r === null &&
				(t === null || Zi.current !== null || t.memoizedState !== null) &&
				(_r = e);
	}
	function dd(e) {
		ee(un, un.current), ee(ur, e), _r === null && (_r = e);
	}
	function _g(e) {
		e.tag === 22 ? (ee(un, un.current), ee(ur, e), _r === null && (_r = e)) : ma();
	}
	function ma() {
		ee(un, un.current), ee(ur, ur.current);
	}
	function cr(e) {
		Z(ur), _r === e && (_r = null), Z(un);
	}
	var un = B(0);
	function Nu(e) {
		for (var t = e; t !== null; ) {
			if (t.tag === 13) {
				var a = t.memoizedState;
				if (a !== null && ((a = a.dehydrated), a === null || bh(a) || vh(a))) return t;
			} else if (
				t.tag === 19 &&
				(t.memoizedProps.revealOrder === "forwards" ||
					t.memoizedProps.revealOrder === "backwards" ||
					t.memoizedProps.revealOrder === "unstable_legacy-backwards" ||
					t.memoizedProps.revealOrder === "together")
			) {
				if ((t.flags & 128) !== 0) return t;
			} else if (t.child !== null) {
				(t.child.return = t), (t = t.child);
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null; ) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			(t.sibling.return = t.return), (t = t.sibling);
		}
		return null;
	}
	var _o = 0,
		ut = null,
		Ut = null,
		gn = null,
		Lu = !1,
		Ji = !1,
		ai = !1,
		zu = 0,
		ul = 0,
		Wi = null,
		Aw = 0;
	function rn() {
		throw Error(i(321));
	}
	function hd(e, t) {
		if (t === null) return !1;
		for (var a = 0; a < t.length && a < e.length; a++) if (!sr(e[a], t[a])) return !1;
		return !0;
	}
	function pd(e, t, a, s, d, m) {
		return (
			(_o = m),
			(ut = t),
			(t.memoizedState = null),
			(t.updateQueue = null),
			(t.lanes = 0),
			(j.H = e === null || e.memoizedState === null ? py : Md),
			(ai = !1),
			(m = a(s, d)),
			(ai = !1),
			Ji && (m = Ng(t, a, s, d)),
			Dg(e),
			m
		);
	}
	function Dg(e) {
		j.H = dl;
		var t = Ut !== null && Ut.next !== null;
		if (((_o = 0), (gn = Ut = ut = null), (Lu = !1), (ul = 0), (Wi = null), t))
			throw Error(i(300));
		e === null || yn || ((e = e.dependencies), e !== null && Tu(e) && (yn = !0));
	}
	function Ng(e, t, a, s) {
		ut = e;
		var d = 0;
		do {
			if ((Ji && (Wi = null), (ul = 0), (Ji = !1), 25 <= d)) throw Error(i(301));
			if (((d += 1), (gn = Ut = null), e.updateQueue != null)) {
				var m = e.updateQueue;
				(m.lastEffect = null),
					(m.events = null),
					(m.stores = null),
					m.memoCache != null && (m.memoCache.index = 0);
			}
			(j.H = my), (m = t(a, s));
		} while (Ji);
		return m;
	}
	function Mw() {
		var e = j.H,
			t = e.useState()[0];
		return (
			(t = typeof t.then == "function" ? cl(t) : t),
			(e = e.useState()[0]),
			(Ut !== null ? Ut.memoizedState : null) !== e && (ut.flags |= 1024),
			t
		);
	}
	function md() {
		var e = zu !== 0;
		return (zu = 0), e;
	}
	function gd(e, t, a) {
		(t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~a);
	}
	function yd(e) {
		if (Lu) {
			for (e = e.memoizedState; e !== null; ) {
				var t = e.queue;
				t !== null && (t.pending = null), (e = e.next);
			}
			Lu = !1;
		}
		(_o = 0), (gn = Ut = ut = null), (Ji = !1), (ul = zu = 0), (Wi = null);
	}
	function Yn() {
		var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
		return gn === null ? (ut.memoizedState = gn = e) : (gn = gn.next = e), gn;
	}
	function cn() {
		if (Ut === null) {
			var e = ut.alternate;
			e = e !== null ? e.memoizedState : null;
		} else e = Ut.next;
		var t = gn === null ? ut.memoizedState : gn.next;
		if (t !== null) (gn = t), (Ut = e);
		else {
			if (e === null) throw ut.alternate === null ? Error(i(467)) : Error(i(310));
			(Ut = e),
				(e = {
					memoizedState: Ut.memoizedState,
					baseState: Ut.baseState,
					baseQueue: Ut.baseQueue,
					queue: Ut.queue,
					next: null,
				}),
				gn === null ? (ut.memoizedState = gn = e) : (gn = gn.next = e);
		}
		return gn;
	}
	function ju() {
		return { lastEffect: null, events: null, stores: null, memoCache: null };
	}
	function cl(e) {
		var t = ul;
		return (
			(ul += 1),
			Wi === null && (Wi = []),
			(e = Eg(Wi, e, t)),
			(t = ut),
			(gn === null ? t.memoizedState : gn.next) === null &&
				((t = t.alternate), (j.H = t === null || t.memoizedState === null ? py : Md)),
			e
		);
	}
	function Bu(e) {
		if (e !== null && typeof e == "object") {
			if (typeof e.then == "function") return cl(e);
			if (e.$$typeof === M) return Dn(e);
		}
		throw Error(i(438, String(e)));
	}
	function bd(e) {
		var t = null,
			a = ut.updateQueue;
		if ((a !== null && (t = a.memoCache), t == null)) {
			var s = ut.alternate;
			s !== null &&
				((s = s.updateQueue),
				s !== null &&
					((s = s.memoCache),
					s != null &&
						(t = {
							data: s.data.map(function (d) {
								return d.slice();
							}),
							index: 0,
						})));
		}
		if (
			(t == null && (t = { data: [], index: 0 }),
			a === null && ((a = ju()), (ut.updateQueue = a)),
			(a.memoCache = t),
			(a = t.data[t.index]),
			a === void 0)
		)
			for (a = t.data[t.index] = Array(e), s = 0; s < e; s++) a[s] = we;
		return t.index++, a;
	}
	function Do(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function Uu(e) {
		var t = cn();
		return vd(t, Ut, e);
	}
	function vd(e, t, a) {
		var s = e.queue;
		if (s === null) throw Error(i(311));
		s.lastRenderedReducer = a;
		var d = e.baseQueue,
			m = s.pending;
		if (m !== null) {
			if (d !== null) {
				var x = d.next;
				(d.next = m.next), (m.next = x);
			}
			(t.baseQueue = d = m), (s.pending = null);
		}
		if (((m = e.baseState), d === null)) e.memoizedState = m;
		else {
			t = d.next;
			var A = (x = null),
				q = null,
				ne = t,
				he = !1;
			do {
				var be = ne.lane & -536870913;
				if (be !== ne.lane ? (yt & be) === be : (_o & be) === be) {
					var ae = ne.revertLane;
					if (ae === 0)
						q !== null &&
							(q = q.next =
								{
									lane: 0,
									revertLane: 0,
									gesture: null,
									action: ne.action,
									hasEagerState: ne.hasEagerState,
									eagerState: ne.eagerState,
									next: null,
								}),
							be === Fi && (he = !0);
					else if ((_o & ae) === ae) {
						(ne = ne.next), ae === Fi && (he = !0);
						continue;
					} else
						(be = {
							lane: 0,
							revertLane: ne.revertLane,
							gesture: null,
							action: ne.action,
							hasEagerState: ne.hasEagerState,
							eagerState: ne.eagerState,
							next: null,
						}),
							q === null ? ((A = q = be), (x = m)) : (q = q.next = be),
							(ut.lanes |= ae),
							(ba |= ae);
					(be = ne.action),
						ai && a(m, be),
						(m = ne.hasEagerState ? ne.eagerState : a(m, be));
				} else
					(ae = {
						lane: be,
						revertLane: ne.revertLane,
						gesture: ne.gesture,
						action: ne.action,
						hasEagerState: ne.hasEagerState,
						eagerState: ne.eagerState,
						next: null,
					}),
						q === null ? ((A = q = ae), (x = m)) : (q = q.next = ae),
						(ut.lanes |= be),
						(ba |= be);
				ne = ne.next;
			} while (ne !== null && ne !== t);
			if (
				(q === null ? (x = m) : (q.next = A),
				!sr(m, e.memoizedState) && ((yn = !0), he && ((a = Xi), a !== null)))
			)
				throw a;
			(e.memoizedState = m), (e.baseState = x), (e.baseQueue = q), (s.lastRenderedState = m);
		}
		return d === null && (s.lanes = 0), [e.memoizedState, s.dispatch];
	}
	function Sd(e) {
		var t = cn(),
			a = t.queue;
		if (a === null) throw Error(i(311));
		a.lastRenderedReducer = e;
		var s = a.dispatch,
			d = a.pending,
			m = t.memoizedState;
		if (d !== null) {
			a.pending = null;
			var x = (d = d.next);
			do (m = e(m, x.action)), (x = x.next);
			while (x !== d);
			sr(m, t.memoizedState) || (yn = !0),
				(t.memoizedState = m),
				t.baseQueue === null && (t.baseState = m),
				(a.lastRenderedState = m);
		}
		return [m, s];
	}
	function Lg(e, t, a) {
		var s = ut,
			d = cn(),
			m = vt;
		if (m) {
			if (a === void 0) throw Error(i(407));
			a = a();
		} else a = t();
		var x = !sr((Ut || d).memoizedState, a);
		if (
			(x && ((d.memoizedState = a), (yn = !0)),
			(d = d.queue),
			Ed(Bg.bind(null, s, d, e), [e]),
			d.getSnapshot !== t || x || (gn !== null && gn.memoizedState.tag & 1))
		) {
			if (
				((s.flags |= 2048),
				$i(9, { destroy: void 0 }, jg.bind(null, s, d, a, t), null),
				Vt === null)
			)
				throw Error(i(349));
			m || (_o & 127) !== 0 || zg(s, t, a);
		}
		return a;
	}
	function zg(e, t, a) {
		(e.flags |= 16384),
			(e = { getSnapshot: t, value: a }),
			(t = ut.updateQueue),
			t === null
				? ((t = ju()), (ut.updateQueue = t), (t.stores = [e]))
				: ((a = t.stores), a === null ? (t.stores = [e]) : a.push(e));
	}
	function jg(e, t, a, s) {
		(t.value = a), (t.getSnapshot = s), Ug(t) && Hg(e);
	}
	function Bg(e, t, a) {
		return a(function () {
			Ug(t) && Hg(e);
		});
	}
	function Ug(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var a = t();
			return !sr(e, a);
		} catch (s) {
			return !0;
		}
	}
	function Hg(e) {
		var t = Za(e, 2);
		t !== null && tr(t, e, 2);
	}
	function xd(e) {
		var t = Yn();
		if (typeof e == "function") {
			var a = e;
			if (((e = a()), ai)) {
				rt(!0);
				try {
					a();
				} finally {
					rt(!1);
				}
			}
		}
		return (
			(t.memoizedState = t.baseState = e),
			(t.queue = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Do,
				lastRenderedState: e,
			}),
			t
		);
	}
	function qg(e, t, a, s) {
		return (e.baseState = a), vd(e, Ut, typeof s == "function" ? s : Do);
	}
	function kw(e, t, a, s, d) {
		if (Pu(e)) throw Error(i(485));
		if (((e = t.action), e !== null)) {
			var m = {
				payload: d,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function (x) {
					m.listeners.push(x);
				},
			};
			j.T !== null ? a(!0) : (m.isTransition = !1),
				s(m),
				(a = t.pending),
				a === null
					? ((m.next = t.pending = m), Pg(t, m))
					: ((m.next = a.next), (t.pending = a.next = m));
		}
	}
	function Pg(e, t) {
		var a = t.action,
			s = t.payload,
			d = e.state;
		if (t.isTransition) {
			var m = j.T,
				x = {};
			j.T = x;
			try {
				var A = a(d, s),
					q = j.S;
				q !== null && q(x, A), Vg(e, t, A);
			} catch (ne) {
				wd(e, t, ne);
			} finally {
				m !== null && x.types !== null && (m.types = x.types), (j.T = m);
			}
		} else
			try {
				(m = a(d, s)), Vg(e, t, m);
			} catch (ne) {
				wd(e, t, ne);
			}
	}
	function Vg(e, t, a) {
		a !== null && typeof a == "object" && typeof a.then == "function"
			? a.then(
					function (s) {
						Yg(e, t, s);
					},
					function (s) {
						return wd(e, t, s);
					}
			  )
			: Yg(e, t, a);
	}
	function Yg(e, t, a) {
		(t.status = "fulfilled"),
			(t.value = a),
			Ig(t),
			(e.state = a),
			(t = e.pending),
			t !== null &&
				((a = t.next),
				a === t ? (e.pending = null) : ((a = a.next), (t.next = a), Pg(e, a)));
	}
	function wd(e, t, a) {
		var s = e.pending;
		if (((e.pending = null), s !== null)) {
			s = s.next;
			do (t.status = "rejected"), (t.reason = a), Ig(t), (t = t.next);
			while (t !== s);
		}
		e.action = null;
	}
	function Ig(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Gg(e, t) {
		return t;
	}
	function Fg(e, t) {
		if (vt) {
			var a = Vt.formState;
			if (a !== null) {
				e: {
					var s = ut;
					if (vt) {
						if (Qt) {
							t: {
								for (var d = Qt, m = kr; d.nodeType !== 8; ) {
									if (!m) {
										d = null;
										break t;
									}
									if (((d = Dr(d.nextSibling)), d === null)) {
										d = null;
										break t;
									}
								}
								(m = d.data), (d = m === "F!" || m === "F" ? d : null);
							}
							if (d) {
								(Qt = Dr(d.nextSibling)), (s = d.data === "F!");
								break e;
							}
						}
						ua(s);
					}
					s = !1;
				}
				s && (t = a[0]);
			}
		}
		return (
			(a = Yn()),
			(a.memoizedState = a.baseState = t),
			(s = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Gg,
				lastRenderedState: t,
			}),
			(a.queue = s),
			(a = fy.bind(null, ut, s)),
			(s.dispatch = a),
			(s = xd(!1)),
			(m = Ad.bind(null, ut, !1, s.queue)),
			(s = Yn()),
			(d = { state: t, dispatch: null, action: e, pending: null }),
			(s.queue = d),
			(a = kw.bind(null, ut, d, m, a)),
			(d.dispatch = a),
			(s.memoizedState = e),
			[t, a, !1]
		);
	}
	function Xg(e) {
		var t = cn();
		return Kg(t, Ut, e);
	}
	function Kg(e, t, a) {
		if (
			((t = vd(e, t, Gg)[0]),
			(e = Uu(Do)[0]),
			typeof t == "object" && t !== null && typeof t.then == "function")
		)
			try {
				var s = cl(t);
			} catch (x) {
				throw x === Ki ? Au : x;
			}
		else s = t;
		t = cn();
		var d = t.queue,
			m = d.dispatch;
		return (
			a !== t.memoizedState &&
				((ut.flags |= 2048), $i(9, { destroy: void 0 }, _w.bind(null, d, a), null)),
			[s, m, e]
		);
	}
	function _w(e, t) {
		e.action = t;
	}
	function Qg(e) {
		var t = cn(),
			a = Ut;
		if (a !== null) return Kg(t, a, e);
		cn(), (t = t.memoizedState), (a = cn());
		var s = a.queue.dispatch;
		return (a.memoizedState = e), [t, s, !1];
	}
	function $i(e, t, a, s) {
		return (
			(e = { tag: e, create: a, deps: s, inst: t, next: null }),
			(t = ut.updateQueue),
			t === null && ((t = ju()), (ut.updateQueue = t)),
			(a = t.lastEffect),
			a === null
				? (t.lastEffect = e.next = e)
				: ((s = a.next), (a.next = e), (e.next = s), (t.lastEffect = e)),
			e
		);
	}
	function Zg() {
		return cn().memoizedState;
	}
	function Hu(e, t, a, s) {
		var d = Yn();
		(ut.flags |= e),
			(d.memoizedState = $i(1 | t, { destroy: void 0 }, a, s === void 0 ? null : s));
	}
	function qu(e, t, a, s) {
		var d = cn();
		s = s === void 0 ? null : s;
		var m = d.memoizedState.inst;
		Ut !== null && s !== null && hd(s, Ut.memoizedState.deps)
			? (d.memoizedState = $i(t, m, a, s))
			: ((ut.flags |= e), (d.memoizedState = $i(1 | t, m, a, s)));
	}
	function Jg(e, t) {
		Hu(8390656, 8, e, t);
	}
	function Ed(e, t) {
		qu(2048, 8, e, t);
	}
	function Dw(e) {
		ut.flags |= 4;
		var t = ut.updateQueue;
		if (t === null) (t = ju()), (ut.updateQueue = t), (t.events = [e]);
		else {
			var a = t.events;
			a === null ? (t.events = [e]) : a.push(e);
		}
	}
	function Wg(e) {
		var t = cn().memoizedState;
		return (
			Dw({ ref: t, nextImpl: e }),
			function () {
				if ((Ot & 2) !== 0) throw Error(i(440));
				return t.impl.apply(void 0, arguments);
			}
		);
	}
	function $g(e, t) {
		return qu(4, 2, e, t);
	}
	function ey(e, t) {
		return qu(4, 4, e, t);
	}
	function ty(e, t) {
		if (typeof t == "function") {
			e = e();
			var a = t(e);
			return function () {
				typeof a == "function" ? a() : t(null);
			};
		}
		if (t != null)
			return (
				(e = e()),
				(t.current = e),
				function () {
					t.current = null;
				}
			);
	}
	function ny(e, t, a) {
		(a = a != null ? a.concat([e]) : null), qu(4, 4, ty.bind(null, t, e), a);
	}
	function Rd() {}
	function ry(e, t) {
		var a = cn();
		t = t === void 0 ? null : t;
		var s = a.memoizedState;
		return t !== null && hd(t, s[1]) ? s[0] : ((a.memoizedState = [e, t]), e);
	}
	function oy(e, t) {
		var a = cn();
		t = t === void 0 ? null : t;
		var s = a.memoizedState;
		if (t !== null && hd(t, s[1])) return s[0];
		if (((s = e()), ai)) {
			rt(!0);
			try {
				e();
			} finally {
				rt(!1);
			}
		}
		return (a.memoizedState = [s, t]), s;
	}
	function Td(e, t, a) {
		return a === void 0 || ((_o & 1073741824) !== 0 && (yt & 261930) === 0)
			? (e.memoizedState = t)
			: ((e.memoizedState = a), (e = a0()), (ut.lanes |= e), (ba |= e), a);
	}
	function ay(e, t, a, s) {
		return sr(a, t)
			? a
			: Zi.current !== null
			? ((e = Td(e, a, s)), sr(e, t) || (yn = !0), e)
			: (_o & 42) === 0 || ((_o & 1073741824) !== 0 && (yt & 261930) === 0)
			? ((yn = !0), (e.memoizedState = a))
			: ((e = a0()), (ut.lanes |= e), (ba |= e), t);
	}
	function iy(e, t, a, s, d) {
		var m = I.p;
		I.p = m !== 0 && 8 > m ? m : 8;
		var x = j.T,
			A = {};
		(j.T = A), Ad(e, !1, t, a);
		try {
			var q = d(),
				ne = j.S;
			if (
				(ne !== null && ne(A, q),
				q !== null && typeof q == "object" && typeof q.then == "function")
			) {
				var he = Ow(q, s);
				fl(e, t, he, hr(e));
			} else fl(e, t, s, hr(e));
		} catch (be) {
			fl(e, t, { then: function () {}, status: "rejected", reason: be }, hr());
		} finally {
			(I.p = m), x !== null && A.types !== null && (x.types = A.types), (j.T = x);
		}
	}
	function Nw() {}
	function Cd(e, t, a, s) {
		if (e.tag !== 5) throw Error(i(476));
		var d = sy(e).queue;
		iy(
			e,
			d,
			t,
			F,
			a === null
				? Nw
				: function () {
						return ly(e), a(s);
				  }
		);
	}
	function sy(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: F,
			baseState: F,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Do,
				lastRenderedState: F,
			},
			next: null,
		};
		var a = {};
		return (
			(t.next = {
				memoizedState: a,
				baseState: a,
				baseQueue: null,
				queue: {
					pending: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: Do,
					lastRenderedState: a,
				},
				next: null,
			}),
			(e.memoizedState = t),
			(e = e.alternate),
			e !== null && (e.memoizedState = t),
			t
		);
	}
	function ly(e) {
		var t = sy(e);
		t.next === null && (t = e.alternate.memoizedState), fl(e, t.next.queue, {}, hr());
	}
	function Od() {
		return Dn(Al);
	}
	function uy() {
		return cn().memoizedState;
	}
	function cy() {
		return cn().memoizedState;
	}
	function Lw(e) {
		for (var t = e.return; t !== null; ) {
			switch (t.tag) {
				case 24:
				case 3:
					var a = hr();
					e = da(a);
					var s = ha(t, e, a);
					s !== null && (tr(s, t, a), il(s, t, a)),
						(t = { cache: nd() }),
						(e.payload = t);
					return;
			}
			t = t.return;
		}
	}
	function zw(e, t, a) {
		var s = hr();
		(a = {
			lane: s,
			revertLane: 0,
			gesture: null,
			action: a,
			hasEagerState: !1,
			eagerState: null,
			next: null,
		}),
			Pu(e) ? dy(t, a) : ((a = Gf(e, t, a, s)), a !== null && (tr(a, e, s), hy(a, t, s)));
	}
	function fy(e, t, a) {
		var s = hr();
		fl(e, t, a, s);
	}
	function fl(e, t, a, s) {
		var d = {
			lane: s,
			revertLane: 0,
			gesture: null,
			action: a,
			hasEagerState: !1,
			eagerState: null,
			next: null,
		};
		if (Pu(e)) dy(t, d);
		else {
			var m = e.alternate;
			if (
				e.lanes === 0 &&
				(m === null || m.lanes === 0) &&
				((m = t.lastRenderedReducer), m !== null)
			)
				try {
					var x = t.lastRenderedState,
						A = m(x, a);
					if (((d.hasEagerState = !0), (d.eagerState = A), sr(A, x)))
						return xu(e, t, d, 0), Vt === null && Su(), !1;
				} catch (q) {}
			if (((a = Gf(e, t, d, s)), a !== null)) return tr(a, e, s), hy(a, t, s), !0;
		}
		return !1;
	}
	function Ad(e, t, a, s) {
		if (
			((s = {
				lane: 2,
				revertLane: ih(),
				gesture: null,
				action: s,
				hasEagerState: !1,
				eagerState: null,
				next: null,
			}),
			Pu(e))
		) {
			if (t) throw Error(i(479));
		} else (t = Gf(e, a, s, 2)), t !== null && tr(t, e, 2);
	}
	function Pu(e) {
		var t = e.alternate;
		return e === ut || (t !== null && t === ut);
	}
	function dy(e, t) {
		Ji = Lu = !0;
		var a = e.pending;
		a === null ? (t.next = t) : ((t.next = a.next), (a.next = t)), (e.pending = t);
	}
	function hy(e, t, a) {
		if ((a & 4194048) !== 0) {
			var s = t.lanes;
			(s &= e.pendingLanes), (a |= s), (t.lanes = a), pn(e, a);
		}
	}
	var dl = {
		readContext: Dn,
		use: Bu,
		useCallback: rn,
		useContext: rn,
		useEffect: rn,
		useImperativeHandle: rn,
		useLayoutEffect: rn,
		useInsertionEffect: rn,
		useMemo: rn,
		useReducer: rn,
		useRef: rn,
		useState: rn,
		useDebugValue: rn,
		useDeferredValue: rn,
		useTransition: rn,
		useSyncExternalStore: rn,
		useId: rn,
		useHostTransitionStatus: rn,
		useFormState: rn,
		useActionState: rn,
		useOptimistic: rn,
		useMemoCache: rn,
		useCacheRefresh: rn,
	};
	dl.useEffectEvent = rn;
	var py = {
			readContext: Dn,
			use: Bu,
			useCallback: function (e, t) {
				return (Yn().memoizedState = [e, t === void 0 ? null : t]), e;
			},
			useContext: Dn,
			useEffect: Jg,
			useImperativeHandle: function (e, t, a) {
				(a = a != null ? a.concat([e]) : null), Hu(4194308, 4, ty.bind(null, t, e), a);
			},
			useLayoutEffect: function (e, t) {
				return Hu(4194308, 4, e, t);
			},
			useInsertionEffect: function (e, t) {
				Hu(4, 2, e, t);
			},
			useMemo: function (e, t) {
				var a = Yn();
				t = t === void 0 ? null : t;
				var s = e();
				if (ai) {
					rt(!0);
					try {
						e();
					} finally {
						rt(!1);
					}
				}
				return (a.memoizedState = [s, t]), s;
			},
			useReducer: function (e, t, a) {
				var s = Yn();
				if (a !== void 0) {
					var d = a(t);
					if (ai) {
						rt(!0);
						try {
							a(t);
						} finally {
							rt(!1);
						}
					}
				} else d = t;
				return (
					(s.memoizedState = s.baseState = d),
					(e = {
						pending: null,
						lanes: 0,
						dispatch: null,
						lastRenderedReducer: e,
						lastRenderedState: d,
					}),
					(s.queue = e),
					(e = e.dispatch = zw.bind(null, ut, e)),
					[s.memoizedState, e]
				);
			},
			useRef: function (e) {
				var t = Yn();
				return (e = { current: e }), (t.memoizedState = e);
			},
			useState: function (e) {
				e = xd(e);
				var t = e.queue,
					a = fy.bind(null, ut, t);
				return (t.dispatch = a), [e.memoizedState, a];
			},
			useDebugValue: Rd,
			useDeferredValue: function (e, t) {
				var a = Yn();
				return Td(a, e, t);
			},
			useTransition: function () {
				var e = xd(!1);
				return (e = iy.bind(null, ut, e.queue, !0, !1)), (Yn().memoizedState = e), [!1, e];
			},
			useSyncExternalStore: function (e, t, a) {
				var s = ut,
					d = Yn();
				if (vt) {
					if (a === void 0) throw Error(i(407));
					a = a();
				} else {
					if (((a = t()), Vt === null)) throw Error(i(349));
					(yt & 127) !== 0 || zg(s, t, a);
				}
				d.memoizedState = a;
				var m = { value: a, getSnapshot: t };
				return (
					(d.queue = m),
					Jg(Bg.bind(null, s, m, e), [e]),
					(s.flags |= 2048),
					$i(9, { destroy: void 0 }, jg.bind(null, s, m, a, t), null),
					a
				);
			},
			useId: function () {
				var e = Yn(),
					t = Vt.identifierPrefix;
				if (vt) {
					var a = ao,
						s = oo;
					(a = (s & ~(1 << (32 - ht(s) - 1))).toString(32) + a),
						(t = "_" + t + "R_" + a),
						(a = zu++),
						0 < a && (t += "H" + a.toString(32)),
						(t += "_");
				} else (a = Aw++), (t = "_" + t + "r_" + a.toString(32) + "_");
				return (e.memoizedState = t);
			},
			useHostTransitionStatus: Od,
			useFormState: Fg,
			useActionState: Fg,
			useOptimistic: function (e) {
				var t = Yn();
				t.memoizedState = t.baseState = e;
				var a = {
					pending: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: null,
					lastRenderedState: null,
				};
				return (t.queue = a), (t = Ad.bind(null, ut, !0, a)), (a.dispatch = t), [e, t];
			},
			useMemoCache: bd,
			useCacheRefresh: function () {
				return (Yn().memoizedState = Lw.bind(null, ut));
			},
			useEffectEvent: function (e) {
				var t = Yn(),
					a = { impl: e };
				return (
					(t.memoizedState = a),
					function () {
						if ((Ot & 2) !== 0) throw Error(i(440));
						return a.impl.apply(void 0, arguments);
					}
				);
			},
		},
		Md = {
			readContext: Dn,
			use: Bu,
			useCallback: ry,
			useContext: Dn,
			useEffect: Ed,
			useImperativeHandle: ny,
			useInsertionEffect: $g,
			useLayoutEffect: ey,
			useMemo: oy,
			useReducer: Uu,
			useRef: Zg,
			useState: function () {
				return Uu(Do);
			},
			useDebugValue: Rd,
			useDeferredValue: function (e, t) {
				var a = cn();
				return ay(a, Ut.memoizedState, e, t);
			},
			useTransition: function () {
				var e = Uu(Do)[0],
					t = cn().memoizedState;
				return [typeof e == "boolean" ? e : cl(e), t];
			},
			useSyncExternalStore: Lg,
			useId: uy,
			useHostTransitionStatus: Od,
			useFormState: Xg,
			useActionState: Xg,
			useOptimistic: function (e, t) {
				var a = cn();
				return qg(a, Ut, e, t);
			},
			useMemoCache: bd,
			useCacheRefresh: cy,
		};
	Md.useEffectEvent = Wg;
	var my = {
		readContext: Dn,
		use: Bu,
		useCallback: ry,
		useContext: Dn,
		useEffect: Ed,
		useImperativeHandle: ny,
		useInsertionEffect: $g,
		useLayoutEffect: ey,
		useMemo: oy,
		useReducer: Sd,
		useRef: Zg,
		useState: function () {
			return Sd(Do);
		},
		useDebugValue: Rd,
		useDeferredValue: function (e, t) {
			var a = cn();
			return Ut === null ? Td(a, e, t) : ay(a, Ut.memoizedState, e, t);
		},
		useTransition: function () {
			var e = Sd(Do)[0],
				t = cn().memoizedState;
			return [typeof e == "boolean" ? e : cl(e), t];
		},
		useSyncExternalStore: Lg,
		useId: uy,
		useHostTransitionStatus: Od,
		useFormState: Qg,
		useActionState: Qg,
		useOptimistic: function (e, t) {
			var a = cn();
			return Ut !== null ? qg(a, Ut, e, t) : ((a.baseState = e), [e, a.queue.dispatch]);
		},
		useMemoCache: bd,
		useCacheRefresh: cy,
	};
	my.useEffectEvent = Wg;
	function kd(e, t, a, s) {
		(t = e.memoizedState),
			(a = a(s, t)),
			(a = a == null ? t : g({}, t, a)),
			(e.memoizedState = a),
			e.lanes === 0 && (e.updateQueue.baseState = a);
	}
	var _d = {
		enqueueSetState: function (e, t, a) {
			e = e._reactInternals;
			var s = hr(),
				d = da(s);
			(d.payload = t),
				a != null && (d.callback = a),
				(t = ha(e, d, s)),
				t !== null && (tr(t, e, s), il(t, e, s));
		},
		enqueueReplaceState: function (e, t, a) {
			e = e._reactInternals;
			var s = hr(),
				d = da(s);
			(d.tag = 1),
				(d.payload = t),
				a != null && (d.callback = a),
				(t = ha(e, d, s)),
				t !== null && (tr(t, e, s), il(t, e, s));
		},
		enqueueForceUpdate: function (e, t) {
			e = e._reactInternals;
			var a = hr(),
				s = da(a);
			(s.tag = 2),
				t != null && (s.callback = t),
				(t = ha(e, s, a)),
				t !== null && (tr(t, e, a), il(t, e, a));
		},
	};
	function gy(e, t, a, s, d, m, x) {
		return (
			(e = e.stateNode),
			typeof e.shouldComponentUpdate == "function"
				? e.shouldComponentUpdate(s, m, x)
				: t.prototype && t.prototype.isPureReactComponent
				? !Ws(a, s) || !Ws(d, m)
				: !0
		);
	}
	function yy(e, t, a, s) {
		(e = t.state),
			typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, s),
			typeof t.UNSAFE_componentWillReceiveProps == "function" &&
				t.UNSAFE_componentWillReceiveProps(a, s),
			t.state !== e && _d.enqueueReplaceState(t, t.state, null);
	}
	function ii(e, t) {
		var a = t;
		if ("ref" in t) {
			a = {};
			for (var s in t) s !== "ref" && (a[s] = t[s]);
		}
		if ((e = e.defaultProps)) {
			a === t && (a = g({}, a));
			for (var d in e) a[d] === void 0 && (a[d] = e[d]);
		}
		return a;
	}
	function by(e) {
		vu(e);
	}
	function vy(e) {
		console.error(e);
	}
	function Sy(e) {
		vu(e);
	}
	function Vu(e, t) {
		try {
			var a = e.onUncaughtError;
			a(t.value, { componentStack: t.stack });
		} catch (s) {
			setTimeout(function () {
				throw s;
			});
		}
	}
	function xy(e, t, a) {
		try {
			var s = e.onCaughtError;
			s(a.value, {
				componentStack: a.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null,
			});
		} catch (d) {
			setTimeout(function () {
				throw d;
			});
		}
	}
	function Dd(e, t, a) {
		return (
			(a = da(a)),
			(a.tag = 3),
			(a.payload = { element: null }),
			(a.callback = function () {
				Vu(e, t);
			}),
			a
		);
	}
	function wy(e) {
		return (e = da(e)), (e.tag = 3), e;
	}
	function Ey(e, t, a, s) {
		var d = a.type.getDerivedStateFromError;
		if (typeof d == "function") {
			var m = s.value;
			(e.payload = function () {
				return d(m);
			}),
				(e.callback = function () {
					xy(t, a, s);
				});
		}
		var x = a.stateNode;
		x !== null &&
			typeof x.componentDidCatch == "function" &&
			(e.callback = function () {
				xy(t, a, s),
					typeof d != "function" &&
						(va === null ? (va = new Set([this])) : va.add(this));
				var A = s.stack;
				this.componentDidCatch(s.value, { componentStack: A !== null ? A : "" });
			});
	}
	function jw(e, t, a, s, d) {
		if (
			((a.flags |= 32768), s !== null && typeof s == "object" && typeof s.then == "function")
		) {
			if (((t = a.alternate), t !== null && Gi(t, a, d, !0), (a = ur.current), a !== null)) {
				switch (a.tag) {
					case 31:
					case 13:
						return (
							_r === null ? ec() : a.alternate === null && on === 0 && (on = 3),
							(a.flags &= -257),
							(a.flags |= 65536),
							(a.lanes = d),
							s === Mu
								? (a.flags |= 16384)
								: ((t = a.updateQueue),
								  t === null ? (a.updateQueue = new Set([s])) : t.add(s),
								  rh(e, s, d)),
							!1
						);
					case 22:
						return (
							(a.flags |= 65536),
							s === Mu
								? (a.flags |= 16384)
								: ((t = a.updateQueue),
								  t === null
										? ((t = {
												transitions: null,
												markerInstances: null,
												retryQueue: new Set([s]),
										  }),
										  (a.updateQueue = t))
										: ((a = t.retryQueue),
										  a === null ? (t.retryQueue = new Set([s])) : a.add(s)),
								  rh(e, s, d)),
							!1
						);
				}
				throw Error(i(435, a.tag));
			}
			return rh(e, s, d), ec(), !1;
		}
		if (vt)
			return (
				(t = ur.current),
				t !== null
					? ((t.flags & 65536) === 0 && (t.flags |= 256),
					  (t.flags |= 65536),
					  (t.lanes = d),
					  s !== Jf && ((e = Error(i(422), { cause: s })), tl(Or(e, a))))
					: (s !== Jf && ((t = Error(i(423), { cause: s })), tl(Or(t, a))),
					  (e = e.current.alternate),
					  (e.flags |= 65536),
					  (d &= -d),
					  (e.lanes |= d),
					  (s = Or(s, a)),
					  (d = Dd(e.stateNode, s, d)),
					  ld(e, d),
					  on !== 4 && (on = 2)),
				!1
			);
		var m = Error(i(520), { cause: s });
		if (
			((m = Or(m, a)),
			Sl === null ? (Sl = [m]) : Sl.push(m),
			on !== 4 && (on = 2),
			t === null)
		)
			return !0;
		(s = Or(s, a)), (a = t);
		do {
			switch (a.tag) {
				case 3:
					return (
						(a.flags |= 65536),
						(e = d & -d),
						(a.lanes |= e),
						(e = Dd(a.stateNode, s, e)),
						ld(a, e),
						!1
					);
				case 1:
					if (
						((t = a.type),
						(m = a.stateNode),
						(a.flags & 128) === 0 &&
							(typeof t.getDerivedStateFromError == "function" ||
								(m !== null &&
									typeof m.componentDidCatch == "function" &&
									(va === null || !va.has(m)))))
					)
						return (
							(a.flags |= 65536),
							(d &= -d),
							(a.lanes |= d),
							(d = wy(d)),
							Ey(d, e, a, s),
							ld(a, d),
							!1
						);
			}
			a = a.return;
		} while (a !== null);
		return !1;
	}
	var Nd = Error(i(461)),
		yn = !1;
	function Nn(e, t, a, s) {
		t.child = e === null ? Og(t, null, a, s) : oi(t, e.child, a, s);
	}
	function Ry(e, t, a, s, d) {
		a = a.render;
		var m = t.ref;
		if ("ref" in s) {
			var x = {};
			for (var A in s) A !== "ref" && (x[A] = s[A]);
		} else x = s;
		return (
			ei(t),
			(s = pd(e, t, a, x, m, d)),
			(A = md()),
			e !== null && !yn
				? (gd(e, t, d), No(e, t, d))
				: (vt && A && Qf(t), (t.flags |= 1), Nn(e, t, s, d), t.child)
		);
	}
	function Ty(e, t, a, s, d) {
		if (e === null) {
			var m = a.type;
			return typeof m == "function" &&
				!Ff(m) &&
				m.defaultProps === void 0 &&
				a.compare === null
				? ((t.tag = 15), (t.type = m), Cy(e, t, m, s, d))
				: ((e = Eu(a.type, null, s, t, t.mode, d)),
				  (e.ref = t.ref),
				  (e.return = t),
				  (t.child = e));
		}
		if (((m = e.child), !Pd(e, d))) {
			var x = m.memoizedProps;
			if (((a = a.compare), (a = a !== null ? a : Ws), a(x, s) && e.ref === t.ref))
				return No(e, t, d);
		}
		return (t.flags |= 1), (e = Oo(m, s)), (e.ref = t.ref), (e.return = t), (t.child = e);
	}
	function Cy(e, t, a, s, d) {
		if (e !== null) {
			var m = e.memoizedProps;
			if (Ws(m, s) && e.ref === t.ref)
				if (((yn = !1), (t.pendingProps = s = m), Pd(e, d)))
					(e.flags & 131072) !== 0 && (yn = !0);
				else return (t.lanes = e.lanes), No(e, t, d);
		}
		return Ld(e, t, a, s, d);
	}
	function Oy(e, t, a, s) {
		var d = s.children,
			m = e !== null ? e.memoizedState : null;
		if (
			(e === null &&
				t.stateNode === null &&
				(t.stateNode = {
					_visibility: 1,
					_pendingMarkers: null,
					_retryCache: null,
					_transitions: null,
				}),
			s.mode === "hidden")
		) {
			if ((t.flags & 128) !== 0) {
				if (((m = m !== null ? m.baseLanes | a : a), e !== null)) {
					for (s = t.child = e.child, d = 0; s !== null; )
						(d = d | s.lanes | s.childLanes), (s = s.sibling);
					s = d & ~m;
				} else (s = 0), (t.child = null);
				return Ay(e, t, m, a, s);
			}
			if ((a & 536870912) !== 0)
				(t.memoizedState = { baseLanes: 0, cachePool: null }),
					e !== null && Ou(t, m !== null ? m.cachePool : null),
					m !== null ? kg(t, m) : cd(),
					_g(t);
			else
				return (s = t.lanes = 536870912), Ay(e, t, m !== null ? m.baseLanes | a : a, a, s);
		} else
			m !== null
				? (Ou(t, m.cachePool), kg(t, m), ma(), (t.memoizedState = null))
				: (e !== null && Ou(t, null), cd(), ma());
		return Nn(e, t, d, a), t.child;
	}
	function hl(e, t) {
		return (
			(e !== null && e.tag === 22) ||
				t.stateNode !== null ||
				(t.stateNode = {
					_visibility: 1,
					_pendingMarkers: null,
					_retryCache: null,
					_transitions: null,
				}),
			t.sibling
		);
	}
	function Ay(e, t, a, s, d) {
		var m = od();
		return (
			(m = m === null ? null : { parent: mn._currentValue, pool: m }),
			(t.memoizedState = { baseLanes: a, cachePool: m }),
			e !== null && Ou(t, null),
			cd(),
			_g(t),
			e !== null && Gi(e, t, s, !0),
			(t.childLanes = d),
			null
		);
	}
	function Yu(e, t) {
		return (
			(t = Gu({ mode: t.mode, children: t.children }, e.mode)),
			(t.ref = e.ref),
			(e.child = t),
			(t.return = e),
			t
		);
	}
	function My(e, t, a) {
		return (
			oi(t, e.child, null, a),
			(e = Yu(t, t.pendingProps)),
			(e.flags |= 2),
			cr(t),
			(t.memoizedState = null),
			e
		);
	}
	function Bw(e, t, a) {
		var s = t.pendingProps,
			d = (t.flags & 128) !== 0;
		if (((t.flags &= -129), e === null)) {
			if (vt) {
				if (s.mode === "hidden") return (e = Yu(t, s)), (t.lanes = 536870912), hl(null, e);
				if (
					(dd(t),
					(e = Qt)
						? ((e = P0(e, kr)),
						  (e = e !== null && e.data === "&" ? e : null),
						  e !== null &&
								((t.memoizedState = {
									dehydrated: e,
									treeContext: sa !== null ? { id: oo, overflow: ao } : null,
									retryLane: 536870912,
									hydrationErrors: null,
								}),
								(a = dg(e)),
								(a.return = t),
								(t.child = a),
								(_n = t),
								(Qt = null)))
						: (e = null),
					e === null)
				)
					throw ua(t);
				return (t.lanes = 536870912), null;
			}
			return Yu(t, s);
		}
		var m = e.memoizedState;
		if (m !== null) {
			var x = m.dehydrated;
			if ((dd(t), d))
				if (t.flags & 256) (t.flags &= -257), (t = My(e, t, a));
				else if (t.memoizedState !== null)
					(t.child = e.child), (t.flags |= 128), (t = null);
				else throw Error(i(558));
			else if ((yn || Gi(e, t, a, !1), (d = (a & e.childLanes) !== 0), yn || d)) {
				if (((s = Vt), s !== null && ((x = xn(s, a)), x !== 0 && x !== m.retryLane)))
					throw ((m.retryLane = x), Za(e, x), tr(s, e, x), Nd);
				ec(), (t = My(e, t, a));
			} else
				(e = m.treeContext),
					(Qt = Dr(x.nextSibling)),
					(_n = t),
					(vt = !0),
					(la = null),
					(kr = !1),
					e !== null && mg(t, e),
					(t = Yu(t, s)),
					(t.flags |= 4096);
			return t;
		}
		return (
			(e = Oo(e.child, { mode: s.mode, children: s.children })),
			(e.ref = t.ref),
			(t.child = e),
			(e.return = t),
			e
		);
	}
	function Iu(e, t) {
		var a = t.ref;
		if (a === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof a != "function" && typeof a != "object") throw Error(i(284));
			(e === null || e.ref !== a) && (t.flags |= 4194816);
		}
	}
	function Ld(e, t, a, s, d) {
		return (
			ei(t),
			(a = pd(e, t, a, s, void 0, d)),
			(s = md()),
			e !== null && !yn
				? (gd(e, t, d), No(e, t, d))
				: (vt && s && Qf(t), (t.flags |= 1), Nn(e, t, a, d), t.child)
		);
	}
	function ky(e, t, a, s, d, m) {
		return (
			ei(t),
			(t.updateQueue = null),
			(a = Ng(t, s, a, d)),
			Dg(e),
			(s = md()),
			e !== null && !yn
				? (gd(e, t, m), No(e, t, m))
				: (vt && s && Qf(t), (t.flags |= 1), Nn(e, t, a, m), t.child)
		);
	}
	function _y(e, t, a, s, d) {
		if ((ei(t), t.stateNode === null)) {
			var m = Pi,
				x = a.contextType;
			typeof x == "object" && x !== null && (m = Dn(x)),
				(m = new a(s, m)),
				(t.memoizedState = m.state !== null && m.state !== void 0 ? m.state : null),
				(m.updater = _d),
				(t.stateNode = m),
				(m._reactInternals = t),
				(m = t.stateNode),
				(m.props = s),
				(m.state = t.memoizedState),
				(m.refs = {}),
				id(t),
				(x = a.contextType),
				(m.context = typeof x == "object" && x !== null ? Dn(x) : Pi),
				(m.state = t.memoizedState),
				(x = a.getDerivedStateFromProps),
				typeof x == "function" && (kd(t, a, x, s), (m.state = t.memoizedState)),
				typeof a.getDerivedStateFromProps == "function" ||
					typeof m.getSnapshotBeforeUpdate == "function" ||
					(typeof m.UNSAFE_componentWillMount != "function" &&
						typeof m.componentWillMount != "function") ||
					((x = m.state),
					typeof m.componentWillMount == "function" && m.componentWillMount(),
					typeof m.UNSAFE_componentWillMount == "function" &&
						m.UNSAFE_componentWillMount(),
					x !== m.state && _d.enqueueReplaceState(m, m.state, null),
					ll(t, s, m, d),
					sl(),
					(m.state = t.memoizedState)),
				typeof m.componentDidMount == "function" && (t.flags |= 4194308),
				(s = !0);
		} else if (e === null) {
			m = t.stateNode;
			var A = t.memoizedProps,
				q = ii(a, A);
			m.props = q;
			var ne = m.context,
				he = a.contextType;
			(x = Pi), typeof he == "object" && he !== null && (x = Dn(he));
			var be = a.getDerivedStateFromProps;
			(he = typeof be == "function" || typeof m.getSnapshotBeforeUpdate == "function"),
				(A = t.pendingProps !== A),
				he ||
					(typeof m.UNSAFE_componentWillReceiveProps != "function" &&
						typeof m.componentWillReceiveProps != "function") ||
					((A || ne !== x) && yy(t, m, s, x)),
				(fa = !1);
			var ae = t.memoizedState;
			(m.state = ae),
				ll(t, s, m, d),
				sl(),
				(ne = t.memoizedState),
				A || ae !== ne || fa
					? (typeof be == "function" && (kd(t, a, be, s), (ne = t.memoizedState)),
					  (q = fa || gy(t, a, q, s, ae, ne, x))
							? (he ||
									(typeof m.UNSAFE_componentWillMount != "function" &&
										typeof m.componentWillMount != "function") ||
									(typeof m.componentWillMount == "function" &&
										m.componentWillMount(),
									typeof m.UNSAFE_componentWillMount == "function" &&
										m.UNSAFE_componentWillMount()),
							  typeof m.componentDidMount == "function" && (t.flags |= 4194308))
							: (typeof m.componentDidMount == "function" && (t.flags |= 4194308),
							  (t.memoizedProps = s),
							  (t.memoizedState = ne)),
					  (m.props = s),
					  (m.state = ne),
					  (m.context = x),
					  (s = q))
					: (typeof m.componentDidMount == "function" && (t.flags |= 4194308), (s = !1));
		} else {
			(m = t.stateNode),
				sd(e, t),
				(x = t.memoizedProps),
				(he = ii(a, x)),
				(m.props = he),
				(be = t.pendingProps),
				(ae = m.context),
				(ne = a.contextType),
				(q = Pi),
				typeof ne == "object" && ne !== null && (q = Dn(ne)),
				(A = a.getDerivedStateFromProps),
				(ne = typeof A == "function" || typeof m.getSnapshotBeforeUpdate == "function") ||
					(typeof m.UNSAFE_componentWillReceiveProps != "function" &&
						typeof m.componentWillReceiveProps != "function") ||
					((x !== be || ae !== q) && yy(t, m, s, q)),
				(fa = !1),
				(ae = t.memoizedState),
				(m.state = ae),
				ll(t, s, m, d),
				sl();
			var ue = t.memoizedState;
			x !== be ||
			ae !== ue ||
			fa ||
			(e !== null && e.dependencies !== null && Tu(e.dependencies))
				? (typeof A == "function" && (kd(t, a, A, s), (ue = t.memoizedState)),
				  (he =
						fa ||
						gy(t, a, he, s, ae, ue, q) ||
						(e !== null && e.dependencies !== null && Tu(e.dependencies)))
						? (ne ||
								(typeof m.UNSAFE_componentWillUpdate != "function" &&
									typeof m.componentWillUpdate != "function") ||
								(typeof m.componentWillUpdate == "function" &&
									m.componentWillUpdate(s, ue, q),
								typeof m.UNSAFE_componentWillUpdate == "function" &&
									m.UNSAFE_componentWillUpdate(s, ue, q)),
						  typeof m.componentDidUpdate == "function" && (t.flags |= 4),
						  typeof m.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
						: (typeof m.componentDidUpdate != "function" ||
								(x === e.memoizedProps && ae === e.memoizedState) ||
								(t.flags |= 4),
						  typeof m.getSnapshotBeforeUpdate != "function" ||
								(x === e.memoizedProps && ae === e.memoizedState) ||
								(t.flags |= 1024),
						  (t.memoizedProps = s),
						  (t.memoizedState = ue)),
				  (m.props = s),
				  (m.state = ue),
				  (m.context = q),
				  (s = he))
				: (typeof m.componentDidUpdate != "function" ||
						(x === e.memoizedProps && ae === e.memoizedState) ||
						(t.flags |= 4),
				  typeof m.getSnapshotBeforeUpdate != "function" ||
						(x === e.memoizedProps && ae === e.memoizedState) ||
						(t.flags |= 1024),
				  (s = !1));
		}
		return (
			(m = s),
			Iu(e, t),
			(s = (t.flags & 128) !== 0),
			m || s
				? ((m = t.stateNode),
				  (a = s && typeof a.getDerivedStateFromError != "function" ? null : m.render()),
				  (t.flags |= 1),
				  e !== null && s
						? ((t.child = oi(t, e.child, null, d)), (t.child = oi(t, null, a, d)))
						: Nn(e, t, a, d),
				  (t.memoizedState = m.state),
				  (e = t.child))
				: (e = No(e, t, d)),
			e
		);
	}
	function Dy(e, t, a, s) {
		return Wa(), (t.flags |= 256), Nn(e, t, a, s), t.child;
	}
	var zd = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
	function jd(e) {
		return { baseLanes: e, cachePool: xg() };
	}
	function Bd(e, t, a) {
		return (e = e !== null ? e.childLanes & ~a : 0), t && (e |= dr), e;
	}
	function Ny(e, t, a) {
		var s = t.pendingProps,
			d = !1,
			m = (t.flags & 128) !== 0,
			x;
		if (
			((x = m) || (x = e !== null && e.memoizedState === null ? !1 : (un.current & 2) !== 0),
			x && ((d = !0), (t.flags &= -129)),
			(x = (t.flags & 32) !== 0),
			(t.flags &= -33),
			e === null)
		) {
			if (vt) {
				if (
					(d ? pa(t) : ma(),
					(e = Qt)
						? ((e = P0(e, kr)),
						  (e = e !== null && e.data !== "&" ? e : null),
						  e !== null &&
								((t.memoizedState = {
									dehydrated: e,
									treeContext: sa !== null ? { id: oo, overflow: ao } : null,
									retryLane: 536870912,
									hydrationErrors: null,
								}),
								(a = dg(e)),
								(a.return = t),
								(t.child = a),
								(_n = t),
								(Qt = null)))
						: (e = null),
					e === null)
				)
					throw ua(t);
				return vh(e) ? (t.lanes = 32) : (t.lanes = 536870912), null;
			}
			var A = s.children;
			return (
				(s = s.fallback),
				d
					? (ma(),
					  (d = t.mode),
					  (A = Gu({ mode: "hidden", children: A }, d)),
					  (s = Ja(s, d, a, null)),
					  (A.return = t),
					  (s.return = t),
					  (A.sibling = s),
					  (t.child = A),
					  (s = t.child),
					  (s.memoizedState = jd(a)),
					  (s.childLanes = Bd(e, x, a)),
					  (t.memoizedState = zd),
					  hl(null, s))
					: (pa(t), Ud(t, A))
			);
		}
		var q = e.memoizedState;
		if (q !== null && ((A = q.dehydrated), A !== null)) {
			if (m)
				t.flags & 256
					? (pa(t), (t.flags &= -257), (t = Hd(e, t, a)))
					: t.memoizedState !== null
					? (ma(), (t.child = e.child), (t.flags |= 128), (t = null))
					: (ma(),
					  (A = s.fallback),
					  (d = t.mode),
					  (s = Gu({ mode: "visible", children: s.children }, d)),
					  (A = Ja(A, d, a, null)),
					  (A.flags |= 2),
					  (s.return = t),
					  (A.return = t),
					  (s.sibling = A),
					  (t.child = s),
					  oi(t, e.child, null, a),
					  (s = t.child),
					  (s.memoizedState = jd(a)),
					  (s.childLanes = Bd(e, x, a)),
					  (t.memoizedState = zd),
					  (t = hl(null, s)));
			else if ((pa(t), vh(A))) {
				if (((x = A.nextSibling && A.nextSibling.dataset), x)) var ne = x.dgst;
				(x = ne),
					(s = Error(i(419))),
					(s.stack = ""),
					(s.digest = x),
					tl({ value: s, source: null, stack: null }),
					(t = Hd(e, t, a));
			} else if ((yn || Gi(e, t, a, !1), (x = (a & e.childLanes) !== 0), yn || x)) {
				if (((x = Vt), x !== null && ((s = xn(x, a)), s !== 0 && s !== q.retryLane)))
					throw ((q.retryLane = s), Za(e, s), tr(x, e, s), Nd);
				bh(A) || ec(), (t = Hd(e, t, a));
			} else
				bh(A)
					? ((t.flags |= 192), (t.child = e.child), (t = null))
					: ((e = q.treeContext),
					  (Qt = Dr(A.nextSibling)),
					  (_n = t),
					  (vt = !0),
					  (la = null),
					  (kr = !1),
					  e !== null && mg(t, e),
					  (t = Ud(t, s.children)),
					  (t.flags |= 4096));
			return t;
		}
		return d
			? (ma(),
			  (A = s.fallback),
			  (d = t.mode),
			  (q = e.child),
			  (ne = q.sibling),
			  (s = Oo(q, { mode: "hidden", children: s.children })),
			  (s.subtreeFlags = q.subtreeFlags & 65011712),
			  ne !== null ? (A = Oo(ne, A)) : ((A = Ja(A, d, a, null)), (A.flags |= 2)),
			  (A.return = t),
			  (s.return = t),
			  (s.sibling = A),
			  (t.child = s),
			  hl(null, s),
			  (s = t.child),
			  (A = e.child.memoizedState),
			  A === null
					? (A = jd(a))
					: ((d = A.cachePool),
					  d !== null
							? ((q = mn._currentValue),
							  (d = d.parent !== q ? { parent: q, pool: q } : d))
							: (d = xg()),
					  (A = { baseLanes: A.baseLanes | a, cachePool: d })),
			  (s.memoizedState = A),
			  (s.childLanes = Bd(e, x, a)),
			  (t.memoizedState = zd),
			  hl(e.child, s))
			: (pa(t),
			  (a = e.child),
			  (e = a.sibling),
			  (a = Oo(a, { mode: "visible", children: s.children })),
			  (a.return = t),
			  (a.sibling = null),
			  e !== null &&
					((x = t.deletions),
					x === null ? ((t.deletions = [e]), (t.flags |= 16)) : x.push(e)),
			  (t.child = a),
			  (t.memoizedState = null),
			  a);
	}
	function Ud(e, t) {
		return (t = Gu({ mode: "visible", children: t }, e.mode)), (t.return = e), (e.child = t);
	}
	function Gu(e, t) {
		return (e = lr(22, e, null, t)), (e.lanes = 0), e;
	}
	function Hd(e, t, a) {
		return (
			oi(t, e.child, null, a),
			(e = Ud(t, t.pendingProps.children)),
			(e.flags |= 2),
			(t.memoizedState = null),
			e
		);
	}
	function Ly(e, t, a) {
		e.lanes |= t;
		var s = e.alternate;
		s !== null && (s.lanes |= t), ed(e.return, t, a);
	}
	function qd(e, t, a, s, d, m) {
		var x = e.memoizedState;
		x === null
			? (e.memoizedState = {
					isBackwards: t,
					rendering: null,
					renderingStartTime: 0,
					last: s,
					tail: a,
					tailMode: d,
					treeForkCount: m,
			  })
			: ((x.isBackwards = t),
			  (x.rendering = null),
			  (x.renderingStartTime = 0),
			  (x.last = s),
			  (x.tail = a),
			  (x.tailMode = d),
			  (x.treeForkCount = m));
	}
	function zy(e, t, a) {
		var s = t.pendingProps,
			d = s.revealOrder,
			m = s.tail;
		s = s.children;
		var x = un.current,
			A = (x & 2) !== 0;
		if (
			(A ? ((x = (x & 1) | 2), (t.flags |= 128)) : (x &= 1),
			ee(un, x),
			Nn(e, t, s, a),
			(s = vt ? el : 0),
			!A && e !== null && (e.flags & 128) !== 0)
		)
			e: for (e = t.child; e !== null; ) {
				if (e.tag === 13) e.memoizedState !== null && Ly(e, a, t);
				else if (e.tag === 19) Ly(e, a, t);
				else if (e.child !== null) {
					(e.child.return = e), (e = e.child);
					continue;
				}
				if (e === t) break e;
				for (; e.sibling === null; ) {
					if (e.return === null || e.return === t) break e;
					e = e.return;
				}
				(e.sibling.return = e.return), (e = e.sibling);
			}
		switch (d) {
			case "forwards":
				for (a = t.child, d = null; a !== null; )
					(e = a.alternate), e !== null && Nu(e) === null && (d = a), (a = a.sibling);
				(a = d),
					a === null
						? ((d = t.child), (t.child = null))
						: ((d = a.sibling), (a.sibling = null)),
					qd(t, !1, d, a, m, s);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (a = null, d = t.child, t.child = null; d !== null; ) {
					if (((e = d.alternate), e !== null && Nu(e) === null)) {
						t.child = d;
						break;
					}
					(e = d.sibling), (d.sibling = a), (a = d), (d = e);
				}
				qd(t, !0, a, null, m, s);
				break;
			case "together":
				qd(t, !1, null, null, void 0, s);
				break;
			default:
				t.memoizedState = null;
		}
		return t.child;
	}
	function No(e, t, a) {
		if (
			(e !== null && (t.dependencies = e.dependencies),
			(ba |= t.lanes),
			(a & t.childLanes) === 0)
		)
			if (e !== null) {
				if ((Gi(e, t, a, !1), (a & t.childLanes) === 0)) return null;
			} else return null;
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (
				e = t.child, a = Oo(e, e.pendingProps), t.child = a, a.return = t;
				e.sibling !== null;

			)
				(e = e.sibling), (a = a.sibling = Oo(e, e.pendingProps)), (a.return = t);
			a.sibling = null;
		}
		return t.child;
	}
	function Pd(e, t) {
		return (e.lanes & t) !== 0 ? !0 : ((e = e.dependencies), !!(e !== null && Tu(e)));
	}
	function Uw(e, t, a) {
		switch (t.tag) {
			case 3:
				je(t, t.stateNode.containerInfo), ca(t, mn, e.memoizedState.cache), Wa();
				break;
			case 27:
			case 5:
				Qe(t);
				break;
			case 4:
				je(t, t.stateNode.containerInfo);
				break;
			case 10:
				ca(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return (t.flags |= 128), dd(t), null;
				break;
			case 13:
				var s = t.memoizedState;
				if (s !== null)
					return s.dehydrated !== null
						? (pa(t), (t.flags |= 128), null)
						: (a & t.child.childLanes) !== 0
						? Ny(e, t, a)
						: (pa(t), (e = No(e, t, a)), e !== null ? e.sibling : null);
				pa(t);
				break;
			case 19:
				var d = (e.flags & 128) !== 0;
				if (
					((s = (a & t.childLanes) !== 0),
					s || (Gi(e, t, a, !1), (s = (a & t.childLanes) !== 0)),
					d)
				) {
					if (s) return zy(e, t, a);
					t.flags |= 128;
				}
				if (
					((d = t.memoizedState),
					d !== null && ((d.rendering = null), (d.tail = null), (d.lastEffect = null)),
					ee(un, un.current),
					s)
				)
					break;
				return null;
			case 22:
				return (t.lanes = 0), Oy(e, t, a, t.pendingProps);
			case 24:
				ca(t, mn, e.memoizedState.cache);
		}
		return No(e, t, a);
	}
	function jy(e, t, a) {
		if (e !== null)
			if (e.memoizedProps !== t.pendingProps) yn = !0;
			else {
				if (!Pd(e, a) && (t.flags & 128) === 0) return (yn = !1), Uw(e, t, a);
				yn = (e.flags & 131072) !== 0;
			}
		else (yn = !1), vt && (t.flags & 1048576) !== 0 && pg(t, el, t.index);
		switch (((t.lanes = 0), t.tag)) {
			case 16:
				e: {
					var s = t.pendingProps;
					if (((e = ni(t.elementType)), (t.type = e), typeof e == "function"))
						Ff(e)
							? ((s = ii(e, s)), (t.tag = 1), (t = _y(null, t, e, s, a)))
							: ((t.tag = 0), (t = Ld(null, t, e, s, a)));
					else {
						if (e != null) {
							var d = e.$$typeof;
							if (d === _) {
								(t.tag = 11), (t = Ry(null, t, e, s, a));
								break e;
							} else if (d === H) {
								(t.tag = 14), (t = Ty(null, t, e, s, a));
								break e;
							}
						}
						throw ((t = xe(e) || e), Error(i(306, t, "")));
					}
				}
				return t;
			case 0:
				return Ld(e, t, t.type, t.pendingProps, a);
			case 1:
				return (s = t.type), (d = ii(s, t.pendingProps)), _y(e, t, s, d, a);
			case 3:
				e: {
					if ((je(t, t.stateNode.containerInfo), e === null)) throw Error(i(387));
					s = t.pendingProps;
					var m = t.memoizedState;
					(d = m.element), sd(e, t), ll(t, s, null, a);
					var x = t.memoizedState;
					if (
						((s = x.cache),
						ca(t, mn, s),
						s !== m.cache && td(t, [mn], a, !0),
						sl(),
						(s = x.element),
						m.isDehydrated)
					)
						if (
							((m = { element: s, isDehydrated: !1, cache: x.cache }),
							(t.updateQueue.baseState = m),
							(t.memoizedState = m),
							t.flags & 256)
						) {
							t = Dy(e, t, s, a);
							break e;
						} else if (s !== d) {
							(d = Or(Error(i(424)), t)), tl(d), (t = Dy(e, t, s, a));
							break e;
						} else
							for (
								e = t.stateNode.containerInfo,
									e.nodeType === 9
										? (e = e.body)
										: (e = e.nodeName === "HTML" ? e.ownerDocument.body : e),
									Qt = Dr(e.firstChild),
									_n = t,
									vt = !0,
									la = null,
									kr = !0,
									a = Og(t, null, s, a),
									t.child = a;
								a;

							)
								(a.flags = (a.flags & -3) | 4096), (a = a.sibling);
					else {
						if ((Wa(), s === d)) {
							t = No(e, t, a);
							break e;
						}
						Nn(e, t, s, a);
					}
					t = t.child;
				}
				return t;
			case 26:
				return (
					Iu(e, t),
					e === null
						? (a = X0(t.type, null, t.pendingProps, null))
							? (t.memoizedState = a)
							: vt ||
							  ((a = t.type),
							  (e = t.pendingProps),
							  (s = sc(ve.current).createElement(a)),
							  (s[an] = t),
							  (s[sn] = e),
							  Ln(s, a, e),
							  tn(s),
							  (t.stateNode = s))
						: (t.memoizedState = X0(
								t.type,
								e.memoizedProps,
								t.pendingProps,
								e.memoizedState
						  )),
					null
				);
			case 27:
				return (
					Qe(t),
					e === null &&
						vt &&
						((s = t.stateNode = I0(t.type, t.pendingProps, ve.current)),
						(_n = t),
						(kr = !0),
						(d = Qt),
						Ea(t.type) ? ((Sh = d), (Qt = Dr(s.firstChild))) : (Qt = d)),
					Nn(e, t, t.pendingProps.children, a),
					Iu(e, t),
					e === null && (t.flags |= 4194304),
					t.child
				);
			case 5:
				return (
					e === null &&
						vt &&
						((d = s = Qt) &&
							((s = pE(s, t.type, t.pendingProps, kr)),
							s !== null
								? ((t.stateNode = s),
								  (_n = t),
								  (Qt = Dr(s.firstChild)),
								  (kr = !1),
								  (d = !0))
								: (d = !1)),
						d || ua(t)),
					Qe(t),
					(d = t.type),
					(m = t.pendingProps),
					(x = e !== null ? e.memoizedProps : null),
					(s = m.children),
					mh(d, m) ? (s = null) : x !== null && mh(d, x) && (t.flags |= 32),
					t.memoizedState !== null &&
						((d = pd(e, t, Mw, null, null, a)), (Al._currentValue = d)),
					Iu(e, t),
					Nn(e, t, s, a),
					t.child
				);
			case 6:
				return (
					e === null &&
						vt &&
						((e = a = Qt) &&
							((a = mE(a, t.pendingProps, kr)),
							a !== null
								? ((t.stateNode = a), (_n = t), (Qt = null), (e = !0))
								: (e = !1)),
						e || ua(t)),
					null
				);
			case 13:
				return Ny(e, t, a);
			case 4:
				return (
					je(t, t.stateNode.containerInfo),
					(s = t.pendingProps),
					e === null ? (t.child = oi(t, null, s, a)) : Nn(e, t, s, a),
					t.child
				);
			case 11:
				return Ry(e, t, t.type, t.pendingProps, a);
			case 7:
				return Nn(e, t, t.pendingProps, a), t.child;
			case 8:
				return Nn(e, t, t.pendingProps.children, a), t.child;
			case 12:
				return Nn(e, t, t.pendingProps.children, a), t.child;
			case 10:
				return (
					(s = t.pendingProps), ca(t, t.type, s.value), Nn(e, t, s.children, a), t.child
				);
			case 9:
				return (
					(d = t.type._context),
					(s = t.pendingProps.children),
					ei(t),
					(d = Dn(d)),
					(s = s(d)),
					(t.flags |= 1),
					Nn(e, t, s, a),
					t.child
				);
			case 14:
				return Ty(e, t, t.type, t.pendingProps, a);
			case 15:
				return Cy(e, t, t.type, t.pendingProps, a);
			case 19:
				return zy(e, t, a);
			case 31:
				return Bw(e, t, a);
			case 22:
				return Oy(e, t, a, t.pendingProps);
			case 24:
				return (
					ei(t),
					(s = Dn(mn)),
					e === null
						? ((d = od()),
						  d === null &&
								((d = Vt),
								(m = nd()),
								(d.pooledCache = m),
								m.refCount++,
								m !== null && (d.pooledCacheLanes |= a),
								(d = m)),
						  (t.memoizedState = { parent: s, cache: d }),
						  id(t),
						  ca(t, mn, d))
						: ((e.lanes & a) !== 0 && (sd(e, t), ll(t, null, null, a), sl()),
						  (d = e.memoizedState),
						  (m = t.memoizedState),
						  d.parent !== s
								? ((d = { parent: s, cache: s }),
								  (t.memoizedState = d),
								  t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = d),
								  ca(t, mn, s))
								: ((s = m.cache),
								  ca(t, mn, s),
								  s !== d.cache && td(t, [mn], a, !0))),
					Nn(e, t, t.pendingProps.children, a),
					t.child
				);
			case 29:
				throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function Lo(e) {
		e.flags |= 4;
	}
	function Vd(e, t, a, s, d) {
		if (((t = (e.mode & 32) !== 0) && (t = !1), t)) {
			if (((e.flags |= 16777216), (d & 335544128) === d))
				if (e.stateNode.complete) e.flags |= 8192;
				else if (u0()) e.flags |= 8192;
				else throw ((ri = Mu), ad);
		} else e.flags &= -16777217;
	}
	function By(e, t) {
		if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0) e.flags &= -16777217;
		else if (((e.flags |= 16777216), !W0(t)))
			if (u0()) e.flags |= 8192;
			else throw ((ri = Mu), ad);
	}
	function Fu(e, t) {
		t !== null && (e.flags |= 4),
			e.flags & 16384 && ((t = e.tag !== 22 ? Dt() : 536870912), (e.lanes |= t), (rs |= t));
	}
	function pl(e, t) {
		if (!vt)
			switch (e.tailMode) {
				case "hidden":
					t = e.tail;
					for (var a = null; t !== null; )
						t.alternate !== null && (a = t), (t = t.sibling);
					a === null ? (e.tail = null) : (a.sibling = null);
					break;
				case "collapsed":
					a = e.tail;
					for (var s = null; a !== null; )
						a.alternate !== null && (s = a), (a = a.sibling);
					s === null
						? t || e.tail === null
							? (e.tail = null)
							: (e.tail.sibling = null)
						: (s.sibling = null);
			}
	}
	function Zt(e) {
		var t = e.alternate !== null && e.alternate.child === e.child,
			a = 0,
			s = 0;
		if (t)
			for (var d = e.child; d !== null; )
				(a |= d.lanes | d.childLanes),
					(s |= d.subtreeFlags & 65011712),
					(s |= d.flags & 65011712),
					(d.return = e),
					(d = d.sibling);
		else
			for (d = e.child; d !== null; )
				(a |= d.lanes | d.childLanes),
					(s |= d.subtreeFlags),
					(s |= d.flags),
					(d.return = e),
					(d = d.sibling);
		return (e.subtreeFlags |= s), (e.childLanes = a), t;
	}
	function Hw(e, t, a) {
		var s = t.pendingProps;
		switch ((Zf(t), t.tag)) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14:
				return Zt(t), null;
			case 1:
				return Zt(t), null;
			case 3:
				return (
					(a = t.stateNode),
					(s = null),
					e !== null && (s = e.memoizedState.cache),
					t.memoizedState.cache !== s && (t.flags |= 2048),
					ko(mn),
					Ee(),
					a.pendingContext &&
						((a.context = a.pendingContext), (a.pendingContext = null)),
					(e === null || e.child === null) &&
						(Ii(t)
							? Lo(t)
							: e === null ||
							  (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
							  ((t.flags |= 1024), Wf())),
					Zt(t),
					null
				);
			case 26:
				var d = t.type,
					m = t.memoizedState;
				return (
					e === null
						? (Lo(t), m !== null ? (Zt(t), By(t, m)) : (Zt(t), Vd(t, d, null, s, a)))
						: m
						? m !== e.memoizedState
							? (Lo(t), Zt(t), By(t, m))
							: (Zt(t), (t.flags &= -16777217))
						: ((e = e.memoizedProps), e !== s && Lo(t), Zt(t), Vd(t, d, e, s, a)),
					null
				);
			case 27:
				if ((it(t), (a = ve.current), (d = t.type), e !== null && t.stateNode != null))
					e.memoizedProps !== s && Lo(t);
				else {
					if (!s) {
						if (t.stateNode === null) throw Error(i(166));
						return Zt(t), null;
					}
					(e = ie.current),
						Ii(t) ? gg(t) : ((e = I0(d, s, a)), (t.stateNode = e), Lo(t));
				}
				return Zt(t), null;
			case 5:
				if ((it(t), (d = t.type), e !== null && t.stateNode != null))
					e.memoizedProps !== s && Lo(t);
				else {
					if (!s) {
						if (t.stateNode === null) throw Error(i(166));
						return Zt(t), null;
					}
					if (((m = ie.current), Ii(t))) gg(t);
					else {
						var x = sc(ve.current);
						switch (m) {
							case 1:
								m = x.createElementNS("http://www.w3.org/2000/svg", d);
								break;
							case 2:
								m = x.createElementNS("http://www.w3.org/1998/Math/MathML", d);
								break;
							default:
								switch (d) {
									case "svg":
										m = x.createElementNS("http://www.w3.org/2000/svg", d);
										break;
									case "math":
										m = x.createElementNS(
											"http://www.w3.org/1998/Math/MathML",
											d
										);
										break;
									case "script":
										(m = x.createElement("div")),
											(m.innerHTML = "<script></script>"),
											(m = m.removeChild(m.firstChild));
										break;
									case "select":
										(m =
											typeof s.is == "string"
												? x.createElement("select", { is: s.is })
												: x.createElement("select")),
											s.multiple
												? (m.multiple = !0)
												: s.size && (m.size = s.size);
										break;
									default:
										m =
											typeof s.is == "string"
												? x.createElement(d, { is: s.is })
												: x.createElement(d);
								}
						}
						(m[an] = t), (m[sn] = s);
						e: for (x = t.child; x !== null; ) {
							if (x.tag === 5 || x.tag === 6) m.appendChild(x.stateNode);
							else if (x.tag !== 4 && x.tag !== 27 && x.child !== null) {
								(x.child.return = x), (x = x.child);
								continue;
							}
							if (x === t) break e;
							for (; x.sibling === null; ) {
								if (x.return === null || x.return === t) break e;
								x = x.return;
							}
							(x.sibling.return = x.return), (x = x.sibling);
						}
						t.stateNode = m;
						e: switch ((Ln(m, d, s), d)) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								s = !!s.autoFocus;
								break e;
							case "img":
								s = !0;
								break e;
							default:
								s = !1;
						}
						s && Lo(t);
					}
				}
				return (
					Zt(t),
					Vd(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, a),
					null
				);
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== s && Lo(t);
				else {
					if (typeof s != "string" && t.stateNode === null) throw Error(i(166));
					if (((e = ve.current), Ii(t))) {
						if (
							((e = t.stateNode),
							(a = t.memoizedProps),
							(s = null),
							(d = _n),
							d !== null)
						)
							switch (d.tag) {
								case 27:
								case 5:
									s = d.memoizedProps;
							}
						(e[an] = t),
							(e = !!(
								e.nodeValue === a ||
								(s !== null && s.suppressHydrationWarning === !0) ||
								N0(e.nodeValue, a)
							)),
							e || ua(t, !0);
					} else (e = sc(e).createTextNode(s)), (e[an] = t), (t.stateNode = e);
				}
				return Zt(t), null;
			case 31:
				if (((a = t.memoizedState), e === null || e.memoizedState !== null)) {
					if (((s = Ii(t)), a !== null)) {
						if (e === null) {
							if (!s) throw Error(i(318));
							if (
								((e = t.memoizedState), (e = e !== null ? e.dehydrated : null), !e)
							)
								throw Error(i(557));
							e[an] = t;
						} else
							Wa(),
								(t.flags & 128) === 0 && (t.memoizedState = null),
								(t.flags |= 4);
						Zt(t), (e = !1);
					} else
						(a = Wf()),
							e !== null &&
								e.memoizedState !== null &&
								(e.memoizedState.hydrationErrors = a),
							(e = !0);
					if (!e) return t.flags & 256 ? (cr(t), t) : (cr(t), null);
					if ((t.flags & 128) !== 0) throw Error(i(558));
				}
				return Zt(t), null;
			case 13:
				if (
					((s = t.memoizedState),
					e === null ||
						(e.memoizedState !== null && e.memoizedState.dehydrated !== null))
				) {
					if (((d = Ii(t)), s !== null && s.dehydrated !== null)) {
						if (e === null) {
							if (!d) throw Error(i(318));
							if (
								((d = t.memoizedState), (d = d !== null ? d.dehydrated : null), !d)
							)
								throw Error(i(317));
							d[an] = t;
						} else
							Wa(),
								(t.flags & 128) === 0 && (t.memoizedState = null),
								(t.flags |= 4);
						Zt(t), (d = !1);
					} else
						(d = Wf()),
							e !== null &&
								e.memoizedState !== null &&
								(e.memoizedState.hydrationErrors = d),
							(d = !0);
					if (!d) return t.flags & 256 ? (cr(t), t) : (cr(t), null);
				}
				return (
					cr(t),
					(t.flags & 128) !== 0
						? ((t.lanes = a), t)
						: ((a = s !== null),
						  (e = e !== null && e.memoizedState !== null),
						  a &&
								((s = t.child),
								(d = null),
								s.alternate !== null &&
									s.alternate.memoizedState !== null &&
									s.alternate.memoizedState.cachePool !== null &&
									(d = s.alternate.memoizedState.cachePool.pool),
								(m = null),
								s.memoizedState !== null &&
									s.memoizedState.cachePool !== null &&
									(m = s.memoizedState.cachePool.pool),
								m !== d && (s.flags |= 2048)),
						  a !== e && a && (t.child.flags |= 8192),
						  Fu(t, t.updateQueue),
						  Zt(t),
						  null)
				);
			case 4:
				return Ee(), e === null && ch(t.stateNode.containerInfo), Zt(t), null;
			case 10:
				return ko(t.type), Zt(t), null;
			case 19:
				if ((Z(un), (s = t.memoizedState), s === null)) return Zt(t), null;
				if (((d = (t.flags & 128) !== 0), (m = s.rendering), m === null))
					if (d) pl(s, !1);
					else {
						if (on !== 0 || (e !== null && (e.flags & 128) !== 0))
							for (e = t.child; e !== null; ) {
								if (((m = Nu(e)), m !== null)) {
									for (
										t.flags |= 128,
											pl(s, !1),
											e = m.updateQueue,
											t.updateQueue = e,
											Fu(t, e),
											t.subtreeFlags = 0,
											e = a,
											a = t.child;
										a !== null;

									)
										fg(a, e), (a = a.sibling);
									return (
										ee(un, (un.current & 1) | 2),
										vt && Ao(t, s.treeForkCount),
										t.child
									);
								}
								e = e.sibling;
							}
						s.tail !== null &&
							qe() > Ju &&
							((t.flags |= 128), (d = !0), pl(s, !1), (t.lanes = 4194304));
					}
				else {
					if (!d)
						if (((e = Nu(m)), e !== null)) {
							if (
								((t.flags |= 128),
								(d = !0),
								(e = e.updateQueue),
								(t.updateQueue = e),
								Fu(t, e),
								pl(s, !0),
								s.tail === null && s.tailMode === "hidden" && !m.alternate && !vt)
							)
								return Zt(t), null;
						} else
							2 * qe() - s.renderingStartTime > Ju &&
								a !== 536870912 &&
								((t.flags |= 128), (d = !0), pl(s, !1), (t.lanes = 4194304));
					s.isBackwards
						? ((m.sibling = t.child), (t.child = m))
						: ((e = s.last),
						  e !== null ? (e.sibling = m) : (t.child = m),
						  (s.last = m));
				}
				return s.tail !== null
					? ((e = s.tail),
					  (s.rendering = e),
					  (s.tail = e.sibling),
					  (s.renderingStartTime = qe()),
					  (e.sibling = null),
					  (a = un.current),
					  ee(un, d ? (a & 1) | 2 : a & 1),
					  vt && Ao(t, s.treeForkCount),
					  e)
					: (Zt(t), null);
			case 22:
			case 23:
				return (
					cr(t),
					fd(),
					(s = t.memoizedState !== null),
					e !== null
						? (e.memoizedState !== null) !== s && (t.flags |= 8192)
						: s && (t.flags |= 8192),
					s
						? (a & 536870912) !== 0 &&
						  (t.flags & 128) === 0 &&
						  (Zt(t), t.subtreeFlags & 6 && (t.flags |= 8192))
						: Zt(t),
					(a = t.updateQueue),
					a !== null && Fu(t, a.retryQueue),
					(a = null),
					e !== null &&
						e.memoizedState !== null &&
						e.memoizedState.cachePool !== null &&
						(a = e.memoizedState.cachePool.pool),
					(s = null),
					t.memoizedState !== null &&
						t.memoizedState.cachePool !== null &&
						(s = t.memoizedState.cachePool.pool),
					s !== a && (t.flags |= 2048),
					e !== null && Z(ti),
					null
				);
			case 24:
				return (
					(a = null),
					e !== null && (a = e.memoizedState.cache),
					t.memoizedState.cache !== a && (t.flags |= 2048),
					ko(mn),
					Zt(t),
					null
				);
			case 25:
				return null;
			case 30:
				return null;
		}
		throw Error(i(156, t.tag));
	}
	function qw(e, t) {
		switch ((Zf(t), t.tag)) {
			case 1:
				return (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null;
			case 3:
				return (
					ko(mn),
					Ee(),
					(e = t.flags),
					(e & 65536) !== 0 && (e & 128) === 0
						? ((t.flags = (e & -65537) | 128), t)
						: null
				);
			case 26:
			case 27:
			case 5:
				return it(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if ((cr(t), t.alternate === null)) throw Error(i(340));
					Wa();
				}
				return (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null;
			case 13:
				if ((cr(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
					if (t.alternate === null) throw Error(i(340));
					Wa();
				}
				return (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null;
			case 19:
				return Z(un), null;
			case 4:
				return Ee(), null;
			case 10:
				return ko(t.type), null;
			case 22:
			case 23:
				return (
					cr(t),
					fd(),
					e !== null && Z(ti),
					(e = t.flags),
					e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
				);
			case 24:
				return ko(mn), null;
			case 25:
				return null;
			default:
				return null;
		}
	}
	function Uy(e, t) {
		switch ((Zf(t), t.tag)) {
			case 3:
				ko(mn), Ee();
				break;
			case 26:
			case 27:
			case 5:
				it(t);
				break;
			case 4:
				Ee();
				break;
			case 31:
				t.memoizedState !== null && cr(t);
				break;
			case 13:
				cr(t);
				break;
			case 19:
				Z(un);
				break;
			case 10:
				ko(t.type);
				break;
			case 22:
			case 23:
				cr(t), fd(), e !== null && Z(ti);
				break;
			case 24:
				ko(mn);
		}
	}
	function ml(e, t) {
		try {
			var a = t.updateQueue,
				s = a !== null ? a.lastEffect : null;
			if (s !== null) {
				var d = s.next;
				a = d;
				do {
					if ((a.tag & e) === e) {
						s = void 0;
						var m = a.create,
							x = a.inst;
						(s = m()), (x.destroy = s);
					}
					a = a.next;
				} while (a !== d);
			}
		} catch (A) {
			zt(t, t.return, A);
		}
	}
	function ga(e, t, a) {
		try {
			var s = t.updateQueue,
				d = s !== null ? s.lastEffect : null;
			if (d !== null) {
				var m = d.next;
				s = m;
				do {
					if ((s.tag & e) === e) {
						var x = s.inst,
							A = x.destroy;
						if (A !== void 0) {
							(x.destroy = void 0), (d = t);
							var q = a,
								ne = A;
							try {
								ne();
							} catch (he) {
								zt(d, q, he);
							}
						}
					}
					s = s.next;
				} while (s !== m);
			}
		} catch (he) {
			zt(t, t.return, he);
		}
	}
	function Hy(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var a = e.stateNode;
			try {
				Mg(t, a);
			} catch (s) {
				zt(e, e.return, s);
			}
		}
	}
	function qy(e, t, a) {
		(a.props = ii(e.type, e.memoizedProps)), (a.state = e.memoizedState);
		try {
			a.componentWillUnmount();
		} catch (s) {
			zt(e, t, s);
		}
	}
	function gl(e, t) {
		try {
			var a = e.ref;
			if (a !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var s = e.stateNode;
						break;
					case 30:
						s = e.stateNode;
						break;
					default:
						s = e.stateNode;
				}
				typeof a == "function" ? (e.refCleanup = a(s)) : (a.current = s);
			}
		} catch (d) {
			zt(e, t, d);
		}
	}
	function io(e, t) {
		var a = e.ref,
			s = e.refCleanup;
		if (a !== null)
			if (typeof s == "function")
				try {
					s();
				} catch (d) {
					zt(e, t, d);
				} finally {
					(e.refCleanup = null), (e = e.alternate), e != null && (e.refCleanup = null);
				}
			else if (typeof a == "function")
				try {
					a(null);
				} catch (d) {
					zt(e, t, d);
				}
			else a.current = null;
	}
	function Py(e) {
		var t = e.type,
			a = e.memoizedProps,
			s = e.stateNode;
		try {
			e: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					a.autoFocus && s.focus();
					break e;
				case "img":
					a.src ? (s.src = a.src) : a.srcSet && (s.srcset = a.srcSet);
			}
		} catch (d) {
			zt(e, e.return, d);
		}
	}
	function Yd(e, t, a) {
		try {
			var s = e.stateNode;
			lE(s, e.type, a, t), (s[sn] = t);
		} catch (d) {
			zt(e, e.return, d);
		}
	}
	function Vy(e) {
		return (
			e.tag === 5 ||
			e.tag === 3 ||
			e.tag === 26 ||
			(e.tag === 27 && Ea(e.type)) ||
			e.tag === 4
		);
	}
	function Id(e) {
		e: for (;;) {
			for (; e.sibling === null; ) {
				if (e.return === null || Vy(e.return)) return null;
				e = e.return;
			}
			for (
				e.sibling.return = e.return, e = e.sibling;
				e.tag !== 5 && e.tag !== 6 && e.tag !== 18;

			) {
				if ((e.tag === 27 && Ea(e.type)) || e.flags & 2 || e.child === null || e.tag === 4)
					continue e;
				(e.child.return = e), (e = e.child);
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Gd(e, t, a) {
		var s = e.tag;
		if (s === 5 || s === 6)
			(e = e.stateNode),
				t
					? (a.nodeType === 9
							? a.body
							: a.nodeName === "HTML"
							? a.ownerDocument.body
							: a
					  ).insertBefore(e, t)
					: ((t =
							a.nodeType === 9
								? a.body
								: a.nodeName === "HTML"
								? a.ownerDocument.body
								: a),
					  t.appendChild(e),
					  (a = a._reactRootContainer),
					  a != null || t.onclick !== null || (t.onclick = Sr));
		else if (
			s !== 4 &&
			(s === 27 && Ea(e.type) && ((a = e.stateNode), (t = null)), (e = e.child), e !== null)
		)
			for (Gd(e, t, a), e = e.sibling; e !== null; ) Gd(e, t, a), (e = e.sibling);
	}
	function Xu(e, t, a) {
		var s = e.tag;
		if (s === 5 || s === 6) (e = e.stateNode), t ? a.insertBefore(e, t) : a.appendChild(e);
		else if (
			s !== 4 &&
			(s === 27 && Ea(e.type) && (a = e.stateNode), (e = e.child), e !== null)
		)
			for (Xu(e, t, a), e = e.sibling; e !== null; ) Xu(e, t, a), (e = e.sibling);
	}
	function Yy(e) {
		var t = e.stateNode,
			a = e.memoizedProps;
		try {
			for (var s = e.type, d = t.attributes; d.length; ) t.removeAttributeNode(d[0]);
			Ln(t, s, a), (t[an] = e), (t[sn] = a);
		} catch (m) {
			zt(e, e.return, m);
		}
	}
	var zo = !1,
		bn = !1,
		Fd = !1,
		Iy = typeof WeakSet == "function" ? WeakSet : Set,
		Mn = null;
	function Pw(e, t) {
		if (((e = e.containerInfo), (hh = pc), (e = ng(e)), Hf(e))) {
			if ("selectionStart" in e) var a = { start: e.selectionStart, end: e.selectionEnd };
			else
				e: {
					a = ((a = e.ownerDocument) && a.defaultView) || window;
					var s = a.getSelection && a.getSelection();
					if (s && s.rangeCount !== 0) {
						a = s.anchorNode;
						var d = s.anchorOffset,
							m = s.focusNode;
						s = s.focusOffset;
						try {
							a.nodeType, m.nodeType;
						} catch (tt) {
							a = null;
							break e;
						}
						var x = 0,
							A = -1,
							q = -1,
							ne = 0,
							he = 0,
							be = e,
							ae = null;
						t: for (;;) {
							for (
								var ue;
								be !== a || (d !== 0 && be.nodeType !== 3) || (A = x + d),
									be !== m || (s !== 0 && be.nodeType !== 3) || (q = x + s),
									be.nodeType === 3 && (x += be.nodeValue.length),
									(ue = be.firstChild) !== null;

							)
								(ae = be), (be = ue);
							for (;;) {
								if (be === e) break t;
								if (
									(ae === a && ++ne === d && (A = x),
									ae === m && ++he === s && (q = x),
									(ue = be.nextSibling) !== null)
								)
									break;
								(be = ae), (ae = be.parentNode);
							}
							be = ue;
						}
						a = A === -1 || q === -1 ? null : { start: A, end: q };
					} else a = null;
				}
			a = a || { start: 0, end: 0 };
		} else a = null;
		for (ph = { focusedElem: e, selectionRange: a }, pc = !1, Mn = t; Mn !== null; )
			if (((t = Mn), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
				(e.return = t), (Mn = e);
			else
				for (; Mn !== null; ) {
					switch (((t = Mn), (m = t.alternate), (e = t.flags), t.tag)) {
						case 0:
							if (
								(e & 4) !== 0 &&
								((e = t.updateQueue),
								(e = e !== null ? e.events : null),
								e !== null)
							)
								for (a = 0; a < e.length; a++)
									(d = e[a]), (d.ref.impl = d.nextImpl);
							break;
						case 11:
						case 15:
							break;
						case 1:
							if ((e & 1024) !== 0 && m !== null) {
								(e = void 0),
									(a = t),
									(d = m.memoizedProps),
									(m = m.memoizedState),
									(s = a.stateNode);
								try {
									var Ve = ii(a.type, d);
									(e = s.getSnapshotBeforeUpdate(Ve, m)),
										(s.__reactInternalSnapshotBeforeUpdate = e);
								} catch (tt) {
									zt(a, a.return, tt);
								}
							}
							break;
						case 3:
							if ((e & 1024) !== 0) {
								if (((e = t.stateNode.containerInfo), (a = e.nodeType), a === 9))
									yh(e);
								else if (a === 1)
									switch (e.nodeName) {
										case "HEAD":
										case "HTML":
										case "BODY":
											yh(e);
											break;
										default:
											e.textContent = "";
									}
							}
							break;
						case 5:
						case 26:
						case 27:
						case 6:
						case 4:
						case 17:
							break;
						default:
							if ((e & 1024) !== 0) throw Error(i(163));
					}
					if (((e = t.sibling), e !== null)) {
						(e.return = t.return), (Mn = e);
						break;
					}
					Mn = t.return;
				}
	}
	function Gy(e, t, a) {
		var s = a.flags;
		switch (a.tag) {
			case 0:
			case 11:
			case 15:
				Bo(e, a), s & 4 && ml(5, a);
				break;
			case 1:
				if ((Bo(e, a), s & 4))
					if (((e = a.stateNode), t === null))
						try {
							e.componentDidMount();
						} catch (x) {
							zt(a, a.return, x);
						}
					else {
						var d = ii(a.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(d, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (x) {
							zt(a, a.return, x);
						}
					}
				s & 64 && Hy(a), s & 512 && gl(a, a.return);
				break;
			case 3:
				if ((Bo(e, a), s & 64 && ((e = a.updateQueue), e !== null))) {
					if (((t = null), a.child !== null))
						switch (a.child.tag) {
							case 27:
							case 5:
								t = a.child.stateNode;
								break;
							case 1:
								t = a.child.stateNode;
						}
					try {
						Mg(e, t);
					} catch (x) {
						zt(a, a.return, x);
					}
				}
				break;
			case 27:
				t === null && s & 4 && Yy(a);
			case 26:
			case 5:
				Bo(e, a), t === null && s & 4 && Py(a), s & 512 && gl(a, a.return);
				break;
			case 12:
				Bo(e, a);
				break;
			case 31:
				Bo(e, a), s & 4 && Ky(e, a);
				break;
			case 13:
				Bo(e, a),
					s & 4 && Qy(e, a),
					s & 64 &&
						((e = a.memoizedState),
						e !== null &&
							((e = e.dehydrated),
							e !== null && ((a = Zw.bind(null, a)), gE(e, a))));
				break;
			case 22:
				if (((s = a.memoizedState !== null || zo), !s)) {
					(t = (t !== null && t.memoizedState !== null) || bn), (d = zo);
					var m = bn;
					(zo = s),
						(bn = t) && !m ? Uo(e, a, (a.subtreeFlags & 8772) !== 0) : Bo(e, a),
						(zo = d),
						(bn = m);
				}
				break;
			case 30:
				break;
			default:
				Bo(e, a);
		}
	}
	function Fy(e) {
		var t = e.alternate;
		t !== null && ((e.alternate = null), Fy(t)),
			(e.child = null),
			(e.deletions = null),
			(e.sibling = null),
			e.tag === 5 && ((t = e.stateNode), t !== null && Hs(t)),
			(e.stateNode = null),
			(e.return = null),
			(e.dependencies = null),
			(e.memoizedProps = null),
			(e.memoizedState = null),
			(e.pendingProps = null),
			(e.stateNode = null),
			(e.updateQueue = null);
	}
	var Wt = null,
		Jn = !1;
	function jo(e, t, a) {
		for (a = a.child; a !== null; ) Xy(e, t, a), (a = a.sibling);
	}
	function Xy(e, t, a) {
		if (Ze && typeof Ze.onCommitFiberUnmount == "function")
			try {
				Ze.onCommitFiberUnmount(qn, a);
			} catch (m) {}
		switch (a.tag) {
			case 26:
				bn || io(a, t),
					jo(e, t, a),
					a.memoizedState
						? a.memoizedState.count--
						: a.stateNode && ((a = a.stateNode), a.parentNode.removeChild(a));
				break;
			case 27:
				bn || io(a, t);
				var s = Wt,
					d = Jn;
				Ea(a.type) && ((Wt = a.stateNode), (Jn = !1)),
					jo(e, t, a),
					Tl(a.stateNode),
					(Wt = s),
					(Jn = d);
				break;
			case 5:
				bn || io(a, t);
			case 6:
				if (
					((s = Wt), (d = Jn), (Wt = null), jo(e, t, a), (Wt = s), (Jn = d), Wt !== null)
				)
					if (Jn)
						try {
							(Wt.nodeType === 9
								? Wt.body
								: Wt.nodeName === "HTML"
								? Wt.ownerDocument.body
								: Wt
							).removeChild(a.stateNode);
						} catch (m) {
							zt(a, t, m);
						}
					else
						try {
							Wt.removeChild(a.stateNode);
						} catch (m) {
							zt(a, t, m);
						}
				break;
			case 18:
				Wt !== null &&
					(Jn
						? ((e = Wt),
						  H0(
								e.nodeType === 9
									? e.body
									: e.nodeName === "HTML"
									? e.ownerDocument.body
									: e,
								a.stateNode
						  ),
						  fs(e))
						: H0(Wt, a.stateNode));
				break;
			case 4:
				(s = Wt),
					(d = Jn),
					(Wt = a.stateNode.containerInfo),
					(Jn = !0),
					jo(e, t, a),
					(Wt = s),
					(Jn = d);
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				ga(2, a, t), bn || ga(4, a, t), jo(e, t, a);
				break;
			case 1:
				bn ||
					(io(a, t),
					(s = a.stateNode),
					typeof s.componentWillUnmount == "function" && qy(a, t, s)),
					jo(e, t, a);
				break;
			case 21:
				jo(e, t, a);
				break;
			case 22:
				(bn = (s = bn) || a.memoizedState !== null), jo(e, t, a), (bn = s);
				break;
			default:
				jo(e, t, a);
		}
	}
	function Ky(e, t) {
		if (
			t.memoizedState === null &&
			((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
		) {
			e = e.dehydrated;
			try {
				fs(e);
			} catch (a) {
				zt(t, t.return, a);
			}
		}
	}
	function Qy(e, t) {
		if (
			t.memoizedState === null &&
			((e = t.alternate),
			e !== null && ((e = e.memoizedState), e !== null && ((e = e.dehydrated), e !== null)))
		)
			try {
				fs(e);
			} catch (a) {
				zt(t, t.return, a);
			}
	}
	function Vw(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new Iy()), t;
			case 22:
				return (
					(e = e.stateNode),
					(t = e._retryCache),
					t === null && (t = e._retryCache = new Iy()),
					t
				);
			default:
				throw Error(i(435, e.tag));
		}
	}
	function Ku(e, t) {
		var a = Vw(e);
		t.forEach(function (s) {
			if (!a.has(s)) {
				a.add(s);
				var d = Jw.bind(null, e, s);
				s.then(d, d);
			}
		});
	}
	function Wn(e, t) {
		var a = t.deletions;
		if (a !== null)
			for (var s = 0; s < a.length; s++) {
				var d = a[s],
					m = e,
					x = t,
					A = x;
				e: for (; A !== null; ) {
					switch (A.tag) {
						case 27:
							if (Ea(A.type)) {
								(Wt = A.stateNode), (Jn = !1);
								break e;
							}
							break;
						case 5:
							(Wt = A.stateNode), (Jn = !1);
							break e;
						case 3:
						case 4:
							(Wt = A.stateNode.containerInfo), (Jn = !0);
							break e;
					}
					A = A.return;
				}
				if (Wt === null) throw Error(i(160));
				Xy(m, x, d),
					(Wt = null),
					(Jn = !1),
					(m = d.alternate),
					m !== null && (m.return = null),
					(d.return = null);
			}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null; ) Zy(t, e), (t = t.sibling);
	}
	var Pr = null;
	function Zy(e, t) {
		var a = e.alternate,
			s = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				Wn(t, e), $n(e), s & 4 && (ga(3, e, e.return), ml(3, e), ga(5, e, e.return));
				break;
			case 1:
				Wn(t, e),
					$n(e),
					s & 512 && (bn || a === null || io(a, a.return)),
					s & 64 &&
						zo &&
						((e = e.updateQueue),
						e !== null &&
							((s = e.callbacks),
							s !== null &&
								((a = e.shared.hiddenCallbacks),
								(e.shared.hiddenCallbacks = a === null ? s : a.concat(s)))));
				break;
			case 26:
				var d = Pr;
				if ((Wn(t, e), $n(e), s & 512 && (bn || a === null || io(a, a.return)), s & 4)) {
					var m = a !== null ? a.memoizedState : null;
					if (((s = e.memoizedState), a === null))
						if (s === null)
							if (e.stateNode === null) {
								e: {
									(s = e.type),
										(a = e.memoizedProps),
										(d = d.ownerDocument || d);
									t: switch (s) {
										case "title":
											(m = d.getElementsByTagName("title")[0]),
												(!m ||
													m[Wr] ||
													m[an] ||
													m.namespaceURI ===
														"http://www.w3.org/2000/svg" ||
													m.hasAttribute("itemprop")) &&
													((m = d.createElement(s)),
													d.head.insertBefore(
														m,
														d.querySelector("head > title")
													)),
												Ln(m, s, a),
												(m[an] = e),
												tn(m),
												(s = m);
											break e;
										case "link":
											var x = Z0("link", "href", d).get(s + (a.href || ""));
											if (x) {
												for (var A = 0; A < x.length; A++)
													if (
														((m = x[A]),
														m.getAttribute("href") ===
															(a.href == null || a.href === ""
																? null
																: a.href) &&
															m.getAttribute("rel") ===
																(a.rel == null ? null : a.rel) &&
															m.getAttribute("title") ===
																(a.title == null
																	? null
																	: a.title) &&
															m.getAttribute("crossorigin") ===
																(a.crossOrigin == null
																	? null
																	: a.crossOrigin))
													) {
														x.splice(A, 1);
														break t;
													}
											}
											(m = d.createElement(s)),
												Ln(m, s, a),
												d.head.appendChild(m);
											break;
										case "meta":
											if (
												(x = Z0("meta", "content", d).get(
													s + (a.content || "")
												))
											) {
												for (A = 0; A < x.length; A++)
													if (
														((m = x[A]),
														m.getAttribute("content") ===
															(a.content == null
																? null
																: "" + a.content) &&
															m.getAttribute("name") ===
																(a.name == null ? null : a.name) &&
															m.getAttribute("property") ===
																(a.property == null
																	? null
																	: a.property) &&
															m.getAttribute("http-equiv") ===
																(a.httpEquiv == null
																	? null
																	: a.httpEquiv) &&
															m.getAttribute("charset") ===
																(a.charSet == null
																	? null
																	: a.charSet))
													) {
														x.splice(A, 1);
														break t;
													}
											}
											(m = d.createElement(s)),
												Ln(m, s, a),
												d.head.appendChild(m);
											break;
										default:
											throw Error(i(468, s));
									}
									(m[an] = e), tn(m), (s = m);
								}
								e.stateNode = s;
							} else J0(d, e.type, e.stateNode);
						else e.stateNode = Q0(d, s, e.memoizedProps);
					else
						m !== s
							? (m === null
									? a.stateNode !== null &&
									  ((a = a.stateNode), a.parentNode.removeChild(a))
									: m.count--,
							  s === null ? J0(d, e.type, e.stateNode) : Q0(d, s, e.memoizedProps))
							: s === null &&
							  e.stateNode !== null &&
							  Yd(e, e.memoizedProps, a.memoizedProps);
				}
				break;
			case 27:
				Wn(t, e),
					$n(e),
					s & 512 && (bn || a === null || io(a, a.return)),
					a !== null && s & 4 && Yd(e, e.memoizedProps, a.memoizedProps);
				break;
			case 5:
				if (
					(Wn(t, e),
					$n(e),
					s & 512 && (bn || a === null || io(a, a.return)),
					e.flags & 32)
				) {
					d = e.stateNode;
					try {
						xo(d, "");
					} catch (Ve) {
						zt(e, e.return, Ve);
					}
				}
				s & 4 &&
					e.stateNode != null &&
					((d = e.memoizedProps), Yd(e, d, a !== null ? a.memoizedProps : d)),
					s & 1024 && (Fd = !0);
				break;
			case 6:
				if ((Wn(t, e), $n(e), s & 4)) {
					if (e.stateNode === null) throw Error(i(162));
					(s = e.memoizedProps), (a = e.stateNode);
					try {
						a.nodeValue = s;
					} catch (Ve) {
						zt(e, e.return, Ve);
					}
				}
				break;
			case 3:
				if (
					((cc = null),
					(d = Pr),
					(Pr = lc(t.containerInfo)),
					Wn(t, e),
					(Pr = d),
					$n(e),
					s & 4 && a !== null && a.memoizedState.isDehydrated)
				)
					try {
						fs(t.containerInfo);
					} catch (Ve) {
						zt(e, e.return, Ve);
					}
				Fd && ((Fd = !1), Jy(e));
				break;
			case 4:
				(s = Pr), (Pr = lc(e.stateNode.containerInfo)), Wn(t, e), $n(e), (Pr = s);
				break;
			case 12:
				Wn(t, e), $n(e);
				break;
			case 31:
				Wn(t, e),
					$n(e),
					s & 4 &&
						((s = e.updateQueue), s !== null && ((e.updateQueue = null), Ku(e, s)));
				break;
			case 13:
				Wn(t, e),
					$n(e),
					e.child.flags & 8192 &&
						(e.memoizedState !== null) != (a !== null && a.memoizedState !== null) &&
						(Zu = qe()),
					s & 4 &&
						((s = e.updateQueue), s !== null && ((e.updateQueue = null), Ku(e, s)));
				break;
			case 22:
				d = e.memoizedState !== null;
				var q = a !== null && a.memoizedState !== null,
					ne = zo,
					he = bn;
				if (
					((zo = ne || d),
					(bn = he || q),
					Wn(t, e),
					(bn = he),
					(zo = ne),
					$n(e),
					s & 8192)
				)
					e: for (
						t = e.stateNode,
							t._visibility = d ? t._visibility & -2 : t._visibility | 1,
							d && (a === null || q || zo || bn || si(e)),
							a = null,
							t = e;
						;

					) {
						if (t.tag === 5 || t.tag === 26) {
							if (a === null) {
								q = a = t;
								try {
									if (((m = q.stateNode), d))
										(x = m.style),
											typeof x.setProperty == "function"
												? x.setProperty("display", "none", "important")
												: (x.display = "none");
									else {
										A = q.stateNode;
										var be = q.memoizedProps.style,
											ae =
												be != null && be.hasOwnProperty("display")
													? be.display
													: null;
										A.style.display =
											ae == null || typeof ae == "boolean"
												? ""
												: ("" + ae).trim();
									}
								} catch (Ve) {
									zt(q, q.return, Ve);
								}
							}
						} else if (t.tag === 6) {
							if (a === null) {
								q = t;
								try {
									q.stateNode.nodeValue = d ? "" : q.memoizedProps;
								} catch (Ve) {
									zt(q, q.return, Ve);
								}
							}
						} else if (t.tag === 18) {
							if (a === null) {
								q = t;
								try {
									var ue = q.stateNode;
									d ? q0(ue, !0) : q0(q.stateNode, !1);
								} catch (Ve) {
									zt(q, q.return, Ve);
								}
							}
						} else if (
							((t.tag !== 22 && t.tag !== 23) ||
								t.memoizedState === null ||
								t === e) &&
							t.child !== null
						) {
							(t.child.return = t), (t = t.child);
							continue;
						}
						if (t === e) break e;
						for (; t.sibling === null; ) {
							if (t.return === null || t.return === e) break e;
							a === t && (a = null), (t = t.return);
						}
						a === t && (a = null), (t.sibling.return = t.return), (t = t.sibling);
					}
				s & 4 &&
					((s = e.updateQueue),
					s !== null &&
						((a = s.retryQueue), a !== null && ((s.retryQueue = null), Ku(e, a))));
				break;
			case 19:
				Wn(t, e),
					$n(e),
					s & 4 &&
						((s = e.updateQueue), s !== null && ((e.updateQueue = null), Ku(e, s)));
				break;
			case 30:
				break;
			case 21:
				break;
			default:
				Wn(t, e), $n(e);
		}
	}
	function $n(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var a, s = e.return; s !== null; ) {
					if (Vy(s)) {
						a = s;
						break;
					}
					s = s.return;
				}
				if (a == null) throw Error(i(160));
				switch (a.tag) {
					case 27:
						var d = a.stateNode,
							m = Id(e);
						Xu(e, m, d);
						break;
					case 5:
						var x = a.stateNode;
						a.flags & 32 && (xo(x, ""), (a.flags &= -33));
						var A = Id(e);
						Xu(e, A, x);
						break;
					case 3:
					case 4:
						var q = a.stateNode.containerInfo,
							ne = Id(e);
						Gd(e, ne, q);
						break;
					default:
						throw Error(i(161));
				}
			} catch (he) {
				zt(e, e.return, he);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function Jy(e) {
		if (e.subtreeFlags & 1024)
			for (e = e.child; e !== null; ) {
				var t = e;
				Jy(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), (e = e.sibling);
			}
	}
	function Bo(e, t) {
		if (t.subtreeFlags & 8772)
			for (t = t.child; t !== null; ) Gy(e, t.alternate, t), (t = t.sibling);
	}
	function si(e) {
		for (e = e.child; e !== null; ) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					ga(4, t, t.return), si(t);
					break;
				case 1:
					io(t, t.return);
					var a = t.stateNode;
					typeof a.componentWillUnmount == "function" && qy(t, t.return, a), si(t);
					break;
				case 27:
					Tl(t.stateNode);
				case 26:
				case 5:
					io(t, t.return), si(t);
					break;
				case 22:
					t.memoizedState === null && si(t);
					break;
				case 30:
					si(t);
					break;
				default:
					si(t);
			}
			e = e.sibling;
		}
	}
	function Uo(e, t, a) {
		for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
			var s = t.alternate,
				d = e,
				m = t,
				x = m.flags;
			switch (m.tag) {
				case 0:
				case 11:
				case 15:
					Uo(d, m, a), ml(4, m);
					break;
				case 1:
					if (
						(Uo(d, m, a),
						(s = m),
						(d = s.stateNode),
						typeof d.componentDidMount == "function")
					)
						try {
							d.componentDidMount();
						} catch (ne) {
							zt(s, s.return, ne);
						}
					if (((s = m), (d = s.updateQueue), d !== null)) {
						var A = s.stateNode;
						try {
							var q = d.shared.hiddenCallbacks;
							if (q !== null)
								for (d.shared.hiddenCallbacks = null, d = 0; d < q.length; d++)
									Ag(q[d], A);
						} catch (ne) {
							zt(s, s.return, ne);
						}
					}
					a && x & 64 && Hy(m), gl(m, m.return);
					break;
				case 27:
					Yy(m);
				case 26:
				case 5:
					Uo(d, m, a), a && s === null && x & 4 && Py(m), gl(m, m.return);
					break;
				case 12:
					Uo(d, m, a);
					break;
				case 31:
					Uo(d, m, a), a && x & 4 && Ky(d, m);
					break;
				case 13:
					Uo(d, m, a), a && x & 4 && Qy(d, m);
					break;
				case 22:
					m.memoizedState === null && Uo(d, m, a), gl(m, m.return);
					break;
				case 30:
					break;
				default:
					Uo(d, m, a);
			}
			t = t.sibling;
		}
	}
	function Xd(e, t) {
		var a = null;
		e !== null &&
			e.memoizedState !== null &&
			e.memoizedState.cachePool !== null &&
			(a = e.memoizedState.cachePool.pool),
			(e = null),
			t.memoizedState !== null &&
				t.memoizedState.cachePool !== null &&
				(e = t.memoizedState.cachePool.pool),
			e !== a && (e != null && e.refCount++, a != null && nl(a));
	}
	function Kd(e, t) {
		(e = null),
			t.alternate !== null && (e = t.alternate.memoizedState.cache),
			(t = t.memoizedState.cache),
			t !== e && (t.refCount++, e != null && nl(e));
	}
	function Vr(e, t, a, s) {
		if (t.subtreeFlags & 10256)
			for (t = t.child; t !== null; ) Wy(e, t, a, s), (t = t.sibling);
	}
	function Wy(e, t, a, s) {
		var d = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Vr(e, t, a, s), d & 2048 && ml(9, t);
				break;
			case 1:
				Vr(e, t, a, s);
				break;
			case 3:
				Vr(e, t, a, s),
					d & 2048 &&
						((e = null),
						t.alternate !== null && (e = t.alternate.memoizedState.cache),
						(t = t.memoizedState.cache),
						t !== e && (t.refCount++, e != null && nl(e)));
				break;
			case 12:
				if (d & 2048) {
					Vr(e, t, a, s), (e = t.stateNode);
					try {
						var m = t.memoizedProps,
							x = m.id,
							A = m.onPostCommit;
						typeof A == "function" &&
							A(
								x,
								t.alternate === null ? "mount" : "update",
								e.passiveEffectDuration,
								-0
							);
					} catch (q) {
						zt(t, t.return, q);
					}
				} else Vr(e, t, a, s);
				break;
			case 31:
				Vr(e, t, a, s);
				break;
			case 13:
				Vr(e, t, a, s);
				break;
			case 23:
				break;
			case 22:
				(m = t.stateNode),
					(x = t.alternate),
					t.memoizedState !== null
						? m._visibility & 2
							? Vr(e, t, a, s)
							: yl(e, t)
						: m._visibility & 2
						? Vr(e, t, a, s)
						: ((m._visibility |= 2),
						  es(e, t, a, s, (t.subtreeFlags & 10256) !== 0 || !1)),
					d & 2048 && Xd(x, t);
				break;
			case 24:
				Vr(e, t, a, s), d & 2048 && Kd(t.alternate, t);
				break;
			default:
				Vr(e, t, a, s);
		}
	}
	function es(e, t, a, s, d) {
		for (d = d && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
			var m = e,
				x = t,
				A = a,
				q = s,
				ne = x.flags;
			switch (x.tag) {
				case 0:
				case 11:
				case 15:
					es(m, x, A, q, d), ml(8, x);
					break;
				case 23:
					break;
				case 22:
					var he = x.stateNode;
					x.memoizedState !== null
						? he._visibility & 2
							? es(m, x, A, q, d)
							: yl(m, x)
						: ((he._visibility |= 2), es(m, x, A, q, d)),
						d && ne & 2048 && Xd(x.alternate, x);
					break;
				case 24:
					es(m, x, A, q, d), d && ne & 2048 && Kd(x.alternate, x);
					break;
				default:
					es(m, x, A, q, d);
			}
			t = t.sibling;
		}
	}
	function yl(e, t) {
		if (t.subtreeFlags & 10256)
			for (t = t.child; t !== null; ) {
				var a = e,
					s = t,
					d = s.flags;
				switch (s.tag) {
					case 22:
						yl(a, s), d & 2048 && Xd(s.alternate, s);
						break;
					case 24:
						yl(a, s), d & 2048 && Kd(s.alternate, s);
						break;
					default:
						yl(a, s);
				}
				t = t.sibling;
			}
	}
	var bl = 8192;
	function ts(e, t, a) {
		if (e.subtreeFlags & bl) for (e = e.child; e !== null; ) $y(e, t, a), (e = e.sibling);
	}
	function $y(e, t, a) {
		switch (e.tag) {
			case 26:
				ts(e, t, a),
					e.flags & bl &&
						e.memoizedState !== null &&
						AE(a, Pr, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				ts(e, t, a);
				break;
			case 3:
			case 4:
				var s = Pr;
				(Pr = lc(e.stateNode.containerInfo)), ts(e, t, a), (Pr = s);
				break;
			case 22:
				e.memoizedState === null &&
					((s = e.alternate),
					s !== null && s.memoizedState !== null
						? ((s = bl), (bl = 16777216), ts(e, t, a), (bl = s))
						: ts(e, t, a));
				break;
			default:
				ts(e, t, a);
		}
	}
	function e0(e) {
		var t = e.alternate;
		if (t !== null && ((e = t.child), e !== null)) {
			t.child = null;
			do (t = e.sibling), (e.sibling = null), (e = t);
			while (e !== null);
		}
	}
	function vl(e) {
		var t = e.deletions;
		if ((e.flags & 16) !== 0) {
			if (t !== null)
				for (var a = 0; a < t.length; a++) {
					var s = t[a];
					(Mn = s), n0(s, e);
				}
			e0(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) t0(e), (e = e.sibling);
	}
	function t0(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				vl(e), e.flags & 2048 && ga(9, e, e.return);
				break;
			case 3:
				vl(e);
				break;
			case 12:
				vl(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null &&
				t._visibility & 2 &&
				(e.return === null || e.return.tag !== 13)
					? ((t._visibility &= -3), Qu(e))
					: vl(e);
				break;
			default:
				vl(e);
		}
	}
	function Qu(e) {
		var t = e.deletions;
		if ((e.flags & 16) !== 0) {
			if (t !== null)
				for (var a = 0; a < t.length; a++) {
					var s = t[a];
					(Mn = s), n0(s, e);
				}
			e0(e);
		}
		for (e = e.child; e !== null; ) {
			switch (((t = e), t.tag)) {
				case 0:
				case 11:
				case 15:
					ga(8, t, t.return), Qu(t);
					break;
				case 22:
					(a = t.stateNode), a._visibility & 2 && ((a._visibility &= -3), Qu(t));
					break;
				default:
					Qu(t);
			}
			e = e.sibling;
		}
	}
	function n0(e, t) {
		for (; Mn !== null; ) {
			var a = Mn;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					ga(8, a, t);
					break;
				case 23:
				case 22:
					if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
						var s = a.memoizedState.cachePool.pool;
						s != null && s.refCount++;
					}
					break;
				case 24:
					nl(a.memoizedState.cache);
			}
			if (((s = a.child), s !== null)) (s.return = a), (Mn = s);
			else
				e: for (a = e; Mn !== null; ) {
					s = Mn;
					var d = s.sibling,
						m = s.return;
					if ((Fy(s), s === a)) {
						Mn = null;
						break e;
					}
					if (d !== null) {
						(d.return = m), (Mn = d);
						break e;
					}
					Mn = m;
				}
		}
	}
	var Yw = {
			getCacheForType: function (e) {
				var t = Dn(mn),
					a = t.data.get(e);
				return a === void 0 && ((a = e()), t.data.set(e, a)), a;
			},
			cacheSignal: function () {
				return Dn(mn).controller.signal;
			},
		},
		Iw = typeof WeakMap == "function" ? WeakMap : Map,
		Ot = 0,
		Vt = null,
		pt = null,
		yt = 0,
		Lt = 0,
		fr = null,
		ya = !1,
		ns = !1,
		Qd = !1,
		Ho = 0,
		on = 0,
		ba = 0,
		li = 0,
		Zd = 0,
		dr = 0,
		rs = 0,
		Sl = null,
		er = null,
		Jd = !1,
		Zu = 0,
		r0 = 0,
		Ju = 1 / 0,
		Wu = null,
		va = null,
		En = 0,
		Sa = null,
		os = null,
		qo = 0,
		Wd = 0,
		$d = null,
		o0 = null,
		xl = 0,
		eh = null;
	function hr() {
		return (Ot & 2) !== 0 && yt !== 0 ? yt & -yt : j.T !== null ? ih() : Ur();
	}
	function a0() {
		if (dr === 0)
			if ((yt & 536870912) === 0 || vt) {
				var e = en;
				(en <<= 1), (en & 3932160) === 0 && (en = 262144), (dr = e);
			} else dr = 536870912;
		return (e = ur.current), e !== null && (e.flags |= 32), dr;
	}
	function tr(e, t, a) {
		((e === Vt && (Lt === 2 || Lt === 9)) || e.cancelPendingCommit !== null) &&
			(as(e, 0), xa(e, yt, dr, !1)),
			Nt(e, a),
			((Ot & 2) === 0 || e !== Vt) &&
				(e === Vt && ((Ot & 2) === 0 && (li |= a), on === 4 && xa(e, yt, dr, !1)), so(e));
	}
	function i0(e, t, a) {
		if ((Ot & 6) !== 0) throw Error(i(327));
		var s = (!a && (t & 127) === 0 && (t & e.expiredLanes) === 0) || xt(e, t),
			d = s ? Xw(e, t) : nh(e, t, !0),
			m = s;
		do {
			if (d === 0) {
				ns && !s && xa(e, t, 0, !1);
				break;
			} else {
				if (((a = e.current.alternate), m && !Gw(a))) {
					(d = nh(e, t, !1)), (m = !1);
					continue;
				}
				if (d === 2) {
					if (((m = t), e.errorRecoveryDisabledLanes & m)) var x = 0;
					else
						(x = e.pendingLanes & -536870913),
							(x = x !== 0 ? x : x & 536870912 ? 536870912 : 0);
					if (x !== 0) {
						t = x;
						e: {
							var A = e;
							d = Sl;
							var q = A.current.memoizedState.isDehydrated;
							if ((q && (as(A, x).flags |= 256), (x = nh(A, x, !1)), x !== 2)) {
								if (Qd && !q) {
									(A.errorRecoveryDisabledLanes |= m), (li |= m), (d = 4);
									break e;
								}
								(m = er),
									(er = d),
									m !== null && (er === null ? (er = m) : er.push.apply(er, m));
							}
							d = x;
						}
						if (((m = !1), d !== 2)) continue;
					}
				}
				if (d === 1) {
					as(e, 0), xa(e, t, 0, !0);
					break;
				}
				e: {
					switch (((s = e), (m = d), m)) {
						case 0:
						case 1:
							throw Error(i(345));
						case 4:
							if ((t & 4194048) !== t) break;
						case 6:
							xa(s, t, dr, !ya);
							break e;
						case 2:
							er = null;
							break;
						case 3:
						case 5:
							break;
						default:
							throw Error(i(329));
					}
					if ((t & 62914560) === t && ((d = Zu + 300 - qe()), 10 < d)) {
						if ((xa(s, t, dr, !ya), Je(s, 0, !0) !== 0)) break e;
						(qo = t),
							(s.timeoutHandle = B0(
								s0.bind(
									null,
									s,
									a,
									er,
									Wu,
									Jd,
									t,
									dr,
									li,
									rs,
									ya,
									m,
									"Throttled",
									-0,
									0
								),
								d
							));
						break e;
					}
					s0(s, a, er, Wu, Jd, t, dr, li, rs, ya, m, null, -0, 0);
				}
			}
			break;
		} while (!0);
		so(e);
	}
	function s0(e, t, a, s, d, m, x, A, q, ne, he, be, ae, ue) {
		if (
			((e.timeoutHandle = -1),
			(be = t.subtreeFlags),
			be & 8192 || (be & 16785408) === 16785408)
		) {
			(be = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: Sr,
			}),
				$y(t, m, be);
			var Ve = (m & 62914560) === m ? Zu - qe() : (m & 4194048) === m ? r0 - qe() : 0;
			if (((Ve = ME(be, Ve)), Ve !== null)) {
				(qo = m),
					(e.cancelPendingCommit = Ve(
						m0.bind(null, e, t, m, a, s, d, x, A, q, he, be, null, ae, ue)
					)),
					xa(e, m, x, !ne);
				return;
			}
		}
		m0(e, t, m, a, s, d, x, A, q);
	}
	function Gw(e) {
		for (var t = e; ; ) {
			var a = t.tag;
			if (
				(a === 0 || a === 11 || a === 15) &&
				t.flags & 16384 &&
				((a = t.updateQueue), a !== null && ((a = a.stores), a !== null))
			)
				for (var s = 0; s < a.length; s++) {
					var d = a[s],
						m = d.getSnapshot;
					d = d.value;
					try {
						if (!sr(m(), d)) return !1;
					} catch (x) {
						return !1;
					}
				}
			if (((a = t.child), t.subtreeFlags & 16384 && a !== null)) (a.return = t), (t = a);
			else {
				if (t === e) break;
				for (; t.sibling === null; ) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				(t.sibling.return = t.return), (t = t.sibling);
			}
		}
		return !0;
	}
	function xa(e, t, a, s) {
		(t &= ~Zd),
			(t &= ~li),
			(e.suspendedLanes |= t),
			(e.pingedLanes &= ~t),
			s && (e.warmLanes |= t),
			(s = e.expirationTimes);
		for (var d = t; 0 < d; ) {
			var m = 31 - ht(d),
				x = 1 << m;
			(s[m] = -1), (d &= ~x);
		}
		a !== 0 && Br(e, a, t);
	}
	function $u() {
		return (Ot & 6) === 0 ? (wl(0), !1) : !0;
	}
	function th() {
		if (pt !== null) {
			if (Lt === 0) var e = pt.return;
			else (e = pt), (Mo = $a = null), yd(e), (Qi = null), (ol = 0), (e = pt);
			for (; e !== null; ) Uy(e.alternate, e), (e = e.return);
			pt = null;
		}
	}
	function as(e, t) {
		var a = e.timeoutHandle;
		a !== -1 && ((e.timeoutHandle = -1), fE(a)),
			(a = e.cancelPendingCommit),
			a !== null && ((e.cancelPendingCommit = null), a()),
			(qo = 0),
			th(),
			(Vt = e),
			(pt = a = Oo(e.current, null)),
			(yt = t),
			(Lt = 0),
			(fr = null),
			(ya = !1),
			(ns = xt(e, t)),
			(Qd = !1),
			(rs = dr = Zd = li = ba = on = 0),
			(er = Sl = null),
			(Jd = !1),
			(t & 8) !== 0 && (t |= t & 32);
		var s = e.entangledLanes;
		if (s !== 0)
			for (e = e.entanglements, s &= t; 0 < s; ) {
				var d = 31 - ht(s),
					m = 1 << d;
				(t |= e[d]), (s &= ~m);
			}
		return (Ho = t), Su(), a;
	}
	function l0(e, t) {
		(ut = null),
			(j.H = dl),
			t === Ki || t === Au
				? ((t = Rg()), (Lt = 3))
				: t === ad
				? ((t = Rg()), (Lt = 4))
				: (Lt =
						t === Nd
							? 8
							: t !== null && typeof t == "object" && typeof t.then == "function"
							? 6
							: 1),
			(fr = t),
			pt === null && ((on = 1), Vu(e, Or(t, e.current)));
	}
	function u0() {
		var e = ur.current;
		return e === null
			? !0
			: (yt & 4194048) === yt
			? _r === null
			: (yt & 62914560) === yt || (yt & 536870912) !== 0
			? e === _r
			: !1;
	}
	function c0() {
		var e = j.H;
		return (j.H = dl), e === null ? dl : e;
	}
	function f0() {
		var e = j.A;
		return (j.A = Yw), e;
	}
	function ec() {
		(on = 4),
			ya || ((yt & 4194048) !== yt && ur.current !== null) || (ns = !0),
			((ba & 134217727) === 0 && (li & 134217727) === 0) ||
				Vt === null ||
				xa(Vt, yt, dr, !1);
	}
	function nh(e, t, a) {
		var s = Ot;
		Ot |= 2;
		var d = c0(),
			m = f0();
		(Vt !== e || yt !== t) && ((Wu = null), as(e, t)), (t = !1);
		var x = on;
		e: do
			try {
				if (Lt !== 0 && pt !== null) {
					var A = pt,
						q = fr;
					switch (Lt) {
						case 8:
							th(), (x = 6);
							break e;
						case 3:
						case 2:
						case 9:
						case 6:
							ur.current === null && (t = !0);
							var ne = Lt;
							if (((Lt = 0), (fr = null), is(e, A, q, ne), a && ns)) {
								x = 0;
								break e;
							}
							break;
						default:
							(ne = Lt), (Lt = 0), (fr = null), is(e, A, q, ne);
					}
				}
				Fw(), (x = on);
				break;
			} catch (he) {
				l0(e, he);
			}
		while (!0);
		return (
			t && e.shellSuspendCounter++,
			(Mo = $a = null),
			(Ot = s),
			(j.H = d),
			(j.A = m),
			pt === null && ((Vt = null), (yt = 0), Su()),
			x
		);
	}
	function Fw() {
		for (; pt !== null; ) d0(pt);
	}
	function Xw(e, t) {
		var a = Ot;
		Ot |= 2;
		var s = c0(),
			d = f0();
		Vt !== e || yt !== t ? ((Wu = null), (Ju = qe() + 500), as(e, t)) : (ns = xt(e, t));
		e: do
			try {
				if (Lt !== 0 && pt !== null) {
					t = pt;
					var m = fr;
					t: switch (Lt) {
						case 1:
							(Lt = 0), (fr = null), is(e, t, m, 1);
							break;
						case 2:
						case 9:
							if (wg(m)) {
								(Lt = 0), (fr = null), h0(t);
								break;
							}
							(t = function () {
								(Lt !== 2 && Lt !== 9) || Vt !== e || (Lt = 7), so(e);
							}),
								m.then(t, t);
							break e;
						case 3:
							Lt = 7;
							break e;
						case 4:
							Lt = 5;
							break e;
						case 7:
							wg(m)
								? ((Lt = 0), (fr = null), h0(t))
								: ((Lt = 0), (fr = null), is(e, t, m, 7));
							break;
						case 5:
							var x = null;
							switch (pt.tag) {
								case 26:
									x = pt.memoizedState;
								case 5:
								case 27:
									var A = pt;
									if (x ? W0(x) : A.stateNode.complete) {
										(Lt = 0), (fr = null);
										var q = A.sibling;
										if (q !== null) pt = q;
										else {
											var ne = A.return;
											ne !== null ? ((pt = ne), tc(ne)) : (pt = null);
										}
										break t;
									}
							}
							(Lt = 0), (fr = null), is(e, t, m, 5);
							break;
						case 6:
							(Lt = 0), (fr = null), is(e, t, m, 6);
							break;
						case 8:
							th(), (on = 6);
							break e;
						default:
							throw Error(i(462));
					}
				}
				Kw();
				break;
			} catch (he) {
				l0(e, he);
			}
		while (!0);
		return (
			(Mo = $a = null),
			(j.H = s),
			(j.A = d),
			(Ot = a),
			pt !== null ? 0 : ((Vt = null), (yt = 0), Su(), on)
		);
	}
	function Kw() {
		for (; pt !== null && !Ue(); ) d0(pt);
	}
	function d0(e) {
		var t = jy(e.alternate, e, Ho);
		(e.memoizedProps = e.pendingProps), t === null ? tc(e) : (pt = t);
	}
	function h0(e) {
		var t = e,
			a = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = ky(a, t, t.pendingProps, t.type, void 0, yt);
				break;
			case 11:
				t = ky(a, t, t.pendingProps, t.type.render, t.ref, yt);
				break;
			case 5:
				yd(t);
			default:
				Uy(a, t), (t = pt = fg(t, Ho)), (t = jy(a, t, Ho));
		}
		(e.memoizedProps = e.pendingProps), t === null ? tc(e) : (pt = t);
	}
	function is(e, t, a, s) {
		(Mo = $a = null), yd(t), (Qi = null), (ol = 0);
		var d = t.return;
		try {
			if (jw(e, d, t, a, yt)) {
				(on = 1), Vu(e, Or(a, e.current)), (pt = null);
				return;
			}
		} catch (m) {
			if (d !== null) throw ((pt = d), m);
			(on = 1), Vu(e, Or(a, e.current)), (pt = null);
			return;
		}
		t.flags & 32768
			? (vt || s === 1
					? (e = !0)
					: ns || (yt & 536870912) !== 0
					? (e = !1)
					: ((ya = e = !0),
					  (s === 2 || s === 9 || s === 3 || s === 6) &&
							((s = ur.current), s !== null && s.tag === 13 && (s.flags |= 16384))),
			  p0(t, e))
			: tc(t);
	}
	function tc(e) {
		var t = e;
		do {
			if ((t.flags & 32768) !== 0) {
				p0(t, ya);
				return;
			}
			e = t.return;
			var a = Hw(t.alternate, t, Ho);
			if (a !== null) {
				pt = a;
				return;
			}
			if (((t = t.sibling), t !== null)) {
				pt = t;
				return;
			}
			pt = t = e;
		} while (t !== null);
		on === 0 && (on = 5);
	}
	function p0(e, t) {
		do {
			var a = qw(e.alternate, e);
			if (a !== null) {
				(a.flags &= 32767), (pt = a);
				return;
			}
			if (
				((a = e.return),
				a !== null && ((a.flags |= 32768), (a.subtreeFlags = 0), (a.deletions = null)),
				!t && ((e = e.sibling), e !== null))
			) {
				pt = e;
				return;
			}
			pt = e = a;
		} while (e !== null);
		(on = 6), (pt = null);
	}
	function m0(e, t, a, s, d, m, x, A, q) {
		e.cancelPendingCommit = null;
		do nc();
		while (En !== 0);
		if ((Ot & 6) !== 0) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			if (
				((m = t.lanes | t.childLanes),
				(m |= If),
				Cn(e, a, m, x, A, q),
				e === Vt && ((pt = Vt = null), (yt = 0)),
				(os = t),
				(Sa = e),
				(qo = a),
				(Wd = m),
				($d = d),
				(o0 = s),
				(t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
					? ((e.callbackNode = null),
					  (e.callbackPriority = 0),
					  Ww(st, function () {
							return S0(), null;
					  }))
					: ((e.callbackNode = null), (e.callbackPriority = 0)),
				(s = (t.flags & 13878) !== 0),
				(t.subtreeFlags & 13878) !== 0 || s)
			) {
				(s = j.T), (j.T = null), (d = I.p), (I.p = 2), (x = Ot), (Ot |= 4);
				try {
					Pw(e, t, a);
				} finally {
					(Ot = x), (I.p = d), (j.T = s);
				}
			}
			(En = 1), g0(), y0(), b0();
		}
	}
	function g0() {
		if (En === 1) {
			En = 0;
			var e = Sa,
				t = os,
				a = (t.flags & 13878) !== 0;
			if ((t.subtreeFlags & 13878) !== 0 || a) {
				(a = j.T), (j.T = null);
				var s = I.p;
				I.p = 2;
				var d = Ot;
				Ot |= 4;
				try {
					Zy(t, e);
					var m = ph,
						x = ng(e.containerInfo),
						A = m.focusedElem,
						q = m.selectionRange;
					if (
						x !== A &&
						A &&
						A.ownerDocument &&
						tg(A.ownerDocument.documentElement, A)
					) {
						if (q !== null && Hf(A)) {
							var ne = q.start,
								he = q.end;
							if ((he === void 0 && (he = ne), "selectionStart" in A))
								(A.selectionStart = ne),
									(A.selectionEnd = Math.min(he, A.value.length));
							else {
								var be = A.ownerDocument || document,
									ae = (be && be.defaultView) || window;
								if (ae.getSelection) {
									var ue = ae.getSelection(),
										Ve = A.textContent.length,
										tt = Math.min(q.start, Ve),
										qt = q.end === void 0 ? tt : Math.min(q.end, Ve);
									!ue.extend && tt > qt && ((x = qt), (qt = tt), (tt = x));
									var Q = eg(A, tt),
										G = eg(A, qt);
									if (
										Q &&
										G &&
										(ue.rangeCount !== 1 ||
											ue.anchorNode !== Q.node ||
											ue.anchorOffset !== Q.offset ||
											ue.focusNode !== G.node ||
											ue.focusOffset !== G.offset)
									) {
										var te = be.createRange();
										te.setStart(Q.node, Q.offset),
											ue.removeAllRanges(),
											tt > qt
												? (ue.addRange(te), ue.extend(G.node, G.offset))
												: (te.setEnd(G.node, G.offset), ue.addRange(te));
									}
								}
							}
						}
						for (be = [], ue = A; (ue = ue.parentNode); )
							ue.nodeType === 1 &&
								be.push({ element: ue, left: ue.scrollLeft, top: ue.scrollTop });
						for (
							typeof A.focus == "function" && A.focus(), A = 0;
							A < be.length;
							A++
						) {
							var ye = be[A];
							(ye.element.scrollLeft = ye.left), (ye.element.scrollTop = ye.top);
						}
					}
					(pc = !!hh), (ph = hh = null);
				} finally {
					(Ot = d), (I.p = s), (j.T = a);
				}
			}
			(e.current = t), (En = 2);
		}
	}
	function y0() {
		if (En === 2) {
			En = 0;
			var e = Sa,
				t = os,
				a = (t.flags & 8772) !== 0;
			if ((t.subtreeFlags & 8772) !== 0 || a) {
				(a = j.T), (j.T = null);
				var s = I.p;
				I.p = 2;
				var d = Ot;
				Ot |= 4;
				try {
					Gy(e, t.alternate, t);
				} finally {
					(Ot = d), (I.p = s), (j.T = a);
				}
			}
			En = 3;
		}
	}
	function b0() {
		if (En === 4 || En === 3) {
			(En = 0), Ye();
			var e = Sa,
				t = os,
				a = qo,
				s = o0;
			(t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
				? (En = 5)
				: ((En = 0), (os = Sa = null), v0(e, e.pendingLanes));
			var d = e.pendingLanes;
			if (
				(d === 0 && (va = null),
				Pn(a),
				(t = t.stateNode),
				Ze && typeof Ze.onCommitFiberRoot == "function")
			)
				try {
					Ze.onCommitFiberRoot(qn, t, void 0, (t.current.flags & 128) === 128);
				} catch (q) {}
			if (s !== null) {
				(t = j.T), (d = I.p), (I.p = 2), (j.T = null);
				try {
					for (var m = e.onRecoverableError, x = 0; x < s.length; x++) {
						var A = s[x];
						m(A.value, { componentStack: A.stack });
					}
				} finally {
					(j.T = t), (I.p = d);
				}
			}
			(qo & 3) !== 0 && nc(),
				so(e),
				(d = e.pendingLanes),
				(a & 261930) !== 0 && (d & 42) !== 0
					? e === eh
						? xl++
						: ((xl = 0), (eh = e))
					: (xl = 0),
				wl(0);
		}
	}
	function v0(e, t) {
		(e.pooledCacheLanes &= t) === 0 &&
			((t = e.pooledCache), t != null && ((e.pooledCache = null), nl(t)));
	}
	function nc() {
		return g0(), y0(), b0(), S0();
	}
	function S0() {
		if (En !== 5) return !1;
		var e = Sa,
			t = Wd;
		Wd = 0;
		var a = Pn(qo),
			s = j.T,
			d = I.p;
		try {
			(I.p = 32 > a ? 32 : a), (j.T = null), (a = $d), ($d = null);
			var m = Sa,
				x = qo;
			if (((En = 0), (os = Sa = null), (qo = 0), (Ot & 6) !== 0)) throw Error(i(331));
			var A = Ot;
			if (
				((Ot |= 4),
				t0(m.current),
				Wy(m, m.current, x, a),
				(Ot = A),
				wl(0, !1),
				Ze && typeof Ze.onPostCommitFiberRoot == "function")
			)
				try {
					Ze.onPostCommitFiberRoot(qn, m);
				} catch (q) {}
			return !0;
		} finally {
			(I.p = d), (j.T = s), v0(e, t);
		}
	}
	function x0(e, t, a) {
		(t = Or(a, t)),
			(t = Dd(e.stateNode, t, 2)),
			(e = ha(e, t, 2)),
			e !== null && (Nt(e, 2), so(e));
	}
	function zt(e, t, a) {
		if (e.tag === 3) x0(e, e, a);
		else
			for (; t !== null; ) {
				if (t.tag === 3) {
					x0(t, e, a);
					break;
				} else if (t.tag === 1) {
					var s = t.stateNode;
					if (
						typeof t.type.getDerivedStateFromError == "function" ||
						(typeof s.componentDidCatch == "function" && (va === null || !va.has(s)))
					) {
						(e = Or(a, e)),
							(a = wy(2)),
							(s = ha(t, a, 2)),
							s !== null && (Ey(a, s, t, e), Nt(s, 2), so(s));
						break;
					}
				}
				t = t.return;
			}
	}
	function rh(e, t, a) {
		var s = e.pingCache;
		if (s === null) {
			s = e.pingCache = new Iw();
			var d = new Set();
			s.set(t, d);
		} else (d = s.get(t)), d === void 0 && ((d = new Set()), s.set(t, d));
		d.has(a) || ((Qd = !0), d.add(a), (e = Qw.bind(null, e, t, a)), t.then(e, e));
	}
	function Qw(e, t, a) {
		var s = e.pingCache;
		s !== null && s.delete(t),
			(e.pingedLanes |= e.suspendedLanes & a),
			(e.warmLanes &= ~a),
			Vt === e &&
				(yt & a) === a &&
				(on === 4 || (on === 3 && (yt & 62914560) === yt && 300 > qe() - Zu)
					? (Ot & 2) === 0 && as(e, 0)
					: (Zd |= a),
				rs === yt && (rs = 0)),
			so(e);
	}
	function w0(e, t) {
		t === 0 && (t = Dt()), (e = Za(e, t)), e !== null && (Nt(e, t), so(e));
	}
	function Zw(e) {
		var t = e.memoizedState,
			a = 0;
		t !== null && (a = t.retryLane), w0(e, a);
	}
	function Jw(e, t) {
		var a = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var s = e.stateNode,
					d = e.memoizedState;
				d !== null && (a = d.retryLane);
				break;
			case 19:
				s = e.stateNode;
				break;
			case 22:
				s = e.stateNode._retryCache;
				break;
			default:
				throw Error(i(314));
		}
		s !== null && s.delete(t), w0(e, a);
	}
	function Ww(e, t) {
		return Ae(e, t);
	}
	var rc = null,
		ss = null,
		oh = !1,
		oc = !1,
		ah = !1,
		wa = 0;
	function so(e) {
		e !== ss && e.next === null && (ss === null ? (rc = ss = e) : (ss = ss.next = e)),
			(oc = !0),
			oh || ((oh = !0), eE());
	}
	function wl(e, t) {
		if (!ah && oc) {
			ah = !0;
			do
				for (var a = !1, s = rc; s !== null; ) {
					if (e !== 0) {
						var d = s.pendingLanes;
						if (d === 0) var m = 0;
						else {
							var x = s.suspendedLanes,
								A = s.pingedLanes;
							(m = (1 << (31 - ht(42 | e) + 1)) - 1),
								(m &= d & ~(x & ~A)),
								(m = m & 201326741 ? (m & 201326741) | 1 : m ? m | 2 : 0);
						}
						m !== 0 && ((a = !0), C0(s, m));
					} else
						(m = yt),
							(m = Je(
								s,
								s === Vt ? m : 0,
								s.cancelPendingCommit !== null || s.timeoutHandle !== -1
							)),
							(m & 3) === 0 || xt(s, m) || ((a = !0), C0(s, m));
					s = s.next;
				}
			while (a);
			ah = !1;
		}
	}
	function $w() {
		E0();
	}
	function E0() {
		oc = oh = !1;
		var e = 0;
		wa !== 0 && cE() && (e = wa);
		for (var t = qe(), a = null, s = rc; s !== null; ) {
			var d = s.next,
				m = R0(s, t);
			m === 0
				? ((s.next = null), a === null ? (rc = d) : (a.next = d), d === null && (ss = a))
				: ((a = s), (e !== 0 || (m & 3) !== 0) && (oc = !0)),
				(s = d);
		}
		(En !== 0 && En !== 5) || wl(e), wa !== 0 && (wa = 0);
	}
	function R0(e, t) {
		for (
			var a = e.suspendedLanes,
				s = e.pingedLanes,
				d = e.expirationTimes,
				m = e.pendingLanes & -62914561;
			0 < m;

		) {
			var x = 31 - ht(m),
				A = 1 << x,
				q = d[x];
			q === -1
				? ((A & a) === 0 || (A & s) !== 0) && (d[x] = Pt(A, t))
				: q <= t && (e.expiredLanes |= A),
				(m &= ~A);
		}
		if (
			((t = Vt),
			(a = yt),
			(a = Je(e, e === t ? a : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
			(s = e.callbackNode),
			a === 0 || (e === t && (Lt === 2 || Lt === 9)) || e.cancelPendingCommit !== null)
		)
			return (
				s !== null && s !== null && Se(s),
				(e.callbackNode = null),
				(e.callbackPriority = 0)
			);
		if ((a & 3) === 0 || xt(e, a)) {
			if (((t = a & -a), t === e.callbackPriority)) return t;
			switch ((s !== null && Se(s), Pn(a))) {
				case 2:
				case 8:
					a = Jt;
					break;
				case 32:
					a = st;
					break;
				case 268435456:
					a = wt;
					break;
				default:
					a = st;
			}
			return (
				(s = T0.bind(null, e)),
				(a = Ae(a, s)),
				(e.callbackPriority = t),
				(e.callbackNode = a),
				t
			);
		}
		return (
			s !== null && s !== null && Se(s), (e.callbackPriority = 2), (e.callbackNode = null), 2
		);
	}
	function T0(e, t) {
		if (En !== 0 && En !== 5) return (e.callbackNode = null), (e.callbackPriority = 0), null;
		var a = e.callbackNode;
		if (nc() && e.callbackNode !== a) return null;
		var s = yt;
		return (
			(s = Je(
				e,
				e === Vt ? s : 0,
				e.cancelPendingCommit !== null || e.timeoutHandle !== -1
			)),
			s === 0
				? null
				: (i0(e, s, t),
				  R0(e, qe()),
				  e.callbackNode != null && e.callbackNode === a ? T0.bind(null, e) : null)
		);
	}
	function C0(e, t) {
		if (nc()) return null;
		i0(e, t, !0);
	}
	function eE() {
		dE(function () {
			(Ot & 6) !== 0 ? Ae(Pe, $w) : E0();
		});
	}
	function ih() {
		if (wa === 0) {
			var e = Fi;
			e === 0 && ((e = _t), (_t <<= 1), (_t & 261888) === 0 && (_t = 256)), (wa = e);
		}
		return wa;
	}
	function O0(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean"
			? null
			: typeof e == "function"
			? e
			: Ci("" + e);
	}
	function A0(e, t) {
		var a = t.ownerDocument.createElement("input");
		return (
			(a.name = t.name),
			(a.value = t.value),
			e.id && a.setAttribute("form", e.id),
			t.parentNode.insertBefore(a, t),
			(e = new FormData(e)),
			a.parentNode.removeChild(a),
			e
		);
	}
	function tE(e, t, a, s, d) {
		if (t === "submit" && a && a.stateNode === d) {
			var m = O0((d[sn] || null).action),
				x = s.submitter;
			x &&
				((t = (t = x[sn] || null) ? O0(t.formAction) : x.getAttribute("formAction")),
				t !== null && ((m = t), (x = null)));
			var A = new Ga("action", "action", null, s, d);
			e.push({
				event: A,
				listeners: [
					{
						instance: null,
						listener: function () {
							if (s.defaultPrevented) {
								if (wa !== 0) {
									var q = x ? A0(d, x) : new FormData(d);
									Cd(
										a,
										{ pending: !0, data: q, method: d.method, action: m },
										null,
										q
									);
								}
							} else
								typeof m == "function" &&
									(A.preventDefault(),
									(q = x ? A0(d, x) : new FormData(d)),
									Cd(
										a,
										{ pending: !0, data: q, method: d.method, action: m },
										m,
										q
									));
						},
						currentTarget: d,
					},
				],
			});
		}
	}
	for (var sh = 0; sh < Yf.length; sh++) {
		var lh = Yf[sh],
			nE = lh.toLowerCase(),
			rE = lh[0].toUpperCase() + lh.slice(1);
		qr(nE, "on" + rE);
	}
	qr(ag, "onAnimationEnd"),
		qr(ig, "onAnimationIteration"),
		qr(sg, "onAnimationStart"),
		qr("dblclick", "onDoubleClick"),
		qr("focusin", "onFocus"),
		qr("focusout", "onBlur"),
		qr(vw, "onTransitionRun"),
		qr(Sw, "onTransitionStart"),
		qr(xw, "onTransitionCancel"),
		qr(lg, "onTransitionEnd"),
		ir("onMouseEnter", ["mouseout", "mouseover"]),
		ir("onMouseLeave", ["mouseout", "mouseover"]),
		ir("onPointerEnter", ["pointerout", "pointerover"]),
		ir("onPointerLeave", ["pointerout", "pointerover"]),
		eo(
			"onChange",
			"change click focusin focusout input keydown keyup selectionchange".split(" ")
		),
		eo(
			"onSelect",
			"focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
				" "
			)
		),
		eo("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
		eo(
			"onCompositionEnd",
			"compositionend focusout keydown keypress keyup mousedown".split(" ")
		),
		eo(
			"onCompositionStart",
			"compositionstart focusout keydown keypress keyup mousedown".split(" ")
		),
		eo(
			"onCompositionUpdate",
			"compositionupdate focusout keydown keypress keyup mousedown".split(" ")
		);
	var El =
			"abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
				" "
			),
		oE = new Set(
			"beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(El)
		);
	function M0(e, t) {
		t = (t & 4) !== 0;
		for (var a = 0; a < e.length; a++) {
			var s = e[a],
				d = s.event;
			s = s.listeners;
			e: {
				var m = void 0;
				if (t)
					for (var x = s.length - 1; 0 <= x; x--) {
						var A = s[x],
							q = A.instance,
							ne = A.currentTarget;
						if (((A = A.listener), q !== m && d.isPropagationStopped())) break e;
						(m = A), (d.currentTarget = ne);
						try {
							m(d);
						} catch (he) {
							vu(he);
						}
						(d.currentTarget = null), (m = q);
					}
				else
					for (x = 0; x < s.length; x++) {
						if (
							((A = s[x]),
							(q = A.instance),
							(ne = A.currentTarget),
							(A = A.listener),
							q !== m && d.isPropagationStopped())
						)
							break e;
						(m = A), (d.currentTarget = ne);
						try {
							m(d);
						} catch (he) {
							vu(he);
						}
						(d.currentTarget = null), (m = q);
					}
			}
		}
	}
	function mt(e, t) {
		var a = t[$o];
		a === void 0 && (a = t[$o] = new Set());
		var s = e + "__bubble";
		a.has(s) || (k0(t, e, 2, !1), a.add(s));
	}
	function uh(e, t, a) {
		var s = 0;
		t && (s |= 4), k0(a, e, s, t);
	}
	var ac = "_reactListening" + Math.random().toString(36).slice(2);
	function ch(e) {
		if (!e[ac]) {
			(e[ac] = !0),
				Qn.forEach(function (a) {
					a !== "selectionchange" && (oE.has(a) || uh(a, !1, e), uh(a, !0, e));
				});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[ac] || ((t[ac] = !0), uh("selectionchange", !1, t));
		}
	}
	function k0(e, t, a, s) {
		switch (ab(t)) {
			case 2:
				var d = DE;
				break;
			case 8:
				d = NE;
				break;
			default:
				d = Th;
		}
		(a = d.bind(null, t, a, e)),
			(d = void 0),
			!Xs || (t !== "touchstart" && t !== "touchmove" && t !== "wheel") || (d = !0),
			s
				? d !== void 0
					? e.addEventListener(t, a, { capture: !0, passive: d })
					: e.addEventListener(t, a, !0)
				: d !== void 0
				? e.addEventListener(t, a, { passive: d })
				: e.addEventListener(t, a, !1);
	}
	function fh(e, t, a, s, d) {
		var m = s;
		if ((t & 1) === 0 && (t & 2) === 0 && s !== null)
			e: for (;;) {
				if (s === null) return;
				var x = s.tag;
				if (x === 3 || x === 4) {
					var A = s.stateNode.containerInfo;
					if (A === d) break;
					if (x === 4)
						for (x = s.return; x !== null; ) {
							var q = x.tag;
							if ((q === 3 || q === 4) && x.stateNode.containerInfo === d) return;
							x = x.return;
						}
					for (; A !== null; ) {
						if (((x = ta(A)), x === null)) return;
						if (((q = x.tag), q === 5 || q === 6 || q === 26 || q === 27)) {
							s = m = x;
							continue e;
						}
						A = A.parentNode;
					}
				}
				s = s.return;
			}
		Fs(function () {
			var ne = m,
				he = Oi(a),
				be = [];
			e: {
				var ae = ug.get(e);
				if (ae !== void 0) {
					var ue = Ga,
						Ve = e;
					switch (e) {
						case "keypress":
							if (_i(a) === 0) break e;
						case "keydown":
						case "keyup":
							ue = hu;
							break;
						case "focusin":
							(Ve = "focus"), (ue = Me);
							break;
						case "focusout":
							(Ve = "blur"), (ue = Me);
							break;
						case "beforeblur":
						case "afterblur":
							ue = Me;
							break;
						case "click":
							if (a.button === 2) break e;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							ue = W;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							ue = Oe;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							ue = pu;
							break;
						case ag:
						case ig:
						case sg:
							ue = nt;
							break;
						case lg:
							ue = zi;
							break;
						case "scroll":
						case "scrollend":
							ue = E;
							break;
						case "wheel":
							ue = To;
							break;
						case "copy":
						case "cut":
						case "paste":
							ue = ot;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							ue = Ni;
							break;
						case "toggle":
						case "beforetoggle":
							ue = Rr;
					}
					var tt = (t & 4) !== 0,
						qt = !tt && (e === "scroll" || e === "scrollend"),
						Q = tt ? (ae !== null ? ae + "Capture" : null) : ae;
					tt = [];
					for (var G = ne, te; G !== null; ) {
						var ye = G;
						if (
							((te = ye.stateNode),
							(ye = ye.tag),
							(ye !== 5 && ye !== 26 && ye !== 27) ||
								te === null ||
								Q === null ||
								((ye = to(G, Q)), ye != null && tt.push(Rl(G, ye, te))),
							qt)
						)
							break;
						G = G.return;
					}
					0 < tt.length &&
						((ae = new ue(ae, Ve, null, a, he)),
						be.push({ event: ae, listeners: tt }));
				}
			}
			if ((t & 7) === 0) {
				e: {
					if (
						((ae = e === "mouseover" || e === "pointerover"),
						(ue = e === "mouseout" || e === "pointerout"),
						ae &&
							a !== Ia &&
							(Ve = a.relatedTarget || a.fromElement) &&
							(ta(Ve) || Ve[ar]))
					)
						break e;
					if (
						(ue || ae) &&
						((ae =
							he.window === he
								? he
								: (ae = he.ownerDocument)
								? ae.defaultView || ae.parentWindow
								: window),
						ue
							? ((Ve = a.relatedTarget || a.toElement),
							  (ue = ne),
							  (Ve = Ve ? ta(Ve) : null),
							  Ve !== null &&
									((qt = u(Ve)),
									(tt = Ve.tag),
									Ve !== qt || (tt !== 5 && tt !== 27 && tt !== 6)) &&
									(Ve = null))
							: ((ue = null), (Ve = ne)),
						ue !== Ve)
					) {
						if (
							((tt = W),
							(ye = "onMouseLeave"),
							(Q = "onMouseEnter"),
							(G = "mouse"),
							(e === "pointerout" || e === "pointerover") &&
								((tt = Ni),
								(ye = "onPointerLeave"),
								(Q = "onPointerEnter"),
								(G = "pointer")),
							(qt = ue == null ? ae : Pa(ue)),
							(te = Ve == null ? ae : Pa(Ve)),
							(ae = new tt(ye, G + "leave", ue, a, he)),
							(ae.target = qt),
							(ae.relatedTarget = te),
							(ye = null),
							ta(he) === ne &&
								((tt = new tt(Q, G + "enter", Ve, a, he)),
								(tt.target = te),
								(tt.relatedTarget = qt),
								(ye = tt)),
							(qt = ye),
							ue && Ve)
						)
							t: {
								for (tt = aE, Q = ue, G = Ve, te = 0, ye = Q; ye; ye = tt(ye))
									te++;
								ye = 0;
								for (var We = G; We; We = tt(We)) ye++;
								for (; 0 < te - ye; ) (Q = tt(Q)), te--;
								for (; 0 < ye - te; ) (G = tt(G)), ye--;
								for (; te--; ) {
									if (Q === G || (G !== null && Q === G.alternate)) {
										tt = Q;
										break t;
									}
									(Q = tt(Q)), (G = tt(G));
								}
								tt = null;
							}
						else tt = null;
						ue !== null && _0(be, ae, ue, tt, !1),
							Ve !== null && qt !== null && _0(be, qt, Ve, tt, !0);
					}
				}
				e: {
					if (
						((ae = ne ? Pa(ne) : window),
						(ue = ae.nodeName && ae.nodeName.toLowerCase()),
						ue === "select" || (ue === "input" && ae.type === "file"))
					)
						var Tt = Km;
					else if (Fm(ae))
						if (Qm) Tt = gw;
						else {
							Tt = pw;
							var Xe = hw;
						}
					else
						(ue = ae.nodeName),
							!ue ||
							ue.toLowerCase() !== "input" ||
							(ae.type !== "checkbox" && ae.type !== "radio")
								? ne && Ti(ne.elementType) && (Tt = Km)
								: (Tt = mw);
					if (Tt && (Tt = Tt(e, ne))) {
						Xm(be, Tt, a, he);
						break e;
					}
					Xe && Xe(e, ae, ne),
						e === "focusout" &&
							ne &&
							ae.type === "number" &&
							ne.memoizedProps.value != null &&
							Ys(ae, "number", ae.value);
				}
				switch (((Xe = ne ? Pa(ne) : window), e)) {
					case "focusin":
						(Fm(Xe) || Xe.contentEditable === "true") &&
							((Ui = Xe), (qf = ne), ($s = null));
						break;
					case "focusout":
						$s = qf = Ui = null;
						break;
					case "mousedown":
						Pf = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						(Pf = !1), rg(be, a, he);
						break;
					case "selectionchange":
						if (bw) break;
					case "keydown":
					case "keyup":
						rg(be, a, he);
				}
				var ct;
				if (Tr)
					e: {
						switch (e) {
							case "compositionstart":
								var bt = "onCompositionStart";
								break e;
							case "compositionend":
								bt = "onCompositionEnd";
								break e;
							case "compositionupdate":
								bt = "onCompositionUpdate";
								break e;
						}
						bt = void 0;
					}
				else
					Bi
						? Xa(e, a) && (bt = "onCompositionEnd")
						: e === "keydown" && a.keyCode === 229 && (bt = "onCompositionStart");
				bt &&
					(Hr &&
						a.locale !== "ko" &&
						(Bi || bt !== "onCompositionStart"
							? bt === "onCompositionEnd" && Bi && (ct = ki())
							: ((wn = he),
							  (aa = "value" in wn ? wn.value : wn.textContent),
							  (Bi = !0))),
					(Xe = ic(ne, bt)),
					0 < Xe.length &&
						((bt = new He(bt, e, null, a, he)),
						be.push({ event: bt, listeners: Xe }),
						ct ? (bt.data = ct) : ((ct = Qs(a)), ct !== null && (bt.data = ct)))),
					(ct = jf ? uw(e, a) : cw(e, a)) &&
						((bt = ic(ne, "onBeforeInput")),
						0 < bt.length &&
							((Xe = new He("onBeforeInput", "beforeinput", null, a, he)),
							be.push({ event: Xe, listeners: bt }),
							(Xe.data = ct))),
					tE(be, e, ne, a, he);
			}
			M0(be, t);
		});
	}
	function Rl(e, t, a) {
		return { instance: e, listener: t, currentTarget: a };
	}
	function ic(e, t) {
		for (var a = t + "Capture", s = []; e !== null; ) {
			var d = e,
				m = d.stateNode;
			if (
				((d = d.tag),
				(d !== 5 && d !== 26 && d !== 27) ||
					m === null ||
					((d = to(e, a)),
					d != null && s.unshift(Rl(e, d, m)),
					(d = to(e, t)),
					d != null && s.push(Rl(e, d, m))),
				e.tag === 3)
			)
				return s;
			e = e.return;
		}
		return [];
	}
	function aE(e) {
		if (e === null) return null;
		do e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function _0(e, t, a, s, d) {
		for (var m = t._reactName, x = []; a !== null && a !== s; ) {
			var A = a,
				q = A.alternate,
				ne = A.stateNode;
			if (((A = A.tag), q !== null && q === s)) break;
			(A !== 5 && A !== 26 && A !== 27) ||
				ne === null ||
				((q = ne),
				d
					? ((ne = to(a, m)), ne != null && x.unshift(Rl(a, ne, q)))
					: d || ((ne = to(a, m)), ne != null && x.push(Rl(a, ne, q)))),
				(a = a.return);
		}
		x.length !== 0 && e.push({ event: t, listeners: x });
	}
	var iE = /\r\n?/g,
		sE = /\u0000|\uFFFD/g;
	function D0(e) {
		return (typeof e == "string" ? e : "" + e)
			.replace(
				iE,
				`
`
			)
			.replace(sE, "");
	}
	function N0(e, t) {
		return (t = D0(t)), D0(e) === t;
	}
	function Ht(e, t, a, s, d, m) {
		switch (a) {
			case "children":
				typeof s == "string"
					? t === "body" || (t === "textarea" && s === "") || xo(e, s)
					: (typeof s == "number" || typeof s == "bigint") &&
					  t !== "body" &&
					  xo(e, "" + s);
				break;
			case "className":
				Va(e, "class", s);
				break;
			case "tabIndex":
				Va(e, "tabindex", s);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Va(e, a, s);
				break;
			case "style":
				Gs(e, s, m);
				break;
			case "data":
				if (t !== "object") {
					Va(e, "data", s);
					break;
				}
			case "src":
			case "href":
				if (s === "" && (t !== "a" || a !== "href")) {
					e.removeAttribute(a);
					break;
				}
				if (
					s == null ||
					typeof s == "function" ||
					typeof s == "symbol" ||
					typeof s == "boolean"
				) {
					e.removeAttribute(a);
					break;
				}
				(s = Ci("" + s)), e.setAttribute(a, s);
				break;
			case "action":
			case "formAction":
				if (typeof s == "function") {
					e.setAttribute(
						a,
						"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
					);
					break;
				} else
					typeof m == "function" &&
						(a === "formAction"
							? (t !== "input" && Ht(e, t, "name", d.name, d, null),
							  Ht(e, t, "formEncType", d.formEncType, d, null),
							  Ht(e, t, "formMethod", d.formMethod, d, null),
							  Ht(e, t, "formTarget", d.formTarget, d, null))
							: (Ht(e, t, "encType", d.encType, d, null),
							  Ht(e, t, "method", d.method, d, null),
							  Ht(e, t, "target", d.target, d, null)));
				if (s == null || typeof s == "symbol" || typeof s == "boolean") {
					e.removeAttribute(a);
					break;
				}
				(s = Ci("" + s)), e.setAttribute(a, s);
				break;
			case "onClick":
				s != null && (e.onclick = Sr);
				break;
			case "onScroll":
				s != null && mt("scroll", e);
				break;
			case "onScrollEnd":
				s != null && mt("scrollend", e);
				break;
			case "dangerouslySetInnerHTML":
				if (s != null) {
					if (typeof s != "object" || !("__html" in s)) throw Error(i(61));
					if (((a = s.__html), a != null)) {
						if (d.children != null) throw Error(i(60));
						e.innerHTML = a;
					}
				}
				break;
			case "multiple":
				e.multiple = s && typeof s != "function" && typeof s != "symbol";
				break;
			case "muted":
				e.muted = s && typeof s != "function" && typeof s != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref":
				break;
			case "autoFocus":
				break;
			case "xlinkHref":
				if (
					s == null ||
					typeof s == "function" ||
					typeof s == "boolean" ||
					typeof s == "symbol"
				) {
					e.removeAttribute("xlink:href");
					break;
				}
				(a = Ci("" + s)),
					e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", a);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				s != null && typeof s != "function" && typeof s != "symbol"
					? e.setAttribute(a, "" + s)
					: e.removeAttribute(a);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				s && typeof s != "function" && typeof s != "symbol"
					? e.setAttribute(a, "")
					: e.removeAttribute(a);
				break;
			case "capture":
			case "download":
				s === !0
					? e.setAttribute(a, "")
					: s !== !1 && s != null && typeof s != "function" && typeof s != "symbol"
					? e.setAttribute(a, s)
					: e.removeAttribute(a);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				s != null && typeof s != "function" && typeof s != "symbol" && !isNaN(s) && 1 <= s
					? e.setAttribute(a, s)
					: e.removeAttribute(a);
				break;
			case "rowSpan":
			case "start":
				s == null || typeof s == "function" || typeof s == "symbol" || isNaN(s)
					? e.removeAttribute(a)
					: e.setAttribute(a, s);
				break;
			case "popover":
				mt("beforetoggle", e), mt("toggle", e), vo(e, "popover", s);
				break;
			case "xlinkActuate":
				vr(e, "http://www.w3.org/1999/xlink", "xlink:actuate", s);
				break;
			case "xlinkArcrole":
				vr(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", s);
				break;
			case "xlinkRole":
				vr(e, "http://www.w3.org/1999/xlink", "xlink:role", s);
				break;
			case "xlinkShow":
				vr(e, "http://www.w3.org/1999/xlink", "xlink:show", s);
				break;
			case "xlinkTitle":
				vr(e, "http://www.w3.org/1999/xlink", "xlink:title", s);
				break;
			case "xlinkType":
				vr(e, "http://www.w3.org/1999/xlink", "xlink:type", s);
				break;
			case "xmlBase":
				vr(e, "http://www.w3.org/XML/1998/namespace", "xml:base", s);
				break;
			case "xmlLang":
				vr(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", s);
				break;
			case "xmlSpace":
				vr(e, "http://www.w3.org/XML/1998/namespace", "xml:space", s);
				break;
			case "is":
				vo(e, "is", s);
				break;
			case "innerText":
			case "textContent":
				break;
			default:
				(!(2 < a.length) ||
					(a[0] !== "o" && a[0] !== "O") ||
					(a[1] !== "n" && a[1] !== "N")) &&
					((a = fu.get(a) || a), vo(e, a, s));
		}
	}
	function dh(e, t, a, s, d, m) {
		switch (a) {
			case "style":
				Gs(e, s, m);
				break;
			case "dangerouslySetInnerHTML":
				if (s != null) {
					if (typeof s != "object" || !("__html" in s)) throw Error(i(61));
					if (((a = s.__html), a != null)) {
						if (d.children != null) throw Error(i(60));
						e.innerHTML = a;
					}
				}
				break;
			case "children":
				typeof s == "string"
					? xo(e, s)
					: (typeof s == "number" || typeof s == "bigint") && xo(e, "" + s);
				break;
			case "onScroll":
				s != null && mt("scroll", e);
				break;
			case "onScrollEnd":
				s != null && mt("scrollend", e);
				break;
			case "onClick":
				s != null && (e.onclick = Sr);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref":
				break;
			case "innerText":
			case "textContent":
				break;
			default:
				if (!Ei.hasOwnProperty(a))
					e: {
						if (
							a[0] === "o" &&
							a[1] === "n" &&
							((d = a.endsWith("Capture")),
							(t = a.slice(2, d ? a.length - 7 : void 0)),
							(m = e[sn] || null),
							(m = m != null ? m[a] : null),
							typeof m == "function" && e.removeEventListener(t, m, d),
							typeof s == "function")
						) {
							typeof m != "function" &&
								m !== null &&
								(a in e
									? (e[a] = null)
									: e.hasAttribute(a) && e.removeAttribute(a)),
								e.addEventListener(t, s, d);
							break e;
						}
						a in e ? (e[a] = s) : s === !0 ? e.setAttribute(a, "") : vo(e, a, s);
					}
		}
	}
	function Ln(e, t, a) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li":
				break;
			case "img":
				mt("error", e), mt("load", e);
				var s = !1,
					d = !1,
					m;
				for (m in a)
					if (a.hasOwnProperty(m)) {
						var x = a[m];
						if (x != null)
							switch (m) {
								case "src":
									s = !0;
									break;
								case "srcSet":
									d = !0;
									break;
								case "children":
								case "dangerouslySetInnerHTML":
									throw Error(i(137, t));
								default:
									Ht(e, t, m, x, a, null);
							}
					}
				d && Ht(e, t, "srcSet", a.srcSet, a, null), s && Ht(e, t, "src", a.src, a, null);
				return;
			case "input":
				mt("invalid", e);
				var A = (m = x = d = null),
					q = null,
					ne = null;
				for (s in a)
					if (a.hasOwnProperty(s)) {
						var he = a[s];
						if (he != null)
							switch (s) {
								case "name":
									d = he;
									break;
								case "type":
									x = he;
									break;
								case "checked":
									q = he;
									break;
								case "defaultChecked":
									ne = he;
									break;
								case "value":
									m = he;
									break;
								case "defaultValue":
									A = he;
									break;
								case "children":
								case "dangerouslySetInnerHTML":
									if (he != null) throw Error(i(137, t));
									break;
								default:
									Ht(e, t, s, he, a, null);
							}
					}
				lu(e, m, A, q, ne, x, d, !1);
				return;
			case "select":
				mt("invalid", e), (s = x = m = null);
				for (d in a)
					if (a.hasOwnProperty(d) && ((A = a[d]), A != null))
						switch (d) {
							case "value":
								m = A;
								break;
							case "defaultValue":
								x = A;
								break;
							case "multiple":
								s = A;
							default:
								Ht(e, t, d, A, a, null);
						}
				(t = m),
					(a = x),
					(e.multiple = !!s),
					t != null ? ra(e, !!s, t, !1) : a != null && ra(e, !!s, a, !0);
				return;
			case "textarea":
				mt("invalid", e), (m = d = s = null);
				for (x in a)
					if (a.hasOwnProperty(x) && ((A = a[x]), A != null))
						switch (x) {
							case "value":
								s = A;
								break;
							case "defaultValue":
								d = A;
								break;
							case "children":
								m = A;
								break;
							case "dangerouslySetInnerHTML":
								if (A != null) throw Error(i(91));
								break;
							default:
								Ht(e, t, x, A, a, null);
						}
				Is(e, s, d, m);
				return;
			case "option":
				for (q in a)
					a.hasOwnProperty(q) &&
						((s = a[q]), s != null) &&
						(q === "selected"
							? (e.selected = s && typeof s != "function" && typeof s != "symbol")
							: Ht(e, t, q, s, a, null));
				return;
			case "dialog":
				mt("beforetoggle", e), mt("toggle", e), mt("cancel", e), mt("close", e);
				break;
			case "iframe":
			case "object":
				mt("load", e);
				break;
			case "video":
			case "audio":
				for (s = 0; s < El.length; s++) mt(El[s], e);
				break;
			case "image":
				mt("error", e), mt("load", e);
				break;
			case "details":
				mt("toggle", e);
				break;
			case "embed":
			case "source":
			case "link":
				mt("error", e), mt("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (ne in a)
					if (a.hasOwnProperty(ne) && ((s = a[ne]), s != null))
						switch (ne) {
							case "children":
							case "dangerouslySetInnerHTML":
								throw Error(i(137, t));
							default:
								Ht(e, t, ne, s, a, null);
						}
				return;
			default:
				if (Ti(t)) {
					for (he in a)
						a.hasOwnProperty(he) &&
							((s = a[he]), s !== void 0 && dh(e, t, he, s, a, void 0));
					return;
				}
		}
		for (A in a) a.hasOwnProperty(A) && ((s = a[A]), s != null && Ht(e, t, A, s, a, null));
	}
	function lE(e, t, a, s) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li":
				break;
			case "input":
				var d = null,
					m = null,
					x = null,
					A = null,
					q = null,
					ne = null,
					he = null;
				for (ue in a) {
					var be = a[ue];
					if (a.hasOwnProperty(ue) && be != null)
						switch (ue) {
							case "checked":
								break;
							case "value":
								break;
							case "defaultValue":
								q = be;
							default:
								s.hasOwnProperty(ue) || Ht(e, t, ue, null, s, be);
						}
				}
				for (var ae in s) {
					var ue = s[ae];
					if (((be = a[ae]), s.hasOwnProperty(ae) && (ue != null || be != null)))
						switch (ae) {
							case "type":
								m = ue;
								break;
							case "name":
								d = ue;
								break;
							case "checked":
								ne = ue;
								break;
							case "defaultChecked":
								he = ue;
								break;
							case "value":
								x = ue;
								break;
							case "defaultValue":
								A = ue;
								break;
							case "children":
							case "dangerouslySetInnerHTML":
								if (ue != null) throw Error(i(137, t));
								break;
							default:
								ue !== be && Ht(e, t, ae, ue, s, be);
						}
				}
				Vs(e, x, A, q, ne, he, m, d);
				return;
			case "select":
				ue = x = A = ae = null;
				for (m in a)
					if (((q = a[m]), a.hasOwnProperty(m) && q != null))
						switch (m) {
							case "value":
								break;
							case "multiple":
								ue = q;
							default:
								s.hasOwnProperty(m) || Ht(e, t, m, null, s, q);
						}
				for (d in s)
					if (((m = s[d]), (q = a[d]), s.hasOwnProperty(d) && (m != null || q != null)))
						switch (d) {
							case "value":
								ae = m;
								break;
							case "defaultValue":
								A = m;
								break;
							case "multiple":
								x = m;
							default:
								m !== q && Ht(e, t, d, m, s, q);
						}
				(t = A),
					(a = x),
					(s = ue),
					ae != null
						? ra(e, !!a, ae, !1)
						: !!s != !!a &&
						  (t != null ? ra(e, !!a, t, !0) : ra(e, !!a, a ? [] : "", !1));
				return;
			case "textarea":
				ue = ae = null;
				for (A in a)
					if (((d = a[A]), a.hasOwnProperty(A) && d != null && !s.hasOwnProperty(A)))
						switch (A) {
							case "value":
								break;
							case "children":
								break;
							default:
								Ht(e, t, A, null, s, d);
						}
				for (x in s)
					if (((d = s[x]), (m = a[x]), s.hasOwnProperty(x) && (d != null || m != null)))
						switch (x) {
							case "value":
								ae = d;
								break;
							case "defaultValue":
								ue = d;
								break;
							case "children":
								break;
							case "dangerouslySetInnerHTML":
								if (d != null) throw Error(i(91));
								break;
							default:
								d !== m && Ht(e, t, x, d, s, m);
						}
				uu(e, ae, ue);
				return;
			case "option":
				for (var Ve in a)
					(ae = a[Ve]),
						a.hasOwnProperty(Ve) &&
							ae != null &&
							!s.hasOwnProperty(Ve) &&
							(Ve === "selected" ? (e.selected = !1) : Ht(e, t, Ve, null, s, ae));
				for (q in s)
					(ae = s[q]),
						(ue = a[q]),
						s.hasOwnProperty(q) &&
							ae !== ue &&
							(ae != null || ue != null) &&
							(q === "selected"
								? (e.selected =
										ae && typeof ae != "function" && typeof ae != "symbol")
								: Ht(e, t, q, ae, s, ue));
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var tt in a)
					(ae = a[tt]),
						a.hasOwnProperty(tt) &&
							ae != null &&
							!s.hasOwnProperty(tt) &&
							Ht(e, t, tt, null, s, ae);
				for (ne in s)
					if (
						((ae = s[ne]),
						(ue = a[ne]),
						s.hasOwnProperty(ne) && ae !== ue && (ae != null || ue != null))
					)
						switch (ne) {
							case "children":
							case "dangerouslySetInnerHTML":
								if (ae != null) throw Error(i(137, t));
								break;
							default:
								Ht(e, t, ne, ae, s, ue);
						}
				return;
			default:
				if (Ti(t)) {
					for (var qt in a)
						(ae = a[qt]),
							a.hasOwnProperty(qt) &&
								ae !== void 0 &&
								!s.hasOwnProperty(qt) &&
								dh(e, t, qt, void 0, s, ae);
					for (he in s)
						(ae = s[he]),
							(ue = a[he]),
							!s.hasOwnProperty(he) ||
								ae === ue ||
								(ae === void 0 && ue === void 0) ||
								dh(e, t, he, ae, s, ue);
					return;
				}
		}
		for (var Q in a)
			(ae = a[Q]),
				a.hasOwnProperty(Q) &&
					ae != null &&
					!s.hasOwnProperty(Q) &&
					Ht(e, t, Q, null, s, ae);
		for (be in s)
			(ae = s[be]),
				(ue = a[be]),
				!s.hasOwnProperty(be) ||
					ae === ue ||
					(ae == null && ue == null) ||
					Ht(e, t, be, ae, s, ue);
	}
	function L0(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link":
				return !0;
			default:
				return !1;
		}
	}
	function uE() {
		if (typeof performance.getEntriesByType == "function") {
			for (
				var e = 0, t = 0, a = performance.getEntriesByType("resource"), s = 0;
				s < a.length;
				s++
			) {
				var d = a[s],
					m = d.transferSize,
					x = d.initiatorType,
					A = d.duration;
				if (m && A && L0(x)) {
					for (x = 0, A = d.responseEnd, s += 1; s < a.length; s++) {
						var q = a[s],
							ne = q.startTime;
						if (ne > A) break;
						var he = q.transferSize,
							be = q.initiatorType;
						he &&
							L0(be) &&
							((q = q.responseEnd), (x += he * (q < A ? 1 : (A - ne) / (q - ne))));
					}
					if ((--s, (t += (8 * (m + x)) / (d.duration / 1e3)), e++, 10 < e)) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && ((e = navigator.connection.downlink), typeof e == "number")
			? e
			: 5;
	}
	var hh = null,
		ph = null;
	function sc(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function z0(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg":
				return 1;
			case "http://www.w3.org/1998/Math/MathML":
				return 2;
			default:
				return 0;
		}
	}
	function j0(e, t) {
		if (e === 0)
			switch (t) {
				case "svg":
					return 1;
				case "math":
					return 2;
				default:
					return 0;
			}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function mh(e, t) {
		return (
			e === "textarea" ||
			e === "noscript" ||
			typeof t.children == "string" ||
			typeof t.children == "number" ||
			typeof t.children == "bigint" ||
			(typeof t.dangerouslySetInnerHTML == "object" &&
				t.dangerouslySetInnerHTML !== null &&
				t.dangerouslySetInnerHTML.__html != null)
		);
	}
	var gh = null;
	function cE() {
		var e = window.event;
		return e && e.type === "popstate" ? (e === gh ? !1 : ((gh = e), !0)) : ((gh = null), !1);
	}
	var B0 = typeof setTimeout == "function" ? setTimeout : void 0,
		fE = typeof clearTimeout == "function" ? clearTimeout : void 0,
		U0 = typeof Promise == "function" ? Promise : void 0,
		dE =
			typeof queueMicrotask == "function"
				? queueMicrotask
				: typeof U0 != "undefined"
				? function (e) {
						return U0.resolve(null).then(e).catch(hE);
				  }
				: B0;
	function hE(e) {
		setTimeout(function () {
			throw e;
		});
	}
	function Ea(e) {
		return e === "head";
	}
	function H0(e, t) {
		var a = t,
			s = 0;
		do {
			var d = a.nextSibling;
			if ((e.removeChild(a), d && d.nodeType === 8))
				if (((a = d.data), a === "/$" || a === "/&")) {
					if (s === 0) {
						e.removeChild(d), fs(t);
						return;
					}
					s--;
				} else if (a === "$" || a === "$?" || a === "$~" || a === "$!" || a === "&") s++;
				else if (a === "html") Tl(e.ownerDocument.documentElement);
				else if (a === "head") {
					(a = e.ownerDocument.head), Tl(a);
					for (var m = a.firstChild; m; ) {
						var x = m.nextSibling,
							A = m.nodeName;
						m[Wr] ||
							A === "SCRIPT" ||
							A === "STYLE" ||
							(A === "LINK" && m.rel.toLowerCase() === "stylesheet") ||
							a.removeChild(m),
							(m = x);
					}
				} else a === "body" && Tl(e.ownerDocument.body);
			a = d;
		} while (a);
		fs(t);
	}
	function q0(e, t) {
		var a = e;
		e = 0;
		do {
			var s = a.nextSibling;
			if (
				(a.nodeType === 1
					? t
						? ((a._stashedDisplay = a.style.display), (a.style.display = "none"))
						: ((a.style.display = a._stashedDisplay || ""),
						  a.getAttribute("style") === "" && a.removeAttribute("style"))
					: a.nodeType === 3 &&
					  (t
							? ((a._stashedText = a.nodeValue), (a.nodeValue = ""))
							: (a.nodeValue = a._stashedText || "")),
				s && s.nodeType === 8)
			)
				if (((a = s.data), a === "/$")) {
					if (e === 0) break;
					e--;
				} else (a !== "$" && a !== "$?" && a !== "$~" && a !== "$!") || e++;
			a = s;
		} while (a);
	}
	function yh(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
			var a = t;
			switch (((t = t.nextSibling), a.nodeName)) {
				case "HTML":
				case "HEAD":
				case "BODY":
					yh(a), Hs(a);
					continue;
				case "SCRIPT":
				case "STYLE":
					continue;
				case "LINK":
					if (a.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(a);
		}
	}
	function pE(e, t, a, s) {
		for (; e.nodeType === 1; ) {
			var d = a;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!s && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (s) {
				if (!e[Wr])
					switch (t) {
						case "meta":
							if (!e.hasAttribute("itemprop")) break;
							return e;
						case "link":
							if (
								((m = e.getAttribute("rel")),
								m === "stylesheet" && e.hasAttribute("data-precedence"))
							)
								break;
							if (
								m !== d.rel ||
								e.getAttribute("href") !==
									(d.href == null || d.href === "" ? null : d.href) ||
								e.getAttribute("crossorigin") !==
									(d.crossOrigin == null ? null : d.crossOrigin) ||
								e.getAttribute("title") !== (d.title == null ? null : d.title)
							)
								break;
							return e;
						case "style":
							if (e.hasAttribute("data-precedence")) break;
							return e;
						case "script":
							if (
								((m = e.getAttribute("src")),
								(m !== (d.src == null ? null : d.src) ||
									e.getAttribute("type") !== (d.type == null ? null : d.type) ||
									e.getAttribute("crossorigin") !==
										(d.crossOrigin == null ? null : d.crossOrigin)) &&
									m &&
									e.hasAttribute("async") &&
									!e.hasAttribute("itemprop"))
							)
								break;
							return e;
						default:
							return e;
					}
			} else if (t === "input" && e.type === "hidden") {
				var m = d.name == null ? null : "" + d.name;
				if (d.type === "hidden" && e.getAttribute("name") === m) return e;
			} else return e;
			if (((e = Dr(e.nextSibling)), e === null)) break;
		}
		return null;
	}
	function mE(e, t, a) {
		if (t === "") return null;
		for (; e.nodeType !== 3; )
			if (
				((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !a) ||
				((e = Dr(e.nextSibling)), e === null)
			)
				return null;
		return e;
	}
	function P0(e, t) {
		for (; e.nodeType !== 8; )
			if (
				((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t) ||
				((e = Dr(e.nextSibling)), e === null)
			)
				return null;
		return e;
	}
	function bh(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function vh(e) {
		return e.data === "$!" || (e.data === "$?" && e.ownerDocument.readyState !== "loading");
	}
	function gE(e, t) {
		var a = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || a.readyState !== "loading") t();
		else {
			var s = function () {
				t(), a.removeEventListener("DOMContentLoaded", s);
			};
			a.addEventListener("DOMContentLoaded", s), (e._reactRetry = s);
		}
	}
	function Dr(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (
					((t = e.data),
					t === "$" ||
						t === "$!" ||
						t === "$?" ||
						t === "$~" ||
						t === "&" ||
						t === "F!" ||
						t === "F")
				)
					break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var Sh = null;
	function V0(e) {
		e = e.nextSibling;
		for (var t = 0; e; ) {
			if (e.nodeType === 8) {
				var a = e.data;
				if (a === "/$" || a === "/&") {
					if (t === 0) return Dr(e.nextSibling);
					t--;
				} else (a !== "$" && a !== "$!" && a !== "$?" && a !== "$~" && a !== "&") || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function Y0(e) {
		e = e.previousSibling;
		for (var t = 0; e; ) {
			if (e.nodeType === 8) {
				var a = e.data;
				if (a === "$" || a === "$!" || a === "$?" || a === "$~" || a === "&") {
					if (t === 0) return e;
					t--;
				} else (a !== "/$" && a !== "/&") || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function I0(e, t, a) {
		switch (((t = sc(a)), e)) {
			case "html":
				if (((e = t.documentElement), !e)) throw Error(i(452));
				return e;
			case "head":
				if (((e = t.head), !e)) throw Error(i(453));
				return e;
			case "body":
				if (((e = t.body), !e)) throw Error(i(454));
				return e;
			default:
				throw Error(i(451));
		}
	}
	function Tl(e) {
		for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
		Hs(e);
	}
	var Nr = new Map(),
		G0 = new Set();
	function lc(e) {
		return typeof e.getRootNode == "function"
			? e.getRootNode()
			: e.nodeType === 9
			? e
			: e.ownerDocument;
	}
	var Po = I.d;
	I.d = { f: yE, r: bE, D: vE, C: SE, L: xE, m: wE, X: RE, S: EE, M: TE };
	function yE() {
		var e = Po.f(),
			t = $u();
		return e || t;
	}
	function bE(e) {
		var t = $r(e);
		t !== null && t.tag === 5 && t.type === "form" ? ly(t) : Po.r(e);
	}
	var ls = typeof document == "undefined" ? null : document;
	function F0(e, t, a) {
		var s = ls;
		if (s && typeof t == "string" && t) {
			var d = Vn(t);
			(d = 'link[rel="' + e + '"][href="' + d + '"]'),
				typeof a == "string" && (d += '[crossorigin="' + a + '"]'),
				G0.has(d) ||
					(G0.add(d),
					(e = { rel: e, crossOrigin: a, href: t }),
					s.querySelector(d) === null &&
						((t = s.createElement("link")),
						Ln(t, "link", e),
						tn(t),
						s.head.appendChild(t)));
		}
	}
	function vE(e) {
		Po.D(e), F0("dns-prefetch", e, null);
	}
	function SE(e, t) {
		Po.C(e, t), F0("preconnect", e, t);
	}
	function xE(e, t, a) {
		Po.L(e, t, a);
		var s = ls;
		if (s && e && t) {
			var d = 'link[rel="preload"][as="' + Vn(t) + '"]';
			t === "image" && a && a.imageSrcSet
				? ((d += '[imagesrcset="' + Vn(a.imageSrcSet) + '"]'),
				  typeof a.imageSizes == "string" &&
						(d += '[imagesizes="' + Vn(a.imageSizes) + '"]'))
				: (d += '[href="' + Vn(e) + '"]');
			var m = d;
			switch (t) {
				case "style":
					m = us(e);
					break;
				case "script":
					m = cs(e);
			}
			Nr.has(m) ||
				((e = g(
					{
						rel: "preload",
						href: t === "image" && a && a.imageSrcSet ? void 0 : e,
						as: t,
					},
					a
				)),
				Nr.set(m, e),
				s.querySelector(d) !== null ||
					(t === "style" && s.querySelector(Cl(m))) ||
					(t === "script" && s.querySelector(Ol(m))) ||
					((t = s.createElement("link")),
					Ln(t, "link", e),
					tn(t),
					s.head.appendChild(t)));
		}
	}
	function wE(e, t) {
		Po.m(e, t);
		var a = ls;
		if (a && e) {
			var s = t && typeof t.as == "string" ? t.as : "script",
				d = 'link[rel="modulepreload"][as="' + Vn(s) + '"][href="' + Vn(e) + '"]',
				m = d;
			switch (s) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script":
					m = cs(e);
			}
			if (
				!Nr.has(m) &&
				((e = g({ rel: "modulepreload", href: e }, t)),
				Nr.set(m, e),
				a.querySelector(d) === null)
			) {
				switch (s) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script":
						if (a.querySelector(Ol(m))) return;
				}
				(s = a.createElement("link")), Ln(s, "link", e), tn(s), a.head.appendChild(s);
			}
		}
	}
	function EE(e, t, a) {
		Po.S(e, t, a);
		var s = ls;
		if (s && e) {
			var d = na(s).hoistableStyles,
				m = us(e);
			t = t || "default";
			var x = d.get(m);
			if (!x) {
				var A = { loading: 0, preload: null };
				if ((x = s.querySelector(Cl(m)))) A.loading = 5;
				else {
					(e = g({ rel: "stylesheet", href: e, "data-precedence": t }, a)),
						(a = Nr.get(m)) && xh(e, a);
					var q = (x = s.createElement("link"));
					tn(q),
						Ln(q, "link", e),
						(q._p = new Promise(function (ne, he) {
							(q.onload = ne), (q.onerror = he);
						})),
						q.addEventListener("load", function () {
							A.loading |= 1;
						}),
						q.addEventListener("error", function () {
							A.loading |= 2;
						}),
						(A.loading |= 4),
						uc(x, t, s);
				}
				(x = { type: "stylesheet", instance: x, count: 1, state: A }), d.set(m, x);
			}
		}
	}
	function RE(e, t) {
		Po.X(e, t);
		var a = ls;
		if (a && e) {
			var s = na(a).hoistableScripts,
				d = cs(e),
				m = s.get(d);
			m ||
				((m = a.querySelector(Ol(d))),
				m ||
					((e = g({ src: e, async: !0 }, t)),
					(t = Nr.get(d)) && wh(e, t),
					(m = a.createElement("script")),
					tn(m),
					Ln(m, "link", e),
					a.head.appendChild(m)),
				(m = { type: "script", instance: m, count: 1, state: null }),
				s.set(d, m));
		}
	}
	function TE(e, t) {
		Po.M(e, t);
		var a = ls;
		if (a && e) {
			var s = na(a).hoistableScripts,
				d = cs(e),
				m = s.get(d);
			m ||
				((m = a.querySelector(Ol(d))),
				m ||
					((e = g({ src: e, async: !0, type: "module" }, t)),
					(t = Nr.get(d)) && wh(e, t),
					(m = a.createElement("script")),
					tn(m),
					Ln(m, "link", e),
					a.head.appendChild(m)),
				(m = { type: "script", instance: m, count: 1, state: null }),
				s.set(d, m));
		}
	}
	function X0(e, t, a, s) {
		var d = (d = ve.current) ? lc(d) : null;
		if (!d) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title":
				return null;
			case "style":
				return typeof a.precedence == "string" && typeof a.href == "string"
					? ((t = us(a.href)),
					  (a = na(d).hoistableStyles),
					  (s = a.get(t)),
					  s ||
							((s = { type: "style", instance: null, count: 0, state: null }),
							a.set(t, s)),
					  s)
					: { type: "void", instance: null, count: 0, state: null };
			case "link":
				if (
					a.rel === "stylesheet" &&
					typeof a.href == "string" &&
					typeof a.precedence == "string"
				) {
					e = us(a.href);
					var m = na(d).hoistableStyles,
						x = m.get(e);
					if (
						(x ||
							((d = d.ownerDocument || d),
							(x = {
								type: "stylesheet",
								instance: null,
								count: 0,
								state: { loading: 0, preload: null },
							}),
							m.set(e, x),
							(m = d.querySelector(Cl(e))) &&
								!m._p &&
								((x.instance = m), (x.state.loading = 5)),
							Nr.has(e) ||
								((a = {
									rel: "preload",
									as: "style",
									href: a.href,
									crossOrigin: a.crossOrigin,
									integrity: a.integrity,
									media: a.media,
									hrefLang: a.hrefLang,
									referrerPolicy: a.referrerPolicy,
								}),
								Nr.set(e, a),
								m || CE(d, e, a, x.state))),
						t && s === null)
					)
						throw Error(i(528, ""));
					return x;
				}
				if (t && s !== null) throw Error(i(529, ""));
				return null;
			case "script":
				return (
					(t = a.async),
					(a = a.src),
					typeof a == "string" && t && typeof t != "function" && typeof t != "symbol"
						? ((t = cs(a)),
						  (a = na(d).hoistableScripts),
						  (s = a.get(t)),
						  s ||
								((s = { type: "script", instance: null, count: 0, state: null }),
								a.set(t, s)),
						  s)
						: { type: "void", instance: null, count: 0, state: null }
				);
			default:
				throw Error(i(444, e));
		}
	}
	function us(e) {
		return 'href="' + Vn(e) + '"';
	}
	function Cl(e) {
		return 'link[rel="stylesheet"][' + e + "]";
	}
	function K0(e) {
		return g({}, e, { "data-precedence": e.precedence, precedence: null });
	}
	function CE(e, t, a, s) {
		e.querySelector('link[rel="preload"][as="style"][' + t + "]")
			? (s.loading = 1)
			: ((t = e.createElement("link")),
			  (s.preload = t),
			  t.addEventListener("load", function () {
					return (s.loading |= 1);
			  }),
			  t.addEventListener("error", function () {
					return (s.loading |= 2);
			  }),
			  Ln(t, "link", a),
			  tn(t),
			  e.head.appendChild(t));
	}
	function cs(e) {
		return '[src="' + Vn(e) + '"]';
	}
	function Ol(e) {
		return "script[async]" + e;
	}
	function Q0(e, t, a) {
		if ((t.count++, t.instance === null))
			switch (t.type) {
				case "style":
					var s = e.querySelector('style[data-href~="' + Vn(a.href) + '"]');
					if (s) return (t.instance = s), tn(s), s;
					var d = g({}, a, {
						"data-href": a.href,
						"data-precedence": a.precedence,
						href: null,
						precedence: null,
					});
					return (
						(s = (e.ownerDocument || e).createElement("style")),
						tn(s),
						Ln(s, "style", d),
						uc(s, a.precedence, e),
						(t.instance = s)
					);
				case "stylesheet":
					d = us(a.href);
					var m = e.querySelector(Cl(d));
					if (m) return (t.state.loading |= 4), (t.instance = m), tn(m), m;
					(s = K0(a)),
						(d = Nr.get(d)) && xh(s, d),
						(m = (e.ownerDocument || e).createElement("link")),
						tn(m);
					var x = m;
					return (
						(x._p = new Promise(function (A, q) {
							(x.onload = A), (x.onerror = q);
						})),
						Ln(m, "link", s),
						(t.state.loading |= 4),
						uc(m, a.precedence, e),
						(t.instance = m)
					);
				case "script":
					return (
						(m = cs(a.src)),
						(d = e.querySelector(Ol(m)))
							? ((t.instance = d), tn(d), d)
							: ((s = a),
							  (d = Nr.get(m)) && ((s = g({}, a)), wh(s, d)),
							  (e = e.ownerDocument || e),
							  (d = e.createElement("script")),
							  tn(d),
							  Ln(d, "link", s),
							  e.head.appendChild(d),
							  (t.instance = d))
					);
				case "void":
					return null;
				default:
					throw Error(i(443, t.type));
			}
		else
			t.type === "stylesheet" &&
				(t.state.loading & 4) === 0 &&
				((s = t.instance), (t.state.loading |= 4), uc(s, a.precedence, e));
		return t.instance;
	}
	function uc(e, t, a) {
		for (
			var s = a.querySelectorAll(
					'link[rel="stylesheet"][data-precedence],style[data-precedence]'
				),
				d = s.length ? s[s.length - 1] : null,
				m = d,
				x = 0;
			x < s.length;
			x++
		) {
			var A = s[x];
			if (A.dataset.precedence === t) m = A;
			else if (m !== d) break;
		}
		m
			? m.parentNode.insertBefore(e, m.nextSibling)
			: ((t = a.nodeType === 9 ? a.head : a), t.insertBefore(e, t.firstChild));
	}
	function xh(e, t) {
		e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
			e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
			e.title == null && (e.title = t.title);
	}
	function wh(e, t) {
		e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
			e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
			e.integrity == null && (e.integrity = t.integrity);
	}
	var cc = null;
	function Z0(e, t, a) {
		if (cc === null) {
			var s = new Map(),
				d = (cc = new Map());
			d.set(a, s);
		} else (d = cc), (s = d.get(a)), s || ((s = new Map()), d.set(a, s));
		if (s.has(e)) return s;
		for (s.set(e, null), a = a.getElementsByTagName(e), d = 0; d < a.length; d++) {
			var m = a[d];
			if (
				!(m[Wr] || m[an] || (e === "link" && m.getAttribute("rel") === "stylesheet")) &&
				m.namespaceURI !== "http://www.w3.org/2000/svg"
			) {
				var x = m.getAttribute(t) || "";
				x = e + x;
				var A = s.get(x);
				A ? A.push(m) : s.set(x, [m]);
			}
		}
		return s;
	}
	function J0(e, t, a) {
		(e = e.ownerDocument || e),
			e.head.insertBefore(a, t === "title" ? e.querySelector("head > title") : null);
	}
	function OE(e, t, a) {
		if (a === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title":
				return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
					break;
				return !0;
			case "link":
				if (
					typeof t.rel != "string" ||
					typeof t.href != "string" ||
					t.href === "" ||
					t.onLoad ||
					t.onError
				)
					break;
				return t.rel === "stylesheet"
					? ((e = t.disabled), typeof t.precedence == "string" && e == null)
					: !0;
			case "script":
				if (
					t.async &&
					typeof t.async != "function" &&
					typeof t.async != "symbol" &&
					!t.onLoad &&
					!t.onError &&
					t.src &&
					typeof t.src == "string"
				)
					return !0;
		}
		return !1;
	}
	function W0(e) {
		return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
	}
	function AE(e, t, a, s) {
		if (
			a.type === "stylesheet" &&
			(typeof s.media != "string" || matchMedia(s.media).matches !== !1) &&
			(a.state.loading & 4) === 0
		) {
			if (a.instance === null) {
				var d = us(s.href),
					m = t.querySelector(Cl(d));
				if (m) {
					(t = m._p),
						t !== null &&
							typeof t == "object" &&
							typeof t.then == "function" &&
							(e.count++, (e = fc.bind(e)), t.then(e, e)),
						(a.state.loading |= 4),
						(a.instance = m),
						tn(m);
					return;
				}
				(m = t.ownerDocument || t),
					(s = K0(s)),
					(d = Nr.get(d)) && xh(s, d),
					(m = m.createElement("link")),
					tn(m);
				var x = m;
				(x._p = new Promise(function (A, q) {
					(x.onload = A), (x.onerror = q);
				})),
					Ln(m, "link", s),
					(a.instance = m);
			}
			e.stylesheets === null && (e.stylesheets = new Map()),
				e.stylesheets.set(a, t),
				(t = a.state.preload) &&
					(a.state.loading & 3) === 0 &&
					(e.count++,
					(a = fc.bind(e)),
					t.addEventListener("load", a),
					t.addEventListener("error", a));
		}
	}
	var Eh = 0;
	function ME(e, t) {
		return (
			e.stylesheets && e.count === 0 && hc(e, e.stylesheets),
			0 < e.count || 0 < e.imgCount
				? function (a) {
						var s = setTimeout(function () {
							if ((e.stylesheets && hc(e, e.stylesheets), e.unsuspend)) {
								var m = e.unsuspend;
								(e.unsuspend = null), m();
							}
						}, 6e4 + t);
						0 < e.imgBytes && Eh === 0 && (Eh = 62500 * uE());
						var d = setTimeout(function () {
							if (
								((e.waitingForImages = !1),
								e.count === 0 &&
									(e.stylesheets && hc(e, e.stylesheets), e.unsuspend))
							) {
								var m = e.unsuspend;
								(e.unsuspend = null), m();
							}
						}, (e.imgBytes > Eh ? 50 : 800) + t);
						return (
							(e.unsuspend = a),
							function () {
								(e.unsuspend = null), clearTimeout(s), clearTimeout(d);
							}
						);
				  }
				: null
		);
	}
	function fc() {
		if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
			if (this.stylesheets) hc(this, this.stylesheets);
			else if (this.unsuspend) {
				var e = this.unsuspend;
				(this.unsuspend = null), e();
			}
		}
	}
	var dc = null;
	function hc(e, t) {
		(e.stylesheets = null),
			e.unsuspend !== null &&
				(e.count++, (dc = new Map()), t.forEach(kE, e), (dc = null), fc.call(e));
	}
	function kE(e, t) {
		if (!(t.state.loading & 4)) {
			var a = dc.get(e);
			if (a) var s = a.get(null);
			else {
				(a = new Map()), dc.set(e, a);
				for (
					var d = e.querySelectorAll("link[data-precedence],style[data-precedence]"),
						m = 0;
					m < d.length;
					m++
				) {
					var x = d[m];
					(x.nodeName === "LINK" || x.getAttribute("media") !== "not all") &&
						(a.set(x.dataset.precedence, x), (s = x));
				}
				s && a.set(null, s);
			}
			(d = t.instance),
				(x = d.getAttribute("data-precedence")),
				(m = a.get(x) || s),
				m === s && a.set(null, d),
				a.set(x, d),
				this.count++,
				(s = fc.bind(this)),
				d.addEventListener("load", s),
				d.addEventListener("error", s),
				m
					? m.parentNode.insertBefore(d, m.nextSibling)
					: ((e = e.nodeType === 9 ? e.head : e), e.insertBefore(d, e.firstChild)),
				(t.state.loading |= 4);
		}
	}
	var Al = {
		$$typeof: M,
		Provider: null,
		Consumer: null,
		_currentValue: F,
		_currentValue2: F,
		_threadCount: 0,
	};
	function _E(e, t, a, s, d, m, x, A, q) {
		(this.tag = 1),
			(this.containerInfo = e),
			(this.pingCache = this.current = this.pendingChildren = null),
			(this.timeoutHandle = -1),
			(this.callbackNode =
				this.next =
				this.pendingContext =
				this.context =
				this.cancelPendingCommit =
					null),
			(this.callbackPriority = 0),
			(this.expirationTimes = Kn(-1)),
			(this.entangledLanes =
				this.shellSuspendCounter =
				this.errorRecoveryDisabledLanes =
				this.expiredLanes =
				this.warmLanes =
				this.pingedLanes =
				this.suspendedLanes =
				this.pendingLanes =
					0),
			(this.entanglements = Kn(0)),
			(this.hiddenUpdates = Kn(null)),
			(this.identifierPrefix = s),
			(this.onUncaughtError = d),
			(this.onCaughtError = m),
			(this.onRecoverableError = x),
			(this.pooledCache = null),
			(this.pooledCacheLanes = 0),
			(this.formState = q),
			(this.incompleteTransitions = new Map());
	}
	function $0(e, t, a, s, d, m, x, A, q, ne, he, be) {
		return (
			(e = new _E(e, t, a, x, q, ne, he, be, A)),
			(t = 1),
			m === !0 && (t |= 24),
			(m = lr(3, null, null, t)),
			(e.current = m),
			(m.stateNode = e),
			(t = nd()),
			t.refCount++,
			(e.pooledCache = t),
			t.refCount++,
			(m.memoizedState = { element: s, isDehydrated: a, cache: t }),
			id(m),
			e
		);
	}
	function eb(e) {
		return e ? ((e = Pi), e) : Pi;
	}
	function tb(e, t, a, s, d, m) {
		(d = eb(d)),
			s.context === null ? (s.context = d) : (s.pendingContext = d),
			(s = da(t)),
			(s.payload = { element: a }),
			(m = m === void 0 ? null : m),
			m !== null && (s.callback = m),
			(a = ha(e, s, t)),
			a !== null && (tr(a, e, t), il(a, e, t));
	}
	function nb(e, t) {
		if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
			var a = e.retryLane;
			e.retryLane = a !== 0 && a < t ? a : t;
		}
	}
	function Rh(e, t) {
		nb(e, t), (e = e.alternate) && nb(e, t);
	}
	function rb(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = Za(e, 67108864);
			t !== null && tr(t, e, 67108864), Rh(e, 67108864);
		}
	}
	function ob(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = hr();
			t = Xt(t);
			var a = Za(e, t);
			a !== null && tr(a, e, t), Rh(e, t);
		}
	}
	var pc = !0;
	function DE(e, t, a, s) {
		var d = j.T;
		j.T = null;
		var m = I.p;
		try {
			(I.p = 2), Th(e, t, a, s);
		} finally {
			(I.p = m), (j.T = d);
		}
	}
	function NE(e, t, a, s) {
		var d = j.T;
		j.T = null;
		var m = I.p;
		try {
			(I.p = 8), Th(e, t, a, s);
		} finally {
			(I.p = m), (j.T = d);
		}
	}
	function Th(e, t, a, s) {
		if (pc) {
			var d = Ch(s);
			if (d === null) fh(e, t, s, mc, a), ib(e, s);
			else if (zE(d, e, t, a, s)) s.stopPropagation();
			else if ((ib(e, s), t & 4 && -1 < LE.indexOf(e))) {
				for (; d !== null; ) {
					var m = $r(d);
					if (m !== null)
						switch (m.tag) {
							case 3:
								if (((m = m.stateNode), m.current.memoizedState.isDehydrated)) {
									var x = Gt(m.pendingLanes);
									if (x !== 0) {
										var A = m;
										for (A.pendingLanes |= 2, A.entangledLanes |= 2; x; ) {
											var q = 1 << (31 - ht(x));
											(A.entanglements[1] |= q), (x &= ~q);
										}
										so(m), (Ot & 6) === 0 && ((Ju = qe() + 500), wl(0));
									}
								}
								break;
							case 31:
							case 13:
								(A = Za(m, 2)), A !== null && tr(A, m, 2), $u(), Rh(m, 2);
						}
					if (((m = Ch(s)), m === null && fh(e, t, s, mc, a), m === d)) break;
					d = m;
				}
				d !== null && s.stopPropagation();
			} else fh(e, t, s, null, a);
		}
	}
	function Ch(e) {
		return (e = Oi(e)), Oh(e);
	}
	var mc = null;
	function Oh(e) {
		if (((mc = null), (e = ta(e)), e !== null)) {
			var t = u(e);
			if (t === null) e = null;
			else {
				var a = t.tag;
				if (a === 13) {
					if (((e = c(t)), e !== null)) return e;
					e = null;
				} else if (a === 31) {
					if (((e = h(t)), e !== null)) return e;
					e = null;
				} else if (a === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated)
						return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return (mc = e), null;
	}
	function ab(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "resize":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart":
				return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave":
				return 8;
			case "message":
				switch (X()) {
					case Pe:
						return 2;
					case Jt:
						return 8;
					case st:
					case Mt:
						return 32;
					case wt:
						return 268435456;
					default:
						return 32;
				}
			default:
				return 32;
		}
	}
	var Ah = !1,
		Ra = null,
		Ta = null,
		Ca = null,
		Ml = new Map(),
		kl = new Map(),
		Oa = [],
		LE =
			"mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
				" "
			);
	function ib(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				Ra = null;
				break;
			case "dragenter":
			case "dragleave":
				Ta = null;
				break;
			case "mouseover":
			case "mouseout":
				Ca = null;
				break;
			case "pointerover":
			case "pointerout":
				Ml.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture":
				kl.delete(t.pointerId);
		}
	}
	function _l(e, t, a, s, d, m) {
		return e === null || e.nativeEvent !== m
			? ((e = {
					blockedOn: t,
					domEventName: a,
					eventSystemFlags: s,
					nativeEvent: m,
					targetContainers: [d],
			  }),
			  t !== null && ((t = $r(t)), t !== null && rb(t)),
			  e)
			: ((e.eventSystemFlags |= s),
			  (t = e.targetContainers),
			  d !== null && t.indexOf(d) === -1 && t.push(d),
			  e);
	}
	function zE(e, t, a, s, d) {
		switch (t) {
			case "focusin":
				return (Ra = _l(Ra, e, t, a, s, d)), !0;
			case "dragenter":
				return (Ta = _l(Ta, e, t, a, s, d)), !0;
			case "mouseover":
				return (Ca = _l(Ca, e, t, a, s, d)), !0;
			case "pointerover":
				var m = d.pointerId;
				return Ml.set(m, _l(Ml.get(m) || null, e, t, a, s, d)), !0;
			case "gotpointercapture":
				return (m = d.pointerId), kl.set(m, _l(kl.get(m) || null, e, t, a, s, d)), !0;
		}
		return !1;
	}
	function sb(e) {
		var t = ta(e.target);
		if (t !== null) {
			var a = u(t);
			if (a !== null) {
				if (((t = a.tag), t === 13)) {
					if (((t = c(a)), t !== null)) {
						(e.blockedOn = t),
							wi(e.priority, function () {
								ob(a);
							});
						return;
					}
				} else if (t === 31) {
					if (((t = h(a)), t !== null)) {
						(e.blockedOn = t),
							wi(e.priority, function () {
								ob(a);
							});
						return;
					}
				} else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function gc(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length; ) {
			var a = Ch(e.nativeEvent);
			if (a === null) {
				a = e.nativeEvent;
				var s = new a.constructor(a.type, a);
				(Ia = s), a.target.dispatchEvent(s), (Ia = null);
			} else return (t = $r(a)), t !== null && rb(t), (e.blockedOn = a), !1;
			t.shift();
		}
		return !0;
	}
	function lb(e, t, a) {
		gc(e) && a.delete(t);
	}
	function jE() {
		(Ah = !1),
			Ra !== null && gc(Ra) && (Ra = null),
			Ta !== null && gc(Ta) && (Ta = null),
			Ca !== null && gc(Ca) && (Ca = null),
			Ml.forEach(lb),
			kl.forEach(lb);
	}
	function yc(e, t) {
		e.blockedOn === t &&
			((e.blockedOn = null),
			Ah || ((Ah = !0), n.unstable_scheduleCallback(n.unstable_NormalPriority, jE)));
	}
	var bc = null;
	function ub(e) {
		bc !== e &&
			((bc = e),
			n.unstable_scheduleCallback(n.unstable_NormalPriority, function () {
				bc === e && (bc = null);
				for (var t = 0; t < e.length; t += 3) {
					var a = e[t],
						s = e[t + 1],
						d = e[t + 2];
					if (typeof s != "function") {
						if (Oh(s || a) === null) continue;
						break;
					}
					var m = $r(a);
					m !== null &&
						(e.splice(t, 3),
						(t -= 3),
						Cd(m, { pending: !0, data: d, method: a.method, action: s }, s, d));
				}
			}));
	}
	function fs(e) {
		function t(q) {
			return yc(q, e);
		}
		Ra !== null && yc(Ra, e),
			Ta !== null && yc(Ta, e),
			Ca !== null && yc(Ca, e),
			Ml.forEach(t),
			kl.forEach(t);
		for (var a = 0; a < Oa.length; a++) {
			var s = Oa[a];
			s.blockedOn === e && (s.blockedOn = null);
		}
		for (; 0 < Oa.length && ((a = Oa[0]), a.blockedOn === null); )
			sb(a), a.blockedOn === null && Oa.shift();
		if (((a = (e.ownerDocument || e).$$reactFormReplay), a != null))
			for (s = 0; s < a.length; s += 3) {
				var d = a[s],
					m = a[s + 1],
					x = d[sn] || null;
				if (typeof m == "function") x || ub(a);
				else if (x) {
					var A = null;
					if (m && m.hasAttribute("formAction")) {
						if (((d = m), (x = m[sn] || null))) A = x.formAction;
						else if (Oh(d) !== null) continue;
					} else A = x.action;
					typeof A == "function" ? (a[s + 1] = A) : (a.splice(s, 3), (s -= 3)), ub(a);
				}
			}
	}
	function cb() {
		function e(m) {
			m.canIntercept &&
				m.info === "react-transition" &&
				m.intercept({
					handler: function () {
						return new Promise(function (x) {
							return (d = x);
						});
					},
					focusReset: "manual",
					scroll: "manual",
				});
		}
		function t() {
			d !== null && (d(), (d = null)), s || setTimeout(a, 20);
		}
		function a() {
			if (!s && !navigation.transition) {
				var m = navigation.currentEntry;
				m &&
					m.url != null &&
					navigation.navigate(m.url, {
						state: m.getState(),
						info: "react-transition",
						history: "replace",
					});
			}
		}
		if (typeof navigation == "object") {
			var s = !1,
				d = null;
			return (
				navigation.addEventListener("navigate", e),
				navigation.addEventListener("navigatesuccess", t),
				navigation.addEventListener("navigateerror", t),
				setTimeout(a, 100),
				function () {
					(s = !0),
						navigation.removeEventListener("navigate", e),
						navigation.removeEventListener("navigatesuccess", t),
						navigation.removeEventListener("navigateerror", t),
						d !== null && (d(), (d = null));
				}
			);
		}
	}
	function Mh(e) {
		this._internalRoot = e;
	}
	(vc.prototype.render = Mh.prototype.render =
		function (e) {
			var t = this._internalRoot;
			if (t === null) throw Error(i(409));
			var a = t.current,
				s = hr();
			tb(a, s, e, t, null, null);
		}),
		(vc.prototype.unmount = Mh.prototype.unmount =
			function () {
				var e = this._internalRoot;
				if (e !== null) {
					this._internalRoot = null;
					var t = e.containerInfo;
					tb(e.current, 2, null, e, null, null), $u(), (t[ar] = null);
				}
			});
	function vc(e) {
		this._internalRoot = e;
	}
	vc.prototype.unstable_scheduleHydration = function (e) {
		if (e) {
			var t = Ur();
			e = { blockedOn: null, target: e, priority: t };
			for (var a = 0; a < Oa.length && t !== 0 && t < Oa[a].priority; a++);
			Oa.splice(a, 0, e), a === 0 && sb(e);
		}
	};
	var fb = r.version;
	if (fb !== "19.2.4") throw Error(i(527, fb, "19.2.4"));
	I.findDOMNode = function (e) {
		var t = e._reactInternals;
		if (t === void 0)
			throw typeof e.render == "function"
				? Error(i(188))
				: ((e = Object.keys(e).join(",")), Error(i(268, e)));
		return (
			(e = f(t)), (e = e !== null ? y(e) : null), (e = e === null ? null : e.stateNode), e
		);
	};
	var BE = {
		bundleType: 0,
		version: "19.2.4",
		rendererPackageName: "react-dom",
		currentDispatcherRef: j,
		reconcilerVersion: "19.2.4",
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ != "undefined") {
		var Sc = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!Sc.isDisabled && Sc.supportsFiber)
			try {
				(qn = Sc.inject(BE)), (Ze = Sc);
			} catch (e) {}
	}
	return (
		(Nl.createRoot = function (e, t) {
			if (!l(e)) throw Error(i(299));
			var a = !1,
				s = "",
				d = by,
				m = vy,
				x = Sy;
			return (
				t != null &&
					(t.unstable_strictMode === !0 && (a = !0),
					t.identifierPrefix !== void 0 && (s = t.identifierPrefix),
					t.onUncaughtError !== void 0 && (d = t.onUncaughtError),
					t.onCaughtError !== void 0 && (m = t.onCaughtError),
					t.onRecoverableError !== void 0 && (x = t.onRecoverableError)),
				(t = $0(e, 1, !1, null, null, a, s, null, d, m, x, cb)),
				(e[ar] = t.current),
				ch(e),
				new Mh(t)
			);
		}),
		(Nl.hydrateRoot = function (e, t, a) {
			if (!l(e)) throw Error(i(299));
			var s = !1,
				d = "",
				m = by,
				x = vy,
				A = Sy,
				q = null;
			return (
				a != null &&
					(a.unstable_strictMode === !0 && (s = !0),
					a.identifierPrefix !== void 0 && (d = a.identifierPrefix),
					a.onUncaughtError !== void 0 && (m = a.onUncaughtError),
					a.onCaughtError !== void 0 && (x = a.onCaughtError),
					a.onRecoverableError !== void 0 && (A = a.onRecoverableError),
					a.formState !== void 0 && (q = a.formState)),
				(t = $0(e, 1, !0, t, a != null ? a : null, s, d, q, m, x, A, cb)),
				(t.context = eb(null)),
				(a = t.current),
				(s = hr()),
				(s = Xt(s)),
				(d = da(s)),
				(d.callback = null),
				ha(a, d, s),
				(a = s),
				(t.current.lanes = a),
				Nt(t, a),
				so(t),
				(e[ar] = t.current),
				ch(e),
				new vc(t)
			);
		}),
		(Nl.version = "19.2.4"),
		Nl
	);
}
var Rb;
function JE() {
	if (Rb) return jh.exports;
	Rb = 1;
	function n() {
		if (
			!(
				typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ == "undefined" ||
				typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
			)
		)
			try {
				__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
			} catch (r) {
				console.error(r);
			}
	}
	return n(), (jh.exports = ZE()), jh.exports;
}
var WE = JE();
var Tb = "popstate";
function $E(n = {}) {
	function r(i, l) {
		let { pathname: u, search: c, hash: h } = i.location;
		return pp(
			"",
			{ pathname: u, search: c, hash: h },
			(l.state && l.state.usr) || null,
			(l.state && l.state.key) || "default"
		);
	}
	function o(i, l) {
		return typeof l == "string" ? l : Gl(l);
	}
	return t2(r, o, null, n);
}
function $t(n, r) {
	if (n === !1 || n === null || typeof n == "undefined") throw new Error(r);
}
function Jr(n, r) {
	if (!n) {
		typeof console != "undefined" && console.warn(r);
		try {
			throw new Error(r);
		} catch (o) {}
	}
}
function e2() {
	return Math.random().toString(36).substring(2, 10);
}
function Cb(n, r) {
	return { usr: n.state, key: n.key, idx: r };
}
function pp(n, r, o = null, i) {
	return _e(
		P(
			{ pathname: typeof n == "string" ? n : n.pathname, search: "", hash: "" },
			typeof r == "string" ? Ms(r) : r
		),
		{ state: o, key: (r && r.key) || i || e2() }
	);
}
function Gl({ pathname: n = "/", search: r = "", hash: o = "" }) {
	return (
		r && r !== "?" && (n += r.charAt(0) === "?" ? r : "?" + r),
		o && o !== "#" && (n += o.charAt(0) === "#" ? o : "#" + o),
		n
	);
}
function Ms(n) {
	let r = {};
	if (n) {
		let o = n.indexOf("#");
		o >= 0 && ((r.hash = n.substring(o)), (n = n.substring(0, o)));
		let i = n.indexOf("?");
		i >= 0 && ((r.search = n.substring(i)), (n = n.substring(0, i))), n && (r.pathname = n);
	}
	return r;
}
function t2(n, r, o, i = {}) {
	let { window: l = document.defaultView, v5Compat: u = !1 } = i,
		c = l.history,
		h = "POP",
		p = null,
		f = y();
	f == null && ((f = 0), c.replaceState(_e(P({}, c.state), { idx: f }), ""));
	function y() {
		return (c.state || { idx: null }).idx;
	}
	function g() {
		h = "POP";
		let O = y(),
			T = O == null ? null : O - f;
		(f = O), p && p({ action: h, location: R.location, delta: T });
	}
	function S(O, T) {
		h = "PUSH";
		let L = pp(R.location, O, T);
		f = y() + 1;
		let M = Cb(L, f),
			_ = R.createHref(L);
		try {
			c.pushState(M, "", _);
		} catch (N) {
			if (N instanceof DOMException && N.name === "DataCloneError") throw N;
			l.location.assign(_);
		}
		u && p && p({ action: h, location: R.location, delta: 1 });
	}
	function b(O, T) {
		h = "REPLACE";
		let L = pp(R.location, O, T);
		f = y();
		let M = Cb(L, f),
			_ = R.createHref(L);
		c.replaceState(M, "", _), u && p && p({ action: h, location: R.location, delta: 0 });
	}
	function w(O) {
		return n2(O);
	}
	let R = {
		get action() {
			return h;
		},
		get location() {
			return n(l, c);
		},
		listen(O) {
			if (p) throw new Error("A history only accepts one active listener");
			return (
				l.addEventListener(Tb, g),
				(p = O),
				() => {
					l.removeEventListener(Tb, g), (p = null);
				}
			);
		},
		createHref(O) {
			return r(l, O);
		},
		createURL: w,
		encodeLocation(O) {
			let T = w(O);
			return { pathname: T.pathname, search: T.search, hash: T.hash };
		},
		push: S,
		replace: b,
		go(O) {
			return c.go(O);
		},
	};
	return R;
}
function n2(n, r = !1) {
	let o = "http://localhost";
	typeof window != "undefined" &&
		(o = window.location.origin !== "null" ? window.location.origin : window.location.href),
		$t(o, "No window.location.(origin|href) available to create URL");
	let i = typeof n == "string" ? n : Gl(n);
	return (i = i.replace(/ $/, "%20")), !r && i.startsWith("//") && (i = o + i), new URL(i, o);
}
function a1(n, r, o = "/") {
	return r2(n, r, o, !1);
}
function r2(n, r, o, i) {
	let l = typeof r == "string" ? Ms(r) : r,
		u = Ko(l.pathname || "/", o);
	if (u == null) return null;
	let c = i1(n);
	o2(c);
	let h = null;
	for (let p = 0; h == null && p < c.length; ++p) {
		let f = m2(u);
		h = h2(c[p], f, i);
	}
	return h;
}
function i1(n, r = [], o = [], i = "", l = !1) {
	let u = (c, h, p = l, f) => {
		let y = {
			relativePath: f === void 0 ? c.path || "" : f,
			caseSensitive: c.caseSensitive === !0,
			childrenIndex: h,
			route: c,
		};
		if (y.relativePath.startsWith("/")) {
			if (!y.relativePath.startsWith(i) && p) return;
			$t(
				y.relativePath.startsWith(i),
				`Absolute route path "${y.relativePath}" nested under path "${i}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`
			),
				(y.relativePath = y.relativePath.slice(i.length));
		}
		let g = Xo([i, y.relativePath]),
			S = o.concat(y);
		c.children &&
			c.children.length > 0 &&
			($t(
				c.index !== !0,
				`Index routes must not have child routes. Please remove all child routes from route path "${g}".`
			),
			i1(c.children, r, S, g, p)),
			!(c.path == null && !c.index) &&
				r.push({ path: g, score: f2(g, c.index), routesMeta: S });
	};
	return (
		n.forEach((c, h) => {
			var p;
			if (c.path === "" || !((p = c.path) != null && p.includes("?"))) u(c, h);
			else for (let f of s1(c.path)) u(c, h, !0, f);
		}),
		r
	);
}
function s1(n) {
	let r = n.split("/");
	if (r.length === 0) return [];
	let [o, ...i] = r,
		l = o.endsWith("?"),
		u = o.replace(/\?$/, "");
	if (i.length === 0) return l ? [u, ""] : [u];
	let c = s1(i.join("/")),
		h = [];
	return (
		h.push(...c.map((p) => (p === "" ? u : [u, p].join("/")))),
		l && h.push(...c),
		h.map((p) => (n.startsWith("/") && p === "" ? "/" : p))
	);
}
function o2(n) {
	n.sort((r, o) =>
		r.score !== o.score
			? o.score - r.score
			: d2(
					r.routesMeta.map((i) => i.childrenIndex),
					o.routesMeta.map((i) => i.childrenIndex)
			  )
	);
}
var a2 = /^:[\w-]+$/,
	i2 = 3,
	s2 = 2,
	l2 = 1,
	u2 = 10,
	c2 = -2,
	Ob = (n) => n === "*";
function f2(n, r) {
	let o = n.split("/"),
		i = o.length;
	return (
		o.some(Ob) && (i += c2),
		r && (i += s2),
		o.filter((l) => !Ob(l)).reduce((l, u) => l + (a2.test(u) ? i2 : u === "" ? l2 : u2), i)
	);
}
function d2(n, r) {
	return n.length === r.length && n.slice(0, -1).every((i, l) => i === r[l])
		? n[n.length - 1] - r[r.length - 1]
		: 0;
}
function h2(n, r, o = !1) {
	let { routesMeta: i } = n,
		l = {},
		u = "/",
		c = [];
	for (let h = 0; h < i.length; ++h) {
		let p = i[h],
			f = h === i.length - 1,
			y = u === "/" ? r : r.slice(u.length) || "/",
			g = $c({ path: p.relativePath, caseSensitive: p.caseSensitive, end: f }, y),
			S = p.route;
		if (
			(!g &&
				f &&
				o &&
				!i[i.length - 1].route.index &&
				(g = $c({ path: p.relativePath, caseSensitive: p.caseSensitive, end: !1 }, y)),
			!g)
		)
			return null;
		Object.assign(l, g.params),
			c.push({
				params: l,
				pathname: Xo([u, g.pathname]),
				pathnameBase: v2(Xo([u, g.pathnameBase])),
				route: S,
			}),
			g.pathnameBase !== "/" && (u = Xo([u, g.pathnameBase]));
	}
	return c;
}
function $c(n, r) {
	typeof n == "string" && (n = { path: n, caseSensitive: !1, end: !0 });
	let [o, i] = p2(n.path, n.caseSensitive, n.end),
		l = r.match(o);
	if (!l) return null;
	let u = l[0],
		c = u.replace(/(.)\/+$/, "$1"),
		h = l.slice(1);
	return {
		params: i.reduce((f, { paramName: y, isOptional: g }, S) => {
			if (y === "*") {
				let w = h[S] || "";
				c = u.slice(0, u.length - w.length).replace(/(.)\/+$/, "$1");
			}
			const b = h[S];
			return g && !b ? (f[y] = void 0) : (f[y] = (b || "").replace(/%2F/g, "/")), f;
		}, {}),
		pathname: u,
		pathnameBase: c,
		pattern: n,
	};
}
function p2(n, r = !1, o = !0) {
	Jr(
		n === "*" || !n.endsWith("*") || n.endsWith("/*"),
		`Route path "${n}" will be treated as if it were "${n.replace(
			/\*$/,
			"/*"
		)}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${n.replace(
			/\*$/,
			"/*"
		)}".`
	);
	let i = [],
		l =
			"^" +
			n
				.replace(/\/*\*?$/, "")
				.replace(/^\/*/, "/")
				.replace(/[\\.*+^${}|()[\]]/g, "\\$&")
				.replace(
					/\/:([\w-]+)(\?)?/g,
					(c, h, p) => (
						i.push({ paramName: h, isOptional: p != null }),
						p ? "/?([^\\/]+)?" : "/([^\\/]+)"
					)
				)
				.replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
	return (
		n.endsWith("*")
			? (i.push({ paramName: "*" }),
			  (l += n === "*" || n === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
			: o
			? (l += "\\/*$")
			: n !== "" && n !== "/" && (l += "(?:(?=\\/|$))"),
		[new RegExp(l, r ? void 0 : "i"), i]
	);
}
function m2(n) {
	try {
		return n
			.split("/")
			.map((r) => decodeURIComponent(r).replace(/\//g, "%2F"))
			.join("/");
	} catch (r) {
		return (
			Jr(
				!1,
				`The URL path "${n}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${r}).`
			),
			n
		);
	}
}
function Ko(n, r) {
	if (r === "/") return n;
	if (!n.toLowerCase().startsWith(r.toLowerCase())) return null;
	let o = r.endsWith("/") ? r.length - 1 : r.length,
		i = n.charAt(o);
	return i && i !== "/" ? null : n.slice(o) || "/";
}
var g2 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
function y2(n, r = "/") {
	let { pathname: o, search: i = "", hash: l = "" } = typeof n == "string" ? Ms(n) : n,
		u;
	return (
		o
			? ((o = o.replace(/\/\/+/g, "/")),
			  o.startsWith("/") ? (u = Ab(o.substring(1), "/")) : (u = Ab(o, r)))
			: (u = r),
		{ pathname: u, search: S2(i), hash: x2(l) }
	);
}
function Ab(n, r) {
	let o = r.replace(/\/+$/, "").split("/");
	return (
		n.split("/").forEach((l) => {
			l === ".." ? o.length > 1 && o.pop() : l !== "." && o.push(l);
		}),
		o.length > 1 ? o.join("/") : "/"
	);
}
function qh(n, r, o, i) {
	return `Cannot include a '${n}' character in a manually specified \`to.${r}\` field [${JSON.stringify(
		i
	)}].  Please separate it out to the \`to.${o}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function b2(n) {
	return n.filter((r, o) => o === 0 || (r.route.path && r.route.path.length > 0));
}
function Kp(n) {
	let r = b2(n);
	return r.map((o, i) => (i === r.length - 1 ? o.pathname : o.pathnameBase));
}
function Qp(n, r, o, i = !1) {
	let l;
	typeof n == "string"
		? (l = Ms(n))
		: ((l = P({}, n)),
		  $t(!l.pathname || !l.pathname.includes("?"), qh("?", "pathname", "search", l)),
		  $t(!l.pathname || !l.pathname.includes("#"), qh("#", "pathname", "hash", l)),
		  $t(!l.search || !l.search.includes("#"), qh("#", "search", "hash", l)));
	let u = n === "" || l.pathname === "",
		c = u ? "/" : l.pathname,
		h;
	if (c == null) h = o;
	else {
		let g = r.length - 1;
		if (!i && c.startsWith("..")) {
			let S = c.split("/");
			for (; S[0] === ".."; ) S.shift(), (g -= 1);
			l.pathname = S.join("/");
		}
		h = g >= 0 ? r[g] : "/";
	}
	let p = y2(l, h),
		f = c && c !== "/" && c.endsWith("/"),
		y = (u || c === ".") && o.endsWith("/");
	return !p.pathname.endsWith("/") && (f || y) && (p.pathname += "/"), p;
}
var Xo = (n) => n.join("/").replace(/\/\/+/g, "/"),
	v2 = (n) => n.replace(/\/+$/, "").replace(/^\/*/, "/"),
	S2 = (n) => (!n || n === "?" ? "" : n.startsWith("?") ? n : "?" + n),
	x2 = (n) => (!n || n === "#" ? "" : n.startsWith("#") ? n : "#" + n),
	w2 = class {
		constructor(n, r, o, i = !1) {
			(this.status = n),
				(this.statusText = r || ""),
				(this.internal = i),
				o instanceof Error
					? ((this.data = o.toString()), (this.error = o))
					: (this.data = o);
		}
	};
function E2(n) {
	return (
		n != null &&
		typeof n.status == "number" &&
		typeof n.statusText == "string" &&
		typeof n.internal == "boolean" &&
		"data" in n
	);
}
function R2(n) {
	return (
		n
			.map((r) => r.route.path)
			.filter(Boolean)
			.join("/")
			.replace(/\/\/*/g, "/") || "/"
	);
}
var l1 =
	typeof window != "undefined" &&
	typeof window.document != "undefined" &&
	typeof window.document.createElement != "undefined";
function u1(n, r) {
	let o = n;
	if (typeof o != "string" || !g2.test(o)) return { absoluteURL: void 0, isExternal: !1, to: o };
	let i = o,
		l = !1;
	if (l1)
		try {
			let u = new URL(window.location.href),
				c = o.startsWith("//") ? new URL(u.protocol + o) : new URL(o),
				h = Ko(c.pathname, r);
			c.origin === u.origin && h != null ? (o = h + c.search + c.hash) : (l = !0);
		} catch (u) {
			Jr(
				!1,
				`<Link to="${o}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`
			);
		}
	return { absoluteURL: i, isExternal: l, to: o };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var c1 = ["POST", "PUT", "PATCH", "DELETE"];
new Set(c1);
var T2 = ["GET", ...c1];
new Set(T2);
var ks = v.createContext(null);
ks.displayName = "DataRouter";
var mf = v.createContext(null);
mf.displayName = "DataRouterState";
var C2 = v.createContext(!1),
	f1 = v.createContext({ isTransitioning: !1 });
f1.displayName = "ViewTransition";
var O2 = v.createContext(new Map());
O2.displayName = "Fetchers";
var A2 = v.createContext(null);
A2.displayName = "Await";
var yr = v.createContext(null);
yr.displayName = "Navigation";
var Ql = v.createContext(null);
Ql.displayName = "Location";
var jr = v.createContext({ outlet: null, matches: [], isDataRoute: !1 });
jr.displayName = "Route";
var Zp = v.createContext(null);
Zp.displayName = "RouteError";
var d1 = "REACT_ROUTER_ERROR",
	M2 = "REDIRECT",
	k2 = "ROUTE_ERROR_RESPONSE";
function _2(n) {
	if (n.startsWith(`${d1}:${M2}:{`))
		try {
			let r = JSON.parse(n.slice(28));
			if (
				typeof r == "object" &&
				r &&
				typeof r.status == "number" &&
				typeof r.statusText == "string" &&
				typeof r.location == "string" &&
				typeof r.reloadDocument == "boolean" &&
				typeof r.replace == "boolean"
			)
				return r;
		} catch (r) {}
}
function D2(n) {
	if (n.startsWith(`${d1}:${k2}:{`))
		try {
			let r = JSON.parse(n.slice(40));
			if (
				typeof r == "object" &&
				r &&
				typeof r.status == "number" &&
				typeof r.statusText == "string"
			)
				return new w2(r.status, r.statusText, r.data);
		} catch (r) {}
}
function N2(n, { relative: r } = {}) {
	$t(_s(), "useHref() may be used only in the context of a <Router> component.");
	let { basename: o, navigator: i } = v.useContext(yr),
		{ hash: l, pathname: u, search: c } = Zl(n, { relative: r }),
		h = u;
	return (
		o !== "/" && (h = u === "/" ? o : Xo([o, u])),
		i.createHref({ pathname: h, search: c, hash: l })
	);
}
function _s() {
	return v.useContext(Ql) != null;
}
function Jo() {
	return (
		$t(_s(), "useLocation() may be used only in the context of a <Router> component."),
		v.useContext(Ql).location
	);
}
var h1 =
	"You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function p1(n) {
	v.useContext(yr).static || v.useLayoutEffect(n);
}
function m1() {
	let { isDataRoute: n } = v.useContext(jr);
	return n ? K2() : L2();
}
function L2() {
	$t(_s(), "useNavigate() may be used only in the context of a <Router> component.");
	let n = v.useContext(ks),
		{ basename: r, navigator: o } = v.useContext(yr),
		{ matches: i } = v.useContext(jr),
		{ pathname: l } = Jo(),
		u = JSON.stringify(Kp(i)),
		c = v.useRef(!1);
	return (
		p1(() => {
			c.current = !0;
		}),
		v.useCallback(
			(p, f = {}) => {
				if ((Jr(c.current, h1), !c.current)) return;
				if (typeof p == "number") {
					o.go(p);
					return;
				}
				let y = Qp(p, JSON.parse(u), l, f.relative === "path");
				n == null &&
					r !== "/" &&
					(y.pathname = y.pathname === "/" ? r : Xo([r, y.pathname])),
					(f.replace ? o.replace : o.push)(y, f.state, f);
			},
			[r, o, u, l, n]
		)
	);
}
var z2 = v.createContext(null);
function j2(n) {
	let r = v.useContext(jr).outlet;
	return v.useMemo(() => r && v.createElement(z2.Provider, { value: n }, r), [r, n]);
}
function ek() {
	let { matches: n } = v.useContext(jr),
		r = n[n.length - 1];
	return r ? r.params : {};
}
function Zl(n, { relative: r } = {}) {
	let { matches: o } = v.useContext(jr),
		{ pathname: i } = Jo(),
		l = JSON.stringify(Kp(o));
	return v.useMemo(() => Qp(n, JSON.parse(l), i, r === "path"), [n, l, i, r]);
}
function B2(n, r) {
	return g1(n, r);
}
function g1(n, r, o, i, l) {
	var L;
	$t(_s(), "useRoutes() may be used only in the context of a <Router> component.");
	let { navigator: u } = v.useContext(yr),
		{ matches: c } = v.useContext(jr),
		h = c[c.length - 1],
		p = h ? h.params : {},
		f = h ? h.pathname : "/",
		y = h ? h.pathnameBase : "/",
		g = h && h.route;
	{
		let M = (g && g.path) || "";
		b1(
			f,
			!g || M.endsWith("*") || M.endsWith("*?"),
			`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${f}" (under <Route path="${M}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${M}"> to <Route path="${M === "/" ? "*" : `${M}/*`}">.`
		);
	}
	let S = Jo(),
		b;
	if (r) {
		let M = typeof r == "string" ? Ms(r) : r;
		$t(
			y === "/" || ((L = M.pathname) == null ? void 0 : L.startsWith(y)),
			`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${y}" but pathname "${M.pathname}" was given in the \`location\` prop.`
		),
			(b = M);
	} else b = S;
	let w = b.pathname || "/",
		R = w;
	if (y !== "/") {
		let M = y.replace(/^\//, "").split("/");
		R = "/" + w.replace(/^\//, "").split("/").slice(M.length).join("/");
	}
	let O = a1(n, { pathname: R });
	Jr(g || O != null, `No routes matched location "${b.pathname}${b.search}${b.hash}" `),
		Jr(
			O == null ||
				O[O.length - 1].route.element !== void 0 ||
				O[O.length - 1].route.Component !== void 0 ||
				O[O.length - 1].route.lazy !== void 0,
			`Matched leaf route at location "${b.pathname}${b.search}${b.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`
		);
	let T = V2(
		O &&
			O.map((M) =>
				Object.assign({}, M, {
					params: Object.assign({}, p, M.params),
					pathname: Xo([
						y,
						u.encodeLocation
							? u.encodeLocation(
									M.pathname.replace(/\?/g, "%3F").replace(/#/g, "%23")
							  ).pathname
							: M.pathname,
					]),
					pathnameBase:
						M.pathnameBase === "/"
							? y
							: Xo([
									y,
									u.encodeLocation
										? u.encodeLocation(
												M.pathnameBase
													.replace(/\?/g, "%3F")
													.replace(/#/g, "%23")
										  ).pathname
										: M.pathnameBase,
							  ]),
				})
			),
		c,
		o,
		i,
		l
	);
	return r && T
		? v.createElement(
				Ql.Provider,
				{
					value: {
						location: P(
							{ pathname: "/", search: "", hash: "", state: null, key: "default" },
							b
						),
						navigationType: "POP",
					},
				},
				T
		  )
		: T;
}
function U2() {
	let n = X2(),
		r = E2(n)
			? `${n.status} ${n.statusText}`
			: n instanceof Error
			? n.message
			: JSON.stringify(n),
		o = n instanceof Error ? n.stack : null,
		i = "rgba(200,200,200, 0.5)",
		l = { padding: "0.5rem", backgroundColor: i },
		u = { padding: "2px 4px", backgroundColor: i },
		c = null;
	return (
		console.error("Error handled by React Router default ErrorBoundary:", n),
		(c = v.createElement(
			v.Fragment,
			null,
			v.createElement("p", null, "💿 Hey developer 👋"),
			v.createElement(
				"p",
				null,
				"You can provide a way better UX than this when your app throws errors by providing your own ",
				v.createElement("code", { style: u }, "ErrorBoundary"),
				" or",
				" ",
				v.createElement("code", { style: u }, "errorElement"),
				" prop on your route."
			)
		)),
		v.createElement(
			v.Fragment,
			null,
			v.createElement("h2", null, "Unexpected Application Error!"),
			v.createElement("h3", { style: { fontStyle: "italic" } }, r),
			o ? v.createElement("pre", { style: l }, o) : null,
			c
		)
	);
}
var H2 = v.createElement(U2, null),
	y1 = class extends v.Component {
		constructor(n) {
			super(n),
				(this.state = {
					location: n.location,
					revalidation: n.revalidation,
					error: n.error,
				});
		}
		static getDerivedStateFromError(n) {
			return { error: n };
		}
		static getDerivedStateFromProps(n, r) {
			return r.location !== n.location ||
				(r.revalidation !== "idle" && n.revalidation === "idle")
				? { error: n.error, location: n.location, revalidation: n.revalidation }
				: {
						error: n.error !== void 0 ? n.error : r.error,
						location: r.location,
						revalidation: n.revalidation || r.revalidation,
				  };
		}
		componentDidCatch(n, r) {
			this.props.onError
				? this.props.onError(n, r)
				: console.error("React Router caught the following error during render", n);
		}
		render() {
			let n = this.state.error;
			if (
				this.context &&
				typeof n == "object" &&
				n &&
				"digest" in n &&
				typeof n.digest == "string"
			) {
				const o = D2(n.digest);
				o && (n = o);
			}
			let r =
				n !== void 0
					? v.createElement(
							jr.Provider,
							{ value: this.props.routeContext },
							v.createElement(Zp.Provider, {
								value: n,
								children: this.props.component,
							})
					  )
					: this.props.children;
			return this.context ? v.createElement(q2, { error: n }, r) : r;
		}
	};
y1.contextType = C2;
var Ph = new WeakMap();
function q2({ children: n, error: r }) {
	let { basename: o } = v.useContext(yr);
	if (typeof r == "object" && r && "digest" in r && typeof r.digest == "string") {
		let i = _2(r.digest);
		if (i) {
			let l = Ph.get(r);
			if (l) throw l;
			let u = u1(i.location, o);
			if (l1 && !Ph.get(r))
				if (u.isExternal || i.reloadDocument) window.location.href = u.absoluteURL || u.to;
				else {
					const c = Promise.resolve().then(() =>
						window.__reactRouterDataRouter.navigate(u.to, { replace: i.replace })
					);
					throw (Ph.set(r, c), c);
				}
			return v.createElement("meta", {
				httpEquiv: "refresh",
				content: `0;url=${u.absoluteURL || u.to}`,
			});
		}
	}
	return n;
}
function P2({ routeContext: n, match: r, children: o }) {
	let i = v.useContext(ks);
	return (
		i &&
			i.static &&
			i.staticContext &&
			(r.route.errorElement || r.route.ErrorBoundary) &&
			(i.staticContext._deepestRenderedBoundaryId = r.route.id),
		v.createElement(jr.Provider, { value: n }, o)
	);
}
function V2(n, r = [], o = null, i = null, l = null) {
	if (n == null) {
		if (!o) return null;
		if (o.errors) n = o.matches;
		else if (r.length === 0 && !o.initialized && o.matches.length > 0) n = o.matches;
		else return null;
	}
	let u = n,
		c = o == null ? void 0 : o.errors;
	if (c != null) {
		let y = u.findIndex((g) => g.route.id && (c == null ? void 0 : c[g.route.id]) !== void 0);
		$t(
			y >= 0,
			`Could not find a matching route for errors on route IDs: ${Object.keys(c).join(",")}`
		),
			(u = u.slice(0, Math.min(u.length, y + 1)));
	}
	let h = !1,
		p = -1;
	if (o)
		for (let y = 0; y < u.length; y++) {
			let g = u[y];
			if (
				((g.route.HydrateFallback || g.route.hydrateFallbackElement) && (p = y),
				g.route.id)
			) {
				let { loaderData: S, errors: b } = o,
					w =
						g.route.loader &&
						!S.hasOwnProperty(g.route.id) &&
						(!b || b[g.route.id] === void 0);
				if (g.route.lazy || w) {
					(h = !0), p >= 0 ? (u = u.slice(0, p + 1)) : (u = [u[0]]);
					break;
				}
			}
		}
	let f =
		o && i
			? (y, g) => {
					var S, b, w;
					i(y, {
						location: o.location,
						params:
							(w =
								(b = (S = o.matches) == null ? void 0 : S[0]) == null
									? void 0
									: b.params) != null
								? w
								: {},
						unstable_pattern: R2(o.matches),
						errorInfo: g,
					});
			  }
			: void 0;
	return u.reduceRight((y, g, S) => {
		let b,
			w = !1,
			R = null,
			O = null;
		o &&
			((b = c && g.route.id ? c[g.route.id] : void 0),
			(R = g.route.errorElement || H2),
			h &&
				(p < 0 && S === 0
					? (b1(
							"route-fallback",
							!1,
							"No `HydrateFallback` element provided to render during initial hydration"
					  ),
					  (w = !0),
					  (O = null))
					: p === S && ((w = !0), (O = g.route.hydrateFallbackElement || null))));
		let T = r.concat(u.slice(0, S + 1)),
			L = () => {
				let M;
				return (
					b
						? (M = R)
						: w
						? (M = O)
						: g.route.Component
						? (M = v.createElement(g.route.Component, null))
						: g.route.element
						? (M = g.route.element)
						: (M = y),
					v.createElement(P2, {
						match: g,
						routeContext: { outlet: y, matches: T, isDataRoute: o != null },
						children: M,
					})
				);
			};
		return o && (g.route.ErrorBoundary || g.route.errorElement || S === 0)
			? v.createElement(y1, {
					location: o.location,
					revalidation: o.revalidation,
					component: R,
					error: b,
					children: L(),
					routeContext: { outlet: null, matches: T, isDataRoute: !0 },
					onError: f,
			  })
			: L();
	}, null);
}
function Jp(n) {
	return `${n} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function Y2(n) {
	let r = v.useContext(ks);
	return $t(r, Jp(n)), r;
}
function I2(n) {
	let r = v.useContext(mf);
	return $t(r, Jp(n)), r;
}
function G2(n) {
	let r = v.useContext(jr);
	return $t(r, Jp(n)), r;
}
function Wp(n) {
	let r = G2(n),
		o = r.matches[r.matches.length - 1];
	return (
		$t(o.route.id, `${n} can only be used on routes that contain a unique "id"`), o.route.id
	);
}
function F2() {
	return Wp("useRouteId");
}
function X2() {
	var i;
	let n = v.useContext(Zp),
		r = I2("useRouteError"),
		o = Wp("useRouteError");
	return n !== void 0 ? n : (i = r.errors) == null ? void 0 : i[o];
}
function K2() {
	let { router: n } = Y2("useNavigate"),
		r = Wp("useNavigate"),
		o = v.useRef(!1);
	return (
		p1(() => {
			o.current = !0;
		}),
		v.useCallback(
			(c, ...h) =>
				Et(null, [c, ...h], function* (l, u = {}) {
					Jr(o.current, h1),
						o.current &&
							(typeof l == "number"
								? yield n.navigate(l)
								: yield n.navigate(l, P({ fromRouteId: r }, u)));
				}),
			[n, r]
		)
	);
}
var Mb = {};
function b1(n, r, o) {
	!r && !Mb[n] && ((Mb[n] = !0), Jr(!1, o));
}
v.memo(Q2);
function Q2({ routes: n, future: r, state: o, onError: i }) {
	return g1(n, void 0, o, i, r);
}
function Z2({ to: n, replace: r, state: o, relative: i }) {
	$t(_s(), "<Navigate> may be used only in the context of a <Router> component.");
	let { static: l } = v.useContext(yr);
	Jr(
		!l,
		"<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change."
	);
	let { matches: u } = v.useContext(jr),
		{ pathname: c } = Jo(),
		h = m1(),
		p = Qp(n, Kp(u), c, i === "path"),
		f = JSON.stringify(p);
	return (
		v.useEffect(() => {
			h(JSON.parse(f), { replace: r, state: o, relative: i });
		}, [h, f, i, r, o]),
		null
	);
}
function J2(n) {
	return j2(n.context);
}
function Io(n) {
	$t(
		!1,
		"A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>."
	);
}
function W2({
	basename: n = "/",
	children: r = null,
	location: o,
	navigationType: i = "POP",
	navigator: l,
	static: u = !1,
	unstable_useTransitions: c,
}) {
	$t(
		!_s(),
		"You cannot render a <Router> inside another <Router>. You should never have more than one in your app."
	);
	let h = n.replace(/^\/*/, "/"),
		p = v.useMemo(
			() => ({
				basename: h,
				navigator: l,
				static: u,
				unstable_useTransitions: c,
				future: {},
			}),
			[h, l, u, c]
		);
	typeof o == "string" && (o = Ms(o));
	let {
			pathname: f = "/",
			search: y = "",
			hash: g = "",
			state: S = null,
			key: b = "default",
		} = o,
		w = v.useMemo(() => {
			let R = Ko(f, h);
			return R == null
				? null
				: {
						location: { pathname: R, search: y, hash: g, state: S, key: b },
						navigationType: i,
				  };
		}, [h, f, y, g, S, b, i]);
	return (
		Jr(
			w != null,
			`<Router basename="${h}"> is not able to match the URL "${f}${y}${g}" because it does not start with the basename, so the <Router> won't render anything.`
		),
		w == null
			? null
			: v.createElement(
					yr.Provider,
					{ value: p },
					v.createElement(Ql.Provider, { children: r, value: w })
			  )
	);
}
function $2({ children: n, location: r }) {
	return B2(mp(n), r);
}
function mp(n, r = []) {
	let o = [];
	return (
		v.Children.forEach(n, (i, l) => {
			if (!v.isValidElement(i)) return;
			let u = [...r, l];
			if (i.type === v.Fragment) {
				o.push.apply(o, mp(i.props.children, u));
				return;
			}
			$t(
				i.type === Io,
				`[${
					typeof i.type == "string" ? i.type : i.type.name
				}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
			),
				$t(
					!i.props.index || !i.props.children,
					"An index route cannot have child routes."
				);
			let c = {
				id: i.props.id || u.join("-"),
				caseSensitive: i.props.caseSensitive,
				element: i.props.element,
				Component: i.props.Component,
				index: i.props.index,
				path: i.props.path,
				middleware: i.props.middleware,
				loader: i.props.loader,
				action: i.props.action,
				hydrateFallbackElement: i.props.hydrateFallbackElement,
				HydrateFallback: i.props.HydrateFallback,
				errorElement: i.props.errorElement,
				ErrorBoundary: i.props.ErrorBoundary,
				hasErrorBoundary:
					i.props.hasErrorBoundary === !0 ||
					i.props.ErrorBoundary != null ||
					i.props.errorElement != null,
				shouldRevalidate: i.props.shouldRevalidate,
				handle: i.props.handle,
				lazy: i.props.lazy,
			};
			i.props.children && (c.children = mp(i.props.children, u)), o.push(c);
		}),
		o
	);
}
var Vc = "get",
	Yc = "application/x-www-form-urlencoded";
function gf(n) {
	return typeof HTMLElement != "undefined" && n instanceof HTMLElement;
}
function eR(n) {
	return gf(n) && n.tagName.toLowerCase() === "button";
}
function tR(n) {
	return gf(n) && n.tagName.toLowerCase() === "form";
}
function nR(n) {
	return gf(n) && n.tagName.toLowerCase() === "input";
}
function rR(n) {
	return !!(n.metaKey || n.altKey || n.ctrlKey || n.shiftKey);
}
function oR(n, r) {
	return n.button === 0 && (!r || r === "_self") && !rR(n);
}
var wc = null;
function aR() {
	if (wc === null)
		try {
			new FormData(document.createElement("form"), 0), (wc = !1);
		} catch (n) {
			wc = !0;
		}
	return wc;
}
var iR = new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
function Vh(n) {
	return n != null && !iR.has(n)
		? (Jr(
				!1,
				`"${n}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Yc}"`
		  ),
		  null)
		: n;
}
function sR(n, r) {
	let o, i, l, u, c;
	if (tR(n)) {
		let h = n.getAttribute("action");
		(i = h ? Ko(h, r) : null),
			(o = n.getAttribute("method") || Vc),
			(l = Vh(n.getAttribute("enctype")) || Yc),
			(u = new FormData(n));
	} else if (eR(n) || (nR(n) && (n.type === "submit" || n.type === "image"))) {
		let h = n.form;
		if (h == null)
			throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
		let p = n.getAttribute("formaction") || h.getAttribute("action");
		if (
			((i = p ? Ko(p, r) : null),
			(o = n.getAttribute("formmethod") || h.getAttribute("method") || Vc),
			(l = Vh(n.getAttribute("formenctype")) || Vh(h.getAttribute("enctype")) || Yc),
			(u = new FormData(h, n)),
			!aR())
		) {
			let { name: f, type: y, value: g } = n;
			if (y === "image") {
				let S = f ? `${f}.` : "";
				u.append(`${S}x`, "0"), u.append(`${S}y`, "0");
			} else f && u.append(f, g);
		}
	} else {
		if (gf(n))
			throw new Error(
				'Cannot submit element that is not <form>, <button>, or <input type="submit|image">'
			);
		(o = Vc), (i = null), (l = Yc), (c = n);
	}
	return (
		u && l === "text/plain" && ((c = u), (u = void 0)),
		{ action: i, method: o.toLowerCase(), encType: l, formData: u, body: c }
	);
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function $p(n, r) {
	if (n === !1 || n === null || typeof n == "undefined") throw new Error(r);
}
function lR(n, r, o, i) {
	let l =
		typeof n == "string"
			? new URL(
					n,
					typeof window == "undefined" ? "server://singlefetch/" : window.location.origin
			  )
			: n;
	return (
		o
			? l.pathname.endsWith("/")
				? (l.pathname = `${l.pathname}_.${i}`)
				: (l.pathname = `${l.pathname}.${i}`)
			: l.pathname === "/"
			? (l.pathname = `_root.${i}`)
			: r && Ko(l.pathname, r) === "/"
			? (l.pathname = `${r.replace(/\/$/, "")}/_root.${i}`)
			: (l.pathname = `${l.pathname.replace(/\/$/, "")}.${i}`),
		l
	);
}
function uR(n, r) {
	return Et(this, null, function* () {
		if (n.id in r) return r[n.id];
		try {
			let o = yield import(n.module);
			return (r[n.id] = o), o;
		} catch (o) {
			return (
				console.error(`Error loading route module \`${n.module}\`, reloading page...`),
				console.error(o),
				window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
				window.location.reload(),
				new Promise(() => {})
			);
		}
	});
}
function cR(n) {
	return n == null
		? !1
		: n.href == null
		? n.rel === "preload" &&
		  typeof n.imageSrcSet == "string" &&
		  typeof n.imageSizes == "string"
		: typeof n.rel == "string" && typeof n.href == "string";
}
function fR(n, r, o) {
	return Et(this, null, function* () {
		let i = yield Promise.all(
			n.map((l) =>
				Et(null, null, function* () {
					let u = r.routes[l.route.id];
					if (u) {
						let c = yield uR(u, o);
						return c.links ? c.links() : [];
					}
					return [];
				})
			)
		);
		return mR(
			i
				.flat(1)
				.filter(cR)
				.filter((l) => l.rel === "stylesheet" || l.rel === "preload")
				.map((l) =>
					l.rel === "stylesheet"
						? _e(P({}, l), { rel: "prefetch", as: "style" })
						: _e(P({}, l), { rel: "prefetch" })
				)
		);
	});
}
function kb(n, r, o, i, l, u) {
	let c = (p, f) => (o[f] ? p.route.id !== o[f].route.id : !0),
		h = (p, f) => {
			var y;
			return (
				o[f].pathname !== p.pathname ||
				(((y = o[f].route.path) == null ? void 0 : y.endsWith("*")) &&
					o[f].params["*"] !== p.params["*"])
			);
		};
	return u === "assets"
		? r.filter((p, f) => c(p, f) || h(p, f))
		: u === "data"
		? r.filter((p, f) => {
				var g;
				let y = i.routes[p.route.id];
				if (!y || !y.hasLoader) return !1;
				if (c(p, f) || h(p, f)) return !0;
				if (p.route.shouldRevalidate) {
					let S = p.route.shouldRevalidate({
						currentUrl: new URL(l.pathname + l.search + l.hash, window.origin),
						currentParams: ((g = o[0]) == null ? void 0 : g.params) || {},
						nextUrl: new URL(n, window.origin),
						nextParams: p.params,
						defaultShouldRevalidate: !0,
					});
					if (typeof S == "boolean") return S;
				}
				return !0;
		  })
		: [];
}
function dR(n, r, { includeHydrateFallback: o } = {}) {
	return hR(
		n
			.map((i) => {
				let l = r.routes[i.route.id];
				if (!l) return [];
				let u = [l.module];
				return (
					l.clientActionModule && (u = u.concat(l.clientActionModule)),
					l.clientLoaderModule && (u = u.concat(l.clientLoaderModule)),
					o && l.hydrateFallbackModule && (u = u.concat(l.hydrateFallbackModule)),
					l.imports && (u = u.concat(l.imports)),
					u
				);
			})
			.flat(1)
	);
}
function hR(n) {
	return [...new Set(n)];
}
function pR(n) {
	let r = {},
		o = Object.keys(n).sort();
	for (let i of o) r[i] = n[i];
	return r;
}
function mR(n, r) {
	let o = new Set();
	return (
		new Set(r),
		n.reduce((i, l) => {
			let u = JSON.stringify(pR(l));
			return o.has(u) || (o.add(u), i.push({ key: u, link: l })), i;
		}, [])
	);
}
function v1() {
	let n = v.useContext(ks);
	return $p(n, "You must render this element inside a <DataRouterContext.Provider> element"), n;
}
function gR() {
	let n = v.useContext(mf);
	return (
		$p(n, "You must render this element inside a <DataRouterStateContext.Provider> element"), n
	);
}
var em = v.createContext(void 0);
em.displayName = "FrameworkContext";
function S1() {
	let n = v.useContext(em);
	return $p(n, "You must render this element inside a <HydratedRouter> element"), n;
}
function yR(n, r) {
	let o = v.useContext(em),
		[i, l] = v.useState(!1),
		[u, c] = v.useState(!1),
		{ onFocus: h, onBlur: p, onMouseEnter: f, onMouseLeave: y, onTouchStart: g } = r,
		S = v.useRef(null);
	v.useEffect(() => {
		if ((n === "render" && c(!0), n === "viewport")) {
			let R = (T) => {
					T.forEach((L) => {
						c(L.isIntersecting);
					});
				},
				O = new IntersectionObserver(R, { threshold: 0.5 });
			return (
				S.current && O.observe(S.current),
				() => {
					O.disconnect();
				}
			);
		}
	}, [n]),
		v.useEffect(() => {
			if (i) {
				let R = setTimeout(() => {
					c(!0);
				}, 100);
				return () => {
					clearTimeout(R);
				};
			}
		}, [i]);
	let b = () => {
			l(!0);
		},
		w = () => {
			l(!1), c(!1);
		};
	return o
		? n !== "intent"
			? [u, S, {}]
			: [
					u,
					S,
					{
						onFocus: Ll(h, b),
						onBlur: Ll(p, w),
						onMouseEnter: Ll(f, b),
						onMouseLeave: Ll(y, w),
						onTouchStart: Ll(g, b),
					},
			  ]
		: [!1, S, {}];
}
function Ll(n, r) {
	return (o) => {
		n && n(o), o.defaultPrevented || r(o);
	};
}
function bR(o) {
	var i = o,
		{ page: n } = i,
		r = Be(i, ["page"]);
	let { router: l } = v1(),
		u = v.useMemo(() => a1(l.routes, n, l.basename), [l.routes, n, l.basename]);
	return u ? v.createElement(SR, P({ page: n, matches: u }, r)) : null;
}
function vR(n) {
	let { manifest: r, routeModules: o } = S1(),
		[i, l] = v.useState([]);
	return (
		v.useEffect(() => {
			let u = !1;
			return (
				fR(n, r, o).then((c) => {
					u || l(c);
				}),
				() => {
					u = !0;
				}
			);
		}, [n, r, o]),
		i
	);
}
function SR(i) {
	var l = i,
		{ page: n, matches: r } = l,
		o = Be(l, ["page", "matches"]);
	let u = Jo(),
		{ future: c, manifest: h, routeModules: p } = S1(),
		{ basename: f } = v1(),
		{ loaderData: y, matches: g } = gR(),
		S = v.useMemo(() => kb(n, r, g, h, u, "data"), [n, r, g, h, u]),
		b = v.useMemo(() => kb(n, r, g, h, u, "assets"), [n, r, g, h, u]),
		w = v.useMemo(() => {
			if (n === u.pathname + u.search + u.hash) return [];
			let T = new Set(),
				L = !1;
			if (
				(r.forEach((_) => {
					var D;
					let N = h.routes[_.route.id];
					!N ||
						!N.hasLoader ||
						((!S.some((H) => H.route.id === _.route.id) &&
							_.route.id in y &&
							(D = p[_.route.id]) != null &&
							D.shouldRevalidate) ||
						N.hasClientLoader
							? (L = !0)
							: T.add(_.route.id));
				}),
				T.size === 0)
			)
				return [];
			let M = lR(n, f, c.unstable_trailingSlashAwareDataRequests, "data");
			return (
				L &&
					T.size > 0 &&
					M.searchParams.set(
						"_routes",
						r
							.filter((_) => T.has(_.route.id))
							.map((_) => _.route.id)
							.join(",")
					),
				[M.pathname + M.search]
			);
		}, [f, c.unstable_trailingSlashAwareDataRequests, y, u, h, S, r, n, p]),
		R = v.useMemo(() => dR(b, h), [b, h]),
		O = vR(b);
	return v.createElement(
		v.Fragment,
		null,
		w.map((T) =>
			v.createElement("link", P({ key: T, rel: "prefetch", as: "fetch", href: T }, o))
		),
		R.map((T) => v.createElement("link", P({ key: T, rel: "modulepreload", href: T }, o))),
		O.map(({ key: T, link: L }) => {
			var M;
			return v.createElement(
				"link",
				_e(P({ key: T, nonce: o.nonce }, L), {
					crossOrigin: (M = L.crossOrigin) != null ? M : o.crossOrigin,
				})
			);
		})
	);
}
function xR(...n) {
	return (r) => {
		n.forEach((o) => {
			typeof o == "function" ? o(r) : o != null && (o.current = r);
		});
	};
}
var wR =
	typeof window != "undefined" &&
	typeof window.document != "undefined" &&
	typeof window.document.createElement != "undefined";
try {
	wR && (window.__reactRouterVersion = "7.13.0");
} catch (n) {}
function ER({ basename: n, children: r, unstable_useTransitions: o, window: i }) {
	let l = v.useRef();
	l.current == null && (l.current = $E({ window: i, v5Compat: !0 }));
	let u = l.current,
		[c, h] = v.useState({ action: u.action, location: u.location }),
		p = v.useCallback(
			(f) => {
				o === !1 ? h(f) : v.startTransition(() => h(f));
			},
			[o]
		);
	return (
		v.useLayoutEffect(() => u.listen(p), [u, p]),
		v.createElement(W2, {
			basename: n,
			children: r,
			location: c.location,
			navigationType: c.action,
			navigator: u,
			unstable_useTransitions: o,
		})
	);
}
var x1 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
	w1 = v.forwardRef(function (R, w) {
		var O = R,
			{
				onClick: r,
				discover: o = "render",
				prefetch: i = "none",
				relative: l,
				reloadDocument: u,
				replace: c,
				state: h,
				target: p,
				to: f,
				preventScrollReset: y,
				viewTransition: g,
				unstable_defaultShouldRevalidate: S,
			} = O,
			b = Be(O, [
				"onClick",
				"discover",
				"prefetch",
				"relative",
				"reloadDocument",
				"replace",
				"state",
				"target",
				"to",
				"preventScrollReset",
				"viewTransition",
				"unstable_defaultShouldRevalidate",
			]);
		let { basename: T, unstable_useTransitions: L } = v.useContext(yr),
			M = typeof f == "string" && x1.test(f),
			_ = u1(f, T);
		f = _.to;
		let N = N2(f, { relative: l }),
			[D, H, U] = yR(i, b),
			fe = CR(f, {
				replace: c,
				state: h,
				target: p,
				preventScrollReset: y,
				relative: l,
				viewTransition: g,
				unstable_defaultShouldRevalidate: S,
				unstable_useTransitions: L,
			});
		function we(Y) {
			r && r(Y), Y.defaultPrevented || fe(Y);
		}
		let se = v.createElement(
			"a",
			_e(P(P({}, b), U), {
				href: _.absoluteURL || N,
				onClick: _.isExternal || u ? r : we,
				ref: xR(w, H),
				target: p,
				"data-discover": !M && o === "render" ? "true" : void 0,
			})
		);
		return D && !M
			? v.createElement(v.Fragment, null, se, v.createElement(bR, { page: N }))
			: se;
	});
w1.displayName = "Link";
var E1 = v.forwardRef(function (g, y) {
	var S = g,
		{
			"aria-current": r = "page",
			caseSensitive: o = !1,
			className: i = "",
			end: l = !1,
			style: u,
			to: c,
			viewTransition: h,
			children: p,
		} = S,
		f = Be(S, [
			"aria-current",
			"caseSensitive",
			"className",
			"end",
			"style",
			"to",
			"viewTransition",
			"children",
		]);
	let b = Zl(c, { relative: f.relative }),
		w = Jo(),
		R = v.useContext(mf),
		{ navigator: O, basename: T } = v.useContext(yr),
		L = R != null && _R(b) && h === !0,
		M = O.encodeLocation ? O.encodeLocation(b).pathname : b.pathname,
		_ = w.pathname,
		N = R && R.navigation && R.navigation.location ? R.navigation.location.pathname : null;
	o || ((_ = _.toLowerCase()), (N = N ? N.toLowerCase() : null), (M = M.toLowerCase())),
		N && T && (N = Ko(N, T) || N);
	const D = M !== "/" && M.endsWith("/") ? M.length - 1 : M.length;
	let H = _ === M || (!l && _.startsWith(M) && _.charAt(D) === "/"),
		U = N != null && (N === M || (!l && N.startsWith(M) && N.charAt(M.length) === "/")),
		fe = { isActive: H, isPending: U, isTransitioning: L },
		we = H ? r : void 0,
		se;
	typeof i == "function"
		? (se = i(fe))
		: (se = [i, H ? "active" : null, U ? "pending" : null, L ? "transitioning" : null]
				.filter(Boolean)
				.join(" "));
	let Y = typeof u == "function" ? u(fe) : u;
	return v.createElement(
		w1,
		_e(P({}, f), {
			"aria-current": we,
			className: se,
			ref: y,
			style: Y,
			to: c,
			viewTransition: h,
		}),
		typeof p == "function" ? p(fe) : p
	);
});
E1.displayName = "NavLink";
var RR = v.forwardRef((R, w) => {
	var O = R,
		{
			discover: n = "render",
			fetcherKey: r,
			navigate: o,
			reloadDocument: i,
			replace: l,
			state: u,
			method: c = Vc,
			action: h,
			onSubmit: p,
			relative: f,
			preventScrollReset: y,
			viewTransition: g,
			unstable_defaultShouldRevalidate: S,
		} = O,
		b = Be(O, [
			"discover",
			"fetcherKey",
			"navigate",
			"reloadDocument",
			"replace",
			"state",
			"method",
			"action",
			"onSubmit",
			"relative",
			"preventScrollReset",
			"viewTransition",
			"unstable_defaultShouldRevalidate",
		]);
	let { unstable_useTransitions: T } = v.useContext(yr),
		L = MR(),
		M = kR(h, { relative: f }),
		_ = c.toLowerCase() === "get" ? "get" : "post",
		N = typeof h == "string" && x1.test(h),
		D = (H) => {
			if ((p && p(H), H.defaultPrevented)) return;
			H.preventDefault();
			let U = H.nativeEvent.submitter,
				fe = (U == null ? void 0 : U.getAttribute("formmethod")) || c,
				we = () =>
					L(U || H.currentTarget, {
						fetcherKey: r,
						method: fe,
						navigate: o,
						replace: l,
						state: u,
						relative: f,
						preventScrollReset: y,
						viewTransition: g,
						unstable_defaultShouldRevalidate: S,
					});
			T && o !== !1 ? v.startTransition(() => we()) : we();
		};
	return v.createElement(
		"form",
		_e(P({ ref: w, method: _, action: M, onSubmit: i ? p : D }, b), {
			"data-discover": !N && n === "render" ? "true" : void 0,
		})
	);
});
RR.displayName = "Form";
function TR(n) {
	return `${n} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function R1(n) {
	let r = v.useContext(ks);
	return $t(r, TR(n)), r;
}
function CR(
	n,
	{
		target: r,
		replace: o,
		state: i,
		preventScrollReset: l,
		relative: u,
		viewTransition: c,
		unstable_defaultShouldRevalidate: h,
		unstable_useTransitions: p,
	} = {}
) {
	let f = m1(),
		y = Jo(),
		g = Zl(n, { relative: u });
	return v.useCallback(
		(S) => {
			if (oR(S, r)) {
				S.preventDefault();
				let b = o !== void 0 ? o : Gl(y) === Gl(g),
					w = () =>
						f(n, {
							replace: b,
							state: i,
							preventScrollReset: l,
							relative: u,
							viewTransition: c,
							unstable_defaultShouldRevalidate: h,
						});
				p ? v.startTransition(() => w()) : w();
			}
		},
		[y, f, g, o, i, r, n, l, u, c, h, p]
	);
}
var OR = 0,
	AR = () => `__${String(++OR)}__`;
function MR() {
	let { router: n } = R1("useSubmit"),
		{ basename: r } = v.useContext(yr),
		o = F2(),
		i = n.fetch,
		l = n.navigate;
	return v.useCallback(
		(h, ...p) =>
			Et(null, [h, ...p], function* (u, c = {}) {
				let { action: f, method: y, encType: g, formData: S, body: b } = sR(u, r);
				if (c.navigate === !1) {
					let w = c.fetcherKey || AR();
					yield i(w, o, c.action || f, {
						unstable_defaultShouldRevalidate: c.unstable_defaultShouldRevalidate,
						preventScrollReset: c.preventScrollReset,
						formData: S,
						body: b,
						formMethod: c.method || y,
						formEncType: c.encType || g,
						flushSync: c.flushSync,
					});
				} else yield l(c.action || f, { unstable_defaultShouldRevalidate: c.unstable_defaultShouldRevalidate, preventScrollReset: c.preventScrollReset, formData: S, body: b, formMethod: c.method || y, formEncType: c.encType || g, replace: c.replace, state: c.state, fromRouteId: o, flushSync: c.flushSync, viewTransition: c.viewTransition });
			}),
		[i, l, r, o]
	);
}
function kR(n, { relative: r } = {}) {
	let { basename: o } = v.useContext(yr),
		i = v.useContext(jr);
	$t(i, "useFormAction must be used inside a RouteContext");
	let [l] = i.matches.slice(-1),
		u = P({}, Zl(n || ".", { relative: r })),
		c = Jo();
	if (n == null) {
		u.search = c.search;
		let h = new URLSearchParams(u.search),
			p = h.getAll("index");
		if (p.some((y) => y === "")) {
			h.delete("index"), p.filter((g) => g).forEach((g) => h.append("index", g));
			let y = h.toString();
			u.search = y ? `?${y}` : "";
		}
	}
	return (
		(!n || n === ".") &&
			l.route.index &&
			(u.search = u.search ? u.search.replace(/^\?/, "?index&") : "?index"),
		o !== "/" && (u.pathname = u.pathname === "/" ? o : Xo([o, u.pathname])),
		Gl(u)
	);
}
function _R(n, { relative: r } = {}) {
	let o = v.useContext(f1);
	$t(
		o != null,
		"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?"
	);
	let { basename: i } = R1("useViewTransitionState"),
		l = Zl(n, { relative: r });
	if (!o.isTransitioning) return !1;
	let u = Ko(o.currentLocation.pathname, i) || o.currentLocation.pathname,
		c = Ko(o.nextLocation.pathname, i) || o.nextLocation.pathname;
	return $c(l.pathname, c) != null || $c(l.pathname, u) != null;
}
var DR = Object.defineProperty,
	NR = (n, r, o) =>
		r in n
			? DR(n, r, { enumerable: !0, configurable: !0, writable: !0, value: o })
			: (n[r] = o),
	ci = (n, r, o) => NR(n, typeof r != "symbol" ? r + "" : r, o),
	LR =
		typeof globalThis < "u"
			? globalThis
			: typeof window < "u"
			? window
			: typeof global < "u"
			? global
			: typeof self < "u"
			? self
			: {},
	hs = {},
	zl = {},
	Yr = {},
	_b;
function T1() {
	if (_b) return Yr;
	_b = 1;
	var n =
			(Yr && Yr.__assign) ||
			function () {
				return (
					(n =
						Object.assign ||
						function (l) {
							for (var u, c = 1, h = arguments.length; c < h; c++) {
								u = arguments[c];
								for (var p in u)
									Object.prototype.hasOwnProperty.call(u, p) && (l[p] = u[p]);
							}
							return l;
						}),
					n.apply(this, arguments)
				);
			},
		r =
			(Yr && Yr.__awaiter) ||
			function (l, u, c, h) {
				function p(f) {
					return f instanceof c
						? f
						: new c(function (y) {
								y(f);
						  });
				}
				return new (c || (c = Promise))(function (f, y) {
					function g(w) {
						try {
							b(h.next(w));
						} catch (R) {
							y(R);
						}
					}
					function S(w) {
						try {
							b(h.throw(w));
						} catch (R) {
							y(R);
						}
					}
					function b(w) {
						w.done ? f(w.value) : p(w.value).then(g, S);
					}
					b((h = h.apply(l, u || [])).next());
				});
			},
		o =
			(Yr && Yr.__generator) ||
			function (l, u) {
				var c = {
						label: 0,
						sent: function () {
							if (f[0] & 1) throw f[1];
							return f[1];
						},
						trys: [],
						ops: [],
					},
					h,
					p,
					f,
					y;
				return (
					(y = { next: g(0), throw: g(1), return: g(2) }),
					typeof Symbol == "function" &&
						(y[Symbol.iterator] = function () {
							return this;
						}),
					y
				);
				function g(b) {
					return function (w) {
						return S([b, w]);
					};
				}
				function S(b) {
					if (h) throw new TypeError("Generator is already executing.");
					for (; y && ((y = 0), b[0] && (c = 0)), c; )
						try {
							if (
								((h = 1),
								p &&
									(f =
										b[0] & 2
											? p.return
											: b[0]
											? p.throw || ((f = p.return) && f.call(p), 0)
											: p.next) &&
									!(f = f.call(p, b[1])).done)
							)
								return f;
							switch (((p = 0), f && (b = [b[0] & 2, f.value]), b[0])) {
								case 0:
								case 1:
									f = b;
									break;
								case 4:
									return c.label++, { value: b[1], done: !1 };
								case 5:
									c.label++, (p = b[1]), (b = [0]);
									continue;
								case 7:
									(b = c.ops.pop()), c.trys.pop();
									continue;
								default:
									if (
										((f = c.trys),
										!(f = f.length > 0 && f[f.length - 1]) &&
											(b[0] === 6 || b[0] === 2))
									) {
										c = 0;
										continue;
									}
									if (b[0] === 3 && (!f || (b[1] > f[0] && b[1] < f[3]))) {
										c.label = b[1];
										break;
									}
									if (b[0] === 6 && c.label < f[1]) {
										(c.label = f[1]), (f = b);
										break;
									}
									if (f && c.label < f[2]) {
										(c.label = f[2]), c.ops.push(b);
										break;
									}
									f[2] && c.ops.pop(), c.trys.pop();
									continue;
							}
							b = u.call(l, c);
						} catch (w) {
							(b = [6, w]), (p = 0);
						} finally {
							h = f = 0;
						}
					if (b[0] & 5) throw b[1];
					return { value: b[0] ? b[1] : void 0, done: !0 };
				}
			};
	Object.defineProperty(Yr, "__esModule", { value: !0 }), (Yr.FrappeCall = void 0);
	var i = (function () {
		function l(u, c, h, p, f) {
			(this.appURL = u),
				(this.axios = c),
				(this.useToken = h != null ? h : !1),
				(this.token = p),
				(this.tokenType = f);
		}
		return (
			(l.prototype.get = function (u, c) {
				return r(this, void 0, void 0, function () {
					var h;
					return o(this, function (p) {
						return (
							(h = new URLSearchParams()),
							c &&
								Object.entries(c).forEach(function (f) {
									var y = f[0],
										g = f[1];
									if (g != null) {
										var S = typeof g == "object" ? JSON.stringify(g) : g;
										h.set(y, S);
									}
								}),
							[
								2,
								this.axios
									.get("/api/method/".concat(u), { params: h })
									.then(function (f) {
										return f.data;
									})
									.catch(function (f) {
										var y, g;
										throw n(n({}, f.response.data), {
											httpStatus: f.response.status,
											httpStatusText: f.response.statusText,
											message:
												(y = f.response.data.message) !== null &&
												y !== void 0
													? y
													: "There was an error.",
											exception:
												(g = f.response.data.exception) !== null &&
												g !== void 0
													? g
													: "",
										});
									}),
							]
						);
					});
				});
			}),
			(l.prototype.post = function (u, c) {
				return r(this, void 0, void 0, function () {
					return o(this, function (h) {
						return [
							2,
							this.axios
								.post("/api/method/".concat(u), n({}, c))
								.then(function (p) {
									return p.data;
								})
								.catch(function (p) {
									var f, y;
									throw n(n({}, p.response.data), {
										httpStatus: p.response.status,
										httpStatusText: p.response.statusText,
										message:
											(f = p.response.data.message) !== null && f !== void 0
												? f
												: "There was an error.",
										exception:
											(y = p.response.data.exception) !== null &&
											y !== void 0
												? y
												: "",
									});
								}),
						];
					});
				});
			}),
			(l.prototype.put = function (u, c) {
				return r(this, void 0, void 0, function () {
					return o(this, function (h) {
						return [
							2,
							this.axios
								.put("/api/method/".concat(u), n({}, c))
								.then(function (p) {
									return p.data;
								})
								.catch(function (p) {
									var f, y;
									throw n(n({}, p.response.data), {
										httpStatus: p.response.status,
										httpStatusText: p.response.statusText,
										message:
											(f = p.response.data.message) !== null && f !== void 0
												? f
												: "There was an error.",
										exception:
											(y = p.response.data.exception) !== null &&
											y !== void 0
												? y
												: "",
									});
								}),
						];
					});
				});
			}),
			(l.prototype.delete = function (u, c) {
				return r(this, void 0, void 0, function () {
					return o(this, function (h) {
						return [
							2,
							this.axios
								.delete("/api/method/".concat(u), { params: c })
								.then(function (p) {
									return p.data;
								})
								.catch(function (p) {
									var f, y;
									throw n(n({}, p.response.data), {
										httpStatus: p.response.status,
										httpStatusText: p.response.statusText,
										message:
											(f = p.response.data.message) !== null && f !== void 0
												? f
												: "There was an error.",
										exception:
											(y = p.response.data.exception) !== null &&
											y !== void 0
												? y
												: "",
									});
								}),
						];
					});
				});
			}),
			l
		);
	})();
	return (Yr.FrappeCall = i), Yr;
}
var Ir = {},
	Db;
function C1() {
	if (Db) return Ir;
	Db = 1;
	var n =
			(Ir && Ir.__assign) ||
			function () {
				return (
					(n =
						Object.assign ||
						function (l) {
							for (var u, c = 1, h = arguments.length; c < h; c++) {
								u = arguments[c];
								for (var p in u)
									Object.prototype.hasOwnProperty.call(u, p) && (l[p] = u[p]);
							}
							return l;
						}),
					n.apply(this, arguments)
				);
			},
		r =
			(Ir && Ir.__awaiter) ||
			function (l, u, c, h) {
				function p(f) {
					return f instanceof c
						? f
						: new c(function (y) {
								y(f);
						  });
				}
				return new (c || (c = Promise))(function (f, y) {
					function g(w) {
						try {
							b(h.next(w));
						} catch (R) {
							y(R);
						}
					}
					function S(w) {
						try {
							b(h.throw(w));
						} catch (R) {
							y(R);
						}
					}
					function b(w) {
						w.done ? f(w.value) : p(w.value).then(g, S);
					}
					b((h = h.apply(l, u || [])).next());
				});
			},
		o =
			(Ir && Ir.__generator) ||
			function (l, u) {
				var c = {
						label: 0,
						sent: function () {
							if (f[0] & 1) throw f[1];
							return f[1];
						},
						trys: [],
						ops: [],
					},
					h,
					p,
					f,
					y;
				return (
					(y = { next: g(0), throw: g(1), return: g(2) }),
					typeof Symbol == "function" &&
						(y[Symbol.iterator] = function () {
							return this;
						}),
					y
				);
				function g(b) {
					return function (w) {
						return S([b, w]);
					};
				}
				function S(b) {
					if (h) throw new TypeError("Generator is already executing.");
					for (; y && ((y = 0), b[0] && (c = 0)), c; )
						try {
							if (
								((h = 1),
								p &&
									(f =
										b[0] & 2
											? p.return
											: b[0]
											? p.throw || ((f = p.return) && f.call(p), 0)
											: p.next) &&
									!(f = f.call(p, b[1])).done)
							)
								return f;
							switch (((p = 0), f && (b = [b[0] & 2, f.value]), b[0])) {
								case 0:
								case 1:
									f = b;
									break;
								case 4:
									return c.label++, { value: b[1], done: !1 };
								case 5:
									c.label++, (p = b[1]), (b = [0]);
									continue;
								case 7:
									(b = c.ops.pop()), c.trys.pop();
									continue;
								default:
									if (
										((f = c.trys),
										!(f = f.length > 0 && f[f.length - 1]) &&
											(b[0] === 6 || b[0] === 2))
									) {
										c = 0;
										continue;
									}
									if (b[0] === 3 && (!f || (b[1] > f[0] && b[1] < f[3]))) {
										c.label = b[1];
										break;
									}
									if (b[0] === 6 && c.label < f[1]) {
										(c.label = f[1]), (f = b);
										break;
									}
									if (f && c.label < f[2]) {
										(c.label = f[2]), c.ops.push(b);
										break;
									}
									f[2] && c.ops.pop(), c.trys.pop();
									continue;
							}
							b = u.call(l, c);
						} catch (w) {
							(b = [6, w]), (p = 0);
						} finally {
							h = f = 0;
						}
					if (b[0] & 5) throw b[1];
					return { value: b[0] ? b[1] : void 0, done: !0 };
				}
			};
	Object.defineProperty(Ir, "__esModule", { value: !0 }), (Ir.FrappeDB = void 0);
	var i = (function () {
		function l(u, c, h, p, f) {
			(this.appURL = u),
				(this.axios = c),
				(this.useToken = h != null ? h : !1),
				(this.token = p),
				(this.tokenType = f);
		}
		return (
			(l.prototype.getDoc = function (u, c) {
				return (
					c === void 0 && (c = ""),
					r(this, void 0, void 0, function () {
						return o(this, function (h) {
							return [
								2,
								this.axios
									.get(
										"/api/resource/"
											.concat(u, "/")
											.concat(encodeURIComponent(c))
									)
									.then(function (p) {
										return p.data.data;
									})
									.catch(function (p) {
										var f, y;
										throw n(n({}, p.response.data), {
											httpStatus: p.response.status,
											httpStatusText: p.response.statusText,
											message:
												"There was an error while fetching the document.",
											exception:
												(y =
													(f = p.response.data.exception) !== null &&
													f !== void 0
														? f
														: p.response.data.exc_type) !== null &&
												y !== void 0
													? y
													: "",
										});
									}),
							];
						});
					})
				);
			}),
			(l.prototype.getDocList = function (u, c) {
				var h;
				return r(this, void 0, void 0, function () {
					var p, f, y, g, S, b, w, R, O, T, L;
					return o(this, function (M) {
						return (
							(p = {}),
							c &&
								((f = c.fields),
								(y = c.filters),
								(g = c.orFilters),
								(S = c.orderBy),
								(b = c.limit),
								(w = c.limit_start),
								(R = c.groupBy),
								(O = c.asDict),
								(T = O === void 0 ? !0 : O),
								(L = S
									? ""
											.concat(String(S == null ? void 0 : S.field), " ")
											.concat(
												(h = S == null ? void 0 : S.order) !== null &&
													h !== void 0
													? h
													: "asc"
											)
									: ""),
								(p = {
									fields: f ? JSON.stringify(f) : void 0,
									filters: y ? JSON.stringify(y) : void 0,
									or_filters: g ? JSON.stringify(g) : void 0,
									order_by: L,
									group_by: R,
									limit: b,
									limit_start: w,
									as_dict: T,
								})),
							[
								2,
								this.axios
									.get("/api/resource/".concat(u), { params: p })
									.then(function (_) {
										return _.data.data;
									})
									.catch(function (_) {
										var N, D;
										throw n(n({}, _.response.data), {
											httpStatus: _.response.status,
											httpStatusText: _.response.statusText,
											message:
												"There was an error while fetching the documents.",
											exception:
												(D =
													(N = _.response.data.exception) !== null &&
													N !== void 0
														? N
														: _.response.data.exc_type) !== null &&
												D !== void 0
													? D
													: "",
										});
									}),
							]
						);
					});
				});
			}),
			(l.prototype.createDoc = function (u, c) {
				return r(this, void 0, void 0, function () {
					return o(this, function (h) {
						return [
							2,
							this.axios
								.post("/api/resource/".concat(u), n({}, c))
								.then(function (p) {
									return p.data.data;
								})
								.catch(function (p) {
									var f, y, g;
									throw n(n({}, p.response.data), {
										httpStatus: p.response.status,
										httpStatusText: p.response.statusText,
										message:
											(f = p.response.data.message) !== null && f !== void 0
												? f
												: "There was an error while creating the document.",
										exception:
											(g =
												(y = p.response.data.exception) !== null &&
												y !== void 0
													? y
													: p.response.data.exc_type) !== null &&
											g !== void 0
												? g
												: "",
									});
								}),
						];
					});
				});
			}),
			(l.prototype.updateDoc = function (u, c, h) {
				return r(this, void 0, void 0, function () {
					return o(this, function (p) {
						return [
							2,
							this.axios
								.put(
									"/api/resource/"
										.concat(u, "/")
										.concat(c && encodeURIComponent(c)),
									n({}, h)
								)
								.then(function (f) {
									return f.data.data;
								})
								.catch(function (f) {
									var y, g, S;
									throw n(n({}, f.response.data), {
										httpStatus: f.response.status,
										httpStatusText: f.response.statusText,
										message:
											(y = f.response.data.message) !== null && y !== void 0
												? y
												: "There was an error while updating the document.",
										exception:
											(S =
												(g = f.response.data.exception) !== null &&
												g !== void 0
													? g
													: f.response.data.exc_type) !== null &&
											S !== void 0
												? S
												: "",
									});
								}),
						];
					});
				});
			}),
			(l.prototype.deleteDoc = function (u, c) {
				return r(this, void 0, void 0, function () {
					return o(this, function (h) {
						return [
							2,
							this.axios
								.delete(
									"/api/resource/"
										.concat(u, "/")
										.concat(c && encodeURIComponent(c))
								)
								.then(function (p) {
									return p.data;
								})
								.catch(function (p) {
									var f, y;
									throw n(n({}, p.response.data), {
										httpStatus: p.response.status,
										httpStatusText: p.response.statusText,
										message: "There was an error while deleting the document.",
										exception:
											(y =
												(f = p.response.data.exception) !== null &&
												f !== void 0
													? f
													: p.response.data.exc_type) !== null &&
											y !== void 0
												? y
												: "",
									});
								}),
						];
					});
				});
			}),
			(l.prototype.getCount = function (u, c, h) {
				return (
					h === void 0 && (h = !1),
					r(this, void 0, void 0, function () {
						var p;
						return o(this, function (f) {
							return (
								(p = { doctype: u, filters: [] }),
								h && (p.debug = h),
								c && (p.filters = c ? JSON.stringify(c) : void 0),
								[
									2,
									this.axios
										.get("/api/method/frappe.client.get_count", { params: p })
										.then(function (y) {
											return y.data.message;
										})
										.catch(function (y) {
											var g, S;
											throw n(n({}, y.response.data), {
												httpStatus: y.response.status,
												httpStatusText: y.response.statusText,
												message:
													"There was an error while getting the count.",
												exception:
													(S =
														(g = y.response.data.exception) !== null &&
														g !== void 0
															? g
															: y.response.data.exc_type) !== null &&
													S !== void 0
														? S
														: "",
											});
										}),
								]
							);
						});
					})
				);
			}),
			(l.prototype.getLastDoc = function (u, c) {
				return r(this, void 0, void 0, function () {
					var h, p;
					return o(this, function (f) {
						switch (f.label) {
							case 0:
								return (
									(h = { orderBy: { field: "creation", order: "desc" } }),
									c && (h = n(n({}, h), c)),
									[
										4,
										this.getDocList(
											u,
											n(n({}, h), { limit: 1, fields: ["name"] })
										),
									]
								);
							case 1:
								return (
									(p = f.sent()),
									p.length > 0 ? [2, this.getDoc(u, p[0].name)] : [2, {}]
								);
						}
					});
				});
			}),
			(l.prototype.renameDoc = function (u, c, h, p) {
				return (
					p === void 0 && (p = !1),
					r(this, void 0, void 0, function () {
						return o(this, function (f) {
							return [
								2,
								this.axios
									.post("/api/method/frappe.client.rename_doc", {
										doctype: u,
										old_name: c,
										new_name: h,
										merge: p,
									})
									.then(function (y) {
										return y.data;
									})
									.catch(function (y) {
										var g, S, b;
										throw n(n({}, y.response.data), {
											httpStatus: y.response.status,
											httpStatusText: y.response.statusText,
											message:
												(g = y.response.data.message) !== null &&
												g !== void 0
													? g
													: "There was an error while renaming the document.",
											exception:
												(b =
													(S = y.response.data.exception) !== null &&
													S !== void 0
														? S
														: y.response.data.exc_type) !== null &&
												b !== void 0
													? b
													: "",
										});
									}),
							];
						});
					})
				);
			}),
			(l.prototype.getValue = function (u, c, h, p, f, y) {
				return (
					p === void 0 && (p = !0),
					f === void 0 && (f = !1),
					y === void 0 && (y = null),
					r(this, void 0, void 0, function () {
						var g;
						return o(this, function (S) {
							return (
								(g = {
									doctype: u,
									fieldname: "[]",
									filters: [],
									as_dict: p,
									debug: f,
									parent: null,
								}),
								c && (g.fieldname = typeof c == "object" ? JSON.stringify(c) : c),
								h && (g.filters = h ? JSON.stringify(h) : void 0),
								y && (g.parent = y),
								[
									2,
									this.axios
										.get("/api/method/frappe.client.get_value", { params: g })
										.then(function (b) {
											return b.data;
										})
										.catch(function (b) {
											var w, R;
											throw n(n({}, b.response.data), {
												httpStatus: b.response.status,
												httpStatusText: b.response.statusText,
												message:
													"There was an error while getting the value.",
												exception:
													(R =
														(w = b.response.data.exception) !== null &&
														w !== void 0
															? w
															: b.response.data.exc_type) !== null &&
													R !== void 0
														? R
														: "",
											});
										}),
								]
							);
						});
					})
				);
			}),
			(l.prototype.setValue = function (u, c, h, p) {
				return r(this, void 0, void 0, function () {
					return o(this, function (f) {
						return (
							h !== null &&
								typeof h == "object" &&
								!Array.isArray(h) &&
								(p = void 0),
							[
								2,
								this.axios
									.post("/api/method/frappe.client.set_value", {
										doctype: u,
										name: c,
										fieldname: h,
										value: p,
									})
									.then(function (y) {
										return y.data;
									})
									.catch(function (y) {
										var g, S;
										throw n(n({}, y.response.data), {
											httpStatus: y.response.status,
											httpStatusText: y.response.statusText,
											message: "There was an error while setting the value.",
											exception:
												(S =
													(g = y.response.data.exception) !== null &&
													g !== void 0
														? g
														: y.response.data.exc_type) !== null &&
												S !== void 0
													? S
													: "",
										});
									}),
							]
						);
					});
				});
			}),
			(l.prototype.getSingleValue = function (u, c) {
				return r(this, void 0, void 0, function () {
					var h;
					return o(this, function (p) {
						return (
							(h = { doctype: u, field: c }),
							[
								2,
								this.axios
									.get("/api/method/frappe.client.get_single_value", {
										params: h,
									})
									.then(function (f) {
										return f.data;
									})
									.catch(function (f) {
										var y, g;
										throw n(n({}, f.response.data), {
											httpStatus: f.response.status,
											httpStatusText: f.response.statusText,
											message:
												"There was an error while getting the value of single doctype.",
											exception:
												(g =
													(y = f.response.data.exception) !== null &&
													y !== void 0
														? y
														: f.response.data.exc_type) !== null &&
												g !== void 0
													? g
													: "",
										});
									}),
							]
						);
					});
				});
			}),
			(l.prototype.submit = function (u) {
				return r(this, void 0, void 0, function () {
					return o(this, function (c) {
						return [
							2,
							this.axios
								.post("/api/method/frappe.client.submit", { doc: u })
								.then(function (h) {
									return h.data.message;
								})
								.catch(function (h) {
									var p, f;
									throw n(n({}, h.response.data), {
										httpStatus: h.response.status,
										httpStatusText: h.response.statusText,
										message:
											"There was an error while submitting the document.",
										exception:
											(f =
												(p = h.response.data.exception) !== null &&
												p !== void 0
													? p
													: h.response.data.exc_type) !== null &&
											f !== void 0
												? f
												: "",
									});
								}),
						];
					});
				});
			}),
			(l.prototype.cancel = function (u, c) {
				return r(this, void 0, void 0, function () {
					return o(this, function (h) {
						return [
							2,
							this.axios
								.post("/api/method/frappe.client.cancel", { doctype: u, name: c })
								.then(function (p) {
									return p.data;
								})
								.catch(function (p) {
									var f, y;
									throw n(n({}, p.response.data), {
										httpStatus: p.response.status,
										httpStatusText: p.response.statusText,
										message:
											"There was an error while cancelling the document.",
										exception:
											(y =
												(f = p.response.data.exception) !== null &&
												f !== void 0
													? f
													: p.response.data.exc_type) !== null &&
											y !== void 0
												? y
												: "",
									});
								}),
						];
					});
				});
			}),
			l
		);
	})();
	return (Ir.FrappeDB = i), Ir;
}
var Gr = {},
	Vo = {};
var Yh, Nb;
function zR() {
	if (Nb) return Yh;
	Nb = 1;
	function n(E, C) {
		return function () {
			return E.apply(C, arguments);
		};
	}
	const { toString: r } = Object.prototype,
		{ getPrototypeOf: o } = Object,
		{ iterator: i, toStringTag: l } = Symbol,
		u = ((E) => (C) => {
			const k = r.call(C);
			return E[k] || (E[k] = k.slice(8, -1).toLowerCase());
		})(Object.create(null)),
		c = (E) => ((E = E.toLowerCase()), (C) => u(C) === E),
		h = (E) => (C) => typeof C === E,
		{ isArray: p } = Array,
		f = h("undefined");
	function y(E) {
		return (
			E !== null &&
			!f(E) &&
			E.constructor !== null &&
			!f(E.constructor) &&
			w(E.constructor.isBuffer) &&
			E.constructor.isBuffer(E)
		);
	}
	const g = c("ArrayBuffer");
	function S(E) {
		let C;
		return (
			typeof ArrayBuffer < "u" && ArrayBuffer.isView
				? (C = ArrayBuffer.isView(E))
				: (C = E && E.buffer && g(E.buffer)),
			C
		);
	}
	const b = h("string"),
		w = h("function"),
		R = h("number"),
		O = (E) => E !== null && typeof E == "object",
		T = (E) => E === !0 || E === !1,
		L = (E) => {
			if (u(E) !== "object") return !1;
			const C = o(E);
			return (
				(C === null || C === Object.prototype || Object.getPrototypeOf(C) === null) &&
				!(l in E) &&
				!(i in E)
			);
		},
		M = (E) => {
			if (!O(E) || y(E)) return !1;
			try {
				return (
					Object.keys(E).length === 0 && Object.getPrototypeOf(E) === Object.prototype
				);
			} catch (C) {
				return !1;
			}
		},
		_ = c("Date"),
		N = c("File"),
		D = c("Blob"),
		H = c("FileList"),
		U = (E) => O(E) && w(E.pipe),
		fe = (E) => {
			let C;
			return (
				E &&
				((typeof FormData == "function" && E instanceof FormData) ||
					(w(E.append) &&
						((C = u(E)) === "formdata" ||
							(C === "object" &&
								w(E.toString) &&
								E.toString() === "[object FormData]"))))
			);
		},
		we = c("URLSearchParams"),
		[se, Y, oe, xe] = ["ReadableStream", "Request", "Response", "Headers"].map(c),
		ge = (E) => (E.trim ? E.trim() : E.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""));
	function j(E, C, { allOwnKeys: k = !1 } = {}) {
		if (E === null || typeof E > "u") return;
		let z, V;
		if ((typeof E != "object" && (E = [E]), p(E)))
			for (z = 0, V = E.length; z < V; z++) C.call(null, E[z], z, E);
		else {
			if (y(E)) return;
			const W = k ? Object.getOwnPropertyNames(E) : Object.keys(E),
				$ = W.length;
			let Oe;
			for (z = 0; z < $; z++) (Oe = W[z]), C.call(null, E[Oe], Oe, E);
		}
	}
	function I(E, C) {
		if (y(E)) return null;
		C = C.toLowerCase();
		const k = Object.keys(E);
		let z = k.length,
			V;
		for (; z-- > 0; ) if (((V = k[z]), C === V.toLowerCase())) return V;
		return null;
	}
	const F =
			typeof globalThis < "u"
				? globalThis
				: typeof self < "u"
				? self
				: typeof window < "u"
				? window
				: LR,
		pe = (E) => !f(E) && E !== F;
	function J() {
		const { caseless: E, skipUndefined: C } = (pe(this) && this) || {},
			k = {},
			z = (V, W) => {
				const $ = (E && I(k, W)) || W;
				L(k[$]) && L(V)
					? (k[$] = J(k[$], V))
					: L(V)
					? (k[$] = J({}, V))
					: p(V)
					? (k[$] = V.slice())
					: (!C || !f(V)) && (k[$] = V);
			};
		for (let V = 0, W = arguments.length; V < W; V++) arguments[V] && j(arguments[V], z);
		return k;
	}
	const B = (E, C, k, { allOwnKeys: z } = {}) => (
			j(
				C,
				(V, W) => {
					k && w(V) ? (E[W] = n(V, k)) : (E[W] = V);
				},
				{ allOwnKeys: z }
			),
			E
		),
		Z = (E) => (E.charCodeAt(0) === 65279 && (E = E.slice(1)), E),
		ee = (E, C, k, z) => {
			(E.prototype = Object.create(C.prototype, z)),
				(E.prototype.constructor = E),
				Object.defineProperty(E, "super", { value: C.prototype }),
				k && Object.assign(E.prototype, k);
		},
		ie = (E, C, k, z) => {
			let V, W, $;
			const Oe = {};
			if (((C = C || {}), E == null)) return C;
			do {
				for (V = Object.getOwnPropertyNames(E), W = V.length; W-- > 0; )
					($ = V[W]), (!z || z($, E, C)) && !Oe[$] && ((C[$] = E[$]), (Oe[$] = !0));
				E = k !== !1 && o(E);
			} while (E && (!k || k(E, C)) && E !== Object.prototype);
			return C;
		},
		me = (E, C, k) => {
			(E = String(E)), (k === void 0 || k > E.length) && (k = E.length), (k -= C.length);
			const z = E.indexOf(C, k);
			return z !== -1 && z === k;
		},
		ve = (E) => {
			if (!E) return null;
			if (p(E)) return E;
			let C = E.length;
			if (!R(C)) return null;
			const k = new Array(C);
			for (; C-- > 0; ) k[C] = E[C];
			return k;
		},
		ke = (
			(E) => (C) =>
				E && C instanceof E
		)(typeof Uint8Array < "u" && o(Uint8Array)),
		je = (E, C) => {
			const k = (E && E[i]).call(E);
			let z;
			for (; (z = k.next()) && !z.done; ) {
				const V = z.value;
				C.call(E, V[0], V[1]);
			}
		},
		Ee = (E, C) => {
			let k;
			const z = [];
			for (; (k = E.exec(C)) !== null; ) z.push(k);
			return z;
		},
		Qe = c("HTMLFormElement"),
		it = (E) =>
			E.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (C, k, z) {
				return k.toUpperCase() + z;
			}),
		re = (
			({ hasOwnProperty: E }) =>
			(C, k) =>
				E.call(C, k)
		)(Object.prototype),
		ce = c("RegExp"),
		de = (E, C) => {
			const k = Object.getOwnPropertyDescriptors(E),
				z = {};
			j(k, (V, W) => {
				let $;
				($ = C(V, W, E)) !== !1 && (z[W] = $ || V);
			}),
				Object.defineProperties(E, z);
		},
		Te = (E) => {
			de(E, (C, k) => {
				if (w(E) && ["arguments", "caller", "callee"].indexOf(k) !== -1) return !1;
				const z = E[k];
				if (w(z)) {
					if (((C.enumerable = !1), "writable" in C)) {
						C.writable = !1;
						return;
					}
					C.set ||
						(C.set = () => {
							throw Error("Can not rewrite read-only method '" + k + "'");
						});
				}
			});
		},
		Re = (E, C) => {
			const k = {},
				z = (V) => {
					V.forEach((W) => {
						k[W] = !0;
					});
				};
			return p(E) ? z(E) : z(String(E).split(C)), k;
		},
		ze = () => {},
		Ce = (E, C) => (E != null && Number.isFinite((E = +E)) ? E : C);
	function le(E) {
		return !!(E && w(E.append) && E[l] === "FormData" && E[i]);
	}
	const Ae = (E) => {
			const C = new Array(10),
				k = (z, V) => {
					if (O(z)) {
						if (C.indexOf(z) >= 0) return;
						if (y(z)) return z;
						if (!("toJSON" in z)) {
							C[V] = z;
							const W = p(z) ? [] : {};
							return (
								j(z, ($, Oe) => {
									const Ge = k($, V + 1);
									!f(Ge) && (W[Oe] = Ge);
								}),
								(C[V] = void 0),
								W
							);
						}
					}
					return z;
				};
			return k(E, 0);
		},
		Se = c("AsyncFunction"),
		Ue = (E) => E && (O(E) || w(E)) && w(E.then) && w(E.catch),
		Ye = ((E, C) =>
			E
				? setImmediate
				: C
				? ((k, z) => (
						F.addEventListener(
							"message",
							({ source: V, data: W }) => {
								V === F && W === k && z.length && z.shift()();
							},
							!1
						),
						(V) => {
							z.push(V), F.postMessage(k, "*");
						}
				  ))(`axios@${Math.random()}`, [])
				: (k) => setTimeout(k))(typeof setImmediate == "function", w(F.postMessage)),
		qe =
			typeof queueMicrotask < "u"
				? queueMicrotask.bind(F)
				: (typeof process < "u" && process.nextTick) || Ye;
	var X = {
		isArray: p,
		isArrayBuffer: g,
		isBuffer: y,
		isFormData: fe,
		isArrayBufferView: S,
		isString: b,
		isNumber: R,
		isBoolean: T,
		isObject: O,
		isPlainObject: L,
		isEmptyObject: M,
		isReadableStream: se,
		isRequest: Y,
		isResponse: oe,
		isHeaders: xe,
		isUndefined: f,
		isDate: _,
		isFile: N,
		isBlob: D,
		isRegExp: ce,
		isFunction: w,
		isStream: U,
		isURLSearchParams: we,
		isTypedArray: ke,
		isFileList: H,
		forEach: j,
		merge: J,
		extend: B,
		trim: ge,
		stripBOM: Z,
		inherits: ee,
		toFlatObject: ie,
		kindOf: u,
		kindOfTest: c,
		endsWith: me,
		toArray: ve,
		forEachEntry: je,
		matchAll: Ee,
		isHTMLForm: Qe,
		hasOwnProperty: re,
		hasOwnProp: re,
		reduceDescriptors: de,
		freezeMethods: Te,
		toObjectSet: Re,
		toCamelCase: it,
		noop: ze,
		toFiniteNumber: Ce,
		findKey: I,
		global: F,
		isContextDefined: pe,
		isSpecCompliantForm: le,
		toJSONObject: Ae,
		isAsyncFn: Se,
		isThenable: Ue,
		setImmediate: Ye,
		asap: qe,
		isIterable: (E) => E != null && w(E[i]),
	};
	function Pe(E, C, k, z, V) {
		Error.call(this),
			Error.captureStackTrace
				? Error.captureStackTrace(this, this.constructor)
				: (this.stack = new Error().stack),
			(this.message = E),
			(this.name = "AxiosError"),
			C && (this.code = C),
			k && (this.config = k),
			z && (this.request = z),
			V && ((this.response = V), (this.status = V.status ? V.status : null));
	}
	X.inherits(Pe, Error, {
		toJSON: function () {
			return {
				message: this.message,
				name: this.name,
				description: this.description,
				number: this.number,
				fileName: this.fileName,
				lineNumber: this.lineNumber,
				columnNumber: this.columnNumber,
				stack: this.stack,
				config: X.toJSONObject(this.config),
				code: this.code,
				status: this.status,
			};
		},
	});
	const Jt = Pe.prototype,
		st = {};
	[
		"ERR_BAD_OPTION_VALUE",
		"ERR_BAD_OPTION",
		"ECONNABORTED",
		"ETIMEDOUT",
		"ERR_NETWORK",
		"ERR_FR_TOO_MANY_REDIRECTS",
		"ERR_DEPRECATED",
		"ERR_BAD_RESPONSE",
		"ERR_BAD_REQUEST",
		"ERR_CANCELED",
		"ERR_NOT_SUPPORT",
		"ERR_INVALID_URL",
	].forEach((E) => {
		st[E] = { value: E };
	}),
		Object.defineProperties(Pe, st),
		Object.defineProperty(Jt, "isAxiosError", { value: !0 }),
		(Pe.from = (E, C, k, z, V, W) => {
			const $ = Object.create(Jt);
			X.toFlatObject(
				E,
				$,
				function (Me) {
					return Me !== Error.prototype;
				},
				(Me) => Me !== "isAxiosError"
			);
			const Oe = E && E.message ? E.message : "Error",
				Ge = C == null && E ? E.code : C;
			return (
				Pe.call($, Oe, Ge, k, z, V),
				E &&
					$.cause == null &&
					Object.defineProperty($, "cause", { value: E, configurable: !0 }),
				($.name = (E && E.name) || "Error"),
				W && Object.assign($, W),
				$
			);
		});
	var Mt = null;
	function wt(E) {
		return X.isPlainObject(E) || X.isArray(E);
	}
	function dn(E) {
		return X.endsWith(E, "[]") ? E.slice(0, -2) : E;
	}
	function Tn(E, C, k) {
		return E
			? E.concat(C)
					.map(function (z, V) {
						return (z = dn(z)), !k && V ? "[" + z + "]" : z;
					})
					.join(k ? "." : "")
			: C;
	}
	function qn(E) {
		return X.isArray(E) && !E.some(wt);
	}
	const Ze = X.toFlatObject(X, {}, null, function (E) {
		return /^is[A-Z]/.test(E);
	});
	function rt(E, C, k) {
		if (!X.isObject(E)) throw new TypeError("target must be an object");
		(C = C || new FormData()),
			(k = X.toFlatObject(
				k,
				{ metaTokens: !0, dots: !1, indexes: !1 },
				!1,
				function (ot, Le) {
					return !X.isUndefined(Le[ot]);
				}
			));
		const z = k.metaTokens,
			V = k.visitor || Me,
			W = k.dots,
			$ = k.indexes,
			Oe = (k.Blob || (typeof Blob < "u" && Blob)) && X.isSpecCompliantForm(C);
		if (!X.isFunction(V)) throw new TypeError("visitor must be a function");
		function Ge(ot) {
			if (ot === null) return "";
			if (X.isDate(ot)) return ot.toISOString();
			if (X.isBoolean(ot)) return ot.toString();
			if (!Oe && X.isBlob(ot)) throw new Pe("Blob is not supported. Use a Buffer instead.");
			return X.isArrayBuffer(ot) || X.isTypedArray(ot)
				? Oe && typeof Blob == "function"
					? new Blob([ot])
					: Buffer.from(ot)
				: ot;
		}
		function Me(ot, Le, He) {
			let Kt = ot;
			if (ot && !He && typeof ot == "object") {
				if (X.endsWith(Le, "{}"))
					(Le = z ? Le : Le.slice(0, -2)), (ot = JSON.stringify(ot));
				else if (
					(X.isArray(ot) && qn(ot)) ||
					((X.isFileList(ot) || X.endsWith(Le, "[]")) && (Kt = X.toArray(ot)))
				)
					return (
						(Le = dn(Le)),
						Kt.forEach(function (An, ln) {
							!(X.isUndefined(An) || An === null) &&
								C.append(
									$ === !0 ? Tn([Le], ln, W) : $ === null ? Le : Le + "[]",
									Ge(An)
								);
						}),
						!1
					);
			}
			return wt(ot) ? !0 : (C.append(Tn(He, Le, W), Ge(ot)), !1);
		}
		const Ne = [],
			nt = Object.assign(Ze, { defaultVisitor: Me, convertValue: Ge, isVisitable: wt });
		function Bt(ot, Le) {
			if (!X.isUndefined(ot)) {
				if (Ne.indexOf(ot) !== -1)
					throw Error("Circular reference detected in " + Le.join("."));
				Ne.push(ot),
					X.forEach(ot, function (He, Kt) {
						(!(X.isUndefined(He) || He === null) &&
							V.call(C, He, X.isString(Kt) ? Kt.trim() : Kt, Le, nt)) === !0 &&
							Bt(He, Le ? Le.concat(Kt) : [Kt]);
					}),
					Ne.pop();
			}
		}
		if (!X.isObject(E)) throw new TypeError("data must be an object");
		return Bt(E), C;
	}
	function ht(E) {
		const C = {
			"!": "%21",
			"'": "%27",
			"(": "%28",
			")": "%29",
			"~": "%7E",
			"%20": "+",
			"%00": "\0",
		};
		return encodeURIComponent(E).replace(/[!'()~]|%20|%00/g, function (k) {
			return C[k];
		});
	}
	function br(E, C) {
		(this._pairs = []), E && rt(E, this, C);
	}
	const hn = br.prototype;
	(hn.append = function (E, C) {
		this._pairs.push([E, C]);
	}),
		(hn.toString = function (E) {
			const C = E
				? function (k) {
						return E.call(this, k, ht);
				  }
				: ht;
			return this._pairs
				.map(function (k) {
					return C(k[0]) + "=" + C(k[1]);
				}, "")
				.join("&");
		});
	function lt(E) {
		return encodeURIComponent(E)
			.replace(/%3A/gi, ":")
			.replace(/%24/g, "$")
			.replace(/%2C/gi, ",")
			.replace(/%20/g, "+");
	}
	function _t(E, C, k) {
		if (!C) return E;
		const z = (k && k.encode) || lt;
		X.isFunction(k) && (k = { serialize: k });
		const V = k && k.serialize;
		let W;
		if (
			(V
				? (W = V(C, k))
				: (W = X.isURLSearchParams(C) ? C.toString() : new br(C, k).toString(z)),
			W)
		) {
			const $ = E.indexOf("#");
			$ !== -1 && (E = E.slice(0, $)), (E += (E.indexOf("?") === -1 ? "?" : "&") + W);
		}
		return E;
	}
	class en {
		constructor() {
			this.handlers = [];
		}
		use(C, k, z) {
			return (
				this.handlers.push({
					fulfilled: C,
					rejected: k,
					synchronous: z ? z.synchronous : !1,
					runWhen: z ? z.runWhen : null,
				}),
				this.handlers.length - 1
			);
		}
		eject(C) {
			this.handlers[C] && (this.handlers[C] = null);
		}
		clear() {
			this.handlers && (this.handlers = []);
		}
		forEach(C) {
			X.forEach(this.handlers, function (k) {
				k !== null && C(k);
			});
		}
	}
	var It = en,
		Gt = { silentJSONParsing: !0, forcedJSONParsing: !0, clarifyTimeoutError: !1 },
		Je = typeof URLSearchParams < "u" ? URLSearchParams : br,
		xt = typeof FormData < "u" ? FormData : null,
		Pt = typeof Blob < "u" ? Blob : null,
		Dt = {
			isBrowser: !0,
			classes: { URLSearchParams: Je, FormData: xt, Blob: Pt },
			protocols: ["http", "https", "file", "blob", "url", "data"],
		};
	const Kn = typeof window < "u" && typeof document < "u",
		Nt = (typeof navigator == "object" && navigator) || void 0,
		Cn = Kn && (!Nt || ["ReactNative", "NativeScript", "NS"].indexOf(Nt.product) < 0),
		Br =
			typeof WorkerGlobalScope < "u" &&
			self instanceof WorkerGlobalScope &&
			typeof self.importScripts == "function",
		pn = (Kn && window.location.href) || "http://localhost";
	var xn = Object.freeze({
			__proto__: null,
			hasBrowserEnv: Kn,
			hasStandardBrowserWebWorkerEnv: Br,
			hasStandardBrowserEnv: Cn,
			navigator: Nt,
			origin: pn,
		}),
		Xt = P(P({}, xn), Dt);
	function Pn(E, C) {
		return rt(
			E,
			new Xt.classes.URLSearchParams(),
			P(
				{
					visitor: function (k, z, V, W) {
						return Xt.isNode && X.isBuffer(k)
							? (this.append(z, k.toString("base64")), !1)
							: W.defaultVisitor.apply(this, arguments);
					},
				},
				C
			)
		);
	}
	function Ur(E) {
		return X.matchAll(/\w+|\[(\w*)]/g, E).map((C) => (C[0] === "[]" ? "" : C[1] || C[0]));
	}
	function wi(E) {
		const C = {},
			k = Object.keys(E);
		let z;
		const V = k.length;
		let W;
		for (z = 0; z < V; z++) (W = k[z]), (C[W] = E[W]);
		return C;
	}
	function or(E) {
		function C(k, z, V, W) {
			let $ = k[W++];
			if ($ === "__proto__") return !0;
			const Oe = Number.isFinite(+$),
				Ge = W >= k.length;
			return (
				($ = !$ && X.isArray(V) ? V.length : $),
				Ge
					? (X.hasOwnProp(V, $) ? (V[$] = [V[$], z]) : (V[$] = z), !Oe)
					: ((!V[$] || !X.isObject(V[$])) && (V[$] = []),
					  C(k, z, V[$], W) && X.isArray(V[$]) && (V[$] = wi(V[$])),
					  !Oe)
			);
		}
		if (X.isFormData(E) && X.isFunction(E.entries)) {
			const k = {};
			return (
				X.forEachEntry(E, (z, V) => {
					C(Ur(z), V, k, 0);
				}),
				k
			);
		}
		return null;
	}
	function an(E, C, k) {
		if (X.isString(E))
			try {
				return (C || JSON.parse)(E), X.trim(E);
			} catch (z) {
				if (z.name !== "SyntaxError") throw z;
			}
		return (k || JSON.stringify)(E);
	}
	const sn = {
		transitional: Gt,
		adapter: ["xhr", "http", "fetch"],
		transformRequest: [
			function (E, C) {
				const k = C.getContentType() || "",
					z = k.indexOf("application/json") > -1,
					V = X.isObject(E);
				if ((V && X.isHTMLForm(E) && (E = new FormData(E)), X.isFormData(E)))
					return z ? JSON.stringify(or(E)) : E;
				if (
					X.isArrayBuffer(E) ||
					X.isBuffer(E) ||
					X.isStream(E) ||
					X.isFile(E) ||
					X.isBlob(E) ||
					X.isReadableStream(E)
				)
					return E;
				if (X.isArrayBufferView(E)) return E.buffer;
				if (X.isURLSearchParams(E))
					return (
						C.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1),
						E.toString()
					);
				let W;
				if (V) {
					if (k.indexOf("application/x-www-form-urlencoded") > -1)
						return Pn(E, this.formSerializer).toString();
					if ((W = X.isFileList(E)) || k.indexOf("multipart/form-data") > -1) {
						const $ = this.env && this.env.FormData;
						return rt(W ? { "files[]": E } : E, $ && new $(), this.formSerializer);
					}
				}
				return V || z ? (C.setContentType("application/json", !1), an(E)) : E;
			},
		],
		transformResponse: [
			function (E) {
				const C = this.transitional || sn.transitional,
					k = C && C.forcedJSONParsing,
					z = this.responseType === "json";
				if (X.isResponse(E) || X.isReadableStream(E)) return E;
				if (E && X.isString(E) && ((k && !this.responseType) || z)) {
					const V = !(C && C.silentJSONParsing) && z;
					try {
						return JSON.parse(E, this.parseReviver);
					} catch (W) {
						if (V)
							throw W.name === "SyntaxError"
								? Pe.from(W, Pe.ERR_BAD_RESPONSE, this, null, this.response)
								: W;
					}
				}
				return E;
			},
		],
		timeout: 0,
		xsrfCookieName: "XSRF-TOKEN",
		xsrfHeaderName: "X-XSRF-TOKEN",
		maxContentLength: -1,
		maxBodyLength: -1,
		env: { FormData: Xt.classes.FormData, Blob: Xt.classes.Blob },
		validateStatus: function (E) {
			return E >= 200 && E < 300;
		},
		headers: {
			common: { Accept: "application/json, text/plain, */*", "Content-Type": void 0 },
		},
	};
	X.forEach(["delete", "get", "head", "post", "put", "patch"], (E) => {
		sn.headers[E] = {};
	});
	var ar = sn;
	const $o = X.toObjectSet([
		"age",
		"authorization",
		"content-length",
		"content-type",
		"etag",
		"expires",
		"from",
		"host",
		"if-modified-since",
		"if-unmodified-since",
		"last-modified",
		"location",
		"max-forwards",
		"proxy-authorization",
		"referer",
		"retry-after",
		"user-agent",
	]);
	var Df = (E) => {
		const C = {};
		let k, z, V;
		return (
			E &&
				E.split(
					`
`
				).forEach(function (W) {
					(V = W.indexOf(":")),
						(k = W.substring(0, V).trim().toLowerCase()),
						(z = W.substring(V + 1).trim()),
						!(!k || (C[k] && $o[k])) &&
							(k === "set-cookie"
								? C[k]
									? C[k].push(z)
									: (C[k] = [z])
								: (C[k] = C[k] ? C[k] + ", " + z : z));
				}),
			C
		);
	};
	const ru = Symbol("internals");
	function ea(E) {
		return E && String(E).trim().toLowerCase();
	}
	function Wr(E) {
		return E === !1 || E == null ? E : X.isArray(E) ? E.map(Wr) : String(E);
	}
	function Hs(E) {
		const C = Object.create(null),
			k = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
		let z;
		for (; (z = k.exec(E)); ) C[z[1]] = z[2];
		return C;
	}
	const ta = (E) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(E.trim());
	function $r(E, C, k, z, V) {
		if (X.isFunction(z)) return z.call(this, C, k);
		if ((V && (C = k), !!X.isString(C))) {
			if (X.isString(z)) return C.indexOf(z) !== -1;
			if (X.isRegExp(z)) return z.test(C);
		}
	}
	function Pa(E) {
		return E.trim()
			.toLowerCase()
			.replace(/([a-z\d])(\w*)/g, (C, k, z) => k.toUpperCase() + z);
	}
	function na(E, C) {
		const k = X.toCamelCase(" " + C);
		["get", "set", "has"].forEach((z) => {
			Object.defineProperty(E, z + k, {
				value: function (V, W, $) {
					return this[z].call(this, C, V, W, $);
				},
				configurable: !0,
			});
		});
	}
	class tn {
		constructor(C) {
			C && this.set(C);
		}
		set(C, k, z) {
			const V = this;
			function W(Oe, Ge, Me) {
				const Ne = ea(Ge);
				if (!Ne) throw new Error("header name must be a non-empty string");
				const nt = X.findKey(V, Ne);
				(!nt || V[nt] === void 0 || Me === !0 || (Me === void 0 && V[nt] !== !1)) &&
					(V[nt || Ge] = Wr(Oe));
			}
			const $ = (Oe, Ge) => X.forEach(Oe, (Me, Ne) => W(Me, Ne, Ge));
			if (X.isPlainObject(C) || C instanceof this.constructor) $(C, k);
			else if (X.isString(C) && (C = C.trim()) && !ta(C)) $(Df(C), k);
			else if (X.isObject(C) && X.isIterable(C)) {
				let Oe = {},
					Ge,
					Me;
				for (const Ne of C) {
					if (!X.isArray(Ne))
						throw TypeError("Object iterator must return a key-value pair");
					Oe[(Me = Ne[0])] = (Ge = Oe[Me])
						? X.isArray(Ge)
							? [...Ge, Ne[1]]
							: [Ge, Ne[1]]
						: Ne[1];
				}
				$(Oe, k);
			} else C != null && W(k, C, z);
			return this;
		}
		get(C, k) {
			if (((C = ea(C)), C)) {
				const z = X.findKey(this, C);
				if (z) {
					const V = this[z];
					if (!k) return V;
					if (k === !0) return Hs(V);
					if (X.isFunction(k)) return k.call(this, V, z);
					if (X.isRegExp(k)) return k.exec(V);
					throw new TypeError("parser must be boolean|regexp|function");
				}
			}
		}
		has(C, k) {
			if (((C = ea(C)), C)) {
				const z = X.findKey(this, C);
				return !!(z && this[z] !== void 0 && (!k || $r(this, this[z], z, k)));
			}
			return !1;
		}
		delete(C, k) {
			const z = this;
			let V = !1;
			function W($) {
				if ((($ = ea($)), $)) {
					const Oe = X.findKey(z, $);
					Oe && (!k || $r(z, z[Oe], Oe, k)) && (delete z[Oe], (V = !0));
				}
			}
			return X.isArray(C) ? C.forEach(W) : W(C), V;
		}
		clear(C) {
			const k = Object.keys(this);
			let z = k.length,
				V = !1;
			for (; z--; ) {
				const W = k[z];
				(!C || $r(this, this[W], W, C, !0)) && (delete this[W], (V = !0));
			}
			return V;
		}
		normalize(C) {
			const k = this,
				z = {};
			return (
				X.forEach(this, (V, W) => {
					const $ = X.findKey(z, W);
					if ($) {
						(k[$] = Wr(V)), delete k[W];
						return;
					}
					const Oe = C ? Pa(W) : String(W).trim();
					Oe !== W && delete k[W], (k[Oe] = Wr(V)), (z[Oe] = !0);
				}),
				this
			);
		}
		concat(...C) {
			return this.constructor.concat(this, ...C);
		}
		toJSON(C) {
			const k = Object.create(null);
			return (
				X.forEach(this, (z, V) => {
					z != null && z !== !1 && (k[V] = C && X.isArray(z) ? z.join(", ") : z);
				}),
				k
			);
		}
		[Symbol.iterator]() {
			return Object.entries(this.toJSON())[Symbol.iterator]();
		}
		toString() {
			return Object.entries(this.toJSON()).map(([C, k]) => C + ": " + k).join(`
`);
		}
		getSetCookie() {
			return this.get("set-cookie") || [];
		}
		get [Symbol.toStringTag]() {
			return "AxiosHeaders";
		}
		static from(C) {
			return C instanceof this ? C : new this(C);
		}
		static concat(C, ...k) {
			const z = new this(C);
			return k.forEach((V) => z.set(V)), z;
		}
		static accessor(C) {
			const k = (this[ru] = this[ru] = { accessors: {} }).accessors,
				z = this.prototype;
			function V(W) {
				const $ = ea(W);
				k[$] || (na(z, W), (k[$] = !0));
			}
			return X.isArray(C) ? C.forEach(V) : V(C), this;
		}
	}
	tn.accessor([
		"Content-Type",
		"Content-Length",
		"Accept",
		"Accept-Encoding",
		"User-Agent",
		"Authorization",
	]),
		X.reduceDescriptors(tn.prototype, ({ value: E }, C) => {
			let k = C[0].toUpperCase() + C.slice(1);
			return {
				get: () => E,
				set(z) {
					this[k] = z;
				},
			};
		}),
		X.freezeMethods(tn);
	var Qn = tn;
	function Ei(E, C) {
		const k = this || ar,
			z = C || k,
			V = Qn.from(z.headers);
		let W = z.data;
		return (
			X.forEach(E, function ($) {
				W = $.call(k, W, V.normalize(), C ? C.status : void 0);
			}),
			V.normalize(),
			W
		);
	}
	function eo(E) {
		return !!(E && E.__CANCEL__);
	}
	function ir(E, C, k) {
		Pe.call(this, E != null ? E : "canceled", Pe.ERR_CANCELED, C, k),
			(this.name = "CanceledError");
	}
	X.inherits(ir, Pe, { __CANCEL__: !0 });
	function ou(E, C, k) {
		const z = k.config.validateStatus;
		!k.status || !z || z(k.status)
			? E(k)
			: C(
					new Pe(
						"Request failed with status code " + k.status,
						[Pe.ERR_BAD_REQUEST, Pe.ERR_BAD_RESPONSE][Math.floor(k.status / 100) - 4],
						k.config,
						k.request,
						k
					)
			  );
	}
	function au(E) {
		const C = /^([-+\w]{1,25})(:?\/\/|:)/.exec(E);
		return (C && C[1]) || "";
	}
	function iu(E, C) {
		E = E || 10;
		const k = new Array(E),
			z = new Array(E);
		let V = 0,
			W = 0,
			$;
		return (
			(C = C !== void 0 ? C : 1e3),
			function (Oe) {
				const Ge = Date.now(),
					Me = z[W];
				$ || ($ = Ge), (k[V] = Oe), (z[V] = Ge);
				let Ne = W,
					nt = 0;
				for (; Ne !== V; ) (nt += k[Ne++]), (Ne = Ne % E);
				if (((V = (V + 1) % E), V === W && (W = (W + 1) % E), Ge - $ < C)) return;
				const Bt = Me && Ge - Me;
				return Bt ? Math.round((nt * 1e3) / Bt) : void 0;
			}
		);
	}
	function Nf(E, C) {
		let k = 0,
			z = 1e3 / C,
			V,
			W;
		const $ = (Oe, Ge = Date.now()) => {
			(k = Ge), (V = null), W && (clearTimeout(W), (W = null)), E(...Oe);
		};
		return [
			(...Oe) => {
				const Ge = Date.now(),
					Me = Ge - k;
				Me >= z
					? $(Oe, Ge)
					: ((V = Oe),
					  W ||
							(W = setTimeout(() => {
								(W = null), $(V);
							}, z - Me)));
			},
			() => V && $(V),
		];
	}
	const vo = (E, C, k = 3) => {
			let z = 0;
			const V = iu(50, 250);
			return Nf((W) => {
				const $ = W.loaded,
					Oe = W.lengthComputable ? W.total : void 0,
					Ge = $ - z,
					Me = V(Ge),
					Ne = $ <= Oe;
				z = $;
				const nt = {
					loaded: $,
					total: Oe,
					progress: Oe ? $ / Oe : void 0,
					bytes: Ge,
					rate: Me || void 0,
					estimated: Me && Oe && Ne ? (Oe - $) / Me : void 0,
					event: W,
					lengthComputable: Oe != null,
					[C ? "download" : "upload"]: !0,
				};
				E(nt);
			}, k);
		},
		Va = (E, C) => {
			const k = E != null;
			return [(z) => C[0]({ lengthComputable: k, total: E, loaded: z }), C[1]];
		},
		vr =
			(E) =>
			(...C) =>
				X.asap(() => E(...C));
	var Zn = Xt.hasStandardBrowserEnv
			? ((E, C) => (k) => (
					(k = new URL(k, Xt.origin)),
					E.protocol === k.protocol && E.host === k.host && (C || E.port === k.port)
			  ))(
					new URL(Xt.origin),
					Xt.navigator && /(msie|trident)/i.test(Xt.navigator.userAgent)
			  )
			: () => !0,
		su = Xt.hasStandardBrowserEnv
			? {
					write(E, C, k, z, V, W) {
						const $ = [E + "=" + encodeURIComponent(C)];
						X.isNumber(k) && $.push("expires=" + new Date(k).toGMTString()),
							X.isString(z) && $.push("path=" + z),
							X.isString(V) && $.push("domain=" + V),
							W === !0 && $.push("secure"),
							(document.cookie = $.join("; "));
					},
					read(E) {
						const C = document.cookie.match(
							new RegExp("(^|;\\s*)(" + E + ")=([^;]*)")
						);
						return C ? decodeURIComponent(C[3]) : null;
					},
					remove(E) {
						this.write(E, "", Date.now() - 864e5);
					},
			  }
			: {
					write() {},
					read() {
						return null;
					},
					remove() {},
			  };
	function Lf(E) {
		return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(E);
	}
	function qs(E, C) {
		return C ? E.replace(/\/?\/$/, "") + "/" + C.replace(/^\/+/, "") : E;
	}
	function Ps(E, C, k) {
		let z = !Lf(C);
		return E && (z || k == !1) ? qs(E, C) : C;
	}
	const Ya = (E) => (E instanceof Qn ? P({}, E) : E);
	function So(E, C) {
		C = C || {};
		const k = {};
		function z(Me, Ne, nt, Bt) {
			return X.isPlainObject(Me) && X.isPlainObject(Ne)
				? X.merge.call({ caseless: Bt }, Me, Ne)
				: X.isPlainObject(Ne)
				? X.merge({}, Ne)
				: X.isArray(Ne)
				? Ne.slice()
				: Ne;
		}
		function V(Me, Ne, nt, Bt) {
			if (X.isUndefined(Ne)) {
				if (!X.isUndefined(Me)) return z(void 0, Me, nt, Bt);
			} else return z(Me, Ne, nt, Bt);
		}
		function W(Me, Ne) {
			if (!X.isUndefined(Ne)) return z(void 0, Ne);
		}
		function $(Me, Ne) {
			if (X.isUndefined(Ne)) {
				if (!X.isUndefined(Me)) return z(void 0, Me);
			} else return z(void 0, Ne);
		}
		function Oe(Me, Ne, nt) {
			if (nt in C) return z(Me, Ne);
			if (nt in E) return z(void 0, Me);
		}
		const Ge = {
			url: W,
			method: W,
			data: W,
			baseURL: $,
			transformRequest: $,
			transformResponse: $,
			paramsSerializer: $,
			timeout: $,
			timeoutMessage: $,
			withCredentials: $,
			withXSRFToken: $,
			adapter: $,
			responseType: $,
			xsrfCookieName: $,
			xsrfHeaderName: $,
			onUploadProgress: $,
			onDownloadProgress: $,
			decompress: $,
			maxContentLength: $,
			maxBodyLength: $,
			beforeRedirect: $,
			transport: $,
			httpAgent: $,
			httpsAgent: $,
			cancelToken: $,
			socketPath: $,
			responseEncoding: $,
			validateStatus: Oe,
			headers: (Me, Ne, nt) => V(Ya(Me), Ya(Ne), nt, !0),
		};
		return (
			X.forEach(Object.keys(P(P({}, E), C)), function (Me) {
				const Ne = Ge[Me] || V,
					nt = Ne(E[Me], C[Me], Me);
				(X.isUndefined(nt) && Ne !== Oe) || (k[Me] = nt);
			}),
			k
		);
	}
	var Vn = (E) => {
			const C = So({}, E);
			let {
				data: k,
				withXSRFToken: z,
				xsrfHeaderName: V,
				xsrfCookieName: W,
				headers: $,
				auth: Oe,
			} = C;
			if (
				((C.headers = $ = Qn.from($)),
				(C.url = _t(
					Ps(C.baseURL, C.url, C.allowAbsoluteUrls),
					E.params,
					E.paramsSerializer
				)),
				Oe &&
					$.set(
						"Authorization",
						"Basic " +
							btoa(
								(Oe.username || "") +
									":" +
									(Oe.password ? unescape(encodeURIComponent(Oe.password)) : "")
							)
					),
				X.isFormData(k))
			) {
				if (Xt.hasStandardBrowserEnv || Xt.hasStandardBrowserWebWorkerEnv)
					$.setContentType(void 0);
				else if (X.isFunction(k.getHeaders)) {
					const Ge = k.getHeaders(),
						Me = ["content-type", "content-length"];
					Object.entries(Ge).forEach(([Ne, nt]) => {
						Me.includes(Ne.toLowerCase()) && $.set(Ne, nt);
					});
				}
			}
			if (
				Xt.hasStandardBrowserEnv &&
				(z && X.isFunction(z) && (z = z(C)), z || (z !== !1 && Zn(C.url)))
			) {
				const Ge = V && W && su.read(W);
				Ge && $.set(V, Ge);
			}
			return C;
		},
		Vs =
			typeof XMLHttpRequest < "u" &&
			function (E) {
				return new Promise(function (C, k) {
					const z = Vn(E);
					let V = z.data;
					const W = Qn.from(z.headers).normalize();
					let { responseType: $, onUploadProgress: Oe, onDownloadProgress: Ge } = z,
						Me,
						Ne,
						nt,
						Bt,
						ot;
					function Le() {
						Bt && Bt(),
							ot && ot(),
							z.cancelToken && z.cancelToken.unsubscribe(Me),
							z.signal && z.signal.removeEventListener("abort", Me);
					}
					let He = new XMLHttpRequest();
					He.open(z.method.toUpperCase(), z.url, !0), (He.timeout = z.timeout);
					function Kt() {
						if (!He) return;
						const ln = Qn.from(
								"getAllResponseHeaders" in He && He.getAllResponseHeaders()
							),
							wr = {
								data:
									!$ || $ === "text" || $ === "json"
										? He.responseText
										: He.response,
								status: He.status,
								statusText: He.statusText,
								headers: ln,
								config: E,
								request: He,
							};
						ou(
							function (Er) {
								C(Er), Le();
							},
							function (Er) {
								k(Er), Le();
							},
							wr
						),
							(He = null);
					}
					"onloadend" in He
						? (He.onloadend = Kt)
						: (He.onreadystatechange = function () {
								!He ||
									He.readyState !== 4 ||
									(He.status === 0 &&
										!(
											He.responseURL && He.responseURL.indexOf("file:") === 0
										)) ||
									setTimeout(Kt);
						  }),
						(He.onabort = function () {
							He &&
								(k(new Pe("Request aborted", Pe.ECONNABORTED, E, He)),
								(He = null));
						}),
						(He.onerror = function (ln) {
							const wr = ln && ln.message ? ln.message : "Network Error",
								Er = new Pe(wr, Pe.ERR_NETWORK, E, He);
							(Er.event = ln || null), k(Er), (He = null);
						}),
						(He.ontimeout = function () {
							let ln = z.timeout
								? "timeout of " + z.timeout + "ms exceeded"
								: "timeout exceeded";
							const wr = z.transitional || Gt;
							z.timeoutErrorMessage && (ln = z.timeoutErrorMessage),
								k(
									new Pe(
										ln,
										wr.clarifyTimeoutError ? Pe.ETIMEDOUT : Pe.ECONNABORTED,
										E,
										He
									)
								),
								(He = null);
						}),
						V === void 0 && W.setContentType(null),
						"setRequestHeader" in He &&
							X.forEach(W.toJSON(), function (ln, wr) {
								He.setRequestHeader(wr, ln);
							}),
						X.isUndefined(z.withCredentials) ||
							(He.withCredentials = !!z.withCredentials),
						$ && $ !== "json" && (He.responseType = z.responseType),
						Ge && (([nt, ot] = vo(Ge, !0)), He.addEventListener("progress", nt)),
						Oe &&
							He.upload &&
							(([Ne, Bt] = vo(Oe)),
							He.upload.addEventListener("progress", Ne),
							He.upload.addEventListener("loadend", Bt)),
						(z.cancelToken || z.signal) &&
							((Me = (ln) => {
								He &&
									(k(!ln || ln.type ? new ir(null, E, He) : ln),
									He.abort(),
									(He = null));
							}),
							z.cancelToken && z.cancelToken.subscribe(Me),
							z.signal &&
								(z.signal.aborted
									? Me()
									: z.signal.addEventListener("abort", Me)));
					const An = au(z.url);
					if (An && Xt.protocols.indexOf(An) === -1) {
						k(new Pe("Unsupported protocol " + An + ":", Pe.ERR_BAD_REQUEST, E));
						return;
					}
					He.send(V || null);
				});
			},
		lu = (E, C) => {
			const { length: k } = (E = E ? E.filter(Boolean) : []);
			if (C || k) {
				let z = new AbortController(),
					V;
				const W = function (Me) {
					if (!V) {
						(V = !0), Oe();
						const Ne = Me instanceof Error ? Me : this.reason;
						z.abort(
							Ne instanceof Pe ? Ne : new ir(Ne instanceof Error ? Ne.message : Ne)
						);
					}
				};
				let $ =
					C &&
					setTimeout(() => {
						($ = null), W(new Pe(`timeout ${C} of ms exceeded`, Pe.ETIMEDOUT));
					}, C);
				const Oe = () => {
					E &&
						($ && clearTimeout($),
						($ = null),
						E.forEach((Me) => {
							Me.unsubscribe
								? Me.unsubscribe(W)
								: Me.removeEventListener("abort", W);
						}),
						(E = null));
				};
				E.forEach((Me) => Me.addEventListener("abort", W));
				const { signal: Ge } = z;
				return (Ge.unsubscribe = () => X.asap(Oe)), Ge;
			}
		};
	const Ys = function* (E, C) {
			let k = E.byteLength;
			if (k < C) {
				yield E;
				return;
			}
			let z = 0,
				V;
			for (; z < k; ) (V = z + C), yield E.slice(z, V), (z = V);
		},
		ra = function (E, C) {
			return Dh(this, null, function* () {
				try {
					for (
						var k = pb(uu(E)), z, V, W;
						(z = !(V = yield new ui(k.next())).done);
						z = !1
					) {
						const $ = V.value;
						yield* Nh(Ys($, C));
					}
				} catch (V) {
					W = [V];
				} finally {
					try {
						z && (V = k.return) && (yield new ui(V.call(k)));
					} finally {
						if (W) throw W[0];
					}
				}
			});
		},
		uu = function (E) {
			return Dh(this, null, function* () {
				if (E[Symbol.asyncIterator]) {
					yield* Nh(E);
					return;
				}
				const C = E.getReader();
				try {
					for (;;) {
						const { done: k, value: z } = yield new ui(C.read());
						if (k) break;
						yield z;
					}
				} finally {
					yield new ui(C.cancel());
				}
			});
		},
		Is = (E, C, k, z) => {
			const V = ra(E, C);
			let W = 0,
				$,
				Oe = (Me) => {
					$ || (($ = !0), z && z(Me));
				};
			return new ReadableStream(
				{
					pull(Me) {
						return Et(this, null, function* () {
							try {
								const { done: Ne, value: nt } = yield V.next();
								if (Ne) {
									Oe(), Me.close();
									return;
								}
								let Bt = nt.byteLength;
								if (k) {
									let ot = (W += Bt);
									k(ot);
								}
								Me.enqueue(new Uint8Array(nt));
							} catch (Ne) {
								throw (Oe(Ne), Ne);
							}
						});
					},
					cancel(Me) {
						return Oe(Me), V.return();
					},
				},
				{ highWaterMark: 2 }
			);
		},
		xo = 64 * 1024,
		{ isFunction: Ri } = X,
		cu = (({ Request: E, Response: C }) => ({ Request: E, Response: C }))(X.global),
		{ ReadableStream: Gs, TextEncoder: Ti } = X.global,
		fu = (E, ...C) => {
			try {
				return !!E(...C);
			} catch (k) {
				return !1;
			}
		},
		zf = (E) => {
			E = X.merge.call({ skipUndefined: !0 }, cu, E);
			const { fetch: C, Request: k, Response: z } = E,
				V = C ? Ri(C) : typeof fetch == "function",
				W = Ri(k),
				$ = Ri(z);
			if (!V) return !1;
			const Oe = V && Ri(Gs),
				Ge =
					V &&
					(typeof Ti == "function"
						? (
								(Le) => (He) =>
									Le.encode(He)
						  )(new Ti())
						: (Le) =>
								Et(null, null, function* () {
									return new Uint8Array(yield new k(Le).arrayBuffer());
								})),
				Me =
					W &&
					Oe &&
					fu(() => {
						let Le = !1;
						const He = new k(Xt.origin, {
							body: new Gs(),
							method: "POST",
							get duplex() {
								return (Le = !0), "half";
							},
						}).headers.has("Content-Type");
						return Le && !He;
					}),
				Ne = $ && Oe && fu(() => X.isReadableStream(new z("").body)),
				nt = { stream: Ne && ((Le) => Le.body) };
			V &&
				["text", "arrayBuffer", "blob", "formData", "stream"].forEach((Le) => {
					!nt[Le] &&
						(nt[Le] = (He, Kt) => {
							let An = He && He[Le];
							if (An) return An.call(He);
							throw new Pe(
								`Response type '${Le}' is not supported`,
								Pe.ERR_NOT_SUPPORT,
								Kt
							);
						});
				});
			const Bt = (Le) =>
					Et(null, null, function* () {
						if (Le == null) return 0;
						if (X.isBlob(Le)) return Le.size;
						if (X.isSpecCompliantForm(Le))
							return (yield new k(Xt.origin, {
								method: "POST",
								body: Le,
							}).arrayBuffer()).byteLength;
						if (X.isArrayBufferView(Le) || X.isArrayBuffer(Le)) return Le.byteLength;
						if ((X.isURLSearchParams(Le) && (Le = Le + ""), X.isString(Le)))
							return (yield Ge(Le)).byteLength;
					}),
				ot = (Le, He) =>
					Et(null, null, function* () {
						const Kt = X.toFiniteNumber(Le.getContentLength());
						return Kt != null ? Kt : Bt(He);
					});
			return (Le) =>
				Et(null, null, function* () {
					let {
							url: He,
							method: Kt,
							data: An,
							signal: ln,
							cancelToken: wr,
							timeout: Er,
							onDownloadProgress: Ks,
							onUploadProgress: hu,
							responseType: ro,
							headers: Ni,
							withCredentials: Li = "same-origin",
							fetchOptions: pu,
						} = Vn(Le),
						mu = C || fetch;
					ro = ro ? (ro + "").toLowerCase() : "text";
					let zi = lu([ln, wr && wr.toAbortSignal()], Er),
						Fa = null;
					const To =
						zi &&
						zi.unsubscribe &&
						(() => {
							zi.unsubscribe();
						});
					let gu;
					try {
						if (
							hu &&
							Me &&
							Kt !== "get" &&
							Kt !== "head" &&
							(gu = yield ot(Ni, An)) !== 0
						) {
							let Hr = new k(He, { method: "POST", body: An, duplex: "half" }),
								Co;
							if (
								(X.isFormData(An) &&
									(Co = Hr.headers.get("content-type")) &&
									Ni.setContentType(Co),
								Hr.body)
							) {
								const [ji, Xa] = Va(gu, vo(vr(hu)));
								An = Is(Hr.body, xo, ji, Xa);
							}
						}
						X.isString(Li) || (Li = Li ? "include" : "omit");
						const Rr = W && "credentials" in k.prototype,
							yu = _e(P({}, pu), {
								signal: zi,
								method: Kt.toUpperCase(),
								headers: Ni.normalize().toJSON(),
								body: An,
								duplex: "half",
								credentials: Rr ? Li : void 0,
							});
						Fa = W && new k(He, yu);
						let Tr = yield W ? mu(Fa, pu) : mu(He, yu);
						const ia = Ne && (ro === "stream" || ro === "response");
						if (Ne && (Ks || (ia && To))) {
							const Hr = {};
							["status", "statusText", "headers"].forEach((Qs) => {
								Hr[Qs] = Tr[Qs];
							});
							const Co = X.toFiniteNumber(Tr.headers.get("content-length")),
								[ji, Xa] = (Ks && Va(Co, vo(vr(Ks), !0))) || [];
							Tr = new z(
								Is(Tr.body, xo, ji, () => {
									Xa && Xa(), To && To();
								}),
								Hr
							);
						}
						ro = ro || "text";
						let jf = yield nt[X.findKey(nt, ro) || "text"](Tr, Le);
						return (
							!ia && To && To(),
							yield new Promise((Hr, Co) => {
								ou(Hr, Co, {
									data: jf,
									headers: Qn.from(Tr.headers),
									status: Tr.status,
									statusText: Tr.statusText,
									config: Le,
									request: Fa,
								});
							})
						);
					} catch (Rr) {
						throw (
							(To && To(),
							Rr && Rr.name === "TypeError" && /Load failed|fetch/i.test(Rr.message)
								? Object.assign(new Pe("Network Error", Pe.ERR_NETWORK, Le, Fa), {
										cause: Rr.cause || Rr,
								  })
								: Pe.from(Rr, Rr && Rr.code, Le, Fa))
						);
					}
				});
		},
		Ci = new Map(),
		Sr = (E) => {
			let C = E ? E.env : {};
			const { fetch: k, Request: z, Response: V } = C,
				W = [z, V, k];
			let $ = W.length,
				Oe = $,
				Ge,
				Me,
				Ne = Ci;
			for (; Oe--; )
				(Ge = W[Oe]),
					(Me = Ne.get(Ge)),
					Me === void 0 && Ne.set(Ge, (Me = Oe ? new Map() : zf(C))),
					(Ne = Me);
			return Me;
		};
	Sr();
	const Ia = { http: Mt, xhr: Vs, fetch: { get: Sr } };
	X.forEach(Ia, (E, C) => {
		if (E) {
			try {
				Object.defineProperty(E, "name", { value: C });
			} catch (k) {}
			Object.defineProperty(E, "adapterName", { value: C });
		}
	});
	const Oi = (E) => `- ${E}`,
		oa = (E) => X.isFunction(E) || E === null || E === !1;
	var wo = {
		getAdapter: (E, C) => {
			E = X.isArray(E) ? E : [E];
			const { length: k } = E;
			let z, V;
			const W = {};
			for (let $ = 0; $ < k; $++) {
				z = E[$];
				let Oe;
				if (((V = z), !oa(z) && ((V = Ia[(Oe = String(z)).toLowerCase()]), V === void 0)))
					throw new Pe(`Unknown adapter '${Oe}'`);
				if (V && (X.isFunction(V) || (V = V.get(C)))) break;
				W[Oe || "#" + $] = V;
			}
			if (!V) {
				const $ = Object.entries(W).map(
					([Ge, Me]) =>
						`adapter ${Ge} ` +
						(Me === !1
							? "is not supported by the environment"
							: "is not available in the build")
				);
				let Oe = k
					? $.length > 1
						? `since :
` +
						  $.map(Oi).join(`
`)
						: " " + Oi($[0])
					: "as no adapter specified";
				throw new Pe(
					"There is no suitable adapter to dispatch the request " + Oe,
					"ERR_NOT_SUPPORT"
				);
			}
			return V;
		},
		adapters: Ia,
	};
	function Ai(E) {
		if ((E.cancelToken && E.cancelToken.throwIfRequested(), E.signal && E.signal.aborted))
			throw new ir(null, E);
	}
	function Mi(E) {
		return (
			Ai(E),
			(E.headers = Qn.from(E.headers)),
			(E.data = Ei.call(E, E.transformRequest)),
			["post", "put", "patch"].indexOf(E.method) !== -1 &&
				E.headers.setContentType("application/x-www-form-urlencoded", !1),
			wo
				.getAdapter(
					E.adapter || ar.adapter,
					E
				)(E)
				.then(
					function (C) {
						return (
							Ai(E),
							(C.data = Ei.call(E, E.transformResponse, C)),
							(C.headers = Qn.from(C.headers)),
							C
						);
					},
					function (C) {
						return (
							eo(C) ||
								(Ai(E),
								C &&
									C.response &&
									((C.response.data = Ei.call(
										E,
										E.transformResponse,
										C.response
									)),
									(C.response.headers = Qn.from(C.response.headers)))),
							Promise.reject(C)
						);
					}
				)
		);
	}
	const Fs = "1.12.2",
		to = {};
	["object", "boolean", "number", "function", "string", "symbol"].forEach((E, C) => {
		to[E] = function (k) {
			return typeof k === E || "a" + (C < 1 ? "n " : " ") + E;
		};
	});
	const xr = {};
	(to.transitional = function (E, C, k) {
		function z(V, W) {
			return "[Axios v" + Fs + "] Transitional option '" + V + "'" + W + (k ? ". " + k : "");
		}
		return (V, W, $) => {
			if (E === !1)
				throw new Pe(z(W, " has been removed" + (C ? " in " + C : "")), Pe.ERR_DEPRECATED);
			return (
				C &&
					!xr[W] &&
					((xr[W] = !0),
					console.warn(
						z(
							W,
							" has been deprecated since v" +
								C +
								" and will be removed in the near future"
						)
					)),
				E ? E(V, W, $) : !0
			);
		};
	}),
		(to.spelling = function (E) {
			return (C, k) => (console.warn(`${k} is likely a misspelling of ${E}`), !0);
		});
	function Xs(E, C, k) {
		if (typeof E != "object")
			throw new Pe("options must be an object", Pe.ERR_BAD_OPTION_VALUE);
		const z = Object.keys(E);
		let V = z.length;
		for (; V-- > 0; ) {
			const W = z[V],
				$ = C[W];
			if ($) {
				const Oe = E[W],
					Ge = Oe === void 0 || $(Oe, W, E);
				if (Ge !== !0)
					throw new Pe("option " + W + " must be " + Ge, Pe.ERR_BAD_OPTION_VALUE);
				continue;
			}
			if (k !== !0) throw new Pe("Unknown option " + W, Pe.ERR_BAD_OPTION);
		}
	}
	var no = { assertOptions: Xs, validators: to };
	const wn = no.validators;
	class aa {
		constructor(C) {
			(this.defaults = C || {}),
				(this.interceptors = { request: new It(), response: new It() });
		}
		request(C, k) {
			return Et(this, null, function* () {
				try {
					return yield this._request(C, k);
				} catch (z) {
					if (z instanceof Error) {
						let V = {};
						Error.captureStackTrace ? Error.captureStackTrace(V) : (V = new Error());
						const W = V.stack ? V.stack.replace(/^.+\n/, "") : "";
						try {
							z.stack
								? W &&
								  !String(z.stack).endsWith(W.replace(/^.+\n.+\n/, "")) &&
								  (z.stack +=
										`
` + W)
								: (z.stack = W);
						} catch ($) {}
					}
					throw z;
				}
			});
		}
		_request(C, k) {
			typeof C == "string" ? ((k = k || {}), (k.url = C)) : (k = C || {}),
				(k = So(this.defaults, k));
			const { transitional: z, paramsSerializer: V, headers: W } = k;
			z !== void 0 &&
				no.assertOptions(
					z,
					{
						silentJSONParsing: wn.transitional(wn.boolean),
						forcedJSONParsing: wn.transitional(wn.boolean),
						clarifyTimeoutError: wn.transitional(wn.boolean),
					},
					!1
				),
				V != null &&
					(X.isFunction(V)
						? (k.paramsSerializer = { serialize: V })
						: no.assertOptions(
								V,
								{ encode: wn.function, serialize: wn.function },
								!0
						  )),
				k.allowAbsoluteUrls !== void 0 ||
					(this.defaults.allowAbsoluteUrls !== void 0
						? (k.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
						: (k.allowAbsoluteUrls = !0)),
				no.assertOptions(
					k,
					{
						baseUrl: wn.spelling("baseURL"),
						withXsrfToken: wn.spelling("withXSRFToken"),
					},
					!0
				),
				(k.method = (k.method || this.defaults.method || "get").toLowerCase());
			let $ = W && X.merge(W.common, W[k.method]);
			W &&
				X.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (Le) => {
					delete W[Le];
				}),
				(k.headers = Qn.concat($, W));
			const Oe = [];
			let Ge = !0;
			this.interceptors.request.forEach(function (Le) {
				(typeof Le.runWhen == "function" && Le.runWhen(k) === !1) ||
					((Ge = Ge && Le.synchronous), Oe.unshift(Le.fulfilled, Le.rejected));
			});
			const Me = [];
			this.interceptors.response.forEach(function (Le) {
				Me.push(Le.fulfilled, Le.rejected);
			});
			let Ne,
				nt = 0,
				Bt;
			if (!Ge) {
				const Le = [Mi.bind(this), void 0];
				for (
					Le.unshift(...Oe), Le.push(...Me), Bt = Le.length, Ne = Promise.resolve(k);
					nt < Bt;

				)
					Ne = Ne.then(Le[nt++], Le[nt++]);
				return Ne;
			}
			Bt = Oe.length;
			let ot = k;
			for (; nt < Bt; ) {
				const Le = Oe[nt++],
					He = Oe[nt++];
				try {
					ot = Le(ot);
				} catch (Kt) {
					He.call(this, Kt);
					break;
				}
			}
			try {
				Ne = Mi.call(this, ot);
			} catch (Le) {
				return Promise.reject(Le);
			}
			for (nt = 0, Bt = Me.length; nt < Bt; ) Ne = Ne.then(Me[nt++], Me[nt++]);
			return Ne;
		}
		getUri(C) {
			C = So(this.defaults, C);
			const k = Ps(C.baseURL, C.url, C.allowAbsoluteUrls);
			return _t(k, C.params, C.paramsSerializer);
		}
	}
	X.forEach(["delete", "get", "head", "options"], function (E) {
		aa.prototype[E] = function (C, k) {
			return this.request(So(k || {}, { method: E, url: C, data: (k || {}).data }));
		};
	}),
		X.forEach(["post", "put", "patch"], function (E) {
			function C(k) {
				return function (z, V, W) {
					return this.request(
						So(W || {}, {
							method: E,
							headers: k ? { "Content-Type": "multipart/form-data" } : {},
							url: z,
							data: V,
						})
					);
				};
			}
			(aa.prototype[E] = C()), (aa.prototype[E + "Form"] = C(!0));
		});
	var Eo = aa;
	class ki {
		constructor(C) {
			if (typeof C != "function") throw new TypeError("executor must be a function.");
			let k;
			this.promise = new Promise(function (V) {
				k = V;
			});
			const z = this;
			this.promise.then((V) => {
				if (!z._listeners) return;
				let W = z._listeners.length;
				for (; W-- > 0; ) z._listeners[W](V);
				z._listeners = null;
			}),
				(this.promise.then = (V) => {
					let W;
					const $ = new Promise((Oe) => {
						z.subscribe(Oe), (W = Oe);
					}).then(V);
					return (
						($.cancel = function () {
							z.unsubscribe(W);
						}),
						$
					);
				}),
				C(function (V, W, $) {
					z.reason || ((z.reason = new ir(V, W, $)), k(z.reason));
				});
		}
		throwIfRequested() {
			if (this.reason) throw this.reason;
		}
		subscribe(C) {
			if (this.reason) {
				C(this.reason);
				return;
			}
			this._listeners ? this._listeners.push(C) : (this._listeners = [C]);
		}
		unsubscribe(C) {
			if (!this._listeners) return;
			const k = this._listeners.indexOf(C);
			k !== -1 && this._listeners.splice(k, 1);
		}
		toAbortSignal() {
			const C = new AbortController(),
				k = (z) => {
					C.abort(z);
				};
			return this.subscribe(k), (C.signal.unsubscribe = () => this.unsubscribe(k)), C.signal;
		}
		static source() {
			let C;
			return {
				token: new ki(function (k) {
					C = k;
				}),
				cancel: C,
			};
		}
	}
	var _i = ki;
	function Di(E) {
		return function (C) {
			return E.apply(null, C);
		};
	}
	function du(E) {
		return X.isObject(E) && E.isAxiosError === !0;
	}
	const On = {
		Continue: 100,
		SwitchingProtocols: 101,
		Processing: 102,
		EarlyHints: 103,
		Ok: 200,
		Created: 201,
		Accepted: 202,
		NonAuthoritativeInformation: 203,
		NoContent: 204,
		ResetContent: 205,
		PartialContent: 206,
		MultiStatus: 207,
		AlreadyReported: 208,
		ImUsed: 226,
		MultipleChoices: 300,
		MovedPermanently: 301,
		Found: 302,
		SeeOther: 303,
		NotModified: 304,
		UseProxy: 305,
		Unused: 306,
		TemporaryRedirect: 307,
		PermanentRedirect: 308,
		BadRequest: 400,
		Unauthorized: 401,
		PaymentRequired: 402,
		Forbidden: 403,
		NotFound: 404,
		MethodNotAllowed: 405,
		NotAcceptable: 406,
		ProxyAuthenticationRequired: 407,
		RequestTimeout: 408,
		Conflict: 409,
		Gone: 410,
		LengthRequired: 411,
		PreconditionFailed: 412,
		PayloadTooLarge: 413,
		UriTooLong: 414,
		UnsupportedMediaType: 415,
		RangeNotSatisfiable: 416,
		ExpectationFailed: 417,
		ImATeapot: 418,
		MisdirectedRequest: 421,
		UnprocessableEntity: 422,
		Locked: 423,
		FailedDependency: 424,
		TooEarly: 425,
		UpgradeRequired: 426,
		PreconditionRequired: 428,
		TooManyRequests: 429,
		RequestHeaderFieldsTooLarge: 431,
		UnavailableForLegalReasons: 451,
		InternalServerError: 500,
		NotImplemented: 501,
		BadGateway: 502,
		ServiceUnavailable: 503,
		GatewayTimeout: 504,
		HttpVersionNotSupported: 505,
		VariantAlsoNegotiates: 506,
		InsufficientStorage: 507,
		LoopDetected: 508,
		NotExtended: 510,
		NetworkAuthenticationRequired: 511,
	};
	Object.entries(On).forEach(([E, C]) => {
		On[C] = E;
	});
	var Ro = On;
	function Ga(E) {
		const C = new Eo(E),
			k = n(Eo.prototype.request, C);
		return (
			X.extend(k, Eo.prototype, C, { allOwnKeys: !0 }),
			X.extend(k, C, null, { allOwnKeys: !0 }),
			(k.create = function (z) {
				return Ga(So(E, z));
			}),
			k
		);
	}
	const Ft = Ga(ar);
	return (
		(Ft.Axios = Eo),
		(Ft.CanceledError = ir),
		(Ft.CancelToken = _i),
		(Ft.isCancel = eo),
		(Ft.VERSION = Fs),
		(Ft.toFormData = rt),
		(Ft.AxiosError = Pe),
		(Ft.Cancel = Ft.CanceledError),
		(Ft.all = function (E) {
			return Promise.all(E);
		}),
		(Ft.spread = Di),
		(Ft.isAxiosError = du),
		(Ft.mergeConfig = So),
		(Ft.AxiosHeaders = Qn),
		(Ft.formToJSON = (E) => or(X.isHTMLForm(E) ? new FormData(E) : E)),
		(Ft.getAdapter = wo.getAdapter),
		(Ft.HttpStatusCode = Ro),
		(Ft.default = Ft),
		(Yh = Ft),
		Yh
	);
}
var Lb;
function O1() {
	if (Lb) return Vo;
	Lb = 1;
	var n =
		(Vo && Vo.__assign) ||
		function () {
			return (
				(n =
					Object.assign ||
					function (l) {
						for (var u, c = 1, h = arguments.length; c < h; c++) {
							u = arguments[c];
							for (var p in u)
								Object.prototype.hasOwnProperty.call(u, p) && (l[p] = u[p]);
						}
						return l;
					}),
				n.apply(this, arguments)
			);
		};
	Object.defineProperty(Vo, "__esModule", { value: !0 }),
		(Vo.getRequestHeaders = Vo.getAxiosClient = void 0);
	var r = zR();
	function o(l, u, c, h, p) {
		var f = r.default.create({ baseURL: l, headers: i(u, h, c, l, p), withCredentials: !0 });
		return (
			f.interceptors.request.use(function (y) {
				return (
					typeof window < "u" &&
						window.csrf_token &&
						window.csrf_token !== "{{ csrf_token }}" &&
						(y.headers["X-Frappe-CSRF-Token"] = window.csrf_token),
					u && h && c && (y.headers.Authorization = "".concat(h, " ").concat(c())),
					y
				);
			}),
			f
		);
	}
	Vo.getAxiosClient = o;
	function i(l, u, c, h, p) {
		l === void 0 && (l = !1);
		var f = { Accept: "application/json", "Content-Type": "application/json; charset=utf-8" };
		return (
			l && u && c && (f.Authorization = "".concat(u, " ").concat(c())),
			typeof window < "u" &&
				typeof document < "u" &&
				(window.location &&
					((h && h !== window.location.origin) ||
						(f["X-Frappe-Site-Name"] = window.location.hostname)),
				window.csrf_token &&
					window.csrf_token !== "{{ csrf_token }}" &&
					(f["X-Frappe-CSRF-Token"] = window.csrf_token)),
			n(n({}, f), p != null ? p : {})
		);
	}
	return (Vo.getRequestHeaders = i), Vo;
}
var zb;
function A1() {
	if (zb) return Gr;
	zb = 1;
	var n =
			(Gr && Gr.__assign) ||
			function () {
				return (
					(n =
						Object.assign ||
						function (u) {
							for (var c, h = 1, p = arguments.length; h < p; h++) {
								c = arguments[h];
								for (var f in c)
									Object.prototype.hasOwnProperty.call(c, f) && (u[f] = c[f]);
							}
							return u;
						}),
					n.apply(this, arguments)
				);
			},
		r =
			(Gr && Gr.__awaiter) ||
			function (u, c, h, p) {
				function f(y) {
					return y instanceof h
						? y
						: new h(function (g) {
								g(y);
						  });
				}
				return new (h || (h = Promise))(function (y, g) {
					function S(R) {
						try {
							w(p.next(R));
						} catch (O) {
							g(O);
						}
					}
					function b(R) {
						try {
							w(p.throw(R));
						} catch (O) {
							g(O);
						}
					}
					function w(R) {
						R.done ? y(R.value) : f(R.value).then(S, b);
					}
					w((p = p.apply(u, c || [])).next());
				});
			},
		o =
			(Gr && Gr.__generator) ||
			function (u, c) {
				var h = {
						label: 0,
						sent: function () {
							if (y[0] & 1) throw y[1];
							return y[1];
						},
						trys: [],
						ops: [],
					},
					p,
					f,
					y,
					g;
				return (
					(g = { next: S(0), throw: S(1), return: S(2) }),
					typeof Symbol == "function" &&
						(g[Symbol.iterator] = function () {
							return this;
						}),
					g
				);
				function S(w) {
					return function (R) {
						return b([w, R]);
					};
				}
				function b(w) {
					if (p) throw new TypeError("Generator is already executing.");
					for (; g && ((g = 0), w[0] && (h = 0)), h; )
						try {
							if (
								((p = 1),
								f &&
									(y =
										w[0] & 2
											? f.return
											: w[0]
											? f.throw || ((y = f.return) && y.call(f), 0)
											: f.next) &&
									!(y = y.call(f, w[1])).done)
							)
								return y;
							switch (((f = 0), y && (w = [w[0] & 2, y.value]), w[0])) {
								case 0:
								case 1:
									y = w;
									break;
								case 4:
									return h.label++, { value: w[1], done: !1 };
								case 5:
									h.label++, (f = w[1]), (w = [0]);
									continue;
								case 7:
									(w = h.ops.pop()), h.trys.pop();
									continue;
								default:
									if (
										((y = h.trys),
										!(y = y.length > 0 && y[y.length - 1]) &&
											(w[0] === 6 || w[0] === 2))
									) {
										h = 0;
										continue;
									}
									if (w[0] === 3 && (!y || (w[1] > y[0] && w[1] < y[3]))) {
										h.label = w[1];
										break;
									}
									if (w[0] === 6 && h.label < y[1]) {
										(h.label = y[1]), (y = w);
										break;
									}
									if (y && h.label < y[2]) {
										(h.label = y[2]), h.ops.push(w);
										break;
									}
									y[2] && h.ops.pop(), h.trys.pop();
									continue;
							}
							w = c.call(u, h);
						} catch (R) {
							(w = [6, R]), (f = 0);
						} finally {
							p = y = 0;
						}
					if (w[0] & 5) throw w[1];
					return { value: w[0] ? w[1] : void 0, done: !0 };
				}
			};
	Object.defineProperty(Gr, "__esModule", { value: !0 }), (Gr.FrappeFileUpload = void 0);
	var i = O1(),
		l = (function () {
			function u(c, h, p, f, y, g) {
				(this.appURL = c),
					(this.axios = h),
					(this.useToken = p != null ? p : !1),
					(this.token = f),
					(this.tokenType = y),
					(this.customHeaders = g);
			}
			return (
				(u.prototype.uploadFile = function (c, h, p, f) {
					return (
						f === void 0 && (f = "upload_file"),
						r(this, void 0, void 0, function () {
							var y, g, S, b, w, R, O, T;
							return o(this, function (L) {
								return (
									(y = new FormData()),
									c && y.append("file", c, c.name),
									(g = h.isPrivate),
									(S = h.folder),
									(b = h.file_url),
									(w = h.doctype),
									(R = h.docname),
									(O = h.fieldname),
									(T = h.otherData),
									g && y.append("is_private", "1"),
									S && y.append("folder", S),
									b && y.append("file_url", b),
									w &&
										R &&
										(y.append("doctype", w),
										y.append("docname", R),
										O && y.append("fieldname", O)),
									T &&
										Object.keys(T).forEach(function (M) {
											var _ = T[M];
											y.append(M, _);
										}),
									[
										2,
										this.axios
											.post("/api/method/".concat(f), y, {
												onUploadProgress: function (M) {
													p && p(M.loaded, M.total, M);
												},
												headers: n(
													n(
														{},
														(0, i.getRequestHeaders)(
															this.useToken,
															this.tokenType,
															this.token,
															this.appURL,
															this.customHeaders
														)
													),
													{ "Content-Type": "multipart/form-data" }
												),
											})
											.catch(function (M) {
												var _, N;
												throw n(n({}, M.response.data), {
													httpStatus: M.response.status,
													httpStatusText: M.response.statusText,
													message:
														(_ = M.response.data.message) !== null &&
														_ !== void 0
															? _
															: "There was an error while uploading the file.",
													exception:
														(N = M.response.data.exception) !== null &&
														N !== void 0
															? N
															: "",
												});
											}),
									]
								);
							});
						})
					);
				}),
				u
			);
		})();
	return (Gr.FrappeFileUpload = l), Gr;
}
var jb;
function jR() {
	if (jb) return zl;
	(jb = 1), Object.defineProperty(zl, "__esModule", { value: !0 }), (zl.FrappeApp = void 0);
	var n = M1(),
		r = T1(),
		o = C1(),
		i = A1(),
		l = O1(),
		u = (function () {
			function c(h, p, f, y) {
				var g, S;
				(this.url = h),
					(this.name = f != null ? f : "FrappeApp"),
					(this.useToken =
						(g = p == null ? void 0 : p.useToken) !== null && g !== void 0 ? g : !1),
					(this.token = p == null ? void 0 : p.token),
					(this.tokenType =
						(S = p == null ? void 0 : p.type) !== null && S !== void 0 ? S : "Bearer"),
					(this.customHeaders = y),
					(this.axios = (0, l.getAxiosClient)(
						this.url,
						this.useToken,
						this.token,
						this.tokenType,
						this.customHeaders
					));
			}
			return (
				(c.prototype.auth = function () {
					return new n.FrappeAuth(
						this.url,
						this.axios,
						this.useToken,
						this.token,
						this.tokenType
					);
				}),
				(c.prototype.db = function () {
					return new o.FrappeDB(
						this.url,
						this.axios,
						this.useToken,
						this.token,
						this.tokenType
					);
				}),
				(c.prototype.file = function () {
					return new i.FrappeFileUpload(
						this.url,
						this.axios,
						this.useToken,
						this.token,
						this.tokenType,
						this.customHeaders
					);
				}),
				(c.prototype.call = function () {
					return new r.FrappeCall(
						this.url,
						this.axios,
						this.useToken,
						this.token,
						this.tokenType
					);
				}),
				c
			);
		})();
	return (zl.FrappeApp = u), zl;
}
var Fr = {},
	Bb;
function BR() {
	if (Bb) return Fr;
	Bb = 1;
	var n =
			(Fr && Fr.__assign) ||
			function () {
				return (
					(n =
						Object.assign ||
						function (l) {
							for (var u, c = 1, h = arguments.length; c < h; c++) {
								u = arguments[c];
								for (var p in u)
									Object.prototype.hasOwnProperty.call(u, p) && (l[p] = u[p]);
							}
							return l;
						}),
					n.apply(this, arguments)
				);
			},
		r =
			(Fr && Fr.__awaiter) ||
			function (l, u, c, h) {
				function p(f) {
					return f instanceof c
						? f
						: new c(function (y) {
								y(f);
						  });
				}
				return new (c || (c = Promise))(function (f, y) {
					function g(w) {
						try {
							b(h.next(w));
						} catch (R) {
							y(R);
						}
					}
					function S(w) {
						try {
							b(h.throw(w));
						} catch (R) {
							y(R);
						}
					}
					function b(w) {
						w.done ? f(w.value) : p(w.value).then(g, S);
					}
					b((h = h.apply(l, u || [])).next());
				});
			},
		o =
			(Fr && Fr.__generator) ||
			function (l, u) {
				var c = {
						label: 0,
						sent: function () {
							if (f[0] & 1) throw f[1];
							return f[1];
						},
						trys: [],
						ops: [],
					},
					h,
					p,
					f,
					y;
				return (
					(y = { next: g(0), throw: g(1), return: g(2) }),
					typeof Symbol == "function" &&
						(y[Symbol.iterator] = function () {
							return this;
						}),
					y
				);
				function g(b) {
					return function (w) {
						return S([b, w]);
					};
				}
				function S(b) {
					if (h) throw new TypeError("Generator is already executing.");
					for (; y && ((y = 0), b[0] && (c = 0)), c; )
						try {
							if (
								((h = 1),
								p &&
									(f =
										b[0] & 2
											? p.return
											: b[0]
											? p.throw || ((f = p.return) && f.call(p), 0)
											: p.next) &&
									!(f = f.call(p, b[1])).done)
							)
								return f;
							switch (((p = 0), f && (b = [b[0] & 2, f.value]), b[0])) {
								case 0:
								case 1:
									f = b;
									break;
								case 4:
									return c.label++, { value: b[1], done: !1 };
								case 5:
									c.label++, (p = b[1]), (b = [0]);
									continue;
								case 7:
									(b = c.ops.pop()), c.trys.pop();
									continue;
								default:
									if (
										((f = c.trys),
										!(f = f.length > 0 && f[f.length - 1]) &&
											(b[0] === 6 || b[0] === 2))
									) {
										c = 0;
										continue;
									}
									if (b[0] === 3 && (!f || (b[1] > f[0] && b[1] < f[3]))) {
										c.label = b[1];
										break;
									}
									if (b[0] === 6 && c.label < f[1]) {
										(c.label = f[1]), (f = b);
										break;
									}
									if (f && c.label < f[2]) {
										(c.label = f[2]), c.ops.push(b);
										break;
									}
									f[2] && c.ops.pop(), c.trys.pop();
									continue;
							}
							b = u.call(l, c);
						} catch (w) {
							(b = [6, w]), (p = 0);
						} finally {
							h = f = 0;
						}
					if (b[0] & 5) throw b[1];
					return { value: b[0] ? b[1] : void 0, done: !0 };
				}
			};
	Object.defineProperty(Fr, "__esModule", { value: !0 }), (Fr.FrappeAuth = void 0);
	var i = (function () {
		function l(u, c, h, p, f) {
			(this.appURL = u),
				(this.axios = c),
				(this.useToken = h != null ? h : !1),
				(this.token = p),
				(this.tokenType = f);
		}
		return (
			(l.prototype.loginWithUsernamePassword = function (u) {
				return r(this, void 0, void 0, function () {
					return o(this, function (c) {
						return [
							2,
							this.axios
								.post("/api/method/login", {
									usr: u.username,
									pwd: u.password,
									otp: u.otp,
									tmp_id: u.tmp_id,
									device: u.device,
								})
								.then(function (h) {
									return h.data;
								})
								.catch(function (h) {
									var p, f;
									throw n(n({}, h.response.data), {
										httpStatus: h.response.status,
										httpStatusText: h.response.statusText,
										message:
											(p = h.response.data.message) !== null && p !== void 0
												? p
												: "There was an error while logging in",
										exception:
											(f = h.response.data.exception) !== null &&
											f !== void 0
												? f
												: "",
									});
								}),
						];
					});
				});
			}),
			(l.prototype.getLoggedInUser = function () {
				return r(this, void 0, void 0, function () {
					return o(this, function (u) {
						return [
							2,
							this.axios
								.get("/api/method/frappe.auth.get_logged_user")
								.then(function (c) {
									return c.data.message;
								})
								.catch(function (c) {
									var h;
									throw n(n({}, c.response.data), {
										httpStatus: c.response.status,
										httpStatusText: c.response.statusText,
										message:
											"There was an error while fetching the logged in user",
										exception:
											(h = c.response.data.exception) !== null &&
											h !== void 0
												? h
												: "",
									});
								}),
						];
					});
				});
			}),
			(l.prototype.logout = function () {
				return r(this, void 0, void 0, function () {
					return o(this, function (u) {
						return [
							2,
							this.axios
								.post("/api/method/logout", {})
								.then(function () {})
								.catch(function (c) {
									var h, p;
									throw n(n({}, c.response.data), {
										httpStatus: c.response.status,
										httpStatusText: c.response.statusText,
										message:
											(h = c.response.data.message) !== null && h !== void 0
												? h
												: "There was an error while logging out",
										exception:
											(p = c.response.data.exception) !== null &&
											p !== void 0
												? p
												: "",
									});
								}),
						];
					});
				});
			}),
			(l.prototype.forgetPassword = function (u) {
				return r(this, void 0, void 0, function () {
					return o(this, function (c) {
						return [
							2,
							this.axios
								.post("/", {
									cmd: "frappe.core.doctype.user.user.reset_password",
									user: u,
								})
								.then(function () {})
								.catch(function (h) {
									var p, f;
									throw n(n({}, h.response.data), {
										httpStatus: h.response.status,
										httpStatusText: h.response.statusText,
										message:
											(p = h.response.data.message) !== null && p !== void 0
												? p
												: "There was an error sending password reset email.",
										exception:
											(f = h.response.data.exception) !== null &&
											f !== void 0
												? f
												: "",
									});
								}),
						];
					});
				});
			}),
			l
		);
	})();
	return (Fr.FrappeAuth = i), Fr;
}
var Ub;
function M1() {
	return (
		Ub ||
			((Ub = 1),
			(function (n) {
				var r =
						(hs && hs.__createBinding) ||
						(Object.create
							? function (i, l, u, c) {
									c === void 0 && (c = u);
									var h = Object.getOwnPropertyDescriptor(l, u);
									(!h ||
										("get" in h
											? !l.__esModule
											: h.writable || h.configurable)) &&
										(h = {
											enumerable: !0,
											get: function () {
												return l[u];
											},
										}),
										Object.defineProperty(i, c, h);
							  }
							: function (i, l, u, c) {
									c === void 0 && (c = u), (i[c] = l[u]);
							  }),
					o =
						(hs && hs.__exportStar) ||
						function (i, l) {
							for (var u in i)
								u !== "default" &&
									!Object.prototype.hasOwnProperty.call(l, u) &&
									r(l, i, u);
						};
				Object.defineProperty(n, "__esModule", { value: !0 }),
					o(jR(), n),
					o(BR(), n),
					o(C1(), n),
					o(A1(), n),
					o(T1(), n);
			})(hs)),
		hs
	);
}
var UR = M1(),
	Hb = { exports: {} },
	Ih = {};
var qb;
function HR() {
	if (qb) return Ih;
	qb = 1;
	var n = De;
	function r(g, S) {
		return (g === S && (g !== 0 || 1 / g === 1 / S)) || (g !== g && S !== S);
	}
	var o = typeof Object.is == "function" ? Object.is : r,
		i = n.useState,
		l = n.useEffect,
		u = n.useLayoutEffect,
		c = n.useDebugValue;
	function h(g, S) {
		var b = S(),
			w = i({ inst: { value: b, getSnapshot: S } }),
			R = w[0].inst,
			O = w[1];
		return (
			u(
				function () {
					(R.value = b), (R.getSnapshot = S), p(R) && O({ inst: R });
				},
				[g, b, S]
			),
			l(
				function () {
					return (
						p(R) && O({ inst: R }),
						g(function () {
							p(R) && O({ inst: R });
						})
					);
				},
				[g]
			),
			c(b),
			b
		);
	}
	function p(g) {
		var S = g.getSnapshot;
		g = g.value;
		try {
			var b = S();
			return !o(g, b);
		} catch (w) {
			return !0;
		}
	}
	function f(g, S) {
		return S();
	}
	var y =
		typeof window > "u" ||
		typeof window.document > "u" ||
		typeof window.document.createElement > "u"
			? f
			: h;
	return (
		(Ih.useSyncExternalStore = n.useSyncExternalStore !== void 0 ? n.useSyncExternalStore : y),
		Ih
	);
}
var Pb;
function qR() {
	return Pb || ((Pb = 1), (Hb.exports = HR())), Hb.exports;
}
var PR = qR();
const k1 = 0,
	_1 = 1,
	D1 = 2,
	Vb = 3;
var Yb = Object.prototype.hasOwnProperty;
function gp(n, r) {
	var o, i;
	if (n === r) return !0;
	if (n && r && (o = n.constructor) === r.constructor) {
		if (o === Date) return n.getTime() === r.getTime();
		if (o === RegExp) return n.toString() === r.toString();
		if (o === Array) {
			if ((i = n.length) === r.length) for (; i-- && gp(n[i], r[i]); );
			return i === -1;
		}
		if (!o || typeof n == "object") {
			i = 0;
			for (o in n)
				if ((Yb.call(n, o) && ++i && !Yb.call(r, o)) || !(o in r) || !gp(n[o], r[o]))
					return !1;
			return Object.keys(r).length === i;
		}
	}
	return n !== n && r !== r;
}
const Fo = new WeakMap(),
	_a = () => {},
	zn = _a(),
	ef = Object,
	Rt = (n) => n === zn,
	Zr = (n) => typeof n == "function",
	Qo = (n, r) => P(P({}, n), r),
	N1 = (n) => Zr(n.then),
	Gh = {},
	Ec = {},
	tm = "undefined",
	Jl = typeof window != tm,
	yp = typeof document != tm,
	VR = Jl && "Deno" in window,
	YR = () => Jl && typeof window.requestAnimationFrame != tm,
	L1 = (n, r) => {
		const o = Fo.get(n);
		return [
			() => (!Rt(r) && n.get(r)) || Gh,
			(i) => {
				if (!Rt(r)) {
					const l = n.get(r);
					r in Ec || (Ec[r] = l), o[5](r, Qo(l, i), l || Gh);
				}
			},
			o[6],
			() => (!Rt(r) && r in Ec ? Ec[r] : (!Rt(r) && n.get(r)) || Gh),
		];
	};
let bp = !0;
const IR = () => bp,
	[vp, Sp] =
		Jl && window.addEventListener
			? [window.addEventListener.bind(window), window.removeEventListener.bind(window)]
			: [_a, _a],
	GR = () => {
		const n = yp && document.visibilityState;
		return Rt(n) || n !== "hidden";
	},
	FR = (n) => (
		yp && document.addEventListener("visibilitychange", n),
		vp("focus", n),
		() => {
			yp && document.removeEventListener("visibilitychange", n), Sp("focus", n);
		}
	),
	XR = (n) => {
		const r = () => {
				(bp = !0), n();
			},
			o = () => {
				bp = !1;
			};
		return (
			vp("online", r),
			vp("offline", o),
			() => {
				Sp("online", r), Sp("offline", o);
			}
		);
	},
	KR = { isOnline: IR, isVisible: GR },
	QR = { initFocus: FR, initReconnect: XR },
	Ib = !De.useId,
	Fl = !Jl || VR,
	ZR = (n) => (YR() ? window.requestAnimationFrame(n) : setTimeout(n, 1)),
	Ic = Fl ? v.useEffect : v.useLayoutEffect,
	Fh = typeof navigator < "u" && navigator.connection,
	Gb = !Fl && Fh && (["slow-2g", "2g"].includes(Fh.effectiveType) || Fh.saveData),
	Rc = new WeakMap(),
	JR = (n) => ef.prototype.toString.call(n),
	Xh = (n, r) => n === `[object ${r}]`;
let WR = 0;
const xp = (n) => {
		const r = typeof n,
			o = JR(n),
			i = Xh(o, "Date"),
			l = Xh(o, "RegExp"),
			u = Xh(o, "Object");
		let c, h;
		if (ef(n) === n && !i && !l) {
			if (((c = Rc.get(n)), c)) return c;
			if (((c = ++WR + "~"), Rc.set(n, c), Array.isArray(n))) {
				for (c = "@", h = 0; h < n.length; h++) c += xp(n[h]) + ",";
				Rc.set(n, c);
			}
			if (u) {
				c = "#";
				const p = ef.keys(n).sort();
				for (; !Rt((h = p.pop())); ) Rt(n[h]) || (c += h + ":" + xp(n[h]) + ",");
				Rc.set(n, c);
			}
		} else
			c = i
				? n.toJSON()
				: r == "symbol"
				? n.toString()
				: r == "string"
				? JSON.stringify(n)
				: "" + n;
		return c;
	},
	nm = (n) => {
		if (Zr(n))
			try {
				n = n();
			} catch (o) {
				n = "";
			}
		const r = n;
		return (
			(n = typeof n == "string" ? n : (Array.isArray(n) ? n.length : n) ? xp(n) : ""), [n, r]
		);
	};
let $R = 0;
const wp = () => ++$R;
function z1(...n) {
	return Et(this, null, function* () {
		const [r, o, i, l] = n,
			u = Qo(
				{ populateCache: !0, throwOnError: !0 },
				typeof l == "boolean" ? { revalidate: l } : l || {}
			);
		let c = u.populateCache;
		const h = u.rollbackOnError;
		let p = u.optimisticData;
		const f = (S) => (typeof h == "function" ? h(S) : h !== !1),
			y = u.throwOnError;
		if (Zr(o)) {
			const S = o,
				b = [],
				w = r.keys();
			for (const R of w) !/^\$(inf|sub)\$/.test(R) && S(r.get(R)._k) && b.push(R);
			return Promise.all(b.map(g));
		}
		return g(o);
		function g(S) {
			return Et(this, null, function* () {
				const [b] = nm(S);
				if (!b) return;
				const [w, R] = L1(r, b),
					[O, T, L, M] = Fo.get(r),
					_ = () => {
						const xe = O[b];
						return (Zr(u.revalidate)
							? u.revalidate(w().data, S)
							: u.revalidate !== !1) && (delete L[b], delete M[b], xe && xe[0])
							? xe[0](D1).then(() => w().data)
							: w().data;
					};
				if (n.length < 3) return _();
				let N = i,
					D,
					H = !1;
				const U = wp();
				T[b] = [U, 0];
				const fe = !Rt(p),
					we = w(),
					se = we.data,
					Y = we._c,
					oe = Rt(Y) ? se : Y;
				if ((fe && ((p = Zr(p) ? p(oe, se) : p), R({ data: p, _c: oe })), Zr(N)))
					try {
						N = N(oe);
					} catch (xe) {
						(D = xe), (H = !0);
					}
				if (N && N1(N))
					if (
						((N = yield N.catch((xe) => {
							(D = xe), (H = !0);
						})),
						U !== T[b][0])
					) {
						if (H) throw D;
						return N;
					} else H && fe && f(D) && ((c = !0), R({ data: oe, _c: zn }));
				if (c && !H)
					if (Zr(c)) {
						const xe = c(N, oe);
						R({ data: xe, error: zn, _c: zn });
					} else R({ data: N, error: zn, _c: zn });
				if (
					((T[b][1] = wp()),
					Promise.resolve(_()).then(() => {
						R({ _c: zn });
					}),
					H)
				) {
					if (y) throw D;
					return;
				}
				return N;
			});
		}
	});
}
const Fb = (n, r) => {
		for (const o in n) n[o][0] && n[o][0](r);
	},
	j1 = (n, r) => {
		if (!Fo.has(n)) {
			const o = Qo(QR, r),
				i = Object.create(null),
				l = z1.bind(zn, n);
			let u = _a;
			const c = Object.create(null),
				h = (y, g) => {
					const S = c[y] || [];
					return (c[y] = S), S.push(g), () => S.splice(S.indexOf(g), 1);
				},
				p = (y, g, S) => {
					n.set(y, g);
					const b = c[y];
					if (b) for (const w of b) w(g, S);
				},
				f = () => {
					if (
						!Fo.has(n) &&
						(Fo.set(n, [
							i,
							Object.create(null),
							Object.create(null),
							Object.create(null),
							l,
							p,
							h,
						]),
						!Fl)
					) {
						const y = o.initFocus(setTimeout.bind(zn, Fb.bind(zn, i, k1))),
							g = o.initReconnect(setTimeout.bind(zn, Fb.bind(zn, i, _1)));
						u = () => {
							y && y(), g && g(), Fo.delete(n);
						};
					}
				};
			return f(), [n, l, f, u];
		}
		return [n, Fo.get(n)[4]];
	},
	eT = (n, r, o, i, l) => {
		const u = o.errorRetryCount,
			c = l.retryCount,
			h = ~~((Math.random() + 0.5) * (1 << (c < 8 ? c : 8))) * o.errorRetryInterval;
		(!Rt(u) && c > u) || setTimeout(i, h, l);
	},
	tT = gp,
	[rm, nT] = j1(new Map()),
	B1 = Qo(
		{
			onLoadingSlow: _a,
			onSuccess: _a,
			onError: _a,
			onErrorRetry: eT,
			onDiscarded: _a,
			revalidateOnFocus: !0,
			revalidateOnReconnect: !0,
			revalidateIfStale: !0,
			shouldRetryOnError: !0,
			errorRetryInterval: Gb ? 1e4 : 5e3,
			focusThrottleInterval: 5 * 1e3,
			dedupingInterval: 2 * 1e3,
			loadingTimeout: Gb ? 5e3 : 3e3,
			compare: tT,
			isPaused: () => !1,
			cache: rm,
			mutate: nT,
			fallback: {},
		},
		KR
	),
	U1 = (n, r) => {
		const o = Qo(n, r);
		if (r) {
			const { use: i, fallback: l } = n,
				{ use: u, fallback: c } = r;
			i && u && (o.use = i.concat(u)), l && c && (o.fallback = Qo(l, c));
		}
		return o;
	},
	Ep = v.createContext({}),
	rT = (n) => {
		const { value: r } = n,
			o = v.useContext(Ep),
			i = Zr(r),
			l = v.useMemo(() => (i ? r(o) : r), [i, o, r]),
			u = v.useMemo(() => (i ? l : U1(o, l)), [i, o, l]),
			c = l && l.provider,
			h = v.useRef(zn);
		c && !h.current && (h.current = j1(c(u.cache || rm), l));
		const p = h.current;
		return (
			p && ((u.cache = p[0]), (u.mutate = p[1])),
			Ic(() => {
				if (p) return p[2] && p[2](), p[3];
			}, []),
			v.createElement(Ep.Provider, Qo(n, { value: u }))
		);
	},
	oT = "$inf$",
	H1 = Jl && window.__SWR_DEVTOOLS_USE__,
	aT = H1 ? window.__SWR_DEVTOOLS_USE__ : [],
	iT = () => {
		H1 && (window.__SWR_DEVTOOLS_REACT__ = De);
	},
	sT = (n) =>
		Zr(n[1]) ? [n[0], n[1], n[2] || {}] : [n[0], null, (n[1] === null ? n[2] : n[1]) || {}],
	lT = () => {
		const n = v.useContext(Ep);
		return v.useMemo(() => Qo(B1, n), [n]);
	},
	uT = (n) => (r, o, i) =>
		n(
			r,
			o &&
				((...l) => {
					const [u] = nm(r),
						[, , , c] = Fo.get(rm);
					if (u.startsWith(oT)) return o(...l);
					const h = c[u];
					return Rt(h) ? o(...l) : (delete c[u], h);
				}),
			i
		),
	cT = aT.concat(uT),
	fT = (n) =>
		function (...r) {
			const o = lT(),
				[i, l, u] = sT(r),
				c = U1(o, u);
			let h = n;
			const { use: p } = c,
				f = (p || []).concat(cT);
			for (let y = f.length; y--; ) h = f[y](h);
			return h(i, l || c.fetcher || null, c);
		},
	dT = (n, r, o) => {
		const i = r[n] || (r[n] = []);
		return (
			i.push(o),
			() => {
				const l = i.indexOf(o);
				l >= 0 && ((i[l] = i[i.length - 1]), i.pop());
			}
		);
	};
iT();
const Kh =
		De.use ||
		((n) => {
			switch (n.status) {
				case "pending":
					throw n;
				case "fulfilled":
					return n.value;
				case "rejected":
					throw n.reason;
				default:
					throw (
						((n.status = "pending"),
						n.then(
							(r) => {
								(n.status = "fulfilled"), (n.value = r);
							},
							(r) => {
								(n.status = "rejected"), (n.reason = r);
							}
						),
						n)
					);
			}
		}),
	Qh = { dedupe: !0 },
	Xb = Promise.resolve(zn),
	hT = (n, r, o) => {
		const {
				cache: i,
				compare: l,
				suspense: u,
				fallbackData: c,
				revalidateOnMount: h,
				revalidateIfStale: p,
				refreshInterval: f,
				refreshWhenHidden: y,
				refreshWhenOffline: g,
				keepPreviousData: S,
			} = o,
			[b, w, R, O] = Fo.get(i),
			[T, L] = nm(n),
			M = v.useRef(!1),
			_ = v.useRef(!1),
			N = v.useRef(T),
			D = v.useRef(r),
			H = v.useRef(o),
			U = () => H.current,
			fe = () => U().isVisible() && U().isOnline(),
			[we, se, Y, oe] = L1(i, T),
			xe = v.useRef({}).current,
			ge = Rt(c) ? (Rt(o.fallback) ? zn : o.fallback[T]) : c,
			j = (re, ce) => {
				for (const de in xe) {
					const Te = de;
					if (Te === "data") {
						if (!l(re[Te], ce[Te]) && (!Rt(re[Te]) || !l(me, ce[Te]))) return !1;
					} else if (ce[Te] !== re[Te]) return !1;
				}
				return !0;
			},
			I = v.useMemo(() => {
				const re = !T || !r ? !1 : Rt(h) ? (U().isPaused() || u ? !1 : p !== !1) : h,
					ce = (le) => {
						const Ae = Qo(le);
						return delete Ae._k, re ? P({ isValidating: !0, isLoading: !0 }, Ae) : Ae;
					},
					de = we(),
					Te = oe(),
					Re = ce(de),
					ze = de === Te ? Re : ce(Te);
				let Ce = Re;
				return [
					() => {
						const le = ce(we());
						return j(le, Ce)
							? ((Ce.data = le.data),
							  (Ce.isLoading = le.isLoading),
							  (Ce.isValidating = le.isValidating),
							  (Ce.error = le.error),
							  Ce)
							: ((Ce = le), le);
					},
					() => ze,
				];
			}, [i, T]),
			F = PR.useSyncExternalStore(
				v.useCallback(
					(re) =>
						Y(T, (ce, de) => {
							j(de, ce) || re();
						}),
					[i, T]
				),
				I[0],
				I[1]
			),
			pe = !M.current,
			J = b[T] && b[T].length > 0,
			B = F.data,
			Z = Rt(B) ? (ge && N1(ge) ? Kh(ge) : ge) : B,
			ee = F.error,
			ie = v.useRef(Z),
			me = S ? (Rt(B) ? (Rt(ie.current) ? Z : ie.current) : B) : Z,
			ve =
				J && !Rt(ee)
					? !1
					: pe && !Rt(h)
					? h
					: U().isPaused()
					? !1
					: u
					? Rt(Z)
						? !1
						: p
					: Rt(Z) || p,
			ke = !!(T && r && pe && ve),
			je = Rt(F.isValidating) ? ke : F.isValidating,
			Ee = Rt(F.isLoading) ? ke : F.isLoading,
			Qe = v.useCallback(
				(re) =>
					Et(null, null, function* () {
						const ce = D.current;
						if (!T || !ce || _.current || U().isPaused()) return !1;
						let de,
							Te,
							Re = !0;
						const ze = re || {},
							Ce = !R[T] || !ze.dedupe,
							le = () =>
								Ib ? !_.current && T === N.current && M.current : T === N.current,
							Ae = { isValidating: !1, isLoading: !1 },
							Se = () => {
								se(Ae);
							},
							Ue = () => {
								const qe = R[T];
								qe && qe[1] === Te && delete R[T];
							},
							Ye = { isValidating: !0 };
						Rt(we().data) && (Ye.isLoading = !0);
						try {
							if (
								(Ce &&
									(se(Ye),
									o.loadingTimeout &&
										Rt(we().data) &&
										setTimeout(() => {
											Re && le() && U().onLoadingSlow(T, o);
										}, o.loadingTimeout),
									(R[T] = [ce(L), wp()])),
								([de, Te] = R[T]),
								(de = yield de),
								Ce && setTimeout(Ue, o.dedupingInterval),
								!R[T] || R[T][1] !== Te)
							)
								return Ce && le() && U().onDiscarded(T), !1;
							Ae.error = zn;
							const qe = w[T];
							if (!Rt(qe) && (Te <= qe[0] || Te <= qe[1] || qe[1] === 0))
								return Se(), Ce && le() && U().onDiscarded(T), !1;
							const X = we().data;
							(Ae.data = l(X, de) ? X : de), Ce && le() && U().onSuccess(de, T, o);
						} catch (qe) {
							Ue();
							const X = U(),
								{ shouldRetryOnError: Pe } = X;
							X.isPaused() ||
								((Ae.error = qe),
								Ce &&
									le() &&
									(X.onError(qe, T, X),
									(Pe === !0 || (Zr(Pe) && Pe(qe))) &&
										(!U().revalidateOnFocus ||
											!U().revalidateOnReconnect ||
											fe()) &&
										X.onErrorRetry(
											qe,
											T,
											X,
											(Jt) => {
												const st = b[T];
												st && st[0] && st[0](Vb, Jt);
											},
											{ retryCount: (ze.retryCount || 0) + 1, dedupe: !0 }
										)));
						}
						return (Re = !1), Se(), !0;
					}),
				[T, i]
			),
			it = v.useCallback((...re) => z1(i, N.current, ...re), []);
		if (
			(Ic(() => {
				(D.current = r), (H.current = o), Rt(B) || (ie.current = B);
			}),
			Ic(() => {
				if (!T) return;
				const re = Qe.bind(zn, Qh);
				let ce = 0;
				U().revalidateOnFocus && (ce = Date.now() + U().focusThrottleInterval);
				const de = dT(T, b, (Te, Re = {}) => {
					if (Te == k1) {
						const ze = Date.now();
						U().revalidateOnFocus &&
							ze > ce &&
							fe() &&
							((ce = ze + U().focusThrottleInterval), re());
					} else if (Te == _1) U().revalidateOnReconnect && fe() && re();
					else {
						if (Te == D1) return Qe();
						if (Te == Vb) return Qe(Re);
					}
				});
				return (
					(_.current = !1),
					(N.current = T),
					(M.current = !0),
					se({ _k: L }),
					ve && (R[T] || (Rt(Z) || Fl ? re() : ZR(re))),
					() => {
						(_.current = !0), de();
					}
				);
			}, [T]),
			Ic(() => {
				let re;
				function ce() {
					const Te = Zr(f) ? f(we().data) : f;
					Te && re !== -1 && (re = setTimeout(de, Te));
				}
				function de() {
					!we().error && (y || U().isVisible()) && (g || U().isOnline())
						? Qe(Qh).then(ce)
						: ce();
				}
				return (
					ce(),
					() => {
						re && (clearTimeout(re), (re = -1));
					}
				);
			}, [f, y, g, T]),
			v.useDebugValue(me),
			u)
		) {
			const re = T && Rt(Z);
			if (!Ib && Fl && re)
				throw new Error("Fallback data is required when using Suspense in SSR.");
			re && ((D.current = r), (H.current = o), (_.current = !1));
			const ce = O[T],
				de = !Rt(ce) && re ? it(ce) : Xb;
			if ((Kh(de), !Rt(ee) && re)) throw ee;
			const Te = re ? Qe(Qh) : Xb;
			!Rt(me) && re && ((Te.status = "fulfilled"), (Te.value = !0)), Kh(Te);
		}
		return {
			mutate: it,
			get data() {
				return (xe.data = !0), me;
			},
			get error() {
				return (xe.error = !0), ee;
			},
			get isValidating() {
				return (xe.isValidating = !0), je;
			},
			get isLoading() {
				return (xe.isLoading = !0), Ee;
			},
		};
	},
	pT = ef.defineProperty(rT, "defaultValue", { value: B1 }),
	om = fT(hT);
Promise.resolve();
const po = Object.create(null);
po.open = "0";
po.close = "1";
po.ping = "2";
po.pong = "3";
po.message = "4";
po.upgrade = "5";
po.noop = "6";
const Gc = Object.create(null);
Object.keys(po).forEach((n) => {
	Gc[po[n]] = n;
});
const Rp = { type: "error", data: "parser error" },
	q1 =
		typeof Blob == "function" ||
		(typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]"),
	P1 = typeof ArrayBuffer == "function",
	V1 = (n) =>
		typeof ArrayBuffer.isView == "function"
			? ArrayBuffer.isView(n)
			: n && n.buffer instanceof ArrayBuffer,
	am = ({ type: n, data: r }, o, i) =>
		q1 && r instanceof Blob
			? o
				? i(r)
				: Kb(r, i)
			: P1 && (r instanceof ArrayBuffer || V1(r))
			? o
				? i(r)
				: Kb(new Blob([r]), i)
			: i(po[n] + (r || "")),
	Kb = (n, r) => {
		const o = new FileReader();
		return (
			(o.onload = function () {
				const i = o.result.split(",")[1];
				r("b" + (i || ""));
			}),
			o.readAsDataURL(n)
		);
	};
function Qb(n) {
	return n instanceof Uint8Array
		? n
		: n instanceof ArrayBuffer
		? new Uint8Array(n)
		: new Uint8Array(n.buffer, n.byteOffset, n.byteLength);
}
let Zh;
function mT(n, r) {
	if (q1 && n.data instanceof Blob) return n.data.arrayBuffer().then(Qb).then(r);
	if (P1 && (n.data instanceof ArrayBuffer || V1(n.data))) return r(Qb(n.data));
	am(n, !1, (o) => {
		Zh || (Zh = new TextEncoder()), r(Zh.encode(o));
	});
}
const Zb = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	Hl = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let n = 0; n < Zb.length; n++) Hl[Zb.charCodeAt(n)] = n;
const gT = (n) => {
		let r = n.length * 0.75,
			o = n.length,
			i,
			l = 0,
			u,
			c,
			h,
			p;
		n[n.length - 1] === "=" && (r--, n[n.length - 2] === "=" && r--);
		const f = new ArrayBuffer(r),
			y = new Uint8Array(f);
		for (i = 0; i < o; i += 4)
			(u = Hl[n.charCodeAt(i)]),
				(c = Hl[n.charCodeAt(i + 1)]),
				(h = Hl[n.charCodeAt(i + 2)]),
				(p = Hl[n.charCodeAt(i + 3)]),
				(y[l++] = (u << 2) | (c >> 4)),
				(y[l++] = ((c & 15) << 4) | (h >> 2)),
				(y[l++] = ((h & 3) << 6) | (p & 63));
		return f;
	},
	yT = typeof ArrayBuffer == "function",
	im = (n, r) => {
		if (typeof n != "string") return { type: "message", data: Y1(n, r) };
		const o = n.charAt(0);
		return o === "b"
			? { type: "message", data: bT(n.substring(1), r) }
			: Gc[o]
			? n.length > 1
				? { type: Gc[o], data: n.substring(1) }
				: { type: Gc[o] }
			: Rp;
	},
	bT = (n, r) => {
		if (yT) {
			const o = gT(n);
			return Y1(o, r);
		} else return { base64: !0, data: n };
	},
	Y1 = (n, r) =>
		r === "blob"
			? n instanceof Blob
				? n
				: new Blob([n])
			: n instanceof ArrayBuffer
			? n
			: n.buffer,
	I1 = "",
	vT = (n, r) => {
		const o = n.length,
			i = new Array(o);
		let l = 0;
		n.forEach((u, c) => {
			am(u, !1, (h) => {
				(i[c] = h), ++l === o && r(i.join(I1));
			});
		});
	},
	ST = (n, r) => {
		const o = n.split(I1),
			i = [];
		for (let l = 0; l < o.length; l++) {
			const u = im(o[l], r);
			if ((i.push(u), u.type === "error")) break;
		}
		return i;
	};
function xT() {
	return new TransformStream({
		transform(n, r) {
			mT(n, (o) => {
				const i = o.length;
				let l;
				if (i < 126) (l = new Uint8Array(1)), new DataView(l.buffer).setUint8(0, i);
				else if (i < 65536) {
					l = new Uint8Array(3);
					const u = new DataView(l.buffer);
					u.setUint8(0, 126), u.setUint16(1, i);
				} else {
					l = new Uint8Array(9);
					const u = new DataView(l.buffer);
					u.setUint8(0, 127), u.setBigUint64(1, BigInt(i));
				}
				n.data && typeof n.data != "string" && (l[0] |= 128), r.enqueue(l), r.enqueue(o);
			});
		},
	});
}
let Jh;
function Tc(n) {
	return n.reduce((r, o) => r + o.length, 0);
}
function Cc(n, r) {
	if (n[0].length === r) return n.shift();
	const o = new Uint8Array(r);
	let i = 0;
	for (let l = 0; l < r; l++) (o[l] = n[0][i++]), i === n[0].length && (n.shift(), (i = 0));
	return n.length && i < n[0].length && (n[0] = n[0].slice(i)), o;
}
function wT(n, r) {
	Jh || (Jh = new TextDecoder());
	const o = [];
	let i = 0,
		l = -1,
		u = !1;
	return new TransformStream({
		transform(c, h) {
			for (o.push(c); ; ) {
				if (i === 0) {
					if (Tc(o) < 1) break;
					const p = Cc(o, 1);
					(u = (p[0] & 128) === 128),
						(l = p[0] & 127),
						l < 126 ? (i = 3) : l === 126 ? (i = 1) : (i = 2);
				} else if (i === 1) {
					if (Tc(o) < 2) break;
					const p = Cc(o, 2);
					(l = new DataView(p.buffer, p.byteOffset, p.length).getUint16(0)), (i = 3);
				} else if (i === 2) {
					if (Tc(o) < 8) break;
					const p = Cc(o, 8),
						f = new DataView(p.buffer, p.byteOffset, p.length),
						y = f.getUint32(0);
					if (y > Math.pow(2, 21) - 1) {
						h.enqueue(Rp);
						break;
					}
					(l = y * Math.pow(2, 32) + f.getUint32(4)), (i = 3);
				} else {
					if (Tc(o) < l) break;
					const p = Cc(o, l);
					h.enqueue(im(u ? p : Jh.decode(p), r)), (i = 0);
				}
				if (l === 0 || l > n) {
					h.enqueue(Rp);
					break;
				}
			}
		},
	});
}
const G1 = 4;
function vn(n) {
	if (n) return ET(n);
}
function ET(n) {
	for (var r in vn.prototype) n[r] = vn.prototype[r];
	return n;
}
vn.prototype.on = vn.prototype.addEventListener = function (n, r) {
	return (
		(this._callbacks = this._callbacks || {}),
		(this._callbacks["$" + n] = this._callbacks["$" + n] || []).push(r),
		this
	);
};
vn.prototype.once = function (n, r) {
	function o() {
		this.off(n, o), r.apply(this, arguments);
	}
	return (o.fn = r), this.on(n, o), this;
};
vn.prototype.off =
	vn.prototype.removeListener =
	vn.prototype.removeAllListeners =
	vn.prototype.removeEventListener =
		function (n, r) {
			if (((this._callbacks = this._callbacks || {}), arguments.length == 0))
				return (this._callbacks = {}), this;
			var o = this._callbacks["$" + n];
			if (!o) return this;
			if (arguments.length == 1) return delete this._callbacks["$" + n], this;
			for (var i, l = 0; l < o.length; l++)
				if (((i = o[l]), i === r || i.fn === r)) {
					o.splice(l, 1);
					break;
				}
			return o.length === 0 && delete this._callbacks["$" + n], this;
		};
vn.prototype.emit = function (n) {
	this._callbacks = this._callbacks || {};
	for (
		var r = new Array(arguments.length - 1), o = this._callbacks["$" + n], i = 1;
		i < arguments.length;
		i++
	)
		r[i - 1] = arguments[i];
	if (o) {
		o = o.slice(0);
		for (var i = 0, l = o.length; i < l; ++i) o[i].apply(this, r);
	}
	return this;
};
vn.prototype.emitReserved = vn.prototype.emit;
vn.prototype.listeners = function (n) {
	return (this._callbacks = this._callbacks || {}), this._callbacks["$" + n] || [];
};
vn.prototype.hasListeners = function (n) {
	return !!this.listeners(n).length;
};
const Lr = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")();
function F1(n, ...r) {
	return r.reduce((o, i) => (n.hasOwnProperty(i) && (o[i] = n[i]), o), {});
}
const RT = Lr.setTimeout,
	TT = Lr.clearTimeout;
function yf(n, r) {
	r.useNativeTimers
		? ((n.setTimeoutFn = RT.bind(Lr)), (n.clearTimeoutFn = TT.bind(Lr)))
		: ((n.setTimeoutFn = Lr.setTimeout.bind(Lr)),
		  (n.clearTimeoutFn = Lr.clearTimeout.bind(Lr)));
}
const CT = 1.33;
function OT(n) {
	return typeof n == "string" ? AT(n) : Math.ceil((n.byteLength || n.size) * CT);
}
function AT(n) {
	let r = 0,
		o = 0;
	for (let i = 0, l = n.length; i < l; i++)
		(r = n.charCodeAt(i)),
			r < 128
				? (o += 1)
				: r < 2048
				? (o += 2)
				: r < 55296 || r >= 57344
				? (o += 3)
				: (i++, (o += 4));
	return o;
}
function MT(n) {
	let r = "";
	for (let o in n)
		n.hasOwnProperty(o) &&
			(r.length && (r += "&"),
			(r += encodeURIComponent(o) + "=" + encodeURIComponent(n[o])));
	return r;
}
function kT(n) {
	let r = {},
		o = n.split("&");
	for (let i = 0, l = o.length; i < l; i++) {
		let u = o[i].split("=");
		r[decodeURIComponent(u[0])] = decodeURIComponent(u[1]);
	}
	return r;
}
class _T extends Error {
	constructor(r, o, i) {
		super(r), (this.description = o), (this.context = i), (this.type = "TransportError");
	}
}
class sm extends vn {
	constructor(r) {
		super(),
			(this.writable = !1),
			yf(this, r),
			(this.opts = r),
			(this.query = r.query),
			(this.socket = r.socket);
	}
	onError(r, o, i) {
		return super.emitReserved("error", new _T(r, o, i)), this;
	}
	open() {
		return (this.readyState = "opening"), this.doOpen(), this;
	}
	close() {
		return (
			(this.readyState === "opening" || this.readyState === "open") &&
				(this.doClose(), this.onClose()),
			this
		);
	}
	send(r) {
		this.readyState === "open" && this.write(r);
	}
	onOpen() {
		(this.readyState = "open"), (this.writable = !0), super.emitReserved("open");
	}
	onData(r) {
		const o = im(r, this.socket.binaryType);
		this.onPacket(o);
	}
	onPacket(r) {
		super.emitReserved("packet", r);
	}
	onClose(r) {
		(this.readyState = "closed"), super.emitReserved("close", r);
	}
	pause(r) {}
	createUri(r, o = {}) {
		return r + "://" + this._hostname() + this._port() + this.opts.path + this._query(o);
	}
	_hostname() {
		const r = this.opts.hostname;
		return r.indexOf(":") === -1 ? r : "[" + r + "]";
	}
	_port() {
		return this.opts.port &&
			((this.opts.secure && +(this.opts.port !== 443)) ||
				(!this.opts.secure && Number(this.opts.port) !== 80))
			? ":" + this.opts.port
			: "";
	}
	_query(r) {
		const o = MT(r);
		return o.length ? "?" + o : "";
	}
}
const X1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),
	Tp = 64,
	DT = {};
let Jb = 0,
	Oc = 0,
	Wb;
function $b(n) {
	let r = "";
	do (r = X1[n % Tp] + r), (n = Math.floor(n / Tp));
	while (n > 0);
	return r;
}
function K1() {
	const n = $b(+new Date());
	return n !== Wb ? ((Jb = 0), (Wb = n)) : n + "." + $b(Jb++);
}
for (; Oc < Tp; Oc++) DT[X1[Oc]] = Oc;
let Q1 = !1;
try {
	Q1 = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch (n) {}
const NT = Q1;
function Z1(n) {
	const r = n.xdomain;
	try {
		if (typeof XMLHttpRequest < "u" && (!r || NT)) return new XMLHttpRequest();
	} catch (o) {}
	if (!r)
		try {
			return new Lr[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
		} catch (o) {}
}
function LT() {}
const zT = (function () {
	return new Z1({ xdomain: !1 }).responseType != null;
})();
class jT extends sm {
	constructor(r) {
		if ((super(r), (this.polling = !1), typeof location < "u")) {
			const i = location.protocol === "https:";
			let l = location.port;
			l || (l = i ? "443" : "80"),
				(this.xd =
					(typeof location < "u" && r.hostname !== location.hostname) || l !== r.port);
		}
		const o = r && r.forceBase64;
		(this.supportsBinary = zT && !o), this.opts.withCredentials && (this.cookieJar = void 0);
	}
	get name() {
		return "polling";
	}
	doOpen() {
		this.poll();
	}
	pause(r) {
		this.readyState = "pausing";
		const o = () => {
			(this.readyState = "paused"), r();
		};
		if (this.polling || !this.writable) {
			let i = 0;
			this.polling &&
				(i++,
				this.once("pollComplete", function () {
					--i || o();
				})),
				this.writable ||
					(i++,
					this.once("drain", function () {
						--i || o();
					}));
		} else o();
	}
	poll() {
		(this.polling = !0), this.doPoll(), this.emitReserved("poll");
	}
	onData(r) {
		const o = (i) => {
			if (
				(this.readyState === "opening" && i.type === "open" && this.onOpen(),
				i.type === "close")
			)
				return this.onClose({ description: "transport closed by the server" }), !1;
			this.onPacket(i);
		};
		ST(r, this.socket.binaryType).forEach(o),
			this.readyState !== "closed" &&
				((this.polling = !1),
				this.emitReserved("pollComplete"),
				this.readyState === "open" && this.poll());
	}
	doClose() {
		const r = () => {
			this.write([{ type: "close" }]);
		};
		this.readyState === "open" ? r() : this.once("open", r);
	}
	write(r) {
		(this.writable = !1),
			vT(r, (o) => {
				this.doWrite(o, () => {
					(this.writable = !0), this.emitReserved("drain");
				});
			});
	}
	uri() {
		const r = this.opts.secure ? "https" : "http",
			o = this.query || {};
		return (
			this.opts.timestampRequests !== !1 && (o[this.opts.timestampParam] = K1()),
			!this.supportsBinary && !o.sid && (o.b64 = 1),
			this.createUri(r, o)
		);
	}
	request(r = {}) {
		return (
			Object.assign(r, { xd: this.xd, cookieJar: this.cookieJar }, this.opts),
			new co(this.uri(), r)
		);
	}
	doWrite(r, o) {
		const i = this.request({ method: "POST", data: r });
		i.on("success", o),
			i.on("error", (l, u) => {
				this.onError("xhr post error", l, u);
			});
	}
	doPoll() {
		const r = this.request();
		r.on("data", this.onData.bind(this)),
			r.on("error", (o, i) => {
				this.onError("xhr poll error", o, i);
			}),
			(this.pollXhr = r);
	}
}
class co extends vn {
	constructor(r, o) {
		super(),
			yf(this, o),
			(this.opts = o),
			(this.method = o.method || "GET"),
			(this.uri = r),
			(this.data = o.data !== void 0 ? o.data : null),
			this.create();
	}
	create() {
		var r;
		const o = F1(
			this.opts,
			"agent",
			"pfx",
			"key",
			"passphrase",
			"cert",
			"ca",
			"ciphers",
			"rejectUnauthorized",
			"autoUnref"
		);
		o.xdomain = !!this.opts.xd;
		const i = (this.xhr = new Z1(o));
		try {
			i.open(this.method, this.uri, !0);
			try {
				if (this.opts.extraHeaders) {
					i.setDisableHeaderCheck && i.setDisableHeaderCheck(!0);
					for (let l in this.opts.extraHeaders)
						this.opts.extraHeaders.hasOwnProperty(l) &&
							i.setRequestHeader(l, this.opts.extraHeaders[l]);
				}
			} catch (l) {}
			if (this.method === "POST")
				try {
					i.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
				} catch (l) {}
			try {
				i.setRequestHeader("Accept", "*/*");
			} catch (l) {}
			(r = this.opts.cookieJar) === null || r === void 0 || r.addCookies(i),
				"withCredentials" in i && (i.withCredentials = this.opts.withCredentials),
				this.opts.requestTimeout && (i.timeout = this.opts.requestTimeout),
				(i.onreadystatechange = () => {
					var l;
					i.readyState === 3 &&
						((l = this.opts.cookieJar) === null || l === void 0 || l.parseCookies(i)),
						i.readyState === 4 &&
							(i.status === 200 || i.status === 1223
								? this.onLoad()
								: this.setTimeoutFn(() => {
										this.onError(typeof i.status == "number" ? i.status : 0);
								  }, 0));
				}),
				i.send(this.data);
		} catch (l) {
			this.setTimeoutFn(() => {
				this.onError(l);
			}, 0);
			return;
		}
		typeof document < "u" &&
			((this.index = co.requestsCount++), (co.requests[this.index] = this));
	}
	onError(r) {
		this.emitReserved("error", r, this.xhr), this.cleanup(!0);
	}
	cleanup(r) {
		if (!(typeof this.xhr > "u" || this.xhr === null)) {
			if (((this.xhr.onreadystatechange = LT), r))
				try {
					this.xhr.abort();
				} catch (o) {}
			typeof document < "u" && delete co.requests[this.index], (this.xhr = null);
		}
	}
	onLoad() {
		const r = this.xhr.responseText;
		r !== null && (this.emitReserved("data", r), this.emitReserved("success"), this.cleanup());
	}
	abort() {
		this.cleanup();
	}
}
co.requestsCount = 0;
co.requests = {};
if (typeof document < "u") {
	if (typeof attachEvent == "function") attachEvent("onunload", ev);
	else if (typeof addEventListener == "function") {
		const n = "onpagehide" in Lr ? "pagehide" : "unload";
		addEventListener(n, ev, !1);
	}
}
function ev() {
	for (let n in co.requests) co.requests.hasOwnProperty(n) && co.requests[n].abort();
}
const lm =
		typeof Promise == "function" && typeof Promise.resolve == "function"
			? (n) => Promise.resolve().then(n)
			: (n, r) => r(n, 0),
	Ac = Lr.WebSocket || Lr.MozWebSocket,
	tv = !0,
	BT = "arraybuffer",
	nv =
		typeof navigator < "u" &&
		typeof navigator.product == "string" &&
		navigator.product.toLowerCase() === "reactnative";
class UT extends sm {
	constructor(r) {
		super(r), (this.supportsBinary = !r.forceBase64);
	}
	get name() {
		return "websocket";
	}
	doOpen() {
		if (!this.check()) return;
		const r = this.uri(),
			o = this.opts.protocols,
			i = nv
				? {}
				: F1(
						this.opts,
						"agent",
						"perMessageDeflate",
						"pfx",
						"key",
						"passphrase",
						"cert",
						"ca",
						"ciphers",
						"rejectUnauthorized",
						"localAddress",
						"protocolVersion",
						"origin",
						"maxPayload",
						"family",
						"checkServerIdentity"
				  );
		this.opts.extraHeaders && (i.headers = this.opts.extraHeaders);
		try {
			this.ws = tv && !nv ? (o ? new Ac(r, o) : new Ac(r)) : new Ac(r, o, i);
		} catch (l) {
			return this.emitReserved("error", l);
		}
		(this.ws.binaryType = this.socket.binaryType), this.addEventListeners();
	}
	addEventListeners() {
		(this.ws.onopen = () => {
			this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
		}),
			(this.ws.onclose = (r) =>
				this.onClose({ description: "websocket connection closed", context: r })),
			(this.ws.onmessage = (r) => this.onData(r.data)),
			(this.ws.onerror = (r) => this.onError("websocket error", r));
	}
	write(r) {
		this.writable = !1;
		for (let o = 0; o < r.length; o++) {
			const i = r[o],
				l = o === r.length - 1;
			am(i, this.supportsBinary, (u) => {
				try {
					tv && this.ws.send(u);
				} catch (c) {}
				l &&
					lm(() => {
						(this.writable = !0), this.emitReserved("drain");
					}, this.setTimeoutFn);
			});
		}
	}
	doClose() {
		typeof this.ws < "u" && (this.ws.close(), (this.ws = null));
	}
	uri() {
		const r = this.opts.secure ? "wss" : "ws",
			o = this.query || {};
		return (
			this.opts.timestampRequests && (o[this.opts.timestampParam] = K1()),
			this.supportsBinary || (o.b64 = 1),
			this.createUri(r, o)
		);
	}
	check() {
		return !!Ac;
	}
}
class HT extends sm {
	get name() {
		return "webtransport";
	}
	doOpen() {
		typeof WebTransport == "function" &&
			((this.transport = new WebTransport(
				this.createUri("https"),
				this.opts.transportOptions[this.name]
			)),
			this.transport.closed
				.then(() => {
					this.onClose();
				})
				.catch((r) => {
					this.onError("webtransport error", r);
				}),
			this.transport.ready.then(() => {
				this.transport.createBidirectionalStream().then((r) => {
					const o = wT(Number.MAX_SAFE_INTEGER, this.socket.binaryType),
						i = r.readable.pipeThrough(o).getReader(),
						l = xT();
					l.readable.pipeTo(r.writable), (this.writer = l.writable.getWriter());
					const u = () => {
						i.read()
							.then(({ done: h, value: p }) => {
								h || (this.onPacket(p), u());
							})
							.catch((h) => {});
					};
					u();
					const c = { type: "open" };
					this.query.sid && (c.data = `{"sid":"${this.query.sid}"}`),
						this.writer.write(c).then(() => this.onOpen());
				});
			}));
	}
	write(r) {
		this.writable = !1;
		for (let o = 0; o < r.length; o++) {
			const i = r[o],
				l = o === r.length - 1;
			this.writer.write(i).then(() => {
				l &&
					lm(() => {
						(this.writable = !0), this.emitReserved("drain");
					}, this.setTimeoutFn);
			});
		}
	}
	doClose() {
		var r;
		(r = this.transport) === null || r === void 0 || r.close();
	}
}
const qT = { websocket: UT, webtransport: HT, polling: jT },
	PT =
		/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
	VT = [
		"source",
		"protocol",
		"authority",
		"userInfo",
		"user",
		"password",
		"host",
		"port",
		"relative",
		"path",
		"directory",
		"file",
		"query",
		"anchor",
	];
function Cp(n) {
	if (n.length > 2e3) throw "URI too long";
	const r = n,
		o = n.indexOf("["),
		i = n.indexOf("]");
	o != -1 &&
		i != -1 &&
		(n = n.substring(0, o) + n.substring(o, i).replace(/:/g, ";") + n.substring(i, n.length));
	let l = PT.exec(n || ""),
		u = {},
		c = 14;
	for (; c--; ) u[VT[c]] = l[c] || "";
	return (
		o != -1 &&
			i != -1 &&
			((u.source = r),
			(u.host = u.host.substring(1, u.host.length - 1).replace(/;/g, ":")),
			(u.authority = u.authority.replace("[", "").replace("]", "").replace(/;/g, ":")),
			(u.ipv6uri = !0)),
		(u.pathNames = YT(u, u.path)),
		(u.queryKey = IT(u, u.query)),
		u
	);
}
function YT(n, r) {
	const o = /\/{2,9}/g,
		i = r.replace(o, "/").split("/");
	return (
		(r.slice(0, 1) == "/" || r.length === 0) && i.splice(0, 1),
		r.slice(-1) == "/" && i.splice(i.length - 1, 1),
		i
	);
}
function IT(n, r) {
	const o = {};
	return (
		r.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (i, l, u) {
			l && (o[l] = u);
		}),
		o
	);
}
let J1 = class ms extends vn {
	constructor(r, o = {}) {
		super(),
			(this.binaryType = BT),
			(this.writeBuffer = []),
			r && typeof r == "object" && ((o = r), (r = null)),
			r
				? ((r = Cp(r)),
				  (o.hostname = r.host),
				  (o.secure = r.protocol === "https" || r.protocol === "wss"),
				  (o.port = r.port),
				  r.query && (o.query = r.query))
				: o.host && (o.hostname = Cp(o.host).host),
			yf(this, o),
			(this.secure =
				o.secure != null
					? o.secure
					: typeof location < "u" && location.protocol === "https:"),
			o.hostname && !o.port && (o.port = this.secure ? "443" : "80"),
			(this.hostname =
				o.hostname || (typeof location < "u" ? location.hostname : "localhost")),
			(this.port =
				o.port ||
				(typeof location < "u" && location.port
					? location.port
					: this.secure
					? "443"
					: "80")),
			(this.transports = o.transports || ["polling", "websocket", "webtransport"]),
			(this.writeBuffer = []),
			(this.prevBufferLen = 0),
			(this.opts = Object.assign(
				{
					path: "/engine.io",
					agent: !1,
					withCredentials: !1,
					upgrade: !0,
					timestampParam: "t",
					rememberUpgrade: !1,
					addTrailingSlash: !0,
					rejectUnauthorized: !0,
					perMessageDeflate: { threshold: 1024 },
					transportOptions: {},
					closeOnBeforeunload: !1,
				},
				o
			)),
			(this.opts.path =
				this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "")),
			typeof this.opts.query == "string" && (this.opts.query = kT(this.opts.query)),
			(this.id = null),
			(this.upgrades = null),
			(this.pingInterval = null),
			(this.pingTimeout = null),
			(this.pingTimeoutTimer = null),
			typeof addEventListener == "function" &&
				(this.opts.closeOnBeforeunload &&
					((this.beforeunloadEventListener = () => {
						this.transport &&
							(this.transport.removeAllListeners(), this.transport.close());
					}),
					addEventListener("beforeunload", this.beforeunloadEventListener, !1)),
				this.hostname !== "localhost" &&
					((this.offlineEventListener = () => {
						this.onClose("transport close", {
							description: "network connection lost",
						});
					}),
					addEventListener("offline", this.offlineEventListener, !1))),
			this.open();
	}
	createTransport(r) {
		const o = Object.assign({}, this.opts.query);
		(o.EIO = G1), (o.transport = r), this.id && (o.sid = this.id);
		const i = Object.assign(
			{},
			this.opts,
			{
				query: o,
				socket: this,
				hostname: this.hostname,
				secure: this.secure,
				port: this.port,
			},
			this.opts.transportOptions[r]
		);
		return new qT[r](i);
	}
	open() {
		let r;
		if (
			this.opts.rememberUpgrade &&
			ms.priorWebsocketSuccess &&
			this.transports.indexOf("websocket") !== -1
		)
			r = "websocket";
		else if (this.transports.length === 0) {
			this.setTimeoutFn(() => {
				this.emitReserved("error", "No transports available");
			}, 0);
			return;
		} else r = this.transports[0];
		this.readyState = "opening";
		try {
			r = this.createTransport(r);
		} catch (o) {
			this.transports.shift(), this.open();
			return;
		}
		r.open(), this.setTransport(r);
	}
	setTransport(r) {
		this.transport && this.transport.removeAllListeners(),
			(this.transport = r),
			r
				.on("drain", this.onDrain.bind(this))
				.on("packet", this.onPacket.bind(this))
				.on("error", this.onError.bind(this))
				.on("close", (o) => this.onClose("transport close", o));
	}
	probe(r) {
		let o = this.createTransport(r),
			i = !1;
		ms.priorWebsocketSuccess = !1;
		const l = () => {
			i ||
				(o.send([{ type: "ping", data: "probe" }]),
				o.once("packet", (g) => {
					if (!i)
						if (g.type === "pong" && g.data === "probe") {
							if (((this.upgrading = !0), this.emitReserved("upgrading", o), !o))
								return;
							(ms.priorWebsocketSuccess = o.name === "websocket"),
								this.transport.pause(() => {
									i ||
										(this.readyState !== "closed" &&
											(y(),
											this.setTransport(o),
											o.send([{ type: "upgrade" }]),
											this.emitReserved("upgrade", o),
											(o = null),
											(this.upgrading = !1),
											this.flush()));
								});
						} else {
							const S = new Error("probe error");
							(S.transport = o.name), this.emitReserved("upgradeError", S);
						}
				}));
		};
		function u() {
			i || ((i = !0), y(), o.close(), (o = null));
		}
		const c = (g) => {
			const S = new Error("probe error: " + g);
			(S.transport = o.name), u(), this.emitReserved("upgradeError", S);
		};
		function h() {
			c("transport closed");
		}
		function p() {
			c("socket closed");
		}
		function f(g) {
			o && g.name !== o.name && u();
		}
		const y = () => {
			o.removeListener("open", l),
				o.removeListener("error", c),
				o.removeListener("close", h),
				this.off("close", p),
				this.off("upgrading", f);
		};
		o.once("open", l),
			o.once("error", c),
			o.once("close", h),
			this.once("close", p),
			this.once("upgrading", f),
			this.upgrades.indexOf("webtransport") !== -1 && r !== "webtransport"
				? this.setTimeoutFn(() => {
						i || o.open();
				  }, 200)
				: o.open();
	}
	onOpen() {
		if (
			((this.readyState = "open"),
			(ms.priorWebsocketSuccess = this.transport.name === "websocket"),
			this.emitReserved("open"),
			this.flush(),
			this.readyState === "open" && this.opts.upgrade)
		) {
			let r = 0;
			const o = this.upgrades.length;
			for (; r < o; r++) this.probe(this.upgrades[r]);
		}
	}
	onPacket(r) {
		if (
			this.readyState === "opening" ||
			this.readyState === "open" ||
			this.readyState === "closing"
		)
			switch (
				(this.emitReserved("packet", r),
				this.emitReserved("heartbeat"),
				this.resetPingTimeout(),
				r.type)
			) {
				case "open":
					this.onHandshake(JSON.parse(r.data));
					break;
				case "ping":
					this.sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong");
					break;
				case "error":
					const o = new Error("server error");
					(o.code = r.data), this.onError(o);
					break;
				case "message":
					this.emitReserved("data", r.data), this.emitReserved("message", r.data);
					break;
			}
	}
	onHandshake(r) {
		this.emitReserved("handshake", r),
			(this.id = r.sid),
			(this.transport.query.sid = r.sid),
			(this.upgrades = this.filterUpgrades(r.upgrades)),
			(this.pingInterval = r.pingInterval),
			(this.pingTimeout = r.pingTimeout),
			(this.maxPayload = r.maxPayload),
			this.onOpen(),
			this.readyState !== "closed" && this.resetPingTimeout();
	}
	resetPingTimeout() {
		this.clearTimeoutFn(this.pingTimeoutTimer),
			(this.pingTimeoutTimer = this.setTimeoutFn(() => {
				this.onClose("ping timeout");
			}, this.pingInterval + this.pingTimeout)),
			this.opts.autoUnref && this.pingTimeoutTimer.unref();
	}
	onDrain() {
		this.writeBuffer.splice(0, this.prevBufferLen),
			(this.prevBufferLen = 0),
			this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
	}
	flush() {
		if (
			this.readyState !== "closed" &&
			this.transport.writable &&
			!this.upgrading &&
			this.writeBuffer.length
		) {
			const r = this.getWritablePackets();
			this.transport.send(r), (this.prevBufferLen = r.length), this.emitReserved("flush");
		}
	}
	getWritablePackets() {
		if (!(this.maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
			return this.writeBuffer;
		let r = 1;
		for (let o = 0; o < this.writeBuffer.length; o++) {
			const i = this.writeBuffer[o].data;
			if ((i && (r += OT(i)), o > 0 && r > this.maxPayload))
				return this.writeBuffer.slice(0, o);
			r += 2;
		}
		return this.writeBuffer;
	}
	write(r, o, i) {
		return this.sendPacket("message", r, o, i), this;
	}
	send(r, o, i) {
		return this.sendPacket("message", r, o, i), this;
	}
	sendPacket(r, o, i, l) {
		if (
			(typeof o == "function" && ((l = o), (o = void 0)),
			typeof i == "function" && ((l = i), (i = null)),
			this.readyState === "closing" || this.readyState === "closed")
		)
			return;
		(i = i || {}), (i.compress = i.compress !== !1);
		const u = { type: r, data: o, options: i };
		this.emitReserved("packetCreate", u),
			this.writeBuffer.push(u),
			l && this.once("flush", l),
			this.flush();
	}
	close() {
		const r = () => {
				this.onClose("forced close"), this.transport.close();
			},
			o = () => {
				this.off("upgrade", o), this.off("upgradeError", o), r();
			},
			i = () => {
				this.once("upgrade", o), this.once("upgradeError", o);
			};
		return (
			(this.readyState === "opening" || this.readyState === "open") &&
				((this.readyState = "closing"),
				this.writeBuffer.length
					? this.once("drain", () => {
							this.upgrading ? i() : r();
					  })
					: this.upgrading
					? i()
					: r()),
			this
		);
	}
	onError(r) {
		(ms.priorWebsocketSuccess = !1),
			this.emitReserved("error", r),
			this.onClose("transport error", r);
	}
	onClose(r, o) {
		(this.readyState === "opening" ||
			this.readyState === "open" ||
			this.readyState === "closing") &&
			(this.clearTimeoutFn(this.pingTimeoutTimer),
			this.transport.removeAllListeners("close"),
			this.transport.close(),
			this.transport.removeAllListeners(),
			typeof removeEventListener == "function" &&
				(removeEventListener("beforeunload", this.beforeunloadEventListener, !1),
				removeEventListener("offline", this.offlineEventListener, !1)),
			(this.readyState = "closed"),
			(this.id = null),
			this.emitReserved("close", r, o),
			(this.writeBuffer = []),
			(this.prevBufferLen = 0));
	}
	filterUpgrades(r) {
		const o = [];
		let i = 0;
		const l = r.length;
		for (; i < l; i++) ~this.transports.indexOf(r[i]) && o.push(r[i]);
		return o;
	}
};
J1.protocol = G1;
function GT(n, r = "", o) {
	let i = n;
	(o = o || (typeof location < "u" && location)),
		n == null && (n = o.protocol + "//" + o.host),
		typeof n == "string" &&
			(n.charAt(0) === "/" &&
				(n.charAt(1) === "/" ? (n = o.protocol + n) : (n = o.host + n)),
			/^(https?|wss?):\/\//.test(n) ||
				(typeof o < "u" ? (n = o.protocol + "//" + n) : (n = "https://" + n)),
			(i = Cp(n))),
		i.port ||
			(/^(http|ws)$/.test(i.protocol)
				? (i.port = "80")
				: /^(http|ws)s$/.test(i.protocol) && (i.port = "443")),
		(i.path = i.path || "/");
	const l = i.host.indexOf(":") !== -1 ? "[" + i.host + "]" : i.host;
	return (
		(i.id = i.protocol + "://" + l + ":" + i.port + r),
		(i.href = i.protocol + "://" + l + (o && o.port === i.port ? "" : ":" + i.port)),
		i
	);
}
const FT = typeof ArrayBuffer == "function",
	XT = (n) =>
		typeof ArrayBuffer.isView == "function"
			? ArrayBuffer.isView(n)
			: n.buffer instanceof ArrayBuffer,
	W1 = Object.prototype.toString,
	KT =
		typeof Blob == "function" ||
		(typeof Blob < "u" && W1.call(Blob) === "[object BlobConstructor]"),
	QT =
		typeof File == "function" ||
		(typeof File < "u" && W1.call(File) === "[object FileConstructor]");
function um(n) {
	return (
		(FT && (n instanceof ArrayBuffer || XT(n))) ||
		(KT && n instanceof Blob) ||
		(QT && n instanceof File)
	);
}
function Fc(n, r) {
	if (!n || typeof n != "object") return !1;
	if (Array.isArray(n)) {
		for (let o = 0, i = n.length; o < i; o++) if (Fc(n[o])) return !0;
		return !1;
	}
	if (um(n)) return !0;
	if (n.toJSON && typeof n.toJSON == "function" && arguments.length === 1)
		return Fc(n.toJSON(), !0);
	for (const o in n) if (Object.prototype.hasOwnProperty.call(n, o) && Fc(n[o])) return !0;
	return !1;
}
function ZT(n) {
	const r = [],
		o = n.data,
		i = n;
	return (i.data = Op(o, r)), (i.attachments = r.length), { packet: i, buffers: r };
}
function Op(n, r) {
	if (!n) return n;
	if (um(n)) {
		const o = { _placeholder: !0, num: r.length };
		return r.push(n), o;
	} else if (Array.isArray(n)) {
		const o = new Array(n.length);
		for (let i = 0; i < n.length; i++) o[i] = Op(n[i], r);
		return o;
	} else if (typeof n == "object" && !(n instanceof Date)) {
		const o = {};
		for (const i in n) Object.prototype.hasOwnProperty.call(n, i) && (o[i] = Op(n[i], r));
		return o;
	}
	return n;
}
function JT(n, r) {
	return (n.data = Ap(n.data, r)), delete n.attachments, n;
}
function Ap(n, r) {
	if (!n) return n;
	if (n && n._placeholder === !0) {
		if (typeof n.num == "number" && n.num >= 0 && n.num < r.length) return r[n.num];
		throw new Error("illegal attachments");
	} else if (Array.isArray(n)) for (let o = 0; o < n.length; o++) n[o] = Ap(n[o], r);
	else if (typeof n == "object")
		for (const o in n) Object.prototype.hasOwnProperty.call(n, o) && (n[o] = Ap(n[o], r));
	return n;
}
const WT = [
		"connect",
		"connect_error",
		"disconnect",
		"disconnecting",
		"newListener",
		"removeListener",
	],
	$T = 5;
var St;
(function (n) {
	(n[(n.CONNECT = 0)] = "CONNECT"),
		(n[(n.DISCONNECT = 1)] = "DISCONNECT"),
		(n[(n.EVENT = 2)] = "EVENT"),
		(n[(n.ACK = 3)] = "ACK"),
		(n[(n.CONNECT_ERROR = 4)] = "CONNECT_ERROR"),
		(n[(n.BINARY_EVENT = 5)] = "BINARY_EVENT"),
		(n[(n.BINARY_ACK = 6)] = "BINARY_ACK");
})(St || (St = {}));
class eC {
	constructor(r) {
		this.replacer = r;
	}
	encode(r) {
		return (r.type === St.EVENT || r.type === St.ACK) && Fc(r)
			? this.encodeAsBinary({
					type: r.type === St.EVENT ? St.BINARY_EVENT : St.BINARY_ACK,
					nsp: r.nsp,
					data: r.data,
					id: r.id,
			  })
			: [this.encodeAsString(r)];
	}
	encodeAsString(r) {
		let o = "" + r.type;
		return (
			(r.type === St.BINARY_EVENT || r.type === St.BINARY_ACK) && (o += r.attachments + "-"),
			r.nsp && r.nsp !== "/" && (o += r.nsp + ","),
			r.id != null && (o += r.id),
			r.data != null && (o += JSON.stringify(r.data, this.replacer)),
			o
		);
	}
	encodeAsBinary(r) {
		const o = ZT(r),
			i = this.encodeAsString(o.packet),
			l = o.buffers;
		return l.unshift(i), l;
	}
}
function rv(n) {
	return Object.prototype.toString.call(n) === "[object Object]";
}
class cm extends vn {
	constructor(r) {
		super(), (this.reviver = r);
	}
	add(r) {
		let o;
		if (typeof r == "string") {
			if (this.reconstructor)
				throw new Error("got plaintext data when reconstructing a packet");
			o = this.decodeString(r);
			const i = o.type === St.BINARY_EVENT;
			i || o.type === St.BINARY_ACK
				? ((o.type = i ? St.EVENT : St.ACK),
				  (this.reconstructor = new tC(o)),
				  o.attachments === 0 && super.emitReserved("decoded", o))
				: super.emitReserved("decoded", o);
		} else if (um(r) || r.base64)
			if (this.reconstructor)
				(o = this.reconstructor.takeBinaryData(r)),
					o && ((this.reconstructor = null), super.emitReserved("decoded", o));
			else throw new Error("got binary data when not reconstructing a packet");
		else throw new Error("Unknown type: " + r);
	}
	decodeString(r) {
		let o = 0;
		const i = { type: Number(r.charAt(0)) };
		if (St[i.type] === void 0) throw new Error("unknown packet type " + i.type);
		if (i.type === St.BINARY_EVENT || i.type === St.BINARY_ACK) {
			const u = o + 1;
			for (; r.charAt(++o) !== "-" && o != r.length; );
			const c = r.substring(u, o);
			if (c != Number(c) || r.charAt(o) !== "-") throw new Error("Illegal attachments");
			i.attachments = Number(c);
		}
		if (r.charAt(o + 1) === "/") {
			const u = o + 1;
			for (; ++o && !(r.charAt(o) === "," || o === r.length); );
			i.nsp = r.substring(u, o);
		} else i.nsp = "/";
		const l = r.charAt(o + 1);
		if (l !== "" && Number(l) == l) {
			const u = o + 1;
			for (; ++o; ) {
				const c = r.charAt(o);
				if (c == null || Number(c) != c) {
					--o;
					break;
				}
				if (o === r.length) break;
			}
			i.id = Number(r.substring(u, o + 1));
		}
		if (r.charAt(++o)) {
			const u = this.tryParse(r.substr(o));
			if (cm.isPayloadValid(i.type, u)) i.data = u;
			else throw new Error("invalid payload");
		}
		return i;
	}
	tryParse(r) {
		try {
			return JSON.parse(r, this.reviver);
		} catch (o) {
			return !1;
		}
	}
	static isPayloadValid(r, o) {
		switch (r) {
			case St.CONNECT:
				return rv(o);
			case St.DISCONNECT:
				return o === void 0;
			case St.CONNECT_ERROR:
				return typeof o == "string" || rv(o);
			case St.EVENT:
			case St.BINARY_EVENT:
				return (
					Array.isArray(o) &&
					(typeof o[0] == "number" ||
						(typeof o[0] == "string" && WT.indexOf(o[0]) === -1))
				);
			case St.ACK:
			case St.BINARY_ACK:
				return Array.isArray(o);
		}
	}
	destroy() {
		this.reconstructor &&
			(this.reconstructor.finishedReconstruction(), (this.reconstructor = null));
	}
}
class tC {
	constructor(r) {
		(this.packet = r), (this.buffers = []), (this.reconPack = r);
	}
	takeBinaryData(r) {
		if ((this.buffers.push(r), this.buffers.length === this.reconPack.attachments)) {
			const o = JT(this.reconPack, this.buffers);
			return this.finishedReconstruction(), o;
		}
		return null;
	}
	finishedReconstruction() {
		(this.reconPack = null), (this.buffers = []);
	}
}
const nC = Object.freeze(
	Object.defineProperty(
		{
			__proto__: null,
			Decoder: cm,
			Encoder: eC,
			get PacketType() {
				return St;
			},
			protocol: $T,
		},
		Symbol.toStringTag,
		{ value: "Module" }
	)
);
function Kr(n, r, o) {
	return (
		n.on(r, o),
		function () {
			n.off(r, o);
		}
	);
}
const rC = Object.freeze({
	connect: 1,
	connect_error: 1,
	disconnect: 1,
	disconnecting: 1,
	newListener: 1,
	removeListener: 1,
});
class $1 extends vn {
	constructor(r, o, i) {
		super(),
			(this.connected = !1),
			(this.recovered = !1),
			(this.receiveBuffer = []),
			(this.sendBuffer = []),
			(this._queue = []),
			(this._queueSeq = 0),
			(this.ids = 0),
			(this.acks = {}),
			(this.flags = {}),
			(this.io = r),
			(this.nsp = o),
			i && i.auth && (this.auth = i.auth),
			(this._opts = Object.assign({}, i)),
			this.io._autoConnect && this.open();
	}
	get disconnected() {
		return !this.connected;
	}
	subEvents() {
		if (this.subs) return;
		const r = this.io;
		this.subs = [
			Kr(r, "open", this.onopen.bind(this)),
			Kr(r, "packet", this.onpacket.bind(this)),
			Kr(r, "error", this.onerror.bind(this)),
			Kr(r, "close", this.onclose.bind(this)),
		];
	}
	get active() {
		return !!this.subs;
	}
	connect() {
		return this.connected
			? this
			: (this.subEvents(),
			  this.io._reconnecting || this.io.open(),
			  this.io._readyState === "open" && this.onopen(),
			  this);
	}
	open() {
		return this.connect();
	}
	send(...r) {
		return r.unshift("message"), this.emit.apply(this, r), this;
	}
	emit(r, ...o) {
		if (rC.hasOwnProperty(r))
			throw new Error('"' + r.toString() + '" is a reserved event name');
		if ((o.unshift(r), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile))
			return this._addToQueue(o), this;
		const i = { type: St.EVENT, data: o };
		if (
			((i.options = {}),
			(i.options.compress = this.flags.compress !== !1),
			typeof o[o.length - 1] == "function")
		) {
			const u = this.ids++,
				c = o.pop();
			this._registerAckCallback(u, c), (i.id = u);
		}
		const l = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable;
		return (
			(this.flags.volatile && (!l || !this.connected)) ||
				(this.connected
					? (this.notifyOutgoingListeners(i), this.packet(i))
					: this.sendBuffer.push(i)),
			(this.flags = {}),
			this
		);
	}
	_registerAckCallback(r, o) {
		var i;
		const l = (i = this.flags.timeout) !== null && i !== void 0 ? i : this._opts.ackTimeout;
		if (l === void 0) {
			this.acks[r] = o;
			return;
		}
		const u = this.io.setTimeoutFn(() => {
			delete this.acks[r];
			for (let c = 0; c < this.sendBuffer.length; c++)
				this.sendBuffer[c].id === r && this.sendBuffer.splice(c, 1);
			o.call(this, new Error("operation has timed out"));
		}, l);
		this.acks[r] = (...c) => {
			this.io.clearTimeoutFn(u), o.apply(this, [null, ...c]);
		};
	}
	emitWithAck(r, ...o) {
		const i = this.flags.timeout !== void 0 || this._opts.ackTimeout !== void 0;
		return new Promise((l, u) => {
			o.push((c, h) => (i ? (c ? u(c) : l(h)) : l(c))), this.emit(r, ...o);
		});
	}
	_addToQueue(r) {
		let o;
		typeof r[r.length - 1] == "function" && (o = r.pop());
		const i = {
			id: this._queueSeq++,
			tryCount: 0,
			pending: !1,
			args: r,
			flags: Object.assign({ fromQueue: !0 }, this.flags),
		};
		r.push((l, ...u) =>
			i !== this._queue[0]
				? void 0
				: (l !== null
						? i.tryCount > this._opts.retries && (this._queue.shift(), o && o(l))
						: (this._queue.shift(), o && o(null, ...u)),
				  (i.pending = !1),
				  this._drainQueue())
		),
			this._queue.push(i),
			this._drainQueue();
	}
	_drainQueue(r = !1) {
		if (!this.connected || this._queue.length === 0) return;
		const o = this._queue[0];
		(o.pending && !r) ||
			((o.pending = !0),
			o.tryCount++,
			(this.flags = o.flags),
			this.emit.apply(this, o.args));
	}
	packet(r) {
		(r.nsp = this.nsp), this.io._packet(r);
	}
	onopen() {
		typeof this.auth == "function"
			? this.auth((r) => {
					this._sendConnectPacket(r);
			  })
			: this._sendConnectPacket(this.auth);
	}
	_sendConnectPacket(r) {
		this.packet({
			type: St.CONNECT,
			data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, r) : r,
		});
	}
	onerror(r) {
		this.connected || this.emitReserved("connect_error", r);
	}
	onclose(r, o) {
		(this.connected = !1), delete this.id, this.emitReserved("disconnect", r, o);
	}
	onpacket(r) {
		if (r.nsp === this.nsp)
			switch (r.type) {
				case St.CONNECT:
					r.data && r.data.sid
						? this.onconnect(r.data.sid, r.data.pid)
						: this.emitReserved(
								"connect_error",
								new Error(
									"It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"
								)
						  );
					break;
				case St.EVENT:
				case St.BINARY_EVENT:
					this.onevent(r);
					break;
				case St.ACK:
				case St.BINARY_ACK:
					this.onack(r);
					break;
				case St.DISCONNECT:
					this.ondisconnect();
					break;
				case St.CONNECT_ERROR:
					this.destroy();
					const o = new Error(r.data.message);
					(o.data = r.data.data), this.emitReserved("connect_error", o);
					break;
			}
	}
	onevent(r) {
		const o = r.data || [];
		r.id != null && o.push(this.ack(r.id)),
			this.connected ? this.emitEvent(o) : this.receiveBuffer.push(Object.freeze(o));
	}
	emitEvent(r) {
		if (this._anyListeners && this._anyListeners.length) {
			const o = this._anyListeners.slice();
			for (const i of o) i.apply(this, r);
		}
		super.emit.apply(this, r),
			this._pid &&
				r.length &&
				typeof r[r.length - 1] == "string" &&
				(this._lastOffset = r[r.length - 1]);
	}
	ack(r) {
		const o = this;
		let i = !1;
		return function (...l) {
			i || ((i = !0), o.packet({ type: St.ACK, id: r, data: l }));
		};
	}
	onack(r) {
		const o = this.acks[r.id];
		typeof o == "function" && (o.apply(this, r.data), delete this.acks[r.id]);
	}
	onconnect(r, o) {
		(this.id = r),
			(this.recovered = o && this._pid === o),
			(this._pid = o),
			(this.connected = !0),
			this.emitBuffered(),
			this.emitReserved("connect"),
			this._drainQueue(!0);
	}
	emitBuffered() {
		this.receiveBuffer.forEach((r) => this.emitEvent(r)),
			(this.receiveBuffer = []),
			this.sendBuffer.forEach((r) => {
				this.notifyOutgoingListeners(r), this.packet(r);
			}),
			(this.sendBuffer = []);
	}
	ondisconnect() {
		this.destroy(), this.onclose("io server disconnect");
	}
	destroy() {
		this.subs && (this.subs.forEach((r) => r()), (this.subs = void 0)), this.io._destroy(this);
	}
	disconnect() {
		return (
			this.connected && this.packet({ type: St.DISCONNECT }),
			this.destroy(),
			this.connected && this.onclose("io client disconnect"),
			this
		);
	}
	close() {
		return this.disconnect();
	}
	compress(r) {
		return (this.flags.compress = r), this;
	}
	get volatile() {
		return (this.flags.volatile = !0), this;
	}
	timeout(r) {
		return (this.flags.timeout = r), this;
	}
	onAny(r) {
		return (this._anyListeners = this._anyListeners || []), this._anyListeners.push(r), this;
	}
	prependAny(r) {
		return (
			(this._anyListeners = this._anyListeners || []), this._anyListeners.unshift(r), this
		);
	}
	offAny(r) {
		if (!this._anyListeners) return this;
		if (r) {
			const o = this._anyListeners;
			for (let i = 0; i < o.length; i++) if (r === o[i]) return o.splice(i, 1), this;
		} else this._anyListeners = [];
		return this;
	}
	listenersAny() {
		return this._anyListeners || [];
	}
	onAnyOutgoing(r) {
		return (
			(this._anyOutgoingListeners = this._anyOutgoingListeners || []),
			this._anyOutgoingListeners.push(r),
			this
		);
	}
	prependAnyOutgoing(r) {
		return (
			(this._anyOutgoingListeners = this._anyOutgoingListeners || []),
			this._anyOutgoingListeners.unshift(r),
			this
		);
	}
	offAnyOutgoing(r) {
		if (!this._anyOutgoingListeners) return this;
		if (r) {
			const o = this._anyOutgoingListeners;
			for (let i = 0; i < o.length; i++) if (r === o[i]) return o.splice(i, 1), this;
		} else this._anyOutgoingListeners = [];
		return this;
	}
	listenersAnyOutgoing() {
		return this._anyOutgoingListeners || [];
	}
	notifyOutgoingListeners(r) {
		if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
			const o = this._anyOutgoingListeners.slice();
			for (const i of o) i.apply(this, r.data);
		}
	}
}
function Ds(n) {
	(n = n || {}),
		(this.ms = n.min || 100),
		(this.max = n.max || 1e4),
		(this.factor = n.factor || 2),
		(this.jitter = n.jitter > 0 && n.jitter <= 1 ? n.jitter : 0),
		(this.attempts = 0);
}
Ds.prototype.duration = function () {
	var n = this.ms * Math.pow(this.factor, this.attempts++);
	if (this.jitter) {
		var r = Math.random(),
			o = Math.floor(r * this.jitter * n);
		n = (Math.floor(r * 10) & 1) == 0 ? n - o : n + o;
	}
	return Math.min(n, this.max) | 0;
};
Ds.prototype.reset = function () {
	this.attempts = 0;
};
Ds.prototype.setMin = function (n) {
	this.ms = n;
};
Ds.prototype.setMax = function (n) {
	this.max = n;
};
Ds.prototype.setJitter = function (n) {
	this.jitter = n;
};
class Mp extends vn {
	constructor(r, o) {
		var i;
		super(),
			(this.nsps = {}),
			(this.subs = []),
			r && typeof r == "object" && ((o = r), (r = void 0)),
			(o = o || {}),
			(o.path = o.path || "/socket.io"),
			(this.opts = o),
			yf(this, o),
			this.reconnection(o.reconnection !== !1),
			this.reconnectionAttempts(o.reconnectionAttempts || 1 / 0),
			this.reconnectionDelay(o.reconnectionDelay || 1e3),
			this.reconnectionDelayMax(o.reconnectionDelayMax || 5e3),
			this.randomizationFactor(
				(i = o.randomizationFactor) !== null && i !== void 0 ? i : 0.5
			),
			(this.backoff = new Ds({
				min: this.reconnectionDelay(),
				max: this.reconnectionDelayMax(),
				jitter: this.randomizationFactor(),
			})),
			this.timeout(o.timeout == null ? 2e4 : o.timeout),
			(this._readyState = "closed"),
			(this.uri = r);
		const l = o.parser || nC;
		(this.encoder = new l.Encoder()),
			(this.decoder = new l.Decoder()),
			(this._autoConnect = o.autoConnect !== !1),
			this._autoConnect && this.open();
	}
	reconnection(r) {
		return arguments.length ? ((this._reconnection = !!r), this) : this._reconnection;
	}
	reconnectionAttempts(r) {
		return r === void 0
			? this._reconnectionAttempts
			: ((this._reconnectionAttempts = r), this);
	}
	reconnectionDelay(r) {
		var o;
		return r === void 0
			? this._reconnectionDelay
			: ((this._reconnectionDelay = r),
			  (o = this.backoff) === null || o === void 0 || o.setMin(r),
			  this);
	}
	randomizationFactor(r) {
		var o;
		return r === void 0
			? this._randomizationFactor
			: ((this._randomizationFactor = r),
			  (o = this.backoff) === null || o === void 0 || o.setJitter(r),
			  this);
	}
	reconnectionDelayMax(r) {
		var o;
		return r === void 0
			? this._reconnectionDelayMax
			: ((this._reconnectionDelayMax = r),
			  (o = this.backoff) === null || o === void 0 || o.setMax(r),
			  this);
	}
	timeout(r) {
		return arguments.length ? ((this._timeout = r), this) : this._timeout;
	}
	maybeReconnectOnOpen() {
		!this._reconnecting &&
			this._reconnection &&
			this.backoff.attempts === 0 &&
			this.reconnect();
	}
	open(r) {
		if (~this._readyState.indexOf("open")) return this;
		this.engine = new J1(this.uri, this.opts);
		const o = this.engine,
			i = this;
		(this._readyState = "opening"), (this.skipReconnect = !1);
		const l = Kr(o, "open", function () {
				i.onopen(), r && r();
			}),
			u = (h) => {
				this.cleanup(),
					(this._readyState = "closed"),
					this.emitReserved("error", h),
					r ? r(h) : this.maybeReconnectOnOpen();
			},
			c = Kr(o, "error", u);
		if (this._timeout !== !1) {
			const h = this._timeout,
				p = this.setTimeoutFn(() => {
					l(), u(new Error("timeout")), o.close();
				}, h);
			this.opts.autoUnref && p.unref(),
				this.subs.push(() => {
					this.clearTimeoutFn(p);
				});
		}
		return this.subs.push(l), this.subs.push(c), this;
	}
	connect(r) {
		return this.open(r);
	}
	onopen() {
		this.cleanup(), (this._readyState = "open"), this.emitReserved("open");
		const r = this.engine;
		this.subs.push(
			Kr(r, "ping", this.onping.bind(this)),
			Kr(r, "data", this.ondata.bind(this)),
			Kr(r, "error", this.onerror.bind(this)),
			Kr(r, "close", this.onclose.bind(this)),
			Kr(this.decoder, "decoded", this.ondecoded.bind(this))
		);
	}
	onping() {
		this.emitReserved("ping");
	}
	ondata(r) {
		try {
			this.decoder.add(r);
		} catch (o) {
			this.onclose("parse error", o);
		}
	}
	ondecoded(r) {
		lm(() => {
			this.emitReserved("packet", r);
		}, this.setTimeoutFn);
	}
	onerror(r) {
		this.emitReserved("error", r);
	}
	socket(r, o) {
		let i = this.nsps[r];
		return (
			i
				? this._autoConnect && !i.active && i.connect()
				: ((i = new $1(this, r, o)), (this.nsps[r] = i)),
			i
		);
	}
	_destroy(r) {
		const o = Object.keys(this.nsps);
		for (const i of o) if (this.nsps[i].active) return;
		this._close();
	}
	_packet(r) {
		const o = this.encoder.encode(r);
		for (let i = 0; i < o.length; i++) this.engine.write(o[i], r.options);
	}
	cleanup() {
		this.subs.forEach((r) => r()), (this.subs.length = 0), this.decoder.destroy();
	}
	_close() {
		(this.skipReconnect = !0),
			(this._reconnecting = !1),
			this.onclose("forced close"),
			this.engine && this.engine.close();
	}
	disconnect() {
		return this._close();
	}
	onclose(r, o) {
		this.cleanup(),
			this.backoff.reset(),
			(this._readyState = "closed"),
			this.emitReserved("close", r, o),
			this._reconnection && !this.skipReconnect && this.reconnect();
	}
	reconnect() {
		if (this._reconnecting || this.skipReconnect) return this;
		const r = this;
		if (this.backoff.attempts >= this._reconnectionAttempts)
			this.backoff.reset(), this.emitReserved("reconnect_failed"), (this._reconnecting = !1);
		else {
			const o = this.backoff.duration();
			this._reconnecting = !0;
			const i = this.setTimeoutFn(() => {
				r.skipReconnect ||
					(this.emitReserved("reconnect_attempt", r.backoff.attempts),
					!r.skipReconnect &&
						r.open((l) => {
							l
								? ((r._reconnecting = !1),
								  r.reconnect(),
								  this.emitReserved("reconnect_error", l))
								: r.onreconnect();
						}));
			}, o);
			this.opts.autoUnref && i.unref(),
				this.subs.push(() => {
					this.clearTimeoutFn(i);
				});
		}
	}
	onreconnect() {
		const r = this.backoff.attempts;
		(this._reconnecting = !1), this.backoff.reset(), this.emitReserved("reconnect", r);
	}
}
const jl = {};
function Xc(n, r) {
	typeof n == "object" && ((r = n), (n = void 0)), (r = r || {});
	const o = GT(n, r.path || "/socket.io"),
		i = o.source,
		l = o.id,
		u = o.path,
		c = jl[l] && u in jl[l].nsps,
		h = r.forceNew || r["force new connection"] || r.multiplex === !1 || c;
	let p;
	return (
		h ? (p = new Mp(i, r)) : (jl[l] || (jl[l] = new Mp(i, r)), (p = jl[l])),
		o.query && !r.query && (r.query = o.queryKey),
		p.socket(o.path, r)
	);
}
Object.assign(Xc, { Manager: Mp, Socket: $1, io: Xc, connect: Xc });
class oC {
	constructor(r, o, i, l) {
		ci(this, "socket_port"),
			ci(this, "host"),
			ci(this, "port"),
			ci(this, "protocol"),
			ci(this, "url"),
			ci(this, "site_name"),
			ci(this, "socket");
		var u, c, h, p;
		if (
			((this.socket_port = i != null ? i : "9000"),
			(this.host = (u = window.location) == null ? void 0 : u.hostname),
			(this.port = (c = window.location) != null && c.port ? `:${this.socket_port}` : ""),
			(this.protocol =
				((h = window.location) == null ? void 0 : h.protocol) === "https:"
					? "https"
					: "http"),
			r)
		) {
			let f = new URL(r);
			(f.port = ""),
				i ? ((f.port = i), (this.url = f.toString())) : (this.url = f.toString());
		} else this.url = `${this.protocol}://${this.host}${this.port}/`;
		o && (this.url = `${this.url}${o}`),
			(this.site_name = o),
			(this.socket = Xc(`${this.url}`, {
				withCredentials: !0,
				secure: this.protocol === "https",
				extraHeaders:
					l && l.useToken === !0
						? {
								Authorization: `${l.type} ${
									(p = l.token) == null ? void 0 : p.call(l)
								}`,
						  }
						: {},
			}));
	}
}
const Ns = v.createContext(null),
	aC = ({
		url: n = "",
		tokenParams: r,
		socketPort: o,
		swrConfig: i,
		siteName: l,
		enableSocket: u = !0,
		children: c,
		customHeaders: h,
	}) => {
		const p = v.useMemo(() => {
			const f = new UR.FrappeApp(n, r, void 0, h);
			return {
				url: n,
				tokenParams: r,
				app: f,
				auth: f.auth(),
				db: f.db(),
				call: f.call(),
				file: f.file(),
				socket: u ? new oC(n, l, o, r).socket : void 0,
				enableSocket: u,
				socketPort: o,
			};
		}, [n, r, o, u, h]);
		return K.jsx(Ns.Provider, { value: p, children: K.jsx(pT, { value: i, children: c }) });
	},
	fm = (n) => {
		const { url: r, auth: o, tokenParams: i } = v.useContext(Ns),
			[l, u] = v.useState(),
			c = v.useCallback(() => {
				const w = document.cookie.split(";").find((R) => R.trim().startsWith("user_id="));
				if (w) {
					const R = w.split("=")[1];
					u(R && R !== "Guest" ? R : null);
				} else u(null);
			}, []);
		v.useEffect(() => {
			i && i.useToken ? u(null) : c();
		}, []);
		const {
				data: h,
				error: p,
				isLoading: f,
				isValidating: y,
				mutate: g,
			} = om(
				() =>
					(i && i.useToken) || l ? `${r}/api/method/frappe.auth.get_logged_user` : null,
				() => o.getLoggedInUser(),
				P(
					{
						onError: () => {
							u(null);
						},
						shouldRetryOnError: !1,
						revalidateOnFocus: !1,
					},
					n
				)
			),
			S = v.useCallback(
				(w) =>
					Et(null, null, function* () {
						return o.loginWithUsernamePassword(w).then((R) => (c(), R));
					}),
				[]
			),
			b = v.useCallback(
				() =>
					Et(null, null, function* () {
						return o
							.logout()
							.then(() => g(null))
							.then(() => u(null));
					}),
				[]
			);
		return {
			isLoading: l === void 0 || f,
			currentUser: h,
			isValidating: y,
			error: p,
			login: S,
			logout: b,
			updateCurrentUser: g,
			getUserCookie: c,
		};
	},
	eS = (n, r, o) => {
		let i = `${r}/api/resource/`;
		return o ? (i += `${n}/${o}`) : (i += `${n}`), i;
	},
	iC = (n, r, o, i) => {
		const { url: l, db: u } = v.useContext(Ns);
		return om(o === void 0 ? eS(n, l, r) : o, () => u.getDoc(n, r), i);
	},
	sC = (n) => {
		var l;
		var r, o;
		let i = "";
		if (
			(n != null &&
				n.fields &&
				(i += "fields=" + JSON.stringify(n == null ? void 0 : n.fields) + "&"),
			n != null &&
				n.filters &&
				(i += "filters=" + JSON.stringify(n == null ? void 0 : n.filters) + "&"),
			n != null &&
				n.orFilters &&
				(i += "or_filters=" + JSON.stringify(n == null ? void 0 : n.orFilters) + "&"),
			n != null &&
				n.limit_start &&
				(i += "limit_start=" + JSON.stringify(n == null ? void 0 : n.limit_start) + "&"),
			n != null &&
				n.limit &&
				(i += "limit=" + JSON.stringify(n == null ? void 0 : n.limit) + "&"),
			n != null && n.groupBy && (i += "group_by=" + String(n.groupBy) + "&"),
			n != null && n.orderBy)
		) {
			const u = `${String((r = n.orderBy) == null ? void 0 : r.field)} ${
				(l = (o = n.orderBy) == null ? void 0 : o.order) != null ? l : "asc"
			}`;
			i += "order_by=" + u + "&";
		}
		return n != null && n.asDict && (i += "as_dict=" + n.asDict), i;
	},
	tk = (n, r, o, i) => {
		const { url: l, db: u } = v.useContext(Ns);
		return om(o === void 0 ? `${eS(n, l)}?${sC(r)}` : o, () => u.getDocList(n, r), i);
	},
	nk = () => {
		const { db: n } = v.useContext(Ns),
			[r, o] = v.useState(!1),
			[i, l] = v.useState(null),
			[u, c] = v.useState(!1),
			h = v.useCallback(() => {
				o(!1), l(null), c(!1);
			}, []);
		return {
			createDoc: v.useCallback(
				(p, f) =>
					Et(null, null, function* () {
						return (
							l(null),
							c(!1),
							o(!0),
							n
								.createDoc(p, f)
								.then((y) => (o(!1), c(!0), y))
								.catch((y) => {
									throw (o(!1), c(!1), l(y), y);
								})
						);
					}),
				[]
			),
			loading: r,
			error: i,
			isCompleted: u,
			reset: h,
		};
	},
	rk = () => {
		const { db: n } = v.useContext(Ns),
			[r, o] = v.useState(!1),
			[i, l] = v.useState(null),
			[u, c] = v.useState(!1),
			h = v.useCallback(() => {
				o(!1), l(null), c(!1);
			}, []);
		return {
			updateDoc: v.useCallback(
				(p, f, y) =>
					Et(null, null, function* () {
						return (
							l(null),
							c(!1),
							o(!0),
							n
								.updateDoc(p, f, y)
								.then((g) => (o(!1), c(!0), g))
								.catch((g) => {
									throw (o(!1), c(!1), l(g), g);
								})
						);
					}),
				[]
			),
			loading: r,
			error: i,
			reset: h,
			isCompleted: u,
		};
	};
var mo = o1();
const lC = n1(mo);
function uC(n) {
	if (typeof document == "undefined") return;
	let r = document.head || document.getElementsByTagName("head")[0],
		o = document.createElement("style");
	(o.type = "text/css"),
		r.appendChild(o),
		o.styleSheet ? (o.styleSheet.cssText = n) : o.appendChild(document.createTextNode(n));
}
const cC = (n) => {
		switch (n) {
			case "success":
				return hC;
			case "info":
				return mC;
			case "warning":
				return pC;
			case "error":
				return gC;
			default:
				return null;
		}
	},
	fC = Array(12).fill(0),
	dC = ({ visible: n, className: r }) =>
		De.createElement(
			"div",
			{
				className: ["sonner-loading-wrapper", r].filter(Boolean).join(" "),
				"data-visible": n,
			},
			De.createElement(
				"div",
				{ className: "sonner-spinner" },
				fC.map((o, i) =>
					De.createElement("div", {
						className: "sonner-loading-bar",
						key: `spinner-bar-${i}`,
					})
				)
			)
		),
	hC = De.createElement(
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 20 20",
			fill: "currentColor",
			height: "20",
			width: "20",
		},
		De.createElement("path", {
			fillRule: "evenodd",
			d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
			clipRule: "evenodd",
		})
	),
	pC = De.createElement(
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			fill: "currentColor",
			height: "20",
			width: "20",
		},
		De.createElement("path", {
			fillRule: "evenodd",
			d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
			clipRule: "evenodd",
		})
	),
	mC = De.createElement(
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 20 20",
			fill: "currentColor",
			height: "20",
			width: "20",
		},
		De.createElement("path", {
			fillRule: "evenodd",
			d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
			clipRule: "evenodd",
		})
	),
	gC = De.createElement(
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 20 20",
			fill: "currentColor",
			height: "20",
			width: "20",
		},
		De.createElement("path", {
			fillRule: "evenodd",
			d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
			clipRule: "evenodd",
		})
	),
	yC = De.createElement(
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			width: "12",
			height: "12",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.5",
			strokeLinecap: "round",
			strokeLinejoin: "round",
		},
		De.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
		De.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
	),
	bC = () => {
		const [n, r] = De.useState(document.hidden);
		return (
			De.useEffect(() => {
				const o = () => {
					r(document.hidden);
				};
				return (
					document.addEventListener("visibilitychange", o),
					() => window.removeEventListener("visibilitychange", o)
				);
			}, []),
			n
		);
	};
let kp = 1;
class vC {
	constructor() {
		(this.subscribe = (r) => (
			this.subscribers.push(r),
			() => {
				const o = this.subscribers.indexOf(r);
				this.subscribers.splice(o, 1);
			}
		)),
			(this.publish = (r) => {
				this.subscribers.forEach((o) => o(r));
			}),
			(this.addToast = (r) => {
				this.publish(r), (this.toasts = [...this.toasts, r]);
			}),
			(this.create = (r) => {
				var o;
				const p = r,
					{ message: i } = p,
					l = Be(p, ["message"]),
					u =
						typeof (r == null ? void 0 : r.id) == "number" ||
						((o = r.id) == null ? void 0 : o.length) > 0
							? r.id
							: kp++,
					c = this.toasts.find((f) => f.id === u),
					h = r.dismissible === void 0 ? !0 : r.dismissible;
				return (
					this.dismissedToasts.has(u) && this.dismissedToasts.delete(u),
					c
						? (this.toasts = this.toasts.map((f) =>
								f.id === u
									? (this.publish(_e(P(P({}, f), r), { id: u, title: i })),
									  _e(P(P({}, f), r), { id: u, dismissible: h, title: i }))
									: f
						  ))
						: this.addToast(_e(P({ title: i }, l), { dismissible: h, id: u })),
					u
				);
			}),
			(this.dismiss = (r) => (
				r
					? (this.dismissedToasts.add(r),
					  requestAnimationFrame(() =>
							this.subscribers.forEach((o) => o({ id: r, dismiss: !0 }))
					  ))
					: this.toasts.forEach((o) => {
							this.subscribers.forEach((i) => i({ id: o.id, dismiss: !0 }));
					  }),
				r
			)),
			(this.message = (r, o) => this.create(_e(P({}, o), { message: r }))),
			(this.error = (r, o) => this.create(_e(P({}, o), { message: r, type: "error" }))),
			(this.success = (r, o) => this.create(_e(P({}, o), { type: "success", message: r }))),
			(this.info = (r, o) => this.create(_e(P({}, o), { type: "info", message: r }))),
			(this.warning = (r, o) => this.create(_e(P({}, o), { type: "warning", message: r }))),
			(this.loading = (r, o) => this.create(_e(P({}, o), { type: "loading", message: r }))),
			(this.promise = (r, o) => {
				if (!o) return;
				let i;
				o.loading !== void 0 &&
					(i = this.create(
						_e(P({}, o), {
							promise: r,
							type: "loading",
							message: o.loading,
							description:
								typeof o.description != "function" ? o.description : void 0,
						})
					));
				const l = Promise.resolve(r instanceof Function ? r() : r);
				let u = i !== void 0,
					c;
				const h = l
						.then((f) =>
							Et(this, null, function* () {
								if (((c = ["resolve", f]), De.isValidElement(f)))
									(u = !1), this.create({ id: i, type: "default", message: f });
								else if (xC(f) && !f.ok) {
									u = !1;
									const g =
											typeof o.error == "function"
												? yield o.error(`HTTP error! status: ${f.status}`)
												: o.error,
										S =
											typeof o.description == "function"
												? yield o.description(
														`HTTP error! status: ${f.status}`
												  )
												: o.description,
										w =
											typeof g == "object" && !De.isValidElement(g)
												? g
												: { message: g };
									this.create(P({ id: i, type: "error", description: S }, w));
								} else if (f instanceof Error) {
									u = !1;
									const g =
											typeof o.error == "function"
												? yield o.error(f)
												: o.error,
										S =
											typeof o.description == "function"
												? yield o.description(f)
												: o.description,
										w =
											typeof g == "object" && !De.isValidElement(g)
												? g
												: { message: g };
									this.create(P({ id: i, type: "error", description: S }, w));
								} else if (o.success !== void 0) {
									u = !1;
									const g =
											typeof o.success == "function"
												? yield o.success(f)
												: o.success,
										S =
											typeof o.description == "function"
												? yield o.description(f)
												: o.description,
										w =
											typeof g == "object" && !De.isValidElement(g)
												? g
												: { message: g };
									this.create(P({ id: i, type: "success", description: S }, w));
								}
							})
						)
						.catch((f) =>
							Et(this, null, function* () {
								if (((c = ["reject", f]), o.error !== void 0)) {
									u = !1;
									const y =
											typeof o.error == "function"
												? yield o.error(f)
												: o.error,
										g =
											typeof o.description == "function"
												? yield o.description(f)
												: o.description,
										b =
											typeof y == "object" && !De.isValidElement(y)
												? y
												: { message: y };
									this.create(P({ id: i, type: "error", description: g }, b));
								}
							})
						)
						.finally(() => {
							u && (this.dismiss(i), (i = void 0)),
								o.finally == null || o.finally.call(o);
						}),
					p = () =>
						new Promise((f, y) =>
							h.then(() => (c[0] === "reject" ? y(c[1]) : f(c[1]))).catch(y)
						);
				return typeof i != "string" && typeof i != "number"
					? { unwrap: p }
					: Object.assign(i, { unwrap: p });
			}),
			(this.custom = (r, o) => {
				const i = (o == null ? void 0 : o.id) || kp++;
				return this.create(P({ jsx: r(i), id: i }, o)), i;
			}),
			(this.getActiveToasts = () =>
				this.toasts.filter((r) => !this.dismissedToasts.has(r.id))),
			(this.subscribers = []),
			(this.toasts = []),
			(this.dismissedToasts = new Set());
	}
}
const nr = new vC(),
	SC = (n, r) => {
		const o = (r == null ? void 0 : r.id) || kp++;
		return nr.addToast(_e(P({ title: n }, r), { id: o })), o;
	},
	xC = (n) =>
		n &&
		typeof n == "object" &&
		"ok" in n &&
		typeof n.ok == "boolean" &&
		"status" in n &&
		typeof n.status == "number",
	wC = SC,
	EC = () => nr.toasts,
	RC = () => nr.getActiveToasts(),
	ok = Object.assign(
		wC,
		{
			success: nr.success,
			info: nr.info,
			warning: nr.warning,
			error: nr.error,
			custom: nr.custom,
			message: nr.message,
			promise: nr.promise,
			dismiss: nr.dismiss,
			loading: nr.loading,
		},
		{ getHistory: EC, getToasts: RC }
	);
uC(
	"[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}"
);
function Mc(n) {
	return n.label !== void 0;
}
const TC = 3,
	CC = "24px",
	OC = "16px",
	ov = 4e3,
	AC = 356,
	MC = 14,
	kC = 45,
	_C = 200;
function lo(...n) {
	return n.filter(Boolean).join(" ");
}
function DC(n) {
	const [r, o] = n.split("-"),
		i = [];
	return r && i.push(r), o && i.push(o), i;
}
const NC = (n) => {
	var r, o, i, l, u, c, h, p, f;
	const {
			invert: y,
			toast: g,
			unstyled: S,
			interacting: b,
			setHeights: w,
			visibleToasts: R,
			heights: O,
			index: T,
			toasts: L,
			expanded: M,
			removeToast: _,
			defaultRichColors: N,
			closeButton: D,
			style: H,
			cancelButtonStyle: U,
			actionButtonStyle: fe,
			className: we = "",
			descriptionClassName: se = "",
			duration: Y,
			position: oe,
			gap: xe,
			expandByDefault: ge,
			classNames: j,
			icons: I,
			closeButtonAriaLabel: F = "Close toast",
		} = n,
		[pe, J] = De.useState(null),
		[B, Z] = De.useState(null),
		[ee, ie] = De.useState(!1),
		[me, ve] = De.useState(!1),
		[ke, je] = De.useState(!1),
		[Ee, Qe] = De.useState(!1),
		[it, re] = De.useState(!1),
		[ce, de] = De.useState(0),
		[Te, Re] = De.useState(0),
		ze = De.useRef(g.duration || Y || ov),
		Ce = De.useRef(null),
		le = De.useRef(null),
		Ae = T === 0,
		Se = T + 1 <= R,
		Ue = g.type,
		Ye = g.dismissible !== !1,
		qe = g.className || "",
		X = g.descriptionClassName || "",
		Pe = De.useMemo(() => O.findIndex((Je) => Je.toastId === g.id) || 0, [O, g.id]),
		Jt = De.useMemo(() => {
			var Je;
			return (Je = g.closeButton) != null ? Je : D;
		}, [g.closeButton, D]),
		st = De.useMemo(() => g.duration || Y || ov, [g.duration, Y]),
		Mt = De.useRef(0),
		wt = De.useRef(0),
		dn = De.useRef(0),
		Tn = De.useRef(null),
		[qn, Ze] = oe.split("-"),
		rt = De.useMemo(
			() => O.reduce((Je, xt, Pt) => (Pt >= Pe ? Je : Je + xt.height), 0),
			[O, Pe]
		),
		ht = bC(),
		br = g.invert || y,
		hn = Ue === "loading";
	(wt.current = De.useMemo(() => Pe * xe + rt, [Pe, rt])),
		De.useEffect(() => {
			ze.current = st;
		}, [st]),
		De.useEffect(() => {
			ie(!0);
		}, []),
		De.useEffect(() => {
			const Je = le.current;
			if (Je) {
				const xt = Je.getBoundingClientRect().height;
				return (
					Re(xt),
					w((Pt) => [{ toastId: g.id, height: xt, position: g.position }, ...Pt]),
					() => w((Pt) => Pt.filter((Dt) => Dt.toastId !== g.id))
				);
			}
		}, [w, g.id]),
		De.useLayoutEffect(() => {
			if (!ee) return;
			const Je = le.current,
				xt = Je.style.height;
			Je.style.height = "auto";
			const Pt = Je.getBoundingClientRect().height;
			(Je.style.height = xt),
				Re(Pt),
				w((Dt) =>
					Dt.find((Nt) => Nt.toastId === g.id)
						? Dt.map((Nt) =>
								Nt.toastId === g.id ? _e(P({}, Nt), { height: Pt }) : Nt
						  )
						: [{ toastId: g.id, height: Pt, position: g.position }, ...Dt]
				);
		}, [ee, g.title, g.description, w, g.id, g.jsx, g.action, g.cancel]);
	const lt = De.useCallback(() => {
		ve(!0),
			de(wt.current),
			w((Je) => Je.filter((xt) => xt.toastId !== g.id)),
			setTimeout(() => {
				_(g);
			}, _C);
	}, [g, _, w, wt]);
	De.useEffect(() => {
		if ((g.promise && Ue === "loading") || g.duration === 1 / 0 || g.type === "loading")
			return;
		let Je;
		return (
			M || b || ht
				? (() => {
						if (dn.current < Mt.current) {
							const Dt = new Date().getTime() - Mt.current;
							ze.current = ze.current - Dt;
						}
						dn.current = new Date().getTime();
				  })()
				: ze.current !== 1 / 0 &&
				  ((Mt.current = new Date().getTime()),
				  (Je = setTimeout(() => {
						g.onAutoClose == null || g.onAutoClose.call(g, g), lt();
				  }, ze.current))),
			() => clearTimeout(Je)
		);
	}, [M, b, g, Ue, ht, lt]),
		De.useEffect(() => {
			g.delete && (lt(), g.onDismiss == null || g.onDismiss.call(g, g));
		}, [lt, g.delete]);
	function _t() {
		var Je;
		if (I != null && I.loading) {
			var xt;
			return De.createElement(
				"div",
				{
					className: lo(
						j == null ? void 0 : j.loader,
						g == null || (xt = g.classNames) == null ? void 0 : xt.loader,
						"sonner-loader"
					),
					"data-visible": Ue === "loading",
				},
				I.loading
			);
		}
		return De.createElement(dC, {
			className: lo(
				j == null ? void 0 : j.loader,
				g == null || (Je = g.classNames) == null ? void 0 : Je.loader
			),
			visible: Ue === "loading",
		});
	}
	const en = g.icon || (I == null ? void 0 : I[Ue]) || cC(Ue);
	var It, Gt;
	return De.createElement(
		"li",
		{
			tabIndex: 0,
			ref: le,
			className: lo(
				we,
				qe,
				j == null ? void 0 : j.toast,
				g == null || (r = g.classNames) == null ? void 0 : r.toast,
				j == null ? void 0 : j.default,
				j == null ? void 0 : j[Ue],
				g == null || (o = g.classNames) == null ? void 0 : o[Ue]
			),
			"data-sonner-toast": "",
			"data-rich-colors": (It = g.richColors) != null ? It : N,
			"data-styled": !(g.jsx || g.unstyled || S),
			"data-mounted": ee,
			"data-promise": !!g.promise,
			"data-swiped": it,
			"data-removed": me,
			"data-visible": Se,
			"data-y-position": qn,
			"data-x-position": Ze,
			"data-index": T,
			"data-front": Ae,
			"data-swiping": ke,
			"data-dismissible": Ye,
			"data-type": Ue,
			"data-invert": br,
			"data-swipe-out": Ee,
			"data-swipe-direction": B,
			"data-expanded": !!(M || (ge && ee)),
			"data-testid": g.testId,
			style: P(
				P(
					{
						"--index": T,
						"--toasts-before": T,
						"--z-index": L.length - T,
						"--offset": `${me ? ce : wt.current}px`,
						"--initial-height": ge ? "auto" : `${Te}px`,
					},
					H
				),
				g.style
			),
			onDragEnd: () => {
				je(!1), J(null), (Tn.current = null);
			},
			onPointerDown: (Je) => {
				Je.button !== 2 &&
					(hn ||
						!Ye ||
						((Ce.current = new Date()),
						de(wt.current),
						Je.target.setPointerCapture(Je.pointerId),
						Je.target.tagName !== "BUTTON" &&
							(je(!0), (Tn.current = { x: Je.clientX, y: Je.clientY }))));
			},
			onPointerUp: () => {
				var Je, xt, Pt;
				if (Ee || !Ye) return;
				Tn.current = null;
				const Dt = Number(
						((Je = le.current) == null
							? void 0
							: Je.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0
					),
					Kn = Number(
						((xt = le.current) == null
							? void 0
							: xt.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0
					),
					Nt =
						new Date().getTime() - ((Pt = Ce.current) == null ? void 0 : Pt.getTime()),
					Cn = pe === "x" ? Dt : Kn,
					Br = Math.abs(Cn) / Nt;
				if (Math.abs(Cn) >= kC || Br > 0.11) {
					de(wt.current),
						g.onDismiss == null || g.onDismiss.call(g, g),
						Z(pe === "x" ? (Dt > 0 ? "right" : "left") : Kn > 0 ? "down" : "up"),
						lt(),
						Qe(!0);
					return;
				} else {
					var pn, xn;
					(pn = le.current) == null || pn.style.setProperty("--swipe-amount-x", "0px"),
						(xn = le.current) == null ||
							xn.style.setProperty("--swipe-amount-y", "0px");
				}
				re(!1), je(!1), J(null);
			},
			onPointerMove: (Je) => {
				var xt, Pt, Dt;
				if (
					!Tn.current ||
					!Ye ||
					((xt = window.getSelection()) == null ? void 0 : xt.toString().length) > 0
				)
					return;
				const Nt = Je.clientY - Tn.current.y,
					Cn = Je.clientX - Tn.current.x;
				var Br;
				const pn = (Br = n.swipeDirections) != null ? Br : DC(oe);
				!pe &&
					(Math.abs(Cn) > 1 || Math.abs(Nt) > 1) &&
					J(Math.abs(Cn) > Math.abs(Nt) ? "x" : "y");
				let xn = { x: 0, y: 0 };
				const Xt = (Pn) => 1 / (1.5 + Math.abs(Pn) / 20);
				if (pe === "y") {
					if (pn.includes("top") || pn.includes("bottom"))
						if ((pn.includes("top") && Nt < 0) || (pn.includes("bottom") && Nt > 0))
							xn.y = Nt;
						else {
							const Pn = Nt * Xt(Nt);
							xn.y = Math.abs(Pn) < Math.abs(Nt) ? Pn : Nt;
						}
				} else if (pe === "x" && (pn.includes("left") || pn.includes("right")))
					if ((pn.includes("left") && Cn < 0) || (pn.includes("right") && Cn > 0))
						xn.x = Cn;
					else {
						const Pn = Cn * Xt(Cn);
						xn.x = Math.abs(Pn) < Math.abs(Cn) ? Pn : Cn;
					}
				(Math.abs(xn.x) > 0 || Math.abs(xn.y) > 0) && re(!0),
					(Pt = le.current) == null ||
						Pt.style.setProperty("--swipe-amount-x", `${xn.x}px`),
					(Dt = le.current) == null ||
						Dt.style.setProperty("--swipe-amount-y", `${xn.y}px`);
			},
		},
		Jt && !g.jsx && Ue !== "loading"
			? De.createElement(
					"button",
					{
						"aria-label": F,
						"data-disabled": hn,
						"data-close-button": !0,
						onClick:
							hn || !Ye
								? () => {}
								: () => {
										lt(), g.onDismiss == null || g.onDismiss.call(g, g);
								  },
						className: lo(
							j == null ? void 0 : j.closeButton,
							g == null || (i = g.classNames) == null ? void 0 : i.closeButton
						),
					},
					(Gt = I == null ? void 0 : I.close) != null ? Gt : yC
			  )
			: null,
		(Ue || g.icon || g.promise) &&
			g.icon !== null &&
			((I == null ? void 0 : I[Ue]) !== null || g.icon)
			? De.createElement(
					"div",
					{
						"data-icon": "",
						className: lo(
							j == null ? void 0 : j.icon,
							g == null || (l = g.classNames) == null ? void 0 : l.icon
						),
					},
					g.promise || (g.type === "loading" && !g.icon) ? g.icon || _t() : null,
					g.type !== "loading" ? en : null
			  )
			: null,
		De.createElement(
			"div",
			{
				"data-content": "",
				className: lo(
					j == null ? void 0 : j.content,
					g == null || (u = g.classNames) == null ? void 0 : u.content
				),
			},
			De.createElement(
				"div",
				{
					"data-title": "",
					className: lo(
						j == null ? void 0 : j.title,
						g == null || (c = g.classNames) == null ? void 0 : c.title
					),
				},
				g.jsx ? g.jsx : typeof g.title == "function" ? g.title() : g.title
			),
			g.description
				? De.createElement(
						"div",
						{
							"data-description": "",
							className: lo(
								se,
								X,
								j == null ? void 0 : j.description,
								g == null || (h = g.classNames) == null ? void 0 : h.description
							),
						},
						typeof g.description == "function" ? g.description() : g.description
				  )
				: null
		),
		De.isValidElement(g.cancel)
			? g.cancel
			: g.cancel && Mc(g.cancel)
			? De.createElement(
					"button",
					{
						"data-button": !0,
						"data-cancel": !0,
						style: g.cancelButtonStyle || U,
						onClick: (Je) => {
							Mc(g.cancel) &&
								Ye &&
								(g.cancel.onClick == null || g.cancel.onClick.call(g.cancel, Je),
								lt());
						},
						className: lo(
							j == null ? void 0 : j.cancelButton,
							g == null || (p = g.classNames) == null ? void 0 : p.cancelButton
						),
					},
					g.cancel.label
			  )
			: null,
		De.isValidElement(g.action)
			? g.action
			: g.action && Mc(g.action)
			? De.createElement(
					"button",
					{
						"data-button": !0,
						"data-action": !0,
						style: g.actionButtonStyle || fe,
						onClick: (Je) => {
							Mc(g.action) &&
								(g.action.onClick == null || g.action.onClick.call(g.action, Je),
								!Je.defaultPrevented && lt());
						},
						className: lo(
							j == null ? void 0 : j.actionButton,
							g == null || (f = g.classNames) == null ? void 0 : f.actionButton
						),
					},
					g.action.label
			  )
			: null
	);
};
function av() {
	if (typeof window == "undefined" || typeof document == "undefined") return "ltr";
	const n = document.documentElement.getAttribute("dir");
	return n === "auto" || !n ? window.getComputedStyle(document.documentElement).direction : n;
}
function LC(n, r) {
	const o = {};
	return (
		[n, r].forEach((i, l) => {
			const u = l === 1,
				c = u ? "--mobile-offset" : "--offset",
				h = u ? OC : CC;
			function p(f) {
				["top", "right", "bottom", "left"].forEach((y) => {
					o[`${c}-${y}`] = typeof f == "number" ? `${f}px` : f;
				});
			}
			typeof i == "number" || typeof i == "string"
				? p(i)
				: typeof i == "object"
				? ["top", "right", "bottom", "left"].forEach((f) => {
						i[f] === void 0
							? (o[`${c}-${f}`] = h)
							: (o[`${c}-${f}`] = typeof i[f] == "number" ? `${i[f]}px` : i[f]);
				  })
				: p(h);
		}),
		o
	);
}
const zC = De.forwardRef(function (r, o) {
		const {
				id: i,
				invert: l,
				position: u = "bottom-right",
				hotkey: c = ["altKey", "KeyT"],
				expand: h,
				closeButton: p,
				className: f,
				offset: y,
				mobileOffset: g,
				theme: S = "light",
				richColors: b,
				duration: w,
				style: R,
				visibleToasts: O = TC,
				toastOptions: T,
				dir: L = av(),
				gap: M = MC,
				icons: _,
				containerAriaLabel: N = "Notifications",
			} = r,
			[D, H] = De.useState([]),
			U = De.useMemo(
				() => (i ? D.filter((ee) => ee.toasterId === i) : D.filter((ee) => !ee.toasterId)),
				[D, i]
			),
			fe = De.useMemo(
				() =>
					Array.from(
						new Set([u].concat(U.filter((ee) => ee.position).map((ee) => ee.position)))
					),
				[U, u]
			),
			[we, se] = De.useState([]),
			[Y, oe] = De.useState(!1),
			[xe, ge] = De.useState(!1),
			[j, I] = De.useState(
				S !== "system"
					? S
					: typeof window != "undefined" &&
					  window.matchMedia &&
					  window.matchMedia("(prefers-color-scheme: dark)").matches
					? "dark"
					: "light"
			),
			F = De.useRef(null),
			pe = c.join("+").replace(/Key/g, "").replace(/Digit/g, ""),
			J = De.useRef(null),
			B = De.useRef(!1),
			Z = De.useCallback((ee) => {
				H((ie) => {
					var me;
					return (
						((me = ie.find((ve) => ve.id === ee.id)) != null && me.delete) ||
							nr.dismiss(ee.id),
						ie.filter(({ id: ve }) => ve !== ee.id)
					);
				});
			}, []);
		return (
			De.useEffect(
				() =>
					nr.subscribe((ee) => {
						if (ee.dismiss) {
							requestAnimationFrame(() => {
								H((ie) =>
									ie.map((me) =>
										me.id === ee.id ? _e(P({}, me), { delete: !0 }) : me
									)
								);
							});
							return;
						}
						setTimeout(() => {
							lC.flushSync(() => {
								H((ie) => {
									const me = ie.findIndex((ve) => ve.id === ee.id);
									return me !== -1
										? [
												...ie.slice(0, me),
												P(P({}, ie[me]), ee),
												...ie.slice(me + 1),
										  ]
										: [ee, ...ie];
								});
							});
						});
					}),
				[D]
			),
			De.useEffect(() => {
				if (S !== "system") {
					I(S);
					return;
				}
				if (
					(S === "system" &&
						(window.matchMedia &&
						window.matchMedia("(prefers-color-scheme: dark)").matches
							? I("dark")
							: I("light")),
					typeof window == "undefined")
				)
					return;
				const ee = window.matchMedia("(prefers-color-scheme: dark)");
				try {
					ee.addEventListener("change", ({ matches: ie }) => {
						I(ie ? "dark" : "light");
					});
				} catch (ie) {
					ee.addListener(({ matches: me }) => {
						try {
							I(me ? "dark" : "light");
						} catch (ve) {
							console.error(ve);
						}
					});
				}
			}, [S]),
			De.useEffect(() => {
				D.length <= 1 && oe(!1);
			}, [D]),
			De.useEffect(() => {
				const ee = (ie) => {
					var me;
					if (c.every((je) => ie[je] || ie.code === je)) {
						var ke;
						oe(!0), (ke = F.current) == null || ke.focus();
					}
					ie.code === "Escape" &&
						(document.activeElement === F.current ||
							((me = F.current) != null && me.contains(document.activeElement))) &&
						oe(!1);
				};
				return (
					document.addEventListener("keydown", ee),
					() => document.removeEventListener("keydown", ee)
				);
			}, [c]),
			De.useEffect(() => {
				if (F.current)
					return () => {
						J.current &&
							(J.current.focus({ preventScroll: !0 }),
							(J.current = null),
							(B.current = !1));
					};
			}, [F.current]),
			De.createElement(
				"section",
				{
					ref: o,
					"aria-label": `${N} ${pe}`,
					tabIndex: -1,
					"aria-live": "polite",
					"aria-relevant": "additions text",
					"aria-atomic": "false",
					suppressHydrationWarning: !0,
				},
				fe.map((ee, ie) => {
					var me;
					const [ve, ke] = ee.split("-");
					return U.length
						? De.createElement(
								"ol",
								{
									key: ee,
									dir: L === "auto" ? av() : L,
									tabIndex: -1,
									ref: F,
									className: f,
									"data-sonner-toaster": !0,
									"data-sonner-theme": j,
									"data-y-position": ve,
									"data-x-position": ke,
									style: P(
										P(
											{
												"--front-toast-height": `${
													((me = we[0]) == null ? void 0 : me.height) ||
													0
												}px`,
												"--width": `${AC}px`,
												"--gap": `${M}px`,
											},
											R
										),
										LC(y, g)
									),
									onBlur: (je) => {
										B.current &&
											!je.currentTarget.contains(je.relatedTarget) &&
											((B.current = !1),
											J.current &&
												(J.current.focus({ preventScroll: !0 }),
												(J.current = null)));
									},
									onFocus: (je) => {
										(je.target instanceof HTMLElement &&
											je.target.dataset.dismissible === "false") ||
											B.current ||
											((B.current = !0), (J.current = je.relatedTarget));
									},
									onMouseEnter: () => oe(!0),
									onMouseMove: () => oe(!0),
									onMouseLeave: () => {
										xe || oe(!1);
									},
									onDragEnd: () => oe(!1),
									onPointerDown: (je) => {
										(je.target instanceof HTMLElement &&
											je.target.dataset.dismissible === "false") ||
											ge(!0);
									},
									onPointerUp: () => ge(!1),
								},
								U.filter(
									(je) => (!je.position && ie === 0) || je.position === ee
								).map((je, Ee) => {
									var Qe, it;
									return De.createElement(NC, {
										key: je.id,
										icons: _,
										index: Ee,
										toast: je,
										defaultRichColors: b,
										duration:
											(Qe = T == null ? void 0 : T.duration) != null
												? Qe
												: w,
										className: T == null ? void 0 : T.className,
										descriptionClassName:
											T == null ? void 0 : T.descriptionClassName,
										invert: l,
										visibleToasts: O,
										closeButton:
											(it = T == null ? void 0 : T.closeButton) != null
												? it
												: p,
										interacting: xe,
										position: ee,
										style: T == null ? void 0 : T.style,
										unstyled: T == null ? void 0 : T.unstyled,
										classNames: T == null ? void 0 : T.classNames,
										cancelButtonStyle:
											T == null ? void 0 : T.cancelButtonStyle,
										actionButtonStyle:
											T == null ? void 0 : T.actionButtonStyle,
										closeButtonAriaLabel:
											T == null ? void 0 : T.closeButtonAriaLabel,
										removeToast: Z,
										toasts: U.filter((re) => re.position == je.position),
										heights: we.filter((re) => re.position == je.position),
										setHeights: se,
										expandByDefault: h,
										gap: M,
										expanded: Y,
										swipeDirections: r.swipeDirections,
									});
								})
						  )
						: null;
				})
			)
		);
	}),
	iv = {};
function Hn(n, r) {
	const o = v.useRef(iv);
	return o.current === iv && (o.current = n(r)), o;
}
const _p = [];
let Dp;
function jC() {
	return Dp;
}
function BC(n) {
	_p.push(n);
}
function dm(n) {
	const r = (o, i) => {
		const l = Hn(UC).current;
		let u;
		try {
			Dp = l;
			for (const c of _p) c.before(l);
			u = n(o, i);
			for (const c of _p) c.after(l);
			l.didInitialize = !0;
		} finally {
			Dp = void 0;
		}
		return u;
	};
	return (r.displayName = n.displayName || n.name), r;
}
function tS(n) {
	return v.forwardRef(dm(n));
}
function UC() {
	return { didInitialize: !1 };
}
function hm(n) {
	const r = v.useRef(!0);
	r.current && ((r.current = !1), n());
}
const HC = () => {},
	$e = typeof document != "undefined" ? v.useLayoutEffect : HC;
function Xn(n, ...r) {
	const o = new URL("https://base-ui.com/production-error");
	return (
		o.searchParams.set("code", n.toString()),
		r.forEach((i) => o.searchParams.append("args[]", i)),
		`Base UI error #${n}; visit ${o} for the full message.`
	);
}
const nS = v.createContext(void 0);
function Wl(n) {
	const r = v.useContext(nS);
	if (r === void 0 && !n) throw new Error(Xn(72));
	return r;
}
const qC = [];
function pm(n) {
	v.useEffect(n, qC);
}
const Bl = 0;
class go {
	constructor() {
		jt(this, "currentId", Bl);
		jt(this, "clear", () => {
			this.currentId !== Bl && (clearTimeout(this.currentId), (this.currentId = Bl));
		});
		jt(this, "disposeEffect", () => this.clear);
	}
	static create() {
		return new go();
	}
	start(r, o) {
		this.clear(),
			(this.currentId = setTimeout(() => {
				(this.currentId = Bl), o();
			}, r));
	}
	isStarted() {
		return this.currentId !== Bl;
	}
}
function mr() {
	const n = Hn(go.create).current;
	return pm(n.disposeEffect), n;
}
function bf() {
	return typeof window != "undefined";
}
function ja(n) {
	return mm(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function Sn(n) {
	var r;
	return (n == null || (r = n.ownerDocument) == null ? void 0 : r.defaultView) || window;
}
function bo(n) {
	var r;
	return (r = (mm(n) ? n.ownerDocument : n.document) || window.document) == null
		? void 0
		: r.documentElement;
}
function mm(n) {
	return bf() ? n instanceof Node || n instanceof Sn(n).Node : !1;
}
function At(n) {
	return bf() ? n instanceof Element || n instanceof Sn(n).Element : !1;
}
function nn(n) {
	return bf() ? n instanceof HTMLElement || n instanceof Sn(n).HTMLElement : !1;
}
function Np(n) {
	return !bf() || typeof ShadowRoot == "undefined"
		? !1
		: n instanceof ShadowRoot || n instanceof Sn(n).ShadowRoot;
}
const PC = new Set(["inline", "contents"]);
function Ba(n) {
	const { overflow: r, overflowX: o, overflowY: i, display: l } = gr(n);
	return /auto|scroll|overlay|hidden|clip/.test(r + i + o) && !PC.has(l);
}
const VC = new Set(["table", "td", "th"]);
function YC(n) {
	return VC.has(ja(n));
}
const IC = [":popover-open", ":modal"];
function vf(n) {
	return IC.some((r) => {
		try {
			return n.matches(r);
		} catch (o) {
			return !1;
		}
	});
}
const GC = ["transform", "translate", "scale", "rotate", "perspective"],
	FC = ["transform", "translate", "scale", "rotate", "perspective", "filter"],
	XC = ["paint", "layout", "strict", "content"];
function gm(n) {
	const r = Sf(),
		o = At(n) ? gr(n) : n;
	return (
		GC.some((i) => (o[i] ? o[i] !== "none" : !1)) ||
		(o.containerType ? o.containerType !== "normal" : !1) ||
		(!r && (o.backdropFilter ? o.backdropFilter !== "none" : !1)) ||
		(!r && (o.filter ? o.filter !== "none" : !1)) ||
		FC.some((i) => (o.willChange || "").includes(i)) ||
		XC.some((i) => (o.contain || "").includes(i))
	);
}
function KC(n) {
	let r = yo(n);
	for (; nn(r) && !fo(r); ) {
		if (gm(r)) return r;
		if (vf(r)) return null;
		r = yo(r);
	}
	return null;
}
function Sf() {
	return typeof CSS == "undefined" || !CSS.supports
		? !1
		: CSS.supports("-webkit-backdrop-filter", "none");
}
const QC = new Set(["html", "body", "#document"]);
function fo(n) {
	return QC.has(ja(n));
}
function gr(n) {
	return Sn(n).getComputedStyle(n);
}
function xf(n) {
	return At(n)
		? { scrollLeft: n.scrollLeft, scrollTop: n.scrollTop }
		: { scrollLeft: n.scrollX, scrollTop: n.scrollY };
}
function yo(n) {
	if (ja(n) === "html") return n;
	const r = n.assignedSlot || n.parentNode || (Np(n) && n.host) || bo(n);
	return Np(r) ? r.host : r;
}
function rS(n) {
	const r = yo(n);
	return fo(r) ? (n.ownerDocument ? n.ownerDocument.body : n.body) : nn(r) && Ba(r) ? r : rS(r);
}
function Na(n, r, o) {
	var i;
	r === void 0 && (r = []), o === void 0 && (o = !0);
	const l = rS(n),
		u = l === ((i = n.ownerDocument) == null ? void 0 : i.body),
		c = Sn(l);
	if (u) {
		const h = Lp(c);
		return r.concat(c, c.visualViewport || [], Ba(l) ? l : [], h && o ? Na(h) : []);
	}
	return r.concat(l, Na(l, [], o));
}
function Lp(n) {
	return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function Fn(n) {
	const r = Hn(ZC, n).current;
	return (r.next = n), $e(r.effect), r;
}
function ZC(n) {
	const r = {
		current: n,
		next: n,
		effect: () => {
			r.current = r.next;
		},
	};
	return r;
}
const Wh = r1[`useInsertionEffect${Math.random().toFixed(1)}`.slice(0, -3)],
	JC = Wh && Wh !== v.useLayoutEffect ? Wh : (n) => n();
function Ke(n) {
	const r = Hn(WC).current;
	return (r.next = n), JC(r.effect), r.trampoline;
}
function WC() {
	const n = {
		next: void 0,
		callback: $C,
		trampoline: (...r) => {
			var o;
			return (o = n.callback) == null ? void 0 : o.call(n, ...r);
		},
		effect: () => {
			n.callback = n.next;
		},
	};
	return n;
}
function $C() {}
function kt(n) {
	return (n == null ? void 0 : n.ownerDocument) || document;
}
const Ls = typeof navigator != "undefined",
	$h = tO(),
	oS = rO(),
	aS = nO(),
	iS =
		typeof CSS == "undefined" || !CSS.supports
			? !1
			: CSS.supports("-webkit-backdrop-filter:none"),
	sS =
		$h.platform === "MacIntel" && $h.maxTouchPoints > 1
			? !0
			: /iP(hone|ad|od)|iOS/.test($h.platform),
	lS = Ls && /apple/i.test(navigator.vendor),
	zp = (Ls && /android/i.test(oS)) || /android/i.test(aS),
	eO = Ls && oS.toLowerCase().startsWith("mac") && !navigator.maxTouchPoints,
	uS = aS.includes("jsdom/");
function tO() {
	var r, o;
	if (!Ls) return { platform: "", maxTouchPoints: -1 };
	const n = navigator.userAgentData;
	return n != null && n.platform
		? { platform: n.platform, maxTouchPoints: navigator.maxTouchPoints }
		: {
				platform: (r = navigator.platform) != null ? r : "",
				maxTouchPoints: (o = navigator.maxTouchPoints) != null ? o : -1,
		  };
}
function nO() {
	if (!Ls) return "";
	const n = navigator.userAgentData;
	return n && Array.isArray(n.brands)
		? n.brands.map(({ brand: r, version: o }) => `${r}/${o}`).join(" ")
		: navigator.userAgent;
}
function rO() {
	var r;
	if (!Ls) return "";
	const n = navigator.userAgentData;
	return n != null && n.platform ? n.platform : (r = navigator.platform) != null ? r : "";
}
const jp = "data-base-ui-focusable",
	cS = "active",
	fS = "selected",
	dS =
		"input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])",
	La = "ArrowLeft",
	za = "ArrowRight",
	ym = "ArrowUp",
	$l = "ArrowDown";
function Qr(n) {
	var o;
	let r = n.activeElement;
	for (; ((o = r == null ? void 0 : r.shadowRoot) == null ? void 0 : o.activeElement) != null; )
		r = r.shadowRoot.activeElement;
	return r;
}
function ft(n, r) {
	var i;
	if (!n || !r) return !1;
	const o = (i = r.getRootNode) == null ? void 0 : i.call(r);
	if (n.contains(r)) return !0;
	if (o && Np(o)) {
		let l = r;
		for (; l; ) {
			if (n === l) return !0;
			l = l.parentNode || l.host;
		}
	}
	return !1;
}
function tf(n, r) {
	if (!At(n)) return !1;
	const o = n;
	if (r.hasElement(o)) return !o.hasAttribute("data-trigger-disabled");
	for (const [, i] of r.entries()) if (ft(i, o)) return !i.hasAttribute("data-trigger-disabled");
	return !1;
}
function In(n) {
	return "composedPath" in n ? n.composedPath()[0] : n.target;
}
function Xr(n, r) {
	if (r == null) return !1;
	if ("composedPath" in n) return n.composedPath().includes(r);
	const o = n;
	return o.target != null && r.contains(o.target);
}
function oO(n) {
	return n.matches("html,body");
}
function wf(n) {
	return nn(n) && n.matches(dS);
}
function Bp(n) {
	return n ? n.getAttribute("role") === "combobox" && wf(n) : !1;
}
function aO(n) {
	if (!n || uS) return !0;
	try {
		return n.matches(":focus-visible");
	} catch (r) {
		return !0;
	}
}
function nf(n) {
	return n ? (n.hasAttribute(jp) ? n : n.querySelector(`[${jp}]`) || n) : null;
}
function pi(n, r, o = !0) {
	return n
		.filter((l) => {
			var u;
			return l.parentId === r && (!o || ((u = l.context) == null ? void 0 : u.open));
		})
		.flatMap((l) => [l, ...pi(n, l.id, o)]);
}
function sv(n, r) {
	var l;
	let o = [],
		i = (l = n.find((u) => u.id === r)) == null ? void 0 : l.parentId;
	for (; i; ) {
		const u = n.find((c) => c.id === i);
		(i = u == null ? void 0 : u.parentId), u && (o = o.concat(u));
	}
	return o;
}
function Un(n) {
	n.preventDefault(), n.stopPropagation();
}
function iO(n) {
	return "nativeEvent" in n;
}
function hS(n) {
	return n.pointerType === "" && n.isTrusted
		? !0
		: zp && n.pointerType
		? n.type === "click" && n.buttons === 1
		: n.detail === 0 && !n.pointerType;
}
function pS(n) {
	return uS
		? !1
		: (!zp && n.width === 0 && n.height === 0) ||
				(zp &&
					n.width === 1 &&
					n.height === 1 &&
					n.pressure === 0 &&
					n.detail === 0 &&
					n.pointerType === "mouse") ||
				(n.width < 1 &&
					n.height < 1 &&
					n.pressure === 0 &&
					n.detail === 0 &&
					n.pointerType === "touch");
}
function mi(n, r) {
	const o = ["mouse", "pen"];
	return r || o.push("", void 0), o.includes(n);
}
function mS(n) {
	const r = n.type;
	return r === "click" || r === "mousedown" || r === "keydown" || r === "keyup";
}
const sO = ["top", "right", "bottom", "left"],
	xs = Math.min,
	pr = Math.max,
	rf = Math.round,
	gs = Math.floor,
	ho = (n) => ({ x: n, y: n }),
	lO = { left: "right", right: "left", bottom: "top", top: "bottom" },
	uO = { start: "end", end: "start" };
function Up(n, r, o) {
	return pr(n, xs(r, o));
}
function Zo(n, r) {
	return typeof n == "function" ? n(r) : n;
}
function rr(n) {
	return n.split("-")[0];
}
function Ua(n) {
	return n.split("-")[1];
}
function bm(n) {
	return n === "x" ? "y" : "x";
}
function vm(n) {
	return n === "y" ? "height" : "width";
}
const cO = new Set(["top", "bottom"]);
function zr(n) {
	return cO.has(rr(n)) ? "y" : "x";
}
function Sm(n) {
	return bm(zr(n));
}
function fO(n, r, o) {
	o === void 0 && (o = !1);
	const i = Ua(n),
		l = Sm(n),
		u = vm(l);
	let c =
		l === "x"
			? i === (o ? "end" : "start")
				? "right"
				: "left"
			: i === "start"
			? "bottom"
			: "top";
	return r.reference[u] > r.floating[u] && (c = of(c)), [c, of(c)];
}
function dO(n) {
	const r = of(n);
	return [Hp(n), r, Hp(r)];
}
function Hp(n) {
	return n.replace(/start|end/g, (r) => uO[r]);
}
const lv = ["left", "right"],
	uv = ["right", "left"],
	hO = ["top", "bottom"],
	pO = ["bottom", "top"];
function mO(n, r, o) {
	switch (n) {
		case "top":
		case "bottom":
			return o ? (r ? uv : lv) : r ? lv : uv;
		case "left":
		case "right":
			return r ? hO : pO;
		default:
			return [];
	}
}
function gO(n, r, o, i) {
	const l = Ua(n);
	let u = mO(rr(n), o === "start", i);
	return l && ((u = u.map((c) => c + "-" + l)), r && (u = u.concat(u.map(Hp)))), u;
}
function of(n) {
	return n.replace(/left|right|bottom|top/g, (r) => lO[r]);
}
function yO(n) {
	return P({ top: 0, right: 0, bottom: 0, left: 0 }, n);
}
function gS(n) {
	return typeof n != "number" ? yO(n) : { top: n, right: n, bottom: n, left: n };
}
function af(n) {
	const { x: r, y: o, width: i, height: l } = n;
	return { width: i, height: l, top: o, left: r, right: r + i, bottom: o + l, x: r, y: o };
}
function kc(n, r, o) {
	return Math.floor(n / r) !== o;
}
function Pl(n, r) {
	return r < 0 || r >= n.current.length;
}
function ep(n, r) {
	return Bn(n, { disabledIndices: r });
}
function cv(n, r) {
	return Bn(n, { decrement: !0, startingIndex: n.current.length, disabledIndices: r });
}
function Bn(
	n,
	{ startingIndex: r = -1, decrement: o = !1, disabledIndices: i, amount: l = 1 } = {}
) {
	let u = r;
	do u += o ? -l : l;
	while (u >= 0 && u <= n.current.length - 1 && Vl(n, u, i));
	return u;
}
function bO(
	n,
	{
		event: r,
		orientation: o,
		loopFocus: i,
		rtl: l,
		cols: u,
		disabledIndices: c,
		minIndex: h,
		maxIndex: p,
		prevIndex: f,
		stopEvent: y = !1,
	}
) {
	let g = f;
	const S = [],
		b = {};
	let w = !1;
	{
		let T = null,
			L = -1;
		n.current.forEach((M, _) => {
			if (M == null) return;
			const N = M.closest('[role="row"]');
			N && (w = !0),
				(N !== T || L === -1) && ((T = N), (L += 1), (S[L] = [])),
				S[L].push(_),
				(b[_] = L);
		});
	}
	const R = w && S.length > 0 && S.some((T) => T.length !== u);
	function O(T) {
		if (!R || f === -1) return;
		const L = b[f];
		if (L == null) return;
		const M = S[L].indexOf(f);
		let _ = T === "up" ? L - 1 : L + 1;
		i && (_ < 0 ? (_ = S.length - 1) : _ >= S.length && (_ = 0));
		const N = new Set();
		for (; _ >= 0 && _ < S.length && !N.has(_); ) {
			N.add(_);
			const D = S[_];
			if (D.length === 0) {
				_ = T === "up" ? _ - 1 : _ + 1;
				continue;
			}
			const H = Math.min(M, D.length - 1);
			for (let U = H; U >= 0; U -= 1) {
				const fe = D[U];
				if (!Vl(n, fe, c)) return fe;
			}
			(_ = T === "up" ? _ - 1 : _ + 1),
				i && (_ < 0 ? (_ = S.length - 1) : _ >= S.length && (_ = 0));
		}
	}
	if (r.key === ym) {
		const T = O("up");
		if (T !== void 0) y && Un(r), (g = T);
		else {
			if ((y && Un(r), f === -1)) g = p;
			else if (
				((g = Bn(n, { startingIndex: g, amount: u, decrement: !0, disabledIndices: c })),
				i && (f - u < h || g < 0))
			) {
				const L = f % u,
					M = p % u,
					_ = p - (M - L);
				M === L ? (g = p) : (g = M > L ? _ : _ - u);
			}
			Pl(n, g) && (g = f);
		}
	}
	if (r.key === $l) {
		const T = O("down");
		T !== void 0
			? (y && Un(r), (g = T))
			: (y && Un(r),
			  f === -1
					? (g = h)
					: ((g = Bn(n, { startingIndex: f, amount: u, disabledIndices: c })),
					  i &&
							f + u > p &&
							(g = Bn(n, {
								startingIndex: (f % u) - u,
								amount: u,
								disabledIndices: c,
							}))),
			  Pl(n, g) && (g = f));
	}
	if (o === "both") {
		const T = gs(f / u);
		r.key === (l ? La : za) &&
			(y && Un(r),
			f % u !== u - 1
				? ((g = Bn(n, { startingIndex: f, disabledIndices: c })),
				  i &&
						kc(g, u, T) &&
						(g = Bn(n, { startingIndex: f - (f % u) - 1, disabledIndices: c })))
				: i && (g = Bn(n, { startingIndex: f - (f % u) - 1, disabledIndices: c })),
			kc(g, u, T) && (g = f)),
			r.key === (l ? za : La) &&
				(y && Un(r),
				f % u !== 0
					? ((g = Bn(n, { startingIndex: f, decrement: !0, disabledIndices: c })),
					  i &&
							kc(g, u, T) &&
							(g = Bn(n, {
								startingIndex: f + (u - (f % u)),
								decrement: !0,
								disabledIndices: c,
							})))
					: i &&
					  (g = Bn(n, {
							startingIndex: f + (u - (f % u)),
							decrement: !0,
							disabledIndices: c,
					  })),
				kc(g, u, T) && (g = f));
		const L = gs(p / u) === T;
		Pl(n, g) &&
			(i && L
				? (g =
						r.key === (l ? za : La)
							? p
							: Bn(n, { startingIndex: f - (f % u) - 1, disabledIndices: c }))
				: (g = f));
	}
	return g;
}
function vO(n, r, o) {
	const i = [];
	let l = 0;
	return (
		n.forEach(({ width: u, height: c }, h) => {
			let p = !1;
			for (; !p; ) {
				const f = [];
				for (let y = 0; y < u; y += 1)
					for (let g = 0; g < c; g += 1) f.push(l + y + g * r);
				(l % r) + u <= r && f.every((y) => i[y] == null)
					? (f.forEach((y) => {
							i[y] = h;
					  }),
					  (p = !0))
					: (l += 1);
			}
		}),
		[...i]
	);
}
function SO(n, r, o, i, l) {
	if (n === -1) return -1;
	const u = o.indexOf(n),
		c = r[n];
	switch (l) {
		case "tl":
			return u;
		case "tr":
			return c ? u + c.width - 1 : u;
		case "bl":
			return c ? u + (c.height - 1) * i : u;
		case "br":
			return o.lastIndexOf(n);
		default:
			return -1;
	}
}
function xO(n, r) {
	return r.flatMap((o, i) => (n.includes(o) ? [i] : []));
}
function Vl(n, r, o) {
	if (typeof o == "function") return o(r);
	if (o) return o.includes(r);
	const i = n.current[r];
	return i ? i.hasAttribute("disabled") || i.getAttribute("aria-disabled") === "true" : !1;
}
var wO = [
		"input:not([inert]):not([inert] *)",
		"select:not([inert]):not([inert] *)",
		"textarea:not([inert]):not([inert] *)",
		"a[href]:not([inert]):not([inert] *)",
		"button:not([inert]):not([inert] *)",
		"[tabindex]:not(slot):not([inert]):not([inert] *)",
		"audio[controls]:not([inert]):not([inert] *)",
		"video[controls]:not([inert]):not([inert] *)",
		'[contenteditable]:not([contenteditable="false"]):not([inert]):not([inert] *)',
		"details>summary:first-of-type:not([inert]):not([inert] *)",
		"details:not([inert]):not([inert] *)",
	],
	sf = wO.join(","),
	yS = typeof Element == "undefined",
	ws = yS
		? function () {}
		: Element.prototype.matches ||
		  Element.prototype.msMatchesSelector ||
		  Element.prototype.webkitMatchesSelector,
	lf =
		!yS && Element.prototype.getRootNode
			? function (n) {
					var r;
					return n == null || (r = n.getRootNode) === null || r === void 0
						? void 0
						: r.call(n);
			  }
			: function (n) {
					return n == null ? void 0 : n.ownerDocument;
			  },
	uf = function (r, o) {
		var i;
		o === void 0 && (o = !0);
		var l =
				r == null || (i = r.getAttribute) === null || i === void 0
					? void 0
					: i.call(r, "inert"),
			u = l === "" || l === "true",
			c =
				u ||
				(o &&
					r &&
					(typeof r.closest == "function" ? r.closest("[inert]") : uf(r.parentNode)));
		return c;
	},
	EO = function (r) {
		var o,
			i =
				r == null || (o = r.getAttribute) === null || o === void 0
					? void 0
					: o.call(r, "contenteditable");
		return i === "" || i === "true";
	},
	bS = function (r, o, i) {
		if (uf(r)) return [];
		var l = Array.prototype.slice.apply(r.querySelectorAll(sf));
		return o && ws.call(r, sf) && l.unshift(r), (l = l.filter(i)), l;
	},
	cf = function (r, o, i) {
		for (var l = [], u = Array.from(r); u.length; ) {
			var c = u.shift();
			if (!uf(c, !1))
				if (c.tagName === "SLOT") {
					var h = c.assignedElements(),
						p = h.length ? h : c.children,
						f = cf(p, !0, i);
					i.flatten ? l.push.apply(l, f) : l.push({ scopeParent: c, candidates: f });
				} else {
					var y = ws.call(c, sf);
					y && i.filter(c) && (o || !r.includes(c)) && l.push(c);
					var g =
							c.shadowRoot ||
							(typeof i.getShadowRoot == "function" && i.getShadowRoot(c)),
						S = !uf(g, !1) && (!i.shadowRootFilter || i.shadowRootFilter(c));
					if (g && S) {
						var b = cf(g === !0 ? c.children : g.children, !0, i);
						i.flatten ? l.push.apply(l, b) : l.push({ scopeParent: c, candidates: b });
					} else u.unshift.apply(u, c.children);
				}
		}
		return l;
	},
	vS = function (r) {
		return !isNaN(parseInt(r.getAttribute("tabindex"), 10));
	},
	SS = function (r) {
		if (!r) throw new Error("No node provided");
		return r.tabIndex < 0 && (/^(AUDIO|VIDEO|DETAILS)$/.test(r.tagName) || EO(r)) && !vS(r)
			? 0
			: r.tabIndex;
	},
	RO = function (r, o) {
		var i = SS(r);
		return i < 0 && o && !vS(r) ? 0 : i;
	},
	TO = function (r, o) {
		return r.tabIndex === o.tabIndex
			? r.documentOrder - o.documentOrder
			: r.tabIndex - o.tabIndex;
	},
	xS = function (r) {
		return r.tagName === "INPUT";
	},
	CO = function (r) {
		return xS(r) && r.type === "hidden";
	},
	OO = function (r) {
		var o =
			r.tagName === "DETAILS" &&
			Array.prototype.slice.apply(r.children).some(function (i) {
				return i.tagName === "SUMMARY";
			});
		return o;
	},
	AO = function (r, o) {
		for (var i = 0; i < r.length; i++) if (r[i].checked && r[i].form === o) return r[i];
	},
	MO = function (r) {
		if (!r.name) return !0;
		var o = r.form || lf(r),
			i = function (h) {
				return o.querySelectorAll('input[type="radio"][name="' + h + '"]');
			},
			l;
		if (
			typeof window != "undefined" &&
			typeof window.CSS != "undefined" &&
			typeof window.CSS.escape == "function"
		)
			l = i(window.CSS.escape(r.name));
		else
			try {
				l = i(r.name);
			} catch (c) {
				return (
					console.error(
						"Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",
						c.message
					),
					!1
				);
			}
		var u = AO(l, r.form);
		return !u || u === r;
	},
	kO = function (r) {
		return xS(r) && r.type === "radio";
	},
	_O = function (r) {
		return kO(r) && !MO(r);
	},
	DO = function (r) {
		var o,
			i = r && lf(r),
			l = (o = i) === null || o === void 0 ? void 0 : o.host,
			u = !1;
		if (i && i !== r) {
			var c, h, p;
			for (
				u = !!(
					((c = l) !== null &&
						c !== void 0 &&
						(h = c.ownerDocument) !== null &&
						h !== void 0 &&
						h.contains(l)) ||
					(r != null && (p = r.ownerDocument) !== null && p !== void 0 && p.contains(r))
				);
				!u && l;

			) {
				var f, y, g;
				(i = lf(l)),
					(l = (f = i) === null || f === void 0 ? void 0 : f.host),
					(u = !!(
						(y = l) !== null &&
						y !== void 0 &&
						(g = y.ownerDocument) !== null &&
						g !== void 0 &&
						g.contains(l)
					));
			}
		}
		return u;
	},
	fv = function (r) {
		var o = r.getBoundingClientRect(),
			i = o.width,
			l = o.height;
		return i === 0 && l === 0;
	},
	NO = function (r, o) {
		var i = o.displayCheck,
			l = o.getShadowRoot;
		if (i === "full-native" && "checkVisibility" in r) {
			var u = r.checkVisibility({
				checkOpacity: !1,
				opacityProperty: !1,
				contentVisibilityAuto: !0,
				visibilityProperty: !0,
				checkVisibilityCSS: !0,
			});
			return !u;
		}
		if (getComputedStyle(r).visibility === "hidden") return !0;
		var c = ws.call(r, "details>summary:first-of-type"),
			h = c ? r.parentElement : r;
		if (ws.call(h, "details:not([open]) *")) return !0;
		if (!i || i === "full" || i === "full-native" || i === "legacy-full") {
			if (typeof l == "function") {
				for (var p = r; r; ) {
					var f = r.parentElement,
						y = lf(r);
					if (f && !f.shadowRoot && l(f) === !0) return fv(r);
					r.assignedSlot
						? (r = r.assignedSlot)
						: !f && y !== r.ownerDocument
						? (r = y.host)
						: (r = f);
				}
				r = p;
			}
			if (DO(r)) return !r.getClientRects().length;
			if (i !== "legacy-full") return !0;
		} else if (i === "non-zero-area") return fv(r);
		return !1;
	},
	LO = function (r) {
		if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(r.tagName))
			for (var o = r.parentElement; o; ) {
				if (o.tagName === "FIELDSET" && o.disabled) {
					for (var i = 0; i < o.children.length; i++) {
						var l = o.children.item(i);
						if (l.tagName === "LEGEND")
							return ws.call(o, "fieldset[disabled] *") ? !0 : !l.contains(r);
					}
					return !0;
				}
				o = o.parentElement;
			}
		return !1;
	},
	qp = function (r, o) {
		return !(o.disabled || CO(o) || NO(o, r) || OO(o) || LO(o));
	},
	Pp = function (r, o) {
		return !(_O(o) || SS(o) < 0 || !qp(r, o));
	},
	zO = function (r) {
		var o = parseInt(r.getAttribute("tabindex"), 10);
		return !!(isNaN(o) || o >= 0);
	},
	wS = function (r) {
		var o = [],
			i = [];
		return (
			r.forEach(function (l, u) {
				var c = !!l.scopeParent,
					h = c ? l.scopeParent : l,
					p = RO(h, c),
					f = c ? wS(l.candidates) : h;
				p === 0
					? c
						? o.push.apply(o, f)
						: o.push(h)
					: i.push({ documentOrder: u, tabIndex: p, item: l, isScope: c, content: f });
			}),
			i
				.sort(TO)
				.reduce(function (l, u) {
					return u.isScope ? l.push.apply(l, u.content) : l.push(u.content), l;
				}, [])
				.concat(o)
		);
	},
	eu = function (r, o) {
		o = o || {};
		var i;
		return (
			o.getShadowRoot
				? (i = cf([r], o.includeContainer, {
						filter: Pp.bind(null, o),
						flatten: !1,
						getShadowRoot: o.getShadowRoot,
						shadowRootFilter: zO,
				  }))
				: (i = bS(r, o.includeContainer, Pp.bind(null, o))),
			wS(i)
		);
	},
	jO = function (r, o) {
		o = o || {};
		var i;
		return (
			o.getShadowRoot
				? (i = cf([r], o.includeContainer, {
						filter: qp.bind(null, o),
						flatten: !0,
						getShadowRoot: o.getShadowRoot,
				  }))
				: (i = bS(r, o.includeContainer, qp.bind(null, o))),
			i
		);
	},
	ES = function (r, o) {
		if (((o = o || {}), !r)) throw new Error("No node provided");
		return ws.call(r, sf) === !1 ? !1 : Pp(o, r);
	};
const zs = () => ({
	getShadowRoot: !0,
	displayCheck:
		typeof ResizeObserver == "function" && ResizeObserver.toString().includes("[native code]")
			? "full"
			: "none",
});
function RS(n, r) {
	const o = eu(n, zs()),
		i = o.length;
	if (i === 0) return;
	const l = Qr(kt(n)),
		u = o.indexOf(l),
		c = u === -1 ? (r === 1 ? 0 : i - 1) : u + r;
	return o[c];
}
function xm(n) {
	return RS(kt(n).body, 1) || n;
}
function TS(n) {
	return RS(kt(n).body, -1) || n;
}
function CS(n, r) {
	if (!n) return null;
	const o = eu(kt(n).body, zs()),
		i = o.length;
	if (i === 0) return null;
	const l = o.indexOf(n);
	if (l === -1) return null;
	const u = (l + r + i) % i;
	return o[u];
}
function BO(n) {
	return CS(n, 1);
}
function UO(n) {
	return CS(n, -1);
}
function ys(n, r) {
	const o = r || n.currentTarget,
		i = n.relatedTarget;
	return !i || !ft(o, i);
}
function HO(n) {
	eu(n, zs()).forEach((o) => {
		(o.dataset.tabindex = o.getAttribute("tabindex") || ""), o.setAttribute("tabindex", "-1");
	});
}
function dv(n) {
	n.querySelectorAll("[data-tabindex]").forEach((o) => {
		const i = o.dataset.tabindex;
		delete o.dataset.tabindex,
			i ? o.setAttribute("tabindex", i) : o.removeAttribute("tabindex");
	});
}
const qO = P({}, r1);
let hv = 0;
function PO(n, r = "mui") {
	const [o, i] = v.useState(n),
		l = n || o;
	return (
		v.useEffect(() => {
			o == null && ((hv += 1), i(`${r}-${hv}`));
		}, [o, r]),
		l
	);
}
const pv = qO.useId;
function yi(n, r) {
	if (pv !== void 0) {
		const o = pv();
		return n != null ? n : r ? `${r}-${o}` : o;
	}
	return PO(n, r);
}
function OS() {
	const n = new Map();
	return {
		emit(r, o) {
			var i;
			(i = n.get(r)) == null || i.forEach((l) => l(o));
		},
		on(r, o) {
			n.has(r) || n.set(r, new Set()), n.get(r).add(o);
		},
		off(r, o) {
			var i;
			(i = n.get(r)) == null || i.delete(o);
		},
	};
}
class wm {
	constructor() {
		jt(this, "nodesRef", { current: [] });
		jt(this, "events", OS());
	}
	addNode(r) {
		this.nodesRef.current.push(r);
	}
	removeNode(r) {
		const o = this.nodesRef.current.findIndex((i) => i === r);
		o !== -1 && this.nodesRef.current.splice(o, 1);
	}
}
const AS = v.createContext(null),
	MS = v.createContext(null),
	Wo = () => {
		var n;
		return ((n = v.useContext(AS)) == null ? void 0 : n.id) || null;
	},
	Ha = (n) => {
		const r = v.useContext(MS);
		return n != null ? n : r;
	};
function kS(n) {
	const r = yi(),
		o = Ha(n),
		i = Wo();
	return (
		$e(() => {
			if (!r) return;
			const l = { id: r, parentId: i };
			return (
				o == null || o.addNode(l),
				() => {
					o == null || o.removeNode(l);
				}
			);
		}, [o, r, i]),
		r
	);
}
function VO(n) {
	const { children: r, id: o } = n,
		i = Wo();
	return K.jsx(AS.Provider, {
		value: v.useMemo(() => ({ id: o, parentId: i }), [o, i]),
		children: r,
	});
}
function YO(n) {
	const { children: r, externalTree: o } = n,
		i = Hn(() => (o != null ? o : new wm())).current;
	return K.jsx(MS.Provider, { value: i, children: r });
}
function Em() {}
const Vp = Object.freeze([]),
	kn = Object.freeze({}),
	IO = 500,
	GO = 500,
	FO = { style: { transition: "none" } },
	XO = "data-base-ui-click-trigger",
	KO = { fallbackAxisSide: "none" },
	_S = { fallbackAxisSide: "end" },
	QO = { clipPath: "inset(50%)", position: "fixed", top: 0, left: 0 },
	Rm = "none",
	Es = "trigger-press",
	Gn = "trigger-hover",
	bs = "trigger-focus",
	Tm = "outside-press",
	DS = "item-press",
	ZO = "close-press",
	Rs = "focus-out",
	Ef = "escape-key",
	Kc = "list-navigation",
	JO = "cancel-open",
	Qc = "sibling-open",
	WO = "disabled",
	Cm = "imperative-action",
	ak = "window-resize";
function gt(n, r, o, i) {
	let l = !1,
		u = !1;
	const c = kn;
	return P(
		{
			reason: n,
			event: r != null ? r : new Event("base-ui"),
			cancel() {
				l = !0;
			},
			allowPropagation() {
				u = !0;
			},
			get isCanceled() {
				return l;
			},
			get isPropagationAllowed() {
				return u;
			},
			trigger: o,
		},
		c
	);
}
function Ts(n) {
	return `data-base-ui-${n}`;
}
function Zc(n, r, o) {
	if (o && !mi(o)) return 0;
	if (typeof n == "number") return n;
	if (typeof n == "function") {
		const i = n();
		return typeof i == "number" ? i : i == null ? void 0 : i[r];
	}
	return n == null ? void 0 : n[r];
}
const NS = v.createContext({
	hasProvider: !1,
	timeoutMs: 0,
	delayRef: { current: 0 },
	initialDelayRef: { current: 0 },
	timeout: new go(),
	currentIdRef: { current: null },
	currentContextRef: { current: null },
});
function $O(n) {
	const { children: r, delay: o, timeoutMs: i = 0 } = n,
		l = v.useRef(o),
		u = v.useRef(o),
		c = v.useRef(null),
		h = v.useRef(null),
		p = mr();
	return K.jsx(NS.Provider, {
		value: v.useMemo(
			() => ({
				hasProvider: !0,
				delayRef: l,
				initialDelayRef: u,
				currentIdRef: c,
				timeoutMs: i,
				currentContextRef: h,
				timeout: p,
			}),
			[i, p]
		),
		children: r,
	});
}
function e5(n, r = { open: !1 }) {
	const o = "rootStore" in n ? n.rootStore : n,
		i = o.useState("floatingId"),
		{ open: l } = r,
		u = v.useContext(NS),
		{
			currentIdRef: c,
			delayRef: h,
			timeoutMs: p,
			initialDelayRef: f,
			currentContextRef: y,
			hasProvider: g,
			timeout: S,
		} = u,
		[b, w] = v.useState(!1);
	return (
		$e(() => {
			function R() {
				var O;
				w(!1),
					(O = y.current) == null || O.setIsInstantPhase(!1),
					(c.current = null),
					(y.current = null),
					(h.current = f.current);
			}
			if (c.current && !l && c.current === i) {
				if ((w(!1), p)) {
					const O = i;
					return (
						S.start(p, () => {
							o.select("open") || (c.current && c.current !== O) || R();
						}),
						() => {
							S.clear();
						}
					);
				}
				R();
			}
		}, [l, i, c, h, p, f, y, S, o]),
		$e(() => {
			if (!l) return;
			const R = y.current,
				O = c.current;
			S.clear(),
				(y.current = { onOpenChange: o.setOpen, setIsInstantPhase: w }),
				(c.current = i),
				(h.current = { open: 0, close: Zc(f.current, "close") }),
				O !== null && O !== i
					? (w(!0),
					  R == null || R.setIsInstantPhase(!0),
					  R == null || R.onOpenChange(!1, gt(Rm)))
					: (w(!1), R == null || R.setIsInstantPhase(!1));
		}, [l, i, o, c, h, p, f, y, S]),
		$e(
			() => () => {
				y.current = null;
			},
			[y]
		),
		v.useMemo(() => ({ hasProvider: g, delayRef: h, isInstantPhase: b }), [g, h, b])
	);
}
function Cs(n, r, o, i) {
	const l = Hn(LS).current;
	return n5(l, n, r, o, i) && zS(l, [n, r, o, i]), l.callback;
}
function t5(n) {
	const r = Hn(LS).current;
	return r5(r, n) && zS(r, n), r.callback;
}
function LS() {
	return { callback: null, cleanup: null, refs: [] };
}
function n5(n, r, o, i, l) {
	return n.refs[0] !== r || n.refs[1] !== o || n.refs[2] !== i || n.refs[3] !== l;
}
function r5(n, r) {
	return n.refs.length !== r.length || n.refs.some((o, i) => o !== r[i]);
}
function zS(n, r) {
	if (((n.refs = r), r.every((o) => o == null))) {
		n.callback = null;
		return;
	}
	n.callback = (o) => {
		if ((n.cleanup && (n.cleanup(), (n.cleanup = null)), o != null)) {
			const i = Array(r.length).fill(null);
			for (let l = 0; l < r.length; l += 1) {
				const u = r[l];
				if (u != null)
					switch (typeof u) {
						case "function": {
							const c = u(o);
							typeof c == "function" && (i[l] = c);
							break;
						}
						case "object": {
							u.current = o;
							break;
						}
					}
			}
			n.cleanup = () => {
				for (let l = 0; l < r.length; l += 1) {
					const u = r[l];
					if (u != null)
						switch (typeof u) {
							case "function": {
								const c = i[l];
								typeof c == "function" ? c() : u(null);
								break;
							}
							case "object": {
								u.current = null;
								break;
							}
						}
				}
			};
		}
	};
}
const jS = {
		clipPath: "inset(50%)",
		overflow: "hidden",
		whiteSpace: "nowrap",
		border: 0,
		padding: 0,
		width: 1,
		height: 1,
		margin: -1,
	},
	BS = _e(P({}, jS), { position: "fixed", top: 0, left: 0 }),
	ik = _e(P({}, jS), { position: "absolute" }),
	_c = null;
class o5 {
	constructor() {
		jt(this, "callbacks", []);
		jt(this, "callbacksCount", 0);
		jt(this, "nextId", 1);
		jt(this, "startId", 1);
		jt(this, "isScheduled", !1);
		jt(this, "tick", (r) => {
			var l;
			this.isScheduled = !1;
			const o = this.callbacks,
				i = this.callbacksCount;
			if (
				((this.callbacks = []),
				(this.callbacksCount = 0),
				(this.startId = this.nextId),
				i > 0)
			)
				for (let u = 0; u < o.length; u += 1) (l = o[u]) == null || l.call(o, r);
		});
	}
	request(r) {
		const o = this.nextId;
		return (
			(this.nextId += 1),
			this.callbacks.push(r),
			(this.callbacksCount += 1),
			!this.isScheduled && (requestAnimationFrame(this.tick), (this.isScheduled = !0)),
			o
		);
	}
	cancel(r) {
		const o = r - this.startId;
		o < 0 ||
			o >= this.callbacks.length ||
			((this.callbacks[o] = null), (this.callbacksCount -= 1));
	}
}
const Dc = new o5();
class uo {
	constructor() {
		jt(this, "currentId", _c);
		jt(this, "cancel", () => {
			this.currentId !== _c && (Dc.cancel(this.currentId), (this.currentId = _c));
		});
		jt(this, "disposeEffect", () => this.cancel);
	}
	static create() {
		return new uo();
	}
	static request(r) {
		return Dc.request(r);
	}
	static cancel(r) {
		return Dc.cancel(r);
	}
	request(r) {
		this.cancel(),
			(this.currentId = Dc.request(() => {
				(this.currentId = _c), r();
			}));
	}
}
function Om() {
	const n = Hn(uo.create).current;
	return pm(n.disposeEffect), n;
}
const Os = v.forwardRef(function (r, o) {
	const [i, l] = v.useState();
	$e(() => {
		lS && l("button");
	}, []);
	const u = { tabIndex: 0, role: i };
	return K.jsx(
		"span",
		_e(P(_e(P({}, r), { ref: o, style: BS, "aria-hidden": i ? void 0 : !0 }), u), {
			"data-base-ui-focus-guard": "",
		})
	);
});
let mv = 0;
function Yl(n, r = {}) {
	const { preventScroll: o = !1, cancelPrevious: i = !0, sync: l = !1 } = r;
	i && cancelAnimationFrame(mv);
	const u = () => (n == null ? void 0 : n.focus({ preventScroll: o }));
	l ? u() : (mv = requestAnimationFrame(u));
}
const vs = { inert: new WeakMap(), "aria-hidden": new WeakMap(), none: new WeakMap() };
function gv(n) {
	return n === "inert" ? vs.inert : n === "aria-hidden" ? vs["aria-hidden"] : vs.none;
}
let Nc = new WeakSet(),
	Lc = {},
	tp = 0;
const US = (n) => n && (n.host || US(n.parentNode)),
	a5 = (n, r) =>
		r
			.map((o) => {
				if (n.contains(o)) return o;
				const i = US(o);
				return n.contains(i) ? i : null;
			})
			.filter((o) => o != null);
function i5(n, r, o, i) {
	const l = "data-base-ui-inert",
		u = i ? "inert" : o ? "aria-hidden" : null,
		c = a5(r, n),
		h = new Set(),
		p = new Set(c),
		f = [];
	Lc[l] || (Lc[l] = new WeakMap());
	const y = Lc[l];
	c.forEach(g), S(r), h.clear();
	function g(b) {
		!b || h.has(b) || (h.add(b), b.parentNode && g(b.parentNode));
	}
	function S(b) {
		!b ||
			p.has(b) ||
			[].forEach.call(b.children, (w) => {
				if (ja(w) !== "script")
					if (h.has(w)) S(w);
					else {
						const R = u ? w.getAttribute(u) : null,
							O = R !== null && R !== "false",
							T = gv(u),
							L = (T.get(w) || 0) + 1,
							M = (y.get(w) || 0) + 1;
						T.set(w, L),
							y.set(w, M),
							f.push(w),
							L === 1 && O && Nc.add(w),
							M === 1 && w.setAttribute(l, ""),
							!O && u && w.setAttribute(u, u === "inert" ? "" : "true");
					}
			});
	}
	return (
		(tp += 1),
		() => {
			f.forEach((b) => {
				const w = gv(u),
					O = (w.get(b) || 0) - 1,
					T = (y.get(b) || 0) - 1;
				w.set(b, O),
					y.set(b, T),
					O || (!Nc.has(b) && u && b.removeAttribute(u), Nc.delete(b)),
					T || b.removeAttribute(l);
			}),
				(tp -= 1),
				tp ||
					((vs.inert = new WeakMap()),
					(vs["aria-hidden"] = new WeakMap()),
					(vs.none = new WeakMap()),
					(Nc = new WeakSet()),
					(Lc = {}));
		}
	);
}
function s5(n, r = !1, o = !1) {
	const i = kt(n[0]).body;
	return i5(n.concat(Array.from(i.querySelectorAll("[aria-live]"))), i, r, o);
}
const l5 = parseInt(v.version, 10);
function Am(n) {
	return l5 >= n;
}
function yv(n) {
	var i;
	if (!v.isValidElement(n)) return null;
	const r = n,
		o = r.props;
	return (i = Am(19) ? (o == null ? void 0 : o.ref) : r.ref) != null ? i : null;
}
function Yp(n, r) {
	if (n && !r) return n;
	if (!n && r) return r;
	if (n || r) return P(P({}, n), r);
}
function u5(n, r) {
	const o = {};
	for (const i in n) {
		const l = n[i];
		if (r != null && r.hasOwnProperty(i)) {
			const u = r[i](l);
			u != null && Object.assign(o, u);
			continue;
		}
		l === !0
			? (o[`data-${i.toLowerCase()}`] = "")
			: l && (o[`data-${i.toLowerCase()}`] = l.toString());
	}
	return o;
}
function c5(n, r) {
	return typeof n == "function" ? n(r) : n;
}
function f5(n, r) {
	return typeof n == "function" ? n(r) : n;
}
const Il = {};
function As(n, r, o, i, l) {
	let u = P({}, Ip(n, Il));
	return r && (u = ql(u, r)), o && (u = ql(u, o)), i && (u = ql(u, i)), l && (u = ql(u, l)), u;
}
function d5(n) {
	if (n.length === 0) return Il;
	if (n.length === 1) return Ip(n[0], Il);
	let r = P({}, Ip(n[0], Il));
	for (let o = 1; o < n.length; o += 1) r = ql(r, n[o]);
	return r;
}
function ql(n, r) {
	return HS(r) ? r(n) : h5(n, r);
}
function h5(n, r) {
	if (!r) return n;
	for (const o in r) {
		const i = r[o];
		switch (o) {
			case "style": {
				n[o] = Yp(n.style, i);
				break;
			}
			case "className": {
				n[o] = qS(n.className, i);
				break;
			}
			default:
				p5(o, i) ? (n[o] = m5(n[o], i)) : (n[o] = i);
		}
	}
	return n;
}
function p5(n, r) {
	const o = n.charCodeAt(0),
		i = n.charCodeAt(1),
		l = n.charCodeAt(2);
	return (
		o === 111 &&
		i === 110 &&
		l >= 65 &&
		l <= 90 &&
		(typeof r == "function" || typeof r == "undefined")
	);
}
function HS(n) {
	return typeof n == "function";
}
function Ip(n, r) {
	return HS(n) ? n(r) : n != null ? n : Il;
}
function m5(n, r) {
	return r
		? n
			? (o) => {
					if (g5(o)) {
						const l = o;
						Gp(l);
						const u = r(l);
						return l.baseUIHandlerPrevented || n == null || n(l), u;
					}
					const i = r(o);
					return n == null || n(o), i;
			  }
			: r
		: n;
}
function Gp(n) {
	return (
		(n.preventBaseUIHandler = () => {
			n.baseUIHandlerPrevented = !0;
		}),
		n
	);
}
function qS(n, r) {
	return r ? (n ? r + " " + n : r) : n;
}
function g5(n) {
	return n != null && typeof n == "object" && "nativeEvent" in n;
}
function fn(n, r, o = {}) {
	var c;
	const i = r.render,
		l = y5(r, o);
	if (o.enabled === !1) return null;
	const u = (c = o.state) != null ? c : kn;
	return v5(n, i, l, u);
}
function y5(n, r = {}) {
	var w;
	const { className: o, style: i, render: l } = n,
		{ state: u = kn, ref: c, props: h, stateAttributesMapping: p, enabled: f = !0 } = r,
		y = f ? c5(o, u) : void 0,
		g = f ? f5(i, u) : void 0,
		S = f ? u5(u, p) : kn,
		b = f && (w = Yp(S, Array.isArray(h) ? d5(h) : h)) != null ? w : kn;
	return (
		typeof document != "undefined" &&
			(f
				? Array.isArray(c)
					? (b.ref = t5([b.ref, yv(l), ...c]))
					: (b.ref = Cs(b.ref, yv(l), c))
				: Cs(null, null)),
		f
			? (y !== void 0 && (b.className = qS(b.className, y)),
			  g !== void 0 && (b.style = Yp(b.style, g)),
			  b)
			: kn
	);
}
const b5 = Symbol.for("react.lazy");
function v5(n, r, o, i) {
	if (r) {
		if (typeof r == "function") return r(o, i);
		const l = As(o, r.props);
		l.ref = o.ref;
		let u = r;
		return (
			(u == null ? void 0 : u.$$typeof) === b5 && (u = v.Children.toArray(r)[0]),
			v.cloneElement(u, l)
		);
	}
	if (n && typeof n == "string") return S5(n, o);
	throw new Error(Xn(8));
}
function S5(n, r) {
	return n === "button"
		? v.createElement("button", _e(P({ type: "button" }, r), { key: r.key }))
		: n === "img"
		? v.createElement("img", _e(P({ alt: "" }, r), { key: r.key }))
		: v.createElement(n, r);
}
const PS = v.createContext(null),
	VS = () => v.useContext(PS),
	x5 = Ts("portal");
function YS(n = {}) {
	const { ref: r, container: o, componentProps: i = kn, elementProps: l } = n,
		u = yi(),
		c = VS(),
		h = c == null ? void 0 : c.portalNode,
		[p, f] = v.useState(null),
		[y, g] = v.useState(null),
		S = Ke((O) => {
			O !== null && g(O);
		}),
		b = v.useRef(null);
	$e(() => {
		var T, L;
		if (o === null) {
			b.current && ((b.current = null), g(null), f(null));
			return;
		}
		if (u == null) return;
		const O =
			(L = (T = o && (mm(o) ? o : o.current)) != null ? T : h) != null ? L : document.body;
		if (O == null) {
			b.current && ((b.current = null), g(null), f(null));
			return;
		}
		b.current !== O && ((b.current = O), g(null), f(O));
	}, [o, h, u]);
	const w = fn("div", i, { ref: [r, S], props: [{ id: u, [x5]: "" }, l] });
	return { portalNode: y, portalSubtree: p && w ? mo.createPortal(w, p) : null };
}
const IS = v.forwardRef(function (r, o) {
	const N = r,
		{ children: i, container: l, className: u, render: c, renderGuards: h } = N,
		p = Be(N, ["children", "container", "className", "render", "renderGuards"]),
		{ portalNode: f, portalSubtree: y } = YS({
			container: l,
			ref: o,
			componentProps: r,
			elementProps: p,
		}),
		g = v.useRef(null),
		S = v.useRef(null),
		b = v.useRef(null),
		w = v.useRef(null),
		[R, O] = v.useState(null),
		T = R == null ? void 0 : R.modal,
		L = R == null ? void 0 : R.open,
		M = typeof h == "boolean" ? h : !!R && !R.modal && R.open && !!f;
	v.useEffect(() => {
		if (!f || T) return;
		function D(H) {
			f && H.relatedTarget && ys(H) && (H.type === "focusin" ? dv : HO)(f);
		}
		return (
			f.addEventListener("focusin", D, !0),
			f.addEventListener("focusout", D, !0),
			() => {
				f.removeEventListener("focusin", D, !0), f.removeEventListener("focusout", D, !0);
			}
		);
	}, [f, T]),
		v.useEffect(() => {
			!f || L || dv(f);
		}, [L, f]);
	const _ = v.useMemo(
		() => ({
			beforeOutsideRef: g,
			afterOutsideRef: S,
			beforeInsideRef: b,
			afterInsideRef: w,
			portalNode: f,
			setFocusManagerState: O,
		}),
		[f]
	);
	return K.jsxs(v.Fragment, {
		children: [
			y,
			K.jsxs(PS.Provider, {
				value: _,
				children: [
					M &&
						f &&
						K.jsx(Os, {
							"data-type": "outside",
							ref: g,
							onFocus: (D) => {
								var H;
								if (ys(D, f)) (H = b.current) == null || H.focus();
								else {
									const U = R ? R.domReference : null,
										fe = TS(U);
									fe == null || fe.focus();
								}
							},
						}),
					M && f && K.jsx("span", { "aria-owns": f.id, style: QO }),
					f && mo.createPortal(i, f),
					M &&
						f &&
						K.jsx(Os, {
							"data-type": "outside",
							ref: S,
							onFocus: (D) => {
								var H;
								if (ys(D, f)) (H = w.current) == null || H.focus();
								else {
									const U = R ? R.domReference : null,
										fe = xm(U);
									fe == null || fe.focus(),
										R != null &&
											R.closeOnFocusOut &&
											(R == null ||
												R.onOpenChange(!1, gt(Rs, D.nativeEvent)));
								}
							},
						}),
				],
			}),
		],
	});
});
function Go(n) {
	return n == null ? n : "current" in n ? n.current : n;
}
function w5(n, r) {
	const o = Sn(n.target);
	return n instanceof o.KeyboardEvent
		? "keyboard"
		: n instanceof o.FocusEvent
		? r || "keyboard"
		: "pointerType" in n
		? n.pointerType || "keyboard"
		: "touches" in n
		? "touch"
		: n instanceof o.MouseEvent
		? r || (n.detail === 0 ? "keyboard" : "mouse")
		: "";
}
const bv = 20;
let Da = [];
function Mm() {
	Da = Da.filter((n) => {
		var r;
		return (r = n.deref()) == null ? void 0 : r.isConnected;
	});
}
function E5(n) {
	Mm(),
		n && ja(n) !== "body" && (Da.push(new WeakRef(n)), Da.length > bv && (Da = Da.slice(-bv)));
}
function np() {
	var n;
	return Mm(), (n = Da[Da.length - 1]) == null ? void 0 : n.deref();
}
function R5(n) {
	if (!n) return null;
	const r = zs();
	return ES(n, r) ? n : eu(n, r)[0] || n;
}
function T5(n) {
	return !n || !n.isConnected
		? !1
		: typeof n.checkVisibility == "function"
		? n.checkVisibility()
		: gr(n).display !== "none";
}
function vv(n, r) {
	var c;
	if (
		!r.current.includes("floating") &&
		!((c = n.getAttribute("role")) != null && c.includes("dialog"))
	)
		return;
	const o = zs(),
		l = jO(n, o).filter((h) => {
			const p = h.getAttribute("data-tabindex") || "";
			return ES(h, o) || (h.hasAttribute("data-tabindex") && !p.startsWith("-"));
		}),
		u = n.getAttribute("tabindex");
	r.current.includes("floating") || l.length === 0
		? u !== "0" && n.setAttribute("tabindex", "0")
		: (u !== "-1" ||
				(n.hasAttribute("data-tabindex") && n.getAttribute("data-tabindex") !== "-1")) &&
		  (n.setAttribute("tabindex", "-1"), n.setAttribute("data-tabindex", "-1"));
}
function GS(n) {
	const {
			context: r,
			children: o,
			disabled: i = !1,
			initialFocus: l = !0,
			returnFocus: u = !0,
			restoreFocus: c = !1,
			modal: h = !0,
			closeOnFocusOut: p = !0,
			openInteractionType: f = "",
			nextFocusableElement: y,
			previousFocusableElement: g,
			beforeContentFocusGuardRef: S,
			externalTree: b,
		} = n,
		w = "rootStore" in r ? r.rootStore : r,
		R = w.useState("open"),
		O = w.useState("domReferenceElement"),
		T = w.useState("floatingElement"),
		{ events: L, dataRef: M } = w.context,
		_ = Ke(() => {
			var ce;
			return (ce = M.current.floatingContext) == null ? void 0 : ce.nodeId;
		}),
		N = l === !1,
		D = Bp(O) && N,
		H = v.useRef(["content"]),
		U = Fn(l),
		fe = Fn(u),
		we = Fn(f),
		se = Ha(b),
		Y = VS(),
		oe = v.useRef(null),
		xe = v.useRef(null),
		ge = v.useRef(!1),
		j = v.useRef(!1),
		I = v.useRef(!1),
		F = v.useRef(-1),
		pe = v.useRef(""),
		J = v.useRef(""),
		B = v.useRef(null),
		Z = v.useRef(null),
		ee = Cs(B, S, Y == null ? void 0 : Y.beforeInsideRef),
		ie = Cs(Z, Y == null ? void 0 : Y.afterInsideRef),
		me = mr(),
		ve = mr(),
		ke = Om(),
		je = Y != null,
		Ee = nf(T),
		Qe = Ke((ce = Ee) => (ce ? eu(ce, zs()) : [])),
		it = Ke((ce) => {
			const de = Qe(ce);
			return H.current
				.map(() => de)
				.filter(Boolean)
				.flat();
		});
	v.useEffect(() => {
		if (i || !h) return;
		function ce(Te) {
			Te.key === "Tab" && ft(Ee, Qr(kt(Ee))) && Qe().length === 0 && !D && Un(Te);
		}
		const de = kt(Ee);
		return (
			de.addEventListener("keydown", ce),
			() => {
				de.removeEventListener("keydown", ce);
			}
		);
	}, [i, O, Ee, h, H, D, Qe, it]),
		v.useEffect(() => {
			if (i || !R) return;
			const ce = kt(Ee);
			function de() {
				I.current = !1;
			}
			function Te(ze) {
				const Ce = In(ze),
					le = ft(T, Ce) || ft(O, Ce) || ft(Y == null ? void 0 : Y.portalNode, Ce);
				(I.current = !le),
					(J.current = ze.pointerType || "keyboard"),
					Ce != null && Ce.closest(`[${XO}]`) && (j.current = !0);
			}
			function Re() {
				J.current = "keyboard";
			}
			return (
				ce.addEventListener("pointerdown", Te, !0),
				ce.addEventListener("pointerup", de, !0),
				ce.addEventListener("pointercancel", de, !0),
				ce.addEventListener("keydown", Re, !0),
				() => {
					ce.removeEventListener("pointerdown", Te, !0),
						ce.removeEventListener("pointerup", de, !0),
						ce.removeEventListener("pointercancel", de, !0),
						ce.removeEventListener("keydown", Re, !0);
				}
			);
		}, [i, T, O, Ee, R, Y]),
		v.useEffect(() => {
			if (i || !p) return;
			const ce = kt(Ee);
			function de() {
				(j.current = !0),
					ve.start(0, () => {
						j.current = !1;
					});
			}
			function Te(Ae) {
				const Se = In(Ae),
					Ye = Qe().indexOf(Se);
				Ye !== -1 && (F.current = Ye);
			}
			function Re(Ae) {
				const Se = Ae.relatedTarget,
					Ue = Ae.currentTarget,
					Ye = In(Ae);
				queueMicrotask(() => {
					const qe = _(),
						X = w.context.triggerElements,
						Pe =
							(Se == null ? void 0 : Se.hasAttribute(Ts("focus-guard"))) &&
							[
								B.current,
								Z.current,
								Y == null ? void 0 : Y.beforeInsideRef.current,
								Y == null ? void 0 : Y.afterInsideRef.current,
								Y == null ? void 0 : Y.beforeOutsideRef.current,
								Y == null ? void 0 : Y.afterOutsideRef.current,
								Go(g),
								Go(y),
							].includes(Se),
						Jt = !(
							ft(O, Se) ||
							ft(T, Se) ||
							ft(Se, T) ||
							ft(Y == null ? void 0 : Y.portalNode, Se) ||
							(Se != null && X.hasElement(Se)) ||
							X.hasMatchingElement((st) => ft(st, Se)) ||
							Pe ||
							(se &&
								(pi(se.nodesRef.current, qe).find((st) => {
									var Mt, wt;
									return (
										ft(
											(Mt = st.context) == null
												? void 0
												: Mt.elements.floating,
											Se
										) ||
										ft(
											(wt = st.context) == null
												? void 0
												: wt.elements.domReference,
											Se
										)
									);
								}) ||
									sv(se.nodesRef.current, qe).find((st) => {
										var Mt, wt, dn;
										return (
											[
												(Mt = st.context) == null
													? void 0
													: Mt.elements.floating,
												nf(
													(wt = st.context) == null
														? void 0
														: wt.elements.floating
												),
											].includes(Se) ||
											((dn = st.context) == null
												? void 0
												: dn.elements.domReference) === Se
										);
									})))
						);
					if (
						(Ue === O && Ee && vv(Ee, H),
						c && Ue !== O && !T5(Ye) && Qr(ce) === ce.body)
					) {
						if (nn(Ee) && (Ee.focus(), c === "popup")) {
							ke.request(() => {
								Ee.focus();
							});
							return;
						}
						const st = F.current,
							Mt = Qe(),
							wt = Mt[st] || Mt[Mt.length - 1] || Ee;
						nn(wt) && wt.focus();
					}
					if (M.current.insideReactTree) {
						M.current.insideReactTree = !1;
						return;
					}
					(D || !h) &&
						Se &&
						Jt &&
						!j.current &&
						(D || Se !== np()) &&
						((ge.current = !0), w.setOpen(!1, gt(Rs, Ae)));
				});
			}
			function ze() {
				I.current ||
					((M.current.insideReactTree = !0),
					me.start(0, () => {
						M.current.insideReactTree = !1;
					}));
			}
			const Ce = nn(O) ? O : null,
				le = [];
			if (!(!T && !Ce))
				return (
					Ce &&
						(Ce.addEventListener("focusout", Re),
						Ce.addEventListener("pointerdown", de),
						le.push(() => {
							Ce.removeEventListener("focusout", Re),
								Ce.removeEventListener("pointerdown", de);
						})),
					T &&
						(T.addEventListener("focusin", Te),
						T.addEventListener("focusout", Re),
						Y &&
							(T.addEventListener("focusout", ze, !0),
							le.push(() => {
								T.removeEventListener("focusout", ze, !0);
							})),
						le.push(() => {
							T.removeEventListener("focusin", Te),
								T.removeEventListener("focusout", Re);
						})),
					() => {
						le.forEach((Ae) => {
							Ae();
						});
					}
				);
		}, [i, O, T, Ee, h, se, Y, w, p, c, Qe, D, _, H, M, me, ve, ke, y, g]),
		v.useEffect(() => {
			var ze, Ce, le;
			if (i || !T || !R) return;
			const ce = Array.from(
					((ze = Y == null ? void 0 : Y.portalNode) == null
						? void 0
						: ze.querySelectorAll(`[${Ts("portal")}]`)) || []
				),
				Te =
					(le =
						(Ce = (se ? sv(se.nodesRef.current, _()) : []).find((Ae) => {
							var Se;
							return Bp(
								((Se = Ae.context) == null ? void 0 : Se.elements.domReference) ||
									null
							);
						})) == null
							? void 0
							: Ce.context) == null
						? void 0
						: le.elements.domReference,
				Re = [
					T,
					Te,
					...ce,
					oe.current,
					xe.current,
					B.current,
					Z.current,
					Y == null ? void 0 : Y.beforeOutsideRef.current,
					Y == null ? void 0 : Y.afterOutsideRef.current,
					Go(g),
					Go(y),
					D ? O : null,
				].filter((Ae) => Ae != null);
			return s5(Re, h || D);
		}, [R, i, O, T, h, H, Y, D, se, _, y, g]),
		$e(() => {
			if (!R || i || !nn(Ee)) return;
			const ce = kt(Ee),
				de = Qr(ce);
			queueMicrotask(() => {
				const Te = it(Ee),
					Re = U.current,
					ze = typeof Re == "function" ? Re(we.current || "") : Re;
				if (ze === void 0 || ze === !1) return;
				let Ce;
				ze === !0 || ze === null ? (Ce = Te[0] || Ee) : (Ce = Go(ze)),
					(Ce = Ce || Te[0] || Ee),
					!ft(Ee, de) && Yl(Ce, { preventScroll: Ce === Ee });
			});
		}, [i, R, Ee, N, it, U, we]),
		$e(() => {
			if (i || !Ee) return;
			const ce = kt(Ee),
				de = Qr(ce);
			E5(de);
			function Te(Ce) {
				if (
					(Ce.open || (pe.current = w5(Ce.nativeEvent, J.current)),
					Ce.reason === Gn && Ce.nativeEvent.type === "mouseleave" && (ge.current = !0),
					Ce.reason === Tm)
				)
					if (Ce.nested) ge.current = !1;
					else if (hS(Ce.nativeEvent) || pS(Ce.nativeEvent)) ge.current = !1;
					else {
						let le = !1;
						document.createElement("div").focus({
							get preventScroll() {
								return (le = !0), !1;
							},
						}),
							le ? (ge.current = !1) : (ge.current = !0);
					}
			}
			L.on("openchange", Te);
			const Re = ce.createElement("span");
			Re.setAttribute("tabindex", "-1"),
				Re.setAttribute("aria-hidden", "true"),
				Object.assign(Re.style, BS),
				je && O && O.insertAdjacentElement("afterend", Re);
			function ze() {
				const Ce = fe.current;
				let le = typeof Ce == "function" ? Ce(pe.current) : Ce;
				if (le === void 0 || le === !1) return null;
				if ((le === null && (le = !0), typeof le == "boolean")) {
					const Se = O || np();
					return Se && Se.isConnected ? Se : Re;
				}
				const Ae = O || np() || Re;
				return Go(le) || Ae;
			}
			return () => {
				L.off("openchange", Te);
				const Ce = Qr(ce),
					le =
						ft(T, Ce) ||
						(se &&
							pi(se.nodesRef.current, _(), !1).some((Se) => {
								var Ue;
								return ft(
									(Ue = Se.context) == null ? void 0 : Ue.elements.floating,
									Ce
								);
							})),
					Ae = ze();
				queueMicrotask(() => {
					const Se = R5(Ae),
						Ue = typeof fe.current != "boolean";
					fe.current &&
						!ge.current &&
						nn(Se) &&
						(!(!Ue && Se !== Ce && Ce !== ce.body) || le) &&
						Se.focus({ preventScroll: !0 }),
						Re.remove(),
						(ge.current = !1);
				});
			};
		}, [i, T, Ee, fe, M, L, se, je, O, _]),
		$e(() => {
			if (!iS || R || !T) return;
			const ce = Qr(kt(T));
			!nn(ce) || !wf(ce) || (ft(T, ce) && ce.blur());
		}, [R, T]),
		$e(() => {
			if (!(i || !Y))
				return (
					Y.setFocusManagerState({
						modal: h,
						closeOnFocusOut: p,
						open: R,
						onOpenChange: w.setOpen,
						domReference: O,
					}),
					() => {
						Y.setFocusManagerState(null);
					}
				);
		}, [i, Y, h, R, w, p, O]),
		$e(() => {
			if (!(i || !Ee))
				return (
					vv(Ee, H),
					() => {
						queueMicrotask(Mm);
					}
				);
		}, [i, Ee, H]);
	const re = !i && (h ? !D : !0) && (je || h);
	return K.jsxs(v.Fragment, {
		children: [
			re &&
				K.jsx(Os, {
					"data-type": "inside",
					ref: ee,
					onFocus: (ce) => {
						var de;
						if (h) {
							const Te = it();
							Yl(Te[Te.length - 1]);
						} else if (Y != null && Y.portalNode)
							if (((ge.current = !1), ys(ce, Y.portalNode))) {
								const Te = xm(O);
								Te == null || Te.focus();
							} else
								(de = Go(g != null ? g : Y.beforeOutsideRef)) == null ||
									de.focus();
					},
				}),
			o,
			re &&
				K.jsx(Os, {
					"data-type": "inside",
					ref: ie,
					onFocus: (ce) => {
						var de;
						if (h) Yl(it()[0]);
						else if (Y != null && Y.portalNode)
							if ((p && (ge.current = !0), ys(ce, Y.portalNode))) {
								const Te = TS(O);
								Te == null || Te.focus();
							} else
								(de = Go(y != null ? y : Y.afterOutsideRef)) == null || de.focus();
					},
				}),
		],
	});
}
function C5(n, r = {}) {
	const o = "rootStore" in n ? n.rootStore : n,
		i = o.context.dataRef,
		{
			enabled: l = !0,
			event: u = "click",
			toggle: c = !0,
			ignoreMouse: h = !1,
			stickIfOpen: p = !0,
			touchOpenDelay: f = 0,
			reason: y = Es,
		} = r,
		g = v.useRef(void 0),
		S = Om(),
		b = mr(),
		w = v.useMemo(
			() => ({
				onPointerDown(R) {
					g.current = R.pointerType;
				},
				onMouseDown(R) {
					const O = g.current,
						T = R.nativeEvent,
						L = o.select("open");
					if (R.button !== 0 || u === "click" || (mi(O, !0) && h)) return;
					const M = i.current.openEvent,
						_ = M == null ? void 0 : M.type,
						N = o.select("domReferenceElement") !== R.currentTarget,
						D =
							(L && N) ||
							!(L && c && (!(M && p) || _ === "click" || _ === "mousedown"));
					if (wf(T.target)) {
						const U = gt(y, T, T.target);
						D && O === "touch" && f > 0
							? b.start(f, () => {
									o.setOpen(!0, U);
							  })
							: o.setOpen(D, U);
						return;
					}
					const H = R.currentTarget;
					S.request(() => {
						const U = gt(y, T, H);
						D && O === "touch" && f > 0
							? b.start(f, () => {
									o.setOpen(!0, U);
							  })
							: o.setOpen(D, U);
					});
				},
				onClick(R) {
					if (u === "mousedown-only") return;
					const O = g.current;
					if (u === "mousedown" && O) {
						g.current = void 0;
						return;
					}
					if (mi(O, !0) && h) return;
					const T = o.select("open"),
						L = i.current.openEvent,
						M = o.select("domReferenceElement") !== R.currentTarget,
						_ = (T && M) || !(T && c && (!(L && p) || mS(L))),
						N = gt(y, R.nativeEvent, R.currentTarget);
					_ && O === "touch" && f > 0
						? b.start(f, () => {
								o.setOpen(!0, N);
						  })
						: o.setOpen(_, N);
				},
				onKeyDown() {
					g.current = void 0;
				},
			}),
			[i, u, h, o, p, c, S, b, f, y]
		);
	return v.useMemo(() => (l ? { reference: w } : kn), [l, w]);
}
function O5(n, r) {
	let o = null,
		i = null,
		l = !1;
	return {
		contextElement: n || void 0,
		getBoundingClientRect() {
			var b;
			const u = (n == null ? void 0 : n.getBoundingClientRect()) || {
					width: 0,
					height: 0,
					x: 0,
					y: 0,
				},
				c = r.axis === "x" || r.axis === "both",
				h = r.axis === "y" || r.axis === "both",
				p =
					["mouseenter", "mousemove"].includes(
						((b = r.dataRef.current.openEvent) == null ? void 0 : b.type) || ""
					) && r.pointerType !== "touch";
			let f = u.width,
				y = u.height,
				g = u.x,
				S = u.y;
			return (
				o == null && r.x && c && (o = u.x - r.x),
				i == null && r.y && h && (i = u.y - r.y),
				(g -= o || 0),
				(S -= i || 0),
				(f = 0),
				(y = 0),
				!l || p
					? ((f = r.axis === "y" ? u.width : 0),
					  (y = r.axis === "x" ? u.height : 0),
					  (g = c && r.x != null ? r.x : g),
					  (S = h && r.y != null ? r.y : S))
					: l &&
					  !p &&
					  ((y = r.axis === "x" ? u.height : y), (f = r.axis === "y" ? u.width : f)),
				(l = !0),
				{ width: f, height: y, x: g, y: S, top: S, right: g + f, bottom: S + y, left: g }
			);
		},
	};
}
function Sv(n) {
	return n != null && n.clientX != null;
}
function A5(n, r = {}) {
	const o = "rootStore" in n ? n.rootStore : n,
		i = o.useState("open"),
		l = o.useState("floatingElement"),
		u = o.useState("domReferenceElement"),
		c = o.context.dataRef,
		{ enabled: h = !0, axis: p = "both" } = r,
		f = v.useRef(!1),
		y = v.useRef(null),
		[g, S] = v.useState(),
		[b, w] = v.useState([]),
		R = Ke((_, N, D) => {
			f.current ||
				(c.current.openEvent && !Sv(c.current.openEvent)) ||
				o.set(
					"positionReference",
					O5(D != null ? D : u, { x: _, y: N, axis: p, dataRef: c, pointerType: g })
				);
		}),
		O = Ke((_) => {
			i ? y.current || w([]) : R(_.clientX, _.clientY, _.currentTarget);
		}),
		T = mi(g) ? l : i,
		L = v.useCallback(() => {
			if (!T || !h) return;
			const _ = Sn(l);
			function N(D) {
				const H = In(D);
				ft(l, H)
					? (_.removeEventListener("mousemove", N), (y.current = null))
					: R(D.clientX, D.clientY);
			}
			if (!c.current.openEvent || Sv(c.current.openEvent)) {
				_.addEventListener("mousemove", N);
				const D = () => {
					_.removeEventListener("mousemove", N), (y.current = null);
				};
				return (y.current = D), D;
			}
			o.set("positionReference", u);
		}, [T, h, l, c, u, o, R]);
	v.useEffect(() => L(), [L, b]),
		v.useEffect(() => {
			h && !l && (f.current = !1);
		}, [h, l]),
		v.useEffect(() => {
			!h && i && (f.current = !0);
		}, [h, i]);
	const M = v.useMemo(() => {
		function _(N) {
			S(N.pointerType);
		}
		return { onPointerDown: _, onPointerEnter: _, onMouseMove: O, onMouseEnter: O };
	}, [O]);
	return v.useMemo(() => (h ? { reference: M, trigger: M } : {}), [h, M]);
}
function xv(n, r, o) {
	let { reference: i, floating: l } = n;
	const u = zr(r),
		c = Sm(r),
		h = vm(c),
		p = rr(r),
		f = u === "y",
		y = i.x + i.width / 2 - l.width / 2,
		g = i.y + i.height / 2 - l.height / 2,
		S = i[h] / 2 - l[h] / 2;
	let b;
	switch (p) {
		case "top":
			b = { x: y, y: i.y - l.height };
			break;
		case "bottom":
			b = { x: y, y: i.y + i.height };
			break;
		case "right":
			b = { x: i.x + i.width, y: g };
			break;
		case "left":
			b = { x: i.x - l.width, y: g };
			break;
		default:
			b = { x: i.x, y: i.y };
	}
	switch (Ua(r)) {
		case "start":
			b[c] -= S * (o && f ? -1 : 1);
			break;
		case "end":
			b[c] += S * (o && f ? -1 : 1);
			break;
	}
	return b;
}
function M5(n, r) {
	return Et(this, null, function* () {
		var o;
		r === void 0 && (r = {});
		const { x: i, y: l, platform: u, rects: c, elements: h, strategy: p } = n,
			{
				boundary: f = "clippingAncestors",
				rootBoundary: y = "viewport",
				elementContext: g = "floating",
				altBoundary: S = !1,
				padding: b = 0,
			} = Zo(r, n),
			w = gS(b),
			O = h[S ? (g === "floating" ? "reference" : "floating") : g],
			T = af(
				yield u.getClippingRect({
					element:
						(o = yield u.isElement == null ? void 0 : u.isElement(O)) == null || o
							? O
							: O.contextElement ||
							  (yield u.getDocumentElement == null
									? void 0
									: u.getDocumentElement(h.floating)),
					boundary: f,
					rootBoundary: y,
					strategy: p,
				})
			),
			L =
				g === "floating"
					? { x: i, y: l, width: c.floating.width, height: c.floating.height }
					: c.reference,
			M = yield u.getOffsetParent == null ? void 0 : u.getOffsetParent(h.floating),
			_ = (yield u.isElement == null ? void 0 : u.isElement(M))
				? (yield u.getScale == null ? void 0 : u.getScale(M)) || { x: 1, y: 1 }
				: { x: 1, y: 1 },
			N = af(
				u.convertOffsetParentRelativeRectToViewportRelativeRect
					? yield u.convertOffsetParentRelativeRectToViewportRelativeRect({
							elements: h,
							rect: L,
							offsetParent: M,
							strategy: p,
					  })
					: L
			);
		return {
			top: (T.top - N.top + w.top) / _.y,
			bottom: (N.bottom - T.bottom + w.bottom) / _.y,
			left: (T.left - N.left + w.left) / _.x,
			right: (N.right - T.right + w.right) / _.x,
		};
	});
}
const k5 = (n, r, o) =>
		Et(null, null, function* () {
			const {
					placement: i = "bottom",
					strategy: l = "absolute",
					middleware: u = [],
					platform: c,
				} = o,
				h = u.filter(Boolean),
				p = yield c.isRTL == null ? void 0 : c.isRTL(r);
			let f = yield c.getElementRects({ reference: n, floating: r, strategy: l }),
				{ x: y, y: g } = xv(f, i, p),
				S = i,
				b = {},
				w = 0;
			for (let O = 0; O < h.length; O++) {
				var R;
				const { name: T, fn: L } = h[O],
					{
						x: M,
						y: _,
						data: N,
						reset: D,
					} = yield L({
						x: y,
						y: g,
						initialPlacement: i,
						placement: S,
						strategy: l,
						middlewareData: b,
						rects: f,
						platform: _e(P({}, c), {
							detectOverflow: (R = c.detectOverflow) != null ? R : M5,
						}),
						elements: { reference: n, floating: r },
					});
				(y = M != null ? M : y),
					(g = _ != null ? _ : g),
					(b = _e(P({}, b), { [T]: P(P({}, b[T]), N) })),
					D &&
						w <= 50 &&
						(w++,
						typeof D == "object" &&
							(D.placement && (S = D.placement),
							D.rects &&
								(f =
									D.rects === !0
										? yield c.getElementRects({
												reference: n,
												floating: r,
												strategy: l,
										  })
										: D.rects),
							({ x: y, y: g } = xv(f, S, p))),
						(O = -1));
			}
			return { x: y, y: g, placement: S, strategy: l, middlewareData: b };
		}),
	_5 = function (n) {
		return (
			n === void 0 && (n = {}),
			{
				name: "flip",
				options: n,
				fn(o) {
					return Et(this, null, function* () {
						var i, l;
						const {
								placement: u,
								middlewareData: c,
								rects: h,
								initialPlacement: p,
								platform: f,
								elements: y,
							} = o,
							ge = Zo(n, o),
							{
								mainAxis: g = !0,
								crossAxis: S = !0,
								fallbackPlacements: b,
								fallbackStrategy: w = "bestFit",
								fallbackAxisSideDirection: R = "none",
								flipAlignment: O = !0,
							} = ge,
							T = Be(ge, [
								"mainAxis",
								"crossAxis",
								"fallbackPlacements",
								"fallbackStrategy",
								"fallbackAxisSideDirection",
								"flipAlignment",
							]);
						if ((i = c.arrow) != null && i.alignmentOffset) return {};
						const L = rr(u),
							M = zr(p),
							_ = rr(p) === p,
							N = yield f.isRTL == null ? void 0 : f.isRTL(y.floating),
							D = b || (_ || !O ? [of(p)] : dO(p)),
							H = R !== "none";
						!b && H && D.push(...gO(p, O, R, N));
						const U = [p, ...D],
							fe = yield f.detectOverflow(o, T),
							we = [];
						let se = ((l = c.flip) == null ? void 0 : l.overflows) || [];
						if ((g && we.push(fe[L]), S)) {
							const j = fO(u, h, N);
							we.push(fe[j[0]], fe[j[1]]);
						}
						if (
							((se = [...se, { placement: u, overflows: we }]),
							!we.every((j) => j <= 0))
						) {
							var Y, oe;
							const j = (((Y = c.flip) == null ? void 0 : Y.index) || 0) + 1,
								I = U[j];
							if (
								I &&
								(!(S === "alignment" ? M !== zr(I) : !1) ||
									se.every((J) =>
										zr(J.placement) === M ? J.overflows[0] > 0 : !0
									))
							)
								return {
									data: { index: j, overflows: se },
									reset: { placement: I },
								};
							let F =
								(oe = se
									.filter((pe) => pe.overflows[0] <= 0)
									.sort((pe, J) => pe.overflows[1] - J.overflows[1])[0]) == null
									? void 0
									: oe.placement;
							if (!F)
								switch (w) {
									case "bestFit": {
										var xe;
										const pe =
											(xe = se
												.filter((J) => {
													if (H) {
														const B = zr(J.placement);
														return B === M || B === "y";
													}
													return !0;
												})
												.map((J) => [
													J.placement,
													J.overflows
														.filter((B) => B > 0)
														.reduce((B, Z) => B + Z, 0),
												])
												.sort((J, B) => J[1] - B[1])[0]) == null
												? void 0
												: xe[0];
										pe && (F = pe);
										break;
									}
									case "initialPlacement":
										F = p;
										break;
								}
							if (u !== F) return { reset: { placement: F } };
						}
						return {};
					});
				},
			}
		);
	};
function wv(n, r) {
	return {
		top: n.top - r.height,
		right: n.right - r.width,
		bottom: n.bottom - r.height,
		left: n.left - r.width,
	};
}
function Ev(n) {
	return sO.some((r) => n[r] >= 0);
}
const D5 = function (n) {
		return (
			n === void 0 && (n = {}),
			{
				name: "hide",
				options: n,
				fn(o) {
					return Et(this, null, function* () {
						const { rects: i, platform: l } = o,
							h = Zo(n, o),
							{ strategy: u = "referenceHidden" } = h,
							c = Be(h, ["strategy"]);
						switch (u) {
							case "referenceHidden": {
								const p = yield l.detectOverflow(
										o,
										_e(P({}, c), { elementContext: "reference" })
									),
									f = wv(p, i.reference);
								return {
									data: { referenceHiddenOffsets: f, referenceHidden: Ev(f) },
								};
							}
							case "escaped": {
								const p = yield l.detectOverflow(
										o,
										_e(P({}, c), { altBoundary: !0 })
									),
									f = wv(p, i.floating);
								return { data: { escapedOffsets: f, escaped: Ev(f) } };
							}
							default:
								return {};
						}
					});
				},
			}
		);
	},
	FS = new Set(["left", "top"]);
function N5(n, r) {
	return Et(this, null, function* () {
		const { placement: o, platform: i, elements: l } = n,
			u = yield i.isRTL == null ? void 0 : i.isRTL(l.floating),
			c = rr(o),
			h = Ua(o),
			p = zr(o) === "y",
			f = FS.has(c) ? -1 : 1,
			y = u && p ? -1 : 1,
			g = Zo(r, n);
		let {
			mainAxis: S,
			crossAxis: b,
			alignmentAxis: w,
		} = typeof g == "number"
			? { mainAxis: g, crossAxis: 0, alignmentAxis: null }
			: {
					mainAxis: g.mainAxis || 0,
					crossAxis: g.crossAxis || 0,
					alignmentAxis: g.alignmentAxis,
			  };
		return (
			h && typeof w == "number" && (b = h === "end" ? w * -1 : w),
			p ? { x: b * y, y: S * f } : { x: S * f, y: b * y }
		);
	});
}
const L5 = function (n) {
		return (
			n === void 0 && (n = 0),
			{
				name: "offset",
				options: n,
				fn(o) {
					return Et(this, null, function* () {
						var i, l;
						const { x: u, y: c, placement: h, middlewareData: p } = o,
							f = yield N5(o, n);
						return h === ((i = p.offset) == null ? void 0 : i.placement) &&
							(l = p.arrow) != null &&
							l.alignmentOffset
							? {}
							: { x: u + f.x, y: c + f.y, data: _e(P({}, f), { placement: h }) };
					});
				},
			}
		);
	},
	z5 = function (n) {
		return (
			n === void 0 && (n = {}),
			{
				name: "shift",
				options: n,
				fn(o) {
					return Et(this, null, function* () {
						const { x: i, y: l, placement: u, platform: c } = o,
							L = Zo(n, o),
							{
								mainAxis: h = !0,
								crossAxis: p = !1,
								limiter: f = {
									fn: (M) => {
										let { x: _, y: N } = M;
										return { x: _, y: N };
									},
								},
							} = L,
							y = Be(L, ["mainAxis", "crossAxis", "limiter"]),
							g = { x: i, y: l },
							S = yield c.detectOverflow(o, y),
							b = zr(rr(u)),
							w = bm(b);
						let R = g[w],
							O = g[b];
						if (h) {
							const M = w === "y" ? "top" : "left",
								_ = w === "y" ? "bottom" : "right",
								N = R + S[M],
								D = R - S[_];
							R = Up(N, R, D);
						}
						if (p) {
							const M = b === "y" ? "top" : "left",
								_ = b === "y" ? "bottom" : "right",
								N = O + S[M],
								D = O - S[_];
							O = Up(N, O, D);
						}
						const T = f.fn(_e(P({}, o), { [w]: R, [b]: O }));
						return _e(P({}, T), {
							data: { x: T.x - i, y: T.y - l, enabled: { [w]: h, [b]: p } },
						});
					});
				},
			}
		);
	},
	j5 = function (n) {
		return (
			n === void 0 && (n = {}),
			{
				options: n,
				fn(r) {
					const { x: o, y: i, placement: l, rects: u, middlewareData: c } = r,
						{ offset: h = 0, mainAxis: p = !0, crossAxis: f = !0 } = Zo(n, r),
						y = { x: o, y: i },
						g = zr(l),
						S = bm(g);
					let b = y[S],
						w = y[g];
					const R = Zo(h, r),
						O =
							typeof R == "number"
								? { mainAxis: R, crossAxis: 0 }
								: P({ mainAxis: 0, crossAxis: 0 }, R);
					if (p) {
						const M = S === "y" ? "height" : "width",
							_ = u.reference[S] - u.floating[M] + O.mainAxis,
							N = u.reference[S] + u.reference[M] - O.mainAxis;
						b < _ ? (b = _) : b > N && (b = N);
					}
					if (f) {
						var T, L;
						const M = S === "y" ? "width" : "height",
							_ = FS.has(rr(l)),
							N =
								u.reference[g] -
								u.floating[M] +
								((_ && ((T = c.offset) == null ? void 0 : T[g])) || 0) +
								(_ ? 0 : O.crossAxis),
							D =
								u.reference[g] +
								u.reference[M] +
								(_ ? 0 : ((L = c.offset) == null ? void 0 : L[g]) || 0) -
								(_ ? O.crossAxis : 0);
						w < N ? (w = N) : w > D && (w = D);
					}
					return { [S]: b, [g]: w };
				},
			}
		);
	},
	B5 = function (n) {
		return (
			n === void 0 && (n = {}),
			{
				name: "size",
				options: n,
				fn(o) {
					return Et(this, null, function* () {
						var i, l;
						const { placement: u, rects: c, platform: h, elements: p } = o,
							se = Zo(n, o),
							{ apply: f = () => {} } = se,
							y = Be(se, ["apply"]),
							g = yield h.detectOverflow(o, y),
							S = rr(u),
							b = Ua(u),
							w = zr(u) === "y",
							{ width: R, height: O } = c.floating;
						let T, L;
						S === "top" || S === "bottom"
							? ((T = S),
							  (L =
									b ===
									((yield h.isRTL == null ? void 0 : h.isRTL(p.floating))
										? "start"
										: "end")
										? "left"
										: "right"))
							: ((L = S), (T = b === "end" ? "top" : "bottom"));
						const M = O - g.top - g.bottom,
							_ = R - g.left - g.right,
							N = xs(O - g[T], M),
							D = xs(R - g[L], _),
							H = !o.middlewareData.shift;
						let U = N,
							fe = D;
						if (
							((i = o.middlewareData.shift) != null && i.enabled.x && (fe = _),
							(l = o.middlewareData.shift) != null && l.enabled.y && (U = M),
							H && !b)
						) {
							const Y = pr(g.left, 0),
								oe = pr(g.right, 0),
								xe = pr(g.top, 0),
								ge = pr(g.bottom, 0);
							w
								? (fe =
										R -
										2 * (Y !== 0 || oe !== 0 ? Y + oe : pr(g.left, g.right)))
								: (U =
										O -
										2 *
											(xe !== 0 || ge !== 0
												? xe + ge
												: pr(g.top, g.bottom)));
						}
						yield f(_e(P({}, o), { availableWidth: fe, availableHeight: U }));
						const we = yield h.getDimensions(p.floating);
						return R !== we.width || O !== we.height ? { reset: { rects: !0 } } : {};
					});
				},
			}
		);
	};
function XS(n) {
	const r = gr(n);
	let o = parseFloat(r.width) || 0,
		i = parseFloat(r.height) || 0;
	const l = nn(n),
		u = l ? n.offsetWidth : o,
		c = l ? n.offsetHeight : i,
		h = rf(o) !== u || rf(i) !== c;
	return h && ((o = u), (i = c)), { width: o, height: i, $: h };
}
function km(n) {
	return At(n) ? n : n.contextElement;
}
function Ss(n) {
	const r = km(n);
	if (!nn(r)) return ho(1);
	const o = r.getBoundingClientRect(),
		{ width: i, height: l, $: u } = XS(r);
	let c = (u ? rf(o.width) : o.width) / i,
		h = (u ? rf(o.height) : o.height) / l;
	return (
		(!c || !Number.isFinite(c)) && (c = 1),
		(!h || !Number.isFinite(h)) && (h = 1),
		{ x: c, y: h }
	);
}
const U5 = ho(0);
function KS(n) {
	const r = Sn(n);
	return !Sf() || !r.visualViewport
		? U5
		: { x: r.visualViewport.offsetLeft, y: r.visualViewport.offsetTop };
}
function H5(n, r, o) {
	return r === void 0 && (r = !1), !o || (r && o !== Sn(n)) ? !1 : r;
}
function gi(n, r, o, i) {
	r === void 0 && (r = !1), o === void 0 && (o = !1);
	const l = n.getBoundingClientRect(),
		u = km(n);
	let c = ho(1);
	r && (i ? At(i) && (c = Ss(i)) : (c = Ss(n)));
	const h = H5(u, o, i) ? KS(u) : ho(0);
	let p = (l.left + h.x) / c.x,
		f = (l.top + h.y) / c.y,
		y = l.width / c.x,
		g = l.height / c.y;
	if (u) {
		const S = Sn(u),
			b = i && At(i) ? Sn(i) : i;
		let w = S,
			R = Lp(w);
		for (; R && i && b !== w; ) {
			const O = Ss(R),
				T = R.getBoundingClientRect(),
				L = gr(R),
				M = T.left + (R.clientLeft + parseFloat(L.paddingLeft)) * O.x,
				_ = T.top + (R.clientTop + parseFloat(L.paddingTop)) * O.y;
			(p *= O.x),
				(f *= O.y),
				(y *= O.x),
				(g *= O.y),
				(p += M),
				(f += _),
				(w = Sn(R)),
				(R = Lp(w));
		}
	}
	return af({ width: y, height: g, x: p, y: f });
}
function Rf(n, r) {
	const o = xf(n).scrollLeft;
	return r ? r.left + o : gi(bo(n)).left + o;
}
function QS(n, r) {
	const o = n.getBoundingClientRect(),
		i = o.left + r.scrollLeft - Rf(n, o),
		l = o.top + r.scrollTop;
	return { x: i, y: l };
}
function q5(n) {
	let { elements: r, rect: o, offsetParent: i, strategy: l } = n;
	const u = l === "fixed",
		c = bo(i),
		h = r ? vf(r.floating) : !1;
	if (i === c || (h && u)) return o;
	let p = { scrollLeft: 0, scrollTop: 0 },
		f = ho(1);
	const y = ho(0),
		g = nn(i);
	if ((g || (!g && !u)) && ((ja(i) !== "body" || Ba(c)) && (p = xf(i)), nn(i))) {
		const b = gi(i);
		(f = Ss(i)), (y.x = b.x + i.clientLeft), (y.y = b.y + i.clientTop);
	}
	const S = c && !g && !u ? QS(c, p) : ho(0);
	return {
		width: o.width * f.x,
		height: o.height * f.y,
		x: o.x * f.x - p.scrollLeft * f.x + y.x + S.x,
		y: o.y * f.y - p.scrollTop * f.y + y.y + S.y,
	};
}
function P5(n) {
	return Array.from(n.getClientRects());
}
function V5(n) {
	const r = bo(n),
		o = xf(n),
		i = n.ownerDocument.body,
		l = pr(r.scrollWidth, r.clientWidth, i.scrollWidth, i.clientWidth),
		u = pr(r.scrollHeight, r.clientHeight, i.scrollHeight, i.clientHeight);
	let c = -o.scrollLeft + Rf(n);
	const h = -o.scrollTop;
	return (
		gr(i).direction === "rtl" && (c += pr(r.clientWidth, i.clientWidth) - l),
		{ width: l, height: u, x: c, y: h }
	);
}
const Rv = 25;
function Y5(n, r) {
	const o = Sn(n),
		i = bo(n),
		l = o.visualViewport;
	let u = i.clientWidth,
		c = i.clientHeight,
		h = 0,
		p = 0;
	if (l) {
		(u = l.width), (c = l.height);
		const y = Sf();
		(!y || (y && r === "fixed")) && ((h = l.offsetLeft), (p = l.offsetTop));
	}
	const f = Rf(i);
	if (f <= 0) {
		const y = i.ownerDocument,
			g = y.body,
			S = getComputedStyle(g),
			b =
				(y.compatMode === "CSS1Compat" &&
					parseFloat(S.marginLeft) + parseFloat(S.marginRight)) ||
				0,
			w = Math.abs(i.clientWidth - g.clientWidth - b);
		w <= Rv && (u -= w);
	} else f <= Rv && (u += f);
	return { width: u, height: c, x: h, y: p };
}
const I5 = new Set(["absolute", "fixed"]);
function G5(n, r) {
	const o = gi(n, !0, r === "fixed"),
		i = o.top + n.clientTop,
		l = o.left + n.clientLeft,
		u = nn(n) ? Ss(n) : ho(1),
		c = n.clientWidth * u.x,
		h = n.clientHeight * u.y,
		p = l * u.x,
		f = i * u.y;
	return { width: c, height: h, x: p, y: f };
}
function Tv(n, r, o) {
	let i;
	if (r === "viewport") i = Y5(n, o);
	else if (r === "document") i = V5(bo(n));
	else if (At(r)) i = G5(r, o);
	else {
		const l = KS(n);
		i = { x: r.x - l.x, y: r.y - l.y, width: r.width, height: r.height };
	}
	return af(i);
}
function ZS(n, r) {
	const o = yo(n);
	return o === r || !At(o) || fo(o) ? !1 : gr(o).position === "fixed" || ZS(o, r);
}
function F5(n, r) {
	const o = r.get(n);
	if (o) return o;
	let i = Na(n, [], !1).filter((h) => At(h) && ja(h) !== "body"),
		l = null;
	const u = gr(n).position === "fixed";
	let c = u ? yo(n) : n;
	for (; At(c) && !fo(c); ) {
		const h = gr(c),
			p = gm(c);
		!p && h.position === "fixed" && (l = null),
			(
				u
					? !p && !l
					: (!p && h.position === "static" && !!l && I5.has(l.position)) ||
					  (Ba(c) && !p && ZS(n, c))
			)
				? (i = i.filter((y) => y !== c))
				: (l = h),
			(c = yo(c));
	}
	return r.set(n, i), i;
}
function X5(n) {
	let { element: r, boundary: o, rootBoundary: i, strategy: l } = n;
	const c = [...(o === "clippingAncestors" ? (vf(r) ? [] : F5(r, this._c)) : [].concat(o)), i],
		h = c[0],
		p = c.reduce((f, y) => {
			const g = Tv(r, y, l);
			return (
				(f.top = pr(g.top, f.top)),
				(f.right = xs(g.right, f.right)),
				(f.bottom = xs(g.bottom, f.bottom)),
				(f.left = pr(g.left, f.left)),
				f
			);
		}, Tv(r, h, l));
	return { width: p.right - p.left, height: p.bottom - p.top, x: p.left, y: p.top };
}
function K5(n) {
	const { width: r, height: o } = XS(n);
	return { width: r, height: o };
}
function Q5(n, r, o) {
	const i = nn(r),
		l = bo(r),
		u = o === "fixed",
		c = gi(n, !0, u, r);
	let h = { scrollLeft: 0, scrollTop: 0 };
	const p = ho(0);
	function f() {
		p.x = Rf(l);
	}
	if (i || (!i && !u))
		if (((ja(r) !== "body" || Ba(l)) && (h = xf(r)), i)) {
			const b = gi(r, !0, u, r);
			(p.x = b.x + r.clientLeft), (p.y = b.y + r.clientTop);
		} else l && f();
	u && !i && l && f();
	const y = l && !i && !u ? QS(l, h) : ho(0),
		g = c.left + h.scrollLeft - p.x - y.x,
		S = c.top + h.scrollTop - p.y - y.y;
	return { x: g, y: S, width: c.width, height: c.height };
}
function rp(n) {
	return gr(n).position === "static";
}
function Cv(n, r) {
	if (!nn(n) || gr(n).position === "fixed") return null;
	if (r) return r(n);
	let o = n.offsetParent;
	return bo(n) === o && (o = o.ownerDocument.body), o;
}
function JS(n, r) {
	const o = Sn(n);
	if (vf(n)) return o;
	if (!nn(n)) {
		let l = yo(n);
		for (; l && !fo(l); ) {
			if (At(l) && !rp(l)) return l;
			l = yo(l);
		}
		return o;
	}
	let i = Cv(n, r);
	for (; i && YC(i) && rp(i); ) i = Cv(i, r);
	return i && fo(i) && rp(i) && !gm(i) ? o : i || KC(n) || o;
}
const Z5 = function (n) {
	return Et(this, null, function* () {
		const r = this.getOffsetParent || JS,
			o = this.getDimensions,
			i = yield o(n.floating);
		return {
			reference: Q5(n.reference, yield r(n.floating), n.strategy),
			floating: { x: 0, y: 0, width: i.width, height: i.height },
		};
	});
};
function J5(n) {
	return gr(n).direction === "rtl";
}
const W5 = {
	convertOffsetParentRelativeRectToViewportRelativeRect: q5,
	getDocumentElement: bo,
	getClippingRect: X5,
	getOffsetParent: JS,
	getElementRects: Z5,
	getClientRects: P5,
	getDimensions: K5,
	getScale: Ss,
	isElement: At,
	isRTL: J5,
};
function WS(n, r) {
	return n.x === r.x && n.y === r.y && n.width === r.width && n.height === r.height;
}
function $5(n, r) {
	let o = null,
		i;
	const l = bo(n);
	function u() {
		var h;
		clearTimeout(i), (h = o) == null || h.disconnect(), (o = null);
	}
	function c(h, p) {
		h === void 0 && (h = !1), p === void 0 && (p = 1), u();
		const f = n.getBoundingClientRect(),
			{ left: y, top: g, width: S, height: b } = f;
		if ((h || r(), !S || !b)) return;
		const w = gs(g),
			R = gs(l.clientWidth - (y + S)),
			O = gs(l.clientHeight - (g + b)),
			T = gs(y),
			M = {
				rootMargin: -w + "px " + -R + "px " + -O + "px " + -T + "px",
				threshold: pr(0, xs(1, p)) || 1,
			};
		let _ = !0;
		function N(D) {
			const H = D[0].intersectionRatio;
			if (H !== p) {
				if (!_) return c();
				H
					? c(!1, H)
					: (i = setTimeout(() => {
							c(!1, 1e-7);
					  }, 1e3));
			}
			H === 1 && !WS(f, n.getBoundingClientRect()) && c(), (_ = !1);
		}
		try {
			o = new IntersectionObserver(N, _e(P({}, M), { root: l.ownerDocument }));
		} catch (D) {
			o = new IntersectionObserver(N, M);
		}
		o.observe(n);
	}
	return c(!0), u;
}
function Ov(n, r, o, i) {
	i === void 0 && (i = {});
	const {
			ancestorScroll: l = !0,
			ancestorResize: u = !0,
			elementResize: c = typeof ResizeObserver == "function",
			layoutShift: h = typeof IntersectionObserver == "function",
			animationFrame: p = !1,
		} = i,
		f = km(n),
		y = l || u ? [...(f ? Na(f) : []), ...Na(r)] : [];
	y.forEach((T) => {
		l && T.addEventListener("scroll", o, { passive: !0 }),
			u && T.addEventListener("resize", o);
	});
	const g = f && h ? $5(f, o) : null;
	let S = -1,
		b = null;
	c &&
		((b = new ResizeObserver((T) => {
			let [L] = T;
			L &&
				L.target === f &&
				b &&
				(b.unobserve(r),
				cancelAnimationFrame(S),
				(S = requestAnimationFrame(() => {
					var M;
					(M = b) == null || M.observe(r);
				}))),
				o();
		})),
		f && !p && b.observe(f),
		b.observe(r));
	let w,
		R = p ? gi(n) : null;
	p && O();
	function O() {
		const T = gi(n);
		R && !WS(R, T) && o(), (R = T), (w = requestAnimationFrame(O));
	}
	return (
		o(),
		() => {
			var T;
			y.forEach((L) => {
				l && L.removeEventListener("scroll", o), u && L.removeEventListener("resize", o);
			}),
				g == null || g(),
				(T = b) == null || T.disconnect(),
				(b = null),
				p && cancelAnimationFrame(w);
		}
	);
}
const e3 = L5,
	t3 = z5,
	n3 = _5,
	r3 = B5,
	o3 = D5,
	a3 = j5,
	i3 = (n, r, o) => {
		const i = new Map(),
			l = P({ platform: W5 }, o),
			u = _e(P({}, l.platform), { _c: i });
		return k5(n, r, _e(P({}, l), { platform: u }));
	};
var s3 = typeof document != "undefined",
	l3 = function () {},
	Jc = s3 ? v.useLayoutEffect : l3;
function ff(n, r) {
	if (n === r) return !0;
	if (typeof n != typeof r) return !1;
	if (typeof n == "function" && n.toString() === r.toString()) return !0;
	let o, i, l;
	if (n && r && typeof n == "object") {
		if (Array.isArray(n)) {
			if (((o = n.length), o !== r.length)) return !1;
			for (i = o; i-- !== 0; ) if (!ff(n[i], r[i])) return !1;
			return !0;
		}
		if (((l = Object.keys(n)), (o = l.length), o !== Object.keys(r).length)) return !1;
		for (i = o; i-- !== 0; ) if (!{}.hasOwnProperty.call(r, l[i])) return !1;
		for (i = o; i-- !== 0; ) {
			const u = l[i];
			if (!(u === "_owner" && n.$$typeof) && !ff(n[u], r[u])) return !1;
		}
		return !0;
	}
	return n !== n && r !== r;
}
function $S(n) {
	return typeof window == "undefined"
		? 1
		: (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Av(n, r) {
	const o = $S(n);
	return Math.round(r * o) / o;
}
function op(n) {
	const r = v.useRef(n);
	return (
		Jc(() => {
			r.current = n;
		}),
		r
	);
}
function u3(n) {
	n === void 0 && (n = {});
	const {
			placement: r = "bottom",
			strategy: o = "absolute",
			middleware: i = [],
			platform: l,
			elements: { reference: u, floating: c } = {},
			transform: h = !0,
			whileElementsMounted: p,
			open: f,
		} = n,
		[y, g] = v.useState({
			x: 0,
			y: 0,
			strategy: o,
			placement: r,
			middlewareData: {},
			isPositioned: !1,
		}),
		[S, b] = v.useState(i);
	ff(S, i) || b(i);
	const [w, R] = v.useState(null),
		[O, T] = v.useState(null),
		L = v.useCallback((F) => {
			F !== D.current && ((D.current = F), R(F));
		}, []),
		M = v.useCallback((F) => {
			F !== H.current && ((H.current = F), T(F));
		}, []),
		_ = u || w,
		N = c || O,
		D = v.useRef(null),
		H = v.useRef(null),
		U = v.useRef(y),
		fe = p != null,
		we = op(p),
		se = op(l),
		Y = op(f),
		oe = v.useCallback(() => {
			if (!D.current || !H.current) return;
			const F = { placement: r, strategy: o, middleware: S };
			se.current && (F.platform = se.current),
				i3(D.current, H.current, F).then((pe) => {
					const J = _e(P({}, pe), { isPositioned: Y.current !== !1 });
					xe.current &&
						!ff(U.current, J) &&
						((U.current = J),
						mo.flushSync(() => {
							g(J);
						}));
				});
		}, [S, r, o, se, Y]);
	Jc(() => {
		f === !1 &&
			U.current.isPositioned &&
			((U.current.isPositioned = !1), g((F) => _e(P({}, F), { isPositioned: !1 })));
	}, [f]);
	const xe = v.useRef(!1);
	Jc(
		() => (
			(xe.current = !0),
			() => {
				xe.current = !1;
			}
		),
		[]
	),
		Jc(() => {
			if ((_ && (D.current = _), N && (H.current = N), _ && N)) {
				if (we.current) return we.current(_, N, oe);
				oe();
			}
		}, [_, N, oe, we, fe]);
	const ge = v.useMemo(
			() => ({ reference: D, floating: H, setReference: L, setFloating: M }),
			[L, M]
		),
		j = v.useMemo(() => ({ reference: _, floating: N }), [_, N]),
		I = v.useMemo(() => {
			const F = { position: o, left: 0, top: 0 };
			if (!j.floating) return F;
			const pe = Av(j.floating, y.x),
				J = Av(j.floating, y.y);
			return h
				? P(
						_e(P({}, F), { transform: "translate(" + pe + "px, " + J + "px)" }),
						$S(j.floating) >= 1.5 && { willChange: "transform" }
				  )
				: { position: o, left: pe, top: J };
		}, [o, h, j.floating, y.x, y.y]);
	return v.useMemo(
		() => _e(P({}, y), { update: oe, refs: ge, elements: j, floatingStyles: I }),
		[y, oe, ge, j, I]
	);
}
const c3 = (n, r) => _e(P({}, e3(n)), { options: [n, r] }),
	f3 = (n, r) => _e(P({}, t3(n)), { options: [n, r] }),
	d3 = (n, r) => _e(P({}, a3(n)), { options: [n, r] }),
	h3 = (n, r) => _e(P({}, n3(n)), { options: [n, r] }),
	p3 = (n, r) => _e(P({}, r3(n)), { options: [n, r] }),
	m3 = (n, r) => _e(P({}, o3(n)), { options: [n, r] }),
	g3 = { intentional: "onClick", sloppy: "onPointerDown" };
function y3(n) {
	var r, o;
	return {
		escapeKey:
			typeof n == "boolean" ? n : (r = n == null ? void 0 : n.escapeKey) != null ? r : !1,
		outsidePress:
			typeof n == "boolean" ? n : (o = n == null ? void 0 : n.outsidePress) != null ? o : !0,
	};
}
function _m(n, r = {}) {
	const o = "rootStore" in n ? n.rootStore : n,
		i = o.useState("open"),
		l = o.useState("floatingElement"),
		u = o.useState("referenceElement"),
		c = o.useState("domReferenceElement"),
		{ onOpenChange: h, dataRef: p } = o.context,
		{
			enabled: f = !0,
			escapeKey: y = !0,
			outsidePress: g = !0,
			outsidePressEvent: S = "sloppy",
			referencePress: b = !1,
			referencePressEvent: w = "sloppy",
			ancestorScroll: R = !1,
			bubbles: O,
			externalTree: T,
		} = r,
		L = Ha(T),
		M = Ke(typeof g == "function" ? g : () => !1),
		_ = typeof g == "function" ? M : g,
		N = v.useRef(!1),
		{ escapeKey: D, outsidePress: H } = y3(O),
		U = v.useRef(null),
		fe = mr(),
		we = mr(),
		se = Ke(() => {
			we.clear(), (p.current.insideReactTree = !1);
		}),
		Y = v.useRef(!1),
		oe = v.useRef(""),
		xe = Ke((re) => {
			oe.current = re.pointerType;
		}),
		ge = Ke(() => {
			const re = oe.current,
				ce = re === "pen" || !re ? "mouse" : re,
				de = typeof S == "function" ? S() : S;
			return typeof de == "string" ? de : de[ce];
		}),
		j = Ke((re) => {
			var ze;
			if (!i || !f || !y || re.key !== "Escape" || Y.current) return;
			const ce = (ze = p.current.floatingContext) == null ? void 0 : ze.nodeId,
				de = L ? pi(L.nodesRef.current, ce) : [];
			if (!D && de.length > 0) {
				let Ce = !0;
				if (
					(de.forEach((le) => {
						var Ae;
						(Ae = le.context) != null &&
							Ae.open &&
							!le.context.dataRef.current.__escapeKeyBubbles &&
							(Ce = !1);
					}),
					!Ce)
				)
					return;
			}
			const Te = iO(re) ? re.nativeEvent : re,
				Re = gt(Ef, Te);
			o.setOpen(!1, Re), !D && !Re.isPropagationAllowed && re.stopPropagation();
		}),
		I = Ke((re) => {
			const ce = ge();
			return (
				(ce === "intentional" && re.type !== "click") ||
				(ce === "sloppy" && re.type === "click")
			);
		}),
		F = Ke(() => {
			(p.current.insideReactTree = !0), we.start(0, se);
		}),
		pe = Ke((re, ce = !1) => {
			var Ue;
			if (I(re)) {
				se();
				return;
			}
			if (p.current.insideReactTree) {
				se();
				return;
			}
			if ((ge() === "intentional" && ce) || (typeof _ == "function" && !_(re))) return;
			const de = In(re),
				Te = `[${Ts("inert")}]`,
				Re = kt(o.select("floatingElement")).querySelectorAll(Te),
				ze = o.context.triggerElements;
			if (de && (ze.hasElement(de) || ze.hasMatchingElement((Ye) => ft(Ye, de)))) return;
			let Ce = At(de) ? de : null;
			for (; Ce && !fo(Ce); ) {
				const Ye = yo(Ce);
				if (fo(Ye) || !At(Ye)) break;
				Ce = Ye;
			}
			if (
				Re.length &&
				At(de) &&
				!oO(de) &&
				!ft(de, o.select("floatingElement")) &&
				Array.from(Re).every((Ye) => !ft(Ce, Ye))
			)
				return;
			if (nn(de) && !("touches" in re)) {
				const Ye = fo(de),
					qe = gr(de),
					X = /auto|scroll/,
					Pe = Ye || X.test(qe.overflowX),
					Jt = Ye || X.test(qe.overflowY),
					st = Pe && de.clientWidth > 0 && de.scrollWidth > de.clientWidth,
					Mt = Jt && de.clientHeight > 0 && de.scrollHeight > de.clientHeight,
					wt = qe.direction === "rtl",
					dn =
						Mt &&
						(wt
							? re.offsetX <= de.offsetWidth - de.clientWidth
							: re.offsetX > de.clientWidth),
					Tn = st && re.offsetY > de.clientHeight;
				if (dn || Tn) return;
			}
			const le = (Ue = p.current.floatingContext) == null ? void 0 : Ue.nodeId,
				Ae =
					L &&
					pi(L.nodesRef.current, le).some((Ye) => {
						var qe;
						return Xr(re, (qe = Ye.context) == null ? void 0 : qe.elements.floating);
					});
			if (
				Xr(re, o.select("floatingElement")) ||
				Xr(re, o.select("domReferenceElement")) ||
				Ae
			)
				return;
			const Se = L ? pi(L.nodesRef.current, le) : [];
			if (Se.length > 0) {
				let Ye = !0;
				if (
					(Se.forEach((qe) => {
						var X;
						(X = qe.context) != null &&
							X.open &&
							!qe.context.dataRef.current.__outsidePressBubbles &&
							(Ye = !1);
					}),
					!Ye)
				)
					return;
			}
			o.setOpen(!1, gt(Tm, re)), se();
		}),
		J = Ke((re) => {
			ge() !== "sloppy" ||
				re.pointerType === "touch" ||
				!o.select("open") ||
				!f ||
				Xr(re, o.select("floatingElement")) ||
				Xr(re, o.select("domReferenceElement")) ||
				pe(re);
		}),
		B = Ke((re) => {
			if (
				ge() !== "sloppy" ||
				!o.select("open") ||
				!f ||
				Xr(re, o.select("floatingElement")) ||
				Xr(re, o.select("domReferenceElement"))
			)
				return;
			const ce = re.touches[0];
			ce &&
				((U.current = {
					startTime: Date.now(),
					startX: ce.clientX,
					startY: ce.clientY,
					dismissOnTouchEnd: !1,
					dismissOnMouseDown: !0,
				}),
				fe.start(1e3, () => {
					U.current &&
						((U.current.dismissOnTouchEnd = !1), (U.current.dismissOnMouseDown = !1));
				}));
		}),
		Z = Ke((re) => {
			const ce = In(re);
			function de() {
				B(re), ce == null || ce.removeEventListener(re.type, de);
			}
			ce == null || ce.addEventListener(re.type, de);
		}),
		ee = Ke((re) => {
			const ce = N.current;
			if (
				((N.current = !1),
				fe.clear(),
				re.type === "mousedown" && U.current && !U.current.dismissOnMouseDown)
			)
				return;
			const de = In(re);
			function Te() {
				re.type === "pointerdown" ? J(re) : pe(re, ce),
					de == null || de.removeEventListener(re.type, Te);
			}
			de == null || de.addEventListener(re.type, Te);
		}),
		ie = Ke((re) => {
			if (
				ge() !== "sloppy" ||
				!U.current ||
				Xr(re, o.select("floatingElement")) ||
				Xr(re, o.select("domReferenceElement"))
			)
				return;
			const ce = re.touches[0];
			if (!ce) return;
			const de = Math.abs(ce.clientX - U.current.startX),
				Te = Math.abs(ce.clientY - U.current.startY),
				Re = Math.sqrt(de * de + Te * Te);
			Re > 5 && (U.current.dismissOnTouchEnd = !0),
				Re > 10 && (pe(re), fe.clear(), (U.current = null));
		}),
		me = Ke((re) => {
			const ce = In(re);
			function de() {
				ie(re), ce == null || ce.removeEventListener(re.type, de);
			}
			ce == null || ce.addEventListener(re.type, de);
		}),
		ve = Ke((re) => {
			ge() !== "sloppy" ||
				!U.current ||
				Xr(re, o.select("floatingElement")) ||
				Xr(re, o.select("domReferenceElement")) ||
				(U.current.dismissOnTouchEnd && pe(re), fe.clear(), (U.current = null));
		}),
		ke = Ke((re) => {
			const ce = In(re);
			function de() {
				ve(re), ce == null || ce.removeEventListener(re.type, de);
			}
			ce == null || ce.addEventListener(re.type, de);
		});
	v.useEffect(() => {
		if (!i || !f) return;
		(p.current.__escapeKeyBubbles = D), (p.current.__outsidePressBubbles = H);
		const re = new go();
		function ce(Ce) {
			o.setOpen(!1, gt(Rm, Ce));
		}
		function de() {
			re.clear(), (Y.current = !0);
		}
		function Te() {
			re.start(Sf() ? 5 : 0, () => {
				Y.current = !1;
			});
		}
		const Re = kt(l);
		Re.addEventListener("pointerdown", xe, !0),
			y &&
				(Re.addEventListener("keydown", j),
				Re.addEventListener("compositionstart", de),
				Re.addEventListener("compositionend", Te)),
			_ &&
				(Re.addEventListener("click", ee, !0),
				Re.addEventListener("pointerdown", ee, !0),
				Re.addEventListener("touchstart", Z, !0),
				Re.addEventListener("touchmove", me, !0),
				Re.addEventListener("touchend", ke, !0),
				Re.addEventListener("mousedown", ee, !0));
		let ze = [];
		return (
			R &&
				(At(c) && (ze = Na(c)),
				At(l) && (ze = ze.concat(Na(l))),
				!At(u) && u && u.contextElement && (ze = ze.concat(Na(u.contextElement)))),
			(ze = ze.filter((Ce) => {
				var le;
				return Ce !== ((le = Re.defaultView) == null ? void 0 : le.visualViewport);
			})),
			ze.forEach((Ce) => {
				Ce.addEventListener("scroll", ce, { passive: !0 });
			}),
			() => {
				Re.removeEventListener("pointerdown", xe, !0),
					y &&
						(Re.removeEventListener("keydown", j),
						Re.removeEventListener("compositionstart", de),
						Re.removeEventListener("compositionend", Te)),
					_ &&
						(Re.removeEventListener("click", ee, !0),
						Re.removeEventListener("pointerdown", ee, !0),
						Re.removeEventListener("touchstart", Z, !0),
						Re.removeEventListener("touchmove", me, !0),
						Re.removeEventListener("touchend", ke, !0),
						Re.removeEventListener("mousedown", ee, !0)),
					ze.forEach((Ce) => {
						Ce.removeEventListener("scroll", ce);
					}),
					re.clear(),
					(N.current = !1);
			}
		);
	}, [p, l, u, c, y, _, i, h, R, f, D, H, j, pe, ee, J, Z, me, ke, xe, o]),
		v.useEffect(se, [_, se]);
	const je = v.useMemo(
			() =>
				P(
					{ onKeyDown: j },
					b &&
						P(
							{
								[g3[w]]: (re) => {
									o.setOpen(!1, gt(Es, re.nativeEvent));
								},
							},
							w !== "intentional" && {
								onClick(re) {
									o.setOpen(!1, gt(Es, re.nativeEvent));
								},
							}
						)
				),
			[j, o, b, w]
		),
		Ee = Ke((re) => {
			const ce = In(re.nativeEvent);
			!ft(o.select("floatingElement"), ce) || re.button !== 0 || (N.current = !0);
		}),
		Qe = Ke((re) => {
			!i || !f || re.button !== 0 || (N.current = !0);
		}),
		it = v.useMemo(
			() => ({
				onKeyDown: j,
				onPointerDown: Ee,
				onMouseDown: Ee,
				onMouseUp: Ee,
				onClickCapture: F,
				onMouseDownCapture(re) {
					F(), Qe(re);
				},
				onPointerDownCapture(re) {
					F(), Qe(re);
				},
				onMouseUpCapture: F,
				onTouchEndCapture: F,
				onTouchMoveCapture: F,
			}),
			[j, Ee, F, Qe]
		);
	return v.useMemo(() => (f ? { reference: je, floating: it, trigger: je } : {}), [f, je, it]);
}
var df = Symbol("NOT_FOUND");
function b3(n, r = `expected a function, instead received ${typeof n}`) {
	if (typeof n != "function") throw new TypeError(r);
}
function v3(n, r = `expected an object, instead received ${typeof n}`) {
	if (typeof n != "object") throw new TypeError(r);
}
function S3(n, r = "expected all items to be functions, instead received the following types: ") {
	if (!n.every((o) => typeof o == "function")) {
		const o = n
			.map((i) => (typeof i == "function" ? `function ${i.name || "unnamed"}()` : typeof i))
			.join(", ");
		throw new TypeError(`${r}[${o}]`);
	}
}
var Mv = (n) => (Array.isArray(n) ? n : [n]);
function x3(n) {
	const r = Array.isArray(n[0]) ? n[0] : n;
	return (
		S3(
			r,
			"createSelector expects all input-selectors to be functions, but received the following types: "
		),
		r
	);
}
function w3(n, r) {
	const o = [],
		{ length: i } = n;
	for (let l = 0; l < i; l++) o.push(n[l].apply(null, r));
	return o;
}
function E3(n) {
	let r;
	return {
		get(o) {
			return r && n(r.key, o) ? r.value : df;
		},
		put(o, i) {
			r = { key: o, value: i };
		},
		getEntries() {
			return r ? [r] : [];
		},
		clear() {
			r = void 0;
		},
	};
}
function R3(n, r) {
	let o = [];
	function i(h) {
		const p = o.findIndex((f) => r(h, f.key));
		if (p > -1) {
			const f = o[p];
			return p > 0 && (o.splice(p, 1), o.unshift(f)), f.value;
		}
		return df;
	}
	function l(h, p) {
		i(h) === df && (o.unshift({ key: h, value: p }), o.length > n && o.pop());
	}
	function u() {
		return o;
	}
	function c() {
		o = [];
	}
	return { get: i, put: l, getEntries: u, clear: c };
}
var T3 = (n, r) => n === r;
function C3(n) {
	return function (o, i) {
		if (o === null || i === null || o.length !== i.length) return !1;
		const { length: l } = o;
		for (let u = 0; u < l; u++) if (!n(o[u], i[u])) return !1;
		return !0;
	};
}
function O3(n, r) {
	const o = typeof r == "object" ? r : { equalityCheck: r },
		{ equalityCheck: i = T3, maxSize: l = 1, resultEqualityCheck: u } = o,
		c = C3(i);
	let h = 0;
	const p = l <= 1 ? E3(c) : R3(l, c);
	function f() {
		let y = p.get(arguments);
		if (y === df) {
			if (((y = n.apply(null, arguments)), h++, u)) {
				const S = p.getEntries().find((b) => u(b.value, y));
				S && ((y = S.value), h !== 0 && h--);
			}
			p.put(arguments, y);
		}
		return y;
	}
	return (
		(f.clearCache = () => {
			p.clear(), f.resetResultsCount();
		}),
		(f.resultsCount = () => h),
		(f.resetResultsCount = () => {
			h = 0;
		}),
		f
	);
}
var A3 = class {
		constructor(n) {
			this.value = n;
		}
		deref() {
			return this.value;
		}
	},
	M3 = typeof WeakRef != "undefined" ? WeakRef : A3,
	k3 = 0,
	kv = 1;
function zc() {
	return { s: k3, v: void 0, o: null, p: null };
}
function ex(n, r = {}) {
	let o = zc();
	const { resultEqualityCheck: i } = r;
	let l,
		u = 0;
	function c() {
		var g, S;
		let h = o;
		const { length: p } = arguments;
		for (let b = 0, w = p; b < w; b++) {
			const R = arguments[b];
			if (typeof R == "function" || (typeof R == "object" && R !== null)) {
				let O = h.o;
				O === null && (h.o = O = new WeakMap());
				const T = O.get(R);
				T === void 0 ? ((h = zc()), O.set(R, h)) : (h = T);
			} else {
				let O = h.p;
				O === null && (h.p = O = new Map());
				const T = O.get(R);
				T === void 0 ? ((h = zc()), O.set(R, h)) : (h = T);
			}
		}
		const f = h;
		let y;
		if (h.s === kv) y = h.v;
		else if (((y = n.apply(null, arguments)), u++, i)) {
			const b =
				(S = (g = l == null ? void 0 : l.deref) == null ? void 0 : g.call(l)) != null
					? S
					: l;
			b != null && i(b, y) && ((y = b), u !== 0 && u--),
				(l =
					(typeof y == "object" && y !== null) || typeof y == "function"
						? new M3(y)
						: y);
		}
		return (f.s = kv), (f.v = y), y;
	}
	return (
		(c.clearCache = () => {
			(o = zc()), c.resetResultsCount();
		}),
		(c.resultsCount = () => u),
		(c.resetResultsCount = () => {
			u = 0;
		}),
		c
	);
}
function tx(n, ...r) {
	const o = typeof n == "function" ? { memoize: n, memoizeOptions: r } : n,
		i = (...l) => {
			let u = 0,
				c = 0,
				h,
				p = {},
				f = l.pop();
			typeof f == "object" && ((p = f), (f = l.pop())),
				b3(
					f,
					`createSelector expects an output function after the inputs, but received: [${typeof f}]`
				);
			const y = P(P({}, o), p),
				{
					memoize: g,
					memoizeOptions: S = [],
					argsMemoize: b = ex,
					argsMemoizeOptions: w = [],
				} = y,
				R = Mv(S),
				O = Mv(w),
				T = x3(l),
				L = g(function () {
					return u++, f.apply(null, arguments);
				}, ...R),
				M = b(function () {
					c++;
					const N = w3(T, arguments);
					return (h = L.apply(null, N)), h;
				}, ...O);
			return Object.assign(M, {
				resultFunc: f,
				memoizedResultFunc: L,
				dependencies: T,
				dependencyRecomputations: () => c,
				resetDependencyRecomputations: () => {
					c = 0;
				},
				lastResult: () => h,
				recomputations: () => u,
				resetRecomputations: () => {
					u = 0;
				},
				memoize: g,
				argsMemoize: b,
			});
		};
	return Object.assign(i, { withTypes: () => i }), i;
}
var _3 = tx(ex),
	D3 = Object.assign(
		(n, r = _3) => {
			v3(
				n,
				`createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof n}`
			);
			const o = Object.keys(n),
				i = o.map((u) => n[u]);
			return r(i, (...u) => u.reduce((c, h, p) => ((c[o[p]] = h), c), {}));
		},
		{ withTypes: () => D3 }
	);
tx({ memoize: O3, memoizeOptions: { maxSize: 1, equalityCheck: Object.is } });
const et = (n, r, o, i, l, u, ...c) => {
	if (c.length > 0) throw new Error(Xn(1));
	let h;
	if (n) h = n;
	else throw new Error("Missing arguments");
	return h;
};
var ap = { exports: {} },
	ip = {};
var _v;
function N3() {
	if (_v) return ip;
	_v = 1;
	var n = Kl();
	function r(g, S) {
		return (g === S && (g !== 0 || 1 / g === 1 / S)) || (g !== g && S !== S);
	}
	var o = typeof Object.is == "function" ? Object.is : r,
		i = n.useState,
		l = n.useEffect,
		u = n.useLayoutEffect,
		c = n.useDebugValue;
	function h(g, S) {
		var b = S(),
			w = i({ inst: { value: b, getSnapshot: S } }),
			R = w[0].inst,
			O = w[1];
		return (
			u(
				function () {
					(R.value = b), (R.getSnapshot = S), p(R) && O({ inst: R });
				},
				[g, b, S]
			),
			l(
				function () {
					return (
						p(R) && O({ inst: R }),
						g(function () {
							p(R) && O({ inst: R });
						})
					);
				},
				[g]
			),
			c(b),
			b
		);
	}
	function p(g) {
		var S = g.getSnapshot;
		g = g.value;
		try {
			var b = S();
			return !o(g, b);
		} catch (w) {
			return !0;
		}
	}
	function f(g, S) {
		return S();
	}
	var y =
		typeof window == "undefined" ||
		typeof window.document == "undefined" ||
		typeof window.document.createElement == "undefined"
			? f
			: h;
	return (
		(ip.useSyncExternalStore = n.useSyncExternalStore !== void 0 ? n.useSyncExternalStore : y),
		ip
	);
}
var Dv;
function nx() {
	return Dv || ((Dv = 1), (ap.exports = N3())), ap.exports;
}
var rx = nx(),
	sp = { exports: {} },
	lp = {};
var Nv;
function L3() {
	if (Nv) return lp;
	Nv = 1;
	var n = Kl(),
		r = nx();
	function o(f, y) {
		return (f === y && (f !== 0 || 1 / f === 1 / y)) || (f !== f && y !== y);
	}
	var i = typeof Object.is == "function" ? Object.is : o,
		l = r.useSyncExternalStore,
		u = n.useRef,
		c = n.useEffect,
		h = n.useMemo,
		p = n.useDebugValue;
	return (
		(lp.useSyncExternalStoreWithSelector = function (f, y, g, S, b) {
			var w = u(null);
			if (w.current === null) {
				var R = { hasValue: !1, value: null };
				w.current = R;
			} else R = w.current;
			w = h(
				function () {
					function T(D) {
						if (!L) {
							if (((L = !0), (M = D), (D = S(D)), b !== void 0 && R.hasValue)) {
								var H = R.value;
								if (b(H, D)) return (_ = H);
							}
							return (_ = D);
						}
						if (((H = _), i(M, D))) return H;
						var U = S(D);
						return b !== void 0 && b(H, U) ? ((M = D), H) : ((M = D), (_ = U));
					}
					var L = !1,
						M,
						_,
						N = g === void 0 ? null : g;
					return [
						function () {
							return T(y());
						},
						N === null
							? void 0
							: function () {
									return T(N());
							  },
					];
				},
				[y, g, S, b]
			);
			var O = l(f, w[0], w[1]);
			return (
				c(
					function () {
						(R.hasValue = !0), (R.value = O);
					},
					[O]
				),
				p(O),
				O
			);
		}),
		lp
	);
}
var Lv;
function z3() {
	return Lv || ((Lv = 1), (sp.exports = L3())), sp.exports;
}
var j3 = z3();
const B3 = Am(19),
	U3 = B3 ? q3 : P3;
function ox(n, r, o, i, l) {
	return U3(n, r, o, i, l);
}
function H3(n, r, o, i, l) {
	const u = v.useCallback(() => r(n.getSnapshot(), o, i, l), [n, r, o, i, l]);
	return rx.useSyncExternalStore(n.subscribe, u, u);
}
BC({
	before(n) {
		(n.syncIndex = 0),
			n.didInitialize ||
				((n.syncTick = 1),
				(n.syncHooks = []),
				(n.didChangeStore = !0),
				(n.getSnapshot = () => {
					let r = !1;
					for (let o = 0; o < n.syncHooks.length; o += 1) {
						const i = n.syncHooks[o],
							l = i.selector(i.store.state, i.a1, i.a2, i.a3);
						(i.didChange || !Object.is(i.value, l)) &&
							((r = !0), (i.value = l), (i.didChange = !1));
					}
					return r && (n.syncTick += 1), n.syncTick;
				}));
	},
	after(n) {
		n.syncHooks.length > 0 &&
			(n.didChangeStore &&
				((n.didChangeStore = !1),
				(n.subscribe = (r) => {
					const o = new Set();
					for (const l of n.syncHooks) o.add(l.store);
					const i = [];
					for (const l of o) i.push(l.subscribe(r));
					return () => {
						for (const l of i) l();
					};
				})),
			rx.useSyncExternalStore(n.subscribe, n.getSnapshot, n.getSnapshot));
	},
});
function q3(n, r, o, i, l) {
	const u = jC();
	if (!u) return H3(n, r, o, i, l);
	const c = u.syncIndex;
	u.syncIndex += 1;
	let h;
	return (
		u.didInitialize
			? ((h = u.syncHooks[c]),
			  (h.store !== n ||
					h.selector !== r ||
					!Object.is(h.a1, o) ||
					!Object.is(h.a2, i) ||
					!Object.is(h.a3, l)) &&
					(h.store !== n && (u.didChangeStore = !0),
					(h.store = n),
					(h.selector = r),
					(h.a1 = o),
					(h.a2 = i),
					(h.a3 = l),
					(h.didChange = !0)))
			: ((h = {
					store: n,
					selector: r,
					a1: o,
					a2: i,
					a3: l,
					value: r(n.getSnapshot(), o, i, l),
					didChange: !1,
			  }),
			  u.syncHooks.push(h)),
		h.value
	);
}
function P3(n, r, o, i, l) {
	return j3.useSyncExternalStoreWithSelector(n.subscribe, n.getSnapshot, n.getSnapshot, (u) =>
		r(u, o, i, l)
	);
}
class V3 {
	constructor(r) {
		jt(
			this,
			"subscribe",
			(r) => (
				this.listeners.add(r),
				() => {
					this.listeners.delete(r);
				}
			)
		);
		jt(this, "getSnapshot", () => this.state);
		(this.state = r), (this.listeners = new Set()), (this.updateTick = 0);
	}
	setState(r) {
		if (this.state === r) return;
		(this.state = r), (this.updateTick += 1);
		const o = this.updateTick;
		for (const i of this.listeners) {
			if (o !== this.updateTick) return;
			i(r);
		}
	}
	update(r) {
		for (const o in r)
			if (!Object.is(this.state[o], r[o])) {
				this.setState(P(P({}, this.state), r));
				return;
			}
	}
	set(r, o) {
		Object.is(this.state[r], o) || this.setState(_e(P({}, this.state), { [r]: o }));
	}
	notifyAll() {
		const r = P({}, this.state);
		this.setState(r);
	}
	use(r, o, i, l) {
		return ox(this, r, o, i, l);
	}
}
class Tf extends V3 {
	constructor(r, o = {}, i) {
		super(r), (this.context = o), (this.selectors = i);
	}
	useSyncedValue(r, o) {
		v.useDebugValue(r),
			$e(() => {
				this.state[r] !== o && this.set(r, o);
			}, [r, o]);
	}
	useSyncedValueWithCleanup(r, o) {
		const i = this;
		$e(
			() => (
				i.state[r] !== o && i.set(r, o),
				() => {
					i.set(r, void 0);
				}
			),
			[i, r, o]
		);
	}
	useSyncedValues(r) {
		const o = this,
			i = Object.values(r);
		$e(() => {
			o.update(r);
		}, [o, ...i]);
	}
	useControlledProp(r, o) {
		v.useDebugValue(r);
		const i = o !== void 0;
		$e(() => {
			i && !Object.is(this.state[r], o) && super.setState(_e(P({}, this.state), { [r]: o }));
		}, [r, o, i]);
	}
	select(r, o, i, l) {
		const u = this.selectors[r];
		return u(this.state, o, i, l);
	}
	useState(r, o, i, l) {
		return v.useDebugValue(r), ox(this, this.selectors[r], o, i, l);
	}
	useContextCallback(r, o) {
		v.useDebugValue(r);
		const i = Ke(o != null ? o : Em);
		this.context[r] = i;
	}
	useStateSetter(r) {
		const o = v.useRef(void 0);
		return (
			o.current === void 0 &&
				(o.current = (i) => {
					this.set(r, i);
				}),
			o.current
		);
	}
	observe(r, o) {
		let i;
		typeof r == "function" ? (i = r) : (i = this.selectors[r]);
		let l = i(this.state);
		return (
			o(l, l, this),
			this.subscribe((u) => {
				const c = i(u);
				if (!Object.is(l, c)) {
					const h = l;
					(l = c), o(c, h, this);
				}
			})
		);
	}
}
const Y3 = {
	open: et((n) => n.open),
	domReferenceElement: et((n) => n.domReferenceElement),
	referenceElement: et((n) => {
		var r;
		return (r = n.positionReference) != null ? r : n.referenceElement;
	}),
	floatingElement: et((n) => n.floatingElement),
	floatingId: et((n) => n.floatingId),
};
class Dm extends Tf {
	constructor(o) {
		const p = o,
			{ nested: i, noEmit: l, onOpenChange: u, triggerElements: c } = p,
			h = Be(p, ["nested", "noEmit", "onOpenChange", "triggerElements"]);
		super(
			_e(P({}, h), {
				positionReference: h.referenceElement,
				domReferenceElement: h.referenceElement,
			}),
			{
				onOpenChange: u,
				dataRef: { current: {} },
				events: OS(),
				nested: i,
				noEmit: l,
				triggerElements: c,
			},
			Y3
		);
		jt(this, "setOpen", (o, i) => {
			var l, u;
			if (
				((!o || !this.state.open || mS(i.event)) &&
					(this.context.dataRef.current.openEvent = o ? i.event : void 0),
				!this.context.noEmit)
			) {
				const c = {
					open: o,
					reason: i.reason,
					nativeEvent: i.event,
					nested: this.context.nested,
					triggerElement: i.trigger,
				};
				this.context.events.emit("openchange", c);
			}
			(u = (l = this.context).onOpenChange) == null || u.call(l, o, i);
		});
	}
}
function Nm(n, r = !1, o = !1) {
	const [i, l] = v.useState(n && r ? "idle" : void 0),
		[u, c] = v.useState(n);
	return (
		n && !u && (c(!0), l("starting")),
		!n && u && i !== "ending" && !o && l("ending"),
		!n && !u && i === "ending" && l(void 0),
		$e(() => {
			if (!n && u && i !== "ending" && o) {
				const h = uo.request(() => {
					l("ending");
				});
				return () => {
					uo.cancel(h);
				};
			}
		}, [n, u, i, o]),
		$e(() => {
			if (!n || r) return;
			const h = uo.request(() => {
				l(void 0);
			});
			return () => {
				uo.cancel(h);
			};
		}, [r, n]),
		$e(() => {
			if (!n || !r) return;
			n && u && i !== "idle" && l("starting");
			const h = uo.request(() => {
				l("idle");
			});
			return () => {
				uo.cancel(h);
			};
		}, [r, n, u, l, i]),
		v.useMemo(() => ({ mounted: u, setMounted: c, transitionStatus: i }), [u, i])
	);
}
let Xl = (function (n) {
	return (n.startingStyle = "data-starting-style"), (n.endingStyle = "data-ending-style"), n;
})({});
const I3 = { [Xl.startingStyle]: "" },
	G3 = { [Xl.endingStyle]: "" },
	js = {
		transitionStatus(n) {
			return n === "starting" ? I3 : n === "ending" ? G3 : null;
		},
	};
function F3(n, r = !1, o = !0) {
	const i = Om();
	return Ke((l, u = null) => {
		i.cancel();
		function c() {
			mo.flushSync(l);
		}
		const h = Go(n);
		if (h == null) return;
		const p = h;
		if (typeof p.getAnimations != "function" || globalThis.BASE_UI_ANIMATIONS_DISABLED) l();
		else {
			let f = function () {
					const g = Xl.startingStyle;
					if (!p.hasAttribute(g)) {
						i.request(y);
						return;
					}
					const S = new MutationObserver(() => {
						p.hasAttribute(g) || (S.disconnect(), y());
					});
					S.observe(p, { attributes: !0, attributeFilter: [g] }),
						u == null ||
							u.addEventListener("abort", () => S.disconnect(), { once: !0 });
				},
				y = function () {
					Promise.all(p.getAnimations().map((g) => g.finished))
						.then(() => {
							(u != null && u.aborted) || c();
						})
						.catch(() => {
							const g = p.getAnimations();
							if (o) {
								if (u != null && u.aborted) return;
								c();
							} else
								g.length > 0 &&
									g.some((S) => S.pending || S.playState !== "finished") &&
									y();
						});
				};
			if (r) {
				f();
				return;
			}
			i.request(y);
		}
	});
}
function Bs(n) {
	const { enabled: r = !0, open: o, ref: i, onComplete: l } = n,
		u = Ke(l),
		c = F3(i, o, !1);
	v.useEffect(() => {
		if (!r) return;
		const h = new AbortController();
		return (
			c(u, h.signal),
			() => {
				h.abort();
			}
		);
	}, [r, o, u, c]);
}
function X3(n, r) {
	const o = v.useRef(null),
		i = v.useRef(null);
	return v.useCallback(
		(l) => {
			if (n !== void 0) {
				if (o.current !== null) {
					const u = o.current,
						c = i.current,
						h = r.context.triggerElements.getById(u);
					c && h === c && r.context.triggerElements.delete(u),
						(o.current = null),
						(i.current = null);
				}
				l !== null &&
					((o.current = n), (i.current = l), r.context.triggerElements.add(n, l));
			}
		},
		[r, n]
	);
}
function ax(n, r, o, i) {
	const l = o.useState("isMountedByTrigger", n),
		u = X3(n, o),
		c = Ke((h) => {
			if ((u(h), !h || !o.select("open"))) return;
			const p = o.select("activeTriggerId");
			if (p === n) {
				o.update(P({ activeTriggerElement: h }, i));
				return;
			}
			p == null && o.update(P({ activeTriggerId: n, activeTriggerElement: h }, i));
		});
	return (
		$e(() => {
			l && o.update(P({ activeTriggerElement: r.current }, i));
		}, [l, o, r, ...Object.values(i)]),
		{ registerTrigger: c, isMountedByThisTrigger: l }
	);
}
function Lm(n) {
	const r = n.useState("open");
	$e(() => {
		if (r && !n.select("activeTriggerId") && n.context.triggerElements.size === 1) {
			const o = n.context.triggerElements.entries().next();
			if (!o.done) {
				const [i, l] = o.value;
				n.update({ activeTriggerId: i, activeTriggerElement: l });
			}
		}
	}, [r, n]);
}
function zm(n, r, o) {
	const { mounted: i, setMounted: l, transitionStatus: u } = Nm(n);
	r.useSyncedValues({ mounted: i, transitionStatus: u });
	const c = Ke(() => {
			var p, f;
			l(!1),
				r.update({ activeTriggerId: null, activeTriggerElement: null, mounted: !1 }),
				o == null || o(),
				(f = (p = r.context).onOpenChangeComplete) == null || f.call(p, !1);
		}),
		h = r.useState("preventUnmountingOnClose");
	return (
		Bs({
			enabled: !h,
			open: n,
			ref: r.context.popupRef,
			onComplete() {
				n || c();
			},
		}),
		{ forceUnmount: c, transitionStatus: u }
	);
}
class tu {
	constructor() {
		(this.elementsSet = new Set()), (this.idMap = new Map());
	}
	add(r, o) {
		const i = this.idMap.get(r);
		i !== o &&
			(i !== void 0 && this.elementsSet.delete(i),
			this.elementsSet.add(o),
			this.idMap.set(r, o));
	}
	delete(r) {
		const o = this.idMap.get(r);
		o && (this.elementsSet.delete(o), this.idMap.delete(r));
	}
	hasElement(r) {
		return this.elementsSet.has(r);
	}
	hasMatchingElement(r) {
		for (const o of this.elementsSet) if (r(o)) return !0;
		return !1;
	}
	getById(r) {
		return this.idMap.get(r);
	}
	entries() {
		return this.idMap.entries();
	}
	elements() {
		return this.elementsSet.values();
	}
	get size() {
		return this.idMap.size;
	}
}
function K3() {
	return new Dm({
		open: !1,
		floatingElement: null,
		referenceElement: null,
		triggerElements: new tu(),
		floatingId: "",
		nested: !1,
		noEmit: !1,
		onOpenChange: void 0,
	});
}
function jm() {
	return {
		open: !1,
		openProp: void 0,
		mounted: !1,
		transitionStatus: "idle",
		floatingRootContext: K3(),
		preventUnmountingOnClose: !1,
		payload: void 0,
		activeTriggerId: null,
		activeTriggerElement: null,
		triggerIdProp: void 0,
		popupElement: null,
		positionerElement: null,
		activeTriggerProps: kn,
		inactiveTriggerProps: kn,
		popupProps: kn,
	};
}
const jc = et((n) => {
		var r;
		return (r = n.triggerIdProp) != null ? r : n.activeTriggerId;
	}),
	Bm = {
		open: et((n) => {
			var r;
			return (r = n.openProp) != null ? r : n.open;
		}),
		mounted: et((n) => n.mounted),
		transitionStatus: et((n) => n.transitionStatus),
		floatingRootContext: et((n) => n.floatingRootContext),
		preventUnmountingOnClose: et((n) => n.preventUnmountingOnClose),
		payload: et((n) => n.payload),
		activeTriggerId: jc,
		activeTriggerElement: et((n) => (n.mounted ? n.activeTriggerElement : null)),
		isTriggerActive: et((n, r) => r !== void 0 && jc(n) === r),
		isOpenedByTrigger: et((n, r) => r !== void 0 && jc(n) === r && n.open),
		isMountedByTrigger: et((n, r) => r !== void 0 && jc(n) === r && n.mounted),
		triggerProps: et((n, r) => (r ? n.activeTriggerProps : n.inactiveTriggerProps)),
		popupProps: et((n) => n.popupProps),
		popupElement: et((n) => n.popupElement),
		positionerElement: et((n) => n.positionerElement),
	};
function Q3(n) {
	const { open: r = !1, onOpenChange: o, elements: i = {} } = n,
		l = yi(),
		u = Wo() != null,
		c = Hn(() => {
			var h, p;
			return new Dm({
				open: r,
				onOpenChange: o,
				referenceElement: (h = i.reference) != null ? h : null,
				floatingElement: (p = i.floating) != null ? p : null,
				triggerElements: new tu(),
				floatingId: l,
				nested: u,
				noEmit: !1,
			});
		}).current;
	return (
		$e(() => {
			const h = { open: r, floatingId: l };
			i.reference !== void 0 &&
				((h.referenceElement = i.reference),
				(h.domReferenceElement = At(i.reference) ? i.reference : null)),
				i.floating !== void 0 && (h.floatingElement = i.floating),
				c.update(h);
		}, [r, l, i.reference, i.floating, c]),
		(c.context.onOpenChange = o),
		(c.context.nested = u),
		(c.context.noEmit = !1),
		c
	);
}
function Z3(n = {}) {
	const { nodeId: r, externalTree: o } = n,
		i = Q3(n),
		l = n.rootContext || i,
		u = {
			reference: l.useState("referenceElement"),
			floating: l.useState("floatingElement"),
			domReference: l.useState("domReferenceElement"),
		},
		[c, h] = v.useState(null),
		p = v.useRef(null),
		f = Ha(o);
	$e(() => {
		u.domReference && (p.current = u.domReference);
	}, [u.domReference]);
	const y = u3(_e(P({}, n), { elements: P(P({}, u), c && { reference: c }) })),
		g = v.useCallback(
			(H) => {
				const U = At(H)
					? {
							getBoundingClientRect: () => H.getBoundingClientRect(),
							getClientRects: () => H.getClientRects(),
							contextElement: H,
					  }
					: H;
				h(U), y.refs.setReference(U);
			},
			[y.refs]
		),
		[S, b] = v.useState(null),
		[w, R] = v.useState(null);
	l.useSyncedValue("referenceElement", S),
		l.useSyncedValue("domReferenceElement", At(S) ? S : null),
		l.useSyncedValue("floatingElement", w);
	const O = v.useCallback(
			(H) => {
				(At(H) || H === null) && ((p.current = H), b(H)),
					(At(y.refs.reference.current) ||
						y.refs.reference.current === null ||
						(H !== null && !At(H))) &&
						y.refs.setReference(H);
			},
			[y.refs, b]
		),
		T = v.useCallback(
			(H) => {
				R(H), y.refs.setFloating(H);
			},
			[y.refs]
		),
		L = v.useMemo(
			() =>
				_e(P({}, y.refs), {
					setReference: O,
					setFloating: T,
					setPositionReference: g,
					domReference: p,
				}),
			[y.refs, O, T, g]
		),
		M = v.useMemo(
			() => _e(P({}, y.elements), { domReference: u.domReference }),
			[y.elements, u.domReference]
		),
		_ = l.useState("open"),
		N = l.useState("floatingId"),
		D = v.useMemo(
			() =>
				_e(P({}, y), {
					dataRef: l.context.dataRef,
					open: _,
					onOpenChange: l.setOpen,
					events: l.context.events,
					floatingId: N,
					refs: L,
					elements: M,
					nodeId: r,
					rootStore: l,
				}),
			[y, L, M, r, l, _, N]
		);
	return (
		$e(() => {
			l.context.dataRef.current.floatingContext = D;
			const H = f == null ? void 0 : f.nodesRef.current.find((U) => U.id === r);
			H && (H.context = D);
		}),
		v.useMemo(
			() => _e(P({}, y), { context: D, refs: L, elements: M, rootStore: l }),
			[y, L, M, D, l]
		)
	);
}
function Um(n) {
	const {
			popupStore: r,
			noEmit: o = !1,
			treatPopupAsFloatingElement: i = !1,
			onOpenChange: l,
		} = n,
		u = yi(),
		c = Wo() != null,
		h = r.useState("open"),
		p = r.useState("activeTriggerElement"),
		f = r.useState(i ? "popupElement" : "positionerElement"),
		y = r.context.triggerElements,
		g = Hn(
			() =>
				new Dm({
					open: h,
					referenceElement: p,
					floatingElement: f,
					triggerElements: y,
					onOpenChange: l,
					floatingId: u,
					nested: c,
					noEmit: o,
				})
		).current;
	return (
		$e(() => {
			const S = { open: h, floatingId: u, referenceElement: p, floatingElement: f };
			At(p) && (S.domReferenceElement = p),
				g.state.positionReference === g.state.referenceElement &&
					(S.positionReference = p),
				g.update(S);
		}, [h, u, p, f, g]),
		(g.context.onOpenChange = l),
		(g.context.nested = c),
		(g.context.noEmit = o),
		g
	);
}
const up = eO && lS;
function ix(n, r = {}) {
	const o = "rootStore" in n ? n.rootStore : n,
		{ events: i, dataRef: l } = o.context,
		{ enabled: u = !0, delay: c } = r,
		h = v.useRef(!1),
		p = v.useRef(null),
		f = mr(),
		y = v.useRef(!0);
	v.useEffect(() => {
		const S = o.select("domReferenceElement");
		if (!u) return;
		const b = Sn(S);
		function w() {
			const T = o.select("domReferenceElement");
			!o.select("open") && nn(T) && T === Qr(kt(T)) && (h.current = !0);
		}
		function R() {
			y.current = !0;
		}
		function O() {
			y.current = !1;
		}
		return (
			b.addEventListener("blur", w),
			up && (b.addEventListener("keydown", R, !0), b.addEventListener("pointerdown", O, !0)),
			() => {
				b.removeEventListener("blur", w),
					up &&
						(b.removeEventListener("keydown", R, !0),
						b.removeEventListener("pointerdown", O, !0));
			}
		);
	}, [o, u]),
		v.useEffect(() => {
			if (!u) return;
			function S(b) {
				if (b.reason === Es || b.reason === Ef) {
					const w = o.select("domReferenceElement");
					At(w) && ((p.current = w), (h.current = !0));
				}
			}
			return (
				i.on("openchange", S),
				() => {
					i.off("openchange", S);
				}
			);
		}, [i, u, o]);
	const g = v.useMemo(
		() => ({
			onMouseLeave() {
				(h.current = !1), (p.current = null);
			},
			onFocus(S) {
				const b = S.currentTarget;
				if (h.current) {
					if (p.current === b) return;
					(h.current = !1), (p.current = null);
				}
				const w = In(S.nativeEvent);
				if (At(w)) {
					if (up && !S.relatedTarget) {
						if (!y.current && !wf(w)) return;
					} else if (!aO(w)) return;
				}
				const R = tf(S.relatedTarget, o.context.triggerElements),
					{ nativeEvent: O, currentTarget: T } = S,
					L = typeof c == "function" ? c() : c;
				if ((o.select("open") && R) || L === 0 || L === void 0) {
					o.setOpen(!0, gt(bs, O, T));
					return;
				}
				f.start(L, () => {
					h.current || o.setOpen(!0, gt(bs, O, T));
				});
			},
			onBlur(S) {
				(h.current = !1), (p.current = null);
				const b = S.relatedTarget,
					w = S.nativeEvent,
					R =
						At(b) &&
						b.hasAttribute(Ts("focus-guard")) &&
						b.getAttribute("data-type") === "outside";
				f.start(0, () => {
					var M;
					const O = o.select("domReferenceElement"),
						T = Qr(O ? O.ownerDocument : document);
					if (
						(!b && T === O) ||
						ft(
							(M = l.current.floatingContext) == null
								? void 0
								: M.refs.floating.current,
							T
						) ||
						ft(O, T) ||
						R
					)
						return;
					const L = b != null ? b : T;
					tf(L, o.context.triggerElements) || o.setOpen(!1, gt(bs, w));
				});
			},
		}),
		[l, o, f, c]
	);
	return v.useMemo(() => (u ? { reference: g, trigger: g } : {}), [u, g]);
}
const Fp = Ts("safe-polygon"),
	J3 = `button,a,[role="button"],select,[tabindex]:not([tabindex="-1"]),${dS}`;
function W3(n) {
	return n ? !!n.closest(J3) : !1;
}
class Hm {
	constructor() {
		jt(this, "dispose", () => {
			this.openChangeTimeout.clear(), this.restTimeout.clear();
		});
		jt(this, "disposeEffect", () => this.dispose);
		(this.pointerType = void 0),
			(this.interactedInside = !1),
			(this.handler = void 0),
			(this.blockMouseMove = !0),
			(this.performedPointerEventsMutation = !1),
			(this.unbindMouseMove = () => {}),
			(this.restTimeoutPending = !1),
			(this.openChangeTimeout = new go()),
			(this.restTimeout = new go()),
			(this.handleCloseOptions = void 0);
	}
	static create() {
		return new Hm();
	}
}
function sx(n) {
	const r = Hn(Hm.create).current,
		o = n.context.dataRef.current;
	return (
		o.hoverInteractionState || (o.hoverInteractionState = r),
		pm(o.hoverInteractionState.disposeEffect),
		o.hoverInteractionState
	);
}
const $3 = new Set(["click", "mousedown"]);
function lx(n, r = {}) {
	const o = "rootStore" in n ? n.rootStore : n,
		i = o.useState("open"),
		l = o.useState("floatingElement"),
		u = o.useState("domReferenceElement"),
		{ dataRef: c } = o.context,
		{ enabled: h = !0, closeDelay: p = 0 } = r,
		f = sx(o),
		y = Ha(),
		g = Wo(),
		S = Ke(() =>
			f.interactedInside ? !0 : c.current.openEvent ? $3.has(c.current.openEvent.type) : !1
		),
		b = Ke(() => {
			var _;
			const M = (_ = c.current.openEvent) == null ? void 0 : _.type;
			return (M == null ? void 0 : M.includes("mouse")) && M !== "mousedown";
		}),
		w = Ke((M) => tf(M, o.context.triggerElements)),
		R = v.useCallback(
			(M, _ = !0) => {
				const N = eA(p, f.pointerType);
				N && !f.handler
					? f.openChangeTimeout.start(N, () => o.setOpen(!1, gt(Gn, M)))
					: _ && (f.openChangeTimeout.clear(), o.setOpen(!1, gt(Gn, M)));
			},
			[p, o, f]
		),
		O = Ke(() => {
			f.unbindMouseMove(), (f.handler = void 0);
		}),
		T = Ke(() => {
			if (f.performedPointerEventsMutation) {
				const M = kt(l).body;
				(M.style.pointerEvents = ""),
					M.removeAttribute(Fp),
					(f.performedPointerEventsMutation = !1);
			}
		}),
		L = Ke((M) => {
			const _ = In(M);
			if (!W3(_)) {
				f.interactedInside = !1;
				return;
			}
			f.interactedInside = !0;
		});
	$e(() => {
		i ||
			((f.pointerType = void 0),
			(f.restTimeoutPending = !1),
			(f.interactedInside = !1),
			O(),
			T());
	}, [i, f, O, T]),
		v.useEffect(
			() => () => {
				O();
			},
			[O]
		),
		v.useEffect(() => T, [T]),
		$e(() => {
			var M, _, N;
			if (
				h &&
				i &&
				(M = f.handleCloseOptions) != null &&
				M.blockPointerEvents &&
				b() &&
				At(u) &&
				l
			) {
				f.performedPointerEventsMutation = !0;
				const D = kt(l).body;
				D.setAttribute(Fp, "");
				const H = u,
					U = l,
					fe =
						(N =
							(_ =
								y == null
									? void 0
									: y.nodesRef.current.find((we) => we.id === g)) == null
								? void 0
								: _.context) == null
							? void 0
							: N.elements.floating;
				return (
					fe && (fe.style.pointerEvents = ""),
					(D.style.pointerEvents = "none"),
					(H.style.pointerEvents = "auto"),
					(U.style.pointerEvents = "auto"),
					() => {
						(D.style.pointerEvents = ""),
							(H.style.pointerEvents = ""),
							(U.style.pointerEvents = "");
					}
				);
			}
		}, [h, i, u, l, f, b, y, g]),
		v.useEffect(() => {
			if (!h) return;
			function M(H) {
				S() ||
					!c.current.floatingContext ||
					!o.select("open") ||
					w(H.relatedTarget) ||
					(T(), O(), S() || R(H));
			}
			function _(H) {
				var U;
				f.openChangeTimeout.clear(), T(), (U = f.handler) == null || U.call(f, H), O();
			}
			function N(H) {
				S() || R(H, !1);
			}
			const D = l;
			return (
				D &&
					(D.addEventListener("mouseleave", M),
					D.addEventListener("mouseenter", _),
					D.addEventListener("mouseleave", N),
					D.addEventListener("pointerdown", L, !0)),
				() => {
					D &&
						(D.removeEventListener("mouseleave", M),
						D.removeEventListener("mouseenter", _),
						D.removeEventListener("mouseleave", N),
						D.removeEventListener("pointerdown", L, !0));
				}
			);
		}, [h, l, o, c, S, w, R, T, O, L, f]);
}
function eA(n, r) {
	return r && !mi(r) ? 0 : typeof n == "function" ? n() : n;
}
function cp(n) {
	return typeof n == "function" ? n() : n;
}
const tA = { current: null };
function ux(n, r = {}) {
	var we;
	const o = "rootStore" in n ? n.rootStore : n,
		{ dataRef: i, events: l } = o.context,
		{
			enabled: u = !0,
			delay: c = 0,
			handleClose: h = null,
			mouseOnly: p = !1,
			restMs: f = 0,
			move: y = !0,
			triggerElementRef: g = tA,
			externalTree: S,
			isActiveTrigger: b = !0,
		} = r,
		w = Ha(S),
		R = sx(o),
		O = Fn(h),
		T = Fn(c),
		L = Fn(f),
		M = Fn(u);
	b && (R.handleCloseOptions = (we = O.current) == null ? void 0 : we.__options);
	const _ = Ke(() =>
			R.interactedInside
				? !0
				: i.current.openEvent
				? ["click", "mousedown"].includes(i.current.openEvent.type)
				: !1
		),
		N = Ke((se) => tf(se, o.context.triggerElements)),
		D = v.useCallback(
			(se, Y = !0) => {
				const oe = Zc(T.current, "close", R.pointerType);
				oe && !R.handler
					? R.openChangeTimeout.start(oe, () => o.setOpen(!1, gt(Gn, se)))
					: Y && (R.openChangeTimeout.clear(), o.setOpen(!1, gt(Gn, se)));
			},
			[T, o, R]
		),
		H = Ke(() => {
			R.unbindMouseMove(), (R.handler = void 0);
		}),
		U = Ke(() => {
			if (R.performedPointerEventsMutation) {
				const se = kt(o.select("domReferenceElement")).body;
				(se.style.pointerEvents = ""),
					se.removeAttribute(Fp),
					(R.performedPointerEventsMutation = !1);
			}
		});
	v.useEffect(() => {
		if (!u) return;
		function se(Y) {
			Y.open ||
				(R.openChangeTimeout.clear(),
				R.restTimeout.clear(),
				(R.blockMouseMove = !0),
				(R.restTimeoutPending = !1));
		}
		return (
			l.on("openchange", se),
			() => {
				l.off("openchange", se);
			}
		);
	}, [u, l, R]);
	const fe = Ke((se) => {
		var oe;
		if (_() || !i.current.floatingContext || N(se.relatedTarget)) return;
		const Y = g.current;
		(oe = O.current) == null ||
			oe.call(
				O,
				_e(P({}, i.current.floatingContext), {
					tree: w,
					x: se.clientX,
					y: se.clientY,
					onClose() {
						U(), H(), !_() && Y === o.select("domReferenceElement") && D(se);
					},
				})
			)(se);
	});
	return (
		v.useEffect(() => {
			var ge;
			if (!u) return;
			const se = (ge = g.current) != null ? ge : b ? o.select("domReferenceElement") : null;
			if (!At(se)) return;
			function Y(j) {
				var ie;
				if (
					(R.openChangeTimeout.clear(),
					(R.blockMouseMove = !1),
					(p && !mi(R.pointerType)) || (cp(L.current) > 0 && !Zc(T.current, "open")))
				)
					return;
				const I = Zc(T.current, "open", R.pointerType),
					F = o.select("domReferenceElement"),
					pe = o.context.triggerElements,
					J =
						(pe.hasElement(j.target) ||
							pe.hasMatchingElement((me) => ft(me, j.target))) &&
						(!F || !ft(F, j.target)),
					B = (ie = j.currentTarget) != null ? ie : null,
					Z = o.select("open"),
					ee = !Z || J;
				J && Z
					? o.setOpen(!0, gt(Gn, j, B))
					: I
					? R.openChangeTimeout.start(I, () => {
							ee && o.setOpen(!0, gt(Gn, j, B));
					  })
					: ee && o.setOpen(!0, gt(Gn, j, B));
			}
			function oe(j) {
				if (_()) {
					U();
					return;
				}
				R.unbindMouseMove();
				const I = o.select("domReferenceElement"),
					F = kt(I);
				if ((R.restTimeout.clear(), (R.restTimeoutPending = !1), N(j.relatedTarget)))
					return;
				if (O.current && i.current.floatingContext) {
					o.select("open") || R.openChangeTimeout.clear();
					const J = g.current;
					R.handler = O.current(
						_e(P({}, i.current.floatingContext), {
							tree: w,
							x: j.clientX,
							y: j.clientY,
							onClose() {
								U(),
									H(),
									M.current &&
										!_() &&
										J === o.select("domReferenceElement") &&
										D(j, !0);
							},
						})
					);
					const B = R.handler;
					B(j),
						F.addEventListener("mousemove", B),
						(R.unbindMouseMove = () => {
							F.removeEventListener("mousemove", B);
						});
					return;
				}
				(R.pointerType !== "touch" || !ft(o.select("floatingElement"), j.relatedTarget)) &&
					D(j);
			}
			function xe(j) {
				fe(j);
			}
			return (
				o.select("open") && se.addEventListener("mouseleave", xe),
				y && se.addEventListener("mousemove", Y, { once: !0 }),
				se.addEventListener("mouseenter", Y),
				se.addEventListener("mouseleave", oe),
				() => {
					se.removeEventListener("mouseleave", xe),
						y && se.removeEventListener("mousemove", Y),
						se.removeEventListener("mouseenter", Y),
						se.removeEventListener("mouseleave", oe);
				}
			);
		}, [H, U, i, T, D, o, u, O, fe, R, b, _, N, p, y, L, g, w, M]),
		v.useMemo(() => {
			if (!u) return;
			function se(Y) {
				R.pointerType = Y.pointerType;
			}
			return {
				onPointerDown: se,
				onPointerEnter: se,
				onMouseMove(Y) {
					const { nativeEvent: oe } = Y,
						xe = Y.currentTarget,
						ge = o.select("domReferenceElement"),
						j = o.context.triggerElements,
						I = o.select("open"),
						F =
							(j.hasElement(Y.target) ||
								j.hasMatchingElement((J) => ft(J, Y.target))) &&
							(!ge || !ft(ge, Y.target));
					if (
						(p && !mi(R.pointerType)) ||
						(I && !F) ||
						cp(L.current) === 0 ||
						(!F && R.restTimeoutPending && _h(Y.movementX, 2) + _h(Y.movementY, 2) < 2)
					)
						return;
					R.restTimeout.clear();
					function pe() {
						if (((R.restTimeoutPending = !1), _())) return;
						const J = o.select("open");
						!R.blockMouseMove && (!J || F) && o.setOpen(!0, gt(Gn, oe, xe));
					}
					R.pointerType === "touch"
						? mo.flushSync(() => {
								pe();
						  })
						: F && I
						? pe()
						: ((R.restTimeoutPending = !0), R.restTimeout.start(cp(L.current), pe));
				},
			};
		}, [u, R, _, p, o, L])
	);
}
function Cf(n = []) {
	const r = n.map((f) => (f == null ? void 0 : f.reference)),
		o = n.map((f) => (f == null ? void 0 : f.floating)),
		i = n.map((f) => (f == null ? void 0 : f.item)),
		l = n.map((f) => (f == null ? void 0 : f.trigger)),
		u = v.useCallback((f) => Bc(f, n, "reference"), r),
		c = v.useCallback((f) => Bc(f, n, "floating"), o),
		h = v.useCallback((f) => Bc(f, n, "item"), i),
		p = v.useCallback((f) => Bc(f, n, "trigger"), l);
	return v.useMemo(
		() => ({ getReferenceProps: u, getFloatingProps: c, getItemProps: h, getTriggerProps: p }),
		[u, c, h, p]
	);
}
function Bc(n, r, o) {
	var c;
	const i = new Map(),
		l = o === "item",
		u = {};
	o === "floating" && ((u.tabIndex = -1), (u[jp] = ""));
	for (const h in n) (l && n && (h === cS || h === fS)) || (u[h] = n[h]);
	for (let h = 0; h < r.length; h += 1) {
		let p;
		const f = (c = r[h]) == null ? void 0 : c[o];
		typeof f == "function" ? (p = n ? f(n) : null) : (p = f), p && zv(u, p, l, i);
	}
	return zv(u, n, l, i), u;
}
function zv(n, r, o, i) {
	var l;
	for (const u in r) {
		const c = r[u];
		(o && (u === cS || u === fS)) ||
			(u.startsWith("on")
				? (i.has(u) || i.set(u, []),
				  typeof c == "function" &&
						((l = i.get(u)) == null || l.push(c),
						(n[u] = (...h) => {
							var p;
							return (p = i.get(u)) == null
								? void 0
								: p.map((f) => f(...h)).find((f) => f !== void 0);
						})))
				: (n[u] = c));
	}
}
const nA = "Escape";
function Of(n, r, o) {
	switch (n) {
		case "vertical":
			return r;
		case "horizontal":
			return o;
		default:
			return r || o;
	}
}
function Uc(n, r) {
	return Of(r, n === ym || n === $l, n === La || n === za);
}
function fp(n, r, o) {
	return Of(r, n === $l, o ? n === La : n === za) || n === "Enter" || n === " " || n === "";
}
function rA(n, r, o) {
	return Of(r, o ? n === La : n === za, n === $l);
}
function oA(n, r, o, i) {
	const l = o ? n === za : n === La,
		u = n === ym;
	return r === "both" || (r === "horizontal" && i && i > 1) ? n === nA : Of(r, l, u);
}
function aA(n, r) {
	const o = "rootStore" in n ? n.rootStore : n,
		i = o.useState("open"),
		l = o.useState("floatingElement"),
		u = o.useState("domReferenceElement"),
		c = o.context.dataRef,
		{
			listRef: h,
			activeIndex: p,
			onNavigate: f = () => {},
			enabled: y = !0,
			selectedIndex: g = null,
			allowEscape: S = !1,
			loopFocus: b = !1,
			nested: w = !1,
			rtl: R = !1,
			virtual: O = !1,
			focusItemOnOpen: T = "auto",
			focusItemOnHover: L = !0,
			openOnArrowKeyDown: M = !0,
			disabledIndices: _ = void 0,
			orientation: N = "vertical",
			parentOrientation: D,
			cols: H = 1,
			id: U,
			resetOnPointerLeave: fe = !0,
			externalTree: we,
		} = r,
		se = nf(l),
		Y = Fn(se),
		oe = Wo(),
		xe = Ha(we);
	$e(() => {
		c.current.orientation = N;
	}, [c, N]);
	const ge = Bp(u),
		j = v.useRef(T),
		I = v.useRef(g != null ? g : -1),
		F = v.useRef(null),
		pe = v.useRef(!0),
		J = Ke((le) => {
			f(I.current === -1 ? null : I.current, le);
		}),
		B = v.useRef(J),
		Z = v.useRef(!!l),
		ee = v.useRef(i),
		ie = v.useRef(!1),
		me = v.useRef(!1),
		ve = Fn(_),
		ke = Fn(i),
		je = Fn(g),
		Ee = Fn(fe),
		Qe = Ke(() => {
			function le(Ye) {
				O
					? xe == null || xe.events.emit("virtualfocus", Ye)
					: Yl(Ye, { sync: ie.current, preventScroll: !0 });
			}
			const Ae = h.current[I.current],
				Se = me.current;
			Ae && le(Ae),
				(ie.current ? (Ye) => Ye() : requestAnimationFrame)(() => {
					var X;
					const Ye = h.current[I.current] || Ae;
					if (!Ye) return;
					Ae || le(Ye),
						re &&
							(Se || !pe.current) &&
							((X = Ye.scrollIntoView) == null ||
								X.call(Ye, { block: "nearest", inline: "nearest" }));
				});
		});
	$e(() => {
		y &&
			(i && l
				? ((I.current = g != null ? g : -1),
				  j.current && g != null && ((me.current = !0), J()))
				: Z.current && ((I.current = -1), B.current()));
	}, [y, i, l, g, J]),
		$e(() => {
			if (y) {
				if (!i) {
					ie.current = !1;
					return;
				}
				if (l)
					if (p == null) {
						if (((ie.current = !1), je.current != null)) return;
						if (
							(Z.current && ((I.current = -1), Qe()),
							(!ee.current || !Z.current) &&
								j.current &&
								(F.current != null || (j.current === !0 && F.current == null)))
						) {
							let le = 0;
							const Ae = () => {
								h.current[0] == null
									? (le < 2 && (le ? requestAnimationFrame : queueMicrotask)(Ae),
									  (le += 1))
									: ((I.current =
											F.current == null || fp(F.current, N, R) || w
												? ep(h)
												: cv(h)),
									  (F.current = null),
									  J());
							};
							Ae();
						}
					} else Pl(h, p) || ((I.current = p), Qe(), (me.current = !1));
			}
		}, [y, i, l, p, je, w, h, N, R, J, Qe, ve]),
		$e(() => {
			var Ye, qe;
			if (!y || l || !xe || O || !Z.current) return;
			const le = xe.nodesRef.current,
				Ae =
					(qe = (Ye = le.find((X) => X.id === oe)) == null ? void 0 : Ye.context) == null
						? void 0
						: qe.elements.floating,
				Se = Qr(kt(l)),
				Ue = le.some((X) => X.context && ft(X.context.elements.floating, Se));
			Ae && !Ue && pe.current && Ae.focus({ preventScroll: !0 });
		}, [y, l, xe, oe, O]),
		$e(() => {
			(B.current = J), (ee.current = i), (Z.current = !!l);
		}),
		$e(() => {
			i || ((F.current = null), (j.current = T));
		}, [i, T]);
	const it = p != null,
		re = v.useMemo(() => {
			function le(Se) {
				if (!ke.current) return;
				const Ue = h.current.indexOf(Se.currentTarget);
				Ue !== -1 && I.current !== Ue && ((I.current = Ue), J(Se));
			}
			return {
				onFocus(Se) {
					(ie.current = !0), le(Se);
				},
				onClick: ({ currentTarget: Se }) => Se.focus({ preventScroll: !0 }),
				onMouseMove(Se) {
					(ie.current = !0), (me.current = !1), L && le(Se);
				},
				onPointerLeave(Se) {
					var Ye;
					if (!ke.current || !pe.current || Se.pointerType === "touch") return;
					ie.current = !0;
					const Ue = Se.relatedTarget;
					!L ||
						h.current.includes(Ue) ||
						(Ee.current &&
							(Yl(null, { sync: !0 }),
							(I.current = -1),
							J(Se),
							O || (Ye = Y.current) == null || Ye.focus({ preventScroll: !0 })));
				},
			};
		}, [ke, Y, L, h, J, Ee, O]),
		ce = v.useCallback(() => {
			var le, Ae, Se;
			return D != null
				? D
				: (Se =
						(Ae =
							(le =
								xe == null
									? void 0
									: xe.nodesRef.current.find((Ue) => Ue.id === oe)) == null
								? void 0
								: le.context) == null
							? void 0
							: Ae.dataRef) == null
				? void 0
				: Se.current.orientation;
		}, [oe, xe, D]),
		de = Ke((le) => {
			if (
				((pe.current = !1),
				(ie.current = !0),
				le.which === 229 || (!ke.current && le.currentTarget === Y.current))
			)
				return;
			if (w && oA(le.key, N, R, H)) {
				Uc(le.key, ce()) || Un(le),
					o.setOpen(!1, gt(Kc, le.nativeEvent)),
					nn(u) && (O ? xe == null || xe.events.emit("virtualfocus", u) : u.focus());
				return;
			}
			const Ae = I.current,
				Se = ep(h, _),
				Ue = cv(h, _);
			if (
				(ge ||
					(le.key === "Home" && (Un(le), (I.current = Se), J(le)),
					le.key === "End" && (Un(le), (I.current = Ue), J(le))),
				H > 1)
			) {
				const Ye = Array.from({ length: h.current.length }, () => ({
						width: 1,
						height: 1,
					})),
					qe = vO(Ye, H),
					X = qe.findIndex((st) => st != null && !Vl(h, st, _)),
					Pe = qe.reduce((st, Mt, wt) => (Mt != null && !Vl(h, Mt, _) ? wt : st), -1),
					Jt =
						qe[
							bO(
								{ current: qe.map((st) => (st != null ? h.current[st] : null)) },
								{
									event: le,
									orientation: N,
									loopFocus: b,
									rtl: R,
									cols: H,
									disabledIndices: xO(
										[
											...((typeof _ != "function" ? _ : null) ||
												h.current.map((st, Mt) =>
													Vl(h, Mt, _) ? Mt : void 0
												)),
											void 0,
										],
										qe
									),
									minIndex: X,
									maxIndex: Pe,
									prevIndex: SO(
										I.current > Ue ? Se : I.current,
										Ye,
										qe,
										H,
										le.key === $l
											? "bl"
											: le.key === (R ? La : za)
											? "tr"
											: "tl"
									),
									stopEvent: !0,
								}
							)
						];
				if ((Jt != null && ((I.current = Jt), J(le)), N === "both")) return;
			}
			if (Uc(le.key, N)) {
				if ((Un(le), i && !O && Qr(le.currentTarget.ownerDocument) === le.currentTarget)) {
					(I.current = fp(le.key, N, R) ? Se : Ue), J(le);
					return;
				}
				fp(le.key, N, R)
					? b
						? Ae >= Ue
							? S && Ae !== h.current.length
								? (I.current = -1)
								: ((ie.current = !1), (I.current = Se))
							: (I.current = Bn(h, { startingIndex: Ae, disabledIndices: _ }))
						: (I.current = Math.min(
								Ue,
								Bn(h, { startingIndex: Ae, disabledIndices: _ })
						  ))
					: b
					? Ae <= Se
						? S && Ae !== -1
							? (I.current = h.current.length)
							: ((ie.current = !1), (I.current = Ue))
						: (I.current = Bn(h, {
								startingIndex: Ae,
								decrement: !0,
								disabledIndices: _,
						  }))
					: (I.current = Math.max(
							Se,
							Bn(h, { startingIndex: Ae, decrement: !0, disabledIndices: _ })
					  )),
					Pl(h, I.current) && (I.current = -1),
					J(le);
			}
		}),
		Te = v.useMemo(
			() => O && i && it && { "aria-activedescendant": `${U}-${p}` },
			[O, i, it, U, p]
		),
		Re = v.useMemo(
			() =>
				_e(P({ "aria-orientation": N === "both" ? void 0 : N }, ge ? {} : Te), {
					onKeyDown(le) {
						if (le.key === "Tab" && le.shiftKey && i && !O) {
							const Ae = In(le.nativeEvent);
							if (Ae && !ft(Y.current, Ae)) return;
							Un(le), o.setOpen(!1, gt(Rs, le.nativeEvent)), nn(u) && u.focus();
							return;
						}
						de(le);
					},
					onPointerMove() {
						pe.current = !0;
					},
				}),
			[Te, de, Y, N, ge, o, i, O, u]
		),
		ze = v.useMemo(() => {
			function le(Se) {
				T === "auto" && hS(Se.nativeEvent) && (j.current = !O);
			}
			function Ae(Se) {
				(j.current = T), T === "auto" && pS(Se.nativeEvent) && (j.current = !0);
			}
			return {
				onKeyDown(Se) {
					const Ue = o.select("open");
					pe.current = !1;
					const Ye = Se.key.startsWith("Arrow"),
						qe = rA(Se.key, ce(), R),
						X = Uc(Se.key, N),
						Pe = (w ? qe : X) || Se.key === "Enter" || Se.key.trim() === "";
					if (O && Ue) return de(Se);
					if (!(!Ue && !M && Ye)) {
						if (Pe) {
							const Jt = Uc(Se.key, ce());
							F.current = w && Jt ? null : Se.key;
						}
						if (w) {
							qe &&
								(Un(Se),
								Ue
									? ((I.current = ep(h, ve.current)), J(Se))
									: o.setOpen(!0, gt(Kc, Se.nativeEvent, Se.currentTarget)));
							return;
						}
						X &&
							(je.current != null && (I.current = je.current),
							Un(Se),
							!Ue && M
								? o.setOpen(!0, gt(Kc, Se.nativeEvent, Se.currentTarget))
								: de(Se),
							Ue && J(Se));
					}
				},
				onFocus(Se) {
					o.select("open") && !O && ((I.current = -1), J(Se));
				},
				onPointerDown: Ae,
				onPointerEnter: Ae,
				onMouseDown: le,
				onClick: le,
			};
		}, [de, ve, T, h, w, J, o, M, N, ce, R, je, O]),
		Ce = v.useMemo(() => P(P({}, Te), ze), [Te, ze]);
	return v.useMemo(
		() => (y ? { reference: Ce, floating: Re, item: re, trigger: ze } : {}),
		[y, Ce, Re, ze, re]
	);
}
const iA = new Map([
	["select", "listbox"],
	["combobox", "listbox"],
	["label", !1],
]);
function cx(n, r = {}) {
	var L;
	const o = "rootStore" in n ? n.rootStore : n,
		i = o.useState("open"),
		l = o.useState("floatingId"),
		u = o.useState("domReferenceElement"),
		c = o.useState("floatingElement"),
		{ role: h = "dialog" } = r,
		p = yi(),
		f = (u == null ? void 0 : u.id) || p,
		y = v.useMemo(() => {
			var M;
			return ((M = nf(c)) == null ? void 0 : M.id) || l;
		}, [c, l]),
		g = (L = iA.get(h)) != null ? L : h,
		b = Wo() != null,
		w = v.useMemo(
			() =>
				g === "tooltip" || h === "label"
					? kn
					: P(
							P(
								P(
									P(
										{
											"aria-haspopup": g === "alertdialog" ? "dialog" : g,
											"aria-expanded": "false",
										},
										g === "listbox" && { role: "combobox" }
									),
									g === "menu" && b && { role: "menuitem" }
								),
								h === "select" && { "aria-autocomplete": "none" }
							),
							h === "combobox" && { "aria-autocomplete": "list" }
					  ),
			[g, b, h]
		),
		R = v.useMemo(
			() =>
				g === "tooltip" || h === "label"
					? { [`aria-${h === "label" ? "labelledby" : "describedby"}`]: i ? y : void 0 }
					: P(
							_e(P({}, w), {
								"aria-expanded": i ? "true" : "false",
								"aria-controls": i ? y : void 0,
							}),
							g === "menu" && { id: f }
					  ),
			[g, y, i, f, h, w]
		),
		O = v.useMemo(() => {
			const M = P({ id: y }, g && { role: g });
			return g === "tooltip" || h === "label"
				? M
				: P(P({}, M), g === "menu" && { "aria-labelledby": f });
		}, [g, y, f, h]),
		T = v.useCallback(
			({ active: M, selected: _ }) => {
				const N = P({ role: "option" }, M && { id: `${y}-fui-option` });
				switch (h) {
					case "select":
					case "combobox":
						return _e(P({}, N), { "aria-selected": _ });
				}
				return {};
			},
			[y, h]
		);
	return v.useMemo(() => ({ reference: R, floating: O, item: T, trigger: w }), [R, O, w, T]);
}
function sA(n, r) {
	var N;
	const o = "rootStore" in n ? n.rootStore : n,
		i = o.context.dataRef,
		l = o.useState("open"),
		{
			listRef: u,
			activeIndex: c,
			onMatch: h,
			onTypingChange: p,
			enabled: f = !0,
			resetMs: y = 750,
			selectedIndex: g = null,
		} = r,
		S = mr(),
		b = v.useRef(""),
		w = v.useRef((N = g != null ? g : c) != null ? N : -1),
		R = v.useRef(null);
	$e(() => {
		(!l && g !== null) ||
			(S.clear(), (R.current = null), b.current !== "" && (b.current = ""));
	}, [l, g, S]),
		$e(() => {
			var D;
			l && b.current === "" && (w.current = (D = g != null ? g : c) != null ? D : -1);
		}, [l, g, c]);
	const O = Ke((D) => {
			D
				? i.current.typing || ((i.current.typing = D), p == null || p(D))
				: i.current.typing && ((i.current.typing = D), p == null || p(D));
		}),
		T = Ke((D) => {
			var oe, xe;
			function H(ge, j, I) {
				const F = j.find(
					(pe) =>
						(pe == null
							? void 0
							: pe.toLocaleLowerCase().indexOf(I.toLocaleLowerCase())) === 0
				);
				return F ? ge.indexOf(F) : -1;
			}
			const U = u.current;
			if (
				(b.current.length > 0 &&
					b.current[0] !== " " &&
					(H(U, U, b.current) === -1 ? O(!1) : D.key === " " && Un(D)),
				U == null || D.key.length !== 1 || D.ctrlKey || D.metaKey || D.altKey)
			)
				return;
			l && D.key !== " " && (Un(D), O(!0));
			const fe = b.current === "";
			fe && (w.current = (oe = g != null ? g : c) != null ? oe : -1),
				U.every((ge) => {
					var j, I;
					return ge
						? ((j = ge[0]) == null ? void 0 : j.toLocaleLowerCase()) !==
								((I = ge[1]) == null ? void 0 : I.toLocaleLowerCase())
						: !0;
				}) &&
					b.current === D.key &&
					((b.current = ""), (w.current = R.current)),
				(b.current += D.key),
				S.start(y, () => {
					(b.current = ""), (w.current = R.current), O(!1);
				});
			const se = fe ? ((xe = g != null ? g : c) != null ? xe : -1) : w.current,
				Y = H(U, [...U.slice((se || 0) + 1), ...U.slice(0, (se || 0) + 1)], b.current);
			Y !== -1
				? (h == null || h(Y), (R.current = Y))
				: D.key !== " " && ((b.current = ""), O(!1));
		}),
		L = Ke((D) => {
			const H = D.relatedTarget,
				U = o.select("domReferenceElement"),
				fe = o.select("floatingElement"),
				we = ft(U, H),
				se = ft(fe, H);
			we || se || (S.clear(), (b.current = ""), (w.current = R.current), O(!1));
		}),
		M = v.useMemo(() => ({ onKeyDown: T, onBlur: L }), [T, L]),
		_ = v.useMemo(
			() => ({
				onKeyDown: T,
				onKeyUp(D) {
					D.key === " " && O(!1);
				},
				onBlur: L,
			}),
			[T, L, O]
		);
	return v.useMemo(() => (f ? { reference: M, floating: _ } : {}), [f, M, _]);
}
function jv(n, r) {
	const [o, i] = n;
	let l = !1;
	const u = r.length;
	for (let c = 0, h = u - 1; c < u; h = c++) {
		const [p, f] = r[c] || [0, 0],
			[y, g] = r[h] || [0, 0];
		f >= i != g >= i && o <= ((y - p) * (i - f)) / (g - f) + p && (l = !l);
	}
	return l;
}
function lA(n, r) {
	return n[0] >= r.x && n[0] <= r.x + r.width && n[1] >= r.y && n[1] <= r.y + r.height;
}
function fx(n = {}) {
	const { buffer: r = 0.5, blockPointerEvents: o = !1, requireIntent: i = !0 } = n,
		l = new go();
	let u = !1,
		c = null,
		h = null,
		p = typeof performance != "undefined" ? performance.now() : 0;
	function f(g, S) {
		const b = performance.now(),
			w = b - p;
		if (c === null || h === null || w === 0) return (c = g), (h = S), (p = b), null;
		const R = g - c,
			O = S - h,
			L = Math.sqrt(R * R + O * O) / w;
		return (c = g), (h = S), (p = b), L;
	}
	const y = ({ x: g, y: S, placement: b, elements: w, onClose: R, nodeId: O, tree: T }) =>
		function (M) {
			function _() {
				l.clear(), R();
			}
			if ((l.clear(), !w.domReference || !w.floating || b == null || g == null || S == null))
				return;
			const { clientX: N, clientY: D } = M,
				H = [N, D],
				U = In(M),
				fe = M.type === "mouseleave",
				we = ft(w.floating, U),
				se = ft(w.domReference, U),
				Y = w.domReference.getBoundingClientRect(),
				oe = w.floating.getBoundingClientRect(),
				xe = b.split("-")[0],
				ge = g > oe.right - oe.width / 2,
				j = S > oe.bottom - oe.height / 2,
				I = lA(H, Y),
				F = oe.width > Y.width,
				pe = oe.height > Y.height,
				J = (F ? Y : oe).left,
				B = (F ? Y : oe).right,
				Z = (pe ? Y : oe).top,
				ee = (pe ? Y : oe).bottom;
			if (we && ((u = !0), !fe)) return;
			if ((se && (u = !1), se && !fe)) {
				u = !0;
				return;
			}
			if (
				(fe && At(M.relatedTarget) && ft(w.floating, M.relatedTarget)) ||
				(T &&
					pi(T.nodesRef.current, O).some(({ context: ve }) =>
						ve == null ? void 0 : ve.open
					))
			)
				return;
			if (
				(xe === "top" && S >= Y.bottom - 1) ||
				(xe === "bottom" && S <= Y.top + 1) ||
				(xe === "left" && g >= Y.right - 1) ||
				(xe === "right" && g <= Y.left + 1)
			)
				return _();
			let ie = [];
			switch (xe) {
				case "top":
					ie = [
						[J, Y.top + 1],
						[J, oe.bottom - 1],
						[B, oe.bottom - 1],
						[B, Y.top + 1],
					];
					break;
				case "bottom":
					ie = [
						[J, oe.top + 1],
						[J, Y.bottom - 1],
						[B, Y.bottom - 1],
						[B, oe.top + 1],
					];
					break;
				case "left":
					ie = [
						[oe.right - 1, ee],
						[oe.right - 1, Z],
						[Y.left + 1, Z],
						[Y.left + 1, ee],
					];
					break;
				case "right":
					ie = [
						[Y.right - 1, ee],
						[Y.right - 1, Z],
						[oe.left + 1, Z],
						[oe.left + 1, ee],
					];
					break;
			}
			function me([ve, ke]) {
				switch (xe) {
					case "top": {
						const je = [F ? ve + r / 2 : ge ? ve + r * 4 : ve - r * 4, ke + r + 1],
							Ee = [F ? ve - r / 2 : ge ? ve + r * 4 : ve - r * 4, ke + r + 1],
							Qe = [
								[oe.left, ge || F ? oe.bottom - r : oe.top],
								[oe.right, ge ? (F ? oe.bottom - r : oe.top) : oe.bottom - r],
							];
						return [je, Ee, ...Qe];
					}
					case "bottom": {
						const je = [F ? ve + r / 2 : ge ? ve + r * 4 : ve - r * 4, ke - r],
							Ee = [F ? ve - r / 2 : ge ? ve + r * 4 : ve - r * 4, ke - r],
							Qe = [
								[oe.left, ge || F ? oe.top + r : oe.bottom],
								[oe.right, ge ? (F ? oe.top + r : oe.bottom) : oe.top + r],
							];
						return [je, Ee, ...Qe];
					}
					case "left": {
						const je = [ve + r + 1, pe ? ke + r / 2 : j ? ke + r * 4 : ke - r * 4],
							Ee = [ve + r + 1, pe ? ke - r / 2 : j ? ke + r * 4 : ke - r * 4];
						return [
							...[
								[j || pe ? oe.right - r : oe.left, oe.top],
								[j ? (pe ? oe.right - r : oe.left) : oe.right - r, oe.bottom],
							],
							je,
							Ee,
						];
					}
					case "right": {
						const je = [ve - r, pe ? ke + r / 2 : j ? ke + r * 4 : ke - r * 4],
							Ee = [ve - r, pe ? ke - r / 2 : j ? ke + r * 4 : ke - r * 4],
							Qe = [
								[j || pe ? oe.left + r : oe.right, oe.top],
								[j ? (pe ? oe.left + r : oe.right) : oe.left + r, oe.bottom],
							];
						return [je, Ee, ...Qe];
					}
					default:
						return [];
				}
			}
			if (!jv([N, D], ie)) {
				if (u && !I) return _();
				if (!fe && i) {
					const ve = f(M.clientX, M.clientY);
					if (ve !== null && ve < 0.1) return _();
				}
				jv([N, D], me([g, S])) ? !u && i && l.start(40, _) : _();
			}
		};
	return (y.__options = { blockPointerEvents: o }), y;
}
const uA = _e(P({}, Bm), {
	disabled: et((n) => n.disabled),
	instantType: et((n) => n.instantType),
	isInstantPhase: et((n) => n.isInstantPhase),
	trackCursorAxis: et((n) => n.trackCursorAxis),
	disableHoverablePopup: et((n) => n.disableHoverablePopup),
	lastOpenChangeReason: et((n) => n.openChangeReason),
	closeDelay: et((n) => n.closeDelay),
	hasViewport: et((n) => n.hasViewport),
});
class qm extends Tf {
	constructor(o) {
		super(
			P(P({}, cA()), o),
			{
				popupRef: v.createRef(),
				onOpenChange: void 0,
				onOpenChangeComplete: void 0,
				triggerElements: new tu(),
			},
			uA
		);
		jt(this, "setOpen", (o, i) => {
			var f, y;
			const l = i.reason,
				u = l === Gn,
				c = o && l === bs,
				h = !o && (l === Es || l === Ef);
			if (
				((i.preventUnmountOnClose = () => {
					this.set("preventUnmountingOnClose", !0);
				}),
				(y = (f = this.context).onOpenChange) == null || y.call(f, o, i),
				i.isCanceled)
			)
				return;
			const p = () => {
				var b, w, R;
				const g = { open: o, openChangeReason: l };
				c
					? (g.instantType = "focus")
					: h
					? (g.instantType = "dismiss")
					: l === Gn && (g.instantType = void 0);
				const S = (w = (b = i.trigger) == null ? void 0 : b.id) != null ? w : null;
				(S || o) &&
					((g.activeTriggerId = S),
					(g.activeTriggerElement = (R = i.trigger) != null ? R : null)),
					this.update(g);
			};
			u ? mo.flushSync(p) : p();
		});
	}
	static useStore(o, i) {
		const l = Hn(() => new qm(i)).current,
			u = o != null ? o : l,
			c = Um({ popupStore: u, onOpenChange: u.setOpen });
		return (u.state.floatingRootContext = c), u;
	}
}
function cA() {
	return _e(P({}, jm()), {
		disabled: !1,
		instantType: void 0,
		isInstantPhase: !1,
		trackCursorAxis: "none",
		disableHoverablePopup: !1,
		openChangeReason: null,
		closeDelay: 0,
		hasViewport: !1,
	});
}
const fA = dm(function (r) {
	const {
			disabled: o = !1,
			defaultOpen: i = !1,
			open: l,
			disableHoverablePopup: u = !1,
			trackCursorAxis: c = "none",
			actionsRef: h,
			onOpenChange: p,
			onOpenChangeComplete: f,
			handle: y,
			triggerId: g,
			defaultTriggerId: S = null,
			children: b,
		} = r,
		w = qm.useStore(y == null ? void 0 : y.store, {
			open: i,
			openProp: l,
			activeTriggerId: S,
			triggerIdProp: g,
		});
	hm(() => {
		l === void 0 &&
			w.state.open === !1 &&
			i === !0 &&
			w.update({ open: !0, activeTriggerId: S });
	}),
		w.useControlledProp("openProp", l),
		w.useControlledProp("triggerIdProp", g),
		w.useContextCallback("onOpenChange", p),
		w.useContextCallback("onOpenChangeComplete", f);
	const R = w.useState("open"),
		O = !o && R,
		T = w.useState("activeTriggerId"),
		L = w.useState("payload");
	w.useSyncedValues({ trackCursorAxis: c, disableHoverablePopup: u }),
		$e(() => {
			R && o && w.setOpen(!1, gt(WO));
		}, [R, o, w]),
		w.useSyncedValue("disabled", o),
		Lm(w);
	const { forceUnmount: M, transitionStatus: _ } = zm(O, w),
		N = w.useState("isInstantPhase"),
		D = w.useState("instantType"),
		H = w.useState("lastOpenChangeReason"),
		U = v.useRef(null);
	$e(() => {
		(_ === "ending" && H === Rm) || (_ !== "ending" && N)
			? (D !== "delay" && (U.current = D), w.set("instantType", "delay"))
			: U.current !== null && (w.set("instantType", U.current), (U.current = null));
	}, [_, N, H, D, w]),
		$e(() => {
			O && T == null && w.set("payload", void 0);
		}, [w, T, O]);
	const fe = v.useCallback(() => {
		w.setOpen(!1, dA(w, Cm));
	}, [w]);
	v.useImperativeHandle(h, () => ({ unmount: M, close: fe }), [M, fe]);
	const we = w.useState("floatingRootContext"),
		se = _m(we, { enabled: !o, referencePress: !0 }),
		Y = A5(we, { enabled: !o && c !== "none", axis: c === "none" ? void 0 : c }),
		{ getReferenceProps: oe, getFloatingProps: xe, getTriggerProps: ge } = Cf([se, Y]),
		j = v.useMemo(() => oe(), [oe]),
		I = v.useMemo(() => ge(), [ge]),
		F = v.useMemo(() => xe(), [xe]);
	return (
		w.useSyncedValues({ activeTriggerProps: j, inactiveTriggerProps: I, popupProps: F }),
		K.jsx(nS.Provider, { value: w, children: typeof b == "function" ? b({ payload: L }) : b })
	);
});
function dA(n, r) {
	const o = gt(r);
	return (
		(o.preventUnmountOnClose = () => {
			n.set("preventUnmountingOnClose", !0);
		}),
		o
	);
}
let di = (function (n) {
		return (
			(n.open = "data-open"),
			(n.closed = "data-closed"),
			(n[(n.startingStyle = Xl.startingStyle)] = "startingStyle"),
			(n[(n.endingStyle = Xl.endingStyle)] = "endingStyle"),
			(n.anchorHidden = "data-anchor-hidden"),
			(n.side = "data-side"),
			(n.align = "data-align"),
			n
		);
	})({}),
	hf = (function (n) {
		return (n.popupOpen = "data-popup-open"), (n.pressed = "data-pressed"), n;
	})({});
const hA = { [hf.popupOpen]: "" },
	pA = { [hf.popupOpen]: "", [hf.pressed]: "" },
	mA = { [di.open]: "" },
	gA = { [di.closed]: "" },
	yA = { [di.anchorHidden]: "" },
	bA = {
		open(n) {
			return n ? hA : null;
		},
	},
	Bv = {
		open(n) {
			return n ? pA : null;
		},
	},
	bi = {
		open(n) {
			return n ? mA : gA;
		},
		anchorHidden(n) {
			return n ? yA : null;
		},
	};
function nu(n) {
	return yi(n, "base-ui");
}
const dx = v.createContext(void 0);
function vA() {
	return v.useContext(dx);
}
let SA = (function (n) {
	return (
		(n[(n.popupOpen = hf.popupOpen)] = "popupOpen"),
		(n.triggerDisabled = "data-trigger-disabled"),
		n
	);
})({});
const xA = 600,
	wA = tS(function (r, o) {
		var B;
		const J = r,
			{
				className: i,
				render: l,
				handle: u,
				payload: c,
				disabled: h,
				delay: p,
				closeDelay: f,
				id: y,
			} = J,
			g = Be(J, [
				"className",
				"render",
				"handle",
				"payload",
				"disabled",
				"delay",
				"closeDelay",
				"id",
			]),
			S = Wl(!0),
			b = (B = u == null ? void 0 : u.store) != null ? B : S;
		if (!b) throw new Error(Xn(82));
		const w = nu(y),
			R = b.useState("isTriggerActive", w),
			O = b.useState("isOpenedByTrigger", w),
			T = b.useState("floatingRootContext"),
			L = v.useRef(null),
			M = p != null ? p : xA,
			_ = f != null ? f : 0,
			{ registerTrigger: N, isMountedByThisTrigger: D } = ax(w, L, b, {
				payload: c,
				closeDelay: _,
			}),
			H = vA(),
			{ delayRef: U, isInstantPhase: fe, hasProvider: we } = e5(T, { open: O });
		b.useSyncedValue("isInstantPhase", fe);
		const se = b.useState("disabled"),
			Y = h != null ? h : se,
			oe = b.useState("trackCursorAxis"),
			xe = b.useState("disableHoverablePopup"),
			ge = ux(T, {
				enabled: !Y,
				mouseOnly: !0,
				move: !1,
				handleClose: !xe && oe !== "both" ? fx() : null,
				restMs() {
					var me;
					const Z = H == null ? void 0 : H.delay,
						ee = typeof U.current == "object" ? U.current.open : void 0;
					let ie = M;
					return (
						we &&
							(ee !== 0
								? (ie = (me = p != null ? p : Z) != null ? me : M)
								: (ie = 0)),
						ie
					);
				},
				delay() {
					const Z = typeof U.current == "object" ? U.current.close : void 0;
					let ee = _;
					return f == null && we && (ee = Z), { close: ee };
				},
				triggerElementRef: L,
				isActiveTrigger: R,
			}),
			j = ix(T, { enabled: !Y }).reference,
			I = { open: O },
			F = b.useState("triggerProps", D);
		return fn("button", r, {
			state: I,
			ref: [o, N, L],
			props: [ge, j, F, { id: w, [SA.triggerDisabled]: Y ? "" : void 0 }, g],
			stateAttributesMapping: bA,
		});
	}),
	hx = v.createContext(void 0);
function EA() {
	const n = v.useContext(hx);
	if (n === void 0) throw new Error(Xn(70));
	return n;
}
const RA = v.forwardRef(function (r, o) {
		const y = r,
			{ children: i, container: l, className: u, render: c } = y,
			h = Be(y, ["children", "container", "className", "render"]),
			{ portalNode: p, portalSubtree: f } = YS({
				container: l,
				ref: o,
				componentProps: r,
				elementProps: h,
			});
		return !f && !p ? null : K.jsxs(v.Fragment, { children: [f, p && mo.createPortal(i, p)] });
	}),
	TA = v.forwardRef(function (r, o) {
		const p = r,
			{ keepMounted: i = !1 } = p,
			l = Be(p, ["keepMounted"]);
		return Wl().useState("mounted") || i
			? K.jsx(hx.Provider, { value: i, children: K.jsx(RA, P({ ref: o }, l)) })
			: null;
	}),
	px = v.createContext(void 0);
function mx() {
	const n = v.useContext(px);
	if (n === void 0) throw new Error(Xn(71));
	return n;
}
const CA = v.createContext(void 0);
function gx() {
	var r;
	const n = v.useContext(CA);
	return (r = n == null ? void 0 : n.direction) != null ? r : "ltr";
}
const OA = (n) => ({
		name: "arrow",
		options: n,
		fn(o) {
			return Et(this, null, function* () {
				var J, B;
				const {
						x: i,
						y: l,
						placement: u,
						rects: c,
						platform: h,
						elements: p,
						middlewareData: f,
					} = o,
					{ element: y, padding: g = 0, offsetParent: S = "real" } = Zo(n, o) || {};
				if (y == null) return {};
				const b = gS(g),
					w = { x: i, y: l },
					R = Sm(u),
					O = vm(R),
					T = yield h.getDimensions(y),
					L = R === "y",
					M = L ? "top" : "left",
					_ = L ? "bottom" : "right",
					N = L ? "clientHeight" : "clientWidth",
					D = c.reference[O] + c.reference[R] - w[R] - c.floating[O],
					H = w[R] - c.reference[R],
					U =
						S === "real"
							? yield (J = h.getOffsetParent) == null ? void 0 : J.call(h, y)
							: p.floating;
				let fe = p.floating[N] || c.floating[O];
				(!fe || !(yield (B = h.isElement) == null ? void 0 : B.call(h, U))) &&
					(fe = p.floating[N] || c.floating[O]);
				const we = D / 2 - H / 2,
					se = fe / 2 - T[O] / 2 - 1,
					Y = Math.min(b[M], se),
					oe = Math.min(b[_], se),
					xe = Y,
					ge = fe - T[O] - oe,
					j = fe / 2 - T[O] / 2 + we,
					I = Up(xe, j, ge),
					F =
						!f.arrow &&
						Ua(u) != null &&
						j !== I &&
						c.reference[O] / 2 - (j < xe ? Y : oe) - T[O] / 2 < 0,
					pe = F ? (j < xe ? j - xe : j - ge) : 0;
				return {
					[R]: w[R] + pe,
					data: P({ [R]: I, centerOffset: j - I - pe }, F && { alignmentOffset: pe }),
					reset: F,
				};
			});
		},
	}),
	AA = (n, r) => _e(P({}, OA(n)), { options: [n, r] }),
	MA = {
		name: "hide",
		fn(n) {
			return Et(this, null, function* () {
				var h;
				const { width: r, height: o, x: i, y: l } = n.rects.reference,
					u = r === 0 && o === 0 && i === 0 && l === 0;
				return {
					data: {
						referenceHidden:
							((h = (yield m3().fn(n)).data) == null ? void 0 : h.referenceHidden) ||
							u,
					},
				};
			});
		},
	},
	Wc = { sideX: "left", sideY: "top" },
	kA = {
		name: "adaptiveOrigin",
		fn(n) {
			return Et(this, null, function* () {
				var L, M;
				const {
						x: r,
						y: o,
						rects: { floating: i },
						elements: { floating: l },
						platform: u,
						strategy: c,
						placement: h,
					} = n,
					p = Sn(l),
					f = p.getComputedStyle(l);
				if (!(f.transitionDuration !== "0s" && f.transitionDuration !== ""))
					return { x: r, y: o, data: Wc };
				const g = yield (L = u.getOffsetParent) == null ? void 0 : L.call(u, l);
				let S = { width: 0, height: 0 };
				if (c === "fixed" && p != null && p.visualViewport)
					S = { width: p.visualViewport.width, height: p.visualViewport.height };
				else if (g === p) {
					const _ = kt(l);
					S = {
						width: _.documentElement.clientWidth,
						height: _.documentElement.clientHeight,
					};
				} else
					(yield (M = u.isElement) == null ? void 0 : M.call(u, g)) &&
						(S = yield u.getDimensions(g));
				const b = rr(h);
				let w = r,
					R = o;
				b === "left" && (w = S.width - (r + i.width)),
					b === "top" && (R = S.height - (o + i.height));
				const O = b === "left" ? "right" : Wc.sideX,
					T = b === "top" ? "bottom" : Wc.sideY;
				return { x: w, y: R, data: { sideX: O, sideY: T } };
			});
		},
	};
function yx(n, r, o) {
	const i = n === "inline-start" || n === "inline-end";
	return {
		top: "top",
		right: i ? (o ? "inline-start" : "inline-end") : "right",
		bottom: "bottom",
		left: i ? (o ? "inline-end" : "inline-start") : "left",
	}[r];
}
function Uv(n, r, o) {
	const { rects: i, placement: l } = n;
	return {
		side: yx(r, rr(l), o),
		align: Ua(l) || "center",
		anchor: { width: i.reference.width, height: i.reference.height },
		positioner: { width: i.floating.width, height: i.floating.height },
	};
}
function bx(n) {
	var br, hn;
	const {
			anchor: r,
			positionMethod: o = "absolute",
			side: i = "bottom",
			sideOffset: l = 0,
			align: u = "center",
			alignOffset: c = 0,
			collisionBoundary: h,
			collisionPadding: p = 5,
			sticky: f = !1,
			arrowPadding: y = 5,
			disableAnchorTracking: g = !1,
			keepMounted: S = !1,
			floatingRootContext: b,
			mounted: w,
			collisionAvoidance: R,
			shiftCrossAxis: O = !1,
			nodeId: T,
			adaptiveOrigin: L,
			lazyFlip: M = !1,
			externalTree: _,
		} = n,
		[N, D] = v.useState(null);
	!w && N !== null && D(null);
	const H = R.side || "flip",
		U = R.align || "flip",
		fe = R.fallbackAxisSide || "end",
		we = typeof r == "function" ? r : void 0,
		se = Ke(we),
		Y = we ? se : r,
		oe = Fn(r),
		ge = gx() === "rtl",
		j =
			N ||
			{
				top: "top",
				right: "right",
				bottom: "bottom",
				left: "left",
				"inline-end": ge ? "left" : "right",
				"inline-start": ge ? "right" : "left",
			}[i],
		I = u === "center" ? j : `${j}-${u}`;
	let F = p;
	const pe = 1,
		J = i === "bottom" ? pe : 0,
		B = i === "top" ? pe : 0,
		Z = i === "right" ? pe : 0,
		ee = i === "left" ? pe : 0;
	typeof F == "number"
		? (F = { top: F + J, right: F + ee, bottom: F + B, left: F + Z })
		: F &&
		  (F = {
				top: (F.top || 0) + J,
				right: (F.right || 0) + ee,
				bottom: (F.bottom || 0) + B,
				left: (F.left || 0) + Z,
		  });
	const ie = { boundary: h === "clipping-ancestors" ? "clippingAncestors" : h, padding: F },
		me = v.useRef(null),
		ve = Fn(l),
		ke = Fn(c),
		Qe = [
			c3(
				(lt) => {
					const _t = Uv(lt, i, ge),
						en = typeof ve.current == "function" ? ve.current(_t) : ve.current,
						It = typeof ke.current == "function" ? ke.current(_t) : ke.current;
					return { mainAxis: en, crossAxis: It, alignmentAxis: It };
				},
				[typeof l != "function" ? l : 0, typeof c != "function" ? c : 0, ge, i]
			),
		],
		it = U === "none" && H !== "shift",
		re = !it && (f || O || H === "shift"),
		ce =
			H === "none"
				? null
				: h3(
						_e(P({}, ie), {
							padding: {
								top: F.top + pe,
								right: F.right + pe,
								bottom: F.bottom + pe,
								left: F.left + pe,
							},
							mainAxis: !O && H === "flip",
							crossAxis: U === "flip" ? "alignment" : !1,
							fallbackAxisSideDirection: fe,
						})
				  ),
		de = it
			? null
			: f3(
					(lt) => {
						const _t = kt(lt.elements.floating).documentElement;
						return _e(P({}, ie), {
							rootBoundary: O
								? { x: 0, y: 0, width: _t.clientWidth, height: _t.clientHeight }
								: void 0,
							mainAxis: U !== "none",
							crossAxis: re,
							limiter:
								f || O
									? void 0
									: d3((en) => {
											if (!me.current) return {};
											const { width: It, height: Gt } =
													me.current.getBoundingClientRect(),
												Je = zr(rr(en.placement)),
												xt = Je === "y" ? It : Gt,
												Pt =
													Je === "y"
														? F.left + F.right
														: F.top + F.bottom;
											return { offset: xt / 2 + Pt / 2 };
									  }),
						});
					},
					[ie, f, O, F, U]
			  );
	H === "shift" || U === "shift" || u === "center" ? Qe.push(de, ce) : Qe.push(ce, de),
		Qe.push(
			p3(
				_e(P({}, ie), {
					apply({
						elements: { floating: lt },
						rects: { reference: _t },
						availableWidth: en,
						availableHeight: It,
					}) {
						const Gt = lt.style;
						Gt.setProperty("--available-width", `${en}px`),
							Gt.setProperty("--available-height", `${It}px`),
							Gt.setProperty("--anchor-width", `${_t.width}px`),
							Gt.setProperty("--anchor-height", `${_t.height}px`);
					},
				})
			),
			AA(
				() => ({
					element: me.current || document.createElement("div"),
					padding: y,
					offsetParent: "floating",
				}),
				[y]
			),
			{
				name: "transformOrigin",
				fn(lt) {
					var sn, ar, $o;
					const {
							elements: _t,
							middlewareData: en,
							placement: It,
							rects: Gt,
							y: Je,
						} = lt,
						xt = rr(It),
						Pt = zr(xt),
						Dt = me.current,
						Kn = ((sn = en.arrow) == null ? void 0 : sn.x) || 0,
						Nt = ((ar = en.arrow) == null ? void 0 : ar.y) || 0,
						Cn = (Dt == null ? void 0 : Dt.clientWidth) || 0,
						Br = (Dt == null ? void 0 : Dt.clientHeight) || 0,
						pn = Kn + Cn / 2,
						xn = Nt + Br / 2,
						Xt = Math.abs((($o = en.shift) == null ? void 0 : $o.y) || 0),
						Pn = Gt.reference.height / 2,
						Ur = typeof l == "function" ? l(Uv(lt, i, ge)) : l,
						wi = Xt > Ur,
						or = {
							top: `${pn}px calc(100% + ${Ur}px)`,
							bottom: `${pn}px ${-Ur}px`,
							left: `calc(100% + ${Ur}px) ${xn}px`,
							right: `${-Ur}px ${xn}px`,
						}[xt],
						an = `${pn}px ${Gt.reference.y + Pn - Je}px`;
					return (
						_t.floating.style.setProperty(
							"--transform-origin",
							re && Pt === "y" && wi ? an : or
						),
						{}
					);
				},
			},
			MA,
			L
		),
		$e(() => {
			!w &&
				b &&
				b.update({
					referenceElement: null,
					floatingElement: null,
					domReferenceElement: null,
				});
		}, [w, b]);
	const Te = v.useMemo(
			() => ({
				elementResize: !g && typeof ResizeObserver != "undefined",
				layoutShift: !g && typeof IntersectionObserver != "undefined",
			}),
			[g]
		),
		{
			refs: Re,
			elements: ze,
			x: Ce,
			y: le,
			middlewareData: Ae,
			update: Se,
			placement: Ue,
			context: Ye,
			isPositioned: qe,
			floatingStyles: X,
		} = Z3({
			rootContext: b,
			placement: I,
			middleware: Qe,
			strategy: o,
			whileElementsMounted: S ? void 0 : (...lt) => Ov(...lt, Te),
			nodeId: T,
			externalTree: _,
		}),
		{ sideX: Pe, sideY: Jt } = Ae.adaptiveOrigin || Wc,
		st = qe ? o : "fixed",
		Mt = v.useMemo(() => {
			const lt = L ? { position: st, [Pe]: Ce, [Jt]: le } : P({ position: st }, X);
			return qe || (lt.opacity = 0), lt;
		}, [L, st, Pe, Ce, Jt, le, X, qe]),
		wt = v.useRef(null);
	$e(() => {
		if (!w) return;
		const lt = oe.current,
			_t = typeof lt == "function" ? lt() : lt,
			It = (Hv(_t) ? _t.current : _t) || null || null;
		It !== wt.current && (Re.setPositionReference(It), (wt.current = It));
	}, [w, Re, Y, oe]),
		v.useEffect(() => {
			if (!w) return;
			const lt = oe.current;
			typeof lt != "function" &&
				Hv(lt) &&
				lt.current !== wt.current &&
				(Re.setPositionReference(lt.current), (wt.current = lt.current));
		}, [w, Re, Y, oe]),
		v.useEffect(() => {
			if (S && w && ze.domReference && ze.floating)
				return Ov(ze.domReference, ze.floating, Se, Te);
		}, [S, w, ze, Se, Te]);
	const dn = rr(Ue),
		Tn = yx(i, dn, ge),
		qn = Ua(Ue) || "center",
		Ze = !!((br = Ae.hide) != null && br.referenceHidden);
	$e(() => {
		M && w && qe && D(dn);
	}, [M, w, qe, dn]);
	const rt = v.useMemo(() => {
			var lt, _t;
			return {
				position: "absolute",
				top: (lt = Ae.arrow) == null ? void 0 : lt.y,
				left: (_t = Ae.arrow) == null ? void 0 : _t.x,
			};
		}, [Ae.arrow]),
		ht = ((hn = Ae.arrow) == null ? void 0 : hn.centerOffset) !== 0;
	return v.useMemo(
		() => ({
			positionerStyles: Mt,
			arrowStyles: rt,
			arrowRef: me,
			arrowUncentered: ht,
			side: Tn,
			align: qn,
			physicalSide: dn,
			anchorHidden: Ze,
			refs: Re,
			context: Ye,
			isPositioned: qe,
			update: Se,
		}),
		[Mt, rt, me, ht, Tn, qn, dn, Ze, Re, Ye, qe, Se]
	);
}
function Hv(n) {
	return n != null && "current" in n;
}
function Af(n) {
	return n === "starting" ? FO : kn;
}
const _A = v.forwardRef(function (r, o) {
		const I = r,
			{
				render: i,
				className: l,
				anchor: u,
				positionMethod: c = "absolute",
				side: h = "top",
				align: p = "center",
				sideOffset: f = 0,
				alignOffset: y = 0,
				collisionBoundary: g = "clipping-ancestors",
				collisionPadding: S = 5,
				arrowPadding: b = 5,
				sticky: w = !1,
				disableAnchorTracking: R = !1,
				collisionAvoidance: O = _S,
			} = I,
			T = Be(I, [
				"render",
				"className",
				"anchor",
				"positionMethod",
				"side",
				"align",
				"sideOffset",
				"alignOffset",
				"collisionBoundary",
				"collisionPadding",
				"arrowPadding",
				"sticky",
				"disableAnchorTracking",
				"collisionAvoidance",
			]),
			L = Wl(),
			M = EA(),
			_ = L.useState("open"),
			N = L.useState("mounted"),
			D = L.useState("trackCursorAxis"),
			H = L.useState("disableHoverablePopup"),
			U = L.useState("floatingRootContext"),
			fe = L.useState("instantType"),
			we = L.useState("transitionStatus"),
			se = L.useState("hasViewport"),
			Y = bx({
				anchor: u,
				positionMethod: c,
				floatingRootContext: U,
				mounted: N,
				side: h,
				sideOffset: f,
				align: p,
				alignOffset: y,
				collisionBoundary: g,
				collisionPadding: S,
				sticky: w,
				arrowPadding: b,
				disableAnchorTracking: R,
				keepMounted: M,
				collisionAvoidance: O,
				adaptiveOrigin: se ? kA : void 0,
			}),
			oe = v.useMemo(() => {
				const F = {};
				return (
					(!_ || D === "both" || H) && (F.pointerEvents = "none"),
					{ role: "presentation", hidden: !N, style: P(P({}, Y.positionerStyles), F) }
				);
			}, [_, D, H, N, Y.positionerStyles]),
			xe = v.useMemo(
				() => ({
					open: _,
					side: Y.side,
					align: Y.align,
					anchorHidden: Y.anchorHidden,
					instant: D !== "none" ? "tracking-cursor" : fe,
				}),
				[_, Y.side, Y.align, Y.anchorHidden, D, fe]
			),
			ge = v.useMemo(
				() =>
					_e(P({}, xe), {
						arrowRef: Y.arrowRef,
						arrowStyles: Y.arrowStyles,
						arrowUncentered: Y.arrowUncentered,
					}),
				[xe, Y.arrowRef, Y.arrowStyles, Y.arrowUncentered]
			),
			j = fn("div", r, {
				state: xe,
				props: [oe, Af(we), T],
				ref: [o, L.useStateSetter("positionerElement")],
				stateAttributesMapping: bi,
			});
		return K.jsx(px.Provider, { value: ge, children: j });
	}),
	DA = P(P({}, bi), js),
	NA = v.forwardRef(function (r, o) {
		const L = r,
			{ className: i, render: l } = L,
			u = Be(L, ["className", "render"]),
			c = Wl(),
			{ side: h, align: p } = mx(),
			f = c.useState("open"),
			y = c.useState("instantType"),
			g = c.useState("transitionStatus"),
			S = c.useState("popupProps"),
			b = c.useState("floatingRootContext");
		Bs({
			open: f,
			ref: c.context.popupRef,
			onComplete() {
				var M, _;
				f && ((_ = (M = c.context).onOpenChangeComplete) == null || _.call(M, !0));
			},
		});
		const w = c.useState("disabled"),
			R = c.useState("closeDelay");
		return (
			lx(b, { enabled: !w, closeDelay: R }),
			fn("div", r, {
				state: { open: f, side: h, align: p, instant: y, transitionStatus: g },
				ref: [o, c.context.popupRef, c.useStateSetter("popupElement")],
				props: [S, Af(g), u],
				stateAttributesMapping: DA,
			})
		);
	}),
	LA = v.forwardRef(function (r, o) {
		const O = r,
			{ className: i, render: l } = O,
			u = Be(O, ["className", "render"]),
			h = Wl().useState("instantType"),
			{ open: p, arrowRef: f, side: y, align: g, arrowUncentered: S, arrowStyles: b } = mx();
		return fn("div", r, {
			state: { open: p, side: y, align: g, uncentered: S, instant: h },
			ref: [o, f],
			props: [{ style: b, "aria-hidden": !0 }, u],
			stateAttributesMapping: bi,
		});
	}),
	zA = function (r) {
		const { delay: o, closeDelay: i, timeout: l = 400 } = r,
			u = v.useMemo(() => ({ delay: o, closeDelay: i }), [o, i]),
			c = v.useMemo(() => ({ open: o, close: i }), [o, i]);
		return K.jsx(dx.Provider, {
			value: u,
			children: K.jsx($O, { delay: c, timeoutMs: l, children: r.children }),
		});
	};
function vx(n) {
	return Am(19) ? n : n ? "true" : void 0;
}
function Sx(n) {
	var r,
		o,
		i = "";
	if (typeof n == "string" || typeof n == "number") i += n;
	else if (typeof n == "object")
		if (Array.isArray(n)) {
			var l = n.length;
			for (r = 0; r < l; r++) n[r] && (o = Sx(n[r])) && (i && (i += " "), (i += o));
		} else for (o in n) n[o] && (i && (i += " "), (i += o));
	return i;
}
function xx() {
	for (var n, r, o = 0, i = "", l = arguments.length; o < l; o++)
		(n = arguments[o]) && (r = Sx(n)) && (i && (i += " "), (i += r));
	return i;
}
const jA = (n, r) => {
		const o = new Array(n.length + r.length);
		for (let i = 0; i < n.length; i++) o[i] = n[i];
		for (let i = 0; i < r.length; i++) o[n.length + i] = r[i];
		return o;
	},
	BA = (n, r) => ({ classGroupId: n, validator: r }),
	wx = (n = new Map(), r = null, o) => ({ nextPart: n, validators: r, classGroupId: o }),
	pf = "-",
	qv = [],
	UA = "arbitrary..",
	HA = (n) => {
		const r = PA(n),
			{ conflictingClassGroups: o, conflictingClassGroupModifiers: i } = n;
		return {
			getClassGroupId: (c) => {
				if (c.startsWith("[") && c.endsWith("]")) return qA(c);
				const h = c.split(pf),
					p = h[0] === "" && h.length > 1 ? 1 : 0;
				return Ex(h, p, r);
			},
			getConflictingClassGroupIds: (c, h) => {
				if (h) {
					const p = i[c],
						f = o[c];
					return p ? (f ? jA(f, p) : p) : f || qv;
				}
				return o[c] || qv;
			},
		};
	},
	Ex = (n, r, o) => {
		if (n.length - r === 0) return o.classGroupId;
		const l = n[r],
			u = o.nextPart.get(l);
		if (u) {
			const f = Ex(n, r + 1, u);
			if (f) return f;
		}
		const c = o.validators;
		if (c === null) return;
		const h = r === 0 ? n.join(pf) : n.slice(r).join(pf),
			p = c.length;
		for (let f = 0; f < p; f++) {
			const y = c[f];
			if (y.validator(h)) return y.classGroupId;
		}
	},
	qA = (n) =>
		n.slice(1, -1).indexOf(":") === -1
			? void 0
			: (() => {
					const r = n.slice(1, -1),
						o = r.indexOf(":"),
						i = r.slice(0, o);
					return i ? UA + i : void 0;
			  })(),
	PA = (n) => {
		const { theme: r, classGroups: o } = n;
		return VA(o, r);
	},
	VA = (n, r) => {
		const o = wx();
		for (const i in n) {
			const l = n[i];
			Pm(l, o, i, r);
		}
		return o;
	},
	Pm = (n, r, o, i) => {
		const l = n.length;
		for (let u = 0; u < l; u++) {
			const c = n[u];
			YA(c, r, o, i);
		}
	},
	YA = (n, r, o, i) => {
		if (typeof n == "string") {
			IA(n, r, o);
			return;
		}
		if (typeof n == "function") {
			GA(n, r, o, i);
			return;
		}
		FA(n, r, o, i);
	},
	IA = (n, r, o) => {
		const i = n === "" ? r : Rx(r, n);
		i.classGroupId = o;
	},
	GA = (n, r, o, i) => {
		if (XA(n)) {
			Pm(n(i), r, o, i);
			return;
		}
		r.validators === null && (r.validators = []), r.validators.push(BA(o, n));
	},
	FA = (n, r, o, i) => {
		const l = Object.entries(n),
			u = l.length;
		for (let c = 0; c < u; c++) {
			const [h, p] = l[c];
			Pm(p, Rx(r, h), o, i);
		}
	},
	Rx = (n, r) => {
		let o = n;
		const i = r.split(pf),
			l = i.length;
		for (let u = 0; u < l; u++) {
			const c = i[u];
			let h = o.nextPart.get(c);
			h || ((h = wx()), o.nextPart.set(c, h)), (o = h);
		}
		return o;
	},
	XA = (n) => "isThemeGetter" in n && n.isThemeGetter === !0,
	KA = (n) => {
		if (n < 1) return { get: () => {}, set: () => {} };
		let r = 0,
			o = Object.create(null),
			i = Object.create(null);
		const l = (u, c) => {
			(o[u] = c), r++, r > n && ((r = 0), (i = o), (o = Object.create(null)));
		};
		return {
			get(u) {
				let c = o[u];
				if (c !== void 0) return c;
				if ((c = i[u]) !== void 0) return l(u, c), c;
			},
			set(u, c) {
				u in o ? (o[u] = c) : l(u, c);
			},
		};
	},
	Xp = "!",
	Pv = ":",
	QA = [],
	Vv = (n, r, o, i, l) => ({
		modifiers: n,
		hasImportantModifier: r,
		baseClassName: o,
		maybePostfixModifierPosition: i,
		isExternal: l,
	}),
	ZA = (n) => {
		const { prefix: r, experimentalParseClassName: o } = n;
		let i = (l) => {
			const u = [];
			let c = 0,
				h = 0,
				p = 0,
				f;
			const y = l.length;
			for (let R = 0; R < y; R++) {
				const O = l[R];
				if (c === 0 && h === 0) {
					if (O === Pv) {
						u.push(l.slice(p, R)), (p = R + 1);
						continue;
					}
					if (O === "/") {
						f = R;
						continue;
					}
				}
				O === "[" ? c++ : O === "]" ? c-- : O === "(" ? h++ : O === ")" && h--;
			}
			const g = u.length === 0 ? l : l.slice(p);
			let S = g,
				b = !1;
			g.endsWith(Xp)
				? ((S = g.slice(0, -1)), (b = !0))
				: g.startsWith(Xp) && ((S = g.slice(1)), (b = !0));
			const w = f && f > p ? f - p : void 0;
			return Vv(u, b, S, w);
		};
		if (r) {
			const l = r + Pv,
				u = i;
			i = (c) => (c.startsWith(l) ? u(c.slice(l.length)) : Vv(QA, !1, c, void 0, !0));
		}
		if (o) {
			const l = i;
			i = (u) => o({ className: u, parseClassName: l });
		}
		return i;
	},
	JA = (n) => {
		const r = new Map();
		return (
			n.orderSensitiveModifiers.forEach((o, i) => {
				r.set(o, 1e6 + i);
			}),
			(o) => {
				const i = [];
				let l = [];
				for (let u = 0; u < o.length; u++) {
					const c = o[u],
						h = c[0] === "[",
						p = r.has(c);
					h || p
						? (l.length > 0 && (l.sort(), i.push(...l), (l = [])), i.push(c))
						: l.push(c);
				}
				return l.length > 0 && (l.sort(), i.push(...l)), i;
			}
		);
	},
	WA = (n) => P({ cache: KA(n.cacheSize), parseClassName: ZA(n), sortModifiers: JA(n) }, HA(n)),
	$A = /\s+/,
	e4 = (n, r) => {
		const {
				parseClassName: o,
				getClassGroupId: i,
				getConflictingClassGroupIds: l,
				sortModifiers: u,
			} = r,
			c = [],
			h = n.trim().split($A);
		let p = "";
		for (let f = h.length - 1; f >= 0; f -= 1) {
			const y = h[f],
				{
					isExternal: g,
					modifiers: S,
					hasImportantModifier: b,
					baseClassName: w,
					maybePostfixModifierPosition: R,
				} = o(y);
			if (g) {
				p = y + (p.length > 0 ? " " + p : p);
				continue;
			}
			let O = !!R,
				T = i(O ? w.substring(0, R) : w);
			if (!T) {
				if (!O) {
					p = y + (p.length > 0 ? " " + p : p);
					continue;
				}
				if (((T = i(w)), !T)) {
					p = y + (p.length > 0 ? " " + p : p);
					continue;
				}
				O = !1;
			}
			const L = S.length === 0 ? "" : S.length === 1 ? S[0] : u(S).join(":"),
				M = b ? L + Xp : L,
				_ = M + T;
			if (c.indexOf(_) > -1) continue;
			c.push(_);
			const N = l(T, O);
			for (let D = 0; D < N.length; ++D) {
				const H = N[D];
				c.push(M + H);
			}
			p = y + (p.length > 0 ? " " + p : p);
		}
		return p;
	},
	t4 = (...n) => {
		let r = 0,
			o,
			i,
			l = "";
		for (; r < n.length; ) (o = n[r++]) && (i = Tx(o)) && (l && (l += " "), (l += i));
		return l;
	},
	Tx = (n) => {
		if (typeof n == "string") return n;
		let r,
			o = "";
		for (let i = 0; i < n.length; i++) n[i] && (r = Tx(n[i])) && (o && (o += " "), (o += r));
		return o;
	},
	n4 = (n, ...r) => {
		let o, i, l, u;
		const c = (p) => {
				const f = r.reduce((y, g) => g(y), n());
				return (o = WA(f)), (i = o.cache.get), (l = o.cache.set), (u = h), h(p);
			},
			h = (p) => {
				const f = i(p);
				if (f) return f;
				const y = e4(p, o);
				return l(p, y), y;
			};
		return (u = c), (...p) => u(t4(...p));
	},
	r4 = [],
	Rn = (n) => {
		const r = (o) => o[n] || r4;
		return (r.isThemeGetter = !0), r;
	},
	Cx = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
	Ox = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
	o4 = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
	a4 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
	i4 =
		/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
	s4 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
	l4 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
	u4 =
		/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
	Ma = (n) => o4.test(n),
	dt = (n) => !!n && !Number.isNaN(Number(n)),
	ka = (n) => !!n && Number.isInteger(Number(n)),
	dp = (n) => n.endsWith("%") && dt(n.slice(0, -1)),
	Yo = (n) => a4.test(n),
	Ax = () => !0,
	c4 = (n) => i4.test(n) && !s4.test(n),
	Vm = () => !1,
	f4 = (n) => l4.test(n),
	d4 = (n) => u4.test(n),
	h4 = (n) => !Ie(n) && !Fe(n),
	p4 = (n) => qa(n, _x, Vm),
	Ie = (n) => Cx.test(n),
	fi = (n) => qa(n, Dx, c4),
	Yv = (n) => qa(n, w4, dt),
	m4 = (n) => qa(n, Lx, Ax),
	g4 = (n) => qa(n, Nx, Vm),
	Iv = (n) => qa(n, Mx, Vm),
	y4 = (n) => qa(n, kx, d4),
	Hc = (n) => qa(n, zx, f4),
	Fe = (n) => Ox.test(n),
	Ul = (n) => vi(n, Dx),
	b4 = (n) => vi(n, Nx),
	Gv = (n) => vi(n, Mx),
	v4 = (n) => vi(n, _x),
	S4 = (n) => vi(n, kx),
	qc = (n) => vi(n, zx, !0),
	x4 = (n) => vi(n, Lx, !0),
	qa = (n, r, o) => {
		const i = Cx.exec(n);
		return i ? (i[1] ? r(i[1]) : o(i[2])) : !1;
	},
	vi = (n, r, o = !1) => {
		const i = Ox.exec(n);
		return i ? (i[1] ? r(i[1]) : o) : !1;
	},
	Mx = (n) => n === "position" || n === "percentage",
	kx = (n) => n === "image" || n === "url",
	_x = (n) => n === "length" || n === "size" || n === "bg-size",
	Dx = (n) => n === "length",
	w4 = (n) => n === "number",
	Nx = (n) => n === "family-name",
	Lx = (n) => n === "number" || n === "weight",
	zx = (n) => n === "shadow",
	E4 = () => {
		const n = Rn("color"),
			r = Rn("font"),
			o = Rn("text"),
			i = Rn("font-weight"),
			l = Rn("tracking"),
			u = Rn("leading"),
			c = Rn("breakpoint"),
			h = Rn("container"),
			p = Rn("spacing"),
			f = Rn("radius"),
			y = Rn("shadow"),
			g = Rn("inset-shadow"),
			S = Rn("text-shadow"),
			b = Rn("drop-shadow"),
			w = Rn("blur"),
			R = Rn("perspective"),
			O = Rn("aspect"),
			T = Rn("ease"),
			L = Rn("animate"),
			M = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"],
			_ = () => [
				"center",
				"top",
				"bottom",
				"left",
				"right",
				"top-left",
				"left-top",
				"top-right",
				"right-top",
				"bottom-right",
				"right-bottom",
				"bottom-left",
				"left-bottom",
			],
			N = () => [..._(), Fe, Ie],
			D = () => ["auto", "hidden", "clip", "visible", "scroll"],
			H = () => ["auto", "contain", "none"],
			U = () => [Fe, Ie, p],
			fe = () => [Ma, "full", "auto", ...U()],
			we = () => [ka, "none", "subgrid", Fe, Ie],
			se = () => ["auto", { span: ["full", ka, Fe, Ie] }, ka, Fe, Ie],
			Y = () => [ka, "auto", Fe, Ie],
			oe = () => ["auto", "min", "max", "fr", Fe, Ie],
			xe = () => [
				"start",
				"end",
				"center",
				"between",
				"around",
				"evenly",
				"stretch",
				"baseline",
				"center-safe",
				"end-safe",
			],
			ge = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"],
			j = () => ["auto", ...U()],
			I = () => [
				Ma,
				"auto",
				"full",
				"dvw",
				"dvh",
				"lvw",
				"lvh",
				"svw",
				"svh",
				"min",
				"max",
				"fit",
				...U(),
			],
			F = () => [Ma, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...U()],
			pe = () => [
				Ma,
				"screen",
				"full",
				"lh",
				"dvh",
				"lvh",
				"svh",
				"min",
				"max",
				"fit",
				...U(),
			],
			J = () => [n, Fe, Ie],
			B = () => [..._(), Gv, Iv, { position: [Fe, Ie] }],
			Z = () => ["no-repeat", { repeat: ["", "x", "y", "space", "round"] }],
			ee = () => ["auto", "cover", "contain", v4, p4, { size: [Fe, Ie] }],
			ie = () => [dp, Ul, fi],
			me = () => ["", "none", "full", f, Fe, Ie],
			ve = () => ["", dt, Ul, fi],
			ke = () => ["solid", "dashed", "dotted", "double"],
			je = () => [
				"normal",
				"multiply",
				"screen",
				"overlay",
				"darken",
				"lighten",
				"color-dodge",
				"color-burn",
				"hard-light",
				"soft-light",
				"difference",
				"exclusion",
				"hue",
				"saturation",
				"color",
				"luminosity",
			],
			Ee = () => [dt, dp, Gv, Iv],
			Qe = () => ["", "none", w, Fe, Ie],
			it = () => ["none", dt, Fe, Ie],
			re = () => ["none", dt, Fe, Ie],
			ce = () => [dt, Fe, Ie],
			de = () => [Ma, "full", ...U()];
		return {
			cacheSize: 500,
			theme: {
				animate: ["spin", "ping", "pulse", "bounce"],
				aspect: ["video"],
				blur: [Yo],
				breakpoint: [Yo],
				color: [Ax],
				container: [Yo],
				"drop-shadow": [Yo],
				ease: ["in", "out", "in-out"],
				font: [h4],
				"font-weight": [
					"thin",
					"extralight",
					"light",
					"normal",
					"medium",
					"semibold",
					"bold",
					"extrabold",
					"black",
				],
				"inset-shadow": [Yo],
				leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
				perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
				radius: [Yo],
				shadow: [Yo],
				spacing: ["px", dt],
				text: [Yo],
				"text-shadow": [Yo],
				tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"],
			},
			classGroups: {
				aspect: [{ aspect: ["auto", "square", Ma, Ie, Fe, O] }],
				container: ["container"],
				columns: [{ columns: [dt, Ie, Fe, h] }],
				"break-after": [{ "break-after": M() }],
				"break-before": [{ "break-before": M() }],
				"break-inside": [
					{ "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] },
				],
				"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
				box: [{ box: ["border", "content"] }],
				display: [
					"block",
					"inline-block",
					"inline",
					"flex",
					"inline-flex",
					"table",
					"inline-table",
					"table-caption",
					"table-cell",
					"table-column",
					"table-column-group",
					"table-footer-group",
					"table-header-group",
					"table-row-group",
					"table-row",
					"flow-root",
					"grid",
					"inline-grid",
					"contents",
					"list-item",
					"hidden",
				],
				sr: ["sr-only", "not-sr-only"],
				float: [{ float: ["right", "left", "none", "start", "end"] }],
				clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }],
				isolation: ["isolate", "isolation-auto"],
				"object-fit": [{ object: ["contain", "cover", "fill", "none", "scale-down"] }],
				"object-position": [{ object: N() }],
				overflow: [{ overflow: D() }],
				"overflow-x": [{ "overflow-x": D() }],
				"overflow-y": [{ "overflow-y": D() }],
				overscroll: [{ overscroll: H() }],
				"overscroll-x": [{ "overscroll-x": H() }],
				"overscroll-y": [{ "overscroll-y": H() }],
				position: ["static", "fixed", "absolute", "relative", "sticky"],
				inset: [{ inset: fe() }],
				"inset-x": [{ "inset-x": fe() }],
				"inset-y": [{ "inset-y": fe() }],
				start: [{ "inset-s": fe(), start: fe() }],
				end: [{ "inset-e": fe(), end: fe() }],
				"inset-bs": [{ "inset-bs": fe() }],
				"inset-be": [{ "inset-be": fe() }],
				top: [{ top: fe() }],
				right: [{ right: fe() }],
				bottom: [{ bottom: fe() }],
				left: [{ left: fe() }],
				visibility: ["visible", "invisible", "collapse"],
				z: [{ z: [ka, "auto", Fe, Ie] }],
				basis: [{ basis: [Ma, "full", "auto", h, ...U()] }],
				"flex-direction": [{ flex: ["row", "row-reverse", "col", "col-reverse"] }],
				"flex-wrap": [{ flex: ["nowrap", "wrap", "wrap-reverse"] }],
				flex: [{ flex: [dt, Ma, "auto", "initial", "none", Ie] }],
				grow: [{ grow: ["", dt, Fe, Ie] }],
				shrink: [{ shrink: ["", dt, Fe, Ie] }],
				order: [{ order: [ka, "first", "last", "none", Fe, Ie] }],
				"grid-cols": [{ "grid-cols": we() }],
				"col-start-end": [{ col: se() }],
				"col-start": [{ "col-start": Y() }],
				"col-end": [{ "col-end": Y() }],
				"grid-rows": [{ "grid-rows": we() }],
				"row-start-end": [{ row: se() }],
				"row-start": [{ "row-start": Y() }],
				"row-end": [{ "row-end": Y() }],
				"grid-flow": [{ "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] }],
				"auto-cols": [{ "auto-cols": oe() }],
				"auto-rows": [{ "auto-rows": oe() }],
				gap: [{ gap: U() }],
				"gap-x": [{ "gap-x": U() }],
				"gap-y": [{ "gap-y": U() }],
				"justify-content": [{ justify: [...xe(), "normal"] }],
				"justify-items": [{ "justify-items": [...ge(), "normal"] }],
				"justify-self": [{ "justify-self": ["auto", ...ge()] }],
				"align-content": [{ content: ["normal", ...xe()] }],
				"align-items": [{ items: [...ge(), { baseline: ["", "last"] }] }],
				"align-self": [{ self: ["auto", ...ge(), { baseline: ["", "last"] }] }],
				"place-content": [{ "place-content": xe() }],
				"place-items": [{ "place-items": [...ge(), "baseline"] }],
				"place-self": [{ "place-self": ["auto", ...ge()] }],
				p: [{ p: U() }],
				px: [{ px: U() }],
				py: [{ py: U() }],
				ps: [{ ps: U() }],
				pe: [{ pe: U() }],
				pbs: [{ pbs: U() }],
				pbe: [{ pbe: U() }],
				pt: [{ pt: U() }],
				pr: [{ pr: U() }],
				pb: [{ pb: U() }],
				pl: [{ pl: U() }],
				m: [{ m: j() }],
				mx: [{ mx: j() }],
				my: [{ my: j() }],
				ms: [{ ms: j() }],
				me: [{ me: j() }],
				mbs: [{ mbs: j() }],
				mbe: [{ mbe: j() }],
				mt: [{ mt: j() }],
				mr: [{ mr: j() }],
				mb: [{ mb: j() }],
				ml: [{ ml: j() }],
				"space-x": [{ "space-x": U() }],
				"space-x-reverse": ["space-x-reverse"],
				"space-y": [{ "space-y": U() }],
				"space-y-reverse": ["space-y-reverse"],
				size: [{ size: I() }],
				"inline-size": [{ inline: ["auto", ...F()] }],
				"min-inline-size": [{ "min-inline": ["auto", ...F()] }],
				"max-inline-size": [{ "max-inline": ["none", ...F()] }],
				"block-size": [{ block: ["auto", ...pe()] }],
				"min-block-size": [{ "min-block": ["auto", ...pe()] }],
				"max-block-size": [{ "max-block": ["none", ...pe()] }],
				w: [{ w: [h, "screen", ...I()] }],
				"min-w": [{ "min-w": [h, "screen", "none", ...I()] }],
				"max-w": [{ "max-w": [h, "screen", "none", "prose", { screen: [c] }, ...I()] }],
				h: [{ h: ["screen", "lh", ...I()] }],
				"min-h": [{ "min-h": ["screen", "lh", "none", ...I()] }],
				"max-h": [{ "max-h": ["screen", "lh", ...I()] }],
				"font-size": [{ text: ["base", o, Ul, fi] }],
				"font-smoothing": ["antialiased", "subpixel-antialiased"],
				"font-style": ["italic", "not-italic"],
				"font-weight": [{ font: [i, x4, m4] }],
				"font-stretch": [
					{
						"font-stretch": [
							"ultra-condensed",
							"extra-condensed",
							"condensed",
							"semi-condensed",
							"normal",
							"semi-expanded",
							"expanded",
							"extra-expanded",
							"ultra-expanded",
							dp,
							Ie,
						],
					},
				],
				"font-family": [{ font: [b4, g4, r] }],
				"font-features": [{ "font-features": [Ie] }],
				"fvn-normal": ["normal-nums"],
				"fvn-ordinal": ["ordinal"],
				"fvn-slashed-zero": ["slashed-zero"],
				"fvn-figure": ["lining-nums", "oldstyle-nums"],
				"fvn-spacing": ["proportional-nums", "tabular-nums"],
				"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
				tracking: [{ tracking: [l, Fe, Ie] }],
				"line-clamp": [{ "line-clamp": [dt, "none", Fe, Yv] }],
				leading: [{ leading: [u, ...U()] }],
				"list-image": [{ "list-image": ["none", Fe, Ie] }],
				"list-style-position": [{ list: ["inside", "outside"] }],
				"list-style-type": [{ list: ["disc", "decimal", "none", Fe, Ie] }],
				"text-alignment": [
					{ text: ["left", "center", "right", "justify", "start", "end"] },
				],
				"placeholder-color": [{ placeholder: J() }],
				"text-color": [{ text: J() }],
				"text-decoration": ["underline", "overline", "line-through", "no-underline"],
				"text-decoration-style": [{ decoration: [...ke(), "wavy"] }],
				"text-decoration-thickness": [{ decoration: [dt, "from-font", "auto", Fe, fi] }],
				"text-decoration-color": [{ decoration: J() }],
				"underline-offset": [{ "underline-offset": [dt, "auto", Fe, Ie] }],
				"text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
				"text-overflow": ["truncate", "text-ellipsis", "text-clip"],
				"text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }],
				indent: [{ indent: U() }],
				"vertical-align": [
					{
						align: [
							"baseline",
							"top",
							"middle",
							"bottom",
							"text-top",
							"text-bottom",
							"sub",
							"super",
							Fe,
							Ie,
						],
					},
				],
				whitespace: [
					{
						whitespace: [
							"normal",
							"nowrap",
							"pre",
							"pre-line",
							"pre-wrap",
							"break-spaces",
						],
					},
				],
				break: [{ break: ["normal", "words", "all", "keep"] }],
				wrap: [{ wrap: ["break-word", "anywhere", "normal"] }],
				hyphens: [{ hyphens: ["none", "manual", "auto"] }],
				content: [{ content: ["none", Fe, Ie] }],
				"bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
				"bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
				"bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
				"bg-position": [{ bg: B() }],
				"bg-repeat": [{ bg: Z() }],
				"bg-size": [{ bg: ee() }],
				"bg-image": [
					{
						bg: [
							"none",
							{
								linear: [
									{ to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"] },
									ka,
									Fe,
									Ie,
								],
								radial: ["", Fe, Ie],
								conic: [ka, Fe, Ie],
							},
							S4,
							y4,
						],
					},
				],
				"bg-color": [{ bg: J() }],
				"gradient-from-pos": [{ from: ie() }],
				"gradient-via-pos": [{ via: ie() }],
				"gradient-to-pos": [{ to: ie() }],
				"gradient-from": [{ from: J() }],
				"gradient-via": [{ via: J() }],
				"gradient-to": [{ to: J() }],
				rounded: [{ rounded: me() }],
				"rounded-s": [{ "rounded-s": me() }],
				"rounded-e": [{ "rounded-e": me() }],
				"rounded-t": [{ "rounded-t": me() }],
				"rounded-r": [{ "rounded-r": me() }],
				"rounded-b": [{ "rounded-b": me() }],
				"rounded-l": [{ "rounded-l": me() }],
				"rounded-ss": [{ "rounded-ss": me() }],
				"rounded-se": [{ "rounded-se": me() }],
				"rounded-ee": [{ "rounded-ee": me() }],
				"rounded-es": [{ "rounded-es": me() }],
				"rounded-tl": [{ "rounded-tl": me() }],
				"rounded-tr": [{ "rounded-tr": me() }],
				"rounded-br": [{ "rounded-br": me() }],
				"rounded-bl": [{ "rounded-bl": me() }],
				"border-w": [{ border: ve() }],
				"border-w-x": [{ "border-x": ve() }],
				"border-w-y": [{ "border-y": ve() }],
				"border-w-s": [{ "border-s": ve() }],
				"border-w-e": [{ "border-e": ve() }],
				"border-w-bs": [{ "border-bs": ve() }],
				"border-w-be": [{ "border-be": ve() }],
				"border-w-t": [{ "border-t": ve() }],
				"border-w-r": [{ "border-r": ve() }],
				"border-w-b": [{ "border-b": ve() }],
				"border-w-l": [{ "border-l": ve() }],
				"divide-x": [{ "divide-x": ve() }],
				"divide-x-reverse": ["divide-x-reverse"],
				"divide-y": [{ "divide-y": ve() }],
				"divide-y-reverse": ["divide-y-reverse"],
				"border-style": [{ border: [...ke(), "hidden", "none"] }],
				"divide-style": [{ divide: [...ke(), "hidden", "none"] }],
				"border-color": [{ border: J() }],
				"border-color-x": [{ "border-x": J() }],
				"border-color-y": [{ "border-y": J() }],
				"border-color-s": [{ "border-s": J() }],
				"border-color-e": [{ "border-e": J() }],
				"border-color-bs": [{ "border-bs": J() }],
				"border-color-be": [{ "border-be": J() }],
				"border-color-t": [{ "border-t": J() }],
				"border-color-r": [{ "border-r": J() }],
				"border-color-b": [{ "border-b": J() }],
				"border-color-l": [{ "border-l": J() }],
				"divide-color": [{ divide: J() }],
				"outline-style": [{ outline: [...ke(), "none", "hidden"] }],
				"outline-offset": [{ "outline-offset": [dt, Fe, Ie] }],
				"outline-w": [{ outline: ["", dt, Ul, fi] }],
				"outline-color": [{ outline: J() }],
				shadow: [{ shadow: ["", "none", y, qc, Hc] }],
				"shadow-color": [{ shadow: J() }],
				"inset-shadow": [{ "inset-shadow": ["none", g, qc, Hc] }],
				"inset-shadow-color": [{ "inset-shadow": J() }],
				"ring-w": [{ ring: ve() }],
				"ring-w-inset": ["ring-inset"],
				"ring-color": [{ ring: J() }],
				"ring-offset-w": [{ "ring-offset": [dt, fi] }],
				"ring-offset-color": [{ "ring-offset": J() }],
				"inset-ring-w": [{ "inset-ring": ve() }],
				"inset-ring-color": [{ "inset-ring": J() }],
				"text-shadow": [{ "text-shadow": ["none", S, qc, Hc] }],
				"text-shadow-color": [{ "text-shadow": J() }],
				opacity: [{ opacity: [dt, Fe, Ie] }],
				"mix-blend": [{ "mix-blend": [...je(), "plus-darker", "plus-lighter"] }],
				"bg-blend": [{ "bg-blend": je() }],
				"mask-clip": [
					{ "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"] },
					"mask-no-clip",
				],
				"mask-composite": [{ mask: ["add", "subtract", "intersect", "exclude"] }],
				"mask-image-linear-pos": [{ "mask-linear": [dt] }],
				"mask-image-linear-from-pos": [{ "mask-linear-from": Ee() }],
				"mask-image-linear-to-pos": [{ "mask-linear-to": Ee() }],
				"mask-image-linear-from-color": [{ "mask-linear-from": J() }],
				"mask-image-linear-to-color": [{ "mask-linear-to": J() }],
				"mask-image-t-from-pos": [{ "mask-t-from": Ee() }],
				"mask-image-t-to-pos": [{ "mask-t-to": Ee() }],
				"mask-image-t-from-color": [{ "mask-t-from": J() }],
				"mask-image-t-to-color": [{ "mask-t-to": J() }],
				"mask-image-r-from-pos": [{ "mask-r-from": Ee() }],
				"mask-image-r-to-pos": [{ "mask-r-to": Ee() }],
				"mask-image-r-from-color": [{ "mask-r-from": J() }],
				"mask-image-r-to-color": [{ "mask-r-to": J() }],
				"mask-image-b-from-pos": [{ "mask-b-from": Ee() }],
				"mask-image-b-to-pos": [{ "mask-b-to": Ee() }],
				"mask-image-b-from-color": [{ "mask-b-from": J() }],
				"mask-image-b-to-color": [{ "mask-b-to": J() }],
				"mask-image-l-from-pos": [{ "mask-l-from": Ee() }],
				"mask-image-l-to-pos": [{ "mask-l-to": Ee() }],
				"mask-image-l-from-color": [{ "mask-l-from": J() }],
				"mask-image-l-to-color": [{ "mask-l-to": J() }],
				"mask-image-x-from-pos": [{ "mask-x-from": Ee() }],
				"mask-image-x-to-pos": [{ "mask-x-to": Ee() }],
				"mask-image-x-from-color": [{ "mask-x-from": J() }],
				"mask-image-x-to-color": [{ "mask-x-to": J() }],
				"mask-image-y-from-pos": [{ "mask-y-from": Ee() }],
				"mask-image-y-to-pos": [{ "mask-y-to": Ee() }],
				"mask-image-y-from-color": [{ "mask-y-from": J() }],
				"mask-image-y-to-color": [{ "mask-y-to": J() }],
				"mask-image-radial": [{ "mask-radial": [Fe, Ie] }],
				"mask-image-radial-from-pos": [{ "mask-radial-from": Ee() }],
				"mask-image-radial-to-pos": [{ "mask-radial-to": Ee() }],
				"mask-image-radial-from-color": [{ "mask-radial-from": J() }],
				"mask-image-radial-to-color": [{ "mask-radial-to": J() }],
				"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
				"mask-image-radial-size": [
					{
						"mask-radial": [
							{ closest: ["side", "corner"], farthest: ["side", "corner"] },
						],
					},
				],
				"mask-image-radial-pos": [{ "mask-radial-at": _() }],
				"mask-image-conic-pos": [{ "mask-conic": [dt] }],
				"mask-image-conic-from-pos": [{ "mask-conic-from": Ee() }],
				"mask-image-conic-to-pos": [{ "mask-conic-to": Ee() }],
				"mask-image-conic-from-color": [{ "mask-conic-from": J() }],
				"mask-image-conic-to-color": [{ "mask-conic-to": J() }],
				"mask-mode": [{ mask: ["alpha", "luminance", "match"] }],
				"mask-origin": [
					{ "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"] },
				],
				"mask-position": [{ mask: B() }],
				"mask-repeat": [{ mask: Z() }],
				"mask-size": [{ mask: ee() }],
				"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
				"mask-image": [{ mask: ["none", Fe, Ie] }],
				filter: [{ filter: ["", "none", Fe, Ie] }],
				blur: [{ blur: Qe() }],
				brightness: [{ brightness: [dt, Fe, Ie] }],
				contrast: [{ contrast: [dt, Fe, Ie] }],
				"drop-shadow": [{ "drop-shadow": ["", "none", b, qc, Hc] }],
				"drop-shadow-color": [{ "drop-shadow": J() }],
				grayscale: [{ grayscale: ["", dt, Fe, Ie] }],
				"hue-rotate": [{ "hue-rotate": [dt, Fe, Ie] }],
				invert: [{ invert: ["", dt, Fe, Ie] }],
				saturate: [{ saturate: [dt, Fe, Ie] }],
				sepia: [{ sepia: ["", dt, Fe, Ie] }],
				"backdrop-filter": [{ "backdrop-filter": ["", "none", Fe, Ie] }],
				"backdrop-blur": [{ "backdrop-blur": Qe() }],
				"backdrop-brightness": [{ "backdrop-brightness": [dt, Fe, Ie] }],
				"backdrop-contrast": [{ "backdrop-contrast": [dt, Fe, Ie] }],
				"backdrop-grayscale": [{ "backdrop-grayscale": ["", dt, Fe, Ie] }],
				"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [dt, Fe, Ie] }],
				"backdrop-invert": [{ "backdrop-invert": ["", dt, Fe, Ie] }],
				"backdrop-opacity": [{ "backdrop-opacity": [dt, Fe, Ie] }],
				"backdrop-saturate": [{ "backdrop-saturate": [dt, Fe, Ie] }],
				"backdrop-sepia": [{ "backdrop-sepia": ["", dt, Fe, Ie] }],
				"border-collapse": [{ border: ["collapse", "separate"] }],
				"border-spacing": [{ "border-spacing": U() }],
				"border-spacing-x": [{ "border-spacing-x": U() }],
				"border-spacing-y": [{ "border-spacing-y": U() }],
				"table-layout": [{ table: ["auto", "fixed"] }],
				caption: [{ caption: ["top", "bottom"] }],
				transition: [
					{
						transition: [
							"",
							"all",
							"colors",
							"opacity",
							"shadow",
							"transform",
							"none",
							Fe,
							Ie,
						],
					},
				],
				"transition-behavior": [{ transition: ["normal", "discrete"] }],
				duration: [{ duration: [dt, "initial", Fe, Ie] }],
				ease: [{ ease: ["linear", "initial", T, Fe, Ie] }],
				delay: [{ delay: [dt, Fe, Ie] }],
				animate: [{ animate: ["none", L, Fe, Ie] }],
				backface: [{ backface: ["hidden", "visible"] }],
				perspective: [{ perspective: [R, Fe, Ie] }],
				"perspective-origin": [{ "perspective-origin": N() }],
				rotate: [{ rotate: it() }],
				"rotate-x": [{ "rotate-x": it() }],
				"rotate-y": [{ "rotate-y": it() }],
				"rotate-z": [{ "rotate-z": it() }],
				scale: [{ scale: re() }],
				"scale-x": [{ "scale-x": re() }],
				"scale-y": [{ "scale-y": re() }],
				"scale-z": [{ "scale-z": re() }],
				"scale-3d": ["scale-3d"],
				skew: [{ skew: ce() }],
				"skew-x": [{ "skew-x": ce() }],
				"skew-y": [{ "skew-y": ce() }],
				transform: [{ transform: [Fe, Ie, "", "none", "gpu", "cpu"] }],
				"transform-origin": [{ origin: N() }],
				"transform-style": [{ transform: ["3d", "flat"] }],
				translate: [{ translate: de() }],
				"translate-x": [{ "translate-x": de() }],
				"translate-y": [{ "translate-y": de() }],
				"translate-z": [{ "translate-z": de() }],
				"translate-none": ["translate-none"],
				accent: [{ accent: J() }],
				appearance: [{ appearance: ["none", "auto"] }],
				"caret-color": [{ caret: J() }],
				"color-scheme": [
					{
						scheme: [
							"normal",
							"dark",
							"light",
							"light-dark",
							"only-dark",
							"only-light",
						],
					},
				],
				cursor: [
					{
						cursor: [
							"auto",
							"default",
							"pointer",
							"wait",
							"text",
							"move",
							"help",
							"not-allowed",
							"none",
							"context-menu",
							"progress",
							"cell",
							"crosshair",
							"vertical-text",
							"alias",
							"copy",
							"no-drop",
							"grab",
							"grabbing",
							"all-scroll",
							"col-resize",
							"row-resize",
							"n-resize",
							"e-resize",
							"s-resize",
							"w-resize",
							"ne-resize",
							"nw-resize",
							"se-resize",
							"sw-resize",
							"ew-resize",
							"ns-resize",
							"nesw-resize",
							"nwse-resize",
							"zoom-in",
							"zoom-out",
							Fe,
							Ie,
						],
					},
				],
				"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
				"pointer-events": [{ "pointer-events": ["auto", "none"] }],
				resize: [{ resize: ["none", "", "y", "x"] }],
				"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
				"scroll-m": [{ "scroll-m": U() }],
				"scroll-mx": [{ "scroll-mx": U() }],
				"scroll-my": [{ "scroll-my": U() }],
				"scroll-ms": [{ "scroll-ms": U() }],
				"scroll-me": [{ "scroll-me": U() }],
				"scroll-mbs": [{ "scroll-mbs": U() }],
				"scroll-mbe": [{ "scroll-mbe": U() }],
				"scroll-mt": [{ "scroll-mt": U() }],
				"scroll-mr": [{ "scroll-mr": U() }],
				"scroll-mb": [{ "scroll-mb": U() }],
				"scroll-ml": [{ "scroll-ml": U() }],
				"scroll-p": [{ "scroll-p": U() }],
				"scroll-px": [{ "scroll-px": U() }],
				"scroll-py": [{ "scroll-py": U() }],
				"scroll-ps": [{ "scroll-ps": U() }],
				"scroll-pe": [{ "scroll-pe": U() }],
				"scroll-pbs": [{ "scroll-pbs": U() }],
				"scroll-pbe": [{ "scroll-pbe": U() }],
				"scroll-pt": [{ "scroll-pt": U() }],
				"scroll-pr": [{ "scroll-pr": U() }],
				"scroll-pb": [{ "scroll-pb": U() }],
				"scroll-pl": [{ "scroll-pl": U() }],
				"snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
				"snap-stop": [{ snap: ["normal", "always"] }],
				"snap-type": [{ snap: ["none", "x", "y", "both"] }],
				"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
				touch: [{ touch: ["auto", "none", "manipulation"] }],
				"touch-x": [{ "touch-pan": ["x", "left", "right"] }],
				"touch-y": [{ "touch-pan": ["y", "up", "down"] }],
				"touch-pz": ["touch-pinch-zoom"],
				select: [{ select: ["none", "text", "all", "auto"] }],
				"will-change": [
					{ "will-change": ["auto", "scroll", "contents", "transform", Fe, Ie] },
				],
				fill: [{ fill: ["none", ...J()] }],
				"stroke-w": [{ stroke: [dt, Ul, fi, Yv] }],
				stroke: [{ stroke: ["none", ...J()] }],
				"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }],
			},
			conflictingClassGroups: {
				overflow: ["overflow-x", "overflow-y"],
				overscroll: ["overscroll-x", "overscroll-y"],
				inset: [
					"inset-x",
					"inset-y",
					"inset-bs",
					"inset-be",
					"start",
					"end",
					"top",
					"right",
					"bottom",
					"left",
				],
				"inset-x": ["right", "left"],
				"inset-y": ["top", "bottom"],
				flex: ["basis", "grow", "shrink"],
				gap: ["gap-x", "gap-y"],
				p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
				px: ["pr", "pl"],
				py: ["pt", "pb"],
				m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
				mx: ["mr", "ml"],
				my: ["mt", "mb"],
				size: ["w", "h"],
				"font-size": ["leading"],
				"fvn-normal": [
					"fvn-ordinal",
					"fvn-slashed-zero",
					"fvn-figure",
					"fvn-spacing",
					"fvn-fraction",
				],
				"fvn-ordinal": ["fvn-normal"],
				"fvn-slashed-zero": ["fvn-normal"],
				"fvn-figure": ["fvn-normal"],
				"fvn-spacing": ["fvn-normal"],
				"fvn-fraction": ["fvn-normal"],
				"line-clamp": ["display", "overflow"],
				rounded: [
					"rounded-s",
					"rounded-e",
					"rounded-t",
					"rounded-r",
					"rounded-b",
					"rounded-l",
					"rounded-ss",
					"rounded-se",
					"rounded-ee",
					"rounded-es",
					"rounded-tl",
					"rounded-tr",
					"rounded-br",
					"rounded-bl",
				],
				"rounded-s": ["rounded-ss", "rounded-es"],
				"rounded-e": ["rounded-se", "rounded-ee"],
				"rounded-t": ["rounded-tl", "rounded-tr"],
				"rounded-r": ["rounded-tr", "rounded-br"],
				"rounded-b": ["rounded-br", "rounded-bl"],
				"rounded-l": ["rounded-tl", "rounded-bl"],
				"border-spacing": ["border-spacing-x", "border-spacing-y"],
				"border-w": [
					"border-w-x",
					"border-w-y",
					"border-w-s",
					"border-w-e",
					"border-w-bs",
					"border-w-be",
					"border-w-t",
					"border-w-r",
					"border-w-b",
					"border-w-l",
				],
				"border-w-x": ["border-w-r", "border-w-l"],
				"border-w-y": ["border-w-t", "border-w-b"],
				"border-color": [
					"border-color-x",
					"border-color-y",
					"border-color-s",
					"border-color-e",
					"border-color-bs",
					"border-color-be",
					"border-color-t",
					"border-color-r",
					"border-color-b",
					"border-color-l",
				],
				"border-color-x": ["border-color-r", "border-color-l"],
				"border-color-y": ["border-color-t", "border-color-b"],
				translate: ["translate-x", "translate-y", "translate-none"],
				"translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
				"scroll-m": [
					"scroll-mx",
					"scroll-my",
					"scroll-ms",
					"scroll-me",
					"scroll-mbs",
					"scroll-mbe",
					"scroll-mt",
					"scroll-mr",
					"scroll-mb",
					"scroll-ml",
				],
				"scroll-mx": ["scroll-mr", "scroll-ml"],
				"scroll-my": ["scroll-mt", "scroll-mb"],
				"scroll-p": [
					"scroll-px",
					"scroll-py",
					"scroll-ps",
					"scroll-pe",
					"scroll-pbs",
					"scroll-pbe",
					"scroll-pt",
					"scroll-pr",
					"scroll-pb",
					"scroll-pl",
				],
				"scroll-px": ["scroll-pr", "scroll-pl"],
				"scroll-py": ["scroll-pt", "scroll-pb"],
				touch: ["touch-x", "touch-y", "touch-pz"],
				"touch-x": ["touch"],
				"touch-y": ["touch"],
				"touch-pz": ["touch"],
			},
			conflictingClassGroupModifiers: { "font-size": ["leading"] },
			orderSensitiveModifiers: [
				"*",
				"**",
				"after",
				"backdrop",
				"before",
				"details-content",
				"file",
				"first-letter",
				"first-line",
				"marker",
				"placeholder",
				"selection",
			],
		};
	},
	R4 = n4(E4);
function Yt(...n) {
	return R4(xx(n));
}
function T4(o) {
	var i = o,
		{ delay: n = 0 } = i,
		r = Be(i, ["delay"]);
	return K.jsx(zA, P({ "data-slot": "tooltip-provider", delay: n }, r));
}
function C4(r) {
	var n = Be(r, []);
	return K.jsx(fA, P({ "data-slot": "tooltip" }, n));
}
function O4(r) {
	var n = Be(r, []);
	return K.jsx(wA, P({ "data-slot": "tooltip-trigger" }, n));
}
function A4(h) {
	var p = h,
		{
			className: n,
			side: r = "top",
			sideOffset: o = 4,
			align: i = "center",
			alignOffset: l = 0,
			children: u,
		} = p,
		c = Be(p, ["className", "side", "sideOffset", "align", "alignOffset", "children"]);
	return K.jsx(TA, {
		children: K.jsx(_A, {
			align: i,
			alignOffset: l,
			side: r,
			sideOffset: o,
			className: "isolate z-50",
			children: K.jsxs(
				NA,
				_e(
					P(
						{
							"data-slot": "tooltip-content",
							className: Yt(
								"data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 rounded-2xl px-3 py-1.5 text-xs **:data-[slot=kbd]:rounded-4xl data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 bg-foreground text-background z-50 w-fit max-w-xs origin-(--transform-origin)",
								n
							),
						},
						c
					),
					{
						children: [
							u,
							K.jsx(LA, {
								className:
									"size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] data-[side=left]:translate-x-[-1.5px] data-[side=right]:translate-x-[1.5px] data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:translate-x-[1.5px] data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:translate-x-[-1.5px] data-[side=inline-start]:-translate-y-1/2 bg-foreground fill-foreground z-50 data-[side=bottom]:top-1 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5",
							}),
						],
					}
				)
			),
		}),
	});
}
const M4 = { theme: "system", setTheme: () => null },
	jx = v.createContext(M4);
function k4(l) {
	var u = l,
		{ children: n, defaultTheme: r = "system", storageKey: o = "hive-ui-theme" } = u,
		i = Be(u, ["children", "defaultTheme", "storageKey"]);
	const [c, h] = v.useState(() => localStorage.getItem(o) || r);
	v.useEffect(() => {
		const f = window.document.documentElement;
		if ((f.classList.remove("light", "dark"), c === "system")) {
			const y = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			f.classList.add(y);
			return;
		}
		f.classList.add(c);
	}, [c]);
	const p = {
		theme: c,
		setTheme: (f) => {
			localStorage.setItem(o, f), h(f);
		},
	};
	return K.jsx(jx.Provider, _e(P({}, i), { value: p, children: n }));
}
const _4 = () => {
		const n = v.use(jx);
		if (n === void 0) throw new Error("useTheme must be used within a ThemeProvider");
		return n;
	},
	D4 = "modulepreload",
	N4 = function (n) {
		return "/assets/bwh_hive/frontend/" + n;
	},
	Fv = {},
	Us = function (r, o, i) {
		let l = Promise.resolve();
		if (o && o.length > 0) {
			let p = function (f) {
				return Promise.all(
					f.map((y) =>
						Promise.resolve(y).then(
							(g) => ({ status: "fulfilled", value: g }),
							(g) => ({ status: "rejected", reason: g })
						)
					)
				);
			};
			document.getElementsByTagName("link");
			const c = document.querySelector("meta[property=csp-nonce]"),
				h =
					(c == null ? void 0 : c.nonce) ||
					(c == null ? void 0 : c.getAttribute("nonce"));
			l = p(
				o.map((f) => {
					if (((f = N4(f)), f in Fv)) return;
					Fv[f] = !0;
					const y = f.endsWith(".css"),
						g = y ? '[rel="stylesheet"]' : "";
					if (document.querySelector(`link[href="${f}"]${g}`)) return;
					const S = document.createElement("link");
					if (
						((S.rel = y ? "stylesheet" : D4),
						y || (S.as = "script"),
						(S.crossOrigin = ""),
						(S.href = f),
						h && S.setAttribute("nonce", h),
						document.head.appendChild(S),
						y)
					)
						return new Promise((b, w) => {
							S.addEventListener("load", b),
								S.addEventListener("error", () =>
									w(new Error(`Unable to preload CSS for ${f}`))
								);
						});
				})
			);
		}
		function u(c) {
			const h = new Event("vite:preloadError", { cancelable: !0 });
			if (((h.payload = c), window.dispatchEvent(h), !h.defaultPrevented)) throw c;
		}
		return l.then((c) => {
			for (const h of c || []) h.status === "rejected" && u(h.reason);
			return r().catch(u);
		});
	},
	Bx = v.createContext({ user: null, isLoading: !0 });
function L4({ children: n }) {
	const { currentUser: r } = fm(),
		{ data: o, isLoading: i } = iC("User", r != null ? r : "", r ? void 0 : null, {
			revalidateOnFocus: !1,
		}),
		l = o ? { email: o.name, full_name: o.full_name, user_image: o.user_image } : null;
	return K.jsx(Bx.Provider, { value: { user: l, isLoading: i }, children: n });
}
function z4() {
	return v.use(Bx);
}
const j4 = {
		xmlns: "http://www.w3.org/2000/svg",
		width: 24,
		height: 24,
		viewBox: "0 0 24 24",
		fill: "none",
	},
	hi = v.forwardRef((b, S) => {
		var w = b,
			{
				color: n = "currentColor",
				size: r = 24,
				strokeWidth: o,
				absoluteStrokeWidth: i = !1,
				className: l = "",
				altIcon: u,
				showAlt: c = !1,
				icon: h,
				primaryColor: p,
				secondaryColor: f,
				disableSecondaryOpacity: y = !1,
			} = w,
			g = Be(w, [
				"color",
				"size",
				"strokeWidth",
				"absoluteStrokeWidth",
				"className",
				"altIcon",
				"showAlt",
				"icon",
				"primaryColor",
				"secondaryColor",
				"disableSecondaryOpacity",
			]);
		const R = o !== void 0 ? (i ? (Number(o) * 24) / Number(r) : o) : void 0,
			O = R !== void 0 ? { strokeWidth: R, stroke: "currentColor" } : {},
			T = P(
				P(_e(P({ ref: S }, j4), { width: r, height: r, color: p || n, className: l }), O),
				g
			),
			M = [...(c && u ? u : h)]
				.sort(([, _], [, N]) => {
					const D = _.opacity !== void 0;
					return N.opacity !== void 0 ? 1 : D ? -1 : 0;
				})
				.map(([_, N]) => {
					const D = N.opacity !== void 0,
						H = D && !y ? N.opacity : void 0,
						U = f
							? P(
									{},
									N.stroke !== void 0
										? { stroke: D ? f : p || n }
										: { fill: D ? f : p || n }
							  )
							: {};
					return v.createElement(
						_,
						_e(P(P(P({}, N), O), U), { opacity: H, key: N.key })
					);
				});
		return v.createElement("svg", T, M);
	});
hi.displayName = "HugeiconsIcon";
const sk = [
		[
			"path",
			{
				d: "M12.001 5.00003V19.002",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
		[
			"path",
			{
				d: "M19.002 12.002L4.99998 12.002",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "1",
			},
		],
	],
	lk = [
		[
			"path",
			{
				d: "M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
	],
	uk = [
		[
			"path",
			{
				d: "M5.5 12.002H19",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
		[
			"path",
			{
				d: "M10.9999 18.002C10.9999 18.002 4.99998 13.583 4.99997 12.0019C4.99996 10.4208 11 6.00195 11 6.00195",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "1",
			},
		],
	],
	B4 = [
		[
			"path",
			{
				d: "M17.9998 15C17.9998 15 13.5809 9.00001 11.9998 9C10.4187 8.99999 5.99985 15 5.99985 15",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
	],
	U4 = [
		[
			"path",
			{
				d: "M18 6L6.00081 17.9992M17.9992 18L6 6.00085",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
	],
	H4 = [
		[
			"path",
			{
				d: "M10.5 8.75V6.75C10.5 5.10626 10.5 4.28439 10.046 3.73121C9.96291 3.62995 9.87005 3.53709 9.76879 3.45398C9.21561 3 8.39374 3 6.75 3C5.10626 3 4.28439 3 3.73121 3.45398C3.62995 3.53709 3.53709 3.62995 3.45398 3.73121C3 4.28439 3 5.10626 3 6.75V8.75C3 10.3937 3 11.2156 3.45398 11.7688C3.53709 11.8701 3.62995 11.9629 3.73121 12.046C4.28439 12.5 5.10626 12.5 6.75 12.5C8.39374 12.5 9.21561 12.5 9.76879 12.046C9.87005 11.9629 9.96291 11.8701 10.046 11.7688C10.5 11.2156 10.5 10.3937 10.5 8.75Z",
				stroke: "currentColor",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
		[
			"path",
			{
				d: "M7.75 15.5H5.75C5.05222 15.5 4.70333 15.5 4.41943 15.5861C3.78023 15.78 3.28002 16.2802 3.08612 16.9194C3 17.2033 3 17.5522 3 18.25C3 18.9478 3 19.2967 3.08612 19.5806C3.28002 20.2198 3.78023 20.72 4.41943 20.9139C4.70333 21 5.05222 21 5.75 21H7.75C8.44778 21 8.79667 21 9.08057 20.9139C9.71977 20.72 10.22 20.2198 10.4139 19.5806C10.5 19.2967 10.5 18.9478 10.5 18.25C10.5 17.5522 10.5 17.2033 10.4139 16.9194C10.22 16.2802 9.71977 15.78 9.08057 15.5861C8.79667 15.5 8.44778 15.5 7.75 15.5Z",
				stroke: "currentColor",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "1",
			},
		],
		[
			"path",
			{
				d: "M21 17.25V15.25C21 13.6063 21 12.7844 20.546 12.2312C20.4629 12.1299 20.3701 12.0371 20.2688 11.954C19.7156 11.5 18.8937 11.5 17.25 11.5C15.6063 11.5 14.7844 11.5 14.2312 11.954C14.1299 12.0371 14.0371 12.1299 13.954 12.2312C13.5 12.7844 13.5 13.6063 13.5 15.25V17.25C13.5 18.8937 13.5 19.7156 13.954 20.2688C14.0371 20.3701 14.1299 20.4629 14.2312 20.546C14.7844 21 15.6063 21 17.25 21C18.8937 21 19.7156 21 20.2688 20.546C20.3701 20.4629 20.4629 20.3701 20.546 20.2688C21 19.7156 21 18.8937 21 17.25Z",
				stroke: "currentColor",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "2",
			},
		],
		[
			"path",
			{
				d: "M18.25 3H16.25C15.5522 3 15.2033 3 14.9194 3.08612C14.2802 3.28002 13.78 3.78023 13.5861 4.41943C13.5 4.70333 13.5 5.05222 13.5 5.75C13.5 6.44778 13.5 6.79667 13.5861 7.08057C13.78 7.71977 14.2802 8.21998 14.9194 8.41388C15.2033 8.5 15.5522 8.5 16.25 8.5H18.25C18.9478 8.5 19.2967 8.5 19.5806 8.41388C20.2198 8.21998 20.72 7.71977 20.9139 7.08057C21 6.79667 21 6.44778 21 5.75C21 5.05222 21 4.70333 20.9139 4.41943C20.72 3.78023 20.2198 3.28002 19.5806 3.08612C19.2967 3 18.9478 3 18.25 3Z",
				stroke: "currentColor",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "3",
			},
		],
	],
	q4 = [
		[
			"path",
			{
				d: "M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25C22 15.7612 22 17.5167 21.1573 18.7779C20.7926 19.3238 20.3238 19.7926 19.7779 20.1573C18.5167 21 16.7612 21 13.25 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
	],
	P4 = [
		[
			"path",
			{
				d: "M15.5 8.04045C15.4588 6.87972 15.3216 6.15451 14.8645 5.58671C14.2114 4.77536 13.0944 4.52064 10.8605 4.01121L9.85915 3.78286C6.4649 3.00882 4.76777 2.6218 3.63388 3.51317C2.5 4.40454 2.5 6.1257 2.5 9.56803V14.432C2.5 17.8743 2.5 19.5955 3.63388 20.4868C4.76777 21.3782 6.4649 20.9912 9.85915 20.2171L10.8605 19.9888C13.0944 19.4794 14.2114 19.2246 14.8645 18.4133C15.3216 17.8455 15.4588 17.1203 15.5 15.9595",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
		[
			"path",
			{
				d: "M18.5 9.01172C18.5 9.01172 21.5 11.2212 21.5 12.0117C21.5 12.8023 18.5 15.0117 18.5 15.0117M21 12.0117H8.49998",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "1",
			},
		],
	],
	V4 = [
		[
			"path",
			{
				d: "M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
	],
	Y4 = [
		[
			"path",
			{
				d: "M21.3175 7.14139L20.8239 6.28479C20.4506 5.63696 20.264 5.31305 19.9464 5.18388C19.6288 5.05472 19.2696 5.15664 18.5513 5.36048L17.3311 5.70418C16.8725 5.80994 16.3913 5.74994 15.9726 5.53479L15.6357 5.34042C15.2766 5.11043 15.0004 4.77133 14.8475 4.37274L14.5136 3.37536C14.294 2.71534 14.1842 2.38533 13.9228 2.19657C13.6615 2.00781 13.3143 2.00781 12.6199 2.00781H11.5051C10.8108 2.00781 10.4636 2.00781 10.2022 2.19657C9.94085 2.38533 9.83106 2.71534 9.61149 3.37536L9.27753 4.37274C9.12465 4.77133 8.84845 5.11043 8.48937 5.34042L8.15249 5.53479C7.73374 5.74994 7.25259 5.80994 6.79398 5.70418L5.57375 5.36048C4.85541 5.15664 4.49625 5.05472 4.17867 5.18388C3.86109 5.31305 3.67445 5.63696 3.30115 6.28479L2.80757 7.14139C2.45766 7.74864 2.2827 8.05227 2.31666 8.37549C2.35061 8.69871 2.58483 8.95918 3.05326 9.48012L4.0843 10.6328C4.3363 10.9518 4.51521 11.5078 4.51521 12.0077C4.51521 12.5078 4.33636 13.0636 4.08433 13.3827L3.05326 14.5354C2.58483 15.0564 2.35062 15.3168 2.31666 15.6401C2.2827 15.9633 2.45766 16.2669 2.80757 16.8741L3.30114 17.7307C3.67443 18.3785 3.86109 18.7025 4.17867 18.8316C4.49625 18.9608 4.85542 18.8589 5.57377 18.655L6.79394 18.3113C7.25263 18.2055 7.73387 18.2656 8.15267 18.4808L8.4895 18.6752C8.84851 18.9052 9.12464 19.2442 9.2775 19.6428L9.61149 20.6403C9.83106 21.3003 9.94085 21.6303 10.2022 21.8191C10.4636 22.0078 10.8108 22.0078 11.5051 22.0078H12.6199C13.3143 22.0078 13.6615 22.0078 13.9228 21.8191C14.1842 21.6303 14.294 21.3003 14.5136 20.6403L14.8476 19.6428C15.0004 19.2442 15.2765 18.9052 15.6356 18.6752L15.9724 18.4808C16.3912 18.2656 16.8724 18.2055 17.3311 18.3113L18.5513 18.655C19.2696 18.8589 19.6288 18.9608 19.9464 18.8316C20.264 18.7025 20.4506 18.3785 20.8239 17.7307L21.3175 16.8741C21.6674 16.2669 21.8423 15.9633 21.8084 15.6401C21.7744 15.3168 21.5402 15.0564 21.0718 14.5354L20.0407 13.3827C19.7887 13.0636 19.6098 12.5078 19.6098 12.0077C19.6098 11.5078 19.7888 10.9518 20.0407 10.6328L21.0718 9.48012C21.5402 8.95918 21.7744 8.69871 21.8084 8.37549C21.8423 8.05227 21.6674 7.74864 21.3175 7.14139Z",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
		[
			"path",
			{
				d: "M15.5195 12C15.5195 13.933 13.9525 15.5 12.0195 15.5C10.0865 15.5 8.51953 13.933 8.51953 12C8.51953 10.067 10.0865 8.5 12.0195 8.5C13.9525 8.5 15.5195 10.067 15.5195 12Z",
				stroke: "currentColor",
				strokeWidth: "1.5",
				key: "1",
			},
		],
	],
	I4 = [
		[
			"path",
			{
				d: "M2 12C2 8.31087 2 6.4663 2.81382 5.15877C3.1149 4.67502 3.48891 4.25427 3.91891 3.91554C5.08116 3 6.72077 3 10 3H14C17.2792 3 18.9188 3 20.0811 3.91554C20.5111 4.25427 20.8851 4.67502 21.1862 5.15877C22 6.4663 22 8.31087 22 12C22 15.6891 22 17.5337 21.1862 18.8412C20.8851 19.325 20.5111 19.7457 20.0811 20.0845C18.9188 21 17.2792 21 14 21H10C6.72077 21 5.08116 21 3.91891 20.0845C3.48891 19.7457 3.1149 19.325 2.81382 18.8412C2 17.5337 2 15.6891 2 12Z",
				stroke: "currentColor",
				strokeWidth: "1.5",
				key: "0",
			},
		],
		[
			"path",
			{
				d: "M9.5 3L9.5 21",
				stroke: "currentColor",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "1",
			},
		],
		[
			"path",
			{
				d: "M5 7H6M5 10H6",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "2",
			},
		],
	],
	G4 = [
		[
			"path",
			{
				d: "M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z",
				stroke: "currentColor",
				strokeWidth: "1.5",
				key: "0",
			},
		],
		[
			"path",
			{
				d: "M12 2C11.6227 2.33333 11.0945 3.2 12 4M12 20C12.3773 20.3333 12.9055 21.2 12 22M19.5 4.50271C18.9685 4.46982 17.9253 4.72293 18.0042 5.99847M5.49576 17.5C5.52865 18.0315 5.27555 19.0747 4 18.9958M5.00271 4.5C4.96979 5.03202 5.22315 6.0763 6.5 5.99729M18 17.5026C18.5315 17.4715 19.5747 17.7108 19.4958 18.9168M22 12C21.6667 11.6227 20.8 11.0945 20 12M4 11.5C3.66667 11.8773 2.8 12.4055 2 11.5",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeWidth: "1.5",
				key: "1",
			},
		],
	],
	F4 = [
		[
			"path",
			{
				d: "M14.4961 2.00027H9.49609C8.66767 2.00027 7.99609 2.67184 7.99609 3.50027C7.99609 4.32869 8.66767 5.00027 9.49609 5.00027H14.4961C15.3245 5.00027 15.9961 4.32869 15.9961 3.50027C15.9961 2.67184 15.3245 2.00027 14.4961 2.00027Z",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
		[
			"path",
			{
				d: "M15.9961 3.50027C17.5496 3.54708 18.4761 3.72034 19.1174 4.36163C19.9961 5.24031 19.9961 6.6545 19.9961 9.4829L19.9961 15.9997C19.9961 18.8282 19.9961 20.2424 19.1174 21.1211C18.2387 21.9997 16.8245 21.9997 13.9961 21.9997L9.99609 21.9997C7.16767 21.9997 5.75346 21.9997 4.87478 21.1211C3.9961 20.2424 3.9961 18.8282 3.99609 15.9998L3.99611 9.48295C3.9961 6.65452 3.9961 5.2403 4.87478 4.36162C5.51606 3.72033 6.44261 3.54708 7.99599 3.50027",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "1",
			},
		],
		[
			"path",
			{
				d: "M7.49609 11.0003L8.49609 12.0003L10.4961 9.50027",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "2",
			},
		],
		[
			"path",
			{
				d: "M12.9961 17.0003H15.9961M12.9961 11.0003H15.9961",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "3",
			},
		],
		[
			"path",
			{
				d: "M8.48621 16.8675H8.49621",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "2",
				key: "4",
			},
		],
	],
	ck = [
		[
			"path",
			{
				d: "M5 14L8.5 17.5L19 6.5",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
	],
	fk = [
		[
			"path",
			{
				d: "M18 14C18 14 13.5811 19 12 19C10.4188 19 6 14 6 14",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
		[
			"path",
			{
				d: "M18 9.99996C18 9.99996 13.5811 5.00001 12 5C10.4188 4.99999 6 10 6 10",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "1",
			},
		],
	],
	X4 = [
		[
			"path",
			{
				d: "M15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8Z",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "0",
			},
		],
		[
			"path",
			{
				d: "M16 4C17.6569 4 19 5.34315 19 7C19 8.22309 18.2681 9.27523 17.2183 9.7423",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "1",
			},
		],
		[
			"path",
			{
				d: "M13.7143 14H10.2857C7.91876 14 5.99998 15.9188 5.99998 18.2857C5.99998 19.2325 6.76749 20 7.71426 20H16.2857C17.2325 20 18 19.2325 18 18.2857C18 15.9188 16.0812 14 13.7143 14Z",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "2",
			},
		],
		[
			"path",
			{
				d: "M17.7143 13C20.0812 13 22 14.9188 22 17.2857C22 18.2325 21.2325 19 20.2857 19",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "3",
			},
		],
		[
			"path",
			{
				d: "M8 4C6.34315 4 5 5.34315 5 7C5 8.22309 5.73193 9.27523 6.78168 9.7423",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "4",
			},
		],
		[
			"path",
			{
				d: "M3.71429 19C2.76751 19 2 18.2325 2 17.2857C2 14.9188 3.91878 13 6.28571 13",
				stroke: "currentColor",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				strokeWidth: "1.5",
				key: "5",
			},
		],
	];
function K4(n) {
	var r;
	return fn((r = n.defaultTagName) != null ? r : "div", n, n);
}
const Xv = (n) => (typeof n == "boolean" ? `${n}` : n === 0 ? "0" : n),
	Kv = xx,
	Ux = (n, r) => (o) => {
		var i;
		if ((r == null ? void 0 : r.variants) == null)
			return Kv(n, o == null ? void 0 : o.class, o == null ? void 0 : o.className);
		const { variants: l, defaultVariants: u } = r,
			c = Object.keys(l).map((f) => {
				const y = o == null ? void 0 : o[f],
					g = u == null ? void 0 : u[f];
				if (y === null) return null;
				const S = Xv(y) || Xv(g);
				return l[f][S];
			}),
			h =
				o &&
				Object.entries(o).reduce((f, y) => {
					let [g, S] = y;
					return S === void 0 || (f[g] = S), f;
				}, {}),
			p =
				r == null || (i = r.compoundVariants) === null || i === void 0
					? void 0
					: i.reduce((f, y) => {
							let w = y,
								{ class: g, className: S } = w,
								b = Be(w, ["class", "className"]);
							return Object.entries(b).every((R) => {
								let [O, T] = R;
								return Array.isArray(T)
									? T.includes(P(P({}, u), h)[O])
									: P(P({}, u), h)[O] === T;
							})
								? [...f, g, S]
								: f;
					  }, []);
		return Kv(n, c, p, o == null ? void 0 : o.class, o == null ? void 0 : o.className);
	},
	hp = 768;
function Q4() {
	const [n, r] = v.useState(void 0);
	return (
		v.useEffect(() => {
			const o = window.matchMedia(`(max-width: ${hp - 1}px)`),
				i = () => {
					r(window.innerWidth < hp);
				};
			return (
				o.addEventListener("change", i),
				r(window.innerWidth < hp),
				() => o.removeEventListener("change", i)
			);
		}, []),
		!!n
	);
}
const Z4 = v.createContext(void 0);
function Ym(n = !1) {
	const r = v.useContext(Z4);
	if (r === void 0 && !n) throw new Error(Xn(16));
	return r;
}
function J4(n) {
	const {
			focusableWhenDisabled: r,
			disabled: o,
			composite: i = !1,
			tabIndex: l = 0,
			isNativeButton: u,
		} = n,
		c = i && r !== !1,
		h = i && r === !1;
	return {
		props: v.useMemo(() => {
			const f = {
				onKeyDown(y) {
					o && r && y.key !== "Tab" && y.preventDefault();
				},
			};
			return (
				i || ((f.tabIndex = l), !u && o && (f.tabIndex = r ? l : -1)),
				((u && (r || c)) || (!u && o)) && (f["aria-disabled"] = o),
				u && (!r || h) && (f.disabled = o),
				f
			);
		}, [i, o, r, c, h, u, l]),
	};
}
function Mf(n = {}) {
	const { disabled: r = !1, focusableWhenDisabled: o, tabIndex: i = 0, native: l = !0 } = n,
		u = v.useRef(null),
		c = Ym(!0) !== void 0,
		h = Ke(() => {
			const S = u.current;
			return !!((S == null ? void 0 : S.tagName) === "A" && S != null && S.href);
		}),
		{ props: p } = J4({
			focusableWhenDisabled: o,
			disabled: r,
			composite: c,
			tabIndex: i,
			isNativeButton: l,
		}),
		f = v.useCallback(() => {
			const S = u.current;
			W4(S) && c && r && p.disabled === void 0 && S.disabled && (S.disabled = !1);
		}, [r, p.disabled, c]);
	$e(f, [f]);
	const y = v.useCallback(
			(S = {}) => {
				const _ = S,
					{ onClick: b, onMouseDown: w, onKeyUp: R, onKeyDown: O, onPointerDown: T } = _,
					L = Be(_, ["onClick", "onMouseDown", "onKeyUp", "onKeyDown", "onPointerDown"]);
				return As(
					{
						type: l ? "button" : void 0,
						onClick(N) {
							if (r) {
								N.preventDefault();
								return;
							}
							b == null || b(N);
						},
						onMouseDown(N) {
							r || w == null || w(N);
						},
						onKeyDown(N) {
							if ((r || (Gp(N), O == null || O(N)), N.baseUIHandlerPrevented))
								return;
							const D = N.target === N.currentTarget && !l && !h() && !r,
								H = N.key === "Enter",
								U = N.key === " ";
							D && ((U || H) && N.preventDefault(), H && (b == null || b(N)));
						},
						onKeyUp(N) {
							r || (Gp(N), R == null || R(N)),
								!N.baseUIHandlerPrevented &&
									N.target === N.currentTarget &&
									!l &&
									!r &&
									N.key === " " &&
									(b == null || b(N));
						},
						onPointerDown(N) {
							if (r) {
								N.preventDefault();
								return;
							}
							T == null || T(N);
						},
					},
					l ? void 0 : { role: "button" },
					p,
					L
				);
			},
			[r, p, l, h]
		),
		g = Ke((S) => {
			(u.current = S), f();
		});
	return { getButtonProps: y, buttonRef: g };
}
function W4(n) {
	return nn(n) && n.tagName === "BUTTON";
}
const $4 = v.forwardRef(function (r, o) {
		const S = r,
			{
				render: i,
				className: l,
				disabled: u = !1,
				focusableWhenDisabled: c = !1,
				nativeButton: h = !0,
			} = S,
			p = Be(S, [
				"render",
				"className",
				"disabled",
				"focusableWhenDisabled",
				"nativeButton",
			]),
			{ getButtonProps: f, buttonRef: y } = Mf({
				disabled: u,
				focusableWhenDisabled: c,
				native: h,
			});
		return fn("button", r, { state: { disabled: u }, ref: [o, y], props: [p, f] });
	}),
	e8 = Ux(
		"focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-4xl border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none",
		{
			variants: {
				variant: {
					default: "bg-primary text-primary-foreground hover:bg-primary/80",
					outline:
						"border-border bg-input/30 hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
					secondary:
						"bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
					ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
					destructive:
						"bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30",
					link: "text-primary underline-offset-4 hover:underline",
				},
				size: {
					default:
						"h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
					xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
					sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
					lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
					icon: "size-9",
					"icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
					"icon-sm": "size-8",
					"icon-lg": "size-10",
				},
			},
			defaultVariants: { variant: "default", size: "default" },
		}
	);
function Hx(l) {
	var u = l,
		{ className: n, variant: r = "default", size: o = "default" } = u,
		i = Be(u, ["className", "variant", "size"]);
	return K.jsx(
		$4,
		P({ "data-slot": "button", className: Yt(e8({ variant: r, size: o, className: n })) }, i)
	);
}
const t8 = v.forwardRef(function (r, o) {
		const f = r,
			{ className: i, render: l, orientation: u = "horizontal" } = f,
			c = Be(f, ["className", "render", "orientation"]);
		return fn("div", r, {
			state: { orientation: u },
			ref: o,
			props: [{ role: "separator", "aria-orientation": u }, c],
		});
	}),
	qx = v.createContext(void 0);
function Si(n) {
	const r = v.useContext(qx);
	if (n === !1 && r === void 0) throw new Error(Xn(27));
	return r;
}
const n8 = P(P({}, bi), js),
	r8 = v.forwardRef(function (r, o) {
		const b = r,
			{ render: i, className: l, forceRender: u = !1 } = b,
			c = Be(b, ["render", "className", "forceRender"]),
			{ store: h } = Si(),
			p = h.useState("open"),
			f = h.useState("nested"),
			y = h.useState("mounted"),
			g = h.useState("transitionStatus");
		return fn("div", r, {
			state: { open: p, transitionStatus: g },
			ref: [h.context.backdropRef, o],
			stateAttributesMapping: n8,
			props: [
				{
					role: "presentation",
					hidden: !y,
					style: { userSelect: "none", WebkitUserSelect: "none" },
				},
				c,
			],
			enabled: u || !f,
		});
	}),
	o8 = v.forwardRef(function (r, o) {
		const w = r,
			{ render: i, className: l, disabled: u = !1, nativeButton: c = !0 } = w,
			h = Be(w, ["render", "className", "disabled", "nativeButton"]),
			{ store: p } = Si(),
			f = p.useState("open");
		function y(R) {
			f && p.setOpen(!1, gt(ZO, R.nativeEvent));
		}
		const { getButtonProps: g, buttonRef: S } = Mf({ disabled: u, native: c });
		return fn("button", r, {
			state: { disabled: u },
			ref: [o, S],
			props: [{ onClick: y }, h, g],
		});
	}),
	a8 = v.forwardRef(function (r, o) {
		const f = r,
			{ render: i, className: l, id: u } = f,
			c = Be(f, ["render", "className", "id"]),
			{ store: h } = Si(),
			p = nu(u);
		return (
			h.useSyncedValueWithCleanup("descriptionElementId", p),
			fn("p", r, { ref: o, props: [{ id: p }, c] })
		);
	});
let i8 = (function (n) {
		return (n.nestedDialogs = "--nested-dialogs"), n;
	})({}),
	s8 = (function (n) {
		return (
			(n[(n.open = di.open)] = "open"),
			(n[(n.closed = di.closed)] = "closed"),
			(n[(n.startingStyle = di.startingStyle)] = "startingStyle"),
			(n[(n.endingStyle = di.endingStyle)] = "endingStyle"),
			(n.nested = "data-nested"),
			(n.nestedDialogOpen = "data-nested-dialog-open"),
			n
		);
	})({});
const Px = v.createContext(void 0);
function l8() {
	const n = v.useContext(Px);
	if (n === void 0) throw new Error(Xn(26));
	return n;
}
const Vx = "ArrowUp",
	Yx = "ArrowDown",
	Ix = "ArrowLeft",
	Gx = "ArrowRight",
	Fx = "Home",
	Xx = "End",
	u8 = new Set([Ix, Gx]),
	c8 = new Set([Vx, Yx]),
	f8 = new Set([...u8, ...c8]);
[...f8];
const Kx = new Set([Vx, Yx, Ix, Gx, Fx, Xx]),
	d8 = _e(P(P({}, bi), js), {
		nestedDialogOpen(n) {
			return n ? { [s8.nestedDialogOpen]: "" } : null;
		},
	}),
	h8 = v.forwardRef(function (r, o) {
		const se = r,
			{ className: i, finalFocus: l, initialFocus: u, render: c } = se,
			h = Be(se, ["className", "finalFocus", "initialFocus", "render"]),
			{ store: p } = Si(),
			f = p.useState("descriptionElementId"),
			y = p.useState("disablePointerDismissal"),
			g = p.useState("floatingRootContext"),
			S = p.useState("popupProps"),
			b = p.useState("modal"),
			w = p.useState("mounted"),
			R = p.useState("nested"),
			O = p.useState("nestedOpenDialogCount"),
			T = p.useState("open"),
			L = p.useState("openMethod"),
			M = p.useState("titleElementId"),
			_ = p.useState("transitionStatus"),
			N = p.useState("role");
		l8(),
			Bs({
				open: T,
				ref: p.context.popupRef,
				onComplete() {
					var Y, oe;
					T && ((oe = (Y = p.context).onOpenChangeComplete) == null || oe.call(Y, !0));
				},
			});
		function D(Y) {
			return Y === "touch" ? p.context.popupRef.current : !0;
		}
		const H = u === void 0 ? D : u,
			U = O > 0,
			we = fn("div", r, {
				state: { open: T, nested: R, transitionStatus: _, nestedDialogOpen: U },
				props: [
					S,
					{
						"aria-labelledby": M != null ? M : void 0,
						"aria-describedby": f != null ? f : void 0,
						role: N,
						tabIndex: -1,
						hidden: !w,
						onKeyDown(Y) {
							Kx.has(Y.key) && Y.stopPropagation();
						},
						style: { [i8.nestedDialogs]: O },
					},
					h,
				],
				ref: [o, p.context.popupRef, p.useStateSetter("popupElement")],
				stateAttributesMapping: d8,
			});
		return K.jsx(GS, {
			context: g,
			openInteractionType: L,
			disabled: !w,
			closeOnFocusOut: !y,
			initialFocus: H,
			returnFocus: l,
			modal: b !== !1,
			restoreFocus: "popup",
			children: we,
		});
	}),
	Qx = v.forwardRef(function (r, o) {
		const c = r,
			{ cutout: i } = c,
			l = Be(c, ["cutout"]);
		let u;
		if (i) {
			const h = i == null ? void 0 : i.getBoundingClientRect();
			u = `polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% 100%,
      0% 0%,
      ${h.left}px ${h.top}px,
      ${h.left}px ${h.bottom}px,
      ${h.right}px ${h.bottom}px,
      ${h.right}px ${h.top}px,
      ${h.left}px ${h.top}px
    )`;
		}
		return K.jsx(
			"div",
			_e(P({ ref: o, role: "presentation", "data-base-ui-inert": "" }, l), {
				style: {
					position: "fixed",
					inset: 0,
					userSelect: "none",
					WebkitUserSelect: "none",
					clipPath: u,
				},
			})
		);
	}),
	p8 = v.forwardRef(function (r, o) {
		const y = r,
			{ keepMounted: i = !1 } = y,
			l = Be(y, ["keepMounted"]),
			{ store: u } = Si(),
			c = u.useState("mounted"),
			h = u.useState("modal"),
			p = u.useState("open");
		return c || i
			? K.jsx(Px.Provider, {
					value: i,
					children: K.jsxs(
						IS,
						_e(P({ ref: o }, l), {
							children: [
								c &&
									h === !0 &&
									K.jsx(Qx, {
										ref: u.context.internalBackdropRef,
										inert: vx(!p),
									}),
								r.children,
							],
						})
					),
			  })
			: null;
	});
let Qv = {},
	Zv = {},
	Jv = "";
function m8(n) {
	if (typeof document == "undefined") return !1;
	const r = kt(n);
	return Sn(r).innerWidth - r.documentElement.clientWidth > 0;
}
function g8(n) {
	if (
		!(
			typeof CSS != "undefined" &&
			CSS.supports &&
			CSS.supports("scrollbar-gutter", "stable")
		) ||
		typeof document == "undefined"
	)
		return !1;
	const o = kt(n),
		i = o.documentElement,
		l = o.body,
		u = Ba(i) ? i : l,
		c = u.style.overflowY,
		h = i.style.scrollbarGutter;
	(i.style.scrollbarGutter = "stable"), (u.style.overflowY = "scroll");
	const p = u.offsetWidth;
	u.style.overflowY = "hidden";
	const f = u.offsetWidth;
	return (u.style.overflowY = c), (i.style.scrollbarGutter = h), p === f;
}
function y8(n) {
	const r = kt(n),
		o = r.documentElement,
		i = r.body,
		l = Ba(o) ? o : i,
		u = { overflowY: l.style.overflowY, overflowX: l.style.overflowX };
	return (
		Object.assign(l.style, { overflowY: "hidden", overflowX: "hidden" }),
		() => {
			Object.assign(l.style, u);
		}
	);
}
function b8(n) {
	var S, b;
	const r = kt(n),
		o = r.documentElement,
		i = r.body,
		l = Sn(o);
	let u = 0,
		c = 0,
		h = !1;
	const p = uo.create();
	if (iS && ((b = (S = l.visualViewport) == null ? void 0 : S.scale) != null ? b : 1) !== 1)
		return () => {};
	function f() {
		const w = l.getComputedStyle(o),
			R = l.getComputedStyle(i),
			L = (w.scrollbarGutter || "").includes("both-edges") ? "stable both-edges" : "stable";
		(u = o.scrollTop),
			(c = o.scrollLeft),
			(Qv = {
				scrollbarGutter: o.style.scrollbarGutter,
				overflowY: o.style.overflowY,
				overflowX: o.style.overflowX,
			}),
			(Jv = o.style.scrollBehavior),
			(Zv = {
				position: i.style.position,
				height: i.style.height,
				width: i.style.width,
				boxSizing: i.style.boxSizing,
				overflowY: i.style.overflowY,
				overflowX: i.style.overflowX,
				scrollBehavior: i.style.scrollBehavior,
			});
		const M = o.scrollHeight > o.clientHeight,
			_ = o.scrollWidth > o.clientWidth,
			N = w.overflowY === "scroll" || R.overflowY === "scroll",
			D = w.overflowX === "scroll" || R.overflowX === "scroll",
			H = Math.max(0, l.innerWidth - i.clientWidth),
			U = Math.max(0, l.innerHeight - i.clientHeight),
			fe = parseFloat(R.marginTop) + parseFloat(R.marginBottom),
			we = parseFloat(R.marginLeft) + parseFloat(R.marginRight),
			se = Ba(o) ? o : i;
		if (((h = g8(n)), h)) {
			(o.style.scrollbarGutter = L),
				(se.style.overflowY = "hidden"),
				(se.style.overflowX = "hidden");
			return;
		}
		Object.assign(o.style, { scrollbarGutter: L, overflowY: "hidden", overflowX: "hidden" }),
			(M || N) && (o.style.overflowY = "scroll"),
			(_ || D) && (o.style.overflowX = "scroll"),
			Object.assign(i.style, {
				position: "relative",
				height: fe || U ? `calc(100dvh - ${fe + U}px)` : "100dvh",
				width: we || H ? `calc(100vw - ${we + H}px)` : "100vw",
				boxSizing: "border-box",
				overflow: "hidden",
				scrollBehavior: "unset",
			}),
			(i.scrollTop = u),
			(i.scrollLeft = c),
			o.setAttribute("data-base-ui-scroll-locked", ""),
			(o.style.scrollBehavior = "unset");
	}
	function y() {
		Object.assign(o.style, Qv),
			Object.assign(i.style, Zv),
			h ||
				((o.scrollTop = u),
				(o.scrollLeft = c),
				o.removeAttribute("data-base-ui-scroll-locked"),
				(o.style.scrollBehavior = Jv));
	}
	function g() {
		y(), p.request(f);
	}
	return (
		f(),
		l.addEventListener("resize", g),
		() => {
			p.cancel(),
				y(),
				typeof l.removeEventListener == "function" && l.removeEventListener("resize", g);
		}
	);
}
class v8 {
	constructor() {
		jt(this, "lockCount", 0);
		jt(this, "restore", null);
		jt(this, "timeoutLock", go.create());
		jt(this, "timeoutUnlock", go.create());
		jt(this, "release", () => {
			(this.lockCount -= 1),
				this.lockCount === 0 && this.restore && this.timeoutUnlock.start(0, this.unlock);
		});
		jt(this, "unlock", () => {
			var r;
			this.lockCount === 0 &&
				this.restore &&
				((r = this.restore) == null || r.call(this), (this.restore = null));
		});
	}
	acquire(r) {
		return (
			(this.lockCount += 1),
			this.lockCount === 1 &&
				this.restore === null &&
				this.timeoutLock.start(0, () => this.lock(r)),
			this.release
		);
	}
	lock(r) {
		if (this.lockCount === 0 || this.restore !== null) return;
		const i = kt(r).documentElement,
			l = Sn(i).getComputedStyle(i).overflowY;
		if (l === "hidden" || l === "clip") {
			this.restore = Em;
			return;
		}
		const u = sS || !m8(r);
		this.restore = u ? y8(r) : b8(r);
	}
}
const S8 = new v8();
function Zx(n = !0, r = null) {
	$e(() => {
		if (n) return S8.acquire(r);
	}, [n, r]);
}
function x8(n) {
	const r = v.useRef(""),
		o = v.useCallback(
			(l) => {
				l.defaultPrevented || ((r.current = l.pointerType), n(l, l.pointerType));
			},
			[n]
		);
	return {
		onClick: v.useCallback(
			(l) => {
				if (l.detail === 0) {
					n(l, "keyboard");
					return;
				}
				"pointerType" in l ? n(l, l.pointerType) : n(l, r.current), (r.current = "");
			},
			[n]
		),
		onPointerDown: o,
	};
}
function Jx(n) {
	const [r, o] = v.useState(null),
		i = Ke((h, p) => {
			n || o(p || (sS ? "touch" : ""));
		}),
		l = v.useCallback(() => {
			o(null);
		}, []),
		{ onClick: u, onPointerDown: c } = x8(i);
	return v.useMemo(
		() => ({ openMethod: r, reset: l, triggerProps: { onClick: u, onPointerDown: c } }),
		[r, l, u, c]
	);
}
function w8(n) {
	const { store: r, parentContext: o, actionsRef: i } = n,
		l = r.useState("open"),
		u = r.useState("disablePointerDismissal"),
		c = r.useState("modal"),
		h = r.useState("popupElement"),
		{ openMethod: p, triggerProps: f, reset: y } = Jx(l);
	Lm(r);
	const { forceUnmount: g } = zm(l, r, () => {
			y();
		}),
		S = Ke((we) => {
			const se = gt(we);
			return (
				(se.preventUnmountOnClose = () => {
					r.set("preventUnmountingOnClose", !0);
				}),
				se
			);
		}),
		b = v.useCallback(() => {
			r.setOpen(!1, S(Cm));
		}, [r, S]);
	v.useImperativeHandle(i, () => ({ unmount: g, close: b }), [g, b]);
	const w = Um({
			popupStore: r,
			onOpenChange: r.setOpen,
			treatPopupAsFloatingElement: !0,
			noEmit: !0,
		}),
		[R, O] = v.useState(0),
		T = R === 0,
		L = cx(w),
		M = _m(w, {
			outsidePressEvent() {
				return r.context.internalBackdropRef.current || r.context.backdropRef.current
					? "intentional"
					: { mouse: c === "trap-focus" ? "sloppy" : "intentional", touch: "sloppy" };
			},
			outsidePress(we) {
				if (
					!r.context.outsidePressEnabledRef.current ||
					("button" in we && we.button !== 0) ||
					("touches" in we && we.touches.length !== 1)
				)
					return !1;
				const se = In(we);
				if (T && !u) {
					const Y = se;
					return c &&
						(r.context.internalBackdropRef.current || r.context.backdropRef.current)
						? r.context.internalBackdropRef.current === Y ||
								r.context.backdropRef.current === Y ||
								(ft(Y, h) && !(Y != null && Y.hasAttribute("data-base-ui-portal")))
						: !0;
				}
				return !1;
			},
			escapeKey: T,
		});
	Zx(l && c === !0, h);
	const { getReferenceProps: _, getFloatingProps: N, getTriggerProps: D } = Cf([L, M]);
	r.useContextCallback("onNestedDialogOpen", (we) => {
		O(we + 1);
	}),
		r.useContextCallback("onNestedDialogClose", () => {
			O(0);
		}),
		v.useEffect(
			() => (
				o != null && o.onNestedDialogOpen && l && o.onNestedDialogOpen(R),
				o != null && o.onNestedDialogClose && !l && o.onNestedDialogClose(),
				() => {
					o != null && o.onNestedDialogClose && l && o.onNestedDialogClose();
				}
			),
			[l, o, R]
		);
	const H = v.useMemo(() => _(f), [_, f]),
		U = v.useMemo(() => D(f), [D, f]),
		fe = v.useMemo(() => N(), [N]);
	r.useSyncedValues({
		openMethod: p,
		activeTriggerProps: H,
		inactiveTriggerProps: U,
		popupProps: fe,
		floatingRootContext: w,
		nestedOpenDialogCount: R,
	});
}
const E8 = _e(P({}, Bm), {
	modal: et((n) => n.modal),
	nested: et((n) => n.nested),
	nestedOpenDialogCount: et((n) => n.nestedOpenDialogCount),
	disablePointerDismissal: et((n) => n.disablePointerDismissal),
	openMethod: et((n) => n.openMethod),
	descriptionElementId: et((n) => n.descriptionElementId),
	titleElementId: et((n) => n.titleElementId),
	viewportElement: et((n) => n.viewportElement),
	role: et((n) => n.role),
});
class R8 extends Tf {
	constructor(o) {
		super(
			T8(o),
			{
				popupRef: v.createRef(),
				backdropRef: v.createRef(),
				internalBackdropRef: v.createRef(),
				outsidePressEnabledRef: { current: !0 },
				triggerElements: new tu(),
				onOpenChange: void 0,
				onOpenChangeComplete: void 0,
			},
			E8
		);
		jt(this, "setOpen", (o, i) => {
			var h, p, f, y, g, S, b;
			if (
				((i.preventUnmountOnClose = () => {
					this.set("preventUnmountingOnClose", !0);
				}),
				!o &&
					i.trigger == null &&
					this.state.activeTriggerId != null &&
					(i.trigger = (h = this.state.activeTriggerElement) != null ? h : void 0),
				(f = (p = this.context).onOpenChange) == null || f.call(p, o, i),
				i.isCanceled)
			)
				return;
			const l = {
				open: o,
				nativeEvent: i.event,
				reason: i.reason,
				nested: this.state.nested,
			};
			(y = this.state.floatingRootContext.context.events) == null || y.emit("openchange", l);
			const u = { open: o },
				c = (S = (g = i.trigger) == null ? void 0 : g.id) != null ? S : null;
			(c || o) &&
				((u.activeTriggerId = c),
				(u.activeTriggerElement = (b = i.trigger) != null ? b : null)),
				this.update(u);
		});
	}
}
function T8(n = {}) {
	return P(
		_e(P({}, jm()), {
			modal: !0,
			disablePointerDismissal: !1,
			popupElement: null,
			viewportElement: null,
			descriptionElementId: void 0,
			titleElementId: void 0,
			openMethod: null,
			nested: !1,
			nestedOpenDialogCount: 0,
			role: "dialog",
		}),
		n
	);
}
function C8(n) {
	const {
			children: r,
			open: o,
			defaultOpen: i = !1,
			onOpenChange: l,
			onOpenChangeComplete: u,
			disablePointerDismissal: c = !1,
			modal: h = !0,
			actionsRef: p,
			handle: f,
			triggerId: y,
			defaultTriggerId: g = null,
		} = n,
		S = Si(!0),
		b = !!S,
		w = Hn(() => {
			var T;
			return (T = f == null ? void 0 : f.store) != null
				? T
				: new R8({
						open: i,
						openProp: o,
						activeTriggerId: g,
						triggerIdProp: y,
						modal: h,
						disablePointerDismissal: c,
						nested: b,
				  });
		}).current;
	hm(() => {
		o === void 0 &&
			w.state.open === !1 &&
			i === !0 &&
			w.update({ open: !0, activeTriggerId: g });
	}),
		w.useControlledProp("openProp", o),
		w.useControlledProp("triggerIdProp", y),
		w.useSyncedValues({ disablePointerDismissal: c, nested: b, modal: h }),
		w.useContextCallback("onOpenChange", l),
		w.useContextCallback("onOpenChangeComplete", u);
	const R = w.useState("payload");
	w8({ store: w, actionsRef: p, parentContext: S == null ? void 0 : S.store.context });
	const O = v.useMemo(() => ({ store: w }), [w]);
	return K.jsx(qx.Provider, {
		value: O,
		children: typeof r == "function" ? r({ payload: R }) : r,
	});
}
const O8 = v.forwardRef(function (r, o) {
	const f = r,
		{ render: i, className: l, id: u } = f,
		c = Be(f, ["render", "className", "id"]),
		{ store: h } = Si(),
		p = nu(u);
	return (
		h.useSyncedValueWithCleanup("titleElementId", p),
		fn("h2", r, { ref: o, props: [{ id: p }, c] })
	);
});
function A8(r) {
	var n = Be(r, []);
	return K.jsx(C8, P({ "data-slot": "sheet" }, n));
}
function M8(r) {
	var n = Be(r, []);
	return K.jsx(p8, P({ "data-slot": "sheet-portal" }, n));
}
function k8(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		r8,
		P(
			{
				"data-slot": "sheet-overlay",
				className: Yt(
					"data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/80 duration-100 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-50",
					n
				),
			},
			r
		)
	);
}
function _8(u) {
	var c = u,
		{ className: n, children: r, side: o = "right", showCloseButton: i = !0 } = c,
		l = Be(c, ["className", "children", "side", "showCloseButton"]);
	return K.jsxs(M8, {
		children: [
			K.jsx(k8, {}),
			K.jsxs(
				h8,
				_e(
					P(
						{
							"data-slot": "sheet-content",
							"data-side": o,
							className: Yt(
								"bg-background data-open:animate-in data-closed:animate-out data-[side=right]:data-closed:slide-out-to-right-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=top]:data-closed:slide-out-to-top-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:fade-out-0 data-open:fade-in-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=bottom]:data-open:slide-in-from-bottom-10 fixed z-50 flex flex-col bg-clip-padding text-sm shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
								n
							),
						},
						l
					),
					{
						children: [
							r,
							i &&
								K.jsxs(o8, {
									"data-slot": "sheet-close",
									render: K.jsx(Hx, {
										variant: "ghost",
										className: "absolute top-4 right-4",
										size: "icon-sm",
									}),
									children: [
										K.jsx(hi, { icon: U4, strokeWidth: 2 }),
										K.jsx("span", { className: "sr-only", children: "Close" }),
									],
								}),
						],
					}
				)
			),
		],
	});
}
function D8(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		"div",
		P({ "data-slot": "sheet-header", className: Yt("gap-1.5 p-6 flex flex-col", n) }, r)
	);
}
function N8(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		O8,
		P(
			{
				"data-slot": "sheet-title",
				className: Yt("text-foreground text-base font-medium", n),
			},
			r
		)
	);
}
function L8(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		a8,
		P(
			{
				"data-slot": "sheet-description",
				className: Yt("text-muted-foreground text-sm", n),
			},
			r
		)
	);
}
const z8 = "sidebar_state",
	j8 = 3600 * 24 * 7,
	B8 = "16rem",
	U8 = "18rem",
	H8 = "3rem",
	q8 = "b",
	Wx = v.createContext(null);
function kf() {
	const n = v.useContext(Wx);
	if (!n) throw new Error("useSidebar must be used within a SidebarProvider.");
	return n;
}
function P8(h) {
	var p = h,
		{ defaultOpen: n = !0, open: r, onOpenChange: o, className: i, style: l, children: u } = p,
		c = Be(p, ["defaultOpen", "open", "onOpenChange", "className", "style", "children"]);
	const f = Q4(),
		[y, g] = v.useState(!1),
		[S, b] = v.useState(n),
		w = r != null ? r : S,
		R = v.useCallback(
			(M) => {
				const _ = typeof M == "function" ? M(w) : M;
				o ? o(_) : b(_), (document.cookie = `${z8}=${_}; path=/; max-age=${j8}`);
			},
			[o, w]
		),
		O = v.useCallback(() => (f ? g((M) => !M) : R((M) => !M)), [f, R, g]);
	v.useEffect(() => {
		const M = (_) => {
			_.key === q8 && (_.metaKey || _.ctrlKey) && (_.preventDefault(), O());
		};
		return (
			window.addEventListener("keydown", M), () => window.removeEventListener("keydown", M)
		);
	}, [O]);
	const T = w ? "expanded" : "collapsed",
		L = v.useMemo(
			() => ({
				state: T,
				open: w,
				setOpen: R,
				isMobile: f,
				openMobile: y,
				setOpenMobile: g,
				toggleSidebar: O,
			}),
			[T, w, R, f, y, g, O]
		);
	return K.jsx(Wx.Provider, {
		value: L,
		children: K.jsx(
			"div",
			_e(
				P(
					{
						"data-slot": "sidebar-wrapper",
						style: P({ "--sidebar-width": B8, "--sidebar-width-icon": H8 }, l),
						className: Yt(
							"group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
							i
						),
					},
					c
				),
				{ children: u }
			)
		),
	});
}
function V8(h) {
	var p = h,
		{
			side: n = "left",
			variant: r = "sidebar",
			collapsible: o = "offcanvas",
			className: i,
			children: l,
			dir: u,
		} = p,
		c = Be(p, ["side", "variant", "collapsible", "className", "children", "dir"]);
	const { isMobile: f, state: y, openMobile: g, setOpenMobile: S } = kf();
	return o === "none"
		? K.jsx(
				"div",
				_e(
					P(
						{
							"data-slot": "sidebar",
							className: Yt(
								"bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
								i
							),
						},
						c
					),
					{ children: l }
				)
		  )
		: f
		? K.jsx(
				A8,
				_e(P({ open: g, onOpenChange: S }, c), {
					children: K.jsxs(_8, {
						dir: u,
						"data-sidebar": "sidebar",
						"data-slot": "sidebar",
						"data-mobile": "true",
						className:
							"bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
						style: { "--sidebar-width": U8 },
						side: n,
						children: [
							K.jsxs(D8, {
								className: "sr-only",
								children: [
									K.jsx(N8, { children: "Sidebar" }),
									K.jsx(L8, { children: "Displays the mobile sidebar." }),
								],
							}),
							K.jsx("div", {
								className: "flex h-full w-full flex-col",
								children: l,
							}),
						],
					}),
				})
		  )
		: K.jsxs("div", {
				className: "group peer text-sidebar-foreground hidden md:block",
				"data-state": y,
				"data-collapsible": y === "collapsed" ? o : "",
				"data-variant": r,
				"data-side": n,
				"data-slot": "sidebar",
				children: [
					K.jsx("div", {
						"data-slot": "sidebar-gap",
						className: Yt(
							"transition-[width] duration-200 ease-linear relative w-(--sidebar-width) bg-transparent",
							"group-data-[collapsible=offcanvas]:w-0",
							"group-data-[side=right]:rotate-180",
							r === "floating" || r === "inset"
								? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
								: "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
						),
					}),
					K.jsx(
						"div",
						_e(
							P(
								{
									"data-slot": "sidebar-container",
									"data-side": n,
									className: Yt(
										"fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex",
										r === "floating" || r === "inset"
											? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
											: "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
										i
									),
								},
								c
							),
							{
								children: K.jsx("div", {
									"data-sidebar": "sidebar",
									"data-slot": "sidebar-inner",
									className:
										"bg-sidebar group-data-[variant=floating]:ring-sidebar-border group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 flex size-full flex-col",
									children: l,
								}),
							}
						)
					),
				],
		  });
}
function Y8(i) {
	var l = i,
		{ className: n, onClick: r } = l,
		o = Be(l, ["className", "onClick"]);
	const { toggleSidebar: u } = kf();
	return K.jsxs(
		Hx,
		_e(
			P(
				{
					"data-sidebar": "trigger",
					"data-slot": "sidebar-trigger",
					variant: "ghost",
					size: "icon-sm",
					className: Yt(n),
					onClick: (c) => {
						r == null || r(c), u();
					},
				},
				o
			),
			{
				children: [
					K.jsx(hi, { icon: I4, strokeWidth: 2 }),
					K.jsx("span", { className: "sr-only", children: "Toggle Sidebar" }),
				],
			}
		)
	);
}
function I8(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		"main",
		P(
			{
				"data-slot": "sidebar-inset",
				className: Yt(
					"bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 relative flex w-full flex-1 flex-col",
					n
				),
			},
			r
		)
	);
}
function G8(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		"div",
		P(
			{
				"data-slot": "sidebar-header",
				"data-sidebar": "header",
				className: Yt("gap-2 p-2 [--radius:var(--radius-xl)] flex flex-col", n),
			},
			r
		)
	);
}
function F8(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		"div",
		P(
			{
				"data-slot": "sidebar-footer",
				"data-sidebar": "footer",
				className: Yt("gap-2 p-2 flex flex-col", n),
			},
			r
		)
	);
}
function X8(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		"div",
		P(
			{
				"data-slot": "sidebar-content",
				"data-sidebar": "content",
				className: Yt(
					"no-scrollbar gap-2 [--radius:var(--radius-xl)] flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden",
					n
				),
			},
			r
		)
	);
}
function K8(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		"div",
		P(
			{
				"data-slot": "sidebar-group",
				"data-sidebar": "group",
				className: Yt("p-2 relative flex w-full min-w-0 flex-col", n),
			},
			r
		)
	);
}
function Q8(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		"div",
		P(
			{
				"data-slot": "sidebar-group-content",
				"data-sidebar": "group-content",
				className: Yt("text-sm w-full", n),
			},
			r
		)
	);
}
function Wv(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		"ul",
		P(
			{
				"data-slot": "sidebar-menu",
				"data-sidebar": "menu",
				className: Yt("gap-1 flex w-full min-w-0 flex-col", n),
			},
			r
		)
	);
}
function $v(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		"li",
		P(
			{
				"data-slot": "sidebar-menu-item",
				"data-sidebar": "menu-item",
				className: Yt("group/menu-item relative", n),
			},
			r
		)
	);
}
const Z8 = Ux(
	"ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground gap-2 rounded-lg px-3 py-2 text-left text-sm transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 data-active:font-medium peer/menu-button flex w-full items-center overflow-hidden outline-hidden group/menu-button disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
				outline:
					"bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
			},
			size: {
				default: "h-9 text-sm",
				sm: "h-8 text-xs",
				lg: "h-14 px-3 text-sm group-data-[collapsible=icon]:p-0!",
			},
		},
		defaultVariants: { variant: "default", size: "default" },
	}
);
function e1(h) {
	var p = h,
		{
			render: n,
			isActive: r = !1,
			variant: o = "default",
			size: i = "default",
			tooltip: l,
			className: u,
		} = p,
		c = Be(p, ["render", "isActive", "variant", "size", "tooltip", "className"]);
	const { isMobile: f, state: y } = kf(),
		g = K4({
			defaultTagName: "button",
			props: As({ className: Yt(Z8({ variant: o, size: i }), u) }, c),
			render: l ? O4 : n,
			state: { slot: "sidebar-menu-button", sidebar: "menu-button", size: i, active: r },
		});
	return l
		? (typeof l == "string" && (l = { children: l }),
		  K.jsxs(C4, {
				children: [
					g,
					K.jsx(
						A4,
						P({ side: "right", align: "center", hidden: y !== "collapsed" || f }, l)
					),
				],
		  }))
		: g;
}
const $x = v.createContext(void 0);
function ew(n) {
	const r = v.useContext($x);
	if (r === void 0 && !n) throw new Error(Xn(33));
	return r;
}
const tw = v.createContext(void 0);
function xi(n) {
	const r = v.useContext(tw);
	if (r === void 0 && !n) throw new Error(Xn(36));
	return r;
}
const J8 = v.createContext(void 0);
function _f(n = !0) {
	const r = v.useContext(J8);
	if (r === void 0 && !n) throw new Error(Xn(25));
	return r;
}
function W8(n) {
	const {
			closeOnClick: r,
			highlighted: o,
			id: i,
			nodeId: l,
			store: u,
			itemRef: c,
			itemMetadata: h,
		} = n,
		{ events: p } = u.useState("floatingTreeRoot"),
		f = _f(!0),
		y = f !== void 0;
	return v.useMemo(
		() => ({
			id: i,
			role: "menuitem",
			tabIndex: o ? 0 : -1,
			onMouseMove(g) {
				l && p.emit("itemhover", { nodeId: l, target: g.currentTarget });
			},
			onClick(g) {
				r && p.emit("close", { domEvent: g, reason: DS });
			},
			onMouseUp(g) {
				if (f) {
					const S = f.initialCursorPointRef.current;
					if (
						((f.initialCursorPointRef.current = null),
						y && S && Math.abs(g.clientX - S.x) <= 1 && Math.abs(g.clientY - S.y) <= 1)
					)
						return;
				}
				c.current &&
					u.context.allowMouseUpTriggerRef.current &&
					(!y || g.button === 2) &&
					(!h || h.type === "regular-item") &&
					c.current.click();
			},
		}),
		[r, o, i, p, l, u, c, f, y, h]
	);
}
const $8 = { type: "regular-item" };
function eM(n) {
	const {
			closeOnClick: r,
			disabled: o = !1,
			highlighted: i,
			id: l,
			store: u,
			nativeButton: c,
			itemMetadata: h,
			nodeId: p,
		} = n,
		f = v.useRef(null),
		{ getButtonProps: y, buttonRef: g } = Mf({
			disabled: o,
			focusableWhenDisabled: !0,
			native: c,
		}),
		S = W8({
			closeOnClick: r,
			highlighted: i,
			id: l,
			nodeId: p,
			store: u,
			itemRef: f,
			itemMetadata: h,
		}),
		b = v.useCallback(
			(R) =>
				As(
					S,
					{
						onMouseEnter() {
							h.type === "submenu-trigger" && h.setActive();
						},
						onKeyUp(O) {
							O.key === " " &&
								u.context.typingRef.current &&
								O.preventBaseUIHandler();
						},
					},
					R,
					y
				),
			[S, y, u, h]
		),
		w = Cs(f, g);
	return v.useMemo(() => ({ getItemProps: b, itemRef: w }), [b, w]);
}
const nw = v.createContext({
	register: () => {},
	unregister: () => {},
	subscribeMapChange: () => () => {},
	elementsRef: { current: [] },
	nextIndexRef: { current: 0 },
});
function tM() {
	return v.useContext(nw);
}
let nM = (function (n) {
	return (n[(n.None = 0)] = "None"), (n[(n.GuessFromOrder = 1)] = "GuessFromOrder"), n;
})({});
function rw(n = {}) {
	const { label: r, metadata: o, textRef: i, indexGuessBehavior: l, index: u } = n,
		{
			register: c,
			unregister: h,
			subscribeMapChange: p,
			elementsRef: f,
			labelsRef: y,
			nextIndexRef: g,
		} = tM(),
		S = v.useRef(-1),
		[b, w] = v.useState(
			u != null
				? u
				: l === nM.GuessFromOrder
				? () => {
						if (S.current === -1) {
							const T = g.current;
							(g.current += 1), (S.current = T);
						}
						return S.current;
				  }
				: -1
		),
		R = v.useRef(null),
		O = v.useCallback(
			(T) => {
				var L, M;
				if (((R.current = T), b !== -1 && T !== null && ((f.current[b] = T), y))) {
					const _ = r !== void 0;
					y.current[b] = _
						? r
						: (M =
								(L = i == null ? void 0 : i.current) == null
									? void 0
									: L.textContent) != null
						? M
						: T.textContent;
				}
			},
			[b, f, y, r, i]
		);
	return (
		$e(() => {
			if (u != null) return;
			const T = R.current;
			if (T)
				return (
					c(T, o),
					() => {
						h(T);
					}
				);
		}, [u, c, h, o]),
		$e(() => {
			if (u == null)
				return p((T) => {
					var M;
					const L = R.current
						? (M = T.get(R.current)) == null
							? void 0
							: M.index
						: null;
					L != null && w(L);
				});
		}, [u, p, w]),
		v.useMemo(() => ({ ref: O, index: b }), [b, O])
	);
}
const rM = v.forwardRef(function (r, o) {
		const _ = r,
			{
				render: i,
				className: l,
				id: u,
				label: c,
				nativeButton: h = !1,
				disabled: p = !1,
				closeOnClick: f = !0,
			} = _,
			y = Be(_, [
				"render",
				"className",
				"id",
				"label",
				"nativeButton",
				"disabled",
				"closeOnClick",
			]),
			g = rw({ label: c }),
			S = ew(!0),
			b = nu(u),
			{ store: w } = xi(),
			R = w.useState("isActive", g.index),
			O = w.useState("itemProps"),
			{ getItemProps: T, itemRef: L } = eM({
				closeOnClick: f,
				disabled: p,
				highlighted: R,
				id: b,
				store: w,
				nativeButton: h,
				nodeId: S == null ? void 0 : S.nodeId,
				itemMetadata: $8,
			});
		return fn("div", r, {
			state: { disabled: p, highlighted: R },
			props: [O, y, T],
			ref: [L, o, g.ref],
		});
	}),
	oM = v.createContext(void 0);
function aM(n) {
	return v.useContext(oM);
}
const iM = P(P({}, bi), js),
	sM = v.forwardRef(function (r, o) {
		const xe = r,
			{ render: i, className: l, finalFocus: u } = xe,
			c = Be(xe, ["render", "className", "finalFocus"]),
			{ store: h } = xi(),
			{ side: p, align: f } = ew(),
			y = aM() != null,
			g = h.useState("open"),
			S = h.useState("transitionStatus"),
			b = h.useState("popupProps"),
			w = h.useState("mounted"),
			R = h.useState("instantType"),
			O = h.useState("activeTriggerElement"),
			T = h.useState("parent"),
			L = h.useState("lastOpenChangeReason"),
			M = h.useState("rootId"),
			_ = h.useState("floatingRootContext"),
			N = h.useState("floatingTreeRoot"),
			D = h.useState("closeDelay"),
			H = h.useState("activeTriggerElement"),
			U = T.type === "context-menu";
		Bs({
			open: g,
			ref: h.context.popupRef,
			onComplete() {
				var ge, j;
				g && ((j = (ge = h.context).onOpenChangeComplete) == null || j.call(ge, !0));
			},
		}),
			v.useEffect(() => {
				function ge(j) {
					h.setOpen(!1, gt(j.reason, j.domEvent));
				}
				return (
					N.events.on("close", ge),
					() => {
						N.events.off("close", ge);
					}
				);
			}, [N.events, h]);
		const fe = h.useState("hoverEnabled"),
			we = h.useState("disabled");
		lx(_, { enabled: fe && !we && !U && T.type !== "menubar", closeDelay: D });
		const se = {
				transitionStatus: S,
				side: p,
				align: f,
				open: g,
				nested: T.type === "menu",
				instant: R,
			},
			Y = fn("div", r, {
				state: se,
				ref: [o, h.context.popupRef],
				stateAttributesMapping: iM,
				props: [
					b,
					{
						onKeyDown(ge) {
							y && Kx.has(ge.key) && ge.stopPropagation();
						},
					},
					Af(S),
					c,
					{ "data-rootownerid": M },
				],
			});
		let oe = T.type === void 0 || U;
		return (
			(O || (T.type === "menubar" && L !== Tm)) && (oe = !0),
			K.jsx(GS, {
				context: _,
				modal: U,
				disabled: !w,
				returnFocus: u === void 0 ? oe : u,
				initialFocus: T.type !== "menu",
				restoreFocus: !0,
				externalTree: T.type !== "menubar" ? N : void 0,
				previousFocusableElement: H,
				nextFocusableElement: T.type === void 0 ? h.context.triggerFocusTargetRef : void 0,
				beforeContentFocusGuardRef:
					T.type === void 0 ? h.context.beforeContentFocusGuardRef : void 0,
				children: Y,
			})
		);
	}),
	ow = v.createContext(void 0);
function lM() {
	const n = v.useContext(ow);
	if (n === void 0) throw new Error(Xn(32));
	return n;
}
const uM = v.forwardRef(function (r, o) {
	const p = r,
		{ keepMounted: i = !1 } = p,
		l = Be(p, ["keepMounted"]),
		{ store: u } = xi();
	return u.useState("mounted") || i
		? K.jsx(ow.Provider, { value: i, children: K.jsx(IS, P({ ref: o }, l)) })
		: null;
});
function cM(n) {
	const { children: r, elementsRef: o, labelsRef: i, onMapChange: l } = n,
		u = Ke(l),
		c = v.useRef(0),
		h = Hn(dM).current,
		p = Hn(fM).current,
		[f, y] = v.useState(0),
		g = v.useRef(f),
		S = Ke((T, L) => {
			p.set(T, L != null ? L : null), (g.current += 1), y(g.current);
		}),
		b = Ke((T) => {
			p.delete(T), (g.current += 1), y(g.current);
		}),
		w = v.useMemo(() => {
			const T = new Map();
			return (
				Array.from(p.keys())
					.filter((M) => M.isConnected)
					.sort(hM)
					.forEach((M, _) => {
						var D;
						const N = (D = p.get(M)) != null ? D : {};
						T.set(M, _e(P({}, N), { index: _ }));
					}),
				T
			);
		}, [p, f]);
	$e(() => {
		if (typeof MutationObserver != "function" || w.size === 0) return;
		const T = new MutationObserver((L) => {
			const M = new Set(),
				_ = (N) => (M.has(N) ? M.delete(N) : M.add(N));
			L.forEach((N) => {
				N.removedNodes.forEach(_), N.addedNodes.forEach(_);
			}),
				M.size === 0 && ((g.current += 1), y(g.current));
		});
		return (
			w.forEach((L, M) => {
				M.parentElement && T.observe(M.parentElement, { childList: !0 });
			}),
			() => {
				T.disconnect();
			}
		);
	}, [w]),
		$e(() => {
			g.current === f &&
				(o.current.length !== w.size && (o.current.length = w.size),
				i && i.current.length !== w.size && (i.current.length = w.size),
				(c.current = w.size)),
				u(w);
		}, [u, w, o, i, f]),
		$e(
			() => () => {
				o.current = [];
			},
			[o]
		),
		$e(
			() => () => {
				i && (i.current = []);
			},
			[i]
		);
	const R = Ke(
		(T) => (
			h.add(T),
			() => {
				h.delete(T);
			}
		)
	);
	$e(() => {
		h.forEach((T) => T(w));
	}, [h, w]);
	const O = v.useMemo(
		() => ({
			register: S,
			unregister: b,
			subscribeMapChange: R,
			elementsRef: o,
			labelsRef: i,
			nextIndexRef: c,
		}),
		[S, b, R, o, i, c]
	);
	return K.jsx(nw.Provider, { value: O, children: r });
}
function fM() {
	return new Map();
}
function dM() {
	return new Set();
}
function hM(n, r) {
	const o = n.compareDocumentPosition(r);
	return o & Node.DOCUMENT_POSITION_FOLLOWING || o & Node.DOCUMENT_POSITION_CONTAINED_BY
		? -1
		: o & Node.DOCUMENT_POSITION_PRECEDING || o & Node.DOCUMENT_POSITION_CONTAINS
		? 1
		: 0;
}
const pM = v.forwardRef(function (r, o) {
		var re, ce, de, Te;
		const it = r,
			{
				anchor: i,
				positionMethod: l = "absolute",
				className: u,
				render: c,
				side: h,
				align: p,
				sideOffset: f = 0,
				alignOffset: y = 0,
				collisionBoundary: g = "clipping-ancestors",
				collisionPadding: S = 5,
				arrowPadding: b = 5,
				sticky: w = !1,
				disableAnchorTracking: R = !1,
				collisionAvoidance: O = KO,
			} = it,
			T = Be(it, [
				"anchor",
				"positionMethod",
				"className",
				"render",
				"side",
				"align",
				"sideOffset",
				"alignOffset",
				"collisionBoundary",
				"collisionPadding",
				"arrowPadding",
				"sticky",
				"disableAnchorTracking",
				"collisionAvoidance",
			]),
			{ store: L } = xi(),
			M = lM(),
			_ = _f(!0),
			N = L.useState("parent"),
			D = L.useState("floatingRootContext"),
			H = L.useState("floatingTreeRoot"),
			U = L.useState("mounted"),
			fe = L.useState("open"),
			we = L.useState("modal"),
			se = L.useState("activeTriggerElement"),
			Y = L.useState("transitionStatus"),
			oe = L.useState("lastOpenChangeReason"),
			xe = L.useState("floatingNodeId"),
			ge = L.useState("floatingParentNodeId");
		let j = i,
			I = f,
			F = y,
			pe = p,
			J = O;
		N.type === "context-menu" &&
			((j = i != null ? i : (re = N.context) == null ? void 0 : re.anchor),
			(pe = pe != null ? pe : "start"),
			!h &&
				pe !== "center" &&
				((F = (ce = r.alignOffset) != null ? ce : 2),
				(I = (de = r.sideOffset) != null ? de : -5)));
		let B = h,
			Z = pe;
		N.type === "menu"
			? ((B = B != null ? B : "inline-end"),
			  (Z = Z != null ? Z : "start"),
			  (J = (Te = r.collisionAvoidance) != null ? Te : _S))
			: N.type === "menubar" &&
			  ((B = B != null ? B : "bottom"), (Z = Z != null ? Z : "start"));
		const ee = N.type === "context-menu",
			ie = bx({
				anchor: j,
				floatingRootContext: D,
				positionMethod: _ ? "fixed" : l,
				mounted: U,
				side: B,
				sideOffset: I,
				align: Z,
				alignOffset: F,
				arrowPadding: ee ? 0 : b,
				collisionBoundary: g,
				collisionPadding: S,
				sticky: w,
				nodeId: xe,
				keepMounted: M,
				disableAnchorTracking: R,
				collisionAvoidance: J,
				shiftCrossAxis: ee && !("side" in J && J.side === "flip"),
				externalTree: H,
			}),
			me = v.useMemo(() => {
				const Re = {};
				return (
					fe || (Re.pointerEvents = "none"),
					{ role: "presentation", hidden: !U, style: P(P({}, ie.positionerStyles), Re) }
				);
			}, [fe, U, ie.positionerStyles]);
		v.useEffect(() => {
			function Re(ze) {
				ze.open &&
					(ze.parentNodeId === xe && L.set("hoverEnabled", !1),
					ze.nodeId !== xe &&
						ze.parentNodeId === L.select("floatingParentNodeId") &&
						L.setOpen(!1, gt(Qc)));
			}
			return (
				H.events.on("menuopenchange", Re),
				() => {
					H.events.off("menuopenchange", Re);
				}
			);
		}, [L, H.events, xe]),
			v.useEffect(() => {
				if (L.select("floatingParentNodeId") == null) return;
				function Re(ze) {
					var le;
					if (ze.open || ze.nodeId !== L.select("floatingParentNodeId")) return;
					const Ce = (le = ze.reason) != null ? le : Qc;
					L.setOpen(!1, gt(Ce));
				}
				return (
					H.events.on("menuopenchange", Re),
					() => {
						H.events.off("menuopenchange", Re);
					}
				);
			}, [H.events, L]),
			v.useEffect(() => {
				function Re(ze) {
					!fe ||
						ze.nodeId !== L.select("floatingParentNodeId") ||
						(ze.target && se && se !== ze.target && L.setOpen(!1, gt(Qc)));
				}
				return (
					H.events.on("itemhover", Re),
					() => {
						H.events.off("itemhover", Re);
					}
				);
			}, [H.events, fe, se, L]),
			v.useEffect(() => {
				const Re = {
					open: fe,
					nodeId: xe,
					parentNodeId: ge,
					reason: L.select("lastOpenChangeReason"),
				};
				H.events.emit("menuopenchange", Re);
			}, [H.events, fe, L, xe, ge]);
		const ve = {
				open: fe,
				side: ie.side,
				align: ie.align,
				anchorHidden: ie.anchorHidden,
				nested: N.type === "menu",
			},
			ke = v.useMemo(
				() => ({
					side: ie.side,
					align: ie.align,
					arrowRef: ie.arrowRef,
					arrowUncentered: ie.arrowUncentered,
					arrowStyles: ie.arrowStyles,
					nodeId: ie.context.nodeId,
				}),
				[
					ie.side,
					ie.align,
					ie.arrowRef,
					ie.arrowUncentered,
					ie.arrowStyles,
					ie.context.nodeId,
				]
			),
			je = fn("div", r, {
				state: ve,
				stateAttributesMapping: bi,
				ref: [o, L.useStateSetter("positionerElement")],
				props: [me, Af(Y), T],
			}),
			Ee =
				U &&
				N.type !== "menu" &&
				((N.type !== "menubar" && we && oe !== Gn) ||
					(N.type === "menubar" && N.context.modal));
		let Qe = null;
		return (
			N.type === "menubar"
				? (Qe = N.context.contentElement)
				: N.type === void 0 && (Qe = se),
			K.jsxs($x.Provider, {
				value: ke,
				children: [
					Ee &&
						K.jsx(Qx, {
							ref:
								N.type === "context-menu" || N.type === "nested-context-menu"
									? N.context.internalBackdropRef
									: null,
							inert: vx(!fe),
							cutout: Qe,
						}),
					K.jsx(VO, {
						id: xe,
						children: K.jsx(cM, {
							elementsRef: L.context.itemDomElements,
							labelsRef: L.context.itemLabels,
							children: je,
						}),
					}),
				],
			})
		);
	}),
	mM = v.createContext(null);
function aw(n) {
	return v.useContext(mM);
}
const gM = _e(P({}, Bm), {
	disabled: et((n) => (n.parent.type === "menubar" && n.parent.context.disabled) || n.disabled),
	modal: et((n) => {
		var r;
		return (
			(n.parent.type === void 0 || n.parent.type === "context-menu") &&
			((r = n.modal) != null ? r : !0)
		);
	}),
	allowMouseEnter: et((n) => n.allowMouseEnter),
	stickIfOpen: et((n) => n.stickIfOpen),
	parent: et((n) => n.parent),
	rootId: et((n) =>
		n.parent.type === "menu"
			? n.parent.store.select("rootId")
			: n.parent.type !== void 0
			? n.parent.context.rootId
			: n.rootId
	),
	activeIndex: et((n) => n.activeIndex),
	isActive: et((n, r) => n.activeIndex === r),
	hoverEnabled: et((n) => n.hoverEnabled),
	instantType: et((n) => n.instantType),
	lastOpenChangeReason: et((n) => n.openChangeReason),
	floatingTreeRoot: et((n) =>
		n.parent.type === "menu" ? n.parent.store.select("floatingTreeRoot") : n.floatingTreeRoot
	),
	floatingNodeId: et((n) => n.floatingNodeId),
	floatingParentNodeId: et((n) => n.floatingParentNodeId),
	itemProps: et((n) => n.itemProps),
	closeDelay: et((n) => n.closeDelay),
	keyboardEventRelay: et((n) => {
		if (n.keyboardEventRelay) return n.keyboardEventRelay;
		if (n.parent.type === "menu") return n.parent.store.select("keyboardEventRelay");
	}),
});
class Im extends Tf {
	constructor(o) {
		super(
			P(P({}, yM()), o),
			{
				positionerRef: v.createRef(),
				popupRef: v.createRef(),
				typingRef: { current: !1 },
				itemDomElements: { current: [] },
				itemLabels: { current: [] },
				allowMouseUpTriggerRef: { current: !1 },
				triggerFocusTargetRef: v.createRef(),
				beforeContentFocusGuardRef: v.createRef(),
				onOpenChangeComplete: void 0,
				triggerElements: new tu(),
			},
			gM
		);
		jt(this, "unsubscribeParentListener", null);
		this.unsubscribeParentListener = this.observe("parent", (i) => {
			var l;
			if (
				((l = this.unsubscribeParentListener) == null || l.call(this), i.type === "menu")
			) {
				(this.unsubscribeParentListener = i.store.subscribe(() => {
					this.notifyAll();
				})),
					(this.context.allowMouseUpTriggerRef = i.store.context.allowMouseUpTriggerRef);
				return;
			}
			i.type !== void 0 &&
				(this.context.allowMouseUpTriggerRef = i.context.allowMouseUpTriggerRef),
				(this.unsubscribeParentListener = null);
		});
	}
	setOpen(o, i) {
		this.state.floatingRootContext.context.events.emit("setOpen", {
			open: o,
			eventDetails: i,
		});
	}
	static useStore(o, i) {
		const l = Hn(() => new Im(i)).current;
		return o != null ? o : l;
	}
}
function yM() {
	return _e(P({}, jm()), {
		disabled: !1,
		modal: !0,
		allowMouseEnter: !1,
		stickIfOpen: !0,
		parent: { type: void 0 },
		rootId: void 0,
		activeIndex: null,
		hoverEnabled: !0,
		instantType: void 0,
		openChangeReason: null,
		floatingTreeRoot: new wm(),
		floatingNodeId: void 0,
		floatingParentNodeId: null,
		itemProps: kn,
		keyboardEventRelay: void 0,
		closeDelay: 0,
	});
}
const bM = v.createContext(void 0);
function vM() {
	return v.useContext(bM);
}
const SM = dm(function (r) {
	const {
			children: o,
			open: i,
			onOpenChange: l,
			onOpenChangeComplete: u,
			defaultOpen: c = !1,
			disabled: h = !1,
			modal: p,
			loopFocus: f = !0,
			orientation: y = "vertical",
			actionsRef: g,
			closeParentOnEsc: S = !1,
			handle: b,
			triggerId: w,
			defaultTriggerId: R = null,
			highlightItemOnHover: O = !0,
		} = r,
		T = _f(!0),
		L = xi(!0),
		M = aw(!0),
		_ = vM(),
		N = v.useMemo(
			() =>
				_ && L
					? { type: "menu", store: L.store }
					: M
					? { type: "menubar", context: M }
					: T && !L
					? { type: "context-menu", context: T }
					: { type: void 0 },
			[T, L, M, _]
		),
		D = Im.useStore(b == null ? void 0 : b.store, {
			open: c,
			openProp: i,
			activeTriggerId: R,
			triggerIdProp: w,
			parent: N,
		});
	hm(() => {
		i === void 0 &&
			D.state.open === !1 &&
			c === !0 &&
			D.update({ open: !0, activeTriggerId: R });
	}),
		D.useControlledProp("openProp", i),
		D.useControlledProp("triggerIdProp", w),
		D.useContextCallback("onOpenChangeComplete", u);
	const H = D.useState("floatingTreeRoot"),
		U = kS(H),
		fe = Wo();
	$e(() => {
		T && !L
			? D.update({
					parent: { type: "context-menu", context: T },
					floatingNodeId: U,
					floatingParentNodeId: fe,
			  })
			: L && D.update({ floatingNodeId: U, floatingParentNodeId: fe });
	}, [T, L, U, fe, D]);
	const we = D.useState("open"),
		se = D.useState("activeTriggerElement"),
		Y = D.useState("positionerElement"),
		oe = D.useState("hoverEnabled"),
		xe = D.useState("modal"),
		ge = D.useState("disabled"),
		j = D.useState("lastOpenChangeReason"),
		I = D.useState("parent"),
		F = D.useState("activeIndex"),
		pe = D.useState("payload"),
		J = D.useState("floatingParentNodeId"),
		B = v.useRef(null),
		Z = J != null;
	let ee;
	D.useSyncedValues({ disabled: h, modal: I.type === void 0 ? p : void 0, rootId: yi() });
	const { openMethod: ie, triggerProps: me, reset: ve } = Jx(we);
	Lm(D);
	const { forceUnmount: ke } = zm(we, D, () => {
			D.update({ allowMouseEnter: !1, stickIfOpen: !0 }), ve();
		}),
		je = v.useRef(I.type !== "context-menu"),
		Ee = mr();
	v.useEffect(() => {
		if ((we || (B.current = null), I.type === "context-menu")) {
			if (!we) {
				Ee.clear(), (je.current = !1);
				return;
			}
			Ee.start(500, () => {
				je.current = !0;
			});
		}
	}, [Ee, we, I.type]),
		Zx(we && xe && j !== Gn && ie !== "touch", Y),
		$e(() => {
			!we && !oe && D.set("hoverEnabled", !0);
		}, [we, oe, D]);
	const Qe = v.useRef(!0),
		it = mr(),
		re = Ke((Ze, rt) => {
			var Gt, Je, xt, Pt;
			const ht = rt.reason;
			if (
				(we === Ze && rt.trigger === se && j === ht) ||
				((rt.preventUnmountOnClose = () => {
					D.set("preventUnmountingOnClose", !0);
				}),
				!Ze && rt.trigger == null && (rt.trigger = se != null ? se : void 0),
				l == null || l(Ze, rt),
				rt.isCanceled)
			)
				return;
			const br = { open: Ze, nativeEvent: rt.event, reason: rt.reason, nested: Z };
			ee == null || ee.emit("openchange", br);
			const hn = rt.event;
			if (
				Ze === !1 &&
				(hn == null ? void 0 : hn.type) === "click" &&
				hn.pointerType === "touch" &&
				!Qe.current
			)
				return;
			if (!Ze && F !== null) {
				const Dt = D.context.itemDomElements.current[F];
				queueMicrotask(() => {
					Dt == null || Dt.setAttribute("tabindex", "-1");
				});
			}
			Ze && ht === bs
				? ((Qe.current = !1),
				  it.start(300, () => {
						Qe.current = !0;
				  }))
				: ((Qe.current = !0), it.clear());
			const lt =
					(ht === Es || ht === DS) &&
					hn.detail === 0 &&
					(hn == null ? void 0 : hn.isTrusted),
				_t = !Ze && (ht === Ef || ht == null),
				en = { open: Ze, openChangeReason: ht };
			B.current = (Gt = rt.event) != null ? Gt : null;
			const It = (xt = (Je = rt.trigger) == null ? void 0 : Je.id) != null ? xt : null;
			(It || Ze) &&
				((en.activeTriggerId = It),
				(en.activeTriggerElement = (Pt = rt.trigger) != null ? Pt : null)),
				D.update(en),
				I.type === "menubar" &&
				(ht === bs || ht === Rs || ht === Gn || ht === Kc || ht === Qc)
					? D.set("instantType", "group")
					: lt || _t
					? D.set("instantType", lt ? "click" : "dismiss")
					: D.set("instantType", void 0);
		}),
		ce = v.useCallback(
			(Ze) => {
				const rt = gt(Ze);
				return (
					(rt.preventUnmountOnClose = () => {
						D.set("preventUnmountingOnClose", !0);
					}),
					rt
				);
			},
			[D]
		),
		de = v.useCallback(() => {
			D.setOpen(!1, ce(Cm));
		}, [D, ce]);
	v.useImperativeHandle(g, () => ({ unmount: ke, close: de }), [ke, de]);
	let Te;
	I.type === "context-menu" && (Te = I.context),
		v.useImperativeHandle(Te == null ? void 0 : Te.positionerRef, () => Y, [Y]),
		v.useImperativeHandle(Te == null ? void 0 : Te.actionsRef, () => ({ setOpen: re }), [re]);
	const Re = Um({ popupStore: D, onOpenChange: re });
	(ee = Re.context.events),
		v.useEffect(() => {
			const Ze = ({ open: rt, eventDetails: ht }) => re(rt, ht);
			return (
				ee.on("setOpen", Ze),
				() => {
					ee == null || ee.off("setOpen", Ze);
				}
			);
		}, [ee, re]);
	const ze = _m(Re, {
			enabled: !ge,
			bubbles: { escapeKey: S && I.type === "menu" },
			outsidePress() {
				var Ze;
				return I.type !== "context-menu" ||
					((Ze = B.current) == null ? void 0 : Ze.type) === "contextmenu"
					? !0
					: je.current;
			},
			externalTree: Z ? H : void 0,
		}),
		Ce = cx(Re, { role: "menu" }),
		le = gx(),
		Ae = v.useCallback(
			(Ze) => {
				D.select("activeIndex") !== Ze && D.set("activeIndex", Ze);
			},
			[D]
		),
		Se = aA(Re, {
			enabled: !ge,
			listRef: D.context.itemDomElements,
			activeIndex: F,
			nested: I.type !== void 0,
			loopFocus: f,
			orientation: y,
			parentOrientation: I.type === "menubar" ? I.context.orientation : void 0,
			rtl: le === "rtl",
			disabledIndices: Vp,
			onNavigate: Ae,
			openOnArrowKeyDown: I.type !== "context-menu",
			externalTree: Z ? H : void 0,
			focusItemOnHover: O,
		}),
		Ue = v.useCallback(
			(Ze) => {
				D.context.typingRef.current = Ze;
			},
			[D]
		),
		Ye = sA(Re, {
			listRef: D.context.itemLabels,
			activeIndex: F,
			resetMs: IO,
			onMatch: (Ze) => {
				we && Ze !== F && D.set("activeIndex", Ze);
			},
			onTypingChange: Ue,
		}),
		{
			getReferenceProps: qe,
			getFloatingProps: X,
			getItemProps: Pe,
			getTriggerProps: Jt,
		} = Cf([ze, Ce, Se, Ye]),
		st = v.useMemo(() => {
			const Ze = As(
				qe(),
				{
					onMouseMove() {
						D.set("allowMouseEnter", !0);
					},
				},
				me
			);
			return delete Ze.role, Ze;
		}, [qe, D, me]),
		Mt = v.useMemo(() => {
			const Ze = Jt();
			if (!Ze) return Ze;
			const rt = As(Ze, me);
			return delete rt.role, delete rt["aria-controls"], rt;
		}, [Jt, me]),
		wt = v.useMemo(
			() =>
				X({
					onMouseMove() {
						D.set("allowMouseEnter", !0),
							I.type === "menu" && D.set("hoverEnabled", !1);
					},
					onClick() {
						D.select("hoverEnabled") && D.set("hoverEnabled", !1);
					},
					onKeyDown(Ze) {
						const rt = D.select("keyboardEventRelay");
						rt && !Ze.isPropagationStopped() && rt(Ze);
					},
				}),
			[X, I.type, D]
		),
		dn = v.useMemo(() => Pe(), [Pe]);
	D.useSyncedValues({
		floatingRootContext: Re,
		activeTriggerProps: st,
		inactiveTriggerProps: Mt,
		popupProps: wt,
		itemProps: dn,
	});
	const Tn = v.useMemo(() => ({ store: D, parent: N }), [D, N]),
		qn = K.jsx(tw.Provider, {
			value: Tn,
			children: typeof o == "function" ? o({ payload: pe }) : o,
		});
	return I.type === void 0 || I.type === "context-menu"
		? K.jsx(YO, { externalTree: H, children: qn })
		: qn;
});
function xM(n) {
	const r = n.getBoundingClientRect(),
		o = window.getComputedStyle(n, "::before"),
		i = window.getComputedStyle(n, "::after");
	if (!(o.content !== "none" || i.content !== "none")) return r;
	const u = parseFloat(o.width) || 0,
		c = parseFloat(o.height) || 0,
		h = parseFloat(i.width) || 0,
		p = parseFloat(i.height) || 0,
		f = Math.max(r.width, u, h),
		y = Math.max(r.height, c, p),
		g = f - r.width,
		S = y - r.height;
	return {
		left: r.left - g / 2,
		right: r.right + g / 2,
		top: r.top - S / 2,
		bottom: r.bottom + S / 2,
	};
}
function wM(n = {}) {
	const { highlightItemOnHover: r, highlightedIndex: o, onHighlightedIndexChange: i } = Ym(),
		{ ref: l, index: u } = rw(n),
		c = o === u,
		h = v.useRef(null),
		p = Cs(l, h);
	return {
		compositeProps: v.useMemo(
			() => ({
				tabIndex: c ? 0 : -1,
				onFocus() {
					i(u);
				},
				onMouseMove() {
					const y = h.current;
					if (!r || !y) return;
					const g = y.hasAttribute("disabled") || y.ariaDisabled === "true";
					!c && !g && y.focus();
				},
			}),
			[c, i, u, r]
		),
		compositeRef: p,
		index: u,
	};
}
function EM(n) {
	const S = n,
		{
			render: r,
			className: o,
			state: i = kn,
			props: l = Vp,
			refs: u = Vp,
			metadata: c,
			stateAttributesMapping: h,
			tag: p = "div",
		} = S,
		f = Be(S, [
			"render",
			"className",
			"state",
			"props",
			"refs",
			"metadata",
			"stateAttributesMapping",
			"tag",
		]),
		{ compositeProps: y, compositeRef: g } = wM({ metadata: c });
	return fn(p, n, { state: i, ref: [...u, g], props: [y, ...l, f], stateAttributesMapping: h });
}
function iw(n) {
	var r;
	if (nn(n) && n.hasAttribute("data-rootownerid"))
		return (r = n.getAttribute("data-rootownerid")) != null ? r : void 0;
	if (!fo(n)) return iw(yo(n));
}
function RM(n) {
	const { enabled: r = !0, mouseDownAction: o, open: i } = n,
		l = v.useRef(!1);
	return v.useMemo(
		() =>
			r
				? {
						onMouseDown: (u) => {
							((o === "open" && !i) || (o === "close" && i)) &&
								((l.current = !0),
								kt(u.currentTarget).addEventListener(
									"click",
									() => {
										l.current = !1;
									},
									{ once: !0 }
								));
						},
						onClick: (u) => {
							l.current && ((l.current = !1), u.preventBaseUIHandler());
						},
				  }
				: kn,
		[r, o, i]
	);
}
const Pc = 2,
	TM = tS(function (r, o) {
		var Ce;
		const ze = r,
			{
				render: i,
				className: l,
				disabled: u = !1,
				nativeButton: c = !0,
				id: h,
				openOnHover: p,
				delay: f = 100,
				closeDelay: y = 0,
				handle: g,
				payload: S,
			} = ze,
			b = Be(ze, [
				"render",
				"className",
				"disabled",
				"nativeButton",
				"id",
				"openOnHover",
				"delay",
				"closeDelay",
				"handle",
				"payload",
			]),
			w = xi(!0),
			R = (Ce = g == null ? void 0 : g.store) != null ? Ce : w == null ? void 0 : w.store;
		if (!R) throw new Error(Xn(85));
		const O = nu(h),
			T = R.useState("isTriggerActive", O),
			L = R.useState("floatingRootContext"),
			M = R.useState("isOpenedByTrigger", O),
			_ = v.useRef(null),
			N = OM(),
			D = Ym(!0),
			H = Ha(),
			U = v.useMemo(() => (H != null ? H : new wm()), [H]),
			fe = kS(U),
			we = Wo(),
			{ registerTrigger: se, isMountedByThisTrigger: Y } = ax(O, _, R, {
				payload: S,
				closeDelay: y,
				parent: N,
				floatingTreeRoot: U,
				floatingNodeId: fe,
				floatingParentNodeId: we,
				keyboardEventRelay: D == null ? void 0 : D.relayKeyboardEvent,
			}),
			oe = N.type === "menubar",
			xe = R.useState("disabled"),
			ge = u || xe || (oe && N.context.disabled),
			{ getButtonProps: j, buttonRef: I } = Mf({ disabled: ge, native: c });
		v.useEffect(() => {
			!M && N.type === void 0 && (R.context.allowMouseUpTriggerRef.current = !1);
		}, [R, M, N.type]);
		const F = v.useRef(null),
			pe = mr(),
			J = Ke((le) => {
				if (!F.current) return;
				pe.clear(), (R.context.allowMouseUpTriggerRef.current = !1);
				const Ae = le.target;
				if (
					ft(F.current, Ae) ||
					ft(R.select("positionerElement"), Ae) ||
					Ae === F.current ||
					(Ae != null && iw(Ae) === R.select("rootId"))
				)
					return;
				const Se = xM(F.current);
				(le.clientX >= Se.left - Pc &&
					le.clientX <= Se.right + Pc &&
					le.clientY >= Se.top - Pc &&
					le.clientY <= Se.bottom + Pc) ||
					U.events.emit("close", { domEvent: le, reason: JO });
			});
		v.useEffect(() => {
			M &&
				R.select("lastOpenChangeReason") === Gn &&
				kt(F.current).addEventListener("mouseup", J, { once: !0 });
		}, [M, J, R]);
		const B = oe && N.context.hasSubmenuOpen,
			Z = p != null ? p : B,
			ee = ux(L, {
				enabled: Z && !ge && N.type !== "context-menu" && (!oe || (B && !Y)),
				handleClose: fx({ blockPointerEvents: !oe }),
				mouseOnly: !0,
				move: !1,
				restMs: N.type === void 0 ? f : void 0,
				delay: { close: y },
				triggerElementRef: _,
				externalTree: U,
				isActiveTrigger: T,
			}),
			ie = CM(M, R.select("lastOpenChangeReason")),
			me = C5(L, {
				enabled: !ge && N.type !== "context-menu",
				event: M && oe ? "click" : "mousedown",
				toggle: !0,
				ignoreMouse: !1,
				stickIfOpen: N.type === void 0 ? ie : !1,
			}),
			ve = ix(L, { enabled: !ge && B }),
			ke = RM({ open: M, enabled: oe, mouseDownAction: "open" }),
			je = Cf([me, ve]),
			Ee = { disabled: ge, open: M },
			Qe = R.useState("triggerProps", Y),
			it = [F, o, I, se, _],
			re = [
				je.getReferenceProps(),
				ee != null ? ee : kn,
				Qe,
				{
					"aria-haspopup": "menu",
					id: O,
					onMouseDown: (le) => {
						if (R.select("open")) return;
						pe.start(200, () => {
							R.context.allowMouseUpTriggerRef.current = !0;
						}),
							kt(le.currentTarget).addEventListener("mouseup", J, { once: !0 });
					},
				},
				oe ? { role: "menuitem" } : {},
				ke,
				b,
				j,
			],
			ce = v.useRef(null),
			de = Ke((le) => {
				mo.flushSync(() => {
					R.setOpen(!1, gt(Rs, le.nativeEvent, le.currentTarget));
				});
				const Ae = UO(ce.current);
				Ae == null || Ae.focus();
			}),
			Te = Ke((le) => {
				var Se;
				const Ae = R.select("positionerElement");
				if (Ae && ys(le, Ae))
					(Se = R.context.beforeContentFocusGuardRef.current) == null || Se.focus();
				else {
					mo.flushSync(() => {
						R.setOpen(!1, gt(Rs, le.nativeEvent, le.currentTarget));
					});
					let Ue = BO(R.context.triggerFocusTargetRef.current || _.current);
					for (; Ue !== null && ft(Ae, Ue); ) {
						const Ye = Ue;
						if (((Ue = xm(Ue)), Ue === Ye)) break;
					}
					Ue == null || Ue.focus();
				}
			}),
			Re = fn("button", r, {
				enabled: !oe,
				stateAttributesMapping: Bv,
				state: Ee,
				ref: it,
				props: re,
			});
		return oe
			? K.jsx(EM, {
					tag: "button",
					render: i,
					className: l,
					state: Ee,
					refs: it,
					props: re,
					stateAttributesMapping: Bv,
			  })
			: M
			? K.jsxs(v.Fragment, {
					children: [
						K.jsx(Os, { ref: ce, onFocus: de }, `${O}-pre-focus-guard`),
						K.jsx(v.Fragment, { children: Re }, O),
						K.jsx(
							Os,
							{ ref: R.context.triggerFocusTargetRef, onFocus: Te },
							`${O}-post-focus-guard`
						),
					],
			  })
			: K.jsx(v.Fragment, { children: Re }, O);
	});
function CM(n, r) {
	const o = mr(),
		[i, l] = v.useState(!1);
	return (
		$e(() => {
			n && r === "trigger-hover"
				? (l(!0),
				  o.start(GO, () => {
						l(!1);
				  }))
				: n || (o.clear(), l(!1));
		}, [n, r, o]),
		i
	);
}
function OM() {
	const n = _f(!0),
		r = xi(!0),
		o = aw();
	return v.useMemo(
		() =>
			o
				? { type: "menubar", context: o }
				: n && !r
				? { type: "context-menu", context: n }
				: { type: void 0 },
		[n, r, o]
	);
}
function AM(r) {
	var n = Be(r, []);
	return K.jsx(SM, P({ "data-slot": "dropdown-menu" }, n));
}
function MM(r) {
	var n = Be(r, []);
	return K.jsx(TM, P({ "data-slot": "dropdown-menu-trigger" }, n));
}
function kM(c) {
	var h = c,
		{
			align: n = "start",
			alignOffset: r = 0,
			side: o = "bottom",
			sideOffset: i = 4,
			className: l,
		} = h,
		u = Be(h, ["align", "alignOffset", "side", "sideOffset", "className"]);
	return K.jsx(uM, {
		children: K.jsx(pM, {
			className: "isolate z-50 outline-none",
			align: n,
			alignOffset: r,
			side: o,
			sideOffset: i,
			children: K.jsx(
				sM,
				P(
					{
						"data-slot": "dropdown-menu-content",
						className: Yt(
							"data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/5 bg-popover text-popover-foreground min-w-48 rounded-2xl p-1 shadow-2xl ring-1 duration-100 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 dark z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none data-closed:overflow-hidden",
							l
						),
					},
					u
				)
			),
		}),
	});
}
function t1(l) {
	var u = l,
		{ className: n, inset: r, variant: o = "default" } = u,
		i = Be(u, ["className", "inset", "variant"]);
	return K.jsx(
		rM,
		P(
			{
				"data-slot": "dropdown-menu-item",
				"data-inset": r,
				"data-variant": o,
				className: Yt(
					"focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2.5 rounded-xl px-3 py-2 text-sm data-inset:pl-9.5 [&_svg:not([class*='size-'])]:size-4 group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
					n
				),
			},
			i
		)
	);
}
function _M(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		t8,
		P(
			{
				"data-slot": "dropdown-menu-separator",
				className: Yt("bg-border/50 -mx-1 my-1 h-px", n),
			},
			r
		)
	);
}
const sw = v.createContext(void 0);
function lw() {
	const n = v.useContext(sw);
	if (n === void 0) throw new Error(Xn(13));
	return n;
}
const Gm = { imageLoadingStatus: () => null },
	DM = v.forwardRef(function (r, o) {
		const g = r,
			{ className: i, render: l } = g,
			u = Be(g, ["className", "render"]),
			[c, h] = v.useState("idle"),
			p = { imageLoadingStatus: c },
			f = v.useMemo(() => ({ imageLoadingStatus: c, setImageLoadingStatus: h }), [c, h]),
			y = fn("span", r, { state: p, ref: o, props: u, stateAttributesMapping: Gm });
		return K.jsx(sw.Provider, { value: f, children: y });
	});
function NM(n, { referrerPolicy: r, crossOrigin: o }) {
	const [i, l] = v.useState("idle");
	return (
		$e(() => {
			if (!n) return l("error"), Em;
			let u = !0;
			const c = new window.Image(),
				h = (p) => () => {
					u && l(p);
				};
			return (
				l("loading"),
				(c.onload = h("loaded")),
				(c.onerror = h("error")),
				r && (c.referrerPolicy = r),
				(c.crossOrigin = o != null ? o : null),
				(c.src = n),
				() => {
					u = !1;
				}
			);
		}, [n, o, r]),
		i
	);
}
const LM = P(P({}, Gm), js),
	zM = v.forwardRef(function (r, o) {
		const _ = r,
			{
				className: i,
				render: l,
				onLoadingStatusChange: u,
				referrerPolicy: c,
				crossOrigin: h,
			} = _,
			p = Be(_, [
				"className",
				"render",
				"onLoadingStatusChange",
				"referrerPolicy",
				"crossOrigin",
			]),
			f = lw(),
			y = NM(r.src, { referrerPolicy: c, crossOrigin: h }),
			g = y === "loading" || y === "loaded",
			{ mounted: S, transitionStatus: b, setMounted: w } = Nm(g),
			R = v.useRef(null),
			O = Ke((N) => {
				u == null || u(N), f.setImageLoadingStatus(N);
			});
		$e(() => {
			y !== "idle" && O(y);
		}, [y, O]);
		const L = { imageLoadingStatus: y, transitionStatus: y === "loading" ? "starting" : b };
		Bs({
			open: g,
			ref: R,
			onComplete() {
				g || w(!1);
			},
		});
		const M = fn("img", r, {
			state: L,
			ref: [o, R],
			props: p,
			stateAttributesMapping: LM,
			enabled: S,
		});
		return S ? M : null;
	}),
	jM = P(P({}, Gm), js),
	BM = v.forwardRef(function (r, o) {
		const L = r,
			{ className: i, render: l, delay: u } = L,
			c = Be(L, ["className", "render", "delay"]),
			{ imageLoadingStatus: h } = lw(),
			[p, f] = v.useState(u === void 0),
			y = mr(),
			g = h !== "loaded" && p,
			{ mounted: S, transitionStatus: b, setMounted: w } = Nm(g),
			R = v.useRef(null);
		v.useEffect(() => (u !== void 0 && y.start(u, () => f(!0)), y.clear), [y, u]);
		const O = { imageLoadingStatus: h, transitionStatus: b };
		Bs({
			open: g,
			ref: R,
			onComplete() {
				g || w(!1);
			},
		});
		const T = fn("span", r, {
			state: O,
			ref: [o, R],
			props: c,
			stateAttributesMapping: jM,
			enabled: S,
		});
		return S ? T : null;
	});
function UM(i) {
	var l = i,
		{ className: n, size: r = "default" } = l,
		o = Be(l, ["className", "size"]);
	return K.jsx(
		DM,
		P(
			{
				"data-slot": "avatar",
				"data-size": r,
				className: Yt(
					"size-8 rounded-full after:rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6 after:border-border group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:border after:mix-blend-darken dark:after:mix-blend-lighten",
					n
				),
			},
			o
		)
	);
}
function HM(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		zM,
		P(
			{
				"data-slot": "avatar-image",
				className: Yt("rounded-full aspect-square size-full object-cover", n),
			},
			r
		)
	);
}
function qM(o) {
	var i = o,
		{ className: n } = i,
		r = Be(i, ["className"]);
	return K.jsx(
		BM,
		P(
			{
				"data-slot": "avatar-fallback",
				className: Yt(
					"bg-muted text-muted-foreground rounded-full flex size-full items-center justify-center text-sm group-data-[size=sm]/avatar:text-xs",
					n
				),
			},
			r
		)
	);
}
const PM = [
	{ to: "/", label: "Dashboard", icon: H4 },
	{ to: "/projects", label: "Projects", icon: q4 },
	{ to: "/tasks", label: "Tasks", icon: F4 },
	{ to: "/team", label: "Team", icon: X4 },
	{ to: "/settings", label: "Settings", icon: Y4 },
];
function VM() {
	const { setOpenMobile: n } = kf(),
		{ logout: r } = fm(),
		{ user: o } = z4(),
		{ setTheme: i, theme: l } = _4(),
		u = Jo(),
		c = () => {
			r(), (window.location.href = "/login");
		},
		h = (p) =>
			p
				.split(" ")
				.map((f) => f[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
	return K.jsxs(V8, {
		children: [
			K.jsx(G8, {
				className:
					"h-14 shrink-0 flex-row items-center border-b border-sidebar-border px-4",
				children: K.jsx("span", {
					className: "text-lg font-bold text-sidebar-foreground",
					children: "Hive",
				}),
			}),
			K.jsx(X8, {
				children: K.jsx(K8, {
					children: K.jsx(Q8, {
						children: K.jsx(Wv, {
							children: PM.map((p) => {
								const f =
									p.to === "/"
										? u.pathname === "/"
										: u.pathname.startsWith(p.to);
								return K.jsx(
									$v,
									{
										children: K.jsxs(e1, {
											isActive: f,
											render: K.jsx(E1, {
												to: p.to,
												end: p.to === "/",
												onClick: () => n(!1),
											}),
											tooltip: p.label,
											children: [
												K.jsx(hi, {
													icon: p.icon,
													strokeWidth: 2,
													className: "size-5",
												}),
												K.jsx("span", { children: p.label }),
											],
										}),
									},
									p.to
								);
							}),
						}),
					}),
				}),
			}),
			K.jsx(F8, {
				children: K.jsx(Wv, {
					children: K.jsx($v, {
						children: K.jsxs(AM, {
							children: [
								K.jsxs(MM, {
									render: K.jsx(e1, { size: "lg" }),
									children: [
										K.jsxs(UM, {
											size: "sm",
											children: [
												(o == null ? void 0 : o.user_image) &&
													K.jsx(HM, { src: o.user_image }),
												K.jsx(qM, {
													children:
														o != null && o.full_name
															? h(o.full_name)
															: "?",
												}),
											],
										}),
										K.jsx("span", {
											className: "truncate text-sm",
											children: o == null ? void 0 : o.full_name,
										}),
										K.jsx(hi, {
											icon: B4,
											strokeWidth: 2,
											className: "ml-auto size-4",
										}),
									],
								}),
								K.jsxs(kM, {
									side: "top",
									align: "start",
									className: "w-[--anchor-width]",
									children: [
										K.jsxs(t1, {
											onClick: () => i(l === "dark" ? "light" : "dark"),
											children: [
												K.jsx(hi, {
													icon: l === "dark" ? G4 : V4,
													strokeWidth: 2,
												}),
												l === "dark" ? "Light mode" : "Dark mode",
											],
										}),
										K.jsx(_M, {}),
										K.jsxs(t1, {
											onClick: c,
											children: [
												K.jsx(hi, { icon: P4, strokeWidth: 2 }),
												"Log out",
											],
										}),
									],
								}),
							],
						}),
					}),
				}),
			}),
		],
	});
}
function YM() {
	return K.jsx("header", {
		className:
			"flex h-14 shrink-0 items-center border-b border-border bg-background px-4 md:px-6",
		children: K.jsx("div", {
			className: "flex items-center gap-2",
			children: K.jsx(Y8, { className: "-ml-1" }),
		}),
	});
}
function IM() {
	return K.jsxs(P8, {
		children: [
			K.jsx(VM, {}),
			K.jsxs(I8, {
				children: [
					K.jsx(YM, {}),
					K.jsx("div", {
						className: "flex-1 overflow-y-auto p-4 md:p-6",
						children: K.jsx(J2, {}),
					}),
				],
			}),
		],
	});
}
const GM = v.lazy(() =>
		Us(() => import("./DashboardPage-B26mcg6i.js"), []).then((n) => ({
			default: n.DashboardPage,
		}))
	),
	FM = v.lazy(() =>
		Us(() => import("./ProjectsPage-Dr-0yX2r.js"), __vite__mapDeps([0, 1])).then((n) => ({
			default: n.ProjectsPage,
		}))
	),
	XM = v.lazy(() =>
		Us(() => import("./TasksPage-Bvnrvf5V.js"), []).then((n) => ({ default: n.TasksPage }))
	),
	KM = v.lazy(() =>
		Us(() => import("./TeamPage-CqSPtQc9.js"), []).then((n) => ({ default: n.TeamPage }))
	),
	QM = v.lazy(() =>
		Us(() => import("./SettingsPage-_C9coYGe.js"), []).then((n) => ({
			default: n.SettingsPage,
		}))
	),
	ZM = v.lazy(() =>
		Us(() => import("./ProjectDetailPage-B5DvpmvT.js"), __vite__mapDeps([2, 1])).then((n) => ({
			default: n.ProjectDetailPage,
		}))
	);
function ps() {
	return K.jsx("div", {
		className: "flex h-full items-center justify-center",
		children: K.jsx("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading...",
		}),
	});
}
function JM({ children: n }) {
	const { currentUser: r, isLoading: o } = fm();
	return o
		? K.jsx("div", {
				className: "flex h-screen items-center justify-center bg-background",
				children: K.jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading...",
				}),
		  })
		: !r || r === "Guest"
		? ((window.location.href = "/login"), null)
		: K.jsx(L4, { children: n });
}
function WM() {
	return K.jsxs($2, {
		children: [
			K.jsxs(Io, {
				element: K.jsx(JM, { children: K.jsx(IM, {}) }),
				children: [
					K.jsx(Io, {
						index: !0,
						element: K.jsx(v.Suspense, {
							fallback: K.jsx(ps, {}),
							children: K.jsx(GM, {}),
						}),
					}),
					K.jsx(Io, {
						path: "projects",
						element: K.jsx(v.Suspense, {
							fallback: K.jsx(ps, {}),
							children: K.jsx(FM, {}),
						}),
					}),
					K.jsx(Io, {
						path: "projects/:id",
						element: K.jsx(v.Suspense, {
							fallback: K.jsx(ps, {}),
							children: K.jsx(ZM, {}),
						}),
					}),
					K.jsx(Io, {
						path: "tasks",
						element: K.jsx(v.Suspense, {
							fallback: K.jsx(ps, {}),
							children: K.jsx(XM, {}),
						}),
					}),
					K.jsx(Io, {
						path: "team",
						element: K.jsx(v.Suspense, {
							fallback: K.jsx(ps, {}),
							children: K.jsx(KM, {}),
						}),
					}),
					K.jsx(Io, {
						path: "settings",
						element: K.jsx(v.Suspense, {
							fallback: K.jsx(ps, {}),
							children: K.jsx(QM, {}),
						}),
					}),
				],
			}),
			K.jsx(Io, { path: "*", element: K.jsx(Z2, { to: "/", replace: !0 }) }),
		],
	});
}
WE.createRoot(document.getElementById("root")).render(
	K.jsx(v.StrictMode, {
		children: K.jsx(aC, {
			children: K.jsx(k4, {
				defaultTheme: "system",
				storageKey: "hive-ui-theme",
				children: K.jsx(T4, {
					children: K.jsxs(ER, {
						basename: "/frontend",
						children: [K.jsx(WM, {}), K.jsx(zC, { position: "top-right" })],
					}),
				}),
			}),
		}),
	})
);
export {
	mr as $,
	Bs as A,
	Hx as B,
	Q3 as C,
	C8 as D,
	kn as E,
	tk as F,
	C5 as G,
	hi as H,
	_m as I,
	aA as J,
	sA as K,
	w1 as L,
	Cf as M,
	Em as N,
	As as O,
	q4 as P,
	hm as Q,
	De as R,
	Cs as S,
	ik as T,
	BS as U,
	U4 as V,
	Vp as W,
	V3 as X,
	Rs as Y,
	Tm as Z,
	Mf as _,
	Hn as a,
	nf as a0,
	Bv as a1,
	ft as a2,
	xM as a3,
	JO as a4,
	bA as a5,
	IS as a6,
	KO as a7,
	Zx as a8,
	bx as a9,
	ok as aA,
	K4 as aB,
	Ux as aC,
	cM as aa,
	Qx as ab,
	vx as ac,
	bi as ad,
	Af as ae,
	aM as af,
	Om as ag,
	Sn as ah,
	iS as ai,
	GS as aj,
	ak,
	js as al,
	Kx as am,
	rw as an,
	nM as ao,
	DS as ap,
	fk as aq,
	ck as ar,
	B4 as as,
	lk as at,
	ek as au,
	iC as av,
	rk as aw,
	nk as ax,
	uk as ay,
	sk as az,
	Ke as b,
	$e as c,
	mo as d,
	Qr as e,
	Xn as f,
	fn as g,
	gt as h,
	At as i,
	K as j,
	Yt as k,
	h8 as l,
	o8 as m,
	Rm as n,
	kt as o,
	O8 as p,
	a8 as q,
	v as r,
	p8 as s,
	r8 as t,
	nu as u,
	et as v,
	Nm as w,
	Jx as x,
	ox as y,
	Fn as z,
};
