import React, { Component } from 'react';
import {
    Badge, Row, Col, Card, Dropdown, Form, FormInput,
    InputGroup, Input, FormGroup, Label, CardHeader, CardBody, Container,
    InputGroupAddon, InputGroupText, Button
} from 'reactstrap';
import Select from 'react-select';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { DBUtil } from '../../services';
import {Functions} from './CommonFunctions';
import SessionForm from '../Sessions/SessionForm';
import { ToastContainer, toast } from 'react-toastify';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actionTypes';
import * as actions from '../../store/actions';
class DynamicQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            SessionList: [],
            formValue :'',
            eventValue : '',
            sessionValue : '',
            isSessionRelated : false,
            formArray : []
        }
    }
    componentWillMount () {
        this.props.onGetEvents();
    }
    
    handleformTypeChange (value) {
        if(value === 'feedbackQuestions' || value === 'pollingQuestions'){
            this.setState({
                formValue : value,
                isSessionRelated : true
            })
            this.getSessions();
        }
        else{
            this.setState({
                formValue : value
            })
           // this.checkPreviousForm();
        }
    }
    checkPreviousForm () {
        const thisRef = this;
        Functions.getDocument('FormCollection',this.state.eventValue , this.state.sessionValue,function(response){
            if(response.size > 0){
                console.log('yes found');
            }
            else{
                console.log('not found');
            }
        },function(error){
            console.log('error');
        })
    }
    handleEventChange (value) {
        this.setState({
            eventValue :  value
        });
        if(this.state.isSessionRelated == true){
            this.getSessions();
        }
    }
    handleSessionChange (value) {
        this.setState({
            sessionValue : value
        });
       // this.checkPreviousForm();
    }
    getSessions (){
        if(this.state.eventValue === '' || this.state.eventValue === null){
            alert('please select event');
        }
        else if(this.props.eventList === []){
            alert('please create events first');
        }
        else{
           this.props.onGetSessions(this.state.eventValue);
        }
    }
    formRendering () {
        if(this.state.formArray.length > 0){
            return (
                <h1>HELLO</h1>
            )
        } 
        else{
            return null;
        }
    } 
    render() {
        const formOptions = this.props.formTypes;
        const eventOptions = this.props.eventList;
        const sessionOptions = this.props.sessionList;
        return (
            <div className="animated fadeIn">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="12">
                            <Card className="mx-12">
                                <CardHeader>
                                    <FormGroup row className="marginBottomZero">
                                        <Col xs="12" md="3">
                                            <h1 className="regHeading paddingTop8">Create Form</h1>
                                        </Col>
                                        <Col md="3">
                                            <Select
                                                placeholder="Select Event"
                                                simpleValue
                                                value={this.state.eventValue}
                                                options={eventOptions}
                                                onChange={this.handleEventChange.bind(this)}
                                            />
                                        </Col>
                                        {
                                            this.state.eventValue ?
                                                <Col md="3">
                                                    <Select
                                                        placeholder="Select Form Type"
                                                        simpleValue
                                                        value={this.state.formValue}
                                                        options={formOptions}
                                                        onChange={this.handleformTypeChange.bind(this)}
                                                    />
                                                </Col> : null
                                        }
                                        {
                                            this.state.isSessionRelated ? 
                                            <Col md="3">
                                                <Select
                                                    placeholder="Select Session"
                                                    simpleValue
                                                    value={this.state.sessionValue}
                                                    options={sessionOptions}
                                                    onChange={this.handleSessionChange.bind(this)}
                                                />
                                            </Col> : null
                                        }
                                        
                                    </FormGroup>
                                </CardHeader>
                                <CardBody className="p-6">
                                <FormGroup row>
                                <Col xs="12" md="8">                                                   
                                        </Col>
                                        <Col md="4">
                                            <h4> <Badge color="primary" pill> <i className="icon-note"></i> Add Question</Badge></h4>
                                            {/* <h6 style={{color : "red"}}>{this.InvalidMessage}</h6> */}
                                        </Col>
                                    </FormGroup>
                                <FormGroup row>
                                    <Col xs="12" >
                                        {this.formRendering()}
                                    </Col>
                                </FormGroup>
                                    <FormGroup row>
                                        <Col xs="6" md="3" >
                                            <Button type="submit" size="md" color="primary"  >Submit</Button>
                                        </Col>
                                        <Col md="3">
                                            <Button type="reset" size="md" color="danger"><i className="fa fa-ban"></i> Reset</Button>
                                        </Col>
                                    </FormGroup>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        eventList : state.eventList,
        formTypes :  state.formTypes,
        sessionList : state.sessionList
    }
}
const mapDispatchToProps = (dispatch) => {
    return{ 
        onGetEvents : () => dispatch(actions.getEvents()),
        onGetSessions : (eventName) => dispatch(actions.getSessions(eventName))
    }
}
export default connect (mapStateToProps, mapDispatchToProps)(DynamicQuestions);