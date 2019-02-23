const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema( {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// override a method to update exactly how mongoose handles certain things (in this case, only send back email and Id property)
// this method determines what gets sent back when a mongoose model is converted into a JSON value - email, id
UserSchema.methods.toJSON = function(){
  var user = this;      // using "this" key word to distinct the user variable from server.js, can also use other variable
  var userObject = user.toObject()  //take mongoose object variable, user, and converting it into a regular object

  return _.pick(userObject, ['_id', 'email']);  // pick id and email from userObject  (pick is from lodash library)
};




//instance method //arrow function does not bind THIS key word, we need to use it here so we use Function instead of arrow
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;    //instance method, set it to this

  return user.update({
    $pull: {
      tokens: {
        token: token      //if token does match something in that array  "function (token)", it is going to remove its entire object property
      }
    }
  });
};

//static as an object kind of like methods, although everything you add onto it turns into a model method as opposed to an instance method
UserSchema.statics.findByToken = function (token) {
  var User = this;    //instance methods gets called with the individual document (var user = this;) model method gets called with the model as the This binding
  var decoded;

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();      //can use this syntax, inside () is the value gets passed baack to catch(e) in server.js - /users/me
  }
  return User.findOne({
    '_id': decoded._id,         // we get the _id here
    'tokens.token': token,    //quote is needed if there is a dot
    'tokens.access': 'auth'
  })
};

//findByCredentials - take email and password as arguments, its then gonna return a promise with a user or with an error if the user didnt exist
UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user){
      return Promise.reject();      //send back to catch((e) =>) in server.js
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
          if(res){
            resolve(user);
          } else{
            reject();
          }
      });
    });
  });
};

//mongoose middleware, UserSchema.pre let us save hashed password beforee running other code
UserSchema.pre('save', function(next) {
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else{
    next();
  }
});


var User = mongoose.model('User', UserSchema);


module.exports = {User};
