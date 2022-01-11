import * as React from "react";
import { NavigationInjectedProps } from "react-navigation";
import Categories from "./Categories";
import { Type } from "./constants";

const VODScreen: React.FC<NavigationInjectedProps> = React.memo(props => {
    return <Categories type={Type.Movies} {...props} itemRoute={"VODChannel"} />;
});

export default VODScreen;
