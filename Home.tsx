import * as React from "react";
import { useAccountContext } from "./providers/AccountProvider";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import Login from "./Login";
import { NavigationInjectedProps } from "react-navigation";
import Account from "./Account";

const styles = StyleSheet.create({
    activityContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    listContainer: {
        flex: 1,
    },
    listItem: {
        padding: 10,
        fontSize: 20,
        height: 44,
    },
});

const Home = React.memo<NavigationInjectedProps>(({ navigation: { navigate } }) => {
    const { current } = useAccountContext();
    return (
        <ScrollView contentContainerStyle={styles.activityContainer}>
            {current ? (
                <Account />
            ) : (
                <Button
                    icon={{ name: "plus", type: "font-awesome" }}
                    large
                    title={"Add Playlist"}
                    onPress={() => navigate("Login")}
                />
            )}
        </ScrollView>
    );
});

export default Home;
