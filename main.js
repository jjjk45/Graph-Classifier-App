const mouseButton = Object.freeze({
    LEFT: '0',
    RIGHT: '2'
});

class Graphy    {
    /**
     * @param {number} radius - vertex radius
     * @param {canvasContext} ctx
     */
    constructor(radius, ctx) {
        this.radius = radius;   //I like 7.5
        this.gridSize = radius * 4;
        this.cellHalf = this.gridSize / 2;
        this.adjacency = new Map();
        this.ctx = ctx;
        this.mouseDown = null;
    }
    leftClickCanvasDown(event)  {
        let xCoord = Math.round(event.offsetX/this.gridSize) * this.gridSize;
        let yCoord = Math.round(event.offsetY/this.gridSize) * this.gridSize;
        if(xCoord == 0 || yCoord == 0)   {
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
        if(event.button == mouseButton.RIGHT)   {
            return;
        }
        let xCoord = Math.round(event.offsetX/this.gridSize) * this.gridSize;
        let yCoord = Math.round(event.offsetY/this.gridSize) * this.gridSize;
        let key = `${xCoord},${yCoord}`;
        const start = this.mouseDown;
        this.mouseDown = null;

        if(start === key) {
            if(this.adjacency.has(key)) {
                console.log("Vertex already exists");
                return;
            }
            console.log(`Added (${key})`);
            this.adjacency.set(key, new Set());
            this.#drawVertex(xCoord, yCoord);
            return;
        }
        if(!this.adjacency.has(start) || !this.adjacency.has(key)) {
            console.log("fail");
            return;
        }
        if(this.adjacency.get(start).has(key)) {
            console.log("Edge already exists");
            return;
        }
        this.adjacency.get(start).add(key);
        this.adjacency.get(key).add(start);
        const [startX, startY] = start.split(",");
        this.#drawEdge(startX, startY, xCoord, yCoord);
    }
    rightClickCanvas(event)    {
        let xCoord = Math.round(event.offsetX/this.gridSize) * this.gridSize;
        let yCoord = Math.round(event.offsetY/this.gridSize) * this.gridSize;
        let key = `${xCoord},${yCoord}`;
        if(this.adjacency.has(key))    {
            console.log(`Deleted (${key})`);
            for(let i of this.adjacency.keys())   {
                if(this.adjacency.get(i).delete(key) == false)  {
                    console.log(`deleting edge failed`);
                }
                console.log(` & edge from ${i}`);
            }
            this.adjacency.delete(key);
            console.log(this.adjacency);
            this.ctx.clearRect(xCoord - this.cellHalf, yCoord - this.cellHalf, this.gridSize, this.gridSize);
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
        this.ctx.fill();
        this.ctx.stroke();
    }
    #deleteVertex() {

    }
}

window.onload = function() {
    const canvas = document.getElementById("theCanvas");
    const _height = window.innerHeight - Math.floor(window.innerHeight/5);
    const _width = window.innerWidth;
    while(canvas == null)  {
        console.log("Canvas has not loaded yet");
    }
    canvas.height = _height;
    canvas.width = _width;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "screen";
    const graph = new Graphy(10, ctx);

    canvas.addEventListener("mousedown", (event) => {
        graph.leftClickCanvasDown(event);
    });
    canvas.addEventListener("mouseup", (event) => {
        graph.leftClickCanvasUp(event);
        //console.log(`Click registered at (${event.offsetX}, ${event.offsetY})`);
    });
    canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        graph.rightClickCanvas(event);
    });
}