const express = require("express");
const TransactionsList = require("../models/transactionsList");

const router = new express.Router();

//TODO: query params to response with month status & month debit split by categories

/** GET: transactions list by month, year.
 * RESPONSE: transactions list
 * (404) - List does not exist
 * (500) - errors + message
 */
router.get("/api/transactions-lists/:year/:month", async (req, res) => {
   try {
      const { month, year } = req.params;
      const transactionsList = await TransactionsList.findOne({ month, year });
      if (!transactionsList) {
         return res.status(404).send();
      }
      res.send(transactionsList);
   } catch (err) {
      res.status(500).send(err.message);
   }
});

/** POST: transaction in the appropriate list by month and year.
 * RESPONSE: updated transactions list
 * (500) - errors + message
 */
router.post("/api/transactions-lists/:year/:month", async (req, res) => {
   try {
      let transactionsList;
      const { month, year } = req.params;

      transactionsList = await TransactionsList.findOne({ month, year });
      if (!transactionsList) {
         transactionsList = new TransactionsList({ month, year });
      }
      transactionsList.data.push({ ...req.body });
      await transactionsList.save();
      res.send(transactionsList);
   } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
   }
});

module.exports = router;
