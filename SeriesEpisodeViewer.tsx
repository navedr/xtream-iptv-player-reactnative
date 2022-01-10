import * as React from "react";
import { Linking, Platform, StyleSheet, ScrollView, Text } from "react-native";
import { Button, Card } from "react-native-elements";
import { play } from "react-native-vlc-player";
import { ConfirmDialog } from "react-native-simple-dialogs";
import getLocalizedString from "./utils/getLocalizedString";
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

class SeriesEpisodePicker extends React.PureComponent<
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

    renderDialog() {
        const { url, username, password, episode } = this.props.navigation.state.params;
        const message = getLocalizedString("liveChannel.message");
        const uri = url + "/series/" + username + "/" + password + "/" + episode.id + "." + episode.container_extension;

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

    viewNow() {
        if (Platform.OS === "android" || Platform.OS === "ios") {
            this.setState({ dialogVisible: true });
        } else {
            throw new Error("Platform not recognized: " + Platform.OS);
        }

        return this;
    }

    render() {
        const { episode } = this.props.navigation.state.params;

        if (this.state.dialogVisible) {
            return this.renderDialog();
        }

        return (
            <ScrollView>
                {episode.info.movie_image ? (
                    <Card
                        image={{ uri: episode.info.movie_image }}
                        imageProps={{ resizeMode: "contain" }}
                        title={episode.title}>
                        {episode.info.name.length ? <Text>Name:{episode.info.name}</Text> : null}
                        {episode.info.plot.length ? <Text>Plot: {episode.info.plot}</Text> : null}
                        {episode.info.releasedate.length ? <Text>Release Date: {episode.info.releasedate}</Text> : null}
                        {episode.info.rating.length ? <Text>Rating: {episode.info.rating}</Text> : null}
                        <Button
                            backgroundColor={colors.deepSkyBlue}
                            buttonStyle={styles.button}
                            icon={{ name: "eye", type: "font-awesome" }}
                            onPress={() => this.viewNow()}
                            title={getLocalizedString("liveChannel.viewNow")}
                        />
                    </Card>
                ) : (
                    <Card title={episode.title}>
                        {episode.info.name.length ? <Text>Name:{episode.info.name}</Text> : null}
                        {episode.info.plot.length ? <Text>Plot: {episode.info.plot}</Text> : null}
                        {episode.info.releasedate.length ? <Text>Release Date: {episode.info.releasedate}</Text> : null}
                        {episode.info.rating.length ? <Text>Rating: {episode.info.rating}</Text> : null}
                        <Button
                            backgroundColor={colors.deepSkyBlue}
                            buttonStyle={styles.button}
                            icon={{ name: "eye", type: "font-awesome" }}
                            onPress={() => this.viewNow()}
                            title={getLocalizedString("liveChannel.viewNow")}
                        />
                    </Card>
                )}
            </ScrollView>
        );
    }
}

export default SeriesEpisodePicker;
