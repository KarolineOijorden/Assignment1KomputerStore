let balance = 0;
let outstandingLoan = 0;
let salaryBalance = 0;
let selectedLaptop = null;

window.onload = function(){
    setBalance(200); // sets the initial balance to 200
    setSalary(0); // sets the inital slaray to 0
    document.getElementById('repayLoanButton').style.visibility = "hidden"; // the reapy loan is initially hidden as the user has no loan yet
    getLaptops(); // loads the available laptops from the API
};

/**
 * Attempts to get a loan when the 'Get a loan' button is clicked. It shows a “Prompt” popup box that allows you to enter an amount.
 * Checks if the loan is valid by that it is not more than double the bank balance and that there is only one loan at a time. 
 */
function getLoan() {
    let amount = prompt("Enter the amount you want to loan:");
    if (amount == null) {
        return;
    } else if (isNaN(amount)) {
        alert("Enter a number");
    } else if (amount < 1) {
        alert("The loan must be greater than 0");
    } else if (amount > balance * 2) {
        alert("You cannot get a loan more than double of your bank balance: Your maximum amount of loan is " + balance * 2);
    } else if (outstandingLoan > 0){
        alert("You can only have one loan at a time");
    } else { // the loan is successful
        setLoan(amount);
        alert("You have loaned " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(amount));
        // Once you have a loan, a new button labeled “Repay Loan” appears
        document.getElementById("repayLoanButton").style.visibility = "visible";
    }
}

/**
 * Set a loan amount as the outstanding loan
 * @param {*} newLoan - provide the amount to set the outstanding loan
 */
function setLoan(newLoan) {
    newLoan = Number(newLoan); // converts the loan amount to a number for proper artimetics
    outstandingLoan = newLoan;
    document.getElementById("OutstandingLoan").innerHTML = "Outstanding loan: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(outstandingLoan);
    setBalance(balance + newLoan); // add the loaned amount to the bank balance
    if (outstandingLoan == 0) {
        document.getElementById('repayLoanButton').style.visibility = "hidden"; // if there are no loan, remove the repay loan button
    }
}

/**
 * Set an amount as the new bank balance
 * @param {*} newBalance - provide the amount to set the balance to
 */
function setBalance(newBalance) {
    balance = newBalance;
    document.getElementById("balance").innerHTML = "Balance: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(balance);
}

/**
 * Set an amount as the new salary
 * @param {*} newSalary - provide the amount for the salary
 */
function setSalary(newSalary) {
    salaryBalance = newSalary;
    document.getElementById("Pay").innerHTML = "Pay: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(salaryBalance);
}

/*
The money from the salary balance is transfered to the bank balance when the bank button is pressed.
If there is an outstanding loan, 10% of your salary MUST first be deducted and transferred to the 
outstanding Loan amount. The balance after the 10% deduction may be transferred to your bank account.
*/
function transferSalary() {
    if (salaryBalance > 0) { // checks if there are any salary to transfer
        if (outstandingLoan > 0) { // checks if the user has a loan
            let loanPayBack = salaryBalance/10; // get 10 % of the balance to pay back on the oustanding loan
            if (loanPayBack > outstandingLoan) { // if the 10 % to pay back the loan is greater than the loan the rest is added to the salary
                setSalary(salaryBalance - outstandingLoan);
                setLoan(0);
            } else {
                setLoan(outstandingLoan - loanPayBack);
                setSalary(salaryBalance - loanPayBack);
            }
            if (!confirm("10 % of your salary has been transfered to your outstanding loan. Do you want to transfer the remaining salary to the bank?")) return;
        }   
        setBalance(balance + salaryBalance); // transfers the salary to the bank balance
        setSalary(0); // resets the salary to 0 as the money is transfered to the bank balance
        alert("Transfer was successful");
    } else {
        alert("You do not have any money to transfer");
    }
}

/*
Increases the Pay balance when the work button is pressed at a rate of 100 on each click. 
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

function getLaptops() {
    const laptopsElement = document.getElementById("laptop-dropdown");
    const featureElement = document.getElementById("laptop-features");
    const titleElement = document.getElementById("laptop-title");
    const imageElement = document.getElementById("laptop-image");
    const descriptionElement = document.getElementById("laptop-description");
    const priceElement = document.getElementById("laptop-price");
    const api = "https://noroff-komputer-store-api.herokuapp.com/";
    let laptops = [];

    fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
        .then(response => response.json())
        .then(data => laptops = data)
        .then(laptops => addLaptopsToMenu(laptops));
    
    const addLaptopsToMenu = (laptops) => {
        laptops.forEach(x => addLaptopToMenu(x));
        //featureElement.innerText = laptops[0].specs;
        titleElement.innerText = laptops[0].title;
        priceElement.innerText = new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(laptops[0].price);
        descriptionElement.innerText = laptops[0].description;
        imageElement.setAttribute("src", api + laptops[0].image);
        selectedLaptop = laptops[0]; // sets the inital selected laptop to the first laptop in the menu
        addFeatureList(laptops[0].specs);
    }

    const addLaptopToMenu = (laptop) => {
        const laptopElement = document.createElement("option");
        laptopElement.value = laptop.id;
        laptopElement.appendChild(document.createTextNode(laptop.title));
        laptopsElement.appendChild(laptopElement);
    }

    const handleLaptopMenuChange = e => {
        selectedLaptop = laptops[e.target.selectedIndex];
        //featureElement.innerText = selectedLaptop.specs;
        titleElement.innerText = selectedLaptop.title;
        priceElement.innerText = new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(selectedLaptop.price);
        descriptionElement.innerText = selectedLaptop.description;
        imageElement.setAttribute("src", api + selectedLaptop.image);
        addFeatureList(selectedLaptop.specs);
    }

    const addFeatureList = (list) => {
        document.getElementById("laptop-features").innerHTML = ""; // reset the list before adding new elements
        for (let i of list) {
            let li = document.createElement("li"); 
            li.innerHTML = i;
            document.getElementById("laptop-features").appendChild(li);
        }
    }

    laptopsElement.addEventListener("change", handleLaptopMenuChange);
}

function buyLaptop() {
    if (balance >= selectedLaptop.price) { // checks if the user can afford the laptop
        if (confirm("You are about to buy the " + selectedLaptop.title + " for " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(selectedLaptop.price) + ". Do you want to proceed?")) {
            setBalance(balance - selectedLaptop.price);
            alert("You have successfully bought the " + selectedLaptop.title);
        } else {
            alert("The buy was cancelled");
        }
    } else { // the user cannot afford the laptop
        alert("You do not have enough money to buy the laptop");
    }
}