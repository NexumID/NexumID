const documentos = {

    soap: {
        titulo: "SOAP",
        texto: "Aquí aparecerá el documento SOAP del vehículo."
    },

    revision: {
        titulo: "Revisión Técnica",
        texto: "Aquí aparecerá el documento de revisión técnica."
    },

    permiso: {
        titulo: "Permiso de Circulación",
        texto: "Aquí aparecerá el permiso de circulación."
    },

    gases: {
        titulo: "Certificado de Gases",
        texto: "Aquí aparecerá el certificado de gases."
    },

    padron: {
        titulo: "Padrón",
        texto: "Este documento tendrá acceso protegido."
    }

};


function verDocumento(tipo) {

    const documento =
        documentos[tipo];

    if (!documento) return;


    document.getElementById(
        "modal-content"
    ).innerHTML = `

        <h3>
            ${documento.titulo}
        </h3>

        <p>
            ${documento.texto}
        </p>

        <br>

        <small
            style="color:#079cff">

            NexumID · Identidad Digital Vehicular

        </small>

    `;


    document.getElementById(
        "modal"
    ).classList.remove(
        "hidden"
    );

}


function mostrarContacto() {

    document.getElementById(
        "modal-content"
    ).innerHTML = `

        <h3>
            Contacto de emergencia
        </h3>

        <p>
            Aquí aparecerá el contacto
            configurado por el propietario.
        </p>

    `;


    document.getElementById(
        "modal"
    ).classList.remove(
        "hidden"
    );

}


function mostrarInfo() {

    document.getElementById(
        "modal-content"
    ).innerHTML = `

        <h3>
            Información del vehículo
        </h3>

        <p>
            <strong>Patente:</strong>
            AB-CD-12
        </p>

        <p>
            <strong>Vehículo:</strong>
            Chevrolet Sail
        </p>

        <p>
            <strong>Año:</strong>
            2020
        </p>

    `;


    document.getElementById(
        "modal"
    ).classList.remove(
        "hidden"
    );

}


function cerrarModal() {

    document.getElementById(
        "modal"
    ).classList.add(
        "hidden"
    );

}


document.getElementById(
    "modal"
).addEventListener(
    "click",
    function(event) {

        if (
            event.target === this
        ) {

            cerrarModal();

        }

    }
);
