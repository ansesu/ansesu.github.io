//Margin
const marginSuspeitosEncerradosDiario = { top: 5.5, right: 5, bottom: 100, left: 63 };

//Width and height
const widthSuspeitosEncerradosDiario = 600 - marginSuspeitosEncerradosDiario.left - marginSuspeitosEncerradosDiario.right;
const heightSuspeitosEncerradosDiario = 375 - marginSuspeitosEncerradosDiario.top - marginSuspeitosEncerradosDiario.bottom;

//For converting data
var parseTimeSuspeitosEncerradosDiario = d3.timeParse("%Y-%m-%d");

//Load in the data			
d3.csv("data/suspeitos_encerrados_diario.csv")
  .then(function(data) {	
	///Parse data and sort values by date
    data.forEach(function(d) {
    	d.Data = parseTimeSuspeitosEncerradosDiario(d.Data);
    	d.Suspeitos_diario = parseInt(d.Suspeitos_diario);
    	d.Encerrados_diario = parseInt(d.Encerrados_diario);
    	d.moving_average_suspeitos = parseFloat(d.moving_average_suspeitos)
    });
    data.sort(function(a, b) {
        return a.Data - b.Data;
    });
	//Create scale functions
	xScaleSuspeitosEncerradosDiario = d3.scaleTime()
          						.domain([
          							d3.min(data, function(d) { return d.Data; }),
          							d3.max(data, function(d) { return d.Data; })
          						])
				           		.range([0, widthSuspeitosEncerradosDiario]);   
	xBand = d3.scaleBand()
			   .domain(data.map(function(d) { return d.Data; }))
	  		   .rangeRound([0, widthSuspeitosEncerradosDiario])
	  		   .padding(0.1)

	maxSuspeitosDiario = d3.max(data, function(d) { return d.Suspeitos_diario; }); 
	maxEncerradosDiario = d3.max(data, function(d) { return d.Encerrados_diario; });
	maxSuspeitosEncerradosDiario = d3.max([maxSuspeitosDiario,maxEncerradosDiario])

	yScaleSuspeitosEncerradosDiario = d3.scaleLinear()
          						.domain([
          							0,
          							maxSuspeitosEncerradosDiario
          						])
          						.range([heightSuspeitosEncerradosDiario, 0]);  
           							
	yScaleDecretosSuspeitosEncerrados = d3.scaleLinear()
  						.domain([-4,4])
          				.range([heightSuspeitosEncerradosDiario+marginSuspeitosEncerradosDiario.bottom-5, heightSuspeitosEncerradosDiario+50]);
	//Create SVG element in chart id element
	const svgSuspeitosEncerradosDiario = d3.select('#suspeitos_encerrados_diario')
    		              			.append('svg')
    		              			.attr("class", "content")
    		               			.attr("viewBox", `0 0 ${widthSuspeitosEncerradosDiario + marginSuspeitosEncerradosDiario.left + marginSuspeitosEncerradosDiario.right} ${heightSuspeitosEncerradosDiario + marginSuspeitosEncerradosDiario.top + marginSuspeitosEncerradosDiario.bottom}`)
    		               			.attr("preserveAspectRatio", "xMidYMid meet")

	var gSuspeitosEncerradosDiario = svgSuspeitosEncerradosDiario.append("g")
	            	        					  .attr("transform", "translate(" + marginSuspeitosEncerradosDiario.left + "," + marginSuspeitosEncerradosDiario.top + ")");

	//Create axis
	var xAxisSuspeitosEncerradosDiario = d3.axisBottom(xScaleSuspeitosEncerradosDiario)
									.tickFormat(formatAsMonth)
          					        .tickSize(3);
	var xAxisSuspeitosEncerradosDiarioDecretos = d3.axisBottom(xScaleSuspeitosEncerradosDiario)  
          					               .tickValues([])
          					               .tickSize(0);          					       
	var yAxisSuspeitosEncerradosDiario = d3.axisLeft(yScaleSuspeitosEncerradosDiario)
          					       .tickSize(3);

	gSuspeitosEncerradosDiario.append("g")
		    		  .attr("class", "xAxis")
		    		  .attr("transform", "translate(0," + heightSuspeitosEncerradosDiario + ")")
		    		  .call(xAxisSuspeitosEncerradosDiario)
		    		  .select(".domain")
		    		  .attr("stroke","#525252")
		    		  .attr("stroke-width","0");
	gSuspeitosEncerradosDiario.append("g")
		    		  .attr("class", "xAxisDecretos")
		    		  .attr("transform", "translate(0," + (heightSuspeitosEncerradosDiario+(marginSuspeitosEncerradosDiario.bottom+50-5)/2) + ")")
		    		  .call(xAxisSuspeitosEncerradosDiarioDecretos)
		    		  .select(".domain")
		    		  .attr("stroke","#525252")
		    		  .attr("stroke-width","1");		    		  
	gSuspeitosEncerradosDiario.append("g")
		    		  .attr("class", "yAxis")
		    		  .attr("transform", "translate(0,0)")
		    		  .call(yAxisSuspeitosEncerradosDiario)

    //Create axis label
    gSuspeitosEncerradosDiario.append("text")
		    	      .attr("class", "axis-title")
		    	      .attr("transform", "rotate(-90)")
		    	      .style("text-anchor", "middle")
		    	      .attr("y",-62)
		    	      .attr("x",-heightSuspeitosEncerradosDiario/2)
		    	      .attr("dy", ".71em")
		    	      .text("Casos diários");
    gSuspeitosEncerradosDiario.append("text")
    				  .attr("position", "absolute")
		    	      .attr("y",heightSuspeitosEncerradosDiario + 40)
		    	      .attr("x",0)
		    	      .text("Linha do tempo dos decretos")
		    	      .attr("font-size", "13");
  //Create legend
  var legendSuspeitosEncerrados = gSuspeitosEncerradosDiario.selectAll('.legend')
					                                        .data([{name:"Suspeitos", color:"#e5c494"},
					                                    	       {name:"Encerrados", color:"#80b1d3"}])
					                                        .enter().append('g')
					                                        .attr('class', 'legend');
  legendSuspeitosEncerrados.append('rect')
			                  .attr('x', 10)
			                  .attr('y', function(d, i) {
			                    return i * 17.3;
			                  })
			                  .attr('width', 12)
			                  .attr('height', 12)
			                  .style('fill', function(d) {
			                    return d.color;
			                  });
  legendSuspeitosEncerrados.append('text')
			                  .attr('x', 25)
			                  .attr('y', function(d, i) {
			                     return (i * 17.3)+11;
			                   })
			                  .text(function(d) {
			                    return d.name;
			                  });        	      
    // Add first decretos
	// d3.csv("data/decretos_first.csv")
	//   .then(function(data_decretos_first) {	
	//     data_decretos_first.forEach(function(d) {
	//     	d.Data = parseTimeSuspeitosEncerradosDiario(d.Data);
	//     	d.flexibilizacao = (d.flexibilizacao === 'True');
	//     });
 
	// 	gSuspeitosEncerradosDiario.selectAll(".lineDecretosFirst")
	// 					  .data(data_decretos_first).enter()
	// 					  .append("line")
	// 					    .attr("class", "lineDecretosFirst")
	// 				        .attr("x1", function(d) { return xScaleSuspeitosEncerradosDiario(d.Data); })
	// 				        .attr("x2", function(d) { return xScaleSuspeitosEncerradosDiario(d.Data); })
	// 				        .attr("y1", function(d) { return yScaleSuspeitosEncerradosDiario(0); })
	// 				        .attr("y2", function(d) { return yScaleSuspeitosEncerradosDiario(maxSuspeitosEncerradosDiario); })	
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
	var focusSuspeitosEncerradosDiarioText = gSuspeitosEncerradosDiario.append("g")
	                          							.attr("class", "focus");
	focusSuspeitosEncerradosDiarioText.append("text")
	            			  .attr("class", "tooltip-daily-suspeitos tooltip-text")
	focusSuspeitosEncerradosDiarioText.append("text")
							  .attr("class", "tooltip-moving-average-suspeitos tooltip-text")
	focusSuspeitosEncerradosDiarioText.append("text")
	            			  .attr("class", "tooltip-daily-encerrados tooltip-text")
	focusSuspeitosEncerradosDiarioText.append("text")
							  .attr("class", "tooltip-moving-average-encerrados tooltip-text")							  	            			  
	focusSuspeitosEncerradosDiarioText.append("text")
	          				    .attr("class", "tooltip-date")             

	// tooltip mouseover event handler
	var mouseoverSuspeitosEncerradosDiario = function(event, d) {
		d3.select(this)
		   .transition()
		   .duration(300) 		  
		   .attr("fill", "#525252");

	    focusSuspeitosEncerradosDiarioText.select("#suspeitos_encerrados_diario .tooltip-moving-average-encerrados")
				                    .text(function() { return "Média móvel encerrados: " + parseFloat(d.moving_average_encerrados).toFixed(1) })
				                    .attr("position", "absolute")
				                    .attr("y", heightSuspeitosEncerradosDiario-140)
				                    .attr("x", 10);

	    focusSuspeitosEncerradosDiarioText.select("#suspeitos_encerrados_diario .tooltip-moving-average-suspeitos")
				                    .text(function() { return "Média móvel suspeitos: " + parseFloat(d.moving_average_suspeitos).toFixed(1) })
				                    .attr("position", "absolute")
				                    .attr("y", heightSuspeitosEncerradosDiario-155)
				                    .attr("x", 10);				                    

	    focusSuspeitosEncerradosDiarioText.select("#suspeitos_encerrados_diario .tooltip-daily-suspeitos")
				                    .text(function() { return "Suspeitos diários: " + formatValue(d.Suspeitos_diario) })
				                    .attr("position", "absolute")
				                    .attr("y", heightSuspeitosEncerradosDiario-170)
				                    .attr("x", 10);

	    focusSuspeitosEncerradosDiarioText.select("#suspeitos_encerrados_diario .tooltip-daily-encerrados")
				                    .text(function() { return "Encerrados diários: " + parseFloat(d.Encerrados_diario)})
				                    .attr("position", "absolute")
				                    .attr("y", heightSuspeitosEncerradosDiario-185)
				                    .attr("x", 10);				
                    
	    focusSuspeitosEncerradosDiarioText.select("#suspeitos_encerrados_diario .tooltip-date")
				                    .text(function() { return formatAsDate(d.Data); })
				                    .attr("position", "absolute")				                    
				                    .attr("y", heightSuspeitosEncerradosDiario-200)
				                    .attr("x", 10);

        focusSuspeitosEncerradosDiarioText.attr("opacity", "1")
	};
	// tooltip mouseout event handler
	var mouseoutSuspeitosEncerradosDiario = function(d) {
		d3.select(this)
		  .transition()
		   .duration(300) // ms		
		   .attr("fill", function () {
		   	if (d3.select(this).attr("class") === "barSuspeitosDiario") {
		   		return "#e5c494";
		   	} else {
		   		return "#80b1d3";
		   	}
		   });		   	

		focusSuspeitosEncerradosDiarioText.attr("opacity", "0")  
                   
	};    	      
	// Add bars
	gSuspeitosEncerradosDiario.selectAll(".barSuspeitosDiario")
						.data(data)
						.enter()
						.append("rect")
						 .attr("class", "barSuspeitosDiario")
						 .attr("x", function(d) { return xScaleSuspeitosEncerradosDiario(d.Data); })
						 .attr("y", function(d) { return yScaleSuspeitosEncerradosDiario(d.Suspeitos_diario); })
						 .attr("width", xBand.bandwidth())
						 .attr("height", function(d) { return heightSuspeitosEncerradosDiario - yScaleSuspeitosEncerradosDiario(d.Suspeitos_diario); })
						 .attr("fill", "#e5c494")
						 .attr("opacity", ".8")
						 .on("mouseover", mouseoverSuspeitosEncerradosDiario)
						 .on("mouseout", mouseoutSuspeitosEncerradosDiario);
	gSuspeitosEncerradosDiario.selectAll(".barEncerradosDiario")
						.data(data)
						.enter()
						.append("rect")
						 .attr("class", "barEncerradosDiario")
						 .attr("x", function(d) { return xScaleSuspeitosEncerradosDiario(d.Data); })
						 .attr("y", function(d) { return yScaleSuspeitosEncerradosDiario(d.Encerrados_diario); })
						 .attr("width", xBand.bandwidth())
						 .attr("height", function(d) { return heightSuspeitosEncerradosDiario - yScaleSuspeitosEncerradosDiario(d.Encerrados_diario); })
						 .attr("fill", "#80b1d3")
						 .attr("opacity", ".8")
						 .on("mouseover", mouseoverSuspeitosEncerradosDiario)
						 .on("mouseout", mouseoutSuspeitosEncerradosDiario);
	var lineSuspeitosDiario = d3.line()
          				          .x(function(d) { return xScaleSuspeitosEncerradosDiario(d.Data); })
          				          .y(function(d) { return yScaleSuspeitosEncerradosDiario(d.moving_average_suspeitos); });

	pathSuspeitosDiario = gSuspeitosEncerradosDiario.append("path")
		    		                                  .attr("class", "line")
		    		                                  .datum(data)
		    		                                  .attr("d", lineSuspeitosDiario)
		                                              .attr("stroke", "#e3af64")
	var lineEncerradosDiario = d3.line()
          				          .x(function(d) { return xScaleSuspeitosEncerradosDiario(d.Data); })
          				          .y(function(d) { return yScaleSuspeitosEncerradosDiario(d.moving_average_encerrados); });

	pathEncerradosDiario = gSuspeitosEncerradosDiario.append("path")
				    		                                  .attr("class", "line")
				    		                                  .datum(data)
				    		                                  .attr("d", lineEncerradosDiario)
				                                              .attr("stroke", "#80b1d3")				                                              
    totalLengthSuspeitosDiario = pathSuspeitosDiario.node().getTotalLength(); 
    totalLengthEncerradosDiario = pathEncerradosDiario.node().getTotalLength();                                          

    function updateSuspeitosEncerradosDiario() {
	    cb = d3.select(".checkboxSuspeitosEncerradosDiario")
	    // If the box is check, I show the group
	    if (cb.property("checked")) {
			pathSuspeitosDiario = gSuspeitosEncerradosDiario.append("path")
		    		                                  .attr("class", "line")
		    		                                  .attr("d", lineSuspeitosDiario(data))
		    		                                  .attr("stroke", "#e3af64")	
		    		                                  .attr("fill", "none")
            pathSuspeitosDiario              
                          .attr("stroke-dasharray", totalLengthSuspeitosDiario)
                          .attr("stroke-dashoffset", totalLengthSuspeitosDiario)	
                           .transition()	    		                                  
                           .duration(3000)
                           .ease(d3.easeLinear)    
                           .attr("stroke-dashoffset", 0);  

			pathEncerradosDiario = gSuspeitosEncerradosDiario.append("path")
		    		                                  .attr("class", "line")
		    		                                  .attr("d", lineEncerradosDiario(data))
		    		                                  .attr("stroke", "#80b1d3")	
		    		                                  .attr("fill", "none")
            pathEncerradosDiario              
                          .attr("stroke-dasharray", totalLengthEncerradosDiario)
                          .attr("stroke-dashoffset", totalLengthEncerradosDiario)	
                           .transition()	    		                                  
                           .duration(3000)
                           .ease(d3.easeLinear)    
                           .attr("stroke-dashoffset", 0);                                											                                                      	
	    // Otherwise I hide it
	    } else {
	    	pathSuspeitosDiario.remove()
	    	pathEncerradosDiario.remove()
	    }    	
    }

    d3.selectAll(".checkboxSuspeitosEncerradosDiario").on("change", updateSuspeitosEncerradosDiario);

	d3.csv("data/decretos.csv")
	  .then(function(data_decretos) {	
	    data_decretos.forEach(function(d) {
	    	d.Data = parseTimeSuspeitosEncerradosDiario(d.Data);
	    	d.y = parseInt(d.y);
	    	d.resumo = String(d.resumo);
	    	d.flexibilizacao = (d.flexibilizacao === 'True')
	    });
 
		gSuspeitosEncerradosDiario.selectAll(".lineDecretos")
						  .data(data_decretos).enter()
						  .append("line")
						    .attr("class", "lineDecretos")
					        .attr("x1", function(d) { return xScaleSuspeitosEncerradosDiario(d.Data); })
					        .attr("x2", function(d) { return xScaleSuspeitosEncerradosDiario(d.Data); })
					        .attr("y1", function(d) { return yScaleDecretosSuspeitosEncerrados(0); })
					        .attr("y2", function(d) { return yScaleDecretosSuspeitosEncerrados(d.y); })	
					        .attr("stroke", function(d) {
			                  	if (d.flexibilizacao ){
			                  		return "#1a9850";
			                  	} else {
			                  		return "#d73027";
			                  	}
			                 })

   		 var tooltipDecretos = gSuspeitosEncerradosDiario.append("text")
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
			gSuspeitosEncerradosDiario.selectAll(".tooltip-line")
	  			 			   .call(wrap, 300) 

        	d3.selectAll('#suspeitos_encerrados_diario .legend')
        	  .transition()
	           .duration(500)
	           .style("display", "none");	  			 			   	      
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

          d3.selectAll('#suspeitos_encerrados_diario .legend')
        	  .transition()
	           .duration(300)
	           .delay(300)
	           .style("display", null);	                                        
	    }; 

	    circleLine = gSuspeitosEncerradosDiario.selectAll("circle")
	                                   .data(data_decretos)
	    circleLine.enter().append('circle')
	                       .attr("cx", function(d) {
	                          return xScaleSuspeitosEncerradosDiario(d.Data);
	                       })
	                       .attr("cy", function(d) {
	                          return yScaleDecretosSuspeitosEncerrados(d.y);
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

	    gSuspeitosEncerradosDiario.selectAll("circle")
                  .on("mouseover", mouseoverDecretos)
                  .on("mouseout", mouseoutDecretos);	                          	 
	}) 
});