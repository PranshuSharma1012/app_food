const Order = require('../../../models/order')

function statusController(){
    return {
        async update(req ,res){
            let result = await Order.updateOne({_id:req.body.orderId} , {status:req.body.status})

            return res.redirect('/admin/orders');        
        }
    }
}

module.exports = statusController