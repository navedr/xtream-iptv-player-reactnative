import * as React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Button, Card } from "react-native-elements";
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
        loadingInfo: true,
        info: {
            info: null,
        },
    };

    viewNow() {
        const { url, username, password, episode } = this.props.navigation.state.params;
        const uri = url + "/series/" + username + "/" + password + "/" + episode.id + "." + episode.container_extension;
        this.props.navigation.navigate("VideoPlayer", {
            uri,
        });
    }

    render() {
        const { episode } = this.props.navigation.state.params;

        return (
            <ScrollView>
                {episode.info.movie_image ? (
                    <Card
                        image={{ uri: episode.info.movie_image }}
                        imageProps={{ resizeMode: "contain" }}
                        title={episode.title}>
                        {episode.info.name?.length ? <Text>Name:{episode.info.name}</Text> : null}
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
