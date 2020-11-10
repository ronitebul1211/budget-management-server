const mongoose = require("mongoose");

//TODO: add owner

const transactionSchema = mongoose.Schema({
   description: {
      type: String,
      required: true,
      trim: true,
   },
   type: {
      type: String,
      required: true,
      trim: true,
   },
   totalPayment: {
      type: Number,
      required: true,
   },
   paymentMethod: {
      type: String,
      required: true,
      trim: true,
   },
   date: {
      type: String,
      required: true,
      trim: true,
   },
   category: {
      type: String,
      required: true,
      trim: true,
   },
});

const transactionsListSchema = mongoose.Schema({
   month: {
      type: Number,
      required: true,
      validate(month) {
         return month <= 12 && month >= 1;
      },
   },
   year: {
      type: Number,
      required: true,
      validate(year) {
         return year >= 2020;
      },
   },
   data: [transactionSchema],
});

/**
 * @returns month status object contains data of credit, debit, and balance of current transactions list
 */
transactionsListSchema.methods.getMonthStatus = async function () {
   const transactionTypeAgg = await TransactionsList.aggregate([
      { $match: { _id: this._id } },
      { $unwind: "$data" },
      {
         $group: {
            _id: "$data.type",
            sum: { $sum: "$data.totalPayment" },
         },
      },
   ]);

   const creditAgg = transactionTypeAgg.find((agg) => agg._id === "זכות");
   const debitAgg = transactionTypeAgg.find((agg) => agg._id === "חובה");

   const monthStatus = {
      credit: !creditAgg ? 0 : creditAgg.sum,
      debit: !debitAgg ? 0 : debitAgg.sum,
   };
   monthStatus.balance = monthStatus.credit - monthStatus.debit;
   return monthStatus;
};

const TransactionsList = mongoose.model("Transactions-List", transactionsListSchema);

module.exports = TransactionsList;
