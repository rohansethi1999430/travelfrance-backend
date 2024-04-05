const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;
 
app.use(cors());
app.use(express.json());

try{

    mongoose.connect('mongodb+srv://rohansethi1999430:xuzbR8CV1xCaCLWa@cluster0.6nmf0ry.mongodb.net/FranceTourism', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected Yaay");
}
catch{}
 


//mongoose.connect('mongodb://localhost:27017/FranceTourism', { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
    description: String,
    found: Boolean,
    id: Number,
    imageUri: String,
    userId: Number,
  });
const dataSchema = new mongoose.Schema({ image: String });
const DataModel = mongoose.model('scavengerhunts', itemSchema);
app.use(express.json());
 
app.post('/saveDataImage', async (req, res) => {
  try {
      const { updatedClues, user } = req.body;
      console.log("Received data for user", user, "with clues:", updatedClues);
 
      if (Array.isArray(updatedClues)) {
          for (const clue of updatedClues) {
              const filter = { description: clue.description, userId: user };
              const update = { ...clue, userId: user };
 
              // The upsert option creates a new document if one doesn't exist
              const options = { new: true, upsert: true, setDefaultsOnInsert: true };
 
              // Update the document, or insert if it doesn't exist
              const updatedData = await DataModel.findOneAndUpdate(filter, update, options);
              console.log("Updated or created newData for user", user, ":", updatedData);
          }
          res.status(201).json({ message: 'Data saved or updated successfully' });
      } else {
          throw new Error('Updated clues provided are not an array');
      }
  } catch (error) {
      console.error("Error saving or updating data:", error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});
 
app.get('/getGameData/user1', async (req, res) => {
  try {
    // Example: Find the game state for user1. Adjust according to your database schema.
    const gameData = await DataModel.find({ userId: 1 });
    console.log(gameData);
    res.json({ updatedClues: gameData });
  } catch (error) {
    console.error("Error fetching game data for user1:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
 
  app.get('/getImageData', async (req, res) => {
    try {
      const data = await DataModel.find();
      score=0;
      for (const value of data) {
        if(value.get("image")!=null){
            score += 1;
        }
      }
      const response = {
        score: score,
        data: data
      };
      
      res.json(response); // Send the data as a JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});