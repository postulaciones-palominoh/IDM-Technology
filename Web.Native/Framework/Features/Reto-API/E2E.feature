Feature: Automatizacion de Endpoints - Post-Get-Put-Delete
    Background:
    Given Se verifica que el Servicio este activo

    @API-E2E
    Scenario: Creacion de New Member/Consulta New Member/Update de New Member/Consulta
        When El se ingresa al servicio "<nombre>" y "<genero>"
            And El usuario Consulta el Registo de new Member
            And El usuario Actualiza "<Update_nombre>" y "<Update_genero>"
            And El usuario Consulta el Registo de Update Member 
            And El usuario Carga una imagen en la "<Ruta>"
            Then se Elimina el Usuario Trabajado
        Examples:
            |   nombre        |   genero     |  Update_nombre   |   Update_genero   |   Ruta         |
            |   giancarlo     |   Male       |  Renata          |   Female          |   Vidareal.jpg |