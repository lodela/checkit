# 📋 DOCUMENTACIÓN: Secciones "Mi Orden" y "Cuenta"

**📅 Fecha:** 03 Julio 2025  
**🔖 Versión:** v1.2.3-beta  
**👨‍💻 Documentado por:** GitHub Copilot

---

## 🎯 **CONCEPTO GENERAL**

### 🤔 **¿Cuál es la diferencia?**

**"Mi Orden"** y **"Cuenta"** son **la misma sección técnicamente** (`#cuenta-section`), pero con **comportamiento y presentación diferentes** según cómo se accede:

```javascript
// Ambas muestran la misma sección HTML
showSection('mi-orden') → Muestra #cuenta-section
showSection('cuenta')   → Muestra #cuenta-section
```

### 🎨 **Diferencias Visuales:**

| Aspecto               | "Mi Orden"                      | "Cuenta"               |
| --------------------- | ------------------------------- | ---------------------- |
| **Título**            | 🧾 "Mi Orden"                   | 🛒 "Cuenta"            |
| **Icono Header**      | `cuenta-icon-mask` (cuenta.svg) | `fas fa-shopping-cart` |
| **Icono Empty State** | `cuenta-icon-mask`              | `fas fa-shopping-cart` |
| **TopNavbar**         | ❌ Oculto                       | ❌ Oculto              |
| **Cart Button**       | ❌ Oculto                       | ❌ Oculto              |

---

## 🚀 **FLUJO DE NAVEGACIÓN**

### 📱 **Formas de Acceder:**

#### 1️⃣ **A "Mi Orden":**

```javascript
// Desde cart button fijo (top-right)
$('#cart-btn-fixed').click() → showSection('mi-orden')

// Desde tab bar mobile
$('.nav-item[data-section="mi-orden"]').click() → showSection('mi-orden')

// Desde código
showSection('mi-orden')
```

#### 2️⃣ **A "Cuenta":**

```javascript
// Desde tab bar mobile (botón DESHABILITADO)
$('.nav-item[data-section="cuenta"]').click() → showSection('cuenta')

// Desde código
showSection('cuenta')
```

### 🔄 **Lógica de Redirección:**

```javascript
// En app.js línea 510
$('#cart-btn-fixed').on('click', () => {
  this.showSection('mi-orden'); // Siempre va a "Mi Orden"
});
```

---

## 🛠️ **IMPLEMENTACIÓN TÉCNICA**

### 📄 **HTML Structure:**

```html
<!-- Tab Bar Mobile -->
<nav id="mobile-nav" class="mobile-nav">
  <!-- Mi Orden - ACTIVO -->
  <div class="nav-item" data-section="mi-orden">
    <span class="cuenta-icon-mask"></span>
    <span>Mi Orden</span>
    <span id="cart-badge-mobile" class="badge">0</span>
  </div>

  <!-- Cuenta - DESHABILITADO -->
  <div class="nav-item disabled" data-section="cuenta">
    <span class="check-icon-mask"></span>
    <span>Cuenta</span>
  </div>
</nav>

<!-- Sección Única -->
<section id="cuenta-section" class="section">
  <h2><!-- Título dinámico --></h2>
  <div id="empty-cart"><!-- Estado vacío --></div>
  <div id="cart-container"><!-- Productos --></div>
</section>
```

### ⚙️ **JavaScript Logic:**

```javascript
showSection(sectionName) {
    // 1. Mapeo de sección
    let targetSection = sectionName;
    if (sectionName === 'mi-orden') {
        targetSection = 'cuenta'; // Usa la misma sección
    }

    // 2. Cambio de UI según origen
    if (sectionName === 'mi-orden') {
        // Configurar para "Mi Orden"
        $('#cuenta-section h2').html('<span class="cuenta-icon-mask text-danger me-2"></span>Mi Orden');
        $('#empty-cart i').removeClass('fas fa-shopping-cart').addClass('cuenta-icon-mask text-muted');

        // Ocultar navbar
        window.MobileTopNavbar.forceHideNavbar();
        $('#cart-btn-fixed').hide();

    } else if (targetSection === 'cuenta') {
        // Configurar para "Cuenta"
        $('#cuenta-section h2').html('<i class="fas fa-shopping-cart text-danger me-2"></i>Cuenta');
        $('#empty-cart i').removeClass('cuenta-icon-mask').addClass('fas fa-shopping-cart text-muted');

        // Ocultar navbar
        window.MobileTopNavbar.forceHideNavbar();
        $('#cart-btn-fixed').hide();
    }

    // 3. Mostrar sección
    $(`#${targetSection}-section`).addClass('active').fadeIn(300);
}
```

---

## 🎯 **UX/UI BEHAVIOR**

### 🔍 **Estados del Tab Bar:**

#### 📱 **Mobile Navigation:**

```html
<!-- ACTIVOS -->
<div class="nav-item" data-section="menu">Menú</div>
<div class="nav-item" data-section="mi-orden">Mi Orden ✅</div>
<div class="nav-item" data-section="mesero">Mesero</div>

<!-- DESHABILITADO -->
<div class="nav-item disabled" data-section="cuenta">Cuenta ❌</div>
```

### 🎨 **Iconos SVG Mask:**

```css
/* Iconos personalizados con SVG masks */
.cuenta-icon-mask {
  mask: url('assets/images/cuenta.svg');
  background-color: currentColor;
}

.check-icon-mask {
  mask: url('assets/images/check.svg');
  background-color: currentColor;
}
```

### 📱 **Responsive Behavior:**

```javascript
// En ambas secciones se oculta:
// ❌ TopNavbar (#mobile-top-navbar)
// ❌ Cart Button (#cart-btn-fixed)

// En sección "menu" se muestra:
// ✅ TopNavbar
// ✅ Cart Button
```

---

## 🔄 **FLUJO DE DATOS**

### 📊 **CartManager Integration:**

```javascript
// El contenido es el mismo en ambas secciones
CartManager.renderCart() → #cart-container

// Estados de productos:
// - "nuevo" → Editable, botón "Ordenar Ahora"
// - "enviado_cocina" → Solo lectura
// - "servido" → Solo lectura, botones "Pagar" + "Ver Menú"
```

### 💾 **Persistencia:**

```javascript
// Ambas secciones usan el mismo carrito
localStorage.getItem('sanborns-cart');

// Estados sincronizados:
// - Badge del carrito (#cart-badge-mobile)
// - Contenido del carrito
// - Totales y cálculos
```

---

## 🚨 **ISSUES CONOCIDOS**

### 🔧 **P1 - TopNavbar No Se Oculta:**

```javascript
// PROBLEMA: Bootstrap classes d-block d-md-none fuerzan visibilidad
// ESTADO: En desarrollo
// SOLUCIÓN: Usar clases CSS custom en lugar de .hide()

// Código actual:
window.MobileTopNavbar.forceHideNavbar(); // No funciona completamente
$('#cart-btn-fixed').hide(); // No funciona completamente
```

### 📱 **P2 - Tab "Cuenta" Deshabilitado:**

```html
<!-- ESTADO ACTUAL -->
<div class="nav-item disabled" data-section="cuenta">
  <span>Cuenta</span>
  <!-- No clickeable -->
</div>

<!-- PREGUNTA: ¿Cuándo se debe habilitar? -->
```

---

## 🎯 **PRÓXIMOS PASOS**

### 🔨 **Tareas Pendientes:**

1. **Arreglar ocultamiento TopNavbar** - Prioridad Alta
2. **Definir cuándo habilitar tab "Cuenta"** - UX Decision
3. **Documentar transiciones de estado** - Documentación
4. **Testing responsive** - QA

### 💡 **Preguntas para el PM:**

1. ¿Cuándo se debe habilitar el tab "Cuenta"?
2. ¿Debe haber diferencia funcional entre "Mi Orden" y "Cuenta"?
3. ¿El cart button siempre debe ir a "Mi Orden"?

---

## 🎯 **FLUJO COMPLETO DEL USUARIO - PROCESO REAL**

**📅 Actualizado:** 03 Julio 2025 - Documentación del proceso completo

### 📋 **FASE 1: INICIALIZACIÓN DE MESA**

#### � **Backend Process:**

1. **Usuario escanea QR** → Se habilita mesa en BD
2. **Sistema asigna mesero** → Mesa queda vinculada
3. **Mesero ingresa número de personas** → Mesa configurada
4. **Se genera QR único** → Usuario escanea con celular

#### 📱 **Frontend Entry Point:**

```html
<!-- PANTALLA 1: Botonera de entrada (FUNCIONANDO PERFECTO) -->
<!-- Imagen adjunta #1 -->
Botones: - 🍽️ Comidas Sanborns - 🥐 Desayuno Sanborns - 📅 Menú del día - 📋
Menú Sanborns
```

### 📋 **FASE 2: NAVEGACIÓN EN MENÚ**

#### 🍽️ **Menu Section (FUNCIONANDO CORRECTO):**

```html
<!-- PANTALLA 2: TopNavbar + Menú -->
<!-- Imagen adjunta #2 y #3 -->

TopNavbar (RED): - 🛒 Cart Button (badge counter) - 🍔 Hamburger Button Content:
- 🔍 Search bar - 📋 Categorías del menú - 🍽️ Cards de productos Bottom Tab: -
📋 Menú (active) - 🧾 Mi Orden (badge counter) ✅ - 📋 Cuenta (disabled) - 👨‍🍳
Mesero
```

#### ✅ **Add to Cart Logic:**

```javascript
// Usuario selecciona productos → Se agregan al carrito
CartManager.addToCart(product) → {
    // Incrementa badge en:
    // - #cart-badge-fixed (topNavbar)
    // - #cart-badge-mobile (bottomTab)

    // Estado inicial de todos los items:
    item.estado = "nuevo" // Editable
}
```

### 📋 **FASE 3: SECCIÓN "MI ORDEN"**

#### 🎯 **Acceso a Mi Orden:**

```javascript
// TRIGGER: Click en cart button O tab "Mi Orden"
showSection('mi-orden') → {
    // ❌ DEBE OCULTAR: TopNavbar + Cart Button
    // ✅ MOSTRAR: Sección Mi Orden
}
```

#### 📱 **UI de Mi Orden (IMAGEN #4):**

```html
<!-- ESTADO ACTUAL CORRECTO -->
Header: - 🧾 "Mi Orden" (título + icono cuenta.svg) - 📊 Toggle buttons
(cards/list view) Content: - 🍽️ Cards de productos seleccionados - ➕➖
Controles cantidad (FUNCIONAL) - 🗑️ Eliminar items (FUNCIONAL) Summary: - 💰
Subtotal, Impuestos, Total (CORRECTO) Actions: - 🚀 "Ordenar Ahora" (solo si hay
items "nuevo") - 📋 "Ver Menú"
```

### 📋 **FASE 4: PROCESO DE ORDEN**

#### 🚀 **Click "Ordenar Ahora":**

```javascript
// EVENTO CRÍTICO
$('#ordenar-ahora-btn').click() → {
    // Cambiar estado de TODOS los items nuevos:
    cart.items.forEach(item => {
        if (item.estado === "nuevo") {
            item.estado = "enviado_cocina";
        }
    });

    // UI Updates:
    // ✅ Mostrar: "🍳 Orden enviada a cocina!"
    // ❌ Ocultar: Botón "Ordenar Ahora"
    // ❌ Items "enviado_cocina" NO editables
}
```

#### 👨‍🍳 **Proceso de Cocina:**

```javascript
// BACKEND: Mesero actualiza cuando comida está lista
mesero.updateOrderStatus(orderId, "servido") → {
    // Estado final de items:
    item.estado = "servido"

    // UI Changes:
    // ✅ Mostrar: Botones "Pagar Cuenta" + "Agregar Más Productos"
}
```

### 📋 **FASE 5: ESTADOS MIXTOS**

#### 🔄 **Usuario Agrega Más Items:**

```javascript
// ESCENARIO: Ya hay items "enviado_cocina" + user agrega nuevos
cart.items = [
  { id: 1, estado: 'enviado_cocina' }, // No editable
  { id: 2, estado: 'enviado_cocina' }, // No editable
  { id: 3, estado: 'nuevo' }, // Editable ✅
  { id: 4, estado: 'nuevo' }, // Editable ✅
];

// UI Estado Mixto:
// ✅ Indicador: "🍳 Orden enviada a cocina"
// ✅ Botón: "Ordenar Ahora" (para items nuevos)
// ❌ NO mostrar: "Pagar Cuenta", "Agregar Más Productos"
```

### 📋 **FASE 6: REGLAS DE BOTONES EN MI ORDEN**

#### 🎯 **Botones que NO deben aparecer:**

```javascript
// EN SECCIÓN "MI ORDEN" NUNCA mostrar:
❌ "Pagar Cuenta"           // Solo en sección "Cuenta"
❌ "Agregar Más Productos"  // Solo en sección "Cuenta"

// Usar solo:
✅ TopNavbar navigation (cuando visible)
✅ Bottom tab navigation
```

---

## 🚨 **ISSUES IDENTIFICADOS**

### 🔧 **P0 - TopNavbar Visible en Mi Orden:**

```javascript
// PROBLEMA CRÍTICO: TopNavbar se debe ocultar en Mi Orden
// ESTADO: Requiere fix inmediato
showSection('mi-orden') → TopNavbar debe ser invisible
```

### 📱 **P1 - Botones Incorrectos:**

```javascript
// PROBLEMA: Botones "Pagar Cuenta" aparecen en Mi Orden
// REGLA: Solo mostrar en sección "Cuenta" (diferente)
```

---

## 🎯 **PRÓXIMAS ACCIONES REQUERIDAS**

### 🔨 **Tareas Críticas:**

1. **Fix TopNavbar ocultamiento** - P0
2. **Remover botones incorrectos de Mi Orden** - P1
3. **Definir cuándo habilitar sección "Cuenta"** - UX
4. **Implementar estados mixtos correctamente** - P1

### 💡 **Preguntas Resueltas:**

1. ✅ **Mi Orden vs Cuenta:** Son secciones diferentes con propósitos distintos
2. ✅ **Flujo de estados:** nuevo → enviado_cocina → servido
3. ✅ **Botones:** Mi Orden = navegación / Cuenta = acciones finales

---

**📝 Documentación actualizada con el flujo completo - Ready for implementation**
