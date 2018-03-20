import React from 'react';
import { Button, Form, FormGroup, FormControl, Alert, Tooltip, OverlayTrigger, Badge, ControlLabel, Glyphicon, Collapse, Well } from 'react-bootstrap/lib';
// import axios from 'axios';
import InternalApi from './InternalApi';
import ExternalApi from './ExternalApi'
import moment from 'moment';
import axios from 'axios';

class App extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = this.getInitialState();
	}

	getInitialState() {
		return {
			date: "",
			previousDate: null,
			minDate: null,
			maxDate: null,
			focused: false,
			valid: true,
			internalApiData: [],
			externalApiData: []
		};
	}

	handleSubmit(e) {
		e.preventDefault();
		this.state.date = "";
		if(e.target && e.target.parentNode.getElementsByClassName('datepicker').length) {
			this.state.date = e.target.parentNode.getElementsByClassName('datepicker')[0].value;
		}
		var momentObj = moment(new Date(this.state.date));
		if(momentObj.isValid()) {
			var url = 'weather/forecast/'+momentObj.utc().format('YYYYMMDD');
			axios({
				url: url,
				timeout: 20000,
				method: 'get',
				responseType: 'json'
			})
			.then(response => {
				this.setState({ internalApiData: response.data });
			})
			.catch(response => {
				//this.setState({ data: {'status': 'fail', 'result': 'Request failed' } });
			})
		} else {
			this.setState({ 'valid': false});
		}
	}

	// handleClick(e) {
	// 	e.preventDefault();
	// 	if((this.state.x == parseInt(this.state.x, 10)) && (this.state.y == parseInt(this.state.y, 10))) {
	// 		this.state.x = parseInt(this.state.x);
	// 		this.state.y = parseInt(this.state.y);
	// 		var url = 'calculate/?x='+this.state.x+'&y='+this.state.y+'&o='+this.state.o;
	// 		axios({
	// 			url: url,
	// 			timeout: 20000,
	// 			method: 'get',
	// 			responseType: 'json'
	// 		})
	// 		.then(response => {
	// 			this.setState({ data: response.data });
	// 		})
	// 		.catch(response => {
	// 			this.setState({ data: {'status': 'fail', 'result': 'Request failed' } });
	// 		})
	// 	} else {
	// 		this.setState({ data: {'status': 'fail', 'result': 'Please enter Integer input !!!' } });
	// 	}
	// }

	render(){
		// const tooltip = (
		// 	<Tooltip id="tooltip">
		// 		<strong>Click!</strong> to use output for next calculation.
		// 	</Tooltip>
		// );
		// const success = this.state.data && this.state.data.status && this.state.data.status != 'fail';
		// let outputBox = null;
		// if (this.state.data) {
		// 	const success = this.state.data.status && this.state.data.status != 'fail';
		// 	if (!success) {
		// 		outputBox = <Alert bsStyle="danger">
		// 			<strong>Error!</strong> {this.state.data.result}
		// 		</Alert>; 
		// 	} else {
		// 		outputBox = <div className="wellStyles">
		// 			<OverlayTrigger placement="left" overlay={tooltip}>
		// 				<Button bsStyle="success" id="output" bsSize="large" block onClick={e => this.setState({ x: this.state.data.result, y: 0, data: null})}> { this.state.data.result } </Button>
		// 			</OverlayTrigger>
		// 		</div>;
		// 	}
		// }

		// return (
		// 	<div className="App">
		// 		<div className="App-header">
		// 			<h2>Simple Integer Calculator</h2>
		// 		</div>
		// 		<div className="App-content">
		// 			<Alert bsStyle="warning">
		// 				<strong>Prototype!</strong> For bugs or hugs contact <strong><a target="_blank" href="mailto:nanchasr@mail.uc.edu"> Santosh </a></strong>
		// 			</Alert>
		// 			<div className="form-container">
		// 				<Form inline onSubmit={e => this.handleClick(e)}>
		// 					<FormGroup controlId="first">
		// 						<FormControl type="number" placeholder="Enter Integer Input" value={this.state.x} onChange={e => this.setState({ x: e.target.value })} />
		// 					</FormGroup>{' '}
		// 					<FormGroup controlId="operator">
		// 						<FormControl componentClass="select" placeholder="Select Operator" value={this.state.o} onChange={e => this.setState({ o: e.target.value })} >
		// 							<option value="add"> + </option>
		// 							<option value="sub"> - </option>
		// 							<option value="mul"> * </option>
		// 							<option value="div"> / </option>
		// 							<option value="rem"> % </option>
		// 						</FormControl>
		// 					</FormGroup>{' '}
		// 					<FormGroup controlId="second">
		// 						<FormControl type="number" placeholder="Enter Integer Input" value={this.state.y} onChange={e => this.setState({ y: e.target.value })} />
		// 					</FormGroup>{' '}
		// 					<FormGroup>
		// 						<Button type="submit" value="Submit" >Calculate</Button>
		// 					</FormGroup>
		// 				</Form>
		// 			</div>
		// 		</div>
		// 		{ outputBox }
		// 	</div>
		// );

		var DatePicker = require("react-bootstrap-date-picker");
		return (
			<div className="App">
				<div className="App-header">
					<h2>Weather-D3</h2>
				</div>
				<div className="App-content">
					<Form inline className="flex-container" onSubmit={e => this.handleSubmit(e)}>
						<FormGroup validationState={this.state.valid ? null : "error"} className="flex-item">
							<DatePicker className="datepicker" showTodayButton dateFormat="YYYY-MM-DD" value={this.state.date} onFocus={e => this.setState({'valid': true})} onClear={e => this.setState({'date': "", 'internalApiData': [], 'valid': true})} placeholder="YYYY-MM-DD" />
							<Collapse in={!this.state.valid} className="collapse-error">
								<Well>
									Invalid Date
								</Well>
							</Collapse>
						</FormGroup>
    					<FormGroup className="flex-item">
							<Button type="submit" value="Submit">Forecast</Button>
						</FormGroup>
					</Form>
					<InternalApi data={ JSON.stringify(this.state.internalApiData) } />
					<ExternalApi input={ this.state.date } />
				</div>
			</div>
		);


	}
}

export default App;
