const parentEle = document.getElementById("Ecomm"); // ecomm parent ele for all products and cart

//handle click events in ecom
parentEle.addEventListener("click", (e) => {
  e.preventDefault();

  //add item to cart
  if (e.target.className == "shop-item-btn btn") {
    const id = e.target.parentElement.parentElement.id;
    addToCart(id);
  }

  // remove from cart
  if (e.target.className === "remove") {
    const cart_item_id = e.target.parentElement.parentElement.id;
    removeFromCart(cart_item_id);
  }

  //display cart
  if (e.target.id === "display-cart" || e.target.className == "cart-holder") {
    showCart();
    // console.log(document.querySelector("#cart"));
  }
  // hide cart
  if (e.target.className == "cancel") {
    hideCart();
  }

  //purchase
  if (e.target.className == "purchase-btn") {
    purchase();
  }
});

//cart at nav
document.querySelector(".cart-holder").addEventListener("click", (e) => {
  e.preventDefault();
  showCart();
});

// handle change of qty
const cart_items = document.querySelector("#cart .cart-items");

cart_items.addEventListener("change", (e) => {
  e.preventDefault();

  if (e.target.className == "cart-qty-inp") {
    console.log(e.target.value);

    updateTotalPrice();
  }
});

//update Total price
function updateTotalPrice() {
  const items_rows = cart_items.getElementsByClassName("cart-row");
  // console.log(items_rows);
  let total = 0;
  for (let i = 0; i < items_rows.length; i++) {
    // console.dir(items_rows[i].children[1].innerText.slice(0, -1));
    // console.dir(items_rows[i].children[2].children[0].value);

    let price = items_rows[i].children[1].innerText.slice(0, -1);
    let qty = items_rows[i].children[2].children[0].value;

    total += Number(price) * Number(qty);
  }

  // round my 2
  total = Math.round(total * 100) / 100;

  //set total on DOM
  document.getElementById("total-value").innerText = total;
}

//add to cart
function addToCart(id) {
  if (document.querySelector(`#in-cart-${id}`)) {
    alert("This item is already added to the cart");
    return;
  }

  const name = document.querySelector(`#${id} h1`).innerText;

  const imgSrc = document.querySelector(`#${id} img`).src;
  const price = document.querySelector(`#${id} .product-details > span`)
    .childNodes[0].data;

  //add item to cart
  let new_cart_item = document.createElement("div");
  new_cart_item.id = `in-cart-${id}`;
  new_cart_item.className = "cart-row";
  new_cart_item.innerHTML = `    
       <span class="cart-item cart-column">
           <img class="cart-img" src="${imgSrc}" alt="">
           <span>${name}</span>
       </span>
       <span class="cart-price cart-column">${price} $</span>
       <span class="cart-quantity cart-column">
           <input class="cart-qty-inp" type="number" min="1" value="1" required>
           <button class="remove">REMOVE</button>
       </span>
     `;

  cart_items.appendChild(new_cart_item);

  let notification = document.createElement("div");
  notification.innerHTML = `<div><p><span> ${name}</span> ADDED TO CART SUCCESSFULLY </p><br><p>TOTAL ITEMS : <span>${Number(
    cartCounter(1)
  )}</span></p></div>`;
  //add class to notification
  notification.classList.add("toast");

  createNotification(notification);

  //update price
  updateTotalPrice();
}

//remove from cart
function removeFromCart(cart_item_id) {
  let qty = document.querySelector(`#${cart_item_id} input`).value;
  qty = Number(qty);

  if (qty == 1) {
    document.getElementById(`${cart_item_id}`).remove();
    //update cart item number at top
    cartCounter(0, 1);
  } else {
    document.querySelector(`#${cart_item_id} input`).value = qty - 1;
  }

  //updateprice
  updateTotalPrice();
}

//inc dec cart count
function cartCounter(inc, dec) {
  let count = document.querySelector(".cart-number");
  if (inc) {
    count.innerText = Number(count.innerText) + 1;
  }
  if (dec) {
    count.innerText = Number(count.innerText) - 1;
  }
  return count.innerText;
}

//create notification
function createNotification(notification) {
  const notiBox = document.getElementById("notification-wrap");

  notiBox.appendChild(notification);

  // set timer to remove
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// hideCart
function hideCart() {
  document.getElementById("cart").style = "display:none;";
}
// showCart
function showCart() {
  document.getElementById("cart").style = "display:flex;";
}

//purchase()
function purchase() {
  cart_items.innerHTML = "";
  document.querySelector(".cart-number").innerText = 0;
  updateTotalPrice();
  hideCart();
  alert("function under devlopment");
}
