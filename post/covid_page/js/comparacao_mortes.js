//Margin
const marginMortesComparacao = { top: 10, right: 10, bottom: 40, left: 54 };

//Width and Height
const widthMortesComparacao = 600 - marginMortesComparacao.left - marginMortesComparacao.right;
const heightMortesComparacao = 300 - marginMortesComparacao.top - marginMortesComparacao.bottom;

//For converting data
var parseTimeMortesComparacao = d3.timeParse("%Y-%m-%d");

//Create categorical color scale
var colorMaringaMortes = '#ef3b2c';
var colorOutroMortes = '#bdbdbd';

//Load in the data
d3.csv("data/comparacao_mortes.csv")
  .then(function(data) {			

  //Parse data
  data.forEach(function(d) {
  	d.Data = parseTimeMortesComparacao(d.Data);		      
   	d.Mortes = parseInt(d.Mortes);
   	d.DeltaT = parseInt(d.DeltaT);
    d.Cidade = d.Cidade;
  });
  allGroupMortesComparacao = [ 'Condado de Monterey (EUA)', 'Campina Grande', 
                                   'Diadema', 'Jundiaí', 'Londrina', 'Montes Claros', 'Piracicaba',
                                   'Rio Branco', 'Santos', 'Suzano', 'São José do Rio Preto']
  // add the options to the button
  d3.select("#selectButtonMortes")
    .selectAll('myOptions')
    .data(allGroupMortesComparacao)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button
  
  dataMaringaMortes = data.filter(function(d) { 
    return d.Cidade === "Maringá";
  });
  dataOutroMortes = data.filter(function(d) { 
    return d.Cidade === "Condado de Monterey (EUA)";
  });
  maxDelta = d3.max([d3.max(dataMaringaMortes, function(d) { return d.DeltaT; }),
                     d3.max(dataOutroMortes, function(d) { return d.DeltaT; })])
	//Create scale functions
	xScaleMortesComparacao = d3.scaleLinear()
                			 	 .domain([0, maxDelta])
                			 	 .range([0, widthMortesComparacao]);
	yScaleMortesComparacao = d3.scaleLinear()
                				 .domain([0,d3.max(data, function(d) { return d.Mortes; })])
                				 .range([heightMortesComparacao, 0]);	

	//Create SVG element
	const svgMortesComparacao = d3.select('#comparacao_mortes')
                      	   .append('svg')
                      	    .attr("class", "content")
                      	    .attr("viewBox", `0 0 ${widthMortesComparacao + marginMortesComparacao.left + marginMortesComparacao.right} ${heightMortesComparacao + marginMortesComparacao.top + marginMortesComparacao.bottom}`)
                      	    .attr("preserveAspectRatio", "xMidYMid meet")
	    
	var gMortesComparacao = svgMortesComparacao.append("g")
	                                  .attr("transform", "translate(" + marginMortesComparacao.left + "," + marginMortesComparacao.top + ")");
  dataLegendMortesComparacao = [{ color: colorOutroMortes,   name: "Condado de Monterey (EUA)" },
                                     { color: colorMaringaMortes, name: "Maringá" }]
    //Create legend
    var legendRectMortesComparacao = gMortesComparacao.selectAll("#comparacao_mortes rect.legend")
                                .data(dataLegendMortesComparacao)
    legendRectMortesComparacao.enter().append("rect")
            .merge(legendRectMortesComparacao)
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

    legendRectMortesComparacao.exit().remove()

      var legendTextMortesComparacao = gMortesComparacao.selectAll("#comparacao_mortes text.legend")
                      .data(dataLegendMortesComparacao)                  
                  
      legendTextMortesComparacao.enter().append("text")
              .merge(legendTextMortesComparacao)
                 .attr("class", "legend")             
                   .attr('x', 25)
                   .attr('y', function(d, i) {
                     return (i * 17.3+11);
                   })
                   .text(function(d) {
                     return d.name;
               });    
      legendTextMortesComparacao.exit().remove() 

    //Create axis
	var xAxisMortesComparacao = d3.axisBottom(xScaleMortesComparacao)
                				   .tickSize(3);
	var yAxisMortesComparacao = d3.axisLeft(yScaleMortesComparacao)
      				             .ticks(7)
      				             .tickSize(3);
	gMortesComparacao.append("g")
          	   .attr("class", "xAxis")
          	   .attr("transform", "translate(0," + heightMortesComparacao + ")")
          	   .call(xAxisMortesComparacao)
          	   .select(".domain")
          	    .attr("stroke","#252525")
          	    .attr("stroke-width","0");
	gMortesComparacao.append("g")
      	       .attr("class", "yAxis")
      	       .attr("transform", "translate(0,0)")
      	       .call(yAxisMortesComparacao)

	//Create axis label
  gMortesComparacao.append("text")
               .attr("class", "axis-title")
               .attr("transform", "rotate(-90)")
               .style("text-anchor", "middle")
               .attr("y",-53)
               .attr("x",-heightMortesComparacao/2)
               .attr("dy", ".71em")
               .text("Óbitos");
// Create axis label
gMortesComparacao.append("text")
    .attr("class", "axis-title")
    .style("text-anchor", "middle")
    .attr("y",heightMortesComparacao+37)
    .attr("x",widthMortesComparacao/2)
    .text("Dias após o primeiro óbito");
	//Create lines
	var lineMaringaMortesComparacao = d3.line()
                                     .x( function(d) { return xScaleMortesComparacao(d.DeltaT); })
                                     .y( function(d) { return yScaleMortesComparacao(d.Mortes); })
  lineMaringaMortes = gMortesComparacao.append("path")
                          .attr("class", "line")
                          .datum(dataMaringaMortes)
                          .attr("d", lineMaringaMortesComparacao)
                          .attr("stroke", colorMaringaMortes);

  var lineOutrosMortesComparacao = d3.line()
                                           .x( function(d) { return xScaleMortesComparacao(d.DeltaT); })
                                           .y( function(d) { return yScaleMortesComparacao(d.Mortes); })
  lineOutrosMortes = gMortesComparacao.append("path")
                          .attr("class", "line")
                          .datum(dataOutroMortes)
                          .attr("d", lineOutrosMortesComparacao)
                          .attr("stroke", colorOutroMortes);

  //Create tooltip
  var focusMortesComparacaoHover = gMortesComparacao.append("g")
                            .attr("class", "focus");  
  var focusMortesComparacaoOutro = gMortesComparacao.append("g")
                            .attr("class", "focus");  
  var focusMortesComparacaoMaringa = gMortesComparacao.append("g")
                            .attr("class", "focus");
  

  focusMortesComparacaoHover.append("path") 
               .attr("class", "hover-line")

  var focusMortesComparacaoText = gMortesComparacao.append("g")
                                .attr("class", "focus");
  focusMortesComparacaoText.append("text")
                  .attr("class", "tooltip-text Maringa")
  focusMortesComparacaoText.append("text")
                  .attr("class", "tooltip-text Outro")

  focusMortesComparacaoMaringa.append("circle")
              .attr("class", "Maringa")
              .attr("r", 3)
              .attr("opacity", "0");
  focusMortesComparacaoOutro.append("circle")
              .attr("class", "Outro")
              .attr("r", 3)
              .attr("opacity", "0");

  svgMortesComparacao.append("rect")
                          .attr("class", "overlay")
                            .attr("transform", "translate(" + marginMortesComparacao.left + "," + marginMortesComparacao.top + ")")
                            .attr("width", widthMortesComparacao)
                            .attr("height", heightMortesComparacao)
                            .on("mouseover", function() {
                              focusMortesComparacaoMaringa.style("display", null);
                              focusMortesComparacaoOutro.style("display", null); 
                              focusMortesComparacaoHover.style("display", null); 
                              focusMortesComparacaoText.style("display", null); 
                            })
                            .on("mouseout", function() {                
                              focusMortesComparacaoMaringa.style("display", "none");
                              focusMortesComparacaoOutro.style("display", "none");
                              focusMortesComparacaoHover.style("display", "none");                              
                              focusMortesComparacaoText.style("display", "none"); 
                            })
                            .on("mousemove", event => mousemoveMortesComparacao(event));

  function mousemoveMortesComparacao(event) {
    // Get coords - Maringa
    var x0_Maringa = xScaleMortesComparacao.invert(d3.pointer(event)[0]),
          bisectDate_Maringa = d3.bisector(function(d) { return d.DeltaT; }).left,
          i_Maringa = bisectDate_Maringa(dataMaringaMortes, x0_Maringa, 1),
          d0_Maringa = dataMaringaMortes[i_Maringa - 1],
          d1_Maringa = dataMaringaMortes[i_Maringa];
    if (d1_Maringa == null){
      var d1_Maringa = dataMaringaMortes[i_Maringa - 1];
    }
    var dTrue_Maringa = x0_Maringa - d0_Maringa.DeltaT > d1_Maringa.DeltaT - x0_Maringa ? d1_Maringa : d0_Maringa; // if is true, d1, if is false d0
    xDate_Maringa = dTrue_Maringa.DeltaT;

    // Get coords - Outro             
    var x0_Outro = xScaleMortesComparacao.invert(d3.pointer(event)[0]),
          bisectDate_Outro = d3.bisector(function(d) { return d.DeltaT; }).left,
          i_Outro = bisectDate_Outro(dataOutroMortes, x0_Outro, 1),
          d0_Outro = dataOutroMortes[i_Outro - 1] ,
          d1_Outro = dataOutroMortes[i_Outro];
    if (d1_Outro == null){
      var d1_Outro = dataOutroMortes[i_Outro - 1];
    }
    var dTrue_Outro = x0_Outro - d0_Outro.DeltaT > d1_Outro.DeltaT - x0_Outro ? d1_Outro : d0_Outro; // if is true, d1, if is false d0
    xDate_Outro = dTrue_Outro.DeltaT;

    var mouse = d3.pointer(event);
    //showLine();
    // move the vertical line
    d3.select("#comparacao_mortes .hover-line")
      .attr("d", function() {
        var d = "M" + mouse[0] + "," + heightMortesComparacao;
        d += " " + mouse[0] + ",0" ;
        return d;}
)            
    focusMortesComparacaoMaringa.attr("transform", "translate(" + xScaleMortesComparacao(xDate_Maringa) + "," + yScaleMortesComparacao(dTrue_Maringa.Mortes) + ")");
    focusMortesComparacaoMaringa.select("#comparacao_mortes circle.Maringa")
                 .style("stroke", colorMaringaMortes)
                 .style("fill", colorMaringaMortes)
                 .attr("opacity", "1");
    focusMortesComparacaoOutro.attr("transform", "translate(" + xScaleMortesComparacao(xDate_Outro) + "," + yScaleMortesComparacao(dTrue_Outro.Mortes) + ")");
    focusMortesComparacaoOutro.select("#comparacao_mortes circle.Outro")
                 .style("stroke", colorOutroMortes)
                 .style("fill", colorOutroMortes)
                 .attr("opacity", "1");
                                  
    focusMortesComparacaoText.select("#comparacao_mortes .Maringa")
                    .text(function() { return dTrue_Maringa.Cidade+ ": " + formatValue(dTrue_Maringa.Mortes) + " óbitos (" + xDate_Maringa + " dias)"; })
                    .attr("position", "absolute")
                    .attr("y", heightMortesComparacao-133)
                    .attr("x", 10);
    focusMortesComparacaoText.select("#comparacao_mortes .Outro")
                    .text(function() { return dTrue_Outro.Cidade+ ": " + formatValue(dTrue_Outro.Mortes) + " óbitos (" + xDate_Outro + " dias)"; })
                    .attr("y", heightMortesComparacao-150)
                    .attr("x", 10);
  }

 function update(selectedGroup) {
  // Create new data with the selection?

    dataOutroMortes = data.filter(function(d) { 
      return d.Cidade === selectedGroup;
    });

    maxDelta = d3.max([d3.max(dataMaringaMortes, function(d) { return d.DeltaT; }),
                       d3.max(dataOutroMortes, function(d) { return d.DeltaT; })])
    //Create scale functions
    xScaleMortesComparacao = d3.scaleLinear()
                           .domain([0, maxDelta])
                           .range([0, widthMortesComparacao]);
      //Create axis
    var xAxisMortesComparacao = d3.axisBottom(xScaleMortesComparacao)
                             .tickSize(3);
    gMortesComparacao.select('.xAxis')
       .transition()
        .duration(300)
        .ease(d3.easeLinear)
        .call(xAxisMortesComparacao);

    // Give these new data to update line
    lineOutrosMortes
        .datum(dataOutroMortes)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return xScaleMortesComparacao(d.DeltaT) })
          .y(function(d) { return yScaleMortesComparacao(d.Mortes) })
        )
        .attr("stroke", function(d){ return colorOutroMortes })  

    lineMaringaMortes
        .datum(dataMaringaMortes)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
          .x(function(d) { return xScaleMortesComparacao(d.DeltaT) })
          .y(function(d) { return yScaleMortesComparacao(d.Mortes) })
        )
        .attr("stroke", function(d){ return colorMaringaMortes })     

    dataLegendMortesComparacao = [{ color: colorOutroMortes,   name: selectedGroup },
                                       { color: colorMaringaMortes, name: "Maringá" }]
    // Create legend

    var legendTextMortesComparacao = gMortesComparacao.selectAll("#comparacao_mortes text.legend")
                                                                 .data(dataLegendMortesComparacao)                  
                
    legendTextMortesComparacao.enter().append("text")
            .merge(legendTextMortesComparacao)
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

    legendTextMortesComparacao.exit().remove()           
  } 

    // When the button is changed, run the updateChart function
    d3.select("#selectButtonMortes").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })  
});