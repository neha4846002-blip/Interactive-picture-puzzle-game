const startScreen=document.getElementById("startScreen")
const gameContainer=document.getElementById("gameContainer")
const startBtn=document.getElementById("startBtn")

const puzzleGrid=document.getElementById("puzzleGrid")
const piecesBox=document.getElementById("piecesBox")

const gridSelect=document.getElementById("gridSize")
const imageUpload=document.getElementById("imageUpload")
const playerNameInput=document.getElementById("playerName")

const timerText=document.getElementById("timer")
const scoreText=document.getElementById("score")
const movesLeftText=document.getElementById("movesLeft")

const previewImage=document.getElementById("previewImage")

const popup=document.getElementById("popup")
const popupTitle=document.getElementById("popupTitle")
const popupMessage=document.getElementById("popupMessage")

const leaderboardUI=document.getElementById("leaderboard")

let gridSize=4
let imageSize=400
let selectedImage=""
let draggedPiece=null

let timer=0
let timerInterval=null

let score=0
let movesUsed=0
let maxMoves=0

let previewCount=0
const previewLimit=3

const moveSound=new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg")
const correctSound=new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg")
const winSound=new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg")
const loseSound=new Audio("https://actions.google.com/sounds/v1/cartoon/boing.ogg")

function loadLeaderboard(){

let best=JSON.parse(localStorage.getItem("puzzleBestScore"))

leaderboardUI.innerHTML=""

if(best){

let li=document.createElement("li")
li.textContent="🏆 "+best.name+" - "+best.score
leaderboardUI.appendChild(li)

}else{

leaderboardUI.innerHTML="<li>No scores yet</li>"

}

}

function saveScore(score){

let name=playerNameInput.value || "Player"

let best=JSON.parse(localStorage.getItem("puzzleBestScore"))

if(!best || score>best.score){

let newBest={
name:name,
score:score
}

localStorage.setItem("puzzleBestScore",JSON.stringify(newBest))

}

}

function loadImage(){

if(imageUpload.files.length>0){

const file=imageUpload.files[0]
selectedImage=URL.createObjectURL(file)

}else{

selectedImage="https://picsum.photos/400?random="+Math.random()

}

previewImage.src=selectedImage

}

startBtn.onclick=function(){

gridSize=parseInt(gridSelect.value)

startScreen.style.display="none"
gameContainer.style.display="block"

loadImage()

previewImage.style.display="block"

setTimeout(()=>{
previewImage.style.display="none"
startGame()
},5000)

}

function startTimer(){

timerInterval=setInterval(()=>{
timer++
timerText.textContent=timer
},1000)

}

function calculateMaxMoves(){

maxMoves=gridSize*gridSize*4
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

piece.addEventListener("dragstart",e=>{
draggedPiece=e.target
})

pieces.push(piece)

}

}

pieces.sort(()=>Math.random()-0.5)

pieces.forEach(p=>piecesBox.appendChild(p))

}

piecesBox.addEventListener("dragover",e=>e.preventDefault())

piecesBox.addEventListener("drop",()=>{
if(draggedPiece){
piecesBox.appendChild(draggedPiece)
}
})

function dropPiece(e){

let cell=e.target

if(cell.children.length===0){

cell.appendChild(draggedPiece)

moveSound.play()

movesUsed++

movesLeftText.textContent=maxMoves-movesUsed

if(draggedPiece.dataset.correct==cell.dataset.index){

score+=10
correctSound.play()
draggedPiece.draggable=false

}else{

score-=1

}

scoreText.textContent=score

checkGame()

}

}

function showImage(){

previewCount++

if(previewCount>previewLimit){

loseSound.play()

showPopup("Game Over","Preview limit exceeded!")

clearInterval(timerInterval)

return

}

previewImage.style.display="block"

setTimeout(()=>{
previewImage.style.display="none"
},5000)

}

function checkGame(){

if(movesUsed>=maxMoves){

loseSound.play()

showPopup("Game Over","Better luck next time!")

clearInterval(timerInterval)

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

winSound.play()

startConfetti()

saveScore(score)

showPopup("🎉 Congratulations!","You completed the puzzle!")

clearInterval(timerInterval)

}

}

function showPopup(title,msg){

popupTitle.textContent=title
popupMessage.textContent=msg
popup.style.display="flex"

}

function restartGame(){
location.reload()
}

function startGame(){

score=0
movesUsed=0
timer=0
previewCount=0

scoreText.textContent=0
timerText.textContent=0

calculateMaxMoves()
createGrid()
createPieces()
startTimer()

}

const canvas=document.getElementById("confettiCanvas")
const ctx=canvas.getContext("2d")

canvas.width=window.innerWidth
canvas.height=window.innerHeight

let confetti=[]

function startConfetti(){

for(let i=0;i<200;i++){

confetti.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*8+4,
speed:Math.random()*3+2,
color:`hsl(${Math.random()*360},100%,50%)`
})

}

animateConfetti()

}

function animateConfetti(){

ctx.clearRect(0,0,canvas.width,canvas.height)

confetti.forEach(c=>{

ctx.fillStyle=c.color
ctx.fillRect(c.x,c.y,c.size,c.size)

c.y+=c.speed

if(c.y>canvas.height){
c.y=0
}

})

requestAnimationFrame(animateConfetti)

}

loadLeaderboard()
