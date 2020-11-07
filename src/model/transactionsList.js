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
         return month <= 12;
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

const TransactionsList = mongoose.model("Transactions-List", transactionsListSchema);

module.exports = TransactionsList;
