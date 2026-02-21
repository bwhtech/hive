import { F as o, j as e, H as m, P as x, L as h } from "./index-BlZsnnOZ.js";
import { C as i, a as d, S as r, b as l, c as j, d as u, B as n } from "./badge-CcCP7YcG.js";
const g = { Open: "default", Completed: "secondary", "On Hold": "outline" };
function N() {
	const { data: t, isLoading: c } = o("Hive Project", {
		fields: ["name", "title", "status", "project_type", "description", "creation", "modified"],
		orderBy: { field: "modified", order: "desc" },
		limit: 100,
	});
	return e.jsxs("div", {
		className: "space-y-6",
		children: [
			e.jsxs("div", {
				children: [
					e.jsx("h1", {
						className: "text-2xl font-bold tracking-tight",
						children: "Projects",
					}),
					e.jsx("p", {
						className: "mt-1 text-muted-foreground",
						children: "Manage your projects.",
					}),
				],
			}),
			c
				? e.jsx("div", {
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: Array.from({ length: 3 }).map((s, a) =>
							e.jsxs(
								i,
								{
									children: [
										e.jsxs(d, {
											children: [
												e.jsx(r, { className: "h-5 w-3/4" }),
												e.jsx(r, { className: "h-4 w-1/2" }),
											],
										}),
										e.jsx(l, {
											children: e.jsx(r, { className: "h-4 w-full" }),
										}),
									],
								},
								a
							)
						),
				  })
				: t != null && t.length
				? e.jsx("div", {
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: t.map((s) => {
							var a;
							return e.jsx(
								h,
								{
									to: `/projects/${s.name}`,
									className: "block",
									children: e.jsxs(i, {
										className: "transition-shadow hover:shadow-md",
										children: [
											e.jsxs(d, {
												children: [
													e.jsx(j, { children: s.title }),
													e.jsxs(u, {
														className: "flex items-center gap-2",
														children: [
															e.jsx(n, {
																variant:
																	(a = g[s.status]) != null
																		? a
																		: "outline",
																children: s.status,
															}),
															s.project_type &&
																e.jsx(n, {
																	variant: "outline",
																	children: s.project_type,
																}),
														],
													}),
												],
											}),
											s.description &&
												e.jsx(l, {
													children: e.jsx("p", {
														className:
															"line-clamp-2 text-sm text-muted-foreground",
														dangerouslySetInnerHTML: {
															__html: s.description,
														},
													}),
												}),
										],
									}),
								},
								s.name
							);
						}),
				  })
				: e.jsxs("div", {
						className:
							"flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center",
						children: [
							e.jsx(m, {
								icon: x,
								strokeWidth: 1.5,
								className: "size-10 text-muted-foreground",
							}),
							e.jsx("p", {
								className: "mt-3 text-sm font-medium",
								children: "No projects yet",
							}),
							e.jsx("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Projects will appear here once created.",
							}),
						],
				  }),
		],
	});
}
export { N as ProjectsPage };
