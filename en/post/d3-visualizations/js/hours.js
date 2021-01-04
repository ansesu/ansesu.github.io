//Margin
const marginHours = { top: 10, right: 15, bottom: 10, left: 15 };

//Width and height
const widthHours = 600 - marginHours.left - marginHours.right;
const heightHours = 600 - marginHours.top - marginHours.bottom;
	  innerRadius = 100,
	  outerRadius = Math.min(widthHours, heightHours) / 2;

//Load in the data
d3.csv("data/hour_data.csv")
  .then(function(data) {
	///Parse data
    data.forEach(function(d) {
    	d.hour = parseInt(d.hour);
    	d.count = parseInt(d.count);
    });

    maxDateHours = d3.max(data, function(d) { return d.count; });

	var max_data = data.map(function(d) {
      	return {hour: d.hour, count: maxDateHours};	
    })	

	//Create scale functions
	xScaleHours = d3.scaleBand()
			         .range([0, 2 * Math.PI])
			         .align(0)                
			         .domain( data.map(function(d) { return d.hour; }) ); 
	yScaleHours = d3.scaleRadial()
					 .domain([
					 	 d3.min(data, function(d) { return d.count; }),
					 	 d3.max(data, function(d) { return d.count; })
					 ])
					 .range([innerRadius, outerRadius]);	

	//Create SVG element in chart id element
	const svgHours = d3.select('#hours')
					    .append('svg')
					      .attr("class", "content_hours")
					      .attr("viewBox", `0 0 ${widthHours + marginHours.left + marginHours.right} ${heightHours + marginHours.top + marginHours.bottom}`)
					      .attr("preserveAspectRatio", "xMidYMid meet")
					      .attr("width", "50%")
	var gHours = svgHours.append("g")
						  .attr("transform", "translate(" + 5.37 * widthHours / 10 + "," + ( 1.04*heightHours/2 )+ ")");

	// tooltip
	var tooltipCircularBarplot = d3.select("#hours").append("div")
	                                .attr("class", "tooltip-html")
	                                .style("opacity", 0);              

	// tooltip mouseover event handler
	var mouseoverHours = function(event, d) {
		d3.select(this)
		  .transition()
		   .duration(300) // ms				  
		   .attr("d", d3.arc()     // imagine your doing a part of a donut plot
		   .innerRadius(innerRadius)
		   .outerRadius(function(d) { return yScaleHours(d.count) + 10 ; })
		   .startAngle(function(d) { return xScaleHours(d.hour); })
		   .endAngle(function(d) { return xScaleHours(d.hour) + xScaleHours.bandwidth() ; })
		   .padAngle(0.01)
		   .padRadius(innerRadius));            	

		var html = "<b>" + d.hour + "h </b>" + formatValue(d.count) + " scrobbles";
		tooltipCircularBarplot.html(html)
		                      .style("left", (event.pageX) + "px")
		                      .style("top", (event.pageY) + "px")
		                      .transition()
		                       .duration(300) // ms
		                       .style("opacity", 1); // started as 0!
	};
	// tooltip mouseout event handler
	var mouseoutHours = function(d) {
		d3.select(this)
		  .transition()
		   .duration(300) // ms				  
		   .attr("opacity", ".8")
		   .attr("d", d3.arc()     // imagine your doing a part of a donut plot
		   .innerRadius(innerRadius)
		   .outerRadius(function(d) { return yScaleHours(d.count); })
		   .startAngle(function(d) { return xScaleHours(d.hour); })
		   .endAngle(function(d) { return xScaleHours(d.hour) + xScaleHours.bandwidth(); })
		   .padAngle(0.01)
		   .padRadius(innerRadius));   
		tooltipCircularBarplot.transition()
		                       .duration(300) // ms                       
		                       .style("opacity", 0); // don't care about position!;                       
	};

	// Add the labels and clock
	gHours.append("text")
		  .text("00")
		   .attr("transform", function(d) { return "translate(0,-70)"; })
		   .attr("text-anchor", "middle")
		   .attr("class", "text-clock")
	gHours.append("text")
		  .text("12")
		   .attr("transform", function(d) { return "translate(0,82)"; })
		   .attr("text-anchor", "middle")
		   .attr("class", "text-clock")
	gHours.append("text")
		  .text("06")
		   .attr("text-anchor", "middle")
		   .attr("vertical-align", "bottom")				  
		   .attr("transform", function(d) { return "translate(75,6)"; })
		   .attr("class", "text-clock")
	gHours.append("text")
		  .text("18")
		   .attr("transform", function(d) { return "translate(-75,6)"; })
		   .attr("text-anchor", "middle")
		   .attr("class", "text-clock")	
	var linesHours = gHours.selectAll("line")
							  .data(data)
							  .enter().append("line")
							   .attr("y2", -100)
							   .attr("y1", -95)
							   .style("stroke", "black")
							   .style("stroke-width",".5px")
							   .attr("transform", function(d, i) { return "rotate(" + (i * 360 / 24) + ")"; });

	gHours.append("circle")
           .attr("class", "clock")
           .attr("cx", 0)
           .attr("cy", 0)
           .attr("r", 45)
           .attr("fill", "none")

	gHours.append("circle")
           .attr("class", "clock")
           .attr("cx", 0)
           .attr("cy", 0)
           .attr("r", 1)
           .attr("fill", "#542788")				

	var tickData5 = [{x: 0, y: 0}, {x: 0, y: -35}];
	var tickLine5 = d3.line()
					  .x(function(tickData5) { return tickData5.x; })
					  .y(function(tickData5) { return tickData5.y; });
	gHours.append("path")
		  .datum(tickData5)
		   .attr("d", tickLine5)
		   .attr("class", "clock")

	var tickData6 = [{x: 0, y: 0}, {x: 15, y: 20}];
	var tickLine6 = d3.line()
					  .x(function(tickData6) { return tickData6.x; })
					  .y(function(tickData6) { return tickData6.y; });
	gHours.append("path")
	 	  .datum(tickData6)
	 	   .attr("d", tickLine6)
	 	   .attr("class", "clock")				    

	// Add bars
	gHours.append("g")
	      .selectAll("path")
	      .data(max_data)
	      .enter()
	      .append("path")
	       .attr("fill", "#bdbdbd")
	       .attr("d", d3.arc()   
	       .innerRadius(innerRadius)
	       .outerRadius(function(d) { return yScaleHours(d.count); })
	       .startAngle(function(d) { return xScaleHours(d.hour); })
	       .endAngle(function(d) { return xScaleHours(d.hour) + xScaleHours.bandwidth(); })
	       .padAngle(0.01)
	       .padRadius(innerRadius))
	       .style("opacity", .2);				
	barsHours = gHours.append("g")
					  .selectAll("path")
					  .data(data)
					  .enter()
					  .append("path")
					   .attr("fill", "#542788")
					   .attr("d", d3.arc()   
					   .innerRadius(innerRadius)
					   .outerRadius(function(d) { return yScaleHours(d.count); })
					   .startAngle(function(d) { return xScaleHours(d.hour); })
					   .endAngle(function(d) { return xScaleHours(d.hour) + xScaleHours.bandwidth(); })
					   .padAngle(0.01)
					   .padRadius(innerRadius))
					   .style("opacity", 1)
    barsHours.on("mouseover", mouseoverHours)
    	     .on("mouseout", mouseoutHours);
});