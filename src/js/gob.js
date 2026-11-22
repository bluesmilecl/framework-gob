/**
 * gob-cl-tailwind · JS vanilla (sin jQuery ni Popper)
 * Compatible con los atributos del framework original: data-toggle="collapse|dropdown|tab|pill|modal", data-dismiss, etc.
 * También acepta data-gob-toggle / data-gob-target / data-gob-dismiss.
 */

const STORAGE = 'gob.cl:toolbar'
const FONT_CLASSES = ['a11y-font-0', 'a11y-font-1', 'a11y-font-2']
const FONT_SIZES = ['16px', '20px', '24px']

const attr = (el, name) => el.getAttribute(`data-gob-${name}`) ?? el.getAttribute(`data-${name}`) ?? el.getAttribute(`data-bs-${name}`)
const sel = (name) => `[data-gob-${name}],[data-${name}],[data-bs-${name}]`
const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(`gob:${name}`, { bubbles: true, detail }))
const storage = {
  get: (k) => { try { return localStorage.getItem(`${STORAGE}.${k}`) } catch { return null } },
  set: (k, v) => { try { v == null ? localStorage.removeItem(`${STORAGE}.${k}`) : localStorage.setItem(`${STORAGE}.${k}`, v) } catch { /* sin almacenamiento */ } },
}
const targetOf = (el) => {
  const t = attr(el, 'target') || el.getAttribute('href')
  if (!t || t === '#') return null
  try { return document.querySelector(t) } catch { return null }
}

/* ───────── Collapse / acordeón ───────── */
export const collapse = {
  show(panel) {
    if (!panel || panel.classList.contains('show')) return
    const parentSel = panel.getAttribute('data-parent') || panel.getAttribute('data-gob-parent')
    if (parentSel) {
      document.querySelectorAll(`${parentSel} .collapse.show`).forEach((p) => p !== panel && collapse.hide(p))
    }
    panel.classList.remove('collapse')
    panel.classList.add('collapsing')
    panel.style.height = '0px'
    requestAnimationFrame(() => { panel.style.height = `${panel.scrollHeight}px` })
    const done = () => {
      panel.classList.remove('collapsing')
      panel.classList.add('collapse', 'show')
      panel.style.height = ''
      sync(panel, true)
      emit(panel, 'shown')
    }
    reduced() ? done() : panel.addEventListener('transitionend', done, { once: true })
  },
  hide(panel) {
    if (!panel || !panel.classList.contains('show')) return
    panel.style.height = `${panel.getBoundingClientRect().height}px`
    panel.classList.remove('collapse', 'show')
    panel.classList.add('collapsing')
    void panel.offsetHeight
    panel.style.height = '0px'
    const done = () => {
      panel.classList.remove('collapsing')
      panel.classList.add('collapse')
      panel.style.height = ''
      sync(panel, false)
      emit(panel, 'hidden')
    }
    reduced() ? done() : panel.addEventListener('transitionend', done, { once: true })
  },
  toggle(panel) { panel.classList.contains('show') ? collapse.hide(panel) : collapse.show(panel) },
}
const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const sync = (panel, open) => {
  document.querySelectorAll(`${sel('toggle')}`).forEach((t) => {
    if (attr(t, 'toggle') === 'collapse' && targetOf(t) === panel) {
      t.setAttribute('aria-expanded', String(open))
      t.classList.toggle('collapsed', !open)
    }
  })
}

/* ───────── Dropdown ───────── */
export const dropdown = {
  closeAll(except) {
    document.querySelectorAll('.dropdown-menu.show').forEach((m) => {
      if (m === except) return
      m.classList.remove('show')
      m.parentElement?.classList.remove('show')
      m.parentElement?.querySelector(sel('toggle'))?.setAttribute('aria-expanded', 'false')
    })
  },
  toggle(btn) {
    const parent = btn.closest('.dropdown, .dropup') || btn.parentElement
    const menu = parent.querySelector('.dropdown-menu')
    if (!menu) return
    const open = !menu.classList.contains('show')
    dropdown.closeAll(open ? menu : null)
    menu.classList.toggle('show', open)
    parent.classList.toggle('show', open)
    btn.setAttribute('aria-expanded', String(open))
    if (open) menu.querySelector('a,button')?.focus?.({ preventScroll: true })
  },
}

/* ───────── Tabs ───────── */
export const tab = {
  show(trigger) {
    const pane = targetOf(trigger)
    if (!pane) return
    const nav = trigger.closest('.nav, [role="tablist"]')
    nav?.querySelectorAll('.active').forEach((a) => { a.classList.remove('active'); a.setAttribute?.('aria-selected', 'false') })
    nav?.querySelectorAll('[role="tab"]').forEach((t) => t.setAttribute('tabindex', '-1'))
    trigger.classList.add('active')
    trigger.setAttribute('aria-selected', 'true')
    trigger.setAttribute('tabindex', '0')
    pane.parentElement?.querySelectorAll(':scope > .tab-pane').forEach((p) => p.classList.remove('active', 'show'))
    pane.classList.add('active', 'show')
    emit(trigger, 'tab-shown', { pane })
  },
}

/* ───────── Modal ───────── */
export const modal = {
  show(el) {
    if (!el) return
    el.classList.add('show')
    el.removeAttribute('aria-hidden')
    el.setAttribute('aria-modal', 'true')
    document.body.classList.add('modal-open')
    let bd = document.querySelector('.modal-backdrop')
    if (!bd) { bd = document.createElement('div'); bd.className = 'modal-backdrop'; document.body.appendChild(bd) }
    el._returnFocus = document.activeElement
    ;(el.querySelector('[autofocus]') || el.querySelector('a,button,input,select,textarea') || el).focus?.()
    emit(el, 'modal-shown')
  },
  hide(el) {
    if (!el) return
    el.classList.remove('show')
    el.setAttribute('aria-hidden', 'true')
    el.removeAttribute('aria-modal')
    if (!document.querySelector('.modal.show')) {
      document.body.classList.remove('modal-open')
      document.querySelector('.modal-backdrop')?.remove()
    }
    el._returnFocus?.focus?.()
    emit(el, 'modal-hidden')
  },
}

/* ───────── Toolbar de accesibilidad (contraste + tamaño de fuente) ───────── */
export const toolbar = {
  index() { return Math.min(Math.max(parseInt(storage.get('index') ?? '0', 10) || 0, 0), FONT_SIZES.length - 1) },
  apply() {
    const html = document.documentElement
    const i = toolbar.index()
    html.classList.remove(...FONT_CLASSES)
    html.classList.add(FONT_CLASSES[i])
    html.style.fontSize = FONT_SIZES[i]
    html.classList.toggle('a11y-contrast', storage.get('contrast') === 'active')
    document.querySelectorAll('.toolbar-behavior-contrast').forEach((b) => {
      const on = html.classList.contains('a11y-contrast')
      b.classList.toggle('active', on)
      b.setAttribute('aria-pressed', String(on))
    })
    document.querySelectorAll('.toolbar-behavior-decrease').forEach((b) => b.classList.toggle('disabled', i === 0))
    document.querySelectorAll('.toolbar-behavior-increase').forEach((b) => b.classList.toggle('disabled', i === FONT_SIZES.length - 1))
  },
  setFont(i) { storage.set('index', String(i)); toolbar.apply(); emit(document.documentElement, 'font-change', { size: FONT_SIZES[i] }) },
  toggleContrast() {
    storage.set('contrast', document.documentElement.classList.contains('a11y-contrast') ? null : 'active')
    toolbar.apply()
  },
}

/* ───────── Contingencia ───────── */
const CONT = 'gob.cl:contingency'
export const contingency = {
  update() {
    const body = document.body
    const section = document.querySelector('section.contingency')
    if (!section) return
    const active = section.getAttribute('data-active') === 'true'
    body.classList.toggle('contingency-active', active)
    let closed = false
    try { closed = !!localStorage.getItem(`${CONT}.state`) } catch { /* noop */ }
    body.classList.toggle('contingency-closed', active && closed)
    let current = '.contingency-1'
    try { current = localStorage.getItem(`${CONT}.current`) || current } catch { /* noop */ }
    contingency.change(current, false)
  },
  change(target, persist = true) {
    document.querySelectorAll('.contingency-item').forEach((i) => i.classList.add('d-none'))
    try { document.querySelectorAll(target).forEach((i) => i.classList.remove('d-none')) } catch { return }
    document.querySelectorAll('.contingency-index .contingency-item').forEach((i) => i.classList.remove('d-none'))
    document.querySelectorAll(`.contingency-index ${target}`).forEach((i) => i.classList.add('d-none'))
    if (persist) { try { localStorage.setItem(`${CONT}.current`, target) } catch { /* noop */ } }
  },
}

/* ───────── Fondos de imagen ───────── */
const pseudoBackground = (root = document) => {
  root.querySelectorAll('.pseudo-background').forEach((el) => {
    const img = el.querySelector('.pseudo-src')
    if (img?.getAttribute('src')) {
      el.style.backgroundImage = `url("${img.getAttribute('src')}")`
      img.style.visibility = 'hidden'
    }
  })
}

/* ───────── Delegación global de eventos ───────── */
let started = false
const onClick = (e) => {
  const t = e.target.closest(`${sel('toggle')},${sel('dismiss')},.toolbar-btn,.toolbar-behavior-contrast,.toolbar-behavior-decrease,.toolbar-behavior-increase,.toolbar-toggler,.contingency-behavior-close,.contingency-behavior-open,.contingency-behavior-change,.redirecting-close`)
  if (!t) { if (!e.target.closest('.dropdown')) dropdown.closeAll(); return }

  const type = attr(t, 'toggle')
  if (type === 'collapse') { e.preventDefault(); const p = targetOf(t); p && collapse.toggle(p); return }
  if (type === 'dropdown') { e.preventDefault(); dropdown.toggle(t); return }
  if (type === 'tab' || type === 'pill') { e.preventDefault(); tab.show(t); return }
  if (type === 'modal') { e.preventDefault(); modal.show(targetOf(t)); return }

  const dismiss = attr(t, 'dismiss')
  if (dismiss === 'modal') { modal.hide(t.closest('.modal')); return }
  if (dismiss === 'alert') { const a = t.closest('.alert'); a?.remove(); return }

  if (t.matches('.toolbar-behavior-contrast')) { e.preventDefault(); toolbar.toggleContrast(); return }
  if (t.matches('.toolbar-behavior-decrease')) { e.preventDefault(); if (!t.classList.contains('disabled')) toolbar.setFont(toolbar.index() - 1); return }
  if (t.matches('.toolbar-behavior-increase')) { e.preventDefault(); if (!t.classList.contains('disabled')) toolbar.setFont(toolbar.index() + 1); return }
  if (t.matches('.toolbar-toggler')) { e.preventDefault(); t.closest('.toolbar')?.classList.toggle('active'); return }

  if (t.matches('.contingency-behavior-close')) { try { localStorage.setItem(`${CONT}.state`, 'active') } catch { /* noop */ } document.body.classList.add('contingency-closed'); return }
  if (t.matches('.contingency-behavior-open')) { try { localStorage.removeItem(`${CONT}.state`) } catch { /* noop */ } document.body.classList.remove('contingency-closed'); return }
  if (t.matches('.contingency-behavior-change')) { e.preventDefault(); contingency.change(t.getAttribute('data-target')); return }
  if (t.matches('.redirecting-close')) { e.preventDefault(); t.closest('.redirecting')?.classList.remove('show') }
}

const onKey = (e) => {
  if (e.key === 'Escape') {
    dropdown.closeAll()
    const m = document.querySelector('.modal.show')
    if (m) modal.hide(m)
    return
  }
  // Navegación con flechas en tabs (patrón WAI-ARIA)
  const tabEl = e.target.closest?.('[role="tab"]')
  if (tabEl && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
    const tabs = [...tabEl.closest('[role="tablist"]').querySelectorAll('[role="tab"]:not(.disabled)')]
    let i = tabs.indexOf(tabEl)
    i = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : tabs.length - 1
    e.preventDefault()
    tabs[i].focus()
    tab.show(tabs[i])
  }
}

export const init = (root = document) => {
  pseudoBackground(root)
  if (started) return
  started = true
  document.addEventListener('click', onClick)
  document.addEventListener('keydown', onKey)
  document.querySelectorAll(sel('toggle')).forEach((t) => {
    if (attr(t, 'toggle') === 'collapse' && !t.hasAttribute('aria-expanded')) {
      const p = targetOf(t)
      t.setAttribute('aria-expanded', String(!!p?.classList.contains('show')))
    }
  })
  toolbar.apply()
  contingency.update()
}

if (typeof document !== 'undefined') {
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => init()) : init()
}

export default { init, collapse, dropdown, tab, modal, toolbar, contingency }
