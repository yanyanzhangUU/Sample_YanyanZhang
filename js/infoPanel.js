/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {

        // ******* TODO: PART III *******

        // Update the text elements in the infoBox to reflect:
        // World Cup Title, host, winner, runner_up, and all participating teams that year
        // let title=d3.select("#edition");
        // title.selectAll("text").remove();
        // title.append("text").text(oneWorldCup.EDITION);
        d3.select("#edition").text(oneWorldCup.EDITION);
        d3.select("#host").text(oneWorldCup.host);
        d3.select("#winner").text(oneWorldCup.winner);
        d3.select("#silver").text(oneWorldCup.runner_up);

        //let ul=d3.select("#teams");
        // d3.select("#teams").select("ul").selectAll("li").select("text").data().remove();
        // ul.append("ul");
        // ul.selectAll('li').data(oneWorldCup.teams_names).enter().append("li").text(String).classed("li",true);

        //d3.select("#teams").select("ul").data([1]).enter().append('ul');

        let myText=d3.select('#teams').selectAll("li").data(oneWorldCup.teams_names);
        let new_myText=myText.enter().append("li");
        myText.exit().remove();
        myText=myText.merge(new_myText);
        myText.text(d=>d);
        //console.log("the teams ----- ",oneWorldCup.teams_names);

        // Hint: For the list of teams, you can create an list element for each team.
        // Hint: Select the appropriate ids to update the text content.

        //Set Labels

    }

}