import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Favoritos() {
  const router = useRouter();

  const [favoritos, setFavoritos] = useState([
    {
      id: 1,
      nome: "Nike Air Max Plus OG",
      preco: "R$ 1.099,99",
      img: require("../../../assets/products/AirMaxPlus.png"),
    },
    {
      id: 2,
      nome: "Nike Dunk High",
      preco: "R$ 499,99",
      img: require("../../../assets/products/Dunk.png"),
    },
  ]);

  const [popupVisible, setPopupVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const mostrarPopup = () => {
    setPopupVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setPopupVisible(false));
      }, 1600);
    });
  };

  const removerFavorito = (id) => {
    setFavoritos(favoritos.filter((item) => item.id !== id));
  };

  const adicionarSacola = (item) => {
    // Aqui você pode integrar sua lógica real de adicionar à sacola
    mostrarPopup();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/home")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color="#9cf" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favoritos</Text>
      </View>

      {/* Lista */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {favoritos.length === 0 ? (
          <Text style={styles.vazio}>Você ainda não tem produtos favoritados 💔</Text>
        ) : (
          favoritos.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={item.img} style={styles.imagem} resizeMode="contain" />

              <View style={styles.infoBox}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.preco}>{item.preco}</Text>

                <View style={styles.divisor} />

                <View style={styles.acoes}>
                  <TouchableOpacity
                    style={styles.botao}
                    onPress={() => adicionarSacola(item)}
                  >
                    <Ionicons name="bag-outline" size={18} color="#9cf" />
                    <Text style={styles.textoBotao}>Adicionar à Sacola</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => removerFavorito(item.id)}>
                    <Ionicons name="trash-outline" size={22} color="#9cf" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Popup de Confirmação */}
      {popupVisible && (
        <Animated.View
          style={[styles.popup, { opacity: fadeAnim, transform: [{ scale: fadeAnim }] }]}
        >
          <Ionicons name="checkmark-circle-outline" size={34} color="#9cf" />
          <Text style={styles.popupText}>Adicionado à sacola com sucesso!</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080f18",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    backgroundColor: "rgba(156,204,255,0.1)",
    borderRadius: 30,
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: "BebasNeue",
    color: "#9cf",
    fontSize: 32,
    letterSpacing: 1,
  },
  scroll: {
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "#0d1a2b",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  imagem: {
    width: 100,
    height: 100,
  },
  infoBox: {
    flex: 1,
  },
  nome: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  preco: {
    color: "#9cf",
    marginTop: 4,
    fontWeight: "500",
  },
  divisor: {
    height: 1,
    backgroundColor: "#9cf",
    opacity: 0.3,
    marginVertical: 10,
  },
  acoes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  textoBotao: {
    color: "#9cf",
    fontSize: 14,
    fontWeight: "600",
  },
  vazio: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 100,
    fontSize: 16,
  },
  popup: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "#0d1a2b",
    borderWidth: 1,
    borderColor: "#9cf",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#9cf",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  popupText: {
    color: "#9cf",
    fontWeight: "600",
    fontSize: 15,
  },
});
