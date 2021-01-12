//Margin
const marginMLine = { top: 10, right: 3, bottom: 25, left: 51 };

//Width and Height
const widthMLine = 600 - marginMLine.left - marginMLine.right;
const heightMLine = 300 - marginMLine.top - marginMLine.bottom;

//For converting data
var parseTimeMLine = d3.timeParse("%d/%m/%Y");

//Create categorical color scale
var colorMLine = d3.scaleOrdinal(['#1b9e77', '#e7298a', '#7570b3']);

//Load in the data
d3.csv("data/occupancy_maringa_data.csv")
  .then(function(data) {			
	//Assign a color to each occupancy columns
    colorMLine.domain(Object.keys(data[0]).slice(1, 4));

    //Parse data
    data.forEach(function(d) {
    	d.Date = parseTimeMLine(d.Date);
     	d.Infirmary = parseFloat(d.Infirmary.replace(',','.'));
     	d.ICU = parseFloat(d.ICU.replace(',','.'));
     	d["ICU (neonatal)"] = parseFloat(d["ICU (neonatal)"].replace(',','.'));			      
     	d.Enfermaria_total = parseInt(d.Enfermaria_total);
     	d.UTI_total = parseInt(d.UTI_total);
     	d["UTI (neonatal)_total"] = parseInt(d["UTI (neonatal)_total"]);
    });

	//Get median of dates
	medianMLine = d3.median(data, function(d) { return d.Date; })

	//Create categories (for each line plot)
    var categoriesMLine = colorMLine.domain().map(function(name) {
    	return {
    		name: name,
        	values: data.map(function(d) {
            	return {
                	Date: d.Date,
            		Occupancy: parseFloat(d[name])
          		};
        	})
        };
    });

    //Sort dates
    data.sort(function(a, b) {
        return a.Date - b.Date;
    });

	//Create scale functions
	xScaleMLine = d3.scaleTime()
          			 	 .domain(d3.extent(data, function(d) { return d.Date; }))
          			 	 .range([0, widthMLine]);
	yScaleMLine = d3.scaleLinear()
          				 .domain([0,100])
          				 .range([heightMLine, 0]);	

	//Create SVG element
	const svgMLine = d3.select('#multilineplot')
                	   .append('svg')
                	    .attr("class", "content")
                	    .attr("viewBox", `0 0 ${widthMLine + marginMLine.left + marginMLine.right} ${heightMLine + marginMLine.top + marginMLine.bottom}`)
                	    .attr("preserveAspectRatio", "xMidYMid meet")
	    
	var gMLine = svgMLine.append("g")
	                      .attr("transform", "translate(" + marginMLine.left + "," + marginMLine.top + ")");

	//Create legend
    var legendMLine = gMLine.selectAll('g')
                            .data(categoriesMLine)
                            .enter().append('g')
                             .attr('class', 'legend');
    legendMLine.append('rect')
                .attr('x', 10)
                .attr('y', function(d, i) {
               		return i * 16.3;
          	    })
        	      .attr('width', 10)
        	      .attr('height', 10)
                .style('fill', function(d) {
               		return colorMLine(d.name);
                });
    legendMLine.append('text')
                .attr('x', 25)
                .attr('y', function(d, i) {
      		         return (i * 16)+10;
                 })
                .text(function(d) {
        	      	return d.name;
      	        });

    //Create axis
	var xAxisMLine = d3.axisBottom(xScaleMLine)
          				   .ticks(7)
          				   .tickFormat(formatAsMonth)
          				   .tickSize(3);
	var yAxisMLine = d3.axisLeft(yScaleMLine)
				             .ticks(7)
				             .tickSize(3);
	gMLine.append("g")
    	   .attr("class", "xAxis")
    	   .attr("transform", "translate(0," + heightMLine + ")")
    	   .call(xAxisMLine)
    	   .select(".domain")
    	    .attr("stroke","#252525")
    	    .attr("stroke-width","0");
	gMLine.append("g")
	       .attr("class", "yAxis")
	       .attr("transform", "translate(0,0)")
	       .call(yAxisMLine)

	//Create axis label
    gMLine.append("text")
           .attr("class", "axis-title")
           .attr("transform", "rotate(-90)")
           .style("text-anchor", "middle")
           .attr("y",-50)
           .attr("x",-heightMLine/2)
           .attr("dy", ".71em")
           .text("Hospital beds occupancy (%)");

	//Create each category object
	var categoryMLine = gMLine.selectAll(".category")
                            .data(categoriesMLine)
                            .enter().append("g")
                             .attr("class", "category");

	//Create lines
	var lineMLine = d3.line()
          				  .x( function(d) { return xScaleMLine(d.Date); })
          				  .y( function(d) { return yScaleMLine(d.Occupancy); });

	categoryMLine.append("path")
      		     .attr("class", "multiline")
      	         .attr("d", function(d) {
      	         	return lineMLine(d.values);
      	         })
      	         .style("stroke", function(d) {
      	         	return colorMLine(d.name);
      	         });

	// Create tooltip
    var focusMLine = gMLine.append("g")
                           .attr("class", "focus");

    focusMLine.append("path")
              .attr("class", "hover-line")

    focusMLine.append("text")
              .attr("class", "tooltip-date");

    var linesMLine = document.getElementsByClassName('line');
    var focusPerLineMLine = focusMLine.selectAll('.focus-per-line')
                                      .data(categoriesMLine)
                                      .enter().append("g")
                                       .attr("class", "focus-per-line")
                                       		
    focusPerLineMLine.append("circle") 
                      .attr("opacity", "0")
                      .attr("r", 3)
                      .style("stroke", function(d) {
                      	return colorMLine(d.name);
                      }); 
    focusPerLineMLine.append("text");
    svgMLine.append('rect') 
             .attr("class", "overlay")
             .attr("transform", "translate(" + marginMLine.left + "," + marginMLine.top + ")")
             .attr('width', widthMLine)
             .attr('height', heightMLine)
             .on("mouseover", function() {
               	focusMLine.style("display", null); 
             })
             .on("mouseout", function() { 			        	
               	focusMLine.style("display", "none"); 
             })
             .on('mousemove', event => mousemoveMLine(event));

    function mousemoveMLine(event) { // mouse moving over canvas
        var mouse = d3.pointer(event),
            x0 = xScaleMLine.invert(mouse[0]),
            bisectDate = d3.bisector(function(d) { return d.Date; }).left,
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i];
        if (d1 == null){
            d1 = data[i - 1];
        }       
        var dTrue = x0 - d0.Data > d1.Data - x0 ? d1 : d0, // if is true, d1, if is false d0
            idx = x0 - d0.Date > d1.Date - x0 ? i : i-1;
        if (data[idx] == null) {
           var data_idx = data[idx-1],
               xDate = data_idx.Date;
        } else {
           var data_idx = data[idx],
               xDate = data_idx.Date;
        }
        d3.select("#multilineplot .hover-line")
           .attr("d", function() {
           		var dVar = "M" + xScaleMLine(xDate) + "," + heightMLine;
            	dVar += " " + xScaleMLine(xDate) + "," + 0;
           		return dVar;
           });
        d3.select('#multilineplot .tooltip-date')
           .text(formatAsDate(xDate))
           .attr("text-anchor", function() {
           		if (xDate > medianMLine) {
           			return "end";
           		} else {
           			return "start";
           		}
           	})
           .attr("dx", function() {
           		if (xDate > medianMLine) {
           			return xScaleMLine(xDate)-5;
           		} else {
           			return xScaleMLine(xDate)+5;
           		}
           	})
          .attr("y", heightMLine - 26 - 3*11);
        d3.selectAll(".focus-per-line")
           .attr("transform", function(d, i) {
           		var totalOccupancy = function(){
            		total = data_idx[d.name+"_total"];
            		if (Number.isNaN(total)) {
            			return "";
            		} else {
            			return " (" + Math.round(data_idx[d.name]*total/100)+ "/" + total + ")";
            		}
            }
       		d3.select(this).select('.focus-per-line text')
             .text(d.name + ": " + data_idx[d.name].toFixed(2) + "%" + totalOccupancy())
             .attr("text-anchor", function() {
              	if (xDate > medianMLine) {
              		return "end";
              	} else {
              		return "start";
              	}
	           })
             .attr("x", function() {
              	if (xDate > medianMLine) {
              		return -5;
              	} else {
              		return 5;
              	}
	           })
             .attr("y", heightMLine - yScaleMLine(data_idx[d.name]) - 12.5 - (2-i)*15.5)
             .attr("fill", colorMLine(d.name));
             
       		   return "translate(" + xScaleMLine(xDate) + "," + yScaleMLine(data_idx[d.name]) +")";
          });
        focusPerLineMLine.selectAll("circle") 
                         .attr("opacity", "1")
    };
});