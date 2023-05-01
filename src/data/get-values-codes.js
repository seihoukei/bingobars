export default function getValuesCodes(id) {
    return {
        X : id,
        dX : `d${id}`,
        MX : `M${id}`,
        MX0 : `M${id}0`,
        MXm : `M${id}m`,
        XP : `${id}P`,
        dXP : `d${id}P`,
        XPc : `${id}Pc`,
        Xt : `${id}t`,
        XPt : `${id}Pt`,
        X_auto : `${id}_auto`,
        X_auto_seen : `${id}_auto_seen`,
    }
}