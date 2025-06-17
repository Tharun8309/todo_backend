require('dotenv').config();

// External Modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Local Modules
const errorController = require("./controllers/errorController");
const itemsRouter = require('./routers/itemsRouter');
const authRoutes = require('./routers/authRoutes');

const MONGO_DB_URL = process.env.MONGO_DB_URL;
 // fixed typo: was "SECRECT"
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
// 
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
 origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Session Store Setup (fixes below)


// ✅ Session Middleware


// Routes
app.use(authRoutes);
app.use(itemsRouter);
app.use(errorController.get404);

// DB and Server
mongoose.connect(MONGO_DB_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port : ${PORT}`);
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));
