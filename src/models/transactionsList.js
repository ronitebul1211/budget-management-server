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

   const creditAgg = transactionTypeAgg.find((agg) => agg._id === "credit");
   const debitAgg = transactionTypeAgg.find((agg) => agg._id === "debit");
   const monthStatus = {
      credit: creditAgg ? creditAgg.sum : 0,
      debit: debitAgg ? debitAgg.sum : 0,
   };
   monthStatus.balance = monthStatus.credit - monthStatus.debit;
   return monthStatus;
};

/**
 * @returns add the functionality to get debit distribution splitted by categories of current transactions list
 */
transactionsListSchema.methods.getDebitDistribution = async function () {
   const debitDistributionAgg = await TransactionsList.aggregate([
      { $match: { _id: this._id } },
      { $unwind: "$data" },
      { $match: { "data.type": "debit" } },
      {
         $group: {
            _id: "$data.category",
            sum: { $sum: "$data.totalPayment" },
         },
      },
   ]);

   const debitDistribution = {};

   debitDistributionAgg.forEach((categoryAgg) => {
      debitDistribution[categoryAgg._id] = categoryAgg.sum;
   });

   return debitDistribution;
};

const TransactionsList = mongoose.model("Transactions-List", transactionsListSchema);

module.exports = TransactionsList;
