//Margin
const marginConfirmados = { top: 10, right: 10, bottom: 25, left: 76 };

//Width and Height
const widthConfirmados = 600 - marginConfirmados.left - marginConfirmados.right;
const heightConfirmados = 300 - marginConfirmados.top - marginConfirmados.bottom;

//For converting data
var parseTimeConfirmados = d3.timeParse("%Y-%m-%d");

//Create categorical color scale
var colorConfirmados = d3.scaleOrdinal(['#404040', '#bdbdbd']);

//Load in the data
d3.csv("data/confirmados_ativos.csv")
  .then(function(data) {			
	//Assign a color to each occupancy columns
    colorConfirmados.domain(Object.keys(data[0]).slice(1, 3));

    //Parse data
    data.forEach(function(d) {
    	d.Data = parseTimeConfirmados(d.Data);		      
     	d.Confirmados = parseInt(d.Confirmados);
     	d.Ativos = parseInt(d.Ativos);
    });

	//Get median of dates
	medianConfirmados = d3.median(data, function(d) { return d.Data; })

	//Create categories (for each line plot)
    var categoriesConfirmados = colorConfirmados.domain().map(function(name) {
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
	xScaleConfirmados = d3.scaleTime()
          			 	 .domain(d3.extent(data, function(d) { return d.Data; }))
          			 	 .range([0, widthConfirmados]);
	yScaleConfirmados = d3.scaleLinear()
          				 .domain([0,d3.max(data, function(d) { return d.Confirmados; })])
          				 .range([heightConfirmados, 0]);	

	//Create SVG element
	const svgConfirmados = d3.select('#multilineplot')
                	   .append('svg')
                	    .attr("class", "content")
                	    .attr("viewBox", `0 0 ${widthConfirmados + marginConfirmados.left + marginConfirmados.right} ${heightConfirmados + marginConfirmados.top + marginConfirmados.bottom}`)
                	    .attr("preserveAspectRatio", "xMidYMid meet")
	    
	var gConfirmados = svgConfirmados.append("g")
	                      .attr("transform", "translate(" + marginConfirmados.left + "," + marginConfirmados.top + ")");

	//Create legend
    var legendConfirmados = gConfirmados.selectAll('g')
                            .data(categoriesConfirmados)
                            .enter().append('g')
                             .attr('class', 'legend');
    legendConfirmados.append('rect')
                .attr('x', 10)
                .attr('y', function(d, i) {
               		return i * 17.3;
          	    })
        	      .attr('width', 12)
        	      .attr('height', 12)
                .style('fill', function(d) {
               		return colorConfirmados(d.name);
                });
    legendConfirmados.append('text')
                .attr('x', 25)
                .attr('y', function(d, i) {
      		         return (i * 17.3)+11;
                 })
                .text(function(d) {
        	      	return d.name;
      	        });

    //Create axis
	var xAxisConfirmados = d3.axisBottom(xScaleConfirmados)
          				   .ticks(7)
          				   .tickFormat(formatAsMonth)
          				   .tickSize(3);
	var yAxisConfirmados = d3.axisLeft(yScaleConfirmados)
				             .ticks(7)
				             .tickSize(3);
	gConfirmados.append("g")
    	   .attr("class", "xAxis")
    	   .attr("transform", "translate(0," + heightConfirmados + ")")
    	   .call(xAxisConfirmados)
    	   .select(".domain")
    	    .attr("stroke","#252525")
    	    .attr("stroke-width","0");
	gConfirmados.append("g")
	       .attr("class", "yAxis")
	       .attr("transform", "translate(0,0)")
	       .call(yAxisConfirmados)

	//Create axis label
    gConfirmados.append("text")
           .attr("class", "axis-title")
           .attr("transform", "rotate(-90)")
           .style("text-anchor", "middle")
           .attr("y",-75)
           .attr("x",-heightConfirmados/2)
           .attr("dy", ".71em")
           .text("Casos");
    categoriesConfirmados1 = categoriesConfirmados;
	//Create each category object
	var categoryConfirmados = gConfirmados.selectAll(".category")
                              .data(categoriesConfirmados)
                               .enter().append("g")
                               .attr("class", "category");

	//Create lines
	var lineConfirmados = d3.line()
          			   .x( function(d) { return xScaleConfirmados(d.Data); })
          			   .y( function(d) { return yScaleConfirmados(d.Cases); });

	categoryConfirmados.append("path")
      		     .attr("class", "multiline")
      	         .attr("d", function(d) {
      	         	return lineConfirmados(d.values);
      	         })
      	         .style("stroke", function(d) {
      	         	return colorConfirmados(d.name);
      	         });

	// Create tooltip
    var focusConfirmados = gConfirmados.append("g")
                           .attr("class", "focus");

    focusConfirmados.append("path")
              .attr("class", "hover-line")

    var linesConfirmados = document.getElementsByClassName('line');
    var focusPerLineConfirmados = focusConfirmados.selectAll('.focus-per-line')
                                      .data(categoriesConfirmados)
                                      .enter().append("g")
                                       .attr("class", "focus-per-line");

    var tooltipTextConfirmados = gConfirmados.selectAll('.tooltip-text')
	                               .data(categoriesConfirmados)
	                               .enter().append("text")
	                                .attr("class", "tooltip-text");	    

    var tooltipTextDataConfirmados = gConfirmados.append("text")
            						  .attr("class", "tooltip-date");	                                    
    focusPerLineConfirmados.append("circle") 
                      .attr("opacity", "0")
                      .attr("r", 3)
                      .style("stroke", function(d) {
                      	return colorConfirmados(d.name);
                      });  

    svgConfirmados.append('rect') 
             .attr("class", "overlay")
             .attr("transform", "translate(" + marginConfirmados.left + "," + marginConfirmados.top + ")")
             .attr('width', widthConfirmados)
             .attr('height', heightConfirmados)
             .on("mouseover", function() {
               	focusConfirmados.style("display", null); 
               	tooltipTextConfirmados.style("display", null);
				tooltipTextDataConfirmados.style("display", null);
             })
             .on("mouseout", function() { 			        	
               	focusConfirmados.style("display", "none"); 
               	tooltipTextConfirmados.style("display", "none");
				tooltipTextDataConfirmados.style("display", "none");
             })
             .on('mousemove', event => mousemoveConfirmados(event));

    function mousemoveConfirmados(event) { // mouse moving over canvas
        var mouse = d3.pointer(event),
            x0 = xScaleConfirmados.invert(mouse[0]),
            bisectData = d3.bisector(function(d) { return d.Data; }).left,
            i = bisectData(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            dTrue = x0 - d0.Data > d1.Data - x0 ? d1 : d0,
            idx = x0 - d0.Data > d1.Data - x0 ? i : i-1,
        xData = dTrue.Data;
        d3.select("#multilineplot .hover-line")
           .attr("d", function() {
           		var dVar = "M" + xScaleConfirmados(xData) + "," + heightConfirmados;
            	dVar += " " + xScaleConfirmados(xData) + "," + 0;
           		return dVar;
           });
        d3.select('#multilineplot .tooltip-date')
           .text(formatAsDate(xData))
           .attr("x", 10)
           .attr("y", heightConfirmados - 70 - 3*11);
        tooltipTextConfirmados
           .text(function (d) {if (Number.isNaN(data[idx][d.name])) {   
       		        return "";
       		    } else {
       		        return d.name + ": " + formatValue(data[idx][d.name]);
       		    }})
           .attr("x", 10)
           .attr("y", function (d,i) { return heightConfirmados - 55.5 - (2-i)*15.5})
        d3.selectAll(".focus-per-line")
           .attr("transform", function(d, i) { 
           	   if (Number.isNaN(data[idx][d.name])) {   
           	        d3.select(this).select('.focus-per-line circle')
                       .style("opacity", "0")     
       		        return "translate(0,0)";
       		   } else {
           	        d3.select(this).select('.focus-per-line circle')
                       .style("opacity", "1")     
       		        return "translate(" + xScaleConfirmados(xData) + "," + yScaleConfirmados(data[idx][d.name]) +")";
       		   } 
          });
    };
});



// d3.select(this).select('.focus-per-line text')
// .text(d.name + ": " + data[idx][d.name])
// .attr("x", )
// .attr("y", heightConfirmados - yScaleConfirmados(data[idx][d.name]) - 12.5 - (2-i)*15.5)
// .attr("fill", colorConfirmados(d.name));