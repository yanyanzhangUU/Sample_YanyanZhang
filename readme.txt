On the output page, there are two parts:

-----------------------------------------------------------------------------
The first part is a tree created based on the data given in data/Tree.json.

-----------------------------------------------------------------------------
In the top left of the second part, there is a button called Staircase. By clicking it, the first bar chart is replaced by a staircase.

Next is a select menu. When one option is selected, the corresponding data in data/*.csv are used to draw the charts. If you hover your mouse over a bar in the bar charts, the bar will change color and its x and y coordiates will show up in a tooltip. If you click a dot in the scatterplot, its x and y coordiates will be logged to the console.

The last is a check box. When it is unchecked, all data are shown. When it is checked, a random subset of data are shown.

Additionally, sizes of all charts are adjusted so that each chart fits nicely into its own display block based on data. Another extra thing is that transition of the bar charts and the scatterplot from a previous status to a new status is set to be finished in 3 seconds.