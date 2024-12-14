import{chromium,Page,Browser, expect,test}from "@playwright/test";
import { pageFixture } from "../../../Config/Hooks/Page.Fixture";
import { CREDENTIALS, URLS}from '../../../Config/Resource/Resource';
import{Given,When,Then,setDefaultTimeout} from "@cucumber/cucumber"
import ServiceActive from "../../API/Get/Servicios.Activos";
import CreateNewMember from "../../API/Post/Create.new.Member";
import ConsultaNewMember from "../../API/Get/Consultar.member.unique";
import UpdateMember from "../../API/Put/Update.member";
import DeleteMember from "../../API/Delete/Delete.member";
import UploadImage from "../../API/Post/Cargar.imagen";
import * as fs from 'fs';
import * as path from 'path';
import FetchImage from "../../API/Get/Ver.Imagen";

let ValidateServices:ServiceActive;
let Create:CreateNewMember;
let consulta:ConsultaNewMember;
let update:UpdateMember;
let deletes:DeleteMember;
let CargaImg:UploadImage;
let  fetchImage:FetchImage;

  Given('Se verifica que el Servicio este activo', async function () {
    ValidateServices =new ServiceActive(pageFixture.page);
    await ValidateServices.verificarServicioActivo();
  });

  When('El se ingresa al servicio {string} y {string}', async function (name, gender) {       
    Create =new CreateNewMember(pageFixture.page);
    await Create.Create_Member(name, gender);
  });

  When('El usuario Consulta el Registo de new Member', async function () {
    consulta=new ConsultaNewMember(pageFixture.page);
    await consulta.consultarMiembroPorId();
  });

  When('El usuario Actualiza {string} y {string}', async function (newName, newGender) {
    update=new UpdateMember(pageFixture.page);
    await update.actualizarMiembro(newName, newGender);
  });

  When('El usuario Consulta el Registo de Update Member', async function () {
    await consulta.consultarMiembroPorId();
  });

  When('El usuario Carga una imagen en la {string}', async function (Ruta) {
    //CargaImg=new UploadImage(pageFixture.page);
    const CargaImg = new UploadImage(pageFixture.page);

    // Definir la ruta relativa y el nombre del archivo
    const imagePath = Ruta;  // Ruta relativa
    const fileName = Ruta;

    // Llamar al método de carga de imagen
    const success = await CargaImg.uploadImage(imagePath, fileName);
    console.log(success ? 'Imagen subida con éxito' : 'Error al subir la imagen');

    const fetcher = new FetchImage();
    const base64 = await fetcher.fetchImage('Yey.jpg');
    if (base64) {
      await fetcher.displayImage(base64, 'Yey.jpg');
    }
    if (base64) {
      await fetcher.saveImage(base64, 'firma_descargada');
    }

  });




  Then('se Elimina el Usuario Trabajado', async function () {
    deletes=new DeleteMember(pageFixture.page);
    await deletes.eliminarMiembro();
  });
