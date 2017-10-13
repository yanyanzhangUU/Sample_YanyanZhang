
// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, allData) {
    allData.forEach(function (d) {
        // Convert numeric values to 'numbers'
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        // Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;
    });

    /* Create infoPanel, barChart and Map objects  */
    let infoPanel = new InfoPanel();
    let worldMap = new Map();

    /* DATA LOADING */
    //Load in json data to make map
    d3.json("data/world.json", function (error, world) {
        if (error) throw error;
        worldMap.drawMap(world);
    });

    // Define this as a global variable
    window.barChart = new BarChart(worldMap, infoPanel, allData);

    //create a list/array of country: attended world cups, a gold list, a silver list using allData
    window.countryNames={};
    window.attendedList={};
    window.goldList={};
    window.silverList={};   ///e.g. BRA <-> Brazil???
    var dataSorted=allData.sort(function (a,b) {
        if (a.year>b.year)
            return 1;
        else if (a.year<b.year)
            return -1;
        else
            return 0;
    });
    dataSorted.forEach(function (d) {
        //console.log("numbers of isos and teams: ",d.EDITION,", ####: ",d.teams_iso.length,d.teams_names.length);
        d.teams_names.forEach(function (dd) {
            if (attendedList.hasOwnProperty(dd)){
                attendedList[dd]=attendedList[dd]+", "+d.EDITION;}
            else {
                attendedList[dd]=d.EDITION;
                let idx=d.teams_names.indexOf(dd);
                //console.log("TEST!!! ", dd, d.teams_iso[idx]);
                countryNames[d.teams_iso[idx]]=dd;}
        });
        let winner=d.winner;
        let silver=d.runner_up;
        if (goldList.hasOwnProperty(winner))
           goldList[winner]=goldList[winner]+", "+d.EDITION;
        else
            goldList[winner]=d.EDITION;
        if (silverList.hasOwnProperty(silver))
            silverList[silver]=silverList[silver]+", "+d.EDITION;
        else
            silverList[silver]=d.EDITION;
    });
    for (let key in attendedList) {
        attendedList[key]=d3.csvParse(attendedList[key]).columns;
    }
    for (let key in goldList) {
        goldList[key]=d3.csvParse(goldList[key]).columns;
    }
    for (let key in silverList) {
        silverList[key]=d3.csvParse(silverList[key]).columns;
    }


    // Draw the Bar chart for the first time
    barChart.updateBarChart('attendance');
});

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {
    // ******* TODO: PART I *******
    // Changed the selected data when a user selects a different
    // menu item from the drop down.

    let active=d3.select("#datasetfr").node().value;
    //console.log("the selected: ",active);
    barChart.updateBarChart(active);
}
