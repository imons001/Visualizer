export const initialArray = [
     2,  5,  8, 11, 14,
    17, 20, 23, 26, 29,
    32, 35, 38, 41, 44
];

export const target = 29;

export const STEPS = (() => {
    const steps = [];
    let left = 0;
    let right = initialArray.length - 1;

    while (left <= right) {
        //math.floor handles odd lengths by rounding down apperently
        const mid = Math.floor((left + right) / 2);
            //add to steps each iteration will start will padding prev left, right, and mid values
            steps.push({ left, right, mid, 
                action: initialArray[mid] === target 
                ? "found" : 
                initialArray[mid] < target ? 
                "move_left" :
                "move_right",
            });
        if (initialArray[mid] === target) {
            // If we found the target at mid, we can stop
            //move right mid
            
            break; 
            //mid less than target, move left up to mid + 1
        } else if (initialArray[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return steps;
})();