## Creative Coding 2: Bleeding Light
### By Danielle Holmes


### Part 1: Initial Ideas
Initially I had no idea where to begin in this project, so I began to just experiment with different effects I could add to images. This helped me get a feel for working with the masked images to create different effects on the black/white mask areas. None of these experiments excited me very much, but I did think it could be cool to try to create an effect at a specific part of a masked area, for example the bottom, by checking its surrounding mask pixels.

### Part 2: Theme
When I read the theme was 'something important to you', I was initially unsure of what to base my theme on. As I spend most of my time just in my room on my computer, all my hobbies and interests are within that. Because of this, I decided to theme my project around my computer setup. I thought this could be cool as I have some colourful neon lights on different parts of my setup which could act to tie everything together, eg. PC interior, keyboard, wall lighting. I love how playing games from the comfort of my own setup can transport me to other universes, and wanted to capture this in the effects I added to my images. I wanted to create a colourful/magical swirling universe effect on the glowing areas of my photos. I also decided to add a dripping effect to them to show the effect bleeding into my room, eg. the keyboard I touch, the computer that powers games, and the lights the illuminate my room. This also allowed me to experiment with adding an effect to only the bottom of masked areas. Aside from the swirling neon lights, I wanted to add a contrasting effect to the background (my room) by adding some sharp line texturing to it to contrast the 'liquid' like effect of the lights. 

### Part 2b: Drawing Techniques
There were multiple techniques I used to create the effects applied to my images. I filter my images in three layers:

Layer 1: Colour correction
- This layer acts to add some more contrast between the background (my room) and the focus of the images (the lights). I darken the dark mask areas, and lighten the white mask areas.

Layer 2: Texturing and dripping effect
- This layer adds texture to the background in the form of little + shapes drawn at random positions with random sizes/opacity. I also sometimes draw these with a semi-random colour to tie in more with the swirls, but remain contrasting.
- The drips are drawn by picking random positions, checking first if it is on the white part of the mask, and then checking if a position 10px below it is on the dark part of the mask. I then choose a viable length, and draw a series of lines to make a convincing 'drip' like effect.

Layer 3: Swirl effect
- I use perlin noise and an array of particles to create a swirling universe effect. This works by generating 800 particles, getting the rate of change (positive or negative) on both axes for a particle , and using that to 'swirl' each particle by moving it perpendicular to the change. eg. if the particle essentially hits a 'wall' (high rate of change) on the x axis, it should make a 90 degree turn and start moving vertically instead. 
- I update the positions for the particles this way for a certain amount of draw cycles to get a nice full swirl effect. I interpolate the colour at each cycle by interpolating between a start colour and end colour.
- In the case that a particle moves off of a white masked area, I experimented with different approaches, including just cutting it off there, but this looked far too harsh for the liquid-like swirling effect I wanted. Instead, I decided to lean into how the drip effect bleeds into the rest of my room, and slowly faded the swirls out if they crossed onto a black masked area. I really like the wispy effect this achieves.

### Part 3: Images
I chose what I felt were the best three images, one of the interior of my PC, one of my keyboard, and one of my wall lighting, and have included these in my submission. The three images created from the AI generated masks are also included.