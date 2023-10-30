import { StatusBar } from "expo-status-bar";
import { useEffect, React, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Task from "./components/task";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "react-native-gesture-handler";
import {
  GestureHandlerRootView,
  RefreshControl,
} from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import InputTask from "./components/InputTask";

export default function App() {
  const [task, setTask] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://192.168.0.13:8080/task/1", {
        headers: {
          "x-api-key": "abcdef123456",
        },
      });
      const data = await response.json();
      setTask(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  function clearTask(id) {
    // Filtrar las tareas y actualizar el estado
    const updatedTasks = task.filter((task) => task.id !== id);
    setTask(updatedTasks);

    Toast.show({
      type: "success", // En caso de modificaciones y otras implementaciones para otros proyectos se pueden usar 'success', 'error', 'info', etc. Ademas se puede mantener esto para manejar algunas configuraciones
      text1: "Task Deleted",
      text2: "The task has been successfully deleted",
      visibilityTime: 2000, // Tiempo en milisegundos, se podria cambiar dependiendo las necesidades
      autoHide: true,
      position: "top",
    });
    console.log("Task removed successfully");
    onRefresh();
  }

  function toggleTask(id) {
    setTask(
      task.map((task) =>
        task.id === id
          ? { ...task, completed: task.completed === 1 ? 0 : 1 }
          : task
      )
    );
  }

  useEffect(() => {
    fetchData();
  });

  // const toastConfig = {
  //   success: (internalState) => (
  //     <View style={styles.toastContainer}>
  //       <Text style={styles.toastText}>Título del mensaje</Text>
  //       <Text style={styles.toastText}>
  //         The task has been successfully deleted
  //       </Text>
  //     </View>
  //   ),
  // };
  //configuraciones personalizadas de toast

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <StatusBar style="auto" />
        <SafeAreaView style={styles.container}>
          <FlatList
            data={task}
            keyExtractor={(task) => task.id.toString()}
            renderItem={({ item }) => (
              <Task
                key={item.id}
                {...item}
                toggleTask={toggleTask}
                clearTask={clearTask}
                setTask={setTask}
              />
            )}
            ListHeaderComponent={() => <Text style={styles.title}>Today</Text>}
            contentContainerStyle={styles.contentContainerStyle}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          <InputTask task={task} setTask={setTask} />
        </SafeAreaView>
        <Toast ref={(ref) => Toast.setRef(ref)} />
        {/*Para usar configuraciones predeterminadas de toast*/}
        {/* <Toast config={toastConfig} r /> Para configuraciones personalizadas de toast */}
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E9E9EF",
//   },
//   contentContainerStyle: {
//     padding: 15,
//   },
//   title: {
//     fontWeight: "800",
//     fontSize: 28,
//     marginBottom: 15,
//     marginTop: 15,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#262626",
  },
  contentContainerStyle: {
    padding: 15,
  },
  title: {
    fontWeight: "800",
    fontSize: 28,
    marginBottom: 15,
    marginTop: 15,
    color: "#fff",
  },
});
