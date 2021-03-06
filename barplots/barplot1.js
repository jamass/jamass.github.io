function barplot_humidity(data_url, div_id){
	var div_id = typeof div_id !== 'undefined' ?  div_id : "body";
        
	var margin = {top: 20, right: 20, bottom: 170, left: 40},
	    width = 600 - margin.left - margin.right,
	    height = 300 - margin.top - margin.bottom;

	// Parse the date / time
	var	parseDate = d3.time.format("%Y-%m-%d %X").parse;
	//see https://github.com/mbostock/d3/wiki/Time-Formatting

	var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

	var y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .tickFormat(d3.time.format("%Y-%m-%d %X"));

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10);


	var svg = d3.select(div_id).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform",
		  "translate(" + margin.left + "," + margin.top + ")");

	d3.json(data_url, function(error, data) {
	    entries = data.list;
	    entries.forEach(function (d) {
		d.date = parseDate(d.dt_txt);
		d.main.humidity = +d.main.humidity;
	    });

	    x.domain(entries.map(function (d) {
		return d.date;
	    }));
	    y.domain([0, 100]);
	    //d3.max(entries, function (d) {
	    //    return d.humidity;
	    //})]);
	    var tooltipdiv = d3.select(div_id).append("div")
	    .attr("class", "tooltip")
	    .style("opacity", 0);
	    svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis)
		    .selectAll("text")
		    .style("text-anchor", "end")
		    .attr("dx", "-.8em")
		    .attr("dy", "-.55em")
		    .attr("transform", "rotate(-90)");

	    svg.append("g")
		    .attr("class", "y axis")
		    .call(yAxis)
		    .append("text")
		    .attr("transform", "rotate(-90)")
		    .attr("y", 6)
		    .attr("dy", ".31em")
		    .style("text-anchor", "end")
		    .text("Humidity %");

	    svg.selectAll("bar")
		    .data(entries)
		    .enter().append("rect")
		    .style("fill", "#892200")
		    .attr("x", function (d) {
			return x(d.date);
		    })
		    .attr("width", x.rangeBand())
		    .attr("y", function (d) {
			console.log(d.main.humidity);
			return y(d.main.humidity);
		    })
		    .attr("height", function (d) {
			return height - y(d.main.humidity);
		    })
		    .on("mouseover", function(d) {
			tooltipdiv.transition()
				.duration(200)
				.style("opacity", .9);
			tooltipdiv.html(d.main.humidity +"% <br> humidity")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
		    })
		    .on("mouseout", function (d) {
			tooltipdiv.transition()
				.duration(100)
				.style("opacity", 0);
		    });

	});
}
