const mouseButton = Object.freeze({ //my enum
    LEFT: '0',
    RIGHT: '2'
});

class Graphy    {
    /**
     * @param {number} radius - vertex radius
     */
    constructor(radius, ctx) {
        this.radius = radius;   //I like 7.5
        this.gridSize = radius * 4;
        this.cellHalf = this.gridSize / 2;
        this.vertices = new Map();
        this.ctx = ctx;
    }
    /**
     * @param {mouseEvent/pointerEvent} event
     * @param {mouseButton} button -- enum
     */
    clickCanvas(event, button)    {
        let xCoord = Math.round(event.offsetX/this.gridSize) * this.gridSize;
        let yCoord = Math.round(event.offsetY/this.gridSize) * this.gridSize;
        if(xCoord == 0 || yCoord == 0)   {
            console.log(`You cannot place vertices on the edge of the canvas`);
            return;
        }
        let key = `${xCoord},${yCoord}`;
        if(button == mouseButton.RIGHT && this.vertices.has(key))    {
            console.log(`Deleted (${key})`);
            this.vertices.delete(key);
            this.ctx.clearRect(xCoord - this.cellHalf, yCoord - this.cellHalf, this.gridSize, this.gridSize);
        } else if(button == mouseButton.LEFT && !this.vertices.has(key))    {
            console.log(`Added (${key})`);
            this.vertices.set(key, true);
            this.#drawVertex(xCoord, yCoord);
        }
    }
    /**
     * @param {mouseEvent/pointerEvent} event  //WHICH ONE?????
     * @param {canvas context} ctx
     */
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
}

window.onload = function() {
    const canvas = document.getElementById("theCanvas");
    const _height = window.innerHeight - Math.floor(window.innerHeight/5);
    const _width = window.innerWidth;
    if(canvas == null)  {
        console.log("canvas has not loaded yet");
    }
    canvas.height = _height;
    canvas.width = _width;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "screen";
    const graph = new Graphy(10, ctx);

    canvas.addEventListener("click", (event) => {   //left click
        graph.clickCanvas(event, mouseButton.LEFT);
        console.log(`${event.button}`);
        //console.log(`Click registered at (${event.offsetX}, ${event.offsetY})`);
    });
    canvas.addEventListener("contextmenu", (event) => { // right click
        event.preventDefault();
        graph.clickCanvas(event, mouseButton.RIGHT);
        console.log(`${event.button}`);
    });
}