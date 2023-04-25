const VALUES = Object.freeze({
    A: {
        baseLimit: 5,
        baseSpeed: 1,
        baseLimitMultiplier: 2,
        initialSeen: true,
    },
    B: {
        baseLimit: 6,
        baseSpeed: 1,
        baseLimitMultiplier: 3,
    },
    C: {
        baseLimit: 7,
        baseSpeed: 1,
        baseLimitMultiplier: 4,
    },
    
    AB: {
        baseLimit: 25,
        baseSpeed: 1,
        baseLimitMultiplier: 2,
        speedFactors: ["A","B"],
    },
    AC: {
        baseLimit: 100,
        baseSpeed: 1,
        baseLimitMultiplier: 3,
        speedFactors: ["A","C"],
    },
    BC: {
        baseLimit: 250,
        baseSpeed: 1,
        baseLimitMultiplier: 4,
        speedFactors: ["B","C"],
    },
    
    ABC: {
        baseLimit: 10000,
        baseSpeed: 1,
        baseLimitMultiplier: 5,
        speedFactors: ["A","B","C"],
    },
})

export default VALUES
