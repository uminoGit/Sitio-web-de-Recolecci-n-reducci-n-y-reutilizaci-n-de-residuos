# EcoHogar ♻️

Plataforma web educativa enfocada en la gestión responsable de residuos domésticos. Ofrece artículos, videos, foros, recursos descargables, buenas prácticas y una calculadora de reducción de residuos.

> 🌐 [Ver sitio en vivo](https://uminogit.github.io/Sitio-web-de-Recolecci-n-reducci-n-y-reutilizaci-n-de-residuos/)

---

## ✨ Características

- 👤 **Autenticación completa** — registro, inicio de sesión y recuperación de contraseña
- 💬 **Foros** — sistema de temas y comentarios con likes
- 📄 **Artículos y videos** — contenido educativo sobre manejo de residuos
- 📥 **Descargas** — recursos descargables con búsqueda y filtros por categoría
- ✅ **Buenas prácticas** — guías expandibles con videos integrados
- 🧮 **Calculadora de residuos** — estima tu potencial de reducción semanal
- 📱 **PWA** — funciona sin conexión gracias al Service Worker
- 🖼️ **Optimización de imágenes** — lazy loading, soporte WebP y tamaños adaptativos
- 📱 **Responsive** — diseño adaptable a cualquier dispositivo

---

## 🛠️ Tech Stack

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript Vanilla |
| Autenticación | localStorage (client-side) |
| PWA | Service Worker |
| Optimización | IntersectionObserver, WebP, lazy loading |
| Control de versiones | Git + GitHub |

---

## 📁 Estructura del proyecto

```
EcoHogar/
├── index.html                  # Página principal
├── login.html                  # Inicio de sesión
├── registro.html               # Registro de usuarios
├── recuperar-contrasena.html   # Recuperación de contraseña
├── articulos.html              # Artículos educativos
├── videos.html                 # Videos
├── foros.html                  # Foros de discusión
├── descargas.html              # Recursos descargables
├── buenas-practicas.html       # Guías de buenas prácticas
├── styles.css                  # Estilos globales
├── script.js                   # Lógica principal y carrusel
├── common.js                   # Componentes reutilizables
├── login.js                    # Lógica de autenticación
├── registro.js                 # Lógica de registro
├── recuperar-contrasena.js     # Lógica de recuperación
├── descargas.js                # Lógica de descargas
├── support.js                  # Reportes técnicos
├── sw.js                       # Service Worker (PWA)
└── assets/
    ├── js/
    │   ├── imageOptimizer.js   # Optimización de imágenes
    │   ├── imageCompressor.js  # Compresión de imágenes
    │   └── config.json         # Configuración de optimización
    └── downloads/              # Archivos descargables
```

---

## 🚀 Instalación

No requiere servidor ni dependencias — abre directamente en el navegador:

```bash
git clone https://github.com/uminoGit/Sitio-web-de-Recolecci-n-reducci-n-y-reutilizaci-n-de-r-esiduos.git
cd Sitio-web-de-Recolecci-n-reducci-n-y-reutilizaci-n-de-r-esiduos
```

Abre `index.html` en tu navegador. Para aprovechar el Service Worker necesitas un servidor local:

```bash
npx serve .
```

---

## 👥 Funcionalidades por rol

**Usuario no registrado** — puede navegar artículos, videos, descargas y buenas prácticas.

**Usuario registrado** — puede comentar en foros, acceder a contenido exclusivo y guardar su sesión.

---

## 👤 Autor

**uminoGit** — [GitHub](https://github.com/uminoGit)
