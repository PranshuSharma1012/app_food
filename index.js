const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const app = express()
const env = require('dotenv')
env.config();
const port = 3000
require('./connection')

app.use(expressLayout);
app.set('views',path.join(__dirname, '/resources/views'));

app.set('view engine', 'ejs');

app.use(express.static('public'));

require('./routes/web')(app)

app.listen(port, function (error) {
    if (!error) {
        console.log(`server running on port no. ${port}`);
        
    }
})