const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo')

const {User} = require('./../server/models/user');
// var id = '5c6513f6b4da3c43bcd6988c';
//
// if(!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }

// Todo.find({       //return array arguments
//   _id: id
// }).then((todos) =>{
//   console.log('Todos', todos);
// });
//
// Todo.findOne({    //return object arguments
//   _id: id
// }).then((todo) =>{
//   console.log('Todo', todo);
// });


// Todo.findById(id).then((todo) =>{
//   if(!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));



User.findById('5c64d5ecee29e3ddd0accb30').then((user) => {
  if(!user){
    return console.log('user not found');
  }

  console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
  console.log(e);
});
