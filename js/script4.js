    /**
     * Loads in the table information from fifa-matches.json 
     */
// d3.json('data/fifa-matches.json',function(error,data){
//
//     /**
//      * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
//      *
//      */
//     d3.csv("data/fifa-tree.csv", function (error, csvData) {
//
//         //Create a unique "id" field for each game
//         csvData.forEach(function (d, i) {
//             d.id = d.Team + d.Opponent + i;
//         });
//
//         //Create Tree Object
//         let tree = new Tree();
//         tree.createTree(csvData);
//
//         //Create Table Object and pass in reference to tree object (for hover linking)
//         let table = new Table(data,tree);
//
//         table.createTable();
//
//         table.updateTable();
//     });
// });



// // ********************** HACKER VERSION ***************************
/**
 * Loads in fifa-matches.csv file, aggregates the data into the correct format,
 * then calls the appropriate functions to create and populate the table.
 *
 */
d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

    function rankingTable(result) {
        if (result==="Group") {
            return 0;
        } else if (result==="Round of Sixteen") {
            return 1;
        }  else if (result==="Quarter Finals") {
            return 2;
        }  else if (result==="Semi Finals") {
            return 3;
        }  else if (result==="Fourth Place") {
            return 4;
        }  else if (result==="Third Place") {
            return 5;
        }  else if (result==="Runner-Up") {
            return 6;
        }  else if (result==="Winner") {
            return 7;
        }
    }

    function highestRank(leaves) {
        let ranking=0;
        let place="Group";
        leaves.forEach(function (d) {
            currentRanking =rankingTable(d.Result);
            if (currentRanking>ranking) {
                ranking=currentRanking;
                place=d.Result;
            }

        });
        return [place,ranking];
    }

    let teamData=d3.nest()
        .key(d=>d.Team)
        .rollup(function (leaves) {
            let placeRank=highestRank(leaves);
            let games=[];
            leaves.forEach(function (l,i) {
                games[i]={"key":l.Opponent,
                        "value": {"Goals Made":l["Goals Made"],
                            "Goals Conceded":l["Goals Conceded"],
                            "Delta Goals":[],
                            "Wins":[],
                            "Losses":[],
                            "Result":{"label":l.Result,"ranking":rankingTable(l.Result)},
                            "type":"game",
                            "Opponent":l.Team
                        }};
            });
            return {"Goals Made": d3.sum(leaves,l=>l["Goals Made"]),
                    "Goals Conceded": d3.sum(leaves,l=>l["Goals Conceded"]),
                    "Delta Goals":d3.sum(leaves,l=>l["Delta Goals"]),
                    "Wins": d3.sum(leaves,l=>l["Wins"]),
                    "Losses": d3.sum(leaves,l=>l["Losses"]),
                    "Result":{"label":placeRank[0],"ranking":placeRank[1]},
                    "TotalGames": leaves.length,
                    "type":"aggregate",
                    "games":games}
        })
        .entries(matchesCSV);
    console.log("teamData: ",teamData);

    /**
     * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
     *
     */
    d3.csv("data/fifa-tree.csv", function (error, treeCSV) {

    // ******* TODO: PART I *******
    //     Create a unique "id" field for each game
        treeCSV.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(treeCSV);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(teamData,tree);

        table.createTable();
        table.updateTable();

    });

});
// ********************** END HACKER VERSION ***************************
