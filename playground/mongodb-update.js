// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5c63ad63c07fb4e9879c8e9d')
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false   //we wanna get new item back not original
  }).then((res) => {
    console.log(res);
  });


  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5c6399bbd45923a73028de9d')
  }, {
    $set: {
      name: 'Allen'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false   //we wanna get new item back not original
  }).then((res) => {
    console.log(res);
  });


  // db.close();
});
