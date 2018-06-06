import React, { Component } from 'react';
import {
    Input, InputGroup, InputGroupText, InputGroupAddon, Row, Col,
    Card, CardBody, Button, Label, FormGroup
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { DBUtil } from '../../services';

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
            invalidEmail: false,
            invalidContact: false,
            emailError: '',
            contactError: '',
            speakerCount: '',
            speCount: '',
            speakerCountId: ''
        }
        this.submitFunction = this.submitFunction.bind(this);
        this.changeFunction = this.changeFunction.bind(this);
        this.setInputToAlphabets = this.setInputToAlphabets.bind(this);
        this.setInputToNumeric = this.setInputToNumeric.bind(this);
        this.onHandleValidations = this.onHandleValidations.bind(this);
        this.resetField = this.resetField.bind(this);
        this.checkPreviuosCount = this.checkPreviuosCount.bind(this);
        this.createSpeaker = this.createSpeaker.bind(this);
        this.updateCount = this.updateCount.bind(this);
        this.updateFunction = this.updateFunction.bind(this);
    }

    componentWillMount() {
        let thisRef = this;
        if (this.props.match.params.id != undefined) {
            this.setState({ updateflag: true })
            var docRef = DBUtil.getDocRef("Speakers").doc(this.props.match.params.id);
            docRef.get().then(function (doc) {
                if (doc.exists) {
                    let speakerData = doc.data();
                    thisRef.setState({
                        speaker: {
                            id: doc.id,
                            firstName: speakerData.firstName,
                            lastName: speakerData.lastName,
                            email: speakerData.email,
                            contactNo: speakerData.contactNo,
                            address: speakerData.address,
                            briefInfo: speakerData.briefInfo,
                            info: speakerData.info,
                            profileImageURL: speakerData.profileImageURL,
                            linkedInURL: speakerData.linkedInURL
                        },
                    });
                }
            })
        }
    }

    changeFunction(event) {
        const { name, value } = event.target;
        const { speaker } = this.state;
        this.state.invalidContact = false;
        this.state.invalidEmail = false;
        this.setState({
            speaker: {
                ...speaker,
                [name]: value
            }
        });
    }

    updateFunction() {
        let compRef = this;
        this.setState({ submitted: true });
        const { speaker } = this.state;

        compRef.onHandleValidations(speaker);

        if (speaker.firstName && speaker.lastName && !this.state.invalidEmail && !this.state.invalidProfile) {
            let tblSpeaker = "Speakers";
            DBUtil.getDocRef(tblSpeaker).doc(speaker.id).update({
                "firstName": speaker.firstName,
                "lastName": speaker.lastName,
                "email": speaker.email,
                "contactNo": speaker.contactNo,
                "address": speaker.address,
                "timestamp": new Date(),
                "registrationType": 'On Spot Registration',
                "briefInfo": speaker.briefInfo,
                "info": speaker.info,
                "profileImageURL": speaker.profileImageURL,
                "linkedInURL": speaker.linkedInURL,
                "fullName": speaker.firstName + ' ' + speaker.lastName,
                "displayName": speaker.firstName + " " + speaker.lastName
            }).then(function () {
                toast.success("speaker updated successfully.", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                setTimeout(() => {
                    compRef.props.history.push('/speakerList');
                }, 2000);
            });
        }
    }

    resetField(resetFlag) {
        this.setState({
            speaker: {
                firstName: '',
                lastName: '',
                email: '',
                contactNo: '',
                address: '',
                briefInfo: '',
                info: '',
                profileImageURL: '',
                linkedInURL: ''
            },
            invalidEmail: false,
            submitted: false
        });
    }

    onHandleValidations(speaker) {
        if (speaker.email == "") {
            speaker.email = null;
        }
        if (speaker.contactNo == "") {
            speaker.contactNo = null;
        }
        if (speaker.email != null) {
            let lastAtPos = speaker.email.lastIndexOf('@');
            let lastDotPos = speaker.email.lastIndexOf('.');
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && speaker.email.indexOf('@@') == -1 && lastDotPos > 2 && (speaker.email.length - lastDotPos) > 2)) {
                this.state.invalidEmail = true;
                this.setState({ emailError: "*Invalid Email" });
            }
            else {
                this.state.invalidEmail = false;
                this.setState({ emailError: " " });
            }
        }
        else if (speaker.email == null || speaker.email != " ") {
            this.state.invalidEmail = true;
            this.setState({ emailError: "*Required" });
        }

        if (speaker.contactNo != null && (speaker.contactNo.length < 10 || speaker.contactNo.length > 10)) {
            this.state.invalidContact = true;
            this.setState({ contactError: "*Invalid Contact No" });
        }
        else if (speaker.contactNo == null || speaker.contactNo == "") {
            this.state.invalidContact = true;
            this.setState({ contactError: "*Required " });
        }
        else {
            this.state.invalidContact = false;
            this.setState({ contactError: " " });
        }
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
        compRef.onHandleValidations(speaker);
        compRef.checkPreviuosCount();
    }

    //Method for speaker creation
    createSpeaker() {
        let speakerCount = this.state.speakerCount;
        let speCount = this.state.speCount;
        const { speaker } = this.state;
        let compRef = this;
        let speakerLabel = "SPE";
        let roleName = "Speaker";
        let speakerCountId = this.state.speakerCountId;
        let speakerCode = speakerLabel + "-" + speakerCount;
        if (speaker.firstName && speaker.lastName && !this.state.invalidEmail && !this.state.invalidProfile) {

            let tblspeaker = "speaker";
        
            let speakerCountString = speCount.toString();

            let doc = {
                firstName: speaker.firstName,
                lastName: speaker.lastName,
                email: speaker.email,
                address: speaker.address,
                contactNo: speaker.contactNo,
                roleName: roleName,
                displayName: speaker.firstName + " " + speaker.lastName,
                fullName: speaker.firstName + " " + speaker.lastName,
                timestamp: new Date(),
                briefInfo: speaker.briefInfo,
                info: speaker.info,
                speakerCount: speakerCountString,
                speakerLabel: speakerLabel,
                attendanceId: '',
                sessionId: '',
                linkedInURL: speaker.linkedInURL,
                profileImageURL: speaker.profileImageURL
            }

            DBUtil.addObj("Speakers", doc, function (response) {
                compRef.updateCount(speakerCountId, speCount);
                toast.success("Speaker Registered Successfully", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                compRef.resetField();
            }, function (err) {
                toast.error("Registration failed", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            });
        }
    }

    updateCount(speakerCountId, speCount) {
        DBUtil.getDocRef("AttendeeCount").doc(speakerCountId).update({
            "speCount": speCount
        }).then(function () {
            //console.log("updated successfully");
        })
    }

    //Method to check previous count of speaker
    checkPreviuosCount() {
        let compRef = this;
        let nextCount;
        var docRef = DBUtil.getDocRef("AttendeeCount");
        docRef.get().then(function (snapshot) {

            let speCount;
            let speakerCountId;
            snapshot.forEach(function (doc) {
                speakerCountId = doc.id;
                speCount = doc.data().speCount;
            });

            nextCount = speCount + 1;
            speCount = nextCount;

            compRef.setState({
                speakerCount: nextCount,
                speCount: speCount,
                speakerCountId: speakerCountId
            });
            compRef.createSpeaker();
        })
    }

    render() {
        const { speaker, submitted } = this.state;

        if (this.state.updateflag) {
            this.headerText = "Speaker";
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
                                            <Input type="text" placeholder="Email" name="email" value={this.state.speaker.email} onChange={this.changeFunction} required />
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