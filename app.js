
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const stockRoutes = require("./routes/stockRoutes");

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "https://rpgstockanalysis.netlify.app"
];

const corsOptions = {
  origin: allowedOrigins,
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400000, // 1 day
};

app.use(cors(corsOptions));

app.use("/api", stockRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
