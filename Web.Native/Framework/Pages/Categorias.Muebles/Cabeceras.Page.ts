import { type Locator, type Page } from '@playwright/test';
import PlaywrightWrapper from "../../../Config/Resource/Wrapper/PlaywrightWrappers";
import Assert from "../../../Config/Resource/Wrapper/Assert";
import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";

setDefaultTimeout(60 * 1000 * 2);

// Arreglo global para almacenar los productos seleccionados
const productosSeleccionados: {
    id: number;
    nombre: string;
    precioUnitario: string; // Cambiado a string
    cantidad: number;
    precioTotal: string; // Cambiado a string
}[] = [];

// Clase principal
export default class CabecerasPage {
    private base: PlaywrightWrapper;
    private assert: Assert;

    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
        this.assert = new Assert(page);
    }

    private Elements = {
        // Links
        Link_Categoria_Cabeceras: "https://www.exito.com/hogar/muebles/cabeceros",

        // Locators
        Conteiner_Productos: "//div[@data-fs-product-listing-results='true']//article",

        // Producto
        btn_agregar_Producto: "//button[contains(.,'Agregar')]",
        txt_nombre_Producto: ".product-title_product-title__heading___mpLA",
        txt_cantidad_Producto: ".QuantitySelectorDefault_custom-quantity-selector__input__IHd9p",
        txt_Precio_Unitario: ".ProductPrice_container__price__XmMWA",
    };

    async Validacion_Link_Categoria_Cabeceras() {
        await this.base.Validate_URL(this.Elements.Link_Categoria_Cabeceras);
    }

    async Seleccion_Aleatoria_Productos() {
        // Esperamos a que el contenedor de productos esté cargado
        await this.page.waitForSelector(this.Elements.Conteiner_Productos);
        // Creamos variable para encontrar los productos dentro del contenedor
        const productos = await this.page.locator(this.Elements.Conteiner_Productos);
        const totalProductos = await productos.count();

        // Lógica para seleccionar 5 índices de productos sin repetición
        if (totalProductos > 0) {
            const cantidadASeleccionar = Math.min(5, totalProductos);
            const indicesAleatorios = Array.from({ length: totalProductos }, (_, i) => i)
                .sort(() => Math.random() - 0.5)
                .slice(0, cantidadASeleccionar);

            console.log(`\x1b[32m ✔ Se seleccionarán ${cantidadASeleccionar} productos de manera aleatoria:\x1b[0m`);

            for (const indice of indicesAleatorios) {
                try {
                    const producto = productos.nth(indice);

                    // Verifica que el producto está visible e interactúa con él
                    await producto.scrollIntoViewIfNeeded();
                    await producto.click();

                    // Esperar a que el Nombre del Producto esté disponible
                    const NombreProducto = await this.page.locator(this.Elements.txt_nombre_Producto).textContent();
                    const PrecioProducto = await this.page.locator(this.Elements.txt_Precio_Unitario).textContent();

                    // Validar que los datos sean correctos
                    if (!NombreProducto || !PrecioProducto) {
                        console.warn(`\x1b[31m ✘ Producto ID ${indice + 1} no tiene datos válidos. Saltando...\x1b[0m`);
                        continue;
                    }

                    // Esperar a que el botón "Agregar" esté disponible
                    const botonCarrito = this.page.locator(this.Elements.btn_agregar_Producto);
                    await botonCarrito.waitFor({ state: 'visible' });
                    await botonCarrito.click();

                    // Esperar a que aparezca el selector de cantidad
                    const inputCantidad = this.page.locator(this.Elements.txt_cantidad_Producto);
                    await inputCantidad.waitFor({ state: 'visible' });

                    // Generar una cantidad aleatoria entre 1 y 10
                    const cantidadAleatoria = Math.floor(Math.random() * 10) + 1;

                    // Establecer la cantidad en el input
                    await inputCantidad.fill(cantidadAleatoria.toString());
                    await this.page.keyboard.press("Enter");

                    // Cálculo de precios
                    const preciounitario = parseFloat((PrecioProducto.trim().replace(/[^\d.]/g, '') || '0'));
                    const PrecioTotal = parseFloat((preciounitario * cantidadAleatoria).toFixed(3));

                    // Guardar datos del producto
                    productosSeleccionados.push({
                        id: indice + 1,
                        nombre: NombreProducto.trim(),
                        precioUnitario: preciounitario.toFixed(3), // Guardar como string con 3 decimales
                        cantidad: cantidadAleatoria,
                        precioTotal: PrecioTotal.toFixed(3), // Guardar como string con 3 decimales
                    });

                    // Logs
                    console.log('\x1b[33m --------------------------------------------------\x1b[0m');
                    console.log(`\x1b[33m ➞ \x1b[1mProducto ID: ${indice + 1}\x1b[0m`);
                    console.log(`\x1b[32m ➞ \x1b[1mNombre del Producto:\x1b[0m ${NombreProducto?.trim() || 'Sin nombre'}`);
                    console.log(`\x1b[32m ➞ \x1b[1mPrecio Unitario:\x1b[0m ${PrecioProducto?.trim() || '0'}`);
                    console.log(`\x1b[32m ➞ \x1b[1mCantidad Agregada:\x1b[0m ${cantidadAleatoria}`);
                    console.log(`\x1b[32m ➞ \x1b[1mPrecio Total:\x1b[0m $ ${PrecioTotal.toFixed(3)}\n`);

                    // Regresar a la selección de productos
                    await this.page.goBack();
                } catch (error) {
                    console.error(`\x1b[31m ✘ Error procesando el producto ID ${indice + 1}: ${error}\x1b[0m`);
                }
            }

            // Mostrar productos seleccionados en consola
            console.log('\n\x1b[32m ✔ Productos Almacenados en Caché ✔\n\x1b[0m', /*productosSeleccionados*/);
        }
    }
}

// Exportar función para obtener productos seleccionados
export const getProductosSeleccionados = () => productosSeleccionados;






