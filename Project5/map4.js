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

      var rectScale = d3.scaleLinear().domain([2000000,16000000]).range([20, 100])

      var color = d3.scaleLinear().domain([0, 16000000]).range(['#FAFAFA', '#CDCDCD'])
      var continentColorScale = d3.scaleOrdinal().domain(["Africa", "Asia", "Oceania", "Europe", "Northern America", "South America", "Central America", "Caribbean"]).range(["lightblue", "#911955", "lightgreen", "black", "yellow", "orange", "pink", "#911955"]);


      var projection = d3.geoMercator()
          .translate([width / 2, height / 2])
          .scale(150)

      var path = d3.geoPath()
          .projection(projection)

      d3.json("world.topojson", function(error, data) {
          d3.csv("total_migration.csv", function(error, datapoints) {
          var rateByCountry = {};

            datapoints.forEach(function(d) {
            rateByCountry[d.country] = +d.total_migration;
              });



    var countries = topojson.feature(data, data.objects.countries).features

    svg.selectAll(".country")
          .data(countries)
          .enter().append("path")
          .attr("class", function(d) {
          var country_name = d.properties.name.replace(/ /g, "-")
                //  var ori =  d.destination_name.replace(/ /g, "-")
          return "country " + country_name;
            })
          .attr("d", path)
          // .attr("stroke-width", 0.5)
          // .attr("stroke", "black")



        .style("fill", function(d) {
              if(d.properties.name == 'Somaliland'){
                return "none"
              }
              if(d.properties.name == 'Taiwan'){
                return "none"
              }
              if(d.properties.name == 'French Southern Territories'){
                return "none"
              }
              if(d.properties.name == 'South Georgia and the South Sandwich Islands'){
                return "none"
              }
              if(d.properties.name == 'Antarctica'){
                return "none"
              }
              if(d.properties.name == 'Åland Islands'){
                return "none"
              }
              if(d.properties.name == 'Kosovo'){
                return "none"
              }
              else{return color(rateByCountry[d.properties.name])}

                    })

    svg.selectAll(".rect")
        .data(datapoints.filter(function(datum) {
            return datum.total_migration > 2000000;
        }))
        // .data(datapoints)
        .enter().append("rect")
        .attr('width', function(d){
          return rectScale(d.total_migration)
        })
        .attr('height', function(d){
          return rectScale(d.total_migration)
        })
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("x", function(d) {
            var coords = projection([d.origin_lon, d.origin_lat])
                // console.log(coords)
            if (d.country === 'Colombia')
            {return coords[0] - 13;}
            if (d.country === 'Mexico')
            {return coords[0] - 25;}
            if (d.country === 'United States')
            {return coords[0] - 20;}
            if (d.country === 'Morocco')
            {return coords[0] - 20;}
            if (d.country === 'Portugal')
            {return coords[0] - 10;}
            if (d.country === 'United Kingdom')
            {return coords[0] - 15;}
            if (d.country === 'France')
            {return coords[0] - 10;}
            if (d.country === 'Germany')
            {return coords[0] - 10;}
            if (d.country === 'Poland')
            {return coords[0] ;}
            if (d.country === 'Italy')
            {return coords[0] - 3 ;}
            if (d.country === 'Romania')
            {return coords[0] - 5 ;}
            if (d.country === 'Ukraine')
            {return coords[0] + 6;}
            if (d.country === 'Russia')
            {return coords[0] - 15;}
            if (d.country === 'Turkey')
            {return coords[0] - 2;}
            if (d.country === 'Syria')
            {return coords[0] - 5;}
            if (d.country === 'State of Palestine')
            {return coords[0] -35;}
            if (d.country === 'Egypt')
            {return coords[0] -18;}
            if (d.country === 'Kazakhstan')
            {return coords[0] -10;}
            if (d.country === 'Afghanistan')
            {return coords[0] -32;}
            if (d.country === 'Pakistan')
            {return coords[0] -5;}
            if (d.country === 'India')
            {return coords[0] - 40;}
            if (d.country === 'Bangladesh')
            {return coords[0] - 12;}
            if (d.country === 'China')
            {return coords[0] - 40;}
            if (d.country === 'Myanmar')
            {return coords[0] + 20;}
            if (d.country === 'Viet Nam')
            {return coords[0] -5;}
            if (d.country === 'Republic of Korea')
            {return coords[0] - 5;}
            if (d.country === 'Philippines')
            {return coords[0] - 10;}
            if (d.country === 'Indonesia')
            {return coords[0] - 30;}
            else
            {return coords[0]}
        })
        .attr("y", function(d) {
          var coords = projection([d.origin_lon, d.origin_lat])
          if (d.country === 'Colombia')
          {return coords[1] - 10;}
          if (d.country === 'Mexico')
          {return coords[1] - 20;}
          if (d.country === 'United States')
          {return coords[1] - 15;}
          if (d.country === 'Morocco')
          {return coords[1] - 10;}
          if (d.country === 'Portugal')
          {return coords[1] - 10;}
          if (d.country === 'United Kingdom')
          {return coords[1] - 15;}
          if (d.country === 'France')
          {return coords[1] - 10;}
          if (d.country === 'Germany')
          {return coords[1] - 10;}
          if (d.country === 'Poland')
          {return coords[1] - 14;}
          if (d.country === 'Italy')
          {return coords[1] - 5;}
          if (d.country === 'Romania')
          {return coords[1] - 3 ;}
          if (d.country === 'Ukraine')
          {return coords[1] - 10 ;}
          if (d.country === 'Russia')
          {return coords[1] - 40;}
          if (d.country === 'Turkey')
          {return coords[1] - 4;}
          if (d.country === 'Syria')
          {return coords[1] + 10;}
          if (d.country === 'State of Palestine')
          {return coords[1] - 15;}
          if (d.country === 'Kazakhstan')
          {return coords[1] -20;}
          if (d.country === 'Afghanistan')
          {return coords[1] -30;}
          if (d.country === 'Pakistan')
          {return coords[1] - 20;}
          if (d.country === 'India')
          {return coords[1] + 10;}
          if (d.country === 'Bangladesh')
          {return coords[1] - 32;}
          if (d.country === 'China')
          {return coords[1] - 65;}
          if (d.country === 'Myanmar')
          {return coords[1] - 20;}
          if (d.country === 'Republic of Korea')
          {return coords[1] - 20;}
          if (d.country === 'Philippines')
          {return coords[1] - 10;}
          if (d.country === 'Indonesia')
          {return coords[1] - 10;}
          else
          {return coords[1];}

        })
        .attr("fill", '#911955')
        // .attr("stroke", "#911955")
        .attr("stroke-width", 1)
        .attr("opacity", 0.6)

        .on('mouseover', function(d) {
          // var textEl = d3.select(document.getElementById('country-display').querySelector('strong'));
          // textEl.style('color', '#911955');
            var element = d3.select(this);
            element.style("stroke-width", "3");
            element.style("stroke", "black");
            var box = d3.select('#country-display')
            box.style("display","block");
            var fixed_tip = d3.select('#country')
            fixed_tip.text(d.country)
            fixed_tip.style("stroke", "#911955")
            var immigrants_tip = d3.select('#immigrants')
            immigrants_tip.text(d.total_migration)

          })

          .on('mouseout', function(d) {
            // var textEl = d3.select(document.getElementById('country-display').querySelector('strong'));
            // textEl.style('color', '#595959');
            var element = d3.select(this);
            element.style("stroke", "none");
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
            // console.log(coords)
        if (d.country === 'Colombia')
        {return coords[0] + 25;}
        if (d.country === 'Mexico')
        {return coords[0] + 15;}
        if (d.country === 'United States')
        {return coords[0] - 9;}
        if (d.country === 'Morocco')
        {return coords[0] - 40;}
        if (d.country === 'Portugal')
        {return coords[0] - 30;}
        if (d.country === 'United Kingdom')
        {return coords[0] + 3;}
        if (d.country === 'France')
        {return coords[0] - 25;}
        if (d.country === 'Germany')
        {return coords[0] + 5;}
        if (d.country === 'Poland')
        {return coords[0] + 15;}
        if (d.country === 'Italy')
        {return coords[0] + 8 ;}
        if (d.country === 'Romania')
        {return coords[0] + 7 ;}
        if (d.country === 'Ukraine')
        {return coords[0] + 25;}
        if (d.country === 'Russia')
        {return coords[0] + 20;}
        if (d.country === 'Turkey')
        {return coords[0] + 10;}
        if (d.country === 'Syria')
        {return coords[0] + 12;}
        if (d.country === 'State of Palestine')
        {return coords[0] -55;}
        if (d.country === 'Egypt')
        {return coords[0] -6;}
        if (d.country === 'Kazakhstan')
        {return coords[0] + 5;}
        if (d.country === 'Afghanistan')
        {return coords[0] - 15;}
        if (d.country === 'Pakistan')
        {return coords[0] + 15;}
        if (d.country === 'India')
        {return coords[0] + 10;}
        if (d.country === 'Bangladesh')
        {return coords[0] + 12;}
        if (d.country === 'China')
        {return coords[0] - 8;}
        if (d.country === 'Myanmar')
        {return coords[0] + 65;}
        if (d.country === 'Viet Nam')
        {return coords[0] +5;}
        if (d.country === 'Republic of Korea')
        {return coords[0] + 53;}
        if (d.country === 'Philippines')
        {return coords[0] + 55;}
        if (d.country === 'Indonesia')
        {return coords[0] + 25;}
        else
        {return coords[0]}
      })

      .attr("y", function(d) {
        var coords = projection([d.origin_lon, d.origin_lat])
        if (d.country === 'Colombia')
        {return coords[1] + 5;}
        if (d.country === 'Mexico')
        {return coords[1] + 25;}
        if (d.country === 'United States')
        {return coords[1] + 1;}
        if (d.country === 'Morocco')
        {return coords[1] + 5;}
        if (d.country === 'Portugal')
        {return coords[1] + 2;}
        if (d.country === 'United Kingdom')
        {return coords[1] + 8;}
        if (d.country === 'France')
        {return coords[1] + 3;}
        if (d.country === 'Germany')
        {return coords[1] - 15;}
        if (d.country === 'Poland')
        {return coords[1] - 20;}
        if (d.country === 'Italy')
        {return coords[1] + 10;}
        if (d.country === 'Romania')
        {return coords[1] + 12 ;}
        if (d.country === 'Ukraine')
        {return coords[1] + 12 ;}
        if (d.country === 'Russia')
        {return coords[1] ;}
        if (d.country === 'Turkey')
        {return coords[1] + 10;}
        if (d.country === 'Syria')
        {return coords[1] + 30;}
        if (d.country === 'State of Palestine')
        {return coords[1] ;}
        if (d.country === 'Kazakhstan')
        {return coords[1] - 25;}
        if (d.country === 'Afghanistan')
        {return coords[1] -33;}
        if (d.country === 'Pakistan')
        {return coords[1];}
        if (d.country === 'India')
        {return coords[1] + 65;}
        if (d.country === 'Bangladesh')
        {return coords[1] - 7;}
        if (d.country === 'China')
        {return coords[1] - 30;}
        if (d.country === 'Myanmar')
        {return coords[1] - 5;}
        if (d.country === 'Republic of Korea')
        {return coords[1] - 7;}
        if (d.country === 'Philippines')
        {return coords[1] + 10;}
        if (d.country === 'Indonesia')
        {return coords[1] + 7;}
        if (d.country === 'Viet Nam')
        {return coords[1] + 35;}
        if (d.country === 'Egypt')
        {return coords[1] + 15;}

        else
        {return coords[1];}

        })
      .text(function(d) {
        if (d.country === 'United States')
        {return "U.S"}
        if (d.country === 'State of Palestine')
        {return "Palestine"}
        if (d.country === 'United Kingdom')
        {return "U.K"}
        if (d.country === 'Romania')
        {return "Rou"}
        if(d.total_migration > 2000000)
        {return d.country}
          })
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("font-size", function(d){
        if (d.country === 'Mexico')
        {return '18px'}
        if (d.country === 'Russia')
        {return '18px'}
        if (d.country === 'China')
        {return '16'}
        if (d.country === 'India')
        {return '20'}
        if (d.country === 'United Kingdom')
        {return '15'}
        else {
          return '8px'
        }
      })


})
})

    //}
})();
