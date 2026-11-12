# YOSEF — Arquitectura inicial

**Producto:** plataforma SaaS multiiglesia para administración de iglesias y organizaciones cristianas.  
**Marca:** YOSEF  
**Lema:** Administración con propósito, transparencia y fidelidad.  
**Estado:** diseño inicial; no aplicar todavía a Firebase de producción.

## 1. Principios

1. Cada iglesia u organización es un espacio independiente (tenant).
2. Ningún usuario puede consultar ni modificar datos de otra organización por cambiar un identificador en el navegador.
3. La autenticación identifica a la persona; la autorización determina qué puede hacer dentro de cada organización.
4. Los permisos se verifican en el servidor mediante reglas de Firestore y, cuando corresponda, lógica confiable del backend. Ocultar botones o usar localStorage no es seguridad.
5. Los cambios importantes conservan historial y autoría. No se eliminan movimientos financieros ni cambios de condición sin trazabilidad.
6. Las reglas propias de cada iglesia se configuran; no se codifican porcentajes, cultos, ministerios ni categorías exclusivas de una congregación.

## 2. Separación multiiglesia propuesta

- `users/{uid}`: perfil global mínimo de la cuenta autenticada.
- `organizations/{organizationId}`: datos y configuración de una iglesia/organización.
- `organizations/{organizationId}/memberships/{uid}`: pertenencia, estado, rol y permisos del usuario dentro de esa organización.
- Las colecciones operativas viven debajo de `organizations/{organizationId}/`, por ejemplo:
  - `people/{personId}`
  - `personEvents/{eventId}`
  - `ministries/{ministryId}`
  - `groups/{groupId}`
  - `activities/{activityId}`
  - `attendance/{attendanceId}`
  - `financeTransactions/{transactionId}`
  - `financeCategories/{categoryId}`
  - `auditLogs/{logId}`
  - `settings/{settingId}`

El identificador de organización debe validarse en reglas de seguridad contra la membresía del usuario. No basta con guardar `organizationId` en un documento.

## 3. Personas: separar dimensiones

La ficha de persona debe distinguir:

- **Datos personales:** nombre, sexo (masculino/femenino), teléfono, correo, dirección, fecha de nacimiento y fecha de registro.
- **Vínculo/condición:** amigo, niño o miembro.
- **Función y servicio:** líder, pastor u otras responsabilidades, con asignaciones a ministerios y grupos. La interfaz puede ofrecer “Líder” en el formulario de tipo de persona por compatibilidad con el formulario actual, pero el modelo debe permitir que un líder siga siendo miembro y conservar ambas realidades.
- **Formación:** bautizado (sí/no) y clase, cuando aplique.
- **Familia:** tutor y teléfono del tutor, especialmente para niños.
- **Servicio:** ministerios y talentos, como datos estructurados y editables.

Para conservar compatibilidad con los registros actuales se documentarán los campos antiguos y su correspondencia antes de migrar. No se sobrescribirán documentos originales durante la primera migración.

## 4. Historial de personas

Los cambios de condición, bautismo, asignación a ministerios/grupos, liderazgo, traslado, activación o inactivación se registran como eventos con:

- persona afectada;
- tipo de evento;
- valor anterior y nuevo, cuando corresponda;
- fecha efectiva;
- usuario que realizó el cambio;
- observación opcional.

No se debe crear una segunda ficha cuando un amigo pasa a ser miembro o un miembro asume liderazgo.

## 5. Finanzas

Cada organización define sus propias categorías, fondos, actividades, reglas de aportes, porcentajes y periodos. Los porcentajes y la base de cálculo para iglesia central/presbiterio quedan pendientes de confirmación de cada iglesia; YOSEF no debe inventarlos.

Cada movimiento financiero tendrá importe, moneda, tipo (ingreso/gasto), categoría/fondo, fecha, actividad relacionada si aplica, comprobante opcional, estado y metadatos de creación/modificación. La auditoría registrará quién creó, editó, aprobó o anuló el movimiento.

## 6. Seguridad y roles

Los roles iniciales configurables pueden incluir administrador de organización, pastor general, secretaría, responsable de finanzas y líder de ministerio. Los permisos deben ser granulares (ver, crear, editar, aprobar, exportar) y estar asociados a la organización. Una persona puede tener más de una responsabilidad si la organización lo autoriza.

Las reglas actuales compartidas para `miembros` y `contabilidad` permiten acceso público de lectura/escritura. No se deben publicar datos reales bajo esas reglas. La nueva política se diseñará y probará antes de desplegarla.

## 7. Fases de implementación

1. Respaldar y documentar el sistema actual.
2. Crear modelo y esquema multiiglesia.
3. Implementar autenticación y membresías/roles.
4. Diseñar reglas de Firestore y pruebas negativas de aislamiento entre organizaciones.
5. Implementar personas e historial.
6. Implementar actividades y asistencia.
7. Implementar finanzas, aprobaciones y reportes.
8. Migrar datos de prueba y validar antes de cualquier migración real.
9. Preparar suscripciones y operación SaaS.

## 8. Pendientes que no se deben asumir

- Porcentajes y base de cálculo de aportes a iglesia central y presbiterio.
- Criterios de activo/inactivo.
- Catálogo de clases, ministerios, grupos y tipos de actividades por organización.
- Quién puede aprobar ingresos, gastos, anulaciones y reportes.
- Requisitos de comprobantes, moneda y periodos fiscales.
- Planes, precios y proveedor de pagos de la suscripción.

## 9. Regla de trabajo

Esta rama contiene el diseño inicial. No cambiar todavía las reglas activas de Firebase, no borrar archivos heredados y no migrar ni eliminar registros. Toda modificación de código se hará por etapas, se probará y se explicará antes de desplegarla.
