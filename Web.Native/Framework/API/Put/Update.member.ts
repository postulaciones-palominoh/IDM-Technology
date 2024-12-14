import { request, type Page } from '@playwright/test';
import { CREDENTIALS } from '../../../Config/Resource/Resource';
import CreateNewMember from '../Post/Create.new.Member';

interface Member {
  id: number;
  name: string;
  gender: string;
}

export default class UpdateMember {
  constructor(private page: Page) {}

  private Elements = {
    Link_API: 'http://localhost:5002',
    Username: CREDENTIALS.USERNAME_PORTAL,
    Password: CREDENTIALS.PASSWORD_PORTAL,
  };

  // Método para actualizar la información del miembro
  async actualizarMiembro(newName: string, newGender: string): Promise<Member | undefined> {
    const memberId = CreateNewMember.getMemberId();
    if (!memberId) {
      console.error('No se ha encontrado un ID de miembro. Asegúrate de que el miembro haya sido creado primero.');
      return undefined;
    }

    const apiContext = await request.newContext({
      baseURL: this.Elements.Link_API,
      extraHTTPHeaders: {
        Authorization: 'Basic ' + Buffer.from(`${this.Elements.Username}:${this.Elements.Password}`).toString('base64'),
      },
    });

    try {
      // Enviamos una solicitud PUT para actualizar el miembro
      const response = await apiContext.put(`/api/members/${memberId}`, {
        data: {
          name: newName,
          gender: newGender,
        },
      });

      // Manejamos el código 429 (Demasiadas solicitudes)
      if (response.status() === 429) {
        const retryAfter = response.headers()['retry-after'];
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
        console.log(`\x1b[33m⚠ Demasiadas solicitudes\x1b[0m. Esperando ${delay / 1000} segundos antes de intentar de nuevo...`);
        await new Promise(resolve => setTimeout(resolve, delay)); // Espera antes de reintentar
        return this.actualizarMiembro(newName, newGender); // Llamada recursiva para intentar de nuevo
      }

      // Imprimir el cuerpo completo de la respuesta para inspeccionar qué datos estamos recibiendo
      const responseData = await response.json();
      //console.log("Cuerpo de la respuesta: ", responseData);

      // Si la respuesta es exitosa, retornamos los datos del miembro actualizado
      if (response.ok()) {
        console.log('\x1b[33m --------------------------------------------------------------------\x1b[0m');
        console.log(` \x1b[32m✔ Miembro actualizado correctamente:\x1b[0m`, responseData);
        return responseData as Member;
      } else {
        console.error(`Error al actualizar el miembro. Código de estado: ${response.status()}`);
      }
    } catch (error) {
      console.error('Error al actualizar el miembro:', error);
    } finally {
      await apiContext.dispose();
    }

    return undefined; // Si no se actualizó correctamente
  }
}