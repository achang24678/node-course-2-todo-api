var express = require('express');
var bodyParser = require('body-parser');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
//creating a local variable called mongoose queal to the mongoose property on the object
// and that object is gonna be the reutrn result from requiring the file we jsut created


var app = express();  //start express

app.use(bodyParser.json());   //use bodyparser json type

app.post('/todos', (req, res) => {
  var todo = new Todo({   //create new todo list
    text: req.body.text   //fetch data from user
  });

  todo.save().then((doc) =>{    //save the data from req.body.text to database(user input)
    res.send(doc);    //send back important info to user like ID, completed from database to postman
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) =>{
    res.send({todos});
  }, (e) => {
    res.status(400).send(err);
  })
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
