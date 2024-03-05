const express = require("express");
const flightController = require("../controllers/flightControllers");
const router = express.Router();

//router.route("/").get()
router.route("/:id/passengers").get(flightController.getFlightById);

module.exports = router;
