import * as React from "react";
import { IAccount, useAccountContext } from "./providers/AccountProvider";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { IconButton, Menu, Divider } from "react-native-paper";
import { ListItem } from "react-native-elements";
import { NavigationInjectedProps } from "react-navigation";
import Account from "./Account";
import getLocalizedString from "./utils/getLocalizedString";

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

const Home = React.memo<NavigationInjectedProps>(props => {
    const { accounts, current, setAsCurrent, remove } = useAccountContext();
    const [accountMenuVisible, setAccountMenuVisible] = React.useState<string>(null);

    const onDeleteClick = (account: IAccount) => {
        setAccountMenuVisible(null);
        Alert.alert(
            "Delete",
            `Delete playlist '${account.name}'?`,
            [{ text: "Yes", onPress: () => remove(account.id) }, { text: "No" }],
            { cancelable: false },
        );
    };

    if (current) {
        return <Account {...props} />;
    }
    return (
        <ScrollView contentContainerStyle={!accounts.length ? styles.activityContainer : {}}>
            {!!accounts.length ? (
                <>
                    <Text style={{ alignSelf: "center", fontSize: 20, marginBottom: 5, marginTop: 5 }}>Playlists</Text>
                    {accounts.map(account => (
                        <ListItem
                            key={account.id}
                            hasTVPreferredFocus
                            tvParallaxProperties
                            onPress={() => setAsCurrent(account.id)}>
                            <Menu
                                visible={accountMenuVisible == account.id}
                                onDismiss={() => setAccountMenuVisible(null)}
                                anchor={
                                    <IconButton icon={"pencil"} onPress={() => setAccountMenuVisible(account.id)} />
                                }>
                                <Menu.Item title={account.name} titleStyle={{ color: "brown", textAlign: "center" }} />
                                {/*<Menu.Item*/}
                                {/*    onPress={() => {}}*/}
                                {/*    title="Edit"*/}
                                {/*    icon={"pencil"}*/}
                                {/*    titleStyle={{ color: "blue" }}*/}
                                {/*/>*/}
                                <Menu.Item
                                    onPress={() => onDeleteClick(account)}
                                    title="Delete"
                                    icon={"delete"}
                                    titleStyle={{ color: "red" }}
                                />
                            </Menu>
                            <Text>{account.name}</Text>
                        </ListItem>
                    ))}
                </>
            ) : (
                <>
                    <Text style={{ fontSize: 20 }}>You have not added any playlists yet.</Text>
                    <Text style={{ fontSize: 20, marginTop: 30 }}>Press "+" button to add a playlist.</Text>
                </>
            )}
        </ScrollView>
    );
});

export default Home;
