import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Mock de produtos
const pendingProducts = [
  {
    id: 1,
    name: "Nike Air Max Plus OG",
    color: "Rosa e Azul",
    size: "40",
    price: "999,90",
    orderId: "00001",
    img: require("../../../assets/products/AirMaxPlus.png"),
  },
];

const paidProducts = [
  {
    id: 2,
    name: "Nike Air Max DN8",
    color: "Preto",
    size: "42",
    price: "949,90",
    orderId: "00002",
    img: require("../../../assets/products/Dn8.png"),
  },
];

export default function Sacola() {

  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [trackingVisible, setTrackingVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (modalVisible || trackingVisible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [modalVisible, trackingVisible]);

  // Simulação de progresso do pedido
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


  return (
    <LinearGradient colors={["#080f18", "#0f1824"]} style={styles.container}>
      {/* Header */}
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

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.actionText}>FINALIZAR COMPRA</Text>
                  <Ionicons name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productColor}>{product.color}</Text>
                <View style={styles.productSize}>
                  <Text style={styles.sizeText}>{product.size}</Text>
                </View>
              </View>

              <View style={styles.productPayment}>
                <View style={[styles.paymentStatus, styles.paid]}>
                  <Text style={styles.paymentText}>ENTREGUE</Text>
                </View>

                <View style={styles.productPrice}>
                  <Text style={styles.pricePrefix}>R$</Text>
                  <Text style={styles.priceValue}>{product.price}</Text>
                </View>

                <Text style={styles.orderId}>PEDIDO #{product.orderId}</Text>

                <View style={styles.divider} />

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

      {/* MODAL DE PAGAMENTO */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.paymentBox,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.paymentTitle}>Escolha o método de pagamento</Text>

            <View style={styles.paymentOptions}>
              {["Cartão", "Pix", "Boleto"].map((method) => (
                <TouchableOpacity
                  key={method}
                  onPress={() => setSelectedPayment(method)}
                  style={[
                    styles.paymentButton,
                    selectedPayment === method && styles.paymentButtonSelected,
                  ]}
                >
                  <Ionicons
                    name={
                      method === "Pix"
                        ? "cash-outline"
                        : method === "Cartão"
                        ? "card-outline"
                        : "document-text-outline"
                    }
                    size={22}
                    color={selectedPayment === method ? "#000" : "#9cf"}
                  />
                  <Text
                    style={[
                      styles.paymentTextOption,
                      selectedPayment === method && styles.paymentTextSelected,
                    ]}
                  >
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.confirmBtn, !selectedPayment && { opacity: 0.6 }]}
              disabled={!selectedPayment}
              onPress={() => {
                setShowSuccess(true);
                setTimeout(() => {
                  setShowSuccess(false);
                  setModalVisible(false);
                }, 2000);
              }}
            >
              <Text style={styles.confirmText}>Confirmar compra</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {showSuccess && (
          <View style={styles.successOverlay}>
            <Animated.View style={[styles.successBox, { transform: [{ scale: scaleAnim }] }]}>
              <Ionicons name="checkmark-circle" size={80} color="#9cf" />
              <Text style={styles.modalTitle}>Compra Confirmada!</Text>
              <Text style={styles.modalMsg}>Seu pedido foi processado com sucesso.</Text>
            </Animated.View>
          </View>
        )}
      </Modal>

      {/* MODAL DE MONITORAMENTO */}
      <Modal transparent visible={trackingVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.trackingBox, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.paymentTitle}>Status do Pedido</Text>

            <View style={styles.trackingSteps}>
              {["Recebido", "Em separação", "Enviado", "Entregue"].map(
                (label, index) => (
                  <View key={index} style={styles.trackingStep}>
                    <Ionicons
                      name={
                        index <= progress
                          ? "checkmark-circle"
                          : "ellipse-outline"
                      }
                      size={28}
                      color={index <= progress ? "#9cf" : "#6b7689"}
                    />
                    <Text
                      style={[
                        styles.trackingText,
                        index <= progress && styles.trackingTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                )
              )}
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setTrackingVisible(false)}
            >
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
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
  /* === LINHA DIVISÓRIA === */
  divider: {
    height: 1,
    backgroundColor: "rgba(156,204,255,0.3)",
    marginVertical: 18,
    alignSelf: "center",
    width: "90%",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentBox: {
    width: "90%",
    backgroundColor: "#0f1624",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  paymentTitle: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 18,
    marginBottom: 12,
  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  paymentButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#9cf",
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 10,
  },
  paymentButtonSelected: {
    backgroundColor: "#9cf",
  },
  paymentTextOption: {
    color: "#9cf",
    fontFamily: "PoppinsBold",
    marginLeft: 6,
  },
  paymentTextSelected: {
    color: "#000",
  },
  confirmBtn: {
    backgroundColor: "#9cf",
    borderRadius: 30,
    paddingVertical: 12,
    width: "100%",
  },
  confirmText: {
    color: "#000",
    textAlign: "center",
    fontFamily: "PoppinsBold",
    fontSize: 15,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  successBox: {
    backgroundColor: "#0f1624",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: { color: "#fff", fontFamily: "PoppinsBold", fontSize: 18 },
  modalMsg: { color: "#ccc", fontSize: 14, marginTop: 8, textAlign: "center" },
  trackingBox: {
    width: "90%",
    backgroundColor: "#0f1624",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  trackingSteps: {
    marginVertical: 20,
    width: "100%",
  },
  trackingStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 8,
  },
  trackingText: {
    color: "#6b7689",
    fontFamily: "PoppinsRegular",
    fontSize: 14,
  },
  trackingTextActive: {
    color: "#9cf",
    fontFamily: "PoppinsBold",
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
}); 
