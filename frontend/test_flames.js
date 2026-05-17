const count = parseInt(process.argv[2]);
let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
let pos = 0;
const eliminationSteps = [];

while (flames.length > 1) {
  pos = (pos + count - 1) % flames.length;
  eliminationSteps.push(flames[pos]);
  flames.splice(pos, 1);
}

console.log("Count:", count);
console.log("Eliminated:", eliminationSteps);
console.log("Survivor:", flames[0]);
