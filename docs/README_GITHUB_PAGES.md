# 🍽️ Sanborns - Menú Digital WebApp

Una Progressive Web App (PWA) moderna para el menú digital de Sanborns, desarrollada con JavaScript vanilla, jQuery y Bootstrap 5.

[![Deploy to GitHub Pages](https://github.com/[TU_USUARIO]/[TU_REPO]/actions/workflows/deploy.yml/badge.svg)](https://github.com/[TU_USUARIO]/[TU_REPO]/actions/workflows/deploy.yml)

## 🌟 Características

- **📱 PWA** - Instalable en dispositivos móviles
- **🎨 Responsive** - Adaptado para todos los dispositivos
- **⚡ Rápido** - Carga instantánea con cache inteligente
- **🔍 Búsqueda** - Filtrado en tiempo real de productos
- **🛒 Carrito** - Gestión completa de pedidos
- **🕐 Horarios** - Menús contextuales por horario del día

## 🚀 Ver Demo

**👉 [Ver App en Vivo](https://[TU_USUARIO].github.io/[TU_REPO]/)**

## 🛠️ Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Framework CSS:** Bootstrap 5
- **Librería:** jQuery 3.7.1
- **Icons:** Font Awesome 6
- **PWA:** Service Worker + Web App Manifest
- **Deploy:** GitHub Pages + GitHub Actions

## 📁 Estructura del Proyecto

```
├── index.html              # Punto de entrada principal
├── manifest.json           # Configuración PWA
├── mock.json               # Datos del menú (mock)
├── assets/
│   ├── css/               # Estilos personalizados
│   ├── js/
│   │   ├── services/      # DataService centralizado
│   │   ├── app.js         # Aplicación principal
│   │   ├── menu.js        # Gestión del menú
│   │   ├── cart.js        # Gestión del carrito
│   │   └── utils.js       # Utilidades
│   └── images/            # Recursos gráficos
└── .github/workflows/     # GitHub Actions
```

## 🔧 Desarrollo Local

1. **Clonar repositorio:**
   ```bash
   git clone https://github.com/[TU_USUARIO]/[TU_REPO].git
   cd [TU_REPO]
   ```

2. **Servir localmente:**
   ```bash
   # Con Python 3
   python -m http.server 3000
   
   # Con Node.js
   npx serve . -p 3000
   
   # Con Live Server (VSCode)
   # Right-click en index.html > "Open with Live Server"
   ```

3. **Abrir en navegador:**
   ```
   http://localhost:3000
   ```

## 🚀 Deploy Automático

El proyecto se despliega automáticamente en **GitHub Pages** cuando se hace push a la rama `main`:

1. **Push a main:**
   ```bash
   git add .
   git commit -m "🚀 Update menu"
   git push origin main
   ```

2. **GitHub Actions** se encarga del resto automáticamente

3. **URL de la app:** `https://[TU_USUARIO].github.io/[TU_REPO]/`

## ⚙️ Configuración

### DataService

El proyecto usa un **DataService centralizado** que soporta múltiples entornos:

```javascript
// Cambiar entorno
DataService.setEnvironment('github_pages');

// Configurar endpoints personalizados
DataService.configureEndpoints({
    menu: 'https://api.mibackend.com/menu'
});
```

### PWA

Para personalizar la PWA, edita `manifest.json`:

```json
{
  "name": "Mi Restaurante",
  "short_name": "MiApp",
  "start_url": "/",
  "theme_color": "#dc3545"
}
```

## 📱 Instalación como App

1. **En móvil:** Visita la URL y toca "Agregar a pantalla de inicio"
2. **En desktop:** Busca el ícono de "Instalar" en la barra de dirección

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m '✨ Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**[TU_NOMBRE]**
- GitHub: [@[TU_USUARIO]](https://github.com/[TU_USUARIO])
- LinkedIn: [Tu LinkedIn](https://linkedin.com/in/tu-perfil)

---

⭐ **¡Dale una estrella si te gusta el proyecto!**
