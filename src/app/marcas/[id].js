import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Animated, Easing } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useRef, useEffect } from "react";

const products = [
  { id: 1, name: "Nike Air Max Plus OG", price: "1099,99", img: require("../../../assets/products/AirMaxPlus.png") },
  { id: 2, name: "Nike Air Max DN8", price: "1299,99", img: require("../../../assets/products/Dn8.png") },
  { id: 3, name: "Air Jordan 1", price: "899,99", img: require("../../../assets/products/Jordan1.png") },
  { id: 4, name: "Adidas Forum Low", price: "749,99", img: require("../../../assets/products/Adi2000.png") },
  { id: 5, name: "New Balance 1906R", price: "1.199,99", img: require("../../../assets/products/NewBalance1906.png") },
  { id: 6, name: "Air Jordan 3", price: "1.199,99", img: require("../../../assets/products/Jordan3.png") },
];

export default function ProductPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const product = products.find((p) => p.id == id);

  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (modalVisible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [modalVisible]);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Produto não encontrado</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#0a0f1a", "#131b2a"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/marcas")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#9cf" />
        </TouchableOpacity>
        <Text style={styles.title}>COMPRAR</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{product.name}</Text>
          <Image style={styles.productImg} source={product.img} />
          <View style={styles.info}>
            <Text style={styles.price}>R$ {product.price}</Text>
            <Text style={styles.desc}>
              Explore o conforto e o estilo do {product.name}. Um clássico repaginado com design moderno e materiais premium.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.buyBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#9cf", "#70a8ff"]}
            style={styles.buyBtnGradient}
          >
            <Text style={styles.buyText}>Finalizar compra</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de confirmação */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalBox, { transform: [{ scale: scaleAnim }] }]}>
            <Ionicons name="checkmark-circle" size={80} color="#9cf" style={{ marginBottom: 10 }} />
            <Text style={styles.modalTitle}>Compra Confirmada!</Text>
            <Text style={styles.modalMsg}>Seu pedido foi processado com sucesso.</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                setModalVisible(false);
                setTimeout(() => router.push("/home"), 400);
              }}
            >
              <Text style={styles.closeText}>Voltar à Home</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: "rgba(156,204,255,0.1)",
    borderRadius: 30,
    padding: 8,
  },
  title: { 
    color: "#fff", 
    fontSize: 28, 
    fontFamily: "BebasNeue", 
    flexShrink: 1 
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.03)",
    margin: 24,
    marginTop: "4rem",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: {
    color: "#ddd",
    textAlign: "center",
    padding: "1rem",
    fontFamily: "BebasNeue",
    fontSize: 30,
  },
  productImg: { 
    width: "100%", 
    height: 300, 
    resizeMode: "contain", 
  },
  info: { 
    marginTop: 12, 
    padding: 14,
  },
  price: {
    color: "#9cf",
    fontSize: 22,
    fontFamily: "PoppinsBold",
    textAlign: "center",
    marginBottom: 10,
  },
  desc: {
    color: "#f4f4f492",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    fontFamily: "PoppinsRegular",
  },
  buyBtn: { marginHorizontal: 50, marginTop: 30, borderRadius: 30, overflow: "hidden" },
  buyBtnGradient: { paddingVertical: 14, borderRadius: 30 },
  buyText: {
    color: "#000",
    textAlign: "center",
    fontFamily: "PoppinsBold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: 280,
    backgroundColor: "#0f1624",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 18,
    marginBottom: 6,
  },
  modalMsg: {
    color: "#ccc",
    fontFamily: "PoppinsRegular",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  closeBtn: {
    backgroundColor: "#9cf",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  closeText: {
    color: "#000",
    fontFamily: "PoppinsBold",
    fontSize: 15,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#080f18" },
});
