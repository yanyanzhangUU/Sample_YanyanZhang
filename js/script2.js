/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {

    console.log('the staircase')
    let xbars=document.getElementById('xbarChart')
    let childList=xbars.children;
    console.log(childList)
    for (let i=0;i<childList.length;i++) {
        childList[i].setAttribute('height',(10*i).toString());
    }
}

/**
 * Render the visualizations
 * @param error
 * @param data
 */
function update(error, data) {
    if (error !== null) {
        alert('Could not load the dataset!');
    } else {
        for (let d of data) {
            d.a = +d.a;
            d.b = +d.b;
        }
    }

    // Set up the scales
    let aScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.a)])
        .range([0, 150]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 150]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);

    let tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    tooltip.append("text")
        .attr("x", 30)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");


    let xbars=d3.select('#xbarChart')
                .selectAll('rect')
                .data(data);
    let newxbars=xbars.enter().append("rect").attr("x",function (d,i) {
                    return iScale(i);
                })
                .attr("y",0)
                .attr("width",10)
                .attr("height",d=>aScale(d.a))
                .style("opacity", 0)
                .classed("bars", true);
    xbars.exit()
        .style("opacity", 1)
        .transition()
        .duration(3000)
        .style("opacity", 0)
        .remove();

    xbars=newxbars.merge(xbars);
    xbars.on("mouseover",function (d,i) {
            d3.select(this).style("fill","green");
            return tooltip.style("visibility","visible").text("x: "+ i.toString()+", y: "+(d.a).toString()).style("top",(event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){
            d3.select(this).style("fill","steelblue");
            return tooltip.style("visibility", "hidden");})
        .transition()
        .duration(3000)
        .attr("x",function (d,i) {
            return iScale(i);
        })
        .attr("y",0)
        .attr("width",10)
        .attr("height",d=>aScale(d.a))
        .style("fill", "steelblue")
        .style("opacity", 1);

    let ybars=d3.select('#ybarChart')
        .selectAll('rect')
        .data(data);
    let newybars=ybars.enter().append("rect").attr("x",function (d,i) {
            return iScale(i);
        })
        .attr("y",0)
        .attr("width",10)
        .attr("height",function (d) {
            return bScale(d.b);
        })
        .style("opacity", 0)
        .classed("bars", true);

    ybars.exit()
        .style("opacity", 1)
        .transition()
        .duration(3000)
        .style("opacity", 0)
        .remove();

    ybars=newybars.merge(ybars);

    ybars.on("mouseover",function (d,i) {
        d3.select(this).style("fill","red");
        return tooltip.style("visibility","visible").text("x: "+ d.a.toString()+", y: "+(d.b).toString()).style("top",(event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){
            d3.select(this).style("fill","steelblue");
            return tooltip.style("visibility", "hidden");})
        .transition()
        .duration(3000)
        .attr("x",function (d,i) {
            return iScale(i);
        })
        .attr("y",0)
        .attr("width",10)
        .attr("height",function (d) {
            return bScale(d.b);
        })
        .style("fill", "steelblue")
        .style("opacity", 1);

    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));
    let xline=d3.select("#xlineChart")
                .attr("d",aLineGenerator(data));

    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.b));
    let yline=d3.select("#ylineChart")
        .attr("d",bLineGenerator(data));

    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.a));
    let xarea=d3.select("#xareaChart")
        .attr("d",aAreaGenerator(data));

    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => bScale(d.b));
    let yarea=d3.select("#yareaChart")
        .attr("d",bAreaGenerator(data));

    let scatter=d3.select('#scatterplot')
        .selectAll('circle')
        .data(data);
    let newscatter=scatter.enter().append("circle").attr("cx",function (d) {
            return aScale(d.a);
        })
        .attr("cy",function (d) {
            return bScale(d.b);
        })
        .attr("r",5)
        .style("opacity",0)
        .classed("circles",true);
    scatter.exit()
        .style("opacity",1)
        .transition()
        .duration(3000)
        .style("opacity",0)
        .remove();
    scatter=newscatter.merge(scatter);
    scatter.on("click",function (d) {
                            console.log("x: "+d.a.toString()+", y: "+d.b.toString());
                        })
        .transition()
        .duration(3000)
        .attr("cx",function (d) {
            return aScale(d.a);
        })
        .attr("cy",function (d) {
            return bScale(d.b);
        })
        .attr("r",5)
        .style("fill","steelblue")
        .style("opacity",1);
}

/**
 * Load the file indicated by the select menu
 */
function changeData() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else {
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

/**
 *   Load the file indicated by the select menu, and then slice out a random chunk before passing the data to update()
 */
function randomSubset() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            let subset = [];
            for (let d of data) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            }
            update(error, subset);
        });
    }
    else {
        changeData();
    }
}