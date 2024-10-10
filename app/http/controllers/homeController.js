let homeController = () => {
    return {
        async index(req , res) {
            res.render('pages/home');
        }
    }
}

module.exports = homeController