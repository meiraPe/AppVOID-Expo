import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function SignIn() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [fontsLoaded] = useFonts({
    BebasNeue: require("../../../assets/fonts/BebasNeue-Regular.ttf"),
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <LinearGradient colors={["#080f18", "#0f1824", "#101b2f"]} style={styles.container}>
      {/* Header fixo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/home")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#9cf" />
        </TouchableOpacity>
        <Text style={styles.title}>Criar Conta</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollWrapper}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.wrapper}
        >
          {/* Card do formulário */}
          <LinearGradient
            colors={["rgba(156,204,255,0.1)", "rgba(255,255,255,0.02)"]}
            style={styles.cardContainer}
          >
            {/* Input - Nome */}
            <View style={styles.inputGroup}>
              <Ionicons name="person-outline" size={18} color="#9cf" style={styles.iconLabel} />
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Nome completo"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Input - Email */}
            <View style={styles.inputGroup}>
              <Ionicons name="mail-outline" size={18} color="#9cf" style={styles.iconLabel} />
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="E-mail"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Input - Senha */}
            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed-outline" size={18} color="#9cf" style={styles.iconLabel} />
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor="#999"
                  secureTextEntry
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {/* Checkbox - Termos */}
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
            >
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Link para login */}
          <TouchableOpacity onPress={() => router.push("/modal/login")}>
            <Text style={styles.linkText}>
              Já tem uma conta? <Text style={styles.linkHighlight}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollWrapper: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 220, // espaço para o header
    paddingBottom: 50,
  },
  wrapper: {
    flex: 1,
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
    gap: 30,
  },
  inputGroup: {
    gap: 10,
  },
  iconLabel: {
    marginLeft: 4,
  },
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
  input: {
    flex: 1,
    color: "#fff",
    fontFamily: "PoppinsRegular",
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  checkboxChecked: {
    backgroundColor: "#9cf",
  },
  checkboxText: {
    color: "#ccc",
    fontFamily: "PoppinsRegular",
    fontSize: 13,
  },
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
  buttonDisabled: {
    backgroundColor: "rgba(156,204,255,0.3)",
  },
  buttonText: {
    color: "#000",
    fontFamily: "PoppinsBold",
    fontSize: 15,
  },
  linkText: {
    color: "#aaa",
    fontFamily: "PoppinsRegular",
    fontSize: 13,
    textAlign: "center",
    marginTop: 24,
  },
  linkHighlight: {
    color: "#9cf",
  },
});
