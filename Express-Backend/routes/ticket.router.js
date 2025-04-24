const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticket.controller");
const { protect, restrictTo } = require('../controllers/auth.controller');

router.post("/create", protect, restrictTo("user"), ticketController.createTicket);
router.get("/all", protect, restrictTo("admin"), ticketController.getAllTickets);
router.get("/my", protect, restrictTo("user"), ticketController.getUserTickets);
router.post("/:ticketId/reply", protect, ticketController.replyToTicket);
router.patch("/:ticketId/close", protect, ticketController.closeTicket);

module.exports = router;
