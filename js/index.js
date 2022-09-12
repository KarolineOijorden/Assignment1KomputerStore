let balance = 200;
let outstandingLoan = 0;
let salaryBalance = 0;

window.onload = function(){
    document.getElementById('balance').innerHTML = "Balance: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(balance);
    document.getElementById('Pay').innerHTML = "Pay: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(salaryBalance);
    document.getElementById('repayLoanButton').style.visibility = "hidden";
    getLaptops();
};

// TODO show the respond messages in another way
function getLoan() {
    let text;
    let amount = prompt("Enter the amount you want to loan:");
    if (amount == null) {
        return;
    } else if (isNaN(amount)) {
        text = "Enter a number";
    } else if (amount < 1) {
        text = "The loan must be greater than 0";
    } else if (amount > balance * 2) {
        text = "You cannot get a loan more than double of your bank balance: Your maximum amount of loan is " + balance * 2;
    } else if (outstandingLoan > 0){
        text = "You can only have one loan at a time";
    } else { // the loan is succselful
        setLoan(amount);
        text = "You have loaned " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(amount);
        // Once you have a loan, a new button labeled “Repay Loan” appears
        document.getElementById("repayLoanButton").style.visibility = "visible";
    }
    document.getElementById("loanMessage").innerHTML = text;
}

function setLoan(newLoan) {
    newLoan = Number(newLoan);
    outstandingLoan = newLoan;
    document.getElementById("OutstandingLoan").innerHTML = "Outstanding loan: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(outstandingLoan);
    setBalance(balance + newLoan); // add the loaned amount to the bank balance
    if (outstandingLoan == 0) {
        document.getElementById('repayLoanButton').style.visibility = "hidden"; // if there are no loan, remove the repay loan button
    }
}

function setBalance(newBalance) {
    balance = newBalance;
    document.getElementById("balance").innerHTML = "Balance: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(balance);
}

function setSalary(newSalary) {
    salaryBalance = newSalary;
    document.getElementById("Pay").innerHTML = "Pay: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(salaryBalance);
}

/*
The bank button must transfer the money from your Pay/Salary balance to your Bank balance. Remember 
to reset your pay/salary once you transfer.  
Constraints on Bank button:  
1. If you have an outstanding loan, 10% of your salary MUST first be deducted and transferred to the 
outstanding Loan amount  
2. The balance after the 10% deduction may be transferred to your bank account
*/
// TODO give feedback if the transfer is succsefull
function transferSalary() {
    if (outstandingLoan > 0) {
        let loanPayBack = salaryBalance/10; // get 10 % of the balance to pay back on the oustanding loan
        salaryBalance -= loanPayBack;
        setLoan(outstandingLoan - loanPayBack);
        if (!confirm("10 % of your salary has been transfered to your outstanding loan. Do you want to transfer the remaining salary to the bank?")) return;
    }
    setBalance(balance + salaryBalance); // transfers the salary to the bank balance
    setSalary(0); // resets the salary to 0 as the money is transfered to the bank balance
}

/*
The work button must increase your Pay balance at a rate of 100 on each click. 
*/
function work() {
    setSalary(salaryBalance + 100);
}

/*
Upon clicking this button, the full value of your current Pay amount should go towards the outstanding loan and NOT your bank account.  
Any remaining funds after paying the loan may be transferred to your bank account
*/
function repayLoan() {
    remaningSalary =  salaryBalance - outstandingLoan;
    if (remaningSalary > 0) {
        setLoan(0);
        if (confirm("You have " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(remaningSalary) + " left after paying back the loan. Do you want to transfer the money to the bank balance?")) {
            setBalance(balance + remaningSalary);
            setSalary(0);
        } else {
            setSalary(remaningSalary);
        }
    } else if (remaningSalary == 0) {
        setSalary(0);
        setLoan(0);
    } else {
        setSalary(0);
        setLoan(outstandingLoan - Math.abs(remaningSalary));
    }
}
/*
const getLaptops = async () => {
    const response = await fetch('https://noroff-komputer-store-api.herokuapp.com/computers');
    const laptops = await response.json();
    let dropdown = document.getElementById('laptop-dropdown');
    let option;
    for (let i = 0; i < laptops.length; i++) {
      option = document.createElement('option');
      option.text = laptops[i].title;
      option.value = laptops[i].id; // remove value?
      dropdown.add(option);
    }
    displayLaptop(laptops); // TODO add the first one as default
  }*/
/*
function displayLaptop(laptops) {
    const selected = document.getElementById('laptop-dropdown'); //rename
    const pElem = document.getElementById('p');

    // When a new <option> is selected
    selected.addEventListener('change', () => {
        var select = document.getElementById('laptop-dropdown');
        var value = select.options[select.selectedIndex].value;
        document.getElementById('test').innerHTML = laptops[select.selectedIndex].specs;
    //const index = selected.selectedIndex;
    //console.log(laptops[index].title);
    //makeList(laptops[index].specs);
    // Add that data to the <p>
    //document.getElementById('laptop-features').textContent;// = "Features: " + laptops[index].price;
    /*const featureList = document.getElementById('laptop-features');
    //document.getElementById('test').textContent = laptops[index].specs;
    for (let i = 0; i<laptops[index].specs.length; i++) {
        let listElement = document.createElement('li');
        //listElement.text = laptops[index].specs[i];
        // Add the item text
        listElement.innerHTML = laptops[index].specs[i];

        // Add listItem to the listElement
        selected.appendChild(listElement);
    }
    })
}*/
/*
/*
function makeList(listData) {
    // Establish the array which acts as a data source for the list
    /*let listData = [
        'Blue',
        'Red',
        'White',
        'Green',
        'Black',
        'Orange'
    ],*/
/*
    // Make a container element for the list
    let listContainer = document.createElement('div'),

    // Make the list
    listElement = document.createElement('ul'),

    // Set up a loop that goes through the items in listItems one at a time
    numberOfListItems = listData.length,
    listItem,
    i;

    // Add it to the page
    document.getElementsByTagName('body')[0].appendChild(listContainer);
    listContainer.appendChild(listElement);

    for (let i = 0; i < numberOfListItems; ++i) {
        // Create an item for each one
        listItem = document.createElement('li');

        // Add the item text
        listItem.innerHTML = listData[i];

        // Add listItem to the listElement
        listElement.appendChild(listItem);
    }
}
*/
function getLaptops() {
    const laptopsElement = document.getElementById("laptop-dropdown");
    const featureElement = document.getElementById("laptop-features");
    const titleElement = document.getElementById("laptop-title");
    const imageElement = document.getElementById("laptop-image");
    const descriptionElement = document.getElementById("laptop-description");
    const priceElement = document.getElementById("laptop-price");
    let laptops = [];

    fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
        .then(response => response.json())
        .then(data => laptops = data)
        .then(laptops => addLaptopsToMenu(laptops));
    
    const addLaptopsToMenu = (laptops) => {
        laptops.forEach(x => addLaptopToMenu(x));
        featureElement.innerText = laptops[0].specs;
        titleElement.innerText = laptops[0].title;
        priceElement.innerText = laptops[0].price;
        imageElement.innerText = laptops[0].image;
        descriptionElement.innerText = laptops[0].description;
    }

    const addLaptopToMenu = (laptop) => {
        const laptopElement = document.createElement("option");
        laptopElement.value = laptop.id;
        laptopElement.appendChild(document.createTextNode(laptop.title));
        laptopsElement.appendChild(laptopElement);
    }

    const handleLaptopMenuChange = e => {
        const selectedLaptop = laptops[e.target.selectedIndex];
        featureElement.innerText = selectedLaptop.specs;
        titleElement.innerText = selectedLaptop.title;
        priceElement.innerText = selectedLaptop.price;
        imageElement.innerText = selectedLaptop.image;
        descriptionElement.innerText = selectedLaptop.description;
    }

    laptopsElement.addEventListener("change", handleLaptopMenuChange);
}