const express = require('express');
const app = express();
app.use(express.json());
const notes = [];

app.get('/api/notes', (req, res) => res.json(notes));
app.post('/api/notes', (req, res) => {
  notes.push(req.body);
  res.status(201).json(req.body);
});

app.listen(3001, () => console.log('Server running on port 3001'));