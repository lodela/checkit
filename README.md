# 🍽️ Sanborns WebApp - Menú Digital QR

**Webapp estilo 90's con jQuery + Bootstrap para menú digital de restaurante Sanborns**

## 📱 Concepto del Proyecto

Cliente escanea QR → Abre webapp → Ve menú → Ordena → Paga → Se va feliz

### 🎯 Flujo de Usuario

1. **Escaneo QR** - Cliente accede a la webapp desde su móvil
2. **Visualización Menú** - 29 categorías, +150 productos con imágenes
3. **Selección Productos** - Cards con imagen, descripción, precio, botón (+)
4. **Modal Producto** - Detalles + cantidad + agregar al carrito
5. **Gestión Carrito** - Suma totales, modificar cantidades
6. **Proceso Orden** - "Ordenar Ahora" → Envío a cocina (simulado)
7. **Estado Mesa** - Servida → Opciones: "Pagar" o "Ver Menú"

## 🎨 Diseño & UX

### Responsive Design

- **Desktop/Tablet**: Menú superior horizontal
- **Mobile**: Tab bar inferior con iconos
  - 🍽️ Menú
  - 🛒 Cuenta
  - 👨‍🍳 Mesero

### Estados de la App

- **Carrito Vacío**: "No tienes nada ordenado, ¿te gustaría ver el menú?"
- **Con Productos**: Suma de totales en tiempo real
- **Orden Enviada**: Botones "Pagar" y "Ver Menú"

## 🛠️ Stack Tecnológico

### Core

- **HTML5** - Semántico y accesible
- **CSS3** - Bootstrap 5 Grid + Variables CSS
- **JavaScript ES6+** - Modules, destructuring, async/await
- **jQuery** - DOM manipulation, events, animations

### Herramientas

- **Bootstrap 5** - Grid responsivo (sm, md, lg, xl)
- **JSON Server** - API simulada para estados de mesa
- **LocalStorage** - Persistencia del carrito
- **PWA** - Manifest.json para experiencia nativa

## 📁 Estructura del Proyecto

```
📁 webapp-sanborns/
├── 📄 README.md
├── 📄 index.html
├── 📄 manifest.json (PWA)
├── 📄 package.json
├── 📄 db.json (JSON Server)
├── 📁 assets/
│   ├── 📁 css/
│   │   ├── main.css
│   │   └── retro-animations.css
│   ├── 📁 js/
│   │   ├── app.js (Core)
│   │   ├── cart.js (Carrito)
│   │   ├── menu.js (Menú)
│   │   └── utils.js (Helpers)
│   ├── 📁 images/
│   │   └── icons/
│   └── 📁 sounds/ (opcional)
```

## 🔄 Componentes Principales

### 1. MenuManager

- Renderizado de categorías
- Cards de productos
- Filtros y búsqueda

### 2. CartManager

- Agregar/remover productos
- Calcular totales
- Persistencia localStorage

### 3. ModalManager

- Modal de producto
- Modal de carrito
- Confirmaciones

### 4. NavigationManager

- Tab bar móvil
- Menú desktop
- Estados activos

## 📊 Estructura de Datos

### Producto (del mock.json)

```json
{
  "orderPrductName": "Molletes sanborns SKU 18330",
  "description": "Con salsa mexicana bolillos...",
  "price": 129.0,
  "discount": 10,
  "image": "https://tofuu.getjusto.com/..."
}
```

### Estado Carrito (localStorage)

```json
{
  "items": [
    {
      "sku": "18330",
      "name": "Molletes sanborns SKU 18330",
      "price": 129.0,
      "quantity": 2,
      "total": 258.0
    }
  ],
  "subtotal": 258.0,
  "tax": 41.28,
  "total": 299.28
}
```

## 🚀 Fases de Desarrollo

### ✅ Fase 1: Estructura Base

- [x] Extracción de datos del HTML
- [x] Creación del mock.json completo
- [x] Setup inicial del proyecto
- [x] HTML base + Bootstrap
- [x] CSS retro + animaciones
- [x] JavaScript core + jQuery

### 🔄 Fase 2: Funcionalidad Core

- [ ] Renderizado del menú
- [ ] Sistema de carrito
- [ ] Modales de producto
- [ ] Navegación responsive

### 🔮 Fase 3: Features Avanzadas

- [ ] JSON Server + estados de mesa
- [ ] PWA + manifest
- [ ] Animaciones + sonidos
- [ ] Optimizaciones finales

### 🎯 Fase 4: Módulos Futuros

- [ ] Opciones de productos (sin cebolla, etc.)
- [ ] Sistema de meseros
- [ ] Pagos integrados
- [ ] Analytics básicos

## 🎵 Estilo Retro 90's

### Paleta de Colores

- **Primario**: #FF0000 (Rojo Sanborns)
- **Secundario**: #FFD700 (Dorado)
- **Fondo**: #F5F5F5 (Gris claro)
- **Texto**: #333333 (Gris oscuro)

### Animaciones jQuery

- **Fade in/out** para modales
- **Slide up/down** para navegación
- **Bounce** para botones de acción
- **Loading spinners** retro

## 🔧 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar JSON Server
npm run server

# Desarrollo (Live Server)
npm run dev

# Build para producción
npm run build
```

## 📝 Notas de Desarrollo

- **jQuery**: Solo para lo esencial, no abusar
- **Bootstrap**: Grid + utilities, evitar componentes JS
- **Módulos ES6**: Mantener código organizado
- **Performance**: Lazy loading de imágenes
- **Accesibilidad**: ARIA labels, keyboard navigation

---

**Estado Actual**: ✅ Estructura base completa | 🔄 Testing inicial  
**Próximo**: Instalación de dependencias y primera prueba
