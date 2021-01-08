//Margin
const marginOcupacao = { top: 10, right: 10, bottom: 25, left: 53 };

//Width and Height
const widthOcupacao = 600 - marginOcupacao.left - marginOcupacao.right;
const heightOcupacao = 300 - marginOcupacao.top - marginOcupacao.bottom;

//For converting data
var parseTimeOcupacao = d3.timeParse("%Y-%m-%d");


//Create SVG element
const svgOcupacao = d3.select('#ocupacao')
                      .append('svg')
                       .attr("class", "content")
                       .attr("viewBox", `0 0 ${widthOcupacao + marginOcupacao.left + marginOcupacao.right} ${heightOcupacao + marginOcupacao.top + marginOcupacao.bottom}`)
                       .attr("preserveAspectRatio", "xMidYMid meet")
    
var gOcupacao = svgOcupacao.append("g")
                            .attr("transform", "translate(" + marginOcupacao.left + "," + marginOcupacao.top + ")");

// Create y-axis
yScaleOcupacao = d3.scaleLinear()
                    .domain([0,100])
                    .range([heightOcupacao, 0]); 
var yAxisOcupacao = d3.axisLeft(yScaleOcupacao)
                      .ticks(7)
                      .tickSize(3);

gOcupacao.append("g")
          .attr("class", "yAxis")
          .attr("transform", "translate(0,0)")
          .call(yAxisOcupacao)

//Create axis label
gOcupacao.append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .style("text-anchor", "middle")
          .attr("y",-52)
          .attr("x",-heightOcupacao/2)
          .attr("dy", ".71em")
          .text("Ocupação dos leitos (%)");

function plotOcupacao(data_path, first) {
  //Load in the data
  d3.csv(data_path)
    .then(function(data) {			
    //Create categorical color scale
    if (data_path == "data/ocupacao.csv") {
      var colorOcupacao = d3.scaleOrdinal(['#d53e4f', '#88419d', '#35978f']); 
      var x_tooltip = 10;
      var y_tooltip = 17;
    } else {
      var colorOcupacao = d3.scaleOrdinal(['#4d4d4d', '#de77ae', '#f1a340']); 
      var x_tooltip = 230;
      var y_tooltip = 213   
    }
     
    colorOcupacao.domain(Object.keys(data[0]).slice(1, 4));

    //Parse data
    data.forEach(function(d) {
      d.Date = parseTimeOcupacao(d.Date);
      d.Enfermaria = parseFloat(d.Enfermaria.replace(',','.'));
      d.UTI = parseFloat(d.UTI.replace(',','.'));
      d["UTI neonatal"] = parseFloat(d["UTI neonatal"].replace(',','.'));           
      d.Enfermaria_total = parseInt(d.Enfermaria_total);
      d.UTI_total = parseInt(d.UTI_total);
      d["UTI neonatal_total"] = parseInt(d["UTI neonatal_total"]);
    });

    //Create categories (for each line plot)
    var categoriesOcupacao = colorOcupacao.domain().map(function(name) {
    	return {
    		name: name,
        	values: data.map(function(d) {
        		if (Number.isNaN(d[name])) {
              		return {
                  		Date: d.Date,
              			Occupancy: 0
            		};        			
          		} else {
              		return {
                  		Date: d.Date,
              			Occupancy: parseInt(d[name])
            		};          		
          		}

        	})
        };
    });

    //Sort dates
    data.sort(function(a, b) {
        return a.Date - b.Date;
    });

		//Create legend
		var legendRectOcupacao = gOcupacao.selectAll('#ocupacao .legendRect')
		                                  .data(categoriesOcupacao)
		// legendRectOcupacao.exit()
		//                   .transition()
		//                    .duration(600)
		//                    .attr("opacity", "0")
		//                    .remove() 

		legendRectOcupacao.enter().append('rect')
		                  .merge(legendRectOcupacao)
		                  .transition()
		                   .duration(600)
		                   .attr("class", "legendRect")
		                   .attr('x', 10)
		                   .attr('y', function(d, i) {
		                  		return i * 17.3;
		          	       })
		        	       .attr('width', 12)
		        	       .attr('height', 12)
		                   .style('fill', function(d) {
		                 		return colorOcupacao(d.name);
		                   });

		var legendTextOcupacao = gOcupacao.selectAll('#ocupacao .legend')
		                                  .data(categoriesOcupacao)
		// legendTextOcupacao.exit()
		//                   .transition()
		//                    .duration(600)
		//                    .attr("opacity", "0")
		//                    .remove()    

		legendTextOcupacao.enter().append('text')
		                  .merge(legendTextOcupacao)
		                  .transition()
		                   .duration(0)                    
		                   .attr("class", "legend")
		                   .attr('x', 25)
		                   .attr('y', function(d, i) {
		      		           return (i * 17.3)+11;
		                    })
		                   .text(function(d) {
		                    if (data_path == "data/ocupacao.csv") {
		                    	return d.name;
		                    } else {
		                        return d.name + " COVID";
		                    }
		      	           });
		//Create scale functions
		xScaleOcupacao = d3.scaleTime()
		                    .domain(d3.extent(data, function(d) { return d.Date; }))
		                    .range([0, widthOcupacao]);
		//Create axis
		var xAxisOcupacao = d3.axisBottom(xScaleOcupacao)
		          		       .ticks(7)
		          		       .tickFormat(formatAsMonth)
		          		       .tickSize(3);
		if (first) {
		gOcupacao.append("g")
		         .attr("class", "xAxis")
		         .attr("transform", "translate(0," + heightOcupacao + ")")    
		         .call(xAxisOcupacao)
		         .select(".domain")
		          .attr("stroke","#252525")
		          .attr("stroke-width","0");
		} else {
		gOcupacao.select('.xAxis')
		         .transition()
		          .duration(300)
		          .ease(d3.easeLinear)
		          .call(xAxisOcupacao);    
		}


		//Create each category object
		var categoryOcupacao = gOcupacao.selectAll("#ocupacao .line")
		                                .data(categoriesOcupacao)

		//Create lines
		var lineOcupacao = d3.line()
		                     .x( function(d) { return xScaleOcupacao(d.Date); })
		                     .y( function(d) { return yScaleOcupacao(d.Occupancy); });

		categoryOcupacao.enter()
		                .append("path")
		      		    .attr("class", "line")
		                .merge(categoryOcupacao)
		                .transition()
		                  .duration(500)
		                  .ease(d3.easeLinear)
		    	          .attr("d", function(d) {
		    	       		   return lineOcupacao(d.values);
		    	          })
		    	          .style("stroke", function(d) {
		    	      		   return colorOcupacao(d.name);
		    	          });

     // Create tooltip
    var focusOcupacao = gOcupacao.append("g")
                                  .attr("class", "focus");

    focusOcupacao.append("path")
                  .attr("class", "hover-line")

    var linesOcupacao = document.getElementsByClassName('line');

    d3.selectAll('#ocupacao .focus-per-line') // circle disappears if data input is changed
    d3.selectAll('#ocupacao .hover-line') // circle disappears if data input is changed

    var focusPerLineOcupacao = focusOcupacao.selectAll('#ocupacao .focus-per-line')
                                             .data(categoriesOcupacao)
    // focusPerLineOcupacao.exit()
    //                     .transition()
    //                      .duration(0)
    //                      .attr("opacity", "0")
    //                      .remove();   
    focusPerLineOcupacao.enter().append("g")
                        .attr("class", "focus-per-line")
                        .append("circle") 
                        .merge(focusPerLineOcupacao)
                         .transition()
                          .duration(0)
                          .ease(d3.easeLinear)
                          .attr("r", 3)
                          .style("stroke", function(d) {
                            return colorOcupacao(d.name);
                          })
                          .style("fill", function(d) {
                            return colorOcupacao(d.name);
                          }); 
    d3.selectAll('#ocupacao .focus-per-line').style("display", "none")

    var tooltipTextDateOcupacao = gOcupacao.append("text")
            			                    .attr("class", "tooltip-date");	                                                                                 
    svgOcupacao.append('rect') 
                 .attr("class", "overlay")
                 .attr("transform", "translate(" + marginOcupacao.left + "," + marginOcupacao.top + ")")
                 .attr('width', widthOcupacao)
                 .attr('height', heightOcupacao)
                 .on("mouseover", function() {
                   	d3.selectAll('#ocupacao .tooltip-date').style("display", null); 
                   	d3.selectAll('#ocupacao .tooltip-text').style("display", null);
                    d3.selectAll('#ocupacao .focus-per-line').style("display", null) // circle disappears if data input is changed
                    d3.selectAll('#ocupacao .hover-line').style("display", null) // circle disappears if data input is changed                   
                 })
                 .on("mouseout", function() { 			
                   	d3.selectAll('#ocupacao .tooltip-date').style("display", "none"); 
                   	d3.selectAll('#ocupacao .tooltip-text').style("display", "none");
                    d3.selectAll('#ocupacao .focus-per-line').style("display", "none") // circle disappears if data input is changed
                    d3.selectAll('#ocupacao .hover-line').style("display", "none") // circle disappears if data input is changed                
                 })
                 .on('mousemove', event => mousemoveOcupacao(event));

    function mousemoveOcupacao(event) { // mouse moving over canvas
        var mouse = d3.pointer(event),
            x0 = xScaleOcupacao.invert(mouse[0]),
            bisectDate = d3.bisector(function(d) { return d.Date; }).left,
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            dTrue = x0 - d0.Date > d1.Date - x0 ? d1 : d0,
            idx = x0 - d0.Date > d1.Date - x0 ? i : i-1,
        xDate = dTrue.Date;
        d3.select("#ocupacao .hover-line")
           .attr("d", function() {
           		var dVar = "M" + xScaleOcupacao(xDate) + "," + heightOcupacao;
            	dVar += " " + xScaleOcupacao(xDate) + "," + 0;
           		return dVar;
           })
        d3.select('#ocupacao .tooltip-date')
           .text(formatAsDate(xDate))
           .attr("x", x_tooltip)
           .attr("y", heightOcupacao - y_tooltip - 13 - 3*11);

        var tooltipTextOcupacao = gOcupacao.selectAll('#ocupacao .tooltip-text')
                                            .data(categoriesOcupacao)             
    
        tooltipTextOcupacao.enter().append("text")
                   .merge(tooltipTextOcupacao)
                   .transition()
                    .duration(0)                       
                   .attr("class", "tooltip-text")
                   .text(function (d) {
                      var totalOccupancy = function() {
                        total = data[idx][d.name+"_total"];
                        if (Number.isNaN(total)) {
                          return "";
                        } else {
                          return " (" + Math.round(data[idx][d.name]*total/100)+ "/" + total + ")";
                        }
                      }  
                      if (Number.isNaN(data[idx][d.name])) {   
               		        return "";
               		    } else {
               		        return d.name + ": " + data[idx][d.name].toFixed(2) + "%" + totalOccupancy();
               		    }})
                   .attr("x", x_tooltip)
                   .attr("y", function (d,i) { return heightOcupacao - y_tooltip - (2-i)*15.5})
                d3.selectAll("#ocupacao .focus-per-line")
                   .attr("transform", function(d, i) { 
               	      d3.select(this).select('#ocupacao .focus-per-line circle')
           		        return "translate(" + xScaleOcupacao(xDate) + "," + yScaleOcupacao(data[idx][d.name]) +")";
                  });
    };
  });
}

plotOcupacao("data/ocupacao.csv", true)