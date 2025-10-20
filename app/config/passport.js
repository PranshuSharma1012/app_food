const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport){
    
    passport.use(
        new LocalStrategy({usernameField:'email'} , async (email , password , done) => {
            const user = await User.findOne({email:email})
            // console.log(email);
            // console.log(password);
            // console.log(user);

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

    passport.deserializeUser( async (id , done) => {
        let user = await User.findById(id)
        done(null , user)
    })
}

module.exports = init