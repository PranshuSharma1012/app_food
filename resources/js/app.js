import axios from 'axios'
import Noty from 'noty' 
import {initAdmin} from './admin'

let addToCart = $('.add-to-cart');
let cartCounter = $('#cartCounter')

let socket = io()

$(document).ready(function () {
    
    initAdmin(socket);

    socket.on('stockUpdated' , (data) => {

        for(let key of Object.keys(data.items)){
            console.log(data.items[key].item)
                                
            $('.menu-'+key).html(data.items[key].item.stock);
        }                
    })

    socket.on('apiOrder' , (data) => {
        console.log(data);     
        
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'New Order recived from ' + data.user.name,
            progressBar: false,
        }).show(); 

    });
    
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

    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top,
        }, 500, 'linear');
        event.preventDefault();
      });
      
      var mn = $(".main-nav")
      
      $(window).scroll(function() {
        if( $(this).scrollTop() > 250 ) {
          mn.addClass("main-nav-scrolled");
        }
          else {
            mn.removeClass("main-nav-scrolled");
        }
      });

});