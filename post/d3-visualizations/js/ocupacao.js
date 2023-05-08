//Margin
const marginOcupacao = { top: 10, right: 0, bottom: 25, left: 46 };

//Width and Height
const widthOcupacao = 600 - marginOcupacao.left - marginOcupacao.right;
const heightOcupacao = 150 - marginOcupacao.top - marginOcupacao.bottom;

//For converting data
var parseTimeOcupacao = d3.timeParse("%Y-%m-%d");


//Create SVG element
const svgOcupacao1 = d3.select('#ocupacao1')
                      .append('svg')
                       .attr("class", "content")
                       .attr("viewBox", `0 0 ${widthOcupacao + marginOcupacao.left + marginOcupacao.right} ${heightOcupacao + marginOcupacao.top + marginOcupacao.bottom}`)
                       .attr("preserveAspectRatio", "xMidYMid meet")

const svgOcupacao2 = d3.select('#ocupacao2')
                      .append('svg')
                       .attr("class", "content")
                       .attr("viewBox", `0 0 ${widthOcupacao + marginOcupacao.left + marginOcupacao.right} ${heightOcupacao + marginOcupacao.top + marginOcupacao.bottom}`)
                       .attr("preserveAspectRatio", "xMidYMid meet")

const svgOcupacao3 = d3.select('#ocupacao3')
                      .append('svg')
                       .attr("class", "content")
                       .attr("viewBox", `0 0 ${widthOcupacao + marginOcupacao.left + marginOcupacao.right} ${heightOcupacao + marginOcupacao.top + marginOcupacao.bottom}`)
                       .attr("preserveAspectRatio", "xMidYMid meet")                       
    
var gOcupacao1 = svgOcupacao1.append("g")
                            .attr("transform", "translate(" + marginOcupacao.left + "," + marginOcupacao.top + ")");
var gOcupacao2 = svgOcupacao2.append("g")
                            .attr("transform", "translate(" + marginOcupacao.left + "," + marginOcupacao.top + ")");
var gOcupacao3 = svgOcupacao3.append("g")
                            .attr("transform", "translate(" + marginOcupacao.left + "," + marginOcupacao.top + ")");
// Create y-axis
yScaleOcupacao = d3.scaleLinear()
                    .domain([0,100])
                    .range([heightOcupacao, 0]); 
var yAxisOcupacao = d3.axisLeft(yScaleOcupacao)
                      .ticks(7)
                      .tickSize(3);

gOcupacao1.append("g")
          .attr("class", "yAxis")
          .attr("transform", "translate(0,0)")
          .call(yAxisOcupacao)

gOcupacao2.append("g")
          .attr("class", "yAxis")
          .attr("transform", "translate(0,0)")
          .call(yAxisOcupacao)

gOcupacao3.append("g")
          .attr("class", "yAxis")
          .attr("transform", "translate(0,0)")
          .call(yAxisOcupacao)

//Create axis label
gOcupacao1.append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .style("text-anchor", "middle")
          .attr("y",-44)
          .attr("x",-heightOcupacao/2)
          .attr("dy", ".71em")
          .style("font-size", "12px")
          .text("Ocupação dos leitos (%)");

gOcupacao2.append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .style("text-anchor", "middle")
          .attr("y",-44)
          .attr("x",-heightOcupacao/2)
          .attr("dy", ".71em")
          .style("font-size", "12px")
          .text("Ocupação dos leitos (%)");

gOcupacao3.append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .style("text-anchor", "middle")
          .attr("y",-44)
          .attr("x",-heightOcupacao/2)
          .attr("dy", ".71em")
          .style("font-size", "12px")
          .text("Ocupação dos leitos (%)");

function plotOcupacao(data_path, first, which, gOcupacao, id, svgOcupacao) {
  //Load in the data
  d3.csv(data_path)
    .then(function(data) {          
    //Create categorical color scale
    if (data_path == "data/ocupacao.csv") {
      var color_ = {'UTI': '#0077BB', 'UTI neonatal': '#bbbbbb', 'Enfermaria': '#EE3377'}
      var colorOcupacao = d3.scaleOrdinal([color_[which]]); // https://personal.sron.nl/~pault/#sec:qualitative
      var x_tooltip = 10;
      var y_tooltip = 60 
    } else { 
      var color_ = {'UTI': '#33BBEE', 'UTI neonatal': '#009988', 'Enfermaria': '#EE7733'}
      var colorOcupacao = d3.scaleOrdinal([color_[which]]); // https://personal.sron.nl/~pault/#sec:qualitative
      var x_tooltip = 10;
      var y_tooltip = 60   
    }
     
    colorOcupacao.domain([which]);

    //Parse data
    data.forEach(function(d) {
      d.Date = parseTimeOcupacao(d.Date);
      d.Enfermaria = parseFloat(d.Enfermaria.replace(',','.'));
      d.UTI = parseFloat(d.UTI.replace(',','.'));
      d["UTI neonatal"] = parseFloat(d["UTI neonatal"].replace(',','.'));           
      d.Enfermaria_total = parseInt(d.Enfermaria_total);
      d.UTI_total = parseInt(d.UTI_total);
      d["UTI neonatal_total"] = parseInt(d["UTI neonatal_total"]);
    });

    //Create categories (for each line plot)
    var categoriesOcupacao = colorOcupacao.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                    return {
                        Date: d.Date,
                        Occupancy: parseFloat(d[name])
                    };                  
            })
        };
    });

    //Sort dates
    data.sort(function(a, b) {
        return a.Date - b.Date;
    });

        //Create legend
        var legendRectOcupacao = gOcupacao.selectAll(id + ' .legendRect')
                                          .data(categoriesOcupacao)
        // legendRectOcupacao.exit()
        //                   .transition()
        //                    .duration(600)
        //                    .attr("opacity", "0")
        //                    .remove() 

        legendRectOcupacao.enter().append('rect')
                          .merge(legendRectOcupacao)
                          .transition()
                           .duration(600)
                           .attr("class", "legendRect")
                           .attr('x', 10)
                           .attr('y', function(d, i) {
                                return i * 17.3;
                           })
                           .attr('width', 12)
                           .attr('height', 12)
                           .style('fill', function(d) {
                                return colorOcupacao(d.name);
                           });

        var legendTextOcupacao = gOcupacao.selectAll(id + ' .legend')
                                          .data(categoriesOcupacao) 

        legendTextOcupacao.enter().append('text')
                          .merge(legendTextOcupacao)
                          .transition()
                           .duration(0)                    
                           .attr("class", "legend")
                           .attr('x', 25)
                           .attr('y', function(d, i) {
                               return (i * 17.3)+11;
                            })
                           .text(function(d) {
                            if (data_path == "data/ocupacao.csv") {
                                return d.name;
                            } else {
                                return d.name + " COVID";
                            }
                           });
        //Create scale functions
        xScaleOcupacao = d3.scaleTime()
                            .domain([
                          d3.min(data, function(d) { return d.Date; }),
                          d3.max(data, function(d) { return d.Date; })   
                        ])
                        .range([0, widthOcupacao]);
        //Create axis
        var xAxisOcupacao = d3.axisBottom(xScaleOcupacao)
                               .ticks(7)
                               .tickFormat(formatAsMonth)
                               .tickSize(3);
      // Area generator
      var areaOcupacao = d3.area()  
                             .x(function(d) { return xScaleOcupacao(d.data.Date); })
                             .y0(function(d) { return yScaleOcupacao(0); })
                             .y1(function(d) { return yScaleOcupacao(d[1]); })                               
        if (first) {
        gOcupacao.append("g")
                 .attr("class", "xAxis")
                 .attr("transform", "translate(0," + heightOcupacao + ")")    
                 .call(xAxisOcupacao)
                 .select(".domain")
                  .attr("stroke","#252525")
                  .attr("stroke-width","0");
          areaOcupacaoDraw = gOcupacao.selectAll("path.myArea")
                                       .data(d3.stack().keys([which])(data))
                                       
          areaOcupacaoDraw.enter().append("path")
                          .attr("class", "myArea")
                          .style("fill", function(d) { return colorOcupacao(d.key); }) 
                          .attr("d", areaOcupacao)
                          .attr("fill-opacity", "0.5")                  
        } else {
        gOcupacao.select('.xAxis')
                 .transition()
                  .duration(300)
                  .ease(d3.easeLinear)
                  .call(xAxisOcupacao);    
          areaOcupacaoDraw = gOcupacao.selectAll("path.myArea")
                                       .data(d3.stack().keys([which])(data))
          areaOcupacaoDraw.enter().append("path")
                          .merge(areaOcupacaoDraw)  
          areaOcupacaoDraw.transition()
                                  .duration(1000)
                                  .ease(d3.easeCubic)
                                  .attr("class", "myArea")
                                  .style("fill", function(d) { return colorOcupacao(d.key); }) 
                                  .attr("d", areaOcupacao)
                                  .attr("fill-opacity", "0.5")                  
        }


        //Create each category object
        var categoryOcupacao = gOcupacao.selectAll(id +" .line")
                                        .data(categoriesOcupacao)

        //Create lines
        var lineOcupacao = d3.line()
                             .x( function(d) { return xScaleOcupacao(d.Date); })
                             .y( function(d) { return yScaleOcupacao(d.Occupancy); });

        categoryOcupacao.enter()
                        .append("path")
                        .attr("class", "line")
                        .merge(categoryOcupacao)
                        .transition()
                          .duration(1000)
                          .ease(d3.easeCubic)
                          .attr("d", function(d) {
                               return lineOcupacao(d.values);
                          })
                          .style("stroke", function(d) { return colorOcupacao(d.name); })
                          // .style("stroke-width", "1.25px");

     // Create tooltip
    var focusOcupacao = gOcupacao.append("g")
                                  .attr("class", "focus");

    focusOcupacao.append("path")
                  .attr("class", "hover-line")

    var linesOcupacao = document.getElementsByClassName('line');

    d3.selectAll(id +' .focus-per-line') // circle disappears if data input is changed
    d3.selectAll(id +' .hover-line') // circle disappears if data input is changed

    var focusPerLineOcupacao = focusOcupacao.selectAll(id +' .focus-per-line')
                                             .data(categoriesOcupacao)

    focusPerLineOcupacao.enter().append("g")
                        .attr("class", "focus-per-line")
                        .append("circle") 
                        .merge(focusPerLineOcupacao)
                         .transition()
                          .duration(0)
                          .ease(d3.easeLinear)
                          .attr("r", 3)
                          .style("stroke", function(d) {
                            return colorOcupacao(d.key);
                          })
                          .style("fill", function(d) {
                            return colorOcupacao(d.name);
                          }); 
    d3.selectAll(id +' .focus-per-line').style("display", "none")

    var tooltipTextDateOcupacao = gOcupacao.append("text")
                                            .attr("class", "tooltip-date");                                                                                  
    svgOcupacao.append('rect') 
                 .attr("class", "overlay")
                 .attr("transform", "translate(" + marginOcupacao.left + "," + marginOcupacao.top + ")")
                 .attr('width', widthOcupacao)
                 .attr('height', heightOcupacao)
                 .on("mouseover", function() {
                    d3.selectAll(id + ' .tooltip-date').style("display", null); 
                    d3.selectAll(id + ' .tooltip-text').style("display", null);
                    d3.selectAll(id + ' .focus-per-line').style("display", null) // circle disappears if data input is changed
                    d3.selectAll(id + ' .hover-line').style("display", null) // circle disappears if data input is changed                   
                    d3.selectAll(id + ' .legendRect').style("display", "none")
                    d3.selectAll(id + ' .legend').style("display", "none")
                 })
                 .on("mouseout", function() {           
                    d3.selectAll(id + ' .tooltip-date').style("display", "none"); 
                    d3.selectAll(id + ' .tooltip-text').style("display", "none");
                    d3.selectAll(id + ' .focus-per-line').style("display", "none") // circle disappears if data input is changed
                    d3.selectAll(id + ' .hover-line').style("display", "none") // circle disappears if data input is changed                
                    d3.selectAll(id + ' .legendRect').style("display", null)
                    d3.selectAll(id + ' .legend').style("display", null)                    
                 })
                 .on('mousemove', event => mousemoveOcupacao(event));

    function mousemoveOcupacao(event) { // mouse moving over canvas
        var mouse = d3.pointer(event),
            x0 = xScaleOcupacao.invert(mouse[0]),
            bisectDate = d3.bisector(function(d) { return d.Date; }).left,
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i];
        if (d1 == null){
            d1 = data[i - 1];
        }       
        var dTrue = x0 - d0.Data > d1.Data - x0 ? d1 : d0, // if is true, d1, if is false d0
            idx = x0 - d0.Date > d1.Date - x0 ? i : i-1;
        if (data[idx] == null) {
           var data_idx = data[idx-1],
               xDate = data_idx.Date;
        } else {
           var data_idx = data[idx],
               xDate = data_idx.Date;
        }             
        d3.select(id + " .hover-line")
           .attr("d", function() {
                var dVar = "M" + xScaleOcupacao(xDate) + "," + heightOcupacao;
                dVar += " " + xScaleOcupacao(xDate) + "," + 0;
                return dVar;
           })
        d3.select(id + ' .tooltip-date')
           .text(formatAsDate(xDate))
           .attr("x", x_tooltip)
           .attr("y", heightOcupacao - y_tooltip - 13.5 - 3*11);

        var tooltipTextOcupacao = gOcupacao.selectAll(id +' .tooltip-text')
                                            .data(categoriesOcupacao)             
    
        tooltipTextOcupacao.enter().append("text")
                   .merge(tooltipTextOcupacao)
                   .transition()
                    .duration(0)                       
                   .attr("class", "tooltip-text")
                   .text(function (d) {
                      var totalOccupancy = function() {
                        total = data_idx[d.name+"_total"];
                        if (Number.isNaN(total)) {
                          return "";
                        } else {
                          return " (" + Math.round(data_idx[d.name]*total/100)+ "/" + total + ")";
                        }
                      }  
                      if (Number.isNaN(data_idx[d.name])) {   
                            return "";
                        } else {
                            return d.name + ": " + data_idx[d.name].toFixed(2) + "%" + totalOccupancy();
                        }})
                   .attr("x", x_tooltip)
                   .attr("y", function (d,i) { return heightOcupacao - y_tooltip - (2-i)*15.5})
                d3.selectAll(id + " .focus-per-line")
                   .attr("transform", function(d, i) { 
                      d3.select(this).select(id +' .focus-per-line circle')
                        return "translate(" + xScaleOcupacao(xDate) + "," + yScaleOcupacao(data_idx[d.name]) +")";
                  });
    };
  });
}

plotOcupacao("data/ocupacao.csv", true, "UTI", gOcupacao1, "#ocupacao1", svgOcupacao1)
plotOcupacao("data/ocupacao.csv", true, "UTI neonatal", gOcupacao2, "#ocupacao2", svgOcupacao2)
plotOcupacao("data/ocupacao.csv", true, "Enfermaria", gOcupacao3, "#ocupacao3", svgOcupacao3)