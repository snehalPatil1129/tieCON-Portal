import * as actionTypes from './actionTypes';

const initialState = {
    eventList : [],
    eventData : [],
    formTypes :  [
        { label: 'Home Questions', value: 'homeQuestions' },
        { label: 'Feedback Questions', value: 'feedbackQuestions' },
        { label: 'Polling Questions', value: 'pollingQuestions' },
    ],
    sessionData : [],
    sessionList: []
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_EVENTS:
            return {
                ...state,
                eventData: action.eventData,
                eventList: action.eventList
            };
        case actionTypes.GET_SESSIONS:
            return {
                ...state,
                sessionData: action.sessionData,
                sessionList: action.sessionList
            };
        default:
            return state;
    }
}
export default reducer;