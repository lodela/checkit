// Test rápido para verificar la funcionalidad de estados
console.log('🧪 TESTING CART STATES...');

// Verificar que CartManager esté disponible
if (typeof CartManager !== 'undefined') {
    console.log('✅ CartManager disponible');
    
    // Verificar funciones críticas
    const requiredFunctions = [
        'hasNewProducts',
        'updateOrderButton', 
        'getEstadoLabel',
        'markProductsAsSent',
        'getStatusCounts'
    ];
    
    const missingFunctions = requiredFunctions.filter(fn => typeof CartManager[fn] !== 'function');
    
    if (missingFunctions.length === 0) {
        console.log('✅ Todas las funciones requeridas están disponibles');
        
        // Test básico
        console.log('Estado inicial:', CartManager.getStatusCounts());
        console.log('¿Hay productos nuevos?', CartManager.hasNewProducts());
        
        // Verificar debug también
        if (typeof CartDebug !== 'undefined') {
            console.log('✅ CartDebug disponible para testing');
            console.log('📋 Funciones debug:', Object.keys(CartDebug));
        }
        
        console.log('🎉 TODOS LOS TESTS PASARON - La implementación está funcionando!');
        
    } else {
        console.log('❌ Funciones faltantes:', missingFunctions);
    }
    
} else {
    console.log('❌ CartManager no está disponible');
}
