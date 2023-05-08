<script>
    import UICodeValueList from "components/ui/maxis/codes/UICodeValueList.svelte"

    export let game
    export let id
</script>

<div class="container">
    <div class="values block">
        <UICodeValueList {game} id="A" />
        <UICodeValueList {game} id="B" />
        <UICodeValueList {game} id="C" />
        <UICodeValueList {game} id="AB" />
        <UICodeValueList {game} id="AC" />
        <UICodeValueList {game} id="BC" />
        <UICodeValueList {game} id="ABC" />
    </div>
    <div class="tables block">
        <UICodeValueList {game} table id="T" />
        <UICodeValueList {game} table id="T1" />
        <UICodeValueList {game} table id="T2" />
        <UICodeValueList {game} table id="T3" />
        <UICodeValueList {game} table id="T4" />
        <UICodeValueList {game} table id="T5" />
    </div>
</div>

<style>
    div.container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        row-gap: 0.5em;
        font-size: 1.9em;
    }

    div.block {
        display: flex;
        column-gap: 0.5em;
    }
</style>
