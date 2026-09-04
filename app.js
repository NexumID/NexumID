// ==========================================
// NEXUMID + SUPABASE
// ==========================================

const SUPABASE_URL = "https://tkrugleneazdeqhxxkvr.supabase.co";

const SUPABASE_KEY = "sb_publishable_1oVup3kgJeyOfHFoZeAfTw_-3TkiPib";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// VEHÍCULO DE PRUEBA
// ==========================================

const PATENTE = "AB-CD-12";

let vehiculoActual = null;
let documentosActuales = [];


// ==========================================
// CARGAR VEHÍCULO
// ==========================================

async function cargarVehiculo() {

    try {

        const { data, error } = await db
            .from("vehiculos")
            .select("*")
            .eq("patente", PATENTE)
            .single();

        if (error) {
            console.error("Error cargando vehículo:", error);
            return;
        }

        if (!data) {
            console.error("Vehículo no encontrado");
            return;
        }

        vehiculoActual = data;

        console.log("Vehículo cargado:", data);

        mostrarVehiculo(data);

        await cargarDocumentos(data.id);

    } catch (error) {

        console.error("Error:", error);

    }

}


// ==========================================
// MOSTRAR VEHÍCULO EN LA PÁGINA
// ==========================================

function mostrarVehiculo(vehiculo) {

    const patente = document.querySelector(".vehicle-info h1");
    const descripcion = document.querySelector(".vehicle-info p");

    if (patente) {

        patente.textContent = vehiculo.patente;

    }

    if (descripcion) {

        descripcion.textContent =
            `${vehiculo.marca} ${vehiculo.modelo} · ${vehiculo.anio}`;

    }

}


// ==========================================
// CARGAR DOCUMENTOS
// ==========================================

async function cargarDocumentos(vehiculoId) {

    try {

        const { data, error } = await db
            .from("documentos")
            .select("*")
            .eq("vehiculo_id", vehiculoId)
            .order("created_at", {
                ascending: true
            });

        if (error) {

            console.error(
                "Error cargando documentos:",
                error
            );

            return;
        }

        documentosActuales = data || [];

        console.log(
            "Documentos cargados:",
            documentosActuales
        );

    } catch (error) {

        console.error(
            "Error cargando documentos:",
            error
        );

    }

}


// ==========================================
// BUSCAR DOCUMENTO
// ==========================================

function buscarDocumento(tipo) {

    return documentosActuales.find(
        documento => documento.tipo === tipo
    );

}


// ==========================================
// VER DOCUMENTO
// ==========================================

async function verDocumento(tipo) {

    const documento = buscarDocumento(tipo);

    if (!documento) {

        mostrarModal(
            "Documento no disponible",
            "Este documento todavía no está cargado para este vehículo."
        );

        return;
    }


    // PADRÓN PROTEGIDO

    if (documento.protegido === true) {

        mostrarModal(
            "Documento protegido",
            `
            <p>Este documento requiere autorización.</p>

            <button
                class="modal-action"
                onclick="cerrarModal()">
                CERRAR
            </button>
            `
        );

        return;
    }


    // DOCUMENTO DISPONIBLE

    mostrarModal(
        documento.nombre || "Documento",
        `
        <p>
            Documento disponible en NexumID.
        </p>

        <p class="document-file">
            ${documento.archivo}
        </p>

        <button
            class="modal-action"
            onclick="abrirArchivo('${escapeHtml(documento.archivo)}')">

            VER DOCUMENTO

        </button>
        `
    );

}


// ==========================================
// ABRIR ARCHIVO
// ==========================================

async function abrirArchivo(ruta) {

    try {

        const { data, error } =
            await db.storage
                .from("documentos")
                .createSignedUrl(ruta, 300);

        if (error) {

            console.error(
                "Error creando URL:",
                error
            );

            mostrarModal(
                "No se pudo abrir",
                "El documento existe, pero todavía debemos configurar el acceso al archivo."
            );

            return;
        }

        if (data && data.signedUrl) {

            window.open(
                data.signedUrl,
                "_blank"
            );

        }

    } catch (error) {

        console.error(error);

    }

}


// ==========================================
// CONTACTO DE EMERGENCIA
// ==========================================

function mostrarContacto() {

    if (!vehiculoActual) {

        mostrarModal(
            "Contacto de emergencia",
            "Cargando información..."
        );

        return;
    }

    mostrarModal(
        "Contacto de emergencia",
        `
        <p>
            Información disponible para este vehículo.
        </p>

        <p>
            <strong>
                Contacto:
            </strong>
            ${vehiculoActual.contacto_emergencia || "No registrado"}
        </p>
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
            "Cargando información..."
        );

        return;
    }

    mostrarModal(
        "Información del vehículo",
        `
        <p>
            <strong>Patente:</strong>
            ${vehiculoActual.patente}
        </p>

        <p>
            <strong>Marca:</strong>
            ${vehiculoActual.marca}
        </p>

        <p>
            <strong>Modelo:</strong>
            ${vehiculoActual.modelo}
        </p>

        <p>
            <strong>Año:</strong>
            ${vehiculoActual.anio}
        </p>

        <p>
            <strong>Color:</strong>
            ${vehiculoActual.color}
        </p>
        `
    );

}


// ==========================================
// MODAL
// ==========================================

function mostrarModal(titulo, contenido) {

    const modal =
        document.getElementById("modal");

    const modalContent =
        document.getElementById("modal-content");

    if (!modal || !modalContent) {
        return;
    }

    modalContent.innerHTML = `
        <h2>${titulo}</h2>
        ${contenido}
    `;

    modal.classList.remove("hidden");

}


// ==========================================
// CERRAR MODAL
// ==========================================

function cerrarModal() {

    const modal =
        document.getElementById("modal");

    if (modal) {

        modal.classList.add("hidden");

    }

}


// ==========================================
// SEGURIDAD BÁSICA HTML
// ==========================================

function escapeHtml(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// INICIAR NEXUMID
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    cargarVehiculo
);
