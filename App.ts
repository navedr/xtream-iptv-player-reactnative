import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import LoginScreen from "./Login";
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

const NavigationStack = createStackNavigator({
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            headerLeft: () => null,
        },
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

export default Container;
