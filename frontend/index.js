const parentEle = document.getElementById("Ecomm");
const cart_items = document.querySelector("#cart .cart-items");

// console.log(parentEle);

parentEle.addEventListener("click", (e) => {
  e.preventDefault();

  //   console.log(e.target.className);

  if (e.target.className == "shop-item-btn btn") {
    const id = e.target.parentElement.parentElement.id;
    // console.log(id)

    const name = document.querySelector(`#${id} h1`).innerText;

    const imgSrc = document.querySelector(`#${id} img`).src;
    const price = document.querySelector(`#${id} .product-details > span`)
      .childNodes[0].data;

    // console.log(price);

    let total_cart_price = document.querySelector("#total-value").innerText;
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
          <input type="text">
          <button>REMOVE</button>
      </span>

    `;

    // console.log(new_cart_item);
    cart_items.appendChild(new_cart_item);

    let oldCartCount = Number(document.querySelector(".cart-number").innerText);
    document.querySelector(".cart-number").innerText = oldCartCount + 1;
  }

  // console.log(e.target.className);
  // console.log(e.target.id);

  const cartBox = document.getElementById("cart");
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
