const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

const jwt = require('jsonwebtoken')


let authController = () => {

    const _getRedirectUrl = (req) => {
        return req.user.role  == 'admin' ? '/admin/orders' : '/'
    }

    return {
        login(req , res) {
            res.render('auth/login');
        },
        register(req , res){
            res.render('auth/register');
        },
        async postRegister(req , res){
            
            let {name , email , password} = req.body

            if (!name || !email || !password ) {
                req.flash('error' , "All felids are required")
                req.flash('name' , name)
                req.flash('email' , email)
                return res.redirect('/register')
            }
            
            User.exists({email:email}).then((result) => {
                if(result){
                    req.flash('error' , 'Email already exists!')
                    req.flash('name' , name)
                    req.flash('email' , email)
                    return res.redirect('/register')
                }
            })

            const saltRound = 10

            let hashPassword = await bcrypt.hash(password ,saltRound)

            const user = new User({name:name , email:email , password:hashPassword})

            user.save().then((user) =>{
                req.flash('success' , 'Registration Successful!')
                return res.redirect('/login')
            }).catch((error) => {
                req.flash('error', 'Failed To Save User :(')
            })

            

        },
        postLogin(req , res , next){

            // console.log(req);

            if(req.body.mode){

                let {email , password} = req.body
    
                if (!email || !password) {
                    req.flash('error' , "All felids are required")
                    req.flash('email' , email)
                    return res.status(401).json({
                        "is_success":"false",
                        "message":"username or password is missing"
                    })
                }
                   
                
                passport.authenticate('local', {keepSessionInfo: true} , (error , user , info)=>{
                    // console.log('inside authenticate');
    
                    if(error){
                        // console.log(info.message);
                        
                        req.flash('error' , info.message)

                        return res.status(401).json({
                        "is_success":"false",
                        "message":"something went wrong"
                        })
                    }
                    if(!user){
                        // console.log(info.message);
    
                        req.flash('error' , info.message)

                        return res.status(401).json({
                            "is_success":"false",
                            "message":"user not exists"
                        })

                    }
    
                    let cart = req.session.cart || false;
                    req.logIn(user , (error) => {
    
                        if(error){
                            req.flash('error' , info.message)
                            return res.status(401).json({
                                "is_success":"false",
                                "message":"something went wrong"
                            })
                        }
                        req.session.cart = cart;

                        const token = jwt.sign({userId:user._id} , process.env.JWT_SECRET_KEY , {expiresIn:"1h"})

                        // console.log(`token ${token} `);
                        // console.log(`user ${user} `);
                        

                        return res.status(401).json({
                            "is_success":"true",
                            "message":"Login successful",
                            "token":token
                        })
                        // return res.redirect(_getRedirectUrl(req))
                    })
                })(req , res , next)

            }
            else{

                let {email , password} = req.body
    
                if (!email || !password) {
                    req.flash('error' , "All felids are required")
                    req.flash('email' , email)
                    return res.redirect('/login')
                }
                
                // console.log(passport);
    
                
                passport.authenticate('local', {keepSessionInfo: true} , (error , user , info)=>{
                    // console.log('inside authenticate');
    
                    if(error){
                        // console.log(info.message);
                        
                        req.flash('error' , info.message)
                        return next(error)
                    }
                    if(!user){
                        // console.log(info.message);
    
                        req.flash('error' , info.message)
                        return res.redirect('/login')
                    }
    
                    let cart = req.session.cart || false;
                    req.logIn(user , (error) => {
    
                        if(error){
                            req.flash('error' , info.message)
                            return next(error)
                        }
                        req.session.cart = cart;
                        return res.redirect('/')
                        // return res.redirect(_getRedirectUrl(req))
                    })
                })(req , res , next)
            }

        },
        logout(req , res , next){
            req.logout(function(err) {
                if (err) { 
                    return next(err); 
                }
                return res.redirect('/login'); 
            });
        }
    }
}

module.exports = authController