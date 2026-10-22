# Instalar la base de datos en Google Sheets y Drive (SegundoModelo)

Se usa el mismo formato que la versión 1 del estudio: una tabla **«Encuestas»** con una fila por participante y una tabla **«Multimedia»** con una fila por foto. Todo se instala con la cuenta dueña de la carpeta del estudio.

## Dónde quedan los datos

La carpeta ya está configurada en `Code.gs` (`ID_CARPETA`):

- Carpeta de Drive: <https://drive.google.com/drive/folders/1ONrrzrFvZFWx5VI2QhZAieMdr36u2EBP>

```
Hoja de cálculo «SME-RT – Base de datos»
├── Encuestas    una fila por participante (378 columnas): consentimiento, criterios de participación,
│                ficha, REBA (3 tareas), Check List OCRA, PTAI, NASA-TLX, CENSOPAS-COPSOQ,
│                Warr-Cook-Wall, Nórdico, módulo de atribución, puntajes y enlaces de las fotos
└── Multimedia   una fila por foto: ID de la encuesta, código, estrato, paso o tarea, enlace de Drive

Carpeta de Drive / Multimedia/
├── Egresado/    fotos (E-1234_REBA_Tarea_1_….jpg, E-1234_Foto_general_NASA-TLX_….jpg)
└── Interno/
```

Las dos tablas se relacionan por la columna **ID de la encuesta** (código del participante + momento de inicio).

**Actualización de filas:** cada participante tiene una sola fila. Si se vuelve a enviar (por ejemplo, al completar el momento 2), su fila se actualiza. Las fotos ya subidas no se vuelven a subir.

## Pasos (una sola vez)

1. Inicie sesión con la cuenta dueña de la carpeta. Cree una hoja de cálculo nueva dentro de la carpeta y llámela «SME-RT – Base de datos».
2. En esa hoja, entre a **Extensiones → Apps Script** y póngale de nombre «SME-RT» al proyecto.
3. En **Código.gs**, borre todo y pegue el contenido de `apps-script/Code.gs`. En GitHub, abra el archivo y use el botón «Copy raw file». Guarde con Ctrl+S.
4. En la lista de funciones, elija **configurar** y pulse **Ejecutar**. Acepte los permisos: **Revisar permisos** → su cuenta → **Configuración avanzada** → **Ir a SME-RT** → **Permitir**.
   - Se crean las pestañas **Encuestas** (378 columnas) y **Multimedia** (14 columnas), y las carpetas `Multimedia/Egresado` y `Multimedia/Interno`.
   - Si la hoja tiene una pestaña vacía (por ejemplo «Hoja 1»), se elimina.
5. Pulse **Implementar → Nueva implementación → ⚙️ Aplicación web** y configure:
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier usuario

   Pulse **Implementar** y copie la URL que termina en `/exec`.
6. Use esa URL en la encuesta de una de estas dos formas:
   - En cada celular: **Inicio → Configuración → Google Sheets y Drive**. Pegue la URL, pulse **Probar** y luego **Guardar**.
   - Para todos a la vez: escríbala en `SegundoModelo.html`, en la línea `const GS_URL = "";`. Si lo prefiere, envíela al asistente para que lo haga y suba el cambio a GitHub.

## Cómo se envían los datos

- **Automático:** al cerrar el momento 1, al finalizar el registro y al registrar un «No acepta» o un «No elegible», si hay conexión.
- **Manual:** **Inicio → Enviar datos → Google Sheets y Drive → Enviar pendientes**. Ahí se ve cada participante como «Pendiente» o «Enviado».
- **Sin internet:** todo queda guardado en el celular y se envía después. **Reintentar** no duplica filas ni fotos.

## Si cambia Code.gs

Pegue la versión nueva y vaya a **Implementar → Gestionar implementaciones**. Pulse el lápiz, elija **Nueva versión** y luego **Implementar**. La URL `/exec` no cambia.

Si el cambio agrega columnas, ejecute otra vez **configurar**: agrega las que falten y no borra datos.

## Notas

- La última columna, `Datos completos (JSON, no editar)`, guarda el registro completo sin las imágenes; no la edite.
- Las fotos quedan privadas en el Drive de la cuenta. Solo se suben si el participante las autorizó en el consentimiento.
- Cualquiera que tenga la URL `/exec` puede enviar datos. No la publique fuera del equipo del estudio.
