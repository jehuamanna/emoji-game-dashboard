function findCoordinates(coordinateLandmark) {
    const { x, y } = coordinateLandmark
    return [x, y];
}

function orientation(coordinateLandmark0, coordinateLandmark9) {
    let [x0, y0] = findCoordinates(coordinateLandmark0);
    let [x9, y9] = findCoordinates(coordinateLandmark9);
    
    let m;
    if (Math.abs(x9 - x0) < 0.05) {
        m = 1000000000;
    } else {
        m = Math.abs((y9 - y0) / (x9 - x0));
    }

    if (m >= 0 && m <= 1) {
        if (x9 > x0) {
            return "Right";
        } else {
            return "Left";
        }
    }

    if (m > 1) {
        if (y9 < y0) {
            return "Up";
        } else {
            return "Down";
        }
    }
}





 function isThumbsUp(landmark) {
    if(!landmark) return false

    let direction = orientation(landmark[0], landmark[9]);
    let [x3, y3] = findCoordinates(landmark[3]);
    let [x4, y4] = findCoordinates(landmark[4]);
    let [x5, y5] = findCoordinates(landmark[5]);
    let [x8, y8] = findCoordinates(landmark[8]);
    let [x9, y9] = findCoordinates(landmark[9]);
    let [x12, y12] = findCoordinates(landmark[12]);
    let [x13, y13] = findCoordinates(landmark[13]);
    let [x16, y16] = findCoordinates(landmark[16]);
    let [x17, y17] = findCoordinates(landmark[17]);
    let [x20, y20] = findCoordinates(landmark[20]);

    if (direction === 'Up' || direction === 'Down') {
        return false;
    }

    if (y3 < y4) {
        return false;
    }

    if (direction === 'Left') {
        if ((x5 < x8) && (x9 < x12) && (x13 < x16) && (x17 < x20) && (y4 < y5 && y5 < y9 && y9 < y13 && y13 < y17)) {
            return true;
        }
    } else if (direction === 'Right') {
        if ((x5 > x8) && (x9 > x12) && (x13 > x16) && (x17 > x20) && (y4 < y5 && y5 < y9 && y9 < y13 && y13 < y17)) {
            return true;
        }
    }

    return false;
}



 function isUpwardPalm(landmark) {
    if(!landmark) return false

    let direction = orientation(landmark[0], landmark[9]);
    let [, y3] = findCoordinates(landmark[3]);
    let [, y4] = findCoordinates(landmark[4]);
    let [, y7] = findCoordinates(landmark[7]);
    let [, y8] = findCoordinates(landmark[8]);
    let [, y11] = findCoordinates(landmark[11]);
    let [, y12] = findCoordinates(landmark[12]);
    let [, y15] = findCoordinates(landmark[15]);
    let [, y16] = findCoordinates(landmark[16]);
    let [, y19] = findCoordinates(landmark[19]);
    let [, y20] = findCoordinates(landmark[20]);

    if (isThumbsUp(landmark)) {
        return false;
    }

    if (direction === 'Down' || direction === 'Left' || direction === 'Right') {
        return false;
    }

    if ((y4 < y3) && (y8 < y7) && (y12 < y11) && (y16 < y15) && (y20 < y19) && 
        (y4 > y8) && (y4 > y12) && (y4 > y16) && (y4 > y20)) {
        return true;
    }

    return false;
}

 function isVictory(landmark) {
    if(!landmark) return false

    let direction = orientation(landmark[0], landmark[9]);
    let [, y3] = findCoordinates(landmark[3]);
    let [, y4] = findCoordinates(landmark[4]);
    let [, y7] = findCoordinates(landmark[7]);
    let [, y8] = findCoordinates(landmark[8]);
    let [, y11] = findCoordinates(landmark[11]);
    let [, y12] = findCoordinates(landmark[12]);
    let [, y15] = findCoordinates(landmark[15]);
    let [, y16] = findCoordinates(landmark[16]);
    let [, y19] = findCoordinates(landmark[19]);
    let [, y20] = findCoordinates(landmark[20]);
    let [, y13] = findCoordinates(landmark[13]);
    let [, y17] = findCoordinates(landmark[17]);
    let [, y14] = findCoordinates(landmark[14]);
    let [, y18] = findCoordinates(landmark[18]);

    if (direction === 'Down' || direction === 'Right' || direction === 'Left') {
        return false;
    }

    if ((y7 > y8) && (y11 > y12) && (y16 > y15) && (y20 > y19) && (y3 > y4) && 
        (y4 > y14) && (y4 > y18)) {
        return true;
    }

    return false;
}

 function isLeftPointing(landmark) {
    if(!landmark) return false

    let direction = orientation(landmark[0], landmark[9]);
    let [, y3] = findCoordinates(landmark[3]);
    let [, y4] = findCoordinates(landmark[4]);
    let [x8, y8] = findCoordinates(landmark[8]);
    let [x7, ] = findCoordinates(landmark[7]);
    let [x12, y12] = findCoordinates(landmark[12]);
    let [x16, y16] = findCoordinates(landmark[16]);
    let [x20, y20] = findCoordinates(landmark[20]);
    let [x6, ] = findCoordinates(landmark[6]);
    let [x10, ] = findCoordinates(landmark[10]);
    let [x14, ] = findCoordinates(landmark[14]);
    let [x18, ] = findCoordinates(landmark[18]);

    if (direction === 'Down' || direction === 'Right' || direction === 'Up') {
        return false;
    }

    if ((y3 > y4) && (y4 < y8 && y8 < y12 && y12 < y16 && y16 < y20) && 
        (x6 > x7 && x7 > x8) && (x12 > x10) && (x16 > x14) && (x20 > x18)) {
        return true;
    }

    return false;
}

 function isRightPointing(landmark) {
    if(!landmark) return false

    let direction = orientation(landmark[0], landmark[9]);
    let [, y3] = findCoordinates(landmark[3]);
    let [, y4] = findCoordinates(landmark[4]);
    let [x8, y8] = findCoordinates(landmark[8]);
    let [x7, ] = findCoordinates(landmark[7]);
    let [x12, y12] = findCoordinates(landmark[12]);
    let [x16, y16] = findCoordinates(landmark[16]);
    let [x20, y20] = findCoordinates(landmark[20]);
    let [x6, ] = findCoordinates(landmark[6]);
    let [x10, ] = findCoordinates(landmark[10]);
    let [x14, ] = findCoordinates(landmark[14]);
    let [x18, ] = findCoordinates(landmark[18]);

    if (direction === 'Down' || direction === 'Left' || direction === 'Up') {
        return false;
    }

    if ((y3 > y4) && (y4 < y8 && y8 < y12 && y12 < y16 && y16 < y20) && 
        (x6 < x7 && x7 < x8) && (x12 < x10) && (x16 < x14) && (x20 < x18)) {
        return true;
    }

    return false;
}

 function isUpwardPointing(landmark) {
    if(!landmark) return false

    let direction = orientation(landmark[0], landmark[9]);
    let [, y3] = findCoordinates(landmark[3]);
    let [, y4] = findCoordinates(landmark[4]);
    let [x7, y7] = findCoordinates(landmark[7]);
    let [x8, y8] = findCoordinates(landmark[8]);
    let [x9, y9] = findCoordinates(landmark[9]);
    let [x12, y12] = findCoordinates(landmark[12]);
    let [x13, y13] = findCoordinates(landmark[13]);
    let [x16, y16] = findCoordinates(landmark[16]);
    let [x17, y17] = findCoordinates(landmark[17]);
    let [x20, y20] = findCoordinates(landmark[20]);

    if (direction === 'Down' || direction === 'Left' || direction === 'Right') {
        return false;
    }

    if ((y3 > y4) && (y7 > y8) && (y12 > y9) && (y16 > y13) && (y20 > y17) && 
        ((x7 > x9 && x9 > x13 && x13 > x17) || (x7 < x9 && x9 < x13 && x13 < x17))) {
        return true;
    }

    return false;
}

 function isDownwardPointing(landmark) {
    if(!landmark) return false

    let direction = orientation(landmark[0], landmark[9]);
    let [, y3] = findCoordinates(landmark[3]);
    let [, y4] = findCoordinates(landmark[4]);
    let [x7, y7] = findCoordinates(landmark[7]);
    let [, y8] = findCoordinates(landmark[8]);
    let [x9, ] = findCoordinates(landmark[9]);
    let [, y12] = findCoordinates(landmark[12]);
    let [x13, ] = findCoordinates(landmark[13]);
    let [, y16] = findCoordinates(landmark[16]);
    let [x17, ] = findCoordinates(landmark[17]);
    let [, y20] = findCoordinates(landmark[20]);
    let [, y14] = findCoordinates(landmark[14]);
    let [, y10] = findCoordinates(landmark[10]);
    let [, y18] = findCoordinates(landmark[18]);

    if (direction === 'Up' || direction === 'Left' || direction === 'Right') {
        return false;
    }

    if ((y3 < y4) && (y7 < y8) && (y12 < y10) && (y16 < y14) && (y20 < y18) && 
        ((x7 > x9 && x9 > x13 && x13 > x17) || (x7 < x9 && x9 < x13 && x13 < x17))) {
        return true;
    }

    return false;
}

 function isLeftPalm(landmark) {
    if(!landmark) return false

    let direction = orientation(landmark[0], landmark[9]);
    let [, y3] = findCoordinates(landmark[3]);
    let [, y4] = findCoordinates(landmark[4]);
    let [x8, y8] = findCoordinates(landmark[8]);
    let [x7, ] = findCoordinates(landmark[7]);
    let [x12, y12] = findCoordinates(landmark[12]);
    let [x11, y11] = findCoordinates(landmark[11]);
    let [x16, y16] = findCoordinates(landmark[16]);
    let [x15, y15] = findCoordinates(landmark[15]);
    let [x20, y20] = findCoordinates(landmark[20]);
    let [x19, y19] = findCoordinates(landmark[19]);
    let [x6, ] = findCoordinates(landmark[6]);
    let [x10, ] = findCoordinates(landmark[10]);
    let [x14, ] = findCoordinates(landmark[14]);
    let [x18, ] = findCoordinates(landmark[18]);

    if (direction === 'Down' || direction === 'Right' || direction === 'Up') {
        return false;
    }

    if ((y3 > y4) && (y4 < y8 && y8 < y12 && y12 < y16 && y16 < y20) && 
        (x7 > x8) && (x11 > x12) && (x15 > x16) && (x19 > x20)) {
        return true;
    }

    return false;
}

 function isRightPalm(landmark) {
    if(!landmark) return false

    let direction = orientation(landmark[0], landmark[9]);
    let [, y3] = findCoordinates(landmark[3]);
    let [, y4] = findCoordinates(landmark[4]);
    let [x8, y8] = findCoordinates(landmark[8]);
    let [x7, ] = findCoordinates(landmark[7]);
    let [x12, y12] = findCoordinates(landmark[12]);
    let [x11, y11] = findCoordinates(landmark[11]);
    let [x16, y16] = findCoordinates(landmark[16]);
    let [x15, y15] = findCoordinates(landmark[15]);
    let [x20, y20] = findCoordinates(landmark[20]);
    let [x19, y19] = findCoordinates(landmark[19]);
    let [x6, ] = findCoordinates(landmark[6]);
    let [x10, ] = findCoordinates(landmark[10]);
    let [x14, ] = findCoordinates(landmark[14]);
    let [x18, ] = findCoordinates(landmark[18]);

    if (direction === 'Down' || direction === 'Left' || direction === 'Up') {
        return false;
    }

    if ((y3 > y4) && (y4 < y8 && y8 < y12 && y12 < y16 && y16 < y20) && 
        (x7 < x8) && (x11 < x12) && (x15 < x16) && (x19 < x20)) {
        return true;
    }

    return false;
}


export function checkActions(string, direction) {
    switch (string) {
        case 'upward_palm':
            return isUpwardPalm(direction);
        case 'thumbs_up':
            return isThumbsUp(direction);
        case 'victory':
            return isVictory(direction);
        case 'left_pointing':
            return isLeftPointing(direction);
        case 'right_pointing':
            return isRightPointing(direction);
        case 'upward_pointing':
            return isUpwardPointing(direction);
        case 'downward_pointing':
            return isDownwardPointing(direction);
        case 'left_palm':
            return isLeftPalm(direction);
        case 'right_palm':
            return isRightPalm(direction);
        default:
            return false;
    }
}
