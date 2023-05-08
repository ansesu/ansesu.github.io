//Margin
const marginStream = { top: 10, right: 151, bottom: 25, left: 10 };

//Width and height
const widthStream = 700 - marginStream.left - marginStream.right;
const heightStream = 400 - marginStream.top - marginStream.bottom;

var parseTimeStream = d3.timeParse("%Y-%m-%d")

//Load in the data
d3.csv("data/stream_chart_data.csv")
  .then(function(data) {			
	
	var keysStream = data.columns.slice(1)
	///Parse data and sort values by date
    data.forEach(function(d) {
    	d.date = parseTimeStream(d.date);
    });		    
    data.sort(function(a, b) {
        return a.date - b.date;
    });

	//Create scale functions
	xScaleStream = d3.scaleTime()
			    	  .domain([
			    	  	new Date(2021, 11, 25),
			    	  	new Date(2022, 12, 15)
			    	  ])
				      .range([0, widthStream]);
	yScaleStream = d3.scaleLinear()
					  .domain([-80,140])
				      .range([ heightStream, 0]);

	//Create SVG element in chart id element
	const svgStream = d3.select('#stream_chart')
					    .append('svg')
					     .attr("class", "content")
					     .attr("viewBox", `0 0 ${widthStream + marginStream.left + marginStream.right} ${heightStream + marginStream.top + marginStream.bottom}`)
					     .attr("preserveAspectRatio", "xMidYMid meet")
	var gStream = svgStream.append("g")
	   		   				.attr("transform", "translate(" + marginStream.left + "," + marginStream.top + ")");

	// color palette
	var colorStream = d3.scaleOrdinal()
						 .domain(keysStream)
						 .range(["#393b79", "#6b6ecf", "#637939", "#b5cf6b", "#8c6d31", "#e7ba52", "#843c39", "#d6616b", "#7b4173", "#ce6dbd"]);

	var artistsStream = colorStream.domain().map(function(name) {
      	return {name: name}	
    })			
	//Create legend
    var legendStream = gStream.selectAll('g')
			                  .data(artistsStream.reverse())
			                  .enter().append('g')
			                   .attr('class', 'legend');
    legendStream.append('rect')
		         .attr('x', 517)
		         .attr('y', function(d, i) {
		         	return i * 18;
		         })
		         .attr('width', 12.5)
		         .attr('height', 12.5)
		         .style('fill', function(d) {
		            return  colorStream(d.name);
		         });
    legendStream.append('text')    
    					 .attr('class', 'legend')
		           .attr('x', 532)
		           .attr('y', function(d, i) {
		               return (i * 18)+10.5;
		           })
		           .text(function(d) {
		               return d.name;
		           })
		           .attr("font-size", "16");

	//Create axis
	var xAxisStream = d3.axisBottom(xScaleStream)
						 .tickFormat(formatAsMonth)
						 .tickSize(3);

	gStream.append("g")
		    .attr("class", "xAxisStream")
		    .attr("transform", "translate(0," + heightStream + ")")
		    .call(xAxisStream)
		    .select(".domain")
		     .attr("stroke","#252525")
		     .attr("stroke-width","0");
	gStream.selectAll(".tick")
		   .selectAll("line")
		    .attr("stroke-width","1");

	//stack the data?
	var stackedDataStream = d3.stack()
				              .offset(d3.stackOffsetWiggle)
				              .keys(keysStream)
				              (data)						
	// Area generator
	var areaStream = d3.area()
					   .x(function(d) { return xScaleStream(d.data.date); })
					   .y0(function(d) { return yScaleStream(d[0]); })
					   .y1(function(d) { return yScaleStream(d[1]); })
					   .curve(d3.curveBasis);

	// create a tooltip
    var tooltipStream = gStream.append("text")
					  			.attr("class", "tooltip-stream")
						        .style("opacity", 0);

	// Three function that change the tooltip when user hover / move / leave a cell
	var mouseoverStream = function(event,d) {
		d3.selectAll("#stream_chart .myArea").style("opacity", .2);
		d3.select(this)
		   .style("stroke", "#bdbdbd")
		   .style("opacity", 1);
		
		var textStream = event.target.__data__.key;
		tooltipStream.text(textStream)
		              .attr("font-size", "22")  
		              .attr("x", 5)
		              .attr("y", 15)  	         
					  .transition()
				       .duration(400) // ms
					   .style("opacity", 1); // started as 0!

	}

	var mouseleaveStream = function(d) {
		d3.selectAll("#stream_chart .myArea").style("opacity", 1).style("stroke", "none")
		
		tooltipStream.transition()
                      .duration(300) // ms
                      .style("opacity", 0); // don't care about position!;  
	}				

	// Show the areas
	gStream.selectAll("mylayers")
	       .data(stackedDataStream)
	       .enter()
	       .append("path")
	        .attr("class", "myArea")
	        .style("fill", function(d) { return colorStream(d.key); })
	        .attr("d", areaStream)	
	        .on("mouseover", mouseoverStream)
	        .on("mouseleave", mouseleaveStream)
});