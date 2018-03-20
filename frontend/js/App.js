import React from 'react';
import { Form, FormGroup, FormControl, Alert, Tooltip, OverlayTrigger, Badge, ControlLabel, Glyphicon, Collapse, Well } from 'react-bootstrap/lib';
// import axios from 'axios';
import PlotBarGraph from './PlotBarGraph';
import moment from 'moment';
import axios from 'axios';
import Button from 'react-bootstrap-button-loader';

class App extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = this.getInitialState();
	}

	getInitialState() {
		return {
			date: "",
			prev: "",
			valid: true,
			internalApiData: [],
			externalApiData: [],
			loading: false
		};
	}

	handleSubmit(e) {
		e.preventDefault();
		if(e.target && e.target.parentNode.getElementsByClassName('datepicker').length) {
			this.state.date = e.target.parentNode.getElementsByClassName('datepicker')[0].value;
		}
		if(this.state.date == this.state.prev || this.state.date == "") {
			return;
		}
		var momentObj = moment(new Date(this.state.date));
		if(momentObj.isValid()) {
			this.setState({'loading': true});
			momentObj = momentObj.utc();
			var requests = [];
			requests.push(axios.get('weather/forecast/'+momentObj.format('YYYYMMDD')));
			
			var m = momentObj.clone();
			var end = m.clone();
			var endDate = end.add(4, 'days').format('YYYY-MM-DD');
			while(m.isBefore(endDate)) {
				m.add(1, 'days');
				requests.push(axios.get("https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/e06ecf626dbfee6f9b701fd3524b2960/39.1031,-84.5120,"+m.unix()+"?exclude=currently,flags,hourly"));
			}


			var output = [];
			axios.all(requests)
			.then(responses => {
				for(var count in responses){
					if(count==0){
						this.state.internalApiData = responses[count].data;
					} else {
						var inter = responses[count]['data']['daily']['data'][0];
						var result = {'DATE': moment.unix(inter['temperatureHighTime']).format('YYYYMMDD'), 'TMAX': inter['temperatureHigh'], 'TMIN': inter['temperatureLow']};
						output.push(result);
					}
				}
				this.state.externalApiData = output;
				this.state.prev = this.state.date;
				this.setState({'valid': true, 'loading': false});
			})
		} else {
			this.setState({'valid': false, 'loading': false});
		}
	}

	render(){

		var DatePicker = require("react-bootstrap-date-picker");
		return (
			<div className="App">
				<div className="App-header">
					<h2>Weather-D3</h2>
				</div>
				<div className="App-content">
					<Form inline className="flex-container" onSubmit={e => this.handleSubmit(e)}>
						<FormGroup validationState={this.state.valid ? null : "error"} className="flex-item">
							<DatePicker className="datepicker" showTodayButton dateFormat="YYYY-MM-DD" value={this.state.date} onFocus={e => this.setState({'valid': true})} onClear={e => this.setState({'valid': true, 'date': ""})} placeholder="YYYY-MM-DD" />
							<Collapse in={!this.state.valid} className="collapse-error">
								<Well>
									Invalid Date
								</Well>
							</Collapse>
						</FormGroup>
    					<FormGroup className="flex-item">
							<Button loading={this.state.loading} spinColor="black" type="submit" value="Submit">Forecast</Button>
						</FormGroup>
					</Form>
					<div>
						<PlotBarGraph data={ JSON.stringify(this.state.internalApiData) } title={ "Santosh Weather API" } />
						<PlotBarGraph data={ JSON.stringify(this.state.externalApiData) } title={ "Dark Sky Weather API"} />
					</div>
				</div>
			</div>
		);


	}
}

export default App;
