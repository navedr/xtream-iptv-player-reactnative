import * as React from "react";
import { ActivityIndicator, Button, StyleSheet, Text, ScrollView, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { ListItem, SearchBar } from "react-native-elements";
import Toast from "react-native-easy-toast";
import getCategories from "./api/getCategories";
import SegmentedButton from "./utils/SegmentedButton";
import { sortBy } from "lodash";
import { NavigationInjectedProps } from "react-navigation";
import { isLetterOrNumber, sleep } from "./common/utils";
import { Type } from "./constants";
import getItems from "./api/getItems";

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

export interface ICategoriesProps {
    type: Type;
    itemRoute: string;
}

class Categories extends React.PureComponent<
    NavigationInjectedProps & ICategoriesProps,
    {
        categories: any[];
        loading: boolean;
        menuItems: { text: string; items: any[] }[];
        listItems: any[];
        selectedCategoryItems: any[];
        filteredList: any[];
        weAreSearching: boolean;
    }
> {
    public state = {
        categories: [],
        loading: true,
        menuItems: [],
        listItems: [],
        selectedCategoryItems: [],
        filteredList: [],
        weAreSearching: false,
    };
    private search;
    private toast;

    private get storageName() {
        const { type } = this.props;
        return `@IPTVPlayer:${Type[type]}Categories`;
    }

    async componentDidMount() {
        let categories;
        let menuItems = [];

        const liveArray = await AsyncStorage.getItem(this.storageName);
        if (liveArray && liveArray.length > 0) {
            categories = JSON.parse(liveArray);
        } else {
            categories = await this.getCategoriesFromServer();
        }

        categories.forEach(c => {
            menuItems.push({ text: c.category_name });
        });

        this.setState(
            {
                menuItems,
                categories,
            },
            () => {
                if (menuItems.length) {
                    this.selectCategory(null, 0);
                }
            },
        );
    }

    private async getCategoriesFromServer() {
        let categories = [];
        const { type } = this.props;
        const { url, username, password } = this.props.navigation.state.params;

        await getCategories(url, username, password, type).then(r => {
            categories.push(...r);
        });

        categories = categories.filter(x => x);
        categories = sortBy(categories, "category_name");

        await this.storeCategories(categories);
        return categories;
    }

    private async storeCategories(categories) {
        try {
            await AsyncStorage.setItem(this.storageName, JSON.stringify(categories));
        } catch (error) {
            throw new Error(error);
        }
        this.setState({
            categories,
        });
    }

    private async getItemsFromServer(index: number) {
        const { type } = this.props;
        const { categories } = this.state;
        const { url, username, password } = this.props.navigation.state.params;
        const items = await getItems(url, username, password, categories[index].category_id, type);
        categories[index].items = items;
        await this.storeCategories(categories);
        return items;
    }

    async selectCategory(btn, index) {
        const { categories } = this.state;
        const { itemRoute } = this.props;
        this.setState({
            loading: true,
        });
        let selectedCategoryItems = categories[index].items;

        if (!selectedCategoryItems) {
            selectedCategoryItems = await this.getItemsFromServer(index);
        }

        const { url, username, password } = this.props.navigation.state.params;

        this.setState({
            weAreSearching: false,
            filteredList: [],
            selectedCategoryItems,
        });

        let listItems = [];

        if (this.search && this.search.clearText) {
            this.search.clearText();
        }

        selectedCategoryItems.forEach(item => {
            if (!item.name.length) {
                return;
            }
            const isTitle = item.name.charAt(0) !== "(" && !isLetterOrNumber(item.name.charAt(0));

            let listItem = isTitle ? (
                <Button
                    key={item.stream_id}
                    disabled
                    onPress={() => {}}
                    // style={styles.listItem}
                    title={item.name}
                />
            ) : (
                <ListItem
                    key={item.stream_id}
                    // avatar={
                    //     ch.stream_icon.startsWith("http") ||
                    //     (ch.stream_icon.startsWith("https") && { uri: ch.stream_icon })
                    // }
                    containerStyle={{ borderBottomWidth: 0 }}
                    onPress={() =>
                        this.props.navigation.navigate(itemRoute, {
                            url,
                            username,
                            password,
                            item,
                        })
                    }
                    hasTVPreferredFocus
                    tvParallaxProperties>
                    <Text>{item.name}</Text>
                </ListItem>
            );

            listItems.push(listItem);
        });

        this.setState({
            listItems,
            loading: false,
        });
    }

    filter(searchText) {
        const { selectedCategoryItems } = this.state;
        const text = searchText.toLowerCase();

        if (!text) {
            this.setState({
                weAreSearching: false,
            });
            return;
        }

        let filteredList = selectedCategoryItems.filter(item => {
            return item.name.toLowerCase().match(text);
        });

        filteredList = sortBy(filteredList, "title");

        this.setState({
            filteredList,
            weAreSearching: true,
        });
    }

    render() {
        const { menuItems, weAreSearching, listItems, filteredList, loading } = this.state;

        return (
            <ScrollView contentContainerStyle={styles.listContainer}>
                <SegmentedButton
                    items={menuItems}
                    onSegmentBtnPress={(btn, index) => this.selectCategory(btn, index)}
                />
                <View>
                    {/* TODO: fix this */}
                    <SearchBar
                        ref={search => {
                            this.search = search;
                        }}
                        disabled
                        onChangeText={text => this.filter(text)}
                        placeholder={"Filter..."}
                        round
                    />
                </View>
                {loading ? (
                    <ScrollView contentContainerStyle={styles.activityContainer}>
                        <ActivityIndicator animating hidesWhenStopped size="large" />
                    </ScrollView>
                ) : (
                    <ScrollView>{weAreSearching ? filteredList : listItems}</ScrollView>
                )}
                <Toast
                    ref={c => {
                        this.toast = c;
                    }}
                />
            </ScrollView>
        );
    }
}

export default Categories;
