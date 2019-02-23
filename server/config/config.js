var env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test'){    //production environmeent will not pass this condition
  var config = require('./config.json');    //when require json file, it automatically parses it into a javascript object
  var envConfig = config[env];

  Object.keys(envConfig).forEach ((key) => {    //object.keys = //takes an object, gets all keys and returns in array
    process.env[key] = envConfig[key];
  });
}


// if(env === 'development'){
//   process.env.Port = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }else if (env === 'test'){
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
// }
