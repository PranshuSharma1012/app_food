const Order = require('../../../models/order')
const User = require('../../../models/user')
const moment = require('moment')
const paypal = require('paypal-rest-sdk')
const Menu = require('../../../models/menu');
const { message } = require('laravel-mix/src/Log');

const jwt = require('jsonwebtoken')

// const Emitter = require('events')
// const eventEmitter = new Emitter()

// paypal config...
paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: process.env.PAYPAL_CLIENT_ID ,
    client_secret: process.env.PAYPAL_SECRET,
});

function orderController(){
    return {
        async store(req , res){
            let {phone , address} = req.body

            if(!phone || !address){
                req.flash('error' , 'All feilds are Required !')
                return res.redirect('/cart')
            }
            let amount = {currency: 'USD' , total: req.session.cart.totalPrice.toFixed(2) }

            let order_items = [];

            for (const item of Object.values(req.session.cart.items)) {
                let temp_item = item.item

                delete temp_item['_id']
                delete temp_item['image']
                delete temp_item['size']

                temp_item['currency'] = 'USD'
                temp_item['quantity'] = item.qty
                order_items.push(temp_item)
                
            } 

            // console.log(order_items);            
            
            
            // 
            // const createPaymentJSON = {
            //     intent: "sale",
            //     payer: {
            //       payment_method: "paypal",
            //     },
            //     redirect_urls: {
            //       return_url: "http://localhost:3000/success",
            //       cancel_url: "http://localhost:3000/cancel",
            //     },
            //     transactions: [
            //       {
            //         item_list: {
            //           items: [
            //             {
            //               name: "Red Sox Hat",
            //               sku: "001",
            //               price: "25.00",
            //               currency: "USD",
            //               quantity: 1,
            //             },
            //           ],
            //         },
            //         amount: {
            //           currency: "USD",
            //           total: "25.00",
            //         },
            //         description: "Hat for the best team ever",
            //         },
            //     ],
            // };
            // 

            const order = new Order({
                customerId:req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            
            let result = await order.save();

            let menuId = Object.keys(result.items)[0];

            const menu = await Menu.findById(menuId)   
            
            let newStock = menu.stock - 1; 

            console.log(result);

            // console.log(menu);            
            
            // console.log(newStock);
            
            if(result){

                if(newStock <= 0){

                    req.flash('error' , 'The item or items you selected are Out Of Stock!')
                
                    return res.redirect('/cart')

                }

                const UpdateMenu = await Menu.findByIdAndUpdate({_id:menuId} ,{stock:newStock})

                const eventEmitter = req.app.get('eventEmitter')

                console.log(eventEmitter);    
                            
                eventEmitter.emit('stockUpdated' , result)

                // const createPaymentJSON = {
                //     intent: "sale",
                //     payer: {
                //       payment_method: "paypal",
                //     },
                //     redirect_urls: {
                //       return_url: `http://localhost:3000/success?order_id=${result._id}`,
                //       cancel_url: "http://localhost:3000/cancel",
                //     },
                //     transactions: [
                //       {
                //         item_list: {
                //           items: order_items,
                //         },
                //         amount:amount,
                //         description: "Hat for the best team ever",
                //       },
                //     ],
                // };

                // paypal.payment.create(createPaymentJSON, (error, payment) => {
                //     if (error) {
                //       console.error(error);
                //       throw error;
                //     } else {
                //       for (let i = 0; i < payment.links.length; i++) {
                //         if (payment.links[i].rel === "approval_url") {
                //             // console.log(payment.links[i].href);                            
                //            return res.redirect(payment.links[i].href);
                //         }
                //       }
                //     }
                // });

                
                
                // req.flash('success' , 'Order Created Successfully')
                // return res.redirect('/')

                // req.flash('success' , 'Payment Successful')
                // return res.redirect(`/customer/orders/${result._id}`)
            }
            else{
                console.log('Something went wrong!');
                req.flash('error' , 'Something went wrong!')
                return res.redirect('/cart')
            }

        },
        async index(req ,res){

            let orders = await Order.find({
                customerId: req.user._id
            }, null ,{sort:{'createdAt':-1}})

            return res.render('customers/orders' , {orders:orders , moment:moment})
        },
        async show(req, res){
            const order = await Order.findById(req.params.id)

            if(req.user._id.toString() === order.customerId.toString()){
                return res.render('customers/singleOrder' , {order})
            }
            return res.redirect('/')
        },
        async apiOrderStore(req , res){

            const token = req.header('Authorization')
            
            let {phone , address , items} = req.body

            if(!token){
                return res.status(401).json({
                    "error":"access denied"
                })
            }
            try {

                const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)

                console.log(decoded);                
        
                let userId = decoded.userId

                const order =  new Order({
                    customerId:userId,
                    items: items,
                    phone,
                    address
                })


                let result = await order.save()

                let userData = await User.findById(result.customerId);
                
                if(result){

                    const eventEmitter = req.app.get('eventEmitter');

                    eventEmitter.emit('apiOrder' , {result:result , userData:userData} )

                    return res.status(200).json({
                        "is_success":true,
                        "order_id":result._id,
                        "message":"order created successfully"
                    })
                }

            } catch (error) {
                console.log(error);
                
                return res.status(401).json({
                    "error":"Invalid Token"
                })
            }

            

        }
    }
}

module.exports = orderController