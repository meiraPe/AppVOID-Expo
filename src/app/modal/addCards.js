import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Cartoes() {
  const router = useRouter();

  // -----------------------------
  // ESTADOS
  // -----------------------------
  const [cartoes, setCartoes] = useState([
    { id: 1, numero: "**** **** **** 1234", validade: "12/26" },
    { id: 2, numero: "**** **** **** 5678", validade: "09/27" },
  ]);

  const [formVisible, setFormVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [removeVisible, setRemoveVisible] = useState(false);
  const [cartaoParaRemover, setCartaoParaRemover] = useState(null);

  // animações
  const fadeAnimForm = useRef(new Animated.Value(0)).current;
  const fadeAnimSuccess = useRef(new Animated.Value(0)).current;
  const fadeAnimRemove = useRef(new Animated.Value(0)).current;
  const slideAnimRemove = useRef(new Animated.Value(40)).current;

  const [editMode, setEditMode] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Formulário
  const [numero, setNumero] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // -----------------------------
  // ANIMAÇÕES DO MODAL DE REMOÇÃO
  // -----------------------------
  useEffect(() => {
    if (removeVisible) {
      Animated.parallel([
        Animated.timing(fadeAnimRemove, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimRemove, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnimRemove, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimRemove, {
          toValue: 40,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [removeVisible]);

  // -----------------------------
  // ABRIR / FECHAR FORMULÁRIO
  // -----------------------------
  const abrirPopupAdicionar = () => {
    setEditMode(false);
    setSelectedCard(null);
    setNumero("");
    setValidade("");
    setCvv("");
    abrirForm();
  };

  const abrirPopupEditar = (cartao) => {
    // debug log - remova se quiser
    console.log("abrirPopupEditar chamado para id:", cartao.id);

    setEditMode(true);
    setSelectedCard(cartao);

    // Remove asteriscos e espaços, mantendo apenas os dígitos finais (ex: "1234")
    // replaceAll pode não ser suportado em algumas versões; usamos regex:
    const apenasDigitos = cartao.numero.replace(/\*/g, "").replace(/\s+/g, "").trim();
    setNumero(apenasDigitos); // por exemplo "1234"
    setValidade(cartao.validade);
    setCvv(""); // não exigiremos CVV para editar
    abrirForm();
  };

  const abrirForm = () => {
    setFormVisible(true);
    fadeAnimForm.setValue(0);
    Animated.timing(fadeAnimForm, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const fecharForm = () => {
    Animated.timing(fadeAnimForm, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setFormVisible(false));
  };

  // -----------------------------
  // REMOVER CARTÃO (abrir modal)
  // -----------------------------
  const confirmarRemocao = (cartao) => {
    setCartaoParaRemover(cartao);
    setRemoveVisible(true);
  };

  const removerCartao = () => {
    if (!cartaoParaRemover) return;
    setCartoes((prev) => prev.filter((c) => c.id !== cartaoParaRemover.id));
    setRemoveVisible(false);
    mostrarPopupSucesso("Cartão removido com sucesso!");
  };

  // -----------------------------
  // POP-UP DE SUCESSO
  // -----------------------------
  const mostrarPopupSucesso = (msg) => {
    setSuccessMessage(msg);
    setSuccessVisible(true);
    fadeAnimSuccess.setValue(0);

    Animated.timing(fadeAnimSuccess, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnimSuccess, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setSuccessVisible(false));
      }, 2000);
    });
  };

  // -----------------------------
  // SALVAR / EDITAR CARTÃO
  // -----------------------------
  const salvarCartao = () => {
    // validação: se estiver editando, não exigir CVV; se sendo criado, exigir tudo
    if (!numero || !validade || (!editMode && !cvv)) {
      // usar Alert para erro de validação (ou pode usar seu popup)
      Alert.alert("Atenção", "Preencha todos os campos (CVV só é exigido ao adicionar).");
      return;
    }

    if (editMode && selectedCard) {
      const novosCartoes = cartoes.map((c) =>
        c.id === selectedCard.id
          ? { ...c, numero: mascararNumero(numero), validade }
          : c
      );
      setCartoes(novosCartoes);
      mostrarPopupSucesso("Cartão atualizado com sucesso!");
    } else {
      const novoCartao = {
        id: Date.now(),
        numero: mascararNumero(numero),
        validade,
      };
      setCartoes([...cartoes, novoCartao]);
      mostrarPopupSucesso("Cartão adicionado com sucesso!");
    }

    fecharForm();
  };

  const mascararNumero = (num) => {
    // num pode ser "1234" ou "4111222233334444"
    const somenteDigitos = String(num).replace(/\s+/g, "");
    const digitos = somenteDigitos.slice(-4);
    return `**** **** **** ${digitos}`;
  };

  // -----------------------------
  // INTERFACE
  // -----------------------------
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/home")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color="#9cf" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Cartões</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* BOTÃO ADICIONAR */}
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={abrirPopupAdicionar}
        >
          <Ionicons name="add-circle-outline" size={22} color="#000" />
          <Text style={styles.textoBotao}>Adicionar Novo Cartão</Text>
        </TouchableOpacity>

        {/* LISTA DE CARTÕES */}
        {cartoes.map((cartao) => (
          <View key={cartao.id} style={styles.card}>
            <View>
              <Text style={styles.numero}>{cartao.numero}</Text>
              <Text style={styles.validade}>Validade: {cartao.validade}</Text>
            </View>

            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => abrirPopupEditar(cartao)}>
                <Ionicons name="create-outline" size={22} color="#9cf" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmarRemocao(cartao)}
              >
                <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* MODAL ADICIONAR/EDITAR */}
      <Modal transparent visible={formVisible} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.popupBox,
              {
                opacity: fadeAnimForm,
                transform: [
                  {
                    translateY: fadeAnimForm.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.popupTitulo}>
              {editMode ? "Editar Cartão" : "Adicionar Cartão"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Número do Cartão (digite os últimos ou completos)"
              placeholderTextColor="#777"
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Validade (MM/AA)"
              placeholderTextColor="#777"
              value={validade}
              onChangeText={setValidade}
              keyboardType="numeric"
            />
            {/* CVV só é necessário ao adicionar novo cartão */}
            {!editMode && (
              <TextInput
                style={styles.input}
                placeholder="CVV"
                placeholderTextColor="#777"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                secureTextEntry
              />
            )}

            <View style={styles.popupBotoes}>
              <TouchableOpacity style={styles.botaoCancelar} onPress={fecharForm}>
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoSalvar} onPress={salvarCartao}>
                <Text style={styles.textoSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* MODAL DE CONFIRMAÇÃO DE REMOÇÃO */}
      <Modal transparent visible={removeVisible} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalRemover,
              {
                opacity: fadeAnimRemove,
                transform: [{ translateY: slideAnimRemove }],
              },
            ]}
          >
            <Text style={styles.modalTitulo}>Remover cartão</Text>
            <Text style={styles.modalTexto}>
              Deseja realmente remover{" "}
              <Text style={styles.modalDestaque}>
                {cartaoParaRemover?.numero}
              </Text>
              ?
            </Text>

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() => setRemoveVisible(false)}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoRemover}
                onPress={removerCartao}
              >
                <Text style={styles.textoRemover}>Remover</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* POP-UP DE SUCESSO */}
      {successVisible && (
        <Animated.View
          style={[
            styles.popupSucesso,
            {
              opacity: fadeAnimSuccess,
              transform: [
                {
                  translateY: fadeAnimSuccess.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.popupTexto}>{successMessage}</Text>
        </Animated.View>
      )}
    </View>
  );
}

// -----------------------------
// ESTILOS
// -----------------------------
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
    paddingBottom: 140,
    paddingHorizontal: 16,
    gap: 16,
  },
  botaoAdicionar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9cf",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
    marginBottom: 20,
  },
  textoBotao: {
    color: "#000",
    fontWeight: "700",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#0d1a2b",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(156,204,255,0.2)",
  },
  numero: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  validade: {
    color: "#9cf",
    fontSize: 13,
    marginTop: 4,
  },
  acoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  deleteButton: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupBox: {
    backgroundColor: "#0d1a2b",
    width: "85%",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#9cf",
  },
  popupTitulo: {
    color: "#9cf",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#0a1624",
    color: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 12,
  },
  popupSucesso: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  popupTexto: {
    color: "#fff",
    fontSize: 15,
  },
  popupBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  botaoCancelar: {
    flex: 1,
    backgroundColor: "transparent",
    borderColor: "#9cf",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 8,
  },
  textoCancelar: {
    color: "#9cf",
    fontWeight: "600",
  },
  botaoSalvar: {
    flex: 1,
    backgroundColor: "#9cf",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginLeft: 8,
  },
  textoSalvar: {
    color: "#000",
    fontWeight: "700",
  },
  modalRemover: {
    backgroundColor: "#0d1a2b",
    width: "85%",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#9cf",
  },
  modalTitulo: {
    color: "#9cf",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  modalTexto: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
  },
  modalDestaque: {
    color: "#9cf",
    fontWeight: "600",
  },
  modalBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botaoRemover: {
    flex: 1,
    backgroundColor: "#ff6b6b",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginLeft: 8,
  },
  textoRemover: {
    color: "#fff",
    fontWeight: "700",
  },
});
