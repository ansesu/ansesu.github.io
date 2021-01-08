//Margin
const marginTempoDobra = { top: 12, right: 5, bottom: 25, left: 53 };

//Width and height
const widthTempoDobra = 600 - marginTempoDobra.left - marginTempoDobra.right;
const heightTempoDobra = 300 - marginTempoDobra.top - marginTempoDobra.bottom;

//For converting data
var parseTimeTempoDobra = d3.timeParse("%Y-%m-%d");

//Load in the data			
d3.csv("data/tempo_dobra.csv")
  .then(function(data) {	

	///Parse data and sort values by date
    data.forEach(function(d) {
    	d.Data = parseTimeTempoDobra(d.Data);
    	d.TempoDobra = parseInt(d.TempoDobra);
      d.TempoDobra_min = parseFloat(d.TempoDobra_min);
      d.TempoDobra_max = parseFloat(d.TempoDobra_max);
    });
    data.sort(function(a, b) {
        return a.Data - b.Data;
    });
	//Create scale functions
	xScaleTempoDobra = d3.scaleTime()
          					.domain([
          						d3.min(data, function(d) { return d.Data; }),
          						d3.max(data, function(d) { return d.Data; })
          					])
				   .range([0, widthTempoDobra]);
	yScaleTempoDobra = d3.scaleLinear()
          					.domain([
          						0,
          						d3.max(data, function(d) { return d.TempoDobra; })
          					])
          					.range([heightTempoDobra, 0]);	

	//Create SVG element in chart id element
	const svgTempoDobra = d3.select('#tempo_dobra')
    		              .append('svg')
    		               .attr("class", "content")
    		               .attr("viewBox", `0 0 ${widthTempoDobra + marginTempoDobra.left + marginTempoDobra.right} ${heightTempoDobra + marginTempoDobra.top + marginTempoDobra.bottom}`)
    		               .attr("preserveAspectRatio", "xMidYMid meet")

	var gTempoDobra = svgTempoDobra.append("g")
	            	        	.attr("transform", "translate(" + marginTempoDobra.left + "," + marginTempoDobra.top + ")");

	//Create axis
	var xAxisTempoDobra = d3.axisBottom(xScaleTempoDobra)
          					  .ticks(7)
          					  .tickFormat(formatAsMonth)
          					  .tickSize(3);
	var yAxisTempoDobra = d3.axisLeft(yScaleTempoDobra)
          					  .ticks(7)
          					  .tickSize(3);

	gTempoDobra.append("g")
    		  .attr("class", "xAxis")
    		  .attr("transform", "translate(0," + heightTempoDobra + ")")
    		  .call(xAxisTempoDobra)
    		  .select(".domain")
    		  .attr("stroke","#252525")
    		  .attr("stroke-width","0");
	gTempoDobra.append("g")
    		  .attr("class", "yAxis")
    		  .attr("transform", "translate(0,0)")
    		  .call(yAxisTempoDobra)

  //Create axis label
  gTempoDobra.append("text")
  	      .attr("class", "axis-title")
  	      .attr("transform", "rotate(-90)")
  	      .style("text-anchor", "middle")
  	      .attr("y",-52)
  	      .attr("x",-heightTempoDobra/2)
  	      .attr("dy", ".71em")
  	      .text("Tempo de dobra");
	//Create line
	var lineTempoDobra = d3.line()
          					 .x(function(d) { return xScaleTempoDobra(d.Data); })
          					 .y(function(d) { return yScaleTempoDobra(d.TempoDobra); });

	gTempoDobra.append("path")
    		  .attr("class", "line")
    		  .datum(data)
    		  .attr("d", lineTempoDobra)
          .attr("stroke", "#4292c6");
    // Create confidence interval
  gTempoDobra.append("path")
             .attr("class", "ci")
             .datum(data)
              .attr("fill", "#4292c6")
              .attr("stroke", "none")
              .attr("d", d3.area()
                .x(function(d) { return xScaleTempoDobra(d.Data) })
                .y0(function(d) { return yScaleTempoDobra(d.TempoDobra_min) })
                .y1(function(d) { return yScaleTempoDobra(d.TempoDobra_max) })
            )

	//Create tooltip
  var focusTempoDobra = gTempoDobra.append("g")
              		          .attr("class", "focus");

  focusTempoDobra.append("path") 
        	     .attr("class", "hover-line")

  var focusTempoDobraText = gTempoDobra.append("g")
                                .attr("class", "focus");
  focusTempoDobraText.append("text")
                  .attr("class", "tooltip-text")
  focusTempoDobraText.append("text")
                  .attr("class", "tooltip-date")

  focusTempoDobra.append("circle")
          	  .attr("r", 3)
          	  .attr("opacity", "0");

  svgTempoDobra.append("rect")
    	    	.attr("class", "overlay")
    	        .attr("transform", "translate(" + marginTempoDobra.left + "," + marginTempoDobra.top + ")")
    	        .attr("width", widthTempoDobra)
    	        .attr("height", heightTempoDobra)
    	        .on("mouseover", function() {
    	        	focusTempoDobra.style("display", null); 
                focusTempoDobraText.style("display", null); 
    	        })
    	        .on("mouseout", function() { 			        	
    	        	focusTempoDobra.style("display", "none"); 
                focusTempoDobraText.style("display", "none"); 
    	        })
    	        .on("mousemove", event => mousemoveTempoDobra(event));

  function mousemoveTempoDobra(event) {
  	var x0 = xScaleTempoDobra.invert(d3.pointer(event)[0]),
          bisectDate = d3.bisector(function(d) { return d.Data; }).left,
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          dTrue = x0 - d0.Data > d1.Data - x0 ? d1 : d0; // if is true, d1, if is false d0
    xDate = dTrue.Data;
    d3.select("#tempo_dobra .hover-line")
       .attr("d", function() {
       		var dVar = "M" + 0 + "," + (-yScaleTempoDobra(dTrue.TempoDobra));
        	dVar += " " + 0 + "," + (heightTempoDobra - yScaleTempoDobra(dTrue.TempoDobra));
        	return dVar;
       })			        
		focusTempoDobra.attr("transform", "translate(" + xScaleTempoDobra(xDate) + "," + yScaleTempoDobra(dTrue.TempoDobra) + ")");
    focusTempoDobra.select("circle")
                 .style("stroke", "#4292c6")
                 .style("fill", "#4292c6")
	          	   .attr("opacity", "1");
    focusTempoDobraText.select(".tooltip-text")
                    .text(function() { return "Tempo de dobra: " + dTrue.TempoDobra + " dias"; })
                    .attr("position", "absolute")
                    .attr("y", heightTempoDobra-165)
                    .attr("x", 10);
    focusTempoDobraText.select("#tempo_dobra .tooltip-date")
                    .text(function() { return formatAsDate(xDate); })
                    .attr("y", heightTempoDobra-180)
                    .attr("x", 10);
  }
});