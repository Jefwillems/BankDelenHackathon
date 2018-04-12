//const contractAddress = "0x236215fB6cf1Aa8eC9320f95cE844Cb51EeE3171";

function deployContract() {
  var walletAddress = "0xA6fEBbFe2F3eF562BD11C4Ba7d47c59b79358724";
  fetch("http://localhost:3000/api/contract", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      address: walletAddress
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data.etherscanUrl);
      $("#etherscan").html(
        `<a href="${data.etherscanUrl}">${data.etherscanUrl}</a>`
      );
      var contractAddress = data.address;
      var nameField = document.getElementById("name");
      nameField.disabled = false;
      var amountField = document.getElementById("amount");
      amountField.disabled = false;
      document.getElementById("addHeir").onclick = function() {
        addRecipient(nameField.value, amountField.value, contractAddress);
      };
    })
    .catch(console.error);
}

//Adds recipient to the contract
function addRecipient(name, amount, contractAddress) {
  console.log("adding recipient");
  fetch("http://localhost:3000/api/recipients", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      amount: amount,
      address: contractAddress
    })
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      //showRecipients(contractAddress);
      show.address = contractAddress;
    })
    .catch(err => {
      console.log(err);
    });
}

//Adds recipient to the contract
function showRecipients(contractAddress) {
  console.log(
    `fetching recipients and their amount of money${contractAddress}`
  );
  fetch("http://localhost:3000/api/recipients/" + contractAddress, {
    method: "get"
  })
    .then(function(response) {
      return response.json();
    })
    .then(recipients => {
      console.log(recipients);

      //document.querySelector()
      for (var name in recipients) {
        var template = `<tr>
							          <td class="cart-title">
								          ${name}
							          </td>
							          <td>${recipients[name]}€</td>
							          <td>
								          <a href="#" class="cart-remove"></a>
							          </td>
                      </tr>`;
        $("#recipients").html(template);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

var show = {
  address: "",
  refresh: function() {
    if (this.address !== "") {
      showRecipients(this.address);
    }
  }
};
