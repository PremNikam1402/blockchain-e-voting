const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("----------------------------------------------------");
  console.log("🚀 Deploying E-Voting Smart Contract to Network...");

  const [deployer, voter1, voter2, voter3] = await ethers.getSigners();
  console.log(`👤 Deployer (Admin) address: ${deployer.address}`);

  const VotingSystem = await ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy();
  await votingSystem.waitForDeployment();

  const contractAddress = await votingSystem.getAddress();
  console.log(`✅ VotingSystem contract deployed at: ${contractAddress}`);

  // Create initial demo elections
  console.log("\n📦 Initializing default demo elections...");

  // Election 1: 2026 Web3 Foundation Board
  const tx1 = await votingSystem.createElection(
    "2026 Web3 Foundation Board Election",
    "Official decentralized election to appoint the Lead Architect and Governance Board Members of the Web3 Foundation.",
    1440, // 24 hours (1440 minutes)
    true, // Open registration enabled
    [
      "Elena Rostova",
      "Marcus Vance",
      "Aria Chen"
    ],
    [
      "Decentralized Systems Party",
      "Open Source Innovation",
      "Privacy & Security Union"
    ],
    [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300"
    ],
    [
      "Focusing on quantum-resistant cryptography, layer-2 scalability, and democratic validator incentives.",
      "Accelerating public-goods funding, developer developer developer grants, and open-source tooling.",
      "Prioritizing zero-knowledge proofs, user privacy protections, and strict on-chain protocol governance."
    ]
  );
  await tx1.wait();
  console.log("  ✓ Created Election #1: 2026 Web3 Foundation Board");

  // Election 2: University Student Council President
  const tx2 = await votingSystem.createElection(
    "Metropolitan University Student Council Election",
    "Annual student body election to choose the University Council President for the 2026-2027 academic year.",
    720, // 12 hours
    false, // Closed / Whitelist only
    [
      "Devon Miller",
      "Sophia Patel"
    ],
    [
      "Campus Forward",
      "Student Voice Coalition"
    ],
    [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300"
    ],
    [
      "Modernizing library resources, 24/7 campus cafes, and expanding student mental health initiatives.",
      "Lowering tuition auxiliary fees, enhancing international student support, and green campus sustainability."
    ]
  );
  await tx2.wait();
  console.log("  ✓ Created Election #2: Metropolitan University Student Council Election");

  // Pre-register demo accounts
  if (voter1 && voter2 && voter3) {
    console.log("\n🗳️ Pre-authorizing demo voter accounts...");
    await (await votingSystem.registerVoter(1, deployer.address)).wait();
    await (await votingSystem.registerVoter(1, voter1.address)).wait();
    await (await votingSystem.registerVoter(1, voter2.address)).wait();
    await (await votingSystem.registerVoter(1, voter3.address)).wait();

    await (await votingSystem.registerVoter(2, deployer.address)).wait();
    await (await votingSystem.registerVoter(2, voter1.address)).wait();
    await (await votingSystem.registerVoter(2, voter2.address)).wait();
    console.log("  ✓ Registered deployer & demo voters for Election #1 & #2");
  }

  // Export contract data for frontend
  const artifactsDir = path.join(__dirname, "..", "src", "contracts");
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  // Read compiled artifact for ABI
  const artifactPath = path.join(__dirname, "..", "src", "artifacts", "contracts", "VotingSystem.sol", "VotingSystem.json");
  let abi = [];
  if (fs.existsSync(artifactPath)) {
    const rawArtifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    abi = rawArtifact.abi;
  }

  const contractInfo = {
    address: contractAddress,
    deployer: deployer.address,
    networkChainId: 31337,
    deployedAt: new Date().toISOString(),
    abi: abi
  };

  fs.writeFileSync(
    path.join(artifactsDir, "contractData.json"),
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("\n📄 Contract info exported to src/contracts/contractData.json");
  console.log("🎉 Setup & Deployment complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
