//Margin
const marginIncidencia = { top: 10, right: 10, bottom: 40, left: 44 };

//Width and height
const widthIncidencia = 600 - marginIncidencia.left - marginIncidencia.right;
const heightIncidencia = 250 - marginIncidencia.top - marginIncidencia.bottom;

//Create SVG element in chart id element
const svgIncidencia = d3.select('#incidencia')
				   .append('svg')
				    .attr("class", "content")
				    .attr("viewBox", `0 0 ${widthIncidencia + marginIncidencia.left + marginIncidencia.right} ${heightIncidencia + marginIncidencia.top + marginIncidencia.bottom}`)
				    .attr("preserveAspectRatio", "xMidYMid meet")
var gIncidencia = svgIncidencia.append("g")
            	    .attr("transform", "translate(" + marginIncidencia.left + "," + marginIncidencia.top + ")");	

//Create scale functions
xScaleIncidencia = d3.scaleBand()
				.range([ 0, widthIncidencia ])
				.domain(['15-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '> 79'])
				.padding(0.2); 
yScaleIncidencia = d3.scaleLinear()
				.domain([0,85])
				.range([heightIncidencia, 0]);	
//Create axis
var xAxisIncidencia = d3.axisBottom(xScaleIncidencia)
			 	  .ticks(5)
			 	  .tickSize(3);

var yAxisIncidencia = d3.axisLeft(yScaleIncidencia)
				  .tickSize(3);						  
gIncidencia.append("g")
	  .attr("class", "xAxis")
	  .attr("transform", "translate(0," + heightIncidencia + ")")
	  .call(xAxisIncidencia)
	  .select(".domain")
	   .attr("stroke","#252525")
	   .attr("stroke-width","0");		

gIncidencia.append("g")
	  .attr("class", "yAxis")
	  .attr("transform", "translate(0,0)")
	  .call(yAxisIncidencia)
//Create axis label
gIncidencia.append("text")
	  .attr("class", "axis-title")
	  .attr("transform", "rotate(-90)")
	  .style("text-anchor", "middle")
	  .attr("y",-43)
	  .attr("x",-heightIncidencia/2)
	  .attr("dy", ".71em")
	  .text("Incidência por mil habitantes");

// Create axis label
gIncidencia.append("text")
	  .attr("class", "axis-title")
	  .style("text-anchor", "middle")
	  .attr("y",heightIncidencia+37)
	  .attr("x",widthIncidencia/2)
	  .text("Faixa etária");

function plotIncidencia (data_path) {
	//Load in the data
	d3.csv(data_path)
	  .then(function(data) {
		///Parse data

		if (data_path === 'data/incidencia_genero.csv') {
		    data.forEach(function(d) {
				d.Mulheres = parseFloat(d.Mulheres);
				d.Homens = parseFloat(d.Homens);			
				d.faixa_etaria = d.faixa_etaria;
				d.order = parseInt(d.order);
		    });

		    var subgroups = data.columns.slice(0,2)
		    var groups = d3.map(data, function(d){return(d.faixa_etaria)})
		    var colors = ['#e08214','#8073ac'];
		    var color = d3.scaleOrdinal()
						   .domain(subgroups)
						   .range(colors)
			maxValue = d3.max([d3.max(data, function(d) { return d.Homens; }), 
				               d3.max(data, function(d) { return d.Mulheres; })])	
			dataLegend = [{ year: "Homens", name: "Homens" },
          		          { year: "Mulheres", name: "Mulheres" }]				               					   		
		} else {
		    data.forEach(function(d) {
				d.incidencia = parseFloat(d.incidencia);			
				d.faixa_etaria = d.faixa_etaria;
				d.order = parseInt(d.order);
		    });

		    var subgroups = data.columns.slice(0,1)
		    var groups = d3.map(data, function(d){return(d.faixa_etaria)})
		    var colors = ['#35978f'];
		    var color = d3.scaleOrdinal()
						   .domain(subgroups)
						   .range(colors)
			maxValue = d3.max(data, function(d) { return d.incidencia; })	
			dataLegend = []				
		}
		//Create scale functions
		xScaleIncidencia = d3.scaleBand()
						.range([ 0,  widthIncidencia])
						.domain(groups)
						.padding(0.2); 
	  	xSubgroup = d3.scaleBand()
	   				   .domain(subgroups)
	   				   .range([0, xScaleIncidencia.bandwidth()])
	 				   .padding([0.05])								
		yScaleIncidencia = d3.scaleLinear()
						.domain([0,maxValue])
						.range([ heightIncidencia, 0]);

		//Create axis
		var xAxisIncidencia = d3.axisBottom(xScaleIncidencia)
						  .ticks(5)
						  .tickSize(3);
		var yAxisIncidencia = d3.axisLeft(yScaleIncidencia)
						  .tickSize(3);

		gIncidencia.select('.xAxis')
			 .transition()
			  .duration(300)
			  .ease(d3.easeLinear)
			  .call(xAxisIncidencia);
		gIncidencia.select('.yAxis')
			  .transition()
			   .duration(300)
			   .ease(d3.easeLinear)
			   .call(yAxisIncidencia);						

	    // tooltip
		var tooltipBarplot = d3.select("#incidencia").append("div")
		                      .attr("class", "tooltip-html")
		                      .style("opacity", 0);              	   

		// tooltip mouseover event handler
		var mouseoverIncidencia = function(event, d) {
		  d3.select(this)
		    .transition()
		     .duration(300) 		  
			 .attr("opacity", 1);; 

		  var html = "<b>" + d.key + " entre " + d.category  + " anos</b><br/>" + 
		  			 parseInt(d.value) + " por mil habitantes";
		  tooltipBarplot.html(html)
		                .style("left", (event.pageX) + "px")
		                .style("top", (event.pageY) + "px")
		                .transition()
		                 .duration(300) // ms
		                 .style("opacity", 1); // started as 0!
		};
		// tooltip mouseout event handler
		var mouseoutIncidencia = function(d) {
		  d3.select(this)
		     .transition()
		      .duration(300) // ms				  
			  .attr("opacity", ".8");

		  tooltipBarplot.transition()
		                 .duration(300) // ms                       
		                 .style("opacity", 0); // don't care about position!;                       
		};

	    //Create rectangles
        var groupsIncidencia = gIncidencia.selectAll("#incidencia g.groupsIncidencia")
						      .data(data)
						  
		groupsIncidencia.enter().append("g")
				  .merge(groupsIncidencia)
				  .attr("class", "groupsIncidencia")
				  .attr("transform", function(d) { return "translate(" + xScaleIncidencia(d.faixa_etaria) + ",0)"; })
		groupsIncidencia.exit().remove()		  
					      

		var rectIncidencia = gIncidencia.selectAll("#incidencia g.groupsIncidencia").selectAll("#incidencia rect.rectIncidencia")
						    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key], category: d.faixa_etaria}; }); })

		rectIncidencia.enter().append('rect')
			    .merge(rectIncidencia)
			    .attr("class", "rectIncidencia")
	            .transition()
	              .duration(300)
	              .ease(d3.easeLinear)							    
			      .attr("x", function(d) { return xSubgroup(d.key); })
			      .attr("y", function(d) { return yScaleIncidencia(d.value); })
			      .attr("width", xSubgroup.bandwidth())
			      .attr("height", function(d) { return heightIncidencia - yScaleIncidencia(d.value); })
			      .attr("fill", function(d) { return color(d.key); })
			      .attr("opacity", "0.8");			      		
		rectIncidencia.exit().remove()	      
	    
		gIncidencia.selectAll("rect")
		 .on("mouseover", mouseoverIncidencia)
		 .on("mouseout", mouseoutIncidencia);

		//Create legend
	    var legendRectIncidencia = gIncidencia.selectAll("#incidencia rect.legend")
				  				              .data(dataLegend)
		legendRectIncidencia.enter().append("rect")
					  .merge(legendRectIncidencia)
			          .attr('class', 'legend')
			           .attr('x', widthIncidencia*.86)
			           .attr('y', function(d, i) {
			             return i * 13 - 9.5;
			           })
			           .attr('width', 10)
			           .attr('height', 10)
		               .transition()
		                .duration(300) 
			            .style('fill', function(d) {
			              return color(d.name);
			            });

		legendRectIncidencia.exit().remove()

	    var legendTextIncidencia = gIncidencia.selectAll("#incidencia text.legend")
				              .data(dataLegend)			            
			            
	    legendTextIncidencia.enter().append("text")
				      .merge(legendTextIncidencia)
		    	       .attr("class", "legend")					    
		               .attr('x', widthIncidencia*.86+15)
		               .attr('y', function(d, i) {
		                 return (i * 13);
		               })
		               .text(function(d) {
		                 return d.year;
				       });		
	    legendTextIncidencia.exit().remove()     
	});
}
plotIncidencia('data/incidencia_genero.csv');