import * as React from "react";
import { ActivityIndicator, Linking, Platform, StyleSheet, Text, ScrollView } from "react-native";
import { Button, Card } from "react-native-elements";
import getVODInfo from "./api/getVODInfo";
import { play } from "react-native-vlc-player";
import { ConfirmDialog } from "react-native-simple-dialogs";
import getLocalizedString from "./utils/getLocalizedString";
import { utf8Decode } from "./common/utils";
import { NavigationInjectedProps } from "react-navigation";

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

class VODChannel extends React.PureComponent<
    NavigationInjectedProps,
    {
        dialogVisible: boolean;
        loadingInfo: boolean;
        info: {
            info?: {
                cast?: string;
                plot?: string;
                genre?: string;
                rating?: string;
                director?: string;
                releasedate?: string;
                duration?: string;
            };
        };
    }
> {
    public state = {
        dialogVisible: false,
        loadingInfo: true,
        info: {
            info: null,
        },
    };

    async componentDidMount() {
        const { url, username, password, item } = this.props.navigation.state.params;
        const info = await getVODInfo(url, username, password, item.stream_id);
        this.setState({
            loadingInfo: false,
            info,
        });
    }

    viewNow() {
        const { url, username, password, item } = this.props.navigation.state.params;
        const uri = url + "/movie/" + username + "/" + password + "/" + item.stream_id + "." + item.container_extension;
        this.props.navigation.navigate("VideoPlayer", {
            uri,
        });
        // if (Platform.OS === "android" || Platform.OS === "ios") {
        //     this.setState({ dialogVisible: true });
        // } else {
        //     throw new Error("Platform not recognized: " + Platform.OS);
        // }
        // return this;
    }

    renderInfo() {
        const { info } = this.state;
        const { item } = this.props.navigation.state.params;
        return item.stream_icon ? (
            <Card image={{ uri: item.stream_icon }} imageProps={{ resizeMode: "contain" }} title={item.name}>
                {info.info.plot ? (
                    <Text>
                        {getLocalizedString("vodChannel.plot")} {utf8Decode(info.info.plot) + "\r\n"}
                    </Text>
                ) : null}
                {info.info.cast ? (
                    <Text>
                        {getLocalizedString("vodChannel.cast")} {utf8Decode(info.info.cast) + "\r\n"}
                    </Text>
                ) : null}
                {info.info.genre ? (
                    <Text>
                        {getLocalizedString("vodChannel.genre")} {utf8Decode(info.info.genre) + "\r\n"}
                    </Text>
                ) : null}
                {info.info.rating ? (
                    <Text>
                        {getLocalizedString("vodChannel.rating")} {utf8Decode(info.info.rating)} / 10 {"\r\n"}
                    </Text>
                ) : null}
                {info.info.director ? (
                    <Text>
                        {getLocalizedString("vodChannel.director")} {utf8Decode(info.info.director) + "\r\n"}
                    </Text>
                ) : null}
                {info.info.releasedate ? (
                    <Text>
                        {getLocalizedString("vodChannel.releasedate")} {utf8Decode(info.info.releasedate) + "\r\n"}
                    </Text>
                ) : null}
                {info.info.duration ? (
                    <Text>
                        {getLocalizedString("vodChannel.duration")} {utf8Decode(info.info.duration) + "\r\n"}
                    </Text>
                ) : null}
                <Button
                    backgroundColor={colors.deepSkyBlue}
                    buttonStyle={styles.button}
                    icon={{ name: "eye", type: "font-awesome" }}
                    onPress={() => this.viewNow()}
                    title={getLocalizedString("vodChannel.viewNow")}
                />
            </Card>
        ) : (
            <Card title={item.name}>
                {info.info.plot ? (
                    <Text>
                        {getLocalizedString("vodChannel.plot")} {utf8Decode(info.info.plot) + "\r\n"}
                    </Text>
                ) : null}
                {info.info.cast ? (
                    <Text>
                        {getLocalizedString("vodChannel.cast")} {utf8Decode(info.info.cast) + "\r\n"}
                    </Text>
                ) : null}
                {info.info.genre ? (
                    <Text>
                        {getLocalizedString("vodChannel.genre")} {utf8Decode(info.info.genre) + "\r\n"}
                    </Text>
                ) : null}
                {info.info.rating ? (
                    <Text>
                        {getLocalizedString("vodChannel.rating")} {utf8Decode(info.info.rating)} / 10 {"\r\n"}
                    </Text>
                ) : null}
                {info.info.director ? (
                    <Text>
                        {getLocalizedString("vodChannel.director")} {utf8Decode(info.info.director) + "\r\n"}
                    </Text>
                ) : null}
                {info.info.releasedate ? (
                    <Text>
                        {getLocalizedString("vodChannel.releasedate")} {utf8Decode(info.info.releasedate) + "\r\n"}
                    </Text>
                ) : null}
                {info.info.duration ? (
                    <Text>
                        {getLocalizedString("vodChannel.duration")} {utf8Decode(info.info.duration) + "\r\n"}
                    </Text>
                ) : null}
                <Button
                    backgroundColor={colors.deepSkyBlue}
                    buttonStyle={styles.button}
                    icon={{ name: "eye", type: "font-awesome" }}
                    onPress={() => this.viewNow()}
                    title={getLocalizedString("vodChannel.viewNow")}
                />
            </Card>
        );
    }

    renderDialog() {
        const { url, username, password, item } = this.props.navigation.state.params;
        const message = getLocalizedString("vodChannel.message");
        const uri = url + "/movie/" + username + "/" + password + "/" + item.stream_id + "." + item.container_extension;
        return (
            <ConfirmDialog
                message={message}
                negativeButton={{
                    onPress: () => {
                        this.setState({ dialogVisible: false });
                        // this.props.navigation.navigate("VideoPlayer", {
                        //     uri,
                        // });
                        if (Platform.OS === "android") {
                            play(uri);
                        } else if (Platform.OS === "ios") {
                            this.props.navigation.navigate("PlayeriOS", {
                                uri,
                            });
                        } else {
                            throw new Error("Platform not recognized: " + Platform.OS);
                        }
                    },
                    title: getLocalizedString("vodChannel.no"),
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
                    title: getLocalizedString("vodChannel.yes"),
                }}
                title={getLocalizedString("vodChannel.title")}
                visible={this.state.dialogVisible}
            />
        );
    }

    render() {
        const { loadingInfo } = this.state;
        if (loadingInfo) {
            return (
                <ScrollView contentContainerStyle={styles.activityContainer}>
                    <ActivityIndicator animating hidesWhenStopped size="large" />
                    <Text>{getLocalizedString("VODChannel.activityIndicatorText")}</Text>
                </ScrollView>
            );
        }

        if (this.state.dialogVisible) {
            return this.renderDialog();
        }

        return <ScrollView>{this.renderInfo()}</ScrollView>;
    }
}

export default VODChannel;
