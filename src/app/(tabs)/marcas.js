import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Marcas() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar marcas do backend
  const fetchMarcas = async () => {
    try {
      const response = await fetch("http://localhost:3333/marcas");
      const data = await response.json();
      setBrands(data);
      if (data.length > 0) setSelectedBrand(data[0].nome.toLowerCase());
    } catch (error) {
      console.error("Erro ao carregar marcas:", error);
    }
  };

  // Função para carregar produtos do backend
  const fetchProdutos = async () => {
    try {
      const response = await fetch("http://localhost:3333/produtos");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarcas();
    fetchProdutos();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.marca &&
      p.marca.nome.toLowerCase() === selectedBrand
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#9cf" />
      </View>
    );
  }

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
              onPress={() => setSelectedBrand(brand.nome.toLowerCase())}
              style={styles.brandLogoWrapper}
            >
              <Image
                source={{ uri: brand.imagemUrl }}
                style={[
                  styles.brandLogo,
                  selectedBrand === brand.nome.toLowerCase() && styles.activeBrandLogo
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
        {selectedBrand && (
          <View style={styles.brandInfo}>
            <Text style={styles.brandTitle}>{selectedBrand.toUpperCase()}</Text>
            <Text style={styles.brandDescription}>
              {
                brands.find((b) => b.nome.toLowerCase() === selectedBrand)?.descricao ||
                "Sem descrição disponível."
              }
            </Text>
          </View>
        )}

        {/* Produtos */}
        <View style={styles.products}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.card}>
              <Image source={{ uri: product.imagem1Url }} style={styles.productImg} />
              <Text style={styles.productName}>{product.nome}</Text>
              <Text style={styles.price}>R$ {product.preco}</Text>
              <TouchableOpacity
                style={styles.buyBtn}
                onPress={() => router.push(`/marcas/${product.id}`)}
              >
                <Text style={styles.buyText}>Comprar</Text>
              </TouchableOpacity>
            </View>
          ))}

          {filteredProducts.length === 0 && (
            <Text style={{ color: "#9cf", textAlign: "center", marginTop: 30 }}>
              Nenhum produto encontrado para esta marca.
            </Text>
          )}
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
  brandsContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 8,
    marginVertical: 20,
  },
  brandLogoWrapper: {
    marginHorizontal: 10,
  },
  brandLogo: {
    width: 100,
    height: 90,
    resizeMode: "contain",
  },
  activeBrandLogo: {
    shadowColor: "#9cf",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 5,
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
