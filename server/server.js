var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
//creating a local variable called mongoose queal to the mongoose property on the object
// and that object is gonna be the reutrn result from requiring the file we jsut created


var app = express();  //start express

app.use(bodyParser.json());   //use bodyparser json type


//**post things on postman that gets fetched and stored into our local database
app.post('/todos', (req, res) => {
  var todo = new Todo({   //create new todo list
    text: req.body.text   //fetch data from user
  });

  todo.save().then((doc) =>{    //save the data from req.body.text to database(user input)
    res.send(doc);    //send back important info to user like ID, completed from database to postman
  }, (err) => {
    res.status(400).send(err);
  });
});//**post things on postman that gets fetched and stored into our local database

//**get things from our local database and deploy on local host
app.get('/todos', (req, res) => {
  Todo.find().then((todos) =>{  //find everything in todolist and post on local host
    res.send({todos});
  }, (e) => {
    res.status(400).send(err);
  });
});//**get things from our local database and deploy on local host



//GET /todos/1234324
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)) {         //Valid id using isValid
    return res.status(404).send();    //404 - send back empty send
  }
  Todo.findById(id).then((todo) => {    //findById
    if(!todo) {                         // if no todo - send back 404 with empty body
      return res.status(404).send();
    }
    res.send({todo});                 // if todo - send it back with {object} body
  }).catch((e) => {                   //error
    res.status(400).send();         ////400 - send empty body back
  });
});


app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
