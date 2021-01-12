//Margin
const marginConfirmadosDiario = { top: 0, right: 5, bottom: 100, left: 53 };

//Width and height
const widthConfirmadosDiario = 600 - marginConfirmadosDiario.left - marginConfirmadosDiario.right;
const heightConfirmadosDiario = 375 - marginConfirmadosDiario.top - marginConfirmadosDiario.bottom;

//For converting data
var parseTimeConfirmadosDiario = d3.timeParse("%Y-%m-%d");

//Load in the data			
d3.csv("data/confirmados_diario.csv")
  .then(function(data) {	
	///Parse data and sort values by date
    data.forEach(function(d) {
    	d.Data = parseTimeConfirmadosDiario(d.Data);
    	d.Confirmados_diario = parseInt(d.Confirmados_diario);
    	d.moving_average = parseFloat(d.moving_average)
    });
    data.sort(function(a, b) {
        return a.Data - b.Data;
    });
	//Create scale functions
	xScaleConfirmadosDiario = d3.scaleTime()
          						.domain([
          							d3.min(data, function(d) { return d.Data; }),
          							d3.max(data, function(d) { return d.Data; })
          						])
				           		.range([0, widthConfirmadosDiario]);   
	xBand = d3.scaleBand()
			   .domain(data.map(function(d) { return d.Data; }))
	  		   .rangeRound([0, widthConfirmadosDiario])
	  		   .padding(0.1)
	yScaleConfirmadosDiario = d3.scaleLinear()
          						.domain([
          							0,
          							d3.max(data, function(d) { return d.Confirmados_diario; })
          						])
          						.range([heightConfirmadosDiario, 0]);  
    maxConfirmadosDiario = d3.max(data, function(d) { return d.Confirmados_diario; });        							
	yScaleDecretosConfirmados = d3.scaleLinear()
  						.domain([-4,4])
          				.range([heightConfirmadosDiario+marginConfirmadosDiario.bottom-5, heightConfirmadosDiario+50]);
	//Create SVG element in chart id element
	const svgConfirmadosDiario = d3.select('#confirmados_diario')
    		              			.append('svg')
    		              			.attr("class", "content")
    		               			.attr("viewBox", `0 0 ${widthConfirmadosDiario + marginConfirmadosDiario.left + marginConfirmadosDiario.right} ${heightConfirmadosDiario + marginConfirmadosDiario.top + marginConfirmadosDiario.bottom}`)
    		               			.attr("preserveAspectRatio", "xMidYMid meet")

	var gConfirmadosDiario = svgConfirmadosDiario.append("g")
	            	        					  .attr("transform", "translate(" + marginConfirmadosDiario.left + "," + marginConfirmadosDiario.top + ")");

	//Create axis
	var xAxisConfirmadosDiario = d3.axisBottom(xScaleConfirmadosDiario)
									.tickFormat(formatAsMonth)
          					        .tickSize(3);
	var xAxisConfirmadosDiarioDecretos = d3.axisBottom(xScaleConfirmadosDiario)  
          					               .tickValues([])
          					               .tickSize(0);          					       
	var yAxisConfirmadosDiario = d3.axisLeft(yScaleConfirmadosDiario)
          					       .tickSize(3);

	gConfirmadosDiario.append("g")
		    		  .attr("class", "xAxis")
		    		  .attr("transform", "translate(0," + heightConfirmadosDiario + ")")
		    		  .call(xAxisConfirmadosDiario)
		    		  .select(".domain")
		    		  .attr("stroke","#252525")
		    		  .attr("stroke-width","0");
	gConfirmadosDiario.append("g")
		    		  .attr("class", "xAxisDecretos")
		    		  .attr("transform", "translate(0," + (heightConfirmadosDiario+(marginConfirmadosDiario.bottom+50-5)/2) + ")")
		    		  .call(xAxisConfirmadosDiarioDecretos)
		    		  .select(".domain")
		    		  .attr("stroke","#252525")
		    		  .attr("stroke-width","1");		    		  
	gConfirmadosDiario.append("g")
		    		  .attr("class", "yAxis")
		    		  .attr("transform", "translate(0,0)")
		    		  .call(yAxisConfirmadosDiario)

    //Create axis label
    gConfirmadosDiario.append("text")
		    	      .attr("class", "axis-title")
		    	      .attr("transform", "rotate(-90)")
		    	      .style("text-anchor", "middle")
		    	      .attr("y",-52)
		    	      .attr("x",-heightConfirmadosDiario/2)
		    	      .attr("dy", ".71em")
		    	      .text("Casos diários de COVID-19");
    gConfirmadosDiario.append("text")
    				  .attr("position", "absolute")
		    	      .attr("y",heightConfirmadosDiario + 40)
		    	      .attr("x",0)
		    	      .text("Linha do tempo dos decretos em Maringá")
		    	      .attr("font-size", "13");
    // Add first decretos
	// d3.csv("data/decretos_first.csv")
	//   .then(function(data_decretos_first) {	
	//     data_decretos_first.forEach(function(d) {
	//     	d.Data = parseTimeConfirmadosDiario(d.Data);
	//     	d.flexibilizacao = (d.flexibilizacao === 'True');
	//     });
 
	// 	gConfirmadosDiario.selectAll(".lineDecretosFirst")
	// 					  .data(data_decretos_first).enter()
	// 					  .append("line")
	// 					    .attr("class", "lineDecretosFirst")
	// 				        .attr("x1", function(d) { return xScaleConfirmadosDiario(d.Data); })
	// 				        .attr("x2", function(d) { return xScaleConfirmadosDiario(d.Data); })
	// 				        .attr("y1", function(d) { return yScaleConfirmadosDiario(0); })
	// 				        .attr("y2", function(d) { return yScaleConfirmadosDiario(maxConfirmadosDiario); })	
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
	var focusConfirmadosDiarioText = gConfirmadosDiario.append("g")
	                          							.attr("class", "focus");
	focusConfirmadosDiarioText.append("text")
	            			  .attr("class", "tooltip-daily-cases tooltip-text")

	focusConfirmadosDiarioText.append("text")
							  .attr("class", "tooltip-moving-average tooltip-text")
	            			  
	focusConfirmadosDiarioText.append("text")
	          				    .attr("class", "tooltip-date")             

	// tooltip mouseover event handler
	var mouseoverConfirmadosDiario = function(event, d) {
		d3.select(this)
		   .transition()
		   .duration(300) 		  
		   .attr("fill", "#ff7f00");

	    focusConfirmadosDiarioText.select("#confirmados_diario .tooltip-daily-cases")
				                    .text(function() { return "Casos diários: " + formatValue(d.Confirmados_diario) })
				                    .attr("position", "absolute")
				                    .attr("y", heightConfirmadosDiario-85)
				                    .attr("x", 10);
	    focusConfirmadosDiarioText.select("#confirmados_diario .tooltip-moving-average")
				                    .text(function() { return "Média movel: " + parseFloat(d.moving_average).toFixed(1)})
				                    .attr("position", "absolute")
				                    .attr("y", heightConfirmadosDiario-70)
				                    .attr("x", 10);				

			                    
	    focusConfirmadosDiarioText.select("#confirmados_diario .tooltip-date")
				                    .text(function() { return formatAsDate(d.Data); })
				                    .attr("position", "absolute")				                    
				                    .attr("y", heightConfirmadosDiario-100)
				                    .attr("x", 10);
        focusConfirmadosDiarioText.attr("opacity", "1")
	};
	// tooltip mouseout event handler
	var mouseoutConfirmadosDiario = function(d) {
		d3.select(this)
		  .transition()
		   .duration(300) // ms				  
		   .attr("fill", "#404040");

		focusConfirmadosDiarioText.attr("opacity", "0")                      
	};    	      
	// Add bars
	gConfirmadosDiario.selectAll(".barConfirmadosDiario")
						.data(data)
						.enter()
						.append("rect")
						 .attr("class", "barConfirmadosDiario")
						 .attr("x", function(d) { return xScaleConfirmadosDiario(d.Data); })
						 .attr("y", function(d) { return yScaleConfirmadosDiario(d.Confirmados_diario); })
						 .attr("width", xBand.bandwidth())
						 .attr("height", function(d) { return heightConfirmadosDiario - yScaleConfirmadosDiario(d.Confirmados_diario); })
						 .attr("fill", "#404040")
						 .on("mouseover", mouseoverConfirmadosDiario)
						 .on("mouseout", mouseoutConfirmadosDiario);

	var lineConfirmadosDiario = d3.line()
          				          .x(function(d) { return xScaleConfirmadosDiario(d.Data); })
          				          .y(function(d) { return yScaleConfirmadosDiario(d.moving_average); });

	pathConfirmadosDiario = gConfirmadosDiario.append("path")
    		                                  .attr("class", "line")
    		                                  .datum(data)
    		                                  .attr("d", lineConfirmadosDiario)
                                              .attr("stroke", "#252525")
    totalLengthConfirmadosDiario = pathConfirmadosDiario.node().getTotalLength();                                          
    function updateConfirmadosDiario() {
	    cb = d3.select(".checkboxConfirmadosDiario")
	    // If the box is check, I show the group
	    if (cb.property("checked")) {
			pathConfirmadosDiario = gConfirmadosDiario.append("path")
		    		                                  .attr("class", "line")
		    		                                  .attr("d", lineConfirmadosDiario(data))
		    		                                  .attr("stroke", "#252525")	
		    		                                  .attr("fill", "none")

            pathConfirmadosDiario              
                          .attr("stroke-dasharray", totalLengthConfirmadosDiario)
                          .attr("stroke-dashoffset", totalLengthConfirmadosDiario)	
                           .transition()	    		                                  
                           .duration(3000)
                           .ease(d3.easeLinear)    
                           .attr("stroke-dashoffset", 0);     											   

		                                                   	
	    // Otherwise I hide it
	    } else {
	    	pathConfirmadosDiario.remove()
	    }    	
    }

    d3.selectAll(".checkboxConfirmadosDiario").on("change", updateConfirmadosDiario);

	d3.csv("data/decretos.csv")
	  .then(function(data_decretos) {	
	    data_decretos.forEach(function(d) {
	    	d.Data = parseTimeConfirmadosDiario(d.Data);
	    	d.y = parseInt(d.y);
	    	d.resumo = String(d.resumo);
	    	d.flexibilizacao = (d.flexibilizacao === 'True')
	    });
 
		gConfirmadosDiario.selectAll(".lineDecretos")
						  .data(data_decretos).enter()
						  .append("line")
						    .attr("class", "lineDecretos")
					        .attr("x1", function(d) { return xScaleConfirmadosDiario(d.Data); })
					        .attr("x2", function(d) { return xScaleConfirmadosDiario(d.Data); })
					        .attr("y1", function(d) { return yScaleDecretosConfirmados(0); })
					        .attr("y2", function(d) { return yScaleDecretosConfirmados(d.y); })	
					        .attr("stroke", function(d) {
			                  	if (d.flexibilizacao ){
			                  		return "#1a9850";
			                  	} else {
			                  		return "#d73027";
			                  	}
			                 })

   		 var tooltipDecretos = gConfirmadosDiario.append("text")
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
			gConfirmadosDiario.selectAll(".tooltip-line")
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

	    circleLine = gConfirmadosDiario.selectAll("circle")
	                                   .data(data_decretos)
	    circleLine.enter().append('circle')
	                       .attr("cx", function(d) {
	                          return xScaleConfirmadosDiario(d.Data);
	                       })
	                       .attr("cy", function(d) {
	                          return yScaleDecretosConfirmados(d.y);
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

	    gConfirmadosDiario.selectAll("circle")
                  .on("mouseover", mouseoverDecretos)
                  .on("mouseout", mouseoutDecretos);	                          	 
	}) 
});