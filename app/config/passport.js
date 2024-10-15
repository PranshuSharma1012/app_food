const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport){
    
    passport.use(
        new LocalStrategy({usernameField:'email'} , async (email , password , done) => {
            const user = User.findOne({email:email})
            console.log(email);

            if(!user){
                return done(null ,false ,{message:'No user with this E-mail.'})
            }

            bcrypt.compare(password , user.password).then((match) => {
                if (match) {
                    return done(null , user, {message:'logged In SuccessFully'})
                }
                return done(null , false , {message:'Wrong User name or password'})
            }).catch((error) =>{
                return done(null , false , {message:"Something went wrong!"})
            })
        })
    )

    passport.serializeUser((user , done) => {
        done(null , user._id)
    })

    passport.deserializeUser((id , done) => {
        User.findById(id , (error , user)=>{
            done(error , user)
        })
    })
}

module.exports = init