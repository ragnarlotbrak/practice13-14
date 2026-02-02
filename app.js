const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/items", require("./routes/items.routes"));

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

module.exports = app;