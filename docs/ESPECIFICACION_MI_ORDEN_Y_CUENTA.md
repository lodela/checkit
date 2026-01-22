# 📋 ESPECIFICACIÓN COMPLETA: MI ORDEN Y CUENTA

**📅 Fecha:** 03 Julio 2025  
**🎯 Sección:** Diferencias críticas entre "Mi Orden" y "Cuenta"  
**📝 Estado:** Especificación final actualizada

---

## 🎯 **COMPORTAMIENTO DE SECCIONES**

### **📋 SECCIÓN "MI ORDEN"**

#### **🔧 Funcionalidad Principal:**

- **Gestión total del carrito** (todos los items)
- **Control de estados** (nuevos, cocina, servidos)
- **Edición condicional** (solo items nuevos)

#### **💫 Estados de Items:**

```javascript
// Items "nuevos" (editables)
{
    estado: "nuevo",
    editable: true,
    showControls: true,      // Botones +/- y eliminar
    canDelete: true,
    canModifyQuantity: true
}

// Items "en cocina" (readonly)
{
    estado: "en_cocina",
    editable: false,
    showControls: false,     // Sin botones de control
    readonly: true,
    statusBadge: "🔥 En preparación"
}

// Items "servidos" (readonly)
{
    estado: "servido",
    editable: false,
    showControls: false,     // Sin botones de control
    readonly: true,
    statusBadge: "✅ Servido"
}
```

#### **🧮 Cálculo de Totales:**

- **Incluye:** TODOS los items (nuevos + cocina + servidos)
- **Subtotal:** Suma de todos los productos
- **Impuestos:** 16% sobre subtotal
- **Total:** Subtotal + impuestos

#### **⚡ Botones Dinámicos:**

```javascript
// Botón "Ordenar Ahora"
showButton: hasItemsInState('nuevo') === true;
hideButton: hasItemsInState('nuevo') === false;

// Lógica de display
if (cart.items.filter(item => item.estado === 'nuevo').length > 0) {
  showButton('ordenar-ahora-btn');
} else {
  hideButton('ordenar-ahora-btn');
}
```

#### **🎨 Indicadores Visuales:**

- **Badge del Tab:** Muestra total de items (nuevos + cocina + servidos)
- **Items nuevos:** Fondo blanco, controles habilitados
- **Items en cocina:** Fondo amarillo claro, texto "🔥 En preparación"
- **Items servidos:** Fondo verde claro, texto "✅ Servido"

---

### **💳 SECCIÓN "CUENTA"**

#### **🔧 Funcionalidad Principal:**

- **Solo facturación** (items que generaron cargo)
- **Vista de solo lectura** (información)
- **Proceso de pago** (cierre de cuenta)

#### **📋 Habilitación del Tab:**

```javascript
// Estado inicial
tabCuenta: {
    enabled: false,
    visible: true,      // Visible pero deshabilitado
    clickable: false
}

// Se habilita cuando hay items en cocina
enableCuentaTab: function() {
    if (hasItemsInState("en_cocina") || hasItemsInState("servido")) {
        tabCuenta.enabled = true;
        tabCuenta.clickable = true;
    }
}
```

#### **💰 Items Mostrados:**

- **Incluye SOLO:** Items "en cocina" + "servidos"
- **Excluye:** Items "nuevos" (no facturados)
- **Razón:** Solo se cobran items que se ordenaron

#### **🧮 Cálculo de Totales:**

```javascript
// Filtrado de items facturados
const itemsFacturados = cart.items.filter(
  item => item.estado === 'en_cocina' || item.estado === 'servido'
);

// Cálculo solo de items facturados
const subtotal = itemsFacturados.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);
const impuestos = subtotal * 0.16;
const total = subtotal + impuestos;
```

#### **🎨 Formato de Visualización:**

- **Layout:** Formato lista (como ticket)
- **Controles:** Ninguno (solo lectura)
- **Estados:** Mostrar badge de estado por item
- **Botones:** Solo "Pagar Cuenta"

#### **❌ Funcionalidades ELIMINADAS:**

- **NO** botones +/- para cantidad
- **NO** botón eliminar items
- **NO** mensaje "Orden Enviada a Cocina"
- **NO** botón "Ver Menú"
- **NO** edición de ningún tipo

---

## 🔄 **FLUJO DE TRANSICIONES**

### **📱 Secuencia Completa:**

#### **1. Estado Inicial:**

```javascript
// Al cargar la app
miOrden: { visible: true, items: [] }
cuenta: { enabled: false, visible: true, items: [] }
```

#### **2. Agregar Items:**

```javascript
// Items van a "Mi Orden" como "nuevos"
addToCart() → {
    item.estado = "nuevo";
    miOrden.items.push(item);
    cuenta.items = [];  // Cuenta sigue vacía
}
```

#### **3. Ordenar Ahora:**

```javascript
// Items pasan a "en cocina"
ordenarAhora() → {
    items.forEach(item => {
        if (item.estado === "nuevo") {
            item.estado = "en_cocina";
        }
    });

    // Habilitar tab Cuenta
    cuenta.enabled = true;
    cuenta.items = items.filter(item =>
        item.estado === "en_cocina" || item.estado === "servido"
    );
}
```

#### **4. Servir Items:**

```javascript
// Mesero actualiza estados
marcarComoServido() → {
    items.forEach(item => {
        if (item.estado === "en_cocina") {
            item.estado = "servido";
        }
    });

    // Actualizar vista Cuenta
    cuenta.items = items.filter(item =>
        item.estado === "en_cocina" || item.estado === "servido"
    );
}
```

#### **5. Pagar Cuenta:**

```javascript
// Proceso de pago y reset
pagarCuenta() → {
    // Modal de confirmación
    showModal("¿Confirmas el pago?");

    // Encuesta de satisfacción
    showSurvey();

    // Reset completo
    resetApp() → {
        cart.items = [];
        miOrden.items = [];
        cuenta.items = [];
        cuenta.enabled = false;
        navigateTo("menu-inicial");
    }
}
```

---

## 🎯 **CASOS DE USO ESPECÍFICOS**

### **📋 Caso 1: Estados Mixtos**

```javascript
// Escenario: 3 nuevos, 2 en cocina, 1 servido
cart.items = [
  { id: 1, estado: 'nuevo', editable: true },
  { id: 2, estado: 'nuevo', editable: true },
  { id: 3, estado: 'nuevo', editable: true },
  { id: 4, estado: 'en_cocina', editable: false },
  { id: 5, estado: 'en_cocina', editable: false },
  { id: 6, estado: 'servido', editable: false },
];

// Mi Orden muestra: 6 items (3 editables + 3 readonly)
miOrden.displayItems = 6;
miOrden.editableItems = 3;
miOrden.showOrdenarAhoraBtn = true; // Hay items nuevos

// Cuenta muestra: 3 items (2 cocina + 1 servido)
cuenta.displayItems = 3;
cuenta.editableItems = 0;
cuenta.showPagarCuentaBtn = true; // Hay items facturados
```

### **🧮 Caso 2: Cálculo Diferenciado**

```javascript
// Items con precios
const items = [
    { id: 1, precio: 100, estado: "nuevo" },      // No facturado
    { id: 2, precio: 200, estado: "en_cocina" },  // Facturado
    { id: 3, precio: 150, estado: "servido" }     // Facturado
];

// Cálculo Mi Orden (todos los items)
miOrden.subtotal = 100 + 200 + 150 = 450;
miOrden.impuestos = 450 * 0.16 = 72;
miOrden.total = 450 + 72 = 522;

// Cálculo Cuenta (solo facturados)
cuenta.subtotal = 200 + 150 = 350;
cuenta.impuestos = 350 * 0.16 = 56;
cuenta.total = 350 + 56 = 406;
```

---

## 🚨 **ISSUES CRÍTICOS IDENTIFICADOS**

### **🔴 P0 - TopNavbar Hide**

```javascript
// Problema actual
forceHideNavbar() → {
    // Bootstrap override impide ocultar
    $('.mobile-top-navbar').addClass('d-none');  // No funciona
}

// Solución requerida
forceHideNavbar() → {
    // CSS personalizado
    $('.mobile-top-navbar').addClass('sanborns-hidden');
}

// CSS
.sanborns-hidden {
    transform: translateY(-100%) !important;
    opacity: 0 !important;
}
```

### **🔴 P1 - Botón Incorrecto**

```javascript
// Problema: Botón "Ver Menú" en sección Cuenta
// Solución: Cambiar por "Pagar Cuenta"

// Cuenta debe mostrar SOLO:
const cuentaButtons = {
  'pagar-cuenta-btn': {
    text: 'Pagar Cuenta',
    action: 'pagarCuenta()',
    visible: true,
  },
  // NO otros botones
};
```

### **🔴 P2 - Separación Lógica**

```javascript
// Problema: Misma sección para Mi Orden y Cuenta
// Solución temporal: Condicionales

renderSection(sectionName) {
    if (sectionName === "mi-orden") {
        renderMiOrden();
    } else if (sectionName === "cuenta") {
        renderCuenta();
    }
}

// Refactoring futuro: Secciones separadas
```

---

## 🎯 **DEBUGGING FUNCTIONS**

### **🔧 Funciones de Debug:**

```javascript
// Disponibles en consola
SanbornsDebug = {
  // Simular estados
  simulateStates: () => CartManager.simulateStates(),

  // Reset a estado inicial
  resetAllToNew: () => CartManager.resetAllToNew(),

  // Contar items por estado
  getStatusCounts: () => CartManager.getStatusCounts(),

  // Cambiar estados manualmente
  markAsSent: () => CartManager.markProductsAsSent(),
  markAsServed: () => CartManager.markProductsAsServed(),

  // Habilitar/deshabilitar cuenta
  toggleCuenta: () => {
    const hasChargedItems = CartManager.hasChargedItems();
    $('#cuenta-tab').toggleClass('disabled', !hasChargedItems);
  },
};
```

---

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

### **✅ Completadas:**

- [x] Estados de items (nuevo, cocina, servido)
- [x] Cálculo diferenciado Mi Orden vs Cuenta
- [x] Habilitación condicional tab Cuenta
- [x] Items readonly en estados avanzados

### **🔄 En Proceso:**

- [ ] Fix TopNavbar hide en Mi Orden
- [ ] Botón "Pagar Cuenta" en sección Cuenta
- [ ] Modal de confirmación pago
- [ ] Encuesta de satisfacción

### **📋 Pendientes:**

- [ ] Separación física de secciones
- [ ] Optimización de renders
- [ ] Testing de flujos completos
- [ ] Documentación técnica API

---

**🎯 CONCLUSIÓN:**  
Mi Orden = **Gestión completa** | Cuenta = **Solo facturación**  
**Separación lógica clara** para UX optimizada y proceso de pago eficiente.

---

**📅 Actualizado:** 03 Julio 2025  
**🔄 Próxima revisión:** Después de fixes P0-P1
