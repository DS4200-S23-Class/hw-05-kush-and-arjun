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
    // Finding MAX X and Y values
    const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
    const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });

    const X_SCALE = d3.scaleLinear()
      .domain([0, MAX_X])
      .range([MARGINS.bottom, VIS_WIDTH]);

    const Y_SCALE = d3.scaleLinear()
      .domain([0, MAX_Y])
      .range([VIS_HEIGHT, MARGINS.top]);

    function handleClick(d) {
      console.log(d.x)
      let X_POINT = Math.abs.round((d.x-345)/40);
      let Y_POINT = Math.round(10 - ((d.y-(MARGINS.top + MARGINS.bottom))/40));
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
          .call(d3.axisBottom(X_SCALE)) 
          .attr("class", "axes-font"); 

    // Add y-axis
    FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.bottom + "," + 0 + ")") 
          .call(d3.axisLeft(Y_SCALE)) 
          .attr("class", "axes-font");

    FRAME1.selectAll("points")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return X_SCALE(d.x); })
        .attr("cy", function(d) { return Y_SCALE(d.y); })
        .attr("class", "point")
        .on("click", handleClick);
        
    // add button control eventlistener to redraw plots
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
                      .attr("cx", function(d) { return X_SCALE(d.x); })
                      .attr("cy", function(d) { return Y_SCALE(d.y); })
                      .attr("class", "point")
                      .on("click", handleClick);         

                    });
  });
};

// draws scatter splot
build_scatter_plot()




// building bar chart
const FRAME2 = d3.select("#vis2") 
                  .append("svg") 
                  .attr("height", FRAME_HEIGHT)   
                  .attr("width", FRAME_WIDTH)
                  .attr("class", "frame");

function build_bar_chart() {
  /// Load data from CSV
  d3.csv("data/bar-data.csv").then((data) => {
    const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
    const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });

  
      // Set the ranges and scales for the x-axis and y-axis
      const X_Scale = d3.scaleBand()
                .range([MARGINS.left, VIS_WIDTH])
                .padding(0.3);
      const Y_Scale = d3.scaleLinear()
                .range([VIS_HEIGHT, MARGINS.top]);

      // Map the data to the x and y domains
      X_Scale.domain(data.map(function(d) { return d.category; }));
      Y_Scale.domain([0, d3.max(data, function(d) { return +d.amount; })+1]);

      // Add x-axis
    FRAME2.append("g") 
          .attr("transform", "translate(" + 0 + "," + (VIS_HEIGHT+MARGINS.top) + ")") 
          .call(d3.axisBottom(X_Scale)) 
          .attr("class", "axes-font"); 

    // Add y-axis
    FRAME2.append("g") 
          .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")") 
          .call(d3.axisLeft(Y_Scale)) 
          .attr("class", "axes-font");

      // Add the bars to the chart
      FRAME2.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return X_Scale(d.category); })
         .attr("y", function(d) { return Y_Scale(d.amount) + MARGINS.top; })
         .attr("width", X_Scale.bandwidth())
         .attr("height", function(d) { return VIS_HEIGHT - Y_Scale(d.amount); });


         // Tooltip

     // To add a tooltip, we will need a blank div that we 
    //  fill in with the appropriate text. Be use to note the
    //  styling we set here and in the .css
    const TOOLTIP = d3.select("#vis2")
                        .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0); 

    // Define event handler functions for tooltips
    function handleMouseover(event, d) {
      // on mouseover, make opaque 
      TOOLTIP.style("opacity", 1); 
      
    }

    function handleMousemove(event, d) {
      // position the tooltip and fill in information 
      TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
              .style("left", (event.pageX + 10) + "px") //add offset from mouse
              .style("top", (event.pageY - 50) + "px"); 
    }

    function handleMouseleave(event, d) {
      // on mouseleave, make transparant again 
      TOOLTIP.style("opacity", 0); 
    } 

    // Add event listeners
    FRAME2.selectAll(".bar")
          .on("mouseover", handleMouseover) //add event listeners
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave);
          // Add the mouseover event for the tooltip
  });
};

//
build_bar_chart()
