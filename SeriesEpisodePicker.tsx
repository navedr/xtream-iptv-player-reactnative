import * as React from "react";
import { StyleSheet, ScrollView, Text } from "react-native";
import { ListItem } from "react-native-elements";
import { NavigationInjectedProps } from "react-navigation";
import { getSeries } from "./api/getSeries";

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
    },
});

const SeriesEpisodePickerScreen: React.FC<NavigationInjectedProps> = React.memo(
    ({
        navigation: {
            state: { params },
            navigate,
        },
    }) => {
        const { url, username, password, item: series } = params;

        const listItems = [];
        getSeries(url, username, password, series.category_id).then(episodes => {
          console.log(episodes)
            episodes.forEach(episode => {
                if (!episode.title.length) {
                    return;
                }

                listItems.push(
                    <ListItem
                        key={series.num}
                        // avatar={
                        //     episode.info.movie_image.startsWith("http") ||
                        //     (episode.info.movie_image.startsWith("https") && { uri: s.info.movie_image })
                        // }
                        containerStyle={{ borderBottomWidth: 0 }}
                        onPress={() =>
                            navigate("SeriesEpisodeViewer", {
                                url,
                                username,
                                password,
                                episode,
                            })
                        }
                        hasTVPreferredFocus
                        tvParallaxProperties>
                        <Text>{episode.name}</Text>
                    </ListItem>,
                );
            });
        });

        return (
            <ScrollView contentContainerStyle={styles.listContainer}>
                <ScrollView>{listItems}</ScrollView>
            </ScrollView>
        );
    },
);

export default SeriesEpisodePickerScreen;
