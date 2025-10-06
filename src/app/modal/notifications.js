// app/modal/notifications.js
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Notifications() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
      {/* aqui você lista as notificações do usuário */}
      <Button title="Fechar" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
