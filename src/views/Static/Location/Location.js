import React, { Component } from 'react';
import {
    Input, InputGroup, InputGroupText, InputGroupAddon, Row, Col,
    Card, CardBody, Button, Label, FormGroup
} from 'reactstrap';
import Select from 'react-select';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { DBUtil } from '../../../services';
import { ToastContainer, toast } from 'react-toastify';
import Geocode from "react-geocode";


class LocationDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            eventData: [],
            selectedEvent: '',
            eventAddress: '',
            latitude : '',
            longitude : '',
            latitudeDelta :'',
            longitudeDelta : ''
        };
        this.changeFunction = this.changeFunction.bind(this);
        this.submitFunction = this.submitFunction.bind(this);
        this.resetField = this.resetField.bind(this);
        this.getCordinates = this.getCordinates.bind(this);
        this.onEventSelect = this.onEventSelect.bind(this);
    }
    componentWillMount() {
        let events = [];
        let eventData = [];
        eventData  =JSON.parse(localStorage.getItem('eventList'));
        eventData.forEach(event => {
            events.push({label : event.eventName , value : event.eventName})
        })
        this.setState({
            events: events,
            eventData: eventData
        });
    }
    // Method to set text area value
    changeFunction(event) {
        let address = event.target.value;
        this.setState({
            eventAddress: address
        });
    }

    getCordinates(event) {
        let eventAddress  = this.state.eventAddress;
        Geocode.fromAddress(eventAddress)
            .then((response) => {
                const { lat, lng } = response.results[0].geometry.location;
                let latitudeDelta = 0.0922;
                let longitudeDelta = 0.0421;
                this.setState({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta  : latitudeDelta,
                    longitudeDelta : longitudeDelta
                })
                this.submitFunction(event)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    // Method for submit & pass data to database
    submitFunction(event) {
        event.preventDefault();
        let componentRef = this;
        let eventAddress = this.state.eventAddress;
        if(this.state.latitude && this.state.longitude){
            let selectedEvent = _.filter(this.state.eventData, {eventName : this.state.selectedEvent});
            let tableName = "LocationDetails";
            let docName = this.state.selectedEvent;
            let doc = {
                eventDetails : selectedEvent[0],
                eventName : selectedEvent[0].eventName,
                eventlocation : this.state.eventAddress,
                latitude : this.state.latitude,
                longitude : this.state.longitude,
                latitudeDelta : this.state.latitudeDelta,
                longitudeDelta : this.state.longitudeDelta,
                timestamp: new Date()
            }
            if (this.state.selectedEvent !== "") {
                DBUtil.addDoc(tableName, docName, doc, function (id, error) {
                    if (id != "") {
                        toast.success("Location added successfully.", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                        componentRef.resetField(true);
                    }
                },
                    function (err) {
                        toast.error("Error: Location not saved.", {
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                    });
            }
            else{
                alert('Please select event');
            }
        }
        
    }
    onEventSelect(eventName) {
        let eventName1 = eventName;
        this.setState({
            selectedEvent: eventName1
        });
        let eventAddress = "";
        DBUtil.getDocRef("LocationDetails")
            .where('eventName', '==', eventName1)
            .get()
            .then((snapshot) => {
                snapshot.forEach(doc =>{
                    console.log('doc.data()',doc.data());
                    eventAddress = doc.data().eventlocation
                    ;
                })
                this.setState({
                    eventAddress: eventAddress
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    // Method for reset all fields
    resetField(resetFlag) {
        this.setState({
            selectedEvent: '',
            eventAddress: '',
            latitude : '',
            longitude : ''
        });
        if (resetFlag != true) {
            toast.success("HelpDesk form reset successfully.", {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    }

    render() {
        const { events, selectedEvent } = { ...this.state }
        let eventOptions = events;
        return (
            <div className="animated fadeIn">
                <Row className="justify-content-left">
                    <Col md="12">
                        <Card className="mx-6">
                            <CardBody className="p-4">
                                <h1>Location</h1>
                                <FormGroup row>
                                    <Col xs="12" md="6">
                                        <Select
                                            placeholder="--Select Event--"
                                            simpleValue
                                            value={selectedEvent}
                                            options={eventOptions}
                                            onChange={this.onEventSelect} />
                                    </Col>
                                    <Col md="6">
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText><i className="fa fa-address-book"></i></InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" name="eventAddress" value={this.state.eventAddress} onChange={this.changeFunction} />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col xs="12" md="12">
                                        <Button type="submit" size="md" color="success" onClick={this.getCordinates} ><i className="icon-note"></i> Submit</Button> &nbsp;&nbsp;
                            <Button onClick={this.resetField} type="reset" size="md" color="danger" ><i className="fa fa-ban"></i> Reset</Button>
                                        <ToastContainer autoClose={4000} />
                                    </Col>
                                </FormGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default LocationDetails;
