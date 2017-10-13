/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice(); //

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = d3.scaleLinear()
            .domain([0,d3.max(this.teamData,d=>d.value[this.goalsMadeHeader])])
            .range([0,2*this.cell.width]).nice();

        /** Used for games/wins/losses*/
        this.gameScale = d3.scaleLinear()
            .domain([0,d3.max(this.teamData,d=>d.value.TotalGames)])
            .range([0,this.cell.width]).nice();

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale =
            d3.scaleLinear()
            .domain([Math.min(d3.min(this.teamData,d=>d.value.Wins),d3.min(this.teamData,d=>d.value.Losses)),
                d3.max(this.teamData,d=>d.value.TotalGames)])
            .range(['#ece2f0', '#016450']);
        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = function (d) {
            if (d<0) {
                return '#cb181d';
            } else if (d>0) {
                return '#034e7b';
            } else {
                return '#dbdbdb';
            }

        };
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains

        // Create the x axes for the goalScale.
        let GoalAxis=d3.axisTop(this.goalScale);

        //add GoalAxis to header of col 1.
        d3.select("#goalHeader")
            .append("svg").attr("width",2*(this.cell.width+this.cell.buffer)).attr("height",this.cell.height)
            .append("g")
            .attr("transform","translate("+this.cell.buffer+","+0.8*this.cell.height+")")
            .call(GoalAxis);
        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers
        let that=this;
        // sort the column in the decreasing order
        function decrColumn(header) {
            that.tableElements=that.tableElements.sort(function (a,b) {
                if (a.value[header]<b.value[header]) {
                    return 1;
                } else if (a.value[header]>b.value[header]) {
                    return -1;
                } else {
                    return 0;
                }
            });
            that.updateTable();
        }
        //sort the column in the increasing order
        function incrColumn(header) {    //"key" and others??
            console.log("header! ",header);
            that.tableElements=that.tableElements.sort(function (a,b) {
                if (a.value[header]>b.value[header]) {
                    return 1;
                } else if (a.value[header]<b.value[header]) {
                    return -1;
                } else {
                    return 0;
                }
            });
            that.updateTable();
        }

        //check whether a column is in the decreasing order
        function checkDecr(header) {
            for (let i=0;i<that.tableElements.length-1;i++) {
                if (that.tableElements[i].value[header]<that.tableElements[i+1].value[header]) {
                    return false;
                }
            }
            return true;
        }
        
        // Clicking on headers should also trigger collapseList() and updateTable().
        d3.select("thead").select("tr").select("th")
            .on("click", function (d,i) {
                that.collapseList();
                if (that.tableElements[0].key==="Uruguay") {
                    that.tableElements=that.tableElements.sort(function (a,b) {
                        if (a.key>b.key) {
                            return 1;
                        } else if (a.key<b.key) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                } else {
                    that.tableElements=that.tableElements.sort(function (a,b) {
                        if (a.key<b.key) {
                            return 1;
                        } else if (a.key>b.key) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                }

                that.updateTable();
            });

        let headers=d3.select("thead").select("tr").selectAll("td");
        headers.on("click", function (d,i) {
            that.collapseList();
            let headerText=d3.select(this).text();
            if (i===0) {
                headerText="Delta Goals";
            } else if (i===4) {
                headerText="TotalGames";
            }
            if (i===1) {
                if (that.tableElements[0].value.Result.ranking===7) {
                    that.tableElements=that.tableElements.sort(function (a,b) {
                        if (a.value.Result.ranking>b.value.Result.ranking) {
                            return 1;
                        } else if (a.value.Result.ranking<b.value.Result.ranking) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                } else {
                    that.tableElements=that.tableElements.sort(function (a,b) {
                        if (a.value.Result.ranking<b.value.Result.ranking) {
                            return 1;
                        } else if (a.value.Result.ranking>b.value.Result.ranking) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                }

                that.updateTable();
            } else {
                if (checkDecr(headerText)) {
                    incrColumn(headerText);
                } else {
                    decrColumn(headerText);
                }
            }

        });
       
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows

        let that=this;
        // d3.select("tbody").selectAll("tr").remove();

        console.log("tableElements --- ",this.tableElements);
        let tr=d3.select("tbody").selectAll("tr")
            .data(this.tableElements);

        let trEnter=tr.enter().append("tr");
        tr.exit().remove();

        //Append th elements for the Team Names
        trEnter.append("th");
        tr=tr.merge(trEnter);

        tr.select("th")
            .text(d=>  d.value.type==="aggregate" ? d.key: "x"+d.key)
            .attr("class",d=>d.value.type);

        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        //Add scores as title property to appear on hover
        //Populate cells (do one type of cell at a time )
        //Create diagrams in the goals column
        //Set the color of all games that tied to light gray

        let td=tr.selectAll("td")
            .data(d=>[{"type": d.value.type,"vis":"goals",
                            value: {"Goals Made":d.value[this.goalsMadeHeader],"Goals Conceded": d.value[this.goalsConcededHeader]}},
                    {"type":  d.value.type,"vis":"text",value: {"label":d.value.Result.label}},
                    {"type":  d.value.type,"vis":"barW",value: {"Wins":d.value.Wins}},
                {"type":  d.value.type,"vis":"barL",value: {"Losses":d.value.Losses}},
                {"type":  d.value.type,"vis":"barT",value: {"TotalGames":d.value.TotalGames}}]);
        let tdEnter=td.enter().append("td");
        td.exit().remove();
        let svgEnter=tdEnter.filter(d=> d.vis==="goals")   //enter/append have to be in front fo filter ???
            .append("svg").attr("width",2*(this.cell.width+this.cell.buffer)).attr("height",this.cell.height)
            .attr("transform","translate(-5,0)");
        let textEnter=tdEnter.filter(d=> d.vis==="text").append("text")
            .style("min-width","170px");  //(2*(that.cell.buffer+that.cell.width)).toString()??
        let winEnter=tdEnter.filter(d=> d.vis==="barW")
            .append("svg").attr("width",this.cell.width+this.cell.buffer).attr("height",this.cell.height)
            .attr("transform","translate(-5,0)");
        let lossEnter=tdEnter.filter(d=> d.vis==="barL")
            .append("svg").attr("width",this.cell.width+this.cell.buffer).attr("height",this.cell.height)
            .attr("transform","translate(-5,0)");
        let totalEnter=tdEnter.filter(d=> d.vis==="barT")
            .append("svg").attr("width",this.cell.width+this.cell.buffer).attr("height",this.cell.height)
            .attr("transform","translate(-5,0)");
        td=tdEnter.merge(td);

        svgEnter.append("rect");
        td.filter(d=> d.vis==="goals").select("rect")
            .attr("x",d=>this.cell.buffer+this.goalScale(Math.min(d.value[this.goalsMadeHeader],d.value[this.goalsConcededHeader])))
            .attr("y",d=> d.type==="aggregate" ? 0.2*this.cell.height: 0.4*this.cell.height)
            .attr("width",d=>Math.abs(this.goalScale(d.value[this.goalsMadeHeader])-this.goalScale(d.value[this.goalsConcededHeader])))
            .attr("height",d=> d.type==="aggregate" ? 0.6*this.bar.height: 0.2*this.bar.height)
            .style("fill",d=>this.goalColorScale(d.value[this.goalsMadeHeader]-d.value[this.goalsConcededHeader]))
            .classed("goalBar",true);
        svgEnter.append("circle").attr("class","red");
        td.filter(d=> d.vis==="goals").select(".red")
            .attr("cx",d=>this.cell.buffer+this.goalScale(d.value[this.goalsConcededHeader]))
            .attr("cy",10)
            .attr("class", function (d) {
                if (d.value[that.goalsMadeHeader] - d.value[that.goalsConcededHeader] === 0) {
                    return d.type === "aggregate" ? "red tieCircle goalCircle" : "red tieCircleGame goalCircle";
                } else {
                    return d.type === "aggregate" ? "red nodeCircle goalCircle" : "red nodeCircleGame goalCircle";
                }
            });
        svgEnter.append("circle").attr("class","blue");
        td.filter(d=> d.vis==="goals").select(".blue")
            .attr("cx",d=>this.cell.buffer+this.goalScale(d.value[this.goalsMadeHeader]))
            .attr("cy",10)
            .attr("class", function (d) {
                if (d.value[that.goalsMadeHeader] - d.value[that.goalsConcededHeader] === 0) {
                    return d.type === "aggregate" ? "blue tieCircle goalCircle" : "blue tieCircleGame goalCircle";
                } else {
                    return d.type==="aggregate" ? "blue winnerCircle goalCircle":"blue winnerCircleGame goalCircle";
                }
            });

        td.filter(d=> d.vis==="text").select("text")
            .text(d=>d.value.label);

        winEnter.append("rect");
        td.filter(d=> d.vis==="barW").select("rect")
            .attr("x",0)
            .attr("y",0)
            .attr("width",d=> d.type==="aggregate" ? this.gameScale(d.value.Wins):0)
            .attr("height",this.bar.height)
            .style("fill",d=>this.aggregateColorScale(d.value.Wins));
        winEnter.append("text");
        td.filter(d=> d.vis==="barW").select("text")
            .attr("x",d=> d.type==="aggregate" ? this.gameScale(d.value.Wins)-10:0)
            .attr("y",0.8*this.cell.height)
            .text(d=> d.value.Wins)
            .classed("label",true);

        lossEnter.append("rect");
        td.filter(d=> d.vis==="barL").select("rect")
            .attr("x",0)
            .attr("y",0)
            .attr("width",d=>d.type==="aggregate" ? this.gameScale(d.value.Losses): 0)
            .attr("height",this.bar.height)
            .style("fill",d=>this.aggregateColorScale(d.value.Losses));
        lossEnter.append("text");
        td.filter(d=> d.vis==="barL").select("text")
            .attr("x",d=> d.type==="aggregate" ? this.gameScale(d.value.Losses)-10:0)
            .attr("y",0.8*this.cell.height)
            .text(d=>d.value.Losses)
            .classed("label",true);

        totalEnter.append("rect");
        td.filter(d=> d.vis==="barT").select("rect")
            .attr("x",0)
            .attr("y",0)
            .attr("width",d=>d.type==="aggregate" ? this.gameScale(d.value.TotalGames):0)
            .attr("height",this.bar.height)
            .style("fill",d=>this.aggregateColorScale(d.value.TotalGames));
        totalEnter.append("text");
        td.filter(d=> d.vis==="barT").select("text")
            .attr("x",d=>d.type==="aggregate" ? this.gameScale(d.value.TotalGames)-10:0)
            .attr("y",0.8*this.cell.height)
            .text(d=>d.value.TotalGames)
            .classed("label",true);

        tr.on("click",function (d,i) {
            that.updateList(i);
            that.updateTable();
        });
        tr.on("mouseover",function (d) {
            that.tree.updateTree(d);
        })
            .on("mouseout",function (d) {
                that.tree.clearTree();
            });

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       // console.log("table ?? ",this.tableElements);
       // console.log("i= ",i,"the ith element: ",this.tableElements[i]);
        //Only update list for aggregate clicks, not game clicks
        let iRow=this.tableElements[i];
        if (iRow.value.type==="aggregate") {
            let gameList=iRow.value.games;
            if (this.tableElements.length===i+1 || this.tableElements[i+1].value.type==="aggregate") {
                for (let j=0;j<gameList.length;j++) {
                    this.tableElements.splice(i+1+j,0,gameList[j]);
                }
            } else {
                this.tableElements.splice(i+1,gameList.length);
            }
        }
        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******
        let j=this.tableElements.length;
        let i=0;
        while (i<j) {
            if (this.tableElements[i].value.type==="game") {
                this.tableElements.splice(i,1);
                i-=1;
                j-=1;
            }
            i+=1;
        }
    }


}
