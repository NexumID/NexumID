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
    const app = document.querySelector('.app');
    if (!app) return;
    document.title = 'NexumID | Soluciones digitales para el día a día';
    app.innerHTML = `
    <div class="landing nx-corporate" id="inicio">
      <div class="nx-utility"><div><span>Una marca de Smart Box Connect</span><span>Chile · Soluciones digitales</span></div></div>
      <header class="landing-header">
        <a href="#inicio" aria-label="NexumID, inicio"><img class="nx-official-logo" src="assets/nexumid-logo-corporativo.webp" alt="NexumID, Soluciones Tecnológicas by Smart Box Connect" width="1000" height="333"></a>
        <nav class="nx-nav" aria-label="Navegación principal"><a href="#soluciones">Soluciones</a><a href="#proyectos">Proyectos</a><a href="#nosotros">Nosotros</a><a href="#contacto">Contacto</a><a href="#accesos" class="nx-client-link">Acceso clientes <span aria-hidden="true">↗</span></a></nav>
        <details class="nx-mobile-menu"><summary>Menú <span aria-hidden="true">☰</span></summary><nav aria-label="Navegación móvil"><a href="#soluciones">Soluciones</a><a href="#proyectos">Proyectos</a><a href="#nosotros">Nosotros</a><a href="#contacto">Contacto</a><a href="#accesos">Acceso clientes ↗</a></nav></details>
      </header>
      <section class="nx-banner" aria-labelledby="nx-main-title">
        <img class="nx-banner-image" src="assets/nexumid-hero.webp" alt="" fetchpriority="high" width="1672" height="941">
        <div class="nx-banner-content"><span class="landing-kicker">TECNOLOGÍA QUE CONECTA</span><h1 id="nx-main-title">Conecta lo importante.<br>Simplifica tu día.</h1><p>Documentos a mano. Accesos bajo control.<br>Una mejor atención para tus clientes.</p><a class="nx-button" href="#soluciones">Descubre nuestras soluciones <span aria-hidden="true">→</span></a></div>
        <div class="nx-banner-caption">NexumID · Tecnología aplicada a necesidades reales</div>
      </section>
      <nav class="nx-sectors" aria-label="Explorar soluciones"><a href="#vehicular"><span>01</span>Identidad Vehicular <b aria-hidden="true">→</b></a><a href="#salud-info"><span>02</span>Salud <b aria-hidden="true">→</b></a><a href="#parking-info"><span>03</span>Parking <b aria-hidden="true">→</b></a><a href="#alojamientos-info"><span>04</span>Alojamientos <b aria-hidden="true">→</b></a></nav>
      <section id="soluciones" class="landing-section nx-showcase">
        <div class="nx-section-heading"><span class="landing-kicker">NUESTRAS SOLUCIONES</span><h2>Herramientas digitales.<br>Beneficios concretos.</h2><p>Desde una tarjeta que abre tus documentos hasta un sistema que organiza los pedidos de tu negocio.</p></div>
        <div class="nx-editorial-grid">
          <article class="nx-feature nx-feature-vehicle" id="vehicular">
            <div class="nx-product-art nx-real-card"><img src="assets/nexumid-tarjeta-vehicular.webp" alt="Modelo de tarjeta NFC NexumID Identidad Digital Vehicular, acabado negro y azul" width="1200" height="800" loading="lazy"></div>
            <div class="nx-feature-copy"><span class="nx-eyebrow">PERSONAS · VEHÍCULOS</span><h3>Tu documentación,<br>siempre a mano.</h3><p>Abre el perfil de tu vehículo con una tarjeta NFC o un QR. Ingresa tu PIN y consulta los documentos disponibles: SOAP, permiso de circulación, revisión técnica y más.</p><a class="nx-text-link" href="#como-funciona">Cómo funciona <span aria-hidden="true">→</span></a></div>
          </article>
          <article class="nx-feature nx-feature-health" id="salud-info">
            <div class="nx-product-art" aria-hidden="true"><div class="nx-health-sheet"><span class="nx-health-cross">+</span><strong>Tu información.<br>Tú decides.</strong><div><i></i><i></i><i></i></div><small>Documentos · Perfil de emergencia</small></div></div>
            <div class="nx-feature-copy"><span class="nx-eyebrow">PERSONAS · SALUD <b>En piloto</b></span><h3>Información organizada.<br>Acceso cuando lo necesitas.</h3><p>Reúne documentos de salud y comparte los archivos que tú elijas. Define qué información de emergencia puede verse desde tu tarjeta.</p><a class="nx-text-link" href="salud.html">Abrir portal Salud <span aria-hidden="true">→</span></a></div>
          </article>
          <article class="nx-feature nx-feature-parking" id="parking-info">
            <div class="nx-product-art" aria-hidden="true"><div class="nx-parking-scene"><span class="nx-parking-sign">P</span><div class="nx-gate-arm"></div><div class="nx-gate-post"></div><div class="nx-parking-line"></div><span class="nx-parking-caption">NFC / QR</span></div></div>
            <div class="nx-feature-copy"><span class="nx-eyebrow">NEGOCIOS · ESTACIONAMIENTOS <b>En piloto</b></span><h3>Más control.<br>Menos tareas manuales.</h3><p>Administra usuarios y tarjetas, define reglas de uso y revisa los accesos con fecha, hora y operador desde un panel para caja y administración.</p><a class="nx-text-link" href="parking/">Abrir Parking <span aria-hidden="true">→</span></a></div>
          </article>
          <article class="nx-feature nx-feature-hotel" id="alojamientos-info">
            <div class="nx-product-art" aria-hidden="true"><div class="nx-room-screen"><span>Bienvenido</span><strong>Una mejor experiencia<br>en tu habitación.</strong><div><i></i><i></i><i></i></div></div><div class="nx-screen-foot"></div><div class="nx-order-card"><span>Pedidos QR</span><i></i><i></i></div></div>
            <div class="nx-feature-copy"><span class="nx-eyebrow">NEGOCIOS · ALOJAMIENTOS</span><h3>Conecta a tus huéspedes<br>con tu equipo.</h3><p>Carta y pedidos desde un QR, notificaciones al personal y pantallas de inicio con tu marca en televisores compatibles. Cada servicio se implementa según tu necesidad.</p><a class="nx-text-link" href="#proyectos">Ver implementación <span aria-hidden="true">→</span></a></div>
          </article>
        </div>
      </section>
      <section class="nx-story-band" id="proyectos"><div class="nx-story-content"><div><span class="landing-kicker">DEL DESARROLLO A LA IMPLEMENTACIÓN</span><h2>Tecnología que ya<br>llega a la habitación.</h2><p>Instalamos y probamos una pantalla de inicio personalizada en nueve habitaciones de un alojamiento. Una experiencia con su marca y accesos directos a aplicaciones.</p><p class="nx-story-note">La carta QR y la aplicación del personal son servicios adicionales y se cotizan por separado.</p><a class="nx-button nx-button-light" href="#contacto">Conversemos sobre tu proyecto <span aria-hidden="true">→</span></a></div><div class="nx-story-number"><strong>9</strong><span>habitaciones con pantalla<br>personalizada instalada</span><small>Implementación comprobada en terreno</small></div></div></section>
      <section id="como-funciona" class="landing-section nx-steps-section"><div class="nx-section-heading"><span class="landing-kicker">IDENTIDAD VEHICULAR</span><h2>Tres pasos. Tus documentos.</h2><p>La tarjeta y el QR abren tu perfil. Los documentos se consultan en la plataforma.</p></div><div class="nx-steps"><article><span>01</span><h3>Acerca o escanea</h3><p>Usa tu tarjeta NFC o escanea el QR con la cámara del teléfono.</p></article><article><span>02</span><h3>Ingresa tu PIN</h3><p>Identifícate con tu PIN de cuatro dígitos para acceder a tu documentación.</p></article><article><span>03</span><h3>Abre el documento</h3><p>Consulta los archivos disponibles mediante enlaces temporales.</p></article></div></section>
      <section class="nx-company-band" id="nosotros"><div class="landing-section"><div><span class="landing-kicker">NEXUMID BY SMART BOX CONNECT</span><h2>Ideas claras.<br>Soluciones que se usan.</h2></div><div><p>NexumID es la línea de soluciones digitales de Smart Box Connect. Desarrollamos desde Chile para personas y negocios que quieren organizar su información y simplificar sus tareas.</p><p>Primero entendemos tu necesidad. Después probamos la solución y acordamos qué incluye la instalación y el soporte.</p><a class="nx-text-link" href="#contacto">Hablemos de tu necesidad <span aria-hidden="true">→</span></a></div></div></section>
      <section id="accesos" class="landing-section nx-access-section"><div class="nx-section-heading"><span class="landing-kicker">YA ERES CLIENTE</span><h2>Tu plataforma, aquí.</h2><p>Ingresa con tu cuenta o utiliza tu tarjeta para abrir el servicio correspondiente.</p></div><div class="nx-access-grid"><article class="nx-access"><h3>Salud</h3><p>Documentos y perfil personal.</p><a href="salud.html" class="nx-text-link">Ingresar <span aria-hidden="true">→</span></a></article><article class="nx-access"><h3>Parking</h3><p>Panel de caja y administración.</p><a href="parking/" class="nx-text-link">Ingresar <span aria-hidden="true">→</span></a></article><article class="nx-access"><h3>Vehicular</h3><p>Abre tu perfil por patente. El acceso a documentos requiere tu PIN.</p><form class="nx-plate-form" action="./" method="get"><label for="nx-patente">Patente del vehículo</label><div><input id="nx-patente" name="patente" required maxlength="12" pattern=".*\\S.*" autocomplete="off" spellcheck="false" placeholder="AB-CD-12"><button type="submit">Abrir →</button></div></form></article></div><details class="nx-admin"><summary>Accesos de administración</summary><div><a href="admin.html">Administración Vehicular →</a><a href="salud-admin.html">Administración de Salud →</a></div></details></section>
      <section class="landing-section nx-faq"><div class="nx-section-heading"><span class="landing-kicker">RESOLVEMOS TUS DUDAS</span><h2>Antes de comenzar.</h2></div><details><summary>¿Necesito un teléfono con NFC?</summary><p>Solo para leer la tarjeta acercando el teléfono. También puedes abrir el enlace escaneando el QR con la cámara.</p></details><details><summary>¿Quién puede ver mi información?</summary><p>Depende del servicio y sus permisos. Vehicular solicita PIN para consultar documentos. En Salud, tú defines la información pública de emergencia y los archivos que compartes.</p></details><details><summary>¿Se puede personalizar cualquier televisor?</summary><p>La compatibilidad depende del sistema y del modelo. Probamos el equipo antes de confirmar una instalación.</p></details><details><summary>¿Cómo se define el precio?</summary><p>Según el servicio, la cantidad de tarjetas o equipos y las funciones que necesites. Acordamos el alcance, la instalación y el soporte en la cotización.</p></details></section>
      <section class="nx-contact-band" id="contacto" aria-labelledby="nx-contact-title">
        <div class="nx-contact-heading"><span class="landing-kicker">CONVERSEMOS</span><h2 id="nx-contact-title">¿Qué necesitas simplificar?</h2><p>Cuéntanos qué tarea quieres resolver. Te orientamos y definimos contigo una propuesta.</p></div>
        <div class="nx-contact-grid">
          <article class="nx-contact-card nx-contact-primary"><span class="nx-contact-label">CONTACTO PRINCIPAL</span><h3>Consultas y proyectos</h3><p>Información de nuestros servicios, cotizaciones e implementación.</p><a class="nx-contact-number" href="tel:+56926097948">+56 9 2609 7948</a><div class="nx-contact-actions"><a class="nx-contact-whatsapp" href="https://wa.me/56926097948?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20soluciones%20de%20NexumID." target="_blank" rel="noopener noreferrer" aria-label="Escribir por WhatsApp al contacto principal">WhatsApp <span aria-hidden="true">↗</span></a><a href="tel:+56926097948" aria-label="Llamar al contacto principal">Llamar <span aria-hidden="true">→</span></a></div></article>
          <article class="nx-contact-card"><span class="nx-contact-label">CONTACTO DE APOYO</span><h3>Información y orientación</h3><p>Te ayuda con información general y te deriva al contacto principal cuando sea necesario.</p><a class="nx-contact-number" href="tel:+56985387195">+56 9 8538 7195</a><div class="nx-contact-actions"><a class="nx-contact-whatsapp" href="https://wa.me/56985387195?text=Hola%2C%20necesito%20informaci%C3%B3n%20sobre%20NexumID%20o%20que%20me%20deriven%20al%20contacto%20principal." target="_blank" rel="noopener noreferrer" aria-label="Escribir por WhatsApp al contacto de apoyo">WhatsApp <span aria-hidden="true">↗</span></a><a href="tel:+56985387195" aria-label="Llamar al contacto de apoyo">Llamar <span aria-hidden="true">→</span></a></div></article>
          <article class="nx-contact-card"><span class="nx-contact-label">CORREO ELECTRÓNICO</span><h3>Escríbenos tu idea</h3><p>Envíanos los detalles de tu proyecto o consulta para preparar una propuesta.</p><a class="nx-contact-email" href="mailto:nexumid.tec@gmail.com">nexumid.tec@gmail.com</a><div class="nx-contact-actions"><a href="mailto:nexumid.tec@gmail.com">Enviar correo <span aria-hidden="true">→</span></a></div></article>
        </div>
      </section>
      <footer class="landing-footer"><div class="nx-footer-top"><div><img class="nx-official-logo" src="assets/nexumid-logo-corporativo.webp" alt="NexumID, Soluciones Tecnológicas by Smart Box Connect" width="1000" height="333"><p>Tecnología que conecta.</p><small>Una marca de Smart Box Connect</small></div><nav aria-label="Soluciones en el pie de página"><strong>Soluciones</strong><a href="#vehicular">Identidad Vehicular</a><a href="#salud-info">Salud</a><a href="#parking-info">Parking</a><a href="#alojamientos-info">Alojamientos</a></nav><nav aria-label="Empresa"><strong>NexumID</strong><a href="#nosotros">Nosotros</a><a href="#proyectos">Proyectos</a><a href="#contacto">Contacto</a><a href="#accesos">Acceso clientes</a></nav><nav class="nx-footer-contact" aria-label="Contacto NexumID"><strong>Contacto</strong><a href="tel:+56926097948">Principal: +56 9 2609 7948</a><a href="tel:+56985387195">Apoyo: +56 9 8538 7195</a><a href="mailto:nexumid.tec@gmail.com">nexumid.tec@gmail.com</a><a href="https://wa.me/56926097948?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20soluciones%20de%20NexumID." target="_blank" rel="noopener noreferrer">Escribir por WhatsApp ↗</a></nav></div><div class="nx-footer-bottom"><span>© ${new Date().getFullYear()} NexumID · Chile</span><a href="#inicio">Volver arriba ↑</a></div></footer>
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

