var Transaction = require('../models/transaction');
var Lease = require('../models/lease');

module.exports = {
  managerCreate: async (req, res) => {
    if(req.body.amount && req.body.description && req.body.date){
      var newTransaction = new Transaction({
        amount: req.body.amount,
        description: req.body.description,
        date: req.body.date,
        lease: req.params.id
      })

      var transactionDate = new Date(req.body.date);
      transactionDate.setHours(0,0,0,0);
      //If transaction is dated before today then update lease balance
      var shouldAddToBalance = transactionDate <= Date.now();
      if(shouldAddToBalance){
        var update = {$inc: {balance: newTransaction.amount}, $push: {transactions: newTransaction._id}}
      } else {
        var update = {$push: {transactions: newTransaction._id}}
      }
      var lease = await Lease.findByIdAndUpdate(req.params.id, update)

      //and record new balance in transaction
      if(shouldAddToBalance){
        newTransaction.balance = lease.balance + newTransaction.amount;
      }
      await newTransaction.save();

      res.send({"response": req.params.id});
    } else {
      res.send({"error": "Invalid"})
    }

  },

  tenantCreate: async (req, res) => {
    if(req.body.amount && req.body.description){
      var newTransaction = new Transaction({
        amount: req.body.amount,
        description: req.body.description,
        date: Date.now()
      })

      var lease = await Lease.findByIdAndUpdate(req.params.id, {$inc: {balance: newTransaction.amount}, $push: {transactions: newTransaction._id}}).lean();

      //Record new balance in new transaction
      newTransaction.balance = lease.balance + newTransaction.amount;

      await newTransaction.save();

      res.send({"response": "Success"});
    } else {
      res.send({"error": "Invalid"})
    }
  }
}
