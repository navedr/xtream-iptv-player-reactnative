import * as React from "react";
import { AVPlaybackStatus, Video } from "expo-av";
import { Button, StyleSheet, View } from "react-native";

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
    buttons: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
});

const ExpoVideoPlayer: React.FC<{ uri: string }> = React.memo(({ uri }) => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState<AVPlaybackStatus & { isPlaying: boolean }>(null);
    React.useEffect(() => {
        return () => {
            video.current.stopAsync();
        };
    }, []);
    return (
        <View style={styles.container}>
            <Video
                ref={video}
                style={styles.video}
                source={{
                    uri,
                }}
                shouldPlay
                useNativeControls
                resizeMode="contain"
                isLooping
                // onPlaybackStatusUpdate={status => setStatus(() => status)}
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

export default ExpoVideoPlayer;
