const Order = require('../../../models/order')

function paypalController(){
    return {
        async success(req , res){
            console.log(req.query); 
            
            let orderId = req.query.order_id
            let paymentId = req.query.paymentId
            let payerId = req.query.PayerID

            let result = await Order.findOneAndUpdate({_id:orderId} ,{
                paymentId:paymentId,
                payerId:payerId,
                paymentStatus:true
            })

            if(result){
                req.flash('success' , 'Payment Successful')
                res.redirect(`/customer/orders/${orderId}`)
            }
            

        },
        cancel(req ,res){
            req.flash('error' , 'Payment Failed')
            return res.redirect(`/cart`)
            // res.send('payment Failed')

        }
    }
}

module.exports = paypalController