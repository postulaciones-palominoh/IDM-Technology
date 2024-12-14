import { request, type Page } from '@playwright/test';
import { CREDENTIALS } from '../../../Config/Resource/Resource';

interface Member {
  id: number;
  name: string;
  gender: string;
}

export default class CreateNewMember {
  static memberId: string | null = null; // Hacer esta propiedad estática

  constructor(private page: Page) {}

  private Elements = {
    Link_Post: 'http://localhost:5002',
    Username: CREDENTIALS.USERNAME_PORTAL,
    Password: CREDENTIALS.PASSWORD_PORTAL,
  };

  // Método para obtener el ID de miembro
  public static getMemberId(): string | null {
    return CreateNewMember.memberId; // Acceder al miembro estático
  }

  // Método para crear un nuevo miembro
  async Create_Member(name: string, gender: string): Promise<Member | undefined> {
    const apiContext = await request.newContext({
      baseURL: this.Elements.Link_Post,
      extraHTTPHeaders: {
        Authorization: 'Basic ' + Buffer.from(`${this.Elements.Username}:${this.Elements.Password}`).toString('base64'),
      },
    });

    try {
      const response = await apiContext.post('/api/members', {
        data: { name, gender },
      });

      // Manejo del código 429 (Demasiadas solicitudes)
      if (response.status() === 429) {
        const retryAfter = response.headers()['retry-after'];
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;  // Tiempo de espera en milisegundos
        console.log(`\x1b[33m⚠ Demasiadas solicitudes\x1b[0m. Esperando ${delay / 1000} segundos antes de intentar de nuevo...`);
        await new Promise(resolve => setTimeout(resolve, delay));  // Espera antes de reintentar
        return this.Create_Member(name, gender);  // Llamada recursiva para intentar de nuevo
      }

      // Si la respuesta es exitosa, retornamos los datos del miembro creado
      if (response.ok()) {
        const responseData = await response.json();
        console.log('\x1b[33m --------------------------------------------------------------------\x1b[0m');
        console.log('\x1b[32m ✔ Se creo Correctamente Member:\x1b[0m', responseData);

        // Guardamos el ID como una propiedad estática
        CreateNewMember.memberId = responseData.id;

        return responseData as Member;
      } else {
        console.error(`Error ${response.status()}:`, await response.text());
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    } finally {
      await apiContext.dispose();
    }

    return undefined; // Si no se pudo crear correctamente el miembro
  }
}