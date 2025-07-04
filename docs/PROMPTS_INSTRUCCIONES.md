# 🎯 PROMPTS & INSTRUCCIONES - SANBORNS DIGITAL MENU

**📅 Fecha:** 03 Julio 2025  
**🎯 Propósito:** Contexto y instrucciones para futuros desarrollos  
**🧠 Para:** Continuidad del proyecto después de ausencias  

---

## 🧠 **CONTEXTO PRINCIPAL**

### **🎯 Descripción del Proyecto:**
**WebApp de menú digital para restaurante Sanborns** que reemplaza menús físicos. Clientes escanean QR, ven menú, ordenan, pagan. Estilo retro 90's, móvil-first, PWA.

### **🏗️ Arquitectura:**
- **Frontend:** HTML5 + CSS3 + JavaScript ES6+ + jQuery
- **Backend:** JSON Server (simulado) + LocalStorage
- **Pattern:** Modular Namespace + SOLID + DRY
- **Deploy:** GitHub Pages automático

### **📱 Dispositivos Objetivo:**
- **Primario:** Móviles iOS/Android
- **Secundario:** Tablets, Desktop
- **Resolución:** 320px - 1920px

---

## 🎯 **CONTEXTO CRÍTICO: MI ORDEN VS CUENTA**

### **📋 DIFERENCIA FUNDAMENTAL:**
```javascript
// MI ORDEN = Gestión total del carrito
miOrden: {
    items: "TODOS (nuevos + cocina + servidos)",
    editable: "Solo items nuevos",
    totales: "Suma de TODOS los items",
    propósito: "Gestión completa del carrito"
}

// CUENTA = Solo facturación
cuenta: {
    items: "SOLO (cocina + servidos)",
    editable: "Ninguno (solo lectura)",
    totales: "Suma de SOLO items facturados",
    propósito: "Proceso de pago"
}
```

### **🔄 Estados de Items:**
- **"nuevo":** Editables, en carrito, no facturados
- **"en_cocina":** Readonly, facturados, en preparación
- **"servido":** Readonly, facturados, completados

---

## 🎯 **PROMPTS PARA DESARROLLO**

### **🧠 Prompt Base para Continuar:**
```markdown
Eres un desarrollador JavaScript 10X especializado en Sanborns Digital Menu.

CONTEXTO CRÍTICO:
- WebApp menú digital para restaurante Sanborns
- Arquitectura: Vanilla JS + jQuery + Bootstrap 5
- Patrón: Modular Namespace + SOLID + DRY
- Estado: v1.2.3-beta, 5 de 7 fases completadas

DIFERENCIA CLAVE:
- MI ORDEN: Gestión total (todos los items) - editables solo "nuevos"
- CUENTA: Solo facturación (cocina + servidos) - readonly completo

PRIORIDADES:
1. UX móvil-first
2. Estados inmutables post-orden
3. Separación lógica clara
4. Performance optimizada

DOCUMENTACIÓN: Todos los docs en /docs/
- MANUAL_DE_USUARIO.md (guía completa)
- DOCUMENTACION_COMPLETA.md (arquitectura)
- ESPECIFICACION_MI_ORDEN_Y_CUENTA.md (lógica crítica)
- ROADMAP_HISTORIAL.md (fases y progreso)

ANTES DE CUALQUIER CAMBIO:
1. Lee la documentación relevante
2. Entiende la lógica de estados
3. Respeta la separación Mi Orden vs Cuenta
4. Mantén principios SOLID + DRY
```

### **🔧 Prompt para Fixes:**
```markdown
FIXING SANBORNS DIGITAL MENU

ISSUE P0 - TopNavbar Hide:
- Problema: forceHideNavbar() no funciona
- Causa: Bootstrap override CSS
- Solución: CSS custom + !important
- Archivo: mobile-navbar.js + main.css

ISSUE P1 - Botón Incorrecto:
- Problema: "Ver Menú" en sección Cuenta
- Causa: Reutilización template
- Solución: Separar lógica botones
- Archivo: cart.js (renderización)

ISSUE P2 - Tab Cuenta:
- Problema: No se habilita automáticamente
- Causa: Event listener missing
- Solución: State management mejorado
- Archivo: app.js (navegación)

RECUERDA:
- Cuenta = SOLO facturación (cocina + servidos)
- Mi Orden = Gestión completa (todos los items)
- Items post-orden = INMUTABLES
```

### **🎨 Prompt para UX/UI:**
```markdown
DISEÑANDO SANBORNS DIGITAL MENU

ESTILO:
- Tema: Retro 90's con nostalgia
- Colores: Rojo Sanborns #dc3545 + dorado
- Tipografía: System fonts (-apple-system, Segoe UI)
- Iconos: SVG masks customizables

PRINCIPIOS UX:
- Mobile-first (320px+)
- Touch-friendly (44px mínimo)
- Feedback visual inmediato
- Estados claros y diferenciados

COMPONENTES:
- TopNavbar: Auto-hide en scroll
- BottomTabs: Navegación principal
- ProductCards: Hover effects
- Modals: Overlay con blur
- Badges: Counters dinámicos

RECUERDA:
- Prioridad: Experiencia móvil
- Performance: Animations 60fps
- Accessibility: ARIA labels
```

---

## 🎯 **INSTRUCCIONES ESPECÍFICAS**

### **📁 Estructura de Archivos:**
```bash
# CORE FILES
index.html          # SPA shell
app.js              # Navegación principal
constants.js        # Configuraciones globales

# COMPONENTS
menu.js             # MenuManager
cart.js             # CartManager  
mobile-navbar.js    # TopNavbar
drawer-menu.js      # Sidebar

# SERVICES
data-service.js     # API abstraction
config-service.js   # Configuraciones
state-service.js    # Estado global
utils.js            # Utilidades

# DATA
db.json            # Configuraciones
mock.json          # Menú completo

# DOCS (TODO VA AQUÍ)
docs/              # Documentación completa
```

### **🔧 Convenciones de Código:**
```javascript
// Naming Convention
const MenuManager = {
    // PascalCase para módulos
    init() {},
    loadMenuData() {},
    // camelCase para métodos
};

// Estado de items
const ITEM_STATES = {
    NUEVO: "nuevo",
    EN_COCINA: "en_cocina", 
    SERVIDO: "servido"
};

// Logging
SanbornsUtils.log('info', 'Acción realizada');
SanbornsUtils.log('error', 'Error ocurrido');

// Event listeners
$(document).on('click', '.btn-add-to-cart', function() {
    // Handler code
});
```

### **🎯 Flujo de Desarrollo:**
```bash
# 1. Leer documentación
cat docs/DOCUMENTACION_COMPLETA.md
cat docs/ESPECIFICACION_MI_ORDEN_Y_CUENTA.md

# 2. Identificar archivos afectados
grep -r "función_a_modificar" assets/js/

# 3. Hacer cambios
# Editar archivos necesarios

# 4. Testing local
npx live-server
# Validar en móvil + desktop

# 5. Commit y deploy
git add .
git commit -m "feat: descripción clara"
git push origin main
# GitHub Pages auto-deploy
```

---

## 🎯 **DEBUGGING UTILITIES**

### **🔧 Funciones de Debug:**
```javascript
// Abrir consola y ejecutar:

// Ver estado actual
SanbornsApp.debug.getStatusCounts();

// Simular estados
SanbornsApp.debug.simulateStates();

// Reset completo
SanbornsApp.debug.resetAllToNew();

// Forzar estados
SanbornsApp.debug.markAsSent();
SanbornsApp.debug.markAsServed();

// Verificar totales
console.log('Mi Orden:', CartManager.calculateTotals());
console.log('Cuenta:', CartManager.calculateChargedTotals());
```

### **🎯 Testing Checklist:**
```javascript
// Flujo completo
✅ Agregar items → Badge actualiza
✅ Ordenar Ahora → Items readonly
✅ Tab Cuenta → Se habilita
✅ Cuenta → Solo items facturados
✅ Pagar → Reset completo

// Estados mixtos
✅ Nuevos + Cocina → Controles correctos
✅ Nuevos + Servidos → Cálculos diferentes
✅ Solo Cocina → Botón "Ordenar" oculto

// Responsive
✅ Mobile 320px → Usable
✅ Tablet 768px → Optimizado
✅ Desktop 1920px → Funcional
```

---

## 🎯 **MENSAJES DE COMMIT**

### **📋 Convenciones:**
```bash
# Features
feat: agregar modal confirmación pago
feat: implementar encuesta satisfacción

# Fixes
fix: topnavbar hide en sección Mi Orden
fix: botón incorrecto en sección Cuenta

# Refactoring
refactor: separar lógica Mi Orden y Cuenta
refactor: optimizar renderizado carrito

# Documentation
docs: actualizar manual usuario
docs: completar especificación técnica

# Performance
perf: optimizar carga imágenes
perf: reducir bundle size

# Testing
test: agregar validación flujo completo
test: verificar responsive breakpoints
```

---

## 🎯 **RECOVERY INSTRUCTIONS**

### **🔄 Si regresas después de meses:**
1. **Lee este documento** (5 minutos)
2. **Revisa DOCUMENTACION_COMPLETA.md** (15 minutos)
3. **Ejecuta la app localmente** (2 minutos)
4. **Revisa GitHub Issues** (5 minutos)
5. **Continúa desde donde dejaste** (ready!)

### **📋 Comandos de recuperación:**
```bash
# Clonar repositorio
git clone https://github.com/lodela/webScrapperSbrnsHmns.git
cd webScrapperSbrnsHmns

# Verificar estado
git status
git log --oneline -10

# Ejecutar localmente
npx live-server

# Acceder app
http://localhost:8080
```

### **🎯 Verificación rápida:**
```javascript
// En consola del navegador
console.log('App loaded:', typeof SanbornsApp);
console.log('Cart items:', CartManager.cart.items.length);
console.log('Current section:', SanbornsApp.currentSection);
```

---

## 🎯 **CONTEXTO DE NEGOCIO**

### **🍽️ Flujo del Restaurante:**
1. **Mesero habilita mesa** → Escanea QR maestro
2. **Cliente escanea QR** → Accede webapp
3. **Cliente selecciona** → Agrega al carrito
4. **Cliente ordena** → Items a cocina
5. **Cocina prepara** → Mesero actualiza
6. **Cliente paga** → Cierra cuenta

### **💰 Lógica de Facturación:**
- **Items nuevos:** No facturados (pueden cancelarse)
- **Items en cocina:** Facturados (inmutables)
- **Items servidos:** Facturados y completados
- **Solo items facturados** generan costo

### **🎯 Objetivos UX:**
- **Velocidad:** Orden en < 3 minutos
- **Claridad:** Estados visuales obvios
- **Confianza:** Feedback inmediato
- **Eficiencia:** Menos steps, más valor

---

## 🎯 **STACK FUTURO**

### **🚀 Migración Backend:**
```javascript
// Actual: JSON Server + LocalStorage
// Futuro: Node.js + Express + MongoDB

// Endpoints futuros
/api/menu          // GET menú completo
/api/orders        // POST crear orden
/api/orders/:id    // PUT actualizar estado
/api/payment       // POST procesar pago
/api/tables        // GET estado mesas
```

### **📱 Evolución Frontend:**
```javascript
// Mantener: Vanilla JS + jQuery (performance)
// Agregar: Build process (Webpack/Vite)
// Optimizar: Code splitting, lazy loading
// Mejorar: TypeScript (futuro)
```

---

## 🎯 **CONCLUSIÓN**

### **🎊 Estado Actual:**
**Proyecto maduro, funcional y bien documentado**. Core features completas, arquitectura sólida, deploy automático. Listo para evolución continua.

### **🔮 Próximos Pasos:**
1. **Fixes críticos** (P0-P2)
2. **UX enhancements** (animaciones, feedback)
3. **Módulos avanzados** (pagos, meseros)
4. **AI integration** (recomendaciones)

### **🎯 Compromiso:**
**Mantener documentación actualizada** en `/docs/`. Cada feature nueva debe incluir su documentación correspondiente.

---

**📅 Documento actualizado:** 03 Julio 2025  
**🔄 Usar este documento:** Para continuar desarrollo después de ausencias  
**✅ Status:** Contexto completo y instrucciones claras establecidas

**🚀 Ready to continue development!**
