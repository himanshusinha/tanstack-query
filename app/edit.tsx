import { getTodoById, updateTodo } from '@/api/todo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Edit = () => {
    const [todo, setTodo] = useState<string>("");
    const { id } = useLocalSearchParams();
    const queryClient = useQueryClient();
    const { data, isPending, error } = useQuery({
        queryKey: ['todo', id],
        queryFn: () => getTodoById(id as string),
    })
    useEffect(() => {
        if (data) {
            setTodo(data.todo);
        }
    }, [data])
    const editMutation = useMutation({
        mutationFn: updateTodo,
        onSuccess: (data) => {
            console.log("Success", data);
            queryClient.invalidateQueries({
                queryKey: ['todos'],
            });
            router.back()
        }
    })
    const handleMutate = () => {
        editMutation.mutate({ id: id as string, todo, completed: data?.completed || false });

    }
    return (
        <View style={styles.container}>
            <TextInput style={styles.input} value={todo} onChangeText={setTodo} />
            <TouchableOpacity onPress={() => handleMutate()} style={styles.button}>
                <Text>Save</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Edit
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20
    },
    input: {
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    }
})