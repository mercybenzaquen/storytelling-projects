(function() {
  var margin = { top: 30, left: 230, right: 30, bottom: 30},
  height = 12000 - margin.top - margin.bottom,
  width = 1300 - margin.left - margin.right;

  // console.log("Building chart 1");

  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return "<strong style='color: gray'>" + d.disaster + "</strong>" +
                       "<br><span style='color:gray' 'font-weight:normal'> Events registered: " + d.occurrence + "</span>" +
                       "<br><span style='color:gray;'> Total deaths: " + d.total_deaths + "</span>";
              })

  var svg = d3.select("#project3-chart1")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);


d3.queue()
      .defer(d3.csv, "merged_data.csv")
      .await(ready);




function ready(error, datapoints) {
// 
// var nested = d3.nest()
// 	.key(function(d) { return d.continent; })
// 	.entries(datapoints)

var country = datapoints.map(function(d){
  return d.country
});
country = d3.set(country).values()

var year = datapoints.map(function(d){
  return d.year
});
year = d3.set(year).values()

disasters = datapoints.map(function(d){
  return d.disaster
});
disasters = d3.set(disasters).values()

var countryScale = d3.scalePoint(country).domain(country).range([10, height]).padding(1);
var yearScale = d3.scaleLinear().domain([1999,2016]).range([0, width])

var colorScale= d3.scaleOrdinal().domain(["Flood", "Storm", "Earthquake", "Landslide", "Drought", "Extreme temperature ",  "Wildfire", "Volcanic activity"]).range(["#505EA7", "#57AFA3", "#894b1a", "#E5BF7F", "#59521C", "#ddcf06", "#F98222", "#D01000"])

var maxOccurrence = d3.max(datapoints, function(d) {return +d.occurrence;})

var radiusScale = d3.scaleSqrt().domain([0, maxOccurrence]).range([1,40])

var xAxis = d3.axisTop(yearScale);
            svg.append("g")
               .attr("class", "x-axis")
               .attr("stroke-width", "1")
               //.attr("transform", "translate(0," + (height) + ")")
               .call(xAxis);

var yAxis = d3.axisLeft(countryScale);
           svg.append("g")
              .attr("class", "y-axis")
              .call(yAxis);


svg.selectAll("circle")
  .data(datapoints)
  .enter()
  .append("circle")
  .attr("class", function(d) {
    var disasterType = d.disaster.replace(" ", "-")
    return "circle " + disasterType;
  })
  .attr("cx", function(d){
    return yearScale(d.year)
  })
  .attr("cy", function(d){
    return countryScale(d.country)
  })
  .attr("r", function(d){
    return radiusScale(d.occurrence)
  })
  .attr("stroke", "white")
  .attr("stroke-width", "0.5")
  .attr("opacity", "0.4")
  .attr("fill", function(d){
    return colorScale(d.disaster)
  })

  .on('mouseover', function(d,i) {
    tip.show(d)
    var element = d3.select(this);
    element.style("stroke-width", "3")
    element.style("stroke", "black");
    element.style("opacity", "1")
})

  .on('mouseout', function(d,i) {
    tip.hide(d)
    var element = d3.select(this);
    element.style("stroke-width", "1")
    element.style("stroke", "white")
    element.style("opacity", "0.4")
  })


d3.select("#All")
    .on('click', function(d) {
      svg.selectAll('circle')
      .transition()
      .duration(1500)
      .style('opacity', 0.5)
      .style('pointer-events', 'all')
        })


d3.select("#Flood")
  .on('click', function(d) {
    svg.selectAll('circle')
    .transition()
    .duration(1500)
    .style('opacity', 0)
    .style('pointer-events', 'none')
    .style('r', 0)
    svg.selectAll(".Flood")
      .style('pointer-events', 'all')
       .transition()
       .duration(1500)
       .style('opacity', 0.5);
      })

    d3.select("#named-select").on('change', function() {
      var value= d3.select(this.value)
      svg.selectAll('circle')
      .transition()
      .duration(1500)
      .style('opacity', 0)
      .style('pointer-events', 'none')
      .style('r', 0)
      if (value == "Africa") {return
      svg.selectAll(".Africa")
        .style('pointer-events', 'all')
         .transition()
         .duration(1500)
         .style('opacity', 0.5);
       }
    })



      d3.select("#Storm")
        .on('click', function(d) {
          svg.selectAll('circle')
          .transition()
          .duration(1500)
          .style('opacity', 0)
          .style('r', 0)
          .style('pointer-events', 'none')
          svg.selectAll(".Storm")
             .style('pointer-events', 'all')
             .transition()
             .duration(1500)
             .style('opacity', 0.5);

            })

       d3.select("#Earthquake")
          .on('click', function(d) {
          svg.selectAll('circle')
          .transition()
          .duration(1500)
          .style('opacity', 0)
          .style('r', 0)
          .style('pointer-events', 'none')
          svg.selectAll(".Earthquake")
          .style('pointer-events', 'all')
          .transition()
          .duration(1500)
          .style('opacity', 0.5);

                  })

        d3.select("#Landslide")
          .on('click', function(d) {
          svg.selectAll('circle')
             .transition()
             .duration(1500)
             .style('opacity', 0)
             .style('r', 0)
             .style('pointer-events', 'none')
          svg.selectAll(".Landslide")
             .style('pointer-events', 'all')
             .transition()
             .duration(1500)
             .style('opacity', 0.5);

        })
        d3.select("#Drought")
          .on('click', function(d) {
          svg.selectAll('circle')
             .transition()
             .duration(1500)
             .style('opacity', 0)
             .style('r', 0)
             .style('pointer-events', 'none')
          svg.selectAll(".Drought")
             .style('pointer-events', 'all')
             .transition()
             .duration(1500)
             .style('opacity', 0.5);

        })

        d3.select("#Extreme")
          .on('click', function(d) {
          svg.selectAll('circle')
             .transition()
             .duration(1500)
             .style('opacity', 0)
             .style('r', 0)
             .style('pointer-events', 'none')
          svg.selectAll(".Extreme-temperature")
             .style('pointer-events', 'all')
             .transition()
             .duration(1500)
             .style('opacity', 0.5);
        })

        d3.select("#Wildfire")
          .on('click', function(d) {
          svg.selectAll('circle')
             .transition()
             .duration(1500)
             .style('opacity', 0)
             .style('r', 0)
             .style('pointer-events', 'none')
          svg.selectAll(".Wildfire")
             .style('pointer-events', 'all')
             .transition()
             .duration(1500)
             .style('opacity', 0.5);

        })

        d3.select("#Volcanic")
          .on('click', function(d) {
          svg.selectAll('circle')
             .transition()
             .duration(1500)
             .style('opacity', 0)
             .style('r', 0)
             .style('pointer-events', 'none')
          svg.selectAll(".Volcanic-activity")
             .style('pointer-events', 'all')
             .transition()
             .duration(1500)
             .style('opacity', 0.5);

        })

        }




  })();
