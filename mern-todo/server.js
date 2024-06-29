const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://mongo:27017/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

const TodoSchema = new mongoose.Schema({
  text: String,
  complete: Boolean
});

const Todo = mongoose.model('Todo', TodoSchema);

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/todo', async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      complete: false
    });
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error('Error creating todo', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/todo/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    todo.complete = !todo.complete;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error('Error updating todo', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/todo/:id', async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ result });
  } catch (err) {
    console.error('Error deleting todo', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
