const express = require("express");
require("./db/mongoose"); //RUN

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/api/transactions-lists/:year/:month", (req, res) => {
   const { year, month } = req.params;
   res.send({ year, month });
});

app.listen(port, () => {
   console.log(`Server up on port ${port}`);
});
