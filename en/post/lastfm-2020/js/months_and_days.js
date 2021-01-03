//Margin
const marginBarG = { top: 10, right: 10, bottom: 25, left: 49 };

//Width and height
const widthBarG = 600 - marginBarG.left - marginBarG.right;
const heightBarG = 250 - marginBarG.top - marginBarG.bottom;

//Create SVG element in chart id element
const svgBarG = d3.select('#barplot')
				   .append('svg')
				    .attr("class", "content")
				    .attr("viewBox", `0 0 ${widthBarG + marginBarG.left + marginBarG.right} ${heightBarG + marginBarG.top + marginBarG.bottom}`)
				    .attr("preserveAspectRatio", "xMidYMid meet")
var gBarG = svgBarG.append("g")
            	    .attr("transform", "translate(" + marginBarG.left + "," + marginBarG.top + ")");	

//Create scale functions
xScaleBarG = d3.scaleBand()
				.range([ 0, widthBarG ])
				.domain(['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'])
				.padding(0.2); 
yScaleBarG = d3.scaleLinear()
				.domain([0,1220])
				.range([heightBarG, 0]);	
//Create axis
var xAxisBarG = d3.axisBottom(xScaleBarG)
			 	  .ticks(5)
			 	  .tickSize(0);

var yAxisBarG = d3.axisLeft(yScaleBarG)
				  .tickSize(3);						  
gBarG.append("g")
	  .attr("class", "xAxis")
	  .attr("transform", "translate(0," + heightBarG + ")")
	  .call(xAxisBarG)
	  .select(".domain")
	   .attr("stroke","#252525")
	   .attr("stroke-width","0");		

gBarG.append("g")
	  .attr("class", "yAxis")
	  .attr("transform", "translate(0,0)")
	  .call(yAxisBarG)
//Create axis label
gBarG.append("text")
	  .attr("class", "axis-title")
	  .attr("transform", "rotate(-90)")
	  .style("text-anchor", "middle")
	  .attr("y",-49)
	  .attr("x",-heightBarG/2)
	  .attr("dy", ".71em")
	  .text("Scrobbles");


function plotCharts (data_path) {
	//Load in the data
	d3.csv(data_path)
	  .then(function(data) {
		///Parse data
	    data.forEach(function(d) {
			d.category = d.category;
			d.category_str_pt = d.category_str_pt;
			d.category_str_en = d.category_str_en;
			d.category_str_complete_pt = d.category_str_complete_pt;
			d.category_str_complete_en = d.category_str_complete_en;
			d.count_2019 = parseInt(d.count_2019);
			d.count_2020 = parseInt(d.count_2020);
	    });

	    var subgroups = data.columns.slice(1,3)
	    var groups = d3.map(data, function(d){return(d.category_str_en)})

	    if (data_path==="data/month_data.csv") {
	    	var colors = ['#fb9a99','#e31a1c'];
	    } else {
	    	var colors = ['#a6cee3','#1f78b4'];
	    }

	    var color = d3.scaleOrdinal()
					   .domain(subgroups)
					   .range(colors)		

		//Create scale functions
		xScaleBarG = d3.scaleBand()
						.range([ 0,  widthBarG])
						.domain(groups)
						.padding(0.2); 
	  	xSubgroup = d3.scaleBand()
	   				   .domain(subgroups)
	   				   .range([0, xScaleBarG.bandwidth()])
	 				   .padding([0.05])								
		yScaleBarG = d3.scaleLinear()
						.domain([
							0,
							d3.max([d3.max(data, function(d) { return d.count_2019; }), 
								    d3.max(data, function(d) { return d.count_2020; })])
						])
						.range([ heightBarG, 0]);

		//Create axis
		var xAxisBarG = d3.axisBottom(xScaleBarG)
						  .ticks(5)
						  .tickSize(0);
		var yAxisBarG = d3.axisLeft(yScaleBarG)
						  .tickSize(3);

		gBarG.select('.xAxis')
			 .transition()
			  .duration(300)
			  .ease(d3.easeLinear)
			  .call(xAxisBarG);
		gBarG.select('.yAxis')
			  .transition()
			   .duration(300)
			   .ease(d3.easeLinear)
			   .call(yAxisBarG);						

	  // tooltip
		var tooltipBarplot = d3.select("#barplot").append("div")
		                      .attr("class", "tooltip-html")
		                      .style("opacity", 0);              	   

		// tooltip mouseover event handler
		var mouseoverBarG = function(event, d) {
		  d3.select(this)
		    .transition()
		     .duration(300) 		  
			 .attr("opacity", 1);; 

		  var html = "<b>" +  d.category + " " + d.key.slice(-4) + "</b><br/>" + 
		  			 formatValue(d.value) + " scrobbles";
		  tooltipBarplot.html(html)
		                .style("left", (event.pageX) + "px")
		                .style("top", (event.pageY) + "px")
		                .style("font-size", "1.4vw")
		                .transition()
		                 .duration(300) // ms
		                 .style("opacity", 1); // started as 0!
		};
		// tooltip mouseout event handler
		var mouseoutBarG = function(d) {
		  d3.select(this)
		     .transition()
		      .duration(300) // ms				  
			  .attr("opacity", ".8");

		  tooltipBarplot.transition()
		                 .duration(300) // ms                       
		                 .style("opacity", 0); // don't care about position!;                       
		};


		rectBarG = gBarG.selectAll("rect")
				         .attr("fill-opacity", 1)
				         .attr("stroke-opacity", 1)
				         .transition()
			              .duration(0) //change fill and stroke opacity to avoid CSS conflicts
			              .attr("fill-opacity", 0)
			              .attr("stroke-opacity", 0)
			              .remove(); //remove after transitions are complete

	    //Create rectangles
        rectBarG = gBarG.append("g")
		      			.selectAll("g")
						.data(data)
						.enter()
						.append("g")
						  .attr("transform", function(d) { return "translate(" + xScaleBarG(d.category_str_en) + ",0)"; })
					      .selectAll("rect")
						  .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key], category: d.category_str_complete_en}; }); })
		rectBarG.enter().append('rect')
						.merge(rectBarG)
			            .transition()
			              .duration(300)
			              .ease(d3.easeLinear)							    
					      .attr("x", function(d) { return xSubgroup(d.key); })
					      .attr("y", function(d) { return yScaleBarG(d.value); })
					      .attr("width", xSubgroup.bandwidth())
					      .attr("height", function(d) { return heightBarG - yScaleBarG(d.value); })
					      .attr("fill", function(d) { return color(d.key); })
					      .attr("opacity", "0.8");				      

		gBarG.selectAll("rect")
		 .on("mouseover", mouseoverBarG)
		 .on("mouseout", mouseoutBarG);

		//Create legend
	    var legendBarG = gBarG.append("g")
			                  .selectAll("g")
				              .data([{ year: "2019", name: "count_2019" },
				              		 { year: "2020", name: "count_2020" }])
			                  .enter().append("g")
			                   .attr('class', 'legend');
	    legendBarG.append('rect')
		           .attr('x', widthBarG*.915)
		           .attr('y', function(d, i) {
		             return i * 13 - 9;
		           })
		           .attr('width', 10)
		           .attr('height', 10)
	               .transition()
	                .duration(300) 
		            .style('fill', function(d) {
		              return color(d.name);
		            });
		gBarG.selectAll("text.legendText")
			  .attr("opacity", 1)
		      .transition()
	           .duration(0) 
	           .attr("opacity", 0)
	           .remove(); 					            
	    legendBarG.append('text')
		    	   .attr("class", "legendText")					    
		           .attr('x', widthBarG*.915+15)
		           .attr('y', function(d, i) {
		             return (i * 13);
		           })
		           .text(function(d) {
		             return d.year;
				   });		       
	});
}
plotCharts('data/month_data.csv');