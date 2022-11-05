const GoToOrderBtn = document.getElementById("GoToOrder");

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();

  fetchOrders();
});

async function fetchOrders() {
  try {
    // get list of prods ordered
    let response = await axios.get("http://localhost:3000/orders");

    let orderedProds = [];

    response.data.forEach((ele) => {
      orderedProds.push(...ele);
    });

    console.log(orderedProds);

    document.getElementById("orders-box").innerHTML = "";

    orderedProds.map((product) => createOrderedProdOnDOM(product));
  } catch (error) {
    console.log(error);
  }
}

function createOrderedProdOnDOM(prods) {
  let ordersBox = document.getElementById("orders-box");

  const {
    OrderItem: { orderId, productId, updatedAt, quantity },
    title,
  } = prods;

  let newProd = `
  <div id="order${orderId}p${productId}${updatedAt}"  class="order-row">
    <span class="orderId">  ${orderId}</span>
    <span class="prodID">  ${productId}</span>
    <span class="prodTitle">  ${title}</span>
    <span class="prodQty">  ${quantity}</span>
    <span class="orderTime">  ${updatedAt}</span>    
  </div>
  `;

  ordersBox.innerHTML += newProd;
}
