import{chromium,Page,Browser, expect,test}from "@playwright/test";
import { pageFixture } from "../../../Config/Hooks/Page.Fixture";
import { CREDENTIALS, URLS}from '../../../Config/Resource/Resource';
import{Given,When,Then,setDefaultTimeout} from "@cucumber/cucumber"
import HomePages from "../../Pages/Home.Page/Home.Page";
import CabecerasPage from "../../Pages/Categorias.Muebles/Cabeceras.Page";

setDefaultTimeout(60 * 1000 * 2);

  let homePages:HomePages;
  let cabeceraPage:CabecerasPage;

  Given('El usuario ingresa a la plataforma Exito', async function () {
    homePages=new HomePages(pageFixture.page);
    await homePages.Link_Exito(URLS.URL_PORTAL);
  });

//Scenario: Acceso Correcto a la Plataforma Exito
  When('El usuario da click en el logo de la plataforma', async function () {
    await homePages.Click_logo();
  });

  Then('Se valida el link de la plataforma sea correcto', async function () {
    await homePages.Validacion_Link_Exito();
  });

// Scenario: Acceso Correcto a la categoria Cabeceras
  When('El usuario da click en el menu del home page', async function () {
    cabeceraPage=new CabecerasPage(pageFixture.page);
    await homePages.Click_menu();
  });

  When('El usuario da click en la categoria Dormitorio', async function () {
    await homePages.Click_menu_Dormitorio();
  });

  When('El usuario da click en la subcategoria Cabeceras', async function () {
    await homePages.Click_menu_Dormitorio_Cabecera();
  });

  Then('Se valida el link de la categoria', async function () {
    await cabeceraPage.Validacion_Link_Categoria_Cabeceras();
  });
