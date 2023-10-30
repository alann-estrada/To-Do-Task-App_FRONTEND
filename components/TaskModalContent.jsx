import { useState } from "react";
import { Button, Keyboard, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function TaskModalContent({ id, title }) {
  const [email, setEmail] = useState("");
  const [focus, setFocus] = useState(false);

  const handleSubmit = async () => {
    const requestData = {
      task_id: id,
      user_id: 1,
      email: email,
    };
    const response = await fetch("http://192.168.0.13:8080/task/shared_task", {
      headers: {
        "x-api-key": "abcdef123456",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(requestData),
    });

    // console.log(requestData);
    // console.log("Response Status Code:", response.status);
    // console.log("Response Headers:", response.headers);

    // const responseBodyText = await response.text();
    // console.log("Response Body (Text):", responseBodyText);

    // let responseBodyJSON;
    // try {
    //   responseBodyJSON = JSON.parse(responseBodyText);
    //   console.log("Response Body (JSON):", responseBodyJSON);
    // } catch (error) {
    //   console.error("Error parsing JSON response:", error);
    // } No eliminar en caso de algun error inesperado

    const data = await response.json();
    // console.log(data);
    Keyboard.dismiss();
    setEmail("");
    setFocus(false);
    if (response.ok) {
      Toast.show({
        type: "success",
        text1: "Congratulations!",
        text2: `You successfully shared ${title} with ${email}`,
        visibilityTime: 2000,
        autoHide: true,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Oops :(",
        text2: `An error has occurred, please try again`,
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  };

  return (
    <View style={styles.contentContainer}>
      <Text style={[styles.title, { marginBottom: 20 }]}>Share your task</Text>
      <Text style={[styles.title, { marginBottom: 20 }]}>"{title}"</Text>
      <Text style={styles.description}>
        Enter the email of the user you want to share your task with. Share a
        task with someone and stay in sinc with your goals everyday.
      </Text>
      <TextInput
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        keyboardType="email-address"
        style={[
          styles.input,
          focus && { borderWidth: 3, borderColor: "black" },
        ]}
        placeholder="Enter your contact email"
      />
      <Button
        onPress={handleSubmit}
        title="Share"
        disabled={email.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  title: {
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 16,
    textAlign: "center",
  },
  description: {
    color: "#56636F",
    fontSize: 13,
    fontWeight: "normal",
    width: "100%",
  },
  input: {
    borderWidth: 2,
    borderColor: "#00000020",
    padding: 15,
    borderRadius: 15,
    marginVertical: 15,
  },
});
