//Margin
const marginConfirmadosComparacao = { top: 10, right: 10, bottom: 40, left: 70 };

//Width and Height
const widthConfirmadosComparacao = 600 - marginConfirmadosComparacao.left - marginConfirmadosComparacao.right;
const heightConfirmadosComparacao = 300 - marginConfirmadosComparacao.top - marginConfirmadosComparacao.bottom;

//For converting data
var parseTimeConfirmadosComparacao = d3.timeParse("%Y-%m-%d");

//Create categorical color scale
var colorMaringaConfirmados = '#404040';
var colorOutroConfirmados = '#bdbdbd';

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
	const svgConfirmadosComparacao = d3.select('#comparacao_confirmados')
                      	   .append('svg')
                      	    .attr("class", "content")
                      	    .attr("viewBox", `0 0 ${widthConfirmadosComparacao + marginConfirmadosComparacao.left + marginConfirmadosComparacao.right} ${heightConfirmadosComparacao + marginConfirmadosComparacao.top + marginConfirmadosComparacao.bottom}`)
                      	    .attr("preserveAspectRatio", "xMidYMid meet")
	    
	var gConfirmadosComparacao = svgConfirmadosComparacao.append("g")
	                                  .attr("transform", "translate(" + marginConfirmadosComparacao.left + "," + marginConfirmadosComparacao.top + ")");
  dataLegendConfirmadosComparacao = [{ color: colorOutroConfirmados,   name: "Bologna (ITA)" },
                                     { color: colorMaringaConfirmados, name: "Maringá" }]
    //Create legend
    var legendRectConfirmadosComparacao = gConfirmadosComparacao.selectAll("#comparacao_confirmados rect.legend")
                                .data(dataLegendConfirmadosComparacao)
    legendRectConfirmadosComparacao.enter().append("rect")
            .merge(legendRectConfirmadosComparacao)
                .attr('class', 'legend')
                 .attr('x', 10)
                 .attr('y', function(d, i) {
                   return i * 17.3;
                 })
                 .attr('width', 12)
                 .attr('height', 12)
                   .transition()
                    .duration(300) 
                  .style('fill', function(d) {
                    return d.color;
                  });

    legendRectConfirmadosComparacao.exit().remove()

      var legendTextConfirmadosComparacao = gConfirmadosComparacao.selectAll("#comparacao_confirmados text.legend")
                      .data(dataLegendConfirmadosComparacao)                  
                  
      legendTextConfirmadosComparacao.enter().append("text")
              .merge(legendTextConfirmadosComparacao)
                 .attr("class", "legend")             
                   .attr('x', 25)
                   .attr('y', function(d, i) {
                     return (i * 17.3+11);
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
               .attr("y",-70)
               .attr("x",-heightConfirmadosComparacao/2)
               .attr("dy", ".71em")
               .text("Casos de COVID-19");
// Create axis label
gConfirmadosComparacao.append("text")
    .attr("class", "axis-title")
    .style("text-anchor", "middle")
    .attr("y",heightConfirmadosComparacao+37)
    .attr("x",widthConfirmadosComparacao/2)
    .text("Dias após o primeiro caso");
	//Create lines
	var lineMaringaConfirmadosComparacao = d3.line()
                                     .x( function(d) { return xScaleConfirmadosComparacao(d.DeltaT); })
                                     .y( function(d) { return yScaleConfirmadosComparacao(d.Confirmados); })
  lineMaringaConfirmados = gConfirmadosComparacao.append("path")
                          .attr("class", "line")
                          .datum(dataMaringaConfirmados)
                          .attr("d", lineMaringaConfirmadosComparacao)
                          .style("stroke", colorMaringaConfirmados);

  var lineOutrosConfirmadosComparacao = d3.line()
                                           .x( function(d) { return xScaleConfirmadosComparacao(d.DeltaT); })
                                           .y( function(d) { return yScaleConfirmadosComparacao(d.Confirmados); })
  lineOutrosConfirmados = gConfirmadosComparacao.append("path")
                          .attr("class", "line")
                          .datum(dataOutroConfirmados)
                          .attr("d", lineOutrosConfirmadosComparacao)
                          .style("stroke", colorOutroConfirmados);

  //Create tooltip
  var focusConfirmadosComparacaoHover = gConfirmadosComparacao.append("g")
                            .attr("class", "focus");  
  var focusConfirmadosComparacaoOutro = gConfirmadosComparacao.append("g")
                            .attr("class", "focus");  
  var focusConfirmadosComparacaoMaringa = gConfirmadosComparacao.append("g")
                            .attr("class", "focus");
  

  focusConfirmadosComparacaoHover.append("path") 
               .attr("class", "hover-line")

  var focusConfirmadosComparacaoText = gConfirmadosComparacao.append("g")
                                .attr("class", "focus");
  focusConfirmadosComparacaoText.append("text")
                  .attr("class", "tooltip-text Maringa")
  focusConfirmadosComparacaoText.append("text")
                  .attr("class", "tooltip-text Outro")

  focusConfirmadosComparacaoMaringa.append("circle")
              .attr("class", "Maringa")
              .attr("r", 3)
              .attr("opacity", "0");
  focusConfirmadosComparacaoOutro.append("circle")
              .attr("class", "Outro")
              .attr("r", 3)
              .attr("opacity", "0");

  svgConfirmadosComparacao.append("rect")
                          .attr("class", "overlay")
                            .attr("transform", "translate(" + marginConfirmadosComparacao.left + "," + marginConfirmadosComparacao.top + ")")
                            .attr("width", widthConfirmadosComparacao)
                            .attr("height", heightConfirmadosComparacao)
                            .on("mouseover", function() {
                              focusConfirmadosComparacaoMaringa.style("display", null);
                              focusConfirmadosComparacaoOutro.style("display", null); 
                              focusConfirmadosComparacaoHover.style("display", null); 
                              focusConfirmadosComparacaoText.style("display", null); 
                            })
                            .on("mouseout", function() {                
                              focusConfirmadosComparacaoMaringa.style("display", "none");
                              focusConfirmadosComparacaoOutro.style("display", "none");
                              focusConfirmadosComparacaoHover.style("display", "none");                              
                              focusConfirmadosComparacaoText.style("display", "none"); 
                            })
                            .on("mousemove", event => mousemoveConfirmadosComparacao(event));

  function mousemoveConfirmadosComparacao(event) {
    // Get coords - Maringa
    var x0_Maringa = xScaleConfirmadosComparacao.invert(d3.pointer(event)[0]),
          bisectDate_Maringa = d3.bisector(function(d) { return d.DeltaT; }).left,
          i_Maringa = bisectDate_Maringa(dataMaringaConfirmados, x0_Maringa, 1),
          d0_Maringa = dataMaringaConfirmados[i_Maringa - 1],
          d1_Maringa = dataMaringaConfirmados[i_Maringa];
    if (d1_Maringa == null){
      var d1_Maringa = dataMaringaConfirmados[i_Maringa - 1];
    }
    var dTrue_Maringa = x0_Maringa - d0_Maringa.DeltaT > d1_Maringa.DeltaT - x0_Maringa ? d1_Maringa : d0_Maringa; // if is true, d1, if is false d0
    xDate_Maringa = dTrue_Maringa.DeltaT;

    // Get coords - Outro             
    var x0_Outro = xScaleConfirmadosComparacao.invert(d3.pointer(event)[0]),
          bisectDate_Outro = d3.bisector(function(d) { return d.DeltaT; }).left,
          i_Outro = bisectDate_Outro(dataOutroConfirmados, x0_Outro, 1),
          d0_Outro = dataOutroConfirmados[i_Outro - 1],
          d1_Outro = dataOutroConfirmados[i_Outro];
    if (d1_Outro == null){
      var d1_Outro = dataOutroConfirmados[i_Outro - 1];
    }
    var dTrue_Outro = x0_Outro - d0_Outro.DeltaT > d1_Outro.DeltaT - x0_Outro ? d1_Outro : d0_Outro; // if is true, d1, if is false d0
    xDate_Outro = dTrue_Outro.DeltaT;

    var mouse = d3.pointer(event);
    //showLine();
    // move the vertical line
    d3.select("#comparacao_confirmados .hover-line")
      .attr("d", function() {
        var d = "M" + mouse[0] + "," + heightConfirmadosComparacao;
        d += " " + mouse[0] + ",0" ;
        return d;}
    )            
    focusConfirmadosComparacaoMaringa.attr("transform", "translate(" + xScaleConfirmadosComparacao(xDate_Maringa) + "," + yScaleConfirmadosComparacao(dTrue_Maringa.Confirmados) + ")");
    focusConfirmadosComparacaoMaringa.select("#comparacao_confirmados circle.Maringa")
                 .style("stroke", colorMaringaConfirmados)
                 .style("fill", colorMaringaConfirmados)
                 .attr("opacity", "1");
    focusConfirmadosComparacaoOutro.attr("transform", "translate(" + xScaleConfirmadosComparacao(xDate_Outro) + "," + yScaleConfirmadosComparacao(dTrue_Outro.Confirmados) + ")");
    focusConfirmadosComparacaoOutro.select("#comparacao_confirmados circle.Outro")
                 .style("stroke", colorOutroConfirmados)
                 .style("fill", colorOutroConfirmados)
                 .attr("opacity", "1");
                                  
    focusConfirmadosComparacaoText.select("#comparacao_confirmados .Maringa")
                    .text(function() { return dTrue_Maringa.Cidade+ ": " + formatValue(dTrue_Maringa.Confirmados) + " casos (" + xDate_Maringa + " dias)"; })
                    .attr("position", "absolute")
                    .attr("y", heightConfirmadosComparacao-133)
                    .attr("x", 10);
    focusConfirmadosComparacaoText.select("#comparacao_confirmados .Outro")
                    .text(function() { return dTrue_Outro.Cidade+ ": " + formatValue(dTrue_Outro.Confirmados) + " casos (" + xDate_Outro + " dias)"; })
                    .attr("y", heightConfirmadosComparacao-150)
                    .attr("x", 10);
  }

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
        .attr("stroke", function(d){ return colorOutroConfirmados })  

    lineMaringaConfirmados
        .datum(dataMaringaConfirmados)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return xScaleConfirmadosComparacao(d.DeltaT) })
          .y(function(d) { return yScaleConfirmadosComparacao(d.Confirmados) })
        )
        .attr("stroke", function(d){ return colorMaringaConfirmados })     

    dataLegendConfirmadosComparacao = [{ color: colorOutroConfirmados,   name: selectedGroup },
                                       { color: colorMaringaConfirmados, name: "Maringá" }]
    // Create legend

    var legendTextConfirmadosComparacao = gConfirmadosComparacao.selectAll("#comparacao_confirmados text.legend")
                                                                 .data(dataLegendConfirmadosComparacao)                  
                
    legendTextConfirmadosComparacao.enter().append("text")
            .merge(legendTextConfirmadosComparacao)
            .transition()
            .duration(1000)            
               .attr("class", "legend")             
                 .attr('x', 25)
                 .attr('y', function(d, i) {
                   return (i * 17.3+11);
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