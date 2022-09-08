let balance = 200;
let outstandingLoan = 0;

window.onload = function(){
    document.getElementById('balance').innerHTML = "Balance: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(balance);
};

function getLoan() {
    let text;
    let amount = prompt("Enter the amount you want to loan:");
    if (isNaN(amount)) {
        text = "Enter a number";
    } else if (amount > balance * 2) {
        text = "You cannot get a loan more than double of your bank balance: Your maximum amount of loan is " + balance * 2;
    } else if (outstandingLoan > 0){
        text = "You can only have one loan at a time";
    } else {
        addLoan(amount);
        text = "You have loaned " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(amount);
    }
    document.getElementById("loanMessage").innerHTML = text;
}

function addLoan(amount) {
    outstandingLoan = amount;
    document.getElementById("OutstandingLoan").innerHTML = "Outstanding loan: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(outstandingLoan);
}