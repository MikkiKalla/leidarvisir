const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose")
const app = express();
const port = "3000";

//note: req param comes before res param

//Load in Mongoose models
const {mCourse, mUser} = require("./db/models")
const jwt = require('jsonwebtoken');

//*** Load middleware ***

//this middleware will parse the request body of the HTTP request
app.use(bodyParser.json());

//CORS Headers middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  // res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

  res.header(
    'Access-Control-Expose-Headers',
    'x-access-token, x-refresh-token'
  );

  next();
});





//check wheather the request has a valid JWT token
let authenticate = (req, res, next) => {
  let token = req.header("x-access-token");

  //verify the JWT token
  jwt.verify(token, mUser.getJWTSecret(), (err, decoded) => {
    if (err) {
      //there is an error
      //jwt is invalid. do not authenticate
      res.status(401).send(err)
    } else {
      //JWT is valid request can continue
      req.user_id = decoded._id
      next();
    }
  })
}



//verify refresh token middleware (which will be verifying this session)
let verifySession = (req, res, next) => {
  //grab the refresh token from the header
   let refreshToken = req.header("x-refresh-token");
    //grab the _id from the header
   let _id = req.header("_id");

   mUser.findByIdAndToken(_id, refreshToken).then((user)=>{
     if (!user) {
       // User couldn't be found
       return Promise.reject({
         "error": "User not found, make sure that the refresh token and user id is valid"
       });
     }

     //if the code reaches this block. the user was found
     //therefore the session exists in the database but we have to check wheather it's valid or not

     req.user_id = user._id;
     req.userObject = user;
     req.refreshToken = refreshToken;

     let isSessionValid = false;

     user.sessions.forEach((session)=>{
       if (session.token === refreshToken) {
         //check if the session has expired
         if(mUser.hasRefreshTokenExpired(session.expiresAt) === false){
          //refresh token has not expired
          isSessionValid = true;
         }
       }
     });

     if(isSessionValid){
       //session is valid. call next() to contine processing the web request
       next();
     } else {
       //the session is not valid
       return Promise.reject({
         "error": "refresh token has expired or the session is invalid",
 
       });
     }

   }).catch((e)=>{
      //401 - not authorised
     res.status(401).send(e);

   })
}

//*** End Middleware *** 









//*** Route handlers ***

app.get("/", (req, res)=>{
  res.send("hello world");
})


//GET /courses gets all courses from the database
app.get("/courses", (req, res)=>{

  mCourse.find({}).then((courses)=>{
    res.send(courses)
  })
  //I want to return an array of all the courses in the database
})

/*POST to the courses array
  Purpose: Adding a new Course to database
*/

app.post("/courses", (req, res)=>{
  let field_name = req.body.field_name

  let newCourse = new mCourse({
    field_name
  })
  newCourse.save().then((courseDocument)=>{
    //the full course document is returned including ID
    res.send(courseDocument)
  })
})

//Update specified course with new values specified in JSON
app.patch("/courses/:id", (req, res)=>{

  mCourse.findOneAndUpdate(
    {_id: req.params.id},
    {$set: req.body}
    ).then(()=>{
      res.sendStatus(200)
    })
})

app.delete("/courses/:id", (req, res)=>{
  // I want to delete the specified course if it no longer exists
  mCourse.findOneAndRemove(
    {_id: req.params.id},
     ).then((removedCourseDocument)=>{
      res.send(removedCourseDocument)
    })
})


// **** User Routes ****


/*
  GER /users
  Purpose: testing
*/ 
app.get("/users", (req, res)=>{

  mUser.find({}).then((users)=>{
    res.send(users)
  })
  //I want to return an array of all users in the database
})

/*
  POST /users
  Purpose: sign up
*/ 

app.post("/users", (req, res) => {
  // user Sign up

  let body = req.body;
  let newUser = new mUser(body);

  newUser.save().then(() => {
    return newUser.createSession();

  }).then((refreshToken) => {

    //Session created successfully refresh token created
    //now I genereate an access auth token for the user

    return newUser.generateAccessAuthToken().then((accessToken) => {
      //access auth token generated successfully, now I return an object containing the auth token
      return {accessToken, refreshToken}
    })
  }).then((authTokens) => {
    //now construct and send the response to the user with the auth token in the header and the user object in the body
    res
      .header("x-refresh-token", authTokens.refreshToken)
      .header("x-access-token", authTokens.accessToken)
      .send(newUser)
  }).catch((e)=> {
    res.status(404).send(e)
  })
})

/*
  POST /users/login
  Purpose: sign in
*/ 

app.post("/users/login", (req, res) => {
  let UserName = req.body.UserName;
  let password = req.body.password;

  mUser.findByCredentials(UserName, password).then((user) => {
    return user.createSession().then((refreshToken) => {
      //session created and refresh token returned
      //generate access auth token for user

      return user.generateAccessAuthToken().then((accessToken) => {
        //access auth token generated, return an object containing the auth token
        return {accessToken, refreshToken}
      })
    }).then((authTokens) => {
       //now construct and send the response to the user with the auth token in the header and the user object in the body
      res
        .header("x-refresh-token", authTokens.refreshToken)
        .header("x-access-token", authTokens.accessToken)
        .send(user)
    })
  }).catch((e)=> {
    res.status(404).send(e)
  })
})

/*
  GET /users/me/access-token
  Purpose: generates and returns an access token
*/ 

app.get("/users/me/access-token", verifySession, (req, res) =>{
  //we know that the user is authenticated and we have the user id available.
  req.userObject.generateAccessAuthToken().then((accessToken) => {
    res.header("x-access-token", accessToken).send({accessToken})
  }).catch((e)=>{
    res.status(400).send(e)
  })
})


/*
  POST /users/:id/courses
  Purpose: Displaying only saved courses for the user
*/ 
app.get("/users/:id/courses", /*authenticate*/ (req, res) => {
  // I want to return all courses that have been saved (belong to) by the user
})


app.listen(port, ()=>{
  console.log("server is listening on port:: "+ port);
  
})