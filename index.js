const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const passport = require('passport')
const env = require('dotenv')
const session = require('express-session')
const flash = require('express-flash')
const Emitter = require('events')

const app = express()
env.config();
require('./connection')
const port = process.env.PORT || 3000

// event emmitter
const eventEmitter = new Emitter()

// socket config 

// const http = require('http');
// const server = http.createServer(app);
// const options = {
//     cors: true,
//     origins: ['http://127.0.0.1:3000'],
//   }
// const { Server } = require("socket.io");
// const io = new Server(server , options);

app.use('/socket' , express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')))


app.use('/jquery/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))


// templating
app.use(expressLayout);

app.set('eventEmitter' , eventEmitter)
app.set('views',path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// session , flash , form 
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
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
    app.set('user' , req.user)
    next()
})



app.use(express.json());

// web routes
require('./routes/web')(app)

// api routes
require('./routes/api')(app)

app.use((req, res) => {
    res.status(404).render('errors/404')
})

let server = app.listen(port, function (error) {
    if (!error) {
        console.log(`server running on port no. ${port}`);
        
    }
})

const io = require('socket.io')(server)

io.on('connection' , (socket) => {

    console.log("socket working");

    let user = app.get('user')
    console.log(user); 

    if(user){
        socket.join(user.email)
    }
    else{
        socket.join('admin')   
    }

    
});

eventEmitter.on('apiOrder' , (data)=>{

           
    io.to('admin@gmail.com').emit('apiOrder' , {order:data.result , user:data.userData })

});

eventEmitter.on('stockUpdated' , (data) => {
    console.log('inside event emitter');
    
    io.to('admin').emit('stockUpdated' , data)
});

