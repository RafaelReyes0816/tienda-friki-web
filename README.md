# Tienda Fiki - Frontend (React + Vite)

Este es el proyecto de frontend para **Tienda Fiki**, una plataforma web diseñada para la venta de artículos geek (peluches, figuras, posters, etc.) en Tarija. El sistema está construido con **React** y **Vite**, y se conecta a un backend desarrollado en **.NET 8**.

## 🚀 Estructura del Proyecto

El proyecto sigue una arquitectura modular y limpia:

- **`src/components`**: Componentes reutilizables (Navbar, Footer, Layout).
- **`src/views`**: Vistas principales de la aplicación (Home, Login, Registro, Admin).
- **`src/context`**: Gestión del estado global (Autenticación con JWT).
- **`src/hooks`**: Hooks personalizados (ej. `useAuth`).
- **`src/services`**: Configuración de Axios para peticiones al backend.
- **`src/routes`**: Definición de rutas protegidas y públicas.

---

## 📋 Requisitos del Sistema

A continuación se detallan los requisitos establecidos para el desarrollo de la plataforma:

### **Requisitos Funcionales (RF)**

#### **Módulo 1: Catálogo de Productos**
*   **RF-01:** Mostrar un catálogo con imagen, nombre, precio y estado de oferta.
*   **RF-02:** Búsqueda de productos por nombre en tiempo real.
*   **RF-03:** Filtrar productos por categoría.
*   **RF-04:** Sección de "Productos Destacados" en el inicio.
*   **RF-05:** Sección de "Novedades" con últimos ingresos.
*   **RF-06:** Carrusel rotativo en la página de inicio.

#### **Módulo 2: Carrito de Compras**
*   **RF-07:** Agregar productos validando stock.
*   **RF-08:** Incrementar cantidad sin superar el stock.
*   **RF-09:** Modificar o eliminar productos del carrito.
*   **RF-10:** Cálculo del total en tiempo real.
*   **RF-11:** Contador visible de productos en la navegación.

#### **Módulo 3: Gestión de Usuarios**
*   **RF-12:** Registro de cuentas de clientes.
*   **RF-13:** Inicio de sesión (Email/Contraseña).
*   **RF-14:** Cierre de sesión seguro.
*   **RF-15:** Roles diferenciados (**Cliente** y **Administrador**).
*   **RF-16:** Requerir login antes del checkout.

#### **Módulo 4: Panel de Administración**
*   **RF-17:** Acceso restringido a administradores.
*   **RF-18:** Dashboard con métricas de ventas y stock.
*   **RF-19:** Gestión de productos (Crear, Editar, Eliminar).

#### **Módulo 5: Comunicación e Información**
*   **RF-22:** Botón de contacto por WhatsApp.
*   **RF-23:** Mapa de ubicación embebido (Tarija).
*   **RF-24:** Información de contacto y redes sociales en el footer.

---

### **Requisitos No Funcionales (RNF)**

*   **RNF-01:** Carga rápida (máximo 3 segundos).
*   **RNF-05:** Almacenamiento de contraseñas cifradas (Backend).
*   **RNF-09:** Diseño con **temática geek**, estilo oscuro y colores neón.
*   **RNF-13:** Completamente responsivo (Móvil, Tablet, Desktop).
*   **RNF-16:** Persistencia del carrito entre sesiones.

---

## 🛠️ Configuración Local

1.  Clonar el repositorio.
2.  Instalar dependencias: `npm install`
3.  Asegurarse de que el backend (**tienda-friki**) esté corriendo en `http://localhost:5034`.
4.  Iniciar el servidor de desarrollo: `npm run dev`

---
*Nota: Este proyecto es de carácter universitario.*
