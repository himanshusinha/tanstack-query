import { createTodo, deleteTodo, getTodos, Todo, updateTodo } from "@/api/todo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, ListRenderItem, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [todo, setTodo] = useState<string>("")
  const queryClient = useQueryClient();
  const { data: todos, isPending, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  })

  const addMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (data) => {
      console.log("Success", data)
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });


  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });


  const handleAddTodo = () => {
    addMutation.mutate(todo);
    setTodo(""); // Clear the input after adding
  }
  if (isPending) {
    return (
      <View
        style={styles.container}
      >
        <ActivityIndicator size={30} color="black" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Error: {error?.message}</Text>
      </View>
    );
  }
  const renderTodo: ListRenderItem<Todo> = ({ item }) => {
    const handleDelete = () => {
      deleteMutation.mutate(item.id);
    }
    const handleToggleTodo = () => {
      const updatedTodo = { ...item, completed: !item.completed };
      updateMutation.mutate(updatedTodo);

    }
    return (
      <View style={styles.todoContainer}>
        <Text style={[styles.todoText, { textDecorationLine: item.completed ? "line-through" : "none" }]} onPress={() => handleToggleTodo()}>{item.todo}</Text>
        <View style={styles.todoActions}>

          <Link href={{ pathname: "/edit", params: { id: item.id } }} asChild>
            <TouchableOpacity>
              <Ionicons name="pencil-outline" size={25} color={'black'} />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity onPress={() => { handleDelete() }}>
            <Ionicons name="trash" size={25} color={'red'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View
      style={styles.container}
    >
      <View style={styles.addTodoContainer}>
        <TextInput style={styles.addTodoInput} placeholder="Add to do" value={todo} onChangeText={setTodo} />
        <TouchableOpacity onPress={() => { handleAddTodo() }}
        >
          <Ionicons name="add" size={25} color={'black'} />
        </TouchableOpacity>
      </View>
      <FlatList data={todos} renderItem={renderTodo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },
  todoContainer: {
    marginVertical: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center'

  },
  todoText: {
    width: '80%',
    fontSize: 18,
  },
  todoActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  addTodoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: '100%'
  },
  addTodoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  }
})
