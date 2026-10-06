# 🍽️ Goxu — Frontend

> Fartucos de sabor

**Frontend** construido con **Vue 3** para _Goxu_, la web de un restaurante de comida asturiana con pedidos en local, para llevar y a domicilio, panel de cocina, panel de repartidor y panel de administración. Desarrollado con **Vite**, **Vue Router** y **Tailwind CSS**.

---

## 📑 Índice

- [Descripción](#-descripción)
- [Análisis](#-análisis)
- [Rutas y roles](#-rutas-y-roles)
- [Identidad de marca](#-identidad-de-marca)
- [Instalación](#-instalación)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Equipo](#-equipo)

---

## 📋 Descripción

El reto de este proyecto es construir, en **Vue 3**, el frontend de _Goxu_, la web de un restaurante asturiano, con vistas diferenciadas según el rol de quien la usa:

- **Cliente**: login y registro, home, calendario de eventos, ofertas especiales, carta con filtros por categoría (con datos del backend y mock data de respaldo), detalle de producto, carrito, pago, seguimiento de pedidos, reservas, y perfil y cuenta de usuario.
- **Cocina**: tablero para seguir el estado de los pedidos.
- **Repartidor**: panel con el dashboard de entregas y el listado de pedidos asignados.
- **Administración**: bienvenida, dashboard del negocio, productos, pedidos y facturación.

El frontend se comunica con la [API del backend de Goxu](https://github.com/FactoriaF5-Asturias/project-p5-digital-academy-team2-restaurant-backend), que gestiona la autenticación, los productos, los pedidos, los pagos, la facturación, los eventos y las ofertas.

Desarrollado con **Vue 3 (`<script setup>`)**, **Vite**, **Vue Router** y **Tailwind CSS**, con tests unitarios en **Vitest** y commits siguiendo **Conventional Commits**.

[Volver al índice](#-índice)

---

## 🔍 Análisis

Antes de empezar identificamos las funcionalidades principales del frontend:

- **Login y registro**: acceso y alta de usuarios
- **Home**: presentación del restaurante, con especialidades, eventos destacados y formulario de contacto
- **Eventos**: calendario anual de eventos del restaurante
- **Ofertas especiales**: promociones exclusivas para clientes con sesión iniciada
- **Carta**: listado de productos por categoría con filtros, obtenidos del backend con datos de ejemplo (mock data) como respaldo si la petición falla
- **Detalle de producto**: vista individual de cada plato
- **Carrito y pago**: gestión de la cesta y flujo de pago con modal de confirmación
- **Seguimiento de pedidos**: estado del pedido en curso para el cliente
- **Reservas**: formulario de reserva de mesa con validación
- **Perfil y cuenta**: datos del cliente
- **Panel de cocina**: tablero de pedidos por estado
- **Panel de repartidor**: dashboard de entregas con mapa y listado de pedidos asignados
- **Panel de administración**: bienvenida, dashboard del negocio, productos, pedidos y facturación
- **Página 404**: para cualquier dirección que no exista

[Volver al índice](#-índice)

---

## 🧭 Rutas y roles

El acceso a las vistas privadas se controla en el router según el rol del usuario. Si no hay sesión iniciada, se redirige al login; si el rol no tiene permiso, se redirige a la home.

| Ruta | Vista | Acceso |
| :--- | :--- | :--- |
| `/` (`/home`) | Home | Pública |
| `/login` · `/register` | Login y registro | Pública |
| `/carta` · `/product/:id` | Carta y detalle de producto | Pública |
| `/ofertas-eventos` | Ofertas especiales | Pública (ofertas solo con sesión) |
| `/calendario-eventos` | Calendario de eventos | Pública |
| `/cart` · `/payment` | Carrito y pago | Pública |
| `/reservation` | Reservas | Pública |
| `/account` · `/account/profile` | Cuenta y perfil | `CUSTOMER` |
| `/rastreo` | Seguimiento de pedidos | `CUSTOMER` |
| `/admin` · `/admin/productos` · `/admin/pedidos` · `/admin/facturacion` | Panel de administración | `ADMIN` |
| `/cocina` | Panel de cocina | `KITCHEN` |
| `/motorista` · `/motorista/entregas` | Panel de repartidor | `DELIVERY` |
| Cualquier otra | Página 404 | Pública |

[Volver al índice](#-índice)

---

## 🎨 Identidad de marca

**Concepto:** paleta cálida y natural con verde como color principal, sobre fondo crema, siguiendo el sistema de tokens de Material Design 3.

**Paleta de color:**

| Nombre                   |    HEX    |
| :----------------------- | :-------: |
| Primario (verde)         | `#246d00` |
| Secundario (verde claro) | `#2a6c06` |
| Terciario (marrón)       | `#7a5644` |
| Highlight (malva)        | `#d98a98` |
| Fondo / Surface (crema)  | `#fcf9ef` |
| Texto sobre superficie   | `#1c1c16` |
| Error                    | `#ba1a1a` |

**Tipografías:**

- **Cormorant Garamond** — titulares (headline)
- **Manrope** — texto de cuerpo (body)
- **Inter** — interfaz, botones y etiquetas (ui)

[Volver al índice](#-índice)

---

## 🚀 Instalación

**Requisito previo:** tener en marcha el [backend de Goxu](https://github.com/FactoriaF5-Asturias/project-p5-digital-academy-team2-restaurant-backend) en `http://localhost:8080`. Sin él, las vistas que dependen de la API se mostrarán vacías o con datos de ejemplo.

```bash
# 1. Clonar el repositorio
git clone https://github.com/FactoriaF5-Asturias/project-p5-digital-academy-team2-restaurant-frontend.git

# 2. Entrar en la carpeta
cd project-p5-digital-academy-team2-restaurant-frontend

# 3. Instalar dependencias
npm install

# 4. Crear el archivo de entorno a partir del ejemplo
cp .env.example .env

# 5. Iniciar el servidor de desarrollo
npm run dev

# 6. Ejecutar los tests unitarios
npm run test

# 7. Ejecutar los tests con informe de cobertura
npm run coverage
```

El archivo `.env` define la URL de la API que usa el frontend:

```env
VITE_API_URL=http://localhost:8080/api
```

El informe de cobertura se genera en la carpeta `coverage/` (abre `coverage/index.html` en el navegador para verlo en detalle). Esta carpeta no se sube al repositorio.

[Volver al índice](#-índice)

---

## 🗂️ Estructura del proyecto

- **`public/`** — imágenes públicas (home, eventos, favicon, iconos)
- **`src/`** — carpeta principal del código fuente
  - **`assets/`** — imágenes internas (branding, eventos, home, alérgenos, carta)
  - **`components/`** — componentes reutilizables: base (botón, input, modal), cabecera y pie, secciones de la home, carta y autenticación
    - **`cart/`** — componentes del carrito
    - **`delivery/`** — componentes del panel de repartidor
    - **`payment/`** — componentes del flujo de pago
    - **`reservation/`** — componentes de reservas
  - **`composables/`** — estado y lógica reutilizable (autenticación, carrito, entregas, eventos, ofertas, pedidos, pago, productos, reCAPTCHA, reservas)
  - **`layouts/`** — plantillas comunes de página: pública, administración y repartidor
  - **`router/`** — configuración de rutas y control de acceso por rol
  - **`services/`** — llamadas a la API del backend (autenticación, productos, pedidos, seguimiento, cocina, reparto, facturación, dashboard de administración y perfil)
  - **`utils/`** — utilidades (almacenamiento del token de sesión y formateo de moneda)
  - **`Views/`** — vistas de la aplicación (cliente, cocina, repartidor, administración)
  - **`tests/`** — tests unitarios con Vitest
    - **`Views/`** — vistas de pedidos y productos de administración, perfil de cliente y detalle de producto
    - **`composables/`** — eventos, ofertas y reservas

[Volver al índice](#-índice)

---

## 🛠️ Tecnologías

- **[Vue 3](https://vuejs.org/)** — Framework del frontend, con `<script setup>`
- **[Vite](https://vitejs.dev/)** — Servidor de desarrollo y bundler
- **[Vue Router](https://router.vuejs.org/)** — Enrutado entre vistas y control de acceso por rol
- **[Tailwind CSS](https://tailwindcss.com/)** — Estilos
- **[PostCSS](https://postcss.org/)** / **[Autoprefixer](https://github.com/postcss/autoprefixer)** — Procesado de CSS
- **[Leaflet](https://leafletjs.com/)** — Mapa para el panel de repartidor
- **[Lucide](https://lucide.dev/)** — Iconos (`lucide-vue-next`)
- **[Vitest](https://vitest.dev/)** / **[Vue Test Utils](https://test-utils.vuejs.org/)** — Tests unitarios
- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage)** — Informe de cobertura de tests
- **[jsdom](https://github.com/jsdom/jsdom)** — Entorno DOM para los tests
- **[Git](https://git-scm.com/)** / **[GitHub](https://github.com/)** — Control de versiones y alojamiento del proyecto

[Volver al índice](#-índice)

---

## 🕹️ Equipo

Proyecto desarrollado por el **equipo 2** del bootcamp Factoría F5 x Capgemini (Gijón), como parte del proyecto final "Goxu".

---

**[Andrea Vallina](https://github.com/AndreaVaGo)**

**[Gema Miguel](https://github.com/gmp395)**

**[Jenny Sánchez](https://github.com/Jennydev-25)**

**[Juan Isidro](https://github.com/JuanIsidroMenendez)**

**[Ruddy Cruz](https://github.com/ruddycruzc)**

---

[Volver al índice](#-índice)