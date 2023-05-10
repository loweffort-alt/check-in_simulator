const Flight = require("../models/flightSchema");

exports.getFlightById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [flight] = await Flight.findFlightById(id);
    const [passengers] = await Flight.findPassengers(id);

    if (!flight[0]) {
      throw new Error("Flight doesn't exist");
    }

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
  } catch (error) {
    console.log(error);
    next(error);
  }
};
