const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {    //remove all todo from database
//   console.log(result);
// });

//Todo.findOneAndRemove
//Todo.findByIdAndRemove

Todo.findOneAndRemove({_id: '5c68e1431a83d522da363ba4'}).then((todo) => {

});


Todo.findByIdAndRemove('5c68e1431a83d522da363ba4').then((todo) => {
  console.log(todo);
})
