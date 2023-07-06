import UIMaxiValue from "components/ui/maxis/value/UIMaxiValue.svelte"
import UIMaxiTable from "components/ui/maxis/table/UIMaxiTable.svelte"
import UIMaxiCode from "components/ui/maxis/codes/UIMaxiCode.svelte"
import UIMaxiHelp from "components/ui/maxis/help/UIMaxiHelp.svelte"
import UIMaxiMenu from "components/ui/maxis/menu/UIMaxiMenu.svelte"
import UIMaxiBingo from "components/ui/maxis/super-bingo/UIMaxiSuper.svelte"
import UIMaxiHell from "components/ui/maxis/hell-bingo/UIMaxiHell.svelte"
import UIMiniValue from "components/ui/minis/value/UIMiniValue.svelte"
import UIMiniGeneric from "components/ui/minis/generic/UIMiniGeneric.svelte"
import UIMiniTable from "components/ui/minis/table/UIMiniTable.svelte"
import UIMaxiSettings from "components/ui/maxis/settings/UIMaxiSettings.svelte"
import UIMaxiCalculator from "components/ui/maxis/calculator/UIMaxiCalculator.svelte"

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
},{
    mini : null,
    maxi : UIMaxiSettings,
    id : "SETTINGS",
},{
    mini : null,
    maxi : UIMaxiCalculator,
    id : "CALC",
},]

export default UI_TABS
