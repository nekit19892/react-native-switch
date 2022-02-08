import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import PropTypes from "prop-types";

export class Switch extends Component {
  static propTypes = {
    onValueChange: PropTypes.func,
    disabled: PropTypes.bool,
    activeText: PropTypes.string,
    inActiveText: PropTypes.string,
    backgroundActive: PropTypes.string,
    backgroundInactive: PropTypes.string,
    value: PropTypes.bool,
    circleActiveColor: PropTypes.string,
    circleInActiveColor: PropTypes.string,
    circleSize: PropTypes.number,
    circleBorderActiveColor: PropTypes.string,
    circleBorderInactiveColor: PropTypes.string,
    activeTextStyle: PropTypes.object,
    inactiveTextStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    barHeight: PropTypes.number,
    circleBorderWidth: PropTypes.number,
    innerCircleStyle: PropTypes.object,
    renderInsideCircle: PropTypes.func,
    changeValueImmediately: PropTypes.bool,
    innerCircleStyle: PropTypes.object,
    outerCircleStyle: PropTypes.object,
    renderActiveText: PropTypes.bool,
    renderInActiveText: PropTypes.bool,
    switchLeftPx: PropTypes.number,
    switchRightPx: PropTypes.number,
    switchWidthMultiplier: PropTypes.number,
    switchBorderRadius: PropTypes.number
  };

  static defaultProps = {
    value: false,
    onValueChange: () => null,
    renderInsideCircle: () => null,
    innerCircleStyle: {},
    disabled: false,
    activeText: "On",
    inActiveText: "Off",
    backgroundActive: "green",
    backgroundInactive: "gray",
    circleActiveColor: "white",
    circleInActiveColor: "white",
    circleBorderActiveColor: "rgb(100, 100, 100)",
    circleBorderInactiveColor: "rgb(80, 80, 80)",
    circleSize: 30,
    barHeight: null,
    circleBorderWidth: 1,
    changeValueImmediately: true,
    innerCircleStyle: { alignItems: "center", justifyContent: "center" },
    outerCircleStyle: {},
    renderActiveText: true,
    renderInActiveText: true,
    switchLeftPx: 2,
    switchRightPx: 2,
    switchWidthMultiplier: 2,
    switchBorderRadius: null,
    testID: null
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      value: props.value,
      transformSwitch: new Animated.Value(
        props.value
          ? props.circleSize / props.switchLeftPx
          : -props.circleSize / props.switchRightPx
      ),
      backgroundColor: new Animated.Value(props.value ? 75 : -75),
      circleColor: new Animated.Value(props.value ? 75 : -75),
      circleBorderColor: new Animated.Value(props.value ? 75 : -75)
    };
  }

  componentDidUpdate(prevProps) {
    const { value, disabled } = this.props;
    if (prevProps.value === value) {
      return;
    }
    if (prevProps.disabled && disabled === prevProps.disabled) {
      return;
    }

    this.animateSwitch(value, () => this.setState({ value }));
  }

  handleSwitch = () => {
    const { value } = this.state;
    const {
      onValueChange,
      disabled,
      changeValueImmediately,
      value: propValue
    } = this.props;
    if (disabled) {
      return;
    }
    // if (this.props.value === this.state.value) {
    //   onValueChange(!this.state.value);
    //   return;
    // }

    if (changeValueImmediately) {
      this.animateSwitch(!propValue);
      onValueChange(!propValue);
    } else {
      this.animateSwitch(!value, () =>
        this.setState({ value: !value }, () => onValueChange(this.state.value))
      );
    }
  };

  animateSwitch = (value, cb = () => { }) => {
    Animated.timing(this.state.transformSwitch, {
      toValue: value
        ? this.props.circleSize / this.props.switchLeftPx
        : -this.props.circleSize / this.props.switchRightPx,
      duration: 150,
      useNativeDriver: true
    }).start(cb);
  };

  render() {
    const {
      transformSwitch,
    } = this.state;

    const {
      backgroundActive,
      backgroundInactive,
      circleActiveColor,
      circleInActiveColor,
      activeText,
      inActiveText,
      circleSize,
      containerStyle,
      activeTextStyle,
      inactiveTextStyle,
      barHeight,
      circleInactiveBorderColor,
      circleActiveBorderColor,
      circleBorderWidth,
      innerCircleStyle,
      outerCircleStyle,
      renderActiveText,
      renderInActiveText,
      renderInsideCircle,
      switchWidthMultiplier,
      switchBorderRadius,
      value,
      ...restProps
    } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.handleSwitch} {...restProps}>
        <Animated.View
          style={[
            styles.container,
            containerStyle,
            {
              backgroundColor: !value ? backgroundInactive : backgroundActive,
              width: circleSize * switchWidthMultiplier,
              height: barHeight || circleSize,
              borderRadius: switchBorderRadius || circleSize
            }
          ]}
        >
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                transform: [{
                  translateX: transformSwitch
                }],
                width: circleSize * switchWidthMultiplier
              },
              outerCircleStyle
            ]}
          >
            {value && renderActiveText && (
              <Text style={[styles.text, styles.paddingRight, activeTextStyle]}>
                {activeText}
              </Text>
            )}

            <Animated.View
              style={[
                styles.circle,
                {
                  borderWidth: circleBorderWidth,
                  borderColor: !value ? circleInactiveBorderColor : circleActiveBorderColor,
                  backgroundColor: !value ? circleInActiveColor : circleActiveColor,
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2
                },
                innerCircleStyle
              ]}
            >
              {renderInsideCircle()}
            </Animated.View>
            {!value && renderInActiveText && (
              <Text
                style={[styles.text, styles.paddingLeft, inactiveTextStyle]}
              >
                {inActiveText}
              </Text>
            )}
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 71,
    height: 30,
    borderRadius: 30,
    backgroundColor: "black"
  },
  animatedContainer: {
    flex: 1,
    width: 78,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "white"
  },
  text: {
    color: "white",
    backgroundColor: "transparent"
  },
  paddingRight: {
    paddingRight: 5
  },
  paddingLeft: {
    paddingLeft: 5
  }
});
