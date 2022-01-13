import * as React from "react";
import { AVPlaybackStatus, Video } from "expo-av";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
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

const ExpoVideoPlayer: React.FC<{ uri: string; onError: (error) => void }> = React.memo(({ uri, onError }) => {
    const video = React.useRef(null);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        console.log(uri);
        return () => {
            video.current.stopAsync().catch(e => console.log("error stopping video", e));
        };
    }, []);

    const onReadyForDisplay = event => {
        setLoading(false);
        video.current.playAsync().catch(e => console.log("error playing video", e));
    };
    return (
        <View style={styles.container}>
            {loading && (
                <>
                    <ActivityIndicator animating hidesWhenStopped size="large" />
                </>
            )}
            <Video
                ref={video}
                style={styles.video}
                source={{
                    uri,
                }}
                useNativeControls
                resizeMode="contain"
                // onLoad={status => console.log("onLoad", status)}
                onLoadStart={() => setLoading(true)}
                onReadyForDisplay={onReadyForDisplay}
                onError={error => {
                    console.log("onError", error);
                    onError(error);
                }}
                // onPlaybackStatusUpdate={status => console.log("onPlaybackStatusUpdate", status)}
            />
        </View>
    );
});

export default ExpoVideoPlayer;
