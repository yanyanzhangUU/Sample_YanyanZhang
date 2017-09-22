/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {

        var data=this.allData.sort(function (a,b) {
            if (a.year>b.year)
                return 1;
            else if (a.year<b.year)
                return -1;
            else
                return 0;
        });
        // ******* TODO: PART I *******
        //console.log("the attribute: ",selectedDimension)

        // Create the x and y scales; make
        // sure to leave room for the axes
        let margin = {top: 20, right: 30, bottom: 30, left: 40};
        let width = 500 - margin.left - margin.right;
        let height = 300 - margin.top - margin.bottom;

        let textWidth = 50;
        let xScale=d3.scaleBand()
            .domain(data.map(d=>d.year))
            .range([textWidth,width]).padding(0.05);
        let yScale = d3.scaleLinear()
            .domain([0,d3.max(data,d=>d[selectedDimension])])   //??? selectedDimension
            .range([height,margin.top])
            .nice();

        // Create colorScale

        let colorScale=d3.scaleLinear()
            .domain([d3.min(data,d=>d[selectedDimension]),d3.max(data,d=>d[selectedDimension])])
            .range(["blue","darkblue"]);

        // Create the axes (hint: use #xAxis and #yAxis)
        let xAxis=d3.axisBottom();
        xAxis.scale(xScale);
        let selection=d3.select('#xAxis')
                    .classed("axis",true)
            .attr("transform","translate("+0+","+(height+margin.bottom)+")")
            .attr("id","xAxis text")
            .call(xAxis)
            .selectAll('text')
            .attr("y", -5)
            .attr("x", -20)
            //.attr("dy", ".35em")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle");

        let yAxis=d3.axisLeft();
        yAxis.scale(yScale);
        let selecty=d3.select("#yAxis");
        selecty.selectAll(".axis").style("opacity", 1)
            .transition()
            .duration(3000)
            .style("opacity", 0).remove();
        selecty.append("g").classed("axis",true)
            .transition()
            .duration(3000)
            .attr("transform","translate("+(margin.left+9)+","+margin.bottom+")")
            .attr("id","yAxis text")
            .call(yAxis);

        // Create the bars (hint: use #bars)

        let bars=d3.select('#bars').selectAll("rect")
            .data(data);
        let newbars=bars.enter().append("rect")
            .attr('x',d=>xScale(d.year))
            .attr('y',d=>yScale(d[selectedDimension])+margin.bottom)
            .attr('width',xScale.bandwidth())
            .attr('height',d=>300-margin.bottom-margin.top-yScale(d[selectedDimension]))
            .style("opacity", 0)
            .style('fill',d=>colorScale(d[selectedDimension]));
        bars.exit()
            .style("opacity", 1)
            .transition()
            .duration(3000)
            .style("opacity", 0)
            .remove();
        bars=newbars.merge(bars);
        bars.transition()
            .duration(2000)
            .attr('x',d=>xScale(d.year))
            .attr('y',d=>yScale(d[selectedDimension])+margin.bottom)
            .attr('width',xScale.bandwidth())
            .attr('height',d=>300-margin.bottom-margin.top-yScale(d[selectedDimension]))
            .style('fill',d=>colorScale(d[selectedDimension]))
            .style("opacity", 1);

        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

        bars.on("click",function (d) {
            d3.select(".selected").classed("selected",false);
            d3.select(this).classed("selected",true);
            //d3.select(this).style("fill","red");
            let info=new InfoPanel();
            //this.infoPanel.updateInfo(d);
            info.updateInfo(d);
            let map=new Map();
            map.updateMap(d);
            });

    }
}