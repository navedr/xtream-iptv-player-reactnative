import * as React from "react";
import { ActivityIndicator, Linking, Platform, StyleSheet, Text, ScrollView } from "react-native";
import { Button, Card, Divider } from "react-native-elements";
import getEPG from "./api/getEPG";
import timeConverter from "./utils/timeConverter";
import { play } from "react-native-vlc-player";
import { ConfirmDialog } from "react-native-simple-dialogs";
import getLocalizedString from "./utils/getLocalizedString";
import { NavigationInjectedProps } from "react-navigation";
import { utf8Decode } from "./common/utils";

const colors = {
    deepSkyBlue: "#03A9F4",
};

const styles = StyleSheet.create({
    activityContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        marginBottom: 10,
        fontSize: 16,
    },
    button: {
        borderRadius: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
    },
});

const base64 = require("base-64");

class LiveChannel extends React.PureComponent<
    NavigationInjectedProps,
    {
        dialogVisible: boolean;
        loadingChannelEPG: boolean;
        epg: {
            epg_listings: any[];
        };
    }
> {
    public state = {
        dialogVisible: false,
        loadingChannelEPG: true,
        epg: {
            epg_listings: [],
        },
    };

    async componentDidMount() {
        const { url, username, password, item } = this.props.navigation.state.params;
        const epg = await getEPG(url, username, password, item.stream_id);
        this.setState({
            loadingChannelEPG: false,
            epg,
        });
    }

    viewNow() {
        const { url, username, password, item } = this.props.navigation.state.params;
        const uri = url + "/live/" + username + "/" + password + "/" + item.stream_id + ".ts";
        this.props.navigation.navigate("VideoPlayer", {
            uri,
        });
        // if (Platform.OS === "android" || Platform.OS === "ios") {
        //     this.setState({ dialogVisible: true });
        // } else {
        //     throw new Error("Platform not recognized: " + Platform.OS);
        // }
        //
        // return this;
    }

    renderEPG() {
        const { epg } = this.state;
        let noEPG = null;
        let EPGTitle = null;
        let EPGDescription = null;
        let EPGStart = null;
        let EPGEnd = null;

        if (!epg.epg_listings.length) {
            noEPG = <Text style={styles.text}>{getLocalizedString("liveChannel.epgNotFound")}</Text>;
        } else {
            EPGTitle = (
                <Text style={styles.text}>
                    {getLocalizedString("liveChannel.epgTitle")} {utf8Decode(base64.decode(epg.epg_listings[0].title))}
                </Text>
            );
            EPGDescription = (
                <Text style={styles.text}>
                    {getLocalizedString("liveChannel.epgDesc")}{" "}
                    {utf8Decode(base64.decode(epg.epg_listings[0].description))}
                </Text>
            );
            EPGStart = (
                <Text style={styles.text}>
                    {getLocalizedString("liveChannel.epgStartTime")}{" "}
                    {timeConverter(epg.epg_listings[0].start_timestamp)}
                </Text>
            );
            EPGEnd = (
                <Text style={styles.text}>
                    {getLocalizedString("liveChannel.epgEndTime")} {timeConverter(epg.epg_listings[0].stop_timestamp)}
                </Text>
            );
        }
        return (
            <>
                {noEPG}
                {EPGTitle}
                {EPGDescription}
                {EPGStart}
                {EPGEnd}
            </>
        );
    }

    _renderDialog() {
        const { url, username, password, item } = this.props.navigation.state.params;
        const message = getLocalizedString("liveChannel.message");
        const uri = url + "/live/" + username + "/" + password + "/" + item.stream_id + ".ts";

        return (
            <ConfirmDialog
                message={message}
                negativeButton={{
                    onPress: () => {
                        this.setState({ dialogVisible: false });
                        this.props.navigation.navigate("VideoPlayer", {
                            uri,
                        });
                        // if (Platform.OS === "android") {
                        //     play(uri);
                        // } else if (Platform.OS === "ios") {
                        //     this.props.navigation.navigate("PlayeriOS", {
                        //         uri,
                        //     });
                        // } else {
                        //     throw new Error("Platform not recognized: " + Platform.OS);
                        // }
                    },
                    title: getLocalizedString("liveChannel.no"),
                }}
                onTouchOutside={() => this.setState({ dialogVisible: false })}
                positiveButton={{
                    onPress: () => {
                        this.setState({ dialogVisible: false });
                        if (Platform.OS === "android") {
                            Linking.openURL(uri);
                        } else if (Platform.OS === "ios") {
                            Linking.openURL("vlc-x-callback://x-callback-url/stream?url=" + uri);
                        } else {
                            throw new Error("Platform not recognized: " + Platform.OS);
                        }
                    },
                    title: getLocalizedString("liveChannel.yes"),
                }}
                title={getLocalizedString("liveChannel.title")}
                visible={this.state.dialogVisible}
            />
        );
    }

    _renderCard() {
        const { url, username, password, item } = this.props.navigation.state.params;

        return (
            <Card
                image={item.stream_icon && { uri: item.stream_icon }}
                imageProps={{ resizeMode: "contain" }}
                title={item.name}>
                {this.renderEPG()}
                <Button
                    backgroundColor={colors.deepSkyBlue}
                    buttonStyle={styles.button}
                    icon={{ name: "list-alt", type: "font-awesome" }}
                    onPress={() =>
                        this.props.navigation.navigate("LiveChannelFullEPG", {
                            url,
                            username,
                            password,
                            ch: item,
                        })
                    }
                    title={getLocalizedString("liveChannel.fullEPG")}
                />
                <Divider style={{ backgroundColor: "#ffffff" }} />
                <Button
                    backgroundColor={colors.deepSkyBlue}
                    buttonStyle={styles.button}
                    icon={{ name: "eye", type: "font-awesome" }}
                    onPress={() => this.viewNow()}
                    title={getLocalizedString("liveChannel.viewNow")}
                />
            </Card>
        );
    }

    render() {
        const { loadingChannelEPG, dialogVisible } = this.state;

        if (loadingChannelEPG) {
            return (
                <ScrollView contentContainerStyle={styles.activityContainer}>
                    <ActivityIndicator animating hidesWhenStopped size="large" />
                    <Text>{getLocalizedString("liveChannel.activityIndicatorText")}</Text>
                </ScrollView>
            );
        }

        if (dialogVisible) {
            return this._renderDialog();
        }

        return <ScrollView>{this._renderCard()}</ScrollView>;
    }
}

export default LiveChannel;
