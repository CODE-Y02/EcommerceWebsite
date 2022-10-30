const parentEle = document.getElementById("Ecomm");
const cart_items = document.querySelector("#cart .cart-items");

const cartBox = document.getElementById("cart");

// console.log(parentEle);

parentEle.addEventListener("click", (e) => {
  e.preventDefault();

  //   console.log(e.target.className);

  //add new item
  if (e.target.className == "shop-item-btn btn") {
    const id = e.target.parentElement.parentElement.id;
    // console.log(id)

    const name = document.querySelector(`#${id} h1`).innerText;

    const imgSrc = document.querySelector(`#${id} img`).src;
    const price = document.querySelector(`#${id} .product-details > span`)
      .childNodes[0].data;

    // console.log(price);

    let total_cart_price = Number(
      document.querySelector("#total-value").innerText
    );
    if (document.querySelector(`#in-cart-${id}`)) {
      alert("This item is already added to the cart");
      return;
    }

    // console.log(total_cart_price);

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
          <input type="number" min="1" value="1" required>
          <button class="remove">REMOVE</button>
      </span>

    `;

    // console.log(new_cart_item);
    cart_items.appendChild(new_cart_item);

    let oldCartCount = Number(document.querySelector(".cart-number").innerText);
    document.querySelector(".cart-number").innerText = oldCartCount + 1;

    //notification
    //
    const notiBox = document.getElementById("notification-wrap");

    let notification = document.createElement("div");
    notification.innerHTML = `<div><p><span> ${name}</span> ADDED TO CART SUCCESSFULLY </p><br><p>TOTAL ITEMS : <span>${
      oldCartCount + 1
    }</span></p></div>`;
    //add class to notification
    notification.classList.add("toast");

    notiBox.appendChild(notification);

    // set timer to remove
    setTimeout(() => {
      notification.remove();
    }, 2000);

    //update price
    document.querySelector("#total-value").innerText =
      Number(total_cart_price) + Number(price);
  }

  // remove from cart
  if (e.target.className === "remove") {
    // console.log("rem");
    // console.log(e.target.parentElement);
    const cart_item_id = e.target.parentElement.parentElement.id;
    let qty = document.querySelector(`#${cart_item_id} input`).value;
    let price = document
      .querySelector(`#${cart_item_id} .cart-price`)
      .innerText.slice(0, -1);
    // price = Number(price);
    qty = Number(qty);

    // console.log(price);

    let total_cart_price = document.querySelector(`#total-value`).innerText;

    // console.log(total_cart_price);

    document.querySelector(`#total-value`).innerText =
      Number(total_cart_price) - price;

    if (qty == 1) {
      document.getElementById(`${cart_item_id}`).remove();

      //update cart item number at top
      let oldCartCount = document.querySelector(".cart-number");

      oldCartCount.innerText = Number(oldCartCount.innerText) - 1;
    } else {
      document.querySelector(`#${cart_item_id} input`).value = qty - 1;
    }

    //updateprice

    document.querySelector(`#total-value`).innerText =
      Number(total_cart_price) - price;
  }

  // console.log(e.target.className);
  // console.log(e.target.id);

  //removefrom cart

  if (e.target.id === "display-cart") {
    //show cart

    cartBox.style.display = "flex";

    console.log(document.querySelector("#cart"));
  }

  if (e.target.className == "cancel") {
    // hide cart
    cartBox.style = "display:none;";
  }
});

//cart at nav
const cart_btn = document.querySelector(".cart-holder");
cart_btn.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("cart").style.display = "flex";
});

//update Total price
