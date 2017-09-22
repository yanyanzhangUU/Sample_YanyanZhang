/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {

        d3.select("#map").selectAll(".host").classed("host",false);
        d3.select("#map").selectAll(".team").classed("team",false);
        d3.select("#points").selectAll("circle").remove();
    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        // Add a marker for the winner and runner up to the map.
        // Select the host country and change it's color accordingly.

        d3.select("#"+worldcupData.host_country_code).classed("host",true);//.style("fill","red");

        // Iterate through all participating teams and change their color as well.
        worldcupData.teams_iso.forEach(function (team) {
            d3.select("#"+team).classed("team",true);
        });

        // Add a marker for gold/silver medalists
        d3.select("#points").append("circle").classed('gold',true)
            .attr("cx",this.projection(worldcupData.win_pos)[0])
            .attr("cy",this.projection(worldcupData.win_pos)[1]).attr("r",10);

        d3.select("#points").append("circle").classed('silver',true)
            .attr("cx",this.projection(worldcupData.ru_pos)[0])
            .attr("cy",this.projection(worldcupData.ru_pos)[1]).attr("r",10);

    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {

        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)
        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map
        let mapEle=d3.select("#map");
        let projection=this.projection;
        let path=d3.geoPath().projection(projection);

        //define tooltip
        // let tooltip = d3.select("body")
        //     .append("div")
        //     .style("position", "absolute")
        //     .style("z-index", "10")
        //     .style("visibility", "hidden");
        //
        // tooltip.append("text")
        //     .attr("x", 30)
        //     .attr("dy", "1.2em")
        //     .style("text-anchor", "middle")
        //     .attr("font-size", "12px")
        //     .attr("font-weight", "bold");

        d3.json("data/world.json",function (json) {
            //console.log("json display: ", json);
            d3.select("#map").selectAll("path")
                .data(topojson.feature(json,json.objects.countries).features)
                .enter()
                .append("path")
                .attr("d",path)
                .attr("id",d=>d.id)
                .classed("countries",true)
                .on("click",function (d) {
                    //let cntryInfo=d3.select("#cntryInfo");
                    let cntry=countryNames[d.id];
                    if (countryNames.hasOwnProperty(d.id)) {
                        d3.select("#cntry").text(cntry);
                    } else {
                        d3.select("#cntry").text("N/A");
                    }

                    if (attendedList.hasOwnProperty(cntry)) {
                        d3.select('#attended').text(" ");
                        let attend=d3.select('#attended').selectAll("li").data(attendedList[cntry]);
                        let new_attend=attend.enter().append("li");
                        attend.exit().remove();
                        attend=attend.merge(new_attend);
                        attend.text(d=>d);
                    } else {
                        d3.select('#attended').text("No world cup attended");
                    }
                    if (goldList.hasOwnProperty(cntry)) {
                        d3.select('#winnerOf').text(" ");
                        let gold=d3.select('#winnerOf').selectAll("li").data(goldList[cntry]);
                        let new_gold=gold.enter().append("li");
                        gold.exit().remove();
                        gold=gold.merge(new_gold);
                        gold.text(d=>d);
                    } else {
                        d3.select('#winnerOf').text("N/A");
                    }
                    if (silverList.hasOwnProperty(cntry)) {
                        //d3.select('#runnerupOf').selectAll("text").remove();
                        d3.select('#runnerupOf').text(" ");
                        let silver=d3.select('#runnerupOf').selectAll("li").data(silverList[cntry]);
                        let new_silver=silver.enter().append("li");
                        silver.exit().remove();
                        silver=silver.merge(new_silver);
                        silver.text(d=>d);
                    } else {
                        d3.select('#runnerupOf').text("N/A");
                    }

                });

                // //display country information in a tooltip
                // .on("click",function (d) {
                //     console.log("click the map! "+d.id);
                //     let cntry=countryNames[d.id];
                //     console.log("the name: "+cntry);
                //     if (attendedList.hasOwnProperty(cntry) && goldList.hasOwnProperty(cntry) && silverList.hasOwnProperty(cntry))
                //         return tooltip.style("visibility","visible")
                //             .text("COUNTRY: "+ countryNames[d.id]+"; ATTENDED: "+attendedList[cntry]
                //             +"; WINNERS OF: "+goldList[cntry]+"; RUNNER UPS OF: "+silverList[cntry])
                //             .style("top",(event.pageY-10)+"px").style("left",(event.pageX+10)+"px");  //if all 3 lists has cntry as a key
                //         //.append("text").text("only a test");
                //     else if (attendedList.hasOwnProperty(cntry) && goldList.hasOwnProperty(cntry))
                //         return tooltip.style("visibility","visible")
                //             .text("COUNTRY: "+ countryNames[d.id]+"; ATTENDED: "+attendedList[cntry]
                //                 +"; WINNERS OF: "+goldList[cntry])
                //             .style("top",(event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                //     else if (attendedList.hasOwnProperty(cntry)  && silverList.hasOwnProperty(cntry))
                //         return tooltip.style("visibility","visible")
                //             .text("COUNTRY: "+ countryNames[d.id]+"; ATTENDED: "+attendedList[cntry]
                //                 +"; RUNNER UPS OF: "+silverList[cntry])
                //             .style("top",(event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                //     else if (attendedList.hasOwnProperty(cntry))
                //         return tooltip.style("visibility","visible")
                //             .text("COUNTRY: "+ countryNames[d.id]+"; ATTENDED: "+attendedList[cntry] )
                //             .style("top",(event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                //     else
                //         return tooltip.style("visibility","visible")
                //             .text("NO world cups attended")
                //             .style("top",(event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                //
                // })
                // .on("mouseout", function(){
                //     //d3.select(this).style("fill","steelblue");
                //     return tooltip.style("visibility", "hidden");});

            let graticule=d3.geoGraticule();
            //console.log("grat: ",graticule);
            d3.select("#map").append("path").datum(graticule)
                .attr("class","grat").attr("d",path).attr("fill","none");
        })

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

    }


}
