import aja from 'aja';
import Actions from './Actions';

const fetch = (dispatch, dir) => {
    aja()
        .url('http://bus.brbrb.us/schedule')
        .type('jsonp')
        .data({dir: dir})
        .on('success', (schedule) => {
            dispatch(Actions.Schedule(dir, schedule));
        })
        .go();
};

export const SchedulePoller = {
    start: (dispatch, dir) => {
        fetch(dispatch, dir);
        window.setInterval(() => fetch(dispatch, dir), 10000);
    }
};

export default SchedulePoller;
