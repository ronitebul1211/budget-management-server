const express = require("express");
const cors = require("cors");
require("./db/mongoose"); //RUN
const transactionsListsRouter = require("./routers/transactionsLists");

const app = express();
const port = process.env.PORT;
app.use(cors());

app.use(express.json());
app.use(transactionsListsRouter);

app.listen(port, () => {
   console.log(`Server up on port ${port}`);
});
