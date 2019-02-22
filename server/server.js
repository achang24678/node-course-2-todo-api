require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
//creating a local variable called mongoose queal to the mongoose property on the object
// and that object is gonna be the reutrn result from requiring the file we jsut created


var app = express();  //start express
const port = process.env.PORT;    //set up app to use environment port variable that Heroku is going to set
                                          // if the Heroku port is there, we gonna use it, if not, we use 3000 local hose


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

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
      body.completedAt = new Date().getTime();
    }
    else{
      body.completed = false;
      body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }
      res.send({todo});

    }).catch((e) => {
      res.status(400).send();
    });
});

//setup post route  POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);    //using User

  user.save().then(() => {      //generating the token by calling the method in user.js, and adding it as a header

    return user.generateAuthToken();      //generate the token and call back to then

  }).then((token) => {      //second then call back gets called with generated token value

    res.header('x-auth', token).send(user);

  }).catch((e) => {
    res.status(400).send(e);
  })
});


//first private route, find the user and send back id email
app.get('/users/me', authenticate, (req, res) => {      //use middleware authenticate
  res.send(req.user);
});

//POST /users/login {email, password}
app.post('/users/login', (req, res) =>{
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) =>{
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
