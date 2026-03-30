import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { createAccounts, fetchAccounts } from "./accountsservices";

export default function Accounts() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAccounts,
  });

  const mutation = useMutation({
    mutationFn: createAccounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading users</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User List</Text>

      <FlatList
        style={{ marginTop: 20 }}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>
              {item.id} {item.name}
            </Text>
            <Text style={styles.todoItem}>{item.website}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  todoItem: {
    marginTop: 5,
    color: "#555",
  },
});
