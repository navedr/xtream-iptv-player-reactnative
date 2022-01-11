import * as React from "react";
import Categories from "./Categories";
import { Type } from "./constants";
import { NavigationInjectedProps } from "react-navigation";

const LiveScreen: React.FC<NavigationInjectedProps> = React.memo(props => {
    return <Categories type={Type.Live} {...props} itemRoute={"LiveChannel"} />;
});

export default LiveScreen;
