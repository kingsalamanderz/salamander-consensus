import readline from "readline";
import crypto from "crypto";

/* ===== COLOR SYSTEM ===== */
const red = (t) => `\x1b[31m${t}\x1b[0m`;
const blue = (t) => `\x1b[34m${t}\x1b[0m`;
const green = (t) => `\x1b[32m${t}\x1b[0m`;
const yellow = (t) => `\x1b[33m${t}\x1b[0m`;
const cyan = (t) => `\x1b[36m${t}\x1b[0m`;

/* ===== ENGINE ===== */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let proposals = [];
let validators = [];

function header() {
  console.clear();
  console.log(red("╔══════════════════════════════════════╗"));
  console.log(red("║  SALAMANDER CONSENSUS • HEAT CORE  ║"));
  console.log(red("╚══════════════════════════════════════╝"));
  console.log("");
}

function id() {
  return crypto.randomBytes(3).toString("hex");
}

function decayHeat(v) {
  const now = Date.now();
  const hours = (now - v.lastActive) / (1000 * 60 * 60);
  v.heat = Math.max(0.5, v.heat - hours * 0.1);
  v.lastActive = now;
}

function render() {
  header();

  console.log(blue("VALIDATOR POOL"));
  console.log(blue("────────────────────────────"));

  if (validators.length === 0)
    console.log(yellow("No validators registered.\n"));

  validators.forEach(v => {
    decayHeat(v);
    console.log(
      blue(`ID:${v.id} | Stake:${v.stake} | Heat:${v.heat.toFixed(2)}`)
    );
  });

  console.log("");

  console.log(red("PROPOSALS"));
  console.log(red("────────────────────────────"));

  if (proposals.length === 0)
    console.log(yellow("No proposals available.\n"));

  proposals.forEach(p => {
    console.log(
      red(`ID:${p.id} | ${p.title} | Score:${p.score.toFixed(2)} | Final:${p.finalized}`)
    );
  });

  console.log("");
  console.log(cyan("COMMANDS"));
  console.log(cyan("register | propose | vote | finalize | list | exit"));
  console.log("");
}

function registerValidator() {
  rl.question("Stake amount: ", stake => {
    validators.push({
      id: id(),
      stake: parseFloat(stake),
      heat: 1,
      lastActive: Date.now()
    });
    render();
    prompt();
  });
}

function propose() {
  rl.question("Proposal title: ", title => {
    proposals.push({
      id: id(),
      title,
      score: 0,
      finalized: false
    });
    render();
    prompt();
  });
}

function vote() {
  rl.question("Validator ID: ", vid => {
    const v = validators.find(x => x.id === vid);
    if (!v) return prompt();

    rl.question("Proposal ID: ", pid => {
      const p = proposals.find(x => x.id === pid);
      if (!p || p.finalized) return prompt();

      decayHeat(v);
      const weight = v.stake * v.heat;
      p.score += weight;
      v.heat += 0.3;
      v.lastActive = Date.now();

      console.log(green("\nVote registered successfully.\n"));
      render();
      prompt();
    });
  });
}

function finalize() {
  rl.question("Proposal ID: ", pid => {
    const p = proposals.find(x => x.id === pid);
    if (!p) return prompt();

    if (p.score >= 100) {
      console.log(green("\nConsensus Achieved.\n"));
    } else {
      console.log(yellow("\nConsensus Failed.\n"));
    }

    p.finalized = true;
    render();
    prompt();
  });
}

function handle(cmd) {
  switch (cmd.trim()) {
    case "register":
      registerValidator();
      break;
    case "propose":
      propose();
      break;
    case "vote":
      vote();
      break;
    case "finalize":
      finalize();
      break;
    case "list":
      render();
      prompt();
      break;
    case "exit":
      console.log(red("\nSalamander Engine Shutdown.\n"));
      rl.close();
      break;
    default:
      render();
      prompt();
  }
}

function prompt() {
  rl.question(cyan("salamander> "), handle);
}

render();
prompt();
