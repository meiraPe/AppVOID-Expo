// app/(tabs)/profile.js
import { View, Button, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Link href="/modal/login" asChild>
        <Button title="Entrar" />
      </Link>
      <Link href="/modal/signin" asChild>
        <Button title="Criar Conta" />
      </Link>
      <Link href="/modal/notifications" asChild>
        <Button title="Notificações" />
      </Link>
      <Button title="Sair" color="red" onPress={() => console.log("Logout")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 20,
  },
});
