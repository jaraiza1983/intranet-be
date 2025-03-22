<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Intranet BE (API)

Clonar proyecto
```
git clone https://github.com/jaraiza1983/intranet-be.git
```

Instalar paquetes
```
yarn install
```

Clonar archivo ```.env-template``` y renombrarlo a ```.env``` 

Cambiar las variables de entorno en ```.env```

Leventar la base de datos
```
docker-compose up -d
```

Levantar el programa 
```
yarn start:dev
```

Revisar que este authenticado se hace con el decorador ```@Auth()`` para saber que usuario hizo login
Para validar un role ```@Auth(ValidRoles.admin)```
Para validar mas de un role ```@Auth(ValidRoles.admin, ValidRoles.superAdmin)```

Se tiene que hacer una importacion de ```AuthModule``` en el modulo

Se puede colocar en controlador a nivel general del modulo
```
@Controller('products')
@Auth
export class ProductsController {

}
```

Se puede colocar antes de controller call 
```
@Get('list')
@Auth(ValidRoles.admin)
findAll(){
  return {
    result: "ok",
  }
}
```
