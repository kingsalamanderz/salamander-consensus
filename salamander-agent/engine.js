class SalamanderConsensus {
  constructor() {
    this.proposals = [];
  }

  createProposal(title, description) {
    const proposal = {
      id: Date.now().toString(),
      title,
      description,
      votes: { yes: 0, no: 0 },
      status: "ACTIVE"
    };
    this.proposals.push(proposal);
    return proposal;
  }

  vote(id, choice) {
    const proposal = this.proposals.find(p => p.id === id);
    if (!proposal || proposal.status !== "ACTIVE") return null;

    if (choice === "yes") proposal.votes.yes++;
    if (choice === "no") proposal.votes.no++;

    return proposal;
  }

  finalize(id) {
    const proposal = this.proposals.find(p => p.id === id);
    if (!proposal) return null;

    proposal.status = "FINALIZED";
    return proposal;
  }

  getProposals() {
    return this.proposals;
  }
}

module.exports = SalamanderConsensus;
