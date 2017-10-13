/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******

        //Create a tree and give it a size() of 800 by 300. 
        let treemap=d3.tree().size([800,400]);

        //Create a root for the tree using d3.stratify();
        let root=d3.stratify()
            .id((d,i)=>i)
            .parentId(d=>d.ParentGame)   //ParentGame is from ...
            (treeData);
        
        //Add nodes and links to the tree. 
        let nodes=d3.hierarchy(root,d=>d.children);
        nodes=treemap(nodes);
        let xshift=80;
        let links=d3.select("#tree").selectAll(".linkf")
            .data(nodes.descendants().slice(1))
            .enter().append("path")
            .attr("d",d=> ("M" + (d.y+xshift) + "," + d.x
                + "C" + (d.y + d.parent.y+xshift) / 2 + "," + d.x
                + " " + (d.y + d.parent.y+xshift) / 2 + "," + d.parent.x
                + " " + (d.parent.y+xshift) + "," + d.parent.x))
            .attr("class",function (d) {
                return d.data.data.Team === d.parent.data.data.Team ?
                    "linkf "+ d.data.data.Team + " "+d.data.data.Team+d.data.data.Opponent:
                    "linkf "+d.data.data.Team+d.parent.data.data.Team;
            });
        let node=d3.select("#tree").selectAll(".node")
            .data(nodes.descendants())
            .enter().append("g")
            .attr("transform", function(d) {
                return "translate(" + (d.y+xshift) + "," + d.x + ")"; });  //?? to check

        node.append("circle").attr("r",5)
            .attr("class",function (d) {
                return d.data.data.Wins==="1"? "winnerCircle":"nodeCircle";
            });
        node.append("text")
            .attr("dy", ".35em")
            .attr("x", function(d) { return d.children ? -13 : 13; })
            .style("text-anchor", function(d) {
                return d.children ? "end" : "start"; })
            .text(function(d) { return d.data.data.Team; })
            .attr("class",d=>d.data.data.Team+"Text"+" "+d.data.data.Team+d.data.data.Opponent+"Text");
    };


    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        this.clearTree();
        // console.log("the highlighted ", row.value.type, row.key, row);
        if (row.value.type==="aggregate") {
            d3.selectAll("."+row.key).classed("selectedf",true);
            d3.selectAll("."+row.key+"Text").classed("selectedLabel",true);
        } else {
            d3.selectAll("."+row.key+row.value.Opponent).classed("selectedf",true);
            d3.selectAll("."+row.value.Opponent+row.key).classed("selectedf",true);
            d3.selectAll("."+row.key+row.value.Opponent+"Text").classed("selectedLabel",true);
            d3.selectAll("."+row.value.Opponent+row.key+"Text").classed("selectedLabel",true);
        }
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******
        d3.select("#tree").selectAll(".selectedf").classed("selectedf",false);
        d3.select("#tree").selectAll(".selectedLabel").classed("selectedLabel",false);
        // You only need two lines of code for this! No loops! 
    }
}
