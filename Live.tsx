import * as React from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, ScrollView, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { ListItem, SearchBar } from "react-native-elements";
import Toast, { DURATION } from "react-native-easy-toast";
import getCategories from "./api/getCategories";
import getChannels from "./api/getChannels";
import getLocalizedString from "./utils/getLocalizedString";
import SegmentedButton from "./utils/SegmentedButton";
import { sortBy } from "lodash";
import { NavigationInjectedProps } from "react-navigation";

const ActivityIndicatorText = React.memo<{ categoriesLeft: number; channelsFetched: number }>(
    ({ categoriesLeft, channelsFetched }) => (
        <Text>{getLocalizedString("live.activityIndicatorText", null, [categoriesLeft, channelsFetched])}</Text>
    ),
);

const colors = {
    black: "#fff",
    gray: "#d3d3d3",
};

const styles = StyleSheet.create({
    activityContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    listContainer: {
        flex: 1,
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 26,
        fontWeight: "bold",
        backgroundColor: colors.black,
    },
    listItem: {
        padding: 10,
        fontSize: 20,
        height: 44,
    },
});

function isLetterOrNumber(c) {
    if (/^\d/.test(c)) {
        return true;
    }

    return c.toLowerCase() !== c.toUpperCase();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class LiveScreen extends React.PureComponent<
    NavigationInjectedProps,
    {
        categoriesAndChannels: any[];
        categoriesLeft: number;
        channelsFetched: number;
        loadingChannelsFromCategories: boolean;
        menuItems: any[];
        listItems: any[];
        filteredList: any[];
        weAreSearching: boolean;
    }
> {
    public state = {
        categoriesAndChannels: [],
        categoriesLeft: 0,
        channelsFetched: 0,
        loadingChannelsFromCategories: true,
        menuItems: [],
        listItems: [],
        filteredList: [],
        weAreSearching: false,
    };
    private search;
    private toast;

    async componentDidMount() {
        let categoriesAndChannels;
        this.setState({
            loadingChannelsFromCategories: true,
        });
        let menuItems = [];

        const liveArray = await AsyncStorage.getItem("@IPTVPlayer:LiveArray");
        if (liveArray && liveArray.length > 0) {
            categoriesAndChannels = JSON.parse(liveArray);
        } else {
            categoriesAndChannels = await this.getCategoriesFromServer();
        }

        categoriesAndChannels.forEach(c => {
            menuItems.push({ text: c.category_name, data: [] });
            c.channels.forEach(ch => {
                menuItems[menuItems.length - 1].data.push(ch);
            });
        });

        menuItems = sortBy(menuItems, "text");
        this.setState(
            {
                loadingChannelsFromCategories: false,
                menuItems,
                categoriesAndChannels,
            },
            () => {
                if (menuItems.length) {
                    this.selectCategory(null, 0);
                }
            },
        );
    }

    private async getCategoriesFromServer() {
        let categoriesAndChannels = [];
        const { url, username, password, buttonIndex } = this.props.navigation.state.params;

        await getCategories(url, username, password, buttonIndex).then(r => {
            categoriesAndChannels.push(...r);
            categoriesAndChannels.forEach((o, i, a) => (a[i].channels = []));
        });
        let channelsFetched = 0;
        let categoriesLeft = categoriesAndChannels.length;
        this.setState({
            categoriesLeft,
            channelsFetched,
        });
        for (const category in categoriesAndChannels) {
            await sleep(1500);
            categoriesAndChannels[category].channels = await getChannels(
                url,
                username,
                password,
                categoriesAndChannels[category].category_id,
            );
            categoriesLeft--;
            channelsFetched += categoriesAndChannels[category].channels.length;
            this.setState({
                categoriesLeft,
                channelsFetched,
            });
            if (categoriesAndChannels.length - categoriesLeft == 10) {
                break;
            }
        }

        for (const category in categoriesAndChannels) {
            if (!categoriesAndChannels[category].channels.length) {
                categoriesAndChannels[category] = null;
            }
        }

        categoriesAndChannels = categoriesAndChannels.filter(x => x);

        try {
            await AsyncStorage.setItem("@IPTVPlayer:LiveArray", JSON.stringify(categoriesAndChannels));
        } catch (error) {
            throw new Error(error);
        }
        return categoriesAndChannels;
    }

    selectCategory(btn, index) {
        const { menuItems } = this.state;
        const { url, username, password } = this.props.navigation.state.params;

        this.setState({
            weAreSearching: true,
        });

        let listItems = [];

        if (this.search && this.search.clearText) {
            this.search.clearText();
        }

        menuItems[index].data.forEach(ch => {
            if (!ch.name.length) {
                return;
            }
            let chItem;

            if (ch.name.charAt(0) !== "(" && !isLetterOrNumber(ch.name.charAt(0))) {
                chItem = (
                    <Button
                        key={ch.stream_id}
                        disabled
                        onPress={() => {}}
                        // style={styles.listItem}
                        title={ch.name}
                    />
                );
            } else {
                chItem = (
                    <ListItem
                        key={ch.stream_id}
                        // avatar={
                        //     ch.stream_icon.startsWith("http") ||
                        //     (ch.stream_icon.startsWith("https") && { uri: ch.stream_icon })
                        // }
                        containerStyle={{ borderBottomWidth: 0 }}
                        onPress={() =>
                            this.props.navigation.navigate("LiveChannel", {
                                url,
                                username,
                                password,
                                ch,
                            })
                        }
                        hasTVPreferredFocus
                        tvParallaxProperties>
                        <Text>{ch.name}</Text>
                    </ListItem>
                );
            }

            listItems.push(chItem);
        });

        this.setState({
            listItems,
            weAreSearching: false,
        });
    }

    searchForChannels(searchText) {
        const { listItems } = this.state;
        const text = searchText.toLowerCase();

        if (!text) {
            this.setState({
                weAreSearching: false,
            });
            return;
        }

        let filteredList = listItems.filter(item => {
            return item.props.title.toLowerCase().match(text);
        });

        filteredList = sortBy(filteredList, "title");

        this.setState({
            filteredList,
            weAreSearching: true,
        });
    }

    render() {
        const {
            loadingChannelsFromCategories,
            categoriesAndChannels,
            menuItems,
            weAreSearching,
            listItems,
            filteredList,
            categoriesLeft,
            channelsFetched,
        } = this.state;

        if (loadingChannelsFromCategories) {
            return (
                <ScrollView contentContainerStyle={styles.activityContainer}>
                    <ActivityIndicator animating hidesWhenStopped size="large" />
                    <ActivityIndicatorText categoriesLeft={categoriesLeft} channelsFetched={channelsFetched} />
                </ScrollView>
            );
        }

        if (!categoriesAndChannels.length) {
            Alert.alert(
                getLocalizedString("live.noCategoriesError"),
                getLocalizedString("live.noCategoriesErrorDesc"),
                [
                    {
                        text: "OK",
                        onPress: () => this.props.navigation.navigate("Account", this.props.navigation.state.params),
                    },
                ],
                { cancelable: false },
            );
        }

        return (
            <ScrollView contentContainerStyle={styles.listContainer}>
                <SegmentedButton
                    items={menuItems}
                    onSegmentBtnPress={(btn, index) => this.selectCategory(btn, index)}
                />
                <View>
                    <SearchBar
                        ref={search => {
                            this.search = search;
                        }}
                        onChangeText={text => this.searchForChannels(text)}
                        placeholder={getLocalizedString("live.searchPlaceholder")}
                        round
                    />
                </View>
                <ScrollView>{weAreSearching ? filteredList : listItems}</ScrollView>
                <Toast
                    ref={c => {
                        this.toast = c;
                    }}
                />
            </ScrollView>
        );
    }
}

export default LiveScreen;
