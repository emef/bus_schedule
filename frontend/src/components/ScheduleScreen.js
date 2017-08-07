import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const ScheduleScreen = ({schedule}) => {
    return (
        <View style={styles.screen}>
          <ScheduleList schedule={ schedule } />
        </View>
    );
};

const ScheduleList = ({ schedule }) => {
    return (
        <ScrollView style={styles.list}>
          { schedule.map((item) => (
              <ScheduleItem
                 key={item.line + item.etime}
                 line={item.line}
                 etime={item.etime} />
          )) }
        </ScrollView>
    );
};

const ScheduleItem = ({ line, etime }) => {
    return (
        <View style={styles.item}>
          <View style={styles.etime}>
            <Text style={styles.text}>{etime}</Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.text}>{line}</Text>
          </View>
        </View>
    );
};


const styles = StyleSheet.create({
    screen: { flex: 1 },

    list: {
        flex: 1,
        flexDirection: 'column'
    },

    item: {
        height: 50,
        backgroundColor: '#393939',
        flexDirection: 'row',
        borderColor: '#272727',
        borderBottomWidth: 1
    },

    etime: {
        flex: 0.3,
        borderColor: '#272727',
        borderRightWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    line: {
        flex: 0.7,
        justifyContent: 'center',
        paddingLeft: 15
    },

    text: {
        color: '#e5e5e5',
        fontFamily: 'EuphemiaUCAS'
    }

});

export default ScheduleScreen;
