const Order = require('../../../models/order')

function orderController(){
    return {
        async index(req , res){
        //     Order.find({
        //         status:{
        //             $ne:'completed'
        //         }
        //     } , null , {sort:{
        //         'createdAt':-1
        //     }}).populate('customerId').exec( 
        //         (error , orders)=> {
        //         if(orders){
        //             if(req.xhr){
        //                 return res.json(orders)
        //             }else{
        //                 return res.render('admin/orders')
        //             }
        //         }
        //     } 
        // )

        let orders = await Order.find({
            status:{
                $ne:'completed'
            }
        } , null , {sort:{
            'createdAt':-1
        }}).populate('customerId')

        if(orders){
            if(req.xhr){
                return res.json(orders)
            }else{
                return res.render('admin/orders')
            }
        }


        }
    }
}

module.exports = orderController