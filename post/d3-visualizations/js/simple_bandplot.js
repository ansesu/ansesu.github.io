//Margin
const marginBand = { top: 10, right: 15, bottom: 45, left: 69 };

//Width and height
const widthBand = 600 - marginBand.left - marginBand.right;
const heightBand = 400 - marginBand.top - marginBand.bottom;

//Load in the data
d3.csv("data/simple_bandplot_data.csv")
  .then(function(data) {	
	///Parse data
    data.forEach(function(d) {
    	d.x = parseFloat(d.x);
    	d.y = parseFloat(d.y);
    	d.y0 = parseFloat(d.y0);
    	d.y1 = parseFloat(d.y1);			      			      
    });

    //Get median of x
    medianBand = d3.median(data, function(d) { return d.x; })

	//Create scale functions
	xScaleBand = d3.scaleLinear()
				    .domain([
				    	d3.min(data, function(d) { return d.x; }),
				    	d3.max(data, function(d) { return d.x; })
				    ])
			    	.range([0, widthBand]);
	yScaleBand = d3.scaleLinear()
				    .domain([
				    	d3.min(data, function(d) { return d.y0; }),
				    	d3.max(data, function(d) { return d.y1; })
				    ])
				    .range([heightBand, 0]);	

	//Create SVG element in chart id element
	const svgBand = d3.select('#bandplot')
		              .append('svg')
		               .attr("class", "content")
		               .attr("viewBox", `0 0 ${widthBand + marginBand.left + marginBand.right} ${heightBand + marginBand.top + marginBand.bottom}`)
		               .attr("preserveAspectRatio", "xMidYMid meet")
	var gBand = svgBand.append("g")
	          			.attr("transform", "translate(" + marginBand.left + "," + marginBand.top + ")");

    // Create confidence interval
    gBand.append("path")
	     .attr("class", "ci")
	     .datum(data)
	      .attr("stroke", "none")
	      .attr("d", d3.area()
	      	.x(function(d) { return xScaleBand(d.x) })
	      	.y0(function(d) { return yScaleBand(d.y0) })
	      	.y1(function(d) { return yScaleBand(d.y1) })
      )

	//Create line
	var lineBand = d3.line()
					 .x(function(d) { return xScaleBand(d.x); })
					 .y(function(d) { return yScaleBand(d.y); });

	gBand.append("path")
		  .attr("class", "line")
		  .datum(data)
		  .attr("d", lineBand);

	//Create axis
	var xAxisBand = d3.axisBottom(xScaleBand)
					  .ticks(7)
					  .tickSize(3);
	var yAxisBand = d3.axisLeft(yScaleBand)
					  .ticks(7)
					  .tickSize(3);

	gBand.append("g")
		  .attr("class", "xAxisBand")
		  .attr("transform", "translate(0," + heightBand + ")")
		  .call(xAxisBand)
	gBand.append("g")
		  .attr("class", "yAxis")
		  .attr("transform", "translate(0,0)")
		  .call(yAxisBand)

    //Create axis label
    gBand.append("text")
	      .attr("class", "axis-title")
	      .attr("transform", "rotate(-90)")
	      .style("text-anchor", "middle")
	      .attr("y",-67)
	      .attr("x",-heightBand/2)
	      .attr("dy", ".71em")
	      .text("Variável dependente, y");

    gBand.append("text")
	      .attr("class", "axis-title")
	      .style("text-anchor", "middle")
	      .attr("y", heightBand+25)
	      .attr("x", widthBand/2)
	      .attr("dy", ".71em")
	      .text("Variável independente, x");

	//Create tooltip
    var focusBand = gBand.append("g")
              		     .attr("class", "focus");

    focusBand.append("path") 
          	 .attr("class", "hover-line")

    focusBand.append("text")
    	  	 .attr("class", "tooltip-y")
    focusBand.append("text")
    		 .attr("class", "tooltip-x")

    focusBand.append("circle")
        	 .attr("r", 3)
        	 .attr("opacity", "0");

    svgBand.append("rect")
	    	.attr("class", "overlay")
	        .attr("transform", "translate(" + marginBand.left + "," + marginBand.top + ")")
	        .attr("width", widthBand)
	        .attr("height", heightBand)
	        .on("mouseover", function() {
	        	focusBand.style("display", null); 
	        })
	        .on("mouseout", function() { 			        	
	        	focusBand.style("display", "none"); 
	        })
	        .on("mousemove", event => mousemoveBand(event));

    function mousemoveBand(event) {
    	var x0 = xScaleBand.invert(d3.pointer(event)[0]),
    	    bisectx = d3.bisector(function(d) { return d.x; }).left,
            i = bisectx(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i];
	    if (d1 == null) {
	        d1 = data[i - 1];
	    }          
	    var dTrue = x0 - d0.Date > d1.Date - x0 ? d1 : d0; // if is true, d1, if is false d0
            xValue = dTrue.x;
        d3.select("#bandplot .hover-line")
           .attr("d", function() {
           		var dVar = "M" + 0 + "," + (-yScaleBand(dTrue.y));
            	dVar += " " + 0 + "," + (heightBand - yScaleBand(dTrue.y));
            	return dVar;
           })
		focusBand.select("#bandplot .tooltip-y").text(function() { return "y: " + dTrue.y.toFixed(2); })
		focusBand.select("#bandplot .tooltip-x").text(function() { return "x: " + xValue.toFixed(2); });			        
		focusBand.attr("transform", "translate(" + xScaleBand(xValue) + "," + yScaleBand(dTrue.y) + ")");
	    focusBand.select("circle")
    	.attr("opacity", "1")
    	
		if (dTrue.x > medianBand) {
			focusBand.select("#bandplot .tooltip-y")
					  .attr("y", heightBand*.965-yScaleBand(dTrue.y))
					  .attr("text-anchor", "end")
					  .attr("x", -5);
			focusBand.select("#bandplot .tooltip-x")
				      .attr("y", heightBand*.92-yScaleBand(dTrue.y))
				      .attr("text-anchor", "end")
				      .attr("x", -5);
		} else {
			focusBand.select("#bandplot .tooltip-y")
				      .attr("y", heightBand*.48-yScaleBand(dTrue.y))
				      .attr("text-anchor", "start")
				      .attr("x", 5);
			focusBand.select("#bandplot .tooltip-x")
				      .attr("y", heightBand*.435-yScaleBand(dTrue.y))
				      .attr("text-anchor", "start")
				      .attr("x", 5);
		}
    }
});