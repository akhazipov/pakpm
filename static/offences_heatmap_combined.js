// "use strict";

$().ready(main);


function main(){
    var h = $('html').height();
    $('#ymapid').height(h);
    $(window).resize(function() {
        $('#ymapid').css({ height: h+'px'});
    });
    

    ymaps.ready(['Heatmap']).then(function () {
        var myMap = new ymaps.Map('ymapid', {
                        center: [55.76, 37.64],
                        zoom: 11,
                        behaviors: ["scrollZoom","drag"],
                        controls: []
                    });
        
        var buttons = [];
        var types = ['3.27, 3.28', 'ПП', 'тротуар, пешеход', 'газон', 'всё']; 
        var offenceArrays = [];
        for (var i = 0; i < types.length; i++) offenceArrays.push([]);
        var type_map = {
            0:0,
            1:0, 2:0, 3:0,
            4:1,
            5:2, 6:2,
            7:3
        };        
        
        var url = 'data/map.json';
        $.ajax({
            async: false,
            url: url,
            dataType: 'json'})
        .done(function(data) {
            for (var i = 0; i < data.length; i++) {
            // for (var i = 0; i < 20; i++) {
                if (!type_map.hasOwnProperty(data[i].type)) {
                    data[i].type = 0;
                }
                var type_ID = type_map[data[i].type];
                offenceArrays[type_ID].push(data[i].coords);
                offenceArrays[types.length-1].push(data[i].coords);
            };
        });
        
        for (var i = 0; i < types.length; i++){
            console.log(i, offenceArrays[i].length);
        };
        
        // var hopts = {
            // radius: 9,
            // dissipating: false,
            // opacity: 0.8,
            // intensityOfMidpoint: 1.0
        // } 
        
        var heatmap = new ymaps.Heatmap(
            []
            // , hopts
        );
        
        heatmap.setMap(myMap);
        
        function makeListener(index) {
            return function listener() {
                var resultArray = [];
                var all_selected = false;
                if (index==types.length-1) all_selected = buttons[index].state.get('selected') 
                else buttons[types.length-1].state.set('selected', false);
                console.log('all_selected', all_selected, 'index', index);
                for (var i = 0; i < types.length-1; i++) {
                    // if (all_selected != 0) {
                        // console.log(i, all_selected, 'index', index);
                        // buttons[i].state.set('selected', all_selected);
                    // }
                    if (all_selected || buttons[i].state.get('selected') == true) {
                        resultArray = resultArray.concat(offenceArrays[i]);
                    }
                }
                console.log('heatmap.setData', index, resultArray.length);
                heatmap.setData(resultArray);
            };
        }
        
        for (var i = 0; i < types.length; i++) {            
            var button = new ymaps.control.Button({ data: {content: types[i]}, options: { maxWidth: 150}, state: {selected: false }});
            button.events.add(['select', 'deselect'], makeListener(i));
            buttons.push(button);
        }
        
        for (var i = 0; i < types.length; i++) {
            myMap.controls.add(buttons[types.length-i-1]);
        }
        
        function readURL(input) {
            // console.log(input);
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    console.log('loaded');
                    console.log(input.files[0]);
                    // onStationLoad(e.target.result);
                }
                reader.readAsText(input.files[0]);
            }
        }
        
        $( "#myForm" ).submit(function( event ) {
            event.preventDefault();
            console.log($("#myFile")[0]);
            readURL($("#myFile")[0]);
        });
        
        
    }); // end ymaps
}