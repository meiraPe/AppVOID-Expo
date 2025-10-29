// app/(tabs)/profile.js
import React from "react";
import { useFonts } from "expo-font";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    BebasNeue: require("../../../assets/fonts/BebasNeue-Regular.ttf"),
    PoppinsRegular: require("../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
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
        <Text style={styles.userName}>Olá, Usuário!</Text>
        <Text style={styles.userSub}>Membro desde 2025</Text>
      </View>

      {/* Opções */}
      <View style={styles.optionsContainer}>
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
          onPress={() => console.log("Logout")}
        >
          <Ionicons name="exit-outline" size={20} color="#f55" />
          <Text style={[styles.optionText, styles.logoutText]}>Sair</Text>
        </TouchableOpacity>
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
