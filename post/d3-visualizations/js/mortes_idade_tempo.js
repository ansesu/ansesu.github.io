//Margin
const marginAreaChart = { top: 10, right: 0, bottom: 25, left: 90 };

//Width and height
const widthAreaChart = 600 - marginAreaChart.left - marginAreaChart.right;
const heightAreaChart = 300 - marginAreaChart.top - marginAreaChart.bottom;

var parseTimeAreaChart = d3.timeParse("%Y-%m-%d")

var active_link = "0"; //to control legend selections and hover
var legendClicked; //to control legend selections
var legendClassArray = []; //store legend classes to select bars in plotSingle()
var y_orig; //to store original y-posn

//Load in the data
d3.csv("data/mortes_idade_tempo.csv")
  .then(function(data) {			
	// Three function that change the tooltip when user hover / move / leave a cell
	var mouseoverAreaChart = function(event,d) {
		d3.selectAll(".myAreaStacked").style("opacity", .2);
		d3.select(this)
		  .style("opacity", 1)
		  .style("stroke", "#969696")
		  .style("stroke-width", "1px");
		key = event.target.__data__.key;
		if (key === '60') {
			var textAreaChart = "> " + key + " anos";
		} else {
			var textAreaChart = key + " anos";
		}
		
		tooltipAreaChart.text(textAreaChart)
		              .attr("font-size", "22")  
		              .attr("x", widthAreaChart)
		              .attr("y", 15)
		              .attr("text-anchor", "end")            
					  .transition()
				       .duration(400) // ms
					   .style("opacity", 1); // started as 0!	
	}

	var mouseleaveAreaChart = function(d) {
		d3.selectAll(".myAreaStacked").style("opacity", 1).style("stroke", "none")
		
		tooltipAreaChart.transition()
                      .duration(300) // ms
                      .style("opacity", 0); // don't care about position!;  
	}	

	var keysAreaChart = data.columns.slice(1)
	///Parse data and sort values by date
    data.forEach(function(d) {
    	d.date = parseTimeAreaChart(d.date);
    	d['0-18'] = parseFloat(d['0-18']);
    	d['18-30'] = parseFloat(d['18-30']);
    	d['30-40'] = parseFloat(d['30-40']);
    	d['40-50'] = parseFloat(d['40-50']);
    	d['50-60'] = parseFloat(d['50-60']);
    	d['60'] = parseFloat(d['60']);
    });		    
    data.sort(function(a, b) {
        return a.date - b.date;
    });

	//Create scale functions
	xScaleAreaChart = d3.scaleTime()
			    	  .domain([
			    	  	new Date(2020, 3, 27),
			    	  	d3.max(data, function(d) { return d.date; })
			    	  ])
				      .range([0, widthAreaChart]);
	yScaleAreaChart = d3.scaleLinear()
					  .domain([0,90])
				      .range([ heightAreaChart, 0]);

	//Create SVG element in chart id element
	const svgAreaChart = d3.select('#mortes-idade-tempo')
					    .append('svg')
					     .attr("class", "content")
					     .attr("viewBox", `0 0 ${widthAreaChart + marginAreaChart.left + marginAreaChart.right} ${heightAreaChart + marginAreaChart.top + marginAreaChart.bottom}`)
					     .attr("preserveAspectRatio", "xMidYMid meet")
	var gAreaChart = svgAreaChart.append("g")
	   		   				.attr("transform", "translate(" + marginAreaChart.left + "," + marginAreaChart.top + ")");

	// color palette
	var colorAreaChart = d3.scaleOrdinal()
						 .domain(keysAreaChart)
						 .range(["#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#67000d"]);

	var artistsAreaChart = colorAreaChart.domain().map(function(name) {
      	return {name: name}	
    })	
	// create a tooltip
    var tooltipAreaChart = gAreaChart.append("text")
					  			.attr("class", "tooltip-stream")    
						        .style("opacity", 0);
	//stack the data?
	var stackedDataAreaChart = d3.stack()
				              .keys(keysAreaChart)
				              (data)

	// Area generator
	var areaAreaChart = d3.area()	
					   .x(function(d) { return xScaleAreaChart(d.data.date); })
					   .y0(function(d) { return yScaleAreaChart(d[0]); })
					   .y1(function(d) { return yScaleAreaChart(d[1]); })
	// Show the areas
	SelectedAreaAreaChart = gAreaChart.selectAll("path")
												       .data(stackedDataAreaChart)
												       .enter()
												       .append("path")
												        .attr("class", "myAreaStacked")
												        .style("fill", function(d) { return colorAreaChart(d.key); })
												        .attr("d", areaAreaChart)	
												        .on("mouseover", mouseoverAreaChart)
												        .on("mouseleave", mouseleaveAreaChart)

	//Create legend
  	var legend = svgAreaChart.selectAll(".legend")
      .data(colorAreaChart.domain().slice().reverse())
    .enter().append("g")
      //.attr("class", "legend")
      .attr("class", function (d) {
        legendClassArray.push(d.replace(/\s/g, '')); //remove spaces
        return "legend";
      })
      .attr("transform", function(d, i) { return "translate(0," + (10 + i * 20) + ")"; });

  //reverse order to match order in which bars are stacked    
  legendClassArray = legendClassArray.reverse();

  legend.append("rect")
      .attr("x", 55)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorAreaChart)
      .attr("id", function (d, i) {
        return "id" + d.replace(/\s/g, '');
      })
      .on("mouseover",function(){        

        if (active_link === "0") d3.select(this).style("cursor", "pointer");
        else {
          if (active_link.split("class").pop() === this.id.split("id").pop()) {
            d3.select(this).style("cursor", "pointer");
          } else d3.select(this).style("cursor", "auto");
        }
      })
      .on("click",function(d){        

        if (active_link === "0") { //nothing selected, turn on this selection
          d3.select(this)           
            .style("stroke", "black")
            .style("stroke-width", 1);

            active_link = this.id.split("id").pop();

            //gray out the others
            for (i = 0; i < legendClassArray.length; i++) {
              if (legendClassArray[i] != active_link) {
                d3.select("#id" + legendClassArray[i])
                  .style("opacity", 0.5);
              }
            }

			yScaleAreaChart = d3.scaleLinear()
							  .domain([
							  	0,
							  	1.25*d3.max(data, function(d) { return d[active_link]; })
							  ])
						      .range([ heightAreaChart, 0]);

			var yAxisAreaChart = d3.axisLeft(yScaleAreaChart)
								.ticks(6)
		          				.tickSize(3);	  
			gAreaChart.select('.yAxis')
				  .transition()
				   .duration(300)
				   .ease(d3.easeLinear)
				   .call(yAxisAreaChart);	

			//stack the data
			var stackedDataAreaChart2 = d3.stack()
										              .keys([active_link])
										              (data)

			SelectedAreaAreaChart = gAreaChart.selectAll("path.myAreaStacked")
														      .data(stackedDataAreaChart2)
			SelectedAreaAreaChart.enter().append("path")
												.merge(SelectedAreaAreaChart)
			SelectedAreaAreaChart.transition()
	  			              .duration(1000)
	  			              .ease(d3.easeLinear)
	  			              .attr("class", "myAreaStacked")
		                      .style("fill", function(d) { return colorAreaChart(d.key); })
		                      .attr("d", areaAreaChart)
	  	SelectedAreaAreaChart.exit()
	  		                .remove()	
			SelectedAreaAreaChart.on("mouseover", mouseoverAreaChart)
						     			  .on("mouseleave", mouseleaveAreaChart) 		  		                  			  		                  

        } else { //deactivate
          if (active_link === this.id.split("id").pop()) {//active square selected; turn it OFF
            d3.select(this)           
              .style("stroke", "none");

            active_link = "0"; //reset

            //restore remaining boxes to normal opacity
            for (i = 0; i < legendClassArray.length; i++) {              
                d3.select("#id" + legendClassArray[i])
                  .style("opacity", 1);
            }

			yScaleAreaChart = d3.scaleLinear()
							  .domain([
							  	0,
							  	90
							  ])
						      .range([ heightAreaChart, 0]);
			var yAxisAreaChart = d3.axisLeft(yScaleAreaChart)
		          				.tickSize(3);	  
			gAreaChart.select('.yAxis')
						  .transition()
						   .duration(300)
						   .ease(d3.easeLinear)
						   .call(yAxisAreaChart);	

			SelectedAreaAreaChart = gAreaChart.selectAll("path.myAreaStacked")
														       .data(stackedDataAreaChart)
														       .enter().append("path")
														  	   .merge(SelectedAreaAreaChart)
			SelectedAreaAreaChart.transition()
	  			              .duration(1000)
	  			              .ease(d3.easeLinear)
	  			              .attr("class", "myAreaStacked")
		                      .style("fill", function(d) { return colorAreaChart(d.key); })
		                      .attr("d", areaAreaChart)
			SelectedAreaAreaChart.on("mouseover", mouseoverAreaChart)
						     			  .on("mouseleave", mouseleaveAreaChart) 		  
					
			// Show the areas

			// SelectedAreaAreaChart = gAreaChart.selectAll(".myAreaStacked")
			//        .data(stackedDataAreaChart)
			//        .enter()
			//        .merge(SelectedAreaAreaChart)
			//        .append("path")
			//         .attr("class", "myAreaStacked")
			// SelectedAreaAreaChart.transition()
	  //               .duration(500)
	  //               .ease(d3.easeLinear)			        
			//         .style("fill", function(d) { return colorAreaChart(d.key); })
			//         .attr("d", areaAreaChart)				        
			// SelectedAreaAreaChart.on("mouseover", mouseoverAreaChart)
			// 			      .on("mouseleave", mouseleaveAreaChart) 	
	  		                 
          }

        } //end active_link check
                          
                                
      });

  legend.append("text")
      .attr("x", 78)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { 
      	if (d === '60') {
      		return "> " + d + " anos"
      	} else {
      		return d + " anos"; 
      	}
      });				    

	//Create axis
	var xAxisAreaChart = d3.axisBottom(xScaleAreaChart)
						 .tickFormat(formatAsMonth)
						 .ticks(7)
						 .tickSize(3);
	var yAxisAreaChart = d3.axisLeft(yScaleAreaChart)
          					       .tickSize(3);						 
	gAreaChart.append("g")
		  .attr("class", "yAxis")
		  .attr("transform", "translate(-43,0)")
		  .call(yAxisAreaChart)

  gAreaChart.append("text")
         .attr("class", "axis-title")
         .attr("transform", "rotate(-90)")
         .style("text-anchor", "middle")
         .attr("y",-90)
         .attr("x",-heightAreaChart/2)
         .attr("dy", ".71em")
         .text("Volume de óbitos semanais");

	gAreaChart.append("g")
		    .attr("class", "xAxis")
		    .attr("transform", "translate(0," + heightAreaChart + ")")
		    .call(xAxisAreaChart)
		    .select(".domain")
		     .attr("stroke","#252525")
		     .attr("stroke-width","0");
	gAreaChart.selectAll(".tick")
		   .selectAll("line")
		    .attr("stroke-width","1");     
});