import { combineReducers } from 'redux';

const navReducer = (nav = 'Home', action) => {
    switch(action.type) {
    case 'NAV':
        return action.nav;

    default:
        return nav;
    }
};

const schedulesReducer = (schedules = {}, action) => {
    console.log('schedulesReducer', schedules);
    switch(action.type) {
    case 'SCHEDULE':
        let newSchedules = Object.assign({}, schedules);
        newSchedules[action.dir] = action.schedule;
        return newSchedules;

    default:
        return schedules;
    }
};

const AppReducer = combineReducers({
    nav: navReducer,
    schedules: schedulesReducer
});

export default AppReducer;
