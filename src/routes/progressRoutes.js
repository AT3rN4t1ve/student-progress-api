const express = require("express");
const router = express.Router();
const { updateProgressById } = require("../controllers/progressController");

router.patch("/:progressId", updateProgressById);

module.exports = router;
