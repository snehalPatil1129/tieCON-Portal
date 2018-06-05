import React, {Component} from 'react';
import {
    Input, InputGroup, InputGroupText, InputGroupAddon, Row, Col,
    Card, CardBody, Button, Label, FormGroup
} from 'reactstrap';

import * as firebase from 'firebase';
import 'firebase/firestore';
import { DBUtil } from '../../../services';
import { ToastContainer, toast } from 'react-toastify';

class AboutEternus extends Component{
    constructor(props) {
        super(props);
        this.state = {
            info: '',
            information : '',
            url :''
        };
        this.changeFunction = this.changeFunction.bind(this);
        this.urlChangeFunction = this.urlChangeFunction.bind(this);
        this.submitFunction = this.submitFunction.bind(this);
        this.resetField = this.resetField.bind(this);
    }
    componentWillMount () {
        DBUtil.getDocRef("AboutEternusSolutions").doc("EternusInfo").onSnapshot((snapshot) =>{
            let information= "";
            let url= "";
               information = snapshot.data().info;
               url = snapshot.data().url ? snapshot.data().url : '';
                this.setState({
                    information : information,
                    url : url
                })
        })
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

    // Method for submit & pass data to database
    submitFunction(event){
        event.preventDefault();        
        const { information } = this.state;
        const { url } = this.state;   
        let componentRef = this;
        if (information != "") {
            let tableName = "AboutEternusSolutions";
            let docName = "EternusInfo"
            let doc = {
                url: url,
                info: information,
                timestamp: new Date()
            }
             
        DBUtil.addDoc(tableName, docName ,doc, function (id, error) {    
            if(id != ""){
                toast.success("Information About Eternus Solutions added successfully.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                componentRef.resetField(true);
            }
          },
            function (err) {
              toast.error("Error: Information About Eternus Solutions not saved.", {
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            });
        }
    }

    // Method for reset all fields
    resetField(resetFlag) {
        this.setState({
            information: '',
            url: ''
        });
        if (resetFlag != true) {
            toast.success("About us form reset successfully.", {
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
                        <h1>About Eternus Solutions</h1>
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

export default AboutEternus;
