import * as React from "react";
import { StyleSheet, Text, ScrollView, ActivityIndicator } from "react-native";
import { ButtonGroup, Card, Icon } from "react-native-elements";
import timeConverter from "./utils/timeConverter";
import getLocalizedString from "./utils/getLocalizedString";
import { useAccountContext } from "./providers/AccountProvider";
import { NavigationInjectedProps } from "react-navigation";

const color = {
    black: "#000",
    lightBlue: "#68a0cf",
    transparent: "transparent",
};

const styles = StyleSheet.create({
    activityContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    accountInfo: {
        fontSize: 16,
        marginBottom: 10,
    },
});

interface IUserInfo {
    active_cons: number;
    allowed_output_formats: string[];
    auth: number;
    created_at: number;
    exp_date: number;
    is_trial: string;
    max_connections: number;
    message: string;
    password: string;
    status: string;
    username: string;
}

const Account = React.memo<NavigationInjectedProps>(({ navigation: { navigate } }) => {
    const { getCurrentAccountInfo, current } = useAccountContext();
    const [user_info, setUserInfo] = React.useState<IUserInfo>(null);

    React.useEffect(() => {
        getCurrentAccountInfo()
            .catch(() => console.log("error getting account info"))
            .then(u => setUserInfo(u));
    }, [current]);

    function buttonPressed(buttonIndex) {
        const { url, username, password, id } = current;

        // if (user_info.status === "Expired") {
        //     Alert.alert(
        //       getLocalizedString("account.expiredError"),
        //       getLocalizedString("account.expiredErrorDesc"),
        //       [{ text: "OK" }],
        //       { cancelable: false },
        //     );
        //
        //     return;
        // }

        // if (parseInt(user_info.active_cons) >= parseInt(user_info.max_connections)) {
        //     Alert.alert(
        //         getLocalizedString("account.activeConsError"),
        //         getLocalizedString("account.activeConsErrorDesc"),
        //         [{ text: "OK" }],
        //         { cancelable: false },
        //     );
        //
        //     return;
        // }
        let route = null;
        switch (buttonIndex) {
            case 0:
                route = "Live";
                break;
            case 1:
                route = "VODs";
                break;
            case 2:
                route = "Series";
                break;
        }
        navigate(route, {
            id,
            url,
            username,
            password,
            buttonIndex,
            user_info,
        });
    }

    const liveButton = () => <Icon name="television" type="font-awesome" />;
    const vodButton = () => <Icon name="video-camera" type="font-awesome" />;
    const seriesButton = () => <Icon name="film" type="font-awesome" />;
    const buttons = [{ element: liveButton }, { element: vodButton }, { element: seriesButton }];

    return (
        <>
            {user_info ? (
                <ScrollView>
                    <Text style={{ alignSelf: "center", fontSize: 30 }}>Playlist: {current.id}</Text>
                    <ButtonGroup
                        buttons={buttons}
                        containerStyle={{ backgroundColor: color.transparent, borderColor: color.black }}
                        innerBorderStyle={{ color: color.black }}
                        onPress={buttonIndex => buttonPressed(buttonIndex)}
                    />
                    <Card title={getLocalizedString("account.mainAccountInfo")}>
                        <Text selectable={false} style={styles.accountInfo}>
                            {getLocalizedString("account.mainAccountInfoUsername")} {user_info.username}
                        </Text>
                        <Text selectable={false} style={styles.accountInfo}>
                            {getLocalizedString("account.mainAccountInfoExpires")} {timeConverter(user_info.exp_date)}
                        </Text>
                        <Text selectable={false} style={styles.accountInfo}>
                            {getLocalizedString("account.mainAccountInfoStatus")} {user_info.status}
                        </Text>
                        {!!user_info.message && (
                            <Text selectable={false} style={styles.accountInfo}>
                                {getLocalizedString("account.message")} {user_info.message}
                            </Text>
                        )}
                    </Card>
                    <Card title={getLocalizedString("account.miscAccountInfo")}>
                        <Text selectable={false} style={styles.accountInfo}>
                            {getLocalizedString("account.miscAccountInfoCreated")} {timeConverter(user_info.created_at)}
                        </Text>
                        <Text selectable={false} style={styles.accountInfo}>
                            {getLocalizedString("account.miscAccountInfoTrial")}{" "}
                            {user_info.is_trial === "0" ? "No" : "Yes"}
                        </Text>
                        <Text selectable={false} style={styles.accountInfo}>
                            {getLocalizedString("account.miscAccountInfoActiveConns")} {user_info.active_cons}
                        </Text>
                        <Text selectable={false} style={styles.accountInfo}>
                            {getLocalizedString("account.miscAccountInfoMaxConns")} {user_info.max_connections}
                        </Text>
                    </Card>
                </ScrollView>
            ) : (
                <ScrollView contentContainerStyle={styles.activityContainer}>
                    <ActivityIndicator animating hidesWhenStopped size="large" />
                </ScrollView>
            )}
        </>
    );
});

export default Account;
