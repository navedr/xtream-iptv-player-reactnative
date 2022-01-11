import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import { Colors, DefaultTheme, IconButton, Provider as PaperProvider } from "react-native-paper";
import AddPlaylist from "./AddPlaylist";
import AccountScreen from "./Account";
import LiveScreen from "./Live";
import LiveChannelScreen from "./LiveChannel";
import LiveChannelFullEPGScreen from "./LiveChannelFullEPG";
import PlayeriOS from "./PlayeriOS";
import VODScreen from "./VODs";
import VODChannelScreen from "./VODChannel";
import SeriesScreen from "./Series";
import SeriesEpisodePickerScreen from "./SeriesEpisodePicker";
import SeriesEpisodeViewerScreen from "./SeriesEpisodeViewer";
import VideoPlayer from "./VideoPlayer";
import * as React from "react";
import { AccountContextProvider, useAccountContext } from "./providers/AccountProvider";
import Home from "./Home";

const NavigationStack = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: ({ navigation: { navigate } }) => ({
            headerRight: () => {
                const { current, setAsCurrent } = useAccountContext();
                return !current ? (
                    <IconButton color={Colors.red500} size={30} icon={"plus"} onPress={() => navigate("AddPlaylist")} />
                ) : (
                    <IconButton color={Colors.red500} size={30} icon={"logout"} onPress={() => setAsCurrent(null)} />
                );
            },
        }),
    },
    AddPlaylist: {
        screen: AddPlaylist,
    },
    Account: {
        screen: AccountScreen,
        navigationOptions: {
            headerLeft: () => null,
        },
    },
    Live: {
        screen: LiveScreen,
    },
    LiveChannel: {
        screen: LiveChannelScreen,
    },
    LiveChannelFullEPG: {
        screen: LiveChannelFullEPGScreen,
    },
    PlayeriOS: {
        screen: PlayeriOS,
    },
    VideoPlayer: {
        screen: VideoPlayer,
    },
    VODs: {
        screen: VODScreen,
    },
    VODChannel: {
        screen: VODChannelScreen,
    },
    Series: {
        screen: SeriesScreen,
    },
    SeriesEpisodePicker: {
        screen: SeriesEpisodePickerScreen,
    },
    SeriesEpisodeViewer: {
        screen: SeriesEpisodeViewerScreen,
    },
});

const Container = createAppContainer(NavigationStack);

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "tomato",
        accent: "yellow",
    },
};

const App = React.memo(() => {
    return (
        <PaperProvider theme={theme}>
            <AccountContextProvider>
                <Container />
            </AccountContextProvider>
        </PaperProvider>
    );
});

export default App;
