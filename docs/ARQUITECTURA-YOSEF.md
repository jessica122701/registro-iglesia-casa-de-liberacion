# YOSEF — Arquitectura inicial

**Lema:** Administración con propósito, transparencia y fidelidad.  
**Estado:** Diseño inicial; no autoriza todavía cambios en Firebase ni migraciones.

## 1. Objetivo del producto

YOSEF será una plataforma SaaS multi-organización para la administración de iglesias y organizaciones cristianas. Cada organización tendrá su propia configuración, usuarios, permisos y datos aislados. El núcleo del producto será común; las diferencias entre iglesias se resolverán mediante configuración y no mediante código exclusivo para una congregación.

## 2. Principios no negociables

- Aislamiento de datos entre organizaciones (multi-tenant).
- Autenticación real y autorización basada en roles y permisos.
- Denegación por defecto: ningún acceso público a datos privados.
- Auditoría de operaciones relevantes: quién creó, modificó, autorizó o anuló un registro y cuándo.
- Historial de cambios de condición y asignaciones; no duplicar personas ni borrar historia por cambios normales.
- Configuración por organización para ministerios, grupos, actividades, categorías financieras, porcentajes y reglas.
- No migrar ni eliminar datos existentes hasta probar el proceso con copias de prueba y validar resultados.
- No almacenar secretos en el navegador ni confiar en localStorage para proteger páginas o datos.

## 3. Módulos previstos

1. Organizaciones e iglesias.
2. Usuarios, roles y permisos.
3. Personas y miembros.
4. Historial de condiciones, ministerios y responsabilidades.
5. Visitantes y seguimiento.
6. Niños y tutores.
7. Actividades y asistencia.
8. Finanzas: ingresos, diezmos, ofrendas, fondos, gastos, presupuestos y comprobantes.
9. Reportes y exportaciones.
10. Configuración y suscripciones SaaS.

## 4. Modelo conceptual de personas

Una persona tendrá una ficha única dentro de su organización.

### Datos personales
- Nombre.
- Sexo (valores iniciales: masculino y femenino; configuración pendiente de validar).
- Teléfono y correo.
- Dirección.
- Fecha de nacimiento.
- Fecha de registro.

### Clasificaciones independientes
- **Tipo de persona/condición:** amigo, niño, miembro o líder. Debe conservarse historial de cambios.
- **Bautismo:** sí/no y, si se necesita, fecha y observaciones.
- **Clase:** clase de formación correspondiente; no es el tipo de persona.
- **Servicio:** ministerios, talentos, función y líder responsable.
- **Tutor:** nombre y teléfono, cuando corresponda.

La edad debe calcularse desde la fecha de nacimiento cuando sea posible, en vez de mantener dos datos que puedan contradecirse. La asistencia a una actividad no equivale a ser miembro ni a estar registrado.

## 5. Finanzas configurables

Cada organización podrá definir sus tipos de ingreso, fondos, categorías de gasto, actividades y reglas de aportes. Los aportes a organizaciones centrales o presbiterios podrán configurarse como porcentaje, cantidad fija, combinación o no aplicarse. La base del cálculo y los porcentajes deben ser definidos por cada organización; YOSEF no asumirá reglas ni porcentajes.

## 6. Seguridad y aislamiento

Cada registro perteneciente a una organización deberá quedar vinculado a su identificador de organización. Las reglas de acceso deberán verificar autenticación, pertenencia a la organización y permisos suficientes. La interfaz por sí sola no constituye una barrera de seguridad.

Antes de habilitar producción se deberán probar, como mínimo:
- Un usuario de una iglesia no puede leer ni modificar datos de otra.
- Un usuario sin sesión no puede leer ni escribir datos privados.
- Un líder solo accede a las funciones y datos que sus permisos autorizan.
- Las operaciones financieras sensibles quedan registradas en auditoría.

## 7. Migración del sistema actual

El sistema actual contiene páginas HTML y scripts JavaScript con lógica duplicada, distintos esquemas y controles de acceso insuficientes. Se conservará como referencia. La migración de registros de prueba se hará después de definir el esquema final, mapear los campos reales y validar una importación de ensayo. No se migrarán contraseñas ni se copiarán reglas públicas a la nueva arquitectura.

## 8. Decisiones pendientes de validar

- Nombre exacto y tipo de cada campo real de Firestore.
- Catálogo de roles y permisos por organización.
- Definición de activo/inactivo.
- Reglas de aportes a iglesia central y presbiterio.
- Tecnología definitiva de backend y despliegue, evaluada antes de escribir módulos.
- Política de retención, respaldo y recuperación de datos.

## 9. Próxima etapa técnica

Revisar el estado real de la rama y el proyecto local; definir arquitectura técnica y entorno de desarrollo; preparar un entorno de pruebas separado. No modificar las reglas de Firestore de producción ni importar datos hasta contar con pruebas de seguridad y respaldo.
