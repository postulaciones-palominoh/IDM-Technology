Feature: Navegacion Web
    Background:
    Given El usuario ingresa a la plataforma Exito
        And Pasos Previos de Ingreso a Categoria Cabeceras
    
    @Productos @E2E
    Scenario: Seleccion de Productos, Catidades Aleatoriamente y Validacion del Reto
        When El Usuario Escoge 5 Productos y sus respectivas cantidades
        Then Ingresar al Carrito de Compras
            And Validar los nombres de los productos agregados al carrito sean correctos
            And Validar el total de los precios de los productos agregados al carrito sean correctos
            And Validar la cantidad de productos agregados al carrito sean correctos
            And Validar el numero de productos agregados al carrito sean correctos
        