function range(size) {
    return Array.from(new Array(size).keys());
}

function Text(label) {
    return document.createTextNode(label);
}

function Button(label, onClick) {
    const button = document.createElement('button');
    button.onclick = onClick;
    button.classList.add('button');
    button.appendChild(Text(label));
    return button;
}

function OperationButtons(store, obx, ops) {
	ops = ops || ['+', '-', '*'];
	
	const pushTo = (operation) => () => {
		store.push(operation);
		obx.updateDisplay(store.join(''));
	}

    return ops.map(o => Button(o, pushTo(o)));
}

function NumberButtons(store, obx, size, breakAt) {
	size = size || 10;
	breakAt = breakAt || 3;

    const pushTo = (digit) => () => {
        store.push(digit);
        obx.updateDisplay(store.join(''));
    }

    const createButton = (index) => {
        const digit = (index + 1) % size;
        return Button(digit, pushTo(digit));
	}
	
	const addBreaks = (acc, button, index) => {
		if(index % 3 === 0) acc.push(document.createElement('br'));
		acc.push(button);
		return acc;
	}

    return range(size).map((_, i) => createButton(i)).reduce(addBreaks, []);
}

function OutputBox() {
    const box = document.createElement('output');
    box.classList.add('output');

    box.updateDisplay = function(text) {
        box.innerHTML = text;
    }

    return box;
}

function Box(classes) {
	const box = document.createElement('div');
	box.classList.add(classes);
	return box;
}

function Compute(inputs) {
    return eval(inputs.join(''));
}

function ResultButton(store, obx) {
    return Button('=', function() {
		obx.updateDisplay(Compute(store));
		store.splice(0, store.length);
    });
}

function Calculator(mountId) {
    let store = [];
    const public = {};

    public.render = function(id) {
        id = id || mountId;
		const shell = document.getElementById(id);
		const output = OutputBox();
		const result = ResultButton(store, output);
		const numbers = Box("none");
		const operations = Box("row");

        NumberButtons(store, output).map(nb => numbers.appendChild(nb));
        OperationButtons(store, output).map(ob => operations.appendChild(ob));
		
		[output, numbers, operations, result].map(k => shell.appendChild(k));
    }

    return public;
}

function init() {
    window.addEventListener('load', function() {
        Calculator("app").render();
    });
}

init();
