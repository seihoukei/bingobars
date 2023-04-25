function formatValue(value) {
    if (typeof value === 'string')
        return value
    
    return value < 10000 ? value.toFixed(2) : value.toExponential(2)
}

function formatString(strings, ...values) {
    const result = []
    for (let i = 0; i < strings.length; i++) {
        result.push(strings[i])
        result.push(formatValue(values[i] ?? ""))
    }
    return result.join("")
}

formatString.settings = {}

export default formatString
