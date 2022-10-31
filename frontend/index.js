const parentEle = document.getElementById("Ecomm"); // ecomm parent ele for all products and cart

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

// displayProductOnDOM

function displayProductOnDOM(product) {
  let productsList = document.getElementById("products");

  let newProduct = `
    <div class="item" id="${product.id}">
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
