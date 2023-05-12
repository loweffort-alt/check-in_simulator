const Flight = require("../models/flightSchema");

function getEmptySeats(allSeats, currentFlight, allPassengers) {
  const totalSeats = allSeats.filter(seat => seat.airplane_id == currentFlight.airplaneId)

  const seatsTakenId = allPassengers.reduce((acc, el) => {
    acc.push(el.seatId)
    return acc;
  }, []);

  const emptySeats = totalSeats
    .filter((e) => !seatsTakenId.includes(e.seat_id))

  return emptySeats
}

function getUnseatedPass(allPassengers) {
  const unseatedPass = allPassengers.filter(passenger => !passenger.seatId)
  return unseatedPass
}

function getPassengersData(passengers) {
  const passengersData = passengers.map((e) => {
    delete e.purchaseDate;
    delete e.seatTypeName;
    delete e.seatColumn;
    delete e.seatRow;
    return e;
  });
  return passengersData
}

exports.getFlightById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [allSeats] = await Flight.findAllSeats();
    const [flight] = await Flight.findFlightById(id);
    const [allPassengers] = await Flight.findPassengersWhitSeat(id);

    if (!flight[0]) {
      throw new Error("Flight doesn't exist");
    }

    const currentFlight = JSON.parse(JSON.stringify(flight))[0];
    const currentPassengers = JSON.parse(JSON.stringify(allPassengers));

    //Obteniendo los asientos disponibles
    const emptySeats = getEmptySeats(allSeats, currentFlight, allPassengers)
    //Obteniendo los pasajeros sin asiento
    const unseatedPass = getUnseatedPass(allPassengers)

    //Passajeros con el mismo boleto de compra
    const partners = unseatedPass.reduce((acc,el,index,arr) => {
      const samePurchaseId = arr.filter(e => e.purchaseId == el.purchaseId)
      return {
        ...acc,
        [el.purchaseId]: samePurchaseId
      }
    }, {})

    //Retornar Data
    const passengersData = getPassengersData(currentPassengers)
    currentFlight.passengers = passengersData;

    return res.status(200).json({ code: 200, data: partners });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
