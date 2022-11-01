document.addEventListener("DOMContentLoaded", async () => {
  try {
    let res = await axios.get("http://localhost:3000/products");

    // console.log(res.data.products);
    document.getElementById("products").innerHTML = "";
    res.data.products.map((product) => {
      //   console.log(product);
      displayProductOnDOM(product);
    });
  } catch (error) {
    console.log(error);
  }
});

// click event on ecomm
const ecoom = document.getElementById("Ecomm");
ecoom.addEventListener("click", (e) => {
  e.preventDefault();

  // console.dir(e.target.parentElement.parentElement);
  //add to cart
  if (e.target.classList.contains("shop-item-btn")) {
    // add to cart func
    let domProductID = e.target.parentElement.parentElement.id;
    const prodID = domProductID.slice(5);

    if (document.querySelector(`#in-cart-${prodID}`)) {
      alert("This item is already added to the cart");
      return;
    }
    let product = {
      id: prodID,
      title: document.querySelector(`#${domProductID} h1`).innerText,
      imageUrl: document.querySelector(`#${domProductID} img`).src,
      price: document.querySelector(`#${domProductID} .product-details span`)
        .childNodes[0].data,
    };

    displayProductOnCart(product);
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

// handle change of qty
const cart_items = document.querySelector("#cart .cart-items");

cart_items.addEventListener("change", (e) => {
  e.preventDefault();

  if (e.target.className == "cart-qty-inp") {
    console.log(e.target.value);

    updateTotalPrice();
  }
});

// displayProductOnDOM

function displayProductOnDOM(product) {
  let productsList = document.getElementById("products");

  let newProduct = `
    <div class="item" id="item-${product.id}">
        <h1>${product.title}</h1>
        <div class="img-wrap">
            <img src=${product.imageUrl} alt=${product.title} />
        </div>
        <div class="product-details">
            <span>
                ${product.price}
              <span> $ </span>
            </span>
            <button class="shop-item-btn btn">ADD TO CART</button>
        </div>
    </div>
  `;

  productsList.innerHTML += newProduct;
}

function displayProductOnCart(product) {
  let cartItems = document.querySelector("#cart .cart-items");

  let new_cart_item = document.createElement("div");
  new_cart_item.id = `in-cart-${product.id}`;
  new_cart_item.className = "cart-row";
  new_cart_item.innerHTML = `    
       <span class="cart-item cart-column">
           <img class="cart-img" src="${product.imageUrl}" alt="">
           <span>${product.title}</span>
       </span>
       <span class="cart-price cart-column">${product.price} $</span>
       <span class="cart-quantity cart-column">
           <input class="cart-qty-inp" type="number" min="1" value="1" required>
           <button class="remove">REMOVE</button>
       </span>
     `;

  cartItems.appendChild(new_cart_item);

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

// hideCart
function hideCart() {
  document.getElementById("cart").style = "display:none;";
}
// showCart
function showCart() {
  document.getElementById("cart").style = "display:flex;";
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
