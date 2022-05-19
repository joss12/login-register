// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require ('morgan');
const db = require ('./database/db');
const dotenv = require('dotenv');
const path = require('path');



dotenv.config({path: './.env'});

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morgan('dev'));

const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory));
app.set('view engine', 'hbs');


//define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(process.env.PORT, ()=>{
    console.log('->SERVER STARTED<-');

    db.connect(function(err){
        if(err){
            console.log('error' + err.stack);
        }else{
            console.log('->CONNECTED TO THE DATABASE<-')
        }
    })
   
});

