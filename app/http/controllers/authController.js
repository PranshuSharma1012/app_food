const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')


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
        postLogin(req , res){
            let {email , password} = req.body

            if (!email || !password) {
                req.flash('error' , "All felids are required")
                req.flash('email' , email)
                return res.redirect('/login')
            }
            console.log('at line 59');
            // console.log(passport);

            
            passport.authenticate('local', (error , user , info)=>{
                console.log('inside authenticate');

                if(error){
                    console.log(info.message);
                    
                    req.flash('error' , info.message)
                    return next(error)
                }
                if(!user){
                    console.log(info.message);

                    req.flash('error' , info.message)
                    return res.redirect('/login')
                }
                req.logIn(user , (error) => {
                    console.log(info.message);

                    if(error){
                        req.flash('error' , info.message)
                        return next(error)
                    }
                    return res.redirect('/')
                    // return res.redirect(_getRedirectUrl(req))
                })
            })

        }
    }
}

module.exports = authController