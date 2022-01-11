import * as React from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import { ButtonGroup, Card, Icon } from "react-native-elements";
import timeConverter from "./utils/timeConverter";
import getLocalizedString from "./utils/getLocalizedString";
import { useAccountContext } from "./providers/AccountProvider";

const color = {
    black: "#000",
    lightBlue: "#68a0cf",
    transparent: "transparent",
};

const styles = StyleSheet.create({
    accountInfo: {
        fontSize: 16,
        marginBottom: 10,
    },
});

const Account = React.memo(() => {
    const { getCurrentAccountInfo, current } = useAccountContext();
    const [user_info, setUserInfo] = React.useState<any>({});
    React.useEffect(() => {
        getCurrentAccountInfo().then(u => setUserInfo(u));
    }, []);

    function buttonPressed(buttonIndex) {
        const { url, username, password } = this.props.navigation.state.params;

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

        if (buttonIndex === 0) {
            this.props.navigation.navigate("Live", {
                url,
                username,
                password,
                buttonIndex,
                user_info,
            });
        } else if (buttonIndex === 1) {
            this.props.navigation.navigate("VODs", {
                url,
                username,
                password,
                buttonIndex,
                user_info,
            });
        } else if (buttonIndex === 2) {
            this.props.navigation.navigate("Series", {
                url,
                username,
                password,
                buttonIndex,
                user_info,
            });
        }
    }

    const checkForMessage = user_info.message ? (
        <Text selectable={false} style={styles.accountInfo}>
            {" "}
            {getLocalizedString("account.message")} {user_info.message}{" "}
        </Text>
    ) : null;

    const liveButton = () => <Icon name="television" type="font-awesome" />;
    const vodButton = () => <Icon name="video-camera" type="font-awesome" />;
    const seriesButton = () => <Icon name="film" type="font-awesome" />;
    const buttons = [{ element: liveButton }, { element: vodButton }, { element: seriesButton }];

    return (
        <ScrollView>
            <Text style={{ alignSelf: "center", fontSize: 30 }}>{current.id}</Text>
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
                {checkForMessage}
            </Card>
            <Card title={getLocalizedString("account.miscAccountInfo")}>
                <Text selectable={false} style={styles.accountInfo}>
                    {getLocalizedString("account.miscAccountInfoCreated")} {timeConverter(user_info.created_at)}
                </Text>
                <Text selectable={false} style={styles.accountInfo}>
                    {getLocalizedString("account.miscAccountInfoTrial")} {user_info.is_trial === "0" ? "No" : "Yes"}
                </Text>
                <Text selectable={false} style={styles.accountInfo}>
                    {getLocalizedString("account.miscAccountInfoActiveConns")} {user_info.active_cons}
                </Text>
                <Text selectable={false} style={styles.accountInfo}>
                    {getLocalizedString("account.miscAccountInfoMaxConns")} {user_info.max_connections}
                </Text>
            </Card>
        </ScrollView>
    );
});

export default Account;
