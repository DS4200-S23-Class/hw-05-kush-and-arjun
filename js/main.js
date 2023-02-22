const FRAME_HEIGHT = 480;
const FRAME_WIDTH = 480; 
const MARGINS = {left: 40, right: 40, top: 40, bottom: 40};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 


const FRAME1 = d3.select("#vis1") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

/// Load data from CSV
d3.csv("data/scatter-data.csv").then((data) => {
 // Define scales for x and y axes
  const MIN_X = d3.min(data, (d) => { return parseInt(d.x); });
  const MIN_Y = d3.min(data, (d) => { return parseInt(d.y); });

  const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
  const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });

  console.log(MAX_X)
  console.log(MAX_Y)


  const xScale = d3.scaleLinear()
    .domain([0, MAX_X])
    .range([MARGINS.left, VIS_WIDTH]);

  const yScale = d3.scaleLinear()
    .domain([0, MAX_Y])
    .range([VIS_HEIGHT, MARGINS.top]);

  console.log(xScale(1))
  console.log(yScale(2))


  // Add x-axis
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.right) + ")") 
        .call(d3.axisBottom(xScale)) 
          .attr("font-size", '20px'); 

  // Add y-axis
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.bottom + 
              "," + MARGINS.top + ")") 
        .call(d3.axisLeft(yScale)) 
          .attr("font-size", '20px');

  FRAME1.selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return xScale(d.x); })
      .attr("cy", function(d) { return yScale(d.y); })
      .attr("r", 5)
      .attr("fill", "steelblue");
});
