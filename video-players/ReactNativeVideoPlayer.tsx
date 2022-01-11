import * as React from "react";
import { View, StyleSheet, Button } from "react-native";
import Video from "react-native-video";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#ecf0f1",
    },
    video: {
        alignSelf: "center",
        width: 320,
        height: 200,
    },
    backgroundVideo: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
});

const ReactNativeVideoPlayer = React.memo<{ uri: string }>(({ uri }) => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState<{ isPlaying: boolean }>(null);
    return (
        <View style={styles.container}>
            <Video
                source={{ uri }} // Can be a URL or a local file.
                ref={video} // Store reference
                // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                // onError={this.videoError}               // Callback when video cannot be loaded
                style={styles.backgroundVideo}
            />
            <View style={styles.buttons}>
                <Button
                    title={status?.isPlaying ? "Pause" : "Play"}
                    onPress={() => (status?.isPlaying ? video.current.pauseAsync() : video.current.playAsync())}
                />
            </View>
        </View>
    );
});
export default ReactNativeVideoPlayer;
