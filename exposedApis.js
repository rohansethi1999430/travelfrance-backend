const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');

// Allow all origins during development (customize as needed for production)
app.use(cors());

// ... (rest of your code)

// Connect to MongoDB
mongoose.connect('mongodb+srv://rohansethi1999430:xuzbR8CV1xCaCLWa@cluster0.6nmf0ry.mongodb.net/FranceTourism', { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb://localhost:27017/FranceTourism', { useNewUrlParser: true, useUnifiedTopology: true });

// Set up a basic schema for your data
const dataSchema = new mongoose.Schema({
  data: []
});

const DataModel = mongoose.model('wishlist', dataSchema);

// Middleware to parse JSON requests
app.use(express.json());

// Route to save data to MongoDB
app.post('/saveData', async (req, res) => {
  try {
    const data = req.body;
    console.log(data );
    const newData = new DataModel(data);
    await newData.save();
    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to render data
app.get('/getData', async (req, res) => {
    try {
      const data = await DataModel.find();
      res.json(data); // Send the data as a JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
