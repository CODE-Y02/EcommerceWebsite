document.addEventListener("DOMContentLoaded", async () => {
  try {
    fetchProducts(1);
    //fetch cart
    fetchCart();
  } catch (error) {
    console.log(error);
  }
});

document.querySelector(".cart-holder").addEventListener("click", (e) => {
  e.preventDefault();

  showCart();
});

// click event on ecomm
const ecoom = document.getElementById("Ecomm");
ecoom.addEventListener("click", (e) => {
  e.preventDefault();

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
            <button class="shop-item-btn btn"  onclick="addToCart('${product.id}')">ADD TO CART</button>
        </div>
    </div>
  `;

  productsList.innerHTML += newProduct;
}

function displayProductOnCart(item) {
  let cartItems = document.querySelector("#cart .cart-items");

  let new_cart_item = document.createElement("div");
  new_cart_item.id = `in-cart-${item.id}`;
  new_cart_item.className = "cart-row";
  new_cart_item.innerHTML = `    
       <span class="cart-item cart-column">
           <img class="cart-img" src="${item.imageUrl}" alt="">
           <span>${item.title}</span>
       </span>
       <span class="cart-price cart-column">${item.price} $</span>
       <span class="cart-quantity cart-column">
           <input class="cart-qty-inp" type="number" min="1" value="${item.cartItem.quantity}"  required>
           <button class="remove">REMOVE</button>
       </span>
     `;

  cartItems.appendChild(new_cart_item);

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

// //inc dec cart count
// function cartCounter(inc, dec) {
//   let count = document.querySelector(".cart-number");
//   if (inc) {
//     count.innerText = Number(count.innerText) + 1;
//   }
//   if (dec) {
//     count.innerText = Number(count.innerText) - 1;
//   }
//   return count.innerText;
// }

//create notification
function createNotification(msg) {
  const notiBox = document.getElementById("notification-wrap");

  let notification = document.createElement("div");
  notification.innerHTML = `<div><p>${msg}</p></div>`;
  //add class to notification
  notification.classList.add("toast");

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

async function addToCart(prodID) {
  try {
    let res = await axios.post("http://localhost:3000/cart", {
      productId: prodID,
    });

    console.log(res);

    // const msg = `SUCCSSSFULLY ADDDED TO CART `;

    createNotification(res.data.message);

    //fetch cart again
    fetchCart();
  } catch (error) {
    console.log(error);
    // const msg = `ERROR OCCURED !!!`;
    createNotification(error.message);
  }
}

async function fetchCart() {
  try {
    let res = await axios.get("http://localhost:3000/cart");
    // console.log(res.data);

    // display on cart
    document.querySelector("#cart .cart-items").innerHTML = "";
    res.data.map((item) => {
      // console.log(item);
      displayProductOnCart(item);
    });

    document.querySelector(".cart-number").innerText = res.data.length;
  } catch (error) {
    console.log(error);
  }
}

// fetch all
async function fetchProducts(page) {
  try {
    let res = await axios.get(`http://localhost:3000/products?page=${page}`);

    console.log(res.data);
    //handle pgaination
    pagination(res.data.prevPg, page, res.data.nextPg);

    document.getElementById("products").innerHTML = "";
    res.data.products.map((product) => {
      //   console.log(product);
      displayProductOnDOM(product);
    });
  } catch (error) {
    console.log(error);
  }
}

//handle pagingion
function pagination(prev, curr, next) {
  document.getElementById("currentPg").innerText = curr;
  if (prev) {
    const prevbtn = document.getElementById("prevPg");
    prevbtn.style.visibility = "visible";
    prevbtn.addEventListener("click", (e) => {
      e.preventDefault();
      fetchProducts(curr + 1);
    });
  }

  if (next) {
    const nextBtn = document.getElementById("nextPg");
    nextBtn.style.visibility = "visible";
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      fetchProducts(curr + 1);
    });
  }
  if (!prev) {
    const prevbtn = document.getElementById("prevPg");
    prevbtn.style.visibility = "hidden";
    prevbtn.removeEventListener("click", (e) => {
      e.preventDefault();
    });
  }

  if (!next) {
    const nextBtn = document.getElementById("nextPg");
    nextBtn.style.visibility = "hidden";
    nextBtn.removeEventListener("click", (e) => {
      e.preventDefault();
    });
  }
}
