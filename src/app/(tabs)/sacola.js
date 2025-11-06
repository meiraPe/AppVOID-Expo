import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Sacola() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [trackingVisible, setTrackingVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pendingProducts, setPendingProducts] = useState([]);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  async function carregarSacola() {
    try {
      const usuarioStr = await AsyncStorage.getItem("usuario");
      if (!usuarioStr) return;

      const usuario = JSON.parse(usuarioStr);
      const usuarioId = usuario.id;
      if (!usuarioId) return;

      const res = await fetch(`http://localhost:3333/sacolas/${usuarioId}`);
      const sacola = await res.json();

      const produtosCompletos = sacola.itens.map((item) => ({
        ...item.produto,
        quantidade: item.quantidade,
        itemId: item.id,
      }));

      setPendingProducts(produtosCompletos);
    } catch (error) {
      console.error("Erro ao carregar sacola:", error);
    }
  }

  useEffect(() => {
    carregarSacola();
  }, []);

  useEffect(() => {
    if (trackingVisible) {
      const interval = setInterval(() => {
        setProgress((p) => (p < 3 ? p + 1 : 3));
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [trackingVisible]);

  async function removerItemSacola(itemId) {
    try {
      const usuarioStr = await AsyncStorage.getItem("usuario");
      if (!usuarioStr) return;

      const usuario = JSON.parse(usuarioStr);
      const usuarioId = usuario.id;

      const response = await fetch(`http://localhost:3333/sacolas/${usuarioId}/itens/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao remover item da sacola");

      console.log("Item removido com sucesso!");
      carregarSacola();
    } catch (error) {
      console.error(error);
    }
  }

  const paidProducts = [
    {
      id: 2,
      nome: "Nike Air Max Plus",
      cor: "Azul",
      tamanho: "42",
      preco: "859,90",
      pedidoId: "00002",
      img: require("../../../assets/products/AirMaxPlus.png"),
    },
  ];

  return (
    <LinearGradient colors={["#080f18", "#0f1824"]} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#9cf" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sua Sacola</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100, gap: 20 }}>
        {/* COMPRAS PENDENTES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDivider}></View>
            <Text style={styles.sectionTitle}>COMPRAS PENDENTES</Text>
            <View style={styles.sectionDivider}></View>
          </View>

          {pendingProducts.length === 0 ? (
            <Text style={{ color: "#9cf", textAlign: "center" }}>
              Nenhum item na sacola
            </Text>
          ) : (
            pendingProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <Image
                  source={{ uri: product.imagem1Url }}
                  style={styles.productImg}
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{product.nome}</Text>
                  <Text style={styles.productColor}>{product.descricao}</Text>
                  <View style={styles.productSize}>
                    <Text style={styles.sizeText}>Qtd: {product.quantidade}</Text>
                  </View>
                </View>

                <View style={styles.productPayment}>
                  <View style={[styles.paymentStatus, styles.pending]}>
                    <Text style={styles.paymentText}>INICIADO</Text>
                  </View>
                  <View style={styles.productPrice}>
                    <Text style={styles.pricePrefix}>R$</Text>
                    <Text style={styles.priceValue}>
                      {Number(product.preco || 0).toFixed(2)}
                    </Text>
                  </View>

                  {/* 🔸 BOTÃO REMOVER */}
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#ff6961" }]}
                    onPress={() => removerItemSacola(product.itemId)}
                  >
                    <Text style={[styles.actionText, { color: "#fff" }]}>
                      REMOVER
                    </Text>
                    <Ionicons name="remove-circle-outline" size={20} color="#fff" />
                  </TouchableOpacity>

                  {/* 🔸 BOTÃO FINALIZAR */}
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => setModalVisible(true)}
                  >
                    <Text style={styles.actionText}>FINALIZAR COMPRA</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* COMPRAS PAGAS */}
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
                <Text style={styles.productName}>{product.nome}</Text>
                <Text style={styles.productColor}>{product.cor}</Text>
                <View style={styles.productSize}>
                  <Text style={styles.sizeText}>{product.tamanho}</Text>
                </View>
              </View>
              <View style={styles.productPayment}>
                <View style={[styles.paymentStatus, styles.paid]}>
                  <Text style={styles.paymentText}>ENTREGUE</Text>
                </View>
                <View style={styles.productPrice}>
                  <Text style={styles.pricePrefix}>R$</Text>
                  <Text style={styles.priceValue}>{product.preco}</Text>
                </View>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setTrackingVisible(true)}
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
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  backButton: {
    backgroundColor: "rgba(156,204,255,0.1)",
    borderRadius: 30,
    padding: 8,
    marginRight: 2,
  },
  headerTitle: { fontFamily: "BebasNeue", fontSize: 32, color: "#9cf" },
  section: { gap: 16 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sectionDivider: { height: 2, flex: 1, backgroundColor: "#9cf" },
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
    padding: 32,
    alignItems: "center",
    gap: 24,
  },
  productImg: {
    width: 150,
    height: 150,
    borderRadius: 12,
    resizeMode: "contain",
  },
  productDetails: { alignItems: "center", gap: 4 },
  productName: {
    fontFamily: "PoppinsBold",
    fontSize: 14,
    textAlign: "center",
    color: "#fff",
  },
  productColor: { fontFamily: "PoppinsRegular", fontSize: 12, color: "#9cf" },
  productSize: {
    backgroundColor: "#0f1824",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#9cf",
  },
  sizeText: { fontFamily: "PoppinsBold", fontSize: 12, color: "#9cf" },
  productPayment: { alignItems: "center", gap: 6, width: "100%" },
  paymentStatus: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  pending: { backgroundColor: "#1E90FF" },
  paid: { backgroundColor: "#01830c" },
  paymentText: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 12,
    textAlign: "center",
  },
  productPrice: { flexDirection: "row", alignItems: "flex-end", gap: 4 },
  pricePrefix: { fontFamily: "PoppinsRegular", fontSize: 12, color: "#9cf" },
  priceValue: { fontFamily: "PoppinsBold", fontSize: 16, color: "#fff" },
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
  actionText: { color: "#000", fontFamily: "PoppinsBold", fontSize: 12 },
});
