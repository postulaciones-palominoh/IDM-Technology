import { type Locator, type Page } from '@playwright/test';
import PlaywrightWrapper from "../../../Config/Resource/Wrapper/PlaywrightWrappers";
import Assert from "../../../Config/Resource/Wrapper/Assert";
import{Given,When,Then,setDefaultTimeout} from "@cucumber/cucumber"
import { getProductosSeleccionados } from '../Categorias.Muebles/Cabeceras.Page';

setDefaultTimeout(60 * 1000 * 2);

export default class CarritoPage{
    private base: PlaywrightWrapper
    private assert: Assert
    constructor(private page: Page){
        this.base = new PlaywrightWrapper(page);
        this.assert=new Assert(page);
    }
    private Elements = {
        // Locators
        txt_Nombre_Producto: "(//span[@data-molecule-product-detail-name-span='true'])",
        txt_precio_Total_Producto: "(//div[@data-molecule-product-detail-price-best-price='true'])",
        txt_cantidad_Producto: "(//span[@data-molecule-quantity-und-value='true'])",
        txt_Precio_Total: "(//span[@data-molecule-summary-item-value='true'])[2]"
    };

    async Contador_Articulos_Carrito() {
        // Esperar a que el contenedor esté presente
        await this.page.waitForSelector("//div[@class='exito-checkout-io-0-x-sellerListContainer']");
    
        // Crear un locator para el contenedor padre con XPath
        const contenedor = this.page.locator("//div[@class='exito-checkout-io-0-x-sellerListContainer']");
    
        // Buscar elementos hijos dentro del contenedor con XPath explícito
        const items = contenedor.locator("xpath=.//div[@data-molecule-product-detail='true']");
    
        // Contar los elementos encontrados
        const cantidadItems = await items.count();
    
        // Mostrar el resultado
        console.log('\x1b[33m ------------------------------------------------------------------\x1b[0m');
        console.log(`\x1b[33m ➞ \x1b[1mCantidad de Productos Encontrados en Carrito de Compras:\x1b[0m ${cantidadItems}`);
        console.log('\x1b[33m ------------------------------------------------------------------\x1b[0m');
    
        // Retornar la cantidad para usar en otros métodos
        return cantidadItems;
    }

    async Validar_Nombres_Productos() {
        const totalElementos = await this.Contador_Articulos_Carrito();
        const productosSeleccionados = getProductosSeleccionados();

        console.log('\n\x1b[33m -------------VALIDACION NOMBRES---------------\x1b[0m');
    
        if (productosSeleccionados.length === 0) {
            console.warn("No hay productos seleccionados para comparar.");
            return;
        }
    
        for (let i = 0; i < totalElementos; i++) {
            const selector = `(//span[@data-molecule-product-detail-name-span='true'])[${i + 1}]`;
            const Nombre_Producto_DOM = await this.page.locator(`xpath=${selector}`).textContent();
    
            if (Nombre_Producto_DOM) {
                const Nombre_Producto_DOM_Limpio = Nombre_Producto_DOM.trim().toLowerCase(); // Limpiar y pasar a minúsculas
                console.log(`\n\x1b[33m ------------------------------------------------------------------\x1b[0m`);
                console.log(`\x1b[33m ➞ \x1b[1m Nombre Encontrado del Producto #${i + 1} en el Carrito:\x1b[0m ${Nombre_Producto_DOM_Limpio}`);
    
                // Buscar el producto en los productos seleccionados por nombre
                const productoSeleccionado = productosSeleccionados.find(producto => 
                    producto.nombre.trim().toLowerCase() === Nombre_Producto_DOM_Limpio
                );
    
                if (productoSeleccionado) {
                    console.log(`\x1b[32m✔ Nombre coincide:\x1b[0m ${productoSeleccionado.nombre.trim().toLowerCase()}`);
                } else {
                    console.warn(
                        `\x1b[31m✘ Nombre no coincide para el producto ${i + 1}:\nDOM: ${Nombre_Producto_DOM_Limpio}\nNo encontrado en los productos seleccionados\x1b[0m`
                    );
                }
            } else {
                console.warn(`No se encontró nombre para el producto en el índice ${i + 1}`);
            }
        }
    }

    async Validar_Precios_Total_Productos() {
        const totalElementos = await this.Contador_Articulos_Carrito();
        const productosSeleccionados = getProductosSeleccionados();
        console.log('\n\x1b[33m -------------VALIDACION PRECIO TOTAL---------------\x1b[0m');
    
        if (productosSeleccionados.length === 0) {
            console.warn("No hay productos seleccionados para comparar.");
            return;
        }
    
        // Función para limpiar y convertir precios a flotantes (sin formato)
        const limpiarPrecio = (precio: string): number => {
            return parseFloat(precio.replace(/^\$|[.]/g, "").replace(",", "."));
        };
    
        for (let i = 0; i < totalElementos; i++) {
            const selector = `(//div[@data-molecule-product-detail-price-best-price='true'])[${i + 1}]`;
            const Precio_Total_Producto_DOM = await this.page.locator(`xpath=${selector}`).textContent();
    
            if (Precio_Total_Producto_DOM) {
                // Limpiar y convertir el precio del DOM
                const Precio_Total_Producto_Limpio = limpiarPrecio(Precio_Total_Producto_DOM.trim());
    
                console.log('\n\x1b[33m ------------------------------------------------------------------\x1b[0m');
                console.log(`\x1b[33m ➞ \x1b[1m Precio Total Encontrado del Producto #${i + 1} en el Carrito:\x1b[0m ${Precio_Total_Producto_DOM}`);
    
                // Buscar el producto por su precio total en productos seleccionados
                const productoSeleccionado = productosSeleccionados.find(producto => {
                    const Precio_Total_Producto_Guardado_Limpio = limpiarPrecio(producto.precioTotal);
                    return Precio_Total_Producto_Guardado_Limpio === Precio_Total_Producto_Limpio;
                });
    
                if (productoSeleccionado) {
                    console.log(`\x1b[32m✔ Precio Total coincide: $ \x1b[0m ${productoSeleccionado.precioTotal}`);
                } else {
                    console.warn(
                        `\x1b[31m✘ Precio Total no coincide para el producto ${i + 1}:\nDOM: ${Precio_Total_Producto_Limpio}\nNo encontrado en los productos seleccionados\x1b[0m`
                    );
                }
            } else {
                console.warn(`No se encontró precio para el producto en el índice ${i + 1}`);
            }
        }
    }

    async Validar_Cantidad_Productos_Agregados() {
        const totalElementos = await this.Contador_Articulos_Carrito();
        const productosSeleccionados = getProductosSeleccionados();
    
        console.log('\n\x1b[33m -------------VALIDACION CANTIDAD DE PRODUCTOS ---------------\x1b[0m');
        
        if (productosSeleccionados.length === 0) {
            console.warn("No hay productos seleccionados para comparar.");
            return;
        }
    
        for (let i = 0; i < totalElementos; i++) {
            const selector = `(//span[@data-molecule-quantity-und-value='true'])[${i + 1}]`;
            const Cantidad_Producto_DOM = await this.page.locator(`xpath=${selector}`).textContent();
    
            if (Cantidad_Producto_DOM) {
                // Convertir Cantidad_Producto_DOM a número
                const Cantidad_Producto_DOM_Limpio = parseInt(Cantidad_Producto_DOM.trim(), 10);
                
                console.log(`\n\x1b[33m ------------------------------------------------------------------\x1b[0m`);
                console.log(`\x1b[33m ➞ \x1b[1m Cantidad Asignada del Producto #${i + 1} en el Carrito es:\x1b[0m ${Cantidad_Producto_DOM_Limpio}`);
    
                // Buscar el producto en los productos seleccionados por cantidad
                const productoSeleccionado = productosSeleccionados.find(producto => 
                    producto.cantidad === Cantidad_Producto_DOM_Limpio
                );
    
                if (productoSeleccionado) {
                    console.log(`\x1b[32m✔ La cantidad de Productos coincide:\x1b[0m ${productoSeleccionado.cantidad}`);
                } else {
                    console.warn(
                        `\x1b[31m✘ La cantidad no coincide para el producto ${i + 1}:\nDOM: ${Cantidad_Producto_DOM_Limpio}\nNo encontrado en los productos seleccionados\x1b[0m`
                    );
                }
            } else {
                console.warn(`No se encontró la cantidad para el producto en el índice ${i + 1}`);
            }
        }
    }

    async Validar_Productos_Agregados_Carrito() {
        const totalElementos = await this.Contador_Articulos_Carrito();
        const productosSeleccionados = getProductosSeleccionados();
    
        console.log('\n\x1b[33m -------------VALIDACION DE PRODUCTOS AGREGADOS---------------\x1b[0m');
        
        // Validar que las cantidades coincidan
        if (totalElementos !== productosSeleccionados.length) {
            console.warn(
                `\x1b[31m✘ La cantidad de productos en el carrito (${totalElementos}) no coincide con los seleccionados (${productosSeleccionados.length}).\x1b[0m`
            );
            return; // Detener ejecución si no coinciden
        }
    
        console.log(
            `\x1b[32m✔ La cantidad de productos en el carrito (${totalElementos}) coincide con los seleccionados (${productosSeleccionados.length}).\x1b[0m`
        );
    
        // Continuar con validaciones adicionales si es necesario
        for (let i = 0; i < totalElementos; i++) {
            const productoSeleccionado = productosSeleccionados[i];
            console.log(`\x1b[33m ➞ Producto #${i + 1}: ${productoSeleccionado.nombre}, Cantidad: ${productoSeleccionado.cantidad}\x1b[0m`);
        }
    }
    





    





    


}