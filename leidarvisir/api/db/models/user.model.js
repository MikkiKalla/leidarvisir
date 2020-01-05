const Mongoose = require("mongoose");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs")

//JWT Secret
const jwtSecret = "ENJSDA2OO5QL3MQ7ROEC1CIA2HB3G7IG4XG7TG9K701VVLMKTK0WTTR0JUY0U05UqbgeDpopaejfrp2wLKFJldshf";

const oUserSchema = new Mongoose.Schema({ 

  UserName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,

  },
  sessions: [{
    token: {
      type: String,
      required: true,

    },
    //session objects contain a refresh token and its expiry DateTime in the form of a UNIX timestamp
    expiresAt: {
      type: Number,
      required: true
    }
  }] 
})

// *** Instance methods ***


oUserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject()

  //return the document expect the password and sessions. these shouldn´t be made available
  return _.omit(userObject, [ "password", "sessions"]) //REMEMBER TO OMIT PASSWORD WHEN TESTING IS DONE

}
oUserSchema.methods.generateAccessAuthToken = function () {
  const user = this;
  return new Promise( (resolve, reject) => {
    jwt.sign({_id: user._id.toHexString() }, jwtSecret, { expiresIn: "15m" }, (err, token) => {
      if(!err){
        //if no error
        resolve(token);
      } else {
        //if error
        reject();
      }
    })
    // Create  and return the JSON web token. 
  })
}

//generate the refresh token
oUserSchema.methods.generateRefreshAuthToken = function () {
  //this method generates a simbple 64 byte string - It doesn't save it to the DB. saveSessionToDatabase() does that
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64,(err, buffer)=>{
      if(!err){
        //no error
        let token = buffer.toString("hex");
        return resolve(token)
      }
    })
  })
}

oUserSchema.methods.createSession = function(){
  let user = this;

  return user.generateRefreshAuthToken().then((refreshToken) => {
    return saveSessionToDatabase(user, refreshToken)
  }).then((refreshToken)=>{
    //saved to database successfully 
    //save the refresh token
    return refreshToken;
  }).catch((e)=>{
    return Promise.reject("Failed to save to database, reason:: \n"+ e )
  })
}










// *** Model // Static methods ***


oUserSchema.statics.getJWTSecret = () => {
  return jwtSecret;
}

oUserSchema.statics.findByIdAndToken = function (_id, token) {
  //finds user by id and token
  //used in auth middleware (verifySession)

  const User = this;

  return User.findOne({
    _id,
    'sessions.token': token
  });
}


oUserSchema.statics.findByCredentials = function (UserName, password) {
  let User = this;
  return User.findOne({ UserName }).then((user) => {
    if(!user) return Promise.reject();

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res){
          resolve(user);
        }
        else{
          reject();
        }
      })
    })
  })
}



oUserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
  let secondsSinceEpoch = Date.now() / 1000;
  if (expiresAt > secondsSinceEpoch) {
    //has not expired
    return false;
  } else {
    //has expired
    return true
  }
}

// *** Middleware ***

oUserSchema.pre("save", function (next) {
  let user = this;
  let costFactor = 10;

  if (user.isModified("password")) {
    // if the password field has been changed, run this block // Hash the password here before storing in the DB

    bcrypt.genSalt(costFactor, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next()
      })
    })

  } else {
    next();
  }
})

// *** Helper methods ***

let saveSessionToDatabase = (user, refreshToken) => {
  //save session to database
  return new Promise((resolve, reject) => {
    let expiresAt = generateRefreshTokenExpiryTime();

    user.sessions.push({ "token": refreshToken, expiresAt })

    user.save().then(()=>{
      //session has been saved successfully
      return resolve(refreshToken);

    }).catch((e)=>{
      // catch any errors 
      reject(e);
    })
  })
}

let generateRefreshTokenExpiryTime = () => {
  let daysUntilExpire = "10";
  let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
  return ((Date.now()/ 1000) + secondsUntilExpire);
}

const mUser = Mongoose.model("User", oUserSchema);

module.exports = { mUser }
