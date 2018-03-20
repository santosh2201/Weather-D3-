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
		if (this.props.input == "") {
			return (<div>No input</div>);
		}

		var BarGroupTooltip = require('react-d3-tooltip').BarGroupTooltip;
		var width = 700, height = 400;
	    var chartSeries = [{field: 'TMAX', name: 'TMAX'}, {field: 'TMIN', name: 'TMIN'}];
	    var x = function(d) {
	    	return d.DATE;
	    };
	    var xScale = 'ordinal';
	    var xLabel = "Date";
	    var yLabel = "Temperature";
	    var yLabelPosition = "right";
	    var yTickFormat = d3.format(".2s");



		var requests = [];
		var m = moment(new Date(this.props.input)).utc();
		var end = m.clone();
		var endDate = end.add(5, 'days').format('YYYY-MM-DD');
		while(m.isSameOrBefore(endDate)) {
			requests.push(axios.get("https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/fb43e07ca09206d21b11b7806279ca2b/39.1031,-84.5120,"+m.unix()+"?exclude=currently,flags,hourly"));
			m.add(1, 'days');
		}
		var output = [];
		axios.all(requests)
		.then(responses => {
			for(var response of responses){
				var inter = response['data']['daily']['data'][0];
				var result = {'DATE': moment.unix(inter['temperatureHighTime']).format('YYYY-MM-DD'), 'TMAX': inter['temperatureHigh'], 'TMIN': inter['temperatureLow']};
				output.push(result);
			}
			return (
				<div>
					<BarGroupTooltip
						title= 'DarkSky Forecast API'
						data= {output}
						width= {width}
						height= {height}
						chartSeries = {chartSeries}
						x = {x}
						xScale= {xScale}
						yTickFormat= {yTickFormat} />
				</div>
			);
		})
		.catch(response => {
			//this.setState({ data: {'status': 'fail', 'result': 'Request failed' } });
		})
	}
}

export default ExternalApi;