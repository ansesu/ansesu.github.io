//Margin
const marginSuspeitos = { top: 12, right: 5, bottom: 25, left: 73 };

//Width and height
const widthSuspeitos = 600 - marginSuspeitos.left - marginSuspeitos.right;
const heightSuspeitos = 300 - marginSuspeitos.top - marginSuspeitos.bottom;

//For converting data
var parseTimeSuspeitos = d3.timeParse("%Y-%m-%d");

//Load in the data			
d3.csv("data/suspeitos.csv")
  .then(function(data) {	

	///Parse data and sort values by date
    data.forEach(function(d) {
    	d.Data = parseTimeSuspeitos(d.Data);
    	d.Suspeitos = parseInt(d.Suspeitos);
    });
    data.sort(function(a, b) {
        return a.Data - b.Data;
    });
  data1=data
	//Create scale functions
	xScaleSuspeitos = d3.scaleTime()
          					.domain([
          						d3.min(data, function(d) { return d.Data; }),
          						d3.max(data, function(d) { return d.Data; })
          					])
				   .range([0, widthSuspeitos]);
	yScaleSuspeitos = d3.scaleLinear()
          					.domain([
          						0,
          						d3.max(data, function(d) { return d.Suspeitos; })
          					])
          					.range([heightSuspeitos, 0]);	

	//Create SVG element in chart id element
	const svgSuspeitos = d3.select('#suspeitos')
    		              .append('svg')
    		               .attr("class", "content")
    		               .attr("viewBox", `0 0 ${widthSuspeitos + marginSuspeitos.left + marginSuspeitos.right} ${heightSuspeitos + marginSuspeitos.top + marginSuspeitos.bottom}`)
    		               .attr("preserveAspectRatio", "xMidYMid meet")

	var gSuspeitos = svgSuspeitos.append("g")
	            	        	.attr("transform", "translate(" + marginSuspeitos.left + "," + marginSuspeitos.top + ")");

	//Create axis
	var xAxisSuspeitos = d3.axisBottom(xScaleSuspeitos)
          					  .ticks(7)
          					  .tickFormat(formatAsMonth)
          					  .tickSize(3);
	var yAxisSuspeitos = d3.axisLeft(yScaleSuspeitos)
          					  .ticks(7)
          					  .tickSize(3);

	gSuspeitos.append("g")
    		  .attr("class", "xAxis")
    		  .attr("transform", "translate(0," + heightSuspeitos + ")")
    		  .call(xAxisSuspeitos)
    		  .select(".domain")
    		  .attr("stroke","#252525")
    		  .attr("stroke-width","0");
	gSuspeitos.append("g")
    		  .attr("class", "yAxis")
    		  .attr("transform", "translate(0,0)")
    		  .call(yAxisSuspeitos)

    //Create axis label
    gSuspeitos.append("text")
    	      .attr("class", "axis-title")
    	      .attr("transform", "rotate(-90)")
    	      .style("text-anchor", "middle")
    	      .attr("y",-72)
    	      .attr("x",-heightSuspeitos/2)
    	      .attr("dy", ".71em")
    	      .text("Suspeitos em acompanhamento");
	//Create line
	var lineSuspeitos = d3.line()
          					 .x(function(d) { return xScaleSuspeitos(d.Data); })
          					 .y(function(d) { return yScaleSuspeitos(d.Suspeitos); });

	gSuspeitos.append("path")
    		  .attr("class", "line")
    		  .datum(data)
    		  .attr("d", lineSuspeitos)
          .attr("stroke", "#e5c494");

	//Create tooltip
    var focusSuspeitos = gSuspeitos.append("g")
                		          .attr("class", "focus");

    focusSuspeitos.append("path") 
          	     .attr("class", "hover-line")

    var focusSuspeitosText = gSuspeitos.append("g")
                                  .attr("class", "focus");
    focusSuspeitosText.append("text")
                    .attr("class", "tooltip-text")
    focusSuspeitosText.append("text")
                    .attr("class", "tooltip-date")

    focusSuspeitos.append("circle")
            	  .attr("r", 3)
            	  .attr("opacity", "0");

    svgSuspeitos.append("rect")
      	    	.attr("class", "overlay")
      	        .attr("transform", "translate(" + marginSuspeitos.left + "," + marginSuspeitos.top + ")")
      	        .attr("width", widthSuspeitos)
      	        .attr("height", heightSuspeitos)
      	        .on("mouseover", function() {
      	        	focusSuspeitos.style("display", null); 
                  focusSuspeitosText.style("display", null); 
      	        })
      	        .on("mouseout", function() { 			        	
      	        	focusSuspeitos.style("display", "none"); 
                  focusSuspeitosText.style("display", "none"); 
      	        })
      	        .on("mousemove", event => mousemoveSuspeitos(event));

    function mousemoveSuspeitos(event) {
    	var x0 = xScaleSuspeitos.invert(d3.pointer(event)[0]),
            bisectDate = d3.bisector(function(d) { return d.Data; }).left,
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            dTrue = x0 - d0.Data > d1.Data - x0 ? d1 : d0; // if is true, d1, if is false d0
      xDate = dTrue.Data;
      d3.select("#suspeitos .hover-line")
         .attr("d", function() {
         		var dVar = "M" + 0 + "," + (-yScaleSuspeitos(dTrue.Suspeitos));
          	dVar += " " + 0 + "," + (heightSuspeitos - yScaleSuspeitos(dTrue.Suspeitos));
          	return dVar;
         })			        
  		focusSuspeitos.attr("transform", "translate(" + xScaleSuspeitos(xDate) + "," + yScaleSuspeitos(dTrue.Suspeitos) + ")");
	    focusSuspeitos.select("circle")
                   .style("stroke", "#e5c494")
                   .style("fill", "#e5c494")
  	          	   .attr("opacity", "1");
      focusSuspeitosText.select(".tooltip-text")
                      .text(function() { return "Suspeitos: " + formatValue(dTrue.Suspeitos); })
                      .attr("position", "absolute")
                      .attr("y", heightSuspeitos-10)
                      .attr("text-anchor", "end")
                      .attr("x", widthSuspeitos);
      focusSuspeitosText.select("#suspeitos .tooltip-date")
                      .text(function() { return formatAsDate(xDate); })
                      .attr("y", heightSuspeitos-25)
                      .attr("text-anchor", "end")
                      .attr("x", widthSuspeitos);
  }
});