const Flight = require("../models/flightSchema");

exports.getFlightById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [allSeats] = await Flight.findSeats(id);
    const [flight] = await Flight.findFlightById(id);
    const [passWithSeat] = await Flight.findPassengersWhitSeat(id);
    const [passNoSeat] = await Flight.findPassengersNoSeat(id);

    if (!flight[0]) {
      throw new Error("Flight doesn't exist");
    }
    //-----------------darle forma del pdf-----------------------
    const random = [...passWithSeat];

    const newPassWithSeat = random.map((e) => {
      delete e.purchaseDate;
      delete e.seatTypeName;
      delete e.seatColumn;
      delete e.seatRow;
      return e;
    });

    const newFlight = [...flight][0];

    newFlight.passengers = newPassWithSeat;

    //---------------------------------------

    //---------------------unir los pasajeros sin asientos a todo----------------------------
    const seats = allSeats.filter(
      (seat) => seat.airplane_id == newFlight.airplaneId
    );

    const seatsTakenId = passWithSeat.reduce((acc, el) => {
      acc.push(el.seatId);
      return acc;
    }, []);
    console.log(seatsTakenId);

    const availableSeatId = seats
      .filter((e) => !seatsTakenId.includes(e.seat_id))
      .reduce((acc, el) => {
        acc.push(el.seat_id);
        return acc;
      }, []);
    console.log(availableSeatId);

    //-------------------------------------------------------

    // -------------------Retornar TODA LA DATA----------------------------
    return res.status(200).json({ code: 200, data: newFlight, seats });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
