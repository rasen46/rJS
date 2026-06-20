// rasenGML resources v0.1.0 pre alpha //
// source file: https://github.com/rasen46/rJS/tree/rgml //

global.rgml = {
    start_time: current_time,
    modules: {},
    storage: {
        version: "v0.1.0 pre alpha",
        chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    }
};

function rgml_lerp(a,b,alpha) {
    return a + (b-a)*alpha;
}

function rgml_easing(a,dir,power) {
    dir = string_lower(dir);

    switch(dir)
    {
        case "in":
            return power(a,power);

        case "out":
            return 1 - power(1-a,power);

        case "inout":
            if(a < 0.5)
            {
                return power(2*a,power)/2;
            }

            return 1 - power(2-2*a,power)/2;
    }

    return 1;
}

function rgml_tween(a,b,exp,dir,alpha) {
    return a + (b-a) * rjs_easing(alpha,dir,exp);
}

function rgml_print(text,type="INFO",script="unknown") {
    var elapsed = current_time - global.rjs.start_time;
    show_debug_message(
        "[" + script + "/" + type + "] " + string(text)
    );
}

function rgml_aabb(x1,y1,w1,h1,x2,y2,w2,h2) {
    return !(
        x1+w1 <= x2 ||
        x1 >= x2+w2 ||
        y1+h1 <= y2 ||
        y1 >= y2+h2
    );
}

function rgml_array_random(arr) {
    return arr[irandom(array_length(arr)-1)];
}

function rgml_array_remove_random(arr) {
    var index = irandom(array_length(arr)-1);
    array_delete(arr,index,1);

    return arr;
}

function rgml_array_insert_random(arr,val) {
    var index = irandom(array_length(arr));
    array_insert(arr,index,val);

    return arr;
}
