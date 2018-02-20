var Transaction = require('../models/transaction.js');
var Lease = require('../models/lease.js');

module.exports = {
  managerCreate: async (req, res) => {

    var newTransaction = new Transaction({
      amount: req.body.amount,
      description: req.body.description,
      date: req.body.date,
      lease: req.params.id
    })

    var shouldAddToBalance = req.body.date < Date.now();

    if(shouldAddToBalance){
      var update = {$inc: {balance: newTransaction.amount}, $push: {transactions: newTransaction._id}}
    } else {
      var update = {$push: {transactions: newTransaction._id}}
    }

    var lease = await Lease.findByIdAndUpdate(req.params.id, update)

    if(shouldAddToBalance){
      newTransaction.balance = lease.balance + newTransaction.amount;
    }

    await newTransaction.save();

    res.send({"response": req.params.id});
  },

  tenantCreate: async (req, res) => {
    var newTransaction = new Transaction({
      amount: req.body.amount,
      description: req.body.description,
      date: Date.now()
    })

    var lease = await Lease.findByIdAndUpdate(req.params.id, {$inc: {balance: newTransaction.amount}, $push: {transactions: newTransaction._id}})

    newTransaction.balance = lease.balance + newTransaction.amount;

    await newTransaction.save();

    res.send({"response": "success"});
  }
}
