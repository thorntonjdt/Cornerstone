var Lease = require('../models/lease');
var Transaction = require('../models/transaction');

module.exports = {
  nightly: async () => {
    let date = Date.now();

    //Deactive leases that have ended
    await Lease.update({ends: { $lt: date}, inactive: false}, {inactive: true})

    //Look for all transactions that are due but have no balance then update both lease and transaction balance
    let transactions = await Transaction.find({ends: { $lt: date}, balance: null}).lean();
    await Promise.all(transactions.map(transaction => {
      Lease.update({_id: transaction.lease}, {$inc: {balance: transaction.amount}});
      transaction.balance += transaction.amount;
      transaction.save();
    }))
  },
  monthly: async () => {
    //Get the first of next month
    let date = Date.now(), m = date.getMonth(), y = date.getFullYear();
    if(m == 11){
      var dueDate = new Date(y + 1, 0, 1);
    } else {
      var dueDate = new Date(y, m + 1, 1);
    }

    //Add next rent transaction to active leases
    let leases = Lease.find({active: true}).lean();
    await Promise.all(leases.map(lease => {
      let nextRentTransaction = new Transaction({
        date: dueDate,
        amount: lease.rent,
        description: "Rent",
        lease: lease._id
      })
      nextRentTransaction.save();
      lease.transactions.push(nextRentTransaction);
      lease.save();
    }))
  }
}
