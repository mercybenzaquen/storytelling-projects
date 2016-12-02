var width = 1200,
    height = 800;
var radius = 360;


var canvas = d3.select("#map-0").append("canvas")
    .attr("width", width)
    .attr("height", height);

var ctx = canvas.node().getContext("2d");


var projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .scale(100)

var path = d3.geoPath().context(ctx).projection(projection);


d3.queue()
    .defer(d3.json, "world.topojson")
    .defer(d3.csv, "immigration_2015_world2.csv")
    .await(ready)


/*

  THIS IS THE CODE TO GENERATE YOUR PARTICLES

*/

// start with no particles
var particles = [];

function ready(error, data, datapoints) {

    var countries = topojson.feature(data, data.objects.countries).features
        //console.log(countries)

    datapoints.forEach(function(d) {
        d.origin_lat = +d.origin_lat;
        d.origin_lon = +d.origin_lon;
        d.population = d.population;


    })
    datapoints.forEach(function(d) {
            // and create one datapoint for every single person who immigrated to
            // that country


            var pt_category = d.destination_name;

            // this is random datapoints JUST for that country
            // d3.range takes d.count and converts it into an array
            // if you have d3.range(10) it creates [0, ],2, 3, 4, 5, 6, 7, 8, 9]
            // and you're just using .map to convert the numbers into random people

            var countryParticles = d3.range(d.population / 100000).map(function(i) {
                    var pt_angle = Math.random() * 2 * Math.PI;
                    var pt_radius_sq = Math.random() * radius * radius;
                    var pt_x = Math.sqrt(pt_radius_sq) * Math.cos(pt_angle) + width / 2;
                    var pt_y = Math.sqrt(pt_radius_sq) * Math.sin(pt_angle) + height / 2;
                    return {
                        x: pt_x,
                        y: pt_y,
                        category: pt_category
                    };
                })
                // take the new particles and add them to the existing other country
                // particles
            particles = particles.concat(countryParticles);
        })
        //console.log(particles.length)

    /*

      THIS IS THE CODE TO DRAW YOUR PARTICLES

    */

    // to begin with, use a d3.timer to make
    // the points wander around
    var wanderTimer = d3.timer(step);
    var directionTimer;

    // once the button is clicked, STOP the wandering timer
    // and start the timer that directs the points to where
    // they need to go
    d3.select("#clickme").on('click', function() {
        wanderTimer.stop();
        directionTimer = d3.timer(direction);
    })


    // based on the category of the point, move it
    // towards a particular spot
    function direction() {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        // clear out everything that is on the page
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        // for each particle, reposition and draw
        particles.forEach(function(d) {

            var coords = projection([d.origin_lon, d.origin_lat])
                // console.log(coords)
            return coords[0];
            // console.log(coords)


            if (d.category === 'India') {
                // move the point towards 50 pixels from the top
                moveTowards(data, coord[0], coords[1])
            } //else if(d.category === "India") {
            //   // move the point towards 50 pixels from the bottom
            //   // in the middle
            //   moveTowards(d, width / 2, height - 50)
            else {
                // move the point towards the middle
                moveTowards(data, width / 2, height / 2)
            }

            // draw the updated position
            drawPoint(d)


        });
    }


    // used with the timer to make the points wander
    function step() {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        particles.forEach(function(d) {
            // randomly move around
            d.x += Math.round(2 * Math.random() - 1);
            d.y += Math.round(2 * Math.random() - 1);
            if (d.x < 0) d.x = width;
            if (d.x > width) d.x = 0;
            if (d.y < 0) d.y = height;
            if (d.y > height) d.y = 0;
            //Drawing Text
            drawPoint(d)
                // ctx.fillStyle = "tomato";
                // ctx.fillText("Each dot represents 20,000 immigrants", width/ 2, height/ 2);
                // //There are several options for setting text
                // ctx.font = "30px Open Sans";
                // //textAlign supports: start, end, left, right, center
                // ctx.textAlign = "center"
                // // //textBaseline supports: top, hanging, middle, alphabetic, ideographic bottom
                // // ctx.textBaseline = "hanging"


        });
    };


    // push the x and y of the data point towards
    // a target x and y
    function moveTowards(d, targetX, targetY) {
        // if it's above the target X, increase x
        if (d.x > targetX) {
            d.x = d.x - 1
        }
        // if it's below the target X, decrease x
        if (d.x < targetX) {
            d.x = d.x + 1
        }
        // if it's above the target Y, increase x
        if (d.y > targetY) {
            d.y = d.y - 1
        }
        // if it's below the target Y, decrease y
        if (d.y < targetY) {
            d.y = d.y + 1
        }
    }




    // given a point, draw it as a 1x1 rectangle

    function drawPoint(d) {
        ctx.fillStyle = "tomato";

        ctx.fillRect(d.x, d.y, 1, 1);


    }



    /*

      DRAWING MAP
    */
    // function drawMap() {
    //   ctx.beginPath();
    //   path(topojson.mesh(data)); //it does not work if I feed it countries
    //   ctx.stroke();
    //   ctx.closePath()
    // }


}
