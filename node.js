cat > /storage/emulated/0/Download/safe-sim.js <<'EOF'
// safe-sim.js  -- SAFE simulation for Termux (no network activity)
const duration = parseInt(process.argv[2], 10) || 30; // seconds
const tickMs = parseInt(process.argv[3], 10) || 100; // print interval (ms)
const summaryEvery = parseInt(process.argv[4], 10) || 10; // show summary every N ticks

let count = 0;
let good = 0;
let bad = 0;

function stepCounts() {
  bad += Math.floor(Math.random() * 150);
  good += Math.floor(Math.random() * 3);
}

console.log(`[SAFE-SIM] Start simulation for ${duration}s (tick ${tickMs}ms). Press CTRL+C to stop.`);

const iv = setInterval(() => {
  count++;
  stepCounts();

  const repeats = 2;
  for (let i = 0; i < repeats; i++) {
    console.log('the service is unavailable.');
  }

  if (count % summaryEvery === 0) {
    console.log(`ended count: ${count} Good: ${good} Bad: ${bad}`);
  }
}, tickMs);

setTimeout(() => {
  clearInterval(iv);
  console.log(`[SAFE-SIM] Finished. Total ticks: ${count}. Good: ${good}. Bad: ${bad}.`);
  process.exit(0);
}, duration * 1000);

process.on('SIGINT', () => {
  clearInterval(iv);
  console.log('\\n[SAFE-SIM] Interrupted. Exiting gracefully.');
  console.log(`Final counts: ticks=${count} Good=${good} Bad=${bad}`);
  process.exit(0);
});
EOF