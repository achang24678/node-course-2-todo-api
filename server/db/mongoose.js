var mongoose = require('mongoose');

// connect to mongodb database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}, (err) => {     //useNewUrlParser: deprecation warning, so we added in
  if(err){
    console.log('not connected to db');
  }
  else{
    console.log('Sucessfully connected to db');
  }
});
mongoose.set('useCreateIndex', true);     //needed for prventing deprecation error: deprecation warning collection.ensureIndex is deprecated

module.exports = {mongoose};
