console.log("Live reload enabled");

const displayProducts = document.getElementById("display-products");
const shoppingCartIcon = document.getElementById("shopping-cart-icon");
const cartBar = document.getElementById("cartBar");
const cancelBtn = document.getElementById("cancel-btn");
const displayItems = document.getElementById("display-items");
const totalPrice = document.getElementById("total-price");
const buyNow = document.getElementById("buyNow");
const search = document.getElementById("search");

// fetch api
window.onload = () => {
    fetch("product.json")
    .then(product => product.json())
    .then(data => {
        // console.log(data);
        localStorage.setItem("product", JSON.stringify(data));
        
        loadProducts();
    });
}

const loadProducts = () => {
    let productArray = JSON.parse(localStorage.getItem("product"));
    
    displayProducts.innerHTML = "";

    productArray.forEach(product => {
        const {productId, productName, productImage, productPrice} = product;
        
        displayProducts.innerHTML += `<div class="products" id="${productId}">
                                        <div class="product-image">
                                            <a href="product.html?productId=${productId}">
                                                <img src="${productImage}" alt="product image">
                                            </a>
                                        </div>
                                        <div class="product-name py-2">
                                            <h4>${productName}</h4>
                                        </div>
                                        <div class="product-option d-flex justify-content-between">
                                            <div class="product-price">$${productPrice}</div>
                                            <div class="add-to-cart">
                                                <i class="fa fa-shopping-bag" data-id="${productId}"></i>
                                            </div>
                                        </div>
                                    </div>`;
    });
}

// toggle cart bar
shoppingCartIcon.addEventListener("click", () => cartBar.classList.add("active"));
cancelBtn.addEventListener("click", () => cartBar.classList.remove("active"));

// add item to the cart
displayProducts.addEventListener("click", e => {
    if (e.target.classList.contains("fa-shopping-bag")) {
        let itemId = parseInt(e.target.dataset.id);
        
        let cartArray = JSON.parse(localStorage.getItem("cart"));

        let checkItem = [];
        
        if (cartArray !== null) {
            checkItem = cartArray.filter(cart => cart.productId === itemId);
        }

        if (checkItem.length > 0) {
            alert("Product already added to your cart!. To increase the quantity of an item, make use of the input field in your cart!");
            return;
        }
      
        let productArray = JSON.parse(localStorage.getItem("product"));

        let cartItem = productArray.filter(product => product.productId === itemId);

        let data = JSON.parse(localStorage.getItem("cart"));

        if (data) {
            let cartArray = data;
            cartArray.push(cartItem[0]);
            localStorage.setItem("cart", JSON.stringify(cartArray));
        }else{
            let cartArray = [];
            cartArray.push(cartItem[0]);
            localStorage.setItem("cart", JSON.stringify(cartArray));
        }

        displayCartItem();
    }
});

function displayCartItem() {
    let cartArray = JSON.parse(localStorage.getItem("cart"));

    if (cartArray === null) {
        return;
    }

    displayItems.innerHTML = "";
    
    cartArray.forEach(cart => {
        const {productId, productName, productImage, productPrice} = cart;

            displayItems.innerHTML += `<div class="item d-flex justify-content-between align-items-center">
                                            <div class="cart-options d-flex">
                                                <div class="item-image">
                                                    <a href="product.html?productId=${productId}">
                                                        <img src="${productImage}" alt="item-image">
                                                    </a>
                                                </div>
                                                <div class="cart-details pl-2">
                                                    <div class="product-name">
                                                        <h4>${productName}</h4>
                                                    </div>
                                                    <div class="product-price">
                                                        <h6>$<span class="cart-price">${productPrice}<span></h6>
                                                    </div>
                                                    <input type="number" min="1" max="10" data-id="${productId}" style="width: 50px;" class="quantity" value="1">
                                                </div>
                                            </div>
                                            <div class="delete-cart d-flex align-items-center text-danger">
                                                <i class="fa fa-trash" data-id="${productId}"></i>
                                            </div>
                                        </div>`;
    });

    cartBar.classList.add("active");

    total();
}

displayCartItem();

// delete item from cart
displayItems.addEventListener("click", e => {
    if (e.target.classList.contains("fa-trash")) {
        if (confirm("This item will be deleted from your cart!.")){
            let element = e.target;
            let elementID = parseInt(element.dataset.id);
    
            element.parentElement.parentElement.parentElement.removeChild(element.parentElement.parentElement);
    
            let cartArray = JSON.parse(localStorage.getItem("cart"));
    
            cartArray = cartArray.filter(cart => cart.productId !== elementID);
            
            localStorage.setItem("cart", JSON.stringify(cartArray));
            
            displayCartItem();
        }
    }
});

displayItems.addEventListener("change", e => {
    if (e.target.classList.contains("quantity")) {
        let element = e.target;
        let itemPrice = element.parentElement.querySelector(".cart-price");
        let elementID = parseInt(element.dataset.id);
        
        let cartArray = JSON.parse(localStorage.getItem("cart"));
        
        if (cartArray === null) {
            return;
        }

        let cartPrice = cartArray.filter(cart => cart.productId === elementID);
        
        let newPrice = cartPrice[0].productPrice * e.target.value;
        
        itemPrice.textContent = newPrice;

        total();
    }
})

function total() {
    let itemPrices = [...document.querySelectorAll(".cart-price")];
    
    let sum = itemPrices.reduce((total, price) => total + parseInt(price.textContent) ,0);
    
    totalPrice.textContent = sum;
}

total();

buyNow.addEventListener("click", e => {
    if (confirm("Confirm to order!")){
        alert("Order was successful!");

        localStorage.removeItem("cart");

        window.location = window.location;
    }
});

// search
search.addEventListener("input", filterItems);

function filterItems(e) {
    // filter
    let filterText = e.target.value.toLowerCase();

    let items = [...displayProducts.querySelectorAll(".products")];

    items.forEach(item => {
        let text = item.querySelector(".product-name").firstElementChild.textContent;

        if (text.toLowerCase().indexOf(filterText) != -1) {
            item.style.display = "block";
        }else{
            item.style.display = "none";
        }
    });
}