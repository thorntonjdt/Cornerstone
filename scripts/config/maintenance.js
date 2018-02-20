var Lease = require('../models/lease.js');
var Transaction = require('../models/transaction.js');

var maintenance = {
  updateVacancies: async () => {
    let date = Date.now();

    await Lease.update({ends: { $lt: date}, inactive: false}, {inactive: true})

    let transactions = await Transaction.find({ends: { $lt: date}, balance: null});

    await Promise.all(transactions.map(transaction => {
      transaction.balance += transaction.amount;
      transaction.save();
    }))
  }
}

module.exports = maintenance;
