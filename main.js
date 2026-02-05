
function placeVertex(e, arr, ctx) {
    arr.push({x: e.offsetX, y: e.offsetY});
    drawVertex(e.offsetX, e.offsetY, ctx);
    return;
}
/**
 * @param {mouseEvent/pointerEvent} e  //WHICH ONE?????
 * @param {canvas context} ctx
 */
function drawVertex(x, y, ctx) {
    ctx.beginPath();
    ctx.arc(x, y, 7.5, 0, Math.PI*2, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.stroke();
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
    vertices = new Array();

    canvas.addEventListener("click", (event) => {
        placeVertex(event, vertices, ctx);
        console.log(`Click registered at ( ${event.x}, ${event.y} ) OR ( ${event.offsetX}, ${event.offsetY} )`);
    });
}