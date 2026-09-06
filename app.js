// ==========================================
// NEXUMID - PERFIL PÚBLICO
// Identidad Digital Vehicular
// ==========================================

const SUPABASE_URL = "https://tkrugleneazdeqhxxkvr.supabase.co";
const SUPABASE_KEY = "sb_publishable_1oVup3kgJeyOfHFoZeAfTw_-3TkiPib";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const parametros = new URLSearchParams(window.location.search);
const PATENTE = (parametros.get("patente") || "AB-CD-12").trim().toUpperCase();

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
    mostrarPantallaPIN();
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
                <div class="pin-logo">N</div>
                <div>
                    <strong>Nexum<span>ID</span></strong>
                    <span>IDENTIDAD DIGITAL VEHICULAR</span>
                </div>
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
            mostrarErrorPIN("No fue posible verificar el PIN.");
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

    // La Edge Function devuelve foto_url cuando existe una foto.
    const fotoUrl = vehiculoActual.foto_url || "";

    app.innerHTML = `
        <header class="topbar">
            <div class="brand">
                <div class="brand-mark">N</div>
                <div>
                    <strong>Nexum<span>ID</span></strong>
                    <small>IDENTIDAD DIGITAL VEHICULAR</small>
                </div>
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
                                opacity:.25;
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
                                        rgba(5,8,13,.32) 38%,
                                        rgba(13,20,32,.96) 100%
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
// DOCUMENTOS
// ==========================================
function mostrarDocumentos() {
    const lista = document.getElementById("documents-list");

    if (!lista) return;

    lista.innerHTML = TIPOS_DOCUMENTOS.map(doc => {
        const encontrado = buscarDocumento(doc.tipo);

        if (encontrado) {
            return `
                <article class="document-card available">
                    <div class="document-icon">${doc.icono}</div>

                    <div class="document-info">
                        <strong>${doc.nombre}</strong>
                        <small>
                            ● Disponible${doc.protegido ? " · Acceso protegido" : ""}
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

    if (!documento || !documento.url) {
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
                    Documento disponible de forma temporal y protegida.
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
            abrirDocumentoSeguro(documento.url);
        });
}

function abrirDocumentoSeguro(url) {
    if (!accesoAutorizado || !url) return;

    window.open(url, "_blank", "noopener,noreferrer");
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
