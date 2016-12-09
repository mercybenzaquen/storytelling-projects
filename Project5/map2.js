(function() {
    var height = 900,
        width = 1200;


    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong style='color: black'>" + d.origin_name + "</strong>" +
                "<br>" +
                "<br><span style='color:gray' 'font-weight:bolder'> Number of people: </span>" +
                "<span style='color:black' 'font-weight:bolder'> " + d.population + "</span>"
        })


    var svg = d3.select("#map-2")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)");
    svg.call(tip)


    // d3.queue()
    //     .defer(d3.json, "world.topojson")
    //     .defer(d3.csv, "immigration_2015_us.csv")
    //     .defer(d3.csv, "colors.csv")
    //     .await(ready)

    var projection = d3.geoTransverseMercator()
        .translate([width / 2, height / 2])
        .scale(120)

    var path = d3.geoPath()
        .projection(projection)


    var lineWidth = d3.scaleSqrt().domain([2079, 12050031]).range([0.3, 6])

    window.drawMap2 = function(error, data, datapoints) {
        datapoints.forEach(function(d) {
            d.origin_lat = +d.origin_lat;
            d.origin_lon = +d.origin_lon;
            d.population = d.population;
        })

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
            .attr("stroke", function(d) {
                if (d.properties.name == "United States") {
                    return "gray"
                } else {
                    return "#EBEBEB"
                }
            })
            .attr("fill", "#EBEBEB")


        svg.selectAll(".arcs")
            .data(datapoints.filter(function(d) {
                return d.destination_name === "United States"
            }))
            .enter()
            .append("path")
            .attr("class", "arcs")
            .style('stroke', "#990066")
            .style("stroke-linecap", "round")
            .attr("stroke-width", function(d) {
                return lineWidth(d.population) + 'px'
            })
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


        svg.selectAll(".circle")
            .data(datapoints.filter(function(d) {
                return d.destination_name === "United States"
            }))
            .enter().append("circle")
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
            .attr("fill", "#990066")
            .attr("stroke", function(d) {
                if (d.population > 1) {
                    return "#990066"
                } else {
                    {
                        return "none"
                    }
                }
            })
            .attr("stroke-width", "none")
            .attr("opacity", 1)
            .on('mouseover', function(d) {
                d3.select(this)
                    .attr("fill", "black")
                tip.show(d)
                var origin = "." + d.origin_name.replace(/ /g, "-")
                svg.selectAll(".country" + origin)
                    .attr("fill", "#990066")
                    .attr("opacity", 0.4)

            })
            .on('mouseout', function(d) {
                d3.select(this)
                    .attr("fill", "#990066")
                tip.hide(d)
                var origin = "." + d.origin_name.replace(/ /g, "-")
                svg.selectAll(".country" + origin)
                    .attr("fill", "#EBEBEB")
                    .attr("opacity", 1)

            })


        svg.selectAll(".country-label")
            .data(datapoints.filter(function(d) {
                return d.destination_name === "United States"
            }))
            .enter().append("text")
            .attr("class", "country-label")
            .attr("x", function(d) {
                var coords = projection([d.origin_lon, d.origin_lat])
                if (d.origin_name == "Puerto Rico") {
                    return coords[0] + 45
                }
                if (d.origin_name == "China") {
                    return coords[0] + 30
                }
                if (d.origin_name == "India") {
                    return coords[0] + 25
                }
                if (d.origin_name == "Philippines") {
                    return coords[0] + 40
                }
                if (d.origin_name == "Viet Nam") {
                    return coords[0] + 35
                }
                if (d.origin_name == "Republic of Korea") {
                    return coords[0] + 60
                }
                if (d.origin_name == "Cuba") {
                    return coords[0] - 30
                }
                if (d.origin_name == "El Salvador") {
                    return coords[0] - 40
                }
                if (d.origin_name == "Mexico") {
                    return coords[0] - 30
                } else {
                    return coords[0]
                };
            })
            .attr("y", function(d) {
                var coords = projection([d.origin_lon, d.origin_lat])
                    // console.log(coords)
                if (d.origin_name == "Viet Nam") {
                    return coords[1] + 12
                }
                if (d.origin_name == "Republic of Korea") {
                    return coords[1] + 15
                } else {
                    return coords[1] + 5
                };
            })
            .text(function(d) {
                if (d.population > 1000000) {
                    return d.origin_name
                }
            })
            .attr("fill", "gray")
            .attr("text-anchor", "middle")



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
