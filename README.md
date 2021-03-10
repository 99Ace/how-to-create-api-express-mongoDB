# how-to-create-api-express-mongoDB

## SETUP : installation the various packages
npm init
yarn add express
yarn add cors
yarn add dotenv
yarn add mongodb
npm install -g nodemon

## SETUP EXPRESS 

    const express = require("express")
    
    // CREATE EXPRESS
    let app = express();

    // End of the express code
    app.listen(3001, ()=>{
        console.log("Server has started")
    })

Run the server 
    nodemon index.js