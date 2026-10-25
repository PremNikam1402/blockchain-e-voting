export const HARDHAT_CHAIN_ID = 31337;
export const LOCAL_RPC_URL = "http://127.0.0.1:8545";

export const DEMO_ACCOUNTS = [
  {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    name: "Rajesh Sharma (Chief Election Commissioner)",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    badge: "Super Admin"
  },
  {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    name: "Priya Sharma",
    role: "voter",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    badge: "Verified Voter"
  },
  {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    name: "Rahul Verma",
    role: "voter",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    badge: "Verified Voter"
  },
  {
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    name: "Ananya Patel",
    role: "voter",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    badge: "Verified Voter"
  },
  {
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    name: "Vikram Malhotra",
    role: "voter",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    badge: "Unregistered Citizen"
  }
];

export const INITIAL_DEMO_ELECTIONS = [
  {
    id: 1,
    title: "2026 Web3 Foundation Board Election",
    description: "Official decentralized election to appoint the Lead Architect and Governance Board Members of the Web3 Foundation.",
    startTime: Math.floor(Date.now() / 1000) - 3600,
    endTime: Math.floor(Date.now() / 1000) + 86400 * 2,
    status: 1, // Active
    candidateCount: 3,
    totalVotes: 24,
    openRegistration: true,
    creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    registeredVoters: [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
    ],
    candidates: [
      {
        id: 1,
        name: "Dr. Neha Kapoor",
        party: "Decentralized Systems Party",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
        manifesto: "Focusing on quantum-resistant cryptography, layer-2 scalability, and democratic validator incentives.",
        voteCount: 11
      },
      {
        id: 2,
        name: "Rohan Deshmukh",
        party: "Open Source Innovation",
        avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300",
        manifesto: "Accelerating public-goods funding, developer grants, and open-source tooling.",
        voteCount: 8
      },
      {
        id: 3,
        name: "Kavita Iyer",
        party: "Privacy & Security Union",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300",
        manifesto: "Prioritizing zero-knowledge proofs, user privacy protections, and strict on-chain protocol governance.",
        voteCount: 5
      }
    ]
  },
  {
    id: 2,
    title: "Metropolitan University Student Council Election",
    description: "Annual student body election to choose the University Council President for the 2026-2027 academic year.",
    startTime: Math.floor(Date.now() / 1000) - 7200,
    endTime: Math.floor(Date.now() / 1000) + 43200,
    status: 1, // Active
    candidateCount: 2,
    totalVotes: 14,
    openRegistration: false,
    creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    registeredVoters: [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    ],
    candidates: [
      {
        id: 1,
        name: "Arjun Mehta",
        party: "Campus Forward",
        avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300",
        manifesto: "Modernizing library resources, 24/7 campus cafes, and expanding student mental health initiatives.",
        voteCount: 9
      },
      {
        id: 2,
        name: "Pooja Patel",
        party: "Student Voice Coalition",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300",
        manifesto: "Lowering tuition auxiliary fees, enhancing student support, and green campus sustainability.",
        voteCount: 5
      }
    ]
  },
  {
    id: 3,
    title: "Ethereum Improvement Proposal (EIP-7702) Community Referendum",
    description: "Community sentiment voting on the adoption timeline for next-gen account abstraction gas sponsorship specifications.",
    startTime: Math.floor(Date.now() / 1000) - 86400 * 5,
    endTime: Math.floor(Date.now() / 1000) - 3600,
    status: 2, // Ended
    candidateCount: 2,
    totalVotes: 182,
    openRegistration: true,
    creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    registeredVoters: [],
    candidates: [
      {
        id: 1,
        name: "Approve & Fast-Track Implementation",
        party: "Protocol Core Devs",
        avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300",
        manifesto: "Immediate transition for improved smart contract wallet UX across mainnet and rollups.",
        voteCount: 142
      },
      {
        id: 2,
        name: "Require Further Formal Verification",
        party: "Security Council",
        avatarUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300",
        manifesto: "Delay rollout by 1 testnet epoch to complete multi-party audit of transient storage interactions.",
        voteCount: 40
      }
    ]
  }
];
