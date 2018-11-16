const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var NoteSchema = new Schema({
    title: {
      type: String,
      trim: true,
      required: "Title is Required"
    },
    message: {
      type: String,
      trim: true,
      required: "Message is Required"
    },
    recipient: [
        {
            type:Schema.Types.ObjectId,
            ref: "user"
        },
        {
            type:Schema.Types.Username,
            ref:"user"
        }
    ],
    sender: [
      {
        type: Schema.Types.ObjectId,
        ref: "user"
      },
      {
        type:Schema.Types.Username,
        ref:"user"
      }
      
    ]
  });

const Notes = mongoose.model("Notes", NoteSchema);

module.exports = Notes;