const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingSystem Smart Contract", function () {
  let votingSystem;
  let owner, admin1, voter1, voter2, voter3, nonVoter;

  beforeEach(async function () {
    [owner, admin1, voter1, voter2, voter3, nonVoter] = await ethers.getSigners();

    const VotingSystemFactory = await ethers.getContractFactory("VotingSystem");
    votingSystem = await VotingSystemFactory.deploy();
    await votingSystem.waitForDeployment();
  });

  describe("Deployment & Roles", function () {
    it("Should set deployer as owner and initial admin", async function () {
      expect(await votingSystem.owner()).to.equal(owner.address);
      expect(await votingSystem.isAdmin(owner.address)).to.be.true;
    });

    it("Owner can add and remove another admin", async function () {
      await votingSystem.addAdmin(admin1.address);
      expect(await votingSystem.isAdmin(admin1.address)).to.be.true;

      await votingSystem.removeAdmin(admin1.address);
      expect(await votingSystem.isAdmin(admin1.address)).to.be.false;
    });

    it("Non-owner cannot add admin", async function () {
      await expect(
        votingSystem.connect(voter1).addAdmin(voter2.address)
      ).to.be.revertedWith("Only contract owner can execute this");
    });
  });

  describe("Election Lifecycle & Registration", function () {
    it("Admin can create an election with candidates", async function () {
      const title = "National Presidential Election 2026";
      const desc = "General election for national president";
      const duration = 60; // 60 mins
      const names = ["Alice Johnson", "Bob Smith", "Charlie Davis"];
      const parties = ["Democratic Alliance", "Progressive Front", "Independent"];
      const avatars = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
      ];
      const manifestos = [
        "Economy & Healthcare reform",
        "Climate change & Technology innovation",
        "Transparency & Education empowerment"
      ];

      await expect(
        votingSystem.createElection(title, desc, duration, false, names, parties, avatars, manifestos)
      ).to.emit(votingSystem, "ElectionCreated");

      expect(await votingSystem.electionCount()).to.equal(1);

      const election = await votingSystem.getElection(1);
      expect(election.title).to.equal(title);
      expect(election.candidateCount).to.equal(3);
      expect(election.totalVotes).to.equal(0);

      const candidates = await votingSystem.getCandidates(1);
      expect(candidates.length).to.equal(3);
      expect(candidates[0].name).to.equal("Alice Johnson");
      expect(candidates[1].name).to.equal("Bob Smith");
    });

    it("Admin can register individual and batch voters", async function () {
      await votingSystem.createElection(
        "Student Council 2026", "Campus voting", 30, false,
        ["Cand 1", "Cand 2"], ["Party A", "Party B"], ["url1", "url2"], ["man1", "man2"]
      );

      // Single registration
      await votingSystem.registerVoter(1, voter1.address);
      let status1 = await votingSystem.getVoterStatus(1, voter1.address);
      expect(status1.isRegistered).to.be.true;
      expect(status1.hasVoted).to.be.false;

      // Batch registration
      await votingSystem.batchRegisterVoters(1, [voter2.address, voter3.address]);
      let status2 = await votingSystem.getVoterStatus(1, voter2.address);
      let status3 = await votingSystem.getVoterStatus(1, voter3.address);
      expect(status2.isRegistered).to.be.true;
      expect(status3.isRegistered).to.be.true;

      const registered = await votingSystem.getRegisteredVoters(1);
      expect(registered.length).to.equal(3);
    });

    it("Self-registration works only if openRegistration is enabled", async function () {
      // Closed registration election
      await votingSystem.createElection(
        "Closed Election", "Desc", 30, false,
        ["A", "B"], ["P1", "P2"], ["u1", "u2"], ["m1", "m2"]
      );

      await expect(
        votingSystem.connect(voter1).selfRegister(1)
      ).to.be.revertedWith("Election does not permit open self-registration");

      // Open registration election
      await votingSystem.createElection(
        "Open Community Poll", "Desc", 30, true,
        ["A", "B"], ["P1", "P2"], ["u1", "u2"], ["m1", "m2"]
      );

      await votingSystem.connect(voter1).selfRegister(2);
      let status = await votingSystem.getVoterStatus(2, voter1.address);
      expect(status.isRegistered).to.be.true;
    });
  });

  describe("Voting Mechanics & Security", function () {
    beforeEach(async function () {
      await votingSystem.createElection(
        "Mayoral Race", "City Mayor Election", 60, false,
        ["Candidate Alpha", "Candidate Beta"], ["Party Blue", "Party Green"], ["url1", "url2"], ["man1", "man2"]
      );
      await votingSystem.registerVoter(1, voter1.address);
      await votingSystem.registerVoter(1, voter2.address);
    });

    it("Authorized voter can cast vote and increments tally", async function () {
      await expect(votingSystem.connect(voter1).castVote(1, 1))
        .to.emit(votingSystem, "VoteCast")
        .withArgs(1, voter1.address, 1, (val) => val > 0);

      const status = await votingSystem.getVoterStatus(1, voter1.address);
      expect(status.hasVoted).to.be.true;
      expect(status.votedCandidateId).to.equal(1);

      const candidates = await votingSystem.getCandidates(1);
      expect(candidates[0].voteCount).to.equal(1);
      expect(candidates[1].voteCount).to.equal(0);

      const election = await votingSystem.getElection(1);
      expect(election.totalVotes).to.equal(1);
    });

    it("Prevents double voting", async function () {
      await votingSystem.connect(voter1).castVote(1, 1);

      await expect(
        votingSystem.connect(voter1).castVote(1, 2)
      ).to.be.revertedWith("Voter has already cast a ballot in this election");
    });

    it("Rejects votes from unregistered voters", async function () {
      await expect(
        votingSystem.connect(nonVoter).castVote(1, 1)
      ).to.be.revertedWith("Voter is not registered or authorized for this election");
    });

    it("Rejects votes for invalid candidate IDs", async function () {
      await expect(
        votingSystem.connect(voter1).castVote(1, 99)
      ).to.be.revertedWith("Invalid candidate ID");
    });

    it("Rejects votes once election is manually ended", async function () {
      await votingSystem.endElection(1);

      await expect(
        votingSystem.connect(voter1).castVote(1, 1)
      ).to.be.revertedWith("Election is not active");
    });
  });
});
