const express = require("express");
const cors = require("cors");
const corsOptions = {
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

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
  var userName = req.body.user;
  var password = req.body.password;
  if(userName == "fbatuhanr@gmail.com" && password == "123"){

      let newUser = new userProfile({
        email: userName
      });
      
      newUser.save((err, result) => {
        if (err) throw err;
        console.log(result);
      });

    return res.json({
      isLoginSuccess: true, 
      errorMessage: null
    });
  }
  return res.json({isLoginSuccess: false, errorMessage: 'Kullanıcı bilgilerini kontrol ediniz.'});
});