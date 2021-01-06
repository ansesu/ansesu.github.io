//Margin
const marginLine = { top: 12, right: 5, bottom: 25, left: 71 };

//Width and height
const widthLine = 600 - marginLine.left - marginLine.right;
const heightLine = 300 - marginLine.top - marginLine.bottom;

//For converting data
var parseTimeLine = d3.timeParse("%d/%m/%Y");
var parseTimeLineDecretos = d3.timeParse("%Y-%m-%d");

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
						new Date(2020,2,15),
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
		               .attr("width", "100%")



	var gLine = svgLine.append("g")
	            		.attr("transform", "translate(" + marginLine.left + "," + marginLine.top + ")");
	var gLineCircle = svgLine.append("g")
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
	      .attr("y",-70)
	      .attr("x",-heightLine/2)
	      .attr("dy", ".71em")
	      .text("Casos confirmados de COVID-19");
	gLine.append("text")
	      .attr("text-anchor", "end")
	      .attr("x", xScaleLine(d3.max(data, function(d) { return d.Date; }))-4)
	      .attr("y", yScaleLine(d3.max(data, function(d) { return d.Confirmed; })))
	      .attr("font-size", "15px")
	      .text(formatValue(d3.max(data, function(d) { return d.Confirmed; })))


	d3.csv("data/decretos.csv")
	  .then(function(data_decretos) {	
	    data_decretos.forEach(function(d) {
	    	d.Data = parseTimeLineDecretos(d.Data);
	    	d.Confirmados = parseInt(d.Confirmados);
	    	d.y = parseFloat(d.y);
	    	d.resumo = d.resumo;
	    	d.flexibilizacao = (d.flexibilizacao === 'True')
	    });

 
		gLine.selectAll(".lineDecretos")
				  .data(data_decretos).enter()
				  .append("line")
				    .attr("class", "lineDecretos")
			        .attr("x1", function(d) { return xScaleLine(d.Data); })
			        .attr("x2", function(d) { return xScaleLine(d.Data); })
			        .attr("y1", function(d) { return yScaleLine(d.Confirmados); })
			        .attr("y2", function(d) { return yScaleLine(d.y); })	
			        .attr("stroke", function(d) {
                      	if (d.flexibilizacao ){
                      		return "#1a9850";
                      	} else {
                      		return "#d73027";
                      	}
	                 })
			        .attr("stroke-dasharray", "1,1")
   		 var tooltipDecretos = gLine.append("text")
						  			.attr("class", "tooltip-line")
							        .style("opacity", 0);

		function wrap(text, width) {
		  text.each(function() {
		    var text = d3.select(this),
		        words = text.text().split(/\s+/).reverse(),
		        word,
		        line = [],
		        lineNumber = 0,
		        lineHeight = 1.1, // ems
		        x = text.attr("x"),
		        y = text.attr("y"),
		        dy = parseFloat(text.attr("dy")),
		        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
		    while (word = words.pop()) {
		      line.push(word);
		      tspan.text(line.join(" "));
		      if (tspan.node().getComputedTextLength() > width) {
		        line.pop();
		        tspan.text(line.join(" "));
		        line = [word];
		        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		      }
		    }
		  });
		}                            
	    // tooltip mouseover event handler
	    var mouseoverDecretos = function(event, d) {
	      d3.select(this)
	        .transition()
	         .duration(300) // ms         
	         .attr("opacity", "1")
	         .attr("r", function(d) {
	           return 4.5; 
	         });  

			tooltipDecretos.text(d.resumo)
				              .attr("font-size", "12")  
				              .attr("x", 8)
				              .attr("y", 0)
				              .attr("dy", 1)  	 				              		                      
							  .transition()
						       .duration(400) // ms
							   .style("opacity", 1) // started as 0!
			gLine.selectAll(".tooltip-line")
	  			  .call(wrap, 300) 	      
	    };
	    // tooltip mouseout event handler
	    var mouseoutDecretos = function(d) {
	      d3.select(this)
	        .transition()
	         .duration(300) // ms         
	         .attr("r", function(d) {
	              return 3;  
	          });   
	      tooltipDecretos.transition()
	                     .duration(300) // ms
	                     .style("opacity", 0); // don't care about position!;                       
	    }; 

	    circleLine = gLineCircle.selectAll("circle")
	                              .data(data_decretos)
	    circleLine.enter().append('circle')
	                       .attr("cx", function(d) {
	                          return xScaleLine(d.Data);
	                       })
	                       .attr("cy", function(d) {
	                          return yScaleLine(d.y);
	                       })
	                       .attr("r", function (d) {
	                          return 3;
	                       })          
	                      .attr("class", "circle")
	                      .attr("fill", function(d) {
	                      	if (d.flexibilizacao ){
	                      		return "#1a9850";
	                      	} else {
	                      		return "#d73027";
	                      	}
	                      })

	    gLineCircle.selectAll("circle")
                  .on("mouseover", mouseoverDecretos)
                  .on("mouseout", mouseoutDecretos);	    
                      	 
	}) 

	//Create line
	var lineLine = d3.line()
					 .x(function(d) { return xScaleLine(d.Date); })
					 .y(function(d) { return yScaleLine(d.Confirmed); });


	gLine.append("path")
		  .attr("class", "lineConfirmados")
		  .datum(data)
		  .attr("d", lineLine);

	//Create tooltip
    var focusLine = gLine.append("g")
                		  .attr("class", "focus");
    var focusLineText = gLine.append("g")
                		     .attr("class", "focus");
    focusLine.append("path") 
          	  .attr("class", "hover-line")

    focusLineText.append("text")
    	 	     .attr("class", "tooltip-confirmed")
    focusLineText.append("text")
    	  	     .attr("class", "tooltip-date")

    focusLine.append("circle")
          	  .attr("r", 3)
          	  .attr("opacity", "0");

    gLine.append("rect")
	    	.attr("class", "overlay")
	        .attr("width", widthLine)
	        .attr("height", heightLine)
	        .on("mouseover", function() {
	        	focusLine.style("display", null); 
	        	focusLineText.style("display", null); 
	        })
	        .on("mouseout", function() { 			        	
	        	focusLine.style("display", "none"); 
	        	focusLineText.style("display", "none"); 
	        })
	        .on("mousemove", event => mousemoveLine(event));

    function mousemoveLine(event) {
    	var x0 = xScaleLine.invert(d3.pointer(event)[0]),
            bisectDate = d3.bisector(function(d) { return d.Date; }).left,
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            dTrue = x0 - d0.Date > d1.Date - x0 ? d1 : d0; // if is true, d1, if is false d0
        xDate = dTrue.Date;
        d3.select("#lineplot .hover-line")
           .attr("d", function() {
           		var dVar = "M" + 0 + "," + (-yScaleLine(dTrue.Confirmed));
            	dVar += " " + 0 + "," + (heightLine - yScaleLine(dTrue.Confirmed));
            	return dVar;
           })
		focusLineText.select(".tooltip-confirmed").text(function() { return formatValue(dTrue.Confirmed) + " casos"; });
		focusLineText.select("#lineplot .tooltip-date").text(function() { return formatAsDate(xDate); });			        
		focusLine.attr("transform", "translate(" + xScaleLine(xDate) + "," + yScaleLine(dTrue.Confirmed) + ")");
	    focusLine.select("circle")
	          	  .attr("opacity", "1");
		focusLineText.select(".tooltip-confirmed")
				  .attr("position", "absolute")
		 	      .attr("y", heightLine-10)
		 	      .attr("text-anchor", "end")
		 	      .attr("x", widthLine);
	    focusLineText.select("#lineplot .tooltip-date")
		 	      .attr("y", heightLine-25)
		 	      .attr("text-anchor", "end")
		 	      .attr("x", widthLine);

    }   


});