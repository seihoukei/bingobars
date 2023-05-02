import {compressToBase64, decompressFromBase64} from "@amoutonbrady/lz-string"
import Workhole from "utility/workhole.js"

const CompressWorker = new Workhole(new Worker(
    new URL('workers/compress-worker.js', import.meta.url),
    {type: 'module'}
))
const saver = CompressWorker.expectExport("compressor")

export default class SaveProcessor {
    static encode(save) {
        const json = JSON.stringify(save)
        const compressed = compressToBase64(json)
        return compressed
    }

    static async encodeAsync(save) {
        const activeSaver = await saver
        const data = await activeSaver.compress(save)
        return data
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
