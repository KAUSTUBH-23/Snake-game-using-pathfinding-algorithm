let open = [], closed = [], path = []

export const aStar = (snake, appleX, appleY, SCALE, CANVAS_SIZE) => {   
    open.splice(0)
    closed.splice(0)
    
    const snakeHeadX = snake[0][0]
    const snakeHeadY = snake[0][1]

    // f(x) = g(x) + h(x), where h(x) is the distance to the target node (apple) & g(x) is the distance to the starting node
    // g(x) of the Snake's head is 0 because it is the starting node.

    open[0] = {
        i: snakeHeadX,
        j: snakeHeadY,
        g: 0,
        f: getHValue({ i: snakeHeadX, j: snakeHeadY }, appleX, appleY),
        cameFrom: null
    }

    while (open.length>0) { 
        const current = open[0]
        open.splice(0,1)
        closed.push(current)
        const i = current.i, j = current.j

        if (i === appleX && j === appleY) {
            break
        }

        getNeighbours(current, appleX, appleY).forEach((neighbour) => {
        
            const { i, j } = neighbour

            if (checkCollision(i, j, snake, SCALE, CANVAS_SIZE) || closed.some(item => item.i===i && item.j===j)) 
                return

            const newMovementCostToNeighbour = current.g + getHValue(current.i, current.j, i, j)   

            if (newMovementCostToNeighbour < neighbour.g || !open.some(item => item.i===i && item.j===j)) {
                neighbour.g = newMovementCostToNeighbour
                neighbour.h = getHValue(i, j, appleX, appleY)
                neighbour.f = neighbour.g + neighbour.h
                neighbour.cameFrom = current

                if(!open.some(item => item.i===i && item.j===j)) open.push(neighbour)
            }

            for(let r = open.length -1 ; r >0 ; r--){
                if(open[r].f < open[r-1].f){
                    const temp = open[r-1];
                    open[r-1] = open[r];
                    open[r] = temp;
                }
            }
        })
        
    }

    path.splice(0)
    findPath()
    return { path, closed }
}

const checkCollision = (i, j, snake, SCALE, CANVAS_SIZE) => {

    // checking if node is out of bounds
    if (
      i * SCALE >= CANVAS_SIZE[0] ||
      i < 0 ||
      j * SCALE >= CANVAS_SIZE[1] ||
      j < 0
    )
      return true;
    
    // checking for collission with Snake's body
    for (const segment of snake) {
      if (i === segment[0] && j === segment[1]) {
          return true
      }
    }
    return false;
  }

const getHValue = (nodeX, nodeY, appleX, appleY) => {
    const diffX = appleX - nodeX;
    const diffY = appleY - nodeY;
    
    //return Math.floor(Math.sqrt(Math.pow(diffX,2) + Math.pow(diffY,2)) * 10);
    if (diffX > diffY) return 14 * diffY + 10 * (diffX-diffY)
    return 14 * diffX + 10 * (diffY - diffX)
}

const findPath = () => {
    let previous = '';
    for(let i = closed.length - 1; i>=0; i--){
        
        if(i === closed.length - 1 && previous === ''){
            previous = closed[i];
            path.push(previous);
        }
        else if(previous.cameFrom.i === closed[i].i && previous.cameFrom.j === closed[i].j){
            previous = closed[i];
            path.push(previous);
        }            
    }
}

const getNeighbours = (current, appleX, appleY) => {
    const i = current.i, j = current.j, g = current.g+1

    const left = { 
        i: i-1, 
        j: j,
        g: g,
        h: getHValue(i-1, j, appleX, appleY),
        cameFrom: current
    }
    left.f = left.g + left.h 

    const right = {
        i: i+1,
        j: j,
        g: g,
        h: getHValue(i+1, j, appleX, appleY),
        cameFrom: current
    }
    right.f = right.g + right.h 

    const up = {
        i: i,
        j: j-1,
        g: g,
        h: getHValue(i, j-1, appleX, appleY),
        cameFrom: current
    }
    up.f = up.g + up.h 

    const down = {
        i: i,
        j: j+1,
        g: g,
        h: getHValue(i, j+1, appleX, appleY),
        cameFrom: current
    }
    down.f = down.g + down.h

    return [left,right,up,down]
}