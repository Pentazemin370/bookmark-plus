import { Reducer } from "react";

export interface SettingsState {
    enableOverride: boolean;
    displayTime: boolean;
    displayDate: boolean;
    showClock: boolean;
    displaySeconds: boolean;
    hour12: boolean;
    bgFile: string | ArrayBuffer;
    isLocalFile: boolean;
}

export enum SettingsAction {
    setShowClock = 0,
    setDisplayTime = 1,
    setDisplayDate = 2,
    setDisplaySeconds = 3,
    setHour12 = 4,
    setBgFile = 5,
    setIsLocalFile = 6,
    init = 7,
    setEnableOverride = 8
}

export const reducer: Reducer<SettingsState, { type: SettingsAction, payload?: any }> = (state, action) => {
    switch (action.type) {
        case SettingsAction.setShowClock:
            return {
                ...state,
                showClock: !state.showClock
            };
        case SettingsAction.setDisplayTime:
            return {
                ...state,
                displayTime: !state.displayTime
            }
        case SettingsAction.setDisplayDate:
            return {
                ...state,
                displayDate: !state.displayDate
            }
        case SettingsAction.setDisplaySeconds:
            return {
                ...state,
                displaySeconds: !state.displaySeconds
            }
        case SettingsAction.setHour12:
            return {
                ...state,
                hour12: !state.hour12
            }
        case SettingsAction.setBgFile: return {
            ...state,
            bgFile: action.payload
        }
        case SettingsAction.setIsLocalFile: return {
            ...state,
            bgFile: '',
            isLocalFile: action.payload
        }
        case SettingsAction.init:
            return action.payload
        case SettingsAction.setEnableOverride: return {
            ...state,
            enableOverride: !state.enableOverride
        }

        default: return {} as SettingsState;
    }
}

export type SettingsReducer = typeof reducer;