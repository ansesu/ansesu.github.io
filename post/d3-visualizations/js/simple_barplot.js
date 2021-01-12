//Margin
const marginBar = { top: 10, right: 10, bottom: 25, left: 56 };

//Width and height
const widthBar = 600 - marginBar.left - marginBar.right;
const heightBar = 300 - marginBar.top - marginBar.bottom;

//Load in the data
d3.csv("data/month_simple_data.csv")
  .then(function(data) {
	///Parse data
    data.forEach(function(d) {
    	d.month = d.month;
     	d.month_str_pt = d.month_str_pt;
     	d.month_str_en = d.month_str_en;
     	d.month_str_complete_pt = d.month_str_complete_pt;
     	d.month_str_complete_en = d.month_str_complete_en;
     	d.count = parseInt(d.count);
    });

	//Create scale functions
	xScaleBar = d3.scaleBand()
			   	   .range([ 0, widthBar ])
			   	   .domain(data.map(function(d) { return d.month_str_pt; }))
			   	   .padding(0.2); 
	yScaleBar = d3.scaleLinear()
				   .domain([
						0,
						d3.max(data, function(d) { return d.count; })
			       ])
				   .range([ heightBar, 0]);

	//Create SVG element in chart id element
	const svgBar = d3.select('#simplebarplot')
					 .append('svg')
					  .attr("class", "content")
					  .attr("viewBox", `0 0 ${widthBar + marginBar.left + marginBar.right} ${heightBar + marginBar.top + marginBar.bottom}`)
					  .attr("preserveAspectRatio", "xMidYMid meet")
	var gBar = svgBar.append("g")
	           		  .attr("transform", "translate(" + marginBar.left + "," + marginBar.top + ")");

	//Create axis
	var xAxisBar = d3.axisBottom(xScaleBar)
					  .tickSize(0);
	var yAxisBar = d3.axisLeft(yScaleBar)
				 	  .tickSize(3);

	gBar.append("g")
	     .attr("class", "xAxis")
	     .attr("transform", "translate(0," + heightBar + ")")
	     .call(xAxisBar)
	     .select(".domain")
	      .attr("stroke","#252525")
	      .attr("stroke-width","0");
	gBar.append("g")
	     .attr("class", "yAxis")
	     .attr("transform", "translate(0,0)")
	     .call(yAxisBar)

		//Create axis label
    gBar.append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .attr("y",-55)
        .attr("x",-heightBar/2)
        .attr("dy", ".71em")
        .text("Scrobbles");

	// tooltip
	var tooltipBarplot = d3.select("#simplebarplot").append("div")
	                        .attr("class", "tooltip-html")
	                        .style("opacity", 0);              

	// tooltip mouseover event handler
	var mouseoverBar = function(event, d) {
		d3.select(this)
		   .transition()
		   .duration(300) 		  
		   .attr("opacity", 1);

		var html = "<b>" + d.month_str_complete_pt + "</b><br/>" + 
				   formatValue(d.count) + " scrobbles";

		tooltipBarplot.html(html)
					   .style("left", (event.pageX) + "px")
					   .style("top", (event.pageY) + "px")
					   .transition()
					   .duration(300) // ms
					   .style("opacity", 1); // started as 0!
	};
	// tooltip mouseout event handler
	var mouseoutBar = function(d) {
		d3.select(this)
		  .transition()
		   .duration(300) // ms				  
		   .attr("opacity", ".8");

		tooltipBarplot.transition()
		               .duration(300) // ms                       
		               .style("opacity", 0); // don't care about position!;                       
	};

	// Add bars
	gBar.selectAll("bar")
		.data(data)
		.enter()
		.append("rect")
		 .attr("x", function(d) { return xScaleBar(d.month_str_pt); })
		 .attr("y", function(d) { return yScaleBar(d.count); })
		 .attr("width", xScaleBar.bandwidth())
		 .attr("height", function(d) { return heightBar - yScaleBar(d.count); })
		 .attr("fill", "#fa9fb5")
		 .attr("opacity", .8)
	     .on("mouseover", mouseoverBar)
	     .on("mouseout", mouseoutBar);
});
