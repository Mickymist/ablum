require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8080;
const path = require("path");
const userModel = require('./model/user')
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.listen(process.env.port,()=>{
    console.log(`app is listening on port: ${PORT}`);
});
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));
app.get("/",(req,res)=>{
    res.render("index");
})
app.post("/create",async(req,res)=>{
    let{name, email, image} = req.body; //form se anne wali cheeze
 
    let createdUser = await userModel.create({
        name: name, //database mei bhej rhy hai!!
        email: email,
        image: image
        
    });
    res.redirect("read");
});
app.get("/read",async(req,res)=>{
    let allusers = await userModel.find();
    res.render("read.ejs",{users:allusers});
});
app.get("/edit/:id",async(req,res)=>{
   let findandedit = await userModel.findOne({_id: req.params.id});
   res.render("edit", {users:findandedit}); 
});
app.post("/update/:id",async(req,res)=>{
   let{name,image,email} = req.body;
   let user = await userModel.findOneAndUpdate({_id: req.params.id},{image,name,email},{new:true});
   res.redirect("/read");
});
app.get("/delete/:id",async(req,res)=>{
    let deleteuser = await userModel.findOneAndDelete({_id: req.params.id});
    res.redirect("/read");
})