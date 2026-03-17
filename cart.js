let cart = JSON.parse(localStorage.getItem("cart")) || []

function addToCart(id){

const product = products.find(p => p.id === id)

cart.push(product)

localStorage.setItem("cart", JSON.stringify(cart))

alert(product.name + " added to cart")

displayCart()

}

function displayCart(){

const container = document.getElementById("cart-container")

if(!container) return

container.innerHTML = ""

let total = 0

cart.forEach((item,index)=>{

total += item.price

container.innerHTML += `

<div class="cart-item">

<img src="${item.image}">

<h3>${item.name}</h3>

<p>₹${item.price}</p>

<button onclick="removeItem(${index})">
Remove
</button>

</div>

`

})

container.innerHTML += `<h2>Total: ₹${total}</h2>`

}

function removeItem(index){

cart.splice(index,1)

localStorage.setItem("cart", JSON.stringify(cart))

displayCart()

}

displayCart()
