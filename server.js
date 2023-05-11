require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const app = express();
const routes = require("./routes/flightsRoutes");

//Middleware
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.use("/flight", routes);

//Handle Errors
app.use((err, req, res, next) => {
  console.log(err.code);

  if (err.message == "Flight doesn't exist") {
    return res.json({ code: 404, data: {} });
  }

  if (err.code) {
    return res.json({ code: 400, errors: "could not connect to db" });
  }

  return res.status(err.code).send(err.message);
});

//Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
