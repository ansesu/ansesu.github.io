//Margin
const marginConfirmadosComparacao = { top: 10, right: 10, bottom: 25, left: 76 };

//Width and Height
const widthConfirmadosComparacao = 600 - marginConfirmadosComparacao.left - marginConfirmadosComparacao.right;
const heightConfirmadosComparacao = 300 - marginConfirmadosComparacao.top - marginConfirmadosComparacao.bottom;

//For converting data
var parseTimeConfirmadosComparacao = d3.timeParse("%Y-%m-%d");

//Create categorical color scale
var colorMaringa = '#404040';
var colorOutros = '#bdbdbd';

//Load in the data
d3.csv("data/comparacao_confirmados.csv")
  .then(function(data) {			

  //Parse data
  data.forEach(function(d) {
  	d.Data = parseTimeConfirmadosComparacao(d.Data);		      
   	d.Confirmados = parseInt(d.Confirmados);
   	d.DeltaT = parseInt(d.DeltaT);
    d.Cidade = d.Cidade;
  });
  allGroupConfirmadosComparacao = ['Bologna (ITA)', 'Campina Grande', 'Condado de Monterey (EUA)',
                                   'Diadema', 'Jundiaí', 'Londrina', 'Montes Claros', 'Piracicaba',
                                   'Rio Branco', 'Santos', 'Suzano', 'São José do Rio Preto']
  // add the options to the button
  d3.select("#selectButtonConfirmados")
    .selectAll('myOptions')
    .data(allGroupConfirmadosComparacao)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button
  
  dataMaringaConfirmados = data.filter(function(d) { 
    return d.Cidade === "Maringá";
  });
  dataOutroConfirmados = data.filter(function(d) { 
    return d.Cidade === "Bologna (ITA)";
  });
  maxDelta = d3.max([d3.max(dataMaringaConfirmados, function(d) { return d.DeltaT; }),
                     d3.max(dataOutroConfirmados, function(d) { return d.DeltaT; })])
	//Create scale functions
	xScaleConfirmadosComparacao = d3.scaleLinear()
                			 	 .domain([0, maxDelta])
                			 	 .range([0, widthConfirmadosComparacao]);
	yScaleConfirmadosComparacao = d3.scaleLinear()
                				 .domain([0,d3.max(data, function(d) { return d.Confirmados; })])
                				 .range([heightConfirmadosComparacao, 0]);	

	//Create SVG element
	const svgConfirmadosComparacao = d3.select('#confirmados_comparacao')
                      	   .append('svg')
                      	    .attr("class", "content")
                      	    .attr("viewBox", `0 0 ${widthConfirmadosComparacao + marginConfirmadosComparacao.left + marginConfirmadosComparacao.right} ${heightConfirmadosComparacao + marginConfirmadosComparacao.top + marginConfirmadosComparacao.bottom}`)
                      	    .attr("preserveAspectRatio", "xMidYMid meet")
	    
	var gConfirmadosComparacao = svgConfirmadosComparacao.append("g")
	                                  .attr("transform", "translate(" + marginConfirmadosComparacao.left + "," + marginConfirmadosComparacao.top + ")");
  dataLegendConfirmadosComparacao = [{ color: "red",   name: "Bologna (ITA)" },
                                     { color: "black", name: "Maringá" }]
    //Create legend
    var legendRectConfirmadosComparacao = gConfirmadosComparacao.selectAll("#confirmados_comparacao rect.legend")
                                .data(dataLegendConfirmadosComparacao)
    legendRectConfirmadosComparacao.enter().append("rect")
            .merge(legendRectConfirmadosComparacao)
                .attr('class', 'legend')
                 .attr('x', 10)
                 .attr('y', function(d, i) {
                   return i * 13 + 10;
                 })
                 .attr('width', 10)
                 .attr('height', 10)
                   .transition()
                    .duration(300) 
                  .style('fill', function(d) {
                    return d.color;
                  });

    legendRectConfirmadosComparacao.exit().remove()

      var legendTextConfirmadosComparacao = gConfirmadosComparacao.selectAll("#confirmados_comparacao text.legend")
                      .data(dataLegendConfirmadosComparacao)                  
                  
      legendTextConfirmadosComparacao.enter().append("text")
              .merge(legendTextConfirmadosComparacao)
                 .attr("class", "legend")             
                   .attr('x', 25)
                   .attr('y', function(d, i) {
                     return (i * 13 + 19.5);
                   })
                   .text(function(d) {
                     return d.name;
               });    
      legendTextConfirmadosComparacao.exit().remove() 

    //Create axis
	var xAxisConfirmadosComparacao = d3.axisBottom(xScaleConfirmadosComparacao)
                				   .tickSize(3);
	var yAxisConfirmadosComparacao = d3.axisLeft(yScaleConfirmadosComparacao)
      				             .ticks(7)
      				             .tickSize(3);
	gConfirmadosComparacao.append("g")
          	   .attr("class", "xAxis")
          	   .attr("transform", "translate(0," + heightConfirmadosComparacao + ")")
          	   .call(xAxisConfirmadosComparacao)
          	   .select(".domain")
          	    .attr("stroke","#252525")
          	    .attr("stroke-width","0");
	gConfirmadosComparacao.append("g")
      	       .attr("class", "yAxis")
      	       .attr("transform", "translate(0,0)")
      	       .call(yAxisConfirmadosComparacao)

	//Create axis label
  gConfirmadosComparacao.append("text")
               .attr("class", "axis-title")
               .attr("transform", "rotate(-90)")
               .style("text-anchor", "middle")
               .attr("y",-75)
               .attr("x",-heightConfirmadosComparacao/2)
               .attr("dy", ".71em")
               .text("Casos");

	//Create lines
	var lineMaringaConfirmadosComparacao = d3.line()
                                     .x( function(d) { return xScaleConfirmadosComparacao(d.DeltaT); })
                                     .y( function(d) { return yScaleConfirmadosComparacao(d.Confirmados); })
  lineMaringaConfirmados = gConfirmadosComparacao.append("path")
                          .attr("class", "line")
                          .datum(dataMaringaConfirmados)
                          .attr("d", lineMaringaConfirmadosComparacao)
                          .attr("stroke", "black");

  var lineOutrosConfirmadosComparacao = d3.line()
                                           .x( function(d) { return xScaleConfirmadosComparacao(d.DeltaT); })
                                           .y( function(d) { return yScaleConfirmadosComparacao(d.Confirmados); })
  lineOutrosConfirmados = gConfirmadosComparacao.append("path")
                          .attr("class", "line")
                          .datum(dataOutroConfirmados)
                          .attr("d", lineOutrosConfirmadosComparacao)
                          .attr("stroke", "red");
	// // Create tooltip
 //  var focusConfirmadosComparacao = gConfirmadosComparacao.append("g")
 //                                      .attr("class", "focus");

 //  focusConfirmadosComparacao.append("path")
 //                   .attr("class", "hover-line")

 //  var linesConfirmadosComparacao = document.getElementsByClassName('line');
 //  var focusPerLineConfirmadosComparacao = focusConfirmadosComparacao.selectAll('.focus-per-line')
 //                                                .data(categoriesConfirmadosComparacao)
 //                                                .enter().append("g")
 //                                                 .attr("class", "focus-per-line");

 //  var tooltipTextConfirmadosComparacao = gConfirmadosComparacao.selectAll('.tooltip-text')
 //          	                               .data(categoriesConfirmadosComparacao)
 //          	                               .enter().append("text")
 //          	                                .attr("class", "tooltip-text");	    

 //  var tooltipTextDataConfirmadosComparacao = gConfirmadosComparacao.append("text")
 //          			                         			  .attr("class", "tooltip-date");	                                    
 //  focusPerLineConfirmadosComparacao.append("circle") 
 //                          .attr("opacity", "0")
 //                          .attr("r", 3)
 //                          .style("stroke", function(d) {
 //                          	return colorConfirmadosComparacao(d.name);
 //                          })
 //                          .style("fill", function(d) {
 //                            return colorConfirmadosComparacao(d.name);
 //                          });  

 //  svgConfirmadosComparacao.append('rect') 
 //                 .attr("class", "overlay")
 //                 .attr("transform", "translate(" + marginConfirmadosComparacao.left + "," + marginConfirmadosComparacao.top + ")")
 //                 .attr('width', widthConfirmadosComparacao)
 //                 .attr('height', heightConfirmadosComparacao)
 //                 .on("mouseover", function() {
 //                   	focusConfirmadosComparacao.style("display", null); 
 //                   	tooltipTextConfirmadosComparacao.style("display", null);
 //            				tooltipTextDataConfirmadosComparacao.style("display", null);
 //                 })
 //                 .on("mouseout", function() { 			        	
 //                   	focusConfirmadosComparacao.style("display", "none"); 
 //                   	tooltipTextConfirmadosComparacao.style("display", "none");
 //            				tooltipTextDataConfirmadosComparacao.style("display", "none");
 //                 })
 //                 .on('mousemove', event => mousemoveConfirmadosComparacao(event));

 //    function mousemoveConfirmadosComparacao(event) { // mouse moving over canvas
 //        var mouse = d3.pointer(event),
 //            x0 = xScaleConfirmadosComparacao.invert(mouse[0]),
 //            bisectData = d3.bisector(function(d) { return d.Data; }).left,
 //            i = bisectData(data, x0, 1),
 //            d0 = data[i - 1],
 //            d1 = data[i],
 //            dTrue = x0 - d0.Data > d1.Data - x0 ? d1 : d0,
 //            idx = x0 - d0.Data > d1.Data - x0 ? i : i-1,
 //        xData = dTrue.Data;
 //        d3.select("#confirmados_comparacao .hover-line")
 //           .attr("d", function() {
 //           		var dVar = "M" + xScaleConfirmadosComparacao(xData) + "," + heightConfirmadosComparacao;
 //            	dVar += " " + xScaleConfirmadosComparacao(xData) + "," + 0;
 //           		return dVar;
 //           });
 //        d3.select('#confirmados_comparacao .tooltip-date')
 //           .text(formatAsDate(xData))
 //           .attr("x", 10)
 //           .attr("y", heightConfirmadosComparacao - 68 - 3*11);
 //        tooltipTextConfirmadosComparacao
 //           .text(function (d) {if (Number.isNaN(data[idx][d.name])) {   
 //       		        return "";
 //       		    } else {
 //       		        return d.name + ": " + formatValue(data[idx][d.name]);
 //       		    }})
 //           .attr("x", 10)
 //           .attr("y", function (d,i) { return heightConfirmadosComparacao - 55.5 - (2-i)*15.5})
 //        d3.selectAll("#confirmados_comparacao .focus-per-line")
 //           .attr("transform", function(d, i) { 
 //           	   if (Number.isNaN(data[idx][d.name])) {   
 //           	        d3.select(this).select('#confirmados_comparacao .focus-per-line circle')
 //                       .style("opacity", "0")     
 //       		        return "translate(0,0)";
 //       		   } else {
 //           	        d3.select(this).select('#confirmados_comparacao .focus-per-line circle')
 //                       .style("opacity", "1")     
 //       		        return "translate(" + xScaleConfirmadosComparacao(xData) + "," + yScaleConfirmadosComparacao(data[idx][d.name]) +")";
 //       		   } 
 //          });
 //    };

 function update(selectedGroup) {
  // Create new data with the selection?

    dataOutroConfirmados = data.filter(function(d) { 
      return d.Cidade === selectedGroup;
    });

    maxDelta = d3.max([d3.max(dataMaringaConfirmados, function(d) { return d.DeltaT; }),
                       d3.max(dataOutroConfirmados, function(d) { return d.DeltaT; })])
    //Create scale functions
    xScaleConfirmadosComparacao = d3.scaleLinear()
                           .domain([0, maxDelta])
                           .range([0, widthConfirmadosComparacao]);
      //Create axis
    var xAxisConfirmadosComparacao = d3.axisBottom(xScaleConfirmadosComparacao)
                             .tickSize(3);
    gConfirmadosComparacao.select('.xAxis')
       .transition()
        .duration(300)
        .ease(d3.easeLinear)
        .call(xAxisConfirmadosComparacao);

    // Give these new data to update line
    lineOutrosConfirmados
        .datum(dataOutroConfirmados)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return xScaleConfirmadosComparacao(d.DeltaT) })
          .y(function(d) { return yScaleConfirmadosComparacao(d.Confirmados) })
        )
        .attr("stroke", function(d){ return "red" })  

    lineMaringaConfirmados
        .datum(dataMaringaConfirmados)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return xScaleConfirmadosComparacao(d.DeltaT) })
          .y(function(d) { return yScaleConfirmadosComparacao(d.Confirmados) })
        )
        .attr("stroke", function(d){ return "black" })     

    dataLegendConfirmadosComparacao = [{ color: "red",   name: selectedGroup },
                                       { color: "black", name: "Maringá" }]
    // Create legend

    var legendTextConfirmadosComparacao = gConfirmadosComparacao.selectAll("#confirmados_comparacao text.legend")
                                                                 .data(dataLegendConfirmadosComparacao)                  
                
    legendTextConfirmadosComparacao.enter().append("text")
            .merge(legendTextConfirmadosComparacao)
            .transition()
            .duration(1000)            
               .attr("class", "legend")             
                 .attr('x', 25)
                 .attr('y', function(d, i) {
                   return (i * 13 + 19.5);
                 })
                 .text(function(d) {
                   return d.name;
             });    

    legendTextConfirmadosComparacao.exit().remove()           
  } 

    // When the button is changed, run the updateChart function
    d3.select("#selectButtonConfirmados").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })  
});