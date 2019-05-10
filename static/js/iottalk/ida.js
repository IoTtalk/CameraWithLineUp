function Up_I(){dan.push('Up-I', [4, IP_CAM_USERNAME]);}
function Down_I(){dan.push('Down-I',[1, IP_CAM_USERNAME]);}
function Left_I(){dan.push('Left-I', [2, IP_CAM_USERNAME]);}
function Right_I(){dan.push('Right-I', [3, IP_CAM_USERNAME]);}

function PTZcommand_O (data){
    let dt = new Date();
    let command = ["",  "Down", "Left", "Right", "Up", "Zoom-in", "Zoom-out"];
    document.getElementById("PTZcommands").value = command[data[0]] + " at " + ("0"+dt.getHours()).slice(-2) +":"+ ("0"+dt.getMinutes()).slice(-2) +":"+ ("0"+dt.getSeconds()).slice(-2);
}
var coordinate = [0, 90];
function Geolocation_O(x, y){
    var coordinate_next = [x, y];
    var degree_right = 360/100;  // each step
    var degree_left = 360/90;
    //var theta = Math.atan((coordinate_next[1]-coordinate[1])/(coordinate_next[0]-coordinate[0])) * 180/Math.PI;
    var theta = Math.atan(1)* 180/Math.PI;
    console.log(theta);
    coordinate = coordinate_next;
}

function iottalk_register() {
    csmapi.set_endpoint('http://IP:9999');
    var profile = {
        'dm_name': 'PTZcontroller',
        'idf_list':[Up_I, Down_I, Right_I, Left_I],
        'odf_list':[PTZcommand_O, Geolocation_O],
        'd_name': undefined,
    };
    /*******************************************************************/
    dai(profile, {'ida_init': function(){}});     
};
