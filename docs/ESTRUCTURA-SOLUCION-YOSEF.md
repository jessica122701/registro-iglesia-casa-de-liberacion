# YOSEF — Estructura de la solución .NET

**Estado:** Propuesta técnica inicial para el prototipo. Esta estructura no modifica el sistema HTML/JavaScript existente y no contiene todavía código de producción.

## 1. Situación actual del repositorio

La raíz actual contiene páginas HTML y scripts JavaScript del sistema anterior. No se encontró una solución .NET ni un README en la raíz de la rama revisada. Por tanto, YOSEF se iniciará en una carpeta independiente para conservar el sistema actual como referencia y evitar mezclar tecnologías.

## 2. Decisión de arquitectura

Se recomienda comenzar con un **monolito modular**:
- Una aplicación desplegable inicialmente.
- Módulos separados por responsabilidad.
- Reglas de negocio en capas independientes de la interfaz y de PostgreSQL.
- Sin microservicios en la primera versión: añadirían complejidad operativa y costos antes de necesitarlos.

## 3. Estructura propuesta

La nueva solución vivirá bajo `src/` y `tests/`:

```text
/
├── docs/
│   ├── ARQUITECTURA-YOSEF.md
│   ├── MODELO-DATOS-YOSEF.md
│   └── ESTRUCTURA-SOLUCION-YOSEF.md
├── src/
│   ├── Yosef.Web/
│   ├── Yosef.Domain/
│   ├── Yosef.Application/
│   └── Yosef.Infrastructure/
├── tests/
│   ├── Yosef.UnitTests/
│   └── Yosef.IntegrationTests/
└── (archivos HTML/JS actuales, conservados temporalmente)
```

### Yosef.Web
Aplicación web Blazor:
- Páginas, componentes y navegación.
- Diseño adaptable para móvil, tableta y computadora.
- Inicio y cierre de sesión mediante el mecanismo de identidad aprobado.
- Composición de dependencias y configuración de la aplicación.
- Endpoints HTTP solo cuando sean necesarios para integraciones o clientes futuros.

La interfaz nunca decide por sí sola si una operación está autorizada.

### Yosef.Domain
Núcleo del negocio, independiente de la interfaz y de Entity Framework:
- Entidades y objetos de valor.
- Reglas e invariantes del negocio.
- Estados y transiciones válidas.
- Excepciones de dominio.

No contiene páginas, consultas SQL, dependencias de Blazor ni lógica de presentación.

### Yosef.Application
Casos de uso:
- Crear y administrar organizaciones y sedes.
- Invitar o vincular usuarios.
- Consultar datos dentro del ámbito autorizado.
- Ejecutar operaciones mediante servicios y contratos.
- Validación de solicitudes y autorización de casos de uso.
- Interfaces para persistencia, reloj, correo y otros servicios externos.

### Yosef.Infrastructure
Implementaciones técnicas:
- Entity Framework Core y PostgreSQL.
- Configuración de entidades, índices y restricciones.
- Implementación de persistencia.
- Integración con ASP.NET Core Identity una vez validado el modelo de cuentas.
- Correo, almacenamiento privado y servicios externos cuando se incorporen.
- Auditoría técnica y mecanismos de respaldo, según el entorno.

### Yosef.UnitTests
Pruebas rápidas para reglas del dominio y casos de uso:
- Una sede pertenece a una sola organización.
- No se permiten referencias cruzadas entre organizaciones.
- Un usuario sin permiso no ejecuta una operación.
- Nadie aprueba su propio gasto.
- Una transferencia interna requiere autorización.

### Yosef.IntegrationTests
Pruebas con infraestructura real o aislada:
- Persistencia con PostgreSQL.
- Restricciones y claves foráneas.
- Autenticación y autorización HTTP.
- Aislamiento entre dos organizaciones y entre sedes.
- Transacciones financieras y transferencias.
- Migraciones y restauración de datos de prueba.

## 4. Dependencias permitidas

```text
Yosef.Web ───────────────► Yosef.Application
Yosef.Web ───────────────► Yosef.Infrastructure (solo composición/configuración)

Yosef.Infrastructure ────► Yosef.Application
Yosef.Infrastructure ────► Yosef.Domain

Yosef.Application ───────► Yosef.Domain

Yosef.Domain ────────────► (sin dependencias de otros proyectos YOSEF)
```

Regla: Domain no depende de Application, Infrastructure ni Web. Application define los contratos que Infrastructure implementa.

## 5. Primera entrega funcional: identidad, organización y sedes

El primer incremento no incluirá todavía finanzas ni miembros. Se limitará a:
1. Arranque de la aplicación y configuración por entorno.
2. Base PostgreSQL de desarrollo.
3. Identidad y autenticación segura.
4. Solicitud y aprobación de una organización.
5. Creación de la organización y su sede principal.
6. Registro de sedes adicionales.
7. Roles y permisos iniciales mínimos.
8. Auditoría de las operaciones anteriores.
9. Pruebas de aislamiento entre organizaciones y sedes.

No se habilitará el registro público libre de organizaciones; la solicitud deberá aprobarse antes de activar la organización.

## 6. Decisiones que requieren una prueba técnica antes de fijarse

- Versión de .NET y plantilla Blazor compatible con el entorno de desarrollo.
- Modelo de cuentas: la decisión de producto habla de cuentas independientes por organización. Debe probarse cómo implementarlo sin colisiones de correo ni confusión de acceso; no imponer todavía una unicidad global del correo.
- ASP.NET Core Identity u otra configuración de identidad compatible.
- Uso de EF Core y proveedor PostgreSQL con versiones compatibles.
- Estrategia de aislamiento: filtros y validaciones en servidor, claves foráneas compuestas y evaluación de Row-Level Security.
- Proveedor de alojamiento y secretos.

## 7. Reglas para el repositorio

- Trabajar únicamente en la rama `yosef/fundacion-multiglesia`.
- Mantener intactos los archivos del sistema actual mientras se construye y prueba el reemplazo.
- No incluir credenciales, claves API ni cadenas de conexión con contraseñas en Git.
- Usar configuración local ignorada por Git y variables/secretos seguros en despliegue.
- Commits pequeños y descriptivos.
- No aplicar migraciones a producción.
- No fusionar a `main` hasta tener revisión y pruebas aprobadas.

## 8. Próximo paso

Antes de crear los proyectos, confirmar el entorno local de desarrollo: versión del SDK de .NET instalado y disponibilidad de PostgreSQL. Después se generará la solución y se ejecutarán pruebas básicas de compilación, sin conectar Firebase ni importar datos reales.
