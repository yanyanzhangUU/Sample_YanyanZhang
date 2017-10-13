/** Class representing a Tree. */
class Tree {
	/**
	 * Creates a Tree Object
	 * parentNode, children, parentName,level,position
	 * @param {json[]} json - array of json object with name and parent fields
	 */

	constructor(json) {
		var tmpP=[];
        this.nodes=[];

		for (var i=0;i<json.length;i++) {
		    var currentNode=new Node(json[i].name,json[i].parent);
		    this.nodes.push(currentNode);
		    tmpP.push(json[i].name);
        }

        for (i=1;i<json.length;i++) {
            currentNode=this.nodes[i];
            currentNode.parentNode=this.nodes[tmpP.indexOf(currentNode.parentName)];
        }
	}

	/**
	 * Function that builds a tree from a list of nodes with parent refs
	 */
	buildTree() {
        for (var i=1;i<this.nodes.length;++i) {
            let currentNode=this.nodes[i];
           // console.log("current node -- "+currentNode.name+" parent name --- "+currentNode.parentNode.name);
            currentNode.parentNode.addChild(currentNode);
        }
        //Assign Positions and Levels by making calls to assignPosition() and assignLevel()
        this.assignLevel(this.nodes[0],0);
        this.assignPosition(this.nodes[0],0);
	}

	/**
	 * Recursive function that assign positions to each node
	 */
	assignPosition(node, position) {
        if (node!= null) {
            node.position=position;
            var child;
            for (child of node.children) {
                var l=child.level;
                var maxP=-1;
                for (var i=0;i<this.nodes.length;i++) {
                    var currentNode=this.nodes[i];
                    if (currentNode.level===l && currentNode.position>maxP) {
                        maxP=currentNode.position;
                    }
                }
                this.assignPosition(child,Math.max(child.parentNode.position,maxP+1));
            }
        }
	}

	/**
	 * Recursive function that assign levels to each node
	 */
	assignLevel(node, level) {
        if (node!= null) {
            node.level = level;
            var child;
            //console.log("assignLevel ");

            for (child of node.children) {
                //console.log("child"+child.name);
                this.assignLevel(child, level + 1);
            }
        }
    }

     /**   assignLevel(node) {  //this works too
        var lv=0;
        var nodeP=node;
        while (nodeP.parentName!="root") {
           nodeP=node.parentNode;
           lv+=1;
        }
        node.level=lv;
	}*/
	/**
	 * Function that renders the tree
	 */
	renderTree() {
        var svg=d3.select("svg");
        console.info(this.nodes);
        svg.selectAll("line")
            .data(this.nodes)
            .enter().append("line")
            .attr("x1",function (d) {
                if (d.parentNode!=null) {
                    return d.parentNode.level*250+150;
                } else {
                    return d.level*250+150;
                }
            })
            .attr("y1",function (d) {
                if (d.parentNode!=null) {
                    return d.parentNode.position*150+150;
                } else {
                    return d.position*150+150;
                }
            })
            .attr("x2",function (d) {
                return d.level*250+150;
            })
            .attr("y2",function (d) {
                return d.position*150+150;
            });

        svg.selectAll("circle")
            .data(this.nodes)
            .enter().append("circle")
            .attr("cx",function (d) {
                return d.level*250+150;
            })
            .attr("cy",function (d) {
                return d.position*150+150;
            })
            .attr("r",45);

        svg.selectAll("text")
            .data(this.nodes)
            .enter().append("text")
            .attr("x",function (d) {
                return d.level*250+150;
            })
            .attr("y",function (d) {
                return d.position*150+150;
            })
            .text(function (d) {
                return d.name;
            })
            .attr("class","label");
	}
		
}