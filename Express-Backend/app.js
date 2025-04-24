// app.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorController = require("./controllers/error.controller");

const authRouter = require("./routes/auth.router");
const usersRouter = require("./routes/users.router");
const gamesRouter = require("./routes/games.router");
const storeRouter = require("./routes/store.router");
const wishlistRouter = require("./routes/wishlist.router");
const emailRouter = require("./routes/email.router");
const orderRouter = require("./routes/order.router");
const inventoryRoutes = require('./routes/inventory.router');
const ticketRouter = require("./routes/ticket.router");
const promoRouter = require("./routes/promo.router");

const app = express();

//------------------- middleware -----------------------
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://16.170.239.27:3000" 
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  


//------------------- custom middleware -----------------------
app.use((req, res, next) => {
    console.log("App Running in -->", process.env.NODE_ENV);
    req.requestTime = new Date().toISOString();
    next();
});

//------------------- routes -----------------------
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/games", gamesRouter);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/wishlist", wishlistRouter)
app.use("/api/v1/mail", emailRouter)
app.use("/api/v1/order", orderRouter);
app.use('/api/v1/inventory', inventoryRoutes);
app.use("/api/v1/ticket", ticketRouter);
app.use("/api/v1/promo", promoRouter);

app.get("/", (req, res) => {
    res.send("Server Running");
});

//------------------- unhandled routes  -----------------------
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//------------------- error handling middleware  -----------------------
app.use(globalErrorController);

module.exports = app;
