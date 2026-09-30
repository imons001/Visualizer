export const initialArray = [
     2,  5,  8, 11, 14,
    17, 20, 23, 26, 29,
    32, 35, 38, 41, 44
];

export const target = 29;

export function buildSteps(arr, tgt) {
    const steps = [];
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        //math.floor handles odd lengths by rounding down apperently
        const mid = Math.floor((left + right) / 2);
        steps.push({ left, right, mid,
            action: arr[mid] === tgt 
                ? "found" : 
                arr[mid] < tgt ? 
                "move_left" :
                "move_right",

        });
        if (arr[mid] === tgt) {
            break;
        } else if (arr[mid] < tgt) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return steps;
}

//random with no duplicates 

export function randomArray(size = 9, max = 99) {
    const set = new Set();
    while (set.size < size) {
        set.add(Math.floor(Math.random() * max) + 1);
    }
    return Array.from(set).sort((a, b) => a - b);
}

export function randomTarget(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const STEPS = buildSteps(initialArray, target); 