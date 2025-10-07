import React from "react";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    BebasNeue: require("../../../assets/fonts/BebasNeue-Regular.ttf"),
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  const products = [
    { id: 1, name: "Air Max Plus OG", price: "R$ 999,90", image: require("../../../assets/products/AirMaxPlus.png") },
    { id: 2, name: "Air Max DN8", price: "R$ 949,90", image: require("../../../assets/products/Dn8.png") },
    { id: 3, name: "Dunk High", price: "R$ 699,90", image: require("../../../assets/products/Dunk.png") },
    { id: 4, name: "Jordan 1", price: "R$ 799,90", image: require("../../../assets/products/Jordan1.png") },
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
          source={require("../../../assets/logos/logoWhite.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="person-circle-outline" size={36} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={require("../../../assets/logos/bannerHomeMobile.png")}
          style={styles.bannerImage}
          imageStyle={styles.bannerImageStyle}
          resizeMode="cover"
        >
          <View style={styles.bannerOverlay}>
            <View style={styles.bannerTextBox}>
              <Text style={styles.bannerTitle}>
                Os Melhores Produtos {"\n"}Você Encontra Aqui
              </Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Ver Mais</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Marcas */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Marcas</Text>
      </View>

      <FlatList
        data={brands}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.brandList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.brandCard}>
            <Image source={item.logo} style={styles.brandLogo} resizeMode="contain" />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Sneakers em destaque */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sneakers em Destaque</Text>
        <TouchableOpacity>
          <Text style={styles.sectionLink}>Ver mais</Text>
        </TouchableOpacity>
      </View>

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
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Chamada final */}
      <View style={styles.ctaContainer}>
        <Text style={styles.ctaTitle}>Faça Parte da Comunidade</Text>
        <Text style={styles.ctaSubtitle}>
          Receba ofertas exclusivas e novidades primeiro!
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Cadastrar-se</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080f18",
  },
  header: {
    marginTop: 50,
    marginBottom: 30,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 40,
  },
  bannerContainer: {
    width: "100%",
    height: 280,
    marginBottom: 30,
    overflow: "hidden",
  },
  bannerImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  bannerImageStyle: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  bannerTextBox: {
    maxWidth: "75%",
  },
  bannerTitle: {
    fontFamily: "BebasNeue",
    color: "#fff",
    fontSize: 30,
    lineHeight: 36,
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: "#ffffff33",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    fontFamily: "PoppinsRegular",
    color: "#fff",
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: "BebasNeue",
    color: "#fff",
    fontSize: 22,
  },
  sectionLink: {
    fontFamily: "PoppinsRegular",
    color: "#9cf",
    fontSize: 13,
  },
  brandList: {
    paddingLeft: 16,
    gap: 16,
    marginBottom: 30,
  },
  brandCard: {
    backgroundColor: "#101926",
    borderRadius: 12,
    padding: 20,
    width: 100,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  brandLogo: {
    width: 70,
    height: 35,
  },
  productList: {
    paddingLeft: 16,
    gap: 16,
    paddingBottom: 30,
  },
  productCard: {
    backgroundColor: "#101926",
    borderRadius: 12,
    width: 160,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  productImage: {
    width: "100%",
    height: 120,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontFamily: "PoppinsBold",
    color: "#fff",
    fontSize: 14,
  },
  productPrice: {
    fontFamily: "PoppinsRegular",
    color: "#9cf",
    fontSize: 13,
    marginTop: 4,
  },
  ctaContainer: {
    backgroundColor: "#101926",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 40,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  ctaTitle: {
    fontFamily: "BebasNeue",
    color: "#fff",
    fontSize: 24,
    marginBottom: 6,
  },
  ctaSubtitle: {
    fontFamily: "PoppinsRegular",
    color: "#ccc",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 14,
  },
  ctaButton: {
    backgroundColor: "#9cf",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  ctaButtonText: {
    fontFamily: "PoppinsBold",
    color: "#000",
    fontSize: 13,
  },
});
