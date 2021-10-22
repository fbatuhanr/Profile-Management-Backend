const express = require("express");
const cors = require("cors");
const corsOptions = {
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

const mongoose = require('mongoose');


const PORT = process.env.PORT || 3001;


const app = express();
app.use(express.json());
app.use(cors(corsOptions));

const dbURI = "mongodb+srv://admin:jmnZTIrVMA05hPYj@cluster0.w4wrz.mongodb.net/profile-management?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((result) => console.log(result, "connected to dbd"))
        .catch((error) => console.log("HATA!:",error));


app.get("/users", (req, res) => {

    res.json({user: "ben user"});
});

app.post("/login", function (req, res) {
  var userName = req.body.user;
  var password = req.body.password;
  if(userName == "fbatuhanr@gmail.com" && password == "123"){

    return res.json({
      isLoginSuccess: true, 
      errorMessage: null
    });
  }
  return res.json({isLoginSuccess: false, errorMessage: 'Kullanıcı bilgilerini kontrol ediniz.'});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});