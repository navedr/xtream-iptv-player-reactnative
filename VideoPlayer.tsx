import * as React from "react";
import { NavigationInjectedProps } from "react-navigation";
import ExpoVideoPlayer from "./video-players/ExpoVideoPlayer";
import { Alert, Linking, Platform } from "react-native";
import { play } from "react-native-vlc-player";

enum VideoPlayerType {
    VLC,
    ExpoAV,
    Native,
}

const VideoPlayer: React.FC<NavigationInjectedProps> = React.memo(
    ({
        navigation: {
            state: { params },
            navigate,
            goBack,
        },
    }) => {
        const { uri } = params;
        const [playerType, setPlayerType] = React.useState<VideoPlayerType>(VideoPlayerType.VLC);

        switch (playerType) {
            case VideoPlayerType.ExpoAV:
                return <ExpoVideoPlayer uri={uri} />;
            case VideoPlayerType.VLC:
                const url = Platform.OS === "ios" ? "vlc-x-callback://x-callback-url/stream?url=" + uri : uri;
                Linking.openURL(url).catch(() => {
                    Alert.alert("Player Error", "Could not open VLC player to play the video", [{ text: "OK" }], {
                        cancelable: false,
                    });
                    goBack();
                });
                return <></>;
            case VideoPlayerType.Native:
                if (Platform.OS === "android") {
                    play(uri);
                } else if (Platform.OS === "ios") {
                    navigate("PlayeriOS", {
                        uri,
                    });
                } else {
                    throw new Error("Platform not recognized: " + Platform.OS);
                }
                return <></>;
        }
    },
);
export default VideoPlayer;
