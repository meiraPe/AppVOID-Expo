import React, { useEffect, useState } from "react";
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
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const router = useRouter();
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  const [fontsLoaded] = useFonts({
    BebasNeue: require("../../../assets/fonts/BebasNeue-Regular.ttf"),
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resBrands = await fetch("http://localhost:3333/marcas");
        const dataBrands = await resBrands.json();
        setBrands(dataBrands);

        const resProducts = await fetch("http://localhost:3333/produtos?marca=nike&destaque=true");
        const dataProducts = await resProducts.json();
        setProducts(dataProducts);
      } catch (error) {
        console.log("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/logos/logoWhite.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => router.push("/modal/profile")}>
          <Ionicons name="person-circle-outline" size={38} color="#9cf" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={styles.bannerWrapper}>
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={require("../../../assets/logos/bannerHomeMobile.png")}
            style={styles.bannerImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.1)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.bannerGradient}
            >
              <View style={styles.bannerTextBox}>
                <Text style={styles.bannerTitle}>
                  Os Melhores Produtos {"\n"}Você Encontra Aqui
                </Text>
                <TouchableOpacity onPress={() => router.push("/marcas")} style={styles.bannerButton}>
                  <Text style={styles.bannerButtonText}>Ver Mais</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
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
            <Image source={{ uri: item.imagemUrl }} style={styles.brandLogo} resizeMode="contain" />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Produtos em destaque */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sneakers Nike em Destaque</Text>
      </View>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.productCard,
              pressed && { transform: [{ scale: 0.97 }], shadowColor: "#9cf" },
            ]}
            onPress={() => router.push(`/marcas/${item.id}`)}
          >
            <Image source={{ uri: item.imagem1Url }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.nome}</Text>
              <Text style={styles.productPrice}>R$ {item.preco.toFixed(2)}</Text>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Chamada final */}
      <View style={styles.ctaContainer}>
        <Text style={styles.ctaTitle}>Faça Parte da Comunidade</Text>
        <Text style={styles.ctaSubtitle}>
          Receba ofertas exclusivas e novidades primeiro!
        </Text>
        <TouchableOpacity onPress={() => router.push("/modal/signin")} style={styles.ctaButton}>
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

  // Banner
  bannerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: "1rem"
  },
  bannerContainer: {
    width: "100%",
    height: 280,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
    backgroundColor: "#0f1824",
  },
  bannerImage: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  bannerGradient: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  bannerTextBox: {
    maxWidth: "75%",
  },
  bannerTitle: {
    fontFamily: "BebasNeue",
    color: "#fff",
    fontSize: 28,
    lineHeight: 38,
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 8,
    maxWidth: 110,
    paddingHorizontal: 25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  bannerButtonText: {
    fontFamily: "PoppinsRegular",
    color: "#fff",
    fontSize: 13,
  },

  // Marcas
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
  brandList: {
    paddingLeft: 16,
    gap: 16,
    marginBottom: 30,
  },
  brandCard: {
    backgroundColor: "#0f1824",
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

  // Produtos
  productList: {
    paddingLeft: 16,
    gap: 16,
    paddingBottom: 30,
  },
  productCard: {
    backgroundColor: "#0f1824",
    borderRadius: 14,
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

  // Chamada final
  ctaContainer: {
    backgroundColor: "#0f1824",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 50,
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
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  ctaButtonText: {
    fontFamily: "PoppinsBold",
    color: "#000",
    fontSize: 13,
  },
});
