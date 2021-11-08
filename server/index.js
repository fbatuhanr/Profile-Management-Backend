const express = require("express");
const cors = require("cors");
const corsOptions = { origin:'http://localhost:3000', credentials:true, optionSuccessStatus:200 }

const mongoose = require('mongoose');
const UserProfile = require('../Schemas/userProfile.js');


const PORT = process.env.PORT || 3001;


const app = express();

const dbURI = "mongodb+srv://admin:jmnZTIrVMA05hPYj@cluster0.w4wrz.mongodb.net/profile-management?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((result) => {
          app.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`);
          });
        })
        .catch((error) => console.log("HATA!:",error));

app.use(express.json());
app.use(cors(corsOptions));


app.get('/add-profile', (req, res) => {
  const userProfile = new UserProfile({
      email: "fbatuhanr@gmail.com"
  });

  userProfile.save()
  .then(result => {
    res.send(result);
  })
  .catch(err => {
    console.log("Error: ", err);
  })
});

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

    res.json({user: "ben user"});
});

app.post("/login", function (req, res) {

  const {email, password} = req.body;
  UserProfile.findOne({email: email, password: password}, function(err, user){
    if(err) console.log(err);
    else if(user) return res.json({isLoginSuccess: true, errorMessage: null});
    else return res.json({isLoginSuccess: false, errorMessage: 'Kullanıcı bilgilerini kontrol ediniz.'});
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
    if(err) console.log(err);
    else if(user) return res.json({isUpdateSuccess: false, errorMessage: "Email is exist!"});
    else {
      UserProfile.findOneAndUpdate(
        {filterEmail}, 
        {email, name, surname, phoneNumber, education, country, state, hobbies},
        {new: true},
        (err, result)=>{
          if (err) console.log(err);
          else return res.json({isUpdateSuccess: true, errorMessage: null});
        }
      )
    }
  });
});