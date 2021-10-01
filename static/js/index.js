const loadModelBtn = document.getElementById('load-btn');
const submitBtn = document.getElementById('submit-btn');
const clearBtn = document.getElementById('clear-btn');
const guessText = document.getElementById('guess-text');
const name = document.getElementById('name-text');
const supportModal = document.getElementById('modal2');
const baseUrl = 'https://doodleai.herokuapp.com'

	
const categories = ['airplane',
'mailbox',
'fish', 
'face', 
'bowtie',
'butterfly', 
'umbrella', 
'syringe', 
'star', 
'car'].sort();

const sess = new onnx.InferenceSession();
console.log("in the sess object creation");
let isModelLoaded =true;
//
//app.use(cors(corsOptions))

document.addEventListener('DOMContentLoaded', () => {
    const elems = document.querySelectorAll('.modal');
    const instances = M.Modal.init(elems, {});
	const loadModelBtn = document.getElementById('load-btn');
alert(loadModelBtn);
const clearBtn = document.getElementById('clear-btn');
const guessText = document.getElementById('guess-text');
const name = document.getElementById('name-text');
const supportModal = "";//document.getElementById('modal2');
});

submitBtn.addEventListener('click', async (e) => {
	randomNoRepeats(categories)
})

loadModelBtn.addEventListener('click', async (e) => {
    e.preventDefault();
	console.log("in load button function")
	

    if (!isWebGLEnabled()) {
		console.log("into the web function")
        console.log('Not enabled!');
        M.Modal.getInstance(supportModal).open();
        return;
    }

    if (isModelLoaded) return;

    loadModelBtn.classList.add('disabled');
    loadModelBtn.innerText = 'Loading Model';
    //await sess.loadModel(baseUrl + "C:\\Users\\AbhishekKetha\\Downloads\\DoodleAI-master (1)\\DoodleAI-master\\static\\model\\onnx_model.onnx");
	//await sess.loadModel( "http:\\127.0.0.1:5000\\C:\\Users\\AbhishekKetha\\Downloads\\DoodleAI-master (1)\\DoodleAI-master\\static\\model\\onnx_model.onnx");
	//await sess.loadModel("./static/model/onnx_model.onnx");
	await sess.loadModel("./static/model/onnx_model (2).onnx");
	//await sess.loadModel(baseUrl + "\\static\\model\\onnx_model.onnx");
	//await sess.loadModel(baseUrl + "C:\\Users\\AbhishekKetha\\Downloads\\DoodleAI-master (1)\\DoodleAI-master\\static\\model\\onnx_model.onnx");


    isModelLoaded = true;
    loadModelBtn.innerText = 'Model Loaded';
    guessText.innerText = 'Now you can draw!';
	randomNoRepeats(categories)
});

async function predict() {
    guessText.innerText = 'I am thinking...';

    doodle = get();
    doodle.resize(28, 28);
    doodle.loadPixels();
    const input = [];
    for (let i = 0; i < doodle.pixels.length; i += 4) {
        input.push(map(255 - doodle.pixels[i], 0, 255, 0, 1));
    }

    const tensorInput = new onnx.Tensor(new Float32Array(input), "float32", [1, 1, 28, 28]);

    const outputMap = await sess.run([tensorInput]);
    const outputTensor = outputMap.values().next().value;
    const predictions = outputTensor.data;
    const answer = categories[predictions.indexOf(Math.max.apply(null, predictions))].split('_').join(' ');

    guessText.innerText = 'I thinks it is... ' + answer;
}

clearBtn.addEventListener('click', (e) => {
    guessText.innerText = '';
    background(255);
});

function randomNoRepeats(array) {
  var copy = array.slice(0);
	  
    if (copy.length < 1) { copy = array.slice(0); }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 0);
    console.log("item name :   " +item)
    name.innerText='draw a ' + item;
    document.getElementById('name-text').innerHTML = "draw a "+item
    return item;
  
}

function setup() {
    isModelLoaded = false;
    guessText.innerText = '';
    cvs = createCanvas(308, 308);
    cvs.parent('canvas');
    background(255);
}
function draw() {
    strokeWeight(8);
    stroke(0);

    if (mouseIsPressed && isMouseOnCanvas()) {
        if (isModelLoaded) {
            line(pmouseX, pmouseY, mouseX, mouseY);
            predict();
        } else {
            guessText.innerText = 'You need to load the model first!';
        }
    }
}

function isMouseOnCanvas() {
    return mouseX >= 0 && mouseX <= 308 && mouseY >= 0 && mouseY <= 308;
}

function isWebGLEnabled() {
    const canvas = document.createElement('canvas');
    const attributes = {
        alpha: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        depth: false,
        stencil: false,
        failIfMajorPerformanceCaveat: true
    };
    return null != (canvas.getContext('webgl', attributes) ||
        canvas.getContext('experimental-webgl', attributes));
}
