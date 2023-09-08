const mongoose = require("mongoose");
mongoose.set("strictQuery", false);


console.log("Starting to establish connection to MongoDB");
// console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });



const entrySchema = new mongoose.Schema({
    name: {
      type:String,
      minLength:3,
      required: true,
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {

          return /\d{2}-\d{8}/.test(value);
        },
        message: (props) => `${props.value} is not a valid phone number. Format: 09-12345678`,
      },
      required: [true, 'User phone number required']
    },
  });

  entrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  const Entry = mongoose.model("Entry", entrySchema);

  module.exports = Entry;