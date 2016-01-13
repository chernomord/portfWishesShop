catalogueModule.filter('byRange', function() {
    return function(input, rangeObj, prop) {
        var results = [];
        // when both not defined or null
        if (rangeObj === undefined || rangeObj == null || (rangeObj.min === null && rangeObj.max === null)) return input;
        // when .min undef
        else if (rangeObj.min === undefined || rangeObj.min === null) {
            if (rangeObj.max == 0) return input;
            for (var i = 0; i < input.length; i++) {
                if (input[i][prop] <= rangeObj.max) results.push(input[i]);
            }
            return results;
        }
        // when .max undef or zero
        else if (rangeObj.max === undefined || rangeObj.max === null || rangeObj.max == 0) {
            for (i = 0; i < input.length; i++) {
                if (input[i][prop] >= rangeObj.min) results.push(input[i]);
            }
            return results;
        }
        // when min and max defined
        else {
            for (i = 0; i < input.length; i++) {
                if (input[i][prop] >= rangeObj.min && input[i][prop] <= rangeObj.max) {
                    results.push(input[i]);
                }
            }
            return results;
        }
    }
});

catalogueModule.filter('byTags', function() {
    return function(input, tagsArray, prop) {
        var matchedResults = [];
        if (!tagsArray) return input;
        else {
            for (var i = 0; i < input.length; i++) {
                var matched = 0;
                for (var t = 0; t < tagsArray.length; t++) {
                    for (var p = 0; p < input[i][prop].length; p++) {
                        if (input[i][prop][p].text == tagsArray[t].text) matched++;
                    }
                }
                if (matched == tagsArray.length) matchedResults.push(input[i]);
            }
            return matchedResults;
        }
    }
});

catalogueModule.filter('myUnique', function() {
    return function(input, prop) {

        var filtered = unique(input, prop);

        var results = [];
        for (var i = 0; i < filtered.length; i++) {
            results.push(filtered[i]);
        }
        return results;
    }
});
