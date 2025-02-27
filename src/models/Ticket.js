const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateOfTravel: Date,
  modeOfTravel: { type: String, enum: ['rail', 'bus'] },
  perHeadPrice: Number,
  from: String,
  to: String,
  numberOfPassengers: Number,
  totalPrice: { type: Number, default: function() { return this.perHeadPrice * this.numberOfPassengers; } }
});

module.exports = mongoose.model('Ticket', ticketSchema);
