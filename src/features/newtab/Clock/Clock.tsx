import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState, ClockState, refreshDate, AppSettingsState } from "../store";

export const Clock = () => {
    const dispatch = useDispatch();
    const { date } = useSelector<RootState, ClockState>(state => state.clockReducer, shallowEqual);
    const { displayDate, displaySeconds, displayTime, hour12 } = useSelector<RootState, AppSettingsState>(state => state.appSettingsReducer, shallowEqual);
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    let interval: NodeJS.Timeout | null = null;
    useEffect(() => {
        interval = setInterval(() => { dispatch(refreshDate()); }, 1000);
    }, []);
    useEffect(() => () => {
        if (interval) {
            clearInterval(interval);
        }
    }, []);

    return (date ?
        <div>
            {displayTime ?
                <h1 className="display-1 font-weight-bold">
                    {date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: displaySeconds ? 'numeric' : undefined, hour12: hour12 })}
                </h1>
                : null}
            {displayDate ? <h2 className="display-2">{dayNames[date.getDay() - 1]} {date.getDate()} {monthNames[date.getMonth()]} </h2> : null}
        </div>
        : null);
}