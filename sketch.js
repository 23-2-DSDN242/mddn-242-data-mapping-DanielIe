let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "input_6.png";
let maskFile   = "mask_6.png";
let outputFile = "output_6.png";



var particles = [];
var n = 800;//number of particle
var noiseScale = 100;//noise scale;

var iter = 1000;



function preload() {
  sourceImg = loadImage(sourceFile);
  maskImg = loadImage(maskFile);
}

function setup () {
  let main_canvas = createCanvas(1920, 1080);
  main_canvas.parent('canvasContainer');

  imageMode(CENTER);
  noStroke();
  background(0, 0, 128);
  sourceImg.loadPixels();
  maskImg.loadPixels();
  colorMode(HSB);

  noiseDetail(2, 0);

  while(particles.length < n) {
    let pos = createVector(random(width), random(height));
    if(maskImg.get(pos.x, pos.y)[0] > 128) {
      var particle = new Object();
    
      particle.pos = pos;
      particle.onMask = 0;
      particles.push(particle);//add particle to particle list
    }
  }

}


function test1() {
  let num_lines_to_draw = 40;
  // get one scanline
  for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<1080; j++) {
    for(let i=0; i<1920; i++) {
      colorMode(RGB);
      let pix = sourceImg.get(i, j);
      // create a color from the values (always RGB)
      let col = color(pix);
      let mask = maskImg.get(i, j);

      colorMode(HSB, 360, 100, 100);
      // draw a "dimmed" version in gray
      let h = hue(col);
      let s = saturation(col);
      let b = brightness(col);

      if(mask[0] > 128) {
        set(i, j, color(h, s/1.5, min(b*1.2, 100)));
      }
      else {

        let newHue = p5.Vector.lerp(createVector(h,s), createVector(290,100), 0.5);
        let newBright = pow(b/100, 2)*100;
        //set(i, j, color(newHue.x, newHue.y, newBright));
        set(i, j, color(h, s, newBright));
      }
    }
  }
  renderCounter = renderCounter + num_lines_to_draw;
  updatePixels();
}

function test2() {
  colorMode(RGB);
  for(let i=0;i<4000;i++) {
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));
    
    let pix = sourceImg.get(x, y);
    let mask = maskImg.get(x, y);

    let f = color(red(pix), green(pix), blue(pix));
    f.setAlpha(80);

    fill(f);
    if(mask[0] > 128) {
      let pointSize = 5;
      ellipse(x, y, pointSize, pointSize);

      if(maskImg.get(x,y+10)[0] < 128) {
        f.setAlpha(random(60, 180));
        stroke(f);

        let len = random(20,230);
        
        len = limitLength(len, x,y);
        if(len == 0) continue;
        len = random(10, len);

        let weight = random(8, 15);
        strokeWeight(weight);
        
        line(x,y, x,y+len*0.333);
        strokeWeight(weight*0.6);
        line(x,y+len*0.333,x,y+len*0.75);
        strokeWeight(weight);
        line(x,y+len*0.75,x,y+len);
        strokeWeight(weight*1.25);
        line(x,y+len,x,y+len);

        //line(x,y, x,y+len);



        noStroke();
      }




    }
    else {
      f.setAlpha(random(30, 120));
      stroke(f);
      strokeWeight(1);

      if(random(0,1) < 0.01) {
        let s = color(random(0,255),random(0,255),random(0,255));
        s = lerpColor(s, color(217, 116, 227), 0.5);
        s.setAlpha(random(30, 120));

        stroke(s);
        strokeWeight(2);

      }
      
      let scale = random(0.5,5);
      line(x,y-10*scale, x,y+10*scale);
      line(x-5*scale,y, x+5*scale,y); 
      noStroke();
    }
  }
  renderCounter = renderCounter + 1;
}



function limitLength(len, x,y) {
  if(len-10 <= 10) return 0;

  for(let i = 10; i < len; i++) {
    if(maskImg.get(x,y+i)[0] > 128) {
      len = limitLength(len-5, x,y);
      break;
    }
  }

  if(len-10 <= 10) return 0;
  return len - 10;

}

function test3(iterations) {
  colorMode(RGB);
  renderCounter+= 1;
  
  strokeWeight(5);//particle size
  
  let alphaval = map(min(abs(iterations), iter), 0, iter, 8, 0);
  let colour = color(100,50,255);
  
  colorMode(HSB, 360, 100, 100);
  let chue = map(iterations, -iter, iter, 244, 348);
  
  let newcolour = color(chue, saturation(colour), brightness(colour));
  colorMode(RGB);
  
  
  for(var i=0; i<particles.length; i++){
    var p = particles[i];//pick a particle
    p.pos.add(curl(p.pos.x/noiseScale, p.pos.y/noiseScale));

    if(maskImg.get(p.pos.x, p.pos.y)[0] < 128) {
      p.onMask += 0.05;
      p.onMask = min(8, p.onMask);
    } else if(p.onMask > 0) {
      p.onMask -= 0.1;
    }

    let finalcolor = color(red(newcolour), green(newcolour), blue(newcolour), max(alphaval-p.onMask, 0));
    stroke(finalcolor);

    point(p.pos.x, p.pos.y);
  }
}

function curl(x, y){
  var EPSILON = 0.001;//sampling interval
  //Find rate of change in X direction
  var n1 = noise(x + EPSILON, y);
  var n2 = noise(x - EPSILON, y);
  //Average to find approximate derivative
  var cx = (n1 - n2)/(2 * EPSILON);

  //Find rate of change in Y direction
  n1 = noise(x, y + EPSILON);
  n2 = noise(x, y - EPSILON);

  //Average to find approximate derivative
  var cy = (n1 - n2)/(2 * EPSILON);
  
  //return new createVector(cx, cy);//gradient toward higher position
  return new createVector(cy, -cx);//rotate 90deg
}

function draw () {

  if(renderCounter < 1080) test1();
  else if(renderCounter < 1085) test2();
  else {
    test3((renderCounter-1085) - iter);
  }
  
  if(renderCounter > 1085 + iter*2) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    saveArtworkImage(outputFile);
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
