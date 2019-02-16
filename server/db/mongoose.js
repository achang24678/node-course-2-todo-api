var mongoose = require('mongoose');

// connect to mongodb database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err) => {
  if(err){
    console.log('not connected to db');
  }
  else{
    console.log('Sucessfully connected to db');
  }
});

module.exports = {mongoose};
