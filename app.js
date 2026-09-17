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
    <div class="landing">
      <header class="landing-header">
        <img src="logo-nexumid.png" alt="NexumID" class="landing-logo">
        <span class="landing-badge">IDENTIDAD VEHICULAR</span>
      </header>
      <section class="landing-hero">
        <span class="landing-kicker">NFC + QR · ACCESO PROTEGIDO</span>
        <h1>La documentación de tu vehículo, conectada.</h1>
        <p class="landing-lead">NexumID reúne la identidad y documentación de tu vehículo en un perfil digital accesible desde una tarjeta NFC o código QR.</p>
        <div class="landing-actions">
          <a class="landing-primary" href="#como-funciona">CONOCER NEXUMID</a>
          <a class="landing-secondary" href="#documentos">VER FUNCIONES</a>
        </div>
        <div class="landing-card">
          <div class="landing-card-top"><span>NEXUMID</span><span class="landing-live"><i></i> CONECTADO</span></div>
          <div class="landing-nfc">NFC</div>
          <strong>Identidad Digital Vehicular</strong>
          <small>Acerca tu dispositivo o escanea el QR.</small>
          <div class="landing-tech">TECNOLOGÍA QUE CONECTA</div>
        </div>
      </section>
      <section id="como-funciona" class="landing-section">
        <span class="landing-kicker">CÓMO FUNCIONA</span>
        <h2>Simple para usar. Diseñado para proteger.</h2>
        <div class="landing-grid">
          <article><b>01</b><h3>Acerca o escanea</h3><p>Usa NFC o QR para abrir el perfil digital asociado al vehículo.</p></article>
          <article><b>02</b><h3>Acceso con PIN</h3><p>La documentación se mantiene detrás de un acceso privado de 4 dígitos.</p></article>
          <article><b>03</b><h3>Documentos disponibles</h3><p>Consulta la información registrada del vehículo desde el teléfono.</p></article>
        </div>
      </section>
      <section id="documentos" class="landing-section landing-dark">
        <span class="landing-kicker">DOCUMENTACIÓN</span>
        <h2>Lo importante, en un solo lugar.</h2>
        <p class="landing-section-copy">NexumID permite asociar SOAP, Permiso de Circulación, Revisión Técnica, Certificado de Gases y Padrón al perfil del vehículo.</p>
        <div class="landing-docs"><span>SOAP</span><span>PERMISO DE CIRCULACIÓN</span><span>REVISIÓN TÉCNICA</span><span>CERTIFICADO DE GASES</span><span>PADRÓN</span></div>
      </section>
      <section class="landing-section landing-security">
        <span class="landing-kicker">SEGURIDAD</span>
        <h2>Tu información no queda expuesta.</h2>
        <p class="landing-section-copy">El acceso al perfil documental requiere PIN y los documentos se abren mediante accesos temporales generados al momento de consultarlos.</p>
        <div class="landing-security-row"><span>🔐 Acceso con PIN</span><span>⏱ Enlaces temporales</span><span>✓ Perfil identificado</span></div>
      </section>
      <section class="landing-cta">
        <span class="landing-kicker">NEXUMID</span>
        <h2>Tu vehículo también puede tener identidad digital.</h2>
        <p>Una forma moderna de conectar tu vehículo con su información esencial.</p>
        <div class="landing-slogan">Tecnología que conecta.</div>
      </section>
      <footer class="landing-footer">
        <img src="logo-nexumid.png" alt="NexumID" class="landing-footer-logo">
        <div>IDENTIDAD DIGITAL VEHICULAR</div>
        <small>Una solución de Smart Box Connect</small>
      </footer>
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
            </div>
        `
    );

    document
        .getElementById("btnAbrirDocumento")
        ?.addEventListener("click", () => {
            abrirDocumentoSeguro(documento);
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
