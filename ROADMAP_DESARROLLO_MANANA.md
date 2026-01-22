# 🚀 ROADMAP DE DESARROLLO PARA MAÑANA

**CheckIt - Sanborns WebApp**
_Fecha: 8 de Julio 2025_

## ⚡ **PRIORIDAD MÁXIMA - BUGS CRÍTICOS PARA MAÑANA**

### **🔥 Bug #1 - CRÍTICO: showSection() Mapeo Incorrecto**

**Tarea #16** - `app.js líneas 408-411`

```javascript
// BUG ACTUAL:
if (sectionName === 'mi-orden') {
  targetSection = 'cuenta'; // ❌ MAPEA INCORRECTAMENTE
}
```

**Impacto**: Mi Orden y Cuenta usan el mismo DOM element
**Fix**: Crear `#mi-orden-section` separado y corregir mapeo

### **🔥 Bug #2 - CRÍTICO: Cálculos CartManager Incorrectos**

**Tarea #17** - `cart.js CartManager.updateTotals()`

```javascript
// BUG ACTUAL:
this.cart.items.forEach(item => {
  // ❌ No filtra por estado, suma todos los productos
  subtotal += item.price * item.quantity;
});
```

**Impacto**: Mi Orden y Cuenta muestran el mismo total
**Fix**: Implementar filtrado por estado en cálculos

### **🔥 Bug #3 - CRÍTICO: Tab Cuenta Deshabilitado**

**Tarea #18** - `mobile-navbar.js`

```html
<!-- BUG ACTUAL: -->
<div class="nav-item disabled" data-section="cuenta"></div>
```

**Impacto**: Tab Cuenta nunca se habilita dinámicamente
**Fix**: Implementar `updateCuentaTab()` al cambiar estados

### **🔥 Bug #4 - CRÍTICO: TopNavbar No Se Oculta**

**Tarea #19** - `MobileTopNavbar.forceHideNavbar()`
**Impacto**: Navbar visible en Mi Orden/Cuenta (debe estar oculto)
**Fix**: Corregir CSS con `!important` y especificidad

---

## 📋 **SECUENCIA DE TAREAS PARA MAÑANA**

### **FASE 1: SETUP (30 mins)**

**Tarea #1 - Configurar Entorno de Desarrollo**

- ✅ Git ya inicializado
- ✅ Verificar versiones (jQuery 3.7, Bootstrap 5.3)
- ✅ JSON Server configurado
- ✅ PWA básico funcional
- 🔧 Configurar ESLint/Prettier

### **FASE 2: BUGS CRÍTICOS (4-6 horas)**

**Orden de Ejecución:**

1. **Tarea #16** - Fix showSection() mapeo ⚡ **PRIMERA PRIORIDAD**
   - Crear `#mi-orden-section` en HTML
   - Corregir mapeo en `app.js`
   - Separar lógica de renderizado

2. **Tarea #17** - Fix cálculos CartManager ⚡ **SEGUNDA PRIORIDAD**
   - Implementar filtrado por estado
   - Diferenciar Mi Orden vs Cuenta
   - Corregir `updateTotals()`

3. **Tarea #18** - Fix Tab Cuenta dinámico ⚡ **TERCERA PRIORIDAD**
   - Implementar `updateCuentaTab()`
   - Habilitar/deshabilitar según estados
   - Integrar con cambios de estado

4. **Tarea #19** - Fix TopNavbar hide ⚡ **CUARTA PRIORIDAD**
   - Corregir CSS con `!important`
   - Verificar `forceHideNavbar()`
   - Validar en diferentes dispositivos

### **FASE 3: VALIDACIÓN (1-2 horas)**

- Testing de bugs corregidos
- Validación en diferentes dispositivos
- Regression testing

---

## 🎯 **OBJETIVOS DEL DÍA**

### **✅ DEBE FUNCIONAR AL FINAL DEL DÍA:**

1. **Mi Orden** muestra productos editables con total correcto
2. **Cuenta** muestra solo productos facturados/servidos con total correcto
3. **Tab Cuenta** se habilita automáticamente cuando hay productos facturados
4. **TopNavbar** se oculta correctamente en Mi Orden/Cuenta
5. **Navegación SPA** funciona correctamente entre todas las secciones

### **📱 TESTING CHECKLIST:**

- [ ] Mi Orden: Agregar/editar/eliminar productos ✓
- [ ] Cuenta: Solo lectura, productos facturados ✓
- [ ] Tab Cuenta: Habilitar/deshabilitar dinámicamente ✓
- [ ] TopNavbar: Auto-hide en Mi Orden/Cuenta ✓
- [ ] Responsive: Mobile, tablet, desktop ✓

---

## 🛠️ **RECURSOS TÉCNICOS**

### **Archivos Críticos a Modificar:**

- `assets/js/app.js` - showSection() mapeo
- `assets/js/cart.js` - CartManager cálculos
- `assets/js/mobile-navbar.js` - Tab Cuenta dinámico
- `assets/css/main.css` - TopNavbar hide styles
- `index.html` - Crear #mi-orden-section

### **Estructura de Estados:**

```javascript
const ESTADOS_PRODUCTO = {
  pending: 'Nuevo (editable)',
  enviado_cocina: 'En Cocina (facturado)',
  servido: 'Servido (facturado)',
};

// Mi Orden: pending
// Cuenta: enviado_cocina + servido
```

---

## 📊 **ESTADÍSTICAS DEL PROYECTO**

**✅ TAREAS GENERADAS POR TASK-MASTER-AI:**

- **Total**: 19 tareas principales
- **Subtareas**: 75 subtareas
- **Prioridad Alta**: 9 tareas (bugs críticos)
- **Prioridad Media**: 2 tareas (polish)
- **Prioridad Baja**: 8 tareas (funcionalidades)

**🔥 ESTADO DE BUGS CRÍTICOS:**

- **4 bugs críticos** identificados y documentados
- **4 tareas específicas** creadas para bugs críticos
- **Dependencias mapeadas** correctamente
- **Roadmap definido** para resolución

---

## 🎪 **ARQUITECTURA CONFIRMADA**

**Frontend SPA:** jQuery 3.7 + Bootstrap 5.3 + CSS3
**Patrón:** Module Pattern con namespaces globales
**Datos:** mock.json + DataService abstraction
**PWA:** manifest.json + service worker
**Responsive:** Mobile-first design

**✅ Análisis del código completado**
**✅ TaskMaster-AI configurado**  
**✅ Bugs críticos identificados**
**✅ Roadmap de desarrollo definido**

---

**¡LISTO PARA COMENZAR A DESARROLLAR MAÑANA EN LA MAÑANA!** 🚀
