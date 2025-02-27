const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware('customer'), ticketController.createTicket);
router.get('/', authMiddleware, ticketController.getTickets);
router.put('/:id', authMiddleware, roleMiddleware('customer'), ticketController.updateTicket);
router.delete('/:id', authMiddleware, roleMiddleware('customer'), ticketController.deleteTicket);

module.exports = router;
