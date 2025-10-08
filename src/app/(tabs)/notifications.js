import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Notifications() {
  const router = useRouter();
  const [openCardId, setOpenCardId] = useState(null);

  const notifications = [
    {
      id: 1,
      title: "Compra realizada com sucesso",
      image: require("../../../assets/products/CamisaPreta.png"),
    },
    {
      id: 2,
      title: "Estará chegando em breve",
      image: require("../../../assets/products/CamisaBranca.png"),
    },
  ];

  return (
    <LinearGradient colors={["#080f18", "#0f1824"]} style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/home")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#9cf" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollWrapper}>

        {notifications.length === 0 ? (
          <View style={styles.noMsg}>
            <Image source={require("../../../assets/icons/notifications.png")} style={styles.noMsgImg} />
            <Text style={styles.noMsgText}>Você não tem notificações</Text>
          </View>
        ) : (
          notifications.map((notif) => (
           <LinearGradient
              key={notif.id}
              colors={["#101b2f", "#0f1824"]}
              style={styles.card}
            >
              <View style={styles.cardContent}>
                {/* Imagem + Texto */}
                <View style={styles.cardLeft}>
                  <Image source={notif.image} style={styles.cardImage} />
                  <Text style={styles.cardText}>{notif.title}</Text>
                </View>

                {/* Botão de ação */}
                <TouchableOpacity onPress={() => setOpenCardId(openCardId === notif.id ? null : notif.id)}>
                  <Ionicons name="ellipsis-vertical" size={20} color="#9cf" />
                </TouchableOpacity>
              </View>

              {/* Menu de opções */}
              {openCardId === notif.id && (
                <View style={styles.cardBox}>
                  <TouchableOpacity style={styles.cardBoxItem}>
                    <Text style={styles.cardBoxText}>Marcar como lido</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cardBoxItem}>
                    <Text style={styles.cardBoxText}>Ver mais</Text>
                  </TouchableOpacity>
                </View>
              )}
            </LinearGradient>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    gap: 20,
  },
  noMsg: {
    alignItems: "center",
    marginTop: 50,
  },
  noMsgImg: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  noMsgText: {
    color: "#aaa",
    fontSize: 16,
  },
  card: {
    padding: 15,
    borderRadius: 16,
    backgroundColor: "#0f1824",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    marginBottom: 8,
    gap: 10,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flexShrink: 1,
  },
  cardImage: {
    width: 45,
    height: 45,
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
    flexShrink: 1,
  },
  cardBox: {
    marginTop: 8,
    paddingVertical: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#2a2f40",
  },
  cardBoxItem: {
    paddingVertical: 6,
  },
  cardBoxText: {
    color: "#9cf",
    fontSize: 14,
  },
});
