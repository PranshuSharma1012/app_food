const homeController = require('../app/http/controllers/homeController')
const cartController = require('../app/http/controllers/customers/cartController')
const authController = require('../app/http/controllers/authController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
const paypalController = require('../app/http/controllers/customers/paypalController')
// middleware
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')

function initRoutes(app){
    app.get('/' , homeController().index)
    app.get('/cart' , cartController().index)
    app.get('/login' , authController().login)
    app.get('/register' , authController().register)
    app.post('/register' , authController().postRegister)
    app.post('/login' , authController().postLogin)
    app.post('/logout' , authController().logout)
    app.post('/update-cart', cartController().update)
    app.post('/orders' , auth ,orderController().store)
    app.get('/customer/orders' , auth , orderController().index)
    app.get('/customer/orders/:id' , auth , orderController().show)

    
    // admin routes
    app.get('/admin/orders' ,admin, adminOrderController().index )
    app.post('/admin/order/status' , admin , statusController().update )

    // paypal
    app.get('/success' , paypalController().success)
    app.get('/cancel' , paypalController().cancel)
}


module.exports = initRoutes