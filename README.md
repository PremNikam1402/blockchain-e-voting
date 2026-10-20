# 🗳️ ElectraChain - Decentralized Blockchain E-Voting System (dApp)

**ElectraChain** is a full-featured, secure, transparent, and tamper-proof decentralized voting application (dApp) built on the Ethereum blockchain using **Solidity v0.8.24**, **Hardhat**, and a modern **React 19 + Tailwind CSS + Ethers.js (v6)** frontend.

Every ballot cast is cryptographically signed and permanently sealed on the EVM state tree, guaranteeing mathematical immunity against voter fraud, ballot stuffing, unauthorized tampering, and double-voting.

---

## 🌟 Key Features

### 1. 🔐 Cryptographic Security & Double-Voting Immunity
- **One Voter, One Vote:** The smart contract validates whether `msg.sender` has previously cast a ballot. Once cast, the address is marked permanently on-chain.
- **Whitelist & Sybil Protection:** Supports both **Admin Whitelisted Elections** (restricted voter rosters) and **Open Community Elections** (self-registration enabled).
- **Time-Locked Lifecycles:** Smart contract automatically enforces start and end timestamps. Ballots cast past the deadline are rejected at the EVM protocol level.

### 2. 🏛️ Election Commission (Admin) Control Portal
- **Dynamic Multi-Election Deployment:** Deploy custom elections with bespoke candidate rosters, manifestos, pictures, and expiration durations directly to the blockchain.
- **Voter Authorization Management:** Whitelist individual citizen addresses or batch-authorize hundreds of voters in a single atomic transaction.
- **Emergency Stop / Finalization:** Manually seal and finalize elections when voting concludes.

### 3. 🗳️ Interactive Voter Experience & Ballot Verification
- **Quick-Switch Demo Accounts:** Test immediately as **Admin (Election Commissioner)**, **Alice (Verified Voter)**, **Bob (Verified Voter)**, **Charlie (Verified Voter)**, or **David (Unregistered)** without needing MetaMask or testnet gas.
- **MetaMask Web3 Support:** Connect real browser Web3 wallets to interact directly with local or public testnet nodes.
- **Cryptographic Ballot Proofs:** Voters receive an immutable transaction hash and block number receipt upon voting.
- **Verify Ballot Tool:** Auditors or voters can verify whether an address or ballot is recorded on-chain while preserving ballot privacy.

### 4. 📊 Real-Time Auditing & Live Results
- Real-time tally visualization with animated progress bars and percentage calculation.
- Automated winner declaration upon election conclusion.
- Public **Audit Ledger** recording all contract events (`VoteCast`, `ElectionCreated`, `VoterRegistered`).

---

## 🏗️ Architecture & Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Smart Contracts** | Solidity `^0.8.24` | Multi-election management, voter authorization, tamper-proof tallying |
| **Development Framework** | Hardhat | Compilation, testing, deployment, and local EVM node simulation |
| **Client Library** | Ethers.js v6 | Web3 provider communication, transaction signing, and ABI interaction |
| **Frontend UI** | React 19 + Vite | Ultra-fast client-side rendering with Glassmorphic styling |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive modern dark-mode aesthetic with custom animations |

---

## 📂 Project Structure

```
├── contracts/
│   └── VotingSystem.sol           # Core Solidity E-Voting Smart Contract
├── scripts/
│   └── deploy.cjs                 # Deployment & seed data initialization script
├── test/
│   └── VotingSystem.test.cjs      # Hardhat unit tests (11 passing tests)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx             # Top bar with account switcher & navigation
│   │   ├── StatsBanner.jsx        # Global blockchain metrics
│   │   ├── ElectionList.jsx       # Election directory with filters
│   │   ├── VotingStationModal.jsx # Candidate selection, voting & receipt
│   │   ├── ResultsModal.jsx       # Live tallies, winner declaration & voter roster
│   │   ├── AdminPanelModal.jsx    # Create elections & whitelist voters
│   │   ├── AuditLedgerModal.jsx   # On-chain transaction explorer
│   │   ├── VerifyBallotModal.jsx  # Voter eligibility & cryptographic check
│   │   └── Toast.jsx              # Status notifications & transaction confirmations
│   ├── context/
│   │   └── Web3Context.jsx        # Web3 state management & contract bridging
│   ├── utils/
│   │   └── constants.js           # Demo accounts & default elections
│   ├── contracts/
│   │   └── contractData.json      # Deployed address & compiled ABI
│   ├── App.jsx                    # Root application component
│   ├── main.jsx                   # React entrypoint
│   └── index.css                  # Custom Tailwind & glassmorphism styles
├── hardhat.config.cjs             # Hardhat & EVM optimizer configuration
├── vite.config.js                 # Vite bundler configuration
└── package.json                   # Project scripts and dependencies
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

### 1. Run the dApp (Immediate Demo Mode)
You can launch the frontend right away with built-in simulated accounts:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
- Use the account dropdown in the top-right corner to switch between **Admin**, **Alice**, **Bob**, etc.
- Cast votes, deploy new elections, whitelist voters, and verify receipts instantly!

---

### 2. Run Local Hardhat Blockchain Node (Full Web3 Mode)

If you want to run a local EVM node and connect MetaMask:

#### Step A: Start the local Ethereum node
```bash
npx hardhat node
```
This boots up a local EVM node at `http://127.0.0.1:8545` with 20 pre-funded test accounts (10,000 ETH each).

#### Step B: Deploy the Smart Contract to the local node
In a separate terminal:
```bash
npx hardhat run scripts/deploy.cjs --network localhost
```

#### Step C: Connect MetaMask
1. Add a custom network in MetaMask:
   - **Network Name:** Localhost 8545
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
2. Import any private key printed by the `npx hardhat node` command into MetaMask.
3. Click **Connect MetaMask** in the ElectraChain dApp!

---

## 🧪 Running the Smart Contract Test Suite

The smart contract includes an automated test suite verifying role authorization, voter registration, double-voting prevention, and lifecycle state changes:

```bash
npx hardhat test
```

Test results:
```
  VotingSystem Smart Contract
    Deployment & Roles
      ✔ Should set deployer as owner and initial admin
      ✔ Owner can add and remove another admin
      ✔ Non-owner cannot add admin
    Election Lifecycle & Registration
      ✔ Admin can create an election with candidates
      ✔ Admin can register individual and batch voters
      ✔ Self-registration works only if openRegistration is enabled
    Voting Mechanics & Security
      ✔ Authorized voter can cast vote and increments tally
      ✔ Prevents double voting
      ✔ Rejects votes from unregistered voters
      ✔ Rejects votes for invalid candidate IDs
      ✔ Rejects votes once election is manually ended

  11 passing
```

---

## 📜 Smart Contract Specification (`VotingSystem.sol`)

### Core Data Structures
- `Election`: Stores election ID, title, description, start/end timestamps, status (`Created`, `Active`, `Ended`), total votes cast, candidate count, open registration policy, and creator address.
- `Candidate`: Stores candidate ID, name, party/coalition, avatar URL, policy manifesto, and current vote count.
- `Voter`: Stores registration status (`isRegistered`), voting status (`hasVoted`), voted candidate ID, and block timestamp of vote cast.

### Key Functions
- `createElection(...)`: Admin deployer creates a new election with at least 2 candidates.
- `registerVoter(electionId, voterAddress)`: Whitelist a voter address.
- `batchRegisterVoters(electionId, voterAddresses[])`: Authorize a batch of voter addresses.
- `selfRegister(electionId)`: Eligible citizens self-register if open registration is active.
- `castVote(electionId, candidateId)`: One-time ballot casting with event emission.
- `endElection(electionId)`: Concludes an election and seals the final results.

---

## 🛡️ License
MIT License. Built for educational, institutional, and decentralized governance applications.
