# 🍽️ SANBORNS DIGITAL MENU - PROJECT ROADMAP
> **"Si no recuerdo ni madres en 6 meses, este archivo me debe poner al día en 5 minutos"**

**📅 Última actualización:** 02 Julio 2025  
**🔖 Versión actual:** v1.2.3-beta  
**👨‍💻 Desarrollador:** Tu servidor  
**⏱️ Tiempo de lectura:** 5 minutos para ponerte al día

---

## 🎯 **ESTADO ACTUAL - ¿DÓNDE ESTÁS HOY?**

### 📱 **LO QUE FUNCIONA PERFECTO:**
- ✅ **PWA Funcional** - App instalable en mobile/desktop
- ✅ **Menú Dinámico** - 29 categorías, +150 productos con imágenes
- ✅ **Carrito Completo** - Agregar/quitar, persistencia, totales en tiempo real
- ✅ **Top Navbar Mobile** - Configurable desde `db.json`, scroll hide/show
- ✅ **Botones Fijos** - Hamburger + Carrito siempre visibles
- ✅ **Estados de Productos** - Nuevo → Enviado a Cocina → Servido
- ✅ **Búsqueda con Clear** - Filtro en tiempo real + botón (X) para limpiar
- ✅ **Modal Mesa + Propina** - Calculadora de propina con slider
- ✅ **Reset System** - Botón para limpiar toda la app
- ✅ **Responsive Design** - Mobile-first, funciona en todos los dispositivos

### 🎨 **LOOK & FEEL:**
- **Colores:** Rojo Sanborns (#dc3545) + Dorado + Estilo 90's
- **UX:** Mobile-first, animaciones jQuery, feedback visual
- **Performance:** Carga rápida, localStorage para persistencia

---

## 📚 **HISTORIAL TÉCNICO - ¿DE DÓNDE VIENES?**

### 🗓️ **CRONOLOGÍA DE IMPLEMENTACIÓN:**

#### **🏗️ FASE 1: ESTRUCTURA BASE** (Completada)
**📅 Fecha:** Inicio del proyecto
- ✅ Extracción de datos reales de Sanborns HTML
- ✅ Creación de `mock.json` completo (29 categorías, +150 productos)
- ✅ Setup inicial: HTML5 + Bootstrap 5 + jQuery + Font Awesome
- ✅ Arquitectura de archivos modular y escalable

#### **🎨 FASE 2: UI/UX MOBILE** (Completada)
**📅 Fecha:** Primera iteración UI
- ✅ Mobile-first responsive design
- ✅ Top navbar con logo, mesa info, acciones
- ✅ Bottom tab navigation (Menú/Cuenta/Mesero)
- ✅ CSS custom con variables y animaciones retro

#### **🛒 FASE 3: CARRITO INTELIGENTE** (Completada) 
**📅 Fecha:** Core functionality
- ✅ **CartManager**: Agregar/quitar productos, calcular totales
- ✅ **Estados de productos**: `nuevo` → `enviado_cocina` → `servido`
- ✅ **Validaciones**: Solo productos "nuevo" son editables
- ✅ **Doble vista**: Cards elegantes + Lista tipo ticket
- ✅ **Persistencia**: localStorage con timestamps
- ✅ **Botón "Ordenar Ahora"**: Solo aparece si hay productos nuevos

#### **🔍 FASE 4: BÚSQUEDA AVANZADA** (Completada)
**📅 Fecha:** UX improvements
- ✅ **Filtro en tiempo real** por nombre de producto
- ✅ **Botón Clear (X)**: Aparece/desaparece dinámicamente
- ✅ **Feedback visual**: Toast "Búsqueda limpiada"
- ✅ **Performance**: Debounce para evitar lag

#### **📱 FASE 5: TOP NAVBAR CONFIGURABLE** (Completada HOY)
**📅 Fecha:** 02 Julio 2025
- ✅ **Sistema de configuración** desde `db.json`
- ✅ **Navbar responsive** con scroll hide/show automático
- ✅ **Botones fijos**: Hamburger + Carrito siempre visibles
- ✅ **Posicionamiento dinámico**: Hamburger extrema derecha, carrito a la izquierda
- ✅ **Modal mesa**: Info + calculadora de propina en tiempo real
- ✅ **Sistema reset**: Limpiar localStorage/sessionStorage/cache + reload
- ✅ **Versioning**: Display de versión en drawer menu

---

## 🏗️ **ARQUITECTURA ACTUAL - CÓMO ESTÁ ORGANIZADO**

### 📁 **ESTRUCTURA DE ARCHIVOS:**
```
📁 webScrapperSbrnsHmns/
├── 📄 index.html              # Entry point
├── 📄 db.json                 # Configuraciones + datos mock
├── 📄 mock.json               # Menú completo (29 categorías)
├── 📁 assets/
│   ├── 📁 css/
│   │   ├── main.css           # Estilos principales
│   │   └── retro-animations.css
│   ├── 📁 js/
│   │   ├── app.js             # Core application
│   │   ├── cart.js            # CartManager (estados productos)
│   │   ├── menu.js            # MenuManager (renderizado)
│   │   ├── mobile-navbar.js   # TopNavbar configurable ⭐ NUEVO
│   │   ├── utils.js           # Helpers + debugging
│   │   └── services/
│   │       └── data-service.js # API abstraction
│   └── 📁 images/
│       ├── sanbornsWhite.svg   # Logo navbar
│       ├── check.svg           # Icono cuenta custom
│       └── ...
├── 📄 PROJECT_ROADMAP.md      # Este archivo ⭐
└── 📁 docs/                   # Documentación legacy
```

### 🧩 **COMPONENTES PRINCIPALES:**

#### **🎯 MobileTopNavbar (`mobile-navbar.js`)**
**Responsabilidad:** Navbar responsive configurable
```javascript
// Configuración desde db.json
configuraciones.topNavbar: {
  colorFondo: "#dc3545",
  logoImagen: "sanbornsWhite.svg", 
  scrollPixeles: 5,
  mostrarHamburger: true,
  alturaNavbar: 60
}
```
**Features:**
- ✅ Scroll hide/show automático
- ✅ Botones fijos siempre visibles
- ✅ Modal mesa con calculadora propina
- ✅ Sistema reset completo

#### **🛒 CartManager (`cart.js`)**
**Responsabilidad:** Gestión completa del carrito
```javascript
// Estados de productos
estados: ["nuevo", "enviado_cocina", "servido"]
```
**Features:**
- ✅ Solo productos "nuevo" son editables
- ✅ Botón "Ordenar" solo si hay productos nuevos
- ✅ Doble vista: cards + ticket
- ✅ Persistencia localStorage

#### **🍽️ MenuManager (`menu.js`)**
**Responsabilidad:** Renderizado del menú
**Features:**
- ✅ 29 categorías dinámicas
- ✅ Búsqueda en tiempo real
- ✅ Botón clear búsqueda
- ✅ Cards responsive con imágenes

### 💾 **DATOS Y CONFIGURACIÓN:**

#### **📄 db.json - Centro de Configuración:**
```json
{
  "configuraciones": {
    "app": {
      "version": "1.2.3-beta",
      "nombre": "Sanborns Digital Menu"
    },
    "topNavbar": {
      "colorFondo": "#dc3545",
      "logoImagen": "sanbornsWhite.svg",
      "scrollPixeles": 5,
      "animacionMs": 300, 
      "alturaNavbar": 60,
      "mostrarHamburger": true
    }
  },
  "mesas": [...],      # Estados de mesa
  "ordenes": [...],    # Órdenes activas
  "estados": [...]     # Estados del sistema
}
```

#### **📄 mock.json - Datos del Menú:**
- **29 categorías** (Desayunos, Molletes, Bebidas, etc.)
- **+150 productos** con precios, descripciones, imágenes
- **Estructura real** extraída del HTML de Sanborns

---

## 🎯 **ROADMAP FUTURO - ¿A DÓNDE VAS?**

### 🚨 **PRIORIDAD P0 - CRÍTICO (Próximas 2 semanas)**

#### **🔧 P0.1 - Drawer Menu Funcional**
**⏱️ Estimación:** 4-6 horas
**📝 Descripción:** Implementar contenido del drawer menu hamburger
**🎯 Objetivos:**
- ✅ Enlaces de navegación funcionales
- ✅ Configuración de usuario (tema, idioma)
- ✅ Información de la mesa
- ✅ Botón "Llamar Mesero"

#### **📱 P0.2 - PWA Optimizations**
**⏱️ Estimación:** 3-4 horas  
**📝 Descripción:** Mejorar experiencia de instalación
**🎯 Objetivos:**
- ✅ Service Worker para cache offline
- ✅ Install prompt personalizado
- ✅ Splash screen custom
- ✅ Manifest.json optimizado

### ⚡ **PRIORIDAD P1 - IMPORTANTE (Próximo mes)**

#### **💳 P1.1 - Sección Pago/Checkout**
**⏱️ Estimación:** 8-12 horas
**📝 Descripción:** Proceso de pago simulado completo
**🎯 Objetivos:**
- ✅ Resumen de cuenta con impuestos
- ✅ Calculadora propina integrada
- ✅ Opciones de pago (efectivo, tarjeta, app)
- ✅ Recibo digital / PDF
- ✅ Estado "Cuenta Pagada"

#### **👨‍🍳 P1.2 - Módulo Mesero Avanzado**
**⏱️ Estimación:** 10-15 horas
**📝 Descripción:** Panel para mesero gestionar mesas
**🎯 Objetivos:**
- ✅ Dashboard mesas activas
- ✅ Marcar productos como servidos
- ✅ Chat/notificaciones con cliente
- ✅ Historial de órdenes por mesa

#### **🔄 P1.3 - Estados de Mesa Complejos**
**⏱️ Estimación:** 6-8 horas
**📝 Descripción:** Flujo completo mesa → orden → pago
**🎯 Objetivos:**
- ✅ Estado "Esperando pago"
- ✅ Estado "Mesa libre"
- ✅ Transiciones automáticas
- ✅ Notificaciones push

### 🌟 **PRIORIDAD P2 - NICE TO HAVE (Futuro)**

#### **📊 P2.1 - Analytics Básicos**
**⏱️ Estimación:** 15-20 horas
**📝 Descripción:** Dashboard de métricas básicas
**🎯 Objetivos:**
- ✅ Productos más vendidos
- ✅ Tiempo promedio por mesa
- ✅ Ingresos por día/semana
- ✅ Export a Excel/CSV

#### **🎨 P2.2 - Personalización UI**
**⏱️ Estimación:** 8-10 horas
**📝 Descripción:** Temas y customización
**🎯 Objetivos:**
- ✅ Modo oscuro/claro
- ✅ Tamaños de fuente
- ✅ Temas por restaurante
- ✅ Configuración de colores

#### **🌐 P2.3 - Multi-idioma**
**⏱️ Estimación:** 12-18 horas
**📝 Descripción:** Soporte ES/EN/otros
**🎯 Objetivos:**
- ✅ i18n framework
- ✅ Traducción de menú
- ✅ Selector de idioma
- ✅ Persistencia de preferencia

#### **🔗 P2.4 - Integración Backend Real**
**⏱️ Estimación:** 20-30 horas
**📝 Descripción:** Migrar de mock a API real
**🎯 Objetivos:**
- ✅ API REST con Node.js/Express
- ✅ Base de datos (PostgreSQL/MySQL)
- ✅ Authentication (JWT)
- ✅ WebSockets para tiempo real
- ✅ Deploy en cloud (Heroku/Vercel)

---

## ⚡ **QUICK START - CÓMO RETOMAR EN 5 MINUTOS**

### 🚀 **1. SETUP RÁPIDO:**
```bash
# Clonar proyecto
git clone [URL_REPO]
cd webScrapperSbrnsHmns

# Servir localmente
python -m http.server 8000
# O con Live Server en VSCode

# Abrir navegador
http://localhost:8000
```

### 🔧 **2. ARCHIVOS CLAVE A REVISAR:**
1. **`db.json`** - Configuraciones actuales
2. **`assets/js/mobile-navbar.js`** - Último componente implementado
3. **`assets/js/cart.js`** - Lógica core del carrito
4. **`PROJECT_ROADMAP.md`** - Este archivo (siempre actualizado)

### 🐛 **3. DEBUG RÁPIDO:**
```javascript
// En DevTools Console:
window.debugSanborns();           // Info general app
CartManager.simulateStates();     // Testing estados carrito
MobileTopNavbar.config;           // Ver config navbar
```

### 📱 **4. TESTING RÁPIDO:**
1. **Mobile:** Abrir DevTools → Mobile view
2. **Carrito:** Agregar productos, probar estados
3. **Navbar:** Scroll para ver hide/show
4. **Reset:** Drawer menu → Reset → Verificar limpieza

---

## 🔥 **DECISIONES TÉCNICAS IMPORTANTES**

### ✅ **QUÉ FUNCIONA BIEN (NO TOCAR):**
- **jQuery + Bootstrap**: Para velocidad de desarrollo
- **Mobile-first**: Diseño pensado para móviles primero
- **localStorage**: Persistencia confiable sin backend
- **Modular CSS**: Variables CSS para fácil customización
- **db.json**: Configuraciones centralizadas

### ⚠️ **DEBT TÉCNICO ACTUAL:**
- **Mock data**: Eventualmente migrar a backend real
- **No TypeScript**: Considerar migración futura
- **Falta testing**: Unit tests pendientes
- **Performance**: Optimizar imágenes y cache

### 🎯 **PATRONES ESTABLECIDOS:**
- **Naming**: camelCase JS, kebab-case CSS
- **Comments**: Headers con `/* ===== SECTION ===== */`
- **Logs**: `SanbornsUtils.log()` para debugging
- **Config**: Todo configurable desde `db.json`

---

## 🏆 **MÉTRICAS DE ÉXITO**

### ✅ **LO QUE YA LOGRAMOS:**
- 📱 **100% Mobile responsive** - Funciona perfecto en móviles
- ⚡ **Performance:** Carga < 2 segundos
- 🎨 **UX Suave:** Animaciones fluidas, feedback visual
- 💾 **Persistencia:** Carrito sobrevive refresh/cierre
- 🔧 **Mantenible:** Código modular y bien documentado

### 🎯 **METAS FUTURAS:**
- 📊 **Analytics:** Dashboards con métricas reales
- 🔄 **Real-time:** WebSockets para updates instantáneos  
- 💳 **Pagos:** Integración con pasarelas reales
- 🌐 **Escala:** Multi-restaurante, multi-idioma

---

## 📞 **CONTACTO Y RECURSOS**

### 🔗 **Links Importantes:**
- **Repo:** [GitHub URL]
- **Demo:** [GitHub Pages URL]
- **Figma/Designs:** [Si existe]

### 📚 **Documentación Legacy:**
- `README.md` - Overview general del proyecto
- `IMPLEMENTATION_SUMMARY.md` - Detalles técnicos carrito
- `CHECK_ICON_IMPLEMENTATION.md` - Iconos custom
- `SEARCH_CLEAR_IMPLEMENTATION.md` - Botón limpiar búsqueda

### 🆘 **Si Te Atoraste:**
1. **Revisa este roadmap** - La verdad está aquí
2. **Console logs** - `SanbornsUtils.log()` en todo el código
3. **DevTools Network** - Verifica si `db.json` y `mock.json` cargan
4. **Mobile DevTools** - La app es mobile-first

---

## 🎯 **CONCLUSIÓN**

**ESTADO ACTUAL:** 🔥 App funcional al 85% con features core completas  
**PRÓXIMO PASO:** Implementar drawer menu (P0.1) y optimizar PWA (P0.2)  
**TIEMPO PARA PRODUCCIÓN:** 2-4 semanas (dependiendo de alcance)

**💪 LO QUE TIENES:** Una PWA sólida, responsive, con carrito inteligente y navbar configurable  
**🚀 LO QUE FALTA:** Detalles de UX, módulo pago, y backend real

**¡LA APP YA ES USABLE! Solo faltan los toques finales para producción 🎉**

---

**📝 Nota:** Este roadmap se actualiza con cada feature implementada. Es tu single source of truth del proyecto.

**🔄 Última sync:** 02 Julio 2025 - TopNavbar configurable completado ✅

---

## 🚀 **DEPLOYMENT & GITHUB PAGES - CONFIGURACIÓN ACTUAL**

### 📡 **SETUP DE GITHUB PAGES (Configurado y Funcionando)**

#### **🔧 Archivos de Deployment:**
- ✅ **`.github/workflows/deploy.yml`** - GitHub Actions auto-deploy
- ✅ **`deploy.sh`** - Script manual de deployment  
- ✅ **`_config.yml`** - Configuración Jekyll para GitHub Pages
- ✅ **`404.html`** - Página de error personalizada
- ✅ **`README_GITHUB_PAGES.md`** - Documentación completa del deployment

#### **🌐 URLs del Proyecto:**
- **🔗 Demo Live:** `https://[TU_USUARIO].github.io/webScrapperSbrnsHmns/`
- **📁 Repositorio:** `https://github.com/[TU_USUARIO]/webScrapperSbrnsHmns`
- **⚙️ Actions:** `https://github.com/[TU_USUARIO]/webScrapperSbrnsHmns/actions`

### 🔄 **PROCESO DE DEPLOYMENT ACTUAL:**

#### **🤖 Automático (Recomendado):**
```bash
# 1. Hacer cambios en el código
git add .
git commit -m "✨ Nueva feature"
git push origin main

# 2. GitHub Actions se encarga automáticamente
# 3. App se actualiza en 1-2 minutos
```

#### **📱 Manual (Backup):**
```bash
# Script personalizado
./deploy.sh "🚀 Update con nueva feature"

# O comando directo
git add . && git commit -m "Update" && git push origin main
```

### ⚙️ **CONFIGURACIÓN GITHUB ACTIONS:**

**📄 `.github/workflows/deploy.yml`** (Auto-deploy):
```yaml
# Se ejecuta automáticamente en push a main
# Despliega directamente a GitHub Pages
# Sin build process - archivos estáticos
```

### 🛠️ **HERRAMIENTAS DE DESARROLLO LOCAL:**

#### **🖥️ Servidor Local:**
```bash
# Opción 1: Python (recomendado)
python -m http.server 8000

# Opción 2: Node.js
npx serve . -p 8000

# Opción 3: Live Server (VSCode)
# Right-click en index.html > "Open with Live Server"
```

#### **🔄 Workflow de Desarrollo:**
1. **Desarrollar localmente** → `localhost:8000`
2. **Testing** → Verificar funcionalidad
3. **Commit & Push** → `git push origin main`
4. **Auto-deploy** → GitHub Actions despliega
5. **Verificar** → URL de GitHub Pages

### 📁 **ESTRUCTURA DEPLOYMENT:**

```
📁 GitHub Pages Deploy/
├── 📄 index.html           # Entry point
├── 📄 manifest.json        # PWA config
├── 📄 db.json              # Configuraciones
├── 📄 mock.json            # Datos menú
├── 📁 assets/              # CSS, JS, imágenes
├── 📄 _config.yml          # Jekyll config
├── 📄 404.html             # Error page
└── 📁 .github/workflows/   # Auto-deploy
```

### 🚨 **TROUBLESHOOTING DEPLOYMENT:**

#### **❌ Problemas Comunes:**
1. **404 en GitHub Pages** → Verificar `_config.yml` y rama `main`
2. **JS/CSS no cargan** → Verificar rutas relativas (no absolutas)
3. **PWA no instala** → Verificar `manifest.json` y HTTPS
4. **Deploy falla** → Revisar GitHub Actions logs

#### **🔧 Comandos de Debug:**
```bash
# Ver status de GitHub Pages
curl -I https://[TU_USUARIO].github.io/webScrapperSbrnsHmns/

# Verificar rama activa
git branch -a

# Ver último deploy
git log --oneline -5
```

### 📊 **MÉTRICAS DE DEPLOYMENT:**

#### **✅ Lo que Funciona:**
- 🚀 **Auto-deploy** desde `main` branch
- ⚡ **Deploy rápido** (1-2 minutos)
- 📱 **PWA funcional** en GitHub Pages
- 🔒 **HTTPS automático** por GitHub
- 📄 **404 personalizada** configurada

#### **🎯 Próximas Mejoras:**
- 📊 **Métricas de visitas** (Google Analytics)
- 🔄 **Deploy preview** para pull requests
- 🧪 **Testing automático** antes de deploy
- 📦 **Minificación** de assets (opcional)

### 🔐 **CONFIGURACIONES IMPORTANTES:**

#### **📄 `_config.yml` (Jekyll):**
```yaml
# Configuración mínima para GitHub Pages
# Permite archivos estáticos sin build
title: "Sanborns Digital Menu"
description: "PWA para menú digital"
```

#### **📄 `404.html`:**
- Página personalizada para URLs no encontradas
- Redirige automáticamente a `index.html`
- Mantiene la experiencia de SPA

### 🎯 **DEPLOYMENT CHECKLIST:**

**Antes de cada deploy:**
- ✅ Testing local funcionando
- ✅ Carrito persiste correctamente  
- ✅ Mobile responsive verificado
- ✅ PWA instala sin errores
- ✅ Configuración `db.json` correcta

**Después de cada deploy:**
- ✅ URL de GitHub Pages carga
- ✅ All features funcionando
- ✅ PWA actualiza automáticamente
- ✅ No errores en console
