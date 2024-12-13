
declare var require: any
const fs = require("fs-extra");

try {
    fs.ensureDir("Reports");
    fs.emptyDir("Reports");
    fs.emptyDir("Reports/Local.Reports");
    fs.emptyDir("Reports/Screenshots");
    fs.emptyDir("Reports/Videos");
    
} catch (error) {
    console.log("Fichero no creado!"+error)
    
}