Hola 👋!, esta es mi solución al proyecto de simular el check-in de un aeropuerto. ✈

Para ejecutar desde bash puedes usar el siguiente comando en la carpeta contenedora del proyecto cambiando los valores por los indicados en el pdf:
```bash
npm install
```

```bash
HOST=host USER=user PASSWORD=password DB_NAME=db_name node server.js
```

Si quieres visitar el proyecto desplegado, da click [aquí](https://bsale-reto-production.up.railway.app/flights/1/passengers)

## Tabla de contenido

- [Creando la base de datos](#creando-la-base-de-datos)
  - [Creando un servidor de pruebas](#creando-un-servidor-de-pruebas)
- [Creando el repositorio y el servidor](#creando-el-repositorio-y-el-servidor)
- [Conectando con la base de datos](#conectando-con-la-base-de-datos)
- [Creando Rutas y Controladores](#creando-rutas-y-controladores)
- [Despliege en Railway](#despliege-en-railway)

## Creando la base de datos

Para empezar el proyecto tuve que copiar la base de datos por que sabía que por momentos habría saturación de querys y me sentía más seguro trabajando desde una copia local.

Una vez copiada la base de datos, empezé a jugar con los querys hasta lograr traer en una sola tabla los datos que requería la prueba en su mismo orden y con el camelCase ya aplicado.

---

### Creando un servidor de pruebas

Creé un servidor local para ir jugando con node y la base de datos para hacerme una idea de los archivos, paquetes y manera de organizarlos antes de crear el repo oficial e ir trabajando por prueba y error.

Una vez que ya establecí la arquitectura de carpetas y el correcto llamado de la base de datos, empezé con la prueba oficial.

---

## Creando el repositorio y el servidor

Creé el repositorio en github y lo cloné en mi local donde creé las carpetas y archivos en el orden establecido en mi zona de pruebas.

- Agregué los siguientes paquetes:
  - [dotenv](https://github.com/motdotla/dotenv): Leer variables de entorno.
  - [express](https://github.com/expressjs/express): Framework de NodeJS.
  - [morgan](https://github.com/expressjs/morgan): Ver los HTTP request en consola.
  - [mysql2](https://github.com/sidorares/node-mysql2): Conectarme a la DB.
  - [nodemon](https://github.com/remy/nodemon): Para reiniciar el servidor automaticamente.

Configuré los middlewares, rutas, un manejador de errores y el puerto del servidor ubicado en server.js

```jsx
require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes/flightsRoutes");

//Middlewares
app.use(express.json());

app.use("/flights", routes);

app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  return res.status(err.code).send("Something went really wrong...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
```

## Conectando con la base de datos

En config/db.js hize la conexión con la base de datos local

```jsx
const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "airline",
});

module.exports = connection.promise();
```

y también creé el esquema con los querys ya testeados tanto en el workbench como en el servidor de pruebas.

```sql
SELECT flight_id AS flightId,
      takeoff_date_time AS takeoffDateTime,
      takeoff_airport AS takeoffAirport,
      landing_date_time AS landingDateTime,
      landing_airport AS landingAirport,
      airplane_id AS airplaneId
    FROM airline.flight
      WHERE flight_id = ${id}
    LIMIT 1
```

```sql
SELECT   p.passenger_id AS passengerId,
      p.dni,
      p.name,
      p.age,
      p.country,
      bp.boarding_pass_id AS boardingPassId,
      pur.purchase_id AS purchaseId,
      pur.purchase_date AS purchaseDate,
      st.seat_type_id AS seatTypeId,
      st.name AS seatTypeName,
      s.seat_id AS seatId,
      s.seat_column AS seatColumn,
      s.seat_row AS seatRow
    FROM boarding_pass bp
    INNER JOIN passenger p ON bp.passenger_id = p.passenger_id
    INNER JOIN purchase pur ON bp.purchase_id = pur.purchase_id
    INNER JOIN seat_type st ON bp.seat_type_id = st.seat_type_id
    INNER JOIN seat s ON bp.seat_id = s.seat_id
    INNER JOIN flight f ON bp.flight_id = f.flight_id
    INNER JOIN airplane a ON f.airplane_id = a.airplane_id
      WHERE bp.flight_id=${id}
    ORDER BY bp.seat_id
    LIMIT 0, 200
```

## Creando Rutas y Controladores

Toca crear el archivo ./controllers/flightControllers.js donde requiero el schema creado antes y ejecutar los querys.

Lanzo un error cuando el flight_id no existe en la base de datos y lo envío a mi handle error.

```jsx
exports.getFlightById = async (req, res, next) => {
  try {
		...
    if (!flight[0]) {
      throw new Error("Flight doesn't exist");
    }
		...
	} catch (error) {
    console.log(error);
    next(error);
  }
};
```

Le doy la forma solicitada en el pdf (se puede mejorar si le doy la forma en una función aparte para no ensuciar el controlador).

```jsx
const newPassengers = [...passengers].map((e) => {
  delete e.purchaseDate;
  delete e.seatTypeName;
  delete e.seatColumn;
  delete e.seatRow;
  return e;
});

const newFlight = [...flight][0];

newFlight.passengers = newPassengers;

return res.status(200).json({ code: 200, data: newFlight });
```

Ahora toca hacer la ruta, recibo el controlador y lo asigno a la ruta solicitada: “/:id/passengers”

```jsx
const express = require("express");
const flightController = require("../controllers/flightControllers");
const router = express.Router();

router.route("/:id/passengers").get(flightController.getFlightById);

module.exports = router;
```

El router lo recibo en el server.js y ya está configurado mi ruta.

## Despliege en Railway

Uso esta alternativa a Heroku y AWS porque en ambos me piden tarjeta y tengo un problema porque no lo pueden autenticar 😢. Es la primera vez que uso Railway pero me sorprendió lo fácil que fue, sólo agregué las variables de entorno y todo listo! 😄.

# 🥳🎉✨🎉🥳✨🥳🎉LISTO! 🥳🎉✨🎉🥳✨🎉🥳
