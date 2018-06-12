import * as actionTypes from './actionTypes';
import { firebaseConfig, firestoredb } from '../services/config';


export const storeEvents = (eventList , eventData) => {
    return {
        type : actionTypes.GET_EVENTS,
        eventList : eventList,
        eventData : eventData
    };
};
export const storeSessions = (sessionList , sessionData) => {
    return {
        type : actionTypes.GET_EVENTS,
        sessionList : sessionList,
        sessionData : sessionData
    };
};

export const getSessions = (eventName) =>{
    let sessionList = []; let sessionData = [];
    return dispatch => {
        firestoredb.collection('Sessions')
        .where('eventName','==',eventName)
        .get()
        .then((snapshot) => {
            if(snapshot.size > 0){
                snapshot.forEach(doc => {
                    sessionData.push(doc.data());
                    sessionList.push({
                        label: doc.data().sessionName,
                        value: doc.data().sessionName
                    })
                })
            }
            dispatch(storeSessions(sessionList , sessionData));
        })
        .catch((error) => {
            console.log("errror");
        })
    }
}

export const getEvents = () => {
    let eventList = []; let eventData = [];
    return dispatch => {
        firestoredb.collection('Events')
        .get()
        .then((snapshot) => {
            if(snapshot.size > 0){
                snapshot.forEach(doc => {
                    eventData.push(doc.data());
                    eventList.push({
                        label: doc.data().eventName,
                        value: doc.data().eventName
                    })
                })
            }
            dispatch(storeEvents(eventList , eventData));
        })
        .catch((error) => {
            console.log("errror");
        })
    }
   
};

