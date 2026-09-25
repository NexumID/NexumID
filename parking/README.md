# NexumID Parking — piloto

Módulo de estacionamientos integrado al repositorio principal de NexumID.

## Experiencias

- **Persona con tarjeta:** solo presenta NFC/QR. No necesita cuenta ni panel.
- **Caja:** consulta la tarjeta y confirma la validación.
- **Margarita / administración:** revisa eventos y modifica horario, días, estado, estacionamiento y máximo de usos diarios.

## Backend

Proyecto Supabase: `NexumID`

Edge Function:

- `nexumid-parking-validar` (`verify_jwt=true`)

Tablas principales:

- `parking_clientes`
- `parking_estacionamientos`
- `parking_usuarios`
- `parking_tarjetas`
- `parking_operadores`
- `parking_eventos`

## Tarjetas

La tarjeta utiliza un token opaco. Supabase guarda solamente su SHA-256 en `parking_tarjetas.token_hash`.

Ejemplo de URL NFC/QR:

`https://nexumid.cl/parking/?token=TOKEN_ALEATORIO`

La caja debe mantener una sesión iniciada para validar. Si la tarjeta se presenta fuera de horario, supera su máximo diario, está inactiva o el usuario está suspendido, la validación es rechazada y queda registrada.

## Seguridad

El frontend contiene únicamente la publishable key de Supabase. La secret/service role key no se expone en GitHub ni en el navegador. Las comprobaciones sensibles se ejecutan en la Edge Function autenticada.
