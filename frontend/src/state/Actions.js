const Actions = {
    Nav: route => ({
        type: 'NAV',
        nav: route
    }),

    Schedule: (dir, schedule) => ({
        type: 'SCHEDULE',
        dir: dir,
        schedule: schedule
    })

};

export default Actions;
