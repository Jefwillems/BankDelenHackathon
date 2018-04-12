pragma solidity ^0.4.21;
contract Heritage {
    
    struct Recipient {
        string name;
        uint256 amount;
    }

	address public owner;
	address public creator;
	
	mapping(uint => Recipient) private recipients;
	uint public numRecipients;

	function Heritage(address _owner) public {
		owner = _owner;
		creator = msg.sender;
		numRecipients = 0;
	}

	modifier onlyOwner() {
		require(msg.sender == owner);
		_;
	}

	modifier onlyCreator() {
		require(msg.sender == creator);
		_;
	}
	
	function getRecipient(uint256 _index) public constant returns (string name, uint256 amount) {
	    Recipient memory r = recipients[_index]; 
	    return (r.name, r.amount);
	}

    function addRecipient(string _name, uint256 _amount) public onlyCreator {
        recipients[numRecipients++] = Recipient({amount: _amount,name:_name});
    }

	function close() public onlyCreator {
        selfdestruct(owner);
    }

}