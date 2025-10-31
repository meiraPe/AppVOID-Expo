import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

// 🔹 AsyncStorage com fallback para Web
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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [fontsLoaded] = useFonts({
    BebasNeue: require("../../../assets/fonts/BebasNeue-Regular.ttf"),
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  // 🔹 Função de Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3333/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userId", String(data.id));
        await AsyncStorage.setItem(
          "usuario",
          JSON.stringify({ nome: data.nome, email: data.email })
        );

        Alert.alert("Sucesso", "Login realizado!");
        router.push("/home");
      } else {
        Alert.alert("Erro", data.mensagem || "Credenciais inválidas");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <LinearGradient colors={["#080f18", "#0f1824", "#101b2f"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/home")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#9cf" />
        </TouchableOpacity>
        <Text style={styles.title}>Login</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.wrapper}
        >
          <LinearGradient
            colors={["rgba(156,204,255,0.1)", "rgba(255,255,255,0.02)"]}
            style={styles.cardContainer}
          >
            {/* Input - Email */}
            <View style={styles.inputGroup}>
              <Ionicons name="mail-outline" size={18} color="#9cf" style={styles.iconLabel} />
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Digite seu e-mail"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Input - Senha */}
            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed-outline" size={18} color="#9cf" style={styles.iconLabel} />
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Digite sua senha"
                  placeholderTextColor="#999"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {/* Checkbox */}
            <TouchableOpacity
              onPress={() => setAgree(!agree)}
              style={styles.checkboxContainer}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
                {agree && <Ionicons name="checkmark" size={14} color="#000" />}
              </View>
              <Text style={styles.checkboxText}>
                Li e concordo com os{" "}
                <Text style={styles.linkHighlight}>Termos de Uso</Text>
              </Text>
            </TouchableOpacity>

            {/* Botão */}
            <TouchableOpacity
              style={[styles.button, !agree && styles.buttonDisabled]}
              disabled={!agree}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Link */}
          <TouchableOpacity onPress={() => router.push("/modal/signin")}>
            <Text style={styles.linkText}>
              Não tem uma conta?{" "}
              <Text style={styles.linkHighlight}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 50,
  },
  header: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "4rem",
    marginHorizontal: 24,
    marginBottom: 20,
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
    color: "#fff",
    fontSize: 32,
    letterSpacing: 1,
  },
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
    gap: 40,
  },
  inputGroup: { gap: 10 },
  iconLabel: { marginLeft: 4 },
  inputBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: { color: "#fff", fontFamily: "PoppinsRegular", fontSize: 14 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#9cf",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: "#9cf" },
  checkboxText: { color: "#ccc", fontFamily: "PoppinsRegular", fontSize: 13 },
  button: {
    backgroundColor: "#9cf",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#9cf",
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: { backgroundColor: "rgba(156,204,255,0.3)" },
  buttonText: { color: "#000", fontFamily: "PoppinsBold", fontSize: 15 },
  linkText: {
    color: "#aaa",
    fontFamily: "PoppinsRegular",
    fontSize: 13,
    textAlign: "center",
    marginTop: 24,
  },
  linkHighlight: { color: "#9cf" },
});
