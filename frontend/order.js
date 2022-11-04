const GoToOrderBtn = document.getElementById("GoToOrder");

GoToOrderBtn.addEventListener("click", (e) => {
  e.preventDefault();

  fetchOrders();
});

async function fetchOrders() {}
