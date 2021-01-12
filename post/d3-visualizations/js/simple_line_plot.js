//Margin
const marginLine = { top: 12, right: 5, bottom: 25, left: 68 };

//Width and height
const widthLine = 600 - marginLine.left - marginLine.right;
const heightLine = 300 - marginLine.top - marginLine.bottom;

//For converting data
var parseTimeLine = d3.timeParse("%d/%m/%Y");

//Load in the data			
d3.csv("data/confirmed_maringa_data.csv")
  .then(function(data) {	

	///Parse data and sort values by date
    data.forEach(function(d) {
    	d.Date = parseTimeLine(d.Date);
    	d.Confirmed = parseInt(d.Confirmed);
    });
    data.sort(function(a, b) {
        return a.Date - b.Date;
    });

	//Create scale functions
	xScaleLine = d3.scaleTime()
					.domain([
						d3.min(data, function(d) { return d.Date; }),
						d3.max(data, function(d) { return d.Date; })
					])
				   .range([0, widthLine]);
	yScaleLine = d3.scaleLinear()
					.domain([
						d3.min(data, function(d) { return d.Confirmed; }),
						d3.max(data, function(d) { return d.Confirmed; })
					])
					.range([heightLine, 0]);	

	//Create SVG element in chart id element
	const svgLine = d3.select('#lineplot')
		              .append('svg')
		               .attr("class", "content")
		               .attr("viewBox", `0 0 ${widthLine + marginLine.left + marginLine.right} ${heightLine + marginLine.top + marginLine.bottom}`)
		               .attr("preserveAspectRatio", "xMidYMid meet")

	var gLine = svgLine.append("g")
	            		.attr("transform", "translate(" + marginLine.left + "," + marginLine.top + ")");

	//Create axis
	var xAxisLine = d3.axisBottom(xScaleLine)
					  .ticks(7)
					  .tickFormat(formatAsMonth)
					  .tickSize(3);
	var yAxisLine = d3.axisLeft(yScaleLine)
					  .ticks(7)
					  .tickSize(3);

	gLine.append("g")
		  .attr("class", "xAxis")
		  .attr("transform", "translate(0," + heightLine + ")")
		  .call(xAxisLine)
		  .select(".domain")
		  .attr("stroke","#252525")
		  .attr("stroke-width","0");
	gLine.append("g")
		  .attr("class", "yAxis")
		  .attr("transform", "translate(0,0)")
		  .call(yAxisLine)

    //Create axis label
    gLine.append("text")
	      .attr("class", "axis-title")
	      .attr("transform", "rotate(-90)")
	      .style("text-anchor", "middle")
	      .attr("y",-67)
	      .attr("x",-heightLine/2)
	      .attr("dy", ".71em")
	      .text("Número de casos de COVID-19");
	gLine.append("text")
	      .attr("text-anchor", "end")
	      .attr("x", xScaleLine(d3.max(data, function(d) { return d.Date; }))-4)
	      .attr("y", yScaleLine(d3.max(data, function(d) { return d.Confirmed; })))
	      .attr("font-size", "15px")
	      .text(formatValue(d3.max(data, function(d) { return d.Confirmed; })))
	//Create line
	var lineLine = d3.line()
					 .x(function(d) { return xScaleLine(d.Date); })
					 .y(function(d) { return yScaleLine(d.Confirmed); });

	gLine.append("path")
		  .attr("class", "line")
		  .datum(data)
		  .attr("d", lineLine);

	//Create tooltip
    var focusLine = gLine.append("g")
                		  .attr("class", "focus");

    focusLine.append("path") 
          	  .attr("class", "hover-line")

    focusLine.append("text")
    	 	  .attr("class", "tooltip-confirmed")
    focusLine.append("text")
    	  	  .attr("class", "tooltip-date")

    focusLine.append("circle")
          	  .attr("r", 3)
          	  .attr("opacity", "0");

    svgLine.append("rect")
	    	.attr("class", "overlay")
	        .attr("transform", "translate(" + marginLine.left + "," + marginLine.top + ")")
	        .attr("width", widthLine)
	        .attr("height", heightLine)
	        .on("mouseover", function() {
	        	focusLine.style("display", null); 
	        })
	        .on("mouseout", function() { 			        	
	        	focusLine.style("display", "none"); 
	        })
	        .on("mousemove", event => mousemoveLine(event));

    function mousemoveLine(event) {
    	var x0 = xScaleLine.invert(d3.pointer(event)[0]),
            bisectDate = d3.bisector(function(d) { return d.Date; }).left,
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i];
	    if (d1 == null) {
	        d1 = data[i - 1];
	    }          
	    var dTrue = x0 - d0.Date > d1.Date - x0 ? d1 : d0; // if is true, d1, if is false d0
        xDate = dTrue.Date;
        d3.select("#lineplot .hover-line")
           .attr("d", function() {
           		var dVar = "M" + 0 + "," + (-yScaleLine(dTrue.Confirmed));
            	dVar += " " + 0 + "," + (heightLine - yScaleLine(dTrue.Confirmed));
            	return dVar;
           })
		focusLine.select(".tooltip-confirmed").text(function() { return formatValue(dTrue.Confirmed); });
		focusLine.select("#lineplot .tooltip-date").text(function() { return formatAsDate(xDate); });			        
		focusLine.attr("transform", "translate(" + xScaleLine(xDate) + "," + yScaleLine(dTrue.Confirmed) + ")");
	    focusLine.select("circle")
	          	  .attr("opacity", "1");
		if (dTrue.Confirmed > data[Math.round(data.length-data.length*.43)].Confirmed) {
			focusLine.select(".tooltip-confirmed")
			 	      .attr("y", heightLine*.96-yScaleLine(dTrue.Confirmed))
			 	      .attr("text-anchor", "end")
			 	      .attr("x", -5);
		    focusLine.select("#lineplot .tooltip-date")
			 	      .attr("y", heightLine*.91-yScaleLine(dTrue.Confirmed))
			 	      .attr("text-anchor", "end")
			 	      .attr("x", -5);
		} else {
			focusLine.select(".tooltip-confirmed")
					  .attr("y", heightLine*.61-yScaleLine(dTrue.Confirmed))
					  .attr("text-anchor", "start")
					  .attr("x", 5);
			focusLine.select("#lineplot .tooltip-date")
					  .attr("y", heightLine*.56-yScaleLine(dTrue.Confirmed))
					  .attr("text-anchor", "start")
					  .attr("x", 5);
        }
    }
});