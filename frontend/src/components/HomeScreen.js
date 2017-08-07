import React from 'react';
import { connect } from 'react-redux';

import icon from '../img/icon_Home.png';
import ScheduleScreen from './ScheduleScreen';

const HomeScreen = connect(
    ({ schedules }) => ({ schedules })
)(({ schedules }) => {
    return <ScheduleScreen schedule={schedules.east || []} />;
});

HomeScreen.navigationOptions = {
    title: 'Home',
    icon: icon
};

export default HomeScreen;
