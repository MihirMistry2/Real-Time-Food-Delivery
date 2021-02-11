const axios = require('axios');

function initAdmin(socket) {
    const orderTableBody = document.getElementById('orderTableBody');

    let orders = [];

    let markup;
    axios
        .get('/admin/orders', {
            headers: {
                'X-Requested-with': 'XMLHttpRequest',
            },
        })
        .then((res) => {
            orders = res.data;
            markup = generateMarkup(orders);
            orderTableBody.innerHTML = markup;
        })
        .catch((err) => {
            console.log(err);
        });
    function orderItems(items) {
        const itemLists = Object.values(items);
        console.log('PARS:', itemLists);
        return itemLists
            .map((menuItem) => {
                return `
                <p>${menuItem.item.name} - ${menuItem.qty} QTY</p>
            `;
            })
            .join('');
    }

    function generateMarkup(orders) {
        return orders
            .map((order) => {
                return `
            <tr>
                <td>
                    <p>${order._id}</p>
                    <div>${orderItems(order.items)}</div>
                </td>
                <td>${order.userId.name}</td>
                <td>${order.mobile}</td>
                <td>${order.address}</td>
                <td>
                    <form action="/admin/order/status" method="post">
                        <input type="hidden" name="orderId" value="${
                            order._id
                        }">
                        <select name="status" id="status" onchange="this.form.submit()">
                            <option value="order_placed" ${
                                order.status === 'order_placed'
                                    ? 'selected'
                                    : ''
                            }>Placed</option>
                            <option value="confirmed" ${
                                order.status === 'confirmed' ? 'selected' : ''
                            }>Confirmed</option>
                            <option value="prepared" ${
                                order.status === 'prepared' ? 'selected' : ''
                            }>Prepared</option>
                            <option value="delivered" ${
                                order.status === 'delivered' ? 'selected' : ''
                            }>Delivered</option>
                        </select>
                    </form>
                </td>
                <td>${
                    new Date(order.createdAt).toLocaleString().split(',')[1]
                }</td>
            </tr>
            `;
            })
            .join('');
    }

    socket.on('orderPlaced', (data) => {
        alert('New Order Place');
        orders.unshift(data);
        orderTableBody.innerHTML = '';
        orderTableBody.innerHTML = generateMarkup(orders);
    });
}

module.exports = initAdmin;
