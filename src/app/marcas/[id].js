import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useRef, useEffect } from "react";

export default function ProductPage() {
  const { id } = useLocalSearchParams();

  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3333/produtos/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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

  const usuarioLocal = localStorage.getItem("usuario");
  const usuario = JSON.parse(usuarioLocal)
  const usuarioId = usuario?.id

  const handleCart = async () => {
    try {
      if (!addedToCart) {
        const res = await fetch(`http://localhost:3333/sacolas/${usuarioId}/itens`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            produtoId: Number(id),
            quantidade: 1,
          }),
        })

        if (res.ok)
          setAddedToCart(true)
        console.log('Adicionado à sacola');
      } else {
        const res = await fetch(`http://localhost:3333/sacolas/${usuarioId}/itens/${id}`, {
          method: "DELETE",
        })

        if (res.ok)
          setAddedToCart(false)
        console.log('Removido da sacola');
      }
    } catch (error) {
      console.log("Erro ao atualizar sacola:", error)
    }
  }

  const handleFavorite = async () => {
    try {
      if (!favorite) {
        const res = await fetch(`http://localhost:3333/favoritos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: usuarioId,
            produtoId: Number(id),
          }),
        })

        if (res.ok)
          setFavorite(true)
        console.log('Adicionado aos favoritos')
      } else {
        const res = await fetch(`http://localhost:3333/favoritos`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: usuarioId,
            produtoId: Number(id),
          }),
        })

        if (res.ok)
          setFavorite(false)
        console.log('Removido dos favoritos')
      }
    } catch (error) {
      console.log("Erro ao atualizar favoritos:", error)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#9cf" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Produto não encontrado</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#0a0f1a", "#131b2a"]} style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/marcas")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#9cf" />
        </TouchableOpacity>
        <Text style={styles.title}>COMPRAR</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{product.nome}</Text>
          <Image style={styles.productImg} source={{ uri: product.imagem1Url }} />

          {/* FAVORITO */}
          <TouchableOpacity style={styles.favoriteBtn} onPress={handleFavorite}>
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={28}
              color={favorite ? "#ff6b81" : "#9cf"}
            />
          </TouchableOpacity>

          {/* INFO */}
          <View style={styles.info}>
            <Text style={styles.price}>R$ {product.preco}</Text>
            <Text style={styles.desc}>{product.descricao}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sizeTitle}>Selecione o tamanho</Text>
          <View style={styles.sizeContainer}>
            {["38", "39", "40", "41", "42", "43"].map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.sizeButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size && styles.sizeTextSelected,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* BOTÕES */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cartBtn} activeOpacity={0.8} onPress={handleCart}>
              <Ionicons name="bag" size={22} color="#000" />
              <Text style={styles.cartText}>
                {addedToCart ? "Remover da sacola" : "Adicionar à sacola"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buyBtn}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
              disabled={!selectedSize}
            >
              <LinearGradient
                colors={selectedSize ? ["#9cf", "#70a8ff"] : ["#6b7689", "#6b7689"]}
                style={styles.buyBtnGradient}
              >
                <Text style={styles.buyText}>Finalizar compra</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    flexShrink: 1,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.03)",
    margin: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    position: "relative",
  },
  cardTitle: {
    color: "#ddd",
    textAlign: "center",
    paddingVertical: 10,
    fontFamily: "BebasNeue",
    fontSize: 30,
  },
  productImg: {
    width: "100%",
    height: 280,
    resizeMode: "contain",
  },
  favoriteBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 8,
    borderRadius: 50,
  },
  info: { marginTop: 12, padding: 10 },
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

  /* === LINHA DIVISÓRIA === */
  divider: {
    height: 1,
    backgroundColor: "rgba(156,204,255,0.3)",
    marginVertical: 18,
    alignSelf: "center",
    width: "90%",
  },

  sizeTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  sizeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 10,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: "#9cf",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
  },
  sizeButtonSelected: {
    backgroundColor: "#9cf",
  },
  sizeText: {
    color: "#9cf",
    fontFamily: "PoppinsBold",
  },
  sizeTextSelected: {
    color: "#000",
  },
  actionRow: {
    flexDirection: "column",
    gap: 12,
    marginTop: 10,
  },
  cartBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9cf",
    borderRadius: 30,
    paddingVertical: 12,
    gap: 8,
  },
  cartText: {
    color: "#000",
    fontFamily: "PoppinsBold",
    fontSize: 15,
  },
  buyBtn: { marginTop: 10, borderRadius: 30, overflow: "hidden" },
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#080f18",
  },

  /* ========== MODAL DE PAGAMENTO =========== */

  paymentBox: {
    width: "90%",
    backgroundColor: "#0f1624",
    borderRadius: 20,
    padding: 20,
    position: "absolute",
    bottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentTitle: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 18,
  },
  paymentSummary: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  summaryImg: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 10,
  },
  summaryName: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 14,
  },
  summaryPrice: {
    color: "#9cf",
    fontFamily: "PoppinsBold",
    fontSize: 13,
  },
  summarySize: {
    color: "#ccc",
    fontFamily: "PoppinsRegular",
    fontSize: 12,
  },
  paymentSubtitle: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 15,
    marginBottom: 8,
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  paymentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#9cf",
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  paymentButtonSelected: {
    backgroundColor: "#9cf",
  },
  paymentText: {
    color: "#9cf",
    fontFamily: "PoppinsBold",
  },
  paymentTextSelected: {
    color: "#000",
  },
  confirmBtn: {
    backgroundColor: "#9cf",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmText: {
    color: "#000",
    fontFamily: "PoppinsBold",
    fontSize: 15,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  successBox: {
    width: 260,
    backgroundColor: "#0f1624",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },

});
