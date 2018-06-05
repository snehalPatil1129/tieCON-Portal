import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Row, Col, Card, CardBody, CardHeader,
    CardFooter, FormGroup, Button, Label
} from 'reactstrap';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import moment from "moment";
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { DBUtil } from '../../services';
import QRCode from 'qrcode';


class SpeakerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            speakerData: [],
            speakerCount: 0
        }
    }

    // Method for get all Speakers data 
    componentWillMount() {
        let componentRef = this;
         let speakerData = [];
     
        DBUtil.getDocRef("Speakers")
            .get().then((snapshot) => {
                snapshot.forEach(function (doc) {
                    let speakerObj = doc.data();
                    speakerData.push({
                        id: doc.id,
                        name: speakerObj.firstName + ' ' + speakerObj.lastName,
                        email: speakerObj.email,
                        password: speakerObj.password != undefined ? speakerObj.password : '',
                        contactNo: speakerObj.contactNo,
                        timestamp: speakerObj.timestamp != undefined ? moment(speakerObj.timestamp).format('DD-MMM HH:SS') : '',
                        speakerLabel: speakerObj.speakerLabel,
                        speakerCount: speakerObj.speakerCount,
                        speakerCode: speakerObj.speakerLabel != undefined && speakerObj.speakerCount != undefined ? speakerObj.speakerLabel + "-" + speakerObj.speakerCount : '',
                        briefInfo: speakerObj.briefInfo,
                    });
                });
                this.setState({ speakerData: speakerData, speakerCount: speakerData.length });
            });
    }

    // Method for printing ID card
    openWin(speaker) {
        let briefInfo;
        let CompanyName = '';
        let speakerLabel = '';
        let speakerCount = '';
        let speakerCode = ''
        if (speaker.speakerLabel)
            speakerLabel = speaker.speakerLabel;
        if (speaker.speakerCount)
            speakerCount = speaker.speakerCount;
        speakerCode = speakerLabel + "-" + speakerCount;
        if (speaker.briefInfo != undefined) {
            briefInfo = speaker.briefInfo;
            CompanyName = briefInfo.split('\n')[0];
        }
        else {
            CompanyName = '';
        }

        var newWindow = window.open('', '', 'width=1000,height=1000');
        setTimeout(() => newWindow.document.title = '' + speakerCode + '', 0);
        newWindow.document.writeln("<html>");
        newWindow.document.writeln("<body>");
        newWindow.document.write("<div style='width:4in;height:5in;text-align:center;margin-left:0;margin-top:0;'>")
        newWindow.document.write("<div style='height:100%;'>")
        //layer1
        newWindow.document.write("<div style='height:29%;'> </div>")
        //layer2
        newWindow.document.write("<div style='margin-top:30px;padding: 0 30px;max-height:150px;height:150px;margin-left:-15px;'><h1 style='font-size: 2.2rem;font-family:'Arial';padding: 10px 0 0 0;margin-top:40px;margin-bottom:-10px;'>" + speaker.name + "</h1>")
        newWindow.document.write("<p style='margin-top:-16px;font-size: 1.5rem;font-family:'Avenir-Book';'>" + CompanyName + "</p>")
        //newWindow.document.write("<p style='margin-top:-16px;font-size: 1.5rem;font-family:'Avenir-Book';'>MarketAxis Consulting</p>")
        newWindow.document.write("</div>")
        //layer2a
        newWindow.document.write("<div style='text-align: left;padding: 30px 30px;padding-bottom:0;margin-top:-20px;position:fixed;'>")
        newWindow.document.write("<img style='width:90px;height:90px;margin-left:-14px;margin-bottom:-4px;' src='" + this.state.Qrurl + "'/>")
        newWindow.document.write("<div style='text-align:left;font-weight:bold;font-size:13px;font-family:'Arial';margin-top:-4px;padding: 0 0px;padding-right:0px;padding-left:50px;'>" + speakerCode + "</div> <br/>")
        newWindow.document.write("</div>")
        //layer3
        newWindow.document.write("<div style='border-left:1px solid #666;border-right:1px solid #666;'>")
        newWindow.document.write("</div>")
        newWindow.document.write("</div>")
        newWindow.document.write("</div>")
        newWindow.document.writeln("</body></html>");
        newWindow.document.close();

        setTimeout(function () {
            newWindow.print();
            newWindow.close();
        }, 500);
    }

    // Method for generate QR code
    onGenerateQRcode(speaker) {
        let generatedQR;
        let compRef = this;
        let id = speaker.id;
        let speakerName = speaker.name;
        let Label = speaker.speakerLabel
        let Count = speaker.speakerCount;
        let speakerCode = Label + "-" + Count;
        QRCode.toDataURL("TIE" + ":" + speakerCode + ":" + id + ":" + speakerName)
            .then(url => {
                generatedQR = url;
                compRef.setState({ Qrurl: url })
                setTimeout(() => {
                    compRef.openWin(speaker);
                }, 250);
            })
    }

    // Method for edit attendee (Screen redirect from attendee to registration module)
    onEditAttendee(cell, row) {
        let componentRef = this;
        return <Link to={`${componentRef.props.match.url}/SpeakerForm/${row.id}`}>
            <i className="fa fa-pencil"></i>
        </Link>
    }

    // Method for print individual QR code
    onPrintAttendeeQRCode(cell, row) {
        let componentRef = this;
        return <Link to={this} onClick={() => componentRef.onGenerateQRcode(row)}>
            <i className="fa fa-print"></i>
        </Link>
    }

    // Method for get selected row keys for print all QR Code
    getSelectedRowKeys() {
        //alert("We got Selected Row Keys");
    }


    render() {
        // Define constant for sorting
        const options = {
            defaultSortName: 'speakerCode',
            defaultSortOrder: 'asc',
            sizePerPageList: [{
                text: '250', value: 250
            }, {
                text: '500', value: 500
            }, {
                text: '1000', value: 1000
            }, {
                text: 'All', value: this.state.speakerData.length
            }], // you can change the dropdown list for size per page
            sizePerPage: 250,  // which size per page you want to locate as default
        };
        // Define constant for checkbox      
        const selectRowProp = {
            mode: 'checkbox'
        };

        return (
            <div>
                <div className="animated fadeIn">
                    <Row>
                        <Col xs="12" lg="12">
                            <Card>
                                <CardHeader>
                                    <FormGroup row className="marginBottomZero">
                                        <Col xs="12" md="9">
                                            <h1 className="regHeading paddingTop8">Speaker List</h1>
                                        </Col>
                                    </FormGroup>
                                </CardHeader>
                                <CardBody>
                                    <div>
                                        <Link to={`${this.props.match.url}/SpeakerForm`}>
                                            <Button type="button" color="primary">
                                                <i className="fa fa-plus"></i>
                                                Add Speaker
                                            </Button>
                                        </Link> &nbsp;&nbsp;
                                        <Button type="button" onClick={this.getSelectedRowKeys.bind(this)} color="success">
                                            <i className="fa fa-print"></i>
                                            Print QR Code For All
                                        </Button> &nbsp;&nbsp;
                                        <Label>Count : </Label> {this.state.speakerCount}
                                        <br /><br />
                                        <BootstrapTable ref='table' data={this.state.speakerData} pagination={true} search={true}
                                            selectRow={selectRowProp} options={options} exportCSV={true} >
                                            <TableHeaderColumn dataField='id' headerAlign='left' isKey hidden>Id</TableHeaderColumn>
                                            <TableHeaderColumn dataField='speakerCode' headerAlign='left' width='100' dataSort csvHeader='Code'>Code</TableHeaderColumn>
                                            <TableHeaderColumn dataField='password' headerAlign='left' width='120' dataSort csvHeader='Password'>Password</TableHeaderColumn>
                                            <TableHeaderColumn dataField='name' headerAlign='left' width='160' dataSort csvHeader='Name'>Name</TableHeaderColumn>
                                            <TableHeaderColumn dataField='email' headerAlign='left' width='160' csvHeader='Email'>Email</TableHeaderColumn>
                                            <TableHeaderColumn dataField='edit' dataFormat={this.onEditAttendee.bind(this)} headerAlign='left' width='30' export={false}></TableHeaderColumn>
                                            <TableHeaderColumn dataField='print' dataFormat={this.onPrintAttendeeQRCode.bind(this)} headerAlign='left' width='30' export={false}></TableHeaderColumn>
                                        </BootstrapTable>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
export default SpeakerList;