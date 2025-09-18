const express = require("express");//Node.js framework for building web servers/APIs
const cors = require("cors"); //middleware to allow cross-origin requests
const app = express();

const monitorRouter = require("./routes/Monitoring");
const { monitorMatrices } = require("./controllers/Monitoring");

const UserRouter = require("./routes/UserRoutes");
const ActivityRouter = require("./routes/ActivityRoutes");

const dotenv = require("dotenv");

const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");

const options = {
  transports: [
    new LokiTransport({
      host: "http://127.0.0.1:3100",
    }),
  ],
};
const logger = createLogger(options);
app.use(express.json());
app.use(cors());

const dbconnection = require("./config/DB_Con");
dbconnection();

dotenv.config();

app.use("/activity", ActivityRouter);
app.use("/user", UserRouter);
app.use("/monitor", monitorRouter);
app.get("/metrics", monitorMatrices);
app.get("/", (req, res) => {
  res.send("carbon footprint nodejs");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("App Stated at", PORT);
});
