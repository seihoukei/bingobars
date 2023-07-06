import BaseValue from "game-classes/base-value.js"

const BASE_VALUES = {
    "A" : new BaseValue("A", {
        dX : 1,
        MX0 : 5,
        MXm : 2,
        X_seen : true,
    }, {
        dark : "#222277",
        normal : "#5555AA",
        light : "#8888DD",
        bright : "#CCCCFF",
    }),
    
    "B" : new BaseValue("B", {
        dX : 1,
        MX0 : 6,
        MXm : 3,
    }, {
        dark : "#772222",
        normal : "#AA5555",
        light : "#DD8888",
        bright : "#FFCCCC",
    }),
    
    "C" : new BaseValue("C", {
        dX : 1,
        MX0 : 5,
        MXm : 3,
    }, {
        dark : "#777722",
        normal : "#AAAA55",
        light : "#DDDD88",
        bright : "#FFFFCC",
    }),

    "AB" : new BaseValue("AB", {
        dX : 1e-12,
        MX0 : 25,
        MXm : 1,
    }, {
        dark : "#772277",
        normal : "#AA55AA",
        light : "#DD88DD",
        bright : "#FFCCFF",
    }),
    
    "BC" : new BaseValue("BC", {
        dX : 1,
        MX0 : 5,
        MXm : 3,
    }, {
        dark : "#775522",
        normal : "#AA8855",
        light : "#DDBB88",
        bright : "#FFEECC",
    }),
    
    "AC" : new BaseValue("AC", {
        dX : 1,
        MX0 : 5,
        MXm : 3,
    }, {
        dark : "#227722",
        normal : "#55AA55",
        light : "#88DD88",
        bright : "#CCFFCC",
    }),
    
    "ABC" : new BaseValue("ABC", {
        dX : 1,
        MX0 : 5,
        MXm : 3,
    }, {
        dark : "#227777",
        normal : "#55AAAA",
        light : "#88DDDD",
        bright : "#CCFFFF",
    }),
}

export default BASE_VALUES
