const express = require("express");
const TransactionsList = require("../models/transactionsList");

const router = new express.Router();

//TODO: query params to response with month status & month debit split by categories

/** GET: transactions list by month, year.
 * success: (200) response with transactions list
 * errors:  (404) list does not exist
 *          (500) error + message
 * query params: # metadata: -monthStatus: get month status data with requested transactions list
 */
router.get("/api/transactions-lists/:year/:month", async (req, res) => {
   const { month, year } = req.params;
   try {
      const transactionsList = await TransactionsList.findOne({ month, year });
      if (!transactionsList) {
         return res.status(404).send();
      }

      if (req.query.metadata === "monthStatus") {
         const monthStatus = await transactionsList.getMonthStatus();
         return res.status(200).send({ monthStatus, transactionsList });
      }

      res.status(200).send(transactionsList);
   } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
   }
});

/** POST: transaction in the appropriate list by month, year.
 * request body: description, type, totalPayment, paymentMethod, date, category
 * success: (201) response with updated transactions list
 * errors:  (500) - error + message
 */
router.post("/api/transactions-lists/:year/:month", async (req, res) => {
   const { month, year } = req.params;
   try {
      let transactionsList = await TransactionsList.findOne({ month, year });
      if (!transactionsList) {
         transactionsList = new TransactionsList({ month, year });
      }
      transactionsList.data.push({ ...req.body });
      await transactionsList.save();
      res.status(201).send(transactionsList);
   } catch (err) {
      res.status(500).send(err.message);
   }
});

/** DELETE: transaction in the appropriate list by month, year, transaction id.
 * success: (200) response with updated transactions list
 *          (204) response without content when the removed transaction was the last in the list (transactions list removed)
 * errors:  (500) error + message
 */
router.delete("/api/transactions-lists/:year/:month/:transactionId", async (req, res) => {
   const { month, year, transactionId } = req.params;
   try {
      transactionsList = await TransactionsList.findOne({ month, year });
      if (!transactionsList) {
         return res.status(404).send();
      }
      const transaction = transactionsList.data.id(transactionId);
      if (!transaction) {
         return res.status(404).send();
      }
      transaction.remove();
      if (transactionsList.data.length === 0) {
         await transactionsList.remove();
         return res.status(204).send();
      }
      await transactionsList.save();
      res.status(200).send(transactionsList);
   } catch (err) {
      res.status(500).send(err.message);
   }
});

/** PUT: update transaction in the appropriate list by month, year, transaction id
 * request body: description, type, totalPayment, paymentMethod, date, category
 * success: (200) response with updated transactions list
 *          (404) transactions list / month / year does not exist
 * errors:  (500) error + message
 */
router.put("/api/transactions-lists/:year/:month/:transactionId", async (req, res) => {
   const { month, year, transactionId } = req.params;
   try {
      const updatedTransactionsList = await TransactionsList.findOneAndUpdate(
         { month, year, "data._id": transactionId },
         {
            $set: {
               "data.$.description": req.body.description,
               "data.$.type": req.body.type,
               "data.$.totalPayment": req.body.totalPayment,
               "data.$.paymentMethod": req.body.paymentMethod,
               "data.$.date": req.body.date,
               "data.$.category": req.body.category,
            },
         },
         { new: true, runValidators: true },
      );

      if (!updatedTransactionsList) {
         return res.status(404).send();
      }

      res.status(200).send(updatedTransactionsList);
   } catch (err) {
      res.status(500).send(err.message);
   }
});

module.exports = router;
