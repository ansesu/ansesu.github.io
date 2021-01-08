//Margin
const marginMortes = { top: 12, right: 5, bottom: 25, left: 53 };

//Width and height
const widthMortes = 600 - marginMortes.left - marginMortes.right;
const heightMortes = 300 - marginMortes.top - marginMortes.bottom;

//For converting data
var parseTimeMortes = d3.timeParse("%Y-%m-%d");

//Load in the data			
d3.csv("data/mortes.csv")
  .then(function(data) {	

	///Parse data and sort values by date
    data.forEach(function(d) {
    	d.Data = parseTimeMortes(d.Data);
    	d.Mortes = parseInt(d.Mortes);
    });
    data.sort(function(a, b) {
        return a.Data - b.Data;
    });
	//Create scale functions
	xScaleMortes = d3.scaleTime()
          					.domain([
          						d3.min(data, function(d) { return d.Data; }),
          						d3.max(data, function(d) { return d.Data; })
          					])
				   .range([0, widthMortes]);
	yScaleMortes = d3.scaleLinear()
          					.domain([
          						0,
          						d3.max(data, function(d) { return d.Mortes; })
          					])
          					.range([heightMortes, 0]);	

	//Create SVG element in chart id element
	const svgMortes = d3.select('#mortes')
    		              .append('svg')
    		               .attr("class", "content")
    		               .attr("viewBox", `0 0 ${widthMortes + marginMortes.left + marginMortes.right} ${heightMortes + marginMortes.top + marginMortes.bottom}`)
    		               .attr("preserveAspectRatio", "xMidYMid meet")

	var gMortes = svgMortes.append("g")
	            	        	.attr("transform", "translate(" + marginMortes.left + "," + marginMortes.top + ")");

	//Create axis
	var xAxisMortes = d3.axisBottom(xScaleMortes)
          					  .ticks(7)
          					  .tickFormat(formatAsMonth)
          					  .tickSize(3);
	var yAxisMortes = d3.axisLeft(yScaleMortes)
          					  .ticks(7)
          					  .tickSize(3);

	gMortes.append("g")
    		  .attr("class", "xAxis")
    		  .attr("transform", "translate(0," + heightMortes + ")")
    		  .call(xAxisMortes)
    		  .select(".domain")
    		  .attr("stroke","#252525")
    		  .attr("stroke-width","0");
	gMortes.append("g")
    		  .attr("class", "yAxis")
    		  .attr("transform", "translate(0,0)")
    		  .call(yAxisMortes)

  //Create axis label
  gMortes.append("text")
  	      .attr("class", "axis-title")
  	      .attr("transform", "rotate(-90)")
  	      .style("text-anchor", "middle")
  	      .attr("y",-52)
  	      .attr("x",-heightMortes/2)
  	      .attr("dy", ".71em")
  	      .text("Óbitos");
	//Create line
	var lineMortes = d3.line()
          					 .x(function(d) { return xScaleMortes(d.Data); })
          					 .y(function(d) { return yScaleMortes(d.Mortes); });

	gMortes.append("path")
    		  .attr("class", "line")
    		  .datum(data)
    		  .attr("d", lineMortes)
          .attr("stroke", "#fc8d62");

	//Create tooltip
  var focusMortes = gMortes.append("g")
              		          .attr("class", "focus");

  focusMortes.append("path") 
        	     .attr("class", "hover-line")

  var focusMortesText = gMortes.append("g")
                                .attr("class", "focus");
  focusMortesText.append("text")
                  .attr("class", "tooltip-text")
  focusMortesText.append("text")
                  .attr("class", "tooltip-date")

  focusMortes.append("circle")
          	  .attr("r", 3)
          	  .attr("opacity", "0");

  svgMortes.append("rect")
    	    	.attr("class", "overlay")
    	        .attr("transform", "translate(" + marginMortes.left + "," + marginMortes.top + ")")
    	        .attr("width", widthMortes)
    	        .attr("height", heightMortes)
    	        .on("mouseover", function() {
    	        	focusMortes.style("display", null); 
                focusMortesText.style("display", null); 
    	        })
    	        .on("mouseout", function() { 			        	
    	        	focusMortes.style("display", "none"); 
                focusMortesText.style("display", "none"); 
    	        })
    	        .on("mousemove", event => mousemoveMortes(event));

  function mousemoveMortes(event) {
  	var x0 = xScaleMortes.invert(d3.pointer(event)[0]),
          bisectDate = d3.bisector(function(d) { return d.Data; }).left,
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          dTrue = x0 - d0.Data > d1.Data - x0 ? d1 : d0; // if is true, d1, if is false d0
    xDate = dTrue.Data;
    d3.select("#mortes .hover-line")
       .attr("d", function() {
       		var dVar = "M" + 0 + "," + (-yScaleMortes(dTrue.Mortes));
        	dVar += " " + 0 + "," + (heightMortes - yScaleMortes(dTrue.Mortes));
        	return dVar;
       })			        
		focusMortes.attr("transform", "translate(" + xScaleMortes(xDate) + "," + yScaleMortes(dTrue.Mortes) + ")");
    focusMortes.select("circle")
                 .style("stroke", "#fc8d62")
                 .style("fill", "#fc8d62")
	          	   .attr("opacity", "1");
    focusMortesText.select(".tooltip-text")
                    .text(function() { return "Mortes: " + formatValue(dTrue.Mortes); })
                    .attr("position", "absolute")
                    .attr("y", heightMortes-10)
                    .attr("text-anchor", "end")
                    .attr("x", widthMortes);
    focusMortesText.select("#mortes .tooltip-date")
                    .text(function() { return formatAsDate(xDate); })
                    .attr("y", heightMortes-25)
                    .attr("text-anchor", "end")
                    .attr("x", widthMortes);
  }
});