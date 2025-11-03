import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Animated,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

// AsyncStorage com fallback para Web
let AsyncStorage;
if (Platform.OS === "web") {
  AsyncStorage = {
    async setItem(key, value) {
      localStorage.setItem(key, value);
    },
    async getItem(key) {
      return localStorage.getItem(key);
    },
    async removeItem(key) {
      localStorage.removeItem(key);
    },
  };
} else {
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
}

export default function EditUser() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [usuario, setUsuario] = useState(null);

  const [fontsLoaded] = useFonts({
    BebasNeue: require("../../../assets/fonts/BebasNeue-Regular.ttf"),
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  const [popupVisible, setPopupVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioStr = await AsyncStorage.getItem("usuario");
        if (!usuarioStr) {
          console.error("Nenhum usuário encontrado no AsyncStorage");
          return;
        }

        const usuarioObj = JSON.parse(usuarioStr);
        console.log("Usuario carregado:", usuarioObj);

        setUsuario(usuarioObj);
        setName(usuarioObj.nome || "");
        setEmail(usuarioObj.email || "");
        console.log("User ID definido como:", usuarioObj.id);
        setUserId(usuarioObj.id || null);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };
    carregarUsuario();
  }, []);

  const salvarAlteracoes = async () => {
    console.log(userId, usuario)
    if (!userId || !usuario?.token) {
      console.error("User ID ou token inválido:", userId, usuario?.token);
      Alert.alert("Erro", "Usuário não encontrado ou token inválido. Tente reiniciar o app.");
      return;
    }

    const body = { nome: name, email };
    if (password) body.senha = password;

    console.log("Salvando alterações com:", { userId, token: usuario.token, name, email });

    try {
      const response = await fetch(`http://localhost:3333/usuarios/${userId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usuario.token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const usuarioAtualizado = { ...usuario, nome: name, email };
        await AsyncStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
        setUsuario(usuarioAtualizado);

        setPopupVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setPopupVisible(false));
        }, 2500);

      } else {
        const data = await response.json();
        console.error("Erro PUT:", data);
        Alert.alert("Erro", data?.error || "Não foi possível atualizar o perfil.");
      }
    } catch (error) {
      console.error("Falha no fetch:", error);
      Alert.alert("Erro", "Falha ao conectar com o servidor.");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={["#080f18", "#0f1824", "#101b2f"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/home")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#9cf" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Usuário</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollWrapper}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.wrapper}
        >
          <LinearGradient
            colors={["rgba(156,204,255,0.1)", "rgba(255,255,255,0.02)"]}
            style={styles.cardContainer}
          >
            <View style={styles.inputGroup}>
              <Ionicons name="person-outline" size={18} color="#9cf" style={styles.iconLabel} />
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Seu nome"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="mail-outline" size={18} color="#9cf" style={styles.iconLabel} />
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Seu e-mail"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed-outline" size={18} color="#9cf" style={styles.iconLabel} />
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Nova senha"
                  placeholderTextColor="#999"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAlteracoes}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#000" />
              <Text style={styles.textoBotao}>Salvar Alterações</Text>
            </TouchableOpacity>

            <Modal transparent visible={popupVisible} animationType="fade">
              <View style={styles.modalOverlay}>
                <Animated.View style={[styles.popupBox, { opacity: fadeAnim }]}>
                  <Ionicons name="checkmark-circle" size={40} color="#9cf" />
                  <Text style={styles.popupText}>Alterações feitas com sucesso!</Text>
                </Animated.View>
              </View>
            </Modal>
          </LinearGradient>
        </KeyboardAvoidingView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "4rem",
    marginHorizontal: 24,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: "rgba(156,204,255,0.1)",
    borderRadius: 30,
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontFamily: "BebasNeue",
    color: "#9CF",
    fontSize: 32,
    letterSpacing: 1,
  },
  scrollWrapper: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 220,
    paddingBottom: 50,
  },
  wrapper: { flex: 1 },
  cardContainer: {
    width: "95%",
    maxWidth: 400,
    alignSelf: "center",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 26,
    borderWidth: 1,
    borderColor: "rgba(156,204,255,0.5)",
    shadowColor: "#9cf",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    backgroundColor: "rgba(15,25,40,0.7)",
    gap: 30,
  },
  inputGroup: { gap: 10 },
  iconLabel: { marginLeft: 4 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: { flex: 1, color: "#fff", fontFamily: "PoppinsRegular", fontSize: 14 },
  botaoSalvar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9cf",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 20,
    gap: 8,
  },
  textoBotao: { color: "#000", fontWeight: "700", fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  popupBox: {
    backgroundColor: "#0d1a2b",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#9cf",
  },
  popupText: { color: "#9cf", fontSize: 16, fontWeight: "600" },
});
