const products = [

{ id:1, name:"Laptop", price:50000 },

{ id:2, name:"Headphones", price:2000 },

{ id:3, name:"Smartphone", price:25000 },

{ id:4, name:"Shoes", price:3000 },

{ id:5, name:"Watch", price:4000 },

{ id:6, name:"Keyboard", price:1500 }

];

let container = document.getElementById("product-list");

products.forEach(product=>{

container.innerHTML += `

<div class="product">

<h3>${product.name}</h3>

<p>₹${product.price}</p>

<button onclick="addToCart('${product.name}',${product.price})">

Add to Cart

</button>

</div>

`;

});
