import React, {Component} from 'react';
import {
    Input, InputGroup, InputGroupText, InputGroupAddon, Row, Col,
    Card, CardBody, Button, Label, FormGroup
} from 'reactstrap';

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
            }
        };
        this.changeFunction = this.changeFunction.bind(this);
        //this.urlChangeFunction = this.urlChangeFunction.bind(this);
        this.submitFunction = this.submitFunction.bind(this);
        this.resetField = this.resetField.bind(this);
        this.setInputToNumeric = this.setInputToNumeric.bind(this);
    }
    componentWillMount () {
        Geocode.fromAddress("Shakti Colony, Pimple Nilakh, Pimpri-Chinchwad, Maharashtra 411027")
            .then((response) => {
                const { lat, lng } = response.results[0].geometry.location;
                console.log(lat, lng);
            })
            .catch((error) => {
                console.log(error);
            })
        


        // DBUtil.getDocRef("HelpDesk").doc("HelpDesk").onSnapshot((snapshot) =>{
        //     let information= "";
        //     let url= "";
        //     information = snapshot.data().info;
        //     url = snapshot.data().url ? snapshot.data().url : '';
        //         this.setState({
        //             information : information,
        //             url : url
        //         })
        //     //}
        // })
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

       // if (information != "") {
            let tableName = "HelpDesk";
            let docName = "HelpDesk"
            let doc = {
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
       // }
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

    render(){
        return (
            <div className="animated fadeIn">
                <Row className="justify-content-left">
                <Col md="12">
                    <Card className="mx-6">
                    <CardBody className="p-4">
                        <h1>Help Desk</h1>
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
