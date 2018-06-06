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

class AboutUs extends Component{
    constructor(props) {
        super(props);
        this.state = {
            info: '',
            information : '',
            url :'',
            events : [],
            eventData : [],
            selectedEvent : ''
        };
        this.changeFunction = this.changeFunction.bind(this);
        this.urlChangeFunction = this.urlChangeFunction.bind(this);
        this.submitFunction = this.submitFunction.bind(this);
        this.resetField = this.resetField.bind(this);
        this.onEventSelect = this.onEventSelect.bind(this);
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
        const { name, value } = event.target;
        const { information } = this.state;
        this.setState({
            information: value,
        });
    }

    urlChangeFunction(event) {
        const { name, value } = event.target;
        const { url } = this.state;
        this.setState({
            url: value,
        });
    }
    onEventSelect(eventName) {
        let eventName1 = eventName;
        this.setState({
            selectedEvent: eventName1
        });
        let information = "";
        let url = "";
        DBUtil.getDocRef("AboutUs")
            .where('eventName', '==', eventName1)
            .get()
            .then((snapshot) => {
                snapshot.forEach(doc =>{
                    information = doc.data().info;
                    url = doc.data().url ? doc.data().url : '';
                })
                this.setState({
                    information: information,
                    url: url
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }
    // Method for submit & pass data to database
    submitFunction(event){
        event.preventDefault();        
        const { information } = this.state;
        const { url } = this.state;   
        let componentRef = this;
        if (information != "" && this.state.selectedEvent !== "") {
            let selectedEvent = _.filter(this.state.eventData, {eventName : this.state.selectedEvent});            
            let tableName = "AboutUs";
            let docName = selectedEvent[0].eventName
            let doc = {
                eventDetails : selectedEvent[0],
                eventName : selectedEvent[0].eventName,
                info: information,
                timestamp: new Date(),
                url :  url
            }
             
        DBUtil.addDoc(tableName, docName ,doc, function (id, error) {    
            if(id != ""){
                toast.success("Information About Us added successfully.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                componentRef.resetField(true);
            }
          },
            function (err) {
              toast.error("Error: Information About Us not saved.", {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            });
        }
        else{
            alert('Information/Event cannot be blank');
        }
    }

    // Method for reset all fields
    resetField(resetFlag) {
        this.setState({
            information: '',
            url : '',
            selectedEvent : ''
        });
        if (resetFlag != true) {
            toast.success("About us form reset successfully.", {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
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
                        <h1>About Us</h1>
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
                        <FormGroup row>
                        <Col xs="12" md="12">
                            <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-info"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="textarea"  name="info" value={this.state.information} onChange={this.changeFunction}  />
                            </InputGroup>
                        </Col>
                        </FormGroup>
                        <FormGroup row>
                        <Col xs="12" md="6">
                            <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-info"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text"  name="url" value={this.state.url} onChange={this.urlChangeFunction}/>
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

export default AboutUs;
