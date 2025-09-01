// // #region

// MAPPINGS
// radius=>unicode
// angle(%closed) =>unicode
// rotation => prior unicode + position in array
// sin density => unicode but this is bad because wave is stretched over length of art, which is heavily influenced by r



let artProperties = null;
let color1 = '#d6d6d6';
let color2 = '#d6d6d6';
let scheme = new ColorScheme;
let a=0;
let strokeArray = [2,4,6,8,10,12];

let letterAngles = [];
letterSpeed = [];



const generateButton = document.getElementById('generateButton');

generateButton.addEventListener('click', generateArt);




function setup() {
  let cWidth = min(windowWidth, 800);
   canvas = createCanvas(cWidth, cWidth);

   canvas.parent('canvas-container');
   
  const ctx = document.getElementById('defaultCanvas0').getContext("2d");
}

function draw() {
  clear();
  background(color1);
  noFill();
  stroke(color1);
  angleMode(DEGREES);
  translate(width/2, height/2);

   if (!artProperties) return;

  let oldAngle = 0;

  //begin rings loop
  for (let i = 0; i<artProperties.letterCount; ++i){

    rotate(oldAngle * -1);


    drawingContext.setLineDash([]);
    strokeWeight(strokeArray[artProperties.uniArray[i] % strokeArray.length]);
    rotate(map(artProperties.uniArray[i], 65, 122, 0, 360, true));
    
    let paletteIndex = (artProperties.uniSum + artProperties.uniArray[i]) % artProperties.palette.length;

    color2 = `#${artProperties.palette[paletteIndex]}`
    // console.log(`Color 2 is ${color2}`);

    function checkContrast(){ const c = chroma.contrast(color2,color1);
      // console.log(`Contrast of ${color2} and ${color1} is ${chroma.contrast(color2,color1)}`);
      return c;
    }
    let contrast = checkContrast();
    
    let step = .1;
    let change = 0;
    while(contrast<2.5){
      // paletteIndex+=1;
      // paletteIndex = paletteIndex%artProperties.palette.length;

      if(chroma.contrast(chroma(color2).darken(change),color1)>contrast){
      color2 = chroma(color2).darken(change).hex();
      }
      else{
        color2 = chroma(color2).brighten(change).hex();
      }
      contrast = checkContrast();
      change+=step;
    };


    stroke(color2);

    
    rotate(letterAngles[i]);
    beginShape()
    for (let ang=0; ang<map(artProperties.uniArray[i], 65, 122, 5, 360, true); ang++){


      // r mapped to position in index
      let baseR = map(i,0,artProperties.letterCount, 20, width/2, true);

      let r = baseR;

      let x= r*cos(ang);
      let y = r*sin(ang);
      vertex (x,y);
    }

    endShape();

    oldAngle = letterAngles[i];
  }
  rotateLetters(1);
  
}
const nameInputElement = document.getElementById('nameInput');

// nameInputElement.addEventListener('input',generateArt);

let userName = nameInputElement.value;




function generateArt(){

  const nameInputElement = document.getElementById('nameInput');

  const userName = nameInputElement.value;
  // const userName = 'Sara Kinsinger';
  console.log(userName);
  const uniArray = (()=>{
      let arr = [];
      for (let i = 0; i < userName.length; ++i){
        arr.push(userName.charCodeAt(i));
        console.log(userName.charCodeAt(i));
      }
      return arr;
  })();
  const uniSum = uniArray.reduce((a,b)=>a+b,0)
  

  artProperties = {
    originalText: userName,
    letterCount: userName.length,
    uniArray: uniArray,
    uniSum: uniSum,
    palette: buildPalette(uniSum),
    letterSpeeds: (()=>{
      let arr = [];
      let letterSpeed;
      for(let i=0; i<userName.length; ++i){
        letterSpeed = Math.round((map(uniArray[i],65, 122, 6,.1)*100))/100;
        arr.push(letterSpeed);
        }
      return arr;
    })(),
    
  };
  for (let i = 0; i<artProperties.originalText.length;++i){
    letterAngles.push(0)
};
  color1 = `#${artProperties.palette[0]}`;
;

  return artProperties;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180)
}

function getUnicodes (s,arr) {
  for (let i; i<s.length; ++i){
    arr.push(s.charCodeAt(i))
  }
}


function windowResized() {
  let cWidth = min(windowWidth, 800);
  resizeCanvas(cWidth, cWidth);


  canvas.parent('canvas-container');

  


  // noLoop()
  redraw();
  
}

function buildPalette(uniSum){
  // let hue1 = map(uniSum, uniSumMin, uniSumMax, 0, 360, true);
  let hue1 = uniSum % 360;

  scheme.from_hue(hue1)         // Start the scheme 
      .scheme('triade')   
      .variation('default')
      // .distance(.75);   

  var colors = scheme.colors();
  console.log(colors);
  return colors;
}



function rotateLetters(speed){
  for(let i =0; i<artProperties.originalText.length; ++i){
    if (['a','e','i','o','u'].includes(artProperties.originalText[i])){
      letterAngles[i] = ((letterAngles[i] - (artProperties.letterSpeeds[i]*speed)) % 360);
    }
    else {letterAngles[i]= ((letterAngles[i] + (artProperties.letterSpeeds[i]*speed)) % 360);
    }
  }
}

