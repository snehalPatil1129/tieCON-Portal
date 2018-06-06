import React, {Component} from 'react';
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


class HelpDesk extends Component{
    constructor(props) {
        super(props);
        this.state = {
            helpDeskDetails:{
                eventSupportEmail:'',
                eventSupportContact: '',
                techSupportEmail: '',
                techSupportContact : ''
            },
            events : [],
            eventData : [],
            selectedEvent : ''
        };
        this.changeFunction = this.changeFunction.bind(this);
        this.onEventSelect = this.onEventSelect.bind(this);
        this.submitFunction = this.submitFunction.bind(this);
        this.resetField = this.resetField.bind(this);
        this.setInputToNumeric = this.setInputToNumeric.bind(this);
    }
    componentWillMount () {
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
        let newState = {...this.state.helpDeskDetails};
        newState[event.target.name] = event.target.value;
        this.setState({
            helpDeskDetails: newState
        });
    }

   
    // Method for submit & pass data to database
    submitFunction(event){
        event.preventDefault();        
        let componentRef = this;
        const helpDeskDetails = {...this.state.helpDeskDetails}
        if(this.state.selectedEvent !== ""){
            let selectedEvent = _.filter(this.state.eventData, {eventName : this.state.selectedEvent});
            let tableName = "HelpDesk";
            let docName = selectedEvent[0].eventName;
            let doc = {
                eventName : selectedEvent[0].eventName,
                eventDetails : selectedEvent[0],
                helpDeskDetails : helpDeskDetails,
                timestamp: new Date()
            }
             
        DBUtil.addDoc(tableName, docName ,doc, function (id, error) {    
            if(id != ""){
                toast.success("Information HelpDesk added successfully.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                componentRef.resetField(true);
            }
          },
            function (err) {
              toast.error("Error: Information HelpDesk not saved.", {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            });
        }
        else{
            alert("Please select event");
        }
    }
    setInputToNumeric(e) {
        const re = /[0-9]+/g;
        if (!re.test(e.key)) {
          e.preventDefault();
        }
      }
    // Method for reset all fields
    resetField(resetFlag) {
        this.setState({
            info: ''
        });
        if (resetFlag != true) {
            toast.success("HelpDesk form reset successfully.", {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    }
    onEventSelect(eventName) {
        let eventName1 = eventName;
        this.setState({
            selectedEvent: eventName1
        });
        let helpDeskDetails = [];
        DBUtil.getDocRef("HelpDesk")
        .where('eventName', '==', eventName1)
        .get()
        .then((snapshot) => {
            if(snapshot.size > 0){
                snapshot.forEach(doc =>{
                    helpDeskDetails = doc.data().helpDeskDetails
                })
                this.setState({
                    helpDeskDetails : helpDeskDetails
                })
            }
            else{
                this.setState({
                    helpDeskDetails :  {
                        eventSupportEmail:'',
                        eventSupportContact: '',
                        techSupportEmail: '',
                        techSupportContact : ''
                    }
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    render(){
        const { events, selectedEvent } = { ...this.state }
        let eventOptions = events;
        return (
            <div className="animated fadeIn">
                <Row className="justify-content-left">
                <Col md="12">
                    <Card className="mx-6">
                    <CardBody className="p-4">
                        <h1>Help Desk</h1>
                        <FormGroup row>
                            <Col xs="12" md="6">
                                <Select
                                    placeholder="--Select Event--"
                                    simpleValue
                                    value={selectedEvent}
                                    options={eventOptions}
                                    onChange={this.onEventSelect} />
                            </Col>
                        </FormGroup>
                        <h5>Event Support</h5>
                        <FormGroup row>
                       
                        <Col xs="12" md="6">
                            <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-at"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="email"  name="eventSupportEmail" value={this.state.helpDeskDetails.eventSupportEmail}  onChange={this.changeFunction}  />
                            </InputGroup>
                        </Col>
                        <Col  md="6">
                            <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-address-book"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text"  name="eventSupportContact" value={this.state.helpDeskDetails.eventSupportContact} maxLength={10} onKeyPress={(e) => this.setInputToNumeric(e)} onChange={this.changeFunction}  />
                           
                            </InputGroup>
                        </Col>
                        </FormGroup>
                        <h5>Technical Support</h5>
                        <FormGroup row>
                       
                        <Col xs="12" md="6">
                            <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-at"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="email"  name="techSupportEmail" value={this.state.helpDeskDetails.techSupportEmail}  onChange={this.changeFunction}  />
                            </InputGroup>
                        </Col>
                        <Col  md="6">
                            <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-address-book"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text"  name="techSupportContact" value={this.state.helpDeskDetails.techSupportContact} maxLength={10} onKeyPress={(e) => this.setInputToNumeric(e)} onChange={this.changeFunction}  />
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

export default HelpDesk;
