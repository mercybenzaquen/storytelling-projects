(function() {
    var margin = {
            top: 10,
            left: 10,
            right: 10,
            bottom: 10
        },
        height = 600,
        width = 1200;


    var svg = d3.select("#map-3")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var projection = d3.geoAzimuthalEqualArea()
        .translate([0, height / 2])
        .scale(50)

    var path = d3.geoPath()
        .projection(projection)

    var mapCoordinates = {

        "Asia": {
            x: 200,
            y: -170
        },
        "Europe": {
            x: 500,
            y: -170
        },
        "Africa": {
            x: 750,
            y: -170
        },
        "Oceania": {
            x: 1000,
            y: -170
        },
        "Northern America": {
            x: 200,
            y: 90
        },
        "Caribbean": {
            x: 500,
            y: 90
        },
        "Central America": {
            x: 750,
            y: 90
        },
        "South America": {
            x: 1000,
            y: 90
        },

    }

    window.drawMap3 = function(error, data, datapoints) {
        datapoints.forEach(function(d) {
            d.origin_lat = +d.origin_lat;
            d.origin_lon = +d.origin_lon;
            d.population = d.population;
        })


        var countries = topojson.feature(data, data.objects.countries).features

        var nested = d3.nest()
            .key(function(d) {
                return d.destination_continent;
            })
            .entries(datapoints);
        //console.log(nested)

        //GRADIENT FOR THE ARCS

        var defs = svg.append("defs");

        var gradient = defs.append("linearGradient")
            .attr("id", "svgGradient")
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "100%");

        gradient.append("stop")
            .attr('class', 'start')
            .attr("offset", "0%")
            .attr("stop-color", "red")
            .attr("stop-opacity", 1);

        gradient.append("stop")
            .attr('class', 'end')
            .attr("offset", "100%")
            .attr("stop-color", "blue")
            .attr("stop-opacity", 1);

        var maps = svg.selectAll(".multiples")
            .data(nested)
            .enter().append("g")
            .attr("transform", function(d) {
                var mapcoords = mapCoordinates[d.key]
                    //console.log(mapcoords.x)
                var yPos = mapcoords.y
                var xPos = mapcoords.x
                return "translate(" + xPos + "," + yPos + ")"
            })
            .attr("class", function(d) {
                var continent = d.key.replace(/ /g, "-")
                return "multiples " + continent;
            })


        maps.each(function(d) {
            var g = d3.select(this);
            var current_cont = d.key; // variable storing current continent for filtering later
            g.selectAll(".country")
                .data(countries)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", "#EBEBEB")

            g.append("text") //  append text to g element rather than maps
                .attr("x", 0)
                .attr("y", 440)
                .attr("text-anchor", "middle")
                .text(function(d) {
                    return d.key
                })


            g.selectAll(".arcs" + "." + d.key.replace(" ", "-")) //  only to g
                .data(datapoints.filter(function(datum) {
                    return datum.destination_continent === current_cont;
                })) // filter your data before drawing paths, only draws data that has the current continent as destination
                .enter().append("path")
                // .attr("class", "arcs")
                .attr("class", function(d) {
                    var continent = d.destination_continent.replace(" ", "-")
                    return "arcs " + continent;
                })
                .style('stroke', function(d) {
                    if (d.population > 1) {
                        return 'url(#svgGradient)'
                    } else {
                        return 'none'
                    }
                })
                .style('stroke-width', '0.1px')
                .attr("fill", 'none')
                .attr('d', function(d) {
                    return lngLatToArc(d, 1); // A bend of 5 looks nice and subtle, but this will depend on the length of your arcs and the visual look your visualization requires. Higher number equals less bend.
                })
                .attr("opacity", 0.6)
        })




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
