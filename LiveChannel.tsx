import * as React from "react";
import { ActivityIndicator, Linking, Platform, StyleSheet, Text, ScrollView } from "react-native";
import { Button, Card, Divider } from "react-native-elements";
import getEPG from "./api/getEPG";
import timeConverter from "./utils/timeConverter";
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
        loadingChannelEPG: boolean;
        epg: {
            epg_listings: any[];
        };
    }
> {
    public state = {
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
        const { loadingChannelEPG } = this.state;

        if (loadingChannelEPG) {
            return (
                <ScrollView contentContainerStyle={styles.activityContainer}>
                    <ActivityIndicator animating hidesWhenStopped size="large" />
                    <Text>{getLocalizedString("liveChannel.activityIndicatorText")}</Text>
                </ScrollView>
            );
        }

        return <ScrollView>{this._renderCard()}</ScrollView>;
    }
}

export default LiveChannel;
