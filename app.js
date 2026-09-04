const documentos = {

    permiso: {

        titulo:
            "Permiso de circulación",

        texto:
            "Aquí se mostrará el documento digital del vehículo. Esta versión utiliza información de prueba."

    },


    revision: {

        titulo:
            "Revisión técnica",

        texto:
            "Aquí se mostrará la revisión técnica correspondiente al vehículo."

    },


    soap: {

        titulo:
            "SOAP",

        texto:
            "Aquí se mostrará el documento SOAP asociado al vehículo."

    },


    gases: {

        titulo:
            "Certificado de gases",

        texto:
            "Aquí se mostrará el certificado correspondiente, cuando aplique."

    },


    padron: {

        titulo:
            "Padrón",

        texto:
            "Este documento puede configurarse con acceso protegido mediante PIN."

    }

};



function verDocumento(tipo) {

    const doc =
        documentos[tipo];


    if (!doc) {

        return;

    }


    document.getElementById(
        "modal-content"
    ).innerHTML = `

        <h3>
            ${doc.titulo}
        </h3>

        <p>
            ${doc.texto}
        </p>

        <br>

        <small
            style="color:#079cff">

            NexumID · Documento digital

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
            En la versión final aquí aparecerá
            el contacto configurado por el
            propietario del vehículo.
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
            <strong>
                Patente:
            </strong>
            AB-CD-12
        </p>

        <p>
            <strong>
                Vehículo:
            </strong>
            Chevrolet Sail
        </p>

        <p>
            <strong>
                Año:
            </strong>
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
    function(e) {

        if (
            e.target === this
        ) {

            cerrarModal();

        }

    }
);
