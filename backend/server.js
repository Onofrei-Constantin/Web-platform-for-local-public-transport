const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
require('dotenv').config();
var bodyParser = require("body-parser");
const axios = require('axios');
const errorHandler = require('./middleware/error');


const app = express();


app.use(bodyParser.json({limit: "50mb",verify: (req,res,buffer) => req['rawBody'] = buffer,}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.set("trust proxy", 1);
app.use(bodyParser.json());


const uri = process.env.REACT_APP_TPL_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log("MongoDB database connection established successgully");
})


app.use('/public', require('./routes/public'));
app.use('/auth', require('./routes/auth'));
app.use('/private', require('./routes/private'));


cron.schedule('0 0 * * *', async ()=>{
    const dateSistem = new Date();
    const dataCurenta = new Date(dateSistem.getFullYear(),dateSistem.getMonth(), dateSistem.getDate());
    const data = new Date(dataCurenta.getTime() - dataCurenta.getTimezoneOffset() * 60000);

    await axios.post('http://localhost:3001/public/vanzariActualizeaza',{data:data})
    .catch(function (error) {
        if (error.response) {
            // Request made and server responded
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            }
    });
});

app.use(errorHandler);

const port = process.env.PORT || 3001;

const server = app.listen(port, ()=> {
    console.log(`Server is running on port: ${port}`);
});

process.on("unhandledRejection",(err,promise)=>{
    console.log(`Logged Error: ${err}`);
    server.close(()=>process.exit(1));
})