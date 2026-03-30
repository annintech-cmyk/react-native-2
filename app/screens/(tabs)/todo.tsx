import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Todo = {
  id: string;
  name: string;
};

const STORAGE_KEYS = {
  async: "todos_async",
  secure: "todos_secure",
  sqlite: "todos_sqlite",
  file: "todos_file",
};

export default function MultiStorageTodos() {
  const [input, setInput] = useState("");

  const [asyncTodos, setAsyncTodos] = useState<Todo[]>([]);
  const [secureTodos, setSecureTodos] = useState<Todo[]>([]);
  const [sqliteTodos, setSqliteTodos] = useState<Todo[]>([]);
  const [fileTodos, setFileTodos] = useState<Todo[]>([]);

  // ---------- Helpers ----------
  const saveTodos = async (key: string, todos: Todo[]) => {
    await AsyncStorage.setItem(key, JSON.stringify(todos));
  };

  const loadTodos = async (key: string) => {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };

  const createTodo = (name: string): Todo => ({
    id: Date.now().toString(),
    name,
  });

  // ---------- Generic Handler ----------
  const handleSave = async (type: keyof typeof STORAGE_KEYS) => {
    if (!input.trim()) return;

    const newTodo = createTodo(input);
    const key = STORAGE_KEYS[type];

    let current: Todo[] = [];

    if (type === "async") current = asyncTodos;
    if (type === "secure") current = secureTodos;
    if (type === "sqlite") current = sqliteTodos;
    if (type === "file") current = fileTodos;

    const updated = [...current, newTodo];

    // update UI state
    if (type === "async") setAsyncTodos(updated);
    if (type === "secure") setSecureTodos(updated);
    if (type === "sqlite") setSqliteTodos(updated);
    if (type === "file") setFileTodos(updated);

    // persist
    await saveTodos(key, updated);

    setInput("");
  };

  const handleLoad = async (type: keyof typeof STORAGE_KEYS) => {
    const key = STORAGE_KEYS[type];
    const data = await loadTodos(key);

    if (type === "async") setAsyncTodos(data);
    if (type === "secure") setSecureTodos(data);
    if (type === "sqlite") setSqliteTodos(data);
    if (type === "file") setFileTodos(data);
  };

  // Load all on mount
  useEffect(() => {
    handleLoad("async");
    handleLoad("secure");
    handleLoad("sqlite");
    handleLoad("file");
  }, []);

  // ---------- UI ----------
  const renderList = (title: string, data: Todo[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.todoItem}>{item.name}</Text>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multi Storage Todo</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter todo"
        value={input}
        onChangeText={setInput}
      />

      {/* Buttons for each storage */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => handleSave("async")}>
          <Text style={styles.buttonText}>Save Async</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleSave("secure")}>
          <Text style={styles.buttonText}>Save Secure</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleSave("sqlite")}>
          <Text style={styles.buttonText}>Save SQLite</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleSave("file")}>
          <Text style={styles.buttonText}>Save File</Text>
        </TouchableOpacity>
      </View>

      {/* Load buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.loadButton} onPress={() => handleLoad("async")}>
          <Text>Load Async</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loadButton} onPress={() => handleLoad("secure")}>
          <Text>Load Secure</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loadButton} onPress={() => handleLoad("sqlite")}>
          <Text>Load SQLite</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loadButton} onPress={() => handleLoad("file")}>
          <Text>Load File</Text>
        </TouchableOpacity>
      </View>

      {/* Separate Lists */}
      {renderList("AsyncStorage Todos", asyncTodos)}
      {renderList("SecureStore Todos", secureTodos)}
      {renderList("SQLite Todos", sqliteTodos)}
      {renderList("FileSystem Todos", fileTodos)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
  },
  loadButton: {
    backgroundColor: "#ddd",
    padding: 8,
    borderRadius: 6,
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  todoItem: {
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
