
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { ColorPalate, Colors } from "../constants/colors";
import Button from "../components/Button";
import { reviewData } from "../data";
import {
  getTotal,
  removeItem,
  removeOthers,
  updateOthers,
} from "../redux/cartSlice";
import Title from "../components/Title";
import { TouchableOpacity } from "react-native";
import { useEffect } from "react";

const ReviewOrder = ({ route }) => {
  const filteredCart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  // -----------------------
  const dates = route.params.dates;
  const pickupDateString = dates.pickupDate.toISOString().substring(0, 10);
  const deliveryDateString = dates.deliveryDate.toISOString().substring(0, 10);
  const notes = route.params.notes;

  // -----------------------
  const cartItems = filteredCart.products.map((product, index) => ({
    id: product.itemID,
    name: product.item_name,
    img: product.itemImage,
    cat: product.cat,
    product: product,
    selectedServiceButton: filteredCart.others[index].selectedButton,
    selectedDeliveryButton: filteredCart.others[index].selectDelivery,
    price: product.pricing.filter(
      (item) =>
        item.emirate_id === "3" &&
        item.deliveryType == filteredCart.items[index].deliveryType &&
        item.service == filteredCart.others[index].selectedButton
    ),
    filDel:filteredCart.items[index].deliveryType,
    qty: filteredCart.others[index].qty,
  }));

  const handleDeleteItem = (itemID) => {
    dispatch(removeItem({ itemID }));
    filteredCart.items.map((i) => {
      dispatch(
        getTotal({
          itemID: i.itemID,
          service: i.service,
          deliveryType: i.deliveryType,
        })
      );
    });
  };

  
  const handleUpdateQuantity = (itemID, action) => {
    const item = filteredCart.others.find((o) => o.itemID === itemID);
    if (item && (action === 'increase' || (action === 'decrease' && item.qty > 0))) {
      const newQty = action === 'increase' ? item.qty + 1 : item.qty - 1;
    newQty === 0 &&  handleDeleteItem(itemID)
      dispatch(
        updateOthers({
          others: {
            itemID,
            qty: newQty,
            selectedButton: item.selectedButton,
            deliveryPrice: item.deliveryPrice,
          },
        })
      );
  
      filteredCart.items.map((i) => {
        dispatch(
          getTotal({
            itemID: i.itemID,
            service: i.service,
            deliveryType: i.deliveryType,
          })
        );
      });
    }
  };
  const renderItem = ({ item }) => {
    


    console.log("deliveryType checking", item.itemDel ); 
    console.log("price", item.price ); 
    console.log("filteredCart", filteredCart.others ); 

    return (
      <View style={styles.item}>
        <View style={{ flex: 2 }}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemName}>
            {item.selectedServiceButton} &{" "}
            {item.selectedDeliveryButton !== undefined
              ? item.selectedDeliveryButton
              : "working"}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
      <Button title="-" onPress={() => handleUpdateQuantity(item.id, 'decrease')} />
<Text style={styles.itemName}> {item.qty}</Text>
<Button title="+" onPress={() => handleUpdateQuantity(item.id, 'increase')} />
          <Text style={styles.itemName}> {item.price[0].price * item.qty}</Text>
        </View>
        <Button title="delete" onPress={() => handleDeleteItem(item.id)} />
      </View>
    );
  };

  return (
    <View>
      <Title text="Cart List Item here"></Title>
      <View>
        <Text style={styles.dateText}>
          mode :{" "}
          {
            "show the mode which mode we select(deleveryType) standard/express/same day"
          }{" "}
        </Text>
        <Text style={styles.dateText}>pickup date : {pickupDateString} </Text>
        <Text style={styles.dateText}>
          delivery date : {deliveryDateString}{" "}
        </Text>
        <Text style={styles.specialRequestText}>special request : {notes}</Text>
      </View>
      <ScrollView>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.itemID}
          renderItem={renderItem}
        />
      </ScrollView>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ textAlign: "right", color: ColorPalate.dgrey }}>
          Total amount : {filteredCart.total} | Total Quantity : {filteredCart.totalQty}
        </Text>
      </View>
      <View style={styles.totalContainer}>
        <TouchableOpacity>
          <Text style={styles.totalText}>Order </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  item: {
    marginVertical: 5,
    padding: 20,
    backgroundColor: ColorPalate.white,
    borderRadius: 5,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: ColorPalate.themeprimary,
    marginBottom: 5,
  },
  specialRequestText: {
    fontSize: 16,
    color: ColorPalate.themeprimary,
    fontStyle: "italic",
    marginBottom: 10,
  },
  title: {
    textTransform: "uppercase",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  itemName: {
    textTransform: "capitalize",
    fontSize: 14,
    color: ColorPalate.themeprimary,
    marginBottom: 10,
  },
  totalContainer: {
    backgroundColor: ColorPalate.themesecondary,
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: "center",
    flexDirection: "row",
  },
  totalText: {
    color: ColorPalate.white,
    fontSize: 18,
  },
});

export default ReviewOrder;
