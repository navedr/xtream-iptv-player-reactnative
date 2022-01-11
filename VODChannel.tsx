import * as React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";
import { Button, Card } from "react-native-elements";
import getVODInfo from "./api/getVODInfo";
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
    }

    renderInfo() {
        const { info } = this.state;
        const { item } = this.props.navigation.state.params;
        return (
            <Card
                image={item.stream_icon && { uri: item.stream_icon }}
                imageProps={{ resizeMode: "contain" }}
                title={item.name}>
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

        return <ScrollView>{this.renderInfo()}</ScrollView>;
    }
}

export default VODChannel;
