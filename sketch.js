// MAPPINGS
// radius=>unicode
// angle(%closed) =>unicode
// rotation => prior unicode + position in array
// sin density => unicode but this is bad because wave is stretched over length of art, which is heavily influenced by r



let artProperties = null;
let color1 = '#CDFC0F';
let color2 ='#0d3263';
let color3 = '#6E1912';

function setup() {
  let width = document.getElementById('canvas-container').getBoundingClientRect().width;
  let height = 600;
  let canvas = createCanvas(width, height);

  canvas.parent('canvas-container');


  const generateButton = document.getElementById('generateButton');

  generateButton.addEventListener('click', generateArt);
  


  // noLoop()
  
}

function draw() {
  clear();
  background(color2);
  noFill();
  stroke(color1);
  angleMode(DEGREES);
  translate(width/2, height/2);

  for (let i = 0; i<artProperties.letterCount; ++i){

    drawingContext.setLineDash([]);
    strokeWeight(1);
    rotate(map(artProperties.uniArray[i], 65, 122, 0, 360, true));

    

    beginShape()
    for (let ang=0; ang<map(artProperties.uniArray[i], 65, 122, 5, 360, true); ang++){
      //mapped to unicode
      // var r=map(artProperties.uniArray[i], 65, 122, 20, width/2, true);

      // r mapped to position in index
      let baseR = map(i,0,artProperties.letterCount, 20, width/2, true);
      // r but adding sin
      let r = map(sin(ang*map(artProperties.uniArray[i], 65, 122, 1, 100)),-1,1, baseR-5,baseR+5, true);

      
      var x= r*cos(ang);
      var y = r*sin(ang);
      vertex (x,y);
    }

    endShape();
    // rotate(map(artProperties.uniArray[i], 65, 122, 0, 360, true)*-1);
    
  }
}
const nameInputElement = document.getElementById('nameInput');

nameInputElement.addEventListener('input',generateArt);

let userName = nameInputElement.value;


function generateArt(){
  console.log("Button was clicked.")

  const nameInputElement = document.getElementById('nameInput');

  const userName = nameInputElement.value;
  // const userName = 'Sara Kinsinger';
  console.log(userName);


  artProperties = {
    originalText: userName,
    letterCount: userName.length,
    uniArray: (()=>{
      let arr = [];
      for (let i = 0; i < userName.length; ++i){
        arr.push(userName.charCodeAt(i));
        console.log(userName.charCodeAt(i));
      }
      return arr;
    })()
  };

  redraw()
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180)
}

function getUnicodes (s,arr) {
  for (let i; i<s.length; ++i){
    arr.push(s.charCodeAt(i))
  }
}

