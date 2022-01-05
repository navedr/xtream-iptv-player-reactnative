import * as React from "react";
import {
    StyleSheet,
    Text,
    View,
    Animated,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    findNodeHandle,
} from "react-native";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
    scrollOuter: {
        // width: 40
    },
    navBar: {
        width: screen.width,
        flexDirection: "column",
    },

    navItem: {
        marginLeft: 5,
        marginRight: 5,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 7,
        paddingRight: 7,
        alignItems: "center",
        height: 45,
    },
    navItemText: {
        marginTop: 6,
        fontSize: 13,
    },
    activeBottom: {
        position: "absolute",
        left: 0,
        bottom: 1,
        marginTop: 2,
    },
    activeBottomLine: {
        borderBottomWidth: 1,
    },
});

const activeTinyColor = "#00afa5";
const tinyColor = "#434343";

const bottomAdded = -15;

interface ISegmentButtonProps {
    items: any[];
    onSegmentBtnPress: (btn, index) => void;
    activeIndex?: number;
    style?: any;
}

export default class SegmentedButton extends React.PureComponent<
    ISegmentButtonProps,
    {
        activeIndex: number;
        x: any;
        abWidth: any;
    }
> {
    private _firstLayout = true;
    private scrollView;

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: this.props.activeIndex || 0,
            x: new Animated.Value(0),
            abWidth: new Animated.Value(0),
        };
    }

    onLayout() {
        if (!this._firstLayout) {
            return;
        }

        this._firstLayout = false;

        // this.refs[0].measureLayout(findNodeHandle(this.scrollView), (ox, oy, width, height, pageX, pageY) => {
        //     Animated.parallel([
        //         Animated.spring(this.state.abWidth, {
        //             toValue: width + bottomAdded,
        //             friction: 7,
        //         }),
        //         Animated.spring(this.state.x, {
        //             toValue: ox - bottomAdded / 2,
        //             friction: 7,
        //         }),
        //     ]).start();
        // });
    }

    _onSegmentBtnPress(e, index) {
        this.setState({
            activeIndex: index,
        });

        // const item = this.refs[index];
        //
        // item.measureLayout(findNodeHandle(this.scrollView), (ox, oy, width, height, pageX, pageY) => {
        //     Animated.parallel([
        //         Animated.spring(this.state.abWidth, {
        //             toValue: width + bottomAdded,
        //             friction: 7,
        //         }),
        //         Animated.spring(this.state.x, {
        //             toValue: ox - bottomAdded / 2,
        //             friction: 7,
        //         }),
        //     ]).start();
        // });

        this.props.onSegmentBtnPress(e, index);
    }

    getActiveIndex() {
        return this.state.activeIndex;
    }

    render() {
        const navItems = this.props.items;
        if (!navItems || !navItems.length) {
            return null;
        }
        const activeItemIndex = this.state.activeIndex;
        const doms = navItems.map(function (item, index) {
            const key = `segment_${index}`;
            let label;

            if (typeof item === "string") {
                label = item;
            } else {
                label = item.text;
            }

            if (activeItemIndex === index) {
                return (
                    <TouchableOpacity
                        key={key}
                        // ref={index}
                        style={[styles.navItem, { marginBottom: 1.5 }]}>
                        <Text style={[styles.navItemText, { color: activeTinyColor }]}>{label}</Text>
                    </TouchableOpacity>
                );
            }
            return (
                <TouchableOpacity
                    key={key}
                    // ref={index}
                    onPress={e => this._onSegmentBtnPress(e, index)}
                    style={[styles.navItem, {}]}>
                    <Text style={[styles.navItemText, { color: tinyColor }]}>{label}</Text>
                </TouchableOpacity>
            );
        });
        return (
            <View
                onLayout={this.onLayout.bind(this)}
                style={[styles.scrollOuter, { alignItems: "flex-start", justifyContent: "center" }, this.props.style]}>
                <ScrollView
                    ref={el => this.scrollView= el}
                    automaticallyAdjustContentInsets={false}
                    directionalLockEnabled
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    {doms}
                    <Animated.View
                        // ref="activeBottom"
                        style={[
                            styles.activeBottom,
                            styles.activeBottomLine,
                            { borderColor: activeTinyColor },
                            {
                                width: this.state.abWidth,
                                transform: [{ translateX: this.state.x }],
                            },
                        ]}
                    />
                </ScrollView>
            </View>
        );
    }
}
