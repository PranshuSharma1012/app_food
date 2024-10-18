const Menu = require('../../models/menu')

let homeController = () => {
    return {
        async index(req , res) {
            const pizzas = await Menu.find()
            res.render('pages/home' , {pizzas:pizzas} );
        }
    }
}

module.exports = homeController