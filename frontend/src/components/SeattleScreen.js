import React from 'react';
import { connect } from 'react-redux';

import icon from '../img/icon_Seattle.png';
import ScheduleScreen from './ScheduleScreen';

const SeattleScreen = connect(
    ({ schedules }) => ({ schedules })
)(({ schedules }) => {
    return <ScheduleScreen schedule={schedules.west || []} />;
});


SeattleScreen.navigationOptions = {
    title: 'Seattle',
    icon: icon
};

export default SeattleScreen;
