let numPlanes = 100; // Numero di piani
let positions = [];
let images = [];
let planeImages = [];

let cameraX = 0, cameraY = 0, zoom = 500;
let targetCameraX = 0, targetCameraY = 0, targetZoom = 500;
let easing = 0.1;
let zoomSpeed = 50;
let moveSpeed = 0.01;

let isDragging = false;
let lastMouseX, lastMouseY;
let minDistance = 50;

function preload() {
    let fileNames = [
        "test.png", // Assicurati che esista questa immagine!
        "57426-15712409 1.png", 
        "410041_2 1.png"
    ];

    for (let i = 0; i < fileNames.length; i++) {
        let imagePath = "images/" + fileNames[i]; // Percorso corretto

        images.push(loadImage(imagePath, 
            () => console.log("✅ Immagine caricata:", imagePath), 
            () => console.error("❌ ERRORE: Immagine non trovata!", imagePath)
        ));
    }
}

function setup() {
    createCanvas(1350, 800, WEBGL);
    noStroke();

    if (images.length === 0) {
        console.error("❌ Le immagini non sono state caricate!");
        return;
    }

    for (let i = 0; i < numPlanes; i++) {
        let newPos;
        let validPosition;

        do {
            newPos = createVector(random(-300, 300), random(-200, 200), random(-300, 300));
            validPosition = true;

            for (let j = 0; j < i; j++) {
                if (p5.Vector.dist(newPos, positions[j]) < minDistance) {
                    validPosition = false;
                    break;
                }
            }
        } while (!validPosition);

        positions.push(newPos);
        planeImages.push(random(images));
    }
}

function draw() {
    background(255);

    cameraX += (targetCameraX - cameraX) * easing;
    cameraY += (targetCameraY - cameraY) * easing;
    zoom += (targetZoom - zoom) * easing;

    translate(0, 0, -zoom);
    rotateX(cameraY);
    rotateY(cameraX);

    for (let i = 0; i < numPlanes; i++) {
        push();
        translate(positions[i].x, positions[i].y, positions[i].z);
        if (planeImages[i]) {
            texture(planeImages[i]);
        }
        plane(50, 50);
        pop();
    }
}

function mouseWheel(event) {
    targetZoom += event.delta * zoomSpeed * 0.1;
}

function mousePressed() {
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
}

function mouseReleased() {
    isDragging = false;
}

function mouseDragged() {
    if (isDragging) {
        let deltaX = (mouseX - lastMouseX) * moveSpeed;
        let deltaY = (mouseY - lastMouseY) * moveSpeed;

        targetCameraX += deltaX;
        targetCameraY += deltaY;

        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}
