const contractAddress = "0x236215fB6cf1Aa8eC9320f95cE844Cb51EeE3171";

//Adds recipient to the contract
function addRecipient() {
  console.log("adding recipient");
  fetch("http://localhost:3000/api/recipients", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      amount: document.getElementById("amount").value,
      address: contractAddress
    })
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });
}

//Adds recipient to the contract
function showRecipients() {
  console.log(
    `fetching recipients and their amount of money${contractAddress}`
  );
  fetch("http://localhost:3000/api/recipients/" + contractAddress, {
    method: "get"
  })
    .then(function(response) {
      return response.json();
      //add response to html
    })
    .then(console.log)
    .catch(err => {
      console.log(err);
    });
}
