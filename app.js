// ==========================================
// NEXUMID + SUPABASE
// ACCESO MEDIANTE PIN
// ==========================================

const SUPABASE_URL = "https://tkrugleneazdeqhxxkvr.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_1oVup3kgJeyOfHFoZeAfTw_-3TkiPib";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// PATENTE DESDE LA URL
// Ejemplo:
// https://nexumid.github.io/NexumID/?patente=AB-CD-12
// ==========================================

const parametros =
    new URLSearchParams(window.location.search);

const PATENTE = (
    parametros.get("patente") || "AB-CD-12"
)
    .trim()
    .toUpperCase();


// ==========================================
// VARIABLES
// ==========================================

let vehiculoActual = null;

let documentosActuales = [];

let accesoAutorizado = false;


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarNexumID
);


function iniciarNexumID() {

    mostrarPantallaPIN();

}


// ==========================================
// PANTALLA PIN
// ==========================================

function mostrarPantallaPIN() {

    const app =
        document.querySelector(".app");

    if (!app) {
        return;
    }

    app.innerHTML = `

        <div class="pin-screen">

            <div class="pin-brand">

                <div class="pin-logo">
                    N
                </div>

                <div>

                    <strong>
                        NexumID
                    </strong>

                    <span>
                        Identidad Digital Vehicular
                    </span>

                </div>

            </div>


            <div class="pin-card">

                <div class="pin-icon">
                    🔐
                </div>


                <h1>
                    Acceso protegido
                </h1>


                <p>
                    Ingresa el PIN de 4 dígitos
                    para acceder a la información
                    de tu vehículo.
                </p>


                <div class="pin-patente">

                    ${escapeHtml(PATENTE)}

                </div>


                <input
                    id="pin-input"
                    class="pin-input"
                    type="tel"
                    inputmode="numeric"
                    maxlength="4"
                    autocomplete="off"
                    placeholder="••••"
                />


                <button
                    id="pin-button"
                    class="modal-action"
                    type="button"
                    onclick="validarPIN()">

                    ACCEDER

                </button>


                <div
                    id="pin-error"
                    class="pin-error">
                </div>

            </div>


            <div class="pin-footer">

                NexumID · by Smart Box Connect

            </div>

        </div>

    `;


    const input =
        document.getElementById("pin-input");


    if (!input) {
        return;
    }


    input.focus();


    input.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(/\D/g, "")
                    .slice(0, 4);

        }
    );


    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                this.value.length === 4
            ) {

                validarPIN();

            }

        }
    );

}


// ==========================================
// VALIDAR PIN
// ==========================================

async function validarPIN() {

    const input =
        document.getElementById("pin-input");

    const button =
        document.getElementById("pin-button");

    const errorBox =
        document.getElementById("pin-error");


    if (!input) {
        return;
    }


    const pin =
        input.value.trim();


    if (!/^\d{4}$/.test(pin)) {

        mostrarErrorPIN(
            "Ingresa un PIN válido de 4 dígitos."
        );

        return;

    }


    if (button) {

        button.disabled = true;

        button.textContent =
            "VERIFICANDO...";

    }


    if (errorBox) {

        errorBox.textContent = "";

    }


    try {

        const { data, error } =
            await db.functions.invoke(
                "nexumid-pin",
                {
                    body: {
                        patente: PATENTE,
                        pin: pin
                    }
                }
            );


        if (error) {

            console.error(
                "Error Edge Function:",
                error
            );

            mostrarErrorPIN(
                "No fue posible verificar el PIN."
            );

            return;

        }


        if (
            !data ||
            data.success !== true
        ) {

            mostrarErrorPIN(
                data?.error ||
                "PIN incorrecto."
            );

            return;

        }


        // ======================================
        // ACCESO AUTORIZADO
        // ======================================

        accesoAutorizado = true;


        vehiculoActual =
            data.vehiculo || null;


        documentosActuales =
            data.documentos || [];


        console.log(
            "Acceso autorizado:",
            data
        );


        mostrarPerfil();


    } catch (error) {

        console.error(
            "Error:",
            error
        );


        mostrarErrorPIN(
            "Ocurrió un error. Intenta nuevamente."
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "ACCEDER";

        }

    }

}


// ==========================================
// ERROR PIN
// ==========================================

function mostrarErrorPIN(mensaje) {

    const errorBox =
        document.getElementById(
            "pin-error"
        );


    if (errorBox) {

        errorBox.textContent =
            mensaje;

    }

}


// ==========================================
// MOSTRAR PERFIL
// ==========================================

function mostrarPerfil() {

    const app =
        document.querySelector(".app");


    if (
        !app ||
        !vehiculoActual
    ) {

        return;

    }


    app.innerHTML = `

        <div class="topbar">

            <div class="brand">

                <strong>
                    NexumID
                </strong>

                <span>
                    IDENTIDAD DIGITAL VEHICULAR
                </span>

            </div>


            <div class="status">

                <span></span>

                PROTEGIDO

            </div>

        </div>


        <section class="vehicle-hero">

            <div class="vehicle-photo">
                🚗
            </div>


            <div class="vehicle-info">

                <div class="eyebrow">
                    MI VEHÍCULO
                </div>


                <h1>

                    ${escapeHtml(
                        vehiculoActual.patente
                    )}

                </h1>


                <p>

                    ${escapeHtml(
                        vehiculoActual.marca || ""
                    )}

                    ${escapeHtml(
                        vehiculoActual.modelo || ""
                    )}

                    ·

                    ${escapeHtml(
                        vehiculoActual.anio || ""
                    )}

                </p>

            </div>

        </section>


        <section class="documents-section">

            <div class="section-title">

                <span>
                    DOCUMENTOS
                </span>

                <small>
                    ACCESO AUTORIZADO
                </small>

            </div>


            <div
                id="documents-list"
                class="documents-list">

            </div>

        </section>


        <section class="extras-section">


            <div
                class="extra-card"
                onclick="mostrarContacto()">

                <span>
                    🚨
                </span>


                <div>

                    <strong>
                        Contacto de emergencia
                    </strong>

                    <small>
                        Información del vehículo
                    </small>

                </div>

            </div>


            <div
                class="extra-card"
                onclick="mostrarInfo()">

                <span>
                    🚗
                </span>


                <div>

                    <strong>
                        Información del vehículo
                    </strong>

                    <small>
                        Datos registrados
                    </small>

                </div>

            </div>


        </section>


        <footer>

            NexumID · by Smart Box Connect

        </footer>


        <div
            id="modal"
            class="modal hidden">

            <div class="modal-box">

                <button
                    class="close"
                    type="button"
                    onclick="cerrarModal()">

                    ×

                </button>


                <div
                    id="modal-content">
                </div>

            </div>

        </div>

    `;


    mostrarDocumentos();

}


// ==========================================
// MOSTRAR DOCUMENTOS
// ==========================================

function mostrarDocumentos() {

    const lista =
        document.getElementById(
            "documents-list"
        );


    if (!lista) {
        return;
    }


    const tipos = [

        {
            tipo: "soap",
            nombre: "SOAP",
            icono: "🛡️"
        },

        {
            tipo: "revision",
            nombre: "Revisión Técnica",
            icono: "🔧"
        },

        {
            tipo: "permiso",
            nombre: "Permiso de Circulación",
            icono: "📄"
        },

        {
            tipo: "gases",
            nombre: "Certificado de Gases",
            icono: "📋"
        },

        {
            tipo: "padron",
            nombre: "Padrón",
            icono: "🔐"
        }

    ];


    lista.innerHTML =
        tipos.map(documento => {

            const encontrado =
                buscarDocumento(
                    documento.tipo
                );


            if (encontrado) {

                return `

                    <div class="document-card">

                        <div class="document-icon">

                            ${documento.icono}

                        </div>


                        <div class="document-info">

                            <strong>

                                ${documento.nombre}

                            </strong>


                            <small>

                                ● Disponible

                            </small>

                        </div>


                        <button
                            type="button"
                            onclick="verDocumento('${documento.tipo}')">

                            VER

                        </button>

                    </div>

                `;

            }


            return `

                <div class="document-card">

                    <div class="document-icon">

                        ${documento.icono}

                    </div>


                    <div class="document-info">

                        <strong>

                            ${documento.nombre}

                        </strong>


                        <small>

                            No disponible

                        </small>

                    </div>


                    <button
                        type="button"
                        disabled>

                        —

                    </button>

                </div>

            `;

        }).join("");

}


// ==========================================
// BUSCAR DOCUMENTO
// ==========================================

function buscarDocumento(tipo) {

    return documentosActuales.find(
        documento =>
            String(documento.tipo)
                .toLowerCase() ===
            String(tipo)
                .toLowerCase()
    );

}


// ==========================================
// VER DOCUMENTO
// ==========================================

function verDocumento(tipo) {

    if (!accesoAutorizado) {

        mostrarModal(
            "Acceso protegido",
            `
                <p>
                    Debes ingresar el PIN
                    para acceder a los documentos.
                </p>
            `
        );

        return;

    }


    const documento =
        buscarDocumento(tipo);


    if (!documento) {

        mostrarModal(
            "Documento no disponible",
            `
                <p>
                    Este documento todavía
                    no está cargado para este vehículo.
                </p>
            `
        );

        return;

    }


    if (!documento.url) {

        mostrarModal(
            "Documento no disponible",
            `
                <p>
                    No fue posible generar
                    el acceso temporal al documento.
                </p>
            `
        );

        return;

    }


    mostrarModal(
        documento.nombre || "Documento",
        `
            <p>
                Documento disponible.
            </p>


            <button
                class="modal-action"
                type="button"
                onclick="abrirDocumentoSeguro('${escapeHtml(documento.url)}')">

                VER DOCUMENTO

            </button>
        `
    );

}


// ==========================================
// ABRIR DOCUMENTO SEGURO
// ==========================================

function abrirDocumentoSeguro(url) {

    if (!accesoAutorizado) {
        return;
    }


    window.open(
        url,
        "_blank"
    );

}


// ==========================================
// CONTACTO DE EMERGENCIA
// ==========================================

function mostrarContacto() {

    if (!vehiculoActual) {

        mostrarModal(
            "Contacto de emergencia",
            `
                <p>
                    Cargando información...
                </p>
            `
        );

        return;

    }


    const contacto =
        vehiculoActual.contacto_emergencia ||
        "No registrado";


    mostrarModal(
        "Contacto de emergencia",
        `
            <p>

                <strong>
                    Contacto:
                </strong>

                ${escapeHtml(contacto)}

            </p>


            ${
                contacto !== "No registrado"
                ?
                `
                    <button
                        class="modal-action"
                        type="button"
                        onclick="window.location.href='tel:${escapeHtml(contacto)}'">

                        LLAMAR

                    </button>
                `
                :
                ""
            }
        `
    );

}


// ==========================================
// INFORMACIÓN DEL VEHÍCULO
// ==========================================

function mostrarInfo() {

    if (!vehiculoActual) {

        mostrarModal(
            "Información del vehículo",
            `
                <p>
                    Cargando información...
                </p>
            `
        );

        return;

    }


    mostrarModal(
        "Información del vehículo",
        `

            <p>

                <strong>
                    Patente:
                </strong>

                ${escapeHtml(
                    vehiculoActual.patente
                )}

            </p>


            <p>

                <strong>
                    Marca:
                </strong>

                ${escapeHtml(
                    vehiculoActual.marca
                )}

            </p>


            <p>

                <strong>
                    Modelo:
                </strong>

                ${escapeHtml(
                    vehiculoActual.modelo
                )}

            </p>


            <p>

                <strong>
                    Año:
                </strong>

                ${escapeHtml(
                    vehiculoActual.anio
                )}

            </p>


            <p>

                <strong>
                    Color:
                </strong>

                ${escapeHtml(
                    vehiculoActual.color
                )}

            </p>

        `
    );

}


// ==========================================
// MODAL
// ==========================================

function mostrarModal(
    titulo,
    contenido
) {

    const modal =
        document.getElementById(
            "modal"
        );


    const modalContent =
        document.getElementById(
            "modal-content"
        );


    if (
        !modal ||
        !modalContent
    ) {

        return;

    }


    modalContent.innerHTML = `

        <h2>
            ${escapeHtml(titulo)}
        </h2>

        ${contenido}

    `;


    modal.classList.remove(
        "hidden"
    );

}


// ==========================================
// CERRAR MODAL
// ==========================================

function cerrarModal() {

    const modal =
        document.getElementById(
            "modal"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


// ==========================================
// SEGURIDAD HTML
// ==========================================

function escapeHtml(text) {

    return String(
        text ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}        
