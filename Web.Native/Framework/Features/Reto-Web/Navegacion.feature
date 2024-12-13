Feature: Navegacion Web
    Background:
    Given El usuario ingresa a la plataforma Exito
    
    @Navegacion @E2E
    Scenario: Acceso Correcto a la Plataforma Exito
    When El usuario da click en el logo de la plataforma
    Then Se valida el link de la plataforma sea correcto

    @E2E @Categorias
    Scenario: Acceso Correcto a la categoria Cabeceras
    When El usuario da click en el menu del home page
        And El usuario da click en la categoria Dormitorio
        And El usuario da click en la subcategoria Cabeceras
    Then Se valida el link de la categoria



        