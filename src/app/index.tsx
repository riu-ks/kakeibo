import * as SQLite from "expo-sqlite";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// 데이터베이스 열기 (없으면 새로 만들어짐)
const db = SQLite.openDatabaseSync("kakeibo.db");

// expenses(지출) 표 만들기 (이미 있으면 그대로 둠)
db.execSync(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount INTEGER NOT NULL,
    category TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

type Item = {
  id: number;
  amount: number;
  category: string;
  created_at: string;
};

const CATEGORIES = ["식비","취미","카페", "교통비", "생활용품", "기타"];

export default function Index() {
  const income = 200000;

  // 앱이 켜질 때 DB에서 지출 목록 불러오기
  const [items, setItems] = useState<Item[]>(() =>
    db.getAllSync<Item>("SELECT * FROM expenses ORDER BY id DESC")
  );
  const [amountText, setAmountText] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  const expense = items.reduce((sum, item) => sum + item.amount, 0);
  const balance = income - expense;

  // 추가: DB에 저장 + 화면에 반영
  const addItem = () => {
    const amount = Number(amountText);
    if (!amount || amount <= 0) return;

    const createdAt = new Date().toISOString();
    const result = db.runSync(
      "INSERT INTO expenses (amount, category, created_at) VALUES (?, ?, ?)",
      amount,
      category,
      createdAt
    );

    const newItem: Item = {
      id: result.lastInsertRowId,
      amount: amount,
      category: category,
      created_at: createdAt,
    };
    setItems([newItem, ...items]);
    setAmountText("");
    Keyboard.dismiss();
  };

  // 삭제: 길게 누르면 확인 후 삭제
  const deleteItem = (item: Item) => {
    Alert.alert("삭제할까요?", `${item.category} ¥${item.amount.toLocaleString()}`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          db.runSync("DELETE FROM expenses WHERE id = ?", item.id);
          setItems(items.filter((i) => i.id !== item.id));
        },
      },
    ]);
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

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.empty}>아직 지출이 없어요</Text>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.listItem} onLongPress={() => deleteItem(item)}>
            <Text style={styles.listCategory}>{item.category}</Text>
            <Text style={styles.listAmount}>
              -¥{item.amount.toLocaleString()}
            </Text>
          </Pressable>
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
  chips: { flexDirection: "row", gap: 8, marginTop: 12 ,flexWrap:"wrap"},
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