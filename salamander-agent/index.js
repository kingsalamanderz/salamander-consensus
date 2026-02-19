const readline = require('readline');
const SalamanderConsensus = require('./engine');

const agent = new SalamanderConsensus();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showBanner() {
  console.log("\n========================================");
  console.log("🦎  SALAMANDER CONSENSUS AGENT ONLINE");
  console.log("========================================\n");

  console.log("Available Commands:");
  console.log("1. propose  - Create a new proposal");
  console.log("2. list     - View all proposals");
  console.log("3. vote     - Cast a vote (yes/no)");
  console.log("4. finalize - Finalize a proposal");
  console.log("5. exit     - Shutdown agent\n");
}

showBanner();

function prompt() {
  rl.question("> ", (cmd) => {

    if (cmd === "propose") {
      rl.question("Title: ", (title) => {
        rl.question("Description: ", (desc) => {
          const proposal = agent.createProposal(title, desc);
          console.log("\n📜 Proposal Created:\n", proposal, "\n");
          prompt();
        });
      });

    } else if (cmd === "list") {
      console.log("\n📊 Current Proposals:\n", agent.getProposals(), "\n");
      prompt();

    } else if (cmd === "vote") {
      rl.question("Proposal ID: ", (id) => {
        rl.question("Vote (yes/no): ", (choice) => {
          const result = agent.vote(id, choice);
          if (result) {
            console.log("\n🗳 Vote Recorded:\n", result, "\n");
          } else {
            console.log("\n❌ Invalid Proposal\n");
          }
          prompt();
        });
      });

    } else if (cmd === "finalize") {
      rl.question("Proposal ID: ", (id) => {
        const result = agent.finalize(id);
        if (result) {
          console.log("\n✅ Proposal Finalized:\n", result, "\n");
        } else {
          console.log("\n❌ Not Found\n");
        }
        prompt();
      });

    } else if (cmd === "exit") {
      console.log("\n👋 Shutting down Salamander Consensus...\n");
      rl.close();

    } else {
      console.log("\n⚠ Unknown command\n");
      prompt();
    }

  });
}

prompt();
