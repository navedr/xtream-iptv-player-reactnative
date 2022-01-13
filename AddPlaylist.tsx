import * as React from "react";
import { Alert, StyleSheet, ScrollView } from "react-native";
import { Button, TextInput } from "react-native-paper";

import Toast, { DURATION } from "react-native-easy-toast";

import getLocalizedString from "./utils/getLocalizedString";
import { NavigationInjectedProps } from "react-navigation";
import { useAccountContext } from "./providers/AccountProvider";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInputStyle: {},
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

const AddPlaylist = React.memo<NavigationInjectedProps>(({ navigation: { navigate } }) => {
    const toast = React.useRef<any>();
    const { add } = useAccountContext();
    const [name, setName] = React.useState<string>();
    const [url, setUrl] = React.useState<string>();
    const [username, setUserName] = React.useState<string>();
    const [password, setPassword] = React.useState<string>();
    const checkFields = async () => {
        if (!name) {
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

        const response = await add(name, url, username, password);
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
                autoFocus
                onChangeText={name => setName(name)}
                placeholder={"Name"}
                style={styles.textInputStyle}
                mode={"flat"}
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
            <Button icon={"plus"} mode={"contained"} onPress={() => checkFields()} style={{ marginTop: 10 }}>
                Add
            </Button>
            <Toast ref={toast} />
        </ScrollView>
    );
});

export default AddPlaylist;
