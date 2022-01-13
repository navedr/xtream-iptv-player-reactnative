import * as React from "react";
import { VLCPlayer, VlCPlayerView } from "react-native-vlc-media-player";
import { StyleSheet, View, ActivityIndicator } from "react-native";

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

const VLCVideoPlayer: React.FC<{ uri: string; onError: (error) => void }> = React.memo(({ uri, onError }) => {
    const video = React.useRef(null);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        console.log(uri);
        return () => {
            // video.current.stopAsync().catch(e => console.log("error stopping video", e));
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
            <VLCPlayer style={[styles.video]} videoAspectRatio="16:9" source={{ uri }} />
        </View>
    );
});

export default VLCVideoPlayer;
