function addClusterGridSizeChanger(myMap, gridSize, myClusterer) {
    var gridLayout = ymaps.templateLayoutFactory.createClass("<div style='margin-left: 40px'>" +
            "<div id='grid-in' class='btn'><i class='icon-plus'></i></div>" +
            "<div id='grid-out' class='btn'><i class='icon-minus'></i></div>" +
        "</div>", 
    {
        build: function () {
            gridLayout.superclass.build.call(this);
            this.gridInCallback = ymaps.util.bind(this.gridIn, this);
            this.gridOutCallback = ymaps.util.bind(this.gridOut, this);
            $('#grid-in').bind('click', this.gridInCallback);
            $('#grid-out').bind('click', this.gridOutCallback);
        },
        clear: function () {
            $('#grid-in').unbind('click', this.gridInCallback);
            $('#grid-out').unbind('click', this.gridOutCallback);
            gridLayout.superclass.clear.call(this);
        },
        gridIn: function () {
            // console.log('gridIn');
            // var map = this.getData().control.getMap();
            gridSize = gridSize/2;
            if (gridSize <= 32) {gridSize = 32;}
            myClusterer.options.set({gridSize: gridSize});                

        },
        gridOut: function () {
            // console.log('gridOut');
            // var map = this.getData().control.getMap();
            gridSize = gridSize*2;
            if (gridSize > 1024) {gridSize = 1024;}
            myClusterer.options.set({gridSize: gridSize});
        }
    }),
    gridControl = new ymaps.control.ZoomControl({options: {layout: gridLayout}});
    return gridControl;                       
}