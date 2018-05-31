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
import Avatar from 'react-avatar';
//import QRCode from 'qrcode'
//const data = require('../../../public/attendeeData/attendeeData.json');

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate : moment(),
            endDate : moment()
        };
        this.changeFunction = this.changeFunction.bind(this);
        this.changeEndFunction = this.changeEndFunction.bind(this);
    }
    changeFunction ( date) {
        this.setState({
            startDate : date
        });
    }
    changeEndFunction (date) {
        this.setState({
            endDate : date
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
                                    <Col xs="12" md="6" >
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" placeholder="Event Name" name="eventName" />
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
                                                selected={this.state.startDate}
                                                onChange={this.changeFunction}
                                                //highlightDates={[moment().subtract(7, "days"), moment().add(7, "days")]}
                                                placeholderText="Select start date"
                                                 />
                                        </InputGroup>
                                    </Col>
                                    <Col md="6" >
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <DatePicker
                                                id="end" 
                                                selected={this.state.endDate}
                                                onChange={this.changeEndFunction}
                                                //highlightDates={[moment().subtract(7, "days"), moment().add(7, "days")]}
                                                placeholderText="Select End date"
                                                 />
                                        </InputGroup>
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


