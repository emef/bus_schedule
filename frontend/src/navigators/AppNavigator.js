import React from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';

import Actions from '../state/Actions';
import HomeScreen from '../components/HomeScreen';
import SeattleScreen from '../components/SeattleScreen';

class App extends React.Component {
    routes = {
        'Home': HomeScreen,
        'Seattle': SeattleScreen
    };

    render() {
        const Screen = this.routes[this.props.nav];
        const title = Screen.navigationOptions.title;
        return (
            <View style={styles.container}>
              <View style={styles.titlebar}>
                <Text style={styles.title}>{title.toUpperCase()}</Text>
              </View>
              <View style={styles.content}>
                <Screen />
              </View>
              <View style={styles.nav}>
                <Icon
                   screen={HomeScreen}
                   active={Screen}
                   onNavPress={this.props.onNavPress} />
                <Icon
                   screen={SeattleScreen}
                   active={Screen}
                   onNavPress={this.props.onNavPress} />
              </View>
            </View>
        );
    }
}

const Icon = ({screen, active, onNavPress}) => {
    const title = screen.navigationOptions.title;
    const icon = screen.navigationOptions.icon;
    const isActive = screen === active;
    const containerStyle = isActive
              ? [styles.iconContainer, styles.iconActive]
              : styles.iconContainer;
    const onPress = () => onNavPress(title);

    return (
        <TouchableHighlight style={styles.iconHighlight} onPress={onPress}>
          <View style={containerStyle}>
            <View style={styles.iconImageContainer}>
              <Image source={icon} style={styles.iconImage} />
            </View>
            <View style={styles.iconTextContainer}>
              <Text style={styles.iconText}>{title}</Text>
            </View>
          </View>
        </TouchableHighlight>
    );
};

const mapStateToProps = (state) => ({
    nav: state.nav
});

const mapDispatchToProps = dispatch => ({
    onNavPress: route => dispatch(Actions.Nav(route))
});

const AppWithNavigationState = connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2b2b2b'
    },

    titlebar: {
        flex: 0.1,
        borderBottomWidth: 1,
        borderColor: '#272727',
        alignItems: 'center',
        justifyContent: 'center'
    },

    title: {
        color: '#e5e5e5',
        fontSize: '1.2em',
        fontFamily: 'EuphemiaUCAS',
        textAlign: 'center'
    },

    nav: {
        flex: 0.15,
        borderTopWidth: 1,
        borderColor: '#1a1a1a',
        flexDirection: 'row'
    },

    iconHighlight: {
        borderTopWidth: 0,
        flex: 1
    },

    iconContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },

    iconActive: {
        backgroundColor: 'black'
    },

    iconImageContainer: {
        flex: 0.75,
        flexDirection: 'row',
        justifyContent: 'center'
    },

    iconImage: {
        flex: 0.5,
        marginTop: 10,
        resizeMode: 'contain'
    },

    iconTextContainer: {
        flex: 0.25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    iconText: {
        flex: 1,
        fontFamily: 'Helvetica-Light',
        color: '#e5e5e5',
        textAlign: 'center',
        fontSize: '0.5em'
    },

    content: {
        flex: 1
    }
});

export default AppWithNavigationState;
