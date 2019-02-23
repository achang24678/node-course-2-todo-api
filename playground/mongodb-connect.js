// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();  // we can pull out ObjectID property using this syntax
// console.log(obj);

// var user = {name: 'Allen', age: 23};  //object destructing
// var {name} = user;  // pulling out name property from user object
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));   //ops attribute is going to store all of the cos that were inserted
  // });

//   db.collection('Users').insertOne({
//     name: 'Allen',
//     age: 23,
//     location: 'San Diego'
//   }, (err, res) => {
//     if(err){
//       return console.log('Unable to insert Users', err);
//     }
//     console.log(res.ops[0]._id.getTimestamp());
//   });
//
  db.close();
});
