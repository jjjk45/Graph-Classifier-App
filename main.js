const mouseButton = Object.freeze({
    LEFT: 0,
    RIGHT: 2
});

class Graphy    {
    #adjacency = new Map();
    /**
     * @param {number} radius - vertex radius
     * @param {canvasContext} ctx
     */
    constructor(radius, height, width, ctx) {
        this.radius = radius;   //I like 7.5
        this.gridSize = radius * 4;
        this.cellHalf = this.gridSize / 2;
        this.height = height;
        this.width = width;
        this.ctx = ctx;
        this.mouseDown = null;
    }
    leftClickCanvasDown(event)  {
        let xCoord = Math.round(event.offsetX/this.gridSize) * this.gridSize;
        let yCoord = Math.round(event.offsetY/this.gridSize) * this.gridSize;
        if(
            xCoord <= 0 ||
            yCoord <= 0 ||
            xCoord >= this.width - this.radius ||
            yCoord >= this.height - this.radius
        )   {
            console.log(`You cannot place vertices on the edge of the canvas`);
            return;
        }
        let key = `${xCoord},${yCoord}`;
        if(this.mouseDown === null) {
            this.mouseDown = key;
            return;
        }
    }
    leftClickCanvasUp(event)    {
        if(this.mouseDown == null || event.button != mouseButton.LEFT)   {
            return;
        }
        let xCoord = Math.round(event.offsetX/this.gridSize) * this.gridSize;
        let yCoord = Math.round(event.offsetY/this.gridSize) * this.gridSize;
        let key = `${xCoord},${yCoord}`;
        const start = this.mouseDown;
        this.mouseDown = null;

        if(start === key) {
            if(this.#adjacency.has(key)) {
                console.log("Vertex already exists");
                return;
            }
            console.log(`Added (${key})`);
            this.#adjacency.set(key, new Set());
            this.#drawVertex(xCoord, yCoord);
            return;
        }
        if(!this.#adjacency.has(start) || !this.#adjacency.has(key)) { //guard clause
            console.log(`The start position on mouseDown (${start}) does not equal the ending position on mouseUp (${key})`);
            return;
        }
        if(this.#adjacency.get(start).has(key)) {
            console.log("Edge already exists");
            return;
        }
        this.#adjacency.get(start).add(key);
        this.#adjacency.get(key).add(start);
        const [startX, startY] = start.split(",");
        this.#drawEdge(startX, startY, xCoord, yCoord);
    }
    rightClickCanvas(event)    {
        this.mouseDown = null;
        let xCoord = Math.round(event.offsetX/this.gridSize) * this.gridSize;
        let yCoord = Math.round(event.offsetY/this.gridSize) * this.gridSize;
        let key = `${xCoord},${yCoord}`;
        if(this.#adjacency.has(key))    {
            console.log("");
            console.log(`Deleted (${key})`);
            for(let i of this.#adjacency.get(key).values())   {
                if(this.#adjacency.get(i).delete(key) == true)  {
                    console.log(`& Edge from (${i}) to (${key})`);
                } else {
                    console.log(`Deleting Edge from (${i}) to (${key}) failed`);
                }
            }

            this.#adjacency.delete(key);
            console.log(this.#adjacency);
            //this.ctx.clearRect(xCoord - this.cellHalf, yCoord - this.cellHalf, this.gridSize, this.gridSize);
            this.#redraw();
            console.log("");
        }
    }
    #drawVertex(x, y) {
        console.log(`Vertex drawn at (${x}, ${y})`);
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.radius, 0, Math.PI*2, false);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "#111"
        this.ctx.fillStyle = "#111";
        this.ctx.fill();
        this.ctx.stroke();
    }
    #drawEdge(startX, startY, endX, endY) {
        console.log(`Edge drawn from (${startX}, ${startY}) to (${endX}, ${endY})`);
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "#111"
        this.ctx.fillStyle = "#111";
        this.ctx.stroke();
    }
    #redraw()   {
        this.ctx.clearRect(0, 0, this.width, this.height)
        console.log(`Cleared from (0,0) to (${this.width},${this.height})`)
        for(let v of this.#adjacency.keys()) {
            const [startX, startY] = v.split(",");
            this.#drawVertex(startX, startY);
            for(let e of this.#adjacency.get(v).values())    {
                const [endX, endY] = e.split(",");
                if(startX < endX || (startX === endX && startY < endY)) {
                    this.#drawEdge(startX, startY, endX, endY);
                }
            }
        }
    }
}

window.onload = function() {
    const canvas = document.getElementById("theCanvas");
    const _height = window.innerHeight - Math.floor(window.innerHeight/5);
    const _width = window.innerWidth;
    if (!canvas) {
        throw new Error("Canvas element not found");
    }
    canvas.height = _height;
    canvas.width = _width;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "screen";
    const graph = new Graphy(10, _height, _width, ctx);

    canvas.addEventListener("mousedown", (event) => {
        if(event.button == mouseButton.LEFT)    {
            graph.leftClickCanvasDown(event);
        }
    });
    canvas.addEventListener("mouseup", (event) => {
        if(event.button == mouseButton.LEFT)    {
            graph.leftClickCanvasUp(event);
        }
        //console.log(`Click registered at (${event.offsetX}, ${event.offsetY})`);
    });
    canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        graph.rightClickCanvas(event);
    });
}