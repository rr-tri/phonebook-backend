require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Entry = require("./models/entrySchema");
const { errorHandler, unknownEndpoint } = require("./utils/middleware");

app.use(cors());
app.use(express.static("build"));

// Hardcoded phonebook entries
// let phonebookEntries = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];
// const generateId = () => {
//     const maxId = phonebookEntries.length > 0
//     ? Math.max(...phonebookEntries.map(n => n.id))
//     : 0
//     return maxId + 1
//   }
app.use(express.json());
morgan.token("req-body", (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

//* Endpoint to get phonebook entries
app.get(`/api/persons`, async (req, res, next) => {
  try {
    const entries = await Entry.find({});
    if (!entries) {
      res.status(404).end();
    }
    res.json(entries);
  } catch (err) {
    next(err);
  }
});
//* Endpoint to get total phonebok entries and current time
app.get(`/info`, async (req, res, next) => {
  try {
    // Get the current time
    const currentTime = new Date();
    // Calculate the number of phonebook entries (replace this with your actual data)
    const entries = await Entry.find({});
    // console.log(entries)
    const numberOfEntries = entries.length;
    // Create a response message
    const infoMessage = `
      <p>Phonebook has info for ${numberOfEntries} people</p>
      <p>${currentTime}</p>
    `;
    // Send the response with HTML content
    res.send(infoMessage);
  } catch (err) {
    next(err);
  }
});
//* Endpoint to get phonebook entry with id
app.get(`/api/persons/:id`, async (req, res, next) => {
  try {
    const id = req.params.id;
    const entry = await Entry.findById(id);
    console.log("entry with id request", entry.body);
    if (!entry) {
      // If entry is not found, respond with a 404 Not Found status code
      return res.status(404).json({ error: "Entry not found" });
    }
    // If entry is found, respond with the entry data
    res.json(entry);
  } catch (err) {
    next(err);
  }
});
//* end point to update number
app.put("/api/persons/:id", async (req, res, next) => {
  try {
    const body = req.body;

    const entry = {
      name: body.name,
      number: body.number,
    };

    const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, entry, {
      new: true,runValidators: true, context: 'query'
    });
    res.status(200).json(updatedEntry);
  } catch (error) {
    next(error);
  }
});
//* endpoint to delete particular entry with id
app.delete(`/api/persons/:id`, async (req, res, next) => {
  // phonebookEntries = phonebookEntries.filter((e) => e.id !== id);
  // res.status(204).end();
  // console.log(phonebookEntries.filter((e) => e.id !== id));
  try {
    await Entry.findByIdAndRemove(req.params.id);
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});
app.post("/api/persons", async (req, res, next) => {
  try {
    const body = req.body;
    if (!(body.name && body.number)) {
      return response.status(400).json({
        error: "name or number must not be missing",
      });
    }
    const nameCheck = await Entry.find({}).then((entries) => {
      entries.some((entry) => entry.name === body.name);
    });
    if (nameCheck) {
      return res.status(400).json({ error: "Name must be unique" });
    }
    const entry = new Entry({
      name: body.name,
      number: body.number,
    });
    const result = await entry.save();
    res.json(result);
  } catch (err) {
    next(err);
  }
});
app.use(unknownEndpoint);
app.use(errorHandler);
// Start the server
const PORT = process.env.PORT || 3001 || 84843;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
