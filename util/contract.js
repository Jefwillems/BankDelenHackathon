module.exports = {
    abi: [
        {
            constant: true,
            inputs: [],
            name: "creator",
            outputs: [{ name: "", type: "address" }],
            payable: false,
            stateMutability: "view",
            type: "function"
        },
        {
            constant: false,
            inputs: [],
            name: "close",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function"
        },
        {
            constant: true,
            inputs: [{ name: "_index", type: "uint256" }],
            name: "getRecipient",
            outputs: [
                { name: "name", type: "string" },
                { name: "amount", type: "uint256" }
            ],
            payable: false,
            stateMutability: "view",
            type: "function"
        },
        {
            constant: true,
            inputs: [],
            name: "owner",
            outputs: [{ name: "", type: "address" }],
            payable: false,
            stateMutability: "view",
            type: "function"
        },
        {
            constant: false,
            inputs: [
                { name: "_name", type: "string" },
                { name: "_amount", type: "uint256" }
            ],
            name: "addRecipient",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function"
        },
        {
            constant: true,
            inputs: [],
            name: "numRecipients",
            outputs: [{ name: "", type: "uint256" }],
            payable: false,
            stateMutability: "view",
            type: "function"
        },
        {
            inputs: [{ name: "_owner", type: "address" }],
            payable: false,
            stateMutability: "nonpayable",
            type: "constructor"
        }
    ]
};
