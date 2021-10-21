const express = require("express");
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/items", (req, res) => {
  res.json({
    books: [
      "kitap1",
      "kitap2"
    ]
  });
});

app.post("/login", function (req, res) {
  var userName = req.body.user;
  var password = req.body.password;
  if(userName == 'Batu' && password == '1234'){
    return res.json({isSuccess: true, errorMessage: null});
  }
  return res.json({isSuccess: false, errorMessage: 'Kullanıcı bilgilerini kontrol ediniz.'});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});