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
            longitude : ''
        };
        this.changeFunction = this.changeFunction.bind(this);
        this.submitFunction = this.submitFunction.bind(this);
        this.resetField = this.resetField.bind(this);
        this.onEventSelect = this.onEventSelect.bind(this);
    }
    componentWillMount() {
        let thisRef = this;
        let events = [];
        let eventData = [];
        DBUtil.getDocRef('Events')
            .get()
            .then((snapshot) => {
                snapshot.forEach(doc => {
                    events.push({ label: doc.data().eventName, value: doc.id });
                    eventData.push(doc.data());
                })
                thisRef.setState({
                    events: events,
                    eventData: eventData
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    // Method to set text area value
    changeFunction(event) {
        let address = event.target.value;
        this.setState({
            eventAddress: address
        });
    }


    // Method for submit & pass data to database
    submitFunction(event) {
        event.preventDefault();
        let componentRef = this;
        const eventAddress = {...this.state.eventAddress}
        //  Geocode.fromAddress(eventAddress)
        //     .then((response) => {
        //         const { lat, lng } = response.results[0].geometry.location;
        //         this.setState({
        //             latitude : lat,
        //             longitude : lng
        //         })
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })

        let tableName = "LocationDetails";
        let docName = this.state.selectedEvent;
        let doc = {
            eventName : this.state.selectedEvent,
            eventlocation : this.state.eventAddress,
            latitude : this.state.latitude,
            longitude : this.state.longitude,
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
    }
    onEventSelect(eventName) {
        let eventName1 = eventName;
        this.setState({
            selectedEvent: eventName1
        });
    }

    // Method for reset all fields
    resetField(resetFlag) {
        this.setState({
            // info: ''
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
                                            <Label>Volunteers : </Label>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText><i className="fa fa-at"></i></InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="email" name="eventSupportEmail" onChange={this.changeFunction} />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Col xs="12" md="12">
                                        <Button type="submit" size="md" color="success" onClick={this.submitFunction} ><i className="icon-note"></i> Submit</Button> &nbsp;&nbsp;
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
