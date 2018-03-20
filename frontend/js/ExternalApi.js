import React from 'react';
//import DarkSkyApi from 'dark-sky-api';
import moment from 'moment';
import axios from 'axios';

class ExternalApi extends React.Component {
	constructor(props, context) {
		super(props, context);
		//DarkSkyApi.apiKey = 'e06ecf626dbfee6f9b701fd3524b2960';
		this.state = {'data': []};
	}

	render(){
		var BarGroupTooltip = require('react-d3-tooltip').BarGroupTooltip;
		if (this.props.input == "") {
			return (<div>null</div>);
		}

		var url = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/fb43e07ca09206d21b11b7806279ca2b/39.1031,-84.5120,"+moment(this.props.input, 'YYYY-MM-DD').format('x')+"?exclude=currently,flags,hourly";
		axios({
			url: url,
			timeout: 20000,
			method: 'get',
			responseType: 'json'
		})
		.then(response => {
			return (
				<div>
					Output
				</div>
			);
		})
		.catch(response => {
			//this.setState({ data: {'status': 'fail', 'result': 'Request failed' } });
		})
	}
}

export default ExternalApi;