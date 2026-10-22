/**
 * SME-RT – UCSS 2026 (SegundoModelo) · Base de datos en Google Sheets y Google Drive
 *
 * Tabla «Encuestas»:  una fila por participante con los valores cuantitativos y cualitativos (consentimiento,
 *                     criterios de participación, ficha, REBA, Check List OCRA, PTAI, NASA-TLX, CENSOPAS-COPSOQ,
 *                     Warr-Cook-Wall, Nórdico, módulo de atribución y puntajes). Si el participante vuelve a
 *                     enviarse (por ejemplo, al completar el momento 2), su fila se actualiza.
 * Tabla «Multimedia»: una fila por foto; el archivo se guarda en la carpeta de Drive del estudio
 *                     (Multimedia/Egresado y Multimedia/Interno) y se enlaza con «ID de la encuesta».
 *
 * Instalación: ver apps-script/LEEME.md. Primero ejecute configurar() una vez.
 */
const NOMBRE_HOJA = "SME-RT – Base de datos";
// carpeta del estudio en Google Drive: lo que sigue a /folders/ en el enlace de la carpeta
const ID_CARPETA = "1ONrrzrFvZFWx5VI2QhZAieMdr36u2EBP";
// hoja de cálculo: déjelo vacío para usar la hoja donde se creó el script (Extensiones → Apps Script)
// o, si el script es independiente, para crear «SME-RT – Base de datos» dentro de la carpeta
const ID_HOJA = "";
const HOJA_ENC = "Encuestas";
const HOJA_MM = "Multimedia";
// columnas de «Encuestas» (encabezado completo). Son las mismas que envía SegundoModelo.html (filaSheets)
const ENC_COLS = [
  "ID de la encuesta",
  "Fecha y hora de registro en Google Sheets",
  "Código del participante",
  "Estrato",
  "Estado de la encuesta",
  "Evaluador",
  "Fecha y hora de inicio",
  "Momento 1: fecha y hora de cierre",
  "Momento 2: fecha programada",
  "Momento 2: hora programada",
  "Momento 2: fecha y hora de cierre",
  "Fecha y hora de envío",
  "Consentimiento: ¿Acepta participar?",
  "Consentimiento: ¿Autoriza fotografías de sus posturas?",
  "Consentimiento: Firmó la hoja impresa (Anexo 2)",
  "Consentimiento: Motivo de no participación",
  "Criterio de inclusión: Figura en el listado institucional de elegibles",
  "Criterio de inclusión: Egresado/a 2020-2025 con atención directa de pacientes, o interno/a 2026, en un establecimiento de Chulucanas o Piura",
  "Criterio de inclusión: Tiene al menos 3 meses continuos de actividad asistencial",
  "Criterio de exclusión: Participa en la ejecución del estudio como encuestador o evaluador",
  "Criterios: Resultado de elegibilidad",
  "Criterios: Motivos de no elegibilidad",
  "Ficha: 2. Edad (años)",
  "Ficha: 3. Sexo",
  "Ficha: 4. Peso (kg)",
  "Ficha: 5. Talla (m)",
  "Ficha: 6. Mano dominante",
  "Ficha: 8. Año de egreso",
  "Ficha: 8. Fecha de inicio del internado",
  "Ficha: 9. Sede o centro asistencial donde realiza su actividad",
  "Ficha: 10. Área asistencial principal",
  "Ficha: 11. Tiempo en actividad asistencial (años)",
  "Ficha: 11. Tiempo en actividad asistencial (meses)",
  "Ficha: 12. ¿Cuántas horas trabaja durante el día?",
  "Ficha: 13. ¿Cuántos días a la semana realiza actividad asistencial?",
  "Ficha: 14. ¿Cuántos pacientes atiende en promedio por día?",
  "Ficha: 15. ¿Cuántas pausas activas realiza durante su turno?",
  "Ficha: 16. ¿Cuántos minutos en promedio dura su pausa activa?",
  "Ficha: 16a. ¿Qué tipo de pausas realiza principalmente?",
  "Ficha: 16b. ¿Su establecimiento tiene pausas programadas durante el turno?",
  "Ficha: 16c. ¿Con qué frecuencia logra realizar las pausas que le corresponden?",
  "Ficha: 17. ¿Tiene otro trabajo u ocupación además de esta actividad asistencial?",
  "Ficha: 17. Horas por semana de la segunda ocupación",
  "Ficha: 17a. ¿Cuántas horas a la semana dedica a actividades académicas?",
  "Ficha: 18. Nivel de dependencia predominante de los pacientes que atiende",
  "Ficha: 19. ¿Con qué frecuencia utiliza técnicas de terapia manual durante su jornada?",
  "Ficha: 20. ¿Dispone de ayudas mecánicas para movilizar pacientes?",
  "Ficha: 21. ¿Ha recibido capacitación en ergonomía o mecánica corporal en el último año?",
  "Ficha: 21a. ¿Realiza transferencias o movilización de pacientes dependientes?",
  "Ficha: 22. Días por semana de actividad física o deporte (≥ 30 minutos)",
  "Ficha: 23. Enfermedades diagnosticadas por un médico",
  "Ficha: 23. Otra enfermedad (¿cuál?)",
  "Ficha: 24. Traumatismo fuera del trabajo con dolor musculoesquelético (12 meses)",
  "Ficha: 24. Región afectada",
  "Ficha: Índice de masa corporal (kg/m²)",
  "Ficha: Horas asistenciales por semana",
  "REBA Tarea 1 – Tipo de tarea",
  "REBA Tarea 1 – Descripción breve",
  "REBA Tarea 1 – Ciclos observados",
  "REBA Tarea 1 – Lado evaluado",
  "REBA Tarea 1 – Tronco (puntaje 1–4)",
  "REBA Tarea 1 – Tronco con torsión o inclinación lateral (1 = sí)",
  "REBA Tarea 1 – Cuello (puntaje 1–2)",
  "REBA Tarea 1 – Cuello con torsión o inclinación lateral (1 = sí)",
  "REBA Tarea 1 – Piernas (puntaje 1–2)",
  "REBA Tarea 1 – Flexión de rodillas (puntaje 0–2)",
  "REBA Tarea 1 – Carga o fuerza (puntaje 0–2)",
  "REBA Tarea 1 – Fuerza brusca o instantánea (1 = sí)",
  "REBA Tarea 1 – Brazo (puntaje 1–4)",
  "REBA Tarea 1 – Brazo en abducción o rotación (1 = sí)",
  "REBA Tarea 1 – Hombro elevado (1 = sí)",
  "REBA Tarea 1 – Brazo apoyado o a favor de la gravedad (1 = sí)",
  "REBA Tarea 1 – Antebrazo (puntaje 1–2)",
  "REBA Tarea 1 – Muñeca (puntaje 1–2)",
  "REBA Tarea 1 – Muñeca con desviación o torsión (1 = sí)",
  "REBA Tarea 1 – Agarre (puntaje 0–3)",
  "REBA Tarea 1 – Una o más partes del cuerpo estáticas más de 1 minuto (1 = sí)",
  "REBA Tarea 1 – Movimientos repetidos más de 4 veces por minuto (1 = sí)",
  "REBA Tarea 1 – Cambios posturales bruscos o base inestable (1 = sí)",
  "REBA Tarea 1 – Puntaje A (tabla A + carga)",
  "REBA Tarea 1 – Puntaje B (tabla B + agarre)",
  "REBA Tarea 1 – Puntaje C (tabla C)",
  "REBA Tarea 1 – Puntaje de actividad",
  "REBA Tarea 1 – Puntaje total (1–15)",
  "REBA Tarea 1 – Nivel de riesgo",
  "REBA Tarea 2 – Tipo de tarea",
  "REBA Tarea 2 – Descripción breve",
  "REBA Tarea 2 – Ciclos observados",
  "REBA Tarea 2 – Lado evaluado",
  "REBA Tarea 2 – Tronco (puntaje 1–4)",
  "REBA Tarea 2 – Tronco con torsión o inclinación lateral (1 = sí)",
  "REBA Tarea 2 – Cuello (puntaje 1–2)",
  "REBA Tarea 2 – Cuello con torsión o inclinación lateral (1 = sí)",
  "REBA Tarea 2 – Piernas (puntaje 1–2)",
  "REBA Tarea 2 – Flexión de rodillas (puntaje 0–2)",
  "REBA Tarea 2 – Carga o fuerza (puntaje 0–2)",
  "REBA Tarea 2 – Fuerza brusca o instantánea (1 = sí)",
  "REBA Tarea 2 – Brazo (puntaje 1–4)",
  "REBA Tarea 2 – Brazo en abducción o rotación (1 = sí)",
  "REBA Tarea 2 – Hombro elevado (1 = sí)",
  "REBA Tarea 2 – Brazo apoyado o a favor de la gravedad (1 = sí)",
  "REBA Tarea 2 – Antebrazo (puntaje 1–2)",
  "REBA Tarea 2 – Muñeca (puntaje 1–2)",
  "REBA Tarea 2 – Muñeca con desviación o torsión (1 = sí)",
  "REBA Tarea 2 – Agarre (puntaje 0–3)",
  "REBA Tarea 2 – Una o más partes del cuerpo estáticas más de 1 minuto (1 = sí)",
  "REBA Tarea 2 – Movimientos repetidos más de 4 veces por minuto (1 = sí)",
  "REBA Tarea 2 – Cambios posturales bruscos o base inestable (1 = sí)",
  "REBA Tarea 2 – Puntaje A (tabla A + carga)",
  "REBA Tarea 2 – Puntaje B (tabla B + agarre)",
  "REBA Tarea 2 – Puntaje C (tabla C)",
  "REBA Tarea 2 – Puntaje de actividad",
  "REBA Tarea 2 – Puntaje total (1–15)",
  "REBA Tarea 2 – Nivel de riesgo",
  "REBA Tarea 3 – Tipo de tarea",
  "REBA Tarea 3 – Descripción breve",
  "REBA Tarea 3 – Ciclos observados",
  "REBA Tarea 3 – Lado evaluado",
  "REBA Tarea 3 – Tronco (puntaje 1–4)",
  "REBA Tarea 3 – Tronco con torsión o inclinación lateral (1 = sí)",
  "REBA Tarea 3 – Cuello (puntaje 1–2)",
  "REBA Tarea 3 – Cuello con torsión o inclinación lateral (1 = sí)",
  "REBA Tarea 3 – Piernas (puntaje 1–2)",
  "REBA Tarea 3 – Flexión de rodillas (puntaje 0–2)",
  "REBA Tarea 3 – Carga o fuerza (puntaje 0–2)",
  "REBA Tarea 3 – Fuerza brusca o instantánea (1 = sí)",
  "REBA Tarea 3 – Brazo (puntaje 1–4)",
  "REBA Tarea 3 – Brazo en abducción o rotación (1 = sí)",
  "REBA Tarea 3 – Hombro elevado (1 = sí)",
  "REBA Tarea 3 – Brazo apoyado o a favor de la gravedad (1 = sí)",
  "REBA Tarea 3 – Antebrazo (puntaje 1–2)",
  "REBA Tarea 3 – Muñeca (puntaje 1–2)",
  "REBA Tarea 3 – Muñeca con desviación o torsión (1 = sí)",
  "REBA Tarea 3 – Agarre (puntaje 0–3)",
  "REBA Tarea 3 – Una o más partes del cuerpo estáticas más de 1 minuto (1 = sí)",
  "REBA Tarea 3 – Movimientos repetidos más de 4 veces por minuto (1 = sí)",
  "REBA Tarea 3 – Cambios posturales bruscos o base inestable (1 = sí)",
  "REBA Tarea 3 – Puntaje A (tabla A + carga)",
  "REBA Tarea 3 – Puntaje B (tabla B + agarre)",
  "REBA Tarea 3 – Puntaje C (tabla C)",
  "REBA Tarea 3 – Puntaje de actividad",
  "REBA Tarea 3 – Puntaje total (1–15)",
  "REBA Tarea 3 – Nivel de riesgo",
  "REBA: Puntaje máximo (regla a priori)",
  "REBA: Puntaje promedio (sensibilidad)",
  "REBA: Nivel de riesgo del puntaje máximo",
  "OCRA miembro superior derecho – Factor recuperación",
  "OCRA miembro superior derecho – Factor frecuencia",
  "OCRA miembro superior derecho – Factor fuerza",
  "OCRA miembro superior derecho – Factor postura (máximo)",
  "OCRA miembro superior derecho – Factores complementarios",
  "OCRA miembro superior derecho – Multiplicador de duración",
  "OCRA miembro superior derecho – Puntaje",
  "OCRA miembro superior derecho – Nivel de riesgo",
  "OCRA miembro superior izquierdo – Factor recuperación",
  "OCRA miembro superior izquierdo – Factor frecuencia",
  "OCRA miembro superior izquierdo – Factor fuerza",
  "OCRA miembro superior izquierdo – Factor postura (máximo)",
  "OCRA miembro superior izquierdo – Factores complementarios",
  "OCRA miembro superior izquierdo – Multiplicador de duración",
  "OCRA miembro superior izquierdo – Puntaje",
  "OCRA miembro superior izquierdo – Nivel de riesgo",
  "OCRA: Puntaje máximo (regla a priori)",
  "PTAI: ¿Realiza transferencias de pacientes en su jornada?",
  "PTAI Transferencia 1 – Tipo de transferencia",
  "PTAI Transferencia 1 – Nivel funcional del paciente",
  "PTAI Transferencia 1 – Ayudas utilizadas",
  "PTAI Transferencia 1 – N.º de asistentes",
  "PTAI Transferencia 1 – 1. Condiciones de trabajo: Temperatura (1 = cumple)",
  "PTAI Transferencia 1 – 1. Condiciones de trabajo: Corriente de aire (1 = cumple)",
  "PTAI Transferencia 1 – 1. Condiciones de trabajo: Luz (1 = cumple)",
  "PTAI Transferencia 1 – 1. Condiciones de trabajo: zona",
  "PTAI Transferencia 1 – 2. Entorno laboral y calzado: Espacio (1 = cumple)",
  "PTAI Transferencia 1 – 2. Entorno laboral y calzado: Sujetador ajustable (1 = cumple)",
  "PTAI Transferencia 1 – 2. Entorno laboral y calzado: Zapatos (1 = cumple)",
  "PTAI Transferencia 1 – 2. Entorno laboral y calzado: zona",
  "PTAI Transferencia 1 – 3. Elevadores de pacientes: Presente (1 = cumple)",
  "PTAI Transferencia 1 – 3. Elevadores de pacientes: Adecuado (1 = cumple)",
  "PTAI Transferencia 1 – 3. Elevadores de pacientes: Uso correcto (1 = cumple)",
  "PTAI Transferencia 1 – 3. Elevadores de pacientes: zona",
  "PTAI Transferencia 1 – 4. Pequeñas ayudas: Presente (1 = cumple)",
  "PTAI Transferencia 1 – 4. Pequeñas ayudas: Adecuado (1 = cumple)",
  "PTAI Transferencia 1 – 4. Pequeñas ayudas: Uso correcto (1 = cumple)",
  "PTAI Transferencia 1 – 4. Pequeñas ayudas: zona",
  "PTAI Transferencia 1 – 5. Distancia y altura de transferencia: No pisar (1 = cumple)",
  "PTAI Transferencia 1 – 5. Distancia y altura de transferencia: Rodilla-codo (1 = cumple)",
  "PTAI Transferencia 1 – 5. Distancia y altura de transferencia: No alcanzar (1 = cumple)",
  "PTAI Transferencia 1 – 5. Distancia y altura de transferencia: zona",
  "PTAI Transferencia 1 – 6. Carga de extremidades superiores y tronco: Sujetar (1 = cumple)",
  "PTAI Transferencia 1 – 6. Carga de extremidades superiores y tronco: Codo/hombro (1 = cumple)",
  "PTAI Transferencia 1 – 6. Carga de extremidades superiores y tronco: Muñeca/dedos (1 = cumple)",
  "PTAI Transferencia 1 – 6. Carga de extremidades superiores y tronco: zona",
  "PTAI Transferencia 1 – 7. Tensión en la zona lumbar: Flexión (1 = cumple)",
  "PTAI Transferencia 1 – 7. Tensión en la zona lumbar: Giro (1 = cumple)",
  "PTAI Transferencia 1 – 7. Tensión en la zona lumbar: Control corporal (1 = cumple)",
  "PTAI Transferencia 1 – 7. Tensión en la zona lumbar: zona",
  "PTAI Transferencia 1 – 8. Carga de extremidades inferiores: Fuerza muscular (1 = cumple)",
  "PTAI Transferencia 1 – 8. Carga de extremidades inferiores: Rodilla-pie (1 = cumple)",
  "PTAI Transferencia 1 – 8. Carga de extremidades inferiores: No ponerse en cuclillas (1 = cumple)",
  "PTAI Transferencia 1 – 8. Carga de extremidades inferiores: zona",
  "PTAI Transferencia 1 – 9. Habilidad de transferencia y fluidez: Explicación/activación del paciente (1 = cumple)",
  "PTAI Transferencia 1 – 9. Habilidad de transferencia y fluidez: Agarre (1 = cumple)",
  "PTAI Transferencia 1 – 9. Habilidad de transferencia y fluidez: Naturalidad (1 = cumple)",
  "PTAI Transferencia 1 – 9. Habilidad de transferencia y fluidez: zona",
  "PTAI Transferencia 1 – Comentarios",
  "PTAI Transferencia 2 – Tipo de transferencia",
  "PTAI Transferencia 2 – Nivel funcional del paciente",
  "PTAI Transferencia 2 – Ayudas utilizadas",
  "PTAI Transferencia 2 – N.º de asistentes",
  "PTAI Transferencia 2 – 1. Condiciones de trabajo: Temperatura (1 = cumple)",
  "PTAI Transferencia 2 – 1. Condiciones de trabajo: Corriente de aire (1 = cumple)",
  "PTAI Transferencia 2 – 1. Condiciones de trabajo: Luz (1 = cumple)",
  "PTAI Transferencia 2 – 1. Condiciones de trabajo: zona",
  "PTAI Transferencia 2 – 2. Entorno laboral y calzado: Espacio (1 = cumple)",
  "PTAI Transferencia 2 – 2. Entorno laboral y calzado: Sujetador ajustable (1 = cumple)",
  "PTAI Transferencia 2 – 2. Entorno laboral y calzado: Zapatos (1 = cumple)",
  "PTAI Transferencia 2 – 2. Entorno laboral y calzado: zona",
  "PTAI Transferencia 2 – 3. Elevadores de pacientes: Presente (1 = cumple)",
  "PTAI Transferencia 2 – 3. Elevadores de pacientes: Adecuado (1 = cumple)",
  "PTAI Transferencia 2 – 3. Elevadores de pacientes: Uso correcto (1 = cumple)",
  "PTAI Transferencia 2 – 3. Elevadores de pacientes: zona",
  "PTAI Transferencia 2 – 4. Pequeñas ayudas: Presente (1 = cumple)",
  "PTAI Transferencia 2 – 4. Pequeñas ayudas: Adecuado (1 = cumple)",
  "PTAI Transferencia 2 – 4. Pequeñas ayudas: Uso correcto (1 = cumple)",
  "PTAI Transferencia 2 – 4. Pequeñas ayudas: zona",
  "PTAI Transferencia 2 – 5. Distancia y altura de transferencia: No pisar (1 = cumple)",
  "PTAI Transferencia 2 – 5. Distancia y altura de transferencia: Rodilla-codo (1 = cumple)",
  "PTAI Transferencia 2 – 5. Distancia y altura de transferencia: No alcanzar (1 = cumple)",
  "PTAI Transferencia 2 – 5. Distancia y altura de transferencia: zona",
  "PTAI Transferencia 2 – 6. Carga de extremidades superiores y tronco: Sujetar (1 = cumple)",
  "PTAI Transferencia 2 – 6. Carga de extremidades superiores y tronco: Codo/hombro (1 = cumple)",
  "PTAI Transferencia 2 – 6. Carga de extremidades superiores y tronco: Muñeca/dedos (1 = cumple)",
  "PTAI Transferencia 2 – 6. Carga de extremidades superiores y tronco: zona",
  "PTAI Transferencia 2 – 7. Tensión en la zona lumbar: Flexión (1 = cumple)",
  "PTAI Transferencia 2 – 7. Tensión en la zona lumbar: Giro (1 = cumple)",
  "PTAI Transferencia 2 – 7. Tensión en la zona lumbar: Control corporal (1 = cumple)",
  "PTAI Transferencia 2 – 7. Tensión en la zona lumbar: zona",
  "PTAI Transferencia 2 – 8. Carga de extremidades inferiores: Fuerza muscular (1 = cumple)",
  "PTAI Transferencia 2 – 8. Carga de extremidades inferiores: Rodilla-pie (1 = cumple)",
  "PTAI Transferencia 2 – 8. Carga de extremidades inferiores: No ponerse en cuclillas (1 = cumple)",
  "PTAI Transferencia 2 – 8. Carga de extremidades inferiores: zona",
  "PTAI Transferencia 2 – 9. Habilidad de transferencia y fluidez: Explicación/activación del paciente (1 = cumple)",
  "PTAI Transferencia 2 – 9. Habilidad de transferencia y fluidez: Agarre (1 = cumple)",
  "PTAI Transferencia 2 – 9. Habilidad de transferencia y fluidez: Naturalidad (1 = cumple)",
  "PTAI Transferencia 2 – 9. Habilidad de transferencia y fluidez: zona",
  "PTAI Transferencia 2 – Comentarios",
  "PTAI 10. Explicación de las actitudes laborales: ¿Recibió alguna explicación sobre las posturas?",
  "PTAI 10. Explicación de las actitudes laborales: ¿Ha recibido entrenamiento en transferencias en los últimos 2 años?",
  "PTAI 10. Explicación de las actitudes laborales: ¿Mantiene una buena postura durante las transferencias?",
  "PTAI 10. Explicación de las actitudes laborales: zona",
  "PTAI 11. Uso de ayudas y explicaciones: ¿Ha recibido explicación sobre las ayudas técnicas?",
  "PTAI 11. Uso de ayudas y explicaciones: ¿Existe algún acuerdo sobre su reparación y mantenimiento?",
  "PTAI 11. Uso de ayudas y explicaciones: ¿Sabe cómo utilizar todas las ayudas técnicas?",
  "PTAI 11. Uso de ayudas y explicaciones: zona",
  "PTAI 12. Organización: ¿Se toman los descansos según lo previsto?",
  "PTAI 12. Organización: ¿Recibe ayuda con los traslados en todos los turnos cuando la necesita?",
  "PTAI 12. Organización: ¿Puede interrumpir su trabajo para un breve descanso?",
  "PTAI 12. Organización: zona",
  "PTAI 13. Estrés mental: ¿Se realizan los traslados según lo previsto?",
  "PTAI 13. Estrés mental: ¿Se realizan los traslados sin prisas?",
  "PTAI 13. Estrés mental: ¿Hay más de un empleado en todos los turnos?",
  "PTAI 13. Estrés mental: zona",
  "PTAI 14. Esfuerzo físico",
  "PTAI 15. Frecuencia de transferencias (asistencia > 15 kg)",
  "PTAI: Factores en zona verde",
  "PTAI: Factores en zona amarilla",
  "PTAI: Factores en zona roja",
  "NASA-TLX: Exigencia mental (0–20)",
  "NASA-TLX: Exigencia física (0–20)",
  "NASA-TLX: Exigencia temporal (0–20)",
  "NASA-TLX: Rendimiento (0–20)",
  "NASA-TLX: Esfuerzo (0–20)",
  "NASA-TLX: Frustración (0–20)",
  "NASA-TLX: Puntaje global Raw (0–100)",
  "CENSOPAS-COPSOQ – Exigencias psicológicas – ítem 1",
  "CENSOPAS-COPSOQ – Exigencias psicológicas – ítem 2",
  "CENSOPAS-COPSOQ – Exigencias psicológicas – ítem 3",
  "CENSOPAS-COPSOQ – Exigencias psicológicas – ítem 4",
  "CENSOPAS-COPSOQ – Exigencias psicológicas – ítem 5",
  "CENSOPAS-COPSOQ – Exigencias psicológicas – ítem 6",
  "CENSOPAS-COPSOQ – Exigencias psicológicas – ítem 7",
  "CENSOPAS-COPSOQ – Conflicto trabajo-familia (doble presencia) – ítem 1",
  "CENSOPAS-COPSOQ – Conflicto trabajo-familia (doble presencia) – ítem 2",
  "CENSOPAS-COPSOQ – Conflicto trabajo-familia (doble presencia) – ítem 3",
  "CENSOPAS-COPSOQ – Control sobre el trabajo – ítem 1",
  "CENSOPAS-COPSOQ – Control sobre el trabajo – ítem 2",
  "CENSOPAS-COPSOQ – Control sobre el trabajo – ítem 3",
  "CENSOPAS-COPSOQ – Control sobre el trabajo – ítem 4",
  "CENSOPAS-COPSOQ – Control sobre el trabajo – ítem 5",
  "CENSOPAS-COPSOQ – Apoyo social y calidad de liderazgo – ítem 1",
  "CENSOPAS-COPSOQ – Apoyo social y calidad de liderazgo – ítem 2",
  "CENSOPAS-COPSOQ – Apoyo social y calidad de liderazgo – ítem 3",
  "CENSOPAS-COPSOQ – Apoyo social y calidad de liderazgo – ítem 4",
  "CENSOPAS-COPSOQ – Apoyo social y calidad de liderazgo – ítem 5",
  "CENSOPAS-COPSOQ – Apoyo social y calidad de liderazgo – ítem 6",
  "CENSOPAS-COPSOQ – Apoyo social y calidad de liderazgo – ítem 7",
  "CENSOPAS-COPSOQ – Compensaciones – ítem 1",
  "CENSOPAS-COPSOQ – Compensaciones – ítem 2",
  "CENSOPAS-COPSOQ – Compensaciones – ítem 3",
  "CENSOPAS-COPSOQ – Compensaciones – ítem 4",
  "CENSOPAS-COPSOQ – Compensaciones – ítem 5",
  "CENSOPAS-COPSOQ – Capital social – ítem 1",
  "CENSOPAS-COPSOQ – Capital social – ítem 2",
  "CENSOPAS-COPSOQ – Capital social – ítem 3",
  "CENSOPAS-COPSOQ – Capital social – ítem 4",
  "Warr P1. Satisfacción con: Condiciones físicas del trabajo (1–7)",
  "Warr P2. Satisfacción con: Libertad para elegir tu propio método de trabajo (1–7)",
  "Warr P3. Satisfacción con: Tus compañeros de trabajo (1–7)",
  "Warr P4. Satisfacción con: Reconocimiento que obtienes por el trabajo bien hecho (1–7)",
  "Warr P5. Satisfacción con: Tu superior inmediato (1–7)",
  "Warr P6. Satisfacción con: Responsabilidad que se te ha asignado (1–7)",
  "Warr P7. Satisfacción con: Tu salario (1–7)",
  "Warr P8. Satisfacción con: La posibilidad de utilizar tus capacidades (1–7)",
  "Warr P9. Satisfacción con: Relaciones entre dirección y trabajadores en tu institución (1–7)",
  "Warr P10. Satisfacción con: Tus posibilidades de promocionar (1–7)",
  "Warr P11. Satisfacción con: El modo en que tu institución está gestionada (1–7)",
  "Warr P12. Satisfacción con: La atención que se presta a las sugerencias que haces (1–7)",
  "Warr P13. Satisfacción con: Tu horario de trabajo (1–7)",
  "Warr P14. Satisfacción con: La variedad de tareas que realizas en tu trabajo (1–7)",
  "Warr P15. Satisfacción con: Tu estabilidad en el empleo (1–7)",
  "Warr: Satisfacción general (15–105)",
  "Warr: Satisfacción intrínseca (7–49)",
  "Warr: Satisfacción extrínseca (8–56)",
  "Pausa de 5 minutos",
  "Nórdico – Cuello: ¿Problemas en los últimos 12 meses?",
  "Nórdico – Cuello: ¿Le impidió realizar sus actividades normales (12 meses)?",
  "Nórdico – Cuello: ¿Problemas en los últimos 7 días?",
  "Módulo de atribución – Cuello: ¿Relacionada con su actividad asistencial?",
  "Módulo de atribución – Cuello: ¿Se inició o empeoró después de iniciar la actividad asistencial?",
  "Nórdico – Hombros: ¿Problemas en los últimos 12 meses?",
  "Nórdico – Hombros: Lado",
  "Nórdico – Hombros: ¿Le impidió realizar sus actividades normales (12 meses)?",
  "Nórdico – Hombros: ¿Problemas en los últimos 7 días?",
  "Módulo de atribución – Hombros: ¿Relacionada con su actividad asistencial?",
  "Módulo de atribución – Hombros: ¿Se inició o empeoró después de iniciar la actividad asistencial?",
  "Nórdico – Codos: ¿Problemas en los últimos 12 meses?",
  "Nórdico – Codos: Lado",
  "Nórdico – Codos: ¿Le impidió realizar sus actividades normales (12 meses)?",
  "Nórdico – Codos: ¿Problemas en los últimos 7 días?",
  "Módulo de atribución – Codos: ¿Relacionada con su actividad asistencial?",
  "Módulo de atribución – Codos: ¿Se inició o empeoró después de iniciar la actividad asistencial?",
  "Nórdico – Muñecas/manos: ¿Problemas en los últimos 12 meses?",
  "Nórdico – Muñecas/manos: Lado",
  "Nórdico – Muñecas/manos: ¿Le impidió realizar sus actividades normales (12 meses)?",
  "Nórdico – Muñecas/manos: ¿Problemas en los últimos 7 días?",
  "Módulo de atribución – Muñecas/manos: ¿Relacionada con su actividad asistencial?",
  "Módulo de atribución – Muñecas/manos: ¿Se inició o empeoró después de iniciar la actividad asistencial?",
  "Nórdico – Espalda dorsal (alta): ¿Problemas en los últimos 12 meses?",
  "Nórdico – Espalda dorsal (alta): ¿Le impidió realizar sus actividades normales (12 meses)?",
  "Nórdico – Espalda dorsal (alta): ¿Problemas en los últimos 7 días?",
  "Módulo de atribución – Espalda dorsal (alta): ¿Relacionada con su actividad asistencial?",
  "Módulo de atribución – Espalda dorsal (alta): ¿Se inició o empeoró después de iniciar la actividad asistencial?",
  "Nórdico – Espalda lumbar (baja): ¿Problemas en los últimos 12 meses?",
  "Nórdico – Espalda lumbar (baja): ¿Le impidió realizar sus actividades normales (12 meses)?",
  "Nórdico – Espalda lumbar (baja): ¿Problemas en los últimos 7 días?",
  "Módulo de atribución – Espalda lumbar (baja): ¿Relacionada con su actividad asistencial?",
  "Módulo de atribución – Espalda lumbar (baja): ¿Se inició o empeoró después de iniciar la actividad asistencial?",
  "Nórdico – Caderas/muslos: ¿Problemas en los últimos 12 meses?",
  "Nórdico – Caderas/muslos: ¿Le impidió realizar sus actividades normales (12 meses)?",
  "Nórdico – Caderas/muslos: ¿Problemas en los últimos 7 días?",
  "Módulo de atribución – Caderas/muslos: ¿Relacionada con su actividad asistencial?",
  "Módulo de atribución – Caderas/muslos: ¿Se inició o empeoró después de iniciar la actividad asistencial?",
  "Nórdico – Rodillas: ¿Problemas en los últimos 12 meses?",
  "Nórdico – Rodillas: ¿Le impidió realizar sus actividades normales (12 meses)?",
  "Nórdico – Rodillas: ¿Problemas en los últimos 7 días?",
  "Módulo de atribución – Rodillas: ¿Relacionada con su actividad asistencial?",
  "Módulo de atribución – Rodillas: ¿Se inició o empeoró después de iniciar la actividad asistencial?",
  "Nórdico – Tobillos/pies: ¿Problemas en los últimos 12 meses?",
  "Nórdico – Tobillos/pies: ¿Le impidió realizar sus actividades normales (12 meses)?",
  "Nórdico – Tobillos/pies: ¿Problemas en los últimos 7 días?",
  "Módulo de atribución – Tobillos/pies: ¿Relacionada con su actividad asistencial?",
  "Módulo de atribución – Tobillos/pies: ¿Se inició o empeoró después de iniciar la actividad asistencial?",
  "Nórdico: Regiones con síntomas en los últimos 12 meses",
  "SME-RT: Desenlace primario a 12 meses (1 = sí)",
  "Número de fotos",
  "IDs de las fotos en Drive",
  "Enlaces de las fotos en Drive",
  "Datos completos (JSON, no editar)"
];
// columnas de «Multimedia» (encabezado completo)
const MM_COLS = [
  "ID de la foto",
  "ID de la encuesta",
  "Código del participante",
  "Estrato",
  "Evaluador",
  "Paso o tarea",
  "Tipo de tarea REBA",
  "Tipo de archivo",
  "Nombre del archivo en Drive",
  "Tamaño (KB)",
  "ID del archivo en Drive",
  "Enlace de la foto en Drive",
  "Fecha y hora de la foto",
  "Fecha y hora de registro en Drive"
];
// encabezados que usa el servidor (deben coincidir con ENC_COLS y MM_COLS)
const C_ID = "ID de la encuesta", C_REG = "Fecha y hora de registro en Google Sheets", C_JSON = "Datos completos (JSON, no editar)";
const M_ID = "ID de la foto", M_DRIVE = "ID del archivo en Drive", M_URL = "Enlace de la foto en Drive";
const PROPS = PropertiesService.getScriptProperties();

/* ---------------------------------------------------------------------------
   Configuración (se ejecuta a mano una vez desde el editor de Apps Script)
   --------------------------------------------------------------------------- */
function configurar() {
  const carpeta = DriveApp.getFolderById(ID_CARPETA);
  let ss = ID_HOJA ? SpreadsheetApp.openById(ID_HOJA) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss && PROPS.getProperty("HOJA")) { try { ss = SpreadsheetApp.openById(PROPS.getProperty("HOJA")); } catch (e) { ss = null; } }
  if (!ss) { ss = SpreadsheetApp.create(NOMBRE_HOJA); DriveApp.getFileById(ss.getId()).moveTo(carpeta); }

  const enc = ss.getSheetByName(HOJA_ENC) || ss.insertSheet(HOJA_ENC);
  const mm = ss.getSheetByName(HOJA_MM) || ss.insertSheet(HOJA_MM);
  ss.getSheets().forEach(h => { if (h.getName() !== HOJA_ENC && h.getName() !== HOJA_MM && h.getLastRow() === 0) ss.deleteSheet(h); });
  // encabezados de todas las respuestas y de la multimedia
  columnas(enc, ENC_COLS);
  columnas(mm, MM_COLS);

  const fotos = subcarpeta(carpeta, "Multimedia");
  subcarpeta(fotos, "Egresado"); subcarpeta(fotos, "Interno");
  PROPS.setProperties({ HOJA: ss.getId(), FOTOS: fotos.getId() });
  Logger.log("Carpeta de Drive: " + carpeta.getUrl());
  Logger.log("Hoja de cálculo: " + ss.getUrl());
  Logger.log("Columnas: «Encuestas» " + ENC_COLS.length + " · «Multimedia» " + MM_COLS.length);
}

/* ---------------------------------------------------------------------------
   Puntos de entrada
   --------------------------------------------------------------------------- */
// el enlace /exec solo recibe datos: la encuesta es SegundoModelo.html (GS_URL o Configuración)
function doGet() {
  return ContentService.createTextOutput("Servidor del estudio SME-RT activo. Abra la encuesta desde SegundoModelo.html.");
}

// SegundoModelo.html envía cada pedido aquí
function doPost(e) {
  let req = null;
  try { req = JSON.parse(e.postData.contents); } catch (err) { req = null; }
  return ContentService.createTextOutput(JSON.stringify(api(req))).setMimeType(ContentService.MimeType.JSON);
}

function api(req) {
  try {
    switch (req && req.action) {
      case "estado": return { ok: true, configurado: !!PROPS.getProperty("HOJA") };
      case "guardarEncuesta": return guardarEncuesta(req);
      case "subirFoto": return subirFoto(req);
      default: return { ok: false, error: "Acción desconocida" };
    }
  } catch (e) {
    return { ok: false, error: String((e && e.message) || e), code: (e && e.code) || "" };
  }
}

/* ---------------------------------------------------------------------------
   Tabla «Encuestas»: inserta la fila o, si el participante ya está, la actualiza
   --------------------------------------------------------------------------- */
function guardarEncuesta(req) {
  const rec = req.rec, fila = req.fila;
  if (!rec || typeof rec.id !== "string" || !/^[EI]-\d{1,4}_\d+$/.test(rec.id)) throw falla("Registro inválido", "datos");
  if (!fila || !Array.isArray(fila.cols) || !Array.isArray(fila.vals) || fila.cols.length !== fila.vals.length) throw falla("Fila inválida", "datos");
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const sh = tabla(HOJA_ENC);
    const vals = {};
    fila.cols.forEach((c, i) => { vals[c] = fila.vals[i]; });
    vals[C_ID] = rec.id; vals[C_REG] = new Date(); vals[C_JSON] = JSON.stringify(rec);
    const n = fila_(sh, C_ID, rec.id);
    escribir(sh, ENC_COLS.concat(fila.cols.filter(c => ENC_COLS.indexOf(c) < 0)), vals, n);
    return { ok: true, id: rec.id, actualizada: !!n };
  } finally { lock.releaseLock(); }
}

/* ---------------------------------------------------------------------------
   Tabla «Multimedia» y archivos en Drive (una foto no se sube dos veces)
   --------------------------------------------------------------------------- */
function subirFoto(req) {
  const f = req.foto || {};
  const m = typeof f.data === "string" ? f.data.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/) : null;
  if (!m || typeof f.id !== "string" || !/^[EI]-\d{1,4}_\d+_[\w-]+$/.test(f.id)) throw falla("Foto inválida", "datos");
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    const sh = tabla(HOJA_MM);
    const prev = buscar(sh, M_ID, f.id);
    if (prev) return { ok: true, id: f.id, archivo: String(prev[M_DRIVE]), url: String(prev[M_URL]), repetida: true };
    const ext = m[1] === "image/png" ? "png" : m[1] === "image/webp" ? "webp" : "jpg";
    const nombre = f.codigo + "_" + String(f.paso || "foto").replace(/[^\wÁÉÍÓÚáéíóúÑñ-]+/g, "_") + "_" + f.id.split("_").pop() + "." + ext;
    const bytes = Utilities.base64Decode(m[2]);
    const carpeta = subcarpeta(DriveApp.getFolderById(PROPS.getProperty("FOTOS")), f.estrato === "Interno" ? "Interno" : "Egresado");
    const file = carpeta.createFile(Utilities.newBlob(bytes, m[1], nombre));
    // mismo orden que MM_COLS
    const v = [f.id, f.encuesta, f.codigo, f.estrato, f.evaluador || "", f.paso || "", f.tarea || "", m[1], nombre, Math.round(bytes.length / 102.4) / 10,
      file.getId(), file.getUrl(), f.ts ? new Date(f.ts) : "", new Date()];
    const vals = {}; MM_COLS.forEach((c, i) => { vals[c] = v[i]; });
    escribir(sh, MM_COLS, vals);
    return { ok: true, id: f.id, archivo: file.getId(), url: file.getUrl() };
  } finally { lock.releaseLock(); }
}

/* ---------------------------------------------------------------------------
   Utilidades
   --------------------------------------------------------------------------- */
function libro() {
  const id = PROPS.getProperty("HOJA");
  if (!id) throw falla("La base de datos no está configurada: ejecute configurar() en Apps Script", "config");
  return SpreadsheetApp.openById(id);
}
function tabla(nombre) { const h = libro().getSheetByName(nombre); if (!h) throw falla("Falta la tabla «" + nombre + "»: ejecute configurar()", "config"); return h; }
function encabezado(sh) { const n = sh.getLastColumn(); return n ? sh.getRange(1, 1, 1, n).getValues()[0].map(String) : []; }

// número de fila (2, 3…) donde la columna tiene ese valor, o 0
function fila_(sh, col, valor) {
  const head = encabezado(sh), j = head.indexOf(col), n = sh.getLastRow();
  if (j < 0 || n < 2) return 0;
  const vals = sh.getRange(2, j + 1, n - 1, 1).getValues();
  for (let i = 0; i < vals.length; i++) if (String(vals[i][0]) === String(valor)) return i + 2;
  return 0;
}
// busca una fila por el valor de una columna y la devuelve como objeto
function buscar(sh, col, valor) {
  const n = fila_(sh, col, valor); if (!n) return null;
  const head = encabezado(sh), row = sh.getRange(n, 1, 1, head.length).getValues()[0], o = {};
  head.forEach((h, k) => { o[h] = row[k]; });
  return o;
}

// escribe los encabezados que falten (en orden), sin notas
function columnas(sh, cols) {
  if (sh.getLastRow() <= 1 && sh.getLastColumn() > 0) sh.getRange(1, 1, 1, sh.getLastColumn()).clearContent();
  let head = encabezado(sh).filter(String);
  const faltan = cols.filter(c => head.indexOf(c) < 0);
  if (faltan.length) {
    const need = head.length + faltan.length - sh.getMaxColumns();
    if (need > 0) sh.insertColumnsAfter(sh.getMaxColumns(), need);
    sh.getRange(1, head.length + 1, 1, faltan.length).setValues([faltan]);
    head = head.concat(faltan);
  }
  sh.getRange(1, 1, 1, head.length).clearNote().setFontWeight("bold").setBackground("#FFE1E8");
  formato(sh, head);
}

// encabezado con el texto ajustado al ancho de la columna y todo el contenido centrado
function formato(sh, head) {
  const n = head.length;
  sh.setColumnWidths(1, n, 170);
  const j = head.indexOf(C_JSON); if (j >= 0) sh.setColumnWidth(j + 1, 120);
  sh.getRange(1, 1, sh.getMaxRows(), n).setHorizontalAlignment("center").setVerticalAlignment("middle")
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sh.getRange(1, 1, 1, n).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  SpreadsheetApp.flush();
  sh.autoResizeRows(1, 1); // la altura del encabezado se ajusta al texto
  sh.setFrozenRows(1);
}

// escribe una fila ordenada por nombre de columna (nueva o en la fila n); crea las columnas que falten
function escribir(sh, cols, vals, n) {
  let head = encabezado(sh);
  const faltan = cols.filter(c => head.indexOf(c) < 0);
  if (faltan.length) {
    const need = head.length + faltan.length - sh.getMaxColumns();
    if (need > 0) sh.insertColumnsAfter(sh.getMaxColumns(), need);
    sh.getRange(1, head.length + 1, 1, faltan.length).setValues([faltan]).setFontWeight("bold").setBackground("#FFE8EC");
    head = head.concat(faltan);
  }
  const row = head.map(h => celda(vals[h]));
  if (n) sh.getRange(n, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
}

// textos que empiezan con = + - @ se guardan como texto (no como fórmula)
function celda(v) {
  if (v === undefined || v === null) return "";
  if (typeof v === "string" && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function subcarpeta(padre, nombre) { const it = padre.getFoldersByName(nombre); return it.hasNext() ? it.next() : padre.createFolder(nombre); }
function falla(msg, code) { const e = new Error(msg); e.code = code; return e; }
