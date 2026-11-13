# YOSEF — Modelo de datos conceptual (borrador)

**Estado:** Propuesta de diseño para revisión y prototipo. No es un esquema SQL listo para producción y no debe aplicarse todavía a ninguna base de datos.

## 1. Reglas de diseño

- PostgreSQL será la base central de datos.
- Toda entidad perteneciente a una organización debe llevar OrganizationId.
- Toda entidad perteneciente a una sede debe llevar SiteId, además de OrganizationId.
- Las relaciones entre registros deben validar que ambos pertenecen a la misma organización. No basta con ocultar datos en la interfaz.
- Usar identificadores UUID para entidades principales.
- Guardar fechas de creación y modificación, y el usuario responsable cuando corresponda.
- Usar estados controlados y fechas de vigencia para conservar historia.
- Los importes financieros usarán tipos decimales exactos y moneda explícita; nunca números de punto flotante.
- Las eliminaciones físicas se reservarán para datos de prueba o casos legalmente aprobados. Las operaciones importantes se anulan o archivan con auditoría.
- Los archivos se almacenarán fuera de la base relacional, en almacenamiento privado; la base guardará metadatos y referencias protegidas.

## 2. Plataforma y organizaciones

### Organizations
Una fila por iglesia, fundación u organización cliente.
- Id (UUID, PK)
- Name
- LegalName (opcional)
- OrganizationType
- Status (Pending, Active, Suspended, Closed)
- TimeZone
- DefaultCurrency
- CreatedAtUtc
- ApprovedAtUtc
- ApprovedByUserId (nullable)

### Sites
Sedes físicas o congregaciones de una organización.
- Id (UUID, PK)
- OrganizationId (FK)
- Name
- Code
- Address (opcional)
- Phone (opcional)
- IsPrimary
- Status
- CreatedAtUtc

Restricción propuesta: UNIQUE (OrganizationId, Code). Una sede principal por organización, controlada por regla transaccional.

### Departments
Departamentos, ministerios y áreas configurables.
- Id
- OrganizationId
- SiteId (nullable: null significa alcance organizacional)
- Name
- Description (opcional)
- Status

## 3. Identidad, usuarios y permisos

La identidad debe separarse de los datos ministeriales.

### OrganizationUsers
Vincula una cuenta de acceso con una organización.
- Id
- OrganizationId
- UserId
- LoginEmailNormalized
- DisplayName
- Status
- JoinedAtUtc
- RevokedAtUtc (nullable)

### Roles, Permissions y asignaciones
- Roles: Id, OrganizationId, Name, Description, IsSystemRole.
- Permissions: clave estable, descripción y módulo; catálogo controlado por YOSEF.
- RolePermissions: RoleId, PermissionKey.
- UserRoleAssignments: OrganizationId, UserId, RoleId, SiteId nullable, GrantedByUserId, GrantedAtUtc, RevokedAtUtc.
- PlatformRoles: roles exclusivos para administración técnica de YOSEF, separados de roles de iglesia.

Regla: el rol puede tener alcance organizacional o de sede. Una asignación a una sede no concede automáticamente acceso a otras sedes.

### Decisión técnica pendiente
La usuaria eligió cuentas independientes por organización. El diseño de ASP.NET Core Identity debe validar cómo representar cuentas con el mismo correo en organizaciones diferentes sin colisiones ni confusión de inicio de sesión. No imponer una restricción global de correo único hasta resolver este punto mediante un prototipo. No almacenar contraseñas propias: utilizar un proveedor de identidad probado.

## 4. Personas y relaciones ministeriales

### People
Ficha única por persona dentro de una organización.
- Id
- OrganizationId
- PrimarySiteId (nullable)
- FirstName
- MiddleName (nullable)
- LastName
- Sex (catálogo validado)
- BirthDate (nullable)
- Phone (nullable)
- Email (nullable)
- Address (nullable)
- RegisteredAtUtc
- CreatedByUserId
- CreatedAtUtc

Evitar guardar una edad manual si puede calcularse desde BirthDate.

### PersonStatuses
Historial de condición: amigo, niño, miembro, líder u otros valores configurables.
- Id
- OrganizationId
- PersonId
- StatusTypeId
- EffectiveFrom
- EffectiveTo (nullable)
- Reason (nullable)
- RecordedByUserId

### PersonBaptisms
- Id
- OrganizationId
- PersonId
- IsBaptized
- BaptismDate (nullable)
- Notes (nullable)

### Classes, PersonClassEnrollments
Catálogo de clases y registro histórico de participación por persona.

### Ministries, PersonMinistryAssignments
Catálogo de ministerios y asignaciones con fecha inicial/final, función y responsable.

### Guardianships
Relación tutor-persona dependiente, con contacto del tutor cuando corresponda. Evitar duplicar datos personales de tutores si ya existe una ficha de persona.

### Visitors and FollowUps
Los visitantes pueden ser fichas de People con condición de visitante/amigo y un módulo de seguimiento: responsable, fecha, medio de contacto, resultado y próxima acción. No crear otra ficha paralela para la misma persona.

## 5. Actividades e inscripciones

### Activities
- Id
- OrganizationId
- SiteId (nullable para actividad general)
- Title
- Description
- StartsAtUtc, EndsAtUtc
- TimeZone
- Location
- CreatedByUserId
- Status

### ActivityRegistrations
- Id
- OrganizationId
- ActivityId
- PersonId
- RegisteredAtUtc
- RegistrationSource (pre-registration / on-site)
- Status

### AttendanceRecords
- Id
- OrganizationId
- ActivityId
- PersonId
- AttendanceStatus
- CheckedInAtUtc
- RecordedByUserId
- Source (online / offline-sync)
- IdempotencyKey

La inscripción no marca automáticamente asistencia. Las capturas sin conexión se guardan primero como pendientes locales y el servidor valida autorización, duplicados y vigencia al sincronizar.

## 6. Finanzas

### FinancialAccounts
Cuentas o cajas por organización/sede, con moneda y estado. Los permisos restringen quién puede ver o administrar cada cuenta.

### Funds
Fondos configurables por organización, con reglas de uso.

### FinancialTransactions
Encabezado de ingreso, egreso, reverso o ajuste:
- Id
- OrganizationId
- SiteId
- FinancialAccountId
- TransactionType
- Status (Draft, PendingApproval, Approved, Rejected, Reversed)
- TransactionDate
- CurrencyCode
- Description
- CreatedByUserId
- ApprovedByUserId (nullable)
- ApprovedAtUtc (nullable)
- ReversesTransactionId (nullable)
- CreatedAtUtc

### FinancialTransactionLines
Líneas con categoría, fondo, importe exacto y descripción. Debe validarse que el total cuadre y que la moneda corresponda.

### ExpenseApprovals
Solicitud y decisión de aprobación con solicitante, aprobador, fecha, estado y comentario. Restricción de negocio: CreatedByUserId no puede ser ApprovedByUserId para el mismo gasto.

### InterSiteTransfers
Transferencia entre dos sedes:
- Id
- OrganizationId
- FromSiteId
- ToSiteId
- Amount
- CurrencyCode
- Status (Requested, Authorized, Executed, Rejected, Cancelled)
- RequestedByUserId
- AuthorizedByUserId
- ExecutedAtUtc
- IdempotencyKey

La ejecución crea movimientos enlazados de salida y entrada. En el consolidado organizacional se eliminan como flujo interno para evitar contarlos como ingreso/gasto externo. Debe ejecutarse en una transacción atómica y conservar la trazabilidad.

### Budgets, BudgetLines, IncomeCategories, ExpenseCategories
Catálogos y presupuestos configurables por organización y periodo.

## 7. Inventario y mantenimiento

### InventoryItems
- Id
- OrganizationId
- SiteId
- AssetCode
- Name
- Description
- AcquisitionDate
- AcquisitionValue (decimal nullable)
- CurrencyCode
- Condition
- Status

### AssetAssignments
Historial de responsable, custodio o ministerio al que se asignó el bien.

### AssetTransfers
Historial de traslados entre sedes, con solicitud, aprobación y recepción.

### MaintenanceRecords
- Id
- OrganizationId
- InventoryItemId
- MaintenanceDate
- Description
- Cost (decimal nullable)
- CurrencyCode
- ResponsiblePersonId (nullable)
- NextMaintenanceDate (nullable)
- AttachmentId (nullable)

### AssetDisposals
Bajas, pérdidas o daños irreparables con motivo, fecha y aprobación.

## 8. Auditoría, archivos y notificaciones

### AuditEvents
Registro de solo anexado: OrganizationId (nullable para eventos de plataforma), ActorUserId, Action, EntityType, EntityId, OccurredAtUtc, CorrelationId, Metadata segura y motivo cuando aplique. No registrar contraseñas, tokens ni datos personales innecesarios.

### FileAttachments
Metadatos privados: OrganizationId, SiteId nullable, StorageKey, OriginalFileName, ContentType, SizeBytes, UploadedByUserId, CreatedAtUtc. La descarga requiere autorización en servidor; nunca usar enlaces públicos permanentes.

### NotificationPreferences
Preferencias por usuario y organización.

### NotificationOutbox
Cola transaccional para correos y futuras integraciones. Registrar estado, reintentos y proveedor, evitando enviar duplicados.

## 9. Suscripciones y operación SaaS

- SubscriptionPlans
- OrganizationSubscriptions
- SubscriptionInvoices
- PaymentProviderReferences (solo identificadores externos no sensibles)
- OrganizationApplications (solicitudes de alta y aprobación)
- SupportAccessGrants (acceso de soporte temporal, motivo, aprobador, caducidad y auditoría)

Los datos de tarjetas y credenciales de pago no se guardan en YOSEF.

## 10. Índices, restricciones y aislamiento

Restricciones que deben diseñarse y probarse:
- Claves únicas compuestas por OrganizationId cuando la unicidad sea organizacional.
- Claves foráneas compuestas que impidan vincular un People, Activity, Site o FinancialAccount de otra organización.
- Validar que FromSiteId y ToSiteId pertenecen a OrganizationId y sean distintos.
- Validar que SiteId pertenezca a la misma OrganizationId del registro.
- Índices por OrganizationId, SiteId, fechas y claves de consulta frecuentes.
- Row-Level Security de PostgreSQL como defensa adicional, con contexto de tenant establecido de forma segura por el servidor.
- Las transacciones deben fijar el contexto de organización y no confiar en un OrganizationId enviado por el navegador sin comprobar pertenencia.

## 11. Orden de implementación sugerido

1. Esqueleto de solución y configuración segura.
2. Identidad, organizaciones, sedes y membresías de usuario.
3. Roles, permisos, auditoría y pruebas de aislamiento.
4. Personas, historial y relaciones.
5. Actividades, inscripciones y asistencia.
6. Finanzas, aprobaciones, transferencias y reportes.
7. Inventario y mantenimiento.
8. Notificaciones, suscripciones y modo offline.
9. Migración de ensayo y validación de recuperación.

**Advertencia:** este documento describe entidades y reglas conceptuales. Antes de generar migraciones EF Core, se debe revisar el modelo, definir tipos concretos, restricciones, índices, política de borrado y pruebas de integración. No ejecutar este borrador en producción.
