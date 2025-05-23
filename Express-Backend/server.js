
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5173;

// ---------------- connect mongo -------------------
const DB = process.env.MONGOOSE_CON.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
    .then(() => console.log("GV MongoDB (Mongoose) connection successful!"))
    .catch(err => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
