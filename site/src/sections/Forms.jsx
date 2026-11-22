import Section from '../components/Section.jsx'
import Example from '../components/Example.jsx'

export function Formularios() {
  return (
    <Section id="formularios" title="Formularios" lead="Controles con la apariencia oficial: borde recto, foco azul, validación y marcadores personalizados.">
      <Example html={`<form class="row" onsubmit="return false">
        <div class="col-md-6 form-group"><label for="f-name">Nombre</label><input id="f-name" class="form-control" placeholder="Ej: María González"></div>
        <div class="col-md-6 form-group"><label for="f-mail">Correo electrónico</label><input id="f-mail" type="email" class="form-control is-invalid" value="correo@"><div class="invalid-feedback">Ingresa un correo válido.</div></div>
        <div class="col-md-6 form-group"><label for="f-sel">Región</label><select id="f-sel" class="form-control"><option>Metropolitana</option><option>Valparaíso</option><option>Biobío</option></select></div>
        <div class="col-md-6 form-group"><label for="f-dis">Deshabilitado</label><input id="f-dis" class="form-control" value="No editable" disabled></div>
        <div class="col-12 form-group"><label for="f-txt">Mensaje</label><textarea id="f-txt" class="form-control" rows="3"></textarea></div>
        <div class="col-md-6 form-group">
          <div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="c1" checked><label class="custom-control-label" for="c1">Acepto los términos y condiciones</label></div>
          <div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="c2"><label class="custom-control-label" for="c2">Quiero recibir novedades</label></div></div>
        <div class="col-md-6 form-group">
          <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" name="r" id="r1" checked><label class="custom-control-label" for="r1">Persona natural</label></div>
          <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" name="r" id="r2"><label class="custom-control-label" for="r2">Persona jurídica</label></div></div>
        <div class="col-md-6 form-group"><div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" id="sw1"><label class="custom-control-label" for="sw1">Notificaciones por correo</label></div></div>
        <div class="col-md-6 form-group"><label for="rng">Rango</label><input type="range" class="custom-range" id="rng"></div>
        <div class="col-12 form-group"><label>Archivo</label><div class="custom-file"><input type="file" class="custom-file-input" id="cf"><label class="custom-file-label" for="cf" data-browse="Seleccionar">Escoge un archivo</label></div></div>
        <div class="col-12"><button class="btn btn-primary" type="submit">Enviar</button></div></form>`} />
      <h3>Grupo de input</h3>
      <Example html={`<div class="input-group" style="max-width:26rem"><div class="input-group-prepend"><span class="input-group-text">RUN</span></div><input class="form-control" placeholder="12.345.678-9" aria-label="RUN"><div class="input-group-append"><button class="btn btn-primary" style="min-height:0;padding-block:.375rem">Validar</button></div></div>`} />
    </Section>
  )
}

export function Nuevos() {
  return (
    <Section id="nuevos" title="Componentes nuevos (Bootstrap 6)" lead={<>Capa opcional con los componentes nuevos de <strong>Bootstrap 6</strong> (<code>6.0.0-alpha.1</code>, pre-lanzamiento), reteñidos con la paleta oficial y esquinas rectas. Solo incluye clases sin equivalente en Bootstrap 4/gob.cl, así que no altera el core verificado. Requiere <code>gob-cl-tailwind/next.css</code> y <code>gob-cl-tailwind/next/js</code> (atributos <code>data-bs-*</code>).</>}>
      <h3>Botones nuevos y tema</h3>
      <Example html={`<div class="flex flex-wrap gap-2">
        <button class="btn-solid theme-primary">Primary</button><button class="btn-solid theme-secondary">Secondary</button><button class="btn-solid theme-success">Success</button>
        <button class="btn-solid theme-warning">Warning</button><button class="btn-solid theme-danger">Danger</button><button class="btn-subtle theme-primary">Subtle</button><button class="btn-solid theme-inverse">Inverse</button></div>`} />
      <h3>Dialog y Drawer (elemento nativo &lt;dialog&gt;)</h3>
      <Example html={`<div class="flex flex-wrap gap-2">
        <button type="button" class="btn-solid theme-primary" data-bs-toggle="dialog" data-bs-target="#dlgDemo">Abrir dialog</button>
        <button type="button" class="btn-subtle theme-primary" data-bs-toggle="drawer" data-bs-target="#drwDemo" aria-controls="drwDemo">Abrir drawer</button></div>
      <dialog class="dialog" id="dlgDemo" aria-labelledby="dlgTitle">
        <div class="dialog-header"><h1 class="dialog-title" id="dlgTitle">Confirmar trámite</h1><button type="button" class="btn-close" data-bs-dismiss="dialog" aria-label="Cerrar"></button></div>
        <div class="dialog-body"><p>Usa el elemento <code>&lt;dialog&gt;</code> del navegador: foco, ESC y accesibilidad nativos.</p></div>
        <div class="dialog-footer"><button type="button" class="btn-solid theme-secondary" data-bs-dismiss="dialog">Cancelar</button><button type="button" class="btn-solid theme-primary" data-bs-dismiss="dialog">Continuar</button></div></dialog>
      <dialog class="drawer drawer-end" tabindex="-1" id="drwDemo" aria-labelledby="drwTitle">
        <div class="drawer-header"><h5 class="drawer-title" id="drwTitle">Filtros</h5><button type="button" class="btn-close" data-bs-dismiss="drawer" aria-label="Cerrar"></button></div>
        <div class="drawer-body"><p>Panel lateral (también <code>drawer-start</code>, <code>drawer-top</code>, <code>drawer-bottom</code>).</p></div>
        <div class="drawer-footer"><button type="button" class="btn-solid theme-primary" data-bs-dismiss="drawer">Aplicar</button></div></dialog>`} />
      <h3>Menu (reemplaza al dropdown)</h3>
      <Example html={`<div style="min-height:17rem"><button class="btn-solid theme-secondary" type="button" data-bs-toggle="menu" aria-expanded="false">Opciones</button>
      <div class="menu"><h6 class="menu-header">Mi cuenta</h6><a class="menu-item" href="#">Perfil</a><a class="menu-item active" href="#" aria-current="true">Mis trámites</a><a class="menu-item disabled" aria-disabled="true">Deshabilitado</a>
        <hr class="menu-divider"><button class="menu-item selected" type="button">Español <span class="cl cl-ok menu-item-check"></span></button>
        <div class="submenu"><button class="menu-item" type="button">Más opciones</button><div class="menu"><a class="menu-item" href="#">Ayuda</a><a class="menu-item" href="#">Contacto</a></div></div></div></div>`} />
      <h3>Stepper, avatar y chips</h3>
      <Example html={`<ol class="stepper stepper-horizontal mb-4"><li class="stepper-item theme-success active">Identificación</li><li class="stepper-item theme-primary active">Datos personales</li><li class="stepper-item theme-secondary">Confirmación</li></ol>
      <div class="flex flex-wrap items-center gap-4">
        <span class="avatar theme-primary">MG</span><span class="avatar avatar-subtle theme-success avatar-lg">JP</span><span class="avatar theme-secondary avatar-xl">+5</span>
        <span class="avatar"><span>CS</span><span class="avatar-status status-online" role="img" aria-label="En línea"></span></span>
        <div class="avatar-stack"><span class="avatar theme-primary">A</span><span class="avatar theme-accent">B</span><span class="avatar theme-success">C</span></div>
        <span class="chip">Salud</span><span class="chip">Educación <button type="button" class="chip-dismiss" aria-label="Quitar"><span class="cl cl-close"></span></button></span></div>`} />
      <h3>Campos: field, switch, check, radio, chips, OTP, fuerza de clave</h3>
      <Example html={`<div class="row"><div class="col-md-6">
        <div class="form-field"><div class="switch"><input type="checkbox" id="nsw" role="switch" switch></div><label for="nsw">Notificaciones por correo</label></div>
        <div class="form-field"><div class="check"><input type="checkbox" id="nck" checked></div><label for="nck">Acepto los términos</label></div>
        <div class="form-field"><div class="radio"><input type="radio" name="nr" id="nr1" checked></div><label for="nr1">Persona natural</label></div>
        <div class="form-field"><div class="radio"><input type="radio" name="nr" id="nr2"></div><label for="nr2">Persona jurídica</label></div></div>
      <div class="col-md-6"><label class="form-label" for="otp1">Código de verificación</label>
        <div class="otp mb-3" data-bs-otp><input type="text" class="otp-input" id="otp1" maxlength="6" aria-label="Código de verificación"></div>
        <label for="pw1" class="form-label">Clave</label><input type="password" class="form-control" id="pw1" placeholder="Ingresa tu clave">
        <div class="strength mt-2" data-bs-strength><div class="strength-segment"></div><div class="strength-segment"></div><div class="strength-segment"></div><div class="strength-segment"></div></div><span class="strength-text"></span></div></div>
      <div class="chip-input theme-primary mt-3" data-bs-chips><label class="chip-input-label" for="skills">Temas:</label><span class="chip">Salud</span><input type="text" class="form-ghost" id="skills" placeholder="Agregar…"></div>`} />
      <h3>Combobox y datepicker</h3>
      <Example html={`<div class="row" style="min-height:22rem"><div class="col-md-6"><label class="form-label">Región</label>
        <button class="form-control combobox-toggle" type="button" data-bs-toggle="combobox" data-bs-name="region" data-bs-placeholder="Selecciona una región…"><span class="combobox-value">Selecciona una región…</span><span class="cl cl-m-arrow-down combobox-caret"></span></button>
        <div class="menu"><button class="menu-item" type="button" data-bs-value="rm">Metropolitana</button><button class="menu-item" type="button" data-bs-value="v">Valparaíso</button><button class="menu-item" type="button" data-bs-value="b">Biobío</button></div></div>
        <div class="col-md-6"><label for="dp1" class="form-label">Fecha</label><input type="text" class="form-control" id="dp1" data-bs-toggle="datepicker" autocomplete="off" placeholder="Elige una fecha…"></div></div>`} />
      <p><small>Las clases <code>btn-solid</code>/<code>btn-subtle</code>/<code>btn-close</code> y <code>theme-*</code> son de Bootstrap 6 y conviven con <code>.btn-primary</code> (Bootstrap 4/gob.cl). Al ser un alpha, la API puede cambiar.</small></p>
    </Section>
  )
}
