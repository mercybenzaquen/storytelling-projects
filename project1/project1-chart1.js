
(function() {
  var margin = { top: 100, left: 130, right: 30, bottom: 30},
  height = 400 - margin.top - margin.bottom,
  width = 900 - margin.left - margin.right;

  console.log("Building chart 1");

  // Create a time parser
  var parse = d3.timeParse("%m/%d/%y")

  // Create your scales, but ONLY give them a range
  // (you'll set the domain once you read in your data)
  var xPositionScale = d3.scaleLinear().range([0, width]);
  var yPositionScale = d3.scaleLinear().range([height, 0])
  var line = d3.line()
    .x(function(d) {
      return xPositionScale(d.datetime);
      })
    .y(function(d) {
      return yPositionScale(d.Score);
      })
    .curve(d3.curveMonotoneX)

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
//     .offset(function() {
//       return [this.getBBox().height / 2, 0]
// })

    .html(function(d) {
      return "<span style='color:gray; font-size: 10pt;  align: center'>" + d.month + "<br>" + d.trump + "</span>"
    })

  var svg = d3.select("#project1-chart1")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);
  console.log(tip)

  d3.queue()
    .defer(d3.csv, "project1_dataset.csv", function(d) {
      // While we're reading the data in, parse each date
      // into a datetime object so it isn't just a string
      // save it as 'd.datetime'
      // d.datetime is now your 'useful' date, you can ignore
      // d.Date. Feel free to use console.log to check it out.
      d.datetime = parse(d.Week);
      console.log(d.datetime)
      console.log(d.Week)
      //console.log(d.datetime)

      d.Score = +d.score;
      console.log(d.Score)
      //console.log(d.Close)
      return d;

    })
    .await(ready);

    function ready(error, datapoints) {

    console.log(datapoints)

    // Get the max and min of datetime and Close,
    // then use that to set the domain of your scale

    // NOTE:I've done it for the datetime, you do it for the close price
    var minDatetime = d3.min(datapoints, function(d) { return d.datetime });
    var maxDatetime = d3.max(datapoints, function(d) { return d.datetime });
    xPositionScale.domain([minDatetime, maxDatetime])

    var minClosetime = d3.min(datapoints, function(d) { return d.Score });
    var maxClosetime = d3.max(datapoints, function(d) { return d.Score });
    yPositionScale.domain([minClosetime, maxClosetime])


    // Draw your dots
    svg.selectAll(".trumpcircles")
      .data(datapoints)
      .enter().append("circle")
        .attr("class", "trumpcircles")
        .attr("r", function(d) {
          if (d.trump != "") {return "6"}
          else {return "none"}
        })
        .attr("stroke", function(d) {
          if (d.Score > 1) {return "red"}
          else {return "none"}
        })
        .attr("stroke-width", 2)
        .attr("fill", "white")
        .attr("cx", function(d) {
          return xPositionScale(d.datetime)
        })
        .attr("cy", function(d) {
          return yPositionScale(d.Score)
        })

        .on('mouseover', function(d,i) {
          tip.show(d,i)
          svg.selectAll(".trumpcircles")
          .filter(function(e) {
            return(e.datetime != d.datetime)
          })
          .transition()
          .style("opacity", 0.2)

        })

        .on('mouseout', function(d,i) {
          tip.hide(d,i)
          svg.selectAll(".trumpcircles")
          .filter(function(e) {
            return(e.datetime != d.datetime)
          })
          .transition()
          .style("opacity", 1)
        })
    // Draw your SINGLE line (but remember it isn't called a line)
    svg.append("path")
      .datum(datapoints)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 3)

      // Adding Axis Labels (bonus)
    // svg.append("text")
    //    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    //    .attr("transform", "translate("(100)", "+(height)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
    //    .text("Google searches(a value of 100 is the peak popularity for the term.)");

    svg.append("text")      // text label for the x axis
        .attr("x", -50)
        .attr("y", -15 )
        .style("text-anchor", "middle")
        .text("Google searches")
        .attr("font-size", "15px");

        svg.append("text")      // text label for the x axis
            .attr("x", 80)
            .attr("y", +9 )
            .style("text-anchor", "middle")
            .text("* A value of 100 = peak in popularity")
            .attr("font-size", "10px");

    // Add your axes - I've added the x axis for you
    // Notice that xAxis gets a .tickFormat to format the dates!
    // You won't use this again unless you're doing time again.
      var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat("%Y"));
      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      var yAxis = d3.axisLeft(yPositionScale)
      svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);


    }
})();
