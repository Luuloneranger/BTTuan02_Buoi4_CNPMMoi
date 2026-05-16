require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoute");
const apartmentRoutes = require("./routes/apartmentRoute");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/apartments", apartmentRoutes);

const PORT = process.env.PORT || 8089;
app.listen(PORT, () => {
  console.log(`[0] Backend Nodejs App listening on port ${PORT}`);
});
