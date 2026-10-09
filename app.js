// ==========================================
// NEXUMID - PERFIL PÚBLICO
// Identidad Digital Vehicular
// ==========================================

const SUPABASE_URL = "https://tkrugleneazdeqhxxkvr.supabase.co";
const SUPABASE_KEY = "sb_publishable_1oVup3kgJeyOfHFoZeAfTw_-3TkiPib";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const parametros = new URLSearchParams(window.location.search);
const PATENTE = (parametros.get("patente") || "").trim().toUpperCase();

let vehiculoActual = null;
let documentosActuales = [];
let accesoAutorizado = false;

const TIPOS_DOCUMENTOS = [
    { tipo: "soap", nombre: "SOAP", icono: "🛡️", protegido: false },
    { tipo: "revision_tecnica", nombre: "Revisión Técnica", icono: "🔧", protegido: false },
    { tipo: "permiso_circulacion", nombre: "Permiso de Circulación", icono: "📄", protegido: false },
    { tipo: "certificado_gases", nombre: "Certificado de Gases", icono: "📋", protegido: false },
    { tipo: "padron", nombre: "Padrón", icono: "🔐", protegido: true }
];

document.addEventListener("DOMContentLoaded", iniciarNexumID);

function iniciarNexumID() {
    if (PATENTE) {
        mostrarPantallaPIN();
        return;
    }
    mostrarLandingComercial();
}

function mostrarLandingComercial() {
    const app = document.querySelector(".app");
    if (!app) return;
    document.title = "NexumID | Tecnología que conecta";
    app.innerHTML = `
    <div class="landing" id="inicio">
      <header class="landing-header">
        <a href="#inicio" aria-label="NexumID, inicio"><span class="nx-wordmark">Nexum<span>ID</span></span><span class="nx-brand-caption">by Smart Box Connect</span></a>
        <nav class="nx-nav" aria-label="Navegación principal"><a href="#soluciones">Soluciones</a><a href="#proyectos">Proyectos</a><a href="#accesos">Acceso clientes</a></nav>
      </header>
      <section class="landing-hero nx-hero">
        <div class="nx-hero-copy"><span class="landing-kicker">SOLUCIONES DIGITALES · CHILE</span>
        <h1>Información a mano.<br>Gestión más simple.</h1>
        <p class="landing-lead">Creamos herramientas para acceder a tus documentos, gestionar estacionamientos y atender pedidos en alojamientos. Todo explicado de forma clara y pensado para el uso diario.</p>
        <div class="landing-actions"><a class="landing-primary" href="#soluciones">Ver soluciones</a><a class="landing-secondary" href="#accesos">Acceso clientes</a></div>
        <p class="nx-origin">NexumID by Smart Box Connect · Chile</p></div>
        <aside class="nx-overview" aria-label="Soluciones NexumID"><div class="nx-overview-heading"><span>NEXUMID</span><span>Soluciones digitales</span></div><div class="nx-overview-row"><span class="nx-overview-icon">01</span><div><strong>Documentos</strong><small>Vehículos e información de salud</small></div></div><div class="nx-overview-row"><span class="nx-overview-icon">02</span><div><strong>Control de accesos</strong><small>Usuarios y estacionamientos</small></div></div><div class="nx-overview-row"><span class="nx-overview-icon">03</span><div><strong>Atención y experiencia</strong><small>Pedidos QR y pantallas en habitaciones</small></div></div><p>Una herramienta para cada necesidad.</p></aside>
      </section>
      <section id="soluciones" class="landing-section landing-dark">
        <span class="landing-kicker">QUÉ HACEMOS</span><h2>Una solución para cada necesidad.</h2>
        <p class="landing-section-copy">Elige lo que necesitas resolver. Te mostramos cómo funciona y acordamos contigo la instalación y el soporte.</p>
        <div class="nx-solutions">
          <article class="nx-solution"><span class="nx-number">01 / NFC + QR</span><h3>Identidad Vehicular</h3><p>La documentación de tu vehículo, conectada. Un perfil digital accesible desde tu tarjeta NFC o código QR.</p><ul><li>SOAP y permiso de circulación</li><li>Revisión técnica, certificado de gases y padrón</li><li>Acceso con PIN y enlaces temporales a documentos</li></ul><a href="#vehicular" class="nx-link">Conocer Identidad Vehicular ↗</a></article>
          <article class="nx-solution"><span class="nx-number">02 / PORTAL EN PILOTO</span><h3>NexumID Salud</h3><p>Reúne documentos de salud y comparte la información que tú decidas. El portal se encuentra en etapa piloto.</p><ul><li>Documentos y opciones de acceso compartido</li><li>Perfil de emergencia según la decisión del titular</li><li>Portal instalable en equipos compatibles</li></ul><a href="salud.html" class="nx-link">Ingresar a Salud ↗</a></article>
          <article class="nx-solution"><span class="nx-number">03 / PILOTO DE CONTROL</span><h3>NexumID Parking</h3><p>Registra quién usa el estacionamiento y cuándo. Administra usuarios y revisa los accesos desde un panel. Disponible como piloto.</p><ul><li>Usuarios, tarjetas y reglas de uso</li><li>Eventos con operador, fecha y hora de Chile</li><li>Consulta y confirmación de validaciones</li></ul><a href="parking/" class="nx-link">Ingresar a Parking ↗</a></article>
          <article class="nx-solution"><span class="nx-number">04 / ALOJAMIENTOS</span><h3>Soluciones para alojamientos</h3><p>Tus huéspedes pueden consultar la carta y hacer pedidos desde un QR. El personal los recibe en su aplicación. También personalizamos la pantalla de inicio del televisor.</p><ul><li>Carta QR por habitación y gestión de pedidos</li><li>Estados y notificaciones al personal</li><li>Pantalla de inicio con tu marca y aplicaciones</li></ul><a href="#proyectos" class="nx-link">Conocer el proyecto ↗</a></article>
        </div>
      </section>
      <section id="vehicular" class="landing-section">
        <span class="landing-kicker">IDENTIDAD DIGITAL VEHICULAR</span><h2>La documentación de tu vehículo, conectada.</h2>
        <p class="landing-section-copy">El servicio con el que comenzó NexumID. Consulta la documentación asociada a tu vehículo desde tu tarjeta y conserva el control de acceso mediante PIN.</p>
        <div class="landing-grid"><article><b>01</b><h3>Acerca o escanea</h3><p>Abre el enlace de la tarjeta NFC o QR asociada al vehículo.</p></article><article><b>02</b><h3>Ingresa tu PIN</h3><p>El perfil documental solicita tu PIN de cuatro dígitos.</p></article><article><b>03</b><h3>Consulta tus documentos</h3><p>Los accesos temporales se generan al abrir los archivos disponibles.</p></article></div>
        <div class="landing-docs"><span>SOAP</span><span>PERMISO DE CIRCULACIÓN</span><span>REVISIÓN TÉCNICA</span><span>CERTIFICADO DE GASES</span><span>PADRÓN</span></div>
      </section>
      <section id="proyectos" class="landing-section landing-dark">
        <span class="landing-kicker">IMPLEMENTACIÓN EN TERRENO</span><h2>Soluciones para la operación diaria.</h2>
        <div class="nx-case"><div><span class="nx-number">PROYECTO DE ALOJAMIENTO</span><h3>Una experiencia conectada desde la habitación.</h3><p>El proyecto reúne carta QR, gestión de pedidos y notificaciones al personal con una pantalla de inicio personalizada para los equipos de las habitaciones.</p><p>La pantalla de inicio personalizada ya fue instalada y probada en nueve habitaciones. Los pedidos QR y la aplicación del personal se cotizan por separado.</p></div><div class="nx-case-facts"><strong>9</strong><span>habitaciones con pantalla personalizada</span><div class="landing-security-row"><span>CARTA QR</span><span>GESTIÓN DE PEDIDOS</span><span>PANTALLA PERSONALIZADA</span></div></div></div>
      </section>
      <section id="accesos" class="landing-section">
        <span class="landing-kicker">CLIENTES Y OPERADORES</span><h2>Accede a tu plataforma.</h2>
        <p class="landing-section-copy">Si ya tienes un servicio NexumID, ingresa aquí con tu cuenta o utiliza tu tarjeta.</p>
        <div class="nx-access-grid"><article class="nx-access"><h3>Salud</h3><p>Portal de documentos y perfil personal.</p><a href="salud.html" class="nx-link">Abrir portal ↗</a></article><article class="nx-access"><h3>Parking</h3><p>Acceso para caja y administración.</p><a href="parking/" class="nx-link">Abrir Parking ↗</a></article><article class="nx-access"><h3>Vehicular</h3><p>Escanea tu tarjeta o abre tu perfil por patente. El acceso a documentos seguirá solicitando el PIN.</p><form class="nx-plate-form" action="./" method="get"><label for="nx-patente">Patente del vehículo</label><div><input id="nx-patente" name="patente" required maxlength="12" pattern=".*\\S.*" autocomplete="off" spellcheck="false" placeholder="AB-CD-12"><button type="submit">ABRIR</button></div></form></article></div>
        <details class="nx-admin"><summary>Accesos de administración</summary><div><a href="admin.html">Administración Vehicular ↗</a><a href="salud-admin.html">Administración de Salud ↗</a></div></details>
      </section>
      <section class="landing-section landing-dark" id="nosotros"><span class="landing-kicker">NEXUMID BY SMART BOX CONNECT</span><h2>Desarrollo cercano. Aplicación práctica.</h2><p class="landing-section-copy">NexumID es la línea de soluciones tecnológicas de Smart Box Connect. Desarrollamos desde Chile y trabajamos sobre necesidades concretas: acceder a información, simplificar tareas y conectar los equipos con la operación de cada negocio.</p><div class="landing-grid"><article><b>ENTENDER</b><h3>Definir la necesidad</h3><p>Identificamos quién usará la herramienta y qué debe resolver.</p></article><article><b>PROBAR</b><h3>Validar el uso</h3><p>Comprobamos el flujo en los equipos y las condiciones del proyecto.</p></article><article><b>IMPLEMENTAR</b><h3>Acordar el alcance</h3><p>Definimos funcionalidades, instalación y soporte antes de extender la solución.</p></article></div></section>
      <section class="landing-section nx-faq"><span class="landing-kicker">ANTES DE COMENZAR</span><h2>Preguntas frecuentes</h2><details><summary>¿La tarjeta guarda mis documentos?</summary><p>La tarjeta NFC y el QR abren un enlace al servicio. Los documentos se gestionan en la plataforma asociada.</p></details><details><summary>¿Necesito NFC en mi teléfono?</summary><p>Para leer una tarjeta acercando el teléfono necesitas NFC compatible. El QR ofrece otra forma de abrir el enlace desde la cámara.</p></details><details><summary>¿Qué información puede ver otra persona?</summary><p>Depende del servicio y sus permisos. Vehicular requiere PIN para consultar documentos. En Salud, el titular define la información de emergencia pública y los accesos compartidos.</p></details><details><summary>¿Se puede personalizar cualquier televisor?</summary><p>La compatibilidad depende del sistema, el modelo y sus restricciones. Se prueba el dispositivo antes de confirmar la instalación.</p></details><details><summary>¿Los servicios tienen el mismo precio?</summary><p>No. Las tarjetas, los sistemas y los launchers tienen alcances distintos. La cotización depende de las unidades, funcionalidades e implementación acordadas.</p></details></section>
      <section class="landing-cta"><span class="landing-kicker">TU PRÓXIMO PROYECTO</span><h2>¿Qué necesitas conectar?</h2><p>Cuéntanos qué tarea quieres resolver, cuántas personas o equipos usarán la solución y qué tienes instalado hoy. Con esa información podemos definir una implementación y su cotización.</p><p class="nx-contact-note">Contacta a NexumID o Smart Box Connect para solicitar una propuesta.</p><div class="landing-slogan">Tecnología que conecta.</div></section>
      <footer class="landing-footer"><span class="nx-wordmark">Nexum<span>ID</span></span><div>NEXUMID · SOLUCIONES TECNOLÓGICAS</div><small>Una marca de Smart Box Connect · Chile</small><div class="nx-footer-links"><a href="#soluciones">Soluciones</a><a href="#accesos">Acceso clientes</a><a href="#inicio">Volver arriba ↑</a></div></footer>
    </div>`;
}

function escapeHtml(text) {
    return String(text ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================
// PANTALLA PIN
// ==========================================
function mostrarPantallaPIN() {
    const app = document.querySelector(".app");
    if (!app) return;

    app.innerHTML = `
        <div class="pin-screen">
            <div class="pin-brand">
                <img
                    src="logo-nexumid.png"
                    alt="NexumID - Identidad Vehicular"
                    class="pin-brand-logo"
                >
            </div>

            <div class="pin-card">
                <div class="security-badge">🔐</div>
                <div class="pin-eyebrow">ACCESO PRIVADO</div>
                <h1>Información protegida</h1>
                <p>Ingresa el PIN de 4 dígitos para acceder a la documentación digital del vehículo.</p>

                <div class="plate-label">PATENTE</div>
                <div class="pin-patente">${escapeHtml(PATENTE)}</div>

                <input
                    id="pin-input"
                    class="pin-input"
                    type="tel"
                    inputmode="numeric"
                    maxlength="4"
                    autocomplete="off"
                    placeholder="••••"
                    aria-label="PIN de acceso"
                />

                <button id="pin-button" class="modal-action" type="button">
                    ACCEDER
                </button>

                <div id="pin-error" class="pin-error"></div>
            </div>

            <div class="pin-help">
                El acceso está protegido por PIN.<br>
                NexumID · by Smart Box Connect
            </div>
        </div>
    `;

    const input = document.getElementById("pin-input");
    const button = document.getElementById("pin-button");

    input?.focus();

    input?.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 4);
    });

    input?.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && this.value.length === 4) {
            validarPIN();
        }
    });

    button?.addEventListener("click", validarPIN);
}

// ==========================================
// VALIDAR PIN
// ==========================================
async function validarPIN() {
    const input = document.getElementById("pin-input");
    const button = document.getElementById("pin-button");

    if (!input) return;

    const pin = input.value.trim();

    if (!/^\d{4}$/.test(pin)) {
        mostrarErrorPIN("Ingresa un PIN válido de 4 dígitos.");
        return;
    }

    if (button) {
        button.disabled = true;
        button.textContent = "VERIFICANDO...";
    }

    mostrarErrorPIN("");

    try {
        const { data, error } = await db.functions.invoke("nexumid-pin", {
            body: {
                patente: PATENTE,
                pin: pin
            }
        });

        if (error) {
            console.error("Error Edge Function:", error);
            let mensaje = "No fue posible verificar el PIN.";
            const respuesta = error.context;

            if (respuesta && [400, 401, 403, 404, 409, 429].includes(respuesta.status)) {
                try {
                    const detalle = await respuesta.clone().json();
                    if (typeof detalle.error === "string") mensaje = detalle.error;
                } catch (_) {}
            }

            mostrarErrorPIN(mensaje);
            return;
        }

        if (!data || data.success !== true) {
            mostrarErrorPIN(data?.error || "PIN incorrecto.");
            return;
        }

        accesoAutorizado = true;
        vehiculoActual = data.vehiculo || null;
        documentosActuales = data.documentos || [];

        mostrarPerfil();

    } catch (error) {
        console.error("Error:", error);
        mostrarErrorPIN("Ocurrió un error. Intenta nuevamente.");

    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = "ACCEDER";
        }
    }
}

function mostrarErrorPIN(mensaje) {
    const box = document.getElementById("pin-error");
    if (box) box.textContent = mensaje || "";
}

// ==========================================
// PERFIL
// ==========================================
function mostrarPerfil() {
    const app = document.querySelector(".app");

    if (!app || !vehiculoActual) return;

    const nombreVehiculo =
        `${vehiculoActual.marca || ""} ${vehiculoActual.modelo || ""}`.trim();

    const fotoUrl = vehiculoActual.foto_url || "";

    app.innerHTML = `
        <header class="topbar">
            <div class="brand">
                <img
                    src="logo-nexumid.png"
                    alt="NexumID - Identidad Vehicular"
                    class="brand-logo"
                >
            </div>

            <div class="status-pill">
                <span class="status-dot"></span>
                ACCESO AUTORIZADO
            </div>
        </header>

        <main>
            <section
                class="vehicle-hero"
                style="
                    position:relative;
                    min-height:270px;
                    display:flex;
                    flex-direction:column;
                    justify-content:flex-end;
                    overflow:hidden;
                "
            >
                ${
                    fotoUrl
                    ? `
                        <div
                            style="
                                position:absolute;
                                inset:0;
                                background-image:url('${escapeHtml(fotoUrl)}');
                                background-size:cover;
                                background-position:center;
                                opacity:.40;
                                filter:saturate(.9);
                                transform:scale(1.02);
                            "
                        ></div>

                        <div
                            style="
                                position:absolute;
                                inset:0;
                                background:
                                    linear-gradient(
                                        to bottom,
                                        rgba(5,8,13,.10) 0%,
                                        rgba(5,8,13,.22) 38%,
                                        rgba(13,20,32,.88) 100%
                                    );
                            "
                        ></div>
                    `
                    : `
                        <div
                            style="
                                position:absolute;
                                right:28px;
                                top:55px;
                                font-size:70px;
                                opacity:.20;
                            "
                        >🚗</div>
                    `
                }

                <div
                    class="hero-glow"
                    style="
                        position:absolute;
                        inset:0;
                        pointer-events:none;
                    "
                ></div>

                <div
                    class="vehicle-copy"
                    style="
                        position:relative;
                        z-index:2;
                        padding:28px 36px 8px;
                    "
                >
                    <span class="eyebrow">VEHÍCULO IDENTIFICADO</span>

                    <h1
                        style="
                            margin-top:8px;
                            font-size:32px;
                            letter-spacing:4px;
                            color:#fff;
                            text-shadow:0 2px 12px rgba(0,0,0,.65);
                        "
                    >
                        ${escapeHtml(vehiculoActual.patente)}
                    </h1>

                    <p
                        style="
                            margin-top:6px;
                            color:#d1d9e4;
                            font-size:17px;
                            text-shadow:0 1px 8px rgba(0,0,0,.7);
                        "
                    >
                        ${escapeHtml(nombreVehiculo || "Vehículo registrado")}
                    </p>
                </div>

                <div
                    class="vehicle-tags"
                    style="
                        position:relative;
                        z-index:2;
                        display:flex;
                        gap:8px;
                        flex-wrap:wrap;
                        padding:10px 36px 26px;
                    "
                >
                    <span>✓ IDENTIDAD VERIFICADA</span>
                    <span>${escapeHtml(vehiculoActual.anio || "")}</span>
                    ${
                        vehiculoActual.color
                        ? `<span>${escapeHtml(vehiculoActual.color)}</span>`
                        : ""
                    }
                </div>
            </section>

            <section class="documents-section">
                <div class="section-heading">
                    <div>
                        <span class="eyebrow">DOCUMENTACIÓN</span>
                        <h2>Documentos del vehículo</h2>
                    </div>

                    <div class="secure-mini">🔒 PROTEGIDO</div>
                </div>

                <div id="document-summary" class="doc-summary"></div>
                <div id="documents-list" class="documents-list"></div>
            </section>

            <section class="quick-section">
                <div class="quick-card" id="btnContacto">
                    <div class="quick-icon">☎</div>
                    <div>
                        <strong>Contacto de emergencia</strong>
                        <small>Acceso rápido</small>
                    </div>
                    <span>›</span>
                </div>

                <div class="quick-card" id="btnInfo">
                    <div class="quick-icon">🚘</div>
                    <div>
                        <strong>Datos del vehículo</strong>
                        <small>Información registrada</small>
                    </div>
                    <span>›</span>
                </div>
            </section>
        </main>

        <footer>
            <div class="footer-logo">Nexum<span>ID</span></div>
            <div>IDENTIDAD DIGITAL VEHICULAR</div>
            <small>Una solución de Smart Box Connect</small>
        </footer>

        <div id="modal" class="modal hidden">
            <div class="modal-box">
                <button id="btnCerrarModal" class="close" type="button">×</button>
                <div id="modal-content"></div>
            </div>
        </div>
    `;

    document
        .getElementById("btnContacto")
        ?.addEventListener("click", mostrarContacto);

    document
        .getElementById("btnInfo")
        ?.addEventListener("click", mostrarInfo);

    document
        .getElementById("btnCerrarModal")
        ?.addEventListener("click", cerrarModal);

    mostrarDocumentos();
}

// ==========================================
// RESUMEN DE DOCUMENTACIÓN
// ==========================================
function resumenDocumentacion() {
    const estados = documentosActuales
        .filter(doc => doc && doc.fecha_vencimiento)
        .map(doc => estadoVencimiento(doc.fecha_vencimiento));

    const vencidos = estados.filter(e => e.texto.startsWith("VENCIDO")).length;
    const porVencer = estados.filter(e => e.texto.startsWith("POR VENCER")).length;

    if (vencidos > 0) {
        return {
            clase: "doc-summary danger",
            icono: "⚠",
            titulo: vencidos === 1 ? "Tienes 1 documento vencido" : `Tienes ${vencidos} documentos vencidos`,
            texto: "Revisa la documentación del vehículo."
        };
    }

    if (porVencer > 0) {
        return {
            clase: "doc-summary warning",
            icono: "⚠",
            titulo: porVencer === 1 ? "Tienes 1 documento próximo a vencer" : `Tienes ${porVencer} documentos próximos a vencer`,
            texto: "NexumID te avisará por correo según se acerque la fecha."
        };
    }

    return {
        clase: "doc-summary ok",
        icono: "✓",
        titulo: "Documentación al día",
        texto: "No hay documentos registrados vencidos ni próximos a vencer."
    };
}

function mostrarResumenDocumentacion() {
    const contenedor = document.getElementById("document-summary");
    if (!contenedor) return;

    const r = resumenDocumentacion();
    contenedor.className = r.clase;
    contenedor.innerHTML = `
        <div class="doc-summary-icon">${r.icono}</div>
        <div>
            <strong>${escapeHtml(r.titulo)}</strong>
            <small>${escapeHtml(r.texto)}</small>
        </div>
    `;
}

// ==========================================
// DOCUMENTOS
// ==========================================
function mostrarDocumentos() {
    const lista = document.getElementById("documents-list");

    if (!lista) return;

    mostrarResumenDocumentacion();

    lista.innerHTML = TIPOS_DOCUMENTOS.map(doc => {
        const encontrado = buscarDocumento(doc.tipo);

        if (encontrado) {
            const vencimiento = estadoVencimiento(encontrado.fecha_vencimiento);

            return `
                <article class="document-card available">
                    <div class="document-icon">${doc.icono}</div>

                    <div class="document-info">
                        <strong>${doc.nombre}</strong>
                        <small>
                            ● Disponible${doc.protegido ? " · Acceso protegido" : ""}
                        </small>
                        <small style="color:${vencimiento.color}">
                            ${escapeHtml(vencimiento.texto)}
                        </small>
                    </div>

                    <button
                        class="document-button"
                        type="button"
                        data-documento="${escapeHtml(doc.tipo)}"
                    >
                        VER
                    </button>
                </article>
            `;
        }

        return `
            <article class="document-card unavailable">
                <div class="document-icon">${doc.icono}</div>

                <div class="document-info">
                    <strong>${doc.nombre}</strong>
                    <small class="not-available">No disponible</small>
                </div>

                <button
                    class="document-button disabled"
                    type="button"
                    disabled
                >—</button>
            </article>
        `;
    }).join("");

    lista
        .querySelectorAll("[data-documento]")
        .forEach(button => {
            button.addEventListener("click", () => {
                verDocumento(button.dataset.documento);
            });
        });
}

function buscarDocumento(tipo) {
    return documentosActuales.find(documento =>
        String(documento.tipo || "").toLowerCase() ===
        String(tipo).toLowerCase()
    );
}

// ==========================================
// VER DOCUMENTO
// ==========================================
function verDocumento(tipo) {
    if (!accesoAutorizado) {
        mostrarModal(
            "Acceso protegido",
            "<p>Debes ingresar el PIN para acceder a los documentos.</p>"
        );
        return;
    }

    const documento = buscarDocumento(tipo);

    if (!documento || !documento.id || !documento.access_token) {
        mostrarModal(
            "Documento no disponible",
            "<p>Este documento todavía no está disponible para este vehículo.</p>"
        );
        return;
    }

    const tipoInfo = TIPOS_DOCUMENTOS.find(x => x.tipo === tipo);

    mostrarModal(
        tipoInfo?.nombre || documento.nombre || "Documento",
        `
            <div class="modal-document">
                <div class="modal-document-icon">
                    ${tipoInfo?.icono || "📄"}
                </div>
                <p>
                    El acceso temporal se generará al abrir el documento
                    y será válido durante 120 segundos.
                </p>
                <button
                    id="btnAbrirDocumento"
                    class="modal-action"
                    type="button"
                >
                    ABRIR DOCUMENTO
                </button>
                <button
                    id="btnDescargarDocumento"
                    class="modal-action"
                    type="button"
                    style="margin-top:10px"
                >
                    ⬇ DESCARGAR DOCUMENTO
                </button>
            </div>
        `
    );

    document
        .getElementById("btnAbrirDocumento")
        ?.addEventListener("click", () => {
            abrirDocumentoSeguro(documento);
        });

    document
        .getElementById("btnDescargarDocumento")
        ?.addEventListener("click", () => {
            descargarDocumentoSeguro(documento, tipoInfo);
        });
}

async function abrirDocumentoSeguro(documento) {
    if (!accesoAutorizado || !documento?.id || !documento?.access_token) {
        return;
    }

    const boton = document.getElementById("btnAbrirDocumento");

    if (boton) {
        boton.disabled = true;
        boton.textContent = "GENERANDO ACCESO...";
    }

    const ventana = window.open("about:blank", "_blank");

    if (ventana) {
        try {
            ventana.opener = null;
            ventana.document.write(
                "<p style='font-family:sans-serif;padding:24px'>Generando acceso seguro...</p>"
            );
        } catch (_) {}
    }

    try {
        const { data, error } = await db.functions.invoke(
            "nexumid-documento",
            {
                body: {
                    documento_id: documento.id,
                    access_token: documento.access_token
                }
            }
        );

        if (error || !data || data.success !== true || !data.url) {
            if (ventana) ventana.close();

            mostrarModal(
                "Acceso no disponible",
                `<p>${escapeHtml(
                    data?.error ||
                    "El acceso temporal venció. Ingresa nuevamente con tu PIN."
                )}</p>`
            );
            return;
        }

        if (ventana) {
            ventana.location.replace(data.url);
        } else {
            window.location.href = data.url;
        }

    } catch (error) {
        console.error("Error al generar acceso temporal:", error);

        if (ventana) ventana.close();

        mostrarModal(
            "Error de acceso",
            "<p>No fue posible abrir el documento. Intenta nuevamente.</p>"
        );
    } finally {
        if (boton && document.body.contains(boton)) {
            boton.disabled = false;
            boton.textContent = "ABRIR DOCUMENTO";
        }
    }
}


// ==========================================
// DESCARGAR DOCUMENTO
// ==========================================
async function descargarDocumentoSeguro(documento, tipoInfo) {
    if (!accesoAutorizado || !documento?.id || !documento?.access_token) return;

    const boton = document.getElementById("btnDescargarDocumento");
    if (boton) {
        boton.disabled = true;
        boton.textContent = "PREPARANDO DESCARGA...";
    }

    try {
        const { data, error } = await db.functions.invoke("nexumid-documento", {
            body: {
                documento_id: documento.id,
                access_token: documento.access_token
            }
        });

        if (error || !data || data.success !== true || !data.url) {
            mostrarModal(
                "Descarga no disponible",
                `<p>${escapeHtml(data?.error || "El acceso temporal venció. Ingresa nuevamente con tu PIN.")}</p>`
            );
            return;
        }

        const respuesta = await fetch(data.url);
        if (!respuesta.ok) throw new Error(`Descarga HTTP ${respuesta.status}`);

        const blob = await respuesta.blob();
        const tipoNombre = tipoInfo?.nombre || documento.nombre || documento.tipo || "Documento";
        const nombreLimpio = String(tipoNombre)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");

        const contentType = respuesta.headers.get("content-type") || blob.type || "";
        let extension = "pdf";
        if (contentType.includes("image/jpeg")) extension = "jpg";
        else if (contentType.includes("image/png")) extension = "png";
        else if (contentType.includes("image/webp")) extension = "webp";

        const patenteLimpia = String(PATENTE || "Vehiculo").replace(/[^a-zA-Z0-9-]+/g, "_");
        const nombreArchivo = `NexumID_${nombreLimpio || "Documento"}_${patenteLimpia}.${extension}`;

        const urlLocal = URL.createObjectURL(blob);
        const enlace = document.createElement("a");
        enlace.href = urlLocal;
        enlace.download = nombreArchivo;
        enlace.style.display = "none";
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        setTimeout(() => URL.revokeObjectURL(urlLocal), 1000);

    } catch (error) {
        console.error("Error al descargar documento:", error);
        mostrarModal(
            "Error de descarga",
            "<p>No fue posible descargar el documento. Intenta nuevamente.</p>"
        );
    } finally {
        if (boton && document.body.contains(boton)) {
            boton.disabled = false;
            boton.textContent = "⬇ DESCARGAR DOCUMENTO";
        }
    }
}

// ==========================================
// CONTACTO
// ==========================================
function mostrarContacto() {
    const contacto = vehiculoActual?.contacto_emergencia || "";

    if (!contacto) {
        mostrarModal(
            "Contacto de emergencia",
            `
                <div class="modal-big-icon">☎</div>
                <p>
                    No hay un contacto de emergencia registrado para este vehículo.
                </p>
            `
        );
        return;
    }

    mostrarModal(
        "Contacto de emergencia",
        `
            <div class="modal-big-icon">☎</div>
            <p>Contacto registrado:</p>

            <div class="contact-number">
                ${escapeHtml(contacto)}
            </div>

            <button
                id="btnLlamar"
                class="modal-action"
                type="button"
            >
                LLAMAR CONTACTO
            </button>
        `
    );

    document
        .getElementById("btnLlamar")
        ?.addEventListener("click", () => {
            window.location.href =
                `tel:${encodeURIComponent(contacto)}`;
        });
}

// ==========================================
// INFORMACIÓN
// ==========================================
function mostrarInfo() {
    if (!vehiculoActual) return;

    mostrarModal(
        "Datos del vehículo",
        `
            <div class="vehicle-detail">
                <div>
                    <span>Patente</span>
                    <strong>${escapeHtml(vehiculoActual.patente)}</strong>
                </div>

                <div>
                    <span>Marca</span>
                    <strong>${escapeHtml(vehiculoActual.marca || "—")}</strong>
                </div>

                <div>
                    <span>Modelo</span>
                    <strong>${escapeHtml(vehiculoActual.modelo || "—")}</strong>
                </div>

                <div>
                    <span>Año</span>
                    <strong>${escapeHtml(vehiculoActual.anio || "—")}</strong>
                </div>

                <div>
                    <span>Color</span>
                    <strong>${escapeHtml(vehiculoActual.color || "—")}</strong>
                </div>
            </div>
        `
    );
}

// ==========================================
// MODAL
// ==========================================
function mostrarModal(titulo, contenido) {
    const modal = document.getElementById("modal");
    const modalContent = document.getElementById("modal-content");

    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
        <h2>${escapeHtml(titulo)}</h2>
        ${contenido}
    `;

    modal.classList.remove("hidden");
}

function cerrarModal() {
    document
        .getElementById("modal")
        ?.classList.add("hidden");
}

// Fechas civiles en Chile; UTC se usa solo para contar días sin efectos del horario de verano.
function estadoVencimiento(fecha, ahora = new Date()) {
    if (fecha === null || fecha === '') {
        return { texto: 'SIN VENCIMIENTO', color: '#aeb8c7' };
    }

    if (fecha === undefined) {
        return { texto: 'FECHA NO INFORMADA', color: '#aeb8c7' };
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return { texto: 'FECHA INVÁLIDA', color: '#ff8888' };
    }

    const fin = Date.parse(fecha + 'T00:00:00Z');

    if (!Number.isFinite(fin) || new Date(fin).toISOString().slice(0,10) !== fecha) {
        return { texto: 'FECHA INVÁLIDA', color: '#ff8888' };
    }

    const partes = new Intl.DateTimeFormat('en', {
        timeZone:'America/Santiago',
        year:'numeric',
        month:'2-digit',
        day:'2-digit'
    }).formatToParts(ahora);

    const valor = tipo => partes.find(p => p.type === tipo).value;

    const hoy = Date.parse(
        valor('year') + '-' +
        valor('month') + '-' +
        valor('day') +
        'T00:00:00Z'
    );

    const dias = (fin - hoy) / 86400000;

    const texto =
        dias < 0
            ? 'VENCIDO'
            : dias <= 30
                ? 'POR VENCER'
                : 'VIGENTE';

    return {
        texto:
            texto +
            ' · ' +
            (dias < 0 ? 'venció ' : 'vence ') +
            fecha.split('-').reverse().join('/'),

        color:
            dias < 0
                ? '#ff8888'
                : dias <= 30
                    ? '#ffcb70'
                    : '#65e3b1'
    };
}

