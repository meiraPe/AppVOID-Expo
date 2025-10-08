import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Mock de produtos
const pendingProducts = [
  {
    id: 1,
    name: "Camiseta Cold Blanks Heavy Oversized Off",
    color: "Bege",
    size: "P",
    price: "89,00",
    orderId: "00001",
    img: require("../../../assets/products/CamisaBranca.png"),
  },
];

const paidProducts = [
  {
    id: 2,
    name: "Camiseta Cold Blanks Heavy Oversized Off",
    color: "Preto",
    size: "GG",
    price: "89,00",
    orderId: "00002",
    img: require("../../../assets/products/CamisaPreta.png"),
  },
];

export default function Sacola() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#080f18", "#0f1824"]} style={styles.container}>
      {/* Header Mobile */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#9cf" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sua Sacola</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100, gap: 20 }}>
        {/* Compras Pendentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDivider}></View>
            <Text style={styles.sectionTitle}>COMPRAS PENDENTES</Text>
            <View style={styles.sectionDivider}></View>
          </View>

          {pendingProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image source={product.img} style={styles.productImg} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productColor}>{product.color}</Text>
                <View style={styles.productSize}>
                  <Text style={styles.sizeText}>{product.size}</Text>
                </View>
              </View>

              <View style={styles.productPayment}>
                <View style={[styles.paymentStatus, styles.pending]}>
                  <Text style={styles.paymentText}>INICIADO</Text>
                </View>

                <View style={styles.productPrice}>
                  <Text style={styles.pricePrefix}>R$</Text>
                  <Text style={styles.priceValue}>{product.price}</Text>
                </View>

                <Text style={styles.orderId}>PEDIDO #{product.orderId}</Text>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => router.push("/checkout")}
                >
                  <Text style={styles.actionText}>CONTINUAR COMPRA</Text>
                  <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Compras Pagas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDivider}></View>
            <Text style={styles.sectionTitle}>COMPRAS PAGAS</Text>
            <View style={styles.sectionDivider}></View>
          </View>

          {paidProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image source={product.img} style={styles.productImg} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productColor}>{product.color}</Text>
                <View style={styles.productSize}>
                  <Text style={styles.sizeText}>{product.size}</Text>
                </View>
              </View>

              <View style={styles.productPayment}>
                <View style={[styles.paymentStatus, styles.paid]}>
                  <Text style={styles.paymentText}>PAGO</Text>
                </View>

                <View style={styles.productPrice}>
                  <Text style={styles.pricePrefix}>R$</Text>
                  <Text style={styles.priceValue}>{product.price}</Text>
                </View>

                <Text style={styles.orderId}>PEDIDO #{product.orderId}</Text>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => router.push("/checkout")}
                >
                  <Text style={styles.actionText}>MONITORAR COMPRA</Text>
                  <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    backgroundColor: "rgba(156,204,255,0.1)",
    borderRadius: 30,
    padding: 8,
    marginRight: 2,
  },
  headerTitle: {
    fontFamily: "BebasNeue",
    fontSize: 32,
    color: "#9cf",
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sectionDivider: {
    height: 2,
    flex: 1,
    backgroundColor: "#9cf",
  },
  sectionTitle: {
    fontFamily: "PoppinsBold",
    fontSize: 16,
    color: "#fff",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  productCard: {
    flexDirection: "column",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 24,
  },
  productImg: {
    width: 130,
    height: 130,
    borderRadius: 12,
    resizeMode: "contain",
  },
  productDetails: {
    alignItems: "center",
    gap: 4,
  },
  productName: {
    fontFamily: "PoppinsBold",
    fontSize: 14,
    textAlign: "center",
    color: "#fff",
  },
  productColor: {
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    color: "#9cf",
  },
  productSize: {
    backgroundColor: "#0f1824",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#9cf",
  },
  sizeText: {
    fontFamily: "PoppinsBold",
    fontSize: 12,
    color: "#9cf",
  },
  productPayment: {
    alignItems: "center",
    gap: 4,
    width: "100%",
  },
  paymentStatus: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pending: {
    backgroundColor: "#1E90FF",
  },
  paid: {
    backgroundColor: "#01830c",
  },
  paymentText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 12,
    textAlign: "center",
  },
  productPrice: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  pricePrefix: {
    fontFamily: "PoppinsRegular",
    fontSize: 12,
    color: "#9cf",
  },
  priceValue: {
    fontFamily: "PoppinsBold",
    fontSize: 16,
    color: "#fff",
  },
  orderId: {
    fontSize: 10,
    color: "#9cf",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#9cf",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    marginTop: 6,
  },
  actionText: {
    color: "#000",
    fontFamily: "PoppinsBold",
    fontSize: 12,
  },
});
