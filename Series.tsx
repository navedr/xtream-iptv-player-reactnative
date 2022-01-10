import * as React from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { ListItem, SearchBar } from "react-native-elements";

import Toast, { DURATION } from "react-native-easy-toast";

import getCategories from "./api/getCategories";
import { getSeries, getSeriesCategories } from "./api/getSeries";

import getLocalizedString from "./utils/getLocalizedString";

import SegmentedButton from "./utils/SegmentedButton";
import { NavigationInjectedProps } from "react-navigation";
import { sortBy } from "lodash";
import { isLetterOrNumber, sleep } from "./common/utils";
import getVODs from "./api/getVODs";
import Categories from "./Categories";
import { Type } from "./constants";

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

class OldSeriesScreen extends React.PureComponent<
    NavigationInjectedProps,
    {
        categoriesAndSeries: any[];
        categoriesLeft: number;
        seriesFetched: number;
        episodesFetched: number;
        loadingSeriesFromCategories: boolean;
        menuItems: any[];
        listItems: any[];
        filteredList: any[];
        weAreSearching: boolean;
    }
> {
    public state = {
        categoriesAndSeries: [],
        categoriesLeft: 0,
        seriesFetched: 0,
        episodesFetched: 0,
        loadingSeriesFromCategories: true,
        menuItems: [],
        listItems: [],
        filteredList: [],
        weAreSearching: false,
    };
    private search;
    private toast;

    async componentDidMount() {
        let categoriesAndSeries;
        this.setState({
            loadingSeriesFromCategories: true,
        });
        let menuItems = [];

        const seriesArray = await AsyncStorage.getItem("@IPTVPlayer:seriesArray");
        if (seriesArray && seriesArray.length > 0) {
            categoriesAndSeries = JSON.parse(seriesArray);
        } else {
            categoriesAndSeries = await this.getCategoriesFromServer();
        }

        categoriesAndSeries.forEach(c => {
            menuItems.push({ text: c.category_name, data: [] });
            c.Series.forEach(serie => {
                menuItems[menuItems.length - 1].data.push(serie);
            });
        });

        menuItems = sortBy(menuItems, "text");

        this.setState(
            {
                loadingSeriesFromCategories: false,
                menuItems,
                categoriesAndSeries,
            },
            () => {
                if (menuItems.length) {
                    this.selectCategory(null, 0);
                }
            },
        );
    }

    private async getCategoriesFromServer() {
        let categoriesAndSeries = [];
        const { url, username, password, buttonIndex } = this.props.navigation.state.params;

        await getCategories(url, username, password, buttonIndex).then(r => {
            categoriesAndSeries.push(...r);

            /* eslint-disable no-return-assign */
            categoriesAndSeries.forEach((o, i, a) => (a[i].Series = []));
            /* eslint-enable no-return-assign */
        });

        let seriesFetched = 0;
        let episodesFetched = 0;
        let categoriesLeft = categoriesAndSeries.length;
        this.setState({
            categoriesLeft,
        });
        for (const category in categoriesAndSeries) {
            await sleep(1500);
            categoriesAndSeries[category].Series = await getSeriesCategories(
                url,
                username,
                password,
                categoriesAndSeries[category].category_id,
            );
            categoriesLeft--;
            if (categoriesAndSeries[category].Series.length > 0) {
                categoriesAndSeries[category].Series.forEach(s => {
                    s.episodes = [];
                });
            }
            seriesFetched += categoriesAndSeries[category].Series.length;
            this.setState({
                categoriesLeft,
                seriesFetched,
            });
        }

        for (const category in categoriesAndSeries) {
            if (!categoriesAndSeries[category].Series.length) {
                categoriesAndSeries[category] = null;
            } else {
                for (const series in categoriesAndSeries[category].Series) {
                    categoriesAndSeries[category].Series[series].episodesRaw = await getSeries(
                        url,
                        username,
                        password,
                        categoriesAndSeries[category].Series[series].series_id,
                    );
                    categoriesAndSeries[category].Series[series].episodesRaw =
                        categoriesAndSeries[category].Series[series].episodesRaw.episodes;
                    categoriesAndSeries[category].Series[series].episodes = [];

                    for (const key in categoriesAndSeries[category].Series[series].episodesRaw) {
                        const value = categoriesAndSeries[category].Series[series].episodesRaw[key];
                        value.map(v => categoriesAndSeries[category].Series[series].episodes.push(v));
                    }

                    episodesFetched += categoriesAndSeries[category].Series[series].episodes.length;

                    this.setState({
                        episodesFetched,
                    });
                }
            }
        }

        categoriesAndSeries = categoriesAndSeries.filter(x => x);

        try {
            await AsyncStorage.setItem("@IPTVPlayer:seriesArray", JSON.stringify(categoriesAndSeries));
        } catch (error) {
            throw new Error(error);
        }
        return categoriesAndSeries;
    }

    selectCategory(btn, index) {
        const { menuItems } = this.state;
        const { url, username, password } = this.props.navigation.state.params;

        this.setState({
            weAreSearching: false,
            filteredList: [],
        });
        let listItems = [];

        if (this.search && this.search.clearText) {
            this.search.clearText();
        }

        menuItems[index].data.forEach(series => {
            let item = null;

            if (!series.name.length) {
                return;
            }

            if (series.name.charAt(0) !== "(" && !isLetterOrNumber(series.name.charAt(0))) {
                item = (
                    <Button
                        key={series.num}
                        disabled
                        onPress={() => {}}
                        // style={styles.listItem}
                        title={series.name}
                    />
                );
            } else {
                item = (
                    <ListItem
                        key={series.num}
                        // avatar={
                        //     series.cover.startsWith("http") ||
                        //     (series.cover.startsWith("https") && { uri: series.cover })
                        // }
                        containerStyle={{ borderBottomWidth: 0 }}
                        onPress={() =>
                            this.props.navigation.navigate("SeriesEpisodePicker", {
                                url,
                                username,
                                password,
                                series,
                            })
                        }
                        hasTVPreferredFocus
                        tvParallaxProperties>
                        <Text>{series.name}</Text>
                    </ListItem>
                );
            }

            listItems.push(item);
        });

        this.setState({
            listItems,
        });
    }

    searchForSeries(searchText) {
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
            loadingSeriesFromCategories,
            categoriesAndSeries,
            menuItems,
            weAreSearching,
            listItems,
            filteredList,
            categoriesLeft,
            seriesFetched,
            episodesFetched,
        } = this.state;

        if (loadingSeriesFromCategories) {
            return (
                <ScrollView contentContainerStyle={styles.activityContainer}>
                    {<ActivityIndicator animating hidesWhenStopped size="large" />}
                    {
                        <Text>
                            {getLocalizedString("series.activityIndicatorText", null, [
                                categoriesLeft,
                                seriesFetched,
                                episodesFetched,
                            ])}
                        </Text>
                    }
                </ScrollView>
            );
        }

        if (!categoriesAndSeries.length) {
            Alert.alert(
                getLocalizedString("series.noCategoriesError"),
                getLocalizedString("series.noCategoriesErrorDesc"),
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
                        onChangeText={text => this.searchForSeries(text)}
                        placeholder={getLocalizedString("series.searchPlaceholder")}
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

const SeriesScreen: React.FC<NavigationInjectedProps> = React.memo(props => {
    const getItems = (url, username, password, categories, index) =>
        getSeriesCategories(url, username, password, categories[index].category_id);
    return <Categories type={Type.Series} getItems={getItems} {...props} itemRoute={"SeriesEpisodePicker"} />;
});

export default SeriesScreen;
