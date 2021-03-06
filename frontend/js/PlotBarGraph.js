import React from 'react';
import moment from 'moment';

class PlotBarGraph extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render(){
		var BarGroupTooltip = require('react-d3-tooltip').BarGroupTooltip;
		var data = JSON.parse(this.props.data);
		var width = 700, height = 400;
	    var chartSeries = [{field: 'TMAX', name: 'TMAX', color: '#208FED'}, {field: 'TMIN', name: 'TMIN', color: '#AC5BCB'}];
	    var x = function(d) {
	    	return moment(d.DATE, 'YYYYMMDD').format('YYYY-MM-DD');
	    };
	    var xScale = 'ordinal';
	    var xLabel = "Date";
	    var yLabel = "Temperature";
	    var yLabelPosition = "right";
	    var yTickFormat = d3.format(".1s");
	    var dataAvailable = data.length;
		return (
			<div>
			{ dataAvailable ? (<div><div className="plotName">{this.props.title}</div>
			<div className="plotGraph">
				<BarGroupTooltip
					title= 'Santosh Forecast API'
					data= {data}
					width= {width}
					height= {height}
					chartSeries = {chartSeries}
					x = {x}
					xScale= {xScale}
					yTickFormat= {yTickFormat} />
			</div></div>) : null}
		</div>);
	}
}

export default PlotBarGraph;