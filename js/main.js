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

function build_scatter_plot() {
  /// Load data from CSV
  d3.csv("data/scatter-data.csv").then((data) => {
    // Define scales for x and y axes
    const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
    const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });

    const X_Scale = d3.scaleLinear()
      .domain([0, MAX_X])
      .range([MARGINS.bottom, VIS_WIDTH]);

    const Y_Scale = d3.scaleLinear()
      .domain([0, MAX_Y])
      .range([VIS_HEIGHT, MARGINS.top]);

    function handleClick(d) {
      const X_POINT = Math.round(((d.x-115)/40));
      const Y_POINT = Math.round(10 - ((d.y-80)/40));
      const clickedCircle = d3.select(this);
      if (clickedCircle.classed("selected")) {
        clickedCircle.classed("selected", false);
        d3.select("#new_text").text(`Selected point: (${X_POINT}, ${Y_POINT})`);
      } 
      else {
          clickedCircle.classed("selected", true);
          d3.select("#new_text").text(`Selected point: (${X_POINT}, ${Y_POINT})`);
        }
      }

    // Add x-axis
    FRAME1.append("g") 
          .attr("transform", "translate(" + 0 + "," + (VIS_HEIGHT) + ")") 
          .call(d3.axisBottom(X_Scale)) 
          .attr("class", "axes-font"); 

    // Add y-axis
    FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.bottom + "," + 0 + ")") 
          .call(d3.axisLeft(Y_Scale)) 
          .attr("class", "axes-font");

    FRAME1.selectAll("points")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return X_Scale(d.x); })
        .attr("cy", function(d) { return Y_Scale(d.y); })
        .attr("class", "point")
        .on("click", handleClick);
        
    // add 
    d3.select("#subButton")
         .on("click", function() {
                    // Get the values from the dropdown list
                    let newX = d3.select("#x-val").property("value");
                    let newY = d3.select("#y-val").property("value");

                    // Create a new point object
                    const newPoint = {x: newX, y: newY}

                    data.push(newPoint);
                    console.log(data);

                    FRAME1.selectAll(".point").remove();

                    FRAME1.selectAll("points.new")
                    .data(data)
                    .enter()
                    .append("circle")
                      .attr("cx", function(d) { return X_Scale(d.x); })
                      .attr("cy", function(d) { return Y_Scale(d.y); })
                      .attr("class", "point")
                      .on("click", handleClick);         

                    });

  });
};

build_scatter_plot()

