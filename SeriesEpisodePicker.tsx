import * as React from "react";
import { StyleSheet, ScrollView, Text } from "react-native";
import { Image } from "react-native-elements";
import { List } from "react-native-paper";
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

        const [seasons, setSeasons] = React.useState({});

        React.useEffect(() => {
            getSeries(url, username, password, series.series_id)
                .catch(e => console.log("getSeries failed"))
                .then(response => {
                    setSeasons(response.episodes);
                    // console.log(response)
                    // response.episodes.forEach(episode => {
                    //       if (!episode.title.length) {
                    //           return;
                    //       }
                    //
                    //       listItems.push(
                    //           <ListItem
                    //               key={series.num}
                    //               // avatar={
                    //               //     episode.info.movie_image.startsWith("http") ||
                    //               //     (episode.info.movie_image.startsWith("https") && { uri: s.info.movie_image })
                    //               // }
                    //               containerStyle={{ borderBottomWidth: 0 }}
                    //               onPress={() =>
                    //                   navigate("SeriesEpisodeViewer", {
                    //                       url,
                    //                       username,
                    //                       password,
                    //                       episode,
                    //                   })
                    //               }
                    //               hasTVPreferredFocus
                    //               tvParallaxProperties>
                    //               <Text>{episode.name}</Text>
                    //           </ListItem>,
                    //       );
                    //   });
                });
        }, [series]);

        return (
            <ScrollView contentContainerStyle={styles.listContainer}>
                <List.Section title="Seasons">
                    {!!seasons &&
                        Object.keys(seasons).map(season => (
                            <List.Accordion
                                title={`Season ${season}`}
                                left={props => <List.Icon {...props} icon="folder" />}>
                                {seasons[season].map(
                                    episode =>
                                        episode.title && (
                                            <List.Item
                                                title={episode.title}
                                                left={props =>
                                                    episode.info.movie_image.startsWith("http") ? (
                                                        <Image />
                                                    ) : (
                                                        <List.Icon {...props} icon="folder" />
                                                    )
                                                }
                                                onPress={() =>
                                                    navigate("SeriesEpisodeViewer", {
                                                        url,
                                                        username,
                                                        password,
                                                        episode,
                                                    })
                                                }
                                            />
                                        ),
                                )}
                            </List.Accordion>
                        ))}
                </List.Section>
            </ScrollView>
        );
    },
);

export default SeriesEpisodePickerScreen;
