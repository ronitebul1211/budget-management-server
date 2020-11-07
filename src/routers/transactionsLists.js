const express = require("express");
const TransactionsList = require("../models/transactionsList");

const router = new express.Router();

/** GET transactions list by month, year
 * (404) - List of transactions for the month and year does not exist
 * (500) - other errors
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

module.exports = router;
