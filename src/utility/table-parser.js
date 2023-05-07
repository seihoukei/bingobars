/*
Change context:
# CONTEXT

Command :
COMMAND DATA
or
COMMAND: DATA

Comment :
// like this

Splitting lines:
line one\
line one continued (connected with whitespace)
or
line one
...line one continued (concatenated without whitespace)

 
 */

export default class TableParser {
    static parse(
        data,
        defaultContext,
        contexts,
        commands,
    ) {
        const lines = data
            .replace(/\\\r?\n/g, " ")
            .replace(/\r?\n\.\.\./g, "")
            .split("\n")
            .map(x => x
                .replace(/\/\/[\s\S]*/, "")
                .trim()
            )
            .filter(x => x.length)
        
        let context = defaultContext
    
        for (let line of lines) {
            const parsed = line.match(/^([^\s:]*)\s*:?\s*(.*)$/)
            if (!parsed) {
                console.log(`Failed to parse "${line}"`)
                continue
            }
            const [, command, data] = parsed
            
            switch (command) {
                case "#":
                    context = data === ""
                        ? defaultContext
                        : contexts[data]
                    break
                default:
                    context[commands[command]]?.(data)
            }
        }
    }
}
