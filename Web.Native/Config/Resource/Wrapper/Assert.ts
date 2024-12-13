import { expect, Page } from "@playwright/test";

export default class Assert {

    constructor(private page: Page) { }

    async assertTitle(title: string) {
        await expect(this.page).toHaveTitle(title);
    }

    async assertVisible(title: string) {
        const TitleVisible = await this.page.locator(title);
        await expect(TitleVisible).toBeVisible();
        //console.log('Se encontro el Locator VISIBLE');
    }

    async assertTitleContains(title: string) {
        const pageTitle = await this.page.title();
        expect(pageTitle).toContain(title);
    }

    async assertURL(url: string) {
        await expect(this.page).toHaveURL(url);
    }

    async assertURLContains(title: string) {
        const pageURL = this.page.url();
        expect(pageURL).toContain(title);
    }

}