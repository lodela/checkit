# 🗺️ PLAN DETALLADO - TRANSFORMACIÓN CHECKIT APP

## 📋 Plan: Convertir app de menú interactivo a monitor de cuenta

App pasará de ser menú digital con carrito a ser monitor de cuenta en tiempo real con promociones, dashboard, cuenta por comensales y llamadas a mesero.

### Steps

1. **Crear Splash con Carousel de Promociones**
   - Buscar 3 imágenes de promociones de restaurante mobile
   - Reemplazar código actual de [index.html](index.html#L42-L63) (splash con botones dinámicos)
   - Implementar carousel Bootstrap con auto-play 5 seg usando estilos de [retro-animations.css](assets/css/retro-animations.css)
   - Agregar botón "Continuar →" con fade-in después de 5 seg usando Reactstrap Link + icon
   - Actualizar [db.json](db.json) con array de promociones mock

2. **Crear Modal Inicial SweetAlert2 (Mesa/Silla)**
   - Agregar modal al cargar app en [app.js](assets/js/app.js#L42-L81) `init()`
   - Usar SweetAlert2 con icono question (ya importado en [index.html](index.html#L22))
   - Guardar Mesa/Silla en localStorage para sesión
   - Validar campos numéricos antes de continuar

3. **Convertir Modal de Mesa en Vista Dashboard**
   - Copiar código de [mobile-navbar.js](assets/js/mobile-navbar.js#L409-L483) `buildMesaModalHTML()`
   - Crear nueva sección `#dashboard-section` en [index.html](index.html)
   - Adaptar HTML de modal a vista completa manteniendo estilos de [mobile-navbar.css](assets/css/mobile-navbar.css#L649-L736)
   - Usar datos mock de [db.json](db.json#L4-L13) `mesas[0]`
   - Eliminar funcionalidad de modal, mantener solo visualización

4. **Modificar Bottom Navigation (Main Menu)**
   - Editar [index.html](index.html#L512-L533) `#mobile-nav`
   - Cambiar 4 botones actuales por 3: Dashboard | Cuenta | Mesero
   - Buscar icono `fa-table` o `fa-utensils` de FontAwesome para Dashboard
   - Mantener iconos actuales de [index.html](index.html#L527-L531) para Cuenta y Mesero
   - Actualizar [app.js](assets/js/app.js#L359-L375) event listeners para nueva navegación

5. **Simplificar Top Navbar**
   - Editar [index.html](index.html#L69-L99) `.mobile-top-navbar`
   - Eliminar columnas `#mesa-info-mobile` y `.navbar-actions`
   - Dejar solo [index.html](index.html#L74-L79) `.cliente-logo-container` centrado
   - Ajustar grid CSS en [mobile-navbar.css](assets/css/mobile-navbar.css#L1-L50)
   - Agregar click event en logotipo → navegar a menú (temporal)

6. **Extender db.json con Servicios Mock**
   - Agregar endpoint `/consultacuenta` con estructura del payload compartido
   - Dividir platillos por `Comensal` (1-4) según servicio real
   - Agregar endpoint `/nombreMesero` retornando objeto con `Descripcion`
   - Mantener estructura compatible con [data-service.js](assets/js/services/data-service.js)
   - Agregar array `promociones.lstima` con paths a imágenes

7. **Implementar Vista Cuenta con Tabs por Comensal**
   - Modificar [cart.js](assets/js/cart.js) para consumir datos de db.json `/consultacuenta`
   - Implementar tabs Bootstrap separando platillos por campo `Comensal`
   - Mantener estilos existentes de [main.css](assets/css/main.css)
   - Mostrar desglose de impuestos visibles
   - Tab "General" muestra todos los items juntos
   - Calcular totales por comensal y total general

8. **Implementar Funcionalidad Botones Mesero**
   - Agregar event listeners en [app.js](assets/js/app.js) para botones en [index.html](index.html#L481-L514)
   - "Llamar Mesero" → llamar servicio (preparar para endpoint futuro)
   - "Pedir la Cuenta" → mismo comportamiento que botón "Pagar"
   - Mantener diseño actual de botones

9. **Crear Modal Formas de Pago**
   - Implementar modal SweetAlert2 al click en "Pagar"
   - Radio buttons: Efectivo, Tarjeta, Paypal, Codi, SPEI, Bitcoin
   - Diseño similar a modal propina existente en [mobile-navbar.js](assets/js/mobile-navbar.js#L449-L475)
   - Al confirmar: llamar servicio mesero + imprimir comanda (preparar para endpoints futuros)
   - Mostrar toast de confirmación

10. **Actualizar Sistema de Navegación**
    - Modificar [app.js](assets/js/app.js#L380-L437) `showSection()` para nuevas 3 secciones
    - Eliminar referencias a sección "menu"
    - Dashboard como sección inicial después de splash
    - Actualizar badges de notificaciones en bottom nav

11. **Buscar e Integrar Imágenes de Promociones**
    - Buscar 3 imágenes de promociones de restaurante optimizadas para mobile (1080x600px aprox)
    - Guardar en `assets/images/promociones/`
    - Actualizar referencias en carousel y db.json
    - Optimizar imágenes para web (< 200KB cada una)

12. **Testing y Ajustes Finales**
    - Verificar navegación completa: Splash → Dashboard → Cuenta → Mesero
    - Probar flujo de pago completo
    - Validar datos mock se muestran correctamente
    - Verificar responsividad mobile
    - Confirmar look & feel retro se mantiene

### Further Considerations

1. **¿Tabs por Comensal en Cuenta?** NO existe actualmente. ¿Quieres que implemente tabs Bootstrap para separar cuenta por comensal usando el campo `Comensal` del servicio, o solo mostrar lista unificada con indicador visual de comensal?

2. **¿Modal Formas de Pago con SweetAlert2?** Al dar click en "Pagar" mostraré modal con radio buttons: Efectivo, Tarjeta, Paypal, Codi, SPEI, Bitcoin. ¿Confirmo diseño similar al modal de propina existente en [mobile-navbar.js](assets/js/mobile-navbar.js#L449-L475)?

3. **¿Placeholder para imágenes de promociones?** Mientras busco imágenes reales, ¿uso placeholders de [placehold.co](https://placehold.co) o [unsplash](https://unsplash.com) con dimensiones 1080x600px para mobile?

4. **¿Botón "Pagar" habilitado solo cuando items en cocina?** Según documentación existe lógica para habilitar botón pagar solo si todos los alimentos están en proceso. ¿Mantengo esta validación o simplifico para el mock?

5. **¿Click en logo navega a dónde?** Mencionas agregar evento temporal al logo para navegar al menú, pero el menú se va a eliminar. ¿Lo dejo sin acción, o navega a Dashboard, o a otra sección?

6. **¿Servicio "imprimir comanda"?** Al pagar se debe llamar este servicio. ¿Preparo stub de función que simule llamada exitosa con toast de confirmación?

7. **¿Notificaciones en badge del botón Mesero?** El servicio `notificacionesMesero` devuelve array. ¿Implemento badge contador visible en el botón Mesero del bottom nav?

8. **¿Actualización automática de datos?** Mencionas que en siguiente sprint será en tiempo real. Por ahora, ¿dejo datos estáticos que solo se actualizan al recargar página, o agrego botón "Actualizar" manual?

9. **¿Estado inicial al cargar app?** ¿La app siempre muestra splash con carousel primero, o si ya hay datos de mesa en localStorage salta directo a Dashboard?

10. **¿Eliminación completa del menú?** ¿Elimino completamente la sección `#menu-section` y todos los archivos relacionados (menu.js, etc.), o los dejo comentados para referencia futura?

---

## 📦 Entregables

- ✅ Splash screen con carousel de 3 promociones + botón "Continuar"
- ✅ Modal SweetAlert2 para captura Mesa/Silla (temporal)
- ✅ Vista Dashboard con datos de mesa (adaptado de modal existente)
- ✅ Bottom nav con 3 botones (Dashboard/Cuenta/Mesero)
- ✅ Top navbar simplificado (solo logo)
- ✅ db.json extendido con servicios mock
- ✅ Vista Cuenta con tabs por comensal
- ✅ Botones Mesero funcionales
- ✅ Modal formas de pago
- ✅ Navegación completa entre secciones
- ✅ Imágenes promocionales integradas
- ✅ Look & feel retro mantenido

## 🎯 Resultado Final

WebApp transformada que muestra:

1. **Splash** atractivo con promociones en carousel
2. **Dashboard** con info de mesa y cuenta actual
3. **Cuenta** detallada por comensal con opción de pago
4. **Mesero** para llamadas y solicitudes

Todo con datos mock listos para conectar a endpoints reales en siguiente sprint.
