import { useState } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// 지출 하나의 모양 정하기
type Item = {
  id: string;
  amount: number;
  category: string;
};

const CATEGORIES = ["식비", "교통비", "생활용품", "기타"];

export default function Index() {
  const income = 200000;

  // 앱이 기억하는 값들
  const [items, setItems] = useState<Item[]>([]);
  const [amountText, setAmountText] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  // 지출 합계와 잔액 계산
  const expense = items.reduce((sum, item) => sum + item.amount, 0);
  const balance = income - expense;

  // "추가하기" 버튼을 눌렀을 때
  const addItem = () => {
    const amount = Number(amountText);
    if (!amount || amount <= 0) return; // 숫자가 아니면 무시

    const newItem: Item = {
      id: Date.now().toString(),
      amount: amount,
      category: category,
    };
    setItems([newItem, ...items]);
    setAmountText("");
    Keyboard.dismiss();
  };

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

      {/* 지출 입력 */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="금액 입력 (예: 1200)"
          placeholderTextColor="#AAA"
          keyboardType="number-pad"
          value={amountText}
          onChangeText={setAmountText}
        />

        <View style={styles.chips}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.chip, category === c && styles.chipActive]}
            >
              <Text
                style={[styles.chipText, category === c && styles.chipTextActive]}
              >
                {c}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.button} onPress={addItem}>
          <Text style={styles.buttonText}>추가하기</Text>
        </Pressable>
      </View>

      {/* 지출 목록 */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>아직 지출이 없어요</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listCategory}>{item.category}</Text>
            <Text style={styles.listAmount}>
              -¥{item.amount.toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 20,
    paddingTop: 70,
    gap: 12,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#222" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16 },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  label: { fontSize: 14, color: "#888" },
  balance: { fontSize: 36, fontWeight: "bold", color: "#222", marginTop: 4 },
  amount: { fontSize: 20, fontWeight: "bold", marginTop: 4 },
  income: { color: "#2E7D32" },
  expense: { color: "#D32F2F" },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    color: "#222",
  },
  chips: { flexDirection: "row", gap: 8, marginTop: 12 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#EEE",
  },
  chipActive: { backgroundColor: "#222" },
  chipText: { color: "#555" },
  chipTextActive: { color: "#FFF", fontWeight: "bold" },
  button: {
    backgroundColor: "#3B6FE0",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  empty: { textAlign: "center", color: "#AAA", marginTop: 12 },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  listCategory: { fontSize: 16, color: "#222" },
  listAmount: { fontSize: 16, fontWeight: "bold", color: "#D32F2F" },
});