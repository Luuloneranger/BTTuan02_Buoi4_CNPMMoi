require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const contract = require("./routes/contractRoute");
const authRoutes = require("./routes/authRoute");
const apartmentRoutes = require("./routes/apartmentRoute");
const cartRoute = require("./routes/cartRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/contracts", contract);
app.use("/api/cart", cartRoute);
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/apartments", apartmentRoutes);

const PORT = process.env.PORT || 8089;
app.listen(PORT, () => {
  console.log(`[0] Backend Nodejs App listening on port ${PORT}`);
});
