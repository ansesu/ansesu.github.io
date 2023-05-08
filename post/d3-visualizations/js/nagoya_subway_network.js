

//Margin
const marginNetwork = { top: 0, right: 0, bottom: 0, left: 0 };


//Width and height
const widthNetwork = 1000 - marginNetwork.left - marginNetwork.right;
const heightNetwork = 900 - marginNetwork.top - marginNetwork.bottom;

//Create SVG element in chart id element
const svgNetwork = d3.select('#nagoya_subway_network')
	              .append('svg')
	               .attr("class", "content")
	               .attr("viewBox", `0 0 ${widthNetwork + marginNetwork.left + marginNetwork.right} ${heightNetwork + marginNetwork.top + marginNetwork.bottom}`)
	               .attr("preserveAspectRatio", "xMidYMid meet")

// var svgNetwork = d3.select('#nagoya_subway_network'),
//     widthNetwork = +svgNetwork.attr("width"),
//     heightNetwork = +svgNetwork.attr("height");

var color = ['#e30020', '#ef6a8d', '#00a1e4', '#bdbdbd', '#917db5', '#ffbc37']

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(widthNetwork / 2, heightNetwork / 2));
d3.json("data/nagoya_subway_data.json")
  .then(function(graph) {
  // var labels = node.append("text")
  //     .text(function(d) {
  //       return d.id;
  //     })
  //     .attr('x', 6)
  //     .attr('y', 3);

  // node.append("title")
  //     .text(function(d) { return d.id; });

	function ticked() {
	link
	    .attr("x1", function(d) { return d.source.x; })
	    .attr("y1", function(d) { return d.source.y; })
	    .attr("x2", function(d) { return d.target.x; })
	    .attr("y2", function(d) { return d.target.y; });

	node
	    .attr("transform", function(d) {
	      return "translate(" + d.x + "," + d.y + ")";
	    })
	}

	function dragstarted(event, d) {
	  if (!event.active) simulation.alphaTarget(0.3).restart();
	  d.fx = d.x;
	  d.fy = d.y;
	}

	function dragged(event, d) {
	  d.fx = event.x;
	  d.fy = event.y;
	}

	function dragended(event, d) {
	  if (!event.active) simulation.alphaTarget(0);
	  d.fx = null;
	  d.fy = null;
	}  

svgNetwork.append("circle").attr("cx",10).attr("cy",35).attr("r", 8).style("fill", '#ffbc37')
svgNetwork.append("circle").attr("cx",10).attr("cy",75).attr("r", 8).style("fill", '#ef6a8d')
svgNetwork.append("circle").attr("cx",10).attr("cy",115).attr("r", 8).style("fill", '#bdbdbd')
svgNetwork.append("circle").attr("cx",10).attr("cy",155).attr("r", 8).style("fill", '#917db5')
svgNetwork.append("circle").attr("cx",10).attr("cy",195).attr("r", 8).style("fill", '#e30020')
svgNetwork.append("circle").attr("cx",10).attr("cy",235).attr("r", 8).style("fill", '#00a1e4')
svgNetwork.append("text").attr("x", 25).attr("y", 40).text("東山線 - Linha Higashiyama").style("font-size", "19px").attr("alignment-baseline","middle")
svgNetwork.append("text").attr("x", 25).attr("y", 80).text("上飯田線 - Linha Kamiida").style("font-size", "19px").attr("alignment-baseline","middle")
svgNetwork.append("text").attr("x", 25).attr("y", 120).text("名港線 - Linha Meiko").style("font-size", "19px").attr("alignment-baseline","middle")
svgNetwork.append("text").attr("x", 25).attr("y", 160).text("名城線 - Linha Meijo").style("font-size", "19px").attr("alignment-baseline","middle")
svgNetwork.append("text").attr("x", 25).attr("y", 200).text("桜通線 - Linha Sakuradori").style("font-size", "19px").attr("alignment-baseline","middle")
svgNetwork.append("text").attr("x", 25).attr("y", 240).text("鶴舞線 - Linha Tsurumai").style("font-size", "19px").attr("alignment-baseline","middle")

svgNetwork.append("text").attr("x", 1000).attr("y", 35).attr("text-anchor", "end").text("Metrô da cidade de Nagoya").style("font-size", "30px").attr("alignment-baseline","middle")

	// tooltip
	var tooltipNetwork = d3.select("#nagoya_subway_network").append("div")
	                        .attr("class", "tooltip-html")
	                        .style("opacity", 0); 
	// tooltip mouseover event handler
	var mouseoverNetwork = function(event, d) {
		d3.select(this)
		   .transition()
		   .duration(300) 		  
		   .attr("r", 15);

		var html = "<b>" + "Estação" + "</b><br/>" + d.id;

		tooltipNetwork.html(html)
					   .style("left", (event.pageX) + "px")
					   .style("top", (event.pageY) + "px")
					   .transition()
					   .duration(300) // ms
					   .style("opacity", 1); // started as 0!
	};
	// tooltip mouseout event handler
	var mouseoutNetwork = function(d) {
		d3.select(this)
		   .transition()
		   .duration(300) 		  
		   .attr("r", 8);

		tooltipNetwork.transition()
		               .duration(300) // ms                       
		               .style("opacity", 0); // don't care about position!;                       
	};
  var link = svgNetwork.append("g")
									      .attr("class", "links")
									    .selectAll("line")
									    .data(graph.links)
									    .enter().append("line")
									      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
  var node = svgNetwork.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))

  var circles = node.append("circle")
							      .attr("r", 8)
							      .attr("fill", function(d) { return color[d.group]; })     
					    	     .on("mouseover", mouseoverNetwork)
					    			 .on("mouseout", mouseoutNetwork);
  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

});