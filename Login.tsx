import * as React from "react";
import { Alert, StyleSheet, ScrollView, TextInput } from "react-native";
import { Button } from "react-native-elements";

import Toast, { DURATION } from "react-native-easy-toast";

import getLocalizedString from "./utils/getLocalizedString";
import { NavigationInjectedProps } from "react-navigation";
import { useAccountContext } from "./providers/AccountProvider";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    textInputStyle: {
        width: 200,
        height: 45,
    },
    image: {
        height: 125,
        width: 125,
    },
});

function handleFirstConnectivityChange(connectionInfo) {
    const { type } = connectionInfo;

    if (type !== "wifi" && type !== "wimax") {
        Alert.alert(
            getLocalizedString("login.wifiWarning"),
            getLocalizedString("login.wifiWarningDesc"),
            [{ text: "OK" }],
            { cancelable: false },
        );
    }

    // NetInfo.removeEventListener("connectionChange", handleFirstConnectivityChange);
}

const Login = React.memo<NavigationInjectedProps>(({ navigation: { navigate } }) => {
    const toast = React.useRef();
    const { add } = useAccountContext();
    const [id, setId] = React.useState<string>();
    const [url, setUrl] = React.useState<string>();
    const [username, setUserName] = React.useState<string>();
    const [password, setPassword] = React.useState<string>();
    const checkFields = async () => {
        if (!id) {
            toast.current.show("Please enter a name", DURATION.LENGTH_SHORT);
            return;
        }
        if (!url) {
            toast.current.show(getLocalizedString("login.toastEmptyURL"), DURATION.LENGTH_SHORT);
            return;
        }
        if (!url.startsWith("http") || url.startsWith("https")) {
            toast.current.show(getLocalizedString("login.toastInvalidURL"), DURATION.LENGTH_SHORT);
            return;
        }

        if (!username) {
            toast.current.show(getLocalizedString("login.toastUsername"), DURATION.LENGTH_SHORT);
            return;
        }

        if (!password) {
            toast.current.show(getLocalizedString("login.toastPassword"), DURATION.LENGTH_SHORT);
            return;
        }

        const response = await add(id, url, username, password);
        if (response) {
            toast.current.show(response, DURATION.LENGTH_SHORT);
        } else {
            navigate("Home", {});
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={name => setId(name)}
                placeholder={"Name"}
                style={styles.textInputStyle}
            />
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={urlText => setUrl(urlText)}
                placeholder={getLocalizedString("login.placeholderURL")}
                style={styles.textInputStyle}
            />
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={usernameText => setUserName(usernameText)}
                placeholder={getLocalizedString("login.placeholderUsername")}
                style={styles.textInputStyle}
            />
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={passwordText => setPassword(passwordText)}
                placeholder={getLocalizedString("login.placeholderPassword")}
                secureTextEntry
                style={styles.textInputStyle}
            />
            <Button
                icon={{ name: "key", type: "font-awesome" }}
                large
                onPress={() => checkFields()}
                title={getLocalizedString("login.loginButton")}
            />
            <Toast ref={toast} />
        </ScrollView>
    );
});

export default Login;
