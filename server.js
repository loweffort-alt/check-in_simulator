require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const app = express();

//Middleware
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.use("/flight", require("./routes/flightsRoutes"));

//Handle Errors
app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
  console.log(err.code);

  return res.status(err.code).send(err.message);
});

//Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
