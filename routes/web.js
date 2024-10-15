const homeController = require('../app/http/controllers/homeController')
const cartController = require('../app/http/controllers/customers/cartController')
const authController = require('../app/http/controllers/authController')

function initRoutes(app){
    app.get('/' , homeController().index)
    app.get('/cart' , cartController().index)
    app.get('/login' , authController().login)
    app.get('/register' , authController().register)
    app.post('/register' , authController().postRegister)
    app.post('/login' , authController().postLogin)
}


module.exports = initRoutes