import * as React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";
import { ListItem } from "react-native-elements";
import getFullEPG from "./api/getFullEPG";

import timeConverter from "./utils/timeConverter";

import getLocalizedString from "./utils/getLocalizedString";
import { NavigationInjectedProps } from "react-navigation";
import { utf8Decode } from "./common/utils";

const base64 = require("base-64");

const styles = StyleSheet.create({
    activityContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});

class LiveChannelFullEPG extends React.PureComponent<
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
        const { url, username, password, ch } = this.props.navigation.state.params;
        const epg = await getFullEPG(url, username, password, ch.stream_id);
        this.setState({
            loadingChannelEPG: false,
            epg,
        });
    }

    render() {
        const { epg, loadingChannelEPG } = this.state;
        if (loadingChannelEPG) {
            return (
                <ScrollView contentContainerStyle={styles.activityContainer}>
                    {<ActivityIndicator animating hidesWhenStopped size="large" />}
                    {<Text>{getLocalizedString("liveChannel.activityIndicatorText")}</Text>}
                </ScrollView>
            );
        }

        const fullEPG = [];

        epg.epg_listings.forEach(e => {
            let title = utf8Decode(base64.decode(e.title));
            title += "\r\n";
            title += utf8Decode(base64.decode(e.description));

            let subtitle = timeConverter(e.start_timestamp);
            subtitle += "\r\n";
            subtitle += timeConverter(e.stop_timestamp);

            if (e.start_timestamp < Math.floor(Date.now() / 1000)) {
                return;
            }

            fullEPG.push(
                <ListItem key={e.id} hasTVPreferredFocus tvParallaxProperties>
                    <Text>{title}</Text>
                    <Text>{subtitle}</Text>
                </ListItem>,
            );
        });

        return <ScrollView>{fullEPG}</ScrollView>;
    }
}

export default LiveChannelFullEPG;
