import Calculation from "utility/calculation.js"

const SUPER_BINGO = {
    costs : [
        [1, 1, 1, 1, 1,],
        [1, 2, 1, 2, 1,],
        [1, 1, 0, 3, 1,],
        [3, 2, 1, 2, 3,],
        [1, 1, 1, 1, 1,],
    ],
    lines : {
        R1 : {
			cells: [[0,0], [1,0], [2,0], [3,0], [4,0]],
			position : [6,0],
		},
        R2 : {
			cells: [[0,1], [1,1], [2,1], [3,1], [4,1]],
			position : [6,1],
			effect : "APc *= 0.9 ^ ~"
		},
        R3 : {
			cells: [[0,2], [1,2], [2,2], [3,2], [4,2]],
			position : [6,2],
		},
        R4 : {
			cells: [[0,3], [1,3], [2,3], [3,3], [4,3]],
			position : [6,3],
			effect : "dB *= 1.1 ^ ~"
		},
        R5 : {
			cells: [[0,4], [1,4], [2,4], [3,4], [4,4]],
			position : [6,4],
		},
        C1 : {
			cells: [[0,0], [0,1], [0,2], [0,3], [0,4]],
			position : [1,5],
		},
        C2 : {
			cells: [[1,0], [1,1], [1,2], [1,3], [1,4]],
			position : [2,5],
		},
        C3 : {
			cells: [[2,0], [2,1], [2,2], [2,3], [2,4]],
			position : [3,5],
			effect : "dA *= 1.1 ^ ~",
		},
        C4 : {
			cells: [[3,0], [3,1], [3,2], [3,3], [3,4]],
			position : [4,5],
			effect : "BPc *= 0.9 ^ ~"
		},
        C5 : {
			cells: [[4,0], [4,1], [4,2], [4,3], [4,4]],
			position : [5,5],
		},
        DL : {
			cells: [[4,0], [3,1], [2,2], [1,3] ,[0,4]],
			position : [0,5],
		},
        DR : {
			cells: [[0,0], [1,1], [2,2], [3,3], [4,4]],
			position : [6,5],
		},
    },
}

for (const [id, data] of Object.entries(SUPER_BINGO.lines)) {
	if (data.effect) {
		data.effect = data.effect.replace(/~/g, `SB${id}`)
		data.modifier = new Calculation(data.effect, Calculation.PRIORITIES.SUPER)
		data.modifier.setSource(`SB${id}`)
	}
}

export default SUPER_BINGO
