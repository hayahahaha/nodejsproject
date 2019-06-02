/* eslint-disable no-var *//* eslint-disable linebreak-style */
module.exports = function Cart(cart) {
  this.items = cart.items || {};
  this.totalItems = cart.totalItems || 0;
  this.totalPrice = cart.totalPrice || 0;

  this.add = (item, id) => {
    let cartItem = this.items[id];
    if (!cartItem) {
      // eslint-disable-next-line no-multi-assign
      cartItem = this.items[id] = { item, quantity: 0, price: 0 };
    }
    cartItem.quantity += 1;
    cartItem.price = cartItem.item.dongia * cartItem.quantity;
    this.totalItems += 1;
    this.totalPrice += cartItem.item.dongia;
  };

  this.remove = (id) => {
    this.totalItems -= this.items[id].quantity;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  };

  this.getItems = () => {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};
