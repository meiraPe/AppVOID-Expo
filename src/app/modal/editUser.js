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
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function EditUser() {
  const router = useRouter();

  const [name, setName] = useState("Usuário Exemplo");
  const [email, setEmail] = useState("usuario@email.com");
  const [password, setPassword] = useState("");

  const [fontsLoaded] = useFonts({
    BebasNeue: require("../../../assets/fonts/BebasNeue-Regular.ttf"),
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  const [popupVisible, setPopupVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const salvarAlteracoes = () => {
    // Simula atualização de dados
    setPopupVisible(true);

    // Animação de fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Fecha automaticamente após 2,5 segundos
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setPopupVisible(false));
    }, 2500);
  };

  if (!fontsLoaded) return null;

  const handleSave = async () => {
    if (!name || !email || !password) {
      Alert.alert("Campos incompletos", "Preencha todos os campos antes de salvar.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3333/usuarios/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: name,
          email: email,
          senha: password,
        }),
      });

      if (response.ok) {
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        router.back();
      } else {
        Alert.alert("Erro", "Não foi possível atualizar o perfil.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao conectar com o servidor.");
    }
  };

  return (
    <LinearGradient colors={["#080f18", "#0f1824", "#101b2f"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/home")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#9cf" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Usuário</Text>
      </View>

      {/* Formulário */}
      <ScrollView contentContainerStyle={styles.scrollWrapper}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.wrapper}
        >
          <LinearGradient
            colors={["rgba(156,204,255,0.1)", "rgba(255,255,255,0.02)"]}
            style={styles.cardContainer}
          >
            {/* Nome */}
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

            {/* E-mail */}
            <View style={styles.inputGroup}>
              <Ionicons name="mail-outline" size={18} color="#9cf" style={styles.iconLabel} />
              <View style={styles.inputBox}>
                <TextInput
                  placeholder="Seu e-mail"
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Senha */}
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

            {/* Botão Salvar */}
            <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAlteracoes}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#000" />
              <Text style={styles.textoBotao}>Salvar Alterações</Text>
            </TouchableOpacity>

            {/* Pop-up de confirmação */}
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
  container: {
    flex: 1,
  },
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
  textoBotao: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupBox: {
    backgroundColor: "#0d1a2b",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#9cf",
  },
  popupText: {
    color: "#9cf",
    fontSize: 16,
    fontWeight: "600",
  },
});
