const initAdmin = require('./admin');
const axios = require('axios');

const addToCartButton = document.querySelectorAll('.add-to-cart');
const cartCounter = document.getElementById('cartCouner');

function updateCart(food) {
    axios
        .post('/update-cart', food)
        .then((res) => {
            cartCounter.innerHTML = res.data.totalQty;
            alert(food.name + ' add successfully');
        })
        .catch((err) => {
            alert('Somthing went wrong');
            console.error(err);
        });
}

for (let btn of addToCartButton) {
    btn.addEventListener('click', (e) => {
        const food = JSON.parse(btn.dataset.food);
        updateCart(food);
    });
}

const status = document.querySelectorAll('.status_line');
const orderLists = document.querySelector('#hiddenOrder');

let order = orderLists ? orderLists.value : null;
order = JSON.parse(order);

function updateOrderStatus(order) {
    for (let stat of status) {
        stat.classList.remove('text-muted');
        stat.classList.remove('text-success', 'font-weight-bold');
    }

    let stepCompleted = true;

    for (let stat of status) {
        const dataName = stat.dataset.status;

        if (stepCompleted) {
            stat.classList.add('text-muted');
        }
        if (dataName === order.status) {
            stepCompleted = false;
            if (stat.nextElementSibling) {
                stat.nextElementSibling.classList.add(
                    'text-success',
                    'font-weight-bold'
                );
            }
        }
    }
}

updateOrderStatus(order);

// socket io

let socket = io();
initAdmin(socket);

if (order) {
    socket.emit('data', `order_${order._id}`);
}

const adminPath = window.location.pathname;
if (adminPath.includes('admin')) {
    socket.emit('data', 'adminRoom');
}

socket.on('orderUpdated', (data) => {
    const updateOrders = { ...order };

    // let date = new Date.now();
    updateOrders.updatedAt = new Date().getTime();
    updateOrders.status = data.status;
    updateOrderStatus(updateOrders);
});
