let balance = 200;
let outstandingLoan = 0;
let salaryBalance = 0;

window.onload = function(){
    document.getElementById('balance').innerHTML = "Balance: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(balance);
    document.getElementById('Pay').innerHTML = "Pay: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(salaryBalance);
    document.getElementById('repayLoanButton').style.visibility = "hidden";
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
    outstandingLoan = newLoan;
    document.getElementById("OutstandingLoan").innerHTML = "Outstanding loan: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(outstandingLoan);
    if (outstandingLoan == 0) {
        document.getElementById('repayLoanButton').style.visibility = "hidden";
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
// TODO give feedback when succsesful
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