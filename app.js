const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { log } = require("console");
const { allowedNodeEnvironmentFlags } = require("process");


const app = express();

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://admin-amaan:amaan123@cluster0.cwg928e.mongodb.net/remainderDB",  {useNewUrlParser: true});




app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

const Remainder= mongoose.Schema({
    name:String
});

const Item = mongoose.model("Item", Remainder); 


const item = new Item({
    name:"welcome for adding remainder to your day"
});

const item1 = new Item({
    name:"Hit the + button to add"
});


const item2 = new Item({
    name:"<--- Hit this to Delete"
});

const allitems=[item,item1,item2];

const Lists = mongoose.Schema({
    name:String,
    items:[Remainder]
});

const List = mongoose.model("List", Lists); 


// Item.insertMany(allitems, function(err,Item){
//     if(err){
//         console.log("Something Wrong Happened"+err);
//     }
//     else{
//         console.log("All Work Saved");
//     }
// } );


app.get("/",function(req,res){
    var today= new Date();
    var option={
        weekday: "long",
        year: "numeric",
        month:"short",
        day: "numeric" 
    };

    var dat = today.toLocaleDateString('en-UN', option);
    Item.find({}, function(err, foundItems){
        if(foundItems.length === 0){
            Item.insertMany(allitems, function(err){
            if(err){
            console.log("Something Wrong Happened"+err);
            }
            else{
            console.log("All Work Saved");
            }
            res.redirect("/");
            });
        }
        else{
            console.log("2");
            res.render("list", {day:"today", another:foundItems});
        }
    })
    //res.render("list", {day:dat, another:items});
    })

app.post("/", function(req,res){
    var itemadd = req.body.add;
    var buttonlist = req.body.button;
    const itemnext = new Item({
        name:itemadd
    })
    if(buttonlist==="today"){
        itemnext.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: buttonlist}, function(err, foundList){
            foundList.items.push(itemnext);
            foundList.save(); 
            res.redirect("/" + buttonlist );
        })
    } 
})




app.get('/:upper', function(req,res){
    var uppername = req.params.upper;
    console.log(uppername);
    List.findOne({name:uppername}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name:uppername,
                    items:allitems
                })
                list.save();
                res.redirect("/"+uppername);
            }else{
                res.render("list", {day:foundList.name, another:foundList.items})
            }
        }
    })
})


app.post("/delete",  function(req,res){
    const checkitem = req.body.checked;
    const Listname = req.body.listname;

    if(Listname=== "today"){
    Item.findByIdAndRemove(checkitem , function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Work has been saved");
        }
        res.redirect("/");
    })
    }
    else{
        List.findOneAndUpdate({name:Listname}, {$pull:{items: {_id: checkitem}}}, function(err, foundList){
            if(!err){
                res.redirect("/"+Listname);
            }
        })
   
    }
})




app.listen("1000", function(req, res){
    console.log("port 1000 is running");
})