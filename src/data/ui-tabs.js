import UIMiniValue from "components/ui/minis/UIMiniValue.svelte"
import UIMaxiValue from "components/ui/maxis/UIMaxiValue.svelte"
import UIMiniTable from "components/ui/minis/UIMiniTable.svelte"
import UIMaxiTable from "components/ui/maxis/UIMaxiTable.svelte"
import UIMiniGeneric from "components/ui/minis/UIMiniGeneric.svelte"
import UIMaxiCode from "components/ui/maxis/UIMaxiCode.svelte"
import UIMaxiHelp from "components/ui/maxis/UIMaxiHelp.svelte"
import UIMaxiMenu from "components/ui/maxis/UIMaxiMenu.svelte"
import UIMaxiBingo from "components/ui/maxis/UIMaxiBingo.svelte"
import UIMaxiHell from "components/ui/maxis/UIMaxiHell.svelte"

const UI_TABS = [{
    mini : UIMiniValue,
    maxi : UIMaxiValue,
    id : "A",
},{
    mini : UIMiniValue,
    maxi : UIMaxiValue,
    id : "B",
},{
    mini : UIMiniValue,
    maxi : UIMaxiValue,
    id : "C",
},{
    mini : UIMiniValue,
    maxi : UIMaxiValue,
    id : "AB",
},{
    mini : UIMiniValue,
    maxi : UIMaxiValue,
    id : "AC",
},{
    mini : UIMiniValue,
    maxi : UIMaxiValue,
    id : "BC",
},{
    mini : UIMiniValue,
    maxi : UIMaxiValue,
    id : "ABC",
},{
    mini : UIMiniTable,
    maxi : UIMaxiTable,
    id : "T1",
},{
    mini : UIMiniTable,
    maxi : UIMaxiTable,
    id : "T2",
},{
    mini : UIMiniTable,
    maxi : UIMaxiTable,
    id : "T3",
},{
    mini : UIMiniTable,
    maxi : UIMaxiTable,
    id : "T4",
},{
    mini : UIMiniTable,
    maxi : UIMaxiTable,
    id : "T5",
},{
    mini : UIMiniGeneric,
    maxi : UIMaxiCode,
    id : "CODE",
},{
    mini : UIMiniGeneric,
    maxi : UIMaxiHelp,
    id : "HELP",
},{
    mini : UIMiniGeneric,
    maxi : UIMaxiMenu,
    id : "MENU",
},{
    mini : null,
    maxi : UIMaxiBingo,
    id : "BINGO",
},{
    mini : null,
    maxi : UIMaxiHell,
    id : "HELL",
},]

export default UI_TABS
