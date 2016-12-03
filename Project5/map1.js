(function() {
    var height = 800,
        width = 1200;


    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong style='color: black'>" + d.origin_name + "</strong>" +
                "<br>" +
                "<br><span style='color:gray' 'font-weight:bolder'> Country of destination:</span>" +
                "<span style='color:black' 'font-weight:bolder'> " + d.destination_name + "</span>" +
                "<br><span style='color:gray' 'font-weight:bolder'> Number of people: </span>" +
                "<span style='color:black' 'font-weight:bolder'> " + d.population + "</span>"

        })

    var tip2 = d3.tip()
        .attr('class', 'd3-tip2')
        .offset([-10, 0])
        .html(function(d) {
            "<br><span style='color:gray' 'font-weight:bolder'>" + d.short_name + "</span>"
        })

    var svg = d3.select("#map-1")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)");
    svg.call(tip)
    svg.call(tip2);


    // d3.queue()
    //     .defer(d3.json, "world.topojson")
    //     .defer(d3.csv, "immigration_2015_world.csv")
    //     .defer(d3.csv, "colors.csv")
    //     .await(ready)

    var projection = d3.geoAzimuthalEqualArea()
        .translate([width / 2, height / 2])
        .scale(200)

    var path = d3.geoPath()
        .projection(projection)

    window.drawMap1 = function(error, data, datapoints) {
        datapoints.forEach(function(d) {
            d.origin_lat = +d.origin_lat;
            d.origin_lon = +d.origin_lon;
            d.population = d.population;
        })

        var lineWidth = d3.scaleLinear().range([1, 6])

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
            .attr("fill", "#EBEBEB")
            // .attr("stroke", "white")

        //
        // .on("click", function(d) {
        //         d3.select(this)
        //         .attr("fill", "#ABABAB")
        //
        //         origin_name = "." + d.properties.name.replace(/ /g, "-")
        //
        //         origin_name_clean = d.properties.name
        //
        //         var countryMaxPopulation = d3.max(datapoints, function(d) {
        //           if(origin_name_clean == d.origin_name) {return +d.population}
        //         })
        //         lineWidth.domain([1, countryMaxPopulation])
        //
        //         svg.selectAll(".arcs" + origin_name)
        //             .style('stroke-width', function(d){
        //               return lineWidth(d.population) + 'px'
        //             })
        //             .style('stroke', function(d) {
        //                 if (d.population > 1) {
        //                     return "red"
        //                 } else {
        //                     return 'none'
        //                 }
        //             })
        //             .style("opacity", 0.2)
        //
        //         svg.selectAll(".circle")
        //           .attr("fill", "lightpurple")
        //
        //         svg.selectAll(".circle" + origin_name)
        //           .attr("fill", "lightblue")
        //           .attr("opacity", 0.4)
        //
        //     })

        svg.selectAll(".circle")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", function(d) {
                var origin = d.origin_name.replace(/ /g, "-")
                return "circle " + origin;
            })

        .attr('r', 2)
            .attr("cx", function(d) {
                var coords = projection([d.origin_lon, d.origin_lat])
                    // console.log(coords)
                return coords[0];
            })
            .attr("cy", function(d) {
                var coords = projection([d.origin_lon, d.origin_lat])
                return coords[1];
            })
            .attr("fill", "#EBEBEB")

        svg.selectAll(".arcs")
            .data(datapoints)
            .enter()
            .append("path")
            .attr("class", "arcs")
            .style('stroke', function(d) {
                if (d.population > 1) {
                    return "tomato"
                } else {
                    return 'none'
                }
            })
            .style("stroke-width", 0.3)
            .style("opacity", 0.2)
            .attr("fill", "none")
            .attr("class", function(d) {
                var origin = d.origin_name.replace(/ /g, "-")
                    //  var destination =  d.destination_name.replace(/ /g, "-")
                return "arcs " + origin;
            })

        .attr('d', function(d) {
                return lngLatToArc(d, 1); // A bend of 5 looks nice and subtle, but this will depend on the length of your arcs and the visual look your visualization requires. Higher number equals less bend.
            })
            .attr("opacity", 0.4)
            // .on('mouseover', function(d) {
            //     d3.select(this)
            //     .attr("stroke", "black")
            //     tip.show(d)
            //     var destination = "." + d.destination_name.replace(/ /g, "-")
            //
            //     svg.selectAll(".country" + destination)
            //         .attr("fill", "red")
            //         .attr("opacity", 0.4)
            //
            //     svg.selectAll(".circle" + destination)
            //         .attr("fill", "red")
            //         .attr("opacity", 0.4)
            //
            // })
            //
            // .on('mouseout', function(d) {
            //     d3.select(this)
            //         .attr("stroke", "red")
            //     tip.hide(d)
            //     var destination = "." + d.destination_name.replace(/ /g, "-")
            //     svg.selectAll(".country" + destination)
            //         .attr("fill", "#EBEBEB")
            //         .attr("opacity", 1)
            //     svg.selectAll(".circle" + destination)
            //         .attr("fill", "none")
            //         .attr("opacity", 0.4)
            //
            // })




        // This function takes an object, the key names where it will find an array of lng/lat pairs, e.g. `[-74, 40]`
        // And a bend parameter for how much bend you want in your arcs, the higher the number, the less bend.
        function lngLatToArc(d, bend) {
            // If no bend is supplied, then do the plain square root
            bend = bend || 1;
            // `d[sourceName]` and `d[targetname]` are arrays of `[lng, lat]`
            // Note, people often put these in lat then lng, but mathematically we want x then y which is `lng,lat`

            var sourceLngLat = [d.origin_lon, d.origin_lat],
                targetLngLat = [d.destination_lon, d.destination_lat];

            if (targetLngLat && sourceLngLat) {
                var sourceXY = projection(sourceLngLat),
                    targetXY = projection(targetLngLat);

                // Uncomment this for testing, useful to see if you have any null lng/lat values
                // if (!targetXY) console.log(d, targetLngLat, targetXY)
                var sourceX = sourceXY[0],
                    sourceY = sourceXY[1];

                var targetX = targetXY[0],
                    targetY = targetXY[1];

                var dx = targetX - sourceX,
                    dy = targetY - sourceY
                dr = Math.sqrt(dx * dx + dy * dy) * bend;

                // To avoid a whirlpool effect, make the bend direction consistent regardless of whether the source is east or west of the target
                var west_of_source = (targetX - sourceX) < 0;
                if (west_of_source) return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,1 " + sourceX + "," + sourceY;
                return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;

            } else {
                return "M0,0,l0,0z";
            }
        }




    }
})();
