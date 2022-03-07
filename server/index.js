const express = require("express");
const cors = require("cors");
const corsOptions = { origin:'http://localhost:3000', cretials:true, optionSuccessStatus:200 };
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const UserProfile = require('../Schemas/userProfile.js');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(cors(corsOptions));


var fs = require('fs'); // fs is a readfile module.
var path = require('path'); // path is a directory module that provides file, folder paths, dir paths.
require('dotenv/config');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
  
// Set EJS as templating engine 
// app.set("view engine", "ejs");


var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,path.join(__dirname,'../upload'))
    },
    filename: (req, file, cb) => {
      cb(null,Date.now() + path.extname(file.originalname))
    }
});
  
var upload = multer({ storage: storage });

var UserProfileImage = require('../Schemas/userProfileImage.js');

const dbURI = "mongodb+srv://admin:jmnZTIrVMA05hPYj@cluster0.w4wrz.mongodb.net/profile-management?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => app.listen(PORT, () => console.log(`Server listening on ${PORT}`)))
.catch((error) => console.log("HATA!:",error));


app.post('/image-upload', upload.single('image'), (req, res, next) => {
  
  const imgObj = {
      filterEmail: req.body.filterEmail,
      fileName: req.file.filename,
      img: {
          data: fs.readFileSync(path.join(__dirname, '../upload/' + req.file.filename)),
          contentType: req.file.mimetype
      }
  }

  UserProfileImage.findOneAndUpdate(
    {filterEmail: imgObj.filterEmail}, 
    {fileName: imgObj.fileName, img: imgObj.img},
    {new: true, upsert: true},
    (err, result)=>{
      if (err) console.log(err);
      else {
        console.log("pos res:", res);
        console.log("func res:", result);
        return res.json({isUpdateSuccess: true, errorMessage: null});
      }
    }
  )

  /*
  UserProfileImage.findOne({filterEmail: imgObj.filterEmail}, function(err, user){
    console.log(user);
    if(err) console.log(err);
    else if(user) {
      UserProfileImage.findOneAndUpdate(
        {filterEmail: imgObj.filterEmail}, 
        {fileName: imgObj.fileName, img: imgObj.img},
        {new: true},
        (err, result)=>{
          if (err) console.log(err);
          else {
            console.log("pos res:", res);
            console.log("func res:", result);
            return res.json({isUpdateSuccess: true, errorMessage: null});
          }
        }
      )
    }
    else {
      UserProfileImage.create(imgObj, (err, item) => {
        if (err) 
          console.log("create err:", err);
        else {
            item.save();
            // item.save((err, result) => {
            //   if (err) throw err;
            //   return res.json({isLoginSuccess: true, errorMessage: null});
            // });
            res.redirect('/');
        }
    });      
    }
  });
  */
});

app.get('/image', (req, res) => {

  const filterEmail = req.query.filterEmail;

  UserProfileImage.findOne({filterEmail}, (error, doc) => {
    if(error) console.log("Profile Image findOne error: ", error);
    else return res.send(doc);
  })

});


// app.get('/add-profile', (req, res) => {
//   const userProfile = new UserProfile({
//       email: "fbatuhanr@gmail.com"
//   });

//   userProfile.save()
//   .then(result => {
//     res.send(result);
//   })
//   .catch(err => {
//     console.log("Error: ", err);
//   })
// });

app.get('/all-profiles', (req, res) => {
    UserProfile.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log("Error: ", err);
    })
});


app.get("/users", (req, res) => {

    UserProfile.find()
    .then(result => {

      result.map(res => {
        

        console.log(res);
        UserProfileImage.findOne({filterEmail: res.email}, function(err, user){
        if(err) console.log(err);
        else if(user) {

          
          return Object.assign(res, user);


        }
        else { }
      });

      })


      console.log(result);
      res.send(result);

    })
    .catch(err => {
      console.log("Error: ", err);
    })
});

app.post("/login", function (req, res) {

  const loginStatusData = { isLoginSuccess: null, successMessage: null, errorMessage: null }
  const {email, password} = req.body;
  UserProfile.findOne({email: email, password: password}, function(err, user){
    if(err) {
      loginStatusData.isLoginSuccess = false;
      loginStatusData.errorMessage = "Something went wrong (Db Error)!";
    }
    else if(user) {
      loginStatusData.isLoginSuccess = true;
      loginStatusData.successMessage = "Successfully logged in!";
    }
    else {
      loginStatusData.isLoginSuccess = false;
      loginStatusData.errorMessage = "Please check the e-mail and password!";
    }
    return res.json(loginStatusData);
  });
});





app.post("/sign-up", function (req, res) {

  const {signupEmail, signupPassword} = req.body;
  
  UserProfile.findOne({email: signupEmail}, function(err, user){
    if(err) console.log(err);
    else if(user) return res.json({isLoginSuccess: false, errorMessage: "Email is exist!"});
    else {
      const newUser = new UserProfile({email: signupEmail, password: signupPassword});
      newUser.save((err, result) => {
        if (err) throw err;
        return res.json({isLoginSuccess: true, errorMessage: null});
      });
    }
  });
});



app.get("/profile-form", (req, res) => {

  const email = req.query.email;

  UserProfile.findOne({email}, (error, doc) => {
    if(error) console.log("findOne error: ", error);
    else return res.send(doc);
  })

});
app.post("/profile-form", (req,res) => {

  const {filterEmail, email, name, surname, phoneNumber, education, country, state, hobbies} = req.body;

  UserProfile.findOne({email: email}, function(err, user){
    console.log(user);
    if(err) console.log(err);
    else if(user && user.email != email) return res.json({isUpdateSuccess: false, errorMessage: "Email is exist!"});
    else {
      UserProfile.findOneAndUpdate(
        {email: filterEmail}, 
        {email, name, surname, phoneNumber, education, country, state, hobbies},
        {new: true},
        (err, result)=>{
          if (err) console.log(err);
          else {
            console.log("pos res:", res);
            console.log("func res:", result);
            return res.json({isUpdateSuccess: true, errorMessage: null});
          }
        }
      )
    }
  });
});