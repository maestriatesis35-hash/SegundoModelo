# SegundoModelo · Aplicación de campo SME-RT (UCSS 2026)

Aplicación web, en un solo archivo HTML, para el estudio **«Factores ocupacionales asociados a síntomas musculoesqueléticos relacionados con el trabajo en fisioterapeutas egresados e internos en actividad asistencial de la Universidad Católica Sedes Sapientiae, 2026»** (Maestría en Salud Pública, Escuela de Posgrado, Universidad Nacional de Piura).

## Enlace de la encuesta

**https://maestriatesis35-hash.github.io/SegundoModelo/**

Se abre en cualquier celular, tableta o computadora, sin instalar nada. La página se publica con GitHub Pages desde la rama `main`; cada cambio que se sube aparece ahí en uno o dos minutos.

## Vistas

La barra superior tiene tres pestañas: **Inicio**, **Encuesta** y **Admin**.

**Encuesta**, paso a paso, en dos momentos:

- **Momento 1 (día de la observación):**
  1. Presentación del estudio y datos de registro: evaluador, condición del participante y código asignado al azar (E-#### o I-####).
  2. Hoja informativa y consentimiento informado, con autorización de fotografías.
  3. Criterios de participación (inclusión y exclusión), con el resultado de elegibilidad.
  4. Ficha de datos sociodemográficos y laborales.
  5. Observación ergonómica **REBA**: 2 o 3 tareas, cálculo automático y aviso de los datos que faltan.
  6. **Check List OCRA** por miembro superior.
  7. **PTAI**: observación de transferencias, con semáforo automático.
  8. **PTAI**: entrevista.
  9. **NASA-TLX** (versión sin ponderación, de 0 a 20 puntos), con escala de color, ajuste − / + y perfil radar.
  10. Cierre del momento 1.
- **Momento 2 (dentro de los 7 días siguientes):**
  1. **CENSOPAS-COPSOQ**, versión media (preguntas 25 a 34). Las preguntas de datos generales y de empleo (C3 a C24) están en la ficha del momento 1; las que ya estaban en la ficha (1, 2, 4.a, 5.a, 10 y 19) no se repiten.
  2. **Escala General de Satisfacción** (Warr, Cook y Wall), con escala deslizable de 1 a 7.
  3. Pausa de 5 minutos.
  4. **Cuestionario Nórdico**, con mapa corporal.
  5. Módulo de atribución laboral.
  6. Revisión y envío.

Funciones de apoyo:

- **Audio:** botones para escuchar cada pregunta en voz alta y responder con la voz (el dictado requiere Chrome o Edge).
- **Fotografías:** botón de cámara entre «Anterior» y «Siguiente», solo si el participante las autorizó.
- **Aviso de lo que falta:** al pulsar «Siguiente» se marcan las preguntas pendientes.
- **Guardado automático:** al actualizar la página se vuelve al mismo participante y al mismo paso.

**Admin** (con contraseña): avance por estrato y por evaluador, alertas, participantes, galería de fotografías, resultados preliminares descriptivos, importación de paquetes y exportación a CSV y JSON.

## Datos

Las respuestas se guardan primero en el propio dispositivo (IndexedDB del navegador) y desde ahí se envían a **Google Sheets y Drive**. El servidor es `apps-script/Code.gs`; para instalarlo paso a paso, vea [`apps-script/LEEME.md`](apps-script/LEEME.md).

- **Tabla «Encuestas»:** una fila por participante. La fila se actualiza al completar el momento 2.
- **Tabla «Multimedia»:** una fila por foto. Los archivos se guardan en la carpeta de Drive del estudio.

El envío es automático al cerrar cada momento, o manual desde **Enviar datos → Enviar pendientes**. Como respaldo, sigue disponible el paquete `.json`, que el administrador importa en su panel. En el primer ingreso al panel se crea la contraseña de ese dispositivo.

## Privacidad

El código no contiene datos de participantes. No suba al repositorio respuestas, fotografías ni archivos exportados (Ley N.° 29733, Ley de Protección de Datos Personales); el archivo `.gitignore` los excluye. Use dispositivos institucionales con bloqueo de pantalla y exporte respaldos periódicos.
