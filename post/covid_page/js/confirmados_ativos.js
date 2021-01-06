//Margin
const marginMLine = { top: 10, right: 10, bottom: 25, left: 76 };

//Width and Height
const widthMLine = 600 - marginMLine.left - marginMLine.right;
const heightMLine = 300 - marginMLine.top - marginMLine.bottom;

//For converting data
var parseTimeMLine = d3.timeParse("%Y-%m-%d");

//Create categorical color scale
var colorMLine = d3.scaleOrdinal(['#404040', '#bdbdbd']);

//Load in the data
d3.csv("data/confirmados_ativos.csv")
  .then(function(data) {			
	//Assign a color to each occupancy columns
    colorMLine.domain(Object.keys(data[0]).slice(1, 3));

    //Parse data
    data.forEach(function(d) {
    	d.Data = parseTimeMLine(d.Data);		      
     	d.Confirmados = parseInt(d.Confirmados);
     	d.Ativos = parseInt(d.Ativos);
    });

	//Get median of dates
	medianMLine = d3.median(data, function(d) { return d.Data; })

	//Create categories (for each line plot)
    var categoriesMLine = colorMLine.domain().map(function(name) {
    	return {
    		name: name,
        	values: data.map(function(d) {
        		if (Number.isNaN(d[name])) {
	            	return {
	                	Data: d.Data,
	            		Cases: 0
	          		};        			
          		} else {
	            	return {
	                	Data: d.Data,
	            		Cases: parseInt(d[name])
	          		};          		
          		}

        	})
        };
    });

    //Sort dates
    data.sort(function(a, b) {
        return a.Data - b.Data;
    });

	//Create scale functions
	xScaleMLine = d3.scaleTime()
          			 	 .domain(d3.extent(data, function(d) { return d.Data; }))
          			 	 .range([0, widthMLine]);
	yScaleMLine = d3.scaleLinear()
          				 .domain([0,d3.max(data, function(d) { return d.Confirmados; })])
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
               		return i * 17.3;
          	    })
        	      .attr('width', 12)
        	      .attr('height', 12)
                .style('fill', function(d) {
               		return colorMLine(d.name);
                });
    legendMLine.append('text')
                .attr('x', 25)
                .attr('y', function(d, i) {
      		         return (i * 17.3)+11;
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
           .attr("y",-75)
           .attr("x",-heightMLine/2)
           .attr("dy", ".71em")
           .text("Casos");
    categoriesMLine1 = categoriesMLine;
	//Create each category object
	var categoryMLine = gMLine.selectAll(".category")
                              .data(categoriesMLine)
                               .enter().append("g")
                               .attr("class", "category");

	//Create lines
	var lineMLine = d3.line()
          			   .x( function(d) { return xScaleMLine(d.Data); })
          			   .y( function(d) { return yScaleMLine(d.Cases); });

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

    var linesMLine = document.getElementsByClassName('line');
    var focusPerLineMLine = focusMLine.selectAll('.focus-per-line')
                                      .data(categoriesMLine)
                                      .enter().append("g")
                                       .attr("class", "focus-per-line");

    var tooltipTextMLine = gMLine.selectAll('.tooltip-text')
	                               .data(categoriesMLine)
	                               .enter().append("text")
	                                .attr("class", "tooltip-text");	    

    var tooltipTextDataMLine = gMLine.append("text")
            						  .attr("class", "tooltip-date");	                                    
    focusPerLineMLine.append("circle") 
                      .attr("opacity", "0")
                      .attr("r", 3)
                      .style("stroke", function(d) {
                      	return colorMLine(d.name);
                      });  

    svgMLine.append('rect') 
             .attr("class", "overlay")
             .attr("transform", "translate(" + marginMLine.left + "," + marginMLine.top + ")")
             .attr('width', widthMLine)
             .attr('height', heightMLine)
             .on("mouseover", function() {
               	focusMLine.style("display", null); 
               	tooltipTextMLine.style("display", null);
				tooltipTextDataMLine.style("display", null);
             })
             .on("mouseout", function() { 			        	
               	focusMLine.style("display", "none"); 
               	tooltipTextMLine.style("display", "none");
				tooltipTextDataMLine.style("display", "none");
             })
             .on('mousemove', event => mousemoveMLine(event));

    function mousemoveMLine(event) { // mouse moving over canvas
        var mouse = d3.pointer(event),
            x0 = xScaleMLine.invert(mouse[0]),
            bisectData = d3.bisector(function(d) { return d.Data; }).left,
            i = bisectData(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            dTrue = x0 - d0.Data > d1.Data - x0 ? d1 : d0,
            idx = x0 - d0.Data > d1.Data - x0 ? i : i-1,
        xData = dTrue.Data;
        d3.select("#multilineplot .hover-line")
           .attr("d", function() {
           		var dVar = "M" + xScaleMLine(xData) + "," + heightMLine;
            	dVar += " " + xScaleMLine(xData) + "," + 0;
           		return dVar;
           });
        d3.select('#multilineplot .tooltip-date')
           .text(formatAsDate(xData))
           .attr("x", 10)
           .attr("y", heightMLine - 70 - 3*11);
        tooltipTextMLine
           .text(function (d) {if (Number.isNaN(data[idx][d.name])) {   
       		        return "";
       		    } else {
       		        return d.name + ": " + formatValue(data[idx][d.name]);
       		    }})
           .attr("x", 10)
           .attr("y", function (d,i) { return heightMLine - 55.5 - (2-i)*15.5})
        d3.selectAll(".focus-per-line")
           .attr("transform", function(d, i) { 
           	   if (Number.isNaN(data[idx][d.name])) {   
           	        d3.select(this).select('.focus-per-line circle')
                       .style("opacity", "0")     
       		        return "translate(0,0)";
       		   } else {
           	        d3.select(this).select('.focus-per-line circle')
                       .style("opacity", "1")     
       		        return "translate(" + xScaleMLine(xData) + "," + yScaleMLine(data[idx][d.name]) +")";
       		   } 
          });
    };
});



// d3.select(this).select('.focus-per-line text')
// .text(d.name + ": " + data[idx][d.name])
// .attr("x", )
// .attr("y", heightMLine - yScaleMLine(data[idx][d.name]) - 12.5 - (2-i)*15.5)
// .attr("fill", colorMLine(d.name));