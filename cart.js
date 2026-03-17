function addToCart(name,price){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart.push({name,price});

localStorage.setItem("cart",JSON.stringify(cart));

alert("Item added to cart");

}
