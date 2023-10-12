let sourceImg=null;
let maskImg=null;
let renderCounter=0;

// change these three lines as appropiate
let sourceFile = "input_3.png";
let maskFile   = "mask_3.png";
let outputFile = "output_3.png";



var particles = []; // Swirling particles
var n = 800; // Particle amount
var noiseScale = 100; // Noise scale;

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

  // Initialize particles on glowing areas
  while(particles.length < n) {
    let pos = createVector(random(width), random(height));
    if(maskImg.get(pos.x, pos.y)[0] > 128) {
      var particle = new Object();
    
      particle.pos = pos; // Particle position
      particle.onMask = 0; // Frames off glowing area
      particles.push(particle); // Add particle to list
    }
  }
}


// Layer 1 (Colour correction)
function layer1() {
  let num_lines_to_draw = 40;
  // get one scanline
  for(let j=renderCounter; j<renderCounter+num_lines_to_draw && j<1080; j++) {
    for(let i=0; i<1920; i++) {
      colorMode(RGB);
      let pix = sourceImg.get(i, j);
      // create a color from the values
      let col = color(pix);
      let mask = maskImg.get(i, j);

      colorMode(HSB, 360, 100, 100);

      let h = hue(col);
      let s = saturation(col);
      let b = brightness(col);

      if(mask[0] > 128) { // On mask
        set(i, j, color(h, s/1.5, min(b*1.2, 100)));
      }
      else { // Off mask
        let newHue = p5.Vector.lerp(createVector(h,s), createVector(290,100), 0.5);
        let newBright = pow(b/100, 2)*100;

        set(i, j, color(h, s, newBright));
      }
    }
  }

  renderCounter = renderCounter + num_lines_to_draw;
  updatePixels();

}


// Layer 2 (Texture + drips)
function layer2() {
  colorMode(RGB);
  for(let i=0;i<10000;i++) { // Choose 10000 random pixels
    let x = floor(random(sourceImg.width));
    let y = floor(random(sourceImg.height));
    
    let pix = sourceImg.get(x, y);
    let mask = maskImg.get(x, y);

    // Colour at random position
    let f = color(red(pix), green(pix), blue(pix));
    f.setAlpha(80);
    fill(f);

    if(mask[0] > 128) { // On mask
      f.setAlpha(random(40,150));

      // Add small triangles for texture
      beginShape();
      for(let j = 0; j < 3; j++) vertex(x+random(-5,5), y+random(-5,5));
      endShape(CLOSE);

      // Pixel is at the bottom of a masked area
      if(maskImg.get(x,y+10)[0] < 128 && i < 4000) {
        f.setAlpha(random(60, 180));
        stroke(f);

        // Choose a random length for a drip
        let len = random(20,230);
        len = limitLength(len, x,y); // Limit the length if it would overlap another masked area
        if(len == 0) continue;
        len = random(10, len);

        // Random thickness
        let weight = random(8, 15);
        strokeWeight(weight);
        
        // Draw drip
        line(x,y, x,y+len*0.333);
        strokeWeight(weight*0.6);
        line(x,y+len*0.333,x,y+len*0.75);
        strokeWeight(weight);
        line(x,y+len*0.75,x,y+len);
        strokeWeight(weight*1.25);
        line(x,y+len,x,y+len);

        noStroke();
      }

    } else if(i < 4000) { // Off mask

      f.setAlpha(random(30, 120));
      stroke(f);
      strokeWeight(1);

      // 1% Chance to set to a random colour
      if(random(0,1) < 0.01) {
        let s = color(random(0,255),random(0,255),random(0,255));
        s = lerpColor(s, color(217, 116, 227), 0.5);
        s.setAlpha(random(30, 120));

        stroke(s);
        strokeWeight(2);

      }
      
      // Draw a cross for texture
      let scale = random(0.5,5);
      line(x,y-10*scale, x,y+10*scale);
      line(x-5*scale,y, x+5*scale,y); 
      noStroke();
    }
  }
  renderCounter = renderCounter + 1;
}


// Limit the length of a drip
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


// Layer 3 (Swirls)
function layer3(iterations) {
  colorMode(RGB);
  renderCounter+= 1;
  
  strokeWeight(5);
  
  // Set alpha to fade in/out
  let alphaval = map(min(abs(iterations), iter), 0, iter, 8, 0);
  let colour = color(100,50,255);
  
  colorMode(HSB, 360, 100, 100);
  let chue = map(iterations, -iter, iter, 244, 348); // Map hue
  
  // Get colour for swirl
  let newcolour = color(chue, saturation(colour), brightness(colour));
  colorMode(RGB);
  
  // Loop over particles
  for(var i=0; i<particles.length; i++){
    var p = particles[i];
    p.pos.add(swirl(p.pos.x/noiseScale, p.pos.y/noiseScale)); // Update position

    if(maskImg.get(p.pos.x, p.pos.y)[0] < 128) { // If particle goes off masked area
      // Increase alpha offset (to fade out)
      p.onMask += 0.05;
      p.onMask = min(8, p.onMask);
    } else if(p.onMask > 0) {
      // Decrease alpha offset (to fade back in)
      p.onMask -= 0.1;
    }

    // Set swirl colour with alpha
    let finalcolor = color(red(newcolour), green(newcolour), blue(newcolour), max(alphaval-p.onMask, 0));
    stroke(finalcolor);

    // Draw swirl point
    point(p.pos.x, p.pos.y);
  }
}


// Swirl particle according to noise
function swirl(x, y){
  var eps = 0.001; // Sampling interval

  // X rate of change
  var n1 = noise(x + eps, y);
  var n2 = noise(x - eps, y);

  // Average
  var cx = (n1 - n2)/(2 * eps);

  // Y rate of change
  n1 = noise(x, y + eps);
  n2 = noise(x, y - eps);

  // Average
  var cy = (n1 - n2)/(2 * eps);
  
  return new createVector(cy, -cx); // Return amount to move by
}

function draw () {

  if(renderCounter < 1080) layer1();
  else if(renderCounter < 1085) layer2();
  else {
    layer3((renderCounter-1085) - iter);
  }
  
  if(renderCounter > 1085 + iter*2) {
    console.log("Done!")
    noLoop();
    // uncomment this to save the result
    //saveArtworkImage(outputFile);
  }
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
}
