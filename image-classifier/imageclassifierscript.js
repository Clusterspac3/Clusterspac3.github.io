
let model;
let labels = {};

async function loadModel() {
    model = await cocoSsd.load();
    console.log("Coco SSD model loaded successfully");
    document.getElementById('imageUpload').disabled = false;
}

async function classifyImage(imageElement) {
    if (!model) {
        console.error("Model not loaded yet");
        return;
    }

    const predictions = await model.detect(imageElement);
    displayCocoPredictions(predictions);
}

function displayCocoPredictions(predictions) {
    const predictionList = document.getElementById('predictionList');
    predictionList.innerHTML = '';

    predictions.forEach(prediction => {
        const listItem = document.createElement('li');
        listItem.innerText = `${prediction.class}: ${(prediction.score * 100).toFixed(2)}% confidence`;
        predictionList.appendChild(listItem);
    });
}

// Load labels
async function loadLabels() {
    const response = await fetch('https://storage.googleapis.com/download.tensorflow.org/data/imagenet_class_index.json');
    const data = await response.json();
    labels = Object.fromEntries(Object.entries(data).map(([k, v]) => [parseInt(k), v[1]]));
    console.log("Labels loaded", labels);
}

// Softmax function to normalize prediction scores
function softmax(values) {
    const expValues = values.map(Math.exp);
    const sumExpValues = expValues.reduce((a, b) => a + b, 0);
    return expValues.map(value => value / sumExpValues);
}

// Display only the top prediction with confidence score
function displayTopPrediction(predictions) {
    const predictionList = document.getElementById('predictionList');
    predictionList.innerHTML = '';

    // Find the highest confidence prediction
    const bestPrediction = Array.from(predictions)
        .map((score, index) => ({ label: labels[index] || `Class ${index}`, score }))
        .sort((a, b) => b.score - a.score)[0];  // Take the top prediction

    if (bestPrediction) {
        const listItem = document.createElement('li');
        listItem.innerText = `${bestPrediction.label}: ${(bestPrediction.score * 100).toFixed(2)}% confidence`;
        predictionList.appendChild(listItem);
    }
}

// Image upload and classification process
document.getElementById('imageUpload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const imgElement = document.getElementById('uploadedImage');
        imgElement.src = reader.result;

        imgElement.onload = function() {
            classifyImage(imgElement);
        };
    };
    
    if (file) {
        reader.readAsDataURL(file);
    }
});

loadModel();
loadLabels();
