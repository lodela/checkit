# Documento de Requisitos del Producto (PRD) - CheckIt Menú Digital Revolucionario

## 📅 Fecha: 04 de julio de 2025, 05:00 PM CDT

## 🎯 Propósito: Especificación épica de una PWA que redefine la experiencia gastronómica en Sanborns, transformando menús físicos en una plataforma digital vibrante, con un MVP en 1 mes que deje huella.

## 👥 Audiencia: Equipo de desarrollo (4 devs: 2 front-end, 2 back-end), cliente interno (CTO con Doctorado en Administración y TI), y visionarios que sueñan con el futuro.

---

## 🎯 Visión

CheckIt no es solo una PWA; es una revolución culinaria digital que arrasa con los menús de papel en Sanborns. Imagina a los clientes escaneando un QR y sumergiéndose en un mundo dinámico donde el menú cobra vida: sabores, aromas virtuales, y pedidos que vuelan a la cocina en segundos. Queremos cortar los tiempos de espera a la mitad, disparar la satisfacción al 80%, y sentar las bases para una red de 50+ locales en 6 meses, todo con un diseño tan innovador que compita con los gigantes tech de Silicon Valley.

---

## 📋 Alcance

- **Dentro del Alcance**:
  - Activación por QR con sesiones electrificantes por mesa.
  - Menú dinámico que respira con los horarios (desayuno hasta las 14:00, comidas desde las 13:00).
  - Carrito con badges que laten en tiempo real.
  - Envío de pedidos con estados que narran una historia.
  - Pagos con opciones futuristas y recibos al instante.
  - Encuesta post-pago y despliegue en GitHub Pages con estilo.
- **Fuera del Alcance**: Inventarios, paneles de meseros, integraciones locas más allá de APIs de pago.

---

## 👥 Usuarios y Partes Interesadas

- **Clientes**: Gurús móviles (iOS/Android, Chrome 90+, Safari 14+, Firefox 78+), hambrientos de una experiencia slick y navegación offline con onda (solo navegación, ¡pedidos en línea!).
- **CTO**: Un titán que exige KPIs que retumben (90% éxito en pagos), cronogramas de acero, y estrategias de riesgo que impresionen.
- **Equipo de Desarrollo**: Rockstars legacy (vanilla JS, jQuery, Bootstrap) listos para rockear una PWA, necesitando specs técnicas que les hagan brillar.

---

## ✅ Requisitos Funcionales

### 1. Activación por QR

- **Descripción**: El mesero, con un escaneo maestro, desata un QR que vibra con vida, ingresando mesa (e.g., Mesa 201) y personas (e.g., Pers: 2). El cliente lo escanea y entra a un universo CheckIt.
- **Flujo Explosivo**:
  1. Mesero escanea QR maestro con un dispositivo de punta.
  2. Formulario HTML5 ultrarrápido captura mesa y conteo.
  3. Sistema genera un QR con token único, cifrado AES-256.
  4. Cliente escanea, CheckIt se lanza con animación 3D.
- **Diagrama de Flujo**:
  ```
  [Mesero] --> [Escaneo QR Maestro] --> [Formulario Dinámico] --> [Generar QR Cifrado] --> [Cliente Escanea] --> [Lanzamiento 3D CheckIt]
  ```
- **Técnico**: Sesión en `localStorage` con Web Crypto API, validada por GET /session {token: "xyz", table: 201, expires: "2025-07-05T05:00"}, expira en 24h o pago.
- **Plataforma**: Desarrollo en Node.js con Express para backend QR, frontend con Vite para carga instantánea.
- **Entregable**: Módulo QR con animación, 90% cobertura unitaria, demo interactiva.

### 2. Menú Dinámico

- **Descripción**: Una pantalla inicial que explota con el logo Sanborns y botones que pulsan al ritmo del día, controlados por un reloj servidor en tiempo real.
- **Reglas**:
  - Desayuno Sanborns: 00:00–14:00 con efecto fade-in.
  - Comidas Sanborns: 13:00–23:59 con transición slick.
  - Menú del Día: Siempre activo con brillo.
  - Menú Sanborns: Ancla eterna con glow.
- **Interfaz**:
  - Fondo: Rojo fuego (#FF0000), Logo (búhos 3D, 100x50px).
  - Botones: Blancos con borde rojo neon (#FF4500), 100x50px, animados con CSS hover (ver Imagen 1).
- **Filtro de Categorías**:
  - Hamburguesa 3D abre un drawer con 29 categorías (e.g., Enchiladas) que bailan al scrollear.
  - Búsqueda por categoría con autocompletado (e.g., "Sopas y Caldos"), "Reset" con efecto pop.
- **Referencia Visual**: Imagen 1 recreada (pantalla con botones animados Comidas, Desayuno, etc.).
- **Plataforma**: Frontend con React (via CDN) para animaciones, backend con Firebase para horarios dinámicos.
- **Entregable**: Código React del menú, API mock con 150 ítems.

### 3. Selección de Productos

- **Descripción**: Un catálogo de 150+ ítems que salta de las categorías, con modales que parecen portales a la cocina.
- **Datos**: Fotos 300x300px optimizadas WebP, descripciones épicas (máx. 100 chars), precios (MXN), SKUs (e.g., SKU 18332).
- **Interacción**:
  - Clic abre modal Bootstrap con zoom foto, texto 3D, +/– con sonido (30x30px), "Agregar al carrito" (rojo fuego, 80x40px).
  - Badge -10% (amarillo brillante, 30x20px) con animación pulse.
- **Filtro**: Drawer con búsqueda predictiva, reset con efecto confeti.
- **Referencia Visual**: Imagen 2 recreada (tarjetas Molletes con fotos y precios vibrantes).
- **Plataforma**: Desarrollo con WebGL para efectos 3D, jQuery para lógica ligera.
- **Entregable**: Módulo JS/WebGL, mockup editable de modal.

### 4. Gestión de Carrito

- **Descripción**: Mi Orden se convierte en un escenario donde los ítems cantan su estado, con controles que responden al toque.
- **Interfaz**:
  - Lista con fotos parallax, nombres (e.g., Molletes SKU 18332), +/– con haptics, precio dinámico.
  - Badges (TopNavbar, BottomBar) latentes, actualizan con WebSocket.
  - Cálculo: Subtotal + 16% IVA con animación de suma (e.g., $152.10 → $176.44).
- **Estados**:
  - Nuevo: Editable (badge verde con glow).
  - En Cocina: Solo lectura (badge amarillo con giro).
  - Servido: Solo lectura (badge check 3D).
- **Referencia Visual**: Imagen 3 recreada (carrito con controles y total animado).
- **Plataforma**: WebSocket para actualizaciones, Redis para cache de carrito.
- **Entregable**: Módulo carrito con haptics, pruebas de rendimiento.

### 5. Envío de Pedidos

- **Descripción**: "Ordenar Ahora" es un botón que desata un torbellino, enviando pedidos a la cocina con un estallido visual.
- **Flujo**:
  1. Clica "Ordenar Ahora" (rojo neon, 120x50px con sombra).
  2. POST /order con JSON {table: 201, items: [{sku: 18332, qty: 1}]} vía WebSocket.
  3. Ítems a "En Cocina" con efecto de fuego, alerta verde 3D ("¡En camino a cocina!").
  4. Cuenta se activa con transición épica, nuevos ítems editables.
- **Diagrama de Flujo**:
  ```
  [Usuario] --> [Clica Ordenar Ahora] --> [WebSocket POST /order] --> [Efecto Fuego] --> [Alerta 3D] --> [Cuenta Activa]
  ```
- **Referencia Visual**: Imagen 4 recreada ("En Cocina" con botón "Solicitar Cuenta").
- **Plataforma**: Node.js con Socket.io, despliegue con Docker.
- **Entregable**: Lógica de envío, animación CSS/WebGL.

### 6. Procesamiento de Pagos

- **Descripción**: Cuenta se transforma en un portal de pago futurista, con opciones que brillan y una encuesta que hipnotiza.
- **Interfaz**:
  - Lista "En Cocina" y "Servido" con totales animados (e.g., $152.10 → $176.44).
  - Modal con Tarjeta, Efectivo, QR (80x40px con hover 3D).
  - Campos: Email (50 chars), Teléfono (10 dígitos) con validación regex, factura con toggle.
- **Flujo**:
  1. Clica "Pagar Cuenta" (amarillo eléctrico, 120x50px).
  2. POST /payment con Web3 auth (opcional blockchain).
  3. Recibo enviado por email/SMS, encuesta con efecto pop-up.
- **Referencia Visual**: Imagen 6 recreada (resumen con nota "Solo lectura").
- **Plataforma**: Stripe API, Web3.js para pagos descentralizados, AWS SES para recibos.
- **Entregable**: Módulo pago, integración Web3.

### 7. Actualización de Estados

- **Descripción**: Estados que evolucionan como una coreografía, actualizados por staff con un toque mágico.
- **Proceso**: PUT /status {table: 201, item: 18332, status: "Servido"} vía API RESTful.
- **Estados**: Nuevo → En Cocina → Servido → Finalizado (con fireworks).
- **Plataforma**: GraphQL para sincronización en tiempo real.
- **Entregable**: Lógica de estados, mockup de transición.

---

## 🎨 Experiencia de Usuario (UX)

- **Navegación**:
  - TopNavbar: Logo 3D, Mesa #X con efecto hover, Badge pulsante, Menú hamburguesa.
  - BottomBar: Menú, Mi Orden, Cuenta (deshabilitada hasta orden), Mesero (íconos 50x50px con animación).
- **Pantallas**:
  - Imagen 1 Recreada: Menú con botones animados.
  - Imagen 2 Recreada: Tarjetas vibrantes de productos.
  - Imagen 3 Recreada: Carrito con efectos parallax.
  - Imagen 4 Recreada: Post-orden con fuego.
  - Imagen 5 Recreada: Drawer con categorías danzantes.
  - Imagen 6 Recreada: Cuenta con portal de pago.
- **Mockups Editables**: Figma con animaciones WebGL, enlaces post-Sprint 3.

---

## 🛠 Requisitos Técnicos

- **Pila Tecnológica**:
  - Frontend: React (CDN jsDelivr), jQuery (v3.6.0), Bootstrap (v5.1.0) con Tailwind CSS.
  - Fuentes: Google Fonts (Roboto Condensed, 400/700) con animación kerning.
  - Compilación: Vite (v5.0.0) con Rollup, minificación con Terser, .env con secretes.
- **PWA**:
  - Service Workers (Workbox v6.5.0) con cache PWA-optimized, offline con pre-cacheado.
  - manifest.json: {name: "CheckIt", short_name: "CheckIt", start_url: "/index.html", display: "fullscreen", theme_color: "#FF0000"}.
- **APIs**:
  - GET /menu: {items: [{sku: "18332", name: "Molletes milanesa", price: 152.10, image: "url.webp", desc: "4 piezas con salsa...", category: "Desayunos"}]}
  - POST /order: {table: 201, items: [{sku: "18332", qty: 1, status: "Nuevo", timestamp: "2025-07-04T17:00"}]}
  - POST /payment: {method: "card", amount: 176.44, email: "user@example.com", phone: "1234567890", blockchain_sig: "hex"}
  - PUT /status: {table: 201, item: "18332", status: "Servido", updated_by: "mesero123"}
- **Despliegue**:
  - Desarrollo: GitHub Actions con CI/CD, ramas feature → develop → main.
  - Pre-QA: GitHub Pages con Netlify preview, validación con 0 errores Lighthouse.
  - QA/Sandbox: Contenedores Docker en AWS ECS, pruebas automatizadas Selenium.
  - Producción: Kubernetes en GCP con balanceo de carga, dominio sanborns.checkit.app.
- **Rendimiento**: Carga < 1.5s (Lighthouse 95+), 99% uptime con failover.
- **Compatibilidad**: Móviles (iOS 15+, Android 11+), PWA installable.

---

## ⏰ Cronograma y Hitos

- **Sprint 1 (07-13 Jul)**:
  - Entregable: Módulo QR con animación 3D, menú React, 90% cobertura unitaria, video demo.
  - Hito: QR funcional con carga épica, 13 Jul, 23:59 CDT.
- **Sprint 2 (14-20 Jul)**:
  - Entregable: Carrito con WebSocket, envío de pedidos, pruebas E2E, diagrama interactivo.
  - Hito: Flujo completo con efectos, 20 Jul, 23:59 CDT.
- **Sprint 3 (21-27 Jul)**:
  - Entregable: Pago Web3, encuesta con haptics, sincronización GraphQL, mockups Figma.
  - Hito: Pago y encuesta revolucionarios, 27 Jul, 23:59 CDT.
- **Sprint 4 (28-31 Jul)**:
  - Entregable: Bundle PWA optimizado, despliegue Kubernetes, informe < 3 bugs, presentación 4K.
  - Hito: MVP que vuela, aprobado por CTO, 31 Jul, 23:59 CDT.

---

## 📊 Indicadores Clave de Desempeño (KPIs)

- **Eficiencia de Pedidos**: 97% de órdenes en < 90 segundos.
- **Éxito en Pagos**: 92% de transacciones sin fallos.
- **Conversión de Usuarios**: 88% de carrito a orden.
- **Rendimiento**: Carga < 1.5s (Lighthouse 95+), 99% uptime.
- **Satisfacción**: 85% de encuestas con 4-5, análisis IA post-MVP.

---

## ⚠️ Suposiciones y Riesgos

- **Suposiciones**: WiFi 5G en locales, equipo domina WebGL en 1 semana.
- **Riesgos**:
  - Latencia WebSocket (mitigar con CDN Cloudflare, 50ms máx).
  - Curva Web3 (mitigar con hackathon 06-07 Jul, 6h/día).
  - Offline confusión (mitigar con AR tooltip: "Conéctate para magia").
- **Mitigación**: Equipo de soporte 24/7 con IA chatbot, escalado en AWS Lambda.

---

## 📌 Entregables

- **Sprint 1**: Código QR 3D, menú React, pruebas unitarias, video 1080p.
- **Sprint 2**: Módulo carrito WebSocket, API de pedidos, pruebas E2E, diagrama SVG.
- **Sprint 3**: Pago Web3, encuesta haptics, sincronización GraphQL, Figma animado.
- **Sprint 4**: Bundle PWA, despliegue Kubernetes, informe bugs, demo inmersiva.

---

## 📝 Encuesta Post-Pago

- **Interfaz**: Modal (300x400px) con fondo negro, botón "Enviar" (rojo neon, 100x40px) con vibración.
- **Preguntas**:
  1. "¿CheckIt te vuela la cabeza vs. menú tradicional? (Sí/No con efecto)"
  2. "Califica esta locura (1-5, 5=épico)"
- **Lógica**: POST /survey con IA que analiza tono, WebSocket feedback.
- **Entregable**: Código React de encuesta, integración IA.

---

## 📸 Referencias Visuales

- **Imagen 1 Recreada**: Menú con botones animados 3D.
- **Imagen 2 Recreada**: Tarjetas vibrantes con zoom foto.
- **Imagen 3 Recreada**: Carrito con parallax y haptics.
- **Imagen 4 Recreada**: Post-orden con fuego y Cuenta.
- **Imagen 5 Recreada**: Drawer danzante de categorías.
- **Imagen 6 Recreada**: Portal de pago con efectos WebGL.
- **Mockups Editables**: Figma con animaciones, enlaces post-Sprint 3.
