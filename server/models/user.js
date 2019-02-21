const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

//static as an object kind of like methods, although everything you add onto it turns into a model method as opposed to an instance method
UserSchema.statics.findByToken = function (token) {
  var User = this;    //instance methods gets called with the individual document (var user = this;) model method gets called with the model as the This binding
  var decoded;

  try{
    decoded = jwt.verify(token, 'abc123');
  }catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();      //can use this syntax, inside () is the value gets passed baack to catch(e) in server.js - /users/me
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,    //quote is needed if there is a dot
    'tokens.access': 'auth'
  })

};

var User = mongoose.model('User', UserSchema);


module.exports = {User};
