import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [fontsLoaded] = useFonts({
    BebasNeue: require("../../../assets/fonts/BebasNeue-Regular.ttf"),
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioText = await AsyncStorage.getItem("usuario");
        const usuario = await JSON.parse(usuarioText);
        console.log("Usuário carregado:", usuario);

        if (usuario?.token) {
          setUser(usuario?.nome || "Usuário");
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };
    carregarUsuario();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("usuario");
      Alert.alert("Logout", "Você saiu da conta.");
      setUser(null);
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const deletarConta = async () => {
    try {
      const usuarioText = await AsyncStorage.getItem("usuario");
      const usuario = await JSON.parse(usuarioText);
      
      if (!usuario?.token) {
        Alert.alert("Erro", "Você precisa estar logado para deletar a conta.");
        return;
      }
      const response = await fetch(`http://localhost:3333/usuarios/${usuario.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${usuario.token}`,
        },
      });
      if (response.ok) {
        await AsyncStorage.removeItem("usuario");
        Alert.alert("Conta Deletada", "Sua conta foi deletada com sucesso.");
        setUser(null);
        router.replace("/(tabs)/home");
      } else {
        const data = await response.json();
        Alert.alert("Erro", data.mensagem || "Não foi possível deletar a conta.");
      }
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      Alert.alert("Erro", "Ocorreu um erro ao tentar deletar a conta.");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#9cf" />
        </TouchableOpacity>
        <Text style={styles.title}>Seu Perfil</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarGlow}>
          <Image
            source={require("../../../assets/icons/profile.png")}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.userName}>Olá, {user || "Usuário"}!</Text>
        <Text style={styles.userSub}>Membro desde 2025</Text>
      </View>

      {/* Opções */}
      <View style={styles.optionsContainer}>
        {user ? (
          <>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => router.push("/modal/editUser")}
            >
              <Ionicons name="create-outline" size={20} color="#9cf" />
              <Text style={styles.optionText}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => router.push("/modal/addCards")}
            >
              <Ionicons name="card-outline" size={20} color="#9cf" />
              <Text style={styles.optionText}>Meus Cartões</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, styles.logoutCard]}
              onPress={handleLogout}
            >
              <Ionicons name="exit-outline" size={20} color="#f55" />
              <Text style={[styles.optionText, styles.logoutText]}>Sair</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, styles.logoutCard]}
              onPress={deletarConta}
            >
              <Ionicons name="trash-outline" size={20} color="#f55" />
              <Text style={[styles.optionText, styles.logoutText]}>Excluir Conta</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => router.push("/modal/login")}
            >
              <Ionicons name="log-in-outline" size={20} color="#9cf" />
              <Text style={styles.optionText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => router.push("/modal/signin")}
            >
              <Ionicons name="person-add-outline" size={20} color="#9cf" />
              <Text style={styles.optionText}>Criar Conta</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080f18",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: "rgba(156, 204, 255, 0.1)",
    borderRadius: 30,
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontFamily: "BebasNeue",
    color: "#fff",
    fontSize: 28,
    letterSpacing: 1,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 50,
  },
  avatarGlow: {
    backgroundColor: "rgba(156, 204, 255, 0.15)",
    borderRadius: 80,
    padding: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#9cf",
  },
  userName: {
    fontFamily: "PoppinsBold",
    color: "#fff",
    fontSize: 18,
    marginTop: 10,
  },
  userSub: {
    fontFamily: "PoppinsRegular",
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
  },
  optionsContainer: {
    marginHorizontal: 14,
    gap: 24,
  },
  optionCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  optionText: {
    fontFamily: "PoppinsRegular",
    color: "#fff",
    fontSize: 14,
  },
  logoutCard: {
    borderColor: "rgba(255,0,0,0.3)",
    backgroundColor: "rgba(255,0,0,0.08)",
  },
  logoutText: {
    color: "#f55",
  },
});
