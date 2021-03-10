const express = require("express");
const cors = require("cors")
require("dotenv").config();
const MongoUtil = require("./MongoUtil");
const ObjectId = require("mongodb").ObjectId;

// SET UP link to MONGO_URL in .env file
const mongoUrl = process.env.MONGO_URL;
let database = "cmdata"
let collection_name = "players"

// CREATE EXPRESS
let app = express();

// ENABLE JSON
app.use(express.json());

// ENABLE CORS
app.use(cors());

async function main() {
    
    // Connect to the database
    let db = await MongoUtil.connect(mongoUrl, database);
    console.log ("Database is connected");

    // READ - Connect to read from database
    app.get('/players', async (req,res) => {
        
        try {
            // set to connect to the collections
            let players = await db.collection(collection_name)
                    .find()
                    .toArray()
                    
            res.status(200);
            res.send(players);
            console.log(players)
        } catch (e) {
            res.status(500);
            res.send({
                message : "Unable to get data"
            })
            // console.log(e)
        }

    })

    // CREATE - Connect to write to database 
    app.post('/players', async (req,res) => {
        let first_name = req.body.first_name; // variable to receive from input from fname
        let last_name = req.body.last_name; 
        let position = req.body.position;
        console.log(first_name,last_name,position)
        try {
            let result = await db.collection(collection_name).insertOne({
                first_name : first_name,
                last_name : last_name,
                position : position
            })
            res.status(200);
            res.send(result)
        } catch (e) {
            res.status(500);
            res,send({
                message:"Unable to insert new document"
            })
            console.log(e)
        }
    })
    
    // UPDATE - Connect to update the database
    app.put("/players", async (req,res)=>{
        try{
            await db.collection(collection_name).updateOne(
            {
                _id : ObjectId(req.body._id)
            }, 
            {
                "$set" : {
                    "first_name" : req.body.first_name,
                    "last_name" : req.body.last_name,
                    "position" : req.body.position
                }
            });

            res.status(200);
            res.send({
                "message":"Player profile is updated"
            })
        } catch (e) {
            res.status(500);
            res.send({
                'message':"Unable to update player"
            })
            console.log(e);
        }
    })

    // DELETE - Connect to delete from database
    app.delete("/players/:id", async(req,res)=>{
        try {
            await db.collection(collection_name).deleteOne({
                _id:ObjectId(req.params.id)
            })
            console.log(req.params.id)
            res.status(200);
            res.send ({
                "message" : "Player is deleted"
            });
        } catch (e) {
            res.status(500);
            res.send ({
                "message" : "Error deleting player from database"
            });
            console.log(e);
        }
        
    })


}

main()

app.listen(3001, ()=>{
    console.log("Server has started")
})