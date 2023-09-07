const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
// Hardcoded phonebook entries
let phonebookEntries = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
const generateId = () => {
    const maxId = phonebookEntries.length > 0
    ? Math.max(...phonebookEntries.map(n => n.id)) 
    : 0
    return maxId + 1
  }
app.use(express.json())
morgan.token('req-body', (req) => JSON.stringify(req.body));
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :req-body')
  );
  
 
//* Endpoint to get phonebook entries
app.get(`/api/persons`, (req, res) => {
  res.json(phonebookEntries);
});
//* Endpoint to get total phonebok entries and current time 
app.get(`/info`, (req, res) => {
  // Get the current time
  const currentTime = new Date();
  // Calculate the number of phonebook entries (replace this with your actual data)
  const numberOfEntries = phonebookEntries.length;
  // Create a response message
  const infoMessage = `
      <p>Phonebook has info for ${numberOfEntries} people</p>
      <p>${currentTime}</p>
    `;
  // Send the response with HTML content
  res.send(infoMessage);
});
//* Endpoint to get phonebook entry with id
app.get(`/api/persons/:id`,  (req, res) => {
    const id = Number(req.params.id);
    // console.log(id);
  //searching for a entry in phonebook
  const entry =  phonebookEntries.find(e => {
    // console.log(e.id, typeof e.id, id, typeof id, e.id === id)
    return e.id === id
});
//   console.log(entry)
  if (!entry) {
    // If entry is not found, respond with a 404 Not Found status code
    return res.status(404).json({ error: "Entry not found" });
  }
 // If entry is found, respond with the entry data
  res.json(entry);
});
//* endpoint to delete particular entry with id 
app.delete(`/api/persons/:id`, (req,res)=>{
    const id = Number(req.params.id);
    phonebookEntries =  phonebookEntries.filter( e => e.id !== id);
    res.status(204).end();
    console.log(phonebookEntries.filter(e => e.id !== id))
})
app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!(body.name && body.number)) {
        return response.status(400).json({ 
          error: 'name or number missing' 
        })
      }
      if (phonebookEntries.some((entry) => entry.name === body.name)) {
        return res.status(400).json({ error: 'Name must be unique' });
      }
    const entry ={
        name:body.name,
        number:body.number,
        id:generateId(),
    }
    
    phonebookEntries = phonebookEntries.concat(entry);
    console.log(entry)

    res.json(entry)
  })
// Start the server
const PORT = process.env.PORT || 3001 || 84843
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
