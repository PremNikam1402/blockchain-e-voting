import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { DEMO_ACCOUNTS, INITIAL_DEMO_ELECTIONS, LOCAL_RPC_URL, HARDHAT_CHAIN_ID } from "../utils/constants";

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(DEMO_ACCOUNTS[0].address);
  const [demoUser, setDemoUser] = useState(DEMO_ACCOUNTS[0]);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [chainId, setChainId] = useState(HARDHAT_CHAIN_ID);
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [elections, setElections] = useState(INITIAL_DEMO_ELECTIONS);
  const [userVoterStatus, setUserVoterStatus] = useState({}); // key: `${electionId}_${address}` => { isRegistered, hasVoted, candidateId, txHash }
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Initialize demo voter records
  useEffect(() => {
    const initialStatus = {};
    // Mark deployer and demo voters registered
    INITIAL_DEMO_ELECTIONS.forEach((elec) => {
      elec.registeredVoters.forEach((voterAddr) => {
        initialStatus[`${elec.id}_${voterAddr.toLowerCase()}`] = {
          isRegistered: true,
          hasVoted: false,
          candidateId: 0,
        };
      });
    });
    setUserVoterStatus(initialStatus);
  }, []);

  // Try loading deployed contract info if available
  useEffect(() => {
    async function loadContractData() {
      try {
        const contractData = await import("../contracts/contractData.json");
        if (contractData && contractData.address) {
          setContractAddress(contractData.address);
        }
      } catch (err) {
        // contractData not generated yet, will use demo state
      }
    }
    loadContractData();
  }, []);

  // Show notification toast
  const showToast = (type, title, description, txHash = null) => {
    setFeedbackMessage({ type, title, description, txHash, id: Date.now() });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 6000);
  };

  // Connect MetaMask
  const connectMetaMask = async () => {
    if (!window.ethereum) {
      showToast("error", "MetaMask Not Detected", "Please install MetaMask browser extension or use Demo Wallet Mode.");
      return;
    }
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setChainId(Number(network.chainId));
        setIsDemoMode(false);
        showToast("success", "Wallet Connected", `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Connection Failed", err.message || "Failed to connect MetaMask");
    } finally {
      setLoading(false);
    }
  };

  // Switch to Demo Account
  const switchDemoAccount = (demoAccount) => {
    setDemoUser(demoAccount);
    setAccount(demoAccount.address);
    setIsDemoMode(true);
    showToast("info", "Switched Account", `Now acting as ${demoAccount.name} (${demoAccount.badge})`);
  };

  // Check voter status helper
  const getVoterStatusForCurrentAccount = (electionId) => {
    const key = `${electionId}_${account.toLowerCase()}`;
    return userVoterStatus[key] || { isRegistered: false, hasVoted: false, candidateId: 0 };
  };

  // 1. Create Election
  const createElection = async ({ title, description, durationInMinutes, openRegistration, candidates }) => {
    setLoading(true);
    try {
      const newId = elections.length + 1;
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + durationInMinutes * 60;
      const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

      const formattedCandidates = candidates.map((c, idx) => ({
        id: idx + 1,
        name: c.name,
        party: c.party || "Independent",
        avatarUrl: c.avatarUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200`,
        manifesto: c.manifesto || "Dedication to transparent and integrity-driven leadership.",
        voteCount: 0
      }));

      const newElection = {
        id: newId,
        title,
        description,
        startTime,
        endTime,
        status: 1, // Active
        candidateCount: candidates.length,
        totalVotes: 0,
        openRegistration,
        creator: account,
        registeredVoters: [account],
        candidates: formattedCandidates
      };

      setElections((prev) => [newElection, ...prev]);

      // Register creator
      setUserVoterStatus((prev) => ({
        ...prev,
        [`${newId}_${account.toLowerCase()}`]: { isRegistered: true, hasVoted: false, candidateId: 0 }
      }));

      // Record transaction
      const txRecord = {
        hash: mockTxHash,
        type: "ElectionCreated",
        title: `Created: "${title}"`,
        timestamp: new Date().toLocaleTimeString(),
        from: account,
        blockNumber: 482910 + elections.length,
      };
      setRecentTransactions((prev) => [txRecord, ...prev]);

      showToast("success", "Election Created On-Chain", `Election #${newId} is live on the blockchain!`, mockTxHash);
      return newElection;
    } catch (err) {
      console.error(err);
      showToast("error", "Creation Failed", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 2. Cast Vote
  const castVote = async (electionId, candidateId) => {
    setLoading(true);
    try {
      const status = getVoterStatusForCurrentAccount(electionId);
      if (!status.isRegistered) {
        throw new Error("You are not registered or authorized to vote in this election.");
      }
      if (status.hasVoted) {
        throw new Error("Double voting prevented! You have already cast your ballot.");
      }

      const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
      const blockNum = 483120 + Math.floor(Math.random() * 50);

      // Update election tally
      setElections((prev) =>
        prev.map((el) => {
          if (el.id === electionId) {
            return {
              ...el,
              totalVotes: el.totalVotes + 1,
              candidates: el.candidates.map((cand) =>
                cand.id === candidateId ? { ...cand, voteCount: cand.voteCount + 1 } : cand
              ),
            };
          }
          return el;
        })
      );

      // Update voter status
      const key = `${electionId}_${account.toLowerCase()}`;
      setUserVoterStatus((prev) => ({
        ...prev,
        [key]: {
          isRegistered: true,
          hasVoted: true,
          candidateId: candidateId,
          txHash: mockTxHash,
          blockNumber: blockNum,
          timestamp: Math.floor(Date.now() / 1000)
        }
      }));

      // Record tx log
      const txRecord = {
        hash: mockTxHash,
        type: "VoteCast",
        title: `Vote cast in Election #${electionId}`,
        timestamp: new Date().toLocaleTimeString(),
        from: account,
        blockNumber: blockNum,
        candidateId
      };
      setRecentTransactions((prev) => [txRecord, ...prev]);

      showToast("success", "Vote Securely Recorded!", "Your cryptographic ballot has been written to the blockchain ledger.", mockTxHash);
      return { txHash: mockTxHash, blockNumber: blockNum };
    } catch (err) {
      console.error(err);
      showToast("error", "Voting Failed", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3. Register Voter (Admin)
  const registerVoter = async (electionId, voterAddress) => {
    try {
      if (!ethers.isAddress(voterAddress)) {
        throw new Error("Invalid Ethereum wallet address format.");
      }
      const key = `${electionId}_${voterAddress.toLowerCase()}`;
      if (userVoterStatus[key]?.isRegistered) {
        throw new Error("Voter address is already registered.");
      }

      const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

      setUserVoterStatus((prev) => ({
        ...prev,
        [key]: { isRegistered: true, hasVoted: false, candidateId: 0 }
      }));

      setElections((prev) =>
        prev.map((el) =>
          el.id === electionId
            ? { ...el, registeredVoters: [...el.registeredVoters, voterAddress] }
            : el
        )
      );

      showToast("success", "Voter Authorized", `Address ${voterAddress.slice(0, 6)}...${voterAddress.slice(-4)} registered.`);
      return true;
    } catch (err) {
      showToast("error", "Registration Error", err.message);
      throw err;
    }
  };

  // 4. Batch Register Voters
  const batchRegisterVoters = async (electionId, addresses) => {
    try {
      let count = 0;
      const validAddresses = [];

      addresses.forEach((addr) => {
        const clean = addr.trim();
        if (ethers.isAddress(clean)) {
          const key = `${electionId}_${clean.toLowerCase()}`;
          if (!userVoterStatus[key]?.isRegistered) {
            validAddresses.push(clean);
            count++;
          }
        }
      });

      if (validAddresses.length === 0) {
        throw new Error("No new valid Ethereum addresses provided.");
      }

      setUserVoterStatus((prev) => {
        const updated = { ...prev };
        validAddresses.forEach((addr) => {
          updated[`${electionId}_${addr.toLowerCase()}`] = { isRegistered: true, hasVoted: false, candidateId: 0 };
        });
        return updated;
      });

      setElections((prev) =>
        prev.map((el) =>
          el.id === electionId
            ? { ...el, registeredVoters: [...el.registeredVoters, ...validAddresses] }
            : el
        )
      );

      showToast("success", "Batch Registration Complete", `Successfully registered ${count} voters.`);
      return count;
    } catch (err) {
      showToast("error", "Batch Registration Failed", err.message);
      throw err;
    }
  };

  // 5. Self-register
  const selfRegister = async (electionId) => {
    try {
      const elec = elections.find((e) => e.id === electionId);
      if (!elec?.openRegistration) {
        throw new Error("This election does not permit open self-registration.");
      }
      const key = `${electionId}_${account.toLowerCase()}`;
      if (userVoterStatus[key]?.isRegistered) {
        throw new Error("You are already registered.");
      }

      setUserVoterStatus((prev) => ({
        ...prev,
        [key]: { isRegistered: true, hasVoted: false, candidateId: 0 }
      }));

      setElections((prev) =>
        prev.map((el) =>
          el.id === electionId
            ? { ...el, registeredVoters: [...el.registeredVoters, account] }
            : el
        )
      );

      showToast("success", "Registration Successful", "You are now eligible to cast your ballot!");
    } catch (err) {
      showToast("error", "Self-Registration Failed", err.message);
      throw err;
    }
  };

  // 6. End Election
  const endElection = async (electionId) => {
    try {
      setElections((prev) =>
        prev.map((el) => (el.id === electionId ? { ...el, status: 2 } : el))
      );
      showToast("info", "Election Finalized", `Election #${electionId} has been closed.`);
    } catch (err) {
      showToast("error", "Action Failed", err.message);
    }
  };

  const isAdmin = account.toLowerCase() === DEMO_ACCOUNTS[0].address.toLowerCase();

  return (
    <Web3Context.Provider
      value={{
        account,
        demoUser,
        isDemoMode,
        chainId,
        isAdmin,
        contractAddress,
        elections,
        recentTransactions,
        loading,
        feedbackMessage,
        connectMetaMask,
        switchDemoAccount,
        setIsDemoMode,
        createElection,
        castVote,
        registerVoter,
        batchRegisterVoters,
        selfRegister,
        endElection,
        getVoterStatusForCurrentAccount,
        showToast
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
