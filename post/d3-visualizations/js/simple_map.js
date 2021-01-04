
//Margin
const marginMap = { top: 21, right: 0, bottom: 0, left: 0 };


//Width and height
const widthMap = 600 - marginMap.left - marginMap.right;
const heightMap = 400 - marginMap.top - marginMap.bottom;

//Create SVG element in chart id element
const svgMap = d3.select('#paranamap')
	              .append('svg')
	               .attr("class", "content")
	               .attr("viewBox", `0 0 ${widthMap + marginMap.left + marginMap.right} ${heightMap + marginMap.top + marginMap.bottom}`)
	               .attr("preserveAspectRatio", "xMidYMid meet")

var gMap = svgMap.append("g")
            		.attr("transform", "translate(" + marginMap.left + "," + marginMap.top + ")");

const geoPath = d3.geoPath().projection(d3.geoEquirectangular().center([-10,-50]));



// Load external data and boot
function plotMap(variable, first) {
	d3.json("data/parana.geojson")
	  .then(function(data) {
	  	var centerMap = d3.geoCentroid(data)
	  	var scaleMap  = 150;
	  	var offsetMap = [widthMap/2, heightMap/2];
		var projectionMap = d3.geoMercator().scale(scaleMap).center(centerMap)
	                           .translate(offsetMap);

		// create the path
		var pathMap = d3.geoPath().projection(projectionMap);   	

		// using the path determine the bounds of the current map and use 
		// these to determine better values for the scale and translation
		var boundsMap  = pathMap.bounds(data);
		var hscaleMap  = scaleMap*widthMap  / (boundsMap[1][0] - boundsMap[0][0]);
		var vscaleMap  = scaleMap*heightMap / (boundsMap[1][1] - boundsMap[0][1]);
		var scaleMap   = (hscaleMap < vscaleMap) ? hscaleMap : vscaleMap;
		var offsetMap  = [widthMap - (boundsMap[0][0] + boundsMap[1][0])/2 - 10,
		               heightMap - (boundsMap[0][1] + boundsMap[1][1])/2 + 1];

		// // new projection
		projectionMap = d3.geoMercator().center(centerMap)
						.scale(scaleMap).translate(offsetMap);
		pathMap = pathMap.projection(projectionMap);

	    data.features.forEach(function(d) {
	     	d.properties.log_deaths = Math.log(d.properties.deaths);
	     	d.properties.log_cases = Math.log(d.properties.cases);
	    });

		var tooltipMap = d3.select("#paranamap").append("div")
		                    .attr("class", "tooltip-html")
		                    .style("opacity", 0); 

		// tooltip mouseover event handler
		var mouseoverMap = function(event, d) {
			d3.select(this)
			   .transition()
			   .duration(300) 		  
			   .attr("opacity", 1);
			if (variable == "deaths") {
				var html =  "<b>" + d.properties.nome_acento + "</b><br/>" +
										formatValue(d.properties.deaths) + " mortes"				
			} else {
				var html =  "<b>" + d.properties.nome_acento + "</b><br/>" +
										formatValue(d.properties.cases) + " casos"				
			}
			
			tooltipMap.html(html)
					   .style("left", (event.pageX) + "px")
					   .style("top", (event.pageY) + "px")
					   .transition()
					   .duration(300) // ms
					   .style("opacity", 1); // started as 0!
		};
		// tooltip mouseout event handler
		var mouseoutMap = function(d) {
			d3.select(this)
			  .transition()
			   .duration(300) // ms				  
			   .attr("opacity", ".8");

			tooltipMap.transition()
			               .duration(300) // ms                       
			               .style("opacity", 0); // don't care about position!;                       
		};	
		if (first) {
			scaleMap = d3.scaleSequential(d3.interpolateOrRd)
	  				     .domain([0, d3.max(data.features, function(d) { return d.properties.log_cases })])
			mapMap = gMap.selectAll("path")
							.data(data.features)
			mapMap.enter()
					.append("path")
					.merge(mapMap)
					.attr("d", pathMap)
					.attr("class", "map")					    
				    .attr("opacity", ".8")
				    .attr("fill", function (d) {
				    	return scaleMap(d.properties.log_cases)
				    })
				    .on("mouseover", mouseoverMap)
			        .on("mouseout", mouseoutMap);	

			gMap.select(".title-map").remove();
			gMap.append("text")
				.transition()
				.duration(300)
				.attr("class","title-map")
			    .text("Número de casos de COVID-19 em 28/12/2020")
		        .attr("y", -10)
		        .attr("x", 0)
		        .attr("text-anchor", "start")
		        .attr("fill", "black")
		        .attr("font-size", "15px")
		} else {
		    if (variable == "deaths") {
				scaleMap = d3.scaleSequential(d3.interpolateGnBu)
		  				     .domain([0, d3.max(data.features, function(d) { return d.properties.log_deaths })])	    	
				mapMap = gMap.selectAll("path")
							  .data(data.features)
				mapMap.enter()
						.append("path")
						.merge(mapMap)
						.attr("d", pathMap)
						.attr("class", "map")
					    .transition()
					    .duration(300)
					    .attr("opacity", ".8")
					    .attr("fill", function (d) {
					    	return scaleMap(d.properties.log_deaths)
					    })
					    .attr("transform", "(" + widthMap/2 + "," - heightMap/2 + ")");
				mapMap.on("mouseover", mouseoverMap)
				      .on("mouseout", mouseoutMap);	  		
				mapMap.exit().remove();	

				gMap.select(".title-map").remove();
				gMap.append("text")
					.transition()
					.duration(300)
					.attr("class","title-map")				
				    .text("Número de mortes por COVID-19 em 28/12/2020")
			        .attr("y", -10)
			        .attr("x", 0)
			        .attr("text-anchor", "start")
			        .attr("fill", "black")
			        .attr("font-size", "15px")

		    } else {
				scaleMap = d3.scaleSequential(d3.interpolateOrRd)
		  				     .domain([0, d3.max(data.features, function(d) { return d.properties.log_cases })])
				mapMap = gMap.selectAll("path")
								.data(data.features)
				mapMap.enter()
						.append("path")
						.merge(mapMap)
						.attr("d", pathMap)
						.attr("class", "map")
					    .transition()
					    .duration(300)					    
					    .attr("opacity", ".8")
					    .attr("fill", function (d) {
					    	return scaleMap(d.properties.log_cases)
					    })
					    .attr("transform", "(" + widthMap/2 + "," - heightMap/2 + ")");	
				mapMap.on("mouseover", mouseoverMap)
				      .on("mouseout", mouseoutMap);	
				mapMap.exit().remove();

				gMap.select(".title-map").remove();
				gMap.append("text")
					.transition()
					.duration(300)
					.attr("class","title-map")
				    .text("Número de casos de COVID-19 em 28/12/2020")
			        .attr("y", -10)
			        .attr("x", 0)
			        .attr("text-anchor", "start")
			        .attr("fill", "black")
			        .attr("font-size", "15px")
			    
		    }		                
   		}
	})
}

plotMap("cases", true)