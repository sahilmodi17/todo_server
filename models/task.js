const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  createdId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, " please provide user "],
  },
  tasks:  [ 
    
  ],
});

module.exports = mongoose.model('Tasks', taskSchema);
