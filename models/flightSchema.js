const db = require("../config/db");

class Flight {
  static findSeats(id) {
    let sql = `
    SELECT * 
    FROM airline.seat 
    `;

    return db.execute(sql);
  }

  static findFlightById(id) {
    let sql = `
    SELECT 
      flight_id AS flightId,
      takeoff_date_time AS takeoffDateTime,     
      takeoff_airport AS takeoffAirport,     
      landing_date_time AS landingDateTime,     
      landing_airport AS landingAirport,     
      airplane_id AS airplaneId 
    FROM airline.flight  
      WHERE flight_id = ${id}
    LIMIT 1`;

    return db.execute(sql);
  }

  static findPassengersWhitSeat(id) {
    let sql = `
    SELECT   
      p.passenger_id AS passengerId,    
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
    LIMIT 0, 200`;

    return db.execute(sql);
  }

  static findPassengersNoSeat(id) {
    let sql = `
    SELECT      
      p.passenger_id AS passengerId,     
      p.dni,     
      p.name,     
      p.age,     
      p.country,     
      bp.boarding_pass_id AS boardingPassId,     
      pur.purchase_id AS purchaseId,     
      pur.purchase_date AS purchaseDate,     
      st.seat_type_id AS seatTypeId,     
      st.name AS seatTypeName,     
      NULL AS seatId,     
      NULL AS seatColumn,     
      NULL AS seatRow 
    FROM boarding_pass bp 
    INNER JOIN passenger p ON bp.passenger_id = p.passenger_id  
    INNER JOIN purchase pur ON bp.purchase_id = pur.purchase_id 
    INNER JOIN seat_type st ON bp.seat_type_id = st.seat_type_id 
    INNER JOIN flight f ON bp.flight_id = f.flight_id 
    INNER JOIN airplane a ON f.airplane_id = a.airplane_id 
      WHERE bp.flight_id=${id}   
        AND bp.seat_id IS NULL 
    ORDER BY bp.passenger_id 
    LIMIT 0, 200
    `;

    return db.execute(sql);
  }
}

module.exports = Flight;
