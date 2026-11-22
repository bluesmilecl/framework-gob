/*! gob-cl-tailwind/react · MIT */

// src/react/Icon.jsx
import { jsx } from "react/jsx-runtime";
function Icon({ name, className = "", ...rest }) {
  return /* @__PURE__ */ jsx("i", { className: `cl cl-${name} ${className}`, "aria-hidden": "true", ...rest });
}

// src/react/layout/AppShell.jsx
import { createContext, useCallback as useCallback3, useContext, useEffect as useEffect3, useMemo, useState as useState2 } from "react";

// src/react/nav/DropdownMenu.jsx
import { useCallback, useEffect as useEffect2, useId, useRef, useState } from "react";

// src/react/hooks/useDismiss.js
import { useEffect } from "react";
function useDismiss(open, ref, close) {
  useEffect(() => {
    if (!open) return void 0;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open, ref, close]);
}

// src/react/nav/DropdownMenu.jsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function DropdownMenu({ trigger, items, align = "right", side = "bottom", label = "Men\xFA", width, className = "" }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const menu = useRef(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, wrap, close);
  const focusables = () => Array.from(menu.current?.querySelectorAll('[role^="menuitem"]:not([aria-disabled="true"])') ?? []);
  useEffect2(() => {
    if (open) requestAnimationFrame(() => focusables()[0]?.focus());
  }, [open]);
  const onKey = (e) => {
    const f = focusables();
    const i = f.indexOf(document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      f[(i + 1) % f.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      f[(i - 1 + f.length) % f.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      f[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      f[f.length - 1]?.focus();
    } else if (e.key === "Tab") close();
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      const hit = f.find((n) => n.textContent.trim().toLowerCase().startsWith(e.key.toLowerCase()));
      hit?.focus();
    }
  };
  const select = (it) => {
    close();
    wrap.current?.querySelector("[aria-haspopup]")?.focus();
    it.onSelect?.();
  };
  const props = { "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": open ? id : void 0, onClick: () => setOpen((v) => !v) };
  return /* @__PURE__ */ jsxs("div", { className: `app-menu-wrap ${className}`, ref: wrap, children: [
    typeof trigger === "function" ? trigger(props) : /* @__PURE__ */ jsx2("button", { type: "button", className: "app-iconbtn", "aria-label": label, ...props, children: trigger ?? /* @__PURE__ */ jsx2(Icon, { name: "ellipsis-vertical" }) }),
    open && /* @__PURE__ */ jsx2("div", { id, ref: menu, className: "app-menu", role: "menu", "aria-label": label, style: { [align === "left" ? "left" : "right"]: 0, width, ...side === "top" ? { top: "auto", bottom: "calc(100% + 6px)" } : null }, onKeyDown: onKey, children: items.map((it, k) => {
      if (it.separator) return /* @__PURE__ */ jsx2("hr", {}, k);
      if (it.header) return /* @__PURE__ */ jsx2("div", { className: "app-menu-head", children: it.header }, k);
      const common = { role: it.checked !== void 0 ? "menuitemcheckbox" : "menuitem", "aria-checked": it.checked, "aria-disabled": it.disabled || void 0, tabIndex: -1, className: it.danger ? "is-danger" : "" };
      return it.href && !it.disabled ? /* @__PURE__ */ jsxs("a", { href: it.href, ...common, onClick: close, children: [
        it.icon && /* @__PURE__ */ jsx2(Icon, { name: it.icon }),
        it.label
      ] }, k) : /* @__PURE__ */ jsxs("button", { type: "button", ...common, disabled: it.disabled, onClick: () => select(it), children: [
        it.icon && /* @__PURE__ */ jsx2(Icon, { name: it.icon }),
        it.label,
        it.checked && /* @__PURE__ */ jsx2(Icon, { name: "check", style: { marginLeft: "auto" } })
      ] }, k);
    }) })
  ] });
}

// src/react/data/bits.jsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var TONES = { ok: "is-ok", off: "is-off", warn: "is-warn", danger: "is-danger", info: "" };
function StatusBadge({ tone = "info", children }) {
  return /* @__PURE__ */ jsx3("span", { className: `app-status ${TONES[tone] ?? ""}`, children });
}
function Avatar({ name = "", src, size = "md", alt = false }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";
  return src ? /* @__PURE__ */ jsx3("img", { className: `app-avatar ${size === "lg" ? "is-lg" : size === "sm" ? "is-sm" : ""}`, src, alt: name, style: { objectFit: "cover" } }) : /* @__PURE__ */ jsx3("span", { className: `app-avatar ${size === "lg" ? "is-lg" : size === "sm" ? "is-sm" : ""} ${alt ? "is-alt" : ""}`, "aria-hidden": "true", children: initials });
}
function EmptyState({ icon = "inbox", title, children, action }) {
  return /* @__PURE__ */ jsxs2("div", { className: "app-empty", children: [
    /* @__PURE__ */ jsx3(Icon, { name: icon }),
    /* @__PURE__ */ jsx3("h3", { children: title }),
    children && /* @__PURE__ */ jsx3("p", { children }),
    action
  ] });
}
function Skeleton({ width = "100%", height }) {
  return /* @__PURE__ */ jsx3("span", { className: "app-skeleton", style: { width, height }, "aria-hidden": "true" });
}

// src/react/hooks/useAccessibility.js
import { useCallback as useCallback2, useSyncExternalStore } from "react";
var KEY = "gob.cl:toolbar";
var SIZES = ["16px", "20px", "24px"];
var read = (k) => {
  try {
    return localStorage.getItem(`${KEY}.${k}`);
  } catch {
    return null;
  }
};
var write = (k, v) => {
  try {
    v == null ? localStorage.removeItem(`${KEY}.${k}`) : localStorage.setItem(`${KEY}.${k}`, v);
  } catch {
  }
};
var state = { contrast: read("contrast") === "active", font: Math.min(Math.max(parseInt(read("index") ?? "0", 10) || 0, 0), 2) };
var listeners = /* @__PURE__ */ new Set();
var apply = () => {
  if (typeof document === "undefined") return;
  const h = document.documentElement;
  h.classList.toggle("a11y-contrast", state.contrast);
  h.classList.remove("a11y-font-0", "a11y-font-1", "a11y-font-2");
  h.classList.add(`a11y-font-${state.font}`);
  h.style.fontSize = SIZES[state.font];
};
var set = (patch) => {
  state = { ...state, ...patch };
  apply();
  listeners.forEach((l) => l());
};
var subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
apply();
function useAccessibility() {
  const s = useSyncExternalStore(subscribe, () => state, () => state);
  const toggleContrast = useCallback2(() => {
    write("contrast", state.contrast ? null : "active");
    set({ contrast: !state.contrast });
  }, []);
  const setFont = useCallback2((i) => {
    const n = Math.min(Math.max(i, 0), 2);
    write("index", String(n));
    set({ font: n });
  }, []);
  return { contrast: s.contrast, font: s.font, toggleContrast, setFont, maxFont: 2 };
}

// src/react/layout/AppShell.jsx
import { Fragment, jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var DEFAULTS = { sidebar: "expanded", navbar: "light", density: "comfortable", container: "fixed" };
var Ctx = createContext(null);
var useShell = () => useContext(Ctx);
var defaultLink = ({ item, className, children, onClick }) => /* @__PURE__ */ jsx4("a", { href: item.href || "#", className, title: item.label, onClick, "aria-current": item.active ? "page" : void 0, children });
function Sidebar({ brand, nav, user, onUser, renderLink }) {
  const { setMobileOpen } = useShell();
  return /* @__PURE__ */ jsxs3("aside", { className: "app-sidebar", "aria-label": "Navegaci\xF3n principal", children: [
    /* @__PURE__ */ jsxs3("div", { className: "app-sidebar-head", children: [
      /* @__PURE__ */ jsxs3("a", { className: "app-brand", href: brand.href || "#", onClick: () => setMobileOpen(false), children: [
        /* @__PURE__ */ jsx4("img", { src: brand.logo || "/img/gob-footer.svg", alt: "Gobierno de Chile" }),
        /* @__PURE__ */ jsxs3("span", { className: "app-brand-name", children: [
          brand.name,
          brand.subtitle && /* @__PURE__ */ jsx4("small", { children: brand.subtitle })
        ] })
      ] }),
      /* @__PURE__ */ jsx4("div", { className: "line" })
    ] }),
    /* @__PURE__ */ jsx4("nav", { className: "app-nav", children: nav.map((g) => /* @__PURE__ */ jsxs3("section", { children: [
      g.group && /* @__PURE__ */ jsx4("h2", { className: "app-nav-title", children: g.group }),
      /* @__PURE__ */ jsx4("ul", { children: g.items.map((it) => /* @__PURE__ */ jsx4("li", { children: (renderLink || defaultLink)({
        item: it,
        className: `app-nav-link ${it.active ? "is-active" : ""}`,
        onClick: () => setMobileOpen(false),
        children: /* @__PURE__ */ jsxs3(Fragment, { children: [
          /* @__PURE__ */ jsx4(Icon, { name: it.icon }),
          /* @__PURE__ */ jsx4("span", { children: it.label }),
          it.badge != null && /* @__PURE__ */ jsx4("span", { className: "app-nav-badge", children: it.badge })
        ] })
      }) }, it.label)) })
    ] }, g.group)) }),
    user && /* @__PURE__ */ jsx4("div", { className: "app-sidebar-foot", children: /* @__PURE__ */ jsxs3("button", { type: "button", className: "app-usercard", onClick: onUser, title: "Mi cuenta", children: [
      /* @__PURE__ */ jsx4(Avatar, { name: user.name }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx4("strong", { children: user.name }),
        /* @__PURE__ */ jsx4("small", { children: user.role })
      ] })
    ] }) })
  ] });
}
function AppShell({ brand, nav, user, userMenu, actions, breadcrumbs, onSearch, onUser, renderLink, footer, storageKey = "gob-shell", accessibilityTools = true, children }) {
  const a11y = useAccessibility();
  const [prefs, setPrefsState] = useState2(() => {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(storageKey) || "{}") };
    } catch {
      return DEFAULTS;
    }
  });
  const [mobileOpen, setMobileOpen] = useState2(false);
  useEffect3(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(prefs));
    } catch {
    }
  }, [prefs, storageKey]);
  const setPrefs = useCallback3((p) => setPrefsState((x) => ({ ...x, ...p })), []);
  const toggleSide = useCallback3(() => {
    if (window.matchMedia("(min-width: 992px)").matches) setPrefs({ sidebar: prefs.sidebar === "expanded" ? "rail" : "expanded" });
    else setMobileOpen((v) => !v);
  }, [prefs.sidebar, setPrefs]);
  useEffect3(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSide();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSide]);
  const value = useMemo(() => ({ prefs, setPrefs, reset: () => setPrefsState(DEFAULTS), mobileOpen, setMobileOpen, a11y }), [prefs, setPrefs, mobileOpen, a11y]);
  const cls2 = `app-shell ${prefs.sidebar === "rail" ? "is-rail" : ""} ${prefs.sidebar === "hidden" ? "is-hidden-side" : ""} ${mobileOpen ? "is-mobile-open" : ""} ${prefs.density === "compact" ? "is-compact" : ""}`;
  return /* @__PURE__ */ jsx4(Ctx.Provider, { value, children: /* @__PURE__ */ jsxs3("div", { className: cls2, children: [
    /* @__PURE__ */ jsx4("a", { className: "skip-link", href: "#contenido", children: "Saltar al contenido" }),
    /* @__PURE__ */ jsx4(Sidebar, { brand, nav, user, onUser, renderLink }),
    /* @__PURE__ */ jsx4("div", { className: "app-scrim", onClick: () => setMobileOpen(false), "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs3("header", { className: `app-navbar ${prefs.navbar === "dark" ? "is-dark" : ""}`, children: [
      /* @__PURE__ */ jsx4("button", { type: "button", className: "app-iconbtn", "aria-label": "Mostrar u ocultar men\xFA lateral", title: "Men\xFA lateral (Ctrl+B)", onClick: toggleSide, children: /* @__PURE__ */ jsx4(Icon, { name: "menu" }) }),
      breadcrumbs,
      /* @__PURE__ */ jsx4("span", { className: "spacer" }),
      onSearch && /* @__PURE__ */ jsx4("div", { className: "app-search", children: /* @__PURE__ */ jsxs3("button", { type: "button", onClick: onSearch, children: [
        /* @__PURE__ */ jsx4(Icon, { name: "search" }),
        "Buscar o ir a\u2026 ",
        /* @__PURE__ */ jsx4("kbd", { children: "Ctrl K" })
      ] }) }),
      accessibilityTools && /* @__PURE__ */ jsxs3(Fragment, { children: [
        /* @__PURE__ */ jsx4("button", { type: "button", className: "app-iconbtn app-hide-sm", "aria-label": "Alto contraste", "aria-pressed": a11y.contrast, title: "Alto contraste", onClick: a11y.toggleContrast, children: /* @__PURE__ */ jsx4(Icon, { name: "contrast" }) }),
        /* @__PURE__ */ jsx4("button", { type: "button", className: "app-iconbtn app-hide-sm", "aria-label": "Cambiar tama\xF1o de texto", title: `Tama\xF1o de texto (${["normal", "grande", "muy grande"][a11y.font]})`, onClick: () => a11y.setFont((a11y.font + 1) % 3), children: /* @__PURE__ */ jsx4(Icon, { name: "increase-text" }) })
      ] }),
      actions,
      userMenu && /* @__PURE__ */ jsx4(DropdownMenu, { label: "Cuenta", items: userMenu, trigger: (p) => /* @__PURE__ */ jsx4("button", { type: "button", className: "app-iconbtn", "aria-label": "Cuenta", ...p, children: /* @__PURE__ */ jsx4(Icon, { name: "circle-user" }) }) })
    ] }),
    /* @__PURE__ */ jsxs3("main", { className: "app-main", id: "contenido", tabIndex: -1, children: [
      children,
      footer
    ] })
  ] }) });
}
var markActive = (nav, isActive) => nav.map((g) => ({ ...g, items: g.items.map((i) => ({ ...i, active: isActive(i) })) }));

// src/react/nav/nav.jsx
import { useRef as useRef2 } from "react";
import { Fragment as Fragment2, jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function Tabs({ tabs, value, onChange, label = "Secciones", children }) {
  const list = useRef2(null);
  const onKey = (e) => {
    const i = tabs.findIndex((t) => t.id === value);
    const go = (n) => {
      const t = tabs[(n + tabs.length) % tabs.length];
      onChange(t.id);
      requestAnimationFrame(() => list.current?.querySelector(`#tab-${t.id}`)?.focus());
    };
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(i + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(tabs.length - 1);
    }
  };
  return /* @__PURE__ */ jsxs4(Fragment2, { children: [
    /* @__PURE__ */ jsx5("div", { className: "app-tabs", role: "tablist", "aria-label": label, ref: list, onKeyDown: onKey, children: tabs.map((t) => /* @__PURE__ */ jsxs4("button", { id: `tab-${t.id}`, type: "button", role: "tab", "aria-selected": t.id === value, "aria-controls": `panel-${t.id}`, tabIndex: t.id === value ? 0 : -1, className: t.id === value ? "is-active" : "", onClick: () => onChange(t.id), children: [
      t.icon && /* @__PURE__ */ jsx5(Icon, { name: t.icon }),
      t.label,
      t.badge != null && /* @__PURE__ */ jsx5("span", { className: "app-nav-badge", children: t.badge })
    ] }, t.id)) }),
    children && /* @__PURE__ */ jsx5("div", { role: "tabpanel", id: `panel-${value}`, "aria-labelledby": `tab-${value}`, tabIndex: 0, className: "app-tabpanel", children })
  ] });
}
function Stepper({ steps, current, onStepClick }) {
  return /* @__PURE__ */ jsx5("ol", { className: "app-stepper", "aria-label": "Progreso", children: steps.map((s, i) => {
    const state2 = i < current ? "done" : i === current ? "current" : "todo";
    const label = typeof s === "string" ? s : s.label;
    return /* @__PURE__ */ jsx5("li", { className: `is-${state2}`, "aria-current": state2 === "current" ? "step" : void 0, children: /* @__PURE__ */ jsxs4("button", { type: "button", disabled: !onStepClick || i > current, onClick: () => onStepClick?.(i), children: [
      /* @__PURE__ */ jsx5("span", { className: "app-step-dot", children: state2 === "done" ? /* @__PURE__ */ jsx5(Icon, { name: "check" }) : i + 1 }),
      /* @__PURE__ */ jsx5("span", { className: "app-step-label", children: label })
    ] }) }, label);
  }) });
}
function Breadcrumbs({ items, as: LinkAs = "a" }) {
  return /* @__PURE__ */ jsx5("nav", { "aria-label": "Ruta de navegaci\xF3n", children: /* @__PURE__ */ jsx5("ol", { className: "breadcrumb", children: items.map((it, i) => i === items.length - 1 ? /* @__PURE__ */ jsx5("li", { className: "breadcrumb-item active", "aria-current": "page", children: it.label }, i) : /* @__PURE__ */ jsx5("li", { className: "breadcrumb-item", children: LinkAs === "a" ? /* @__PURE__ */ jsx5("a", { href: it.href || "#", children: it.label }) : /* @__PURE__ */ jsx5(LinkAs, { to: it.to, children: it.label }) }, i)) }) });
}

// src/react/layout/layout.jsx
import { Fragment as Fragment3, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
function Container({ size = "fixed", as: Tag = "div", className = "", ...rest }) {
  return /* @__PURE__ */ jsx6(Tag, { className: `app-container ${size === "fixed" ? "" : `is-${size}`} ${className}`, ...rest });
}
function PageHeader({ title, description, actions, breadcrumbs, breadcrumbAs }) {
  return /* @__PURE__ */ jsxs5(Fragment3, { children: [
    breadcrumbs && /* @__PURE__ */ jsx6(Breadcrumbs, { items: breadcrumbs, as: breadcrumbAs }),
    /* @__PURE__ */ jsxs5("div", { className: "app-page-head", children: [
      /* @__PURE__ */ jsxs5("div", { children: [
        /* @__PURE__ */ jsx6("h1", { children: title }),
        description && /* @__PURE__ */ jsx6("p", { children: description })
      ] }),
      actions && /* @__PURE__ */ jsx6("div", { className: "app-page-actions", children: actions })
    ] })
  ] });
}
function Panel({ title, actions, footer, flush = false, danger = false, children, className = "", id }) {
  return /* @__PURE__ */ jsxs5("section", { id, className: `app-panel ${danger ? "app-danger-zone" : ""} ${className}`, children: [
    (title || actions) && /* @__PURE__ */ jsxs5("div", { className: "app-panel-head", children: [
      /* @__PURE__ */ jsx6("h2", { children: title }),
      actions && /* @__PURE__ */ jsx6("div", { className: "app-page-actions", children: actions })
    ] }),
    /* @__PURE__ */ jsx6("div", { className: flush ? "" : "app-panel-body", children }),
    footer && /* @__PURE__ */ jsx6("div", { className: "app-panel-foot", children: footer })
  ] });
}
function StatCard({ label, value, delta, down = false, icon }) {
  return /* @__PURE__ */ jsxs5("div", { className: "app-stat", children: [
    /* @__PURE__ */ jsxs5("p", { className: "app-stat-label", children: [
      icon && /* @__PURE__ */ jsx6(Icon, { name: icon }),
      label
    ] }),
    /* @__PURE__ */ jsx6("p", { className: "app-stat-value", children: value }),
    delta && /* @__PURE__ */ jsx6("p", { className: `app-stat-delta ${down ? "is-down" : ""}`, children: delta })
  ] });
}

// src/react/layout/Footer.jsx
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
function Footer({ logo = "/img/gob-footer.svg", description, columns = [], social = [], legal, className = "" }) {
  return /* @__PURE__ */ jsx7("footer", { className: `content-always-on-display ${className}`, style: { minHeight: 0, padding: "36px 0 56px" }, children: /* @__PURE__ */ jsxs6("div", { className: "container", children: [
    /* @__PURE__ */ jsx7("div", { className: "line" }),
    /* @__PURE__ */ jsxs6("div", { className: "row", children: [
      /* @__PURE__ */ jsxs6("div", { className: "col-md-3 mb-4", children: [
        /* @__PURE__ */ jsx7("img", { src: logo, alt: "Gobierno de Chile", style: { maxWidth: 170, marginBottom: "1rem" } }),
        description && /* @__PURE__ */ jsx7("p", { children: description })
      ] }),
      columns.map((c) => /* @__PURE__ */ jsxs6("div", { className: "col-md-3", children: [
        /* @__PURE__ */ jsx7("div", { className: "text-uppercase mb-3", children: c.title }),
        c.links.map((l) => /* @__PURE__ */ jsx7("a", { href: l.href || "#", children: l.label }, l.label))
      ] }, c.title))
    ] }),
    (social.length > 0 || legal) && /* @__PURE__ */ jsxs6("div", { className: "mt-4 pt-3", style: { borderTop: "1px solid rgb(255 255 255 / 0.18)", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }, children: [
      /* @__PURE__ */ jsx7("small", { style: { color: "#fff", lineHeight: 1.4 }, children: legal }),
      /* @__PURE__ */ jsx7("ul", { className: "footer-social", style: { margin: 0 }, children: social.map((s) => /* @__PURE__ */ jsx7("li", { children: /* @__PURE__ */ jsx7("a", { href: s.href || "#", "aria-label": s.label, children: /* @__PURE__ */ jsx7(Icon, { name: s.icon }) }) }, s.label)) })
    ] })
  ] }) });
}
function AppFooter({ children, links = [] }) {
  return (
    // <div> y no <footer>: el core de gob.cl da estilo de footer institucional (azul, 300 px) a ese elemento
    /* @__PURE__ */ jsxs6("div", { className: "app-footer", role: "contentinfo", children: [
      /* @__PURE__ */ jsx7("span", { children }),
      /* @__PURE__ */ jsx7("nav", { "aria-label": "Enlaces legales", children: links.map((l) => /* @__PURE__ */ jsx7("a", { href: l.href || "#", children: l.label }, l.label)) })
    ] })
  );
}

// src/react/layout/SiteNavbar.jsx
import { useState as useState3 } from "react";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
function SiteNavbar({ logo = "/img/gob-header.svg", brandHref = "#", links = [], actions, dark = false, sticky = true }) {
  const [open, setOpen] = useState3(false);
  return /* @__PURE__ */ jsx8("nav", { className: `navbar ${dark ? "navbar-dark" : "navbar-light"} navbar-expand-lg ${sticky ? "sticky-top" : ""}`, "aria-label": "Principal", children: /* @__PURE__ */ jsxs7("div", { className: "container", children: [
    /* @__PURE__ */ jsx8("a", { className: "navbar-brand", href: brandHref, children: /* @__PURE__ */ jsx8("img", { src: logo, alt: "Gobierno de Chile" }) }),
    /* @__PURE__ */ jsx8("button", { type: "button", className: `navbar-toggler ${open ? "" : "collapsed"}`, "aria-expanded": open, "aria-controls": "site-nav", "aria-label": "Abrir men\xFA", onClick: () => setOpen((v) => !v), children: /* @__PURE__ */ jsx8(Icon, { name: open ? "x" : "burger", style: { fontSize: "1.5rem" } }) }),
    /* @__PURE__ */ jsx8("div", { className: `navbar-collapse collapse ${open ? "show" : ""}`, id: "site-nav", children: /* @__PURE__ */ jsxs7("ul", { className: "navbar-nav ml-auto", children: [
      links.map((l) => /* @__PURE__ */ jsx8("li", { className: "nav-item", children: /* @__PURE__ */ jsx8("a", { className: "nav-link", href: l.href, "aria-current": l.active ? "page" : void 0, style: l.active ? { textDecoration: "underline", fontWeight: 700 } : void 0, children: l.label }) }, l.label)),
      actions && /* @__PURE__ */ jsx8("li", { className: "nav-item d-flex align-items-center", style: { gap: "0.5rem", padding: "0.5rem 0.9rem" }, children: actions })
    ] }) })
  ] }) });
}

// src/react/forms/Field.jsx
import { useId as useId2 } from "react";
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
function Field({ id, label, hint, error, required, children, className = "" }) {
  return /* @__PURE__ */ jsxs8("div", { className: `app-field ${className}`, children: [
    label && /* @__PURE__ */ jsxs8("label", { htmlFor: id, children: [
      label,
      required && /* @__PURE__ */ jsx9("span", { className: "req", "aria-hidden": "true", children: " *" })
    ] }),
    children,
    error ? /* @__PURE__ */ jsx9("div", { className: "invalid-feedback d-block", id: `${id}-err`, role: "alert", children: error }) : hint ? /* @__PURE__ */ jsx9("span", { className: "hint", id: `${id}-hint`, children: hint }) : null
  ] });
}
var fieldProps = (id, error, hint) => ({
  id,
  "aria-invalid": error ? "true" : void 0,
  "aria-describedby": error ? `${id}-err` : hint ? `${id}-hint` : void 0
});
var useFieldId = (id) => {
  const auto = useId2();
  return id || auto;
};

// src/react/forms/inputs.jsx
import { useState as useState4 } from "react";

// src/react/forms/validators.js
var cleanRun = (run) => String(run).replace(/[^0-9kK]/g, "").toUpperCase();
var runDv = (body) => {
  let sum = 0, factor = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const r = 11 - sum % 11;
  return r === 11 ? "0" : r === 10 ? "K" : String(r);
};
var validRun = (run) => {
  const c = cleanRun(run);
  return c.length >= 8 && c.length <= 9 && runDv(c.slice(0, -1)) === c.slice(-1);
};
var formatRun = (run) => {
  const c = cleanRun(run);
  if (c.length < 2) return c;
  return `${c.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${c.slice(-1)}`;
};
var validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
var validPhone = (p) => !p || /^\+?[0-9\s]{8,15}$/.test(p);
var passwordChecks = (p = "") => [
  { id: "len", label: "Al menos 8 caracteres", ok: p.length >= 8 },
  { id: "case", label: "May\xFAsculas y min\xFAsculas", ok: /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { id: "num", label: "Al menos un n\xFAmero", ok: /\d/.test(p) },
  { id: "sym", label: "Al menos un s\xEDmbolo", ok: /[^A-Za-z0-9]/.test(p) }
];
var passwordScore = (p = "") => p ? passwordChecks(p).filter((c) => c.ok).length : 0;
var STRENGTH_LABELS = ["", "Muy d\xE9bil", "D\xE9bil", "Aceptable", "Fuerte"];

// src/react/forms/inputs.jsx
import { Fragment as Fragment4, jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
var cls = (error, extra = "") => `form-control ${error ? "is-invalid" : ""} ${extra}`;
function TextField({ label, hint, error, required, id, className = "", fieldClass = "", ...input }) {
  const fid = useFieldId(id);
  return /* @__PURE__ */ jsx10(Field, { id: fid, label, hint, error, required, className: fieldClass, children: /* @__PURE__ */ jsx10("input", { className: cls(error, className), required: false, ...fieldProps(fid, error, hint), ...input }) });
}
function TextareaField({ label, hint, error, required, id, maxLength, value = "", className = "", fieldClass = "", rows = 4, ...rest }) {
  const fid = useFieldId(id);
  return /* @__PURE__ */ jsxs9(Field, { id: fid, label, hint, error, required, className: fieldClass, children: [
    /* @__PURE__ */ jsx10("textarea", { className: cls(error, className), rows, maxLength, value, ...fieldProps(fid, error, hint), ...rest }),
    maxLength && /* @__PURE__ */ jsxs9("span", { className: "hint", style: { textAlign: "right" }, children: [
      String(value).length,
      "/",
      maxLength
    ] })
  ] });
}
function SelectField({ label, hint, error, required, id, options = [], placeholder, className = "", fieldClass = "", ...rest }) {
  const fid = useFieldId(id);
  return /* @__PURE__ */ jsx10(Field, { id: fid, label, hint, error, required, className: fieldClass, children: /* @__PURE__ */ jsxs9("select", { className: cls(error, className), ...fieldProps(fid, error, hint), ...rest, children: [
    placeholder !== void 0 && /* @__PURE__ */ jsx10("option", { value: "", children: placeholder }),
    options.map((o) => {
      const v = typeof o === "string" ? { value: o, label: o } : o;
      return /* @__PURE__ */ jsx10("option", { value: v.value, children: v.label }, v.value);
    })
  ] }) });
}
function DateField(props) {
  return /* @__PURE__ */ jsx10(TextField, { type: "date", ...props });
}
function RunField({ label = "RUN", onChange, onBlur, value = "", hint = "Ej: 12.345.678-5", ...rest }) {
  return /* @__PURE__ */ jsx10(
    TextField,
    {
      label,
      value,
      autoComplete: "off",
      placeholder: "12.345.678-5",
      hint,
      onChange: (e) => onChange?.({ target: { type: "text", value: e.target.value.replace(/[^0-9kK.\-]/g, "") } }),
      onBlur: (e) => {
        onChange?.({ target: { type: "text", value: formatRun(e.target.value) } });
        onBlur?.(e);
      },
      ...rest
    }
  );
}
function PasswordField({ label = "Clave", hint, error, required, id, strength = false, value = "", className = "", fieldClass = "", ...rest }) {
  const fid = useFieldId(id);
  const [show, setShow] = useState4(false);
  const score = passwordScore(value);
  return /* @__PURE__ */ jsxs9(Field, { id: fid, label, hint, error, required, className: fieldClass, children: [
    /* @__PURE__ */ jsxs9("div", { style: { position: "relative" }, children: [
      /* @__PURE__ */ jsx10("input", { className: cls(error, className), type: show ? "text" : "password", value, autoComplete: "current-password", style: { paddingRight: "3rem" }, ...fieldProps(fid, error, hint), ...rest }),
      /* @__PURE__ */ jsx10("button", { type: "button", className: "app-iconbtn", style: { position: "absolute", top: 0, right: 0, height: "100%" }, "aria-label": show ? "Ocultar clave" : "Mostrar clave", "aria-pressed": show, onClick: () => setShow((v) => !v), children: /* @__PURE__ */ jsx10(Icon, { name: show ? "eye-off" : "eye" }) })
    ] }),
    strength && value && /* @__PURE__ */ jsxs9(Fragment4, { children: [
      /* @__PURE__ */ jsxs9("div", { className: `app-strength s${score}`, "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx10("i", {}),
        /* @__PURE__ */ jsx10("i", {}),
        /* @__PURE__ */ jsx10("i", {}),
        /* @__PURE__ */ jsx10("i", {})
      ] }),
      /* @__PURE__ */ jsxs9("span", { className: "hint", "aria-live": "polite", children: [
        "Fortaleza: ",
        /* @__PURE__ */ jsx10("strong", { children: STRENGTH_LABELS[score] })
      ] }),
      /* @__PURE__ */ jsx10("ul", { className: "app-checklist", children: passwordChecks(value).map((c) => /* @__PURE__ */ jsxs9("li", { className: c.ok ? "ok" : "", children: [
        /* @__PURE__ */ jsx10(Icon, { name: c.ok ? "circle-check" : "circle" }),
        c.label
      ] }, c.id)) })
    ] })
  ] });
}
function CheckboxField({ label, hint, error, id, className = "", ...rest }) {
  const fid = useFieldId(id);
  return /* @__PURE__ */ jsxs9("div", { className: `app-field ${className}`, children: [
    /* @__PURE__ */ jsxs9("div", { className: "custom-control custom-checkbox", children: [
      /* @__PURE__ */ jsx10("input", { type: "checkbox", className: "custom-control-input", ...fieldProps(fid, error, hint), ...rest }),
      /* @__PURE__ */ jsx10("label", { className: "custom-control-label", htmlFor: fid, children: label })
    ] }),
    error && /* @__PURE__ */ jsx10("div", { className: "invalid-feedback d-block", id: `${fid}-err`, role: "alert", children: error })
  ] });
}
function Switch({ label, description, id, checked, onChange, disabled, ...rest }) {
  const fid = useFieldId(id);
  return /* @__PURE__ */ jsxs9("div", { className: "app-switch-row", children: [
    /* @__PURE__ */ jsxs9("div", { children: [
      /* @__PURE__ */ jsx10("strong", { id: `${fid}-l`, children: label }),
      description && /* @__PURE__ */ jsx10("small", { children: description })
    ] }),
    /* @__PURE__ */ jsxs9("label", { className: "app-switch", children: [
      /* @__PURE__ */ jsx10("input", { type: "checkbox", role: "switch", id: fid, "aria-labelledby": `${fid}-l`, checked: Boolean(checked), disabled, onChange, ...rest }),
      /* @__PURE__ */ jsx10("i", {})
    ] })
  ] });
}
function RadioGroup({ label, name, options, value, onChange, cards = false, error, hint }) {
  const gid = useFieldId();
  return /* @__PURE__ */ jsxs9("fieldset", { className: "app-field", style: { border: 0, padding: 0 }, children: [
    label && /* @__PURE__ */ jsx10("legend", { className: "label", style: { fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.35rem" }, children: label }),
    /* @__PURE__ */ jsx10("div", { className: cards ? "app-radio-cards" : "", children: options.map((o) => cards ? /* @__PURE__ */ jsxs9("label", { className: "app-radio-card", children: [
      /* @__PURE__ */ jsx10("input", { type: "radio", name, value: o.value, checked: value === o.value, onChange }),
      /* @__PURE__ */ jsxs9("strong", { children: [
        o.icon && /* @__PURE__ */ jsx10(Icon, { name: o.icon }),
        o.label
      ] }),
      o.description && /* @__PURE__ */ jsx10("small", { children: o.description })
    ] }, o.value) : /* @__PURE__ */ jsxs9("div", { className: "custom-control custom-radio", children: [
      /* @__PURE__ */ jsx10("input", { type: "radio", id: `${gid}-${o.value}`, className: "custom-control-input", name, value: o.value, checked: value === o.value, onChange }),
      /* @__PURE__ */ jsx10("label", { className: "custom-control-label", htmlFor: `${gid}-${o.value}`, children: o.label })
    ] }, o.value)) }),
    error ? /* @__PURE__ */ jsx10("div", { className: "invalid-feedback d-block", role: "alert", children: error }) : hint ? /* @__PURE__ */ jsx10("span", { className: "hint", children: hint }) : null
  ] });
}
function SearchInput({ value, onChange, placeholder = "Buscar\u2026", label = "Buscar", className = "" }) {
  return /* @__PURE__ */ jsxs9("div", { className: `app-toolbar-search ${className}`, children: [
    /* @__PURE__ */ jsx10(Icon, { name: "search" }),
    /* @__PURE__ */ jsx10("input", { type: "search", className: "form-control", value, onChange: (e) => onChange(e.target.value), placeholder, "aria-label": label })
  ] });
}

// src/react/forms/FileUpload.jsx
import { useCallback as useCallback4, useEffect as useEffect4, useRef as useRef3, useState as useState5 } from "react";

// src/react/forms/files.js
var uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
var LIMITS = { maxFiles: 8, maxBytes: 10 * 1024 * 1024, maxTextChars: 6e4, maxMessageChars: 8e3 };
var TEXT_EXT = /\.(txt|md|markdown|csv|tsv|json|xml|yaml|yml|html|css|js|jsx|ts|tsx|py|java|c|cpp|cs|go|rs|rb|php|sql|log|ini|toml|sh)$/i;
var ACCEPT_EXT = /\.(pdf|docx?|xlsx?|pptx?|odt|ods|rtf|zip)$/i;
var ACCEPT = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.rtf,.zip,.txt,.md,.csv,.tsv,.json,.xml,.yaml,.yml,.html,.css,.js,.jsx,.ts,.tsx,.py,.sql,.log";
var kindOf = (file) => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("text/") || TEXT_EXT.test(file.name) || file.type === "application/json") return "text";
  if (ACCEPT_EXT.test(file.name) || file.type === "application/pdf") return "file";
  return null;
};
var formatSize = (b) => b < 1024 ? `${b} B` : b < 1024 ** 2 ? `${(b / 1024).toFixed(b < 10240 ? 1 : 0)} KB` : `${(b / 1024 ** 2).toFixed(1)} MB`;
var validateFiles = (files, existingCount = 0, limits = LIMITS) => {
  const accepted = [], rejected = [];
  for (const f of files) {
    if (existingCount + accepted.length >= limits.maxFiles) rejected.push({ name: f.name, reason: `m\xE1ximo ${limits.maxFiles} archivos` });
    else if (!kindOf(f)) rejected.push({ name: f.name, reason: "tipo de archivo no admitido" });
    else if (f.size > limits.maxBytes) rejected.push({ name: f.name, reason: `supera ${formatSize(limits.maxBytes)}` });
    else if (f.size === 0) rejected.push({ name: f.name, reason: "el archivo est\xE1 vac\xEDo" });
    else accepted.push(f);
  }
  return { accepted, rejected };
};
var readAs = (file, how) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(r.result);
  r.onerror = () => reject(r.error);
  how === "text" ? r.readAsText(file) : r.readAsDataURL(file);
});
var readAttachment = async (file) => {
  const kind = kindOf(file);
  const base = { id: uid(), name: file.name || "imagen-pegada.png", size: file.size, type: file.type, kind };
  try {
    if (kind === "image") return { ...base, dataUrl: await readAs(file, "url") };
    if (kind === "text") {
      const text = await readAs(file, "text");
      return { ...base, text: text.slice(0, LIMITS.maxTextChars), truncated: text.length > LIMITS.maxTextChars };
    }
    return base;
  } catch {
    return { ...base, error: "No se pudo leer el archivo" };
  }
};
var attachmentIcon = (a) => a.kind === "image" ? "file-image" : /\.(csv|tsv|xlsx?|ods)$/i.test(a.name) ? "file-spreadsheet" : /\.(js|jsx|ts|tsx|py|java|c|cpp|cs|go|rs|rb|php|sql|sh|html|css|json|xml|ya?ml)$/i.test(a.name) ? "file-code" : /\.zip$/i.test(a.name) ? "file-archive" : "file-text";

// src/react/forms/FileUpload.jsx
import { jsx as jsx11, jsxs as jsxs10 } from "react/jsx-runtime";
function FileUpload({ label, hint, error, required, id, accept = ACCEPT, maxFiles = 5, maxBytes = LIMITS.maxBytes, multiple = true, disabled, defaultValue = [], onChange, upload, onReject, compact }) {
  const fid = useFieldId(id);
  const [items, setItems] = useState5(defaultValue);
  const [drag, setDrag] = useState5(false);
  const [rejects, setRejects] = useState5([]);
  const input = useRef3(null);
  const depth = useRef3(0);
  const first = useRef3(true);
  useEffect4(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onChange?.(items);
  }, [items]);
  const patch = useCallback4((idv, p) => setItems((l) => l.map((x) => x.id === idv ? { ...x, ...p } : x)), []);
  const startUpload = useCallback4((item) => {
    if (upload) {
      upload(item, (progress) => patch(item.id, { progress })).then(() => patch(item.id, { progress: 100, status: "done" })).catch((e) => patch(item.id, { status: "error", error: e?.message || "Error al subir" }));
      return;
    }
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + 8 + Math.random() * 22);
      if (p >= 100) {
        clearInterval(t);
        patch(item.id, { progress: 100, status: "done" });
      } else patch(item.id, { progress: Math.round(p) });
    }, 140);
  }, [upload, patch]);
  const add = useCallback4(async (list) => {
    const files = Array.from(list || []);
    const { accepted, rejected } = validateFiles(files, items.length, { maxFiles, maxBytes });
    setRejects(rejected);
    if (rejected.length) onReject?.(rejected);
    if (!accepted.length) return;
    const read2 = await Promise.all((multiple ? accepted : accepted.slice(0, 1)).map(async (f) => ({ ...await readAttachment(f), progress: 0, status: "uploading", file: f })));
    setItems((l) => multiple ? [...l, ...read2] : read2);
    read2.forEach((r) => {
      if (r.error) patch(r.id, { status: "error" });
      else startUpload(r);
    });
  }, [items.length, maxFiles, maxBytes, multiple, onReject, patch, startUpload]);
  const remove = (idv) => setItems((l) => l.filter((x) => x.id !== idv));
  const retry = (it) => {
    patch(it.id, { status: "uploading", progress: 0, error: void 0 });
    startUpload(it);
  };
  const full = items.length >= maxFiles;
  return /* @__PURE__ */ jsxs10(Field, { id: fid, label, hint, error, required, children: [
    /* @__PURE__ */ jsxs10(
      "div",
      {
        className: `app-drop ${drag ? "is-drag" : ""} ${disabled || full ? "is-disabled" : ""} ${compact ? "is-compact" : ""}`,
        role: "button",
        tabIndex: disabled || full ? -1 : 0,
        "aria-disabled": disabled || full,
        "aria-describedby": `${fid}-help`,
        onClick: () => !disabled && !full && input.current?.click(),
        onKeyDown: (e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled && !full) {
            e.preventDefault();
            input.current?.click();
          }
        },
        onDragEnter: (e) => {
          e.preventDefault();
          depth.current++;
          setDrag(true);
        },
        onDragOver: (e) => e.preventDefault(),
        onDragLeave: () => {
          if (--depth.current <= 0) {
            depth.current = 0;
            setDrag(false);
          }
        },
        onDrop: (e) => {
          e.preventDefault();
          depth.current = 0;
          setDrag(false);
          if (!disabled && !full) add(e.dataTransfer.files);
        },
        children: [
          /* @__PURE__ */ jsx11(Icon, { name: "upload" }),
          /* @__PURE__ */ jsx11("strong", { children: drag ? "Suelta los archivos aqu\xED" : full ? "Alcanzaste el m\xE1ximo de archivos" : "Arrastra archivos o haz clic para seleccionar" }),
          /* @__PURE__ */ jsxs10("small", { id: `${fid}-help`, children: [
            "Hasta ",
            maxFiles,
            " archivo",
            maxFiles > 1 ? "s" : "",
            " \xB7 m\xE1x. ",
            formatSize(maxBytes),
            " cada uno"
          ] }),
          /* @__PURE__ */ jsx11("input", { ref: input, id: fid, type: "file", hidden: true, multiple, accept, disabled, onChange: (e) => {
            add(e.target.files);
            e.target.value = "";
          } })
        ]
      }
    ),
    rejects.length > 0 && /* @__PURE__ */ jsx11("ul", { className: "app-upload-errors", role: "alert", children: rejects.map((r, i) => /* @__PURE__ */ jsxs10("li", { children: [
      /* @__PURE__ */ jsx11(Icon, { name: "triangle-alert" }),
      /* @__PURE__ */ jsx11("strong", { children: r.name }),
      ": ",
      r.reason
    ] }, i)) }),
    items.length > 0 && /* @__PURE__ */ jsx11("ul", { className: "app-files", "aria-label": "Archivos seleccionados", children: items.map((it) => /* @__PURE__ */ jsxs10("li", { className: `app-file ${it.status === "error" ? "is-error" : ""}`, children: [
      it.kind === "image" && it.dataUrl ? /* @__PURE__ */ jsx11("img", { className: "app-file-thumb", src: it.dataUrl, alt: "" }) : /* @__PURE__ */ jsx11("span", { className: "app-file-icon", children: /* @__PURE__ */ jsx11(Icon, { name: attachmentIcon(it) }) }),
      /* @__PURE__ */ jsxs10("div", { className: "grow", children: [
        /* @__PURE__ */ jsx11("strong", { title: it.name, children: it.name }),
        /* @__PURE__ */ jsxs10("small", { children: [
          formatSize(it.size),
          " \xB7 ",
          it.status === "done" ? "Listo" : it.status === "error" ? it.error || "Error" : `Subiendo\u2026 ${it.progress}%`
        ] }),
        it.status === "uploading" && /* @__PURE__ */ jsx11("div", { className: "progress app-file-progress", role: "progressbar", "aria-valuenow": it.progress, "aria-valuemin": "0", "aria-valuemax": "100", "aria-label": `Subiendo ${it.name}`, children: /* @__PURE__ */ jsx11("div", { className: "progress-bar", style: { width: `${it.progress}%` } }) })
      ] }),
      it.status === "done" && /* @__PURE__ */ jsx11(Icon, { name: "circle-check", className: "app-file-ok" }),
      it.status === "error" && !it.error?.includes("leer") && /* @__PURE__ */ jsx11("button", { type: "button", className: "app-iconbtn", "aria-label": `Reintentar ${it.name}`, onClick: () => retry(it), children: /* @__PURE__ */ jsx11(Icon, { name: "refresh-cw" }) }),
      /* @__PURE__ */ jsx11("button", { type: "button", className: "app-iconbtn", "aria-label": `Quitar ${it.name}`, onClick: () => remove(it.id), children: /* @__PURE__ */ jsx11(Icon, { name: "x" }) })
    ] }, it.id)) })
  ] });
}

// src/react/forms/OtpInput.jsx
import { useEffect as useEffect5, useRef as useRef4 } from "react";
import { jsx as jsx12, jsxs as jsxs11 } from "react/jsx-runtime";
function OtpInput({ length = 6, value = "", onChange, onComplete, error, label = "C\xF3digo de verificaci\xF3n", autoFocus = true, disabled }) {
  const refs = useRef4([]);
  const chars = Array.from({ length }, (_, i) => value[i] ?? "");
  useEffect5(() => {
    if (!disabled && !value && (error || document.activeElement === document.body)) refs.current[0]?.focus();
  }, [disabled, error]);
  const set2 = (next) => {
    const v = next.replace(/\D/g, "").slice(0, length);
    onChange?.(v);
    if (v.length === length) onComplete?.(v);
  };
  const focus = (i) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();
  const onInput = (i, e) => {
    const d = e.target.value.replace(/\D/g, "");
    if (!d) return;
    const next = chars.slice();
    d.split("").forEach((c, k) => {
      if (i + k < length) next[i + k] = c;
    });
    set2(next.join(""));
    focus(i + d.length);
  };
  const onKey = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = chars.slice();
      if (next[i]) next[i] = "";
      else {
        next[Math.max(0, i - 1)] = "";
        focus(i - 1);
      }
      onChange?.(next.join(""));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focus(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focus(i + 1);
    }
  };
  return /* @__PURE__ */ jsxs11("div", { className: "app-field", children: [
    /* @__PURE__ */ jsx12("div", { className: "label", id: "otp-label", style: { fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.35rem" }, children: label }),
    /* @__PURE__ */ jsx12("div", { className: "app-otp", role: "group", "aria-labelledby": "otp-label", onPaste: (e) => {
      e.preventDefault();
      set2(e.clipboardData.getData("text"));
      focus(length);
    }, children: chars.map((c, i) => /* @__PURE__ */ jsx12(
      "input",
      {
        ref: (el) => {
          refs.current[i] = el;
        },
        className: `form-control ${error ? "is-invalid" : ""}`,
        inputMode: "numeric",
        autoComplete: i === 0 ? "one-time-code" : "off",
        maxLength: length,
        value: c,
        disabled,
        "aria-label": `D\xEDgito ${i + 1} de ${length}`,
        "aria-invalid": error ? "true" : void 0,
        autoFocus: autoFocus && i === 0,
        onChange: (e) => onInput(i, e),
        onKeyDown: (e) => onKey(i, e),
        onFocus: (e) => e.target.select()
      },
      i
    )) }),
    error && /* @__PURE__ */ jsx12("div", { className: "invalid-feedback d-block", role: "alert", children: error })
  ] });
}

// src/react/hooks/useForm.js
import { useCallback as useCallback5, useEffect as useEffect6, useMemo as useMemo2, useRef as useRef5, useState as useState6 } from "react";
function useForm({ initial, validate, onSubmit }) {
  const base = useRef5(initial);
  const [values, setValues] = useState6(initial);
  const [touched, setTouched] = useState6({});
  const [submitted, setSubmitted] = useState6(false);
  const [submitting, setSubmitting] = useState6(false);
  const [submitError, setSubmitError] = useState6("");
  const validateRef = useRef5(validate);
  validateRef.current = validate;
  const errors = useMemo2(() => validateRef.current?.(values) ?? {}, [values]);
  const setValue = useCallback5((name, value) => setValues((v) => ({ ...v, [name]: value })), []);
  const errorOf = (name) => touched[name] || submitted ? errors[name] : void 0;
  const bind = (name) => ({
    name,
    value: values[name] ?? "",
    error: errorOf(name),
    onChange: (e) => setValue(name, e?.target ? e.target.type === "checkbox" ? e.target.checked : e.target.value : e),
    onBlur: () => setTouched((t) => t[name] ? t : { ...t, [name]: true })
  });
  const touch = useCallback5((names) => setTouched((t) => ({ ...t, ...Object.fromEntries(names.map((n) => [n, true])) })), []);
  const bindCheck = (name) => ({ ...bind(name), value: void 0, checked: Boolean(values[name]) });
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setSubmitted(true);
    setSubmitError("");
    if (Object.keys(errors).length) {
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus());
      return false;
    }
    setSubmitting(true);
    try {
      await onSubmit?.(values);
      return true;
    } catch (err) {
      setSubmitError(err?.message || "No se pudo completar la acci\xF3n.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };
  const reset = useCallback5((next = base.current) => {
    base.current = next;
    setValues(next);
    setTouched({});
    setSubmitted(false);
    setSubmitError("");
  }, []);
  const dirty = JSON.stringify(values) !== JSON.stringify(base.current);
  useEffect6(() => {
    base.current = base.current;
  }, []);
  return { values, errors, dirty, submitting, submitError, setSubmitError, setValue, setValues, touch, bind, bindCheck, handleSubmit, reset, valid: !Object.keys(errors).length };
}

// src/react/data/DataTable.jsx
import { useEffect as useEffect7, useId as useId3, useMemo as useMemo3, useRef as useRef6, useState as useState7 } from "react";

// src/react/data/Pagination.jsx
import { jsx as jsx13, jsxs as jsxs12 } from "react/jsx-runtime";
var pageList = (page, pages) => {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set2 = /* @__PURE__ */ new Set([1, pages, page, page - 1, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((n) => set2.add(n));
  if (page >= pages - 2) [pages - 1, pages - 2, pages - 3].forEach((n) => set2.add(n));
  const out = [];
  let prev = 0;
  for (const n of [...set2].filter((x) => x >= 1 && x <= pages).sort((a, b) => a - b)) {
    if (n - prev > 1) out.push("\u2026");
    out.push(n);
    prev = n;
  }
  return out;
};
function Pagination({ page, pages, onChange, label = "Paginaci\xF3n" }) {
  if (pages <= 1) return null;
  return /* @__PURE__ */ jsx13("nav", { "aria-label": label, children: /* @__PURE__ */ jsxs12("ul", { className: "pagination", children: [
    /* @__PURE__ */ jsx13("li", { className: `page-item ${page === 1 ? "disabled" : ""}`, children: /* @__PURE__ */ jsx13("button", { type: "button", className: "page-link", "aria-label": "P\xE1gina anterior", disabled: page === 1, onClick: () => onChange(page - 1), children: /* @__PURE__ */ jsx13(Icon, { name: "arrow-left" }) }) }),
    pageList(page, pages).map((n, i) => n === "\u2026" ? /* @__PURE__ */ jsx13("li", { className: "page-item disabled", "aria-hidden": "true", children: /* @__PURE__ */ jsx13("span", { className: "page-link", children: "\u2026" }) }, `e${i}`) : /* @__PURE__ */ jsx13("li", { className: `page-item ${n === page ? "active" : ""}`, children: /* @__PURE__ */ jsx13("button", { type: "button", className: "page-link", "aria-current": n === page ? "page" : void 0, "aria-label": `P\xE1gina ${n}`, onClick: () => onChange(n), children: n }) }, n)),
    /* @__PURE__ */ jsx13("li", { className: `page-item ${page === pages ? "disabled" : ""}`, children: /* @__PURE__ */ jsx13("button", { type: "button", className: "page-link", "aria-label": "P\xE1gina siguiente", disabled: page === pages, onClick: () => onChange(page + 1), children: /* @__PURE__ */ jsx13(Icon, { name: "arrow-right" }) }) })
  ] }) });
}

// src/react/data/DataTable.jsx
import { jsx as jsx14, jsxs as jsxs13 } from "react/jsx-runtime";
function FilterBar({ search, onSearch, searchPlaceholder, filters = [], onClear, actions }) {
  const active = Boolean(search) || filters.some((f) => f.value);
  return /* @__PURE__ */ jsxs13("div", { className: "app-toolbar", role: "search", children: [
    onSearch && /* @__PURE__ */ jsx14(SearchInput, { value: search, onChange: onSearch, placeholder: searchPlaceholder }),
    filters.map((f) => /* @__PURE__ */ jsxs13("select", { className: "form-control", "aria-label": f.label, value: f.value, onChange: (e) => f.onChange(e.target.value), children: [
      /* @__PURE__ */ jsxs13("option", { value: "", children: [
        f.label,
        ": todos"
      ] }),
      f.options.map((o) => /* @__PURE__ */ jsx14("option", { value: o.value, children: o.label }, o.value))
    ] }, f.name)),
    onClear && active && /* @__PURE__ */ jsx14("button", { type: "button", className: "btn btn-link btn-compact btn-sm", onClick: onClear, children: "Limpiar filtros" }),
    /* @__PURE__ */ jsx14("span", { className: "grow" }),
    actions
  ] });
}
var cmp = (a, b) => typeof a === "number" && typeof b === "number" ? a - b : String(a ?? "").localeCompare(String(b ?? ""), "es", { numeric: true, sensitivity: "base" });
function DataTable({
  columns,
  rows,
  rowKey = "id",
  loading = false,
  selectable = false,
  bulkActions,
  rowActions,
  onRowClick,
  onSelectionChange,
  pageSizes = [10, 20, 50],
  defaultPageSize = 10,
  defaultSort,
  empty,
  toolbar,
  caption = "Tabla de datos",
  noun = ["registro", "registros"]
}) {
  const uid2 = useId3();
  const [sort, setSort] = useState7(defaultSort ?? null);
  const [page, setPage] = useState7(1);
  const [pageSize, setPageSize] = useState7(defaultPageSize);
  const [selected, setSelected] = useState7(() => /* @__PURE__ */ new Set());
  const sorted = useMemo3(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    const val = (r) => col?.sortValue ? col.sortValue(r) : r[sort.key];
    return [...rows].sort((a, b) => cmp(val(a), val(b)) * (sort.dir === "asc" ? 1 : -1));
  }, [rows, sort, columns]);
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const cur = Math.min(page, pages);
  const view = sorted.slice((cur - 1) * pageSize, cur * pageSize);
  const sig = rows.length;
  useEffect7(() => {
    setPage(1);
  }, [sig, pageSize]);
  useEffect7(() => {
    setSelected((s) => {
      const keys = new Set(rows.map((r) => r[rowKey]));
      const n = new Set([...s].filter((k) => keys.has(k)));
      return n.size === s.size ? s : n;
    });
  }, [rows, rowKey]);
  useEffect7(() => {
    onSelectionChange?.(rows.filter((r) => selected.has(r[rowKey])));
  }, [selected]);
  const toggleSort = (key) => setSort((s) => s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null);
  const pageKeys = view.map((r) => r[rowKey]);
  const allOnPage = pageKeys.length > 0 && pageKeys.every((k) => selected.has(k));
  const someOnPage = pageKeys.some((k) => selected.has(k)) && !allOnPage;
  const headCheck = useRef6(null);
  useEffect7(() => {
    if (headCheck.current) headCheck.current.indeterminate = someOnPage;
  }, [someOnPage]);
  const selectedRows = rows.filter((r) => selected.has(r[rowKey]));
  const toggleRow = (k) => setSelected((s) => {
    const n = new Set(s);
    n.has(k) ? n.delete(k) : n.add(k);
    return n;
  });
  const togglePage = () => setSelected((s) => {
    const n = new Set(s);
    pageKeys.forEach((k) => allOnPage ? n.delete(k) : n.add(k));
    return n;
  });
  const hide = (c) => c.hideBelow === "sm" ? "app-hide-sm" : c.hideBelow === "md" ? "app-hide-md" : "";
  const from = sorted.length ? (cur - 1) * pageSize + 1 : 0;
  const to = Math.min(cur * pageSize, sorted.length);
  return /* @__PURE__ */ jsxs13("div", { className: "app-datatable", children: [
    toolbar,
    selectable && selected.size > 0 && /* @__PURE__ */ jsxs13("div", { className: "app-bulkbar", role: "status", children: [
      /* @__PURE__ */ jsxs13("strong", { children: [
        selected.size,
        " ",
        selected.size === 1 ? noun[0] : noun[1],
        " seleccionado",
        selected.size === 1 ? "" : "s"
      ] }),
      /* @__PURE__ */ jsx14("span", { className: "grow" }),
      bulkActions?.(selectedRows, () => setSelected(/* @__PURE__ */ new Set())),
      /* @__PURE__ */ jsx14("button", { type: "button", className: "btn btn-outline-primary btn-compact btn-sm", onClick: () => setSelected(/* @__PURE__ */ new Set()), children: "Quitar selecci\xF3n" })
    ] }),
    /* @__PURE__ */ jsxs13("div", { className: "app-table-wrap", children: [
      /* @__PURE__ */ jsxs13("table", { className: "app-table", children: [
        /* @__PURE__ */ jsx14("caption", { className: "sr-only", children: caption }),
        /* @__PURE__ */ jsx14("thead", { children: /* @__PURE__ */ jsxs13("tr", { children: [
          selectable && /* @__PURE__ */ jsx14("th", { className: "col-check", children: /* @__PURE__ */ jsx14("input", { ref: headCheck, type: "checkbox", className: "app-check", "aria-label": "Seleccionar todos en esta p\xE1gina", checked: allOnPage, onChange: togglePage }) }),
          columns.map((c) => /* @__PURE__ */ jsx14("th", { scope: "col", className: `${hide(c)} ${c.align === "right" ? "num" : ""}`, style: { width: c.width }, "aria-sort": sort?.key === c.key ? sort.dir === "asc" ? "ascending" : "descending" : void 0, children: c.sortable ? /* @__PURE__ */ jsxs13("button", { type: "button", className: "app-sort", onClick: () => toggleSort(c.key), children: [
            c.header,
            /* @__PURE__ */ jsx14(Icon, { name: sort?.key === c.key ? sort.dir === "asc" ? "arrow-up" : "arrow-down" : "chevrons-up-down" })
          ] }) : c.header }, c.key)),
          rowActions && /* @__PURE__ */ jsx14("th", { scope: "col", className: "col-actions", children: /* @__PURE__ */ jsx14("span", { className: "sr-only", children: "Acciones" }) })
        ] }) }),
        /* @__PURE__ */ jsxs13("tbody", { children: [
          loading && Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsxs13("tr", { "aria-hidden": "true", children: [
            selectable && /* @__PURE__ */ jsx14("td", { className: "col-check" }),
            columns.map((c) => /* @__PURE__ */ jsx14("td", { className: hide(c), children: /* @__PURE__ */ jsx14(Skeleton, { width: `${50 + (i * 17 + c.key.length * 7) % 40}%` }) }, c.key)),
            rowActions && /* @__PURE__ */ jsx14("td", {})
          ] }, `s${i}`)),
          !loading && view.map((r) => {
            const k = r[rowKey];
            return /* @__PURE__ */ jsxs13("tr", { className: selected.has(k) ? "is-selected" : "", onClick: onRowClick ? () => onRowClick(r) : void 0, style: onRowClick ? { cursor: "pointer" } : void 0, children: [
              selectable && /* @__PURE__ */ jsx14("td", { className: "col-check", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx14("input", { type: "checkbox", className: "app-check", "aria-label": `Seleccionar fila ${k}`, checked: selected.has(k), onChange: () => toggleRow(k) }) }),
              columns.map((c) => /* @__PURE__ */ jsx14("td", { className: `${hide(c)} ${c.align === "right" ? "num" : ""}`, children: c.render ? c.render(r) : r[c.key] }, c.key)),
              rowActions && /* @__PURE__ */ jsx14("td", { className: "col-actions", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx14(DropdownMenu, { label: `Acciones de la fila ${k}`, items: rowActions(r) }) })
            ] }, k);
          })
        ] })
      ] }),
      !loading && sorted.length === 0 && (empty ?? /* @__PURE__ */ jsx14(EmptyState, { icon: "search", title: "Sin resultados", children: "No encontramos registros con los filtros actuales." }))
    ] }),
    !loading && sorted.length > 0 && /* @__PURE__ */ jsxs13("div", { className: "app-table-foot", children: [
      /* @__PURE__ */ jsxs13("span", { "aria-live": "polite", children: [
        "Mostrando ",
        from,
        "\u2013",
        to,
        " de ",
        sorted.length,
        " ",
        sorted.length === 1 ? noun[0] : noun[1]
      ] }),
      /* @__PURE__ */ jsxs13("span", { children: [
        /* @__PURE__ */ jsx14("label", { htmlFor: `${uid2}-ps`, children: "Filas por p\xE1gina" }),
        /* @__PURE__ */ jsx14("select", { id: `${uid2}-ps`, className: "form-control", value: pageSize, onChange: (e) => setPageSize(Number(e.target.value)), children: pageSizes.map((n) => /* @__PURE__ */ jsx14("option", { children: n }, n)) })
      ] }),
      /* @__PURE__ */ jsx14(Pagination, { page: cur, pages, onChange: setPage })
    ] })
  ] });
}

// src/react/data/csv.js
var esc = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
var toCsv = (rows, columns) => `\uFEFF${[columns.map((c) => esc(c.label)).join(","), ...rows.map((r) => columns.map((c) => esc(c.get ? c.get(r) : r[c.key])).join(","))].join("\r\n")}`;
var parseCsv = (text) => {
  const src = text.replace(/^﻿/, "");
  const sep = (src.split("\n")[0].match(/;/g) || []).length > (src.split("\n")[0].match(/,/g) || []).length ? ";" : ",";
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (q) {
      if (c === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === sep) {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [head, ...body] = rows.filter((r) => r.some((x) => x.trim()));
  if (!head) return [];
  const keys = head.map((h) => h.trim().toLowerCase());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
};
var downloadFile = (name, text, mime = "text/csv") => {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
};

// src/react/feedback/Modal.jsx
import { createContext as createContext2, useCallback as useCallback6, useContext as useContext2, useEffect as useEffect8, useId as useId4, useMemo as useMemo4, useRef as useRef7, useState as useState8 } from "react";
import { Fragment as Fragment5, jsx as jsx15, jsxs as jsxs14 } from "react/jsx-runtime";
var locks = 0;
var lock = () => {
  if (locks++ === 0) document.documentElement.classList.add("gob-modal-open");
};
var unlock = () => {
  if (--locks <= 0) {
    locks = 0;
    document.documentElement.classList.remove("gob-modal-open");
  }
};
var TONE_ICON = { info: "info", success: "circle-check", warning: "triangle-alert", danger: "triangle-alert" };
var EXIT_MS = 190;
function Modal({ open, onClose, title, subtitle, icon, tone = "", size = "md", variant = "", staticBackdrop = false, busy = false, footer, children, className = "" }) {
  const ref = useRef7(null);
  const titleId = useId4();
  const bodyId = useId4();
  const [mounted, setMounted] = useState8(open);
  const [closing, setClosing] = useState8(false);
  const [shake, setShake] = useState8(false);
  const down = useRef7(false);
  useEffect8(() => {
    const d = ref.current;
    if (open) {
      setMounted(true);
      setClosing(false);
      return void 0;
    }
    if (!mounted || !d?.open) {
      setMounted(false);
      return void 0;
    }
    setClosing(true);
    const t = setTimeout(() => {
      d.close();
      setMounted(false);
      setClosing(false);
    }, EXIT_MS);
    return () => clearTimeout(t);
  }, [open]);
  useEffect8(() => {
    const d = ref.current;
    if (!mounted || !open || !d || d.open) return void 0;
    d.showModal();
    lock();
    requestAnimationFrame(() => {
      const target = d.querySelector("[data-autofocus]") || d.querySelector(".gob-modal-body input:not([type=hidden]), .gob-modal-body textarea, .gob-modal-body select");
      target?.focus();
    });
    return () => {
      unlock();
    };
  }, [mounted, open]);
  useEffect8(() => () => {
    const d = ref.current;
    if (d?.open) d.close();
  }, []);
  const requestClose = () => {
    if (busy) return;
    if (staticBackdrop) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    onClose?.();
  };
  return /* @__PURE__ */ jsx15(
    "dialog",
    {
      ref,
      className: `gob-modal is-${size} ${variant ? `is-${variant}` : ""} ${tone ? `tone-${tone}` : ""} ${closing ? "is-closing" : ""} ${shake ? "is-shake" : ""} ${className}`,
      "aria-labelledby": titleId,
      "aria-describedby": bodyId,
      "aria-busy": busy || void 0,
      onCancel: (e) => {
        e.preventDefault();
        requestClose();
      },
      onMouseDown: (e) => {
        down.current = e.target === ref.current;
      },
      onClick: (e) => {
        if (down.current && e.target === ref.current) requestClose();
        down.current = false;
      },
      children: mounted && /* @__PURE__ */ jsxs14(Fragment5, { children: [
        /* @__PURE__ */ jsxs14("header", { className: "gob-modal-header", children: [
          (icon || tone) && /* @__PURE__ */ jsx15("span", { className: "gob-modal-icon", children: /* @__PURE__ */ jsx15(Icon, { name: icon || TONE_ICON[tone] }) }),
          /* @__PURE__ */ jsxs14("div", { className: "gob-modal-titles", children: [
            /* @__PURE__ */ jsx15("h2", { id: titleId, className: "gob-modal-title", children: title }),
            subtitle && /* @__PURE__ */ jsx15("p", { className: "gob-modal-subtitle", children: subtitle })
          ] }),
          /* @__PURE__ */ jsx15("button", { type: "button", className: "gob-modal-close", "aria-label": "Cerrar", disabled: busy, onClick: requestClose, children: /* @__PURE__ */ jsx15(Icon, { name: "x" }) })
        ] }),
        /* @__PURE__ */ jsx15("div", { className: "gob-modal-body", id: bodyId, children }),
        footer && /* @__PURE__ */ jsx15("div", { className: "gob-modal-footer", children: footer })
      ] })
    }
  );
}
var ModalCtx = createContext2(null);
var useModal = () => useContext2(ModalCtx);
function ConfirmBody({ text, requireText, value, setValue }) {
  return /* @__PURE__ */ jsxs14(Fragment5, { children: [
    typeof text === "string" ? /* @__PURE__ */ jsx15("p", { className: "mb-0", children: text }) : text,
    requireText && /* @__PURE__ */ jsxs14("div", { className: "app-field mt-3 mb-0", children: [
      /* @__PURE__ */ jsxs14("label", { htmlFor: "gob-confirm-text", children: [
        "Para confirmar, escribe ",
        /* @__PURE__ */ jsx15("strong", { children: requireText })
      ] }),
      /* @__PURE__ */ jsx15("input", { id: "gob-confirm-text", className: "form-control", autoComplete: "off", value, onChange: (e) => setValue(e.target.value), "data-autofocus": true })
    ] })
  ] });
}
function PromptBody({ text, label, placeholder, value, setValue, error, multiline }) {
  const Field2 = multiline ? "textarea" : "input";
  return /* @__PURE__ */ jsxs14(Fragment5, { children: [
    text && /* @__PURE__ */ jsx15("p", { children: text }),
    /* @__PURE__ */ jsxs14("div", { className: "app-field mb-0", children: [
      /* @__PURE__ */ jsx15("label", { htmlFor: "gob-prompt", children: label }),
      /* @__PURE__ */ jsx15(Field2, { id: "gob-prompt", className: `form-control ${error ? "is-invalid" : ""}`, placeholder, value, onChange: (e) => setValue(e.target.value), rows: multiline ? 4 : void 0, "aria-invalid": Boolean(error), "data-autofocus": true }),
      error && /* @__PURE__ */ jsx15("div", { className: "invalid-feedback d-block", children: error })
    ] })
  ] });
}
function ManagedModal({ entry, onResolve }) {
  const { kind, props } = entry;
  const [value, setValue] = useState8(props.initial ?? "");
  const [error, setError] = useState8("");
  const [busy, setBusy] = useState8(false);
  const close = (result) => onResolve(entry.id, result);
  const needText = kind === "confirm" && props.requireText && value !== props.requireText;
  const submit = async () => {
    if (kind === "prompt") {
      const err = props.validate?.(value);
      if (err) {
        setError(err);
        return;
      }
      close(value);
      return;
    }
    if (props.onConfirm) {
      setBusy(true);
      try {
        await props.onConfirm();
        close(true);
      } catch (e) {
        setBusy(false);
        setError(e?.message || "No se pudo completar la acci\xF3n");
      }
      return;
    }
    close(kind === "confirm" ? true : void 0);
  };
  const danger = props.tone === "danger";
  const footer = /* @__PURE__ */ jsxs14(Fragment5, { children: [
    kind !== "alert" && /* @__PURE__ */ jsx15("button", { type: "button", className: "btn btn-outline-primary btn-compact", disabled: busy, onClick: () => close(kind === "prompt" ? null : false), children: props.cancelLabel || "Cancelar" }),
    /* @__PURE__ */ jsxs14("button", { type: "button", className: `btn ${danger ? "btn-danger" : "btn-primary"} btn-compact`, disabled: needText || busy, onClick: submit, children: [
      busy && /* @__PURE__ */ jsx15("span", { className: "spinner-border spinner-border-sm mr-2", "aria-hidden": "true" }),
      props.confirmLabel || (kind === "alert" ? "Entendido" : kind === "prompt" ? "Aceptar" : "Confirmar")
    ] })
  ] });
  return /* @__PURE__ */ jsxs14(
    Modal,
    {
      open: entry.open,
      onClose: () => close(kind === "prompt" ? null : kind === "alert" ? void 0 : false),
      title: props.title,
      subtitle: props.subtitle,
      tone: props.tone || (kind === "alert" ? "info" : ""),
      icon: props.icon,
      size: props.size || "sm",
      staticBackdrop: props.static,
      busy,
      footer,
      children: [
        kind === "prompt" ? /* @__PURE__ */ jsx15(PromptBody, { ...props, value, setValue, error }) : /* @__PURE__ */ jsx15(ConfirmBody, { text: props.text, requireText: kind === "confirm" ? props.requireText : null, value, setValue }),
        kind !== "prompt" && error && /* @__PURE__ */ jsx15("div", { className: "alert alert-danger mt-3 mb-0", role: "alert", children: error })
      ]
    }
  );
}
function ModalProvider({ children }) {
  const [stack, setStack] = useState8([]);
  const seq = useRef7(0);
  const resolvers = useRef7(/* @__PURE__ */ new Map());
  const push = useCallback6((kind, props) => new Promise((resolve) => {
    const id = ++seq.current;
    resolvers.current.set(id, resolve);
    setStack((s) => [...s, { id, kind, props, open: true }]);
  }), []);
  const onResolve = useCallback6((id, result) => {
    resolvers.current.get(id)?.(result);
    resolvers.current.delete(id);
    setStack((s) => s.map((e) => e.id === id ? { ...e, open: false } : e));
    setTimeout(() => setStack((s) => s.filter((e) => e.id !== id)), EXIT_MS + 120);
  }, []);
  const api = useMemo4(() => ({
    confirm: (props) => push("confirm", props),
    alert: (props) => push("alert", props),
    prompt: (props) => push("prompt", props)
  }), [push]);
  return /* @__PURE__ */ jsxs14(ModalCtx.Provider, { value: api, children: [
    children,
    stack.map((e) => /* @__PURE__ */ jsx15(ManagedModal, { entry: e, onResolve }, e.id))
  ] });
}

// src/react/feedback/Toasts.jsx
import { createContext as createContext3, useCallback as useCallback7, useContext as useContext3, useMemo as useMemo5, useRef as useRef8, useState as useState9 } from "react";
import { jsx as jsx16, jsxs as jsxs15 } from "react/jsx-runtime";
var Ctx2 = createContext3(() => {
});
var useToast = () => useContext3(Ctx2);
var ICONS = { error: "triangle-alert", ok: "circle-check", warn: "triangle-alert" };
function ToastProvider({ children }) {
  const [items, setItems] = useState9([]);
  const n = useRef8(0);
  const dismiss = useCallback7((id) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const toast = useCallback7((text, opts = "") => {
    const o = typeof opts === "string" ? { kind: opts } : opts;
    const id = ++n.current;
    setItems((l) => [...l.slice(-3), { id, text, kind: o.kind || "", action: o.action }]);
    setTimeout(() => dismiss(id), o.duration ?? (o.action ? 6500 : 3200));
  }, [dismiss]);
  const value = useMemo5(() => toast, [toast]);
  return /* @__PURE__ */ jsxs15(Ctx2.Provider, { value, children: [
    children,
    /* @__PURE__ */ jsx16("div", { className: "gob-toasts chat-toasts", role: "status", "aria-live": "polite", children: items.map((t) => /* @__PURE__ */ jsxs15("div", { className: `gob-toast chat-toast ${t.kind ? `is-${t.kind}` : ""}`, children: [
      /* @__PURE__ */ jsx16(Icon, { name: ICONS[t.kind] || "info" }),
      /* @__PURE__ */ jsx16("span", { children: t.text }),
      t.action && /* @__PURE__ */ jsx16("button", { type: "button", className: "gob-toast-action", onClick: () => {
        t.action.onClick();
        dismiss(t.id);
      }, children: t.action.label }),
      /* @__PURE__ */ jsx16("button", { type: "button", className: "gob-toast-close", "aria-label": "Cerrar aviso", onClick: () => dismiss(t.id), children: /* @__PURE__ */ jsx16(Icon, { name: "x" }) })
    ] }, t.id)) })
  ] });
}

// src/react/feedback/Alert.jsx
import { jsx as jsx17, jsxs as jsxs16 } from "react/jsx-runtime";
var ICONS2 = { info: "info", success: "circle-check", warning: "triangle-alert", danger: "triangle-alert" };
function Alert({ tone = "info", title, children, onClose, className = "" }) {
  return /* @__PURE__ */ jsxs16("div", { className: `alert alert-${tone} ${onClose ? "alert-dismissible" : ""} ${className}`, role: tone === "danger" || tone === "warning" ? "alert" : "status", children: [
    /* @__PURE__ */ jsxs16("div", { style: { display: "flex", gap: "0.7rem", alignItems: "flex-start" }, children: [
      /* @__PURE__ */ jsx17(Icon, { name: ICONS2[tone], style: { marginTop: 3, flex: "none" } }),
      /* @__PURE__ */ jsxs16("div", { style: { minWidth: 0 }, children: [
        title && /* @__PURE__ */ jsx17("strong", { className: "d-block", children: title }),
        children
      ] })
    ] }),
    onClose && /* @__PURE__ */ jsx17("button", { type: "button", className: "close", "aria-label": "Cerrar", onClick: onClose, children: "\xD7" })
  ] });
}

// src/react/feedback/Loading.jsx
import { jsx as jsx18, jsxs as jsxs17 } from "react/jsx-runtime";
function Spinner({ size = "md", variant = "border", tone = "primary", label = "Cargando\u2026", className = "" }) {
  const sm = size === "sm" ? ` spinner-${variant}-sm` : "";
  const big = size === "lg" ? { width: "3rem", height: "3rem", borderWidth: variant === "border" ? ".3em" : void 0 } : void 0;
  return /* @__PURE__ */ jsx18("span", { className: `spinner-${variant}${sm}${tone ? ` text-${tone}` : ""} ${className}`, style: big, role: "status", children: /* @__PURE__ */ jsx18("span", { className: "sr-only", children: label }) });
}
function Loading({ children = "Cargando\u2026", size = "sm", className = "" }) {
  return /* @__PURE__ */ jsxs17("span", { className: `gob-loading ${className}`, role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ jsx18(Spinner, { size, label: "" }),
    /* @__PURE__ */ jsx18("span", { children })
  ] });
}
function LoadingScreen({ title = "Cargando", message = "Un momento, por favor.", minHeight = "16rem", className = "" }) {
  return /* @__PURE__ */ jsxs17("div", { className: `gob-loading-screen ${className}`, style: { minHeight }, role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ jsx18(Spinner, { size: "lg", label: "" }),
    /* @__PURE__ */ jsx18("strong", { children: title }),
    message && /* @__PURE__ */ jsx18("span", { children: message })
  ] });
}
function LoadingOverlay({ active, label = "Cargando\u2026", children, className = "" }) {
  return /* @__PURE__ */ jsxs17("div", { className: `gob-overlay-wrap ${className}`, "aria-busy": active, children: [
    children,
    active && /* @__PURE__ */ jsxs17("div", { className: "gob-overlay", role: "status", "aria-live": "polite", children: [
      /* @__PURE__ */ jsx18(Spinner, { label: "" }),
      /* @__PURE__ */ jsx18("span", { children: label })
    ] })
  ] });
}
function ProgressBar({ value, label, tone = "", striped = false, height, className = "" }) {
  const indeterminate = value == null;
  const v = indeterminate ? 100 : Math.max(0, Math.min(100, Math.round(value)));
  return /* @__PURE__ */ jsxs17("div", { className, children: [
    label && /* @__PURE__ */ jsxs17("div", { className: "gob-progress-label", children: [
      /* @__PURE__ */ jsx18("span", { children: label }),
      !indeterminate && /* @__PURE__ */ jsxs17("span", { children: [
        v,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx18("div", { className: "progress", style: height ? { height } : void 0, role: "progressbar", "aria-label": label || "Progreso", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": indeterminate ? void 0 : v, children: /* @__PURE__ */ jsx18("div", { className: `progress-bar${tone ? ` bg-${tone}` : ""}${striped || indeterminate ? " progress-bar-striped progress-bar-animated" : ""}`, style: { width: `${v}%` } }) })
  ] });
}
function SkeletonText({ lines = 3, className = "" }) {
  return /* @__PURE__ */ jsx18("div", { className: `gob-skeleton-text ${className}`, "aria-hidden": "true", children: Array.from({ length: lines }, (_, i) => /* @__PURE__ */ jsx18("span", { className: "app-skeleton", style: { width: i === lines - 1 ? "60%" : "100%" } }, i)) });
}
function SkeletonCard({ className = "" }) {
  return /* @__PURE__ */ jsxs17("div", { className: `gob-skeleton-card ${className}`, "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx18("span", { className: "app-skeleton gob-skeleton-avatar" }),
    /* @__PURE__ */ jsx18(SkeletonText, { lines: 3 })
  ] });
}

// src/react/preview/FilePreview.jsx
import { useEffect as useEffect9, useMemo as useMemo6, useState as useState10 } from "react";

// src/react/preview/parsers.js
var xmlDoc = (s) => new DOMParser().parseFromString(s, "application/xml");
var textOf = (el) => el ? el.textContent : "";
var sanitizeHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script,iframe,object,embed,link,style,form").forEach((n) => n.remove());
  doc.body.querySelectorAll("*").forEach((el) => {
    for (const a of [...el.attributes]) {
      if (/^on/i.test(a.name) || /^(href|src|xlink:href)$/i.test(a.name) && /^\s*javascript:/i.test(a.value)) el.removeAttribute(a.name);
    }
    if (el.tagName === "A") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
  });
  return doc.body.innerHTML;
};
async function parseDocx(buffer) {
  const mammoth = (await import("mammoth")).default || await import("mammoth");
  const { value, messages } = await mammoth.convertToHtml({ arrayBuffer: buffer });
  return { html: sanitizeHtml(value), warnings: messages.length };
}
var colIndex = (ref) => [...ref.replace(/\d+/g, "")].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1;
async function parseXlsx(buffer, { maxRows = 500, maxCols = 40 } = {}) {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(buffer);
  const read2 = async (p) => {
    const f = zip.file(p);
    return f ? f.async("string") : null;
  };
  const shared = [];
  const ss = await read2("xl/sharedStrings.xml");
  if (ss) xmlDoc(ss).querySelectorAll("si").forEach((si) => shared.push([...si.querySelectorAll("t")].map(textOf).join("")));
  const wb = xmlDoc(await read2("xl/workbook.xml") || "<x/>");
  const rels = xmlDoc(await read2("xl/_rels/workbook.xml.rels") || "<x/>");
  const target = {};
  rels.querySelectorAll("Relationship").forEach((r) => {
    target[r.getAttribute("Id")] = r.getAttribute("Target");
  });
  const sheets = [];
  for (const s of [...wb.querySelectorAll("sheet")]) {
    const rid = s.getAttribute("r:id") || s.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
    let path = target[rid] || `worksheets/sheet${sheets.length + 1}.xml`;
    path = path.startsWith("/") ? path.slice(1) : `xl/${path}`;
    const xml = await read2(path);
    if (!xml) continue;
    const rows = [];
    let total = 0;
    xmlDoc(xml).querySelectorAll("sheetData > row").forEach((row) => {
      total++;
      if (rows.length >= maxRows) return;
      const out = [];
      row.querySelectorAll("c").forEach((c) => {
        const i = colIndex(c.getAttribute("r") || "A1");
        if (i >= maxCols) return;
        const t = c.getAttribute("t");
        const v = textOf(c.querySelector("v"));
        out[i] = t === "s" ? shared[+v] ?? "" : t === "inlineStr" ? textOf(c.querySelector("is")) : t === "b" ? v === "1" ? "VERDADERO" : "FALSO" : v;
      });
      rows.push(Array.from(out, (x) => x ?? ""));
    });
    sheets.push({ name: s.getAttribute("name"), rows, truncated: total > rows.length });
  }
  return sheets;
}
async function parsePptx(buffer) {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(buffer);
  const names = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
  const slides = [];
  for (const n of names) {
    const doc = xmlDoc(await zip.file(n).async("string"));
    const paras = [...doc.querySelectorAll("p")].map((p) => [...p.querySelectorAll("t")].map(textOf).join("")).filter(Boolean);
    slides.push({ title: paras[0] || `Diapositiva ${slides.length + 1}`, lines: paras.slice(1) });
  }
  return slides;
}
var DWG_VERSIONS = {
  AC1006: "AutoCAD R10",
  AC1009: "AutoCAD R11/R12",
  AC1012: "AutoCAD R13",
  AC1014: "AutoCAD R14",
  AC1015: "AutoCAD 2000",
  AC1018: "AutoCAD 2004",
  AC1021: "AutoCAD 2007",
  AC1024: "AutoCAD 2010",
  AC1027: "AutoCAD 2013",
  AC1032: "AutoCAD 2018+"
};
var parseDwgHeader = (buffer) => {
  const code = new TextDecoder("ascii").decode(new Uint8Array(buffer.slice(0, 6)));
  return DWG_VERSIONS[code] ? { code, version: DWG_VERSIONS[code] } : { code, version: null };
};
function parseDxf(text, maxEntities = 2e4) {
  const raw = text.split(/\r?\n/);
  const pairs = [];
  for (let i = 0; i + 1 < raw.length; i += 2) pairs.push([raw[i].trim(), raw[i + 1].trim()]);
  const shapes = [];
  let cur = null;
  const flush = () => {
    if (cur && shapes.length < maxEntities) shapes.push(cur);
    cur = null;
  };
  let inEntities = false;
  for (const [code, val] of pairs) {
    if (code === "0") {
      flush();
      if (val === "SECTION") continue;
      if (val === "ENDSEC") {
        inEntities = false;
        continue;
      }
      if (inEntities && ["LINE", "CIRCLE", "ARC", "LWPOLYLINE"].includes(val)) cur = { type: val, pts: [], closed: false };
      continue;
    }
    if (code === "2" && val === "ENTITIES") {
      inEntities = true;
      continue;
    }
    if (!cur) continue;
    const n = parseFloat(val);
    if (cur.type === "LINE") {
      if (code === "10") cur.x1 = n;
      else if (code === "20") cur.y1 = n;
      else if (code === "11") cur.x2 = n;
      else if (code === "21") cur.y2 = n;
    } else if (cur.type === "CIRCLE" || cur.type === "ARC") {
      if (code === "10") cur.cx = n;
      else if (code === "20") cur.cy = n;
      else if (code === "40") cur.r = n;
      else if (code === "50") cur.a0 = n;
      else if (code === "51") cur.a1 = n;
    } else if (cur.type === "LWPOLYLINE") {
      if (code === "70") cur.closed = (parseInt(val) & 1) === 1;
      else if (code === "10") cur.pts.push([n, 0]);
      else if (code === "20" && cur.pts.length) cur.pts[cur.pts.length - 1][1] = n;
    }
  }
  flush();
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const ext2 = (x, y) => {
    if (Number.isFinite(x) && Number.isFinite(y)) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  };
  for (const s of shapes) {
    if (s.type === "LINE") {
      ext2(s.x1, s.y1);
      ext2(s.x2, s.y2);
    } else if (s.type === "LWPOLYLINE") s.pts.forEach(([x, y]) => ext2(x, y));
    else {
      ext2(s.cx - s.r, s.cy - s.r);
      ext2(s.cx + s.r, s.cy + s.r);
    }
  }
  return { shapes, bounds: shapes.length ? { minX, minY, maxX, maxY } : null };
}
var parseRows = (text, delimiter) => {
  const src = text.replace(/^﻿/, "");
  const first = src.split("\n")[0];
  const sep = delimiter || ["	", ";", ","].map((d) => [d, first.split(d).length]).sort((a, b) => b[1] - a[1])[0][0];
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (q) {
      if (c === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === sep) {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((x) => x.trim()));
};

// src/react/preview/FilePreview.jsx
import { jsx as jsx19, jsxs as jsxs18 } from "react/jsx-runtime";
var ext = (name = "") => (name.match(/\.([a-z0-9]+)$/i)?.[1] || "").toLowerCase();
var previewKind = (name = "", type = "") => {
  const e = ext(name);
  if (type.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "avif"].includes(e)) return "image";
  if (type === "application/pdf" || e === "pdf") return "pdf";
  if (type.startsWith("video/") || ["mp4", "webm", "ogv", "mov"].includes(e)) return "video";
  if (type.startsWith("audio/") || ["mp3", "wav", "ogg", "m4a"].includes(e)) return "audio";
  if (e === "docx") return "docx";
  if (e === "xlsx") return "xlsx";
  if (e === "pptx") return "pptx";
  if (e === "csv" || e === "tsv") return "csv";
  if (e === "dxf") return "dxf";
  if (e === "dwg") return "dwg";
  if (["doc", "xls", "ppt", "odt", "ods", "odp", "rtf"].includes(e)) return "legacy";
  if (type.startsWith("text/") || type === "application/json" || ["txt", "md", "json", "xml", "yaml", "yml", "html", "css", "js", "jsx", "ts", "tsx", "py", "sql", "log", "ini", "toml", "sh"].includes(e)) return "text";
  return "unknown";
};
var KIND_META = {
  image: ["file-image", "Imagen"],
  pdf: ["file-text", "PDF"],
  video: ["file", "Video"],
  audio: ["file", "Audio"],
  docx: ["file-text", "Documento Word"],
  xlsx: ["file-spreadsheet", "Planilla Excel"],
  pptx: ["file", "Presentaci\xF3n PowerPoint"],
  csv: ["file-spreadsheet", "Datos CSV"],
  dxf: ["ruler", "Plano DXF"],
  dwg: ["ruler", "Plano DWG"],
  legacy: ["file", "Documento Office"],
  text: ["file-code", "Texto"],
  unknown: ["file", "Archivo"]
};
var LEGACY_HINT = { doc: "Word 97-2003", xls: "Excel 97-2003", ppt: "PowerPoint 97-2003", odt: "OpenDocument", ods: "OpenDocument", odp: "OpenDocument", rtf: "RTF" };
function Fallback({ name, kind, size, reason, onDownload, children }) {
  return /* @__PURE__ */ jsxs18("div", { className: "gob-pv-fallback", children: [
    /* @__PURE__ */ jsx19(Icon, { name: KIND_META[kind]?.[0] || "file", className: "gob-pv-fallback-icon" }),
    /* @__PURE__ */ jsx19("strong", { children: name }),
    /* @__PURE__ */ jsx19("span", { className: "gob-pv-muted", children: [KIND_META[kind]?.[1], size != null && formatSize(size)].filter(Boolean).join(" \xB7 ") }),
    children,
    /* @__PURE__ */ jsx19("p", { className: "gob-pv-muted mb-0", children: reason }),
    onDownload && /* @__PURE__ */ jsxs18("button", { type: "button", className: "btn btn-primary btn-sm", onClick: onDownload, children: [
      /* @__PURE__ */ jsx19(Icon, { name: "download" }),
      " Descargar archivo"
    ] })
  ] });
}
function Table({ rows }) {
  const width = Math.max(0, ...rows.map((r) => r.length));
  return /* @__PURE__ */ jsx19("div", { className: "gob-pv-table-wrap", children: /* @__PURE__ */ jsxs18("table", { className: "gob-pv-table", children: [
    /* @__PURE__ */ jsx19("thead", { children: /* @__PURE__ */ jsxs18("tr", { children: [
      /* @__PURE__ */ jsx19("th", { className: "gob-pv-rownum" }),
      Array.from({ length: width }, (_, i) => /* @__PURE__ */ jsx19("th", { children: String.fromCharCode(65 + i % 26).repeat(Math.floor(i / 26) + 1) }, i))
    ] }) }),
    /* @__PURE__ */ jsx19("tbody", { children: rows.map((r, i) => /* @__PURE__ */ jsxs18("tr", { children: [
      /* @__PURE__ */ jsx19("th", { className: "gob-pv-rownum", children: i + 1 }),
      Array.from({ length: width }, (_, j) => /* @__PURE__ */ jsx19("td", { children: r[j] ?? "" }, j))
    ] }, i)) })
  ] }) });
}
function DxfView({ model }) {
  const b = model.bounds;
  if (!b) return /* @__PURE__ */ jsx19("p", { className: "gob-pv-muted p-3", children: "El plano no contiene entidades 2D reconocibles (LINE, CIRCLE, ARC, LWPOLYLINE)." });
  const w = b.maxX - b.minX || 1, h = b.maxY - b.minY || 1, pad = Math.max(w, h) * 0.04;
  const sw = Math.max(w, h) / 600;
  const Y = (y) => b.maxY - y;
  const arc = (s) => {
    const a0 = s.a0 * Math.PI / 180, a1 = s.a1 * Math.PI / 180;
    const x0 = s.cx + s.r * Math.cos(a0), y0 = s.cy + s.r * Math.sin(a0), x1 = s.cx + s.r * Math.cos(a1), y1 = s.cy + s.r * Math.sin(a1);
    const large = (s.a1 - s.a0 + 360) % 360 > 180 ? 1 : 0;
    return `M${x0} ${Y(y0)} A${s.r} ${s.r} 0 ${large} 0 ${x1} ${Y(y1)}`;
  };
  return /* @__PURE__ */ jsx19("svg", { className: "gob-pv-dxf", viewBox: `${b.minX - pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`, role: "img", "aria-label": `Plano con ${model.shapes.length} entidades`, fill: "none", stroke: "currentColor", strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round", children: model.shapes.map((s, i) => s.type === "LINE" ? /* @__PURE__ */ jsx19("line", { x1: s.x1, y1: Y(s.y1), x2: s.x2, y2: Y(s.y2) }, i) : s.type === "CIRCLE" ? /* @__PURE__ */ jsx19("circle", { cx: s.cx, cy: Y(s.cy), r: s.r }, i) : s.type === "ARC" ? /* @__PURE__ */ jsx19("path", { d: arc(s) }, i) : /* @__PURE__ */ jsx19("polyline", { points: s.pts.map(([x, y]) => `${x},${Y(y)}`).join(" ") + (s.closed && s.pts.length ? ` ${s.pts[0][0]},${Y(s.pts[0][1])}` : "") }, i)) });
}
function FilePreview({ file, name: nameProp, height = "28rem", toolbar = true, onDownload, className = "" }) {
  const meta = useMemo6(() => ({
    name: nameProp || file?.name || "archivo",
    type: file?.type || "",
    size: file?.size ?? null,
    url: file?.url || null
  }), [file, nameProp]);
  const kind = previewKind(meta.name, meta.type);
  const [raw, setState] = useState10({ status: "loading" });
  const state2 = raw.file === file && raw.kind === kind ? raw : { status: "loading" };
  const [zoom, setZoom] = useState10(1);
  const [tab, setTab] = useState10(0);
  const objectUrl = useMemo6(() => file instanceof Blob ? URL.createObjectURL(file) : null, [file]);
  useEffect9(() => () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);
  const src = objectUrl || meta.url;
  useEffect9(() => {
    let off = false;
    setZoom(1);
    setTab(0);
    const set2 = (s) => {
      if (!off) setState({ ...s, file, kind });
    };
    const getBuffer = async () => file instanceof Blob ? file.arrayBuffer() : (await fetch(meta.url)).arrayBuffer();
    const getText = async () => file instanceof Blob ? file.text() : (await fetch(meta.url)).text();
    (async () => {
      try {
        if (["image", "pdf", "video", "audio"].includes(kind)) return set2({ status: "ready" });
        if (kind === "text") {
          const t = await getText();
          return set2({ status: "ready", text: t.length > 2e5 ? t.slice(0, 2e5) : t, cut: t.length > 2e5 });
        }
        if (kind === "csv") {
          const t = await getText();
          const rows = parseRows(t, ext(meta.name) === "tsv" ? "	" : void 0);
          return set2({ status: "ready", rows: rows.slice(0, 500), cut: rows.length > 500 });
        }
        if (kind === "docx") return set2({ status: "ready", ...await parseDocx(await getBuffer()) });
        if (kind === "xlsx") {
          const sheets = await parseXlsx(await getBuffer());
          return set2({ status: "ready", sheets });
        }
        if (kind === "pptx") return set2({ status: "ready", slides: await parsePptx(await getBuffer()) });
        if (kind === "dxf") return set2({ status: "ready", model: parseDxf(await getText()) });
        if (kind === "dwg") return set2({ status: "ready", dwg: parseDwgHeader(await getBuffer()) });
        set2({ status: "ready" });
      } catch (e) {
        set2({ status: "error", message: e?.message || "No se pudo leer el archivo" });
      }
    })();
    return () => {
      off = true;
    };
  }, [file, kind, meta.name, meta.url]);
  const download = onDownload || (() => {
    if (src) Object.assign(document.createElement("a"), { href: src, download: meta.name }).click();
  });
  const fb = (reason, extra) => /* @__PURE__ */ jsx19(Fallback, { name: meta.name, kind, size: meta.size, reason, onDownload: download, children: extra });
  let body;
  if (state2.status === "loading") body = /* @__PURE__ */ jsx19(LoadingScreen, { title: "Cargando vista previa", message: meta.name, minHeight: "100%" });
  else if (state2.status === "error") body = fb(`No se pudo generar la vista previa: ${state2.message}`);
  else if (kind === "image") body = /* @__PURE__ */ jsx19("div", { className: "gob-pv-image", children: /* @__PURE__ */ jsx19("img", { src, alt: meta.name, style: { transform: `scale(${zoom})` }, draggable: "false" }) });
  else if (kind === "pdf") body = /* @__PURE__ */ jsx19("object", { className: "gob-pv-frame", data: src, type: "application/pdf", "aria-label": meta.name, children: fb("Tu navegador no puede mostrar PDF integrados.") });
  else if (kind === "video") body = /* @__PURE__ */ jsx19("div", { className: "gob-pv-media", children: /* @__PURE__ */ jsx19("video", { src, controls: true, preload: "metadata" }) });
  else if (kind === "audio") body = /* @__PURE__ */ jsx19("div", { className: "gob-pv-media", children: /* @__PURE__ */ jsx19("audio", { src, controls: true, preload: "metadata" }) });
  else if (kind === "text") body = /* @__PURE__ */ jsxs18("pre", { className: "gob-pv-text", tabIndex: 0, children: [
    state2.text,
    state2.cut ? "\n\u2026 (archivo truncado)" : ""
  ] });
  else if (kind === "csv") body = /* @__PURE__ */ jsx19(Table, { rows: state2.rows });
  else if (kind === "docx") body = /* @__PURE__ */ jsx19("article", { className: "gob-pv-doc", dangerouslySetInnerHTML: { __html: state2.html || "<p>(documento vac\xEDo)</p>" } });
  else if (kind === "xlsx") {
    const sheets = state2.sheets || [];
    const cur = sheets[Math.min(tab, sheets.length - 1)];
    body = !cur ? fb("La planilla no tiene hojas con datos.") : /* @__PURE__ */ jsxs18("div", { className: "gob-pv-sheets", children: [
      /* @__PURE__ */ jsx19(Table, { rows: cur.rows }),
      /* @__PURE__ */ jsxs18("div", { className: "gob-pv-sheetbar", role: "tablist", "aria-label": "Hojas", children: [
        sheets.map((s, i) => /* @__PURE__ */ jsx19("button", { type: "button", role: "tab", "aria-selected": i === tab, className: i === tab ? "is-active" : "", onClick: () => setTab(i), children: s.name }, s.name + i)),
        cur.truncated && /* @__PURE__ */ jsxs18("span", { className: "gob-pv-muted", children: [
          "Se muestran las primeras ",
          cur.rows.length,
          " filas"
        ] })
      ] })
    ] });
  } else if (kind === "pptx") {
    const slides = state2.slides || [];
    const s = slides[Math.min(tab, slides.length - 1)];
    body = !s ? fb("La presentaci\xF3n no contiene diapositivas legibles.") : /* @__PURE__ */ jsxs18("div", { className: "gob-pv-slides", children: [
      /* @__PURE__ */ jsx19("div", { className: "gob-pv-slide-stage", children: /* @__PURE__ */ jsxs18("div", { className: "gob-pv-slide", "aria-live": "polite", children: [
        /* @__PURE__ */ jsx19("h3", { children: s.title }),
        /* @__PURE__ */ jsx19("ul", { children: s.lines.map((l, i) => /* @__PURE__ */ jsx19("li", { children: l }, i)) })
      ] }) }),
      /* @__PURE__ */ jsxs18("div", { className: "gob-pv-slidebar", children: [
        /* @__PURE__ */ jsx19("button", { type: "button", className: "btn btn-sm btn-outline-primary", disabled: tab === 0, onClick: () => setTab(tab - 1), "aria-label": "Diapositiva anterior", children: /* @__PURE__ */ jsx19(Icon, { name: "chevron-left" }) }),
        /* @__PURE__ */ jsxs18("span", { children: [
          "Diapositiva ",
          Math.min(tab, slides.length - 1) + 1,
          " de ",
          slides.length
        ] }),
        /* @__PURE__ */ jsx19("button", { type: "button", className: "btn btn-sm btn-outline-primary", disabled: tab >= slides.length - 1, onClick: () => setTab(tab + 1), "aria-label": "Diapositiva siguiente", children: /* @__PURE__ */ jsx19(Icon, { name: "chevron-right" }) }),
        /* @__PURE__ */ jsx19("span", { className: "gob-pv-muted ms-auto", children: "Vista de contenido (texto)" })
      ] })
    ] });
  } else if (kind === "dxf") body = /* @__PURE__ */ jsxs18("div", { className: "gob-pv-cad", children: [
    /* @__PURE__ */ jsx19(DxfView, { model: state2.model }),
    /* @__PURE__ */ jsxs18("span", { className: "gob-pv-muted", children: [
      state2.model.shapes.length,
      " entidades 2D"
    ] })
  ] });
  else if (kind === "dwg") {
    const d = state2.dwg;
    body = fb(
      "DWG es un formato binario propietario: no se puede dibujar en el navegador. Abre el archivo en AutoCAD / DWG TrueView, o exp\xF3rtalo a PDF o DXF para previsualizarlo aqu\xED.",
      /* @__PURE__ */ jsxs18("dl", { className: "gob-pv-dl", children: [
        /* @__PURE__ */ jsx19("dt", { children: "Versi\xF3n" }),
        /* @__PURE__ */ jsx19("dd", { children: d.version ? `${d.version} (${d.code})` : `No reconocida (${d.code || "sin cabecera"})` })
      ] })
    );
  } else if (kind === "legacy") body = fb(`El formato ${LEGACY_HINT[ext(meta.name)] || "Office antiguo"} no se puede previsualizar en el navegador. Gu\xE1rdalo como .docx / .xlsx / .pptx o PDF para verlo aqu\xED.`);
  else body = fb("No hay vista previa disponible para este tipo de archivo.");
  return /* @__PURE__ */ jsxs18("div", { className: `gob-pv ${className}`, children: [
    toolbar && /* @__PURE__ */ jsxs18("div", { className: "gob-pv-bar", children: [
      /* @__PURE__ */ jsx19(Icon, { name: KIND_META[kind]?.[0] || "file" }),
      /* @__PURE__ */ jsx19("span", { className: "gob-pv-name", title: meta.name, children: meta.name }),
      /* @__PURE__ */ jsx19("span", { className: "gob-pv-muted gob-pv-hide-sm", children: [KIND_META[kind]?.[1], meta.size != null && formatSize(meta.size)].filter(Boolean).join(" \xB7 ") }),
      /* @__PURE__ */ jsx19("span", { className: "gob-pv-spacer" }),
      kind === "image" && state2.status === "ready" && /* @__PURE__ */ jsxs18("span", { className: "gob-pv-zoom", children: [
        /* @__PURE__ */ jsx19("button", { type: "button", className: "btn btn-sm btn-outline-primary", onClick: () => setZoom((z) => Math.max(0.25, +(z - 0.25).toFixed(2))), "aria-label": "Alejar", children: /* @__PURE__ */ jsx19(Icon, { name: "zoom-out" }) }),
        /* @__PURE__ */ jsxs18("button", { type: "button", className: "btn btn-sm btn-outline-primary", onClick: () => setZoom(1), "aria-label": "Tama\xF1o original", children: [
          Math.round(zoom * 100),
          "%"
        ] }),
        /* @__PURE__ */ jsx19("button", { type: "button", className: "btn btn-sm btn-outline-primary", onClick: () => setZoom((z) => Math.min(4, +(z + 0.25).toFixed(2))), "aria-label": "Acercar", children: /* @__PURE__ */ jsx19(Icon, { name: "zoom-in" }) })
      ] }),
      /* @__PURE__ */ jsxs18("button", { type: "button", className: "btn btn-sm btn-outline-primary", onClick: download, children: [
        /* @__PURE__ */ jsx19(Icon, { name: "download" }),
        " ",
        /* @__PURE__ */ jsx19("span", { className: "gob-pv-hide-sm", children: "Descargar" })
      ] })
    ] }),
    /* @__PURE__ */ jsx19("div", { className: "gob-pv-body", style: { height }, children: body })
  ] });
}
function FilePreviewModal({ file, open, onClose, onDownload }) {
  return /* @__PURE__ */ jsx19(Modal, { open, onClose, size: "xl", title: "Vista previa", className: "gob-pv-modal", children: file && /* @__PURE__ */ jsx19(FilePreview, { file, height: "min(70vh, 40rem)", onDownload }) });
}

// src/react/auth/auth.jsx
import { useEffect as useEffect10, useState as useState11 } from "react";
import { Fragment as Fragment6, jsx as jsx20, jsxs as jsxs19 } from "react/jsx-runtime";
var Submit = ({ busy, children, ...rest }) => /* @__PURE__ */ jsxs19("button", { type: "submit", className: "btn btn-primary btn-block btn-compact", disabled: busy, ...rest, children: [
  busy && /* @__PURE__ */ jsx20("span", { className: "spinner-border spinner-border-sm mr-2", "aria-hidden": "true" }),
  children
] });
function AuthLayout({ title, subtitle, children, footer, aside = {}, logo = "/img/gob-footer.svg", home = "#" }) {
  return /* @__PURE__ */ jsxs19("div", { className: "auth-page", children: [
    /* @__PURE__ */ jsxs19("aside", { className: "auth-aside", children: [
      /* @__PURE__ */ jsx20("a", { href: home, children: /* @__PURE__ */ jsx20("img", { src: logo, alt: "Gobierno de Chile", style: { height: 38 } }) }),
      /* @__PURE__ */ jsxs19("div", { className: "auth-aside-body", children: [
        /* @__PURE__ */ jsx20("div", { className: "line" }),
        /* @__PURE__ */ jsx20("h2", { children: aside.title }),
        aside.text && /* @__PURE__ */ jsx20("p", { children: aside.text }),
        aside.points && /* @__PURE__ */ jsx20("ul", { children: aside.points.map((p) => /* @__PURE__ */ jsxs19("li", { children: [
          /* @__PURE__ */ jsx20(Icon, { name: "circle-check" }),
          p
        ] }, p)) })
      ] }),
      /* @__PURE__ */ jsx20("small", { children: aside.note ?? "Sitio de demostraci\xF3n construido con el framework Gob.cl." })
    ] }),
    /* @__PURE__ */ jsx20("main", { className: "auth-main", id: "contenido", children: /* @__PURE__ */ jsxs19("div", { className: "auth-card", children: [
      /* @__PURE__ */ jsx20("img", { className: "auth-mobile-logo", src: "/img/gob-header.svg", alt: "Gobierno de Chile" }),
      /* @__PURE__ */ jsx20("h1", { children: title }),
      subtitle && /* @__PURE__ */ jsx20("p", { className: "auth-subtitle", children: subtitle }),
      children,
      footer && /* @__PURE__ */ jsx20("div", { className: "auth-footer", children: footer })
    ] }) })
  ] });
}
function LoginForm({ onSubmit, links = {}, identifierLabel = "RUN o correo electr\xF3nico", onClaveUnica }) {
  const f = useForm({
    initial: { identifier: "", password: "", remember: true },
    validate: (v) => ({ ...!v.identifier.trim() && { identifier: "Ingresa tu RUN o correo" }, ...!v.password && { password: "Ingresa tu clave" } }),
    onSubmit
  });
  return /* @__PURE__ */ jsxs19("form", { onSubmit: f.handleSubmit, noValidate: true, children: [
    f.submitError && /* @__PURE__ */ jsx20(Alert, { tone: "danger", onClose: () => f.setSubmitError(""), children: f.submitError }),
    /* @__PURE__ */ jsx20(TextField, { label: identifierLabel, autoComplete: "username", autoFocus: true, ...f.bind("identifier") }),
    /* @__PURE__ */ jsx20(PasswordField, { label: "Clave", autoComplete: "current-password", ...f.bind("password") }),
    /* @__PURE__ */ jsxs19("div", { className: "auth-row", children: [
      /* @__PURE__ */ jsx20(CheckboxField, { label: "Mantener sesi\xF3n iniciada", ...f.bindCheck("remember"), className: "mb-0" }),
      links.forgot && /* @__PURE__ */ jsx20("a", { href: links.forgot, children: "\xBFOlvidaste tu clave?" })
    ] }),
    /* @__PURE__ */ jsx20(Submit, { busy: f.submitting, children: "Ingresar" }),
    onClaveUnica && /* @__PURE__ */ jsxs19(Fragment6, { children: [
      /* @__PURE__ */ jsx20("div", { className: "auth-divider", children: /* @__PURE__ */ jsx20("span", { children: "o" }) }),
      /* @__PURE__ */ jsxs19("button", { type: "button", className: "btn btn-outline-primary btn-block btn-compact", onClick: onClaveUnica, children: [
        /* @__PURE__ */ jsx20(Icon, { name: "claveunica" }),
        " Ingresar con Clave\xDAnica (simulado)"
      ] })
    ] }),
    links.register && /* @__PURE__ */ jsxs19("p", { className: "auth-alt", children: [
      "\xBFNo tienes cuenta? ",
      /* @__PURE__ */ jsx20("a", { href: links.register, children: "Reg\xEDstrate" })
    ] })
  ] });
}
function RegisterForm({ onSubmit, links = {} }) {
  const f = useForm({
    initial: { names: "", lastNames: "", run: "", email: "", phone: "", password: "", confirm: "", terms: false },
    validate: (v) => ({
      ...!v.names.trim() && { names: "Ingresa tus nombres" },
      ...!v.lastNames.trim() && { lastNames: "Ingresa tus apellidos" },
      ...!validRun(v.run) && { run: "El RUN no es v\xE1lido" },
      ...!validEmail(v.email) && { email: "Ingresa un correo v\xE1lido" },
      ...!validPhone(v.phone) && { phone: "Tel\xE9fono no v\xE1lido" },
      ...v.password.length < 8 && { password: "Debe tener al menos 8 caracteres" },
      ...v.confirm !== v.password && { confirm: "Las claves no coinciden" },
      ...!v.terms && { terms: "Debes aceptar los t\xE9rminos para continuar" }
    }),
    onSubmit
  });
  return /* @__PURE__ */ jsxs19("form", { onSubmit: f.handleSubmit, noValidate: true, children: [
    f.submitError && /* @__PURE__ */ jsx20(Alert, { tone: "danger", children: f.submitError }),
    /* @__PURE__ */ jsxs19("div", { className: "app-field-row", children: [
      /* @__PURE__ */ jsx20(TextField, { label: "Nombres", required: true, autoComplete: "given-name", ...f.bind("names") }),
      /* @__PURE__ */ jsx20(TextField, { label: "Apellidos", required: true, autoComplete: "family-name", ...f.bind("lastNames") })
    ] }),
    /* @__PURE__ */ jsxs19("div", { className: "app-field-row", children: [
      /* @__PURE__ */ jsx20(RunField, { required: true, ...f.bind("run") }),
      /* @__PURE__ */ jsx20(TextField, { label: "Tel\xE9fono (opcional)", type: "tel", autoComplete: "tel", placeholder: "+56 9 1234 5678", ...f.bind("phone") })
    ] }),
    /* @__PURE__ */ jsx20(TextField, { label: "Correo electr\xF3nico", type: "email", required: true, autoComplete: "email", ...f.bind("email") }),
    /* @__PURE__ */ jsx20(PasswordField, { label: "Clave", required: true, strength: true, autoComplete: "new-password", ...f.bind("password") }),
    /* @__PURE__ */ jsx20(PasswordField, { label: "Repite tu clave", required: true, autoComplete: "new-password", ...f.bind("confirm") }),
    /* @__PURE__ */ jsx20(CheckboxField, { label: /* @__PURE__ */ jsxs19(Fragment6, { children: [
      "Acepto los ",
      /* @__PURE__ */ jsx20("a", { href: "#terminos", children: "t\xE9rminos y condiciones" }),
      " y la pol\xEDtica de privacidad"
    ] }), ...f.bindCheck("terms") }),
    /* @__PURE__ */ jsx20(Submit, { busy: f.submitting, children: "Crear cuenta" }),
    links.login && /* @__PURE__ */ jsxs19("p", { className: "auth-alt", children: [
      "\xBFYa tienes cuenta? ",
      /* @__PURE__ */ jsx20("a", { href: links.login, children: "Inicia sesi\xF3n" })
    ] })
  ] });
}
var useCountdown = (start) => {
  const [n, setN] = useState11(0);
  useEffect10(() => {
    if (n <= 0) return void 0;
    const t = setTimeout(() => setN(n - 1), 1e3);
    return () => clearTimeout(t);
  }, [n]);
  return [n, () => setN(start)];
};
function ForgotPasswordForm({ onSubmit, links = {}, resendAfter = 30 }) {
  const [sent, setSent] = useState11(false);
  const [wait, startWait] = useCountdown(resendAfter);
  const f = useForm({
    initial: { email: "" },
    validate: (v) => validEmail(v.email) ? {} : { email: "Ingresa un correo v\xE1lido" },
    onSubmit: async (v) => {
      await onSubmit(v);
      setSent(true);
      startWait();
    }
  });
  if (sent) {
    return /* @__PURE__ */ jsxs19("div", { role: "status", children: [
      /* @__PURE__ */ jsxs19(Alert, { tone: "success", title: "Revisa tu correo", children: [
        "Si ",
        /* @__PURE__ */ jsx20("strong", { children: f.values.email }),
        " est\xE1 registrado, te enviamos las instrucciones para restablecer tu clave. El enlace vence en 30 minutos."
      ] }),
      /* @__PURE__ */ jsx20("button", { type: "button", className: "btn btn-outline-primary btn-block btn-compact", disabled: wait > 0 || f.submitting, onClick: () => f.handleSubmit(), children: wait > 0 ? `Reenviar en ${wait} s` : "Reenviar correo" }),
      links.login && /* @__PURE__ */ jsx20("p", { className: "auth-alt", children: /* @__PURE__ */ jsx20("a", { href: links.login, children: "Volver a iniciar sesi\xF3n" }) })
    ] });
  }
  return /* @__PURE__ */ jsxs19("form", { onSubmit: f.handleSubmit, noValidate: true, children: [
    f.submitError && /* @__PURE__ */ jsx20(Alert, { tone: "danger", children: f.submitError }),
    /* @__PURE__ */ jsx20("p", { className: "auth-subtitle", style: { marginTop: 0 }, children: "Escribe el correo de tu cuenta y te enviaremos un enlace para crear una nueva clave." }),
    /* @__PURE__ */ jsx20(TextField, { label: "Correo electr\xF3nico", type: "email", autoComplete: "email", autoFocus: true, ...f.bind("email") }),
    /* @__PURE__ */ jsx20(Submit, { busy: f.submitting, children: "Enviar instrucciones" }),
    links.login && /* @__PURE__ */ jsx20("p", { className: "auth-alt", children: /* @__PURE__ */ jsx20("a", { href: links.login, children: "Volver a iniciar sesi\xF3n" }) })
  ] });
}
function ResetPasswordForm({ onSubmit, links = {} }) {
  const [done, setDone] = useState11(false);
  const f = useForm({
    initial: { password: "", confirm: "" },
    validate: (v) => ({ ...v.password.length < 8 && { password: "Debe tener al menos 8 caracteres" }, ...v.confirm !== v.password && { confirm: "Las claves no coinciden" } }),
    onSubmit: async (v) => {
      await onSubmit(v);
      setDone(true);
    }
  });
  if (done) return /* @__PURE__ */ jsxs19("div", { role: "status", children: [
    /* @__PURE__ */ jsx20(Alert, { tone: "success", title: "Clave actualizada", children: "Ya puedes ingresar con tu nueva clave." }),
    links.login && /* @__PURE__ */ jsx20("a", { className: "btn btn-primary btn-block btn-compact", href: links.login, children: "Ir a iniciar sesi\xF3n" })
  ] });
  return /* @__PURE__ */ jsxs19("form", { onSubmit: f.handleSubmit, noValidate: true, children: [
    f.submitError && /* @__PURE__ */ jsx20(Alert, { tone: "danger", children: f.submitError }),
    /* @__PURE__ */ jsx20(PasswordField, { label: "Nueva clave", strength: true, autoComplete: "new-password", autoFocus: true, ...f.bind("password") }),
    /* @__PURE__ */ jsx20(PasswordField, { label: "Repite la nueva clave", autoComplete: "new-password", ...f.bind("confirm") }),
    /* @__PURE__ */ jsx20(Submit, { busy: f.submitting, children: "Guardar nueva clave" })
  ] });
}
function TwoFactorForm({ onSubmit, onResend, links = {}, destination = "tu aplicaci\xF3n autenticadora" }) {
  const [code, setCode] = useState11("");
  const [error, setError] = useState11("");
  const [busy, setBusy] = useState11(false);
  const [wait, startWait] = useCountdown(30);
  const submit = async (c = code) => {
    if (c.length < 6) {
      setError("Ingresa los 6 d\xEDgitos");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onSubmit(c);
    } catch (e) {
      setError(e?.message || "C\xF3digo incorrecto");
      setCode("");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs19("form", { onSubmit: (e) => {
    e.preventDefault();
    submit();
  }, noValidate: true, children: [
    /* @__PURE__ */ jsxs19("p", { className: "auth-subtitle", style: { marginTop: 0 }, children: [
      "Ingresa el c\xF3digo de 6 d\xEDgitos que genera ",
      destination,
      "."
    ] }),
    /* @__PURE__ */ jsx20(OtpInput, { value: code, onChange: (v) => {
      setCode(v);
      setError("");
    }, onComplete: submit, error, disabled: busy }),
    /* @__PURE__ */ jsx20(Submit, { busy, children: "Verificar" }),
    /* @__PURE__ */ jsxs19("p", { className: "auth-alt", children: [
      onResend && /* @__PURE__ */ jsx20("button", { type: "button", className: "btn btn-link btn-compact btn-sm", disabled: wait > 0, onClick: () => {
        onResend();
        startWait();
      }, children: wait > 0 ? `Reenviar c\xF3digo en ${wait} s` : "Reenviar c\xF3digo" }),
      links.login && /* @__PURE__ */ jsxs19(Fragment6, { children: [
        " \xB7 ",
        /* @__PURE__ */ jsx20("a", { href: links.login, children: "Cancelar" })
      ] })
    ] })
  ] });
}
export {
  ACCEPT,
  Alert,
  AppFooter,
  AppShell,
  AuthLayout,
  Avatar,
  Breadcrumbs,
  CheckboxField,
  Container,
  DataTable,
  DateField,
  DropdownMenu,
  EmptyState,
  Field,
  FilePreview,
  FilePreviewModal,
  FileUpload,
  FilterBar,
  Footer,
  ForgotPasswordForm,
  Icon,
  LIMITS,
  Loading,
  LoadingOverlay,
  LoadingScreen,
  LoginForm,
  Modal,
  ModalProvider,
  OtpInput,
  PageHeader,
  Pagination,
  Panel,
  PasswordField,
  ProgressBar,
  RadioGroup,
  RegisterForm,
  ResetPasswordForm,
  RunField,
  STRENGTH_LABELS,
  SearchInput,
  SelectField,
  SiteNavbar,
  Skeleton,
  SkeletonCard,
  SkeletonText,
  Spinner,
  StatCard,
  StatusBadge,
  Stepper,
  Switch,
  Tabs,
  TextField,
  TextareaField,
  ToastProvider,
  TwoFactorForm,
  attachmentIcon,
  cleanRun,
  downloadFile,
  fieldProps,
  formatRun,
  formatSize,
  kindOf,
  markActive,
  pageList,
  parseCsv,
  passwordChecks,
  passwordScore,
  previewKind,
  readAttachment,
  runDv,
  toCsv,
  useAccessibility,
  useDismiss,
  useFieldId,
  useForm,
  useModal,
  useShell,
  useToast,
  validEmail,
  validPhone,
  validRun,
  validateFiles
};
