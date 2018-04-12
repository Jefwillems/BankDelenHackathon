const contractAddress = 0x236215fB6cf1Aa8eC9320f95cE844Cb51EeE3171;



//Adds recipient to the contract
function addRecipient() {
    console.log("adding recipient")
    fetch('localhost:3000/api/recipients', {
      method: 'post',
      body: JSON.stringify({
          name: document.querySelector('#name'),
          amount: document.querySelector('#amount'),
          address: contractAddress
      })
    }).then(function(response) {
      console.log("recipient succesfully added")
      return response.json();
    })
}

//Adds recipient to the contract
function showRecipients() {
    console.log(`fetching recipients and their amount of money${contractAddress}`)
    fetch('localhost:3000/api/recipients/', {
      method: 'get',
    }).then(function(response) {
      return response.json();
      //add response to html
    })
}
