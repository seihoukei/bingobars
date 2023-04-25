export default class SaveProcessor {
    static encode(save) {
        const json = JSON.stringify(save)
        const base64 = btoa(json)
        return base64
    }
    
    static decode(base64) {
        if (!base64) {
            return null
        }
        try {
            const json = atob(base64)
            const save = JSON.parse(json)
            if (save.person) {
                save.person.mood ??= 50
                save.person.speed ??= 1
            }
            return save
        } catch (e) {
            console.log("Failed to load:")
            console.log(e)
            return null
        }
        
    }
}
