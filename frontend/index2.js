const parentEle = document.getElementById("Ecomm");
const cart_items = document.querySelector("#cart .cart-items");

const cartBox = document.getElementById("cart");

parentEle.addEventListener("click", (e) => {
  e.preventDefault();
  //   console.log(e.target.className);

  //add new item
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
  if (e.target.id === "display-cart") {
    cartBox.style.display = "flex";
    console.log(document.querySelector("#cart"));
  }

  // hide cart
  if (e.target.className == "cancel") {
    cartBox.style = "display:none;";
  }
});

cart_items.addEventListener("change", (e) => {
  e.preventDefault();

  if (e.target.className == "cart-qty-inp") {
    console.log(e.target.value);

    updateTotalPrice();
  }
});

//cart at nav
const cart_btn = document.querySelector(".cart-holder");
cart_btn.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("cart").style.display = "flex";
});
