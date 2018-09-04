$().ready(main);


function main(){
    var h = $('html').height();
    $('#ymapid').height(h);
    $(window).resize(function() {
        $('#ymapid').css({ height: h+'px'});
    });
    

    ymaps.ready(function  () {
        var myMap = new ymaps.Map('ymapid', {
                        center: [55.798227, 37.713063],
                        zoom: 16,
                        behaviors: ["scrollZoom","drag"],
                        controls: []
                    });

    var offenceArray = [];
    var offenceCollection = new ymaps.GeoObjectCollection();
  
    var ItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '<h2 class="ballon_header {{properties.color}}">{{ properties.balloonContentHeader|raw }}</h2>' +
        '<div class="ballon_body {{properties.color}}">{{ properties.balloonContentBody|raw }}</div>'
    );

    var gridSize = 128;
    // var presets = ['islands#redCircleDotIcon', 'islands#blueCircleDotIcon', 'islands#orangeCircleDotIcon', 'islands#darkGreenCircleDotIcon'];
    var presets = ['red', 'blue', 'orange', 'darkGreen'];
    ymaps.modules.require(['PieChartClusterer'], function (PieChartClusterer) {
        var myClusterer = new PieChartClusterer({ 
            // margin: 0,
            // viewportMargin: 0,
            // minClusterSize: 3,
            gridSize: gridSize, 
            clusterDisableClickZoom: true, 
            clusterBalloonLeftColumnWidth: 150,
            clusterBalloonItemContentLayout: ItemContentLayout,       
            clusterBalloonContentLayoutWidth: 400
        });
        var ClusterGridSizeChanger = addClusterGridSizeChanger(myMap, gridSize, myClusterer);
        // console.log(ClusterGridSizeChanger);
        myMap.controls.add(ClusterGridSizeChanger, {float: 'right'});
        // var myClusterer = new PieChartClusterer();
        // var url = 'http://xn--b1algahcegbed6a6gqb.xn--p1ai/data/map.json';
        // var url = 'data/multi_3.json';
        var url = 'data/map.json';
        // $.getJSON('data/map.json', function() {
        $.ajax({
            async: false,
            // type: 'GET',
            // crossDomain: true,
            url: url,
            dataType: 'json'})
            .done(function(data) {
                console.log(data.length);
                for (var i = 0; i < data.length; i++) {
                // for (var i = 0; i < 20; i++) {
                    var image = 'img/marker-red.png';
                    var presetID = 0;
                    var ttype = ' (3.27,3.28)';
                    switch (data[i].type) {
                        case 1:
                            image = 'img/marker-red.png';
                            presetID = 0;
                            ttype = ' (3.27,3.28)';
                        case 2:
                            image = 'img/marker-red.png';
                            presetID = 0;
                            ttype = ' (3.27,3.28)';
                        case 3:
                            image = 'img/marker-red.png';
                            presetID = 0;
                            ttype = ' (3.27,3.28)';
                            break;
                        case 4:
                            image = 'img/marker-blue.png';
                            presetID = 1;
                            ttype = ' (П.парковка)';
                            break;
                        case 5:
                            image = 'img/marker-orange.png';
                            presetID = 2;
                            ttype = ' (Тротуар)';
                        case 6:
                            image = 'img/marker-orange.png';
                            presetID = 2;
                            ttype = ' (Зебра)';
                            break;
                        case 7:
                            image = 'img/marker-green.png';
                            presetID = 3;
                            ttype = ' (Газон)';
                            break;
                        default:
                            image = 'img/marker-red.png';
                            presetID = 0;
                            ttype = ' (3.27,3.28)';
                    }
                    // var cord = { lat: data[i].coords[0], lng: data[i].coords[1] }
                    var preset = 'islands#'+presets[presetID]+'CircleDotIcon';
                    var properties = {
                        balloonContentBody: data[i].coords,
                        balloonContentHeader: data[i].date + ttype,
                        color: presets[presetID],
                    };
                    var options = {preset: preset};
                    // var options = {
                                // iconLayout: 'default#image',
                                // iconImageHref: image,
                                // iconImageSize: [9, 9],
                                // iconImageOffset: [0, 0]
                    // };
                    var marker = new ymaps.Placemark(data[i].coords, properties, options);
                    // console.log(preset);
                    offenceArray.push(marker);
                    offenceCollection.add(marker);
                } // end for
                // console.log(offenceCollection);
                myClusterer.add(offenceArray);
            }); // end getJSON
        // myMap.geoObjects.add(offenceCollection);
        myMap.geoObjects.add(myClusterer);
        }); // end pie require
    

    
    }); // end ymaps
}