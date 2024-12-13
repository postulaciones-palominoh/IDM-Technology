import { Page } from "@playwright/test";

export default class PlaywrightWrapper {

    constructor(private page: Page) { }

    async goto(url: string) {
        await this.page.goto(url, {
            waitUntil: "domcontentloaded"
        });
    }

    async waitAndClick(locator: string) {
        const element = this.page.locator(locator);
        await element.waitFor({
            state: "visible"
        });
        await element.click();
    }

    async navigateTo(link: string) {
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click(link)
        ])
    }
    async waitAndClick_TestID(locator: string) {
        const element = this.page.getByTestId(locator);
        await element.waitFor({
            state: "visible"
        });
        await element.click();
    }

    async Scroll(){
        await this.page.mouse.wheel(0,1000);
        await this.page.waitForTimeout(1000);
        await this.page.mouse.wheel(0,0);
    }

    async Validate_URL(link:string){
        await this.page.waitForURL(link);
        console.log('Se logró Validar Correctamente el Link: ',link);
    }

}