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

// Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'https://cf-plum-omega.vercel.app',
  'https://carbon-footprint-ieee-7dr70vezu-prachi-goyals-projects.vercel.app',
  'https://carbon-footprint-ieee.vercel.app' // In case URL changes
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel domains
    if (origin.includes('.vercel.app') || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
};

app.use(cors(corsOptions));

// Additional preflight handling for complex requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});


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
