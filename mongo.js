const mongoose = require("mongoose");

// console.log(process.argv)
const v = process.argv;
const password = v[2];
const url = `mongodb+srv://chryrgm:${password}@cluster0.x3docjg.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const entrySchema = new mongoose.Schema({
  name: String,
  number: Number,
});
const Entry = mongoose.model("Entry", entrySchema);

if (v.length === 3) {
  console.log("phonebook:");
  Entry.find({}).then((entries) => {
    entries.forEach((entry) => {
      console.log(`${entry.name} ${entry.number}`);
    });
    mongoose.connection.close();
  });
} else if (v.length === 5) {
  const entry = new Entry({
    name: v[3],
    number: v[4],
  });

  entry.save().then((result) => {
    console.log(`added ${v[3]} number ${v[4]} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("(to view phone book entries)--> node mongo.js yourpassword ");
  console.log(
    "(to add new entry)--> node mongo.js yourpassword Anna 040-1234556"
  );
  process.exit(1);
}
