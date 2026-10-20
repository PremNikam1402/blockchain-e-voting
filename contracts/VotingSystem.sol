// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Decentralized E-Voting System Smart Contract
 * @dev Manages multi-election creation, voter authorization, anonymous/pseudonymous vote casting,
 * and transparent, tamper-proof tallying on the Ethereum blockchain.
 */
contract VotingSystem {
    // --- Roles & Admin Management ---
    address public owner;
    mapping(address => bool) public isAdmin;

    enum ElectionStatus { Created, Active, Ended }

    struct Candidate {
        uint256 id;
        string name;
        string party;
        string avatarUrl;
        string manifesto;
        uint256 voteCount;
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedCandidateId;
        uint256 castTimestamp;
    }

    struct Election {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        ElectionStatus status;
        uint256 candidateCount;
        uint256 totalVotes;
        bool openRegistration;
        address creator;
    }

    uint256 public electionCount;
    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(uint256 => Candidate)) public electionCandidates;
    mapping(uint256 => mapping(address => Voter)) public electionVoters;
    mapping(uint256 => address[]) private registeredVotersList;

    // --- Events for Full Auditability ---
    event ElectionCreated(
        uint256 indexed electionId,
        string title,
        uint256 startTime,
        uint256 endTime,
        address indexed creator
    );
    event ElectionStatusChanged(uint256 indexed electionId, ElectionStatus newStatus);
    event VoterRegistered(uint256 indexed electionId, address indexed voterAddress);
    event VoteCast(
        uint256 indexed electionId,
        address indexed voter,
        uint256 candidateId,
        uint256 timestamp
    );
    event AdminAdded(address indexed newAdmin);
    event AdminRemoved(address indexed admin);

    // --- Modifiers ---
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can execute this");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == owner || isAdmin[msg.sender], "Caller is not an authorized election admin");
        _;
    }

    modifier electionExists(uint256 _electionId) {
        require(_electionId > 0 && _electionId <= electionCount, "Election does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
        isAdmin[msg.sender] = true;
    }

    // --- Admin Management ---
    function addAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "Invalid address");
        isAdmin[_admin] = true;
        emit AdminAdded(_admin);
    }

    function removeAdmin(address _admin) external onlyOwner {
        require(_admin != owner, "Cannot remove contract owner");
        isAdmin[_admin] = false;
        emit AdminRemoved(_admin);
    }

    // --- Election Management ---

    /**
     * @notice Create a new election with candidates
     */
    function createElection(
        string memory _title,
        string memory _description,
        uint256 _durationInMinutes,
        bool _openRegistration,
        string[] memory _candidateNames,
        string[] memory _candidateParties,
        string[] memory _candidateAvatars,
        string[] memory _candidateManifestos
    ) external onlyAdmin returns (uint256) {
        require(bytes(_title).length > 0, "Title is required");
        require(_candidateNames.length >= 2, "Must specify at least 2 candidates");
        require(
            _candidateNames.length == _candidateParties.length &&
            _candidateNames.length == _candidateAvatars.length &&
            _candidateNames.length == _candidateManifestos.length,
            "Candidate arrays must have equal length"
        );

        electionCount++;
        uint256 newElectionId = electionCount;

        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + (_durationInMinutes * 1 minutes);

        elections[newElectionId] = Election({
            id: newElectionId,
            title: _title,
            description: _description,
            startTime: startTime,
            endTime: endTime,
            status: ElectionStatus.Active,
            candidateCount: _candidateNames.length,
            totalVotes: 0,
            openRegistration: _openRegistration,
            creator: msg.sender
        });

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            electionCandidates[newElectionId][i + 1] = Candidate({
                id: i + 1,
                name: _candidateNames[i],
                party: _candidateParties[i],
                avatarUrl: _candidateAvatars[i],
                manifesto: _candidateManifestos[i],
                voteCount: 0
            });
        }

        emit ElectionCreated(newElectionId, _title, startTime, endTime, msg.sender);
        emit ElectionStatusChanged(newElectionId, ElectionStatus.Active);

        return newElectionId;
    }

    /**
     * @notice Manually start an election or set status to Active
     */
    function startElection(uint256 _electionId) external onlyAdmin electionExists(_electionId) {
        Election storage election = elections[_electionId];
        election.status = ElectionStatus.Active;
        emit ElectionStatusChanged(_electionId, ElectionStatus.Active);
    }

    /**
     * @notice Manually conclude an election
     */
    function endElection(uint256 _electionId) external onlyAdmin electionExists(_electionId) {
        Election storage election = elections[_electionId];
        election.status = ElectionStatus.Ended;
        emit ElectionStatusChanged(_electionId, ElectionStatus.Ended);
    }

    // --- Voter Registration ---

    /**
     * @notice Authorize a single voter for a specific election
     */
    function registerVoter(uint256 _electionId, address _voter) public onlyAdmin electionExists(_electionId) {
        require(_voter != address(0), "Invalid voter address");
        require(!electionVoters[_electionId][_voter].isRegistered, "Voter already registered");

        electionVoters[_electionId][_voter].isRegistered = true;
        registeredVotersList[_electionId].push(_voter);

        emit VoterRegistered(_electionId, _voter);
    }

    /**
     * @notice Batch authorize multiple voters in one transaction
     */
    function batchRegisterVoters(uint256 _electionId, address[] calldata _voters) external onlyAdmin electionExists(_electionId) {
        for (uint256 i = 0; i < _voters.length; i++) {
            address v = _voters[i];
            if (v != address(0) && !electionVoters[_electionId][v].isRegistered) {
                electionVoters[_electionId][v].isRegistered = true;
                registeredVotersList[_electionId].push(v);
                emit VoterRegistered(_electionId, v);
            }
        }
    }

    /**
     * @notice Self-register if the election has open registration enabled
     */
    function selfRegister(uint256 _electionId) external electionExists(_electionId) {
        Election storage election = elections[_electionId];
        require(election.openRegistration, "Election does not permit open self-registration");
        require(!electionVoters[_electionId][msg.sender].isRegistered, "Already registered");

        electionVoters[_electionId][msg.sender].isRegistered = true;
        registeredVotersList[_electionId].push(msg.sender);

        emit VoterRegistered(_electionId, msg.sender);
    }

    // --- Vote Casting ---

    /**
     * @notice Cast a secure, one-time vote for a candidate in an active election
     */
    function castVote(uint256 _electionId, uint256 _candidateId) external electionExists(_electionId) {
        Election storage election = elections[_electionId];

        // Status verification
        require(election.status == ElectionStatus.Active, "Election is not active");
        require(block.timestamp <= election.endTime, "Election voting period has expired");

        // Voter authorization & double-voting prevention
        Voter storage voter = electionVoters[_electionId][msg.sender];
        require(voter.isRegistered, "Voter is not registered or authorized for this election");
        require(!voter.hasVoted, "Voter has already cast a ballot in this election");

        // Candidate verification
        require(
            _candidateId > 0 && _candidateId <= election.candidateCount,
            "Invalid candidate ID"
        );

        // Record vote
        voter.hasVoted = true;
        voter.votedCandidateId = _candidateId;
        voter.castTimestamp = block.timestamp;

        electionCandidates[_electionId][_candidateId].voteCount++;
        election.totalVotes++;

        emit VoteCast(_electionId, msg.sender, _candidateId, block.timestamp);
    }

    // --- View Functions ---

    /**
     * @notice Get election details
     */
    function getElection(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (Election memory)
    {
        Election memory e = elections[_electionId];
        if (e.status == ElectionStatus.Active && block.timestamp > e.endTime) {
            e.status = ElectionStatus.Ended;
        }
        return e;
    }

    /**
     * @notice Get all candidates for an election
     */
    function getCandidates(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (Candidate[] memory)
    {
        uint256 count = elections[_electionId].candidateCount;
        Candidate[] memory candidates = new Candidate[](count);

        for (uint256 i = 0; i < count; i++) {
            candidates[i] = electionCandidates[_electionId][i + 1];
        }

        return candidates;
    }

    /**
     * @notice Get voter status for an election
     */
    function getVoterStatus(uint256 _electionId, address _voter)
        external
        view
        electionExists(_electionId)
        returns (
            bool isRegistered,
            bool hasVoted,
            uint256 votedCandidateId,
            uint256 castTimestamp
        )
    {
        Voter storage v = electionVoters[_electionId][_voter];
        return (v.isRegistered, v.hasVoted, v.votedCandidateId, v.castTimestamp);
    }

    /**
     * @notice Get list of registered voter addresses for audit
     */
    function getRegisteredVoters(uint256 _electionId)
        external
        view
        electionExists(_electionId)
        returns (address[] memory)
    {
        return registeredVotersList[_electionId];
    }

    /**
     * @notice Helper to check if an election is still active based on timestamp
     */
    function isElectionActive(uint256 _electionId) external view electionExists(_electionId) returns (bool) {
        Election storage e = elections[_electionId];
        return (e.status == ElectionStatus.Active && block.timestamp <= e.endTime);
    }
}
