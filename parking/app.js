import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.1/+esm";

const SUPABASE_URL = "https://tkrugleneazdeqhxxkvr.supabase.co";
const SUPABASE_KEY = "sb_publishable_1oVup3kgJeyOfHFoZeAfTw_-3TkiPib";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/nexumid-parking-validar`;
const db = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const app = document.getElementById("app");
const modalRoot = document.getElementById("modal-root");
const toastRoot = document.getElementById("toast-root");
let operador = null;
let currentToken = "";
let currentCheck = null;

const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

function toast(message) {
  toastRoot.innerHTML = `<div class="toast">${esc(message)}</div>`;
  setTimeout(() => { toastRoot.innerHTML = ""; }, 2600);
}

function chileDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago", day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false
  }).format(new Date(value));
}

function chileDay(value = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago", year:"numeric", month:"2-digit", day:"2-digit" }).format(value);
}

function baseShell(content, roleLabel) {
  return `<main class="shell">
    <header class="topbar">
      <div class="brand"><div class="brand-mark">N</div><div class="brand-copy"><strong>NEXUM<span>ID</span> PARKING</strong><small>CONTROL SIMPLE DE ESTACIONAMIENTO</small></div></div>
      <div class="top-actions"><span class="role-pill">${esc(roleLabel)}</span><button class="btn btn-secondary" id="logoutBtn">SALIR</button></div>
    </header>${content}</main>`;
}

async function logout() {
  await db.auth.signOut();
  operador = null;
  currentToken = "";
  currentCheck = null;
  renderLogin();
}

function bindLogout() {
  document.getElementById("logoutBtn")?.addEventListener("click", logout);
}

function renderLogin(message = "") {
  app.innerHTML = `<main class="shell login-wrap"><section class="card login-card">
    <div class="brand" style="margin-bottom:22px"><div class="brand-mark">N</div><div class="brand-copy"><strong>NEXUM<span>ID</span> PARKING</strong><small>ACCESO DEL PERSONAL</small></div></div>
    <h1>Ingresar</h1><p>La persona con tarjeta no necesita cuenta. Este acceso es solo para caja y administración.</p>
    ${message ? `<div class="notice error">${esc(message)}</div>` : ""}
    <form id="loginForm">
      <div class="field"><label>Correo</label><input id="email" type="email" autocomplete="email" required></div>
      <div class="field"><label>Contraseña</label><input id="password" type="password" autocomplete="current-password" required></div>
      <button class="btn btn-primary btn-block btn-big" style="margin-top:18px" type="submit">ENTRAR</button>
    </form>
  </section></main>`;

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.currentTarget.querySelector("button");
    btn.disabled = true; btn.textContent = "INGRESANDO…";
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) { renderLogin("Correo o contraseña incorrectos."); return; }
    await boot();
  });
}

async function getOperator(userId) {
  const { data, error } = await db.from("parking_operadores")
    .select("id,cliente_id,nombre,rol,activo")
    .eq("user_id", userId).eq("activo", true).maybeSingle();
  if (error) throw error;
  return data;
}

async function boot() {
  try {
    app.innerHTML = `<div class="boot-screen"><div class="brand-mark">N</div><div class="boot-copy"><strong>NexumID Parking</strong><span>Verificando acceso…</span></div></div>`;
    const { data: { session } } = await db.auth.getSession();
    if (!session) { renderLogin(); return; }
    operador = await getOperator(session.user.id);
    if (!operador) { await db.auth.signOut(); renderLogin("Esta cuenta no tiene acceso a NexumID Parking."); return; }
    if (operador.rol === "admin") await renderAdmin(); else await renderCashier();
  } catch (err) {
    console.error(err);
    renderLogin("No fue posible iniciar el panel.");
  }
}

async function callValidation(action, token) {
  const { data: { session } } = await db.auth.getSession();
  if (!session) throw new Error("La sesión expiró.");
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`,
      "apikey": SUPABASE_KEY
    },
    body: JSON.stringify({ action, token })
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok && !body?.success) throw new Error(body?.error || "No fue posible validar.");
  return body;
}

async function fetchMyRecentEvents(limit = 8) {
  const { data, error } = await db.from("parking_eventos")
    .select("id,usuario_nombre_snapshot,estacionamiento_snapshot,resultado,motivo,created_at")
    .order("created_at", { ascending:false }).limit(limit);
  if (error) throw error;
  return data || [];
}

function cashierWaiting(events) {
  const eventHtml = events.length ? events.map(e => `<div class="side-event"><strong>${esc(e.usuario_nombre_snapshot || (e.resultado === "rechazado" ? "Intento rechazado" : "Usuario"))}</strong><span>${esc(e.estacionamiento_snapshot || e.motivo || "")} · ${esc(chileDate(e.created_at))}</span></div>`).join("") : `<div class="empty">Aún no hay validaciones.</div>`;
  return baseShell(`<div class="section-title"><div><h1>Validación en caja</h1><p>Presenta la tarjeta y confirma. Nada más.</p></div></div>
    <div class="cashier-layout">
      <section class="card cashier-main">
        <div id="cashierState" class="waiting"><div><div class="scan-icon">◉</div><h2>Esperando tarjeta</h2><p>Acerca la tarjeta NFC o usa el código de prueba. Si la tarjeta abre esta página, la validación se inicia automáticamente.</p>
          <div class="token-row"><input id="manualToken" placeholder="Token de prueba"><button id="checkManual" class="btn btn-primary">CONSULTAR</button></div></div></div>
      </section>
      <aside class="card cashier-side"><strong>Últimos movimientos</strong><div class="side-list">${eventHtml}</div></aside>
    </div>`, `Caja · ${operador.nombre}`);
}

async function renderCashier() {
  const events = await fetchMyRecentEvents();
  app.innerHTML = cashierWaiting(events);
  bindLogout();
  document.getElementById("checkManual").addEventListener("click", () => {
    const token = document.getElementById("manualToken").value.trim();
    if (token) checkCard(token);
  });
  const urlToken = new URLSearchParams(location.search).get("token");
  if (urlToken) {
    history.replaceState({}, "", location.pathname);
    setTimeout(() => checkCard(urlToken), 100);
  }
}

async function checkCard(token) {
  const state = document.getElementById("cashierState");
  state.innerHTML = `<div><div class="spinner"></div><p>Verificando tarjeta…</p></div>`;
  try {
    const result = await callValidation("check", token);
    currentToken = token; currentCheck = result;
    if (result.authorized) {
      state.className = "result-card authorized";
      state.innerHTML = `<div class="result-state">● AUTORIZADO</div><h2>${esc(result.usuario.nombre)}</h2><div class="parking">${esc(result.usuario.estacionamiento)}</div>
        <div class="result-meta"><span class="chip">Horario ${esc(result.usuario.horario)}</span><span class="chip">Usos hoy ${esc(result.usuario.usos_hoy)} / ${esc(result.usuario.max_usos_dia)}</span></div>
        <div class="result-actions"><button id="confirmBtn" class="btn btn-primary btn-big">CONFIRMAR VALIDACIÓN</button><button id="cancelBtn" class="btn btn-secondary">CANCELAR</button></div>`;
      document.getElementById("confirmBtn").addEventListener("click", confirmCard);
      document.getElementById("cancelBtn").addEventListener("click", renderCashier);
    } else {
      state.className = "result-card rejected";
      state.innerHTML = `<div class="result-state">● NO AUTORIZADO</div><h2>Validación rechazada</h2><p>${esc(result.message || "Esta tarjeta no puede utilizarse.")}</p><div class="result-actions"><button id="resetBtn" class="btn btn-secondary">VOLVER</button></div>`;
      document.getElementById("resetBtn").addEventListener("click", renderCashier);
    }
  } catch (err) {
    state.className = "result-card rejected";
    state.innerHTML = `<div class="result-state">ERROR</div><h2>No se pudo verificar</h2><p>${esc(err.message)}</p><div class="result-actions"><button id="resetBtn" class="btn btn-secondary">VOLVER</button></div>`;
    document.getElementById("resetBtn").addEventListener("click", renderCashier);
  }
}

async function confirmCard() {
  const btn = document.getElementById("confirmBtn");
  btn.disabled = true; btn.textContent = "REGISTRANDO…";
  try {
    const result = await callValidation("confirm", currentToken);
    if (result.registered) {
      document.getElementById("cashierState").innerHTML = `<div style="text-align:center"><div class="scan-icon">✓</div><h2>Validación registrada</h2><p>${esc(result.usuario.nombre)} · ${esc(result.usuario.estacionamiento)}</p><p class="muted">${esc(chileDate(result.created_at))}</p></div>`;
      setTimeout(renderCashier, 1600);
      return;
    }
    throw new Error(result.message || "No se pudo registrar.");
  } catch (err) {
    toast(err.message);
    btn.disabled = false; btn.textContent = "CONFIRMAR VALIDACIÓN";
  }
}

async function adminData() {
  const [usersRes, eventsRes, spacesRes] = await Promise.all([
    db.from("parking_usuarios").select("id,nombre,telefono,email,activo,hora_inicio,hora_fin,dias_permitidos,max_usos_dia,estacionamiento_id,parking_estacionamientos(numero,nombre)").order("nombre"),
    db.from("parking_eventos").select("id,usuario_nombre_snapshot,estacionamiento_snapshot,operador_nombre_snapshot,resultado,motivo,created_at").order("created_at",{ascending:false}).limit(100),
    db.from("parking_estacionamientos").select("id,numero,nombre,activo").order("numero")
  ]);
  if (usersRes.error) throw usersRes.error;
  if (eventsRes.error) throw eventsRes.error;
  if (spacesRes.error) throw spacesRes.error;
  return { users: usersRes.data || [], events: eventsRes.data || [], spaces: spacesRes.data || [] };
}

function adminUserHtml(user) {
  const parking = Array.isArray(user.parking_estacionamientos) ? user.parking_estacionamientos[0] : user.parking_estacionamientos;
  return `<article class="user-row"><div class="user-head"><div><strong>${esc(user.nombre)}</strong><div class="user-meta"><span>${parking ? `Est. ${esc(parking.numero)}` : "Sin estacionamiento"}</span><span>${esc(String(user.hora_inicio).slice(0,5))}–${esc(String(user.hora_fin).slice(0,5))}</span><span>Máx. ${esc(user.max_usos_dia)} / día</span></div></div><span class="status ${user.activo ? "ok" : "off"}">${user.activo ? "Activo" : "Suspendido"}</span></div><div class="user-actions"><button class="btn btn-secondary editUser" data-id="${esc(user.id)}">EDITAR REGLAS</button></div></article>`;
}

function adminEventHtml(event) {
  const ok = event.resultado === "autorizado";
  return `<article class="event-row"><div class="event-head"><div><strong>${esc(event.usuario_nombre_snapshot || "Intento sin usuario")}</strong><div class="event-meta"><span>${esc(event.estacionamiento_snapshot || event.motivo || "—")}</span><span>${esc(event.operador_nombre_snapshot || "—")}</span><span>${esc(chileDate(event.created_at))}</span></div></div><span class="status ${ok ? "ok" : "reject"}">${ok ? "Autorizado" : "Rechazado"}</span></div></article>`;
}

async function renderAdmin() {
  const { users, events, spaces } = await adminData();
  const today = chileDay();
  const todayEvents = events.filter(e => chileDay(new Date(e.created_at)) === today);
  const authorized = todayEvents.filter(e => e.resultado === "autorizado").length;
  const rejected = todayEvents.filter(e => e.resultado === "rechazado").length;
  app.innerHTML = baseShell(`<div class="section-title"><div><h1>Panel de Margarita</h1><p>Control de usuarios, reglas y eventos.</p></div><button id="refreshAdmin" class="btn btn-secondary">ACTUALIZAR</button></div>
    <div class="stats"><div class="card stat"><strong>${authorized}</strong><span>Validaciones hoy</span></div><div class="card stat"><strong>${rejected}</strong><span>Rechazos hoy</span></div><div class="card stat"><strong>${users.filter(u=>u.activo).length}</strong><span>Usuarios activos</span></div></div>
    <div class="admin-grid">
      <section class="card panel-card"><div class="section-title"><div><h2>Usuarios</h2><p>Horario y máximo de usos.</p></div></div><div class="list">${users.length ? users.map(adminUserHtml).join("") : `<div class="empty">Aún no hay usuarios cargados.</div>`}</div></section>
      <section class="card panel-card"><div class="section-title"><div><h2>Eventos</h2><p>Últimos 100 movimientos.</p></div></div><div class="list">${events.length ? events.map(adminEventHtml).join("") : `<div class="empty">Aún no hay eventos.</div>`}</div></section>
    </div>`, `Admin · ${operador.nombre}`);
  bindLogout();
  document.getElementById("refreshAdmin").addEventListener("click", renderAdmin);
  document.querySelectorAll(".editUser").forEach(btn => btn.addEventListener("click", () => openUserModal(users.find(u=>u.id===btn.dataset.id), spaces)));
}

function openUserModal(user, spaces) {
  const selectedDays = new Set((user.dias_permitidos || []).map(Number));
  const dayNames = [[1,"Lun"],[2,"Mar"],[3,"Mié"],[4,"Jue"],[5,"Vie"],[6,"Sáb"],[7,"Dom"]];
  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="card modal"><h2>${esc(user.nombre)}</h2><p class="muted">Margarita puede cambiar estas reglas cuando quiera.</p>
    <div class="edit-grid"><div class="field"><label>Hora inicio</label><input id="editStart" type="time" value="${esc(String(user.hora_inicio).slice(0,5))}"></div><div class="field"><label>Hora fin</label><input id="editEnd" type="time" value="${esc(String(user.hora_fin).slice(0,5))}"></div></div>
    <div class="edit-grid"><div class="field"><label>Máximo de usos por día</label><input id="editMax" type="number" min="1" max="50" value="${esc(user.max_usos_dia)}"></div><div class="field"><label>Estacionamiento</label><select id="editParking"><option value="">Sin asignar</option>${spaces.map(s=>`<option value="${esc(s.id)}" ${s.id===user.estacionamiento_id?"selected":""}>N.º ${esc(s.numero)}</option>`).join("")}</select></div></div>
    <div class="field"><label>Días permitidos</label><div class="days">${dayNames.map(([n,label])=>`<button type="button" class="day-toggle ${selectedDays.has(n)?"active":""}" data-day="${n}">${label}</button>`).join("")}</div></div>
    <div class="field"><label>Estado</label><select id="editActive"><option value="true" ${user.activo?"selected":""}>Activo</option><option value="false" ${!user.activo?"selected":""}>Suspendido</option></select></div>
    <div id="modalMsg"></div><div class="modal-actions"><button id="closeModal" class="btn btn-secondary">CANCELAR</button><button id="saveUser" class="btn btn-primary">GUARDAR</button></div></section></div>`;
  document.querySelectorAll(".day-toggle").forEach(b => b.addEventListener("click", () => b.classList.toggle("active")));
  document.getElementById("closeModal").addEventListener("click", () => modalRoot.innerHTML = "");
  document.getElementById("saveUser").addEventListener("click", async () => {
    const start = document.getElementById("editStart").value;
    const end = document.getElementById("editEnd").value;
    const max = Number(document.getElementById("editMax").value);
    const parking = document.getElementById("editParking").value || null;
    const active = document.getElementById("editActive").value === "true";
    const days = [...document.querySelectorAll(".day-toggle.active")].map(b=>Number(b.dataset.day)).sort((a,b)=>a-b);
    if (!start || !end || !Number.isInteger(max) || max < 1 || days.length === 0) {
      document.getElementById("modalMsg").innerHTML = `<div class="notice error">Revisa horario, días y máximo de usos.</div>`; return;
    }
    const saveBtn = document.getElementById("saveUser"); saveBtn.disabled = true; saveBtn.textContent = "GUARDANDO…";
    const { error } = await db.from("parking_usuarios").update({ hora_inicio:start, hora_fin:end, max_usos_dia:max, dias_permitidos:days, estacionamiento_id:parking, activo:active, updated_at:new Date().toISOString() }).eq("id", user.id);
    if (error) { document.getElementById("modalMsg").innerHTML = `<div class="notice error">${esc(error.message)}</div>`; saveBtn.disabled=false; saveBtn.textContent="GUARDAR"; return; }
    modalRoot.innerHTML = ""; toast("Reglas actualizadas."); await renderAdmin();
  });
}

window.addEventListener("DOMContentLoaded", boot);
