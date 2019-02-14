var mongoose = require('mongoose');



//creating model, specifiying the attributes we want todo's to have
var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,   //validator
    minlength: 1,    //validator
    trim: true      //remove any leading and trailing spaces
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt:{
    type: Number,
    default: null
  }
});


module.exports = {Todo};
