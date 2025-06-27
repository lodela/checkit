#!/usr/bin/env python3
"""
Script para extraer productos de Sanborns del HTML y generar JSON completo
"""

import json
import re
from bs4 import BeautifulSoup

def extract_sku_from_text(text):
    """Extrae el SKU numérico del texto"""
    if not text:
        return None
    
    # Buscar patrón SKU seguido de números
    match = re.search(r'SKU\s*(\d+)', text)
    return match.group(1) if match else None

def extract_price_from_text(price_text):
    """Extrae el precio numérico del texto"""
    if not price_text:
        return None
    
    # Remover $ y convertir a float
    price_match = re.search(r'\$([0-9,]+\.?\d*)', price_text)
    if price_match:
        price_str = price_match.group(1).replace(',', '')
        try:
            return float(price_str)
        except ValueError:
            return None
    return None

def extract_discount_from_text(discount_text):
    """Extrae el descuento numérico del texto"""
    if not discount_text:
        return None
    
    # Buscar patrón -X% o +X%
    match = re.search(r'([+-]?\d+)%', discount_text)
    if match:
        discount = int(match.group(1))
        return abs(discount)  # Devolver valor absoluto
    return None

def clean_text(text):
    """Limpia texto removiendo espacios extra y saltos de línea"""
    if not text:
        return ""
    return ' '.join(text.split()).strip()

def extract_products_from_html():
    """Extrae todos los productos del HTML"""
    
    # Leer el archivo HTML
    with open('/home/lodela/www/webScrapperSbrnsHmns/labToExtratData/sanborns-desayunos.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Estructura para almacenar productos por categoría
    products_by_category = {}
    
    # Encontrar todas las categorías
    category_containers = soup.find_all('div', class_='categoryContainer')
    
    for category_container in category_containers:
        # Extraer nombre de categoría
        category_title_elem = category_container.find('h3', class_='categoryTitle')
        if not category_title_elem:
            continue
        
        category_name = clean_text(category_title_elem.get_text())
        if not category_name:
            continue
        
        print(f"Procesando categoría: {category_name}")
        
        # Inicializar categoría si no existe
        if category_name not in products_by_category:
            products_by_category[category_name] = {}
        
        # Encontrar todas las tarjetas de productos en esta categoría
        product_cards = category_container.find_all('div', class_='product-card')
        
        for card in product_cards:
            try:
                # Extraer imagen y nombre del producto
                img_elem = card.find('img')
                if not img_elem:
                    continue
                
                image_url = img_elem.get('src', '').strip()
                product_title = img_elem.get('title', '').strip()
                
                # Extraer nombre del producto (preferir title sobre orderProductName)
                product_name = product_title
                if not product_name:
                    name_elem = card.find('span', class_='orderProductName')
                    if name_elem:
                        product_name = clean_text(name_elem.get_text())
                
                if not product_name:
                    continue
                
                # Extraer SKU o generar uno automático
                sku = extract_sku_from_text(product_name)
                if not sku:
                    # Generar SKU automático basado en el nombre del producto
                    # Usar hash del nombre para generar un ID consistente
                    import hashlib
                    hash_object = hashlib.md5(product_name.encode())
                    sku = str(int(hash_object.hexdigest()[:8], 16))[:6]  # 6 dígitos
                
                sku_key = f"sku{sku}"
                
                # Extraer descripción
                description = ""
                desc_elem = card.find('p', class_='mt-0.5')
                if desc_elem:
                    description = clean_text(desc_elem.get_text())
                
                # Extraer precios
                price_divs = card.find_all('div', text=re.compile(r'\$\d+'))
                original_price = None
                discounted_price = None
                
                for price_div in price_divs:
                    price_text = price_div.get_text().strip()
                    price_value = extract_price_from_text(price_text)
                    
                    if price_value:
                        # Si tiene clase line-through, es el precio original
                        if 'line-through' in price_div.get('class', []):
                            original_price = price_value
                        else:
                            discounted_price = price_value
                
                # Determinar precio final
                final_price = original_price if original_price else discounted_price
                if not final_price:
                    final_price = discounted_price
                
                # Extraer descuento
                discount = None
                discount_elem = card.find('span', text=re.compile(r'[+-]?\d+%'))
                if discount_elem:
                    discount = extract_discount_from_text(discount_elem.get_text())
                
                # Crear objeto producto
                product_data = {
                    "orderPrductName": product_name,
                    "description": description,
                    "price": final_price,
                    "discount": discount,
                    "image": image_url
                }
                
                # Agregar a la categoría
                products_by_category[category_name][sku_key] = product_data
                
                print(f"  ✓ Producto extraído: {product_name} (SKU: {sku})")
                
            except Exception as e:
                print(f"  ✗ Error procesando producto: {e}")
                continue
    
    return products_by_category

def main():
    """Función principal"""
    print("Iniciando extracción de productos...")
    
    # Extraer productos
    products = extract_products_from_html()
    
    # Guardar JSON
    output_file = '/home/lodela/www/webScrapperSbrnsHmns/mock.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    
    # Estadísticas
    total_products = sum(len(category) for category in products.values())
    print(f"\n✅ Extracción completada:")
    print(f"   📂 Categorías: {len(products)}")
    print(f"   🛍️  Productos totales: {total_products}")
    print(f"   💾 Archivo guardado: {output_file}")
    
    # Mostrar resumen por categoría
    print(f"\n📊 Resumen por categoría:")
    for category, items in products.items():
        print(f"   • {category}: {len(items)} productos")

if __name__ == "__main__":
    main()
