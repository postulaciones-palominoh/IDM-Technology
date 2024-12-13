import{chromium,Page,Browser, expect,test}from "@playwright/test";
import { pageFixture } from "../../../Config/Hooks/Page.Fixture";
import { CREDENTIALS, URLS}from '../../../Config/Resource/Resource';
import{Given,When,Then,setDefaultTimeout} from "@cucumber/cucumber"
import HomePages from "../../Pages/Home.Page/Home.Page";
import CabecerasPage from "../../Pages/Categorias.Muebles/Cabeceras.Page";
import CarritoPage from "../../Pages/Carrito.Compras/Carrito.Page";

setDefaultTimeout(60 * 1000 * 2);

  let homePages:HomePages;
  let cabeceraPage:CabecerasPage;
  let carritoPage:CarritoPage;

    Given('Pasos Previos de Ingreso a Categoria Cabeceras', async function () {
        homePages=new HomePages(pageFixture.page);
        await homePages.Click_menu();
        await homePages.Click_menu_Dormitorio();
        await homePages.Click_menu_Dormitorio_Cabecera();
    });
  
    When('El Usuario Escoge {int} Productos y sus respectivas cantidades', async function (int) {
        cabeceraPage=new CabecerasPage(pageFixture.page);
        await cabeceraPage.Seleccion_Aleatoria_Productos();
    });

    Then('Ingresar al Carrito de Compras', async function () {
        await homePages.Click_Carritos_Compras();
    });

    Then('Validar los nombres de los productos agregados al carrito sean correctos', async function () {
        carritoPage=new CarritoPage(pageFixture.page);
        //await carritoPage.Contador_Articulos_Carrito();
        await carritoPage.Validar_Nombres_Productos();
    });

    Then('Validar el total de los precios de los productos agregados al carrito sean correctos', async function () {
        await carritoPage.Validar_Precios_Total_Productos();
    });

    Then('Validar la cantidad de productos agregados al carrito sean correctos', async function () {
        await carritoPage.Validar_Cantidad_Productos_Agregados();
    });

    Then('Validar el numero de productos agregados al carrito sean correctos', async function () {
        await carritoPage.Validar_Productos_Agregados_Carrito();
    });