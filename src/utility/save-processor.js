import {compressToBase64, decompressFromBase64} from "@amoutonbrady/lz-string"

export default class SaveProcessor {
    static encode(save) {
        const json = JSON.stringify(save)
        const compressed = compressToBase64(json)
        return compressed
    }
    
    static decode(compressed) {
        if (!compressed) {
            return null
        }
        try {
            const json = decompressFromBase64(compressed)
            const save = JSON.parse(json)
            return save
        } catch (e) {
            console.log("Failed to load:")
            console.log(e)
            return null
        }
        
    }
}
