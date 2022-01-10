import * as React from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, ScrollView, View } from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import AsyncStorage from "@react-native-community/async-storage";

import Toast, { DURATION } from "react-native-easy-toast";

import getCategories from "./api/getCategories";
import getVODs from "./api/getVODs";

import getLocalizedString from "./utils/getLocalizedString";

import SegmentedButton from "./utils/SegmentedButton";
import { NavigationInjectedProps } from "react-navigation";
import { isLetterOrNumber, sleep } from "./common/utils";
import { sortBy } from "lodash";
import getChannels from "./api/getChannels";
import Categories from "./Categories";
import { Type } from "./constants";

// const colors = {
//     black: "#fff",
//     gray: "#d3d3d3",
// };
//
// const styles = StyleSheet.create({
//     activityContainer: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     listContainer: {
//         flex: 1,
//     },
//     sectionHeader: {
//         paddingTop: 2,
//         paddingLeft: 10,
//         paddingRight: 10,
//         paddingBottom: 2,
//         fontSize: 26,
//         fontWeight: "bold",
//         backgroundColor: colors.black,
//     },
//     listItem: {
//         padding: 10,
//         fontSize: 20,
//         height: 44,
//     },
// });
//
// class OldVODScreen extends React.PureComponent<
//     NavigationInjectedProps,
//     {
//         categoriesAndVODs: any[];
//         categoriesLeft: number;
//         VODsFetched: number;
//         loadingVODsFromCategories: boolean;
//         menuItems: any[];
//         listItems: any[];
//         filteredList: any[];
//         weAreSearching: boolean;
//     }
// > {
//     public state = {
//         categoriesAndVODs: [],
//         categoriesLeft: 0,
//         VODsFetched: 0,
//         loadingVODsFromCategories: true,
//         menuItems: [],
//         listItems: [],
//         filteredList: [],
//         weAreSearching: false,
//     };
//     private search;
//     private toast;
//
//     async componentDidMount() {
//         let categoriesAndVODs;
//         this.setState({
//             loadingVODsFromCategories: true,
//         });
//         let menuItems = [];
//         const VODArray = await AsyncStorage.getItem("@IPTVPlayer:VODArray");
//         if (VODArray && VODArray.length > 0) {
//             categoriesAndVODs = JSON.parse(VODArray);
//         } else {
//             categoriesAndVODs = await this.getCategoriesFromServer();
//         }
//
//         categoriesAndVODs.forEach(c => {
//             menuItems.push({ text: c.category_name, data: [] });
//
//             c.VODs.forEach(vod => {
//                 menuItems[menuItems.length - 1].data.push(vod);
//             });
//         });
//
//         menuItems = sortBy(menuItems, "text");
//
//         this.setState(
//             {
//                 loadingVODsFromCategories: false,
//                 menuItems,
//                 categoriesAndVODs,
//             },
//             () => {
//                 if (menuItems.length) {
//                     this.selectCategory(null, 0);
//                 }
//             },
//         );
//     }
//
//     private async getCategoriesFromServer() {
//         let categoriesAndVODs = [];
//         const { url, username, password, buttonIndex } = this.props.navigation.state.params;
//
//         await getCategories(url, username, password, buttonIndex).then(r => {
//             categoriesAndVODs.push(...r);
//             categoriesAndVODs.forEach((o, i, a) => (a[i].VODs = []));
//         });
//         let VODsFetched = 0;
//         let categoriesLeft = categoriesAndVODs.length;
//
//         for (const category in categoriesAndVODs) {
//             await sleep(1500);
//             categoriesAndVODs[category].VODs = await getVODs(
//                 url,
//                 username,
//                 password,
//                 categoriesAndVODs[category].category_id,
//             );
//             categoriesLeft--;
//             VODsFetched += categoriesAndVODs[category].VODs.length;
//             this.setState({
//                 categoriesLeft,
//                 VODsFetched,
//             });
//         }
//
//         for (const category in categoriesAndVODs) {
//             if (!categoriesAndVODs[category].VODs.length) {
//                 categoriesAndVODs[category] = null;
//             }
//         }
//         categoriesAndVODs = categoriesAndVODs.filter(x => x);
//         try {
//             await AsyncStorage.setItem("@IPTVPlayer:VODArray", JSON.stringify(categoriesAndVODs));
//         } catch (error) {
//             throw new Error(error);
//         }
//         return categoriesAndVODs;
//     }
//
//     selectCategory(btn, index) {
//         const { menuItems } = this.state;
//         const { url, username, password } = this.props.navigation.state.params;
//
//         this.setState({
//             weAreSearching: false,
//             filteredList: [],
//         });
//
//         let listItems = [];
//
//         if (this.search && this.search.clearText) {
//             this.search.clearText();
//         }
//
//         menuItems[index].data.forEach(vod => {
//             if (!vod.name.length) {
//                 return;
//             }
//
//             let vodItem;
//             if (vod.name.charAt(0) !== "(" && !isLetterOrNumber(vod.name.charAt(0))) {
//                 vodItem = (
//                     <Button
//                         key={vod.stream_id}
//                         disabled
//                         onPress={() => {}}
//                         // style={styles.listItem}
//                         title={vod.name}
//                     />
//                 );
//             } else {
//                 vodItem = (
//                     <ListItem
//                         key={vod.stream_id}
//                         // avatar={
//                         //     vod.stream_icon.startsWith("http") ||
//                         //     (vod.stream_icon.startsWith("https") && { uri: vod.stream_icon })
//                         // }
//                         containerStyle={{ borderBottomWidth: 0 }}
//                         onPress={() =>
//                             this.props.navigation.navigate("VODChannel", {
//                                 url,
//                                 username,
//                                 password,
//                                 vod,
//                             })
//                         }
//                         hasTVPreferredFocus
//                         tvParallaxProperties>
//                         <Text>{vod.name}</Text>
//                     </ListItem>
//                 );
//             }
//
//             listItems.push(vodItem);
//         });
//
//         this.setState({
//             listItems,
//         });
//     }
//
//     searchForVODs(getText) {
//         const { listItems } = this.state;
//         const text = getText.toLowerCase();
//         if (!text) {
//             this.setState({
//                 weAreSearching: false,
//             });
//             return;
//         }
//
//         let filteredList = listItems.filter(item => {
//             return item.props.title.toLowerCase().match(text);
//         });
//
//         filteredList = sortBy(filteredList, "title");
//
//         this.setState({
//             filteredList,
//             weAreSearching: true,
//         });
//     }
//
//     render() {
//         const {
//             loadingVODsFromCategories,
//             categoriesAndVODs,
//             menuItems,
//             weAreSearching,
//             listItems,
//             filteredList,
//             categoriesLeft,
//             VODsFetched,
//         } = this.state;
//
//         if (loadingVODsFromCategories) {
//             return (
//                 <ScrollView contentContainerStyle={styles.activityContainer}>
//                     <ActivityIndicator animating hidesWhenStopped size="large" />
//                     <Text>{getLocalizedString("vod.activityIndicatorText", null, [categoriesLeft, VODsFetched])}</Text>
//                 </ScrollView>
//             );
//         }
//
//         if (!categoriesAndVODs.length) {
//             Alert.alert(
//                 getLocalizedString("vod.noCategoriesError"),
//                 getLocalizedString("vod.noCategoriesErrorDesc"),
//                 [
//                     {
//                         text: "OK",
//                         onPress: () => this.props.navigation.navigate("Account", this.props.navigation.state.params),
//                     },
//                 ],
//                 { cancelable: false },
//             );
//         }
//
//         return (
//             <ScrollView contentContainerStyle={styles.listContainer}>
//                 <SegmentedButton
//                     items={menuItems}
//                     onSegmentBtnPress={(btn, index) => this.selectCategory(btn, index)}
//                 />
//                 <View>
//                     <SearchBar
//                         ref={search => {
//                             this.search = search;
//                         }}
//                         onChangeText={text => this.searchForVODs(text)}
//                         placeholder={getLocalizedString("live.searchPlaceholder")}
//                         round
//                     />
//                 </View>
//                 <ScrollView>{weAreSearching ? filteredList : listItems}</ScrollView>
//                 <Toast
//                     ref={c => {
//                         this.toast = c;
//                     }}
//                 />
//             </ScrollView>
//         );
//     }
// }

const VODScreen: React.FC<NavigationInjectedProps> = React.memo(props => {
    const getItems = (url, username, password, categories, index) =>
        getVODs(url, username, password, categories[index].category_id);
    return <Categories type={Type.Movies} getItems={getItems} {...props} itemRoute={"VODChannel"} />;
});

export default VODScreen;
