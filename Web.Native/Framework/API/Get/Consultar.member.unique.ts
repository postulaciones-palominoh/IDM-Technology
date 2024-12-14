import { request, type Page } from '@playwright/test';
import { CREDENTIALS } from '../../../Config/Resource/Resource';
import CreateNewMember from '../Post/Create.new.Member';

interface Member {
    id: number;
    name: string;
    gender: string;
  }

export default class ConsultaNewMember {
  constructor(private page: Page) {}

  private Elements = {
    Link_API: 'http://localhost:5002',
    Username: CREDENTIALS.USERNAME_PORTAL,
    Password: CREDENTIALS.PASSWORD_PORTAL,
  };

  
  async consultarMiembroPorId(): Promise<Member | undefined> {
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
      const response = await apiContext.get(`/api/members/${memberId}`);
      if (response.status() === 429) {
        const retryAfter = response.headers()['retry-after'];
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
        console.log(` \x1b[33m ⚠ Demasiadas solicitudes\x1b[0m. Esperando ${delay / 1000} segundos antes de intentar de nuevo...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.consultarMiembroPorId();
      }
  
      if (response.ok()) {
        const memberData = await response.json();
        console.log('\x1b[33m --------------------------------------------------------------------\x1b[0m');
        console.log(`\x1b[33m Información del miembro Consutado por el ID ${memberData.id}:\x1b[0m`, {
          name: memberData.name,
          gender: memberData.gender,
        });
        return memberData as Member;
      } else {
        console.error(`Error al consultar el miembro. Código de estado: ${response.status()}`);
      }
    } catch (error) {
      console.error('Error al consultar el miembro:', error);
    } finally {
      await apiContext.dispose();
    }
  
    return undefined;
  }
}