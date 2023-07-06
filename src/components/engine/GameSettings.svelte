<script>

    import registerTrigger from "utility/register-trigger.js"

    registerTrigger("command-set-setting", setSetting)

    export let settings = {
        quickPrestige : true,
        quickReset : true,
        alwaysShowConditions : false,
        alwaysShowModifiers : false,
        animateNoise : true,
    }

    function setSetting(id, value = settings[id]) {
        settings[id] = value
    }
</script>
