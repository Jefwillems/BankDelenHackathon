<<<<<<< HEAD
var express = require("express");
var router = express.Router();
var ethers = require("ethers");
var providers = require("ethers").providers;
var utils = require("ethers").utils;
var abi = require("../util/contract").abi;
var bytecode =
    "0x6060604052341561000f57600080fd5b6040516020806106e983398101604052808051906020019091905050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600060038190555050610625806100c46000396000f300606060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302d05d3f1461007d57806343d726d6146100d25780636d0cee75146100e75780638da5cb5b1461018a578063cd8b5878146101df578063cfd5197414610245575b600080fd5b341561008857600080fd5b61009061026e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100dd57600080fd5b6100e5610294565b005b34156100f257600080fd5b610108600480803590602001909190505061032a565b6040518080602001838152602001828103825284818151815260200191508051906020019080838360005b8381101561014e578082015181840152602081019050610133565b50505050905090810190601f16801561017b5780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b341561019557600080fd5b61019d61041f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156101ea57600080fd5b610243600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091908035906020019091905050610444565b005b341561025057600080fd5b610258610506565b6040518082815260200191505060405180910390f35b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102f057600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b61033261050c565b600061033c610520565b60026000858152602001908152602001600020604080519081016040529081600082018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103f35780601f106103c8576101008083540402835291602001916103f3565b820191906000526020600020905b8154815290600101906020018083116103d657829003601f168201915b505050505081526020016001820154815250509050806000015181602001518191509250925050915091565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156104a057600080fd5b604080519081016040528083815260200182815250600260006003600081548092919060010191905055815260200190815260200160002060008201518160000190805190602001906104f4929190610540565b50602082015181600101559050505050565b60035481565b602060405190810160405280600081525090565b60408051908101604052806105336105c0565b8152602001600081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061058157805160ff19168380011785556105af565b828001600101855582156105af579182015b828111156105ae578251825591602001919060010190610593565b5b5090506105bc91906105d4565b5090565b602060405190810160405280600081525090565b6105f691905b808211156105f25760008160009055506001016105da565b5090565b905600a165627a7a72305820944dbfe485eec30ad7e9d34468f7dac8f420fd62e61e44e33032be19ea3c9db90029";
var network = providers.networks.rinkeby;
var provider = new providers.InfuraProvider(network, "58tj6XZczjhUiLjRbYGo");
var privateKey = "0x" + process.env["PRIVATE_KEY"];
var wallet = new ethers.Wallet(privateKey, provider);

router.post("/contract", function(req, res, next) {
    var address = req.body["address"];
    if (!address) {
        return res.status(500).json({ error: "address was not specified!" });
    }
    createContract(address, transaction => {
        transaction.etherscanUrl =
            "https://rinkeby.etherscan.io/tx/" + transaction.hash;
        return res.json(transaction);
    });
});

router.get("/recipients/:contractaddress", function(req, res, next) {
    var cAddr = req.params["contractaddress"];
    console.log("address was: " + cAddr);
    getNumberOfRecips(cAddr, number => {
        var promises = [];
        for (var i = 0; i < number; i++) {
            console.log("getting recipient: " + i);
            promises.push(getRecipient(cAddr, i));
        }
        Promise.all(promises)
            .then(values => {
                var ret = {};
                values.forEach(el => {
                    ret[el.name] = utils.bigNumberify(el.amount).toNumber();
                });
                res.json(ret);
            })
            .catch(console.log);
    });
});

router.post("/recipients", function(req, res, next) {
    var name = req.body["name"];
    var amount = parseInt(req.body["amount"]);
    var contractAddress = req.body["address"];
    if (!name || !amount || !contractAddress) {
        return res
            .status(500)
            .json({ error: "name or amount was not specified!" });
    }
    addRecipient(name, amount, contractAddress, transaction => {
        if (!transaction) {
            return res
                .status(500)
                .json({ error: "transaction was undefined." });
        }
        transaction.etherscanUrl =
            "https://rinkeby.etherscan.io/tx/" + transaction.hash;
        return res.json(transaction);
    });
});

/* GET home page. */
router.get("/", function(req, res, next) {
    res.json({ message: "Hello World!" });
});

var getNumberOfRecips = (addr, cb) => {
    var contract = new ethers.Contract(addr, abi, provider);
    var callPromise = contract.numRecipients();
    callPromise.then(cb).catch(console.log);
};
var getRecipient = (addr, index) => {
    var contract = new ethers.Contract(addr, abi, provider);
    var callPromise = contract.getRecipient(index);
    return callPromise;
};

var createContract = (_address, cb) => {
    var deployTransaction = ethers.Contract.getDeployTransaction(
        bytecode,
        abi,
        _address
    );

    var sendPromise = wallet.sendTransaction(deployTransaction);

    sendPromise.then(function(transaction) {
        var cAddress = ethers.utils.getContractAddress(transaction);
        transaction.address = cAddress;
        cb(transaction);
    });
};
var addRecipient = (name, amount, address, cb) => {
    console.log("getting contract at: " + address);
    var contract = new ethers.Contract(address, abi, wallet);
    console.log("sending promise");
    var sendPromise = contract.addRecipient(name, amount);
    sendPromise
        .then(transaction => {
            cb(transaction);
        })
        .catch(console.log);
};

module.exports = router;
=======
var express = require("express");
var router = express.Router();
var ethers = require("ethers");
var providers = require("ethers").providers;
var utils = require("ethers").utils;
var abi = require("../util/contract").abi;
var bytecode =
  "0x6060604052341561000f57600080fd5b6040516020806106e983398101604052808051906020019091905050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600060038190555050610625806100c46000396000f300606060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302d05d3f1461007d57806343d726d6146100d25780636d0cee75146100e75780638da5cb5b1461018a578063cd8b5878146101df578063cfd5197414610245575b600080fd5b341561008857600080fd5b61009061026e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100dd57600080fd5b6100e5610294565b005b34156100f257600080fd5b610108600480803590602001909190505061032a565b6040518080602001838152602001828103825284818151815260200191508051906020019080838360005b8381101561014e578082015181840152602081019050610133565b50505050905090810190601f16801561017b5780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b341561019557600080fd5b61019d61041f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156101ea57600080fd5b610243600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091908035906020019091905050610444565b005b341561025057600080fd5b610258610506565b6040518082815260200191505060405180910390f35b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102f057600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b61033261050c565b600061033c610520565b60026000858152602001908152602001600020604080519081016040529081600082018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103f35780601f106103c8576101008083540402835291602001916103f3565b820191906000526020600020905b8154815290600101906020018083116103d657829003601f168201915b505050505081526020016001820154815250509050806000015181602001518191509250925050915091565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156104a057600080fd5b604080519081016040528083815260200182815250600260006003600081548092919060010191905055815260200190815260200160002060008201518160000190805190602001906104f4929190610540565b50602082015181600101559050505050565b60035481565b602060405190810160405280600081525090565b60408051908101604052806105336105c0565b8152602001600081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061058157805160ff19168380011785556105af565b828001600101855582156105af579182015b828111156105ae578251825591602001919060010190610593565b5b5090506105bc91906105d4565b5090565b602060405190810160405280600081525090565b6105f691905b808211156105f25760008160009055506001016105da565b5090565b905600a165627a7a72305820944dbfe485eec30ad7e9d34468f7dac8f420fd62e61e44e33032be19ea3c9db90029";
var network = providers.networks.rinkeby;
var provider = new providers.InfuraProvider(network, "58tj6XZczjhUiLjRbYGo");
var privateKey = "0x" + process.env["PRIVATE_KEY"];
var wallet = new ethers.Wallet(privateKey, provider);

router.post("/contract", function(req, res, next) {
  var address = req.body["address"];
  if (!address) {
    return res.status(500).json({ error: "address was not specified!" });
  }
  createContract(address, transaction => {
    transaction.etherscanUrl =
      "https://rinkeby.etherscan.io/tx/" + transaction.hash;
    return res.json(transaction);
  });
});

router.get("/recipients/:contractaddress", function(req, res, next) {
  var cAddr = req.params["contractaddress"];
  console.log("address was: " + cAddr);
  getNumberOfRecips(cAddr, number => {
    var promises = [];
    for (var i = 0; i < number; i++) {
      console.log("getting recipient: " + i);
      promises.push(getRecipient(cAddr, i));
    }
    Promise.all(promises)
      .then(values => {
        var ret = {};
        values.forEach(el => {
          ret[el.name] = utils.bigNumberify(el.amount).toNumber();
        });
        res.json(ret);
      })
      .catch(console.log);
  });
});

router.post("/recipients", function(req, res, next) {
  var name = req.body["name"];
  var amount = parseInt(req.body["amount"]);
  var contractAddress = req.body["address"];
  console.log(req.body);
  if (!name || !amount || !contractAddress) {
    return res.status(500).json({ error: "name or amount was not specified!" });
  }
  addRecipient(name, amount, contractAddress, transaction => {
    if (!transaction) {
      return res.status(500).json({ error: "transaction was undefined." });
    }
    transaction.etherscanUrl =
      "https://rinkeby.etherscan.io/tx/" + transaction.hash;
    return res.json(transaction);
  });
});

/* GET home page. */
router.get("/", function(req, res, next) {
  res.json({ message: "Hello World!" });
});

var getNumberOfRecips = (addr, cb) => {
  var contract = new ethers.Contract(addr, abi, provider);
  var callPromise = contract.numRecipients();
  callPromise.then(cb).catch(console.log);
};
var getRecipient = (addr, index) => {
  var contract = new ethers.Contract(addr, abi, provider);
  var callPromise = contract.getRecipient(index);
  return callPromise;
};

var createContract = (_address, cb) => {
  var deployTransaction = ethers.Contract.getDeployTransaction(
    bytecode,
    abi,
    _address
  );

  var sendPromise = wallet.sendTransaction(deployTransaction);

  sendPromise.then(function(transaction) {
    var cAddress = ethers.utils.getContractAddress(transaction);
    transaction.address = cAddress;
    cb(transaction);
  });
};
var addRecipient = (name, amount, address, cb) => {
  console.log("getting contract at: " + address);
  var contract = new ethers.Contract(address, abi, wallet);
  console.log("sending promise");
  var sendPromise = contract.addRecipient(name, amount);
  sendPromise
    .then(transaction => {
      cb(transaction);
    })
    .catch(console.log);
};

module.exports = router;
>>>>>>> 8753ae37e82eb8d10d17c33e8fb0a6d834854da0
