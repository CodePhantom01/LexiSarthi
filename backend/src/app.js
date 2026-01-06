const express = require("express");
const cors = require("cors");
const wordRoutes = require("./routes/wordRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://lexi-sarthi.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/words", wordRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("LexiSarthi API is running");
});

module.exports = app;
