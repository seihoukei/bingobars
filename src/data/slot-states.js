const SLOT_STATES = Object.freeze({
    UNKNOWN : 0,
    PREREQUISITES_MET : 1,
    CONDITIONS_MET : 2,
    VISIBLE : 4,
    UNLOCKABLE : 7, //VISIBLE + CON_MET + PRE_MET
    UNLOCKED : 16,
    ENABLED : 32,
})

export default SLOT_STATES
