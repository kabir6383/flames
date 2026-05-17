require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Result = require('./models/Result');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flames_game';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// FLAMES Logic Function
const calculateFLAMES = (n1, n2) => {
  let name1 = n1.toLowerCase().replace(/\s/g, '').split('');
  let name2 = n2.toLowerCase().replace(/\s/g, '').split('');

  name1.forEach((char, index) => {
    let foundIndex = name2.indexOf(char);
    if (foundIndex !== -1) {
      name1[index] = null;
      name2[foundIndex] = null;
    }
  });

  const count = [...name1, ...name2].filter(c => c !== null).length;
  if (count === 0) return 'S'; // Default if names are same or empty

  let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
  let pos = 0;

  while (flames.length > 1) {
    pos = (pos + count - 1) % flames.length;
    flames.splice(pos, 1);
  }

  return flames[0];
};

const getFlamesMeaning = (letter) => {
  const meanings = {
    'F': 'Friends',
    'L': 'Love',
    'A': 'Affection',
    'M': 'Marriage',
    'E': 'Enemy',
    'S': 'Sister'
  };
  return meanings[letter] || 'Unknown';
};

// API Routes
app.post('/api/calculate', async (req, res) => {
  try {
    const { name1, name2 } = req.body;
    if (!name1 || !name2) {
      return res.status(400).json({ error: 'Both names are required' });
    }

    const resultChar = calculateFLAMES(name1, name2);
    const meaning = getFlamesMeaning(resultChar);

    const newResult = new Result({
      name1,
      name2,
      flamesResult: meaning
    });

    await newResult.save();

    res.json({
      name1,
      name2,
      result: resultChar,
      meaning: meaning
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const history = await Result.find().sort({ calculationDate: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
