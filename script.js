var originalImageData;

function previewImage(event) {
    var input = event.target;
    var reader = new FileReader();

    reader.onload = function() {
        var originalImage = document.getElementById('originalImage');
        originalImage.src = reader.result;
        originalImage.style.display = 'inline';

        var outputImage = document.getElementById('outputImage');
        outputImage.src = reader.result;

        var canvas = document.getElementById('outputCanvas');
        var ctx = canvas.getContext('2d');
        var image = new Image();
        image.src = reader.result;

        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            document.getElementById('buttonsContainer').style.display = 'flex';
        };
    };

    reader.readAsDataURL(input.files[0]);
}

async function applyNoiseDither() {
    await loader();
    var canvas = document.getElementById('outputCanvas');
    var ctx = canvas.getContext('2d');

    ctx.drawImage(document.getElementById('originalImage'), 0, 0);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var ditheredData = noiseDither(imageData);

    ctx.putImageData(ditheredData, 0, 0);

    var outputImage = document.getElementById('outputImage');
    outputImage.src = canvas.toDataURL();
    outputImage.style.display = 'inline';
    document.getElementById('type').innerHTML = "Noise Dither";
}

async function applyPatternDither() {
    await loader();

    var canvas = document.getElementById('outputCanvas');
    var ctx = canvas.getContext('2d');

    ctx.drawImage(document.getElementById('originalImage'), 0, 0);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var ditheredData = patternDither(imageData);

    ctx.putImageData(ditheredData, 0, 0);

    var outputImage = document.getElementById('outputImage');
    outputImage.src = canvas.toDataURL();
    outputImage.style.display = 'inline';
    document.getElementById('type').innerHTML = "Pattern Dither";
}

async function applyHalftoneDither() {
    await loader();

    var canvas = document.getElementById('outputCanvas');
    var ctx = canvas.getContext('2d');

    ctx.drawImage(document.getElementById('originalImage'), 0, 0);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var ditheredData = halftoneDither(imageData);

    ctx.putImageData(ditheredData, 0, 0);

    var outputImage = document.getElementById('outputImage');
    outputImage.src = canvas.toDataURL();
    outputImage.style.display = 'inline';
    document.getElementById('type').innerHTML = "Halftone Dither";
}

// Noise dither function
function noiseDither(imageData) {
    var pixels = imageData.data;
    for (var i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];
        var avg = (r + g + b) / 3; // grayscale value
        var noise = Math.random() * 255; // generate random noise value

        if (avg > noise) {
            pixels[i] = 255; // white
            pixels[i + 1] = 255;
            pixels[i + 2] = 255;
        } else {
            pixels[i] = 0; // black
            pixels[i + 1] = 0;
            pixels[i + 2] = 0;
        }
    }

    return imageData; // Return modified imageData
}

// Pattern dither function
function patternDither(imageData) {
    var pixels = imageData.data;
    
    for (var i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];
        var avg = (r + g + b) / 3; // grayscale value
        var normalizedValue = Math.floor(avg / 25.6); // scale to 0-9 range

        var pattern = [
            8, 3, 4,
            6, 1, 2,
            7, 5, 9
            // or any other pattern as described earlier
        ];

        if (normalizedValue >= pattern[i % 9]) {
            pixels[i] = 255; // white
            pixels[i + 1] = 255;
            pixels[i + 2] = 255;
        } else {
            pixels[i] = 0; // black
            pixels[i + 1] = 0;
            pixels[i + 2] = 0;
        }
    }
    return imageData; // Return modified imageData
}


// Halftone dither function
function halftoneDither(imageData) {
    var pixels = imageData.data;
    var width = imageData.width;
  
    for (var y = 0; y < imageData.height; y += 2) {
      for (var x = 0; x < width; x += 2) {
        var index = (x + y * width) * 4;
  
        var r = pixels[index];
        var g = pixels[index + 1];
        var b = pixels[index + 2];
        var avg = (r + g + b) / 3; // grayscale value
  
        var newValue = Math.floor(avg / (256 / 5)); // scale to 0-4 range
  
        // Create a 2x2 matrix based on the newValue
        var matrix = [
          [0, 2],
          [3, 1]
          // Add more patterns as needed
        ];
  
        for (var dy = 0; dy < 2; dy++) {
          for (var dx = 0; dx < 2; dx++) {
            var ditherValue = matrix[dy][dx];
            const newPixelValue = newValue > ditherValue ? 255 : 0;
  
            // Apply the same grayscale value to all RGB channels
            pixels[index + dx * 4 + dy * width * 4] = newPixelValue;
            pixels[index + dx * 4 + dy * width * 4 + 1] = newPixelValue;
            pixels[index + dx * 4 + dy * width * 4 + 2] = newPixelValue;
          }
        }
      }
    }
  
    return imageData; // Return modified imageData
  }
  

function dragOverHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('originalImage').style.opacity = '0.7';
}

function dropHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    var dt = event.dataTransfer;
    var files = dt.files;

    if (files.length > 0) {
        var file = files[0];

        var reader = new FileReader();
        reader.onload = function() {
            var originalImage = document.getElementById('originalImage');
            originalImage.src = reader.result;
            originalImage.style.display = 'inline';

            var outputImage = document.getElementById('outputImage');
            outputImage.src = reader.result;

            var canvas = document.getElementById('outputCanvas');
            var ctx = canvas.getContext('2d');
            var image = new Image();
            image.src = reader.result;

            image.onload = function() {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0, image.width, image.height);
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                document.getElementById('buttonsContainer').style.display = 'flex';
            };
        };

        reader.readAsDataURL(file);
    }

    document.getElementById('originalImage').style.opacity = '1';
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loader() {
    var loaders = document.getElementsByClassName('loader');
    var arrow = document.getElementById('arrow');
    var loader = loaders[0];
    loader.style.display = 'block';
    arrow.style.visibility = 'hidden';
    
    await wait(2000); // Wait for 5 seconds
    
    loader.style.display = 'none';
    arrow.style.visibility = 'visible';
}

function animation(){
    
}