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
     * @param {hashmap} this.vertices
     * @param {canvas context} ctx
     */
    clickCanvas(event)    {
        let xCoord = Math.round(event.offsetX/this.gridSize) * this.gridSize;
        let yCoord = Math.round(event.offsetY/this.gridSize) * this.gridSize;
        let key = `${xCoord},${yCoord}`;
        if(this.vertices.has(key))    {
            console.log(`deleted (${key})`);
            this.vertices.delete(key);
            this.ctx.clearRect(xCoord - this.cellHalf, yCoord - this.cellHalf, this.gridSize, this.gridSize);
        } else /*if(!this.vertices.has(key))*/{
            console.log(`added (${key})`);
            this.vertices.set(key, true);
            this.#drawVertex(xCoord, yCoord);
        }
    }
    /**
     * @param {mouseEvent/pointerEvent} event  //WHICH ONE?????
     * @param {canvas context} ctx
     */
    #drawVertex(x, y) { //supposed to be private now # does that I think
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
    const graph = new Graphy(7.5, ctx);

    canvas.addEventListener("click", (event) => {
        graph.clickCanvas(event);
        //console.log(`Click registered at (${event.offsetX}, ${event.offsetY})`);
    });
}