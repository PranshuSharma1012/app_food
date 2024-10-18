import axios from 'axios'
import Noty from 'noty' 

let addToCart = $('.add-to-cart');
let cartCounter = $('#cartCounter')

$(document).ready(function () {

    $('.logout-btn').click(function (e){
        e.preventDefault();
        $('#logout-form').submit();
    });

    
    
    addToCart.on('click' , function(e){
        e.preventDefault();
        let pizza = $(this).data('pizza');
        // console.log(JSON.parse(pizza));

        updateCart(pizza);


    })

    function updateCart(pizza){
        console.log(pizza);

        axios.post('/update-cart' , pizza).then((response) => {
            console.log(response.data); 

            cartCounter.html(response.data.totalQuantity);
            new Noty({
                type: 'success',
                timeout: 1000,
                text: 'Item added to cart',
                progressBar: false,
            }).show();   

        }).catch((error) => {
            new Noty({
                type: 'error',
                timeout: 1000,
                text: 'Something went wrong',
                progressBar: false,
            }).show();
            console.log(error);            
        });
    }

});