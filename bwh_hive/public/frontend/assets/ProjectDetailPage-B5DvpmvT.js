var Jr = Object.defineProperty,
	Qr = Object.defineProperties;
var Zr = Object.getOwnPropertyDescriptors;
var Ot = Object.getOwnPropertySymbols;
var Vn = Object.prototype.hasOwnProperty,
	Bn = Object.prototype.propertyIsEnumerable;
var on = Math.pow,
	Ln = (e, t, n) =>
		t in e
			? Jr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
			: (e[t] = n),
	v = (e, t) => {
		for (var n in t || (t = {})) Vn.call(t, n) && Ln(e, n, t[n]);
		if (Ot) for (var n of Ot(t)) Bn.call(t, n) && Ln(e, n, t[n]);
		return e;
	},
	I = (e, t) => Qr(e, Zr(t));
var J = (e, t) => {
	var n = {};
	for (var r in e) Vn.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
	if (e != null && Ot) for (var r of Ot(e)) t.indexOf(r) < 0 && Bn.call(e, r) && (n[r] = e[r]);
	return n;
};
var St = (e, t, n) =>
	new Promise((r, s) => {
		var o = (c) => {
				try {
					l(n.next(c));
				} catch (u) {
					s(u);
				}
			},
			a = (c) => {
				try {
					l(n.throw(c));
				} catch (u) {
					s(u);
				}
			},
			l = (c) => (c.done ? r(c.value) : Promise.resolve(c.value).then(o, a));
		l((n = n.apply(e, t)).next());
	});
import {
	r as i,
	N as _e,
	f as It,
	E as hn,
	u as eo,
	a as ur,
	b as Ye,
	c as Se,
	i as to,
	d as ct,
	e as no,
	o as Ft,
	g as Ge,
	h as tt,
	n as qt,
	j as f,
	k as Ve,
	R as xe,
	D as ro,
	l as oo,
	m as dr,
	H as dt,
	V as so,
	B as mt,
	p as io,
	q as lo,
	s as ao,
	t as co,
	v as te,
	w as Sn,
	x as uo,
	y as k,
	z as Rn,
	A as Gt,
	C as fo,
	G as go,
	I as po,
	J as ho,
	K as mo,
	M as vo,
	O as fr,
	Q as bo,
	S as gr,
	T as xo,
	U as yo,
	W as Fn,
	X as wo,
	Y as So,
	Z as Ro,
	_ as pr,
	$ as ut,
	a0 as Co,
	a1 as Eo,
	a2 as sn,
	a3 as Do,
	a4 as To,
	a5 as Mo,
	a6 as Ao,
	a7 as Io,
	a8 as No,
	a9 as jo,
	aa as Po,
	ab as ko,
	ac as Oo,
	ad as hr,
	ae as mr,
	af as Lo,
	ag as Vo,
	ah as Hn,
	ai as Bo,
	aj as Fo,
	ak as Ho,
	al as vr,
	am as zo,
	an as Uo,
	ao as $o,
	ap as ln,
	aq as Wo,
	ar as _o,
	as as Yo,
	at as Xo,
	au as Ko,
	av as qo,
	F as Go,
	aw as Jo,
	ax as Qo,
	L as zn,
	ay as Zo,
	az as es,
	aA as an,
} from "./index-BlZsnnOZ.js";
import { B as Ht, C as ts, a as ns, c as rs, S as pt } from "./badge-CcCP7YcG.js";
let Un = (function (e) {
	return (
		(e.disabled = "data-disabled"),
		(e.valid = "data-valid"),
		(e.invalid = "data-invalid"),
		(e.touched = "data-touched"),
		(e.dirty = "data-dirty"),
		(e.filled = "data-filled"),
		(e.focused = "data-focused"),
		e
	);
})({});
const os = {
		badInput: !1,
		customError: !1,
		patternMismatch: !1,
		rangeOverflow: !1,
		rangeUnderflow: !1,
		stepMismatch: !1,
		tooLong: !1,
		tooShort: !1,
		typeMismatch: !1,
		valid: null,
		valueMissing: !1,
	},
	br = {
		valid(e) {
			return e === null ? null : e ? { [Un.valid]: "" } : { [Un.invalid]: "" };
		},
	},
	ss = i.createContext({
		invalid: void 0,
		name: void 0,
		validityData: { state: os, errors: [], error: "", value: "", initialValue: null },
		setValidityData: _e,
		disabled: void 0,
		touched: !1,
		setTouched: _e,
		dirty: !1,
		setDirty: _e,
		filled: !1,
		setFilled: _e,
		focused: !1,
		setFocused: _e,
		validate: () => null,
		validationMode: "onSubmit",
		validationDebounceTime: 0,
		shouldValidateOnChange: () => !1,
		state: { disabled: !1, valid: null, touched: !1, dirty: !1, filled: !1, focused: !1 },
		markedDirtyRef: { current: !1 },
		validation: {
			getValidationProps: (e = hn) => e,
			getInputValidationProps: (e = hn) => e,
			inputRef: { current: null },
			commit: () => St(null, null, function* () {}),
		},
	});
function Jt(e = !0) {
	const t = i.useContext(ss);
	if (t.setValidityData === _e && !e) throw new Error(It(28));
	return t;
}
const is = i.createContext({
	formRef: { current: { fields: new Map() } },
	errors: {},
	clearErrors: _e,
	validationMode: "onSubmit",
	submitAttemptedRef: { current: !1 },
});
function xr() {
	return i.useContext(is);
}
const ls = i.createContext({
	controlId: void 0,
	registerControlId: _e,
	labelId: void 0,
	setLabelId: _e,
	messageIds: [],
	setMessageIds: _e,
	getDescriptionProps: (e) => e,
});
function Cn() {
	return i.useContext(ls);
}
function as(e, t) {
	return I(v({}, e), { state: I(v({}, e.state), { valid: !t && e.state.valid }) });
}
function mn({ controlled: e, default: t, name: n, state: r = "value" }) {
	const { current: s } = i.useRef(e !== void 0),
		[o, a] = i.useState(t),
		l = s ? e : o,
		c = i.useCallback((u) => {
			s || a(u);
		}, []);
	return [l, c];
}
function En(e = {}) {
	const { id: t, implicit: n = !1, controlRef: r } = e,
		{ controlId: s, registerControlId: o } = Cn(),
		a = eo(t),
		l = n ? s : void 0,
		c = ur(() => Symbol("labelable-control")),
		u = i.useRef(!1),
		d = i.useRef(t != null),
		g = Ye(() => {
			!u.current || o === _e || ((u.current = !1), o(c.current, void 0));
		});
	return (
		Se(() => {
			if (o === _e) return;
			let p;
			if (n) {
				const h = r == null ? void 0 : r.current;
				to(h) && h.closest("label") != null
					? (p = t != null ? t : null)
					: (p = l != null ? l : a);
			} else if (t != null) (d.current = !0), (p = t);
			else if (d.current) p = a;
			else {
				g();
				return;
			}
			if (p === void 0) {
				g();
				return;
			}
			(u.current = !0), o(c.current, p);
		}, [t, r, l, o, n, a, c, g]),
		i.useEffect(() => g, [g]),
		s != null ? s : a
	);
}
function yr(e) {
	const { enabled: t = !0, value: n, id: r, name: s, controlRef: o, commit: a } = e,
		{ formRef: l } = xr(),
		{ invalid: c, markedDirtyRef: u, validityData: d, setValidityData: g } = Jt(),
		p = Ye(e.getValue);
	Se(() => {
		if (!t) return;
		let h = n;
		h === void 0 && (h = p()),
			d.initialValue === null && h !== null && g((y) => I(v({}, y), { initialValue: h }));
	}, [t, g, n, d.initialValue, p]),
		Se(() => {
			!t ||
				!r ||
				l.current.fields.set(r, {
					getValue: p,
					name: s,
					controlRef: o,
					validityData: as(d, c),
					validate(h = !0) {
						let y = n;
						y === void 0 && (y = p()),
							(u.current = !0),
							h ? ct.flushSync(() => a(y)) : a(y);
					},
				});
		}, [a, o, t, l, p, r, c, u, s, d, n]),
		Se(() => {
			const h = l.current.fields;
			return () => {
				r && h.delete(r);
			};
		}, [l, r]);
}
const cs = i.forwardRef(function (t, n) {
		const z = t,
			{
				render: r,
				className: s,
				id: o,
				name: a,
				value: l,
				disabled: c = !1,
				onValueChange: u,
				defaultValue: d,
				autoFocus: g = !1,
			} = z,
			p = J(z, [
				"render",
				"className",
				"id",
				"name",
				"value",
				"disabled",
				"onValueChange",
				"defaultValue",
				"autoFocus",
			]),
			{
				state: h,
				name: y,
				disabled: m,
				setTouched: w,
				setDirty: R,
				validityData: S,
				setFocused: b,
				setFilled: C,
				validationMode: P,
				validation: O,
			} = Jt(),
			M = m || c,
			D = y != null ? y : a,
			B = I(v({}, h), { disabled: M }),
			{ labelId: X } = Cn(),
			L = En({ id: o });
		Se(() => {
			var x;
			const _ = l != null;
			((x = O.inputRef.current) != null && x.value) || (_ && l !== "")
				? C(!0)
				: _ && l === "" && C(!1);
		}, [O.inputRef, C, l]);
		const W = i.useRef(null);
		Se(() => {
			g && W.current === no(Ft(W.current)) && b(!0);
		}, [g, b]);
		const [q] = mn({ controlled: l, default: d, name: "FieldControl", state: "value" }),
			H = l !== void 0,
			U = H ? q : void 0;
		return (
			yr({
				id: L,
				name: D,
				commit: O.commit,
				value: U,
				getValue: () => {
					var _;
					return (_ = O.inputRef.current) == null ? void 0 : _.value;
				},
				controlRef: O.inputRef,
			}),
			Ge("input", t, {
				ref: [n, W],
				state: B,
				props: [
					I(
						v(
							{
								id: L,
								disabled: M,
								name: D,
								ref: O.inputRef,
								"aria-labelledby": X,
								autoFocus: g,
							},
							H ? { value: U } : { defaultValue: d }
						),
						{
							onChange(_) {
								const x = _.currentTarget.value;
								u == null || u(x, tt(qt, _.nativeEvent)),
									R(x !== S.initialValue),
									C(x !== "");
							},
							onFocus() {
								b(!0);
							},
							onBlur(_) {
								w(!0), b(!1), P === "onBlur" && O.commit(_.currentTarget.value);
							},
							onKeyDown(_) {
								_.currentTarget.tagName === "INPUT" &&
									_.key === "Enter" &&
									(w(!0), O.commit(_.currentTarget.value));
							},
						}
					),
					O.getInputValidationProps(),
					p,
				],
				stateAttributesMapping: br,
			})
		);
	}),
	us = i.forwardRef(function (t, n) {
		return f.jsx(cs, v({ ref: n }, t));
	});
function ds(r) {
	var s = r,
		{ className: e, type: t } = s,
		n = J(s, ["className", "type"]);
	return f.jsx(
		us,
		v(
			{
				type: t,
				"data-slot": "input",
				className: Ve(
					"bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 rounded-4xl border px-3 py-1 text-base transition-colors file:h-7 file:text-sm file:font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
					e
				),
			},
			n
		)
	);
}
const zt = ["Backlog", "To Do", "In Progress", "Done"],
	fs = ["Low", "Medium", "High", "Urgent"],
	Qt =
		typeof window != "undefined" &&
		typeof window.document != "undefined" &&
		typeof window.document.createElement != "undefined";
function xt(e) {
	const t = Object.prototype.toString.call(e);
	return t === "[object Window]" || t === "[object global]";
}
function Dn(e) {
	return "nodeType" in e;
}
function ke(e) {
	var t, n;
	return e
		? xt(e)
			? e
			: Dn(e) && (t = (n = e.ownerDocument) == null ? void 0 : n.defaultView) != null
			? t
			: window
		: window;
}
function Tn(e) {
	const { Document: t } = ke(e);
	return e instanceof t;
}
function Nt(e) {
	return xt(e) ? !1 : e instanceof ke(e).HTMLElement;
}
function wr(e) {
	return e instanceof ke(e).SVGElement;
}
function yt(e) {
	return e
		? xt(e)
			? e.document
			: Dn(e)
			? Tn(e)
				? e
				: Nt(e) || wr(e)
				? e.ownerDocument
				: document
			: document
		: document;
}
const ot = Qt ? i.useLayoutEffect : i.useEffect;
function Zt(e) {
	const t = i.useRef(e);
	return (
		ot(() => {
			t.current = e;
		}),
		i.useCallback(function () {
			for (var n = arguments.length, r = new Array(n), s = 0; s < n; s++)
				r[s] = arguments[s];
			return t.current == null ? void 0 : t.current(...r);
		}, [])
	);
}
function gs() {
	const e = i.useRef(null),
		t = i.useCallback((r, s) => {
			e.current = setInterval(r, s);
		}, []),
		n = i.useCallback(() => {
			e.current !== null && (clearInterval(e.current), (e.current = null));
		}, []);
	return [t, n];
}
function Tt(e, t) {
	t === void 0 && (t = [e]);
	const n = i.useRef(e);
	return (
		ot(() => {
			n.current !== e && (n.current = e);
		}, t),
		n
	);
}
function jt(e, t) {
	const n = i.useRef();
	return i.useMemo(() => {
		const r = e(n.current);
		return (n.current = r), r;
	}, [...t]);
}
function Ut(e) {
	const t = Zt(e),
		n = i.useRef(null),
		r = i.useCallback((s) => {
			s !== n.current && (t == null || t(s, n.current)), (n.current = s);
		}, []);
	return [n, r];
}
function $t(e) {
	const t = i.useRef();
	return (
		i.useEffect(() => {
			t.current = e;
		}, [e]),
		t.current
	);
}
let cn = {};
function en(e, t) {
	return i.useMemo(() => {
		if (t) return t;
		const n = cn[e] == null ? 0 : cn[e] + 1;
		return (cn[e] = n), e + "-" + n;
	}, [e, t]);
}
function Sr(e) {
	return function (t) {
		for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), s = 1; s < n; s++)
			r[s - 1] = arguments[s];
		return r.reduce((o, a) => {
			const l = Object.entries(a);
			for (const [c, u] of l) {
				const d = o[c];
				d != null && (o[c] = d + e * u);
			}
			return o;
		}, v({}, t));
	};
}
const vt = Sr(1),
	Wt = Sr(-1);
function ps(e) {
	return "clientX" in e && "clientY" in e;
}
function Mn(e) {
	if (!e) return !1;
	const { KeyboardEvent: t } = ke(e.target);
	return t && e instanceof t;
}
function hs(e) {
	if (!e) return !1;
	const { TouchEvent: t } = ke(e.target);
	return t && e instanceof t;
}
function _t(e) {
	if (hs(e)) {
		if (e.touches && e.touches.length) {
			const { clientX: t, clientY: n } = e.touches[0];
			return { x: t, y: n };
		} else if (e.changedTouches && e.changedTouches.length) {
			const { clientX: t, clientY: n } = e.changedTouches[0];
			return { x: t, y: n };
		}
	}
	return ps(e) ? { x: e.clientX, y: e.clientY } : null;
}
const Mt = Object.freeze({
		Translate: {
			toString(e) {
				if (!e) return;
				const { x: t, y: n } = e;
				return (
					"translate3d(" +
					(t ? Math.round(t) : 0) +
					"px, " +
					(n ? Math.round(n) : 0) +
					"px, 0)"
				);
			},
		},
		Scale: {
			toString(e) {
				if (!e) return;
				const { scaleX: t, scaleY: n } = e;
				return "scaleX(" + t + ") scaleY(" + n + ")";
			},
		},
		Transform: {
			toString(e) {
				if (e) return [Mt.Translate.toString(e), Mt.Scale.toString(e)].join(" ");
			},
		},
		Transition: {
			toString(e) {
				let { property: t, duration: n, easing: r } = e;
				return t + " " + n + "ms " + r;
			},
		},
	}),
	$n =
		"a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]";
function ms(e) {
	return e.matches($n) ? e : e.querySelector($n);
}
const vs = { display: "none" };
function bs(e) {
	let { id: t, value: n } = e;
	return xe.createElement("div", { id: t, style: vs }, n);
}
function xs(e) {
	let { id: t, announcement: n, ariaLiveType: r = "assertive" } = e;
	const s = {
		position: "fixed",
		top: 0,
		left: 0,
		width: 1,
		height: 1,
		margin: -1,
		border: 0,
		padding: 0,
		overflow: "hidden",
		clip: "rect(0 0 0 0)",
		clipPath: "inset(100%)",
		whiteSpace: "nowrap",
	};
	return xe.createElement(
		"div",
		{ id: t, style: s, role: "status", "aria-live": r, "aria-atomic": !0 },
		n
	);
}
function ys() {
	const [e, t] = i.useState("");
	return {
		announce: i.useCallback((r) => {
			r != null && t(r);
		}, []),
		announcement: e,
	};
}
const Rr = i.createContext(null);
function ws(e) {
	const t = i.useContext(Rr);
	i.useEffect(() => {
		if (!t) throw new Error("useDndMonitor must be used within a children of <DndContext>");
		return t(e);
	}, [e, t]);
}
function Ss() {
	const [e] = i.useState(() => new Set()),
		t = i.useCallback((r) => (e.add(r), () => e.delete(r)), [e]);
	return [
		i.useCallback(
			(r) => {
				let { type: s, event: o } = r;
				e.forEach((a) => {
					var l;
					return (l = a[s]) == null ? void 0 : l.call(a, o);
				});
			},
			[e]
		),
		t,
	];
}
const Rs = {
		draggable: `
    To pick up a draggable item, press the space bar.
    While dragging, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `,
	},
	Cs = {
		onDragStart(e) {
			let { active: t } = e;
			return "Picked up draggable item " + t.id + ".";
		},
		onDragOver(e) {
			let { active: t, over: n } = e;
			return n
				? "Draggable item " + t.id + " was moved over droppable area " + n.id + "."
				: "Draggable item " + t.id + " is no longer over a droppable area.";
		},
		onDragEnd(e) {
			let { active: t, over: n } = e;
			return n
				? "Draggable item " + t.id + " was dropped over droppable area " + n.id
				: "Draggable item " + t.id + " was dropped.";
		},
		onDragCancel(e) {
			let { active: t } = e;
			return "Dragging was cancelled. Draggable item " + t.id + " was dropped.";
		},
	};
function Es(e) {
	let {
		announcements: t = Cs,
		container: n,
		hiddenTextDescribedById: r,
		screenReaderInstructions: s = Rs,
	} = e;
	const { announce: o, announcement: a } = ys(),
		l = en("DndLiveRegion"),
		[c, u] = i.useState(!1);
	if (
		(i.useEffect(() => {
			u(!0);
		}, []),
		ws(
			i.useMemo(
				() => ({
					onDragStart(g) {
						let { active: p } = g;
						o(t.onDragStart({ active: p }));
					},
					onDragMove(g) {
						let { active: p, over: h } = g;
						t.onDragMove && o(t.onDragMove({ active: p, over: h }));
					},
					onDragOver(g) {
						let { active: p, over: h } = g;
						o(t.onDragOver({ active: p, over: h }));
					},
					onDragEnd(g) {
						let { active: p, over: h } = g;
						o(t.onDragEnd({ active: p, over: h }));
					},
					onDragCancel(g) {
						let { active: p, over: h } = g;
						o(t.onDragCancel({ active: p, over: h }));
					},
				}),
				[o, t]
			)
		),
		!c)
	)
		return null;
	const d = xe.createElement(
		xe.Fragment,
		null,
		xe.createElement(bs, { id: r, value: s.draggable }),
		xe.createElement(xs, { id: l, announcement: a })
	);
	return n ? ct.createPortal(d, n) : d;
}
var we;
(function (e) {
	(e.DragStart = "dragStart"),
		(e.DragMove = "dragMove"),
		(e.DragEnd = "dragEnd"),
		(e.DragCancel = "dragCancel"),
		(e.DragOver = "dragOver"),
		(e.RegisterDroppable = "registerDroppable"),
		(e.SetDroppableDisabled = "setDroppableDisabled"),
		(e.UnregisterDroppable = "unregisterDroppable");
})(we || (we = {}));
function Yt() {}
function Ds(e, t) {
	return i.useMemo(() => ({ sensor: e, options: t != null ? t : {} }), [e, t]);
}
function Ts() {
	for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
	return i.useMemo(() => [...t].filter((r) => r != null), [...t]);
}
const qe = Object.freeze({ x: 0, y: 0 });
function Ms(e, t) {
	const n = _t(e);
	if (!n) return "0 0";
	const r = { x: ((n.x - t.left) / t.width) * 100, y: ((n.y - t.top) / t.height) * 100 };
	return r.x + "% " + r.y + "%";
}
function As(e, t) {
	let {
			data: { value: n },
		} = e,
		{
			data: { value: r },
		} = t;
	return r - n;
}
function Is(e, t) {
	if (!e || e.length === 0) return null;
	const [n] = e;
	return n[t];
}
function Ns(e, t) {
	const n = Math.max(t.top, e.top),
		r = Math.max(t.left, e.left),
		s = Math.min(t.left + t.width, e.left + e.width),
		o = Math.min(t.top + t.height, e.top + e.height),
		a = s - r,
		l = o - n;
	if (r < s && n < o) {
		const c = t.width * t.height,
			u = e.width * e.height,
			d = a * l,
			g = d / (c + u - d);
		return Number(g.toFixed(4));
	}
	return 0;
}
const js = (e) => {
	let { collisionRect: t, droppableRects: n, droppableContainers: r } = e;
	const s = [];
	for (const o of r) {
		const { id: a } = o,
			l = n.get(a);
		if (l) {
			const c = Ns(l, t);
			c > 0 && s.push({ id: a, data: { droppableContainer: o, value: c } });
		}
	}
	return s.sort(As);
};
function Ps(e, t, n) {
	return I(v({}, e), {
		scaleX: t && n ? t.width / n.width : 1,
		scaleY: t && n ? t.height / n.height : 1,
	});
}
function Cr(e, t) {
	return e && t ? { x: e.left - t.left, y: e.top - t.top } : qe;
}
function ks(e) {
	return function (n) {
		for (var r = arguments.length, s = new Array(r > 1 ? r - 1 : 0), o = 1; o < r; o++)
			s[o - 1] = arguments[o];
		return s.reduce(
			(a, l) =>
				I(v({}, a), {
					top: a.top + e * l.y,
					bottom: a.bottom + e * l.y,
					left: a.left + e * l.x,
					right: a.right + e * l.x,
				}),
			v({}, n)
		);
	};
}
const Os = ks(1);
function Er(e) {
	if (e.startsWith("matrix3d(")) {
		const t = e.slice(9, -1).split(/, /);
		return { x: +t[12], y: +t[13], scaleX: +t[0], scaleY: +t[5] };
	} else if (e.startsWith("matrix(")) {
		const t = e.slice(7, -1).split(/, /);
		return { x: +t[4], y: +t[5], scaleX: +t[0], scaleY: +t[3] };
	}
	return null;
}
function Ls(e, t, n) {
	const r = Er(t);
	if (!r) return e;
	const { scaleX: s, scaleY: o, x: a, y: l } = r,
		c = e.left - a - (1 - s) * parseFloat(n),
		u = e.top - l - (1 - o) * parseFloat(n.slice(n.indexOf(" ") + 1)),
		d = s ? e.width / s : e.width,
		g = o ? e.height / o : e.height;
	return { width: d, height: g, top: u, right: c + d, bottom: u + g, left: c };
}
const Vs = { ignoreTransform: !1 };
function Pt(e, t) {
	t === void 0 && (t = Vs);
	let n = e.getBoundingClientRect();
	if (t.ignoreTransform) {
		const { transform: u, transformOrigin: d } = ke(e).getComputedStyle(e);
		u && (n = Ls(n, u, d));
	}
	const { top: r, left: s, width: o, height: a, bottom: l, right: c } = n;
	return { top: r, left: s, width: o, height: a, bottom: l, right: c };
}
function Wn(e) {
	return Pt(e, { ignoreTransform: !0 });
}
function Bs(e) {
	const t = e.innerWidth,
		n = e.innerHeight;
	return { top: 0, left: 0, right: t, bottom: n, width: t, height: n };
}
function Fs(e, t) {
	return t === void 0 && (t = ke(e).getComputedStyle(e)), t.position === "fixed";
}
function Hs(e, t) {
	t === void 0 && (t = ke(e).getComputedStyle(e));
	const n = /(auto|scroll|overlay)/;
	return ["overflow", "overflowX", "overflowY"].some((s) => {
		const o = t[s];
		return typeof o == "string" ? n.test(o) : !1;
	});
}
function An(e, t) {
	const n = [];
	function r(s) {
		if ((t != null && n.length >= t) || !s) return n;
		if (Tn(s) && s.scrollingElement != null && !n.includes(s.scrollingElement))
			return n.push(s.scrollingElement), n;
		if (!Nt(s) || wr(s) || n.includes(s)) return n;
		const o = ke(e).getComputedStyle(s);
		return s !== e && Hs(s, o) && n.push(s), Fs(s, o) ? n : r(s.parentNode);
	}
	return e ? r(e) : n;
}
function Dr(e) {
	const [t] = An(e, 1);
	return t != null ? t : null;
}
function un(e) {
	return !Qt || !e
		? null
		: xt(e)
		? e
		: Dn(e)
		? Tn(e) || e === yt(e).scrollingElement
			? window
			: Nt(e)
			? e
			: null
		: null;
}
function Tr(e) {
	return xt(e) ? e.scrollX : e.scrollLeft;
}
function Mr(e) {
	return xt(e) ? e.scrollY : e.scrollTop;
}
function vn(e) {
	return { x: Tr(e), y: Mr(e) };
}
var Ce;
(function (e) {
	(e[(e.Forward = 1)] = "Forward"), (e[(e.Backward = -1)] = "Backward");
})(Ce || (Ce = {}));
function Ar(e) {
	return !Qt || !e ? !1 : e === document.scrollingElement;
}
function Ir(e) {
	const t = { x: 0, y: 0 },
		n = Ar(e)
			? { height: window.innerHeight, width: window.innerWidth }
			: { height: e.clientHeight, width: e.clientWidth },
		r = { x: e.scrollWidth - n.width, y: e.scrollHeight - n.height },
		s = e.scrollTop <= t.y,
		o = e.scrollLeft <= t.x,
		a = e.scrollTop >= r.y,
		l = e.scrollLeft >= r.x;
	return { isTop: s, isLeft: o, isBottom: a, isRight: l, maxScroll: r, minScroll: t };
}
const zs = { x: 0.2, y: 0.2 };
function Us(e, t, n, r, s) {
	let { top: o, left: a, right: l, bottom: c } = n;
	r === void 0 && (r = 10), s === void 0 && (s = zs);
	const { isTop: u, isBottom: d, isLeft: g, isRight: p } = Ir(e),
		h = { x: 0, y: 0 },
		y = { x: 0, y: 0 },
		m = { height: t.height * s.y, width: t.width * s.x };
	return (
		!u && o <= t.top + m.height
			? ((h.y = Ce.Backward), (y.y = r * Math.abs((t.top + m.height - o) / m.height)))
			: !d &&
			  c >= t.bottom - m.height &&
			  ((h.y = Ce.Forward), (y.y = r * Math.abs((t.bottom - m.height - c) / m.height))),
		!p && l >= t.right - m.width
			? ((h.x = Ce.Forward), (y.x = r * Math.abs((t.right - m.width - l) / m.width)))
			: !g &&
			  a <= t.left + m.width &&
			  ((h.x = Ce.Backward), (y.x = r * Math.abs((t.left + m.width - a) / m.width))),
		{ direction: h, speed: y }
	);
}
function $s(e) {
	if (e === document.scrollingElement) {
		const { innerWidth: o, innerHeight: a } = window;
		return { top: 0, left: 0, right: o, bottom: a, width: o, height: a };
	}
	const { top: t, left: n, right: r, bottom: s } = e.getBoundingClientRect();
	return { top: t, left: n, right: r, bottom: s, width: e.clientWidth, height: e.clientHeight };
}
function Nr(e) {
	return e.reduce((t, n) => vt(t, vn(n)), qe);
}
function Ws(e) {
	return e.reduce((t, n) => t + Tr(n), 0);
}
function _s(e) {
	return e.reduce((t, n) => t + Mr(n), 0);
}
function jr(e, t) {
	if ((t === void 0 && (t = Pt), !e)) return;
	const { top: n, left: r, bottom: s, right: o } = t(e);
	Dr(e) &&
		(s <= 0 || o <= 0 || n >= window.innerHeight || r >= window.innerWidth) &&
		e.scrollIntoView({ block: "center", inline: "center" });
}
const Ys = [
	["x", ["left", "right"], Ws],
	["y", ["top", "bottom"], _s],
];
class In {
	constructor(t, n) {
		(this.rect = void 0),
			(this.width = void 0),
			(this.height = void 0),
			(this.top = void 0),
			(this.bottom = void 0),
			(this.right = void 0),
			(this.left = void 0);
		const r = An(n),
			s = Nr(r);
		(this.rect = v({}, t)), (this.width = t.width), (this.height = t.height);
		for (const [o, a, l] of Ys)
			for (const c of a)
				Object.defineProperty(this, c, {
					get: () => {
						const u = l(r),
							d = s[o] - u;
						return this.rect[c] + d;
					},
					enumerable: !0,
				});
		Object.defineProperty(this, "rect", { enumerable: !1 });
	}
}
class Rt {
	constructor(t) {
		(this.target = void 0),
			(this.listeners = []),
			(this.removeAll = () => {
				this.listeners.forEach((n) => {
					var r;
					return (r = this.target) == null ? void 0 : r.removeEventListener(...n);
				});
			}),
			(this.target = t);
	}
	add(t, n, r) {
		var s;
		(s = this.target) == null || s.addEventListener(t, n, r), this.listeners.push([t, n, r]);
	}
}
function Xs(e) {
	const { EventTarget: t } = ke(e);
	return e instanceof t ? e : yt(e);
}
function dn(e, t) {
	const n = Math.abs(e.x),
		r = Math.abs(e.y);
	return typeof t == "number"
		? Math.sqrt(on(n, 2) + on(r, 2)) > t
		: "x" in t && "y" in t
		? n > t.x && r > t.y
		: "x" in t
		? n > t.x
		: "y" in t
		? r > t.y
		: !1;
}
var We;
(function (e) {
	(e.Click = "click"),
		(e.DragStart = "dragstart"),
		(e.Keydown = "keydown"),
		(e.ContextMenu = "contextmenu"),
		(e.Resize = "resize"),
		(e.SelectionChange = "selectionchange"),
		(e.VisibilityChange = "visibilitychange");
})(We || (We = {}));
function _n(e) {
	e.preventDefault();
}
function Ks(e) {
	e.stopPropagation();
}
var oe;
(function (e) {
	(e.Space = "Space"),
		(e.Down = "ArrowDown"),
		(e.Right = "ArrowRight"),
		(e.Left = "ArrowLeft"),
		(e.Up = "ArrowUp"),
		(e.Esc = "Escape"),
		(e.Enter = "Enter"),
		(e.Tab = "Tab");
})(oe || (oe = {}));
const Pr = { start: [oe.Space, oe.Enter], cancel: [oe.Esc], end: [oe.Space, oe.Enter, oe.Tab] },
	qs = (e, t) => {
		let { currentCoordinates: n } = t;
		switch (e.code) {
			case oe.Right:
				return I(v({}, n), { x: n.x + 25 });
			case oe.Left:
				return I(v({}, n), { x: n.x - 25 });
			case oe.Down:
				return I(v({}, n), { y: n.y + 25 });
			case oe.Up:
				return I(v({}, n), { y: n.y - 25 });
		}
	};
class kr {
	constructor(t) {
		(this.props = void 0),
			(this.autoScrollEnabled = !1),
			(this.referenceCoordinates = void 0),
			(this.listeners = void 0),
			(this.windowListeners = void 0),
			(this.props = t);
		const {
			event: { target: n },
		} = t;
		(this.props = t),
			(this.listeners = new Rt(yt(n))),
			(this.windowListeners = new Rt(ke(n))),
			(this.handleKeyDown = this.handleKeyDown.bind(this)),
			(this.handleCancel = this.handleCancel.bind(this)),
			this.attach();
	}
	attach() {
		this.handleStart(),
			this.windowListeners.add(We.Resize, this.handleCancel),
			this.windowListeners.add(We.VisibilityChange, this.handleCancel),
			setTimeout(() => this.listeners.add(We.Keydown, this.handleKeyDown));
	}
	handleStart() {
		const { activeNode: t, onStart: n } = this.props,
			r = t.node.current;
		r && jr(r), n(qe);
	}
	handleKeyDown(t) {
		if (Mn(t)) {
			const { active: n, context: r, options: s } = this.props,
				{
					keyboardCodes: o = Pr,
					coordinateGetter: a = qs,
					scrollBehavior: l = "smooth",
				} = s,
				{ code: c } = t;
			if (o.end.includes(c)) {
				this.handleEnd(t);
				return;
			}
			if (o.cancel.includes(c)) {
				this.handleCancel(t);
				return;
			}
			const { collisionRect: u } = r.current,
				d = u ? { x: u.left, y: u.top } : qe;
			this.referenceCoordinates || (this.referenceCoordinates = d);
			const g = a(t, { active: n, context: r.current, currentCoordinates: d });
			if (g) {
				const p = Wt(g, d),
					h = { x: 0, y: 0 },
					{ scrollableAncestors: y } = r.current;
				for (const m of y) {
					const w = t.code,
						{
							isTop: R,
							isRight: S,
							isLeft: b,
							isBottom: C,
							maxScroll: P,
							minScroll: O,
						} = Ir(m),
						M = $s(m),
						D = {
							x: Math.min(
								w === oe.Right ? M.right - M.width / 2 : M.right,
								Math.max(w === oe.Right ? M.left : M.left + M.width / 2, g.x)
							),
							y: Math.min(
								w === oe.Down ? M.bottom - M.height / 2 : M.bottom,
								Math.max(w === oe.Down ? M.top : M.top + M.height / 2, g.y)
							),
						},
						B = (w === oe.Right && !S) || (w === oe.Left && !b),
						X = (w === oe.Down && !C) || (w === oe.Up && !R);
					if (B && D.x !== g.x) {
						const L = m.scrollLeft + p.x,
							W = (w === oe.Right && L <= P.x) || (w === oe.Left && L >= O.x);
						if (W && !p.y) {
							m.scrollTo({ left: L, behavior: l });
							return;
						}
						W
							? (h.x = m.scrollLeft - L)
							: (h.x = w === oe.Right ? m.scrollLeft - P.x : m.scrollLeft - O.x),
							h.x && m.scrollBy({ left: -h.x, behavior: l });
						break;
					} else if (X && D.y !== g.y) {
						const L = m.scrollTop + p.y,
							W = (w === oe.Down && L <= P.y) || (w === oe.Up && L >= O.y);
						if (W && !p.x) {
							m.scrollTo({ top: L, behavior: l });
							return;
						}
						W
							? (h.y = m.scrollTop - L)
							: (h.y = w === oe.Down ? m.scrollTop - P.y : m.scrollTop - O.y),
							h.y && m.scrollBy({ top: -h.y, behavior: l });
						break;
					}
				}
				this.handleMove(t, vt(Wt(g, this.referenceCoordinates), h));
			}
		}
	}
	handleMove(t, n) {
		const { onMove: r } = this.props;
		t.preventDefault(), r(n);
	}
	handleEnd(t) {
		const { onEnd: n } = this.props;
		t.preventDefault(), this.detach(), n();
	}
	handleCancel(t) {
		const { onCancel: n } = this.props;
		t.preventDefault(), this.detach(), n();
	}
	detach() {
		this.listeners.removeAll(), this.windowListeners.removeAll();
	}
}
kr.activators = [
	{
		eventName: "onKeyDown",
		handler: (e, t, n) => {
			let { keyboardCodes: r = Pr, onActivation: s } = t,
				{ active: o } = n;
			const { code: a } = e.nativeEvent;
			if (r.start.includes(a)) {
				const l = o.activatorNode.current;
				return l && e.target !== l
					? !1
					: (e.preventDefault(), s == null || s({ event: e.nativeEvent }), !0);
			}
			return !1;
		},
	},
];
function Yn(e) {
	return !!(e && "distance" in e);
}
function Xn(e) {
	return !!(e && "delay" in e);
}
class Nn {
	constructor(t, n, r) {
		var s;
		r === void 0 && (r = Xs(t.event.target)),
			(this.props = void 0),
			(this.events = void 0),
			(this.autoScrollEnabled = !0),
			(this.document = void 0),
			(this.activated = !1),
			(this.initialCoordinates = void 0),
			(this.timeoutId = null),
			(this.listeners = void 0),
			(this.documentListeners = void 0),
			(this.windowListeners = void 0),
			(this.props = t),
			(this.events = n);
		const { event: o } = t,
			{ target: a } = o;
		(this.props = t),
			(this.events = n),
			(this.document = yt(a)),
			(this.documentListeners = new Rt(this.document)),
			(this.listeners = new Rt(r)),
			(this.windowListeners = new Rt(ke(a))),
			(this.initialCoordinates = (s = _t(o)) != null ? s : qe),
			(this.handleStart = this.handleStart.bind(this)),
			(this.handleMove = this.handleMove.bind(this)),
			(this.handleEnd = this.handleEnd.bind(this)),
			(this.handleCancel = this.handleCancel.bind(this)),
			(this.handleKeydown = this.handleKeydown.bind(this)),
			(this.removeTextSelection = this.removeTextSelection.bind(this)),
			this.attach();
	}
	attach() {
		const {
			events: t,
			props: {
				options: { activationConstraint: n, bypassActivationConstraint: r },
			},
		} = this;
		if (
			(this.listeners.add(t.move.name, this.handleMove, { passive: !1 }),
			this.listeners.add(t.end.name, this.handleEnd),
			t.cancel && this.listeners.add(t.cancel.name, this.handleCancel),
			this.windowListeners.add(We.Resize, this.handleCancel),
			this.windowListeners.add(We.DragStart, _n),
			this.windowListeners.add(We.VisibilityChange, this.handleCancel),
			this.windowListeners.add(We.ContextMenu, _n),
			this.documentListeners.add(We.Keydown, this.handleKeydown),
			n)
		) {
			if (
				r != null &&
				r({
					event: this.props.event,
					activeNode: this.props.activeNode,
					options: this.props.options,
				})
			)
				return this.handleStart();
			if (Xn(n)) {
				(this.timeoutId = setTimeout(this.handleStart, n.delay)), this.handlePending(n);
				return;
			}
			if (Yn(n)) {
				this.handlePending(n);
				return;
			}
		}
		this.handleStart();
	}
	detach() {
		this.listeners.removeAll(),
			this.windowListeners.removeAll(),
			setTimeout(this.documentListeners.removeAll, 50),
			this.timeoutId !== null && (clearTimeout(this.timeoutId), (this.timeoutId = null));
	}
	handlePending(t, n) {
		const { active: r, onPending: s } = this.props;
		s(r, t, this.initialCoordinates, n);
	}
	handleStart() {
		const { initialCoordinates: t } = this,
			{ onStart: n } = this.props;
		t &&
			((this.activated = !0),
			this.documentListeners.add(We.Click, Ks, { capture: !0 }),
			this.removeTextSelection(),
			this.documentListeners.add(We.SelectionChange, this.removeTextSelection),
			n(t));
	}
	handleMove(t) {
		var n;
		const { activated: r, initialCoordinates: s, props: o } = this,
			{
				onMove: a,
				options: { activationConstraint: l },
			} = o;
		if (!s) return;
		const c = (n = _t(t)) != null ? n : qe,
			u = Wt(s, c);
		if (!r && l) {
			if (Yn(l)) {
				if (l.tolerance != null && dn(u, l.tolerance)) return this.handleCancel();
				if (dn(u, l.distance)) return this.handleStart();
			}
			if (Xn(l) && dn(u, l.tolerance)) return this.handleCancel();
			this.handlePending(l, u);
			return;
		}
		t.cancelable && t.preventDefault(), a(c);
	}
	handleEnd() {
		const { onAbort: t, onEnd: n } = this.props;
		this.detach(), this.activated || t(this.props.active), n();
	}
	handleCancel() {
		const { onAbort: t, onCancel: n } = this.props;
		this.detach(), this.activated || t(this.props.active), n();
	}
	handleKeydown(t) {
		t.code === oe.Esc && this.handleCancel();
	}
	removeTextSelection() {
		var t;
		(t = this.document.getSelection()) == null || t.removeAllRanges();
	}
}
const Gs = {
	cancel: { name: "pointercancel" },
	move: { name: "pointermove" },
	end: { name: "pointerup" },
};
class jn extends Nn {
	constructor(t) {
		const { event: n } = t,
			r = yt(n.target);
		super(t, Gs, r);
	}
}
jn.activators = [
	{
		eventName: "onPointerDown",
		handler: (e, t) => {
			let { nativeEvent: n } = e,
				{ onActivation: r } = t;
			return !n.isPrimary || n.button !== 0 ? !1 : (r == null || r({ event: n }), !0);
		},
	},
];
const Js = { move: { name: "mousemove" }, end: { name: "mouseup" } };
var bn;
(function (e) {
	e[(e.RightClick = 2)] = "RightClick";
})(bn || (bn = {}));
class Qs extends Nn {
	constructor(t) {
		super(t, Js, yt(t.event.target));
	}
}
Qs.activators = [
	{
		eventName: "onMouseDown",
		handler: (e, t) => {
			let { nativeEvent: n } = e,
				{ onActivation: r } = t;
			return n.button === bn.RightClick ? !1 : (r == null || r({ event: n }), !0);
		},
	},
];
const fn = {
	cancel: { name: "touchcancel" },
	move: { name: "touchmove" },
	end: { name: "touchend" },
};
class Zs extends Nn {
	constructor(t) {
		super(t, fn);
	}
	static setup() {
		return (
			window.addEventListener(fn.move.name, t, { capture: !1, passive: !1 }),
			function () {
				window.removeEventListener(fn.move.name, t);
			}
		);
		function t() {}
	}
}
Zs.activators = [
	{
		eventName: "onTouchStart",
		handler: (e, t) => {
			let { nativeEvent: n } = e,
				{ onActivation: r } = t;
			const { touches: s } = n;
			return s.length > 1 ? !1 : (r == null || r({ event: n }), !0);
		},
	},
];
var Ct;
(function (e) {
	(e[(e.Pointer = 0)] = "Pointer"), (e[(e.DraggableRect = 1)] = "DraggableRect");
})(Ct || (Ct = {}));
var Xt;
(function (e) {
	(e[(e.TreeOrder = 0)] = "TreeOrder"), (e[(e.ReversedTreeOrder = 1)] = "ReversedTreeOrder");
})(Xt || (Xt = {}));
function ei(e) {
	let {
		acceleration: t,
		activator: n = Ct.Pointer,
		canScroll: r,
		draggingRect: s,
		enabled: o,
		interval: a = 5,
		order: l = Xt.TreeOrder,
		pointerCoordinates: c,
		scrollableAncestors: u,
		scrollableAncestorRects: d,
		delta: g,
		threshold: p,
	} = e;
	const h = ni({ delta: g, disabled: !o }),
		[y, m] = gs(),
		w = i.useRef({ x: 0, y: 0 }),
		R = i.useRef({ x: 0, y: 0 }),
		S = i.useMemo(() => {
			switch (n) {
				case Ct.Pointer:
					return c ? { top: c.y, bottom: c.y, left: c.x, right: c.x } : null;
				case Ct.DraggableRect:
					return s;
			}
		}, [n, s, c]),
		b = i.useRef(null),
		C = i.useCallback(() => {
			const O = b.current;
			if (!O) return;
			const M = w.current.x * R.current.x,
				D = w.current.y * R.current.y;
			O.scrollBy(M, D);
		}, []),
		P = i.useMemo(() => (l === Xt.TreeOrder ? [...u].reverse() : u), [l, u]);
	i.useEffect(() => {
		if (!o || !u.length || !S) {
			m();
			return;
		}
		for (const O of P) {
			if ((r == null ? void 0 : r(O)) === !1) continue;
			const M = u.indexOf(O),
				D = d[M];
			if (!D) continue;
			const { direction: B, speed: X } = Us(O, D, S, t, p);
			for (const L of ["x", "y"]) h[L][B[L]] || ((X[L] = 0), (B[L] = 0));
			if (X.x > 0 || X.y > 0) {
				m(), (b.current = O), y(C, a), (w.current = X), (R.current = B);
				return;
			}
		}
		(w.current = { x: 0, y: 0 }), (R.current = { x: 0, y: 0 }), m();
	}, [t, C, r, m, o, a, JSON.stringify(S), JSON.stringify(h), y, u, P, d, JSON.stringify(p)]);
}
const ti = {
	x: { [Ce.Backward]: !1, [Ce.Forward]: !1 },
	y: { [Ce.Backward]: !1, [Ce.Forward]: !1 },
};
function ni(e) {
	let { delta: t, disabled: n } = e;
	const r = $t(t);
	return jt(
		(s) => {
			if (n || !r || !s) return ti;
			const o = { x: Math.sign(t.x - r.x), y: Math.sign(t.y - r.y) };
			return {
				x: {
					[Ce.Backward]: s.x[Ce.Backward] || o.x === -1,
					[Ce.Forward]: s.x[Ce.Forward] || o.x === 1,
				},
				y: {
					[Ce.Backward]: s.y[Ce.Backward] || o.y === -1,
					[Ce.Forward]: s.y[Ce.Forward] || o.y === 1,
				},
			};
		},
		[n, t, r]
	);
}
function ri(e, t) {
	const n = t != null ? e.get(t) : void 0,
		r = n ? n.node.current : null;
	return jt(
		(s) => {
			var o;
			return t == null ? null : (o = r != null ? r : s) != null ? o : null;
		},
		[r, t]
	);
}
function oi(e, t) {
	return i.useMemo(
		() =>
			e.reduce((n, r) => {
				const { sensor: s } = r,
					o = s.activators.map((a) => ({
						eventName: a.eventName,
						handler: t(a.handler, r),
					}));
				return [...n, ...o];
			}, []),
		[e, t]
	);
}
var At;
(function (e) {
	(e[(e.Always = 0)] = "Always"),
		(e[(e.BeforeDragging = 1)] = "BeforeDragging"),
		(e[(e.WhileDragging = 2)] = "WhileDragging");
})(At || (At = {}));
var xn;
(function (e) {
	e.Optimized = "optimized";
})(xn || (xn = {}));
const Kn = new Map();
function si(e, t) {
	let { dragging: n, dependencies: r, config: s } = t;
	const [o, a] = i.useState(null),
		{ frequency: l, measure: c, strategy: u } = s,
		d = i.useRef(e),
		g = w(),
		p = Tt(g),
		h = i.useCallback(
			function (R) {
				R === void 0 && (R = []),
					!p.current &&
						a((S) => (S === null ? R : S.concat(R.filter((b) => !S.includes(b)))));
			},
			[p]
		),
		y = i.useRef(null),
		m = jt(
			(R) => {
				if (g && !n) return Kn;
				if (!R || R === Kn || d.current !== e || o != null) {
					const S = new Map();
					for (let b of e) {
						if (!b) continue;
						if (o && o.length > 0 && !o.includes(b.id) && b.rect.current) {
							S.set(b.id, b.rect.current);
							continue;
						}
						const C = b.node.current,
							P = C ? new In(c(C), C) : null;
						(b.rect.current = P), P && S.set(b.id, P);
					}
					return S;
				}
				return R;
			},
			[e, o, n, g, c]
		);
	return (
		i.useEffect(() => {
			d.current = e;
		}, [e]),
		i.useEffect(() => {
			g || h();
		}, [n, g]),
		i.useEffect(() => {
			o && o.length > 0 && a(null);
		}, [JSON.stringify(o)]),
		i.useEffect(() => {
			g ||
				typeof l != "number" ||
				y.current !== null ||
				(y.current = setTimeout(() => {
					h(), (y.current = null);
				}, l));
		}, [l, g, h, ...r]),
		{ droppableRects: m, measureDroppableContainers: h, measuringScheduled: o != null }
	);
	function w() {
		switch (u) {
			case At.Always:
				return !1;
			case At.BeforeDragging:
				return n;
			default:
				return !n;
		}
	}
}
function Pn(e, t) {
	return jt((n) => (e ? n || (typeof t == "function" ? t(e) : e) : null), [t, e]);
}
function ii(e, t) {
	return Pn(e, t);
}
function li(e) {
	let { callback: t, disabled: n } = e;
	const r = Zt(t),
		s = i.useMemo(() => {
			if (n || typeof window == "undefined" || typeof window.MutationObserver == "undefined")
				return;
			const { MutationObserver: o } = window;
			return new o(r);
		}, [r, n]);
	return i.useEffect(() => () => s == null ? void 0 : s.disconnect(), [s]), s;
}
function tn(e) {
	let { callback: t, disabled: n } = e;
	const r = Zt(t),
		s = i.useMemo(() => {
			if (n || typeof window == "undefined" || typeof window.ResizeObserver == "undefined")
				return;
			const { ResizeObserver: o } = window;
			return new o(r);
		}, [n]);
	return i.useEffect(() => () => s == null ? void 0 : s.disconnect(), [s]), s;
}
function ai(e) {
	return new In(Pt(e), e);
}
function qn(e, t, n) {
	t === void 0 && (t = ai);
	const [r, s] = i.useState(null);
	function o() {
		s((c) => {
			if (!e) return null;
			if (e.isConnected === !1) {
				var u;
				return (u = c != null ? c : n) != null ? u : null;
			}
			const d = t(e);
			return JSON.stringify(c) === JSON.stringify(d) ? c : d;
		});
	}
	const a = li({
			callback(c) {
				if (e)
					for (const u of c) {
						const { type: d, target: g } = u;
						if (d === "childList" && g instanceof HTMLElement && g.contains(e)) {
							o();
							break;
						}
					}
			},
		}),
		l = tn({ callback: o });
	return (
		ot(() => {
			o(),
				e
					? (l == null || l.observe(e),
					  a == null || a.observe(document.body, { childList: !0, subtree: !0 }))
					: (l == null || l.disconnect(), a == null || a.disconnect());
		}, [e]),
		r
	);
}
function ci(e) {
	const t = Pn(e);
	return Cr(e, t);
}
const Gn = [];
function ui(e) {
	const t = i.useRef(e),
		n = jt(
			(r) =>
				e
					? r && r !== Gn && e && t.current && e.parentNode === t.current.parentNode
						? r
						: An(e)
					: Gn,
			[e]
		);
	return (
		i.useEffect(() => {
			t.current = e;
		}, [e]),
		n
	);
}
function di(e) {
	const [t, n] = i.useState(null),
		r = i.useRef(e),
		s = i.useCallback((o) => {
			const a = un(o.target);
			a && n((l) => (l ? (l.set(a, vn(a)), new Map(l)) : null));
		}, []);
	return (
		i.useEffect(() => {
			const o = r.current;
			if (e !== o) {
				a(o);
				const l = e
					.map((c) => {
						const u = un(c);
						return u
							? (u.addEventListener("scroll", s, { passive: !0 }), [u, vn(u)])
							: null;
					})
					.filter((c) => c != null);
				n(l.length ? new Map(l) : null), (r.current = e);
			}
			return () => {
				a(e), a(o);
			};
			function a(l) {
				l.forEach((c) => {
					const u = un(c);
					u == null || u.removeEventListener("scroll", s);
				});
			}
		}, [s, e]),
		i.useMemo(
			() =>
				e.length
					? t
						? Array.from(t.values()).reduce((o, a) => vt(o, a), qe)
						: Nr(e)
					: qe,
			[e, t]
		)
	);
}
function Jn(e, t) {
	t === void 0 && (t = []);
	const n = i.useRef(null);
	return (
		i.useEffect(() => {
			n.current = null;
		}, t),
		i.useEffect(() => {
			const r = e !== qe;
			r && !n.current && (n.current = e), !r && n.current && (n.current = null);
		}, [e]),
		n.current ? Wt(e, n.current) : qe
	);
}
function fi(e) {
	i.useEffect(
		() => {
			if (!Qt) return;
			const t = e.map((n) => {
				let { sensor: r } = n;
				return r.setup == null ? void 0 : r.setup();
			});
			return () => {
				for (const n of t) n == null || n();
			};
		},
		e.map((t) => {
			let { sensor: n } = t;
			return n;
		})
	);
}
function gi(e, t) {
	return i.useMemo(
		() =>
			e.reduce((n, r) => {
				let { eventName: s, handler: o } = r;
				return (
					(n[s] = (a) => {
						o(a, t);
					}),
					n
				);
			}, {}),
		[e, t]
	);
}
function Or(e) {
	return i.useMemo(() => (e ? Bs(e) : null), [e]);
}
const Qn = [];
function pi(e, t) {
	t === void 0 && (t = Pt);
	const [n] = e,
		r = Or(n ? ke(n) : null),
		[s, o] = i.useState(Qn);
	function a() {
		o(() => (e.length ? e.map((c) => (Ar(c) ? r : new In(t(c), c))) : Qn));
	}
	const l = tn({ callback: a });
	return (
		ot(() => {
			l == null || l.disconnect(),
				a(),
				e.forEach((c) => (l == null ? void 0 : l.observe(c)));
		}, [e]),
		s
	);
}
function Lr(e) {
	if (!e) return null;
	if (e.children.length > 1) return e;
	const t = e.children[0];
	return Nt(t) ? t : e;
}
function hi(e) {
	let { measure: t } = e;
	const [n, r] = i.useState(null),
		s = i.useCallback(
			(u) => {
				for (const { target: d } of u)
					if (Nt(d)) {
						r((g) => {
							const p = t(d);
							return g ? I(v({}, g), { width: p.width, height: p.height }) : p;
						});
						break;
					}
			},
			[t]
		),
		o = tn({ callback: s }),
		a = i.useCallback(
			(u) => {
				const d = Lr(u);
				o == null || o.disconnect(), d && (o == null || o.observe(d)), r(d ? t(d) : null);
			},
			[t, o]
		),
		[l, c] = Ut(a);
	return i.useMemo(() => ({ nodeRef: l, rect: n, setRef: c }), [n, l, c]);
}
const mi = [
		{ sensor: jn, options: {} },
		{ sensor: kr, options: {} },
	],
	vi = { current: {} },
	Bt = {
		draggable: { measure: Wn },
		droppable: { measure: Wn, strategy: At.WhileDragging, frequency: xn.Optimized },
		dragOverlay: { measure: Pt },
	};
class Et extends Map {
	get(t) {
		var n;
		return t != null && (n = super.get(t)) != null ? n : void 0;
	}
	toArray() {
		return Array.from(this.values());
	}
	getEnabled() {
		return this.toArray().filter((t) => {
			let { disabled: n } = t;
			return !n;
		});
	}
	getNodeFor(t) {
		var n, r;
		return (n = (r = this.get(t)) == null ? void 0 : r.node.current) != null ? n : void 0;
	}
}
const bi = {
		activatorEvent: null,
		active: null,
		activeNode: null,
		activeNodeRect: null,
		collisions: null,
		containerNodeRect: null,
		draggableNodes: new Map(),
		droppableRects: new Map(),
		droppableContainers: new Et(),
		over: null,
		dragOverlay: { nodeRef: { current: null }, rect: null, setRef: Yt },
		scrollableAncestors: [],
		scrollableAncestorRects: [],
		measuringConfiguration: Bt,
		measureDroppableContainers: Yt,
		windowRect: null,
		measuringScheduled: !1,
	},
	Vr = {
		activatorEvent: null,
		activators: [],
		active: null,
		activeNodeRect: null,
		ariaDescribedById: { draggable: "" },
		dispatch: Yt,
		draggableNodes: new Map(),
		over: null,
		measureDroppableContainers: Yt,
	},
	kt = i.createContext(Vr),
	Br = i.createContext(bi);
function xi() {
	return {
		draggable: {
			active: null,
			initialCoordinates: { x: 0, y: 0 },
			nodes: new Map(),
			translate: { x: 0, y: 0 },
		},
		droppable: { containers: new Et() },
	};
}
function yi(e, t) {
	switch (t.type) {
		case we.DragStart:
			return I(v({}, e), {
				draggable: I(v({}, e.draggable), {
					initialCoordinates: t.initialCoordinates,
					active: t.active,
				}),
			});
		case we.DragMove:
			return e.draggable.active == null
				? e
				: I(v({}, e), {
						draggable: I(v({}, e.draggable), {
							translate: {
								x: t.coordinates.x - e.draggable.initialCoordinates.x,
								y: t.coordinates.y - e.draggable.initialCoordinates.y,
							},
						}),
				  });
		case we.DragEnd:
		case we.DragCancel:
			return I(v({}, e), {
				draggable: I(v({}, e.draggable), {
					active: null,
					initialCoordinates: { x: 0, y: 0 },
					translate: { x: 0, y: 0 },
				}),
			});
		case we.RegisterDroppable: {
			const { element: n } = t,
				{ id: r } = n,
				s = new Et(e.droppable.containers);
			return (
				s.set(r, n), I(v({}, e), { droppable: I(v({}, e.droppable), { containers: s }) })
			);
		}
		case we.SetDroppableDisabled: {
			const { id: n, key: r, disabled: s } = t,
				o = e.droppable.containers.get(n);
			if (!o || r !== o.key) return e;
			const a = new Et(e.droppable.containers);
			return (
				a.set(n, I(v({}, o), { disabled: s })),
				I(v({}, e), { droppable: I(v({}, e.droppable), { containers: a }) })
			);
		}
		case we.UnregisterDroppable: {
			const { id: n, key: r } = t,
				s = e.droppable.containers.get(n);
			if (!s || r !== s.key) return e;
			const o = new Et(e.droppable.containers);
			return (
				o.delete(n), I(v({}, e), { droppable: I(v({}, e.droppable), { containers: o }) })
			);
		}
		default:
			return e;
	}
}
function wi(e) {
	let { disabled: t } = e;
	const { active: n, activatorEvent: r, draggableNodes: s } = i.useContext(kt),
		o = $t(r),
		a = $t(n == null ? void 0 : n.id);
	return (
		i.useEffect(() => {
			if (!t && !r && o && a != null) {
				if (!Mn(o) || document.activeElement === o.target) return;
				const l = s.get(a);
				if (!l) return;
				const { activatorNode: c, node: u } = l;
				if (!c.current && !u.current) return;
				requestAnimationFrame(() => {
					for (const d of [c.current, u.current]) {
						if (!d) continue;
						const g = ms(d);
						if (g) {
							g.focus();
							break;
						}
					}
				});
			}
		}, [r, t, s, a, o]),
		null
	);
}
function Fr(e, t) {
	let s = t,
		{ transform: n } = s,
		r = J(s, ["transform"]);
	return e != null && e.length ? e.reduce((o, a) => a(v({ transform: o }, r)), n) : n;
}
function Si(e) {
	return i.useMemo(
		() => ({
			draggable: v(v({}, Bt.draggable), e == null ? void 0 : e.draggable),
			droppable: v(v({}, Bt.droppable), e == null ? void 0 : e.droppable),
			dragOverlay: v(v({}, Bt.dragOverlay), e == null ? void 0 : e.dragOverlay),
		}),
		[
			e == null ? void 0 : e.draggable,
			e == null ? void 0 : e.droppable,
			e == null ? void 0 : e.dragOverlay,
		]
	);
}
function Ri(e) {
	let { activeNode: t, measure: n, initialRect: r, config: s = !0 } = e;
	const o = i.useRef(!1),
		{ x: a, y: l } = typeof s == "boolean" ? { x: s, y: s } : s;
	ot(() => {
		if ((!a && !l) || !t) {
			o.current = !1;
			return;
		}
		if (o.current || !r) return;
		const u = t == null ? void 0 : t.node.current;
		if (!u || u.isConnected === !1) return;
		const d = n(u),
			g = Cr(d, r);
		if (
			(a || (g.x = 0),
			l || (g.y = 0),
			(o.current = !0),
			Math.abs(g.x) > 0 || Math.abs(g.y) > 0)
		) {
			const p = Dr(u);
			p && p.scrollBy({ top: g.y, left: g.x });
		}
	}, [t, a, l, r, n]);
}
const nn = i.createContext(I(v({}, qe), { scaleX: 1, scaleY: 1 }));
var st;
(function (e) {
	(e[(e.Uninitialized = 0)] = "Uninitialized"),
		(e[(e.Initializing = 1)] = "Initializing"),
		(e[(e.Initialized = 2)] = "Initialized");
})(st || (st = {}));
const Ci = i.memo(function (t) {
		var n, r, s, o;
		let rt = t,
			{
				id: a,
				accessibility: l,
				autoScroll: c = !0,
				children: u,
				sensors: d = mi,
				collisionDetection: g = js,
				measuring: p,
				modifiers: h,
			} = rt,
			y = J(rt, [
				"id",
				"accessibility",
				"autoScroll",
				"children",
				"sensors",
				"collisionDetection",
				"measuring",
				"modifiers",
			]);
		const m = i.useReducer(yi, void 0, xi),
			[w, R] = m,
			[S, b] = Ss(),
			[C, P] = i.useState(st.Uninitialized),
			O = C === st.Initialized,
			{
				draggable: { active: M, nodes: D, translate: B },
				droppable: { containers: X },
			} = w,
			L = M != null ? D.get(M) : null,
			W = i.useRef({ initial: null, translated: null }),
			q = i.useMemo(() => {
				var Z;
				return M != null
					? { id: M, data: (Z = L == null ? void 0 : L.data) != null ? Z : vi, rect: W }
					: null;
			}, [M, L]),
			H = i.useRef(null),
			[U, de] = i.useState(null),
			[z, _] = i.useState(null),
			x = Tt(y, Object.values(y)),
			K = en("DndDescribedBy", a),
			G = i.useMemo(() => X.getEnabled(), [X]),
			E = Si(p),
			{
				droppableRects: le,
				measureDroppableContainers: Y,
				measuringScheduled: fe,
			} = si(G, { dragging: O, dependencies: [B.x, B.y], config: E.droppable }),
			A = ri(D, M),
			T = i.useMemo(() => (z ? _t(z) : null), [z]),
			ne = gt(),
			Ae = ii(A, E.draggable.measure);
		Ri({
			activeNode: M != null ? D.get(M) : null,
			config: ne.layoutShiftCompensation,
			initialRect: Ae,
			measure: E.draggable.measure,
		});
		const pe = qn(A, E.draggable.measure, Ae),
			ze = qn(A ? A.parentElement : null),
			V = i.useRef({
				activatorEvent: null,
				active: null,
				activeNode: A,
				collisionRect: null,
				collisions: null,
				droppableRects: le,
				draggableNodes: D,
				draggingNode: null,
				draggingNodeRect: null,
				droppableContainers: X,
				over: null,
				scrollableAncestors: [],
				scrollAdjustedTranslate: null,
			}),
			ee = X.getNodeFor((n = V.current.over) == null ? void 0 : n.id),
			se = hi({ measure: E.dragOverlay.measure }),
			ye = (r = se.nodeRef.current) != null ? r : A,
			ge = O ? ((s = se.rect) != null ? s : pe) : null,
			Ee = !!(se.nodeRef.current && se.rect),
			ie = ci(Ee ? null : pe),
			Be = Or(ye ? ke(ye) : null),
			ae = ui(O ? (ee != null ? ee : A) : null),
			Q = pi(ae),
			ce = Fr(h, {
				transform: { x: B.x - ie.x, y: B.y - ie.y, scaleX: 1, scaleY: 1 },
				activatorEvent: z,
				active: q,
				activeNodeRect: pe,
				containerNodeRect: ze,
				draggingNodeRect: ge,
				over: V.current.over,
				overlayNodeRect: se.rect,
				scrollableAncestors: ae,
				scrollableAncestorRects: Q,
				windowRect: Be,
			}),
			De = T ? vt(T, B) : null,
			N = di(ae),
			Xe = Jn(N),
			Je = Jn(N, [pe]),
			Ie = vt(ce, Xe),
			Ne = ge ? Os(ge, ce) : null,
			Oe =
				q && Ne
					? g({
							active: q,
							collisionRect: Ne,
							droppableRects: le,
							droppableContainers: G,
							pointerCoordinates: De,
					  })
					: null,
			he = Is(Oe, "id"),
			[me, Te] = i.useState(null),
			Qe = Ee ? ce : vt(ce, Je),
			Fe = Ps(Qe, (o = me == null ? void 0 : me.rect) != null ? o : null, pe),
			Ze = i.useRef(null),
			it = i.useCallback(
				(Z, Re) => {
					let { sensor: ve, options: He } = Re;
					if (H.current == null) return;
					const je = D.get(H.current);
					if (!je) return;
					const Me = Z.nativeEvent,
						Pe = new ve({
							active: H.current,
							activeNode: je,
							event: Me,
							options: He,
							context: V,
							onAbort($) {
								if (!D.get($)) return;
								const { onDragAbort: re } = x.current,
									ue = { id: $ };
								re == null || re(ue), S({ type: "onDragAbort", event: ue });
							},
							onPending($, be, re, ue) {
								if (!D.get($)) return;
								const { onDragPending: et } = x.current,
									$e = {
										id: $,
										constraint: be,
										initialCoordinates: re,
										offset: ue,
									};
								et == null || et($e), S({ type: "onDragPending", event: $e });
							},
							onStart($) {
								const be = H.current;
								if (be == null) return;
								const re = D.get(be);
								if (!re) return;
								const { onDragStart: ue } = x.current,
									Le = {
										activatorEvent: Me,
										active: { id: be, data: re.data, rect: W },
									};
								ct.unstable_batchedUpdates(() => {
									ue == null || ue(Le),
										P(st.Initializing),
										R({
											type: we.DragStart,
											initialCoordinates: $,
											active: be,
										}),
										S({ type: "onDragStart", event: Le }),
										de(Ze.current),
										_(Me);
								});
							},
							onMove($) {
								R({ type: we.DragMove, coordinates: $ });
							},
							onEnd: F(we.DragEnd),
							onCancel: F(we.DragCancel),
						});
					Ze.current = Pe;
					function F($) {
						return function () {
							return St(this, null, function* () {
								const {
									active: re,
									collisions: ue,
									over: Le,
									scrollAdjustedTranslate: et,
								} = V.current;
								let $e = null;
								if (re && et) {
									const { cancelDrop: wt } = x.current;
									($e = {
										activatorEvent: Me,
										active: re,
										collisions: ue,
										delta: et,
										over: Le,
									}),
										$ === we.DragEnd &&
											typeof wt == "function" &&
											(yield Promise.resolve(wt($e))) &&
											($ = we.DragCancel);
								}
								(H.current = null),
									ct.unstable_batchedUpdates(() => {
										R({ type: $ }),
											P(st.Uninitialized),
											Te(null),
											de(null),
											_(null),
											(Ze.current = null);
										const wt = $ === we.DragEnd ? "onDragEnd" : "onDragCancel";
										if ($e) {
											const rn = x.current[wt];
											rn == null || rn($e), S({ type: wt, event: $e });
										}
									});
							});
						};
					}
				},
				[D]
			),
			Ue = i.useCallback(
				(Z, Re) => (ve, He) => {
					const je = ve.nativeEvent,
						Me = D.get(He);
					if (H.current !== null || !Me || je.dndKit || je.defaultPrevented) return;
					const Pe = { active: Me };
					Z(ve, Re.options, Pe) === !0 &&
						((je.dndKit = { capturedBy: Re.sensor }), (H.current = He), it(ve, Re));
				},
				[D, it]
			),
			lt = oi(d, Ue);
		fi(d),
			ot(() => {
				pe && C === st.Initializing && P(st.Initialized);
			}, [pe, C]),
			i.useEffect(() => {
				const { onDragMove: Z } = x.current,
					{ active: Re, activatorEvent: ve, collisions: He, over: je } = V.current;
				if (!Re || !ve) return;
				const Me = {
					active: Re,
					activatorEvent: ve,
					collisions: He,
					delta: { x: Ie.x, y: Ie.y },
					over: je,
				};
				ct.unstable_batchedUpdates(() => {
					Z == null || Z(Me), S({ type: "onDragMove", event: Me });
				});
			}, [Ie.x, Ie.y]),
			i.useEffect(() => {
				const {
					active: Z,
					activatorEvent: Re,
					collisions: ve,
					droppableContainers: He,
					scrollAdjustedTranslate: je,
				} = V.current;
				if (!Z || H.current == null || !Re || !je) return;
				const { onDragOver: Me } = x.current,
					Pe = He.get(he),
					F =
						Pe && Pe.rect.current
							? {
									id: Pe.id,
									rect: Pe.rect.current,
									data: Pe.data,
									disabled: Pe.disabled,
							  }
							: null,
					$ = {
						active: Z,
						activatorEvent: Re,
						collisions: ve,
						delta: { x: je.x, y: je.y },
						over: F,
					};
				ct.unstable_batchedUpdates(() => {
					Te(F), Me == null || Me($), S({ type: "onDragOver", event: $ });
				});
			}, [he]),
			ot(() => {
				(V.current = {
					activatorEvent: z,
					active: q,
					activeNode: A,
					collisionRect: Ne,
					collisions: Oe,
					droppableRects: le,
					draggableNodes: D,
					draggingNode: ye,
					draggingNodeRect: ge,
					droppableContainers: X,
					over: me,
					scrollableAncestors: ae,
					scrollAdjustedTranslate: Ie,
				}),
					(W.current = { initial: ge, translated: Ne });
			}, [q, A, Oe, Ne, D, ye, ge, le, X, me, ae, Ie]),
			ei(
				I(v({}, ne), {
					delta: B,
					draggingRect: Ne,
					pointerCoordinates: De,
					scrollableAncestors: ae,
					scrollableAncestorRects: Q,
				})
			);
		const Ke = i.useMemo(
				() => ({
					active: q,
					activeNode: A,
					activeNodeRect: pe,
					activatorEvent: z,
					collisions: Oe,
					containerNodeRect: ze,
					dragOverlay: se,
					draggableNodes: D,
					droppableContainers: X,
					droppableRects: le,
					over: me,
					measureDroppableContainers: Y,
					scrollableAncestors: ae,
					scrollableAncestorRects: Q,
					measuringConfiguration: E,
					measuringScheduled: fe,
					windowRect: Be,
				}),
				[q, A, pe, z, Oe, ze, se, D, X, le, me, Y, ae, Q, E, fe, Be]
			),
			ft = i.useMemo(
				() => ({
					activatorEvent: z,
					activators: lt,
					active: q,
					activeNodeRect: pe,
					ariaDescribedById: { draggable: K },
					dispatch: R,
					draggableNodes: D,
					over: me,
					measureDroppableContainers: Y,
				}),
				[z, lt, q, pe, R, K, D, me, Y]
			);
		return xe.createElement(
			Rr.Provider,
			{ value: b },
			xe.createElement(
				kt.Provider,
				{ value: ft },
				xe.createElement(
					Br.Provider,
					{ value: Ke },
					xe.createElement(nn.Provider, { value: Fe }, u)
				),
				xe.createElement(wi, { disabled: (l == null ? void 0 : l.restoreFocus) === !1 })
			),
			xe.createElement(Es, I(v({}, l), { hiddenTextDescribedById: K }))
		);
		function gt() {
			const Z = (U == null ? void 0 : U.autoScrollEnabled) === !1,
				Re = typeof c == "object" ? c.enabled === !1 : c === !1,
				ve = O && !Z && !Re;
			return typeof c == "object" ? I(v({}, c), { enabled: ve }) : { enabled: ve };
		}
	}),
	Ei = i.createContext(null),
	Zn = "button",
	Di = "Draggable";
function Ti(e) {
	let { id: t, data: n, disabled: r = !1, attributes: s } = e;
	const o = en(Di),
		{
			activators: a,
			activatorEvent: l,
			active: c,
			activeNodeRect: u,
			ariaDescribedById: d,
			draggableNodes: g,
			over: p,
		} = i.useContext(kt),
		{ role: h = Zn, roleDescription: y = "draggable", tabIndex: m = 0 } = s != null ? s : {},
		w = (c == null ? void 0 : c.id) === t,
		R = i.useContext(w ? nn : Ei),
		[S, b] = Ut(),
		[C, P] = Ut(),
		O = gi(a, t),
		M = Tt(n);
	ot(
		() => (
			g.set(t, { id: t, key: o, node: S, activatorNode: C, data: M }),
			() => {
				const B = g.get(t);
				B && B.key === o && g.delete(t);
			}
		),
		[g, t]
	);
	const D = i.useMemo(
		() => ({
			role: h,
			tabIndex: m,
			"aria-disabled": r,
			"aria-pressed": w && h === Zn ? !0 : void 0,
			"aria-roledescription": y,
			"aria-describedby": d.draggable,
		}),
		[r, h, m, w, y, d.draggable]
	);
	return {
		active: c,
		activatorEvent: l,
		activeNodeRect: u,
		attributes: D,
		isDragging: w,
		listeners: r ? void 0 : O,
		node: S,
		over: p,
		setNodeRef: b,
		setActivatorNodeRef: P,
		transform: R,
	};
}
function Mi() {
	return i.useContext(Br);
}
const Ai = "Droppable",
	Ii = { timeout: 25 };
function Ni(e) {
	let { data: t, disabled: n = !1, id: r, resizeObserverConfig: s } = e;
	const o = en(Ai),
		{ active: a, dispatch: l, over: c, measureDroppableContainers: u } = i.useContext(kt),
		d = i.useRef({ disabled: n }),
		g = i.useRef(!1),
		p = i.useRef(null),
		h = i.useRef(null),
		{ disabled: y, updateMeasurementsFor: m, timeout: w } = v(v({}, Ii), s),
		R = Tt(m != null ? m : r),
		S = i.useCallback(() => {
			if (!g.current) {
				g.current = !0;
				return;
			}
			h.current != null && clearTimeout(h.current),
				(h.current = setTimeout(() => {
					u(Array.isArray(R.current) ? R.current : [R.current]), (h.current = null);
				}, w));
		}, [w]),
		b = tn({ callback: S, disabled: y || !a }),
		C = i.useCallback(
			(D, B) => {
				b && (B && (b.unobserve(B), (g.current = !1)), D && b.observe(D));
			},
			[b]
		),
		[P, O] = Ut(C),
		M = Tt(t);
	return (
		i.useEffect(() => {
			!b || !P.current || (b.disconnect(), (g.current = !1), b.observe(P.current));
		}, [P, b]),
		i.useEffect(
			() => (
				l({
					type: we.RegisterDroppable,
					element: { id: r, key: o, disabled: n, node: P, rect: p, data: M },
				}),
				() => l({ type: we.UnregisterDroppable, key: o, id: r })
			),
			[r]
		),
		i.useEffect(() => {
			n !== d.current.disabled &&
				(l({ type: we.SetDroppableDisabled, id: r, key: o, disabled: n }),
				(d.current.disabled = n));
		}, [r, o, n, l]),
		{
			active: a,
			rect: p,
			isOver: (c == null ? void 0 : c.id) === r,
			node: P,
			over: c,
			setNodeRef: O,
		}
	);
}
function ji(e) {
	let { animation: t, children: n } = e;
	const [r, s] = i.useState(null),
		[o, a] = i.useState(null),
		l = $t(n);
	return (
		!n && !r && l && s(l),
		ot(() => {
			if (!o) return;
			const c = r == null ? void 0 : r.key,
				u = r == null ? void 0 : r.props.id;
			if (c == null || u == null) {
				s(null);
				return;
			}
			Promise.resolve(t(u, o)).then(() => {
				s(null);
			});
		}, [t, r, o]),
		xe.createElement(xe.Fragment, null, n, r ? i.cloneElement(r, { ref: a }) : null)
	);
}
const Pi = { x: 0, y: 0, scaleX: 1, scaleY: 1 };
function ki(e) {
	let { children: t } = e;
	return xe.createElement(
		kt.Provider,
		{ value: Vr },
		xe.createElement(nn.Provider, { value: Pi }, t)
	);
}
const Oi = { position: "fixed", touchAction: "none" },
	Li = (e) => (Mn(e) ? "transform 250ms ease" : void 0),
	Vi = i.forwardRef((e, t) => {
		let {
			as: n,
			activatorEvent: r,
			adjustScale: s,
			children: o,
			className: a,
			rect: l,
			style: c,
			transform: u,
			transition: d = Li,
		} = e;
		if (!l) return null;
		const g = s ? u : I(v({}, u), { scaleX: 1, scaleY: 1 }),
			p = v(
				I(v({}, Oi), {
					width: l.width,
					height: l.height,
					top: l.top,
					left: l.left,
					transform: Mt.Transform.toString(g),
					transformOrigin: s && r ? Ms(r, l) : void 0,
					transition: typeof d == "function" ? d(r) : d,
				}),
				c
			);
		return xe.createElement(n, { className: a, style: p, ref: t }, o);
	}),
	Bi = (e) => (t) => {
		let { active: n, dragOverlay: r } = t;
		const s = {},
			{ styles: o, className: a } = e;
		if (o != null && o.active)
			for (const [l, c] of Object.entries(o.active))
				c !== void 0 &&
					((s[l] = n.node.style.getPropertyValue(l)), n.node.style.setProperty(l, c));
		if (o != null && o.dragOverlay)
			for (const [l, c] of Object.entries(o.dragOverlay))
				c !== void 0 && r.node.style.setProperty(l, c);
		return (
			a != null && a.active && n.node.classList.add(a.active),
			a != null && a.dragOverlay && r.node.classList.add(a.dragOverlay),
			function () {
				for (const [c, u] of Object.entries(s)) n.node.style.setProperty(c, u);
				a != null && a.active && n.node.classList.remove(a.active);
			}
		);
	},
	Fi = (e) => {
		let {
			transform: { initial: t, final: n },
		} = e;
		return [{ transform: Mt.Transform.toString(t) }, { transform: Mt.Transform.toString(n) }];
	},
	Hi = {
		duration: 250,
		easing: "ease",
		keyframes: Fi,
		sideEffects: Bi({ styles: { active: { opacity: "0" } } }),
	};
function zi(e) {
	let { config: t, draggableNodes: n, droppableContainers: r, measuringConfiguration: s } = e;
	return Zt((o, a) => {
		if (t === null) return;
		const l = n.get(o);
		if (!l) return;
		const c = l.node.current;
		if (!c) return;
		const u = Lr(a);
		if (!u) return;
		const { transform: d } = ke(a).getComputedStyle(a),
			g = Er(d);
		if (!g) return;
		const p = typeof t == "function" ? t : Ui(t);
		return (
			jr(c, s.draggable.measure),
			p({
				active: { id: o, data: l.data, node: c, rect: s.draggable.measure(c) },
				draggableNodes: n,
				dragOverlay: { node: a, rect: s.dragOverlay.measure(u) },
				droppableContainers: r,
				measuringConfiguration: s,
				transform: g,
			})
		);
	});
}
function Ui(e) {
	const { duration: t, easing: n, sideEffects: r, keyframes: s } = v(v({}, Hi), e);
	return (o) => {
		let S = o,
			{ active: a, dragOverlay: l, transform: c } = S,
			u = J(S, ["active", "dragOverlay", "transform"]);
		if (!t) return;
		const d = { x: l.rect.left - a.rect.left, y: l.rect.top - a.rect.top },
			g = {
				scaleX: c.scaleX !== 1 ? (a.rect.width * c.scaleX) / l.rect.width : 1,
				scaleY: c.scaleY !== 1 ? (a.rect.height * c.scaleY) / l.rect.height : 1,
			},
			p = v({ x: c.x - d.x, y: c.y - d.y }, g),
			h = s(I(v({}, u), { active: a, dragOverlay: l, transform: { initial: c, final: p } })),
			[y] = h,
			m = h[h.length - 1];
		if (JSON.stringify(y) === JSON.stringify(m)) return;
		const w = r == null ? void 0 : r(v({ active: a, dragOverlay: l }, u)),
			R = l.node.animate(h, { duration: t, easing: n, fill: "forwards" });
		return new Promise((b) => {
			R.onfinish = () => {
				w == null || w(), b();
			};
		});
	};
}
let er = 0;
function $i(e) {
	return i.useMemo(() => {
		if (e != null) return er++, er;
	}, [e]);
}
const Wi = xe.memo((e) => {
		let {
			adjustScale: t = !1,
			children: n,
			dropAnimation: r,
			style: s,
			transition: o,
			modifiers: a,
			wrapperElement: l = "div",
			className: c,
			zIndex: u = 999,
		} = e;
		const {
				activatorEvent: d,
				active: g,
				activeNodeRect: p,
				containerNodeRect: h,
				draggableNodes: y,
				droppableContainers: m,
				dragOverlay: w,
				over: R,
				measuringConfiguration: S,
				scrollableAncestors: b,
				scrollableAncestorRects: C,
				windowRect: P,
			} = Mi(),
			O = i.useContext(nn),
			M = $i(g == null ? void 0 : g.id),
			D = Fr(a, {
				activatorEvent: d,
				active: g,
				activeNodeRect: p,
				containerNodeRect: h,
				draggingNodeRect: w.rect,
				over: R,
				overlayNodeRect: w.rect,
				scrollableAncestors: b,
				scrollableAncestorRects: C,
				transform: O,
				windowRect: P,
			}),
			B = Pn(p),
			X = zi({
				config: r,
				draggableNodes: y,
				droppableContainers: m,
				measuringConfiguration: S,
			}),
			L = B ? w.setRef : void 0;
		return xe.createElement(
			ki,
			null,
			xe.createElement(
				ji,
				{ animation: X },
				g && M
					? xe.createElement(
							Vi,
							{
								key: M,
								id: g.id,
								ref: L,
								as: l,
								activatorEvent: d,
								adjustScale: t,
								className: c,
								transition: o,
								rect: B,
								style: v({ zIndex: u }, s),
								transform: D,
							},
							n
					  )
					: null
			)
		);
	}),
	_i = { Low: "outline", Medium: "secondary", High: "default", Urgent: "destructive" };
function Yi({ tasksByStatus: e, onStatusChange: t }) {
	const [n, r] = i.useState(null),
		s = Ts(Ds(jn, { activationConstraint: { distance: 5 } })),
		o = (u) => {
			const d = c(String(u.active.id));
			d && r(d);
		},
		a = (u) => {
			r(null);
			const { active: d, over: g } = u;
			if (!g) return;
			const p = String(d.id),
				h = String(g.id);
			if (zt.includes(h)) {
				const y = c(p);
				y && y.status !== h && t(p, h);
			}
		},
		l = (u) => {},
		c = (u) => {
			for (const d of Object.values(e)) {
				const g = d.find((p) => p.name === u);
				if (g) return g;
			}
		};
	return f.jsxs(Ci, {
		sensors: s,
		onDragStart: o,
		onDragEnd: a,
		onDragOver: l,
		children: [
			f.jsx("div", {
				className: "grid grid-cols-4 gap-4",
				children: zt.map((u) => {
					var d;
					return f.jsx(Xi, { status: u, tasks: (d = e[u]) != null ? d : [] }, u);
				}),
			}),
			f.jsx(Wi, { children: n ? f.jsx(Hr, { task: n, isDragOverlay: !0 }) : null }),
		],
	});
}
function Xi({ status: e, tasks: t }) {
	const { setNodeRef: n, isOver: r } = Ni({ id: e });
	return f.jsxs("div", {
		ref: n,
		className: `flex flex-col gap-2 rounded-xl border border-dashed p-3 transition-colors ${
			r ? "border-primary bg-primary/5" : "border-transparent bg-muted/40"
		}`,
		children: [
			f.jsxs("div", {
				className: "flex items-center justify-between px-1 pb-1",
				children: [
					f.jsx("span", {
						className:
							"text-xs font-medium text-muted-foreground uppercase tracking-wider",
						children: e,
					}),
					f.jsx(Ht, {
						variant: "outline",
						className: "text-[10px] h-4 px-1.5",
						children: t.length,
					}),
				],
			}),
			f.jsx("div", {
				className: "flex flex-col gap-2 min-h-[60px]",
				children: t.map((s) => f.jsx(Ki, { task: s }, s.name)),
			}),
		],
	});
}
function Ki({ task: e }) {
	const {
			attributes: t,
			listeners: n,
			setNodeRef: r,
			transform: s,
			isDragging: o,
		} = Ti({ id: e.name }),
		a = s ? { transform: `translate3d(${s.x}px, ${s.y}px, 0)` } : void 0;
	return f.jsx(
		"div",
		I(v(v({ ref: r, style: a }, n), t), {
			className: o ? "opacity-30" : "",
			children: f.jsx(Hr, { task: e }),
		})
	);
}
function Hr({ task: e, isDragOverlay: t }) {
	var n;
	return f.jsx(ts, {
		size: "sm",
		className: `cursor-grab active:cursor-grabbing ${t ? "rotate-2 shadow-lg" : ""}`,
		children: f.jsxs(ns, {
			className: "gap-1.5",
			children: [
				f.jsx(rs, { className: "text-sm leading-snug", children: e.title }),
				f.jsx("div", {
					className: "flex items-center gap-1.5",
					children: f.jsx(Ht, {
						variant: (n = _i[e.priority]) != null ? n : "outline",
						className: "text-[10px] h-4 px-1.5",
						children: e.priority,
					}),
				}),
			],
		}),
	});
}
function qi(t) {
	var e = J(t, []);
	return f.jsx(ro, v({ "data-slot": "dialog" }, e));
}
function Gi(t) {
	var e = J(t, []);
	return f.jsx(ao, v({ "data-slot": "dialog-portal" }, e));
}
function Ji(n) {
	var r = n,
		{ className: e } = r,
		t = J(r, ["className"]);
	return f.jsx(
		co,
		v(
			{
				"data-slot": "dialog-overlay",
				className: Ve(
					"data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 isolate z-50",
					e
				),
			},
			t
		)
	);
}
function Qi(s) {
	var o = s,
		{ className: e, children: t, showCloseButton: n = !0 } = o,
		r = J(o, ["className", "children", "showCloseButton"]);
	return f.jsxs(Gi, {
		children: [
			f.jsx(Ji, {}),
			f.jsxs(
				oo,
				I(
					v(
						{
							"data-slot": "dialog-content",
							className: Ve(
								"bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/5 grid max-w-[calc(100%-2rem)] gap-6 rounded-4xl p-6 text-sm ring-1 duration-100 sm:max-w-md fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 outline-none",
								e
							),
						},
						r
					),
					{
						children: [
							t,
							n &&
								f.jsxs(dr, {
									"data-slot": "dialog-close",
									render: f.jsx(mt, {
										variant: "ghost",
										className: "absolute top-4 right-4",
										size: "icon-sm",
									}),
									children: [
										f.jsx(dt, { icon: so, strokeWidth: 2 }),
										f.jsx("span", { className: "sr-only", children: "Close" }),
									],
								}),
						],
					}
				)
			),
		],
	});
}
function Zi(n) {
	var r = n,
		{ className: e } = r,
		t = J(r, ["className"]);
	return f.jsx(
		"div",
		v({ "data-slot": "dialog-header", className: Ve("gap-2 flex flex-col", e) }, t)
	);
}
function el(s) {
	var o = s,
		{ className: e, showCloseButton: t = !1, children: n } = o,
		r = J(o, ["className", "showCloseButton", "children"]);
	return f.jsxs(
		"div",
		I(
			v(
				{
					"data-slot": "dialog-footer",
					className: Ve("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", e),
				},
				r
			),
			{
				children: [
					n,
					t &&
						f.jsx(dr, {
							render: f.jsx(mt, { variant: "outline" }),
							children: "Close",
						}),
				],
			}
		)
	);
}
function tl(n) {
	var r = n,
		{ className: e } = r,
		t = J(r, ["className"]);
	return f.jsx(
		io,
		v(
			{
				"data-slot": "dialog-title",
				className: Ve("text-base leading-none font-medium", e),
			},
			t
		)
	);
}
function nl(n) {
	var r = n,
		{ className: e } = r,
		t = J(r, ["className"]);
	return f.jsx(
		lo,
		v(
			{
				"data-slot": "dialog-description",
				className: Ve(
					"text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3",
					e
				),
			},
			t
		)
	);
}
function gn(n) {
	var r = n,
		{ className: e } = r,
		t = J(r, ["className"]);
	return f.jsx(
		"label",
		v(
			{
				"data-slot": "label",
				className: Ve(
					"gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
					e
				),
			},
			t
		)
	);
}
const zr = i.createContext(null),
	Ur = i.createContext(null);
function nt() {
	const e = i.useContext(zr);
	if (e === null) throw new Error(It(60));
	return e;
}
function $r() {
	const e = i.useContext(Ur);
	if (e === null) throw new Error(It(61));
	return e;
}
const rl = (e, t) => Object.is(e, t);
function bt(e, t, n) {
	return e == null || t == null ? Object.is(e, t) : n(e, t);
}
function ol(e, t, n) {
	return !e || e.length === 0 ? !1 : e.some((r) => (r === void 0 ? !1 : bt(t, r, n)));
}
function Dt(e, t, n) {
	return !e || e.length === 0 ? -1 : e.findIndex((r) => (r === void 0 ? !1 : bt(r, t, n)));
}
function sl(e, t, n) {
	return e.filter((r) => !bt(t, r, n));
}
function yn(e) {
	if (e == null) return "";
	if (typeof e == "string") return e;
	try {
		return JSON.stringify(e);
	} catch (t) {
		return String(e);
	}
}
function Wr(e) {
	return e != null && e.length > 0 && typeof e[0] == "object" && e[0] != null && "items" in e[0];
}
function il(e) {
	if (!Array.isArray(e)) return e != null && !("null" in e);
	if (Wr(e)) {
		for (const t of e)
			for (const n of t.items) if (n && n.value == null && n.label != null) return !0;
		return !1;
	}
	for (const t of e) if (t && t.value == null && t.label != null) return !0;
	return !1;
}
function ll(e, t) {
	var n;
	if (t && e != null) return (n = t(e)) != null ? n : "";
	if (e && typeof e == "object") {
		if ("label" in e && e.label != null) return String(e.label);
		if ("value" in e) return String(e.value);
	}
	return yn(e);
}
function ht(e, t) {
	var n;
	return t && e != null
		? (n = t(e)) != null
			? n
			: ""
		: e && typeof e == "object" && "value" in e && "label" in e
		? yn(e.value)
		: yn(e);
}
function _r(e, t, n) {
	var s;
	function r() {
		return ll(e, n);
	}
	if (n && e != null) return n(e);
	if (e && typeof e == "object" && "label" in e && e.label != null) return e.label;
	if (t && !Array.isArray(t)) return (s = t[e]) != null ? s : r();
	if (Array.isArray(t)) {
		const o = Wr(t) ? t.flatMap((a) => a.items) : t;
		if (e == null || typeof e != "object") {
			const a = o.find((l) => l.value === e);
			return a && a.label != null ? a.label : r();
		}
		if ("value" in e) {
			const a = o.find((l) => l && l.value === e.value);
			if (a && a.label != null) return a.label;
		}
	}
	return r();
}
function al(e, t, n) {
	return e.reduce(
		(r, s, o) => (
			o > 0 && r.push(", "), r.push(f.jsx(i.Fragment, { children: _r(s, t, n) }, o)), r
		),
		[]
	);
}
const j = {
	id: te((e) => e.id),
	modal: te((e) => e.modal),
	multiple: te((e) => e.multiple),
	items: te((e) => e.items),
	itemToStringLabel: te((e) => e.itemToStringLabel),
	itemToStringValue: te((e) => e.itemToStringValue),
	isItemEqualToValue: te((e) => e.isItemEqualToValue),
	value: te((e) => e.value),
	hasSelectedValue: te((e) => {
		const { value: t, multiple: n, itemToStringValue: r } = e;
		return t == null ? !1 : n && Array.isArray(t) ? t.length > 0 : ht(t, r) !== "";
	}),
	hasNullItemLabel: te((e, t) => (t ? il(e.items) : !1)),
	open: te((e) => e.open),
	mounted: te((e) => e.mounted),
	forceMount: te((e) => e.forceMount),
	transitionStatus: te((e) => e.transitionStatus),
	openMethod: te((e) => e.openMethod),
	activeIndex: te((e) => e.activeIndex),
	selectedIndex: te((e) => e.selectedIndex),
	isActive: te((e, t) => e.activeIndex === t),
	isSelected: te((e, t, n) => {
		const r = e.isItemEqualToValue,
			s = e.value;
		return e.multiple
			? Array.isArray(s) && s.some((o) => bt(n, o, r))
			: e.selectedIndex === t && e.selectedIndex !== null
			? !0
			: bt(n, s, r);
	}),
	isSelectedByFocus: te((e, t) => e.selectedIndex === t),
	popupProps: te((e) => e.popupProps),
	triggerProps: te((e) => e.triggerProps),
	triggerElement: te((e) => e.triggerElement),
	positionerElement: te((e) => e.positionerElement),
	listElement: te((e) => e.listElement),
	scrollUpArrowVisible: te((e) => e.scrollUpArrowVisible),
	scrollDownArrowVisible: te((e) => e.scrollDownArrowVisible),
	hasScrollArrows: te((e) => e.hasScrollArrows),
};
function cl(e, t) {
	const n = i.useRef(e),
		r = Ye(t);
	Se(() => {
		n.current !== e && r(n.current);
	}, [e, r]),
		Se(() => {
			n.current = e;
		}, [e]);
}
function ul(e) {
	const {
			id: t,
			value: n,
			defaultValue: r = null,
			onValueChange: s,
			open: o,
			defaultOpen: a = !1,
			onOpenChange: l,
			name: c,
			autoComplete: u,
			disabled: d = !1,
			readOnly: g = !1,
			required: p = !1,
			modal: h = !0,
			actionsRef: y,
			inputRef: m,
			onOpenChangeComplete: w,
			items: R,
			multiple: S = !1,
			itemToStringLabel: b,
			itemToStringValue: C,
			isItemEqualToValue: P = rl,
			highlightItemOnHover: O = !0,
			children: M,
		} = e,
		{ clearErrors: D } = xr(),
		{
			setDirty: B,
			setTouched: X,
			setFocused: L,
			shouldValidateOnChange: W,
			validityData: q,
			setFilled: H,
			name: U,
			disabled: de,
			validation: z,
			validationMode: _,
		} = Jt(),
		x = En({ id: t }),
		K = de || d,
		G = U != null ? U : c,
		[E, le] = mn({
			controlled: n,
			default: S ? (r != null ? r : Fn) : r,
			name: "Select",
			state: "value",
		}),
		[Y, fe] = mn({ controlled: o, default: a, name: "Select", state: "open" }),
		A = i.useRef([]),
		T = i.useRef([]),
		ne = i.useRef(null),
		Ae = i.useRef(null),
		pe = i.useRef(0),
		ze = i.useRef(null),
		V = i.useRef([]),
		ee = i.useRef(!1),
		se = i.useRef(!1),
		ye = i.useRef(null),
		ge = i.useRef({ allowSelectedMouseUp: !1, allowUnselectedMouseUp: !1 }),
		Ee = i.useRef(!1),
		{ mounted: ie, setMounted: Be, transitionStatus: ae } = Sn(Y),
		{ openMethod: Q, triggerProps: ce, reset: De } = uo(Y),
		N = ur(
			() =>
				new wo({
					id: x,
					modal: h,
					multiple: S,
					itemToStringLabel: b,
					itemToStringValue: C,
					isItemEqualToValue: P,
					value: E,
					open: Y,
					mounted: ie,
					transitionStatus: ae,
					items: R,
					forceMount: !1,
					openMethod: null,
					activeIndex: null,
					selectedIndex: null,
					popupProps: {},
					triggerProps: {},
					triggerElement: null,
					positionerElement: null,
					listElement: null,
					scrollUpArrowVisible: !1,
					scrollDownArrowVisible: !1,
					hasScrollArrows: !1,
				})
		).current,
		Xe = k(N, j.activeIndex),
		Je = k(N, j.selectedIndex),
		Ie = k(N, j.triggerElement),
		Ne = k(N, j.positionerElement),
		Oe = i.useMemo(() => (S && Array.isArray(E) && E.length === 0 ? "" : ht(E, C)), [S, E, C]),
		he = i.useMemo(
			() => (S && Array.isArray(E) ? E.map((F) => ht(F, C)) : ht(E, C)),
			[S, E, C]
		),
		me = Rn(N.state.triggerElement);
	yr({ id: x, commit: z.commit, value: E, controlRef: me, name: G, getValue: () => he });
	const Te = i.useRef(E);
	Se(() => {
		E !== Te.current && N.set("forceMount", !0);
	}, [N, E]),
		Se(() => {
			H(S ? Array.isArray(E) && E.length > 0 : E != null);
		}, [S, E, H]),
		Se(
			function () {
				if (Y) return;
				const $ = V.current;
				if (S) {
					const re = Array.isArray(E) ? E : [];
					if (re.length === 0) {
						N.set("selectedIndex", null);
						return;
					}
					const ue = re[re.length - 1],
						Le = Dt($, ue, P);
					N.set("selectedIndex", Le === -1 ? null : Le);
					return;
				}
				const be = Dt($, E, P);
				N.set("selectedIndex", be === -1 ? null : be);
			},
			[S, Y, E, V, P, N]
		),
		cl(E, () => {
			D(G), B(E !== q.initialValue), W() ? z.commit(E) : z.commit(E, !0);
		});
	const Qe = Ye((F, $) => {
			if (
				(l == null || l(F, $),
				!$.isCanceled &&
					(fe(F),
					!F &&
						($.reason === So || $.reason === Ro) &&
						(X(!0), L(!1), _ === "onBlur" && z.commit(E)),
					!F && N.state.activeIndex !== null))
			) {
				const be = A.current[N.state.activeIndex];
				queueMicrotask(() => {
					be == null || be.setAttribute("tabindex", "-1");
				});
			}
		}),
		Fe = Ye(() => {
			Be(!1), N.set("activeIndex", null), De(), w == null || w(!1);
		});
	Gt({
		enabled: !y,
		open: Y,
		ref: ne,
		onComplete() {
			Y || Fe();
		},
	}),
		i.useImperativeHandle(y, () => ({ unmount: Fe }), [Fe]);
	const Ze = Ye((F, $) => {
			s == null || s(F, $), !$.isCanceled && le(F);
		}),
		it = Ye(() => {
			const F = N.state.listElement || ne.current;
			if (!F) return;
			const $ = F.scrollTop,
				be = F.scrollTop + F.clientHeight,
				re = $ > 1,
				ue = be < F.scrollHeight - 1;
			N.state.scrollUpArrowVisible !== re && N.set("scrollUpArrowVisible", re),
				N.state.scrollDownArrowVisible !== ue && N.set("scrollDownArrowVisible", ue);
		}),
		Ue = fo({ open: Y, onOpenChange: Qe, elements: { reference: Ie, floating: Ne } }),
		lt = go(Ue, { enabled: !g && !K, event: "mousedown" }),
		Ke = po(Ue, { bubbles: !1 }),
		ft = ho(Ue, {
			enabled: !g && !K,
			listRef: A,
			activeIndex: Xe,
			selectedIndex: Je,
			disabledIndices: Fn,
			onNavigate(F) {
				(F === null && !Y) || N.set("activeIndex", F);
			},
			focusItemOnHover: !1,
		}),
		gt = mo(Ue, {
			enabled: !g && !K && (Y || !S),
			listRef: T,
			activeIndex: Xe,
			selectedIndex: Je,
			onMatch(F) {
				Y ? N.set("activeIndex", F) : Ze(V.current[F], tt("none"));
			},
			onTypingChange(F) {
				ee.current = F;
			},
		}),
		{ getReferenceProps: rt, getFloatingProps: Z, getItemProps: Re } = vo([lt, Ke, ft, gt]),
		ve = i.useMemo(() => fr(rt(), ce, x ? { id: x } : hn), [rt, ce, x]);
	bo(() => {
		N.update({ popupProps: Z(), triggerProps: ve });
	}),
		Se(() => {
			N.update({
				id: x,
				modal: h,
				multiple: S,
				value: E,
				open: Y,
				mounted: ie,
				transitionStatus: ae,
				popupProps: Z(),
				triggerProps: ve,
				items: R,
				itemToStringLabel: b,
				itemToStringValue: C,
				isItemEqualToValue: P,
				openMethod: Q,
			});
		}, [N, x, h, S, E, Y, ie, ae, Z, ve, R, b, C, P, Q]);
	const He = i.useMemo(
			() => ({
				store: N,
				name: G,
				required: p,
				disabled: K,
				readOnly: g,
				multiple: S,
				itemToStringLabel: b,
				itemToStringValue: C,
				highlightItemOnHover: O,
				setValue: Ze,
				setOpen: Qe,
				listRef: A,
				popupRef: ne,
				scrollHandlerRef: Ae,
				handleScrollArrowVisibility: it,
				scrollArrowsMountedCountRef: pe,
				getItemProps: Re,
				events: Ue.context.events,
				valueRef: ze,
				valuesRef: V,
				labelsRef: T,
				typingRef: ee,
				selectionRef: ge,
				selectedItemTextRef: ye,
				validation: z,
				onOpenChangeComplete: w,
				keyboardActiveRef: se,
				alignItemWithTriggerActiveRef: Ee,
				initialValueRef: Te,
			}),
			[N, G, p, K, g, S, b, C, O, Ze, Qe, Re, Ue.context.events, z, w, it]
		),
		je = gr(m, z.inputRef),
		Me = S && Array.isArray(E) && E.length > 0,
		Pe = i.useMemo(
			() =>
				!S || !Array.isArray(E) || !G
					? null
					: E.map((F) => {
							const $ = ht(F, C);
							return f.jsx("input", { type: "hidden", name: G, value: $ }, $);
					  }),
			[S, E, G, C]
		);
	return f.jsx(zr.Provider, {
		value: He,
		children: f.jsxs(Ur.Provider, {
			value: Ue,
			children: [
				M,
				f.jsx(
					"input",
					I(
						v(
							{},
							z.getInputValidationProps({
								onFocus() {
									var F;
									(F = N.state.triggerElement) == null ||
										F.focus({ focusVisible: !0 });
								},
								onChange(F) {
									if (F.nativeEvent.defaultPrevented) return;
									const $ = F.target.value,
										be = tt(qt, F.nativeEvent);
									function re() {
										if (S) return;
										const ue = V.current.find(
											(Le) => ht(Le, C).toLowerCase() === $.toLowerCase()
										);
										ue != null &&
											(B(ue !== q.initialValue),
											Ze(ue, be),
											W() && z.commit(ue));
									}
									N.set("forceMount", !0), queueMicrotask(re);
								},
							})
						),
						{
							name: S ? void 0 : G,
							autoComplete: u,
							value: Oe,
							disabled: K,
							required: p && !Me,
							readOnly: g,
							ref: je,
							style: G ? xo : yo,
							tabIndex: -1,
							"aria-hidden": !0,
						}
					)
				),
				Pe,
			],
		}),
	});
}
const Lt = 2,
	dl = 400,
	tr = 200,
	fl = I(v(v({}, Eo), br), { value: () => null }),
	gl = i.forwardRef(function (t, n) {
		const V = t,
			{ render: r, className: s, id: o, disabled: a = !1, nativeButton: l = !0 } = V,
			c = J(V, ["render", "className", "id", "disabled", "nativeButton"]),
			{ setTouched: u, setFocused: d, validationMode: g, state: p, disabled: h } = Jt(),
			{ labelId: y } = Cn(),
			{
				store: m,
				setOpen: w,
				selectionRef: R,
				validation: S,
				readOnly: b,
				required: C,
				alignItemWithTriggerActiveRef: P,
				disabled: O,
				keyboardActiveRef: M,
			} = nt(),
			D = h || O || a,
			B = k(m, j.open),
			X = k(m, j.value),
			L = k(m, j.triggerProps),
			W = k(m, j.positionerElement),
			q = k(m, j.listElement),
			H = k(m, j.id),
			U = k(m, j.hasSelectedValue),
			de = !U && B,
			z = k(m, j.hasNullItemLabel, de),
			_ = o != null ? o : H;
		En({ id: _ });
		const x = Rn(W),
			K = i.useRef(null),
			{ getButtonProps: G, buttonRef: E } = pr({ disabled: D, native: l }),
			le = Ye((ee) => {
				m.set("triggerElement", ee);
			}),
			Y = gr(n, K, E, le),
			fe = ut(),
			A = ut(),
			T = ut(),
			ne = ut();
		i.useEffect(() => {
			if (B)
				return (
					!(U || z)
						? T.start(dl, () => {
								(R.current.allowUnselectedMouseUp = !0),
									(R.current.allowSelectedMouseUp = !0);
						  })
						: ne.start(tr, () => {
								(R.current.allowUnselectedMouseUp = !0),
									T.start(tr, () => {
										R.current.allowSelectedMouseUp = !0;
									});
						  }),
					() => {
						T.clear(), ne.clear();
					}
				);
			(R.current = { allowSelectedMouseUp: !1, allowUnselectedMouseUp: !1 }), A.clear();
		}, [B, U, z, R, A, T, ne]);
		const Ae = i.useMemo(() => {
				var ee, se;
				return (se = q == null ? void 0 : q.id) != null
					? se
					: (ee = Co(W)) == null
					? void 0
					: ee.id;
			}, [q, W]),
			pe = fr(
				L,
				{
					id: _,
					role: "combobox",
					"aria-expanded": B ? "true" : "false",
					"aria-haspopup": "listbox",
					"aria-controls": B ? Ae : void 0,
					"aria-labelledby": y,
					"aria-readonly": b || void 0,
					"aria-required": C || void 0,
					tabIndex: D ? -1 : 0,
					ref: Y,
					onFocus(ee) {
						d(!0),
							B && P.current && w(!1, tt(qt, ee.nativeEvent)),
							fe.start(0, () => {
								m.set("forceMount", !0);
							});
					},
					onBlur(ee) {
						sn(W, ee.relatedTarget) || (u(!0), d(!1), g === "onBlur" && S.commit(X));
					},
					onPointerMove() {
						M.current = !1;
					},
					onKeyDown() {
						M.current = !0;
					},
					onMouseDown(ee) {
						if (B) return;
						const se = Ft(ee.currentTarget);
						function ye(ge) {
							if (!K.current) return;
							const Ee = ge.target;
							if (sn(K.current, Ee) || sn(x.current, Ee) || Ee === K.current) return;
							const ie = Do(K.current);
							(ge.clientX >= ie.left - Lt &&
								ge.clientX <= ie.right + Lt &&
								ge.clientY >= ie.top - Lt &&
								ge.clientY <= ie.bottom + Lt) ||
								w(!1, tt(To, ge));
						}
						A.start(0, () => {
							se.addEventListener("mouseup", ye, { once: !0 });
						});
					},
				},
				S.getValidationProps,
				c,
				G
			);
		pe.role = "combobox";
		const ze = I(v({}, p), { open: B, disabled: D, value: X, readOnly: b, placeholder: !U });
		return Ge("button", t, { ref: [n, K], state: ze, stateAttributesMapping: fl, props: pe });
	}),
	pl = { value: () => null },
	hl = i.forwardRef(function (t, n) {
		const b = t,
			{ className: r, render: s, children: o, placeholder: a } = b,
			l = J(b, ["className", "render", "children", "placeholder"]),
			{ store: c, valueRef: u } = nt(),
			d = k(c, j.value),
			g = k(c, j.items),
			p = k(c, j.itemToStringLabel),
			h = k(c, j.hasSelectedValue),
			y = !h && a != null && o == null,
			m = k(c, j.hasNullItemLabel, y),
			w = { value: d, placeholder: !h };
		let R = null;
		return (
			typeof o == "function"
				? (R = o(d))
				: o != null
				? (R = o)
				: !h && a != null && !m
				? (R = a)
				: Array.isArray(d)
				? (R = al(d, g, p))
				: (R = _r(d, g, p)),
			Ge("span", t, {
				state: w,
				ref: [n, u],
				props: [{ children: R }, l],
				stateAttributesMapping: pl,
			})
		);
	}),
	ml = i.forwardRef(function (t, n) {
		const d = t,
			{ className: r, render: s } = d,
			o = J(d, ["className", "render"]),
			{ store: a } = nt(),
			c = { open: k(a, j.open) };
		return Ge("span", t, {
			state: c,
			ref: n,
			props: [{ "aria-hidden": !0, children: "▼" }, o],
			stateAttributesMapping: Mo,
		});
	}),
	vl = i.createContext(void 0),
	bl = i.forwardRef(function (t, n) {
		const { store: r } = nt(),
			s = k(r, j.mounted),
			o = k(r, j.forceMount);
		return s || o
			? f.jsx(vl.Provider, { value: !0, children: f.jsx(Ao, v({ ref: n }, t)) })
			: null;
	}),
	Yr = i.createContext(void 0);
function kn() {
	const e = i.useContext(Yr);
	if (!e) throw new Error(It(59));
	return e;
}
function Kt(e, t) {
	e && Object.assign(e.style, t);
}
const Xr = { position: "relative", maxHeight: "100%", overflowX: "hidden", overflowY: "auto" },
	xl = { position: "fixed" },
	yl = i.forwardRef(function (t, n) {
		const Ee = t,
			{
				anchor: r,
				positionMethod: s = "absolute",
				className: o,
				render: a,
				side: l = "bottom",
				align: c = "center",
				sideOffset: u = 0,
				alignOffset: d = 0,
				collisionBoundary: g = "clipping-ancestors",
				collisionPadding: p,
				arrowPadding: h = 5,
				sticky: y = !1,
				disableAnchorTracking: m,
				alignItemWithTrigger: w = !0,
				collisionAvoidance: R = Io,
			} = Ee,
			S = J(Ee, [
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
				"alignItemWithTrigger",
				"collisionAvoidance",
			]),
			{
				store: b,
				listRef: C,
				labelsRef: P,
				alignItemWithTriggerActiveRef: O,
				selectedItemTextRef: M,
				valuesRef: D,
				initialValueRef: B,
				popupRef: X,
				setValue: L,
			} = nt(),
			W = $r(),
			q = k(b, j.open),
			H = k(b, j.mounted),
			U = k(b, j.modal),
			de = k(b, j.value),
			z = k(b, j.openMethod),
			_ = k(b, j.positionerElement),
			x = k(b, j.triggerElement),
			K = k(b, j.isItemEqualToValue),
			G = k(b, j.transitionStatus),
			E = i.useRef(null),
			le = i.useRef(null),
			[Y, fe] = i.useState(w),
			A = H && Y && z !== "touch";
		!H && Y !== w && fe(w),
			Se(() => {
				H ||
					(j.scrollUpArrowVisible(b.state) && b.set("scrollUpArrowVisible", !1),
					j.scrollDownArrowVisible(b.state) && b.set("scrollDownArrowVisible", !1));
			}, [b, H]),
			i.useImperativeHandle(O, () => A),
			No((A || U) && q && z !== "touch", x);
		const T = jo({
				anchor: r,
				floatingRootContext: W,
				positionMethod: s,
				mounted: H,
				side: l,
				sideOffset: u,
				align: c,
				alignOffset: d,
				arrowPadding: h,
				collisionBoundary: g,
				collisionPadding: p,
				sticky: y,
				disableAnchorTracking: m != null ? m : A,
				collisionAvoidance: R,
				keepMounted: !0,
			}),
			ne = A ? "none" : T.side,
			Ae = A ? xl : T.positionerStyles,
			pe = i.useMemo(() => {
				const ie = {};
				return (
					q || (ie.pointerEvents = "none"),
					{ role: "presentation", hidden: !H, style: v(v({}, Ae), ie) }
				);
			}, [q, H, Ae]),
			ze = { open: q, side: ne, align: T.align, anchorHidden: T.anchorHidden },
			V = Ye((ie) => {
				b.set("positionerElement", ie);
			}),
			ee = Ge("div", t, {
				ref: [n, V],
				state: ze,
				stateAttributesMapping: hr,
				props: [pe, mr(G), S],
			}),
			se = i.useRef(0),
			ye = Ye((ie) => {
				if ((ie.size === 0 && se.current === 0) || D.current.length === 0) return;
				const Be = se.current;
				if (((se.current = ie.size), ie.size === Be)) return;
				const ae = tt(qt);
				if (Be !== 0 && !b.state.multiple && de !== null && Dt(D.current, de, K) === -1) {
					const ce = B.current,
						N = ce != null && Dt(D.current, ce, K) !== -1 ? ce : null;
					L(N, ae), N === null && (b.set("selectedIndex", null), (M.current = null));
				}
				if (Be !== 0 && b.state.multiple && Array.isArray(de)) {
					const Q = (De) => Dt(D.current, De, K) !== -1,
						ce = de.filter((De) => Q(De));
					(ce.length !== de.length || ce.some((De) => !ol(de, De, K))) &&
						(L(ce, ae),
						ce.length === 0 && (b.set("selectedIndex", null), (M.current = null)));
				}
				if (q && A) {
					b.update({ scrollUpArrowVisible: !1, scrollDownArrowVisible: !1 });
					const Q = { height: "" };
					Kt(_, Q), Kt(X.current, Q);
				}
			}),
			ge = i.useMemo(
				() =>
					I(v({}, T), {
						side: ne,
						alignItemWithTriggerActive: A,
						setControlledAlignItemWithTrigger: fe,
						scrollUpArrowRef: E,
						scrollDownArrowRef: le,
					}),
				[T, ne, A, fe]
			);
		return f.jsx(Po, {
			elementsRef: C,
			labelsRef: P,
			onMapChange: ye,
			children: f.jsxs(Yr.Provider, {
				value: ge,
				children: [H && U && f.jsx(ko, { inert: Oo(!q), cutout: x }), ee],
			}),
		});
	});
function Kr(e) {
	const t = e.currentTarget.getBoundingClientRect();
	return (
		t.top + 1 <= e.clientY &&
		e.clientY <= t.bottom - 1 &&
		t.left + 1 <= e.clientX &&
		e.clientX <= t.right - 1
	);
}
const Vt = "base-ui-disable-scrollbar",
	wn = {
		className: Vt,
		getElement(e) {
			return f.jsx("style", {
				nonce: e,
				href: Vt,
				precedence: "base-ui:low",
				children: `.${Vt}{scrollbar-width:none}.${Vt}::-webkit-scrollbar{display:none}`,
			});
		},
	};
function pn(e, t = Number.MIN_SAFE_INTEGER, n = Number.MAX_SAFE_INTEGER) {
	return Math.max(t, Math.min(e, n));
}
const wl = i.createContext(void 0),
	Sl = { disableStyleElements: !1 };
function Rl() {
	var e;
	return (e = i.useContext(wl)) != null ? e : Sl;
}
const at = 1,
	Cl = v(v({}, hr), vr),
	El = i.forwardRef(function (t, n) {
		const ze = t,
			{ render: r, className: s, finalFocus: o } = ze,
			a = J(ze, ["render", "className", "finalFocus"]),
			{
				store: l,
				popupRef: c,
				onOpenChangeComplete: u,
				setOpen: d,
				valueRef: g,
				selectedItemTextRef: p,
				keyboardActiveRef: h,
				multiple: y,
				handleScrollArrowVisibility: m,
				scrollHandlerRef: w,
				highlightItemOnHover: R,
			} = nt(),
			{
				side: S,
				align: b,
				alignItemWithTriggerActive: C,
				setControlledAlignItemWithTrigger: P,
				scrollDownArrowRef: O,
				scrollUpArrowRef: M,
			} = kn(),
			D = Lo() != null,
			B = $r(),
			{ nonce: X, disableStyleElements: L } = Rl(),
			W = ut(),
			q = k(l, j.id),
			H = k(l, j.open),
			U = k(l, j.mounted),
			de = k(l, j.popupProps),
			z = k(l, j.transitionStatus),
			_ = k(l, j.triggerElement),
			x = k(l, j.positionerElement),
			K = k(l, j.listElement),
			G = i.useRef(0),
			E = i.useRef(!1),
			le = i.useRef(0),
			Y = i.useRef(!1),
			fe = i.useRef({}),
			A = Vo(),
			T = Ye((V) => {
				if (!x || !c.current || !Y.current) return;
				if (E.current || !C) {
					m();
					return;
				}
				const ee = x.style.top === "0px",
					se = x.style.bottom === "0px",
					ye = x.getBoundingClientRect().height,
					ge = Ft(x),
					Ee = getComputedStyle(x),
					ie = parseFloat(Ee.marginTop),
					Be = parseFloat(Ee.marginBottom),
					ae = nr(getComputedStyle(c.current)),
					Q = Math.min(ge.documentElement.clientHeight - ie - Be, ae),
					ce = V.scrollTop,
					De = rr(V);
				let N = 0,
					Xe = null,
					Je = !1,
					Ie = !1;
				const Ne = (he) => {
						x.style.height = `${he}px`;
					},
					Oe = (he, me) => {
						const Te = pn(he, 0, Q - ye);
						Te > 0 && Ne(ye + Te),
							(V.scrollTop = me),
							Q - (ye + Te) <= at && (E.current = !0),
							m();
					};
				if (ee) {
					const he = De - ce,
						me = ye + he,
						Te = Math.min(me, Q);
					if (((N = Te), he <= at)) {
						Oe(he, De);
						return;
					}
					Q - Te > at ? (Ie = !0) : (Je = !0);
				} else if (se) {
					const he = ce,
						me = ye + he,
						Te = Math.min(me, Q),
						Qe = me - Q;
					if (((N = Te), he <= at)) {
						Oe(he, 0);
						return;
					}
					Q - Te > at ? (Xe = 0) : ((Je = !0), ce < De && (Xe = ce - (he - Qe)));
				}
				if (((N = Math.ceil(N)), N !== 0 && Ne(N), Ie || Xe != null)) {
					const he = rr(V),
						me = Ie ? he : pn(Xe, 0, he);
					Math.abs(V.scrollTop - me) > at && (V.scrollTop = me);
				}
				(Je || N >= Q - at) && (E.current = !0), m();
			});
		i.useImperativeHandle(w, () => T, [T]),
			Gt({
				open: H,
				ref: c,
				onComplete() {
					H && (u == null || u(!0));
				},
			});
		const ne = { open: H, transitionStatus: z, side: S, align: b };
		Se(() => {
			!x ||
				!c.current ||
				Object.keys(fe.current).length ||
				(fe.current = {
					top: x.style.top || "0",
					left: x.style.left || "0",
					right: x.style.right,
					height: x.style.height,
					bottom: x.style.bottom,
					minHeight: x.style.minHeight,
					maxHeight: x.style.maxHeight,
					marginTop: x.style.marginTop,
					marginBottom: x.style.marginBottom,
				});
		}, [c, x]),
			Se(() => {
				H ||
					C ||
					((Y.current = !1),
					(E.current = !1),
					(G.current = 0),
					(le.current = 0),
					Kt(x, fe.current));
			}, [H, C, x, c]),
			Se(() => {
				const V = c.current;
				if (!(!H || !_ || !x || !V || l.state.transitionStatus === "ending")) {
					if (!C) {
						(Y.current = !0),
							A.request(m),
							V.style.removeProperty("--transform-origin");
						return;
					}
					queueMicrotask(() => {
						var se, ye;
						const ee = Dl(V);
						V.style.removeProperty("--transform-origin");
						try {
							const ge = getComputedStyle(x),
								Ee = getComputedStyle(V),
								ie = Ft(_),
								Be = Hn(x),
								ae = _.getBoundingClientRect(),
								Q = x.getBoundingClientRect(),
								ce = ae.left,
								De = ae.height,
								N = K || V,
								Xe = N.scrollHeight,
								Je = parseFloat(Ee.borderBottomWidth),
								Ie = parseFloat(ge.marginTop) || 10,
								Ne = parseFloat(ge.marginBottom) || 10,
								Oe = parseFloat(ge.minHeight) || 100,
								he = nr(Ee),
								me = 5,
								Te = 5,
								Qe = 20,
								Fe = ie.documentElement.clientHeight - Ie - Ne,
								Ze = ie.documentElement.clientWidth,
								it = Fe - ae.bottom + De,
								Ue = p.current,
								lt = g.current;
							let Ke,
								ft = 0,
								gt = 0;
							if (Ue && lt) {
								const re = lt.getBoundingClientRect();
								Ke = Ue.getBoundingClientRect();
								const ue = re.left - ce,
									Le = Ke.left - Q.left,
									et = re.top - ae.top + re.height / 2,
									$e = Ke.top - Q.top + Ke.height / 2;
								(ft = ue - Le), (gt = $e - et);
							}
							const rt = it + gt + Ne + Je;
							let Z = Math.min(Fe, rt);
							const Re = Fe - Ie - Ne,
								ve = rt - Z,
								He = Math.max(me, ce + ft),
								je = Ze - Te,
								Me = Math.max(0, He + Q.width - je);
							(x.style.left = `${He - Me}px`),
								(x.style.height = `${Z}px`),
								(x.style.maxHeight = "auto"),
								(x.style.marginTop = `${Ie}px`),
								(x.style.marginBottom = `${Ne}px`),
								(V.style.height = "100%");
							const Pe = N.scrollHeight - N.clientHeight,
								F = ve >= Pe;
							F && (Z = Math.min(Fe, Q.height) - (ve - Pe));
							const $ = ae.top < Qe || ae.bottom > Fe - Qe || Z < Math.min(Xe, Oe),
								be =
									((ye = (se = Be.visualViewport) == null ? void 0 : se.scale) !=
									null
										? ye
										: 1) !== 1 && Bo;
							if ($ || be) {
								(Y.current = !0), Kt(x, fe.current), ct.flushSync(() => P(!1));
								return;
							}
							if (F) {
								const re = Math.max(0, Fe - rt);
								(x.style.top = Q.height >= Re ? "0" : `${re}px`),
									(x.style.height = `${Z}px`),
									(N.scrollTop = N.scrollHeight - N.clientHeight),
									(G.current = Math.max(Oe, Z));
							} else
								(x.style.bottom = "0"),
									(G.current = Math.max(Oe, Z)),
									(N.scrollTop = ve);
							if (Ke) {
								const re = Q.top,
									ue = Q.height,
									Le = Ke.top + Ke.height / 2,
									et = ue > 0 ? ((Le - re) / ue) * 100 : 50,
									$e = pn(et, 0, 100);
								V.style.setProperty("--transform-origin", `50% ${$e}%`);
							}
							(G.current === Fe || Z >= he) && (E.current = !0),
								m(),
								setTimeout(() => {
									Y.current = !0;
								});
						} finally {
							ee();
						}
					});
				}
			}, [l, H, x, _, g, p, c, m, C, P, A, O, M, K]),
			i.useEffect(() => {
				if (!C || !x || !H) return;
				const V = Hn(x);
				function ee(se) {
					d(!1, tt(Ho, se));
				}
				return (
					V.addEventListener("resize", ee),
					() => {
						V.removeEventListener("resize", ee);
					}
				);
			}, [d, C, x, H]);
		const Ae = v(
				I(
					v(
						{},
						K
							? { role: "presentation", "aria-orientation": void 0 }
							: {
									role: "listbox",
									"aria-multiselectable": y || void 0,
									id: `${q}-list`,
							  }
					),
					{
						onKeyDown(V) {
							(h.current = !0), D && zo.has(V.key) && V.stopPropagation();
						},
						onMouseMove() {
							h.current = !1;
						},
						onPointerLeave(V) {
							if (!R || Kr(V) || V.pointerType === "touch") return;
							const ee = V.currentTarget;
							W.start(0, () => {
								l.set("activeIndex", null), ee.focus({ preventScroll: !0 });
							});
						},
						onScroll(V) {
							K || T(V.currentTarget);
						},
					}
				),
				C && { style: K ? { height: "100%" } : Xr }
			),
			pe = Ge("div", t, {
				ref: [n, c],
				state: ne,
				stateAttributesMapping: Cl,
				props: [de, Ae, mr(z), { className: !K && C ? wn.className : void 0 }, a],
			});
		return f.jsxs(i.Fragment, {
			children: [
				!L && wn.getElement(X),
				f.jsx(Fo, {
					context: B,
					modal: !1,
					disabled: !U,
					returnFocus: o,
					restoreFocus: !0,
					children: pe,
				}),
			],
		});
	});
function nr(e) {
	const t = e.maxHeight || "";
	return (t.endsWith("px") && parseFloat(t)) || 1 / 0;
}
function rr(e) {
	return Math.max(0, e.scrollHeight - e.clientHeight);
}
const or = [
	["transform", "none"],
	["scale", "1"],
	["translate", "0 0"],
];
function Dl(e) {
	const { style: t } = e,
		n = {};
	for (const [r, s] of or) (n[r] = t.getPropertyValue(r)), t.setProperty(r, s, "important");
	return () => {
		for (const [r] of or) {
			const s = n[r];
			s ? t.setProperty(r, s) : t.removeProperty(r);
		}
	};
}
const Tl = i.forwardRef(function (t, n) {
		const m = t,
			{ className: r, render: s } = m,
			o = J(m, ["className", "render"]),
			{ store: a, scrollHandlerRef: l } = nt(),
			{ alignItemWithTriggerActive: c } = kn(),
			u = k(a, j.hasScrollArrows),
			d = k(a, j.openMethod),
			g = k(a, j.multiple),
			p = k(a, j.id),
			h = I(
				v(
					{
						id: `${p}-list`,
						role: "listbox",
						"aria-multiselectable": g || void 0,
						onScroll(w) {
							var R;
							(R = l.current) == null || R.call(l, w.currentTarget);
						},
					},
					c && { style: Xr }
				),
				{ className: u && d !== "touch" ? wn.className : void 0 }
			),
			y = Ye((w) => {
				a.set("listElement", w);
			});
		return Ge("div", t, { ref: [n, y], props: [h, o] });
	}),
	qr = i.createContext(void 0);
function On() {
	const e = i.useContext(qr);
	if (!e) throw new Error(It(57));
	return e;
}
const Ml = i.memo(
		i.forwardRef(function (t, n) {
			const A = t,
				{
					render: r,
					className: s,
					value: o = null,
					label: a,
					disabled: l = !1,
					nativeButton: c = !1,
				} = A,
				u = J(A, ["render", "className", "value", "label", "disabled", "nativeButton"]),
				d = i.useRef(null),
				g = Uo({ label: a, textRef: d, indexGuessBehavior: $o.GuessFromOrder }),
				{
					store: p,
					getItemProps: h,
					setOpen: y,
					setValue: m,
					selectionRef: w,
					typingRef: R,
					valuesRef: S,
					keyboardActiveRef: b,
					multiple: C,
					highlightItemOnHover: P,
				} = nt(),
				O = ut(),
				M = k(p, j.isActive, g.index),
				D = k(p, j.isSelected, g.index, o),
				B = k(p, j.isSelectedByFocus, g.index),
				X = k(p, j.isItemEqualToValue),
				L = g.index,
				W = L !== -1,
				q = i.useRef(null),
				H = Rn(L);
			Se(() => {
				if (!W) return;
				const T = S.current;
				return (
					(T[L] = o),
					() => {
						delete T[L];
					}
				);
			}, [W, L, o, S]),
				Se(() => {
					if (!W) return;
					const T = p.state.value;
					let ne = T;
					C && Array.isArray(T) && T.length > 0 && (ne = T[T.length - 1]),
						ne !== void 0 && bt(o, ne, X) && p.set("selectedIndex", L);
				}, [W, L, C, X, p, o]);
			const U = { disabled: l, selected: D, highlighted: M },
				de = h({ active: M, selected: D });
			(de.onFocus = void 0), (de.id = void 0);
			const z = i.useRef(null),
				_ = i.useRef("mouse"),
				x = i.useRef(!1),
				{ getButtonProps: K, buttonRef: G } = pr({
					disabled: l,
					focusableWhenDisabled: !0,
					native: c,
				});
			function E(T) {
				const ne = p.state.value;
				if (C) {
					const Ae = Array.isArray(ne) ? ne : [],
						pe = D ? sl(Ae, o, X) : [...Ae, o];
					m(pe, tt(ln, T));
				} else m(o, tt(ln, T)), y(!1, tt(ln, T));
			}
			const le = {
					role: "option",
					"aria-selected": D,
					tabIndex: M ? 0 : -1,
					onFocus() {
						p.set("activeIndex", L);
					},
					onMouseEnter() {
						!b.current &&
							p.state.selectedIndex === null &&
							P &&
							p.set("activeIndex", L);
					},
					onMouseMove() {
						P && p.set("activeIndex", L);
					},
					onMouseLeave(T) {
						!P ||
							b.current ||
							Kr(T) ||
							O.start(0, () => {
								p.state.activeIndex === L && p.set("activeIndex", null);
							});
					},
					onTouchStart() {
						w.current = { allowSelectedMouseUp: !1, allowUnselectedMouseUp: !1 };
					},
					onKeyDown(T) {
						(z.current = T.key), p.set("activeIndex", L);
					},
					onClick(T) {
						(x.current = !1),
							!(T.type === "keydown" && z.current === null) &&
								(l ||
									(z.current === " " && R.current) ||
									(_.current !== "touch" && !M) ||
									((z.current = null), E(T.nativeEvent)));
					},
					onPointerEnter(T) {
						_.current = T.pointerType;
					},
					onPointerDown(T) {
						(_.current = T.pointerType), (x.current = !0);
					},
					onMouseUp(T) {
						if (l) return;
						if (x.current) {
							x.current = !1;
							return;
						}
						const ne = !w.current.allowSelectedMouseUp && D,
							Ae = !w.current.allowUnselectedMouseUp && !D;
						ne || Ae || (_.current !== "touch" && !M) || E(T.nativeEvent);
					},
				},
				Y = Ge("div", t, { ref: [G, n, g.ref, q], state: U, props: [de, le, u, K] }),
				fe = i.useMemo(
					() => ({
						selected: D,
						indexRef: H,
						textRef: d,
						selectedByFocus: B,
						hasRegistered: W,
					}),
					[D, H, d, B, W]
				);
			return f.jsx(qr.Provider, { value: fe, children: Y });
		})
	),
	Al = i.forwardRef(function (t, n) {
		var a;
		const r = (a = t.keepMounted) != null ? a : !1,
			{ selected: s } = On();
		return r || s ? f.jsx(Il, I(v({}, t), { ref: n })) : null;
	}),
	Il = i.memo(
		i.forwardRef((e, t) => {
			const p = e,
				{ render: n, className: r, keepMounted: s } = p,
				o = J(p, ["render", "className", "keepMounted"]),
				{ selected: a } = On(),
				l = i.useRef(null),
				{ transitionStatus: c, setMounted: u } = Sn(a),
				g = Ge("span", e, {
					ref: [t, l],
					state: { selected: a, transitionStatus: c },
					props: [{ "aria-hidden": !0, children: "✔️" }, o],
					stateAttributesMapping: vr,
				});
			return (
				Gt({
					open: a,
					ref: l,
					onComplete() {
						a || u(!1);
					},
				}),
				g
			);
		})
	),
	Nl = i.memo(
		i.forwardRef(function (t, n) {
			const { indexRef: r, textRef: s, selectedByFocus: o, hasRegistered: a } = On(),
				{ selectedItemTextRef: l } = nt(),
				h = t,
				{ className: c, render: u } = h,
				d = J(h, ["className", "render"]),
				g = i.useCallback(
					(y) => {
						if (!y || !a) return;
						const m = l.current === null || !l.current.isConnected;
						(o || (m && r.current === 0)) && (l.current = y);
					},
					[l, r, o, a]
				);
			return Ge("div", t, { ref: [g, n, s], props: d });
		})
	),
	Gr = i.forwardRef(function (t, n) {
		const W = t,
			{ render: r, className: s, direction: o, keepMounted: a = !1 } = W,
			l = J(W, ["render", "className", "direction", "keepMounted"]),
			{
				store: c,
				popupRef: u,
				listRef: d,
				handleScrollArrowVisibility: g,
				scrollArrowsMountedCountRef: p,
			} = nt(),
			{ side: h, scrollDownArrowRef: y, scrollUpArrowRef: m } = kn(),
			w = o === "up" ? j.scrollUpArrowVisible : j.scrollDownArrowVisible,
			R = k(c, w),
			S = k(c, j.openMethod),
			b = R && S !== "touch",
			C = ut(),
			P = o === "up" ? m : y,
			{ transitionStatus: O, setMounted: M } = Sn(b);
		Se(
			() => (
				(p.current += 1),
				c.state.hasScrollArrows || c.set("hasScrollArrows", !0),
				() => {
					(p.current = Math.max(0, p.current - 1)),
						p.current === 0 && c.state.hasScrollArrows && c.set("hasScrollArrows", !1);
				}
			),
			[c, p]
		),
			Gt({
				open: b,
				ref: P,
				onComplete() {
					b || M(!1);
				},
			});
		const X = Ge("div", t, {
			ref: [n, P],
			state: { direction: o, visible: b, side: h, transitionStatus: O },
			props: [
				{
					"aria-hidden": !0,
					children: o === "up" ? "▲" : "▼",
					style: { position: "absolute" },
					onMouseMove(q) {
						if ((q.movementX === 0 && q.movementY === 0) || C.isStarted()) return;
						c.set("activeIndex", null);
						function H() {
							var x, K;
							const U = (x = c.state.listElement) != null ? x : u.current;
							if (!U) return;
							c.set("activeIndex", null), g();
							const de = U.scrollTop === 0,
								z = Math.round(U.scrollTop + U.clientHeight) >= U.scrollHeight;
							if (
								(d.current.length === 0 &&
									(o === "up"
										? c.set("scrollUpArrowVisible", !de)
										: c.set("scrollDownArrowVisible", !z)),
								(o === "up" && de) || (o === "down" && z))
							) {
								C.clear();
								return;
							}
							if (
								(c.state.listElement || u.current) &&
								d.current &&
								d.current.length > 0
							) {
								const G = d.current,
									E = ((K = P.current) == null ? void 0 : K.offsetHeight) || 0;
								if (o === "up") {
									let le = 0;
									const Y = U.scrollTop + E;
									for (let A = 0; A < G.length; A += 1) {
										const T = G[A];
										if (T && T.offsetTop >= Y) {
											le = A;
											break;
										}
									}
									const fe = Math.max(0, le - 1);
									if (fe < le) {
										const A = G[fe];
										A && (U.scrollTop = Math.max(0, A.offsetTop - E));
									} else U.scrollTop = 0;
								} else {
									let le = G.length - 1;
									const Y = U.scrollTop + U.clientHeight - E;
									for (let A = 0; A < G.length; A += 1) {
										const T = G[A];
										if (T && T.offsetTop + T.offsetHeight > Y) {
											le = Math.max(0, A - 1);
											break;
										}
									}
									const fe = Math.min(G.length - 1, le + 1);
									if (fe > le) {
										const A = G[fe];
										A &&
											(U.scrollTop =
												A.offsetTop + A.offsetHeight - U.clientHeight + E);
									} else U.scrollTop = U.scrollHeight - U.clientHeight;
								}
							}
							C.start(40, H);
						}
						C.start(40, H);
					},
					onMouseLeave() {
						C.clear();
					},
				},
				l,
			],
		});
		return b || a ? X : null;
	}),
	jl = i.forwardRef(function (t, n) {
		return f.jsx(Gr, I(v({}, t), { ref: n, direction: "down" }));
	}),
	Pl = i.forwardRef(function (t, n) {
		return f.jsx(Gr, I(v({}, t), { ref: n, direction: "up" }));
	}),
	sr = ul;
function ir(n) {
	var r = n,
		{ className: e } = r,
		t = J(r, ["className"]);
	return f.jsx(
		hl,
		v({ "data-slot": "select-value", className: Ve("flex flex-1 text-left", e) }, t)
	);
}
function lr(s) {
	var o = s,
		{ className: e, size: t = "default", children: n } = o,
		r = J(o, ["className", "size", "children"]);
	return f.jsxs(
		gl,
		I(
			v(
				{
					"data-slot": "select-trigger",
					"data-size": t,
					className: Ve(
						"border-input data-placeholder:text-muted-foreground bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-1.5 rounded-4xl border px-3 py-2 text-sm transition-colors focus-visible:ring-[3px] aria-invalid:ring-[3px] data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-4 flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
						e
					),
				},
				r
			),
			{
				children: [
					n,
					f.jsx(ml, {
						render: f.jsx(dt, {
							icon: Wo,
							strokeWidth: 2,
							className: "text-muted-foreground size-4 pointer-events-none",
						}),
					}),
				],
			}
		)
	);
}
function ar(c) {
	var u = c,
		{
			className: e,
			children: t,
			side: n = "bottom",
			sideOffset: r = 4,
			align: s = "center",
			alignOffset: o = 0,
			alignItemWithTrigger: a = !0,
		} = u,
		l = J(u, [
			"className",
			"children",
			"side",
			"sideOffset",
			"align",
			"alignOffset",
			"alignItemWithTrigger",
		]);
	return f.jsx(bl, {
		children: f.jsx(yl, {
			side: n,
			sideOffset: r,
			align: s,
			alignOffset: o,
			alignItemWithTrigger: a,
			className: "isolate z-50",
			children: f.jsxs(
				El,
				I(
					v(
						{
							"data-slot": "select-content",
							"data-align-trigger": a,
							className: Ve(
								"bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/5 min-w-36 rounded-2xl shadow-2xl ring-1 duration-100 data-[side=inline-start]:slide-in-from-right-2 data-[side=inline-end]:slide-in-from-left-2 dark relative isolate z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none",
								e
							),
						},
						l
					),
					{ children: [f.jsx(kl, {}), f.jsx(Tl, { children: t }), f.jsx(Ol, {})] }
				)
			),
		}),
	});
}
function cr(r) {
	var s = r,
		{ className: e, children: t } = s,
		n = J(s, ["className", "children"]);
	return f.jsxs(
		Ml,
		I(
			v(
				{
					"data-slot": "select-item",
					className: Ve(
						"focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground gap-2.5 rounded-xl py-2 pr-8 pl-3 text-sm [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
						e
					),
				},
				n
			),
			{
				children: [
					f.jsx(Nl, {
						className: "flex flex-1 gap-2 shrink-0 whitespace-nowrap",
						children: t,
					}),
					f.jsx(Al, {
						render: f.jsx("span", {
							className:
								"pointer-events-none absolute right-2 flex size-4 items-center justify-center",
						}),
						children: f.jsx(dt, {
							icon: _o,
							strokeWidth: 2,
							className: "pointer-events-none",
						}),
					}),
				],
			}
		)
	);
}
function kl(n) {
	var r = n,
		{ className: e } = r,
		t = J(r, ["className"]);
	return f.jsx(
		Pl,
		I(
			v(
				{
					"data-slot": "select-scroll-up-button",
					className: Ve(
						"bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 top-0 w-full",
						e
					),
				},
				t
			),
			{ children: f.jsx(dt, { icon: Yo, strokeWidth: 2 }) }
		)
	);
}
function Ol(n) {
	var r = n,
		{ className: e } = r,
		t = J(r, ["className"]);
	return f.jsx(
		jl,
		I(
			v(
				{
					"data-slot": "select-scroll-down-button",
					className: Ve(
						"bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*='size-'])]:size-4 bottom-0 w-full",
						e
					),
				},
				t
			),
			{ children: f.jsx(dt, { icon: Xo, strokeWidth: 2 }) }
		)
	);
}
function Ll({ open: e, onOpenChange: t, onSubmit: n }) {
	const [r, s] = i.useState(""),
		[o, a] = i.useState("Medium"),
		[l, c] = i.useState("Backlog"),
		u = (d) => {
			d.preventDefault(),
				r.trim() &&
					(n({ title: r.trim(), priority: o, status: l }),
					s(""),
					a("Medium"),
					c("Backlog"));
		};
	return f.jsx(qi, {
		open: e,
		onOpenChange: t,
		children: f.jsxs(Qi, {
			children: [
				f.jsxs(Zi, {
					children: [
						f.jsx(tl, { children: "New Task" }),
						f.jsx(nl, { children: "Add a task to this project." }),
					],
				}),
				f.jsxs("form", {
					onSubmit: u,
					className: "grid gap-4",
					children: [
						f.jsxs("div", {
							className: "grid gap-2",
							children: [
								f.jsx(gn, { htmlFor: "task-title", children: "Title" }),
								f.jsx(ds, {
									id: "task-title",
									placeholder: "What needs to be done?",
									value: r,
									onChange: (d) => s(d.target.value),
									autoFocus: !0,
								}),
							],
						}),
						f.jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [
								f.jsxs("div", {
									className: "grid gap-2",
									children: [
										f.jsx(gn, { children: "Priority" }),
										f.jsxs(sr, {
											value: o,
											onValueChange: a,
											children: [
												f.jsx(lr, {
													className: "w-full",
													children: f.jsx(ir, {}),
												}),
												f.jsx(ar, {
													children: fs.map((d) =>
														f.jsx(cr, { value: d, children: d }, d)
													),
												}),
											],
										}),
									],
								}),
								f.jsxs("div", {
									className: "grid gap-2",
									children: [
										f.jsx(gn, { children: "Status" }),
										f.jsxs(sr, {
											value: l,
											onValueChange: c,
											children: [
												f.jsx(lr, {
													className: "w-full",
													children: f.jsx(ir, {}),
												}),
												f.jsx(ar, {
													children: zt.map((d) =>
														f.jsx(cr, { value: d, children: d }, d)
													),
												}),
											],
										}),
									],
								}),
							],
						}),
						f.jsx(el, {
							children: f.jsx(mt, {
								type: "submit",
								disabled: !r.trim(),
								children: "Create Task",
							}),
						}),
					],
				}),
			],
		}),
	});
}
const Vl = { Open: "default", Completed: "secondary", "On Hold": "outline" };
function zl() {
	var h;
	const { id: e } = Ko(),
		[t, n] = i.useState(!1),
		{ data: r, isLoading: s } = qo("Hive Project", e != null ? e : "", e ? void 0 : null),
		{
			data: o,
			isLoading: a,
			mutate: l,
		} = Go(
			"Hive Task",
			{
				fields: [
					"name",
					"title",
					"project",
					"status",
					"priority",
					"assigned_to",
					"description",
					"creation",
					"modified",
				],
				filters: [["project", "=", e != null ? e : ""]],
				orderBy: { field: "modified", order: "desc" },
				limit: 200,
			},
			e ? void 0 : null
		),
		{ updateDoc: c } = Jo(),
		{ createDoc: u } = Qo(),
		d = (y, m) =>
			St(null, null, function* () {
				try {
					yield c("Hive Task", y, { status: m }), l();
				} catch (w) {
					an.error("Failed to update task status");
				}
			}),
		g = (y) =>
			St(null, null, function* () {
				try {
					yield u("Hive Task", I(v({}, y), { project: e })),
						l(),
						n(!1),
						an.success("Task created");
				} catch (m) {
					an.error("Failed to create task");
				}
			});
	if (s)
		return f.jsxs("div", {
			className: "space-y-6",
			children: [
				f.jsx(pt, { className: "h-8 w-48" }),
				f.jsx(pt, { className: "h-4 w-96" }),
				f.jsx("div", {
					className: "grid grid-cols-4 gap-4",
					children: Array.from({ length: 4 }).map((y, m) =>
						f.jsx(pt, { className: "h-64" }, m)
					),
				}),
			],
		});
	if (!r)
		return f.jsxs("div", {
			className: "flex flex-col items-center justify-center p-12 text-center",
			children: [
				f.jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Project not found.",
				}),
				f.jsx(mt, {
					variant: "link",
					render: f.jsx(zn, { to: "/projects" }),
					className: "mt-2",
					children: "Back to projects",
				}),
			],
		});
	const p = {};
	for (const y of zt) p[y] = [];
	if (o) for (const y of o) p[y.status] && p[y.status].push(y);
	return f.jsxs("div", {
		className: "space-y-6",
		children: [
			f.jsxs("div", {
				className: "flex items-start justify-between gap-4",
				children: [
					f.jsxs("div", {
						className: "flex items-start gap-3",
						children: [
							f.jsx(mt, {
								variant: "ghost",
								size: "icon-sm",
								render: f.jsx(zn, { to: "/projects" }),
								className: "mt-0.5",
								children: f.jsx(dt, { icon: Zo, strokeWidth: 2 }),
							}),
							f.jsxs("div", {
								children: [
									f.jsx("h1", {
										className: "text-2xl font-bold tracking-tight",
										children: r.title,
									}),
									f.jsxs("div", {
										className: "mt-1 flex items-center gap-2",
										children: [
											f.jsx(Ht, {
												variant:
													(h = Vl[r.status]) != null ? h : "outline",
												children: r.status,
											}),
											r.project_type &&
												f.jsx(Ht, {
													variant: "outline",
													children: r.project_type,
												}),
										],
									}),
								],
							}),
						],
					}),
					f.jsxs(mt, {
						onClick: () => n(!0),
						children: [
							f.jsx(dt, { icon: es, strokeWidth: 2, "data-icon": "inline-start" }),
							"Add Task",
						],
					}),
				],
			}),
			a
				? f.jsx("div", {
						className: "grid grid-cols-4 gap-4",
						children: Array.from({ length: 4 }).map((y, m) =>
							f.jsxs(
								"div",
								{
									className: "space-y-3",
									children: [
										f.jsx(pt, { className: "h-6 w-20" }),
										f.jsx(pt, { className: "h-24 w-full" }),
										f.jsx(pt, { className: "h-24 w-full" }),
									],
								},
								m
							)
						),
				  })
				: f.jsx(Yi, { tasksByStatus: p, onStatusChange: d }),
			f.jsx(Ll, { open: t, onOpenChange: n, onSubmit: g }),
		],
	});
}
export { zl as ProjectDetailPage };
