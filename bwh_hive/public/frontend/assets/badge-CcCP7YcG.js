var f = Object.defineProperty;
var n = Object.getOwnPropertySymbols;
var g = Object.prototype.hasOwnProperty,
	p = Object.prototype.propertyIsEnumerable;
var l = (e, r, t) =>
		r in e
			? f(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t })
			: (e[r] = t),
	s = (e, r) => {
		for (var t in r || (r = {})) g.call(r, t) && l(e, t, r[t]);
		if (n) for (var t of n(r)) p.call(r, t) && l(e, t, r[t]);
		return e;
	};
var d = (e, r) => {
	var t = {};
	for (var a in e) g.call(e, a) && r.indexOf(a) < 0 && (t[a] = e[a]);
	if (e != null && n) for (var a of n(e)) r.indexOf(a) < 0 && p.call(e, a) && (t[a] = e[a]);
	return t;
};
import { j as o, k as i, aB as m, O as v, aC as x } from "./index-BlZsnnOZ.js";
function j(t) {
	var a = t,
		{ className: e } = a,
		r = d(a, ["className"]);
	return o.jsx(
		"div",
		s({ "data-slot": "skeleton", className: i("bg-muted rounded-xl animate-pulse", e) }, r)
	);
}
function k(a) {
	var u = a,
		{ className: e, size: r = "default" } = u,
		t = d(u, ["className", "size"]);
	return o.jsx(
		"div",
		s(
			{
				"data-slot": "card",
				"data-size": r,
				className: i(
					"ring-foreground/10 bg-card text-card-foreground gap-6 overflow-hidden rounded-2xl py-6 text-sm ring-1 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl group/card flex flex-col",
					e
				),
			},
			t
		)
	);
}
function C(t) {
	var a = t,
		{ className: e } = a,
		r = d(a, ["className"]);
	return o.jsx(
		"div",
		s(
			{
				"data-slot": "card-header",
				className: i(
					"gap-2 rounded-t-xl px-6 group-data-[size=sm]/card:px-4 [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4 group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
					e
				),
			},
			r
		)
	);
}
function N(t) {
	var a = t,
		{ className: e } = a,
		r = d(a, ["className"]);
	return o.jsx(
		"div",
		s({ "data-slot": "card-title", className: i("text-base font-medium", e) }, r)
	);
}
function w(t) {
	var a = t,
		{ className: e } = a,
		r = d(a, ["className"]);
	return o.jsx(
		"div",
		s({ "data-slot": "card-description", className: i("text-muted-foreground text-sm", e) }, r)
	);
}
function z(t) {
	var a = t,
		{ className: e } = a,
		r = d(a, ["className"]);
	return o.jsx(
		"div",
		s(
			{
				"data-slot": "card-content",
				className: i("px-6 group-data-[size=sm]/card:px-4", e),
			},
			r
		)
	);
}
const b = x(
	"h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive overflow-hidden group/badge",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
				secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
				destructive:
					"bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20",
				outline:
					"border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground bg-input/30",
				ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
				link: "text-primary underline-offset-4 hover:underline",
			},
		},
		defaultVariants: { variant: "default" },
	}
);
function B(u) {
	var c = u,
		{ className: e, variant: r = "default", render: t } = c,
		a = d(c, ["className", "variant", "render"]);
	return m({
		defaultTagName: "span",
		props: v({ className: i(b({ variant: r }), e) }, a),
		render: t,
		state: { slot: "badge", variant: r },
	});
}
export { B, k as C, j as S, C as a, z as b, N as c, w as d };
