const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const appointmentRoutes = require('./routes/appointmentRoutes');  // Import the appointment routes

app.use(cors());
app.use(express.json());

app.use('/api', appointmentRoutes);  // Use the routes

// MongoDB connection
mongoose.connect('your-mongo-db-connection-string')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error: ', err));

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
