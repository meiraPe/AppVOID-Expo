import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  const products = [
    {
      id: 1,
      name: "Air Max Plus OG",
      price: "R$ 999,90",
      image: require("../../../assets/products/AirMaxPlus.png"),
    },
    {
      id: 2,
      name: "Air Max DN8",
      price: "R$ 949,90",
      image: require("../../../assets/products/Dn8.png"),
    },
    {
      id: 3,
      name: "Dunk High",
      price: "R$ 699,90",
      image: require("../../../assets/products/Dunk.png"),
    },
  ];

  const brands = [
    { id: 1, logo: require("../../../assets/brands/nike.png") },
    { id: 2, logo: require("../../../assets/brands/adidas.png") },
    { id: 3, logo: require("../../../assets/brands/jordan.png") },
    { id: 4, logo: require("../../../assets/brands/newbalance.png") },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/logos/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="person-circle-outline" size={36} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <Image
        source={require("../../../assets/bannerHomeMobile.png")}
        style={styles.banner}
        resizeMode="cover"
      />

      {/* Sessão de produtos */}
      <Text style={styles.sectionTitle}>Destaques</Text>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image source={item.image} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Sessão de marcas */}
      <Text style={styles.sectionTitle}>Marcas</Text>
      <View style={styles.brandContainer}>
        {brands.map((brand) => (
          <View key={brand.id} style={styles.brandCard}>
            <Image
              source={brand.logo}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080f18",
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 50,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 40,
  },
  banner: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  productList: {
    gap: 16,
    paddingBottom: 10,
  },
  productCard: {
    backgroundColor: "#101926",
    borderRadius: 10,
    padding: 12,
    width: 150,
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  productPrice: {
    color: "#9cf",
    fontSize: 13,
    marginTop: 4,
  },
  brandContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
    paddingBottom: 30,
  },
  brandCard: {
    backgroundColor: "#101926",
    width: "47%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  brandLogo: {
    width: 80,
    height: 40,
  },
});
