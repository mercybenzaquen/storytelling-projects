(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50},
    height = 500 - margin.top - margin.bottom,
    width = 960 - margin.left - margin.right;

    var padding = 30
    var xPositionScale = d3.scaleLinear().domain([0,100000]).range([0, width])
    var yPositionScale = d3.scaleLinear().domain([0,100]).range([height, 0]);

    var xPositionAxis = d3.scaleLinear().range([0, width ])
    var yPositionAxis = d3.scaleLinear().range([height, 0])

    var colorByContinent = d3.scaleOrdinal().domain(["Asia","Africa", "S. America", "N. America", "Oceania", "Europe"]).range(["#66c2a5", '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f'])

    var circleScale= d3.scaleSqrt().domain([57296, 1341335152]).range([7, 50])

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<span style='color:white; font-size: 10pt; font-family: sans-serif; align: center'>" +d.Country+ "</span>"
    })
  // What is this???
  var svg = d3.select("#chart-1")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var box = d3.select('#country-display')
        box.style("display","none");

  svg.call(tip);

  d3.queue()
    .defer(d3.csv, "le_gdp_pop-2010.csv")
    .await(ready)

  function ready(error, datapoints) {

    var maxGDP = d3.max(datapoints, function(d) { return +d.GDP_per_capita});
    xPositionAxis.domain([0, maxGDP])

    var maxAge = d3.max(datapoints, function(d) { return +d.life_expectancy });
    yPositionAxis.domain([0, maxAge])


    var sorted = datapoints.sort(function(a, b) {
      return b.Population - a.Population;
      });


    svg.selectAll("circle")
      .data(sorted)
      .enter().append("circle")
      .attr("class", function(d) {
        var size = null;
        var cont = d.Continent.replace('. ', '-');
        if (d.Population < 5000000) {
          size = 'small';
        } else {
          size = 'large';
        }
        return "circle " + size + " " + cont;
      })
      .attr("r", function(d){
        return circleScale(d.Population)
      })
      .attr("cx", function(d) {
        return xPositionScale(d.GDP_per_capita)
      })
      .attr("cy", function(d) {
        return yPositionScale(d.life_expectancy)
      })
      .style("fill", function(d){
        return colorByContinent(d.Continent)
      })
      .style("stroke", "white")
      .style("stroke-width", "0.5")
      .on('mouseover', function(d) {
          var element = d3.select(this);
          element.style("fill", "black");
          var box = d3.select('#country-display')
          box.style("display","block");
          var fixed_tip = d3.select('#selected')
          fixed_tip.text(d.Country)
          var gdp_tip = d3.select('#gdp')
          gdp_tip.text(d.GDP_per_capita)
          var age_tip = d3.select('#age')
          age_tip.text(d.life_expectancy)

        })

      .on('mouseout', function(d) {
          var element = d3.select(this);
          element.style("fill", function(d){
            return colorByContinent(d.Continent)
          });
          var fixed_tip = d3.select('#selected')
          fixed_tip.text('')
          var box = d3.select('#country-display')
          box.style("display","none");
        })



      d3.select(".Africa")
          .on('click', function() {
            var AfricamaxGDP = d3.max(datapoints, function(d) {
              if(d.Continent == 'Africa') {return +d.GDP_per_capita}
              else
              {return 0}
            });
            xPositionScale.domain([0,AfricamaxGDP])
            svg.selectAll('circle')
            .transition()
            .duration(1500)
              .style('opacity', function(d) {
                if (d.Continent == 'Africa') {return "1"}
                else {return "0.1"}
              })
              .attr("cx", function(d) {
                return xPositionScale(d.GDP_per_capita)
              })
              .attr("cy", function(d) {
                return yPositionScale(d.life_expectancy)
              })

            xPositionAxis.domain([0,AfricamaxGDP])
            svg.selectAll(".x-axis")
                    .transition()
                    .duration(1500)
                    .call(xAxis)

        d3.select(".small")
          .on('click', function() {
              svg.selectAll('circle')
                  .transition()
                  .duration(1500)
                  .style('opacity', 0.1)
              svg.selectAll('.Africa.small')
                  .transition()
                  .duration(1500)
                  .style('opacity', 1);



                })
        d3.select(".large")
          .on('click', function() {
             svg.selectAll('circle')
             .transition()
             .duration(1500)
             .style('opacity', 0.1);
            svg.selectAll('.Africa.large')
            .transition()
            .duration(1500)
            .style('opacity', 1);
                  })
              })


        d3.select(".Oceania")
          .on('click', function() {
            var OceaniamaxGDP = d3.max(datapoints, function(d) {
              if(d.Continent == 'Oceania') {return +d.GDP_per_capita}
              else
              {return 0}
            });
            console.log("oceania",OceaniamaxGDP )
            xPositionScale.domain([0, OceaniamaxGDP])
            svg.selectAll('circle')
              .transition()
              .duration(1500)
                  .style('opacity', function(d) {
                    if (d.Continent == 'Oceania') {return "1"}
                    else {return "0.1"}
                  })
             .attr("cx", function(d) {
                    return xPositionScale(d.GDP_per_capita)
                  })
             .attr("cy", function(d) {
                    return yPositionScale(d.life_expectancy)
                  })
            xPositionAxis.domain([0,OceaniamaxGDP])
            svg.selectAll(".x-axis")
                .transition()
                .duration(1500)
                .call(xAxis)
          d3.select(".small")
            .on('click', function() {
              svg.selectAll('circle')
              .transition()
              .duration(1500)
              .style('opacity', 0.1);
              svg.selectAll('.Oceania.small')
              .transition()
              .duration(1500)
              .style('opacity', 1);
            })
          d3.select(".large")
            .on('click', function() {
              svg.selectAll('circle')
              .transition()
              .duration(1500)
              .style('opacity', 0.1);
              svg.selectAll('.Oceania.large')
              .transition()
              .duration(1500)
              .style('opacity', 1);
              })
          })





        d3.select(".Asia")
          .on('click', function() {
            var AsiamaxGDP = d3.max(datapoints, function(d) {
              if(d.Continent == 'Asia') {return +d.GDP_per_capita}
              else
              {return 0}
            });
            console.log("Asia", AsiamaxGDP )
            xPositionScale.domain([0, AsiamaxGDP])
              svg.selectAll('circle')
              .transition()
              .duration(1500)
                 .style('opacity', function(d) {
                    if (d.Continent == 'Asia') {return "1"}
                    else {return "0.1"}
                   })
                .attr("cx", function(d) {
                          return xPositionScale(d.GDP_per_capita)
                        })
                .attr("cy", function(d) {
                          return yPositionScale(d.life_expectancy)
                        })
              xPositionAxis.domain([0,AsiamaxGDP])
              svg.selectAll(".x-axis")
              .transition()
              .duration(1500)
              .call(xAxis)

          d3.select(".small")
            .on('click', function() {
            svg.selectAll('circle')
            .transition()
            .duration(1500)
            .style('opacity', 0.1);
            svg.selectAll('.Asia.small')
            .transition()
            .duration(1500)
            .style('opacity', 1);
                })
            d3.select(".large")
              .on('click', function() {
              svg.selectAll('circle')
              .transition()
              .duration(1500)
              .style('opacity', 0.1);
              svg.selectAll('.Asia.large')
              .transition()
              .duration(1500)
              .style('opacity', 1);
                       })
                   })





        d3.select(".Europe")
          .on('click', function() {
            var EuropemaxGDP = d3.max(datapoints, function(d) {
              if(d.Continent == 'Europe') {return +d.GDP_per_capita}
              else
              {return 0}
            });
            console.log("Europe", EuropemaxGDP )
            xPositionScale.domain([0, EuropemaxGDP ])
              svg.selectAll('circle')
              .transition()
              .duration(1500)
               .style('opacity', function(d) {
                 if (d.Continent == 'Europe') {return "1"}
                 else {return "0.1"}
                 })
                .attr("cx", function(d) {
                           return xPositionScale(d.GDP_per_capita)
                         })
                .attr("cy", function(d) {
                           return yPositionScale(d.life_expectancy)
                         })
               xPositionAxis.domain([0,EuropemaxGDP])
               svg.selectAll(".x-axis")
               .transition()
               .duration(1500)
               .call(xAxis)

          d3.select(".small")
            .on('click', function() {
            svg.selectAll('circle')
            .transition()
            .duration(1500)
            .style('opacity', 0.1);
            svg.selectAll('.Europe.small')
            .transition()
            .duration(1500)
            .style('opacity', 1);
                })
          d3.select(".large")
            .on('click', function() {
            svg.selectAll('circle')
            .transition()
            .duration(1500)
            .style('opacity', 0.1);
            svg.selectAll('.Europe.large')
            .transition()
            .duration(1500)
            .style('opacity', 1);
                })
                 })




        d3.select(".S-america")
          .on('click', function() {
            var SamericamaxGDP = d3.max(datapoints, function(d) {
              if(d.Continent == 'S. America') {return +d.GDP_per_capita}
              else
              {return 0}
            });
            console.log("S America", SamericamaxGDP )
            xPositionScale.domain([0, SamericamaxGDP ])
              svg.selectAll('circle')
              .transition()
              .duration(1500)
                .style('opacity', function(d) {
                  if (d.Continent == 'S. America') {return "1"}
                  else {return "0.1"}
                          })
                .attr("cx", function(d) {
                      return xPositionScale(d.GDP_per_capita)
                                   })
                .attr("cy", function(d) {
                      return yPositionScale(d.life_expectancy)
                                   })
                xPositionAxis.domain([0,SamericamaxGDP ])
                svg.selectAll(".x-axis")
                .transition()
                .duration(1500)
                .call(xAxis)

          d3.select(".small")
            .on('click', function() {
            svg.selectAll('circle')
            .transition()
            .duration(1500)
            .style('opacity', 0.1);
            svg.selectAll('.S-America.small')
            .transition()
            .duration(1500)
            .style('opacity', 1);
                })
            d3.select(".large")
              .on('click', function() {
              svg.selectAll('circle')
              .transition()
              .duration(1500)
              .style('opacity', 0.1);
              svg.selectAll('.S-America.large')
              .transition()
              .duration(1500)
              .style('opacity', 1);
                })
                          })





        d3.select(".N-america")
          .on('click', function() {
            var NamericamaxGDP = d3.max(datapoints, function(d) {
              if(d.Continent == 'N. America') {return +d.GDP_per_capita}
              else
              {return 0}
            });
            console.log("N. America", NamericamaxGDP )
            xPositionScale.domain([0, NamericamaxGDP ])
              svg.selectAll('circle')
              .transition()
              .duration(1500)
              .style('opacity', function(d) {
                  if (d.Continent == 'N. America') {return "1"}
                  else {return "0.1"}
                    })

              .attr("cx", function(d) {
                return xPositionScale(d.GDP_per_capita)
                                       })
              .attr("cy", function(d) {
                return yPositionScale(d.life_expectancy)
                                       })
              xPositionAxis.domain([0,NamericamaxGDP ])
              svg.selectAll(".x-axis")
                 .transition()
                 .duration(1500)
                 .call(xAxis)
          d3.select(".small")
            .on('click', function() {
              svg.selectAll('circle')
              .transition()
              .duration(1500)
              .style('opacity', 0.1);
              svg.selectAll('.N-America.small')
              .transition()
              .duration(1500)
              .style('opacity', 1);
                    })
          d3.select(".large")
            .on('click', function() {
              svg.selectAll('circle')
              .transition()
              .duration(1500)
              .style('opacity', 0.1);
              svg.selectAll('.N-America.large')
              .transition()
              .duration(1500)
              .style('opacity', 1);
                    })
                    })



          d3.select(".All")
            .on('click', function() {
              var NewmaxGDP = d3.max(datapoints, function(d) {
                return +d.GDP_per_capita})

              xPositionScale.domain([0, NewmaxGDP ])
              console.log("MAX", NewmaxGDP )

              svg.selectAll('circle')
                  .transition()
                  .duration(1500)
                  .style('opacity', function(d) {
                  if (d.Continent != '') {return "1"}
                  else {return "0.1"}
                    })

                  .attr("cx", function(d) {
                    return xPositionScale(d.GDP_per_capita)
                                                   })
                  .attr("cy", function(d) {
                      return yPositionScale(d.life_expectancy)
                                                   })
                    xPositionAxis.domain([0,NewmaxGDP ])
                    svg.selectAll(".x-axis")
                        .transition()
                        .duration(1500)
                        .call(xAxis)

            d3.select(".small")
              .on('click', function() {
                svg.selectAll('circle')
                .transition()
                .duration(1500)
                .style('opacity', 0.1);
                svg.selectAll('.small')
                .transition()
                .duration(1500)
                .style('opacity', 1);
                                })
            d3.select(".large")
               .on('click', function() {
                svg.selectAll('circle')
                .transition()
                .duration(1500)
                .style('opacity', 0.1);
                svg.selectAll('.large')
                .transition()
                .duration(1500)
                .style('opacity', 1);
                      })
                      })


      //  d3.select(".All")
      //    .on('click', function() {
      //     var NewmaxGDP = d3.max(datapoints, function(d) {
      //     return +d.GDP_per_capita});
      //     console.log("ALL", NewmaxGDP )
      //     xPositionScale.domain([0, NewmaxGDP])
      //     svg.selectAll('circle')
      //         .transition()
      //         .duration()
      //         .style('opacity', "1")
      //
      //         .attr("cx", function(d) {
      //             return xPositionScale(+d.GDP_per_capita)
      //                                    })
      //         .attr("cy", function(d) {
      //            return yPositionScale(+d.life_expectancy)
      //                                    })
      //     xPositionAxis.domain([0, NewmaxGDP])
      //           svg.selectAll(".x-axis")
      //              .transition()
      //              .duration(1500)
      //              .call(xAxis)
      // d3.select(".small")
      //   .on('click', function() {
      //       svg.selectAll('circle')
      //           .style('opacity', function(d) {
      //             if (d.Population < 5000000) {return "1"}
      //             else {return "0.1"}
      //             })
      //             })
      //
      // d3.select(".large")
      //   .on('click', function() {
      //       svg.selectAll('circle')
      //           .style('opacity', function(d) {
      //           if (d.Population >= 5000000) {return "1"}
      //           else {return "0.1"}})
      //                         })
      //   })


    var xAxis = d3.axisBottom(xPositionAxis);
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + (height) + ")")
      .call(xAxis);

    var yAxis = d3.axisLeft(yPositionAxis);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

    }
})();
