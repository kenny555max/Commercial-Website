console.log("Live reload enabled!");

let url = document.documentURI;

let getProductId = parseInt(url.split("?")[1].split("=")[1]);

function products() {
    let productArray = JSON.parse(localStorage.getItem("product"));

    if (productArray === null) {
        return;
    }

    document.querySelector(".display-products").innerHTML = "";
    
    let item = productArray.filter(product => product.productId === getProductId);
    
    const {productId, productImage, productName, productPrice} = item[0];

    document.querySelector(".display-products").innerHTML = ` <div class="item d-flex bg-light p-4 shadow-lg">
                                                                <div class="item-image">
                                                                    <img src="${productImage}" alt="item-image">
                                                                </div>

                                                                <div class="item-details d-flex pl-2 flex-column justify-content-between">
                                                                    <div class="item-id">
                                                                        <h5>Product-Id: ${productId}</h5>
                                                                    </div>
                                                                    <div class="item-name">
                                                                        <h3>Product-name: ${productName}</h3>
                                                                    </div>
                                                                    <div class="item-price">
                                                                        <h5>Product-Price: $${productPrice}</h5>
                                                                    </div>
                                                                </div>
                                                            </div>`;
}

products();