const Ticket = require('../models/Ticket');
const nodemailer = require('nodemailer');
const sendBookingConfirmation = require('../utils/mailer');

// Create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const { dateOfTravel, modeOfTravel, perHeadPrice, from, to, numberOfPassengers } = req.body;
    const ticket = new Ticket({
      userId: req.user.userId,
      dateOfTravel,
      modeOfTravel,
      perHeadPrice,
      from,
      to,
      numberOfPassengers
    });
    await ticket.save();

    // Send email
    await sendBookingConfirmation(req.user.email, 'Ticket Booked', `Your ticket from ${from} to ${to} has been booked.`);

    res.status(201).json({ ticket });
  } catch (err) {
    res.status(500).json({ message: `Error creating ticket. ${err}`, error: err });
  }
};

// Get all tickets for the authenticated user
exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.userId });
    res.status(200).json({ tickets });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tickets.' });
  }
};

// Update an existing ticket (for customers only, except within 24 hours of travel)
exports.updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { dateOfTravel, modeOfTravel, perHeadPrice, from, to, numberOfPassengers } = req.body;
    
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Check if the user is allowed to update the ticket
    if (ticket.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only update your own tickets.' });
    }

    // Check if the ticket is within 24 hours of travel
    const hoursLeft = (new Date(ticket.dateOfTravel) - new Date()) / (1000 * 60 * 60);
    if (hoursLeft < 24) {
      return res.status(400).json({ message: 'You cannot update a ticket within 24 hours of travel.' });
    }

    // Update ticket details
    ticket.dateOfTravel = dateOfTravel || ticket.dateOfTravel;
    ticket.modeOfTravel = modeOfTravel || ticket.modeOfTravel;
    ticket.perHeadPrice = perHeadPrice || ticket.perHeadPrice;
    ticket.from = from || ticket.from;
    ticket.to = to || ticket.to;
    ticket.numberOfPassengers = numberOfPassengers || ticket.numberOfPassengers;

    // Recalculate totalPrice
    ticket.totalPrice = ticket.perHeadPrice * ticket.numberOfPassengers;
    
    await ticket.save();

    res.status(200).json({ ticket });
  } catch (err) {
    res.status(500).json({ message: 'Error updating ticket.' });
  }
};

// Delete an existing ticket (for customers only, except within 24 hours of travel)
exports.deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Check if the user is allowed to delete the ticket
    if (ticket.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own tickets.' });
    }

    // Check if the ticket is within 24 hours of travel
    const hoursLeft = (new Date(ticket.dateOfTravel) - new Date()) / (1000 * 60 * 60);
    if (hoursLeft < 24) {
      return res.status(400).json({ message: 'You cannot delete a ticket within 24 hours of travel.' });
    }

    await ticket.remove();

    res.status(200).json({ message: 'Ticket deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting ticket.' });
  }
};
