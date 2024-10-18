const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const passport = require('passport')
const env = require('dotenv')
const session = require('express-session')
const flash = require('express-flash')

const app = express()
env.config();
require('./connection')
const port = 3000

app.use('/jquery/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

// templating
app.use(expressLayout);
app.set('views',path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// session , flash , form 
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie:{maxAge:1000*60*60*24},
    // store:mongoStore
}));

// passport
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash());


// global Middleware
app.use((req , res , next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// web routes
require('./routes/web')(app)

app.use((req, res) => {
    res.status(404).render('errors/404')
})

app.listen(port, function (error) {
    if (!error) {
        console.log(`server running on port no. ${port}`);
        
    }
})