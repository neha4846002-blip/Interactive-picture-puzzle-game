const puzzleGrid=document.getElementById("puzzleGrid")
const piecesBox=document.getElementById("piecesBox")

const gridSelect=document.getElementById("gridSize")

const timerText=document.getElementById("timer")
const scoreText=document.getElementById("score")

const maxMovesText=document.getElementById("maxMoves")
const movesUsedText=document.getElementById("movesUsed")
const movesLeftText=document.getElementById("movesLeft")

const imageViewsText=document.getElementById("imageViews")

const previewImage=document.getElementById("previewImage")

let gridSize=4
let imageSize=400

let selectedImage=""

let draggedPiece=null

let timer=0
let timerInterval=null

let score=0

let movesUsed=0
let maxMoves=0

let imageViews=0

function loadRandomImage(){

selectedImage="https://picsum.photos/400?random="+Math.random()

previewImage.src=selectedImage

}

function startTimer(){

clearInterval(timerInterval)

timer=0

timerText.textContent=0

timerInterval=setInterval(()=>{

timer++

timerText.textContent=timer

},1000)

}

function calculateMaxMoves(){

maxMoves=gridSize*gridSize*4

maxMovesText.textContent=maxMoves

movesLeftText.textContent=maxMoves

}

function createGrid(){

puzzleGrid.innerHTML=""

puzzleGrid.style.gridTemplateColumns=`repeat(${gridSize},1fr)`
puzzleGrid.style.gridTemplateRows=`repeat(${gridSize},1fr)`

for(let i=0;i<gridSize*gridSize;i++){

let cell=document.createElement("div")

cell.className="cell"

cell.dataset.index=i

cell.addEventListener("dragover",e=>e.preventDefault())

cell.addEventListener("drop",dropPiece)

puzzleGrid.appendChild(cell)

}

}

function createPieces(){

piecesBox.innerHTML=""

piecesBox.style.gridTemplateColumns=`repeat(${gridSize},1fr)`

let pieces=[]

let pieceSize=imageSize/gridSize

for(let r=0;r<gridSize;r++){

for(let c=0;c<gridSize;c++){

let piece=document.createElement("div")

piece.className="piece"

piece.draggable=true

piece.style.width=pieceSize+"px"
piece.style.height=pieceSize+"px"

piece.style.backgroundImage=`url(${selectedImage})`

piece.style.backgroundSize=`${imageSize}px ${imageSize}px`

piece.style.backgroundPosition=`-${c*pieceSize}px -${r*pieceSize}px`

piece.dataset.correct=r*gridSize+c

piece.addEventListener("dragstart",dragStart)

pieces.push(piece)

}

}

pieces.sort(()=>Math.random()-0.5)

pieces.forEach(p=>piecesBox.appendChild(p))

}

function dragStart(e){

draggedPiece=e.target

}

function dropPiece(e){

let cell=e.target

if(cell.children.length===0){

cell.appendChild(draggedPiece)

movesUsed++

movesUsedText.textContent=movesUsed

movesLeftText.textContent=maxMoves-movesUsed

if(draggedPiece.dataset.correct==cell.dataset.index){

score+=10

draggedPiece.draggable=false

}else{

score-=1

}

scoreText.textContent=score

checkGame()

}

}

piecesBox.addEventListener("dragover",e=>e.preventDefault())

piecesBox.addEventListener("drop",()=>{

if(draggedPiece){

piecesBox.appendChild(draggedPiece)

}

})

function checkGame(){

if(movesUsed>=maxMoves){

clearInterval(timerInterval)

alert("Game Over")

return

}

let correct=0

document.querySelectorAll(".cell").forEach(cell=>{

if(cell.children.length>0){

let piece=cell.children[0]

if(piece.dataset.correct==cell.dataset.index){

correct++

}

}

})

if(correct===gridSize*gridSize){

clearInterval(timerInterval)

alert("🎉 Congratulations! Puzzle Completed")

}

}

function showImage(){

imageViews++

imageViewsText.textContent=imageViews

if(imageViews>3){

score-=10

scoreText.textContent=score

alert("Image view limit exceeded. Score -10")

}

previewImage.style.display="block"

setTimeout(()=>{

previewImage.style.display="none"

},10000)

}

function startGame(){

gridSize=parseInt(gridSelect.value)

movesUsed=0
score=0
timer=0
imageViews=0

scoreText.textContent=0
movesUsedText.textContent=0
timerText.textContent=0
imageViewsText.textContent=0

loadRandomImage()

calculateMaxMoves()

createGrid()

createPieces()

startTimer()

}