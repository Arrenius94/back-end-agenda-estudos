require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/router");
const cors = require("cors");

const app = express();

// CORS configuration: allow specific frontend URL(s) via FRONTEND_URL env var
// FRONTEND_URL can be a single origin or a comma-separated list. If not set, allow all origins.
const frontendEnv = process.env.FRONTEND_URL || "*";
const allowedOrigins =
  frontendEnv === "*" ? ["*"] : frontendEnv.split(",").map((s) => s.trim());

const corsOptions = {
  origin: function (origin, callback) {
    // allow non-browser requests (e.g., Postman) when origin is undefined
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.indexOf("*") !== -1 ||
      allowedOrigins.indexOf(origin) !== -1
    ) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
