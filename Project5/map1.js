(function() {
    var height = 800,
        width = 1200;




    var svg = d3.select("#map-1")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)");

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

        var rectangle = svg.append("rect")
            .attr("x", 410)
            .attr("y", 0)
            .attr("width", 125)
            .attr("height", 2)
            .attr('fill', "url(#svgGradient)")

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
            .data(datapoints.filter(function(datum) {
            return datum.population > 1
            }))
            .enter()
            .append("path")
            .attr("class", "arcs")
            .attr('stroke', "url(#svgGradient)")
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
