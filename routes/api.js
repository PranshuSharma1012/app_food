
const homeController = require('../app/http/controllers/homeController')
const cartController = require('../app/http/controllers/customers/cartController')
const authController = require('../app/http/controllers/authController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
const paypalController = require('../app/http/controllers/customers/paypalController')

// middleware
// const auth = require('../app/http/middleware/auth')
// const admin = require('../app/http/middleware/admin')

function initApiRoutes(app){
    app.post('/api/login' , authController().postLogin)

    app.post('/api/createOrder' , orderController().apiOrderStore )
}

module.exports = initApiRoutes