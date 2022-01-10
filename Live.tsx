import * as React from "react";
import Categories from "./Categories";
import { Type } from "./constants";
import { NavigationInjectedProps } from "react-navigation";
import getChannels from "./api/getChannels";

const LiveScreen: React.FC<NavigationInjectedProps> = React.memo(props => {
    const getItems = (url, username, password, categories, index) =>
        getChannels(url, username, password, categories[index].category_id);
    return <Categories type={Type.Live} getItems={getItems} {...props} itemRoute={"LiveChannel"} />;
});

export default LiveScreen;
