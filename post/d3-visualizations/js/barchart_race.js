function makeChart() {
	//Margin
	const marginRace = { top: 55, right: 150, bottom: 0, left: 0 };

	//Width and height
	const widthRace = 960 - marginRace.left - marginRace.right;
	const heightRace = 600 - marginRace.top - marginRace.bottom;

	// Top elements consider
	var top_n = 12;

	//SVG			
	const svgRace = d3.select('#barchartrace')
					  .append('svg')
					    .attr("class", "content")
					    .attr("viewBox", `0 0 ${widthRace + marginRace.left + marginRace.right} ${heightRace + marginRace.top + marginRace.bottom}`)
					    .attr("preserveAspectRatio", "xMidYMid meet")
	var gRace = svgRace.append("g")
	   			 	    .attr("transform", "translate(" + marginRace.left + "," + marginRace.top + ")");

	var tickDuration = 120;

	let barPadding = heightRace/(top_n*5);

	//For converting data
	var parseTimeRace = d3.timeParse("%Y-%m-%d");

    let titleRace = gRace.append('text')
			              .attr('class', 'title-race')
			              .attr('y', -30)
			              .html('Número de scrobbles por artista do ansesu em 2022');
     	    
    let dateRace = + new Date(2022,0,1);

	d3.csv("data/barchart_data.csv")
	  .then(function(data) {	

		///Parse data and sort values by date
		data.forEach(d => {
		    d.value = parseInt(d.value);
		    d.lastValue = parseInt(d.lastValue);
		    d.date = parseTimeRace(d.date);
		    d.colour = d3.hsl(Math.random()*360,0.75,0.75);
	  	});
		data.forEach (d => {
			d.date = +d.date;
		});
		DatesRace = Array.from(data, function (d) {return d.date;} );				
		uniqueDates = DatesRace.filter((v, i, a) => a.indexOf(v) === i);           
	    var maxDateRace = d3.max(data, d => d.date)

		let dateSlice = data.filter(d => d.date == dateRace && !isNaN(d.value))
						 	 .sort((a,b) => b.value - a.value)
						 	 .slice(0, top_n);	
			
		dateSlice.forEach((d,i) => d.rank = i);		

		let xScaleRace = d3.scaleLinear()
				            .domain([0, d3.max(dateSlice, d => d.value)])
				            .range([0, widthRace]);

		let yScaleRace = d3.scaleLinear()
			        	    .domain([top_n, 0])
			        	    .range([heightRace, 0]);
		let xAxisRace = d3.axisTop()
				          .scale(xScaleRace)
				          .ticks(widthRace > 500 ? 5:2)
				          .tickSize(-heightRace)
				          .tickFormat(d => d3.format(',')(d));
		gRace.append('g')
		      .attr('class', 'axis xAxis')
		      .call(xAxisRace)
		      .selectAll('.tick line')
		      .classed('origin', d => d == 0);			
		gRace.selectAll('rect.bar')
		     .data(dateSlice, d => d.name)
		     .enter()
		     .append('rect')
		      .attr('class', 'bar')
		      .attr('x', 1)
		      .attr('width', d => xScaleRace(d.value))
		      .attr('y', d => yScaleRace(d.rank)+5)
		      .attr('height', yScaleRace(1)-yScaleRace(0)-barPadding)
		      .style('fill', d => d.colour);

		gRace.selectAll('text.label')
			 .data(dateSlice, d => d.name)
			 .enter()
			 .append('text')
			  .attr('class', 'label')
			  .style("font-variant-numeric", "tabular-nums")
			  .attr('x', d => xScaleRace(d.value)+5)
			  .attr('y', d => yScaleRace(d.rank)-5+((yScaleRace(1)-yScaleRace(0))/2)+1)
			  .style('text-anchor', 'start')
			  .html(d => d.name);

		gRace.selectAll('text.valueLabel')
		     .data(dateSlice, d => d.name)
		     .enter()
		     .append('text')
		      .attr('class', 'valueLabel')
		      .style("font-variant-numeric", "tabular-nums")
		      .attr('x', d => xScaleRace(d.value)+5)
		      .attr('y', d => yScaleRace(d.rank)+15+((yScaleRace(1)-yScaleRace(0))/2)+1)
		      .text(d => d3.format(',.0f')(d.lastValue));

		let dateText = gRace.append('text')
						     .attr('class', 'dateText')
						     .attr('x', widthRace)
						     .attr('y', heightRace-25)
						     .style('text-anchor', 'end')
						     .html(formatAsDate(new Date(dateRace)))
						     .call(halo, 10);

		let i = 0;

		let ticker = d3.interval(e => {						
			dateSlice = data.filter(d => d.date === +dateRace && !isNaN(d.value))
							 .sort((a,b) => b.value - a.value)
							 .slice(0, top_n);	

			dateSlice.forEach((d,i) => d.rank = i);
			
			xScaleRace.domain([0, d3.max(dateSlice, d => d.value)]); 

			gRace.select('.xAxis')
			     .transition()
			      .duration(tickDuration)
			      .ease(d3.easeLinear)
			      .call(xAxisRace);

			let barsRace = gRace.selectAll('.bar').data(dateSlice, d => d.name);

			barsRace
				.enter()
				.append('rect')
				 .attr('class', d => `bar ${d.name.replace(/\s/g,'_')}`)
				 .attr('x', xScaleRace(0)+1)
				 .attr( 'width', d => xScaleRace(d.value))
				 .attr('y', d => yScaleRace(top_n+1)+5)
				 .attr('height', yScaleRace(1)-yScaleRace(0)-barPadding)
				 .style('fill', d => d.colour)
				 .transition()
				   .duration(tickDuration)
				   .ease(d3.easeLinear)
				   .attr('y', d => yScaleRace(d.rank)+5);
			  
			barsRace
				.transition()
				 .duration(tickDuration)
				 .ease(d3.easeLinear)
				 .attr('width', d => xScaleRace(d.value))
				 .attr('y', d => yScaleRace(d.rank)+5);
				    
			barsRace
				.exit()
				.transition()
				 .duration(tickDuration)
				 .ease(d3.easeLinear)
				 .attr('width', d => xScaleRace(d.value))
				 .attr('y', d => yScaleRace(top_n+1)+5)
			 	  .remove();

			let labelsRace = gRace.selectAll('.label')
			 				      .data(dateSlice, d => d.name);

			labelsRace
				.enter()
				.append('text')
				 .attr('class', 'label')
				 .attr('x', d => xScaleRace(d.value)+5)
				 .attr('y', d => yScaleRace(top_n+1)-5+((yScaleRace(1)-yScaleRace(0))/2))
				 .style('text-anchor', 'start')
				 .html(d => d.name)    
				 .transition()
				   .duration(tickDuration)
				   .ease(d3.easeLinear)
				   .attr('y', d => yScaleRace(d.rank)-5+((yScaleRace(1)-yScaleRace(0))/2)+1);
				     

			labelsRace
				.transition()
				 .duration(tickDuration)
				 .ease(d3.easeLinear)
				 .attr('x', d => xScaleRace(d.value)+5)
				 .attr('y', d => yScaleRace(d.rank)-5+((yScaleRace(1)-yScaleRace(0))/2)+1);

			labelsRace
				  .exit()
				  .transition()
				    .duration(tickDuration)
				    .ease(d3.easeLinear)
				    .attr('x', d => xScaleRace(d.value)+5)
				    .attr('y', d => yScaleRace(top_n+1)-5)
				    .remove();
				 
			let valueLabelsRace = gRace.selectAll('.valueLabel').data(dateSlice, d => d.name);

			valueLabelsRace
					  .enter()
					  .append('text')
					   .attr('class', 'valueLabel')
					   .attr('x', d => xScaleRace(d.value)+5)
					   .attr('y', d => yScaleRace(top_n+1)+15)
					   .text(d => d3.format(',.0f')(d.lastValue))
					   .transition()
					    .duration(tickDuration)
					    .ease(d3.easeLinear)
					    .attr('y', d => yScaleRace(d.rank)+15+((yScaleRace(1)-yScaleRace(0))/2)+1);
			    
			valueLabelsRace
					  .transition()
					   .duration(tickDuration)
					   .ease(d3.easeLinear)
					   .attr('x', d => xScaleRace(d.value)+5)
					   .attr('y', d => yScaleRace(d.rank)+15+((yScaleRace(1)-yScaleRace(0))/2)+1)
					   .tween("text", function(d) {
					      let i = d3.interpolateRound(d.lastValue, d.value);
					      return function(t) {
					        this.textContent = d3.format(',')(i(t));
					     };
					   });

			valueLabelsRace
					.exit()
					.transition()
					 .duration(tickDuration)
					 .ease(d3.easeLinear)
					 .attr('x', d => xScaleRace(d.value)+5)
					 .attr('y', d => yScaleRace(top_n+1)+15)
					 .remove();

			dateText.html(formatAsDate(new Date(dateRace)));

			if (dateRace == maxDateRace) {
				ticker.stop();
			}
			i = i +1;
			dateRace = uniqueDates[i];

		}, tickDuration);
	});
	const halo = function(text, strokeWidth) {
	text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
		.style('fill', '#ffffff')
		.style( 'stroke','#ffffff')
		.style('stroke-width', strokeWidth)
		.style('stroke-linejoin', 'round')
		.style('opacity', 1);
	}   
}

makeChart();