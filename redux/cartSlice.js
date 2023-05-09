import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

// const cartAdapter = createEntityAdapter();
// const initialState = cartAdapter.getInitialState();

const calculateServicePrice = (state, item, serviceType) => {
  const pricing = item.pricing.find(
    (obj) =>
      obj.deliveryType == state.deliveryType &&
      obj.emirate_id === state.emirateId &&
      obj.service === serviceType
  );
  const price = pricing ? parseFloat(pricing.price) : 0;
  return Number(price.toFixed(2));
};

const initialState = {
  products: [
    // {
    //   itemID: 1,
    //   id: '',
    //   name: '',
    //   category: '',
    //   service: {
    //     type: '',
    //     price: 0,
    //   },
    //   delivery: {
    //     type: '',
    //     price: 0,
    //   },
    //   quantity: 0,
    // },
  ],
  deliveryType: '1',
  emirateId: '3',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // const {
      //   id,
      //   name,
      //   quantity,
      //   category,
      //   service,
      //   delivery,
      //   cartItem,
      //   deliveryType,
      // } = action.payload;
      // state.products.push({
      //   id,
      //   name,
      //   quantity,
      //   category,
      //   service,
      //   delivery,
      //   cartItem,
      //   deliveryType,
      // });
      const { product, serviceType, delivery, quantity } = action.payload;
      state.products.push({
        quantity,
        delivery: {
          type: delivery,
        },
        ...product,
        service: {
          type: serviceType,
          price: calculateServicePrice(state, product, serviceType),
          // price: Number(
          //   parseFloat(
          //     product.pricing.find(
          //       (obj) =>
          //         obj.deliveryType == state.deliveryType &&
          //         obj.emirate_id === state.emirateId &&
          //         obj.service === serviceType
          //     ).price
          //   ).toFixed(2)
          // ),
        },
      });
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.products = state.products.filter((item) => item.id !== id);
    },

    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.products.find((item) => item.id === id);
      if (existingItem) existingItem.quantity = quantity;
    },

    updateItemServiceType: (state, action) => {
      const {
        id,
        serviceType,
        // servicePrice
      } = action.payload;
      // console.log(`Updating item ${id} service`);
      const item = state.products.find((item) => item.id === id);
      // console.log(item);
      if (item) {
        item.service = {
          type: serviceType,
          price: calculateServicePrice(state, item, serviceType),
        };
        // console.log(
        //   `Successfully updated Item service ${item.id} to ${item.service.type}`
        // );
      }
      // console.log(`item ${id} not found`);
    },

    updateItemDelivery: (state, action) => {
      const { id, delivery } = action.payload;
      const item = state.products.find((item) => item.id === id);
      if (item) {
        item.delivery = {
          type: delivery,
        };
      }
    },
    updateCartDeliveryType(state, action) {
      const deliveryType = action.payload;
      state.deliveryType = deliveryType;
      // state.products.map((product) => {
      //   product.deliveryType = deliveryType;
      //   console.log('product' + product.deliveryType);
      //   console.log('products' + deliveryType);
      // });
    },
  },
});

export default cartSlice.reducer;
export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  updateItemServiceType,
  updateItemDelivery,
  updateDeliveryType,
} = cartSlice.actions;

// export memoized selector Fns

export const selectCart = (state) => state.cart;

// export const selectCart = createSelector(
//   (state) => state.cart,
//   (cartState) => cartState
// );

export const selectAllCartItems = createSelector(
  selectCart,
  (cartState) => cartState.products
);

export const selectCartItemById = createSelector(
  // [(state) => state.cart, (state, itemId) => itemId],
  [selectCart, (state, itemId) => itemId],
  (cartState, itemId) => {
    // if (!Boolean(cartItems.length)) return undefined;
    const item = cartState.products.find((item) => item.id === itemId);
    // console.log('item: ', item);
    return item;
  }
);

export const selectCartTotalPrice = createSelector(selectCart, (cartState) => {
  if (!Boolean(cartState.products.length)) return 0;
  const price = cartState.products.reduce((totalPrice, cartItem) => {
    return totalPrice + cartItem.quantity * cartItem.service.price;
  }, 0);

  return parseFloat(price.toFixed(2));
});

export const selectCartTotalQuantity = createSelector(
  selectCart,
  (cartState) => {
    if (!Boolean(cartState.products.length)) return 0;
    return cartState.products.reduce((totalQty, cartItem) => {
      return totalQty + cartItem.quantity;
    }, 0);
  }
);

export const selectItemTotalPrice = createSelector(
  [
    selectCart,
    (state, itemId) =>
      state.cart.products.find((cartItem) => cartItem.id === itemId),
  ],

  (cartState, item) => {
    // console.log('total price: ', item);
    if (!item) return 0;
    const price = item.quantity * item.service.price;
    return Number(price.toFixed(2));
  }
);

export const selectCartDeliveryType = createSelector(
  selectCart,
  (cartState) => cartState.deliveryType
);

export const selectCartEmirateId = createSelector(
  selectCart,
  (cartState) => cartState.emirateId
);
