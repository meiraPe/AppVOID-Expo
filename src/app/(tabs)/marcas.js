import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

// Lista de marcas
const brands = [
  { id: 1, name: "nike", logo: require("../../../assets/brands/nike.png") },
  { id: 2, name: "adidas", logo: require("../../../assets/brands/adidas.png") },
  { id: 3, name: "jordan", logo: require("../../../assets/brands/jordan.png") },
  { id: 4, name: "newbalance", logo: require("../../../assets/brands/newbalance.png") },
];

// Mock de produtos
const products = [
  { id: 1, brand: "nike", name: "Nike Air Max Plus OG", price: "1099,99", img: require("../../../assets/products/AirMaxPlus.png") },
  { id: 2, brand: "nike", name: "Nike Air Max DN8", price: "1299,99", img: require("../../../assets/products/Dn8.png") },
  { id: 3, brand: "jordan", name: "Air Jordan 1", price: "899,99", img: require("../../../assets/products/Jordan1.png") },
  { id: 4, brand: "adidas", name: "Adidas Forum Low", price: "749,99", img: require("../../../assets/products/Adi2000.png") },
  { id: 5, brand: "newbalance", name: "New Balance 1906R", price: "1.199,99", img: require("../../../assets/products/NewBalance1906.png") },
  { id: 6, brand: "jordan", name: "Air Jordan 3", price: "1.199,99", img: require("../../../assets/products/Jordan3.png") },
];

export default function Marcas() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("nike");

  const filteredProducts = products.filter((p) => p.brand === selectedBrand);

  return (
    <LinearGradient colors={["#080f18", "#0f1824"]} style={styles.container}>
      {/* Header + Barra de Marcas fixa */}
      <View style={{ paddingBottom: 20 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={26} color="#9cf" />
            </TouchableOpacity>
            <Text style={styles.title}>Marcas</Text>
          </View>

          <TouchableOpacity onPress={() => setSidebarOpen(!sidebarOpen)} style={styles.menuButton}>
            <Ionicons name="filter" size={26} color="#9cf" />
          </TouchableOpacity>
        </View>

        {/* Barra de Marcas horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandsContainer}
        >
          {brands.map((brand) => (
            <TouchableOpacity
              key={brand.id}
              onPress={() => setSelectedBrand(brand.name)}
              style={styles.brandLogoWrapper}
            >
              <Image
                source={brand.logo}
                style={[
                  styles.brandLogo,
                  selectedBrand === brand.name && styles.activeBrandLogo
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Produtos roláveis */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {sidebarOpen && (
          <View style={styles.sidebar}>
            <Text style={styles.filterItem}>ORDENAR POR</Text>
            <Text style={styles.filterItem}>CATEGORIA</Text>
            <Text style={styles.filterItem}>TAMANHOS</Text>
            <Text style={styles.filterItem}>CONDIÇÃO</Text>
            <Text style={styles.filterItem}>MARCA</Text>
            <Text style={styles.filterItem}>COR</Text>
            <Text style={styles.filterItem}>PREÇO</Text>
          </View>
        )}

        {/* Descrição da marca */}
        <View style={styles.brandInfo}>
          <Text style={styles.brandTitle}>{selectedBrand.toUpperCase()}</Text>
          <Text style={styles.brandDescription}>
            {selectedBrand === "nike" &&
              "Fundada em 1964 como Blue Ribbon Sports, a Nike é um ícone global de inovação esportiva e cultural."}
            {selectedBrand === "adidas" &&
              "A Adidas, fundada em 1949 na Alemanha, é sinônimo de performance e estilo urbano."}
            {selectedBrand === "jordan" &&
              "Criada em parceria com Michael Jordan, a Jordan Brand é referência em design e cultura sneaker."}
            {selectedBrand === "newbalance" &&
              "A New Balance combina conforto e tradição, sendo reconhecida por seus tênis casuais e esportivos."}
          </Text>
        </View>

        {/* Produtos */}
        <View style={styles.products}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.card}>
              <Image source={product.img} style={styles.productImg} />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.price}>R$ {product.price}</Text>
              <TouchableOpacity
                style={styles.buyBtn}
                onPress={() => router.push(`/marcas/${product.id}`)}
              >
                <Text style={styles.buyText}>Comprar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 15,
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
  menuButton: {
    backgroundColor: "rgba(156,204,255,0.1)",
    borderRadius: 30,
    padding: 8,
  },
  title: {
    fontFamily: "BebasNeue",
    fontSize: 32,
    color: "#9cf",
  },

  // Barra de marcas
 brandsContainer: {
  justifyContent: "center",   // centraliza horizontalmente
  alignItems: "center",
  paddingHorizontal: 10,      // evita corte do glow nas extremidades
  gap: 8,                     // espaçamento entre os logos
  marginVertical: 20,          // distância do header
},

brandLogoWrapper: {
  marginHorizontal: 10,        // separação mínima entre os logos
},

brandLogo: {
  width: 100,
  height: 90,
  resizeMode: "center",
},

activeBrandLogo: {
  shadowColor: "#9cf",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.9,
  shadowRadius: 8,
  elevation: 5,
},

glowEffect: {
  position: "absolute",
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: "#9cf",
  opacity: 0.4,
  shadowColor: "#9cf",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.9,
  shadowRadius: 20,
  elevation: 10,
},

  sidebar: {
    backgroundColor: "rgba(156,204,255,0.1)",
    margin: 20,
    marginTop: 5,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  filterItem: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
  brandInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  brandTitle: {
    fontFamily: "BebasNeue",
    fontSize: 32,
    color: "#9cf",
    marginBottom: 8,
  },
  brandDescription: {
    fontFamily: "PoppinsRegular",
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
  },
  products: {
    paddingHorizontal: 20,
    gap: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 30,
    alignItems: "center",
  },
  productImg: {
    width: 300,
    height: 220,
    borderRadius: 12,
    marginBottom: 12,
  },
  productName: {
    fontFamily: "PoppinsBold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
  },
  price: {
    fontFamily: "PoppinsRegular",
    fontSize: 14,
    color: "#9cf",
    marginBottom: 10,
  },
  buyBtn: {
    backgroundColor: "#9cf",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  buyText: {
    fontFamily: "PoppinsBold",
    color: "#000",
    fontSize: 14,
  },
});
