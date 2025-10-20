import axios from 'axios'
import moment from 'moment'
import noty from 'noty'

export function initAdmin(socket){
    let orderTableBody = $('#orderTableBody');
    let markup;
    let orders = [];
    axios.get('/admin/orders' , {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then((response) => {

        orders = response.data; 
        markup = generateMarkup(orders)
        orderTableBody.html(markup);
    })

    function renderItems(items){
        let parseItems = Object.values(items);

        return parseItems.map((menuItem) => {
            return `
                <p>${menuItem.item.name}-${menuItem.qty} Pcs </p>
            
            `
        }).join('\n');
        
    }

    function generateMarkup(orders){
        // console.log(orders);

        return orders.map((order) => {
            return `
                    <tr> 
                        <td class="border px-4 py-2 text-green-900"> 
                            <p> ${order._id} </p> 
                            <div>
                                ${renderItems(order.items)}
                            </div>
                        </td> 
                        <td class="border px-4 py-2 "> 
                            <p> ${order.customerId.name} </p> 
                        </td> 
                        <td class="border px-4 py-2 "> 
                            <p> ${order.address} </p> 
                        </td> 
                        <td class="border px-4 py-2 "> 
                            <div class="inline-block relative w-64">
                                <form action="/admin/order/status" method="POST">
                                    <input type="hidden" name="orderId" value="${order._id}">
                                    <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                    <option value="order_placed" ${order.status == 'order_placed' ? 'selected' : ''} >Placed</option>
                                    <option value="confirmed" ${order.status == 'confirmed' ? 'selected' : ''} >Confirmed</option>
                                    <option value="prepared" ${order.status == 'prepared' ? 'selected' : ''} >Prepared</option>
                                    <option value="delivered" ${order.status == 'delivered' ? 'selected' : ''} >Delivered</option>
                                    <option value="completed" ${order.status == 'completed' ? 'selected' : ''} >Completed</option>
                                </select>
                                </form>

                                <div
                                     class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20">
                                        <path
                                            d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </td> 
                        <td class="border px-4 py-2 "> 
                            <p> ${moment(order.createdAt).format('hh:mm A')} </p> 
                        </td> 
                        <td class="border px-4 py-2 "> 
                            <p> ${order.paymentStatus ? 'Paid' : 'Not Paid'} </p> 
                        </td>                     
                    </tr>
                        
            `
        }).join(',');

        console.log(html);       
    }
}



// $(document).ready(function () {

//     let orderTableBody = $('#orderTableBody')

//     function adminOrder(){

//         axios.post('/admin/orders').then((response) => {
//             console.log(response.data);
            
//             let html = ' <td class="border px-4 py-2">'+ response+'</td> <td class="border px-4 py-2"> </td> <td class="border px-4 py-2"> </td><td class="border px-4 py-2"> </td><td class="border px-4 py-2"> </td><td class="border px-4 py-2"> </td>';
                
            
//             orderTableBody.html(html);

//         }).catch((error) => {
           
//             console.log(error);            
//         });
//     }
// });