// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title OwnHealthRegistry
 * @dev Immutable blockchain registry for decentralized medical lab records.
 * Anchors IPFS cryptographic content identifiers (CID) on the Ethereum Sepolia testnet.
 */
contract OwnHealthRegistry {
    struct MedicalRecord {
        bytes32 patientHash;
        string ipfsCID;
        uint256 timestamp;
        address recordedBy;
    }

    // Mapping from patient hash to their list of immutable records
    mapping(bytes32 => MedicalRecord[]) private patientRecords;
    
    // Global record counter
    uint256 public totalRecordsCount;

    // Events
    event ReportStored(
        bytes32 indexed patientHash,
        string ipfsCID,
        uint256 timestamp,
        address indexed recordedBy
    );

    /**
     * @notice Store a lab report's IPFS CID immutably on-chain
     * @param patientHash SHA-256 / Keccak-256 hash of patient identity
     * @param ipfsCID InterPlanetary File System Content Identifier
     * @param timestamp Unix timestamp of the medical analysis
     */
    function storeReport(
        bytes32 patientHash,
        string memory ipfsCID,
        uint256 timestamp
    ) external returns (uint256 recordIndex) {
        require(bytes(ipfsCID).length > 0, "Invalid IPFS CID");
        require(timestamp > 0, "Invalid timestamp");

        MedicalRecord memory record = MedicalRecord({
            patientHash: patientHash,
            ipfsCID: ipfsCID,
            timestamp: timestamp,
            recordedBy: msg.sender
        });

        patientRecords[patientHash].push(record);
        totalRecordsCount++;

        emit ReportStored(patientHash, ipfsCID, timestamp, msg.sender);

        return patientRecords[patientHash].length - 1;
    }

    /**
     * @notice Retrieve the number of reports recorded for a given patient hash
     */
    function getReportCount(bytes32 patientHash) external view returns (uint256) {
        return patientRecords[patientHash].length;
    }

    /**
     * @notice Retrieve a specific report by patient hash and index
     */
    function getReport(bytes32 patientHash, uint256 index)
        external
        view
        returns (
            bytes32 _patientHash,
            string memory _ipfsCID,
            uint256 _timestamp,
            address _recordedBy
        )
    {
        require(index < patientRecords[patientHash].length, "Index out of bounds");
        MedicalRecord memory rec = patientRecords[patientHash][index];
        return (rec.patientHash, rec.ipfsCID, rec.timestamp, rec.recordedBy);
    }
}
