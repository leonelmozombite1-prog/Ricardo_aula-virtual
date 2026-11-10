-- =====================================================================
-- BASE DE DATOS OFICIAL: AULA VIRTUAL I.E. RICARDO BENTÍN (PUCALLPA)
-- MOTOR: MySQL 8.0+ / MariaDB 10.5+
-- DISEÑADO Y COMPATIBLE 100% CON: MySQL Workbench (EER Diagram & SQL Editor)
-- UBICACIÓN INSTITUCIONAL: Pucallpa, Ucayali, Perú
-- =====================================================================

-- 1. CREACIÓN Y SELECCIÓN DE BASE DE DATOS
DROP DATABASE IF EXISTS `bentin_aula_virtual`;
CREATE DATABASE `bentin_aula_virtual`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `bentin_aula_virtual`;

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================================
-- 2. TABLA: users (Docentes, Estudiantes, Directivos, Administradores)
-- =====================================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT COMMENT 'Identificador único numérico del usuario',
  `uid` VARCHAR(128) NULL UNIQUE COMMENT 'UID para Firebase Auth o autenticación OAuth',
  `dni` VARCHAR(15) NOT NULL UNIQUE COMMENT 'Documento Nacional de Identidad del usuario',
  `name` VARCHAR(150) NOT NULL COMMENT 'Nombres y apellidos completos',
  `email` VARCHAR(120) NOT NULL UNIQUE COMMENT 'Correo electrónico institucional o personal',
  `username` VARCHAR(60) NOT NULL UNIQUE COMMENT 'Usuario para inicio de sesión en el aula',
  `password` VARCHAR(255) NOT NULL COMMENT 'Contraseña de acceso cifrada o en texto plano para testing',
  `role` ENUM('docente', 'alumno', 'admin', 'directivo') NOT NULL DEFAULT 'alumno' COMMENT 'Rol en el aula virtual',
  `grade` VARCHAR(50) NULL COMMENT 'Grado escolar secundario (ej. Primero, Segundo, etc.)',
  `section` VARCHAR(10) NULL COMMENT 'Sección escolar (A, B, C)',
  `specialty` VARCHAR(120) NULL COMMENT 'Especialidad curricular del docente',
  `assigned_course_id` VARCHAR(50) NULL COMMENT 'ID del curso asignado exclusivamente al profesor',
  `institution` VARCHAR(150) NOT NULL DEFAULT 'I.E. Ricardo Bentín - Pucallpa' COMMENT 'Nombre del colegio',
  `avatar_url` VARCHAR(500) NULL COMMENT 'URL o foto del perfil del usuario',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro',
  PRIMARY KEY (`id`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_dni` (`dni`),
  INDEX `idx_users_grade_section` (`grade`, `section`)
) ENGINE=InnoDB COMMENT='Directorio de docentes y alumnos de la I.E. Ricardo Bentín';

-- =====================================================================
-- 3. TABLA: courses (Las 11 Asignaturas del Currículo Nacional 2026)
-- =====================================================================
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` VARCHAR(50) NOT NULL COMMENT 'Identificador del curso (ej. curso-mat, curso-com)',
  `code` VARCHAR(30) NOT NULL UNIQUE COMMENT 'Código curricular de la asignatura (ej. MAT-2026)',
  `title` VARCHAR(120) NOT NULL COMMENT 'Nombre completo del curso escolar',
  `area` VARCHAR(80) NOT NULL COMMENT 'Área curricular de acuerdo al MINEDU',
  `grade` VARCHAR(50) NOT NULL DEFAULT 'Secundaria' COMMENT 'Nivel escolar',
  `section` VARCHAR(50) NOT NULL DEFAULT 'Primero a Quinto' COMMENT 'Rango de secciones que abarca',
  `teacher_name` VARCHAR(150) NOT NULL COMMENT 'Nombre del profesor responsable de la materia',
  `teacher_email` VARCHAR(120) NOT NULL COMMENT 'Correo institucional del docente titular',
  `cover_image` VARCHAR(500) NOT NULL COMMENT 'Imagen representativa de la materia',
  `description` TEXT NOT NULL COMMENT 'Descripción y competencias curriculares',
  `students_count` INT NOT NULL DEFAULT 38 COMMENT 'Cantidad de alumnos matriculados por sección',
  `color` VARCHAR(80) NOT NULL DEFAULT 'from-blue-700 to-indigo-900' COMMENT 'Gradiente de color temático',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_courses_code` (`code`),
  INDEX `idx_courses_area` (`area`)
) ENGINE=InnoDB COMMENT='Cursos oficiales del plan de estudios de la I.E. Ricardo Bentín';

-- =====================================================================
-- 4. TABLA: course_materials (Guías PDF, Exámenes, Videos, Fotos)
-- =====================================================================
DROP TABLE IF EXISTS `course_materials`;
CREATE TABLE `course_materials` (
  `id` VARCHAR(80) NOT NULL COMMENT 'Identificador único del material publicado',
  `course_id` VARCHAR(50) NOT NULL COMMENT 'Curso al que pertenece el material',
  `title` VARCHAR(200) NOT NULL COMMENT 'Título didáctico del recurso o evaluación',
  `description` TEXT NOT NULL COMMENT 'Instrucciones y descripción pedagógica',
  `type` ENUM('pdf', 'exam', 'video', 'photo') NOT NULL COMMENT 'Tipo de formato multimedia o examen',
  `author_name` VARCHAR(150) NOT NULL COMMENT 'Nombre del profesor que publicó el material',
  `grade_section` VARCHAR(30) NOT NULL COMMENT 'Sección específica a la que va dirigido (ej. Primero A, Quinto C)',
  `file_size` VARCHAR(30) NULL COMMENT 'Tamaño del archivo o peso digital',
  `pdf_url` VARCHAR(500) NULL COMMENT 'Enlace de visualización o descarga del documento PDF',
  `pages_count` INT NULL COMMENT 'Número de páginas del PDF',
  `video_url` VARCHAR(500) NULL COMMENT 'Enlace del video formativo (YouTube o MP4)',
  `video_duration` VARCHAR(30) NULL COMMENT 'Duración estimada del video (ej. 14:20 min)',
  `image_url` VARCHAR(500) NULL COMMENT 'Enlace de la imagen o foto de pizarra / infografía',
  `exam_time_limit_minutes` INT NULL COMMENT 'Tiempo límite en minutos para rendir el examen',
  `total_points` INT NULL DEFAULT 20 COMMENT 'Puntaje máximo de la evaluación vigesimal',
  `exam_questions` JSON NULL COMMENT 'Listado estructurado de preguntas y alternativas en JSON',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_materials_course` (`course_id`),
  INDEX `idx_materials_grade_sec` (`grade_section`),
  INDEX `idx_materials_type` (`type`),
  CONSTRAINT `fk_materials_courses`
    FOREIGN KEY (`course_id`)
    REFERENCES `courses` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Materiales pedagógicos subidos por los docentes organizados por sección';

-- =====================================================================
-- 5. TABLA: exam_attempts (Intentos, Respuestas y Calificaciones Escolar)
-- =====================================================================
DROP TABLE IF EXISTS `exam_attempts`;
CREATE TABLE `exam_attempts` (
  `id` VARCHAR(80) NOT NULL COMMENT 'Identificador único del intento del examen',
  `exam_id` VARCHAR(80) NOT NULL COMMENT 'Examen rendido por el alumno',
  `course_id` VARCHAR(50) NOT NULL COMMENT 'Curso del examen',
  `student_name` VARCHAR(150) NOT NULL COMMENT 'Nombre del estudiante que rindió la prueba',
  `student_dni` VARCHAR(15) NOT NULL COMMENT 'DNI del estudiante',
  `grade_section` VARCHAR(30) NULL COMMENT 'Grado y sección del alumno',
  `score` INT NOT NULL COMMENT 'Puntaje obtenido (ej. 18 de 20)',
  `max_score` INT NOT NULL DEFAULT 20 COMMENT 'Puntaje máximo posible',
  `grade_letter` ENUM('AD', 'A', 'B', 'C') NOT NULL COMMENT 'Calificación cualitativa según MINEDU',
  `answers` JSON NOT NULL COMMENT 'Respuestas seleccionadas por el alumno en formato JSON',
  `submitted_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora exacta de entrega',
  PRIMARY KEY (`id`),
  INDEX `idx_attempts_exam` (`exam_id`),
  INDEX `idx_attempts_student_dni` (`student_dni`),
  INDEX `idx_attempts_course` (`course_id`),
  CONSTRAINT `fk_attempts_materials`
    FOREIGN KEY (`exam_id`)
    REFERENCES `course_materials` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_attempts_courses`
    FOREIGN KEY (`course_id`)
    REFERENCES `courses` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='Calificaciones y respuestas de los exámenes del aula virtual';

-- =====================================================================
-- 6. TABLA: support_tickets (Mesa de Ayuda y Soporte Técnico Institucional)
-- =====================================================================
DROP TABLE IF EXISTS `support_tickets`;
CREATE TABLE `support_tickets` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL COMMENT 'Nombre completo del remitente',
  `email` VARCHAR(120) NOT NULL COMMENT 'Correo de contacto',
  `dni` VARCHAR(15) NOT NULL COMMENT 'DNI del usuario que solicita ayuda',
  `role` VARCHAR(50) NOT NULL COMMENT 'Rol del solicitante',
  `subject` VARCHAR(200) NOT NULL COMMENT 'Asunto de la consulta o incidencia técnica',
  `message` TEXT NOT NULL COMMENT 'Detalle del problema reportado',
  `status` ENUM('Pendiente', 'En Atención', 'Resuelto') NOT NULL DEFAULT 'Pendiente',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_tickets_status` (`status`)
) ENGINE=InnoDB COMMENT='Tickets de soporte técnico de la I.E. Ricardo Bentín';

-- =====================================================================
-- 7. TABLA: educational_resources (Biblioteca Digital de Recursos)
-- =====================================================================
DROP TABLE IF EXISTS `educational_resources`;
CREATE TABLE `educational_resources` (
  `id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `level` VARCHAR(50) NOT NULL,
  `grade` VARCHAR(50) NOT NULL,
  `area` VARCHAR(80) NOT NULL,
  `format` VARCHAR(50) NOT NULL,
  `language` VARCHAR(50) NOT NULL DEFAULT 'Castellano',
  `pages_or_duration` VARCHAR(50) NOT NULL,
  `downloads_count` INT NOT NULL DEFAULT 0,
  `cover_image` VARCHAR(500) NOT NULL,
  `tags` JSON NOT NULL,
  `published_date` VARCHAR(30) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='Recursos educativos digitales descargables para docentes y alumnos';

-- =====================================================================
-- 8. VISTAS RECOMENDADAS PARA INFORMES EN MYSQL WORKBENCH
-- =====================================================================
CREATE OR REPLACE VIEW `vw_calificaciones_alumnos` AS
SELECT 
  ea.id AS intento_id,
  ea.student_dni AS dni,
  ea.student_name AS estudiante,
  ea.grade_section AS seccion,
  c.title AS curso,
  cm.title AS examen,
  ea.score AS nota_vigesimal,
  ea.max_score AS nota_maxima,
  ea.grade_letter AS nivel_logro,
  ea.submitted_at AS fecha_entrega
FROM `exam_attempts` ea
JOIN `course_materials` cm ON ea.exam_id = cm.id
JOIN `courses` c ON ea.course_id = c.id;

CREATE OR REPLACE VIEW `vw_resumen_materiales_curso` AS
SELECT 
  c.id AS curso_id,
  c.title AS curso_nombre,
  c.teacher_name AS docente_responsable,
  cm.grade_section AS seccion,
  cm.type AS tipo_material,
  COUNT(cm.id) AS total_materiales
FROM `courses` c
LEFT JOIN `course_materials` cm ON c.id = cm.course_id
GROUP BY c.id, c.title, c.teacher_name, cm.grade_section, cm.type;

-- =====================================================================
-- 9. DATOS INICIALES (SEED DATA)
-- =====================================================================

-- Cursos Curriculares Oficiales
INSERT INTO `courses` (`id`, `code`, `title`, `area`, `grade`, `section`, `teacher_name`, `teacher_email`, `cover_image`, `description`, `students_count`, `color`) VALUES
('curso-mat', 'MAT-2026', 'MATEMÁTICA', 'Matemática', 'Secundaria', 'Primero a Quinto', 'Prof. Carlos Mendoza Ríos', 'carlos.mendoza@bentin.edu.pe', '/src/assets/images/banner_ia_educacion_1794336764506.jpg', 'Álgebra, geometría analítica, trigonometría, estadística y resolución de problemas matemáticos contextualizados.', 38, 'from-blue-700 to-indigo-900'),
('curso-com', 'COM-2026', 'COMUNICACIÓN', 'Comunicación', 'Secundaria', 'Primero a Quinto', 'Prof. Rosa Vega Morales', 'rosa.vega@bentin.edu.pe', '/src/assets/images/recursos_educativos_peru_1794336764441.jpg', 'Comprensión lectora inferencial y crítica, redacción de ensayos argumentativos, oratoria y literatura amazónica y nacional.', 38, 'from-rose-700 to-red-900'),
('curso-arte', 'ART-2026', 'ARTE Y CULTURA', 'Arte y Cultura', 'Secundaria', 'Primero a Quinto', 'Prof. Ana Cecilia Morales', 'ana.morales@bentin.edu.pe', '/src/assets/images/recursos_educativos_peru_1794336764441.jpg', 'Apreciación crítica de manifestaciones artístico-culturales, iconografía amazónica (Kené), artes plásticas, danza y música.', 36, 'from-fuchsia-700 to-purple-900'),
('curso-ept', 'EPT-2026', 'EDUCACIÓN PARA EL TRABAJO (EPT)', 'Educación para el Trabajo', 'Secundaria', 'Primero a Quinto', 'Prof. Javier Ortiz Gómez', 'javier.ortiz@bentin.edu.pe', '/src/assets/images/hero_docente_tecnologia_1794336763892.jpg', 'Gestión de proyectos de emprendimiento económico y social, agroforestería sostenible, metodologías ágiles y diseño digital.', 37, 'from-emerald-700 to-teal-900'),
('curso-cyt', 'CYT-2026', 'CIENCIA Y TECNOLOGÍA', 'Ciencia y Tecnología', 'Secundaria', 'Primero a Quinto', 'Prof. Carmen Salazar Delgado', 'carmen.salazar@bentin.edu.pe', '/src/assets/images/hero_docente_tecnologia_1794336763892.jpg', 'Indagación científica mediante métodos experimentales, ecología de la selva baja, química del carbono y cuidado ambiental.', 38, 'from-cyan-700 to-blue-900'),
('curso-rel', 'REL-2026', 'EDUCACIÓN RELIGIOSA', 'Educación Religiosa', 'Secundaria', 'Primero a Quinto', 'Prof. Gloria Rivas Paredes', 'gloria.rivas@bentin.edu.pe', '/src/assets/images/recursos_educativos_peru_1794336764441.jpg', 'Valores éticos y morales, historia bíblica, dignidad humana, solidaridad comunitaria y convivencia fraterna.', 36, 'from-violet-700 to-purple-900'),
('curso-ccss', 'CCSS-2026', 'CIENCIAS SOCIALES (CCSS)', 'Ciencias Sociales', 'Secundaria', 'Primero a Quinto', 'Prof. Marco Antonio Benites', 'marco.benites@bentin.edu.pe', '/src/assets/images/comunidades_docentes_peru_1794336765299.jpg', 'Interpretaciones históricas del Perú y del mundo, cuencas hidrográficas de Ucayali, desarrollo sostenible y economía.', 38, 'from-amber-700 to-yellow-900'),
('curso-dpcc', 'DPCC-2026', 'DESARROLLO PERSONAL, CIUDADANÍA Y CÍVICA (DPCC)', 'DPCC', 'Secundaria', 'Primero a Quinto', 'Prof. Patricia Alarcón Ríos', 'patricia.alarcon@bentin.edu.pe', '/src/assets/images/comunidades_docentes_peru_1794336765299.jpg', 'Identidad personal, inteligencia emocional, convivencia democrática, resolución pacífica de conflictos y Constitución Política.', 38, 'from-teal-700 to-emerald-900'),
('curso-edufis', 'EDF-2026', 'EDUCACIÓN FÍSICA', 'Educación Física', 'Secundaria', 'Primero a Quinto', 'Prof. Roberto Díaz Farfán', 'roberto.diaz@bentin.edu.pe', '/src/assets/images/hero_docente_tecnologia_1794336763892.jpg', 'Desarrollo de la motricidad, hábitos de vida saludable, disciplinas deportivas escolares y trabajo en equipo.', 38, 'from-orange-700 to-red-900'),
('curso-ing', 'ING-2026', 'INGLÉS', 'Inglés', 'Secundaria', 'Primero a Quinto', 'Prof. David Wilson Smith', 'david.wilson@bentin.edu.pe', '/src/assets/images/banner_ia_educacion_1794336764506.jpg', 'Comunicación en inglés como lengua extranjera, comprensión auditiva, lectura de textos y producción oral fluida.', 38, 'from-sky-700 to-indigo-900'),
('curso-tut', 'TUT-2026', 'TUTORÍA Y ORIENTACIÓN EDUCATIVA', 'Tutoría', 'Secundaria', 'Primero a Quinto', 'Prof. Elena Torres Castillo', 'elena.torres@bentin.edu.pe', '/src/assets/images/comunidades_docentes_peru_1794336765299.jpg', 'Acompañamiento socioafectivo, orientación vocacional, prevención de riesgos psicosociales y proyecto de vida.', 38, 'from-pink-700 to-rose-900');

-- Docentes
INSERT INTO `users` (`dni`, `name`, `email`, `username`, `password`, `role`, `specialty`, `assigned_course_id`) VALUES
('25789012', 'Prof. Carlos Mendoza Ríos', 'carlos.mendoza@bentin.edu.pe', 'prof.matematica', 'bentin2026', 'docente', 'Docente de Matemática', 'curso-mat'),
('25890123', 'Prof. Rosa Vega Morales', 'rosa.vega@bentin.edu.pe', 'prof.comunicacion', 'bentin2026', 'docente', 'Docente de Comunicación', 'curso-com'),
('25901234', 'Prof. Ana Cecilia Morales', 'ana.morales@bentin.edu.pe', 'prof.arte', 'bentin2026', 'docente', 'Docente de Arte y Cultura', 'curso-arte'),
('25012345', 'Prof. Javier Ortiz Gómez', 'javier.ortiz@bentin.edu.pe', 'prof.ept', 'bentin2026', 'docente', 'Docente de Educación para el Trabajo', 'curso-ept'),
('25123456', 'Prof. Carmen Salazar Delgado', 'carmen.salazar@bentin.edu.pe', 'prof.cyt', 'bentin2026', 'docente', 'Docente de Ciencia y Tecnología', 'curso-cyt'),
('25234567', 'Prof. Gloria Rivas Paredes', 'gloria.rivas@bentin.edu.pe', 'prof.religion', 'bentin2026', 'docente', 'Docente de Educación Religiosa', 'curso-rel'),
('25345678', 'Prof. Marco Antonio Benites', 'marco.benites@bentin.edu.pe', 'prof.ccss', 'bentin2026', 'docente', 'Docente de Ciencias Sociales', 'curso-ccss'),
('25456789', 'Prof. Patricia Alarcón Ríos', 'patricia.alarcon@bentin.edu.pe', 'prof.dpcc', 'bentin2026', 'docente', 'Docente de DPCC', 'curso-dpcc'),
('25567890', 'Prof. Roberto Díaz Farfán', 'roberto.diaz@bentin.edu.pe', 'prof.edufisica', 'bentin2026', 'docente', 'Docente de Educación Física', 'curso-edufis'),
('25678901', 'Prof. David Wilson Smith', 'david.wilson@bentin.edu.pe', 'prof.ingles', 'bentin2026', 'docente', 'Docente de Inglés', 'curso-ing'),
('25789123', 'Prof. Elena Torres Castillo', 'elena.torres@bentin.edu.pe', 'prof.tutoria', 'bentin2026', 'docente', 'Docente de Tutoría', 'curso-tut');

-- Estudiantes de Muestra (Por Secciones)
INSERT INTO `users` (`dni`, `name`, `email`, `username`, `password`, `role`, `grade`, `section`) VALUES
('73456789', 'Juan Diego Morales Panduro', 'juan.morales@bentin.edu.pe', 'alumno.primeroa', 'alumno2026', 'alumno', 'Primero de Secundaria', 'A'),
('73456790', 'Luciana Belén Flores Ríos', 'luciana.flores@bentin.edu.pe', 'alumno.primerob', 'alumno2026', 'alumno', 'Primero de Secundaria', 'B'),
('73456791', 'Mateo Sebastián Sánchez Vargas', 'mateo.sanchez@bentin.edu.pe', 'alumno.segundoa', 'alumno2026', 'alumno', 'Segundo de Secundaria', 'A'),
('73456792', 'Valeria Nicole Torres Díaz', 'valeria.torres@bentin.edu.pe', 'alumno.terceroa', 'alumno2026', 'alumno', 'Tercero de Secundaria', 'A'),
('73456793', 'Alejandro Rodrigo Gómez Ruiz', 'alejandro.gomez@bentin.edu.pe', 'alumno.cuartoa', 'alumno2026', 'alumno', 'Cuarto de Secundaria', 'A'),
('73456794', 'Camila Sofía Rengifo Soto', 'camila.rengifo@bentin.edu.pe', 'alumno.quintoa', 'alumno2026', 'alumno', 'Quinto de Secundaria', 'A');

-- Materiales Iniciales (PDFs, Exámenes, Videos, Fotos)
INSERT INTO `course_materials` (`id`, `course_id`, `title`, `description`, `type`, `author_name`, `grade_section`, `file_size`, `pdf_url`, `pages_count`, `video_url`, `video_duration`, `image_url`, `exam_time_limit_minutes`, `total_points`, `exam_questions`) VALUES
('mat-01', 'curso-mat', 'Ficha Teórico-Práctica: Ecuaciones Cuadráticas y Función Polinómica', 'Guía completa con 15 problemas resueltos y propuestos sobre resolución de ecuaciones de segundo grado por factorización y fórmula general.', 'pdf', 'Prof. Carlos Mendoza Ríos', 'Primero A', '2.4 MB', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 6, NULL, NULL, NULL, NULL, NULL, NULL),
('mat-02', 'curso-mat', 'Evaluación Diagnóstica: Álgebra y Ecuaciones Lineales', 'Examen calificado con 4 preguntas clave de razonamiento algebraico y planteo de ecuaciones. Calificación automática al finalizar.', 'exam', 'Prof. Carlos Mendoza Ríos', 'Primero A', NULL, NULL, NULL, NULL, NULL, NULL, 25, 20, '[{"id":"q1","question":"¿Cuál es el valor de x en la ecuación: 3x - 7 = 14?","options":["x = 5","x = 7","x = 9","x = 6"],"correctOptionIndex":1,"points":5},{"id":"q2","question":"Al factorizar la expresión x² - 25, obtenemos:","options":["(x - 5)(x - 5)","(x + 5)(x + 5)","(x + 5)(x - 5)","(x - 25)(x + 1)"],"correctOptionIndex":2,"points":5},{"id":"q3","question":"Si el perímetro de un terreno rectangular en Pucallpa es 60 m y el largo es el doble del ancho, ¿cuánto mide el ancho?","options":["8 metros","10 metros","12 metros","15 metros"],"correctOptionIndex":1,"points":5},{"id":"q4","question":"¿Qué tipo de número es la raíz cuadrada de 49 (√49)?","options":["Un número irracional","Un número entero y natural","Una fracción impropia","Un número decimal infinito"],"correctOptionIndex":1,"points":5}]'),
('mat-03', 'curso-mat', 'Clase Magistral: Teorema de Pitágoras y Triángulos Notables', 'Video explicativo detallado con gráficos y demostración práctica paso a paso aplicada a la topografía de la Amazonía.', 'video', 'Prof. Carlos Mendoza Ríos', 'Primero A', 'Video HD', NULL, NULL, 'https://www.youtube.com/watch?v=2yflErvSHTc', '14:20 min', NULL, NULL, NULL, NULL),
('mat-04', 'curso-mat', 'Fotografía de Pizarra: Esquema y Fórmulas de Trigonometría Básica', 'Foto en alta resolución con el resumen de razones trigonométricas (seno, coseno, tangente) tomadas durante la clase presencial.', 'photo', 'Prof. Carlos Mendoza Ríos', 'Primero A', '3.8 MB', NULL, NULL, NULL, NULL, '/src/assets/images/banner_ia_educacion_1794336764506.jpg', NULL, NULL, NULL),
('com-01', 'curso-com', 'Guía de Lectura: El Mito de la Sachamama y Comprensión Crítica', 'Módulo de análisis textual, inferencia contextual e identificación del tema central en relatos de la tradición oral ucayalina.', 'pdf', 'Prof. Rosa Vega Morales', 'Primero A', '1.8 MB', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 4, NULL, NULL, NULL, NULL, NULL, NULL),
('com-02', 'curso-com', 'Control de Lectura: Niveles Literal, Inferencial y Criterial', 'Evaluación rápida de 3 preguntas de comprensión lectora sobre estructura argumentativa de ensayos.', 'exam', 'Prof. Rosa Vega Morales', 'Primero A', NULL, NULL, NULL, NULL, NULL, NULL, 20, 20, '[{"id":"cq1","question":"En un texto argumentativo, ¿cuál es la función de la tesis?","options":["Describir a los personajes secundarios","Plantear la postura principal que defiende el autor","Presentar únicamente datos numéricos","Concluir sin dar razones"],"correctOptionIndex":1,"points":7},{"id":"cq2","question":"¿A qué nivel de comprensión corresponde deducir el significado de una palabra por el contexto?","options":["Nivel literal","Nivel inferencial","Nivel ortográfico","Nivel memorístico"],"correctOptionIndex":1,"points":7},{"id":"cq3","question":"¿Cuál de las siguientes oraciones presenta un conector de oposición?","options":["Estudió mucho y aprobó el examen","Llegó tarde porque llovió fuerte","Quería salir, sin embargo tuvo que terminar la tarea","Fue a la biblioteca a leer"],"correctOptionIndex":2,"points":6}]'),
('cyt-01', 'curso-cyt', 'Manual de Laboratorio: Biodiversidad Acuática en la Laguna de Yarinacocha', 'Guía práctica para la recolección de muestras de fitoplancton y análisis del pH en aguas amazónicas.', 'pdf', 'Prof. Carmen Salazar Delgado', 'Primero A', '3.1 MB', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 8, NULL, NULL, NULL, NULL, NULL, NULL);

-- Intentos de prueba previos
INSERT INTO `exam_attempts` (`id`, `exam_id`, `course_id`, `student_name`, `student_dni`, `grade_section`, `score`, `max_score`, `grade_letter`, `answers`) VALUES
('att-01', 'mat-02', 'curso-mat', 'Juan Diego Morales Panduro', '73456789', 'Primero A', 20, 20, 'AD', '{"q1":1,"q2":2,"q3":1,"q4":1}'),
('att-02', 'com-02', 'curso-com', 'Juan Diego Morales Panduro', '73456789', 'Primero A', 14, 20, 'A', '{"cq1":1,"cq2":1,"cq3":0}');

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- FIN DEL SCRIPT MYSQL WORKBENCH
-- INSTRUCCIONES PARA EL USUARIO:
-- 1. Abre MySQL Workbench
-- 2. Conéctate a tu servidor MySQL (Localhost o Cloud)
-- 3. File -> Open SQL Script -> Selecciona este archivo
-- 4. Presiona el botón del Rayo (Execute) o Ctrl+Shift+Enter
-- 5. Para generar el diagrama EER: Database -> Reverse Engineer -> Selecciona 'bentin_aula_virtual'
-- =====================================================================
