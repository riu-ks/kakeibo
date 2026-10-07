import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  // 연습용 숫자 (나중에 직접 입력한 값으로 바꿀 거예요)
  const income = 200000;
  const expense = 150000;
  const balance = income - expense;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>10월 가계부</Text>

      <View style={styles.card}>
        <Text style={styles.label}>남은 돈</Text>
        <Text style={styles.balance}>¥{balance.toLocaleString()}</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.card, styles.half]}>
          <Text style={styles.label}>수입</Text>
          <Text style={[styles.amount, styles.income]}>
            ¥{income.toLocaleString()}
          </Text>
        </View>
        <View style={[styles.card, styles.half]}>
          <Text style={styles.label}>지출</Text>
          <Text style={[styles.amount, styles.expense]}>
            ¥{expense.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 20,
    paddingTop: 80,
    gap: 12,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#222" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20 },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  label: { fontSize: 14, color: "#888" },
  balance: { fontSize: 36, fontWeight: "bold", color: "#222", marginTop: 4 },
  amount: { fontSize: 20, fontWeight: "bold", marginTop: 4 },
  income: { color: "#2E7D32" },
  expense: { color: "#D32F2F" },
});