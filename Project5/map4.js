(function() {
    var height = 800,
        width = 1200;

    var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
              return "<span style='color:black' 'font-weight:bolder' 'text-align: middle'> " +"Country " +d.country + "<span>"
            })

    var svg = d3.select("#map-4")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")
        svg.call(tip)


    d3.queue()
      .defer(d3.json, "world.topojson")
      .defer(d3.csv, "total_migration.csv")
      .await(ready)

      var circleRadiusScale = d3.scaleSqrt().domain([1,16000000]).range([0, 24]);
      var continentColorScale = d3.scaleOrdinal().domain(["Africa", "Asia", "Oceania", "Europe", "Northern America", "South America", "Central America", "Caribbean"]).range(["lightblue", "tomato", "lightgreen", "black", "yellow", "orange", "pink", "purple"]);


      var projection = d3.geoMercator()
          .translate([width / 2, height / 2])
          .scale(120)

      var path = d3.geoPath()
          .projection(projection)


    function ready(error, data, datapoints) {
    //console.log(data)

    var countries = topojson.feature(data, data.objects.countries).features
    //console.log(countries)

    svg.selectAll(".country")
          .data(countries)
          .enter().append("path")
          .attr("class", function(d) {
          var country_name = d.properties.name.replace(/ /g, "-")
                //  var ori =  d.destination_name.replace(/ /g, "-")
          return "country " + country_name;
            })
          .attr("d", path)
          .attr("fill", function(d){
            var country_name = d.properties.name.replace(/ /g, "-")

            if (country_name == "Antarctica")
            {return "none"}
            else
          {return "#EBEBEB"}
        })

    svg.selectAll(".circle")
        .data(datapoints)
        .enter().append("circle")
        .attr('r', function(d){
          return circleRadiusScale(d.total_migration)
        })
        .attr("cx", function(d) {
            var coords = projection([d.origin_lon, d.origin_lat])
                // console.log(coords)
            return coords[0];
        })
        .attr("cy", function(d) {
          var coords = projection([d.origin_lon, d.origin_lat])

          if (d.country === 'India')
          {return coords[1] + 20}
          else {
            return coords[1];
          }
        })
        .attr("fill", function(d){
          if(d.total_migration >5000000)
          {return "tomato"}
          else {
            return "none"
          }

        })
        .attr("stroke",function(d){
          if(d.total_migration >1)
          {return "tomato"}
          else {
            {return "none"}
          }
        })
        .attr("stroke-width", 1)
        .attr("opacity", 0.4)

        .on('mouseover', function(d) {
            var element = d3.select(this);
            element.style("stroke-width", "4");
            var box = d3.select('#country-display')
            box.style("display","block");
            var fixed_tip = d3.select('#country')
            fixed_tip.text(d.country)
            var immigrants_tip = d3.select('#immigrants')
            immigrants_tip.text(d.total_migration)
          })

          .on('mouseout', function(d) {
            var element = d3.select(this);
            element.style("stroke-width", "1");
            var box = d3.select('#country-display')
            box.style("display","block");
            var fixed_tip = d3.select('#country')
            fixed_tip.text("Mouse over a country")
            var immigrants_tip = d3.select('#immigrants')
            immigrants_tip.text('')
            })




    svg.selectAll(".country-label")
      .data(datapoints)
      .enter().append("text")
      .attr("class", "country-label")
      .attr("x", function(d) {
        var coords = projection([d.origin_lon, d.origin_lat])
        return coords[0] })
      .attr("y", function(d) {
        var coords = projection([d.origin_lon, d.origin_lat])
        if (d.country === 'India')
        {return coords[1] + 20}
        else {
          return coords[1];
        }
        })
      .text(function(d) {
        if(d.total_migration > 5000000)
            {return d.country}
          })
      .attr("fill", "gray")
      .attr("text-anchor", "middle")




    }
})();
