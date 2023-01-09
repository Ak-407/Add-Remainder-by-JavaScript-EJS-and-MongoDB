const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var hobbys=["Eat food", "Go Gym", "Do Coding"];
var workitem=[];
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/home", function(req,res){
    res.render("list", {day:"work", another:workitem});
})
app.post("/home", function(req,res){
    var hobby= req.body.add;
    workitem.push(hobby);
    res.redirect("/home");
})
app.get("/",function(req,res){
    var today= new Date();
    var option={
        weekday: "long",
        year: "numeric",
        month:"short",
        day: "numeric" 
    };

    var dat = today.toLocaleDateString('en-UN', option);
    res.render("list", {day:dat, another:hobbys});
    })

app.post("/", function(req,res){
    var hobby= req.body.add;
    hobbys.push(hobby);
    res.redirect("/");
})




app.listen("1000", function(req, res){
    console.log("port 1000 is running");
})