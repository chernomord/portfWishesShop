//function uniq(a) {
//    var seen = {};
//    return a.filter(function(item) {
//        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
//    });
//}

//
function unique(input, prop){
    // first - clone the input to stay on the safe side
    var c = input.slice(0);
    c.sort(function (a,b){
        //if a numbers in input
        //if (a[prop] > b[prop]) return 1;
        //if (a[prop] < b[prop]) return -1;
        //if string in input
        return a[prop].localeCompare(b[prop]);
    });
    for(var i = 1; i < c.length; ){
        if(c[i-1][prop] == c[i][prop]){
            c.splice(i, 1);
        } else {
            i++;
        }
    }
    return c;
}