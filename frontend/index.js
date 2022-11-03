document.addEventListener("DOMContentLoaded", () => {
  console.log("dom is loded");
  fetchProducts(1);
  fetchCart();
});

document.querySelector(".cart-holder").addEventListener("click", (e) => {
  e.preventDefault();

  showCart();
});

document.getElementById("display-cart").addEventListener("click", showCart);

document.getElementById("cart").addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.className == "cancel") hideCart();

  if (e.target.className == "remove") {
    const cartItemID = e.target.parentElement.parentElement.id;
    removeFromCart(cartItemID);
  }

  // purchase
  if (e.target.className == "purchase-btn") {
    placeOrder();
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
    let cartNum = document.querySelector(".cart-number");
    cartNum.innerText = parseInt(cartNum.innerText) - 1;
  } else {
    document.querySelector(`#${cart_item_id} input`).value = qty - 1;
  }

  //updateprice
  updateTotalPrice();
}

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

async function fetchCart(page) {
  try {
    let res = await axios.get(`http://localhost:3000/cart?page=${page}`);

    const {
      data: { cartItems, totalPrice, totalProds, ...pagiData },
    } = res;
    // console.log(totalPrice);

    const { hasNextPage, hasPrevPage, nextPg, prevPg, lastPage } = pagiData;
    // display on cart
    document.querySelector("#cart .cart-items").innerHTML = "";
    cartItems.map((item) => {
      // console.log(item);
      displayProductOnCart(item);
    });

    pagination(
      page,
      hasPrevPage,
      hasNextPage,
      prevPg,
      nextPg,
      lastPage,
      "cartPagi-wrap",
      fetchCart
    );

    document.querySelector(".cart-number").innerText = totalProds;
    document.getElementById("total-value").innerText = totalPrice;
  } catch (error) {
    console.log(error);
  }
}

// fetch all
async function fetchProducts(page) {
  try {
    let res = await axios.get(`http://localhost:3000/products?page=${page}`);
    const { hasNextPage, hasPrevPage, nextPg, prevPg, lastPage } = res.data;
    // console.log();
    //handle pgaination
    pagination(
      page,
      hasPrevPage,
      hasNextPage,
      prevPg,
      nextPg,
      lastPage,
      "pagination-wrap",
      fetchProducts
    );

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
function pagination(
  currPg,
  hasPrev,
  hasNext,
  prevPg,
  nextPg,
  lastPage,
  paginationLocID,
  cb
) {
  let paginationBox = document.getElementById(`${paginationLocID}`);
  paginationBox.innerHTML = "";

  let currBtn, nextBtn, prevBtn, lastBtn, firstBtn;
  if (hasPrev) {
    prevBtn = document.createElement("button");
    prevBtn.className = "pagi-btn prevPg";

    prevBtn.innerText = prevPg;
    prevBtn.addEventListener("click", () => {
      cb(prevPg);
    });

    //if previous exist then first page is also avail
    firstBtn = document.createElement("button");
    firstBtn.className = "pagi-btn";
    firstBtn.innerText = "<<";
    firstBtn.addEventListener("click", () => {
      cb(1);
    });

    paginationBox.appendChild(firstBtn);
    paginationBox.appendChild(prevBtn);
  }

  if (currPg) {
    currBtn = document.createElement("button");
    currBtn.className = "pagi-btn currentPg";

    currBtn.innerText = currPg;

    paginationBox.appendChild(currBtn);
  }
  if (hasNext) {
    nextBtn = document.createElement("button");
    nextBtn.className = "pagi-btn nextPg";

    nextBtn.innerText = nextPg;
    nextBtn.addEventListener("click", () => {
      cb(nextPg);
    });

    //if next exist then last page is also avail
    lastBtn = document.createElement("button");
    lastBtn.className = "pagi-btn";
    lastBtn.innerText = ">>";
    lastBtn.addEventListener("click", () => {
      cb(lastPage);
    });

    paginationBox.appendChild(nextBtn);
    paginationBox.appendChild(lastBtn);
  }
}

// order now
async function placeOrder() {
  try {
    let res = await axios.post("http://localhost:3000/order");

    const { message } = res.data;

    console.log(res);
    //refresh cart
    fetchCart();
    hideCart();
    createNotification(message);
  } catch (error) {
    console.log(error);
  }
}
