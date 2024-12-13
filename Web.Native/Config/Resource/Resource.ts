import { config } from 'dotenv';
import path from 'path';
// Cargar el primer archivo .env de la ruta raíz
config({ path: path.resolve(__dirname, './../../.env') });

export const URLS ={

    URL_PORTAL:process.env.URL_PORTAL!,
    BROWSER_PORTAL:process.env.BROWSER_PORTAL!
    
}
export const CREDENTIALS ={
    USERNAME_PORTAL:process.env.USERNAME_PORTAL!,
    PASSWORD_PORTAL:process.env.PASSWORD_PORTAL!,
    USERNAME_PORTAL_FAIL:process.env.USERNAME_PORTAL_FAIL!,
    PASSWORD_PORTAL_FAIL:process.env.PASSWORD_PORTAL_FAIL!
}








