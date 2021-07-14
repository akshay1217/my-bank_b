const removeBG = require('remove.bg');
const express = require('express');
const bodyParser = require('body-parser');

// create express app
const app = express();
let cors = require('cors');
app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

// Require Notes routes
require('./app/routes/user.route.js')(app);
require('./app/routes/payee.route.js')(app);

// listen for requests
app.listen(5000, () => {
    console.log("Server is listening on port 5000");
   // removeImgbg() ==> to remove background from img.
});

const removeImgbg = () =>{
    const url = "https://cdn.pixabay.com/photo/2018/01/25/14/12/nature-3106213_960_720.jpg";
    const outputFile = `${__dirname}/app/images/img-removed-from-file.png`;
    
    removeBG.removeBackgroundFromImageUrl({
        url,
        apiKey: "MnGEce5BQ5D3oGea2mDgSrgw", // You can use once per day. Free version.
        size: "regular",
        type: "person",
        outputFile 
    }).then((result) => {
        console.log(`File saved to ${outputFile}`);
        const base64img = result.base64img;
    }).catch((errors) => {
        console.log(JSON.stringify(errors));
    });
}