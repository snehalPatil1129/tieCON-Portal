import { firebaseConfig, firestoredb } from '../../services/config';

export class Functions {

    constructor() {
    }

    static getDocument(collectionName, eventName, sessionName, callbackFn, errorFn) {
        firestoredb.collection(collectionName)
            .where('eventName', '==', eventName)
            .where('sessionName', '==', sessionName)
            .get()
            .then((response) => {
                callbackFn(response);
            })
            .catch((error) => {
                errorFn(error);
            })
    }
    static getSessions(collectionName, eventName, callbackFn, errorFn) {
        let sessionData = [];
        let sessionList = [];
        firestoredb.collection(collectionName)
            .where('eventName', '==', eventName)
            .get()
            .then((response) => {
                if(response.size > 0){
                    response.forEach(doc => {
                        sessionData.push(doc.data());
                        sessionList.push({label : doc.data().sessionName ,value : doc.data().sessionName})
                    })
                }
                callbackFn(sessionList ,sessionData);
            })
            .catch((error) => {
                errorFn(error);
            })
    }
    static getEvents(callbackFn , errorFn){
        let eventData = [];
        let eventList = [];
        firestoredb.collection('Events')
        .get()
        .then((response) =>{
            if(response.size > 0){
                response.forEach((doc) => {
                    eventList.push({ label: doc.data().eventName, value: doc.data().eventName });
                    eventData.push(doc.data());
                })
            }
            callbackFn(eventList , eventData);
        })
        .catch((error) => {
            errorFn(error);
        });
    }
}