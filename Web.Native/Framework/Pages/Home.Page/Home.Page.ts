import { type Locator, type Page } from '@playwright/test';
import PlaywrightWrapper from "../../../Config/Resource/Wrapper/PlaywrightWrappers";
import Assert from "../../../Config/Resource/Wrapper/Assert";
import{Given,When,Then,setDefaultTimeout} from "@cucumber/cucumber"


setDefaultTimeout(60 * 1000 * 2);

export default class HomePages{
    private base: PlaywrightWrapper
    private assert: Assert
    constructor(private page: Page){
        this.base = new PlaywrightWrapper(page);
        this.assert=new Assert(page);
    }

    private Elements = {
        //Links
        Link_Plataforma:"https://www.exito.com/",
        // Locators Home Page
        logo_home_page:"//img[@alt='logo']",
        btn_Acept_Cookies:"//button[@data-fs-cookies-modal-button='true']",
        btn_menu:"//div[@data-fs-menu-icon-container='true']/following-sibling::span[1]",
        btn_carrito:"//div[@data-fs-navbar-minicart-icon-container='true']",
            //Categorias
                btn_menu_Dormitorio:"//p[normalize-space(text())='Dormitorio']",
                    //Sub-Categoria
                    btn_menu_dormitorio_cabeceras:"//a[normalize-space(text())='Cabeceras']"
        
    }

    async Link_Exito(link:string) {
        await this.base.goto(link);
    }

    async Validacion_Link_Exito() {
        await this.base.Validate_URL(this.Elements.Link_Plataforma);

    }

    async Click_logo() {
        await this.base.waitAndClick(this.Elements.logo_home_page);

    }

    async Click_menu() {
        await this.base.waitAndClick(this.Elements.btn_menu);

    }

    async Click_menu_Dormitorio() {
        await this.base.waitAndClick(this.Elements.btn_menu_Dormitorio);

    }

    async Click_menu_Dormitorio_Cabecera() {
        await this.base.waitAndClick(this.Elements.btn_menu_dormitorio_cabeceras);

    }

    async Click_Carritos_Compras() {
        await this.base.waitAndClick(this.Elements.btn_carrito);

    }






}