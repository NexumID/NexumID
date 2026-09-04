<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <meta name="theme-color"
          content="#05080d">

    <title>NexumID | Identidad Digital Vehicular</title>

    <link rel="stylesheet"
          href="estilo.css">

</head>


<body>


<main class="app">


    <!-- ENCABEZADO -->

    <header class="topbar">

        <div class="brand">

            <div class="brand-mark">
                N
            </div>

            <div>

                <div class="brand-name">
                    Nexum<span>ID</span>
                </div>

                <div class="brand-sub">
                    IDENTIDAD DIGITAL VEHICULAR
                </div>

            </div>

        </div>

        <div class="status-dot"></div>

    </header>



    <!-- VEHÍCULO -->

    <section class="hero">


        <div class="vehicle-photo">

            <div class="photo-placeholder">
                🚗
            </div>

            <div class="photo-overlay"></div>

        </div>


        <div class="vehicle-info">

            <span class="eyebrow">
                MI VEHÍCULO
            </span>

            <h1>
                AB-CD-12
            </h1>

            <p>
                Chevrolet Sail · 2020
            </p>

        </div>


    </section>



    <!-- DOCUMENTACIÓN -->

    <section class="documents">


        <div class="section-title">

            <span class="eyebrow">
                DOCUMENTACIÓN
            </span>

            <h2>
                Documentos disponibles
            </h2>

        </div>



        <!-- SOAP -->

        <div class="doc-card">

            <div class="doc-top">

                <div class="doc-icon">
                    🛡️
                </div>

                <div class="doc-info">

                    <h3>
                        SOAP
                    </h3>

                    <span class="vigente">
                        ● Vigente
                    </span>

                </div>

            </div>


            <button
                onclick="verDocumento('soap')">

                VER DOCUMENTO

            </button>

        </div>



        <!-- REVISIÓN TÉCNICA -->

        <div class="doc-card">

            <div class="doc-top">

                <div class="doc-icon">
                    🔧
                </div>

                <div class="doc-info">

                    <h3>
                        Revisión Técnica
                    </h3>

                    <span class="vigente">
                        ● Vigente
                    </span>

                </div>

            </div>


            <button
                onclick="verDocumento('revision')">

                VER DOCUMENTO

            </button>

        </div>



        <!-- PERMISO -->

        <div class="doc-card">

            <div class="doc-top">

                <div class="doc-icon">
                    📄
                </div>

                <div class="doc-info">

                    <h3>
                        Permiso de Circulación
                    </h3>

                    <span class="vigente">
                        ● Vigente
                    </span>

                </div>

            </div>


            <button
                onclick="verDocumento('permiso')">

                VER DOCUMENTO

            </button>

        </div>



        <!-- CERTIFICADO GASES -->

        <div class="doc-card">

            <div class="doc-top">

                <div class="doc-icon">
                    🌿
                </div>

                <div class="doc-info">

                    <h3>
                        Certificado de Gases
                    </h3>

                    <span class="vigente">
                        ● Vigente
                    </span>

                </div>

            </div>


            <button
                onclick="verDocumento('gases')">

                VER DOCUMENTO

            </button>

        </div>



        <!-- PADRÓN -->

        <div class="doc-card">

            <div class="doc-top">

                <div class="doc-icon">
                    🔐
                </div>

                <div class="doc-info">

                    <h3>
                        Padrón
                    </h3>

                    <span class="protegido">
                        ● Protegido
                    </span>

                </div>

            </div>


            <button
                onclick="verDocumento('padron')">

                VER DOCUMENTO

            </button>

        </div>


    </section>



    <!-- INFORMACIÓN -->

    <section class="extras">


        <div
            class="extra-card"
            onclick="mostrarContacto()">

            <span>
                ☎️
            </span>

            <div>

                <strong>
                    Contacto de emergencia
                </strong>

                <small>
                    Información del propietario
                </small>

            </div>

            <b>
                ›
            </b>

        </div>



        <div
            class="extra-card"
            onclick="mostrarInfo()">

            <span>
                🚘
            </span>

            <div>

                <strong>
                    Información del vehículo
                </strong>

                <small>
                    Datos del vehículo
                </small>

            </div>

            <b>
                ›
            </b>

        </div>


    </section>



    <!-- PIE -->

    <footer>

        <div class="footer-brand">
            Nexum<span>ID</span>
        </div>

        <p>
            IDENTIDAD DIGITAL VEHICULAR
        </p>

        <small>
            Una solución de
            <strong>
                Smart Box Connect
            </strong>
        </small>

    </footer>


</main>



<!-- VENTANA -->

<div
    id="modal"
    class="modal hidden">


    <div class="modal-box">


        <button
            class="close"
            onclick="cerrarModal()">

            ×

        </button>


        <div id="modal-content"></div>


    </div>


</div>



<script src="app.js"></script>


</body>

</html>
