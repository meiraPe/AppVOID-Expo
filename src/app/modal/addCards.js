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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Cartoes() {
  const router = useRouter();

  // -----------------------------
  // ESTADOS
  // -----------------------------
  const [cartoes, setCartoes] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);

  const [formVisible, setFormVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [removeVisible, setRemoveVisible] = useState(false);
  const [cartaoParaRemover, setCartaoParaRemover] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const fadeAnimForm = useRef(new Animated.Value(0)).current;
  const fadeAnimSuccess = useRef(new Animated.Value(0)).current;
  const fadeAnimRemove = useRef(new Animated.Value(0)).current;
  const slideAnimRemove = useRef(new Animated.Value(40)).current;

  const [numero, setNumero] = useState("");
  const [nomeTitular, setNomeTitular] = useState("");
  const [validadeMes, setValidadeMes] = useState("");
  const [validadeAno, setValidadeAno] = useState("");
  const [cvv, setCvv] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const API_URL = "http://localhost:3333/cartoes";

  // -----------------------------
  // PEGAR ID DO USUÁRIO LOGADO
  // -----------------------------
  useEffect(() => {
    async function carregarUsuario() {
      try {
        const usuarioString = await AsyncStorage.getItem("usuario");
        if (usuarioString) {
          const usuario = JSON.parse(usuarioString);
          setUsuarioId(usuario.id);
        }
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      }
    }
    carregarUsuario();
  }, []);

  // -----------------------------
  // CARREGAR CARTÕES DO USUÁRIO
  // -----------------------------
  useEffect(() => {
    async function carregarCartoes() {
      if (!usuarioId) return;
      try {
        const res = await fetch(`${API_URL}/usuario/${usuarioId}`);
        if (!res.ok) throw new Error("Erro ao buscar cartões");
        const data = await res.json();
        setCartoes(data);
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Não foi possível carregar os cartões.");
      }
    }
    carregarCartoes();
  }, [usuarioId]);

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
  // FORMULÁRIO
  // -----------------------------
  const abrirPopupAdicionar = () => {
    setEditMode(false);
    setSelectedCard(null);
    setNumero("");
    setNomeTitular("");
    setValidadeMes("");
    setValidadeAno("");
    setCvv("");
    abrirForm();
  };

  const abrirPopupEditar = (cartao) => {
    setEditMode(true);
    setSelectedCard(cartao);
    setNumero(cartao.numero);
    setNomeTitular(cartao.nomeTitular);
    setValidadeMes(cartao.validadeMes.toString());
    setValidadeAno(cartao.validadeAno.toString());
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
  // CRIAR CARTÃO
  // -----------------------------
  const criarCartao = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId,
          numero,
          nomeTitular,
          validadeMes: Number(validadeMes),
          validadeAno: Number(validadeAno),
          codigoSeguranca: cvv,
        }),
      });

      if (!res.ok) throw new Error("Erro ao adicionar cartão");
      const novo = await res.json();
      setCartoes((prev) => [...prev, novo]);
      mostrarPopupSucesso("Cartão adicionado com sucesso!");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível adicionar o cartão.");
    }
  };

  // -----------------------------
  // EDITAR CARTÃO
  // -----------------------------
  const editarCartao = async () => {
    try {
      const res = await fetch(`${API_URL}/${selectedCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero,
          nomeTitular,
          validadeMes: Number(validadeMes),
          validadeAno: Number(validadeAno),
          codigoSeguranca: cvv,
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar cartão");
      const atualizado = await res.json();

      setCartoes((prev) =>
        prev.map((c) => (c.id === atualizado.id ? atualizado : c))
      );
      mostrarPopupSucesso("Cartão atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível editar o cartão.");
    }
  };

  // -----------------------------
  // REMOVER CARTÃO
  // -----------------------------
  const removerCartao = async () => {
    if (!cartaoParaRemover) return;
    try {
      const res = await fetch(`${API_URL}/${cartaoParaRemover.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao remover cartão");
      setCartoes((prev) => prev.filter((c) => c.id !== cartaoParaRemover.id));
      mostrarPopupSucesso("Cartão removido com sucesso!");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível remover o cartão.");
    } finally {
      setRemoveVisible(false);
    }
  };

  // -----------------------------
  // SALVAR (CRIAR OU EDITAR)
  // -----------------------------
  const salvarCartao = async () => {
    if (!numero || !nomeTitular || !validadeMes || !validadeAno) {
      Alert.alert("Atenção", "Preencha todos os campos corretamente.");
      return;
    }
    if (editMode) await editarCartao();
    else await criarCartao();
    fecharForm();
  };

  // -----------------------------
  // POPUP SUCESSO
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
              <Text style={styles.numero}>
                **** **** **** {cartao.numero.slice(-4)}
              </Text>
              <Text style={styles.validade}>
                {cartao.nomeTitular} — {cartao.validadeMes}/{cartao.validadeAno}
              </Text>
            </View>
            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => abrirPopupEditar(cartao)}>
                <Ionicons name="create-outline" size={22} color="#9cf" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setCartaoParaRemover(cartao);
                  setRemoveVisible(true);
                }}
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
              placeholder="Número do Cartão"
              placeholderTextColor="#777"
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Nome do Titular"
              placeholderTextColor="#777"
              value={nomeTitular}
              onChangeText={setNomeTitular}
            />
            <TextInput
              style={styles.input}
              placeholder="Validade Mês (MM)"
              placeholderTextColor="#777"
              value={validadeMes}
              onChangeText={setValidadeMes}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Validade Ano (AA)"
              placeholderTextColor="#777"
              value={validadeAno}
              onChangeText={setValidadeAno}
              keyboardType="numeric"
            />
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
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={fecharForm}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoSalvar} onPress={salvarCartao}>
                <Text style={styles.textoSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* MODAL CONFIRMAR REMOÇÃO */}
      <Modal transparent visible={removeVisible} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalRemover,
              { opacity: fadeAnimRemove, transform: [{ translateY: slideAnimRemove }] },
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

      {/* POPUP SUCESSO */}
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
