import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import {
    Input, InputGroup, InputGroupText, InputGroupAddon, Row, Col,
    Card, CardBody, Button, Label, FormGroup
} from 'reactstrap';
import Select from 'react-select';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { DBUtil } from '../../services';
import { ToastContainer, toast } from 'react-toastify';

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventDetails: {
                eventName: "",
                location: "",
                venue: "",
                startDate: moment(),
                endDate: moment()
            },
            submitted : false,
            inValidDates : false
        };
        this.changeFunction = this.changeFunction.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.resetField = this.resetField.bind(this);

    }
    changeFunction(date, type) {
        let eventDetails = {
            ...this.state.eventDetails
        }
        eventDetails[type] = date;
        this.setState({
            eventDetails: eventDetails,
            inValidDates : false
        })
    }
    onChangeHandler(event) {
        let eventDetailArray = {
            ...this.state.eventDetails
        };
        eventDetailArray[event.target.name] = event.target.value;
        this.setState({
            eventDetails: eventDetailArray
        })
    }
    onSubmitHandler () {
        let eventDetails = {
            ...this.state.eventDetails
        }
        this.setState({
            submitted : true
        });
        let valiDate = moment(eventDetails["startDate"]).isBefore(eventDetails["endDate"]);
        let validSameDate = moment(eventDetails["startDate"]).isSame(eventDetails["endDate"]);
        if(!valiDate || validSameDate ){
            this.setState({
                inValidDates :  true
            });
        }

        if(eventDetails.eventName && valiDate && !validSameDate && eventDetails.location){

            DBUtil.getDocRef("Events").add({
                eventName : eventDetails.eventName,
                location : eventDetails.location,
                venue: eventDetails.venue,
                startDate : new Date (eventDetails.startDate),
                endDate : new Date (eventDetails.endDate),
            })
            .then((res) => {
                this.setState({
                    submitted : false
                })
                this.resetField();
            })
            .catch((error) => {
            });
        }
    }
    resetField () {
        let eventDetails = {
            eventName: "",
            location: "",
            venue: "",
            startDate: moment(),
            endDate: moment()
        }
        this.setState({
            eventDetails : eventDetails
        });
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Row className="justify-content-left">
                    <Col md="8">
                        <Card className="mx-6">
                            <CardBody className="p-4">
                                <h1>Events</h1>
                                <FormGroup row>
                                    <Col xs="12" >
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                type="text"
                                                placeholder="Event Name"
                                                name="eventName"
                                                value={this.state.eventDetails.eventName}
                                                onChange={this.onChangeHandler} />

                                                {this.state.submitted && !this.state.eventDetails.eventName &&
                                                        <div className="help-block" style={{ color: "red" }}>*Required</div>
                                                }
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col xs="12" md="6" >
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <DatePicker
                                                id="start"
                                                selected={this.state.eventDetails.startDate}
                                                onChange={(event) => this.changeFunction(event, "startDate")}
                                                placeholderText="Select start date"
                                            />
                                            {this.state.submitted && this.state.inValidDates &&
                                                        <div className="help-block" style={{ color: "red" }}>*Invalid date</div>
                                                }
                                        </InputGroup>
                                    </Col>
                                    <Col md="6" >
                                        <InputGroup className="mb-6">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <DatePicker
                                                selected={this.state.eventDetails.endDate}
                                                onChange={(event) => this.changeFunction(event, "endDate")}
                                                placeholderText="Select End date"
                                            />

                                            {this.state.submitted && this.state.inValidDates &&
                                                        <div className="help-block" style={{ color: "red" }}>*Invalid date</div>
                                                }
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col xs="12" md="6" >
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                type="text"
                                                placeholder="Location"
                                                name="location"
                                                value={this.state.eventDetails.location}
                                                onChange={this.onChangeHandler} />

                                                {this.state.submitted && !this.state.eventDetails.location &&
                                                        <div className="help-block" style={{ color: "red" }}>*Required</div>
                                                }
                                        </InputGroup>
                                    </Col>
                                    <Col md="6" >
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                type="text"
                                                placeholder="Venue"
                                                name="venue"
                                                value={this.state.eventDetails.venue}
                                                onChange={this.onChangeHandler} />
                                                
                                                {this.state.submitted && !this.state.eventDetails.venue &&
                                                        <div className="help-block" style={{ color: "red" }}>*Required</div>
                                                }
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col xs="8" md="3">
                                        <Button onClick={this.onSubmitHandler} type="submit" size="md" color="success" > Submit</Button>
                                        </Col>
                                        <Col md="3">
                                        <Button onClick={this.resetField} type="reset" size="md" color="danger" > Reset</Button>
                                        <ToastContainer autoClose={2000} />
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
export default Events;


