//Margin
const marginMortesDiario = { top: 5.5, right: 5, bottom: 100, left: 43 };

//Width and height
const widthMortesDiario = 600 - marginMortesDiario.left - marginMortesDiario.right;
const heightMortesDiario = 375 - marginMortesDiario.top - marginMortesDiario.bottom;

//For converting data
var parseTimeMortesDiario = d3.timeParse("%Y-%m-%d");

//Load in the data			
d3.csv("data/mortes_diario.csv")
  .then(function(data) {	
	///Parse data and sort values by date
    data.forEach(function(d) {
    	d.Data = parseTimeMortesDiario(d.Data);
    	d.Mortes_diario = parseInt(d.Mortes_diario);
    	d.moving_average = parseFloat(d.moving_average)
    });
    data.sort(function(a, b) {
        return a.Data - b.Data;
    });
	//Create scale functions
	xScaleMortesDiario = d3.scaleTime()
          						.domain([
          							d3.min(data, function(d) { return d.Data; }),
          							d3.max(data, function(d) { return d.Data; })
          						])
				           		.range([0, widthMortesDiario]);   
	xBand = d3.scaleBand()
			   .domain(data.map(function(d) { return d.Data; }))
	  		   .rangeRound([0, widthMortesDiario])
	  		   .padding(0.1)
	yScaleMortesDiario = d3.scaleLinear()
          						.domain([
          							0,
          							d3.max(data, function(d) { return d.Mortes_diario; })
          						])
          						.range([heightMortesDiario, 0]);  
    maxMortesDiario = d3.max(data, function(d) { return d.Mortes_diario; });        							
	yScaleDecretosMortes = d3.scaleLinear()
  						.domain([-4,4])
          				.range([heightMortesDiario+marginMortesDiario.bottom-5, heightMortesDiario+50]);
	//Create SVG element in chart id element
	const svgMortesDiario = d3.select('#mortes_diario')
    		              			.append('svg')
    		              			.attr("class", "content")
    		               			.attr("viewBox", `0 0 ${widthMortesDiario + marginMortesDiario.left + marginMortesDiario.right} ${heightMortesDiario + marginMortesDiario.top + marginMortesDiario.bottom}`)
    		               			.attr("preserveAspectRatio", "xMidYMid meet")

	var gMortesDiario = svgMortesDiario.append("g")
	            	        					  .attr("transform", "translate(" + marginMortesDiario.left + "," + marginMortesDiario.top + ")");

	//Create axis
	var xAxisMortesDiario = d3.axisBottom(xScaleMortesDiario)
									.tickFormat(formatAsMonth)
          					        .tickSize(3);
	var xAxisMortesDiarioDecretos = d3.axisBottom(xScaleMortesDiario)  
          					               .tickValues([])
          					               .tickSize(0);          					       
	var yAxisMortesDiario = d3.axisLeft(yScaleMortesDiario)
          					       .tickSize(3);

	gMortesDiario.append("g")
		    		  .attr("class", "xAxis")
		    		  .attr("transform", "translate(0," + heightMortesDiario + ")")
		    		  .call(xAxisMortesDiario)
		    		  .select(".domain")
		    		  .attr("stroke","#525252")
		    		  .attr("stroke-width","0");
	gMortesDiario.append("g")
		    		  .attr("class", "xAxisDecretos")
		    		  .attr("transform", "translate(0," + (heightMortesDiario+(marginMortesDiario.bottom+50-5)/2) + ")")
		    		  .call(xAxisMortesDiarioDecretos)
		    		  .select(".domain")
		    		  .attr("stroke","#525252")
		    		  .attr("stroke-width","1");		    		  
	gMortesDiario.append("g")
		    		  .attr("class", "yAxis")
		    		  .attr("transform", "translate(0,0)")
		    		  .call(yAxisMortesDiario)

    //Create axis label
    gMortesDiario.append("text")
		    	      .attr("class", "axis-title")
		    	      .attr("transform", "rotate(-90)")
		    	      .style("text-anchor", "middle")
		    	      .attr("y",-42)
		    	      .attr("x",-heightMortesDiario/2)
		    	      .attr("dy", ".71em")
		    	      .text("Óbitos diários");
    gMortesDiario.append("text")
    				  .attr("position", "absolute")
		    	      .attr("y",heightMortesDiario + 40)
		    	      .attr("x",0)
		    	      .text("Linha do tempo dos decretos")
		    	      .attr("font-size", "13");
    // Add first decretos
	// d3.csv("data/decretos_first.csv")
	//   .then(function(data_decretos_first) {	
	//     data_decretos_first.forEach(function(d) {
	//     	d.Data = parseTimeMortesDiario(d.Data);
	//     	d.flexibilizacao = (d.flexibilizacao === 'True');
	//     });
 
	// 	gMortesDiario.selectAll(".lineDecretosFirst")
	// 					  .data(data_decretos_first).enter()
	// 					  .append("line")
	// 					    .attr("class", "lineDecretosFirst")
	// 				        .attr("x1", function(d) { return xScaleMortesDiario(d.Data); })
	// 				        .attr("x2", function(d) { return xScaleMortesDiario(d.Data); })
	// 				        .attr("y1", function(d) { return yScaleMortesDiario(0); })
	// 				        .attr("y2", function(d) { return yScaleMortesDiario(maxMortesDiario); })	
	// 				        .attr("stroke", function(d) {
	// 		                  	if (d.flexibilizacao ){
	// 		                  		return "#1a9850";
	// 		                  	} else {
	// 		                  		return "#d73027";
	// 		                  	}
	// 		                })
	// 		                .attr("opacity", ".25")
	// 		                .attr("stroke-width", "1")			                     
	// })

	// tooltip
	var focusMortesDiarioText = gMortesDiario.append("g")
	                          							.attr("class", "focus");
	focusMortesDiarioText.append("text")
	            			  .attr("class", "tooltip-daily-cases tooltip-text")

	focusMortesDiarioText.append("text")
							  .attr("class", "tooltip-moving-average tooltip-text")
	            			  
	focusMortesDiarioText.append("text")
	          				    .attr("class", "tooltip-date")             

	// tooltip mouseover event handler
	var mouseoverBar = function(event, d) {
		d3.select(this)
		   .transition()
		   .duration(300) 		  
		   .attr("fill", "#525252");

	    focusMortesDiarioText.select("#mortes_diario .tooltip-daily-cases")
				                    .text(function() { return "Óbitos diários: " + formatValue(d.Mortes_diario) })
				                    .attr("position", "absolute")
				                    .attr("y", heightMortesDiario-85)
				                    .attr("x", 10);

	    focusMortesDiarioText.select("#mortes_diario .tooltip-moving-average")
				                    .text(function() { return "Média movel: " + parseFloat(d.moving_average).toFixed(1)})
				                    .attr("position", "absolute")
				                    .attr("y", heightMortesDiario-70)
				                    .attr("x", 10);				
                    
	    focusMortesDiarioText.select("#mortes_diario .tooltip-date")
				                    .text(function() { return formatAsDate(d.Data); })
				                    .attr("position", "absolute")				                    
				                    .attr("y", heightMortesDiario-100)
				                    .attr("x", 10);
        focusMortesDiarioText.attr("opacity", "1")
	};
	// tooltip mouseout event handler
	var mouseoutBar = function(d) {
		d3.select(this)
		  .transition()
		   .duration(300) // ms				  
		   .attr("fill", "#fc8d62");

		focusMortesDiarioText.attr("opacity", "0")                      
	};    	      
	// Add bars
	gMortesDiario.selectAll(".barMortesDiario")
						.data(data)
						.enter()
						.append("rect")
						 .attr("class", "barMortesDiario")
						 .attr("x", function(d) { return xScaleMortesDiario(d.Data); })
						 .attr("y", function(d) { return yScaleMortesDiario(d.Mortes_diario); })
						 .attr("width", xBand.bandwidth())
						 .attr("height", function(d) { return heightMortesDiario - yScaleMortesDiario(d.Mortes_diario); })
						 .attr("fill", "#fc8d62")
						 .on("mouseover", mouseoverBar)
						 .on("mouseout", mouseoutBar);

	var lineMortesDiario = d3.line()
          				          .x(function(d) { return xScaleMortesDiario(d.Data); })
          				          .y(function(d) { return yScaleMortesDiario(d.moving_average); });

	pathMortesDiario = gMortesDiario.append("path")
    		                                  .attr("class", "line")
    		                                  .datum(data)
    		                                  .attr("d", lineMortesDiario)
                                              .attr("stroke", "#525252")
    totalLengthMortesDiario = pathMortesDiario.node().getTotalLength();                                          
    function updateMortesDiario() {
	    cb = d3.select(".checkboxMortesDiario")
	    // If the box is check, I show the group
	    if (cb.property("checked")) {
			pathMortesDiario = gMortesDiario.append("path")
		    		                                  .attr("class", "line")
		    		                                  .attr("d", lineMortesDiario(data))
		    		                                  .attr("stroke", "#525252")	
		    		                                  .attr("fill", "none")

            pathMortesDiario              
                          .attr("stroke-dasharray", totalLengthMortesDiario)
                          .attr("stroke-dashoffset", totalLengthMortesDiario)	
                           .transition()	    		                                  
                           .duration(3000)
                           .ease(d3.easeLinear)    
                           .attr("stroke-dashoffset", 0);     											   

		                                                   	
	    // Otherwise I hide it
	    } else {
	    	pathMortesDiario.remove()
	    }    	
    }

    d3.selectAll(".checkboxMortesDiario").on("change", updateMortesDiario);

	d3.csv("data/decretos.csv")
	  .then(function(data_decretos) {	
	    data_decretos.forEach(function(d) {
	    	d.Data = parseTimeMortesDiario(d.Data);
	    	d.y = parseInt(d.y);
	    	d.resumo = String(d.resumo);
	    	d.flexibilizacao = (d.flexibilizacao === 'True')
	    });
 
		gMortesDiario.selectAll(".lineDecretos")
						  .data(data_decretos).enter()
						  .append("line")
						    .attr("class", "lineDecretos")
					        .attr("x1", function(d) { return xScaleMortesDiario(d.Data); })
					        .attr("x2", function(d) { return xScaleMortesDiario(d.Data); })
					        .attr("y1", function(d) { return yScaleDecretosMortes(0); })
					        .attr("y2", function(d) { return yScaleDecretosMortes(d.y); })	
					        .attr("stroke", function(d) {
			                  	if (d.flexibilizacao ){
			                  		return "#1a9850";
			                  	} else {
			                  		return "#d73027";
			                  	}
			                 })

   		 var tooltipDecretos = gMortesDiario.append("text")
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
			gMortesDiario.selectAll(".tooltip-line")
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

	    circleLine = gMortesDiario.selectAll("circle")
	                                   .data(data_decretos)
	    circleLine.enter().append('circle')
	                       .attr("cx", function(d) {
	                          return xScaleMortesDiario(d.Data);
	                       })
	                       .attr("cy", function(d) {
	                          return yScaleDecretosMortes(d.y);
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

	    gMortesDiario.selectAll("circle")
                  .on("mouseover", mouseoverDecretos)
                  .on("mouseout", mouseoutDecretos);	                          	 
	}) 
});