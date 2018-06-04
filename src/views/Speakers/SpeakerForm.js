import React, { Component } from 'react';
import {
    Input, InputGroup, InputGroupText, InputGroupAddon, Row, Col,
    Card, CardBody, Button, Label, FormGroup
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';

class SpeakerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            speaker: {
                id: '',
                firstName: '',
                lastName: '',
                email: '',
                contactNo: '',
                address: '',
                registrationType: '',
                briefInfo: '',
                info: '',
                profileImageURL: '',
                sessionId: '',
                linkedInURL: '',
                roleName: ''
            },
            submitted: false,
        }
        this.submitFunction = this.submitFunction.bind(this);
        this.changeFunction = this.changeFunction.bind(this);
        this.setInputToAlphabets = this.setInputToAlphabets.bind(this);
        this.setInputToNumeric = this.setInputToNumeric.bind(this);

    }

    changeFunction(event) {
        const { name, value } = event.target;
        const { speaker } = this.state;
        this.setState({
            speaker: {
                ...speaker,
                [name]: value
            }
        });
    }

    // Method for set only alphabets
    setInputToAlphabets(e) {
        const re = /[a-zA-Z]+/g;
        if (!re.test(e.key)) {
            e.preventDefault();
        }
    }

    // Method for set only Numeric
    setInputToNumeric(e) {
        const re = /[0-9]+/g;
        if (!re.test(e.key)) {
            e.preventDefault();
        }
    }


    submitFunction(event) {
        event.preventDefault();
        let compRef = this;
        this.setState({ submitted: true });
        const { speaker } = this.state;
        console.log("speaker", speaker);
    }

    render() {
        const { speaker, submitted } = this.state;

        if (this.state.updateflag) {
            this.headerText = "Attendee";
            this.buttons = <Button type="submit" size="md" color="success" onClick={this.updateFunction} ><i className="icon-note"></i> Update</Button>
        }
        else {
            this.headerText = "Registration";
            this.buttons = <Button type="submit" size="md" color="success" onClick={this.submitFunction} ><i className="icon-note"></i> Register</Button>
        }
        return (
            <div className="animated fadeIn">
                <Row className="justify-content-left">
                    <Col md="8">
                        <Card className="mx-6">
                            <CardBody className="p-4">
                                <h1>{this.headerText}</h1>
                                <FormGroup row>
                                    <Col xs="12" md="6" className={(submitted && !speaker.firstName ? ' has-error' : '')}  >
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-speaker"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" placeholder="First Name" name="firstName" onKeyPress={(e) => this.setInputToAlphabets(e)} value={this.state.speaker.firstName} onChange={this.changeFunction} required />
                                            {submitted && !speaker.firstName &&
                                                <div className="help-block" style={{ color: "red" }}>*Required</div>
                                            }
                                        </InputGroup>
                                    </Col>
                                    <Col md="6" className={(submitted && !speaker.lastName ? ' has-error' : '')} >
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="icon-user"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" placeholder="Last Name" name="lastName" onKeyPress={(e) => this.setInputToAlphabets(e)} value={this.state.speaker.lastName} onChange={this.changeFunction} required />
                                            {submitted && !speaker.lastName &&
                                                <div style={{ color: "red" }} className="help-block" >*Required</div>
                                            }
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col xs="12" md="6" className={(submitted && this.state.invalidEmail ? ' has-error' : '')}>
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>@</InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" disabled={this.state.updateflag} placeholder="Email" name="email" value={this.state.speaker.email} onChange={this.changeFunction} required />
                                            {submitted && this.state.invalidEmail &&
                                                <div style={{ color: "red" }} className="help-block">{this.state.emailError} </div>
                                            }
                                        </InputGroup>
                                    </Col>
                                    <Col md="6">
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText><i className="icon-phone"></i></InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" placeholder="Contact" maxLength={10} name="contactNo" onKeyPress={(e) => this.setInputToNumeric(e)} value={this.state.speaker.contactNo} onChange={this.changeFunction} required />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col xs="12" md="6">
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText><i className="fas fa-address-book"></i></InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" placeholder="Address" name="address" value={this.state.speaker.address} onChange={this.changeFunction} required />
                                        </InputGroup>
                                    </Col>
                                    <Col xs="12" md="6"  >
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText><i className="fa fa-image"></i></InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" placeholder="Image URL" name="profileImageURL" value={this.state.speaker.profileImageURL} onChange={this.changeFunction} required />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>

                                    <Col xs="12" md="6">
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText><i className="fa fa-linkedin"></i></InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" placeholder="LinkedIn URL" name="linkedInURL" value={this.state.speaker.linkedInURL} onChange={this.changeFunction} />
                                        </InputGroup>
                                    </Col>
                                    <Col xs="12" md="6">
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText><i className="fa fa-info"></i></InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="text" placeholder="Company Name" name="briefInfo" value={this.state.speaker.briefInfo} onChange={this.changeFunction} />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col xs="12" md="6">
                                        <InputGroup className="mb-3">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText><i className="fa fa-info"></i></InputGroupText>
                                            </InputGroupAddon>
                                            <Input type="textarea" placeholder="Info" name="info" value={this.state.speaker.info} onChange={this.changeFunction} required />
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col xs="12" md="12">
                                        {this.buttons}
                                        &nbsp;&nbsp;
                    <Button onClick={this.resetField} type="reset" size="md" color="danger" ><i className="fa fa-ban"></i> Reset</Button>
                                        <ToastContainer autoClose={2000} />
                                    </Col>
                                </FormGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default SpeakerForm;