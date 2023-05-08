//Margin
const marginStreaks = { top: 10, right: 0, bottom: 25, left: 45 };

//Width and height
const widthStreaks = 600 - marginStreaks.left - marginStreaks.right;
const heightStreaks = 400 - marginStreaks.top - marginStreaks.bottom;

//For converting data
var parseTimeStreaks = d3.timeParse("%Y-%m-%d %H:%M:%S"),

//Create scale functions
xScaleStreaks = d3.scaleTime()
                   .domain([
                     new Date(2021, 11, 20),
                     new Date(2022, 12, 31)
                     ])
                   .range([0, widthStreaks]);
yScaleStreaks = d3.scaleLinear()
                   .domain([0,75])
                   .range([heightStreaks, 0]);                 
//Create SVG element in chart id element
const svgStreaks = d3.select('#streaks')
                     .append('svg')
                      .attr("class", "content")
                      .attr("viewBox", `0 0 ${widthStreaks + marginStreaks.left + marginStreaks.right} ${heightStreaks + marginStreaks.top + marginStreaks.bottom}`)
                       .attr("preserveAspectRatio", "xMidYMid meet")
var gStreaks = svgStreaks.append("g")
                          .attr("transform", "translate(" + marginStreaks.left + "," + marginStreaks.top + ")");
//Create axis
var xAxisStreaks = d3.axisBottom(xScaleStreaks)
                     .ticks(11)
                     .tickFormat(formatAsMonth)
                     .tickSize(3);
var yAxisStreaks = d3.axisLeft(yScaleStreaks)
                     .ticks(7)
                     .tickSize(3);             
gStreaks.append("g")
         .attr("class", "xAxis")
         .attr("transform", "translate(0," + heightStreaks + ")")
         .call(xAxisStreaks)
         .select(".domain")
          .attr("stroke","#252525")
          .attr("stroke-width","0");    

gStreaks.append("g")
         .attr("class", "yAxis")
         .attr("transform", "translate(0,0)")
         .call(yAxisStreaks)
    //Create axis label
gStreaks.append("text")
         .attr("class", "axis-title")
         .attr("transform", "rotate(-90)")
         .style("text-anchor", "middle")
         .attr("y",-45)
         .attr("x",-heightStreaks/2)
         .attr("dy", ".71em")
         .text("Streak");

gStreaks.selectAll(".tick")
         .selectAll("line")
         .attr("stroke-width","1");

function plotStreaks(data_path) {
  //Load in the data
  data = d3.csv(data_path)
           .then(function(data) {

    ///Parse data and sort values by date
    data.forEach(function(d) {
      d.date = parseTimeStreaks(d.date);
      d.streak = parseInt(d.streak);
      d.name = d.name;
    });

    data.sort(function(a, b) {
        return a.date - b.date;
    });

    yScaleStreaks = d3.scaleLinear()
                       .domain([
                         d3.min(data, function(d) { return d.streak; }),
                         d3.max(data, function(d) { return d.streak; })*1.1
                       ])
                       .range([heightStreaks, 0]);  

    var yAxisStreaks = d3.axisLeft(yScaleStreaks)
                         .ticks(7)
                         .tickSize(3);

    gStreaks.select('.yAxis')
            .transition()
             .duration(300)
             .ease(d3.easeLinear)
             .call(yAxisStreaks);

    // tooltip
    var tooltipScatter = d3.select("#streaks").append("div")
                            .attr("class", "tooltip-html")
                            .style("opacity", 0);               
    // tooltip mouseover event handler
    var mouseoverStreaks = function(event, d) {
      d3.select(this)
        .transition()
         .duration(300) // ms         
         .attr("opacity", "1")
         .attr("r", function(d) {
           return 1.5*Math.sqrt(heightStreaks - yScaleStreaks(d.streak)); 
         });  

      var html = "<b>" + formatAsDate(d.date) + "</b><br/>" +
                 d.name + "<br/>" +
                 "Streak: " + d.streak;

      tooltipScatter.html(html)
                    .style("left", (event.pageX - 30) + "px")
                    .style("top", (event.pageY - 58) + "px")
                    .transition()
                     .duration(300) // ms
                     .style("opacity", 1); // started as 0!
    };
    // tooltip mouseout event handler
    var mouseoutStreaks = function(d) {
      d3.select(this)
        .transition()
         .duration(300) // ms         
         .attr("opacity", "0.25")
         .attr("r", function(d) {
              return Math.sqrt(heightStreaks - yScaleStreaks(d.streak));  
          });   
      tooltipScatter.transition()
                     .duration(300) // ms
                     .style("opacity", 0); // don't care about position!;                       
    };    

    //Create circles
    circleStreaks = gStreaks.selectAll("circle")
                            .data(data) 
      
    circleStreaks.enter().append('circle')
                          .merge(circleStreaks)
                          .transition()
                           .duration(300)
                           .ease(d3.easeLinear)
                           .attr("cx", function(d) {
                              return xScaleStreaks(d.date);
                           })
                           .attr("cy", function(d) {
                              return yScaleStreaks(d.streak);
                           })
                           .attr("r", function (d) {
                              return Math.sqrt(heightStreaks - yScaleStreaks(d.streak));
                           })
                           .attr("fill", function() {
                            if ((data_path==="data/streak_artist_data.csv") || (data_path === "../lastfm-2020/data/streak_artist_data.csv")) {
                              return "#f16913";
                            } else {
                              return "#4d4d4d";
                            }
                           })
                          .attr("stroke", function() {
                            if ((data_path==="data/streak_artist_data.csv") || (data_path === "../lastfm-2020/data/streak_artist_data.csv")) {
                              return "#f16913";
                            } else {
                              return "#4d4d4d";
                            }
                           })           
                          .attr("opacity", "0.25")
                          .attr("class", "circle");
                            
    circleStreaks.exit()
                 .remove()

    gStreaks.selectAll("circle")
            .on("mouseover", mouseoverStreaks)
            .on("mouseout", mouseoutStreaks);
  });                 
} 

plotStreaks('data/streak_artist_data.csv', true); 