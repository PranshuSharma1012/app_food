const homeController = require('../app/http/controllers/homeController')
const cartController = require('../app/http/controllers/customers/cartController')
const authController = require('../app/http/controllers/authController')
// middleware
const auth = require('../app/http/middleware/auth')

function initRoutes(app){
    app.get('/' , homeController().index)
    app.get('/cart' , cartController().index)
    app.get('/login' , authController().login)
    app.get('/register' , authController().register)
    app.post('/register' , authController().postRegister)
    app.post('/login' , authController().postLogin)
    app.post('/logout' , authController().logout)
    app.post('/update-cart', cartController().update)
}


module.exports = initRoutes