var {User} = require('./../models/user');

// midleware we use on routes to make them private
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  //find appropriate token related to that users
  User.findByToken(token).then((user) => {
    if(!user){
      return Promise.rejeect();
    }
    req.user = user;
    req.token = token;
    next();     //activate the /users/me code

  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};
