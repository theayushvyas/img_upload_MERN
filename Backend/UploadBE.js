const express = require("express");
const path = require("path");
const multer = require("multer");
const mongoose  = require("mongoose");
const app = express();
const PORT = 4500;
require('./model');
const File = mongoose.model("file");
const router = express.Router();
const cors =  require('cors');
app.use(cors());

const storage = multer.diskStorage({
   destination: "./public/",
   filename: function(req, file, cb){
      cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
   }
});

const upload = multer({
   storage: storage,
   limits:{fileSize: 1000000},
}).single("myfile");

const obj =(req,res) => {
   upload(req, res, () => {
      console.log("Request", req.body);
      console.log("Request file", req.file);
      const file = new File();
      file.meta_data = req.file;
      file.save().then(()=>{
      res.send({message:"uploaded successfully"})
      console.log("recieved")
      })
       err = (e) =>
       {
         console.log(e);
       } 
   });
}

app.get('/', (req, res) => { 
try{
  const data = File.find()
  res.json(data)
}
catch(err){
  res.send("error"+err);
}
});


router.post("/upload", obj);

app.use(router);

mongoose.connect("mongodb://localhost:27017/file-upload",{
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
}).then(()=>{console.log("DB is connected")})

app.listen(PORT,()=>{
   console.log("app started on port",PORT)
});