//Margin
const marginThreshold = { top: 10, right: 5, bottom: 25, left: 52 };

//Width and height
const widthThreshold = 600 - marginThreshold.left - marginThreshold.right;
const heightThreshold = 300 - marginThreshold.top - marginThreshold.bottom;

//For converting data
var parseTimeThreshold = d3.timeParse("%Y-%m-%d");

//Load in the data
d3.csv("data/rt_maringa_data.csv")
  .then(function(data) {
	///Parse data
    data.forEach(function(d) {
    	d.date = parseTimeThreshold(d.date);
    	d.mean_r = parseFloat(d.mean_r);
    	d.lower_5 = parseFloat(d.lower_5);
    	d.upper_95 = parseFloat(d.upper_95);			      			      
    });

    data.sort(function(a, b) {
        return a.date - b.date;
    });
    //Get median of x
    medianThreshold = d3.median(data, function(d) { return d.date; })

	//Create scale functions
	xScaleThreshold = d3.scaleTime()
						 .domain([
							d3.min(data, function(d) { return d.date; }),
							d3.max(data, function(d) { return d.date; })
						 ])
						 .range([0, widthThreshold]);
	yScaleThreshold = d3.scaleLinear()
			             .domain([
			            	d3.min(data, function(d) { return d.lower_5; }),
			            	d3.max(data, function(d) { return d.upper_95; })
						 ])
						 .range([heightThreshold, 0]);	

	//Create SVG element in chart id element
	const svgThreshold = d3.select('#thresholdplot')
			               .append('svg')
			                .attr("class", "content")
			                .attr("viewBox", `0 0 ${widthThreshold + marginThreshold.left + marginThreshold.right} ${heightThreshold + marginThreshold.top + marginThreshold.bottom}`)
			                .attr("preserveAspectRatio", "xMidYMid meet")
	var gThreshold = svgThreshold.append("g")
	          					  .attr("transform", "translate(" + marginThreshold.left + "," + marginThreshold.top + ")");

    var svgDefsThreshold = svgThreshold.append('defs');
	var mainGradient = svgDefsThreshold.append('linearGradient')
                            		    .attr('id', 'mainGradient');
    mainGradient.attr("x1", 0)
    			.attr("gradientUnits", "userSpaceOnUse")
				.attr("y1", 0)
				.attr("x2", 0)
				.attr("y2", heightThreshold)
				.selectAll("stop")
				.data([
					{offset: yScaleThreshold(1) / heightThreshold, color: "#e41a1c"},
					{offset: yScaleThreshold(1) / heightThreshold, color: "#4daf4a"}
				])
				.enter().append("stop")
				 .attr("offset", d => d.offset)
				 .attr("stop-color", d => d.color);

    // Create confidence interval
    gThreshold.append("path")
		      .attr("class", "ci")
		      .classed('filled', true)
		      .datum(data)
		      .attr("stroke", "none")
		      .attr("d", d3.area()
		      	           .x(function(d) { return xScaleThreshold(d.date) })
		                   .y0(function(d) { return yScaleThreshold(d.lower_5) })
		                   .y1(function(d) { return yScaleThreshold(d.upper_95) })
      		  );

    const minDateThreshold = d3.min(data, function(d) { return d.date; }), 
   		  maxDateThreshold = d3.max(data, function(d) { return d.date; });
   	
	var horizontalDataThreshold = [{x: minDateThreshold, y: 1}, {x: maxDateThreshold, y: 1}];
	var horizontalLineThreshold = d3.line()
							  	    .x(function(horizontalDataThreshold) { return xScaleThreshold(horizontalDataThreshold.x); })
							  	    .y(function(horizontalDataThreshold) { return yScaleThreshold(horizontalDataThreshold.y); });
	gThreshold.append("path")
			  .datum(horizontalDataThreshold)
			   .attr("d", horizontalLineThreshold)
			   .style("stroke", "#e41a1c")
			   .style("stroke-dasharray", "3,3")			   		 

	//Create line
	var lineLineThreshold = d3.line()
				              .x(function(d) { return xScaleThreshold(d.date); })
				              .y(function(d) { return yScaleThreshold(d.mean_r); });

	gThreshold.append("path")
              .attr("class", "line")
              .datum(data)
              .attr("d", lineLineThreshold)
              .classed("outlined", true)

	//Create axis
	var xAxisThreshold = d3.axisBottom(xScaleThreshold)
				           .ticks(7)
				           .tickFormat(formatAsMonth)
				           .tickSize(3);
	var yAxisThreshold = d3.axisLeft(yScaleThreshold)
				           .ticks(7)
				           .tickSize(3);

	gThreshold.append("g")
			   .attr("class", "xAxis")
			   .attr("transform", "translate(0," + heightThreshold + ")")
			   .call(xAxisThreshold)
			   .select(".domain")
			    .attr("stroke","#252525")
			    .attr("stroke-width","0");
	gThreshold.append("g")
			   .attr("class", "yAxis")
			   .attr("transform", "translate(0,0)")
			   .call(yAxisThreshold)

		//Create axis label
    gThreshold.append("text")
		       .attr("class", "axis-title")
		       .attr("transform", "rotate(-90)")
		       .style("text-anchor", "middle")
		       .attr("y",-52)
		       .attr("x",-heightThreshold/2)
		       .attr("dy", ".71em")
		       .text("Número de reprodução, R(t)");

	gThreshold.append("text")
				    .attr("text-anchor", "end")
				    .attr("x", xScaleThreshold(maxDateThreshold)-1)
				    .attr("y", yScaleThreshold(data[data.length-1].mean_r)-5)
				    .attr("font-size", "15px")
				    .text(data[data.length-1].mean_r.toFixed(2))
				    .style("font-weight", "bold")
				    .style("fill", function() {
				    	if (data[data.length-1].mean_r >=1 ) {
				    		return "#e41a1c";
				    	} else {
				    		return "#4daf4a";
				    	}
				    })
	//Create tooltip
    var focusThreshold = gThreshold.append("g")
                  					.attr("class", "focus");

    focusThreshold.append("path") 
         		   .attr("class", "hover-line")

    focusThreshold.append("text")
    	  		   .attr("class", "tooltip-y")
    focusThreshold.append("text")
    	 		   .attr("class", "tooltip-x")

    focusThreshold.append("circle")
        		   .attr("r", 3)
        		   .attr("opacity", "0");

    svgThreshold.append("rect")
		    	 .attr("class", "overlay")
		         .attr("transform", "translate(" + marginThreshold.left + "," + marginThreshold.top + ")")
		         .attr("width", widthThreshold)
		         .attr("height", heightThreshold)
		         .on("mouseover", function() {
		         	focusThreshold.style("display", null); 
		         })
		         .on("mouseout", function() { 			        	
		         	focusThreshold.style("display", "none"); 
		         })
		         .on("mousemove", event => mousemoveThreshold(event));

    function mousemoveThreshold(event) {
		var x0 = xScaleThreshold.invert(d3.pointer(event)[0]),
		    bisectx = d3.bisector(function(d) { return d.date; }).left,
		    i = bisectx(data, x0, 1),
		    d0 = data[i - 1],
            d1 = data[i];
	    if (d1 == null){
	        d1 = data[i - 1];
	    }          
	    var dTrue = x0 - d0.Data > d1.Data - x0 ? d1 : d0, // if is true, d1, if is false d0
			xValue = dTrue.date;
		d3.select("#thresholdplot .hover-line")
		   .attr("d", function() {
		   		var dVar = "M" + 0 + "," + (-yScaleThreshold(dTrue.mean_r));
		    	dVar += " " + 0 + "," + (heightThreshold - yScaleThreshold(dTrue.mean_r));
		    	return dVar;
		   })
		   .style("stroke", function(d) {
			   if (dTrue.mean_r < 1) {
			    	return  "#4daf4a";
		       } else {
					return "#e41a1c";
			   }
		   })
		focusThreshold.select("circle")
				      .style("stroke", function(d) {
				      	  if (dTrue.mean_r < 1) {
				    		  return  "#4daf4a";
				    	  } else {
				    		  return "#e41a1c";
				    	  }
				      })	
				    .style("fill", function() {
				      	  if (dTrue.mean_r < 1) {
				    		  return  "#4daf4a";
				    	  } else {
				    		  return "#e41a1c";
				    	  }
				      })				      		      
		focusThreshold.select("#thresholdplot .tooltip-y").text(function() { return "R(t) = " + dTrue.mean_r.toFixed(2); })
		focusThreshold.select("#thresholdplot .tooltip-x").text(function() { return  formatAsDate(xValue); });			        
		focusThreshold.attr("transform", "translate(" + xScaleThreshold(xValue) + "," + yScaleThreshold(dTrue.mean_r) + ")");
		focusThreshold.select("circle")
		    		   .attr("opacity", "1");
		if (dTrue.date > medianThreshold) {
			focusThreshold.select("#thresholdplot .tooltip-y")
					 	   .attr("y", heightThreshold*.1-yScaleThreshold(dTrue.mean_r))
					 	   .attr("text-anchor", "end")
					 	   .attr("x", -5);
			focusThreshold.select("#thresholdplot .tooltip-x")
					 	   .attr("y", heightThreshold*.045-yScaleThreshold(dTrue.mean_r))
					 	   .attr("text-anchor", "end")
					 	   .attr("x", -5);
		} else {
			focusThreshold.select("#thresholdplot .tooltip-y")
						   .attr("y", heightThreshold*.1-yScaleThreshold(dTrue.mean_r))
						   .attr("text-anchor", "start")
						   .attr("x", 5);
			focusThreshold.select("#thresholdplot .tooltip-x")
						   .attr("y", heightThreshold*.045-yScaleThreshold(dTrue.mean_r))
						   .attr("text-anchor", "start")
					       .attr("x", 5);
        }
    }
});