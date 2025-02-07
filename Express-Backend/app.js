const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();

//--- parsing middlewares ---
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());

app.use(cors());

const authRouter = require("./routes/auth.router");
const usersRouter = require("./routes/users.router");
const gamesRouter = require("./routes/games.router");
const storeRouter = require("./routes/store.router");

//--- defining endpoints ---
app.use("/api/v1/auth", authRouter);
//app.use("/api/v1/users", usersRouter);
app.use("/api/v1/games", gamesRouter);
app.use("/api/v1/store", storeRouter);

app.get('/', (req, res) => {
    res.send('Server Running')
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
