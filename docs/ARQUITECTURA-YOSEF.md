# YOSEF — Arquitectura del producto y base técnica

**Lema:** Administración con propósito, transparencia y fidelidad.  
**Estado:** Diseño consolidado inicial. La tecnología elegida es una base de diseño pendiente de validación mediante prototipo, pruebas de seguridad y pruebas operativas. Este documento no autoriza cambios en Firebase ni migraciones de datos de producción.

## 1. Objetivo

YOSEF será una plataforma SaaS multi-organización para administrar iglesias, fundaciones y otras organizaciones cristianas. El producto compartirá un núcleo común, con configuración independiente por organización. Deberá servir tanto a una congregación pequeña como a organizaciones con múltiples sedes, sin mezclar sus datos.

## 2. Principios no negociables

- Aislamiento estricto de datos entre organizaciones.
- Autenticación real y autorización por permisos; denegación por defecto.
- Cada operación debe validar identidad, organización, sede (cuando aplique) y permiso.
- La interfaz no es una barrera de seguridad. Las reglas deben imponerse en el servidor y la base de datos.
- Auditoría de operaciones relevantes: quién hizo qué, cuándo, sobre qué registro y, cuando aplique, quién autorizó.
- Conservar historial de cambios y operaciones financieras; corregir mediante reversos o ajustes auditados, no sobrescribir operaciones aprobadas.
- No borrar historia por cambios normales de estado, membresía, asignación o acceso.
- Configuración por organización para roles, ministerios, actividades, categorías, fondos y reglas.
- No guardar secretos en el navegador ni confiar en localStorage para seguridad.
- Respaldos periódicos y restauraciones probadas.
- No migrar, eliminar ni modificar datos de producción hasta probar el proceso en un entorno separado y validar los resultados.
- Minimizar los datos personales recopilados y limitar su acceso según la función.

## 3. Estructura organizacional y multi-sede

Jerarquía conceptual:

1. **YOSEF:** plataforma y administración del servicio SaaS.
2. **Organización:** iglesia, fundación u otra entidad registrada.
3. **Sedes:** una organización puede tener una o varias sedes administradas bajo la misma cuenta organizacional.
4. **Departamentos y ministerios:** áreas configurables dentro de la organización o de una sede.

Una sede mantiene sus propios registros operativos y financieros, pero la administración central autorizada puede consultar informes consolidados. Los datos de sedes no se mezclan: cada registro conserva su organización y, cuando corresponda, su sede.

Separar dos ámbitos de administración:
- **Administrador de plataforma YOSEF:** administra el servicio, las organizaciones y las suscripciones; no obtiene acceso rutinario al contenido privado de las iglesias.
- **Administrador de organización:** administra únicamente su organización y sus sedes, según permisos.

Las cuentas de usuario se consideran independientes por organización según la decisión de producto tomada hasta ahora. Antes de implementar, debe definirse con precisión la unicidad del correo dentro de cada organización y cómo evitar confusiones en el inicio de sesión.

## 4. Módulos funcionales

1. Organizaciones, sedes y departamentos.
2. Usuarios, autenticación, roles y permisos.
3. Personas, miembros, visitantes, niños y tutores.
4. Historial de condiciones, ministerios y responsabilidades.
5. Seguimiento de visitantes y nuevos participantes.
6. Actividades, inscripciones y asistencia.
7. Finanzas, fondos, presupuestos, ingresos, egresos y transferencias.
8. Inventario, asignaciones, traslados y mantenimiento.
9. Reportes, exportaciones y paneles.
10. Notificaciones y preferencias.
11. Suscripciones y administración SaaS.
12. Auditoría, respaldos y herramientas de privacidad.

## 5. Personas y membresía

Cada persona tendrá una ficha única dentro de su organización, evitando duplicados innecesarios.

### Datos básicos previstos
- Nombre.
- Sexo, con valores iniciales masculino y femenino según el esquema actual que describió la usuaria; revisar su necesidad y tratamiento antes de producción.
- Teléfono y correo, cuando existan.
- Dirección, cuando sea necesaria.
- Fecha de nacimiento.
- Fecha de registro.

### Clasificaciones separadas
- **Tipo/condición:** amigo, niño, miembro o líder; conservar historial de cambios.
- **Bautismo:** sí/no y, si corresponde, fecha y observaciones.
- **Clase:** formación o clase correspondiente; no confundir con tipo de persona.
- **Servicio:** ministerios, talentos, función y líder responsable.
- **Tutor:** relación y datos de contacto, cuando corresponda.

La edad se calcula desde la fecha de nacimiento cuando sea posible. La asistencia a una actividad no equivale a membresía ni a registro. El estado activo/inactivo será una decisión autorizada, con fecha y motivo; no se desactivará automáticamente a una persona solo por inasistencia.

## 6. Usuarios, acceso y permisos

- Autenticación con correo y contraseña.
- Recuperación mediante enlace seguro al correo; nunca mostrar ni recuperar la contraseña anterior.
- Cada organización comienza con roles básicos predeterminados y puede crear o ajustar roles dentro de límites de seguridad.
- Los nombres de cargos no conceden permisos automáticamente; los permisos se asignan expresamente.
- Un tesorero no cambia permisos salvo que también tenga autorización específica.
- El acceso de soporte de YOSEF será excepcional, limitado, justificado, autorizado y auditado.
- Revocar acceso no elimina los registros históricos creados por esa persona.
- Cada solicitud al servidor valida sesión, organización, sede y permisos aplicables.

## 7. Finanzas y transferencias

Cada sede registra sus propios ingresos y gastos. La administración central autorizada puede consultar balances por sede y un balance consolidado de la organización.

### Controles acordados
- Ingresos y egresos separados, con historial.
- Gastos registrados por tesorería quedan pendientes hasta aprobación por pastor o administrador principal autorizado.
- Nadie aprueba su propio gasto. Si quien registra es el pastor o administrador principal, otra persona autorizada debe aprobarlo.
- Una operación aprobada no se edita directamente: se corrige mediante reverso, anulación o ajuste trazable que conserva el original.
- Reportes descargables en PDF y Excel.
- Categorías, fondos, presupuestos y reglas configurables por organización.
- Aportes a una iglesia central o presbiterio configurables como porcentaje, monto fijo, combinación o no aplicables; la base y los valores los define cada organización.

### Transferencias entre sedes
- Se permiten transferencias internas con solicitud, autorización del administrador principal de la organización y registro de ejecución.
- Se conserva origen, destino, monto, fecha, solicitante, autorizador y estado.
- En el balance consolidado, una transferencia interna no se cuenta como ingreso o gasto nuevo de la organización; sí aparece en los movimientos de cada sede y en su conciliación.

## 8. Inventario y patrimonio

Cada sede administra su inventario; la administración central autorizada puede consultar el inventario total.

Cada bien podrá incluir nombre, descripción, código identificador, valor y fecha de adquisición, sede, estado y persona responsable/asignada. Se registrarán traslados, daños, pérdidas y bajas con su justificación e historial.

Se incluirá historial de mantenimiento y reparaciones: fecha, descripción, costo, responsable, comprobantes cuando corresponda y próxima fecha si aplica.

## 9. Actividades, inscripciones y asistencia

Se podrán crear actividades por sede y actividades generales de la organización. Cada actividad podrá tener fecha, horario, lugar, responsables y participantes.

YOSEF distinguirá:
- Inscripción previa.
- Registro de personas que llegan sin inscripción.
- Asistencia real confirmada.

Estar inscrito no significa haber asistido. Los informes podrán consultarse por sede y de forma consolidada, según permisos.

## 10. Notificaciones y canales

- Primera etapa: correo electrónico.
- Etapa posterior: integración con WhatsApp mediante proveedor y consentimiento adecuados.
- Avisos de actividades, recordatorios, reuniones y notificaciones administrativas.
- Preferencias de notificación configurables por usuario y organización.
- No enviar comunicaciones innecesarias ni revelar información sensible en mensajes.

## 11. Web adaptable y modo limitado sin conexión

La primera versión será una aplicación web adaptable a celulares, tabletas y computadoras. Una aplicación móvil nativa se evaluará más adelante, según demanda y viabilidad.

El modo sin conexión será limitado:
- Podrá consultar información previamente descargada y autorizada.
- Podrá capturar inscripciones, visitantes y asistencia como operaciones pendientes.
- Al recuperar conexión, el servidor validará identidad, permisos, vigencia de los datos y duplicados antes de aceptar la sincronización.
- No permitirá operaciones financieras, aprobaciones, cambios de permisos ni otras acciones administrativas sensibles sin conexión.
- El dispositivo no será fuente definitiva de verdad; el servidor resolverá conflictos y registrará la sincronización.

## 12. Arquitectura técnica propuesta

Base tecnológica elegida como punto de partida:
- **Frontend web:** Blazor.
- **Backend/API y lógica de negocio:** ASP.NET Core.
- **Base de datos relacional:** PostgreSQL.
- **Acceso a datos y migraciones:** Entity Framework Core.

### Diseño recomendado
- Aplicación modular con límites claros entre módulos.
- Monolito modular inicialmente, evitando microservicios prematuros.
- El servidor será responsable de autenticación, autorización, reglas de negocio, auditoría y validación de datos.
- PostgreSQL será la fuente central de verdad.
- Las tablas de negocio multi-organización incluirán OrganizationId; las entidades propias de una sede incluirán SiteId cuando corresponda.
- Índices y restricciones únicas incluirán el ámbito organizacional cuando la unicidad sea por organización.
- Las relaciones deberán impedir referencias cruzadas entre organizaciones, no solo filtrar resultados en la interfaz.
- Evaluar políticas de seguridad por fila (Row-Level Security) en PostgreSQL como defensa adicional, además de autorización en el servidor.
- Las operaciones financieras críticas se ejecutarán en transacciones de base de datos.
- Los procesos asíncronos (correo, exportaciones pesadas y sincronización) se diseñarán para reintentos seguros e idempotencia.

### Identidad
La solución de identidad definitiva (por ejemplo, ASP.NET Core Identity) se validará en el prototipo. Debe soportar recuperación segura, bloqueo y protección contra intentos abusivos, sesiones revocables y separación entre identidad de plataforma y pertenencia organizacional. No se guardarán contraseñas en texto plano ni en código fuente.

### Alojamiento
El proveedor de nube, región, dominio, almacenamiento de archivos, correo transaccional, monitoreo y costos aún no están seleccionados. Se compararán antes de comprometer gastos. Los secretos se guardarán en un gestor de secretos o configuración segura del entorno, nunca en el repositorio.

## 13. Seguridad, privacidad y continuidad

Pruebas obligatorias antes de producción:
- Un usuario de una organización no puede leer, alterar ni inferir datos de otra.
- Un usuario de una sede no obtiene acceso a otra sede salvo permiso explícito.
- Un usuario sin sesión no puede leer ni escribir datos privados.
- Cada endpoint y operación aplica autorización en el servidor.
- Un líder, tesorero y administrador solo pueden realizar acciones autorizadas.
- Nadie aprueba su propio gasto.
- Los registros de auditoría no pueden ser alterados por usuarios ordinarios.
- Las cargas de archivos se validan por tipo, tamaño, permisos y almacenamiento.
- Las exportaciones respetan los permisos y el ámbito organizacional.
- Se prueban respaldos y restauración en un entorno separado.

Se establecerán política de retención, eliminación o anonimización cuando corresponda, exportación de datos antes de finalizar una suscripción y procedimiento de respuesta a incidentes. Estas políticas requieren revisión legal y operativa antes del lanzamiento.

## 14. Suscripciones y ciclo de vida de organizaciones

- El registro de una nueva organización será una solicitud sujeta a revisión y aprobación antes de activar la cuenta.
- Habrá planes diferenciados y límites transparentes por plan.
- Se definirá qué ocurre ante vencimiento, falta de pago, cancelación y reactivación, sin borrar inmediatamente los datos.
- Antes de finalizar una suscripción se ofrecerá exportación de datos conforme a la política de privacidad y retención.
- El procesamiento de pagos se hará mediante proveedor adecuado; YOSEF no almacenará datos completos de tarjetas.

## 15. Migración del sistema actual

El sistema actual HTML/JavaScript/Firebase se conservará como referencia hasta que la nueva solución esté probada. La revisión previa encontró páginas y scripts duplicados, esquemas distintos y controles de acceso insuficientes. Las reglas de Firestore compartidas anteriormente permiten acceso público de lectura y escritura en colecciones indicadas; por tanto, no deben copiarse a la nueva solución.

Plan:
1. Mantener intacto el sistema actual y sus datos.
2. Crear entorno de desarrollo y pruebas separado.
3. Definir esquema relacional y mapeo campo por campo.
4. Crear copias de prueba y realizar importaciones de ensayo.
5. Comparar cantidades, relaciones y muestras de registros.
6. Corregir inconsistencias y repetir pruebas.
7. Planificar transición controlada solo después de aprobar seguridad, respaldo y restauración.

No se migrarán contraseñas ni se abrirá la base nueva a datos de producción antes de completar estas pruebas.

## 16. Decisiones confirmadas y asuntos por validar

### Decisiones de producto confirmadas
- SaaS multi-organización con varias sedes por organización.
- Finanzas e inventario separados por sede, con consulta consolidada.
- Transferencias entre sedes autorizadas por el administrador principal.
- Inventario con mantenimiento y reparaciones.
- Actividades por sede y generales.
- Inscripción previa y registro de asistencia real, diferenciados.
- Notificaciones por correo primero y WhatsApp después.
- Web adaptable primero; aplicación móvil nativa en una etapa posterior.
- Modo sin conexión limitado para consultas y captura de asistencia, inscripciones y visitantes.
- Sin operaciones financieras ni cambios administrativos sensibles sin conexión.
- Tecnología base elegida: Blazor, ASP.NET Core, PostgreSQL y Entity Framework Core.

### Pendiente de validación técnica u operativa
- Prototipo y selección definitiva del modelo de identidad.
- Diseño físico de tablas, claves, restricciones e índices.
- Unicidad y experiencia de inicio de sesión para usuarios que pertenecen a varias organizaciones, considerando la decisión preliminar de cuentas independientes por organización.
- Catálogo inicial detallado de permisos.
- Proveedor de alojamiento, región, correo y almacenamiento.
- Costos reales de infraestructura y planes SaaS.
- Política de retención, privacidad, exportación y recuperación.
- Requisitos legales aplicables en los países donde se ofrezca el servicio.
- Reglas de sincronización y resolución de conflictos sin conexión.
- Formatos y límites de comprobantes y archivos adjuntos.

## 17. Próximas etapas técnicas

1. Auditar el contenido actual del repositorio y confirmar qué archivos y ramas existen.
2. Preparar un prototipo aislado de YOSEF, sin tocar Firebase ni el sistema de producción.
3. Diseñar el modelo de datos multi-organización y multi-sede.
4. Implementar primero identidad, organizaciones, sedes y autorización.
5. Crear pruebas automatizadas de aislamiento antes de añadir datos ministeriales o financieros.
6. Construir los módulos gradualmente y validar cada uno antes de migrar información.

**Regla de trabajo:** todo cambio se hará en una rama de desarrollo, con commits pequeños, pruebas y revisión. main, Firebase y los datos existentes permanecerán intactos hasta una autorización específica y un plan de migración aprobado.
