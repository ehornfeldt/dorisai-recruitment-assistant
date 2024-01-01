var express = require('express');
const cors = require('cors');
const runAi = require('./gpt.js');
var app = express();

app.use(cors());
app.use(express.json());

// Handle POST request to create a new answer
app.post('/api/submit', async (req, res) => {
  try {
    const formData = req.body;
    // Call runAi and wait for answer
    const answer = await runAi(formData.message);
    // Send answer back to client
    res.json({ message: answer });
  } catch (error) {
    console.error('Ett fel uppstod:', error);
    res.status(500).json({ error: 'Something went wrong' }); //Bad error message! 
  }
});

//Listen to port 3000
app.listen(3000, function () {
  console.log('Server lyssnar på port 3000!');
});

