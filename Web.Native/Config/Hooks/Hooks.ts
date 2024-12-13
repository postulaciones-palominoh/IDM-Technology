import {Before,After, BeforeAll, AfterAll,BeforeStep,AfterStep, Status,setDefaultTimeout}from "@cucumber/cucumber";
//import{chromium,Browser,Page, BrowserContext}from "@playwright/test";
import {LaunchOptions,chromium,firefox,Browser,Page,BrowserContext,webkit}from "playwright-core"
import{pageFixture}from "./Page.Fixture";
import { CREDENTIALS, URLS }from '../Resource/Resource';


const fs= require("fs-extra");
setDefaultTimeout(60 * 1000 * 2);

let page:Page;
let browser:Browser;
let context:BrowserContext;
let global_width = 1920;
let global_height = 1040;



BeforeAll(async function() {
    //config();

    const options: LaunchOptions ={
        headless:false,
        slowMo:2000,
        //ignoreDefaultArgs:true,
        args:['--window-size=1920,1040','--ignore-certificate-errors'],
    }
    const optionsedge: LaunchOptions ={
        headless:false,
        slowMo:2000,
        args:['--window-size=1920,1040','--ignore-certificate-errors'],
        channel: 'msedge',
    }

    switch(URLS.BROWSER_PORTAL){
        case "chrome":
            browser= await chromium.launch(options);
            break;
        case "firefox":
            browser= await firefox.launch(options);
            break;
        case "webkit":
            browser= await webkit.launch(options);
            break;
        case "edge":
                browser= await chromium.launch(optionsedge);
            break;
        default:
            throw new Error("Browser no Soportado!")
    }

    

    //browser=await chromium.launch({headless:false});

});

Before(async function () {

    
    context= await browser.newContext({
        viewport:{ width: global_width, height: global_height },
        ignoreHTTPSErrors:true,
        //viewport:null,
        recordVideo:{
            dir:"Reports/Videos/",
            size:{width:global_width,height:global_height}  
        },
    });
    //browser = await chromium.launch({headless:false});
    const page=await context.newPage();
    pageFixture.page=page;
    
    
});

AfterStep(async function({pickle,result}) {
    let VideoPath: string;
    const img= await pageFixture.page.screenshot({path:`./Reports/Screenshots/${pickle.name}.png`,type:"png"})
    await this.attach(img,"image/png")
    /*VideoPath = await pageFixture.page.video()!.path();
    await this.attach(fs.readFileSync(VideoPath!),'video/webm');*/

});

After(async function ({pickle,result}) {
    let VideoPath: string;
    let img: Buffer;
    //console.log(result?.status);
    //Evidencias - Screenshot - al Fallo 
    VideoPath = await pageFixture.page.video()!.path(); 
    if (result?.status==Status.FAILED){
        img= await pageFixture.page.screenshot({path:`./Reports/Screenshots/${pickle.name}.png`,type:"png"})
        //await this.attach(img,"image/png")
        //VideoPath = await pageFixture.page.video()!.path();
    }
    //Evidencias - Screenshot
    //const img= await pageFixture.page.screenshot({path:`./test-result/screenshots/${pickle.name}.png`,type:"png"})
    //await this.attach(img,"image/png")

    await pageFixture.page.close();
    await context.close();
    
    if (result?.status==Status.FAILED){
        await this.attach(
            img! ,"image/png"
        );
        /*await this.attach(
            fs!.readFileSync(VideoPath!),
            'video/webm'
        );*/

    }
    await this.attach(
        fs!.readFileSync(VideoPath!),
        'video/webm'
    );
    
});

AfterAll(async function() {
    await browser.close();
    

});