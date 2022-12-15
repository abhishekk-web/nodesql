const btn = document.getElementById("btn");
const nav = document.getElementById("nav");
const closed = document.getElementById("x-close");
const pagination = document.getElementById("pagination");
const parentSection = document.getElementById('Products');


btn.addEventListener("click", () => {
    nav.classList.toggle('active');
    btn.classList.toggle('active');

});

closed.addEventListener("click", () => {
    nav.classList.toggle('active');
    btn.classList.toggle('active');

});

// notification script

const buttons = document.getElementById("buttons");
const container = document.getElementById("container");

// buttons.addEventListener("click", ()=>{
//     createNotification();
// })


function createNotification() {
    const notif = document.createElement("div");
    notif.classList.add("toast");

    notif.innerText = "item is successfully added";

    container.appendChild(notif);

    setTimeout(()=> {
        notif.remove();
    }, 3000);
}

function noCreateNotification() {
    const notif = document.createElement("div");
    notif.classList.add("toast");

    notif.innerText = "item is already in the cart";

    container.appendChild(notif);

    setTimeout(()=> {
        notif.remove();
    }, 3000);
}

function buyCart() {
    const notif = document.createElement("div");
    notif.classList.add("toast");

    notif.innerText = "Thank you for shopping";

    container.appendChild(notif);

    setTimeout(()=> {
        notif.remove();
    }, 3000);
}

// function noItem() {
//     const notif = document.createElement("div");
//     notif.classList.add("toast");

//     notif.innerText = "Please check, There is no item in the cart";

//     container.appendChild(notif);

//     setTimeout(()=> {
//         notif.remove();
//     }, 3000);
// }

// add to cart 

if(document.readyState == 'loading') {
    document.addEventListener("DOMContentLoaded", ready)
}else {
    ready()
}

function ready() {

    var removeCartItemButtons = document.getElementsByClassName("btn-danger");
    console.log(removeCartItemButtons);
    for(var i=0; i< removeCartItemButtons.length; i++){
        var button = removeCartItemButtons[i];
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName("cart-quantity-input");
    for(var i=0; i< quantityInputs.length; i++){
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    var addToCartButtons = document.getElementsByClassName("product-btn");
    console.log(addToCartButtons);
    for(var i=0;i< addToCartButtons.length; i++){

        var button = addToCartButtons[i];
        // console.log(button);
        button.addEventListener('click', 
        addToCartClicked)
    }
    
    // purchase

    var cartitems = document.getElementsByClassName("see-the-cart-btn");
    for(var i=0;i<cartitems.length; i++){
        var carts = cartitems[i];
        carts.addEventListener('click', getCartDetails)
    }

    // var purchaseItem = document.getElementsByClassName("purchase-nav");
    // for(var i=0; i< purchaseItem.length; i++){
    //     var inputs = purchaseItem[i];
    //     inputs.addEventListener('click', purchaseItemCart);
    // }
    
    // var purchaseItem = document.getElementsByClassName("purchase-nav");
    // for(var i=0;i<purchaseItem.length; i++){
    //     var orders = purchaseItem[i];
    //     orders.addEventListener('click', getOrders);
    // }
}

function getProducts(page){
    // parentNode.innerHTML = '';
    
    parentSection.innerHTML = '';
    axios.get(`http://localhost:3000/products?page=${page}`).then((data) => {
        console.log(data);
        if(data.request.status === 200) {
            const products = data.data.products;
            
            products.forEach(product => {
                var productHtml = `
                
                    <div id="Products">
                    
                    <div class="title-product-div">
                        <h1 class="product-title">${product.title}</h1>
                    </div>
                    <div class="image-product-div">
                        <img class="product-image" src=${product.imageUrl}>
                    </div>
                    <div>
                        <h1 class="product-price">${product.price} $</h1>
                    </div>
                    <div id="container"></div>
                        <button onClick="addToCart(${product.id})" class="product-btn"><a class="product-links" href="#">Add to cart</a></button>
                    </div>
                    </div>`
                    parentSection.innerHTML += productHtml;  
                    
                     showPagination(data.data.currentPage, data.data.hasNextPage, data.data.nextPage, data.data.hasPreviousPage, data.data.PreviousPage, data.data.lastPage);
                     
            })
            
        }
        
    })
    .catch((err)=> {
        console.log(err);
    })

}

function removeItem(prodId) {

    axios
    .delete(`http://localhost:3000/cart-delete-item/${prodId}`)
    .then((result) => {
      if (result.status == 200) {
        var removeButtonClicked = document.getElementsByClassName(
          "cart-item-remove-button"
        );
        for (var i = 0; i < removeButtonClicked.length; i++) {
          var button = removeButtonClicked[i];
          button.addEventListener("click", removeCartItem);
        }
      } else {
        throw new Error();
      }
    })
    .catch((err) => console.log(err));

}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
  }

function quantityChanged(event) {
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
    

}

// function addToCartClicked(event) {
//     var button = event.target;
//     console.log(button);
//     var shopItem = button.parentElement.parentElement.parentElement;
//     console.log(shopItem);
//     var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
//     // var price = shopItem.getElementsByClassName('price-text')[0].innerText;
//     var imageSrc = shopItem.getElementsByClassName('image')[0].src;
//     console.log(title, price, imageSrc);
//     addItemToCart(title, price, imageSrc);
//     updateCartTotal();
//     // createNotification()

    
    
// }

// function addItemToCart(title, price, imageSrc) {
//     var cartRow = document.createElement('div');
    
//     var cartItems = document.getElementsByClassName('cart-items')[0];
//     console.log(cartItems);
//     var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    
    
//     for(var i=0; i<cartItemNames.length; i++){
//         if(cartItemNames[i].innerText == title) {
//             noCreateNotification();
//             return;
//         }
//     }
//     var cartRowContents = `<div class="cart-flex">
//     <div>
//         <p class="cart-item-title">${title}</p>
//         <img class="cart-item-image" src="${imageSrc}" height="50" width="50">
//     </div>
//     <div class="cart-price-bottom">
//         <p class="cart-price">${price}</p>
//     </div>
//     <div class="flex-carts">
//         <input class="cart-quantity-input" type="number" value="1">
//         <button onclick="${removeCartItem}" type="button" class="btn-danger">X</button>
//     </div>
// </div>`;
// cartRow.innerHTML = cartRowContents;
// cartItems.append(cartRow);
// createNotification();
// }


function updateCartTotal()
{
      var cartItemContainer = document.getElementsByClassName('cart-items')[0]
      var cartRows = cartItemContainer.getElementsByClassName('show-cart'); 
      var total =0;
      console.log(cartRows)
      for(var i =0; i<cartRows.length;i++)
      {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-row-item-quantity')[0]
        var price = parseFloat(priceElement.innerText)
        var quantity = quantityElement.value
        total = total + (price*quantity);

      }
      total = Math.round(total);
      console.log(total);
      document.getElementsByClassName('dollar-nav')[0].innerText = '$' + total;
}



// notification of purchase

// function purchaseItemCart() {
//     var purchase = document.getElementsByClassName("cart-items")[0];
    
//     var cartRows = purchase.getElementsByClassName('cart-flex');
//     if(cartRows.length >0) {
//         buyCart();
//     }
//     else{
//         noItem();
//     }
// }
//

window.addEventListener('DOMContentLoaded', (data) => {
const page = 1;

    getProducts(page);
    
})



function showPagination(
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    PreviousPage,
    lastPage
) {

    pagination.innerHTML = '';

    if(hasPreviousPage){
        const btn2 = document.createElement('button')
        btn2.classList.add('active');
        btn2.innerHTML = PreviousPage
        btn2.addEventListener('click', () => getProducts(PreviousPage));
        pagination.appendChild(btn2)
    }

        const btn1 = document.createElement('button')
        btn1.classList.add('active');
        btn1.innerHTML = `<h3>${currentPage}</h3>`
        btn1.addEventListener('click', () => getProducts(currentPage));
        pagination.appendChild(btn1);

    if(hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.classList.add('active');
        btn3.innerHTML = nextPage
        btn3.addEventListener('click', () => getProducts(nextPage))
        pagination.appendChild(btn3);
    }
    
}

function responseNotifications(message) {
    const container = document.getElementById('container');
    const notif = document.createElement("div");
    notif.classList.add("toast");

    notif.innerText = `${message}`;
    container.appendChild(notif);

    setTimeout(()=> {
        notif.remove();
    }, 3000);
}


//

function addToCart(productId){

    var cartTitle = document.getElementsByClassName("cart-title");
    console.log(cartTitle);
    axios.post('http://localhost:3000/cart', {productId : productId})
    .then(response => {
        // console.log(response);
        if(response.status === 200) {
           
            console.log(response);
            responseNotifications(response.data.message);

        }else{
            throw new Error(response.data.message);
        }
    })
    .catch((err)=> {
        console.log(err);
        responseNotifications(err);
    })

}

function getCartDetails(){
    
    axios.get('http://localhost:3000/cart')
    .then(response => {
        console.log(response);
        var parentElement = document.getElementById("cart-item");
        console.log(parentElement);
        var carts = parentElement.getElementsByClassName("cart-title");
        console.log(carts);

        for(var i=0;i<carts.length; i++ ){
            var cartsTwo = carts[i].innerText;
            console.log(cartsTwo);
        }

        // for(var i=0;i<carts.length; i++ ){
        //     console.log(carts[i]);
        // }
        for (let i = 0; i < response.data.products.length; i++) {
        var titles = response.data.products[i].title;
        }
        // var cartsTwo = cartsOne.getElementsByClassName("cart-items-row-column");
        // console.log(cartsTwo);
        // var cartTitles = document.getElementsByClassName("cart-title");
        // console.log(cartTitles);
        if(cartsTwo == titles){
            console.log("item is already there");
        }
        
      let container = "";
      for (let i = 0; i < response.data.products.length; i++) {
        const title = response.data.products[i].title;
        let imageUrl = response.data.products[i].imageUrl;
        let price = response.data.products[i].price;
        let prodId = response.data.products[i].id;
        
        container += `
            <div class="show-cart" id="show-carts">
              <div class="cart-items-row-column">
                <img src="${imageUrl}" class="cart-images" alt="" width="50" >
                <span class="cart-title">${title}</span>
              </div>
            
              <div >
                <span class="cart-price">${price} $</span>
                <input type="number"  class="cart-row-item-quantity"  value="1">
                <button class="cart-item-remove-button" onclick="removeItem(${prodId})">REMOVE</button>
              </div>
            </div>`;
        
      }
      parentElement.innerHTML = container;
      updateCartTotal();
    })
    .catch(err=>{
        responseNotifications(err);
    })
}

window.addEventListener('DOMContentLoaded',()=>{
    axios.get("http://localhost:3000/orders")
    .then(response =>{
        console.log(response)
       let purchase = document.getElementById('purchase')
       for(let i =0;i<response.data.products.length;i++)
       {
            
        
        for(let j=0;j<response.data.products[i].products.length;j++)
        {
          
           purchase.innerHTML+=`<div>
           orderid:${response.data.products[i].id}-${response.data.products[i].products[j].price} -
           <img src=${response.data.products[i].products[j].imageUrl} width="100">
           </div>`
        }
    }
     
    })
    .catch(err => console.log(err))
 })

 const purchaseBtn = document.getElementById('purchase-btn');

 purchaseBtn.addEventListener('click',(productId)=>{
     console.log("purchaseid")
     axios.post(`http://localhost:3000/createorder`,{productId : productId})
    .then(response =>{
     console.log("purchase",response)
    })
     .catch(err =>console.log(err))
 })