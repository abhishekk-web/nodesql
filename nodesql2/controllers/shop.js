const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  var totalItems;

    Product.count()
    .then((totals) => {
      totalItems = totals;
      return Product.findAll({
        offset: (page - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE
    })
    })
    .then(products => {
      res.json({
        products: products,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        nextPage: +page + 1,
        hasPreviousPage: page > 1,
        PreviousPage: +page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        });




      // res.render('shop/product-list', {
      //   prods: products,
      //   pageTitle: 'All Products',
      //   path: '/products'
      // });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
      
  req.user.getCart()
    .then(cart=>{

      return cart.getProducts()
      .then(products=>{
        res.status(200).json({
          success: true,
          products: products

          
        })
        // res.render('shop/cart', {
        //   path: '/cart',
        //   pageTitle: 'Your Cart',
        //   products: products
        // });
      })
      .catch(err=>{res.status(500).json({success: false, message: "Products are already there", err});
    })

    })
    .catch(err=>{res.status(500).json({success: false, message: "Products are already there", err});})

      
};

exports.postCart = (req, res, next) => {
  if(!req.body.productId){
    return res.status(400).json({success: false, message: 'Product Id is missing'});
  }
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
  .getCart()
  .then(cart=>{
    fetchedCart = cart;
    return cart.getProducts({where: {id: prodId}});
  })
  .then(products=>{
    let product;
    if(products.length>0){
      product = products[0];
    }
    
    if(product){
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      return product;
    }
    return Product.findByPk(prodId)
    
  })
  .then(product=>{
    return fetchedCart.addProduct(product, {
      through: {quantity: newQuantity}
    });
  })
  .then(()=> {
    res.status(200).json({success: true, message: 'Successfully added'});
  })
  .catch(err => {res.status(500).json({success: false, message: "Error occured"})});
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.params.id;
    CartItem.findAll({where : {productId: prodId}})
    .then(product => {
      product[0].destroy()
      .then(response =>{
        res.status(200).json({success:true , message:"deleted"})
      })
    })
    .catch(err=>res.json({err}))
};

exports.getOrders=(req,res,next)=>{
  req.user.getOrders({include:[{model:Product}]})
  .then(products=>{
    res.status(200).json({products:products});
  })
  .catch(err=>{
    console.log(err)
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postOrders = async (req, res, next) => {
  let order = await req.user.createOrder();

  let myOrders = [];
  req.user.getCart()
  .then(cart=> {
    console.log("cart items");
    cart.getProducts()
    .then(async(products)=> {
      console.log('Cart products', products)
      for(let i=0; i<products.length; i++) {
        let order_items = await order.addProduct(products[i], {
          through: {quantity: products[i].cartItem.quantity} })
          myOrders.push(order_items)
              console.log(myOrders)
         }
         CartItem.destroy({where:{cartId : cart.id}})
         .then(response=>console.log(response))
         res.status(200).json({data: myOrders , success : true})
       })
.catch(err=>console.log(err))
})
.catch((err)=>{
res.status(500).json(err)
})
}
