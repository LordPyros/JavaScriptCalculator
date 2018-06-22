$(document).ready(function () {

    // The first number for the operation
    var fistNumber = 0;
    // The second number for the operation
    var secondNumber = 0;
    // Variable to store the current number in memory
    var memoryNumber = 0;
    // string containing the symbol for the current operation
    var operator = "";

    // state 0 = no numbers or first number being entered
        // state 1 = first number and an operator used
        // state 2 = first number and an operator used and second number
        // state 3 = first and second numbers with an operator and equals pressed
        // state 9 = error
    var state = 0;

    // The current screen text
    var currentTextOnScreen = "0";

    // Click Handler
    $("button").on("click", function () {
        switch (this.id) {
            case "+":
            case "-":
            case "/":
            case "*":
                operation(this.id);
                break;
            case ".":
                decimal();
                break;
            case "clearAll":
                clear();
                break;
            case "clearScreen":
                clearScreen();
                break;
            case "backspace":
                backspace();
                break;
            case "M+":
                memoryAdd();
                break;
            case "M-":
                memoryMinus();
                break;
            case "MR":
                memoryRemind();
                break;
            case "MC":
                memoryClear();
                break;
            case "%":
                percent();
                break;
            case "equals":
                equals();
                break;
            default:
                numberButtonPressed(this.id);
                break;
        }
    });

    // Number press function
    function numberButtonPressed(number) {
        switch (state) {
            case 0:
            case 3:
            case 9:
                // Reset if number pressed after equals or in error
                if (state == 3 || state == 9) {
                    resetVariables();
                }
                // the screen currently reads "0"
                if (currentTextOnScreen == "0") {
                    // display the new digit on the screen
                    currentTextOnScreen = number;
                    updateScreen();
                }
                else {
                    // the screen is displaying a number other than "0"
                    currentTextOnScreen += number;
                    updateScreen();
                }
                break;
            case 1:
                // display the number and set new state
                currentTextOnScreen = number;
                updateScreen();
                state = 2;
                break;
            case 2:
                // the second number has already been partially entered and is not 0
                if (currentTextOnScreen != "0") {
                    // display the currently displayed number and concatinate the new digit on the end
                    currentTextOnScreen += number;
                    updateScreen();
                }
                // no part of the second number has been entered yet
                else {
                    // display the new digit on the screen
                    currentTextOnScreen = number;
                    updateScreen();
                }
                break;
        }
        // prevent a number longer than 15 characters being entered
        if (currentTextOnScreen.length > 15) {
            backspace();
        }
    }

    function operation(op) {
        switch (state) {
            case 0:
                if (op == "-" && currentTextOnScreen == "0") {
                    currentTextOnScreen = "-";
                    updateScreen();
                }
                else if (currentTextOnScreen == "-") {
                    //Do Nothing
                }
                else {
                    // save the number on screen as the first number
                    firstNumber = currentTextOnScreen;
                    // set the current operator
                    operator = op;
                    // set the new state
                    state = 1;
                }
                break;
            case 1:
                if (op == "-") {
                    currentTextOnScreen = "-";
                    updateScreen();
                    state = 2;
                }
                else {
                    operator = op;
                }
                break;
            case 2:
                // If minus is already displayed and is pressed again, do nothing
                if (currentTextOnScreen == "-" && operator == "-") {
                    // Do nothing
                }
                else {
                    // Do calculation
                    switch (operator) {
                        case "+":
                            addTwoNumbers(firstNumber, currentTextOnScreen);
                            break;
                        case "-":
                            subtractTwoNumbers(firstNumber, currentTextOnScreen);
                            break;
                        case "/":
                            divideTwoNumbers(firstNumber, currentTextOnScreen);
                            break;
                        case "*":
                            multiplyTwoNumbers(firstNumber, currentTextOnScreen);
                            break;
                    }
                    firstNumber = currentTextOnScreen;
                    operator = op;
                    if (state != 9)
                        state = 1;
                }
                break;
            case 3:
                firstNumber = currentTextOnScreen;
                operator = op;
                state = 1;
                break;
            case 9:
                // Do nothing
                break;
        }
    }

    function equals() {
        switch (state) {
            case 0:
            case 1:
                // Do nothing
                break;
            case 2:
                if (currentTextOnScreen == "-")
                    error();
                else {
                    secondNumber = currentTextOnScreen;
                    switch (operator) {
                        case "+":
                            addTwoNumbers(firstNumber, currentTextOnScreen);
                            break;
                        case "-":
                            subtractTwoNumbers(firstNumber, currentTextOnScreen);
                            break;
                        case "/":
                            divideTwoNumbers(firstNumber, currentTextOnScreen);
                            break;
                        case "*":
                            multiplyTwoNumbers(firstNumber, currentTextOnScreen);
                            break;
                    }
                    if (state != 9)
                        state = 3;
                }
                break;
            case 3:
                switch (operator) {
                    case "+":
                        addTwoNumbers(secondNumber, currentTextOnScreen);
                        break;
                    case "-":
                        subtractTwoNumbers(currentTextOnScreen, secondNumber);
                        break;
                    case "/":
                        divideTwoNumbers(currentTextOnScreen, secondNumber);
                        break;
                    case "*":
                        multiplyTwoNumbers(secondNumber, currentTextOnScreen);
                        break;
                }
                break;
            case 9:
                // Do nothing
                break;
        }
    }

    function decimal() {
        switch (state) {
            case 0:
            case 2:
                // Make sure that the current number doesn't already contain a decimal point and that its not too long to add too
                if (!currentTextOnScreen.includes('.') && currentTextOnScreen.length <= 20) {
                    // concatinate a decimal point to the end of the currently displayed number
                    currentTextOnScreen += ".";
                    updateScreen();
                }
                break;
            case 1:
                // second number has not been started so set screen to display "0."
                currentTextOnScreen = "0.";
                updateScreen();
                // set the new state
                state = 2;
                break;
            case 3:
                // pressing decimal after the equals button clears the last operation and displays a decimal point
                resetVariables();
                currentTextOnScreen = "0.";
                updateScreen();
                break;
            case 9:
                // Do nothing
                break;
        }
    }

    function percent() {
        switch (state) {
            case 0:
                // if display doesn't read "0", divide the displayed number by 100
                if (currentTextOnScreen != "0" && currentTextOnScreen != "-")
                    currentTextOnScreen = currentTextOnScreen / 100;
                break;
            case 2:
                if (currentTextOnScreen != "-") {
                    switch (operator) {
                        case "/":
                            // divide first number by number on screen, then times by 100
                            currentTextOnScreen = ((firstNumber / currentTextOnScreen) * 100);
                            updateScreen();
                            break;
                        case "+":
                            // divide number on screen by 100, then add first number
                            currentTextOnScreen = ((currentTextOnScreen / 100) + firstNumber);
                            updateScreen();
                            break;
                        case "-":
                            // divide number on screen by 100, then subtract it from first number
                            currentTextOnScreen = (firstNumber - (currentTextOnScreen / 100));
                            updateScreen();
                            break;
                        case "*":
                            // divide number on screen by 100, then multiply it by first number
                            currentTextOnScreen = (currentTextOnScreen / 100) * firstNumber;
                            updateScreen();
                            break;
                    }
                    state = 0;
                }
                break;
            case 3:
                // if display doesn't read "0", divide the displayed number by 100
                if (currentTextOnScreen != "0") {
                    currentTextOnScreen = currentTextOnScreen / 100;
                    updateScreen();
                }
                break;
            case 1:
            case 9:
                // Do nothing
                break;
        }
    }

    // Memory Fuctions
    function memoryAdd() {
        if (state != 9 && currentTextOnScreen != 0 && currentTextOnScreen != "-") {
            if (memoryNumber == 0)
                memoryNumber = currentTextOnScreen;
            else
                memoryNumber = +memoryNumber + +currentTextOnScreen;
            if (memoryNumber.length > 15) {
                error();
                memoryNumber = 0;
            }
        }
            
    }
    function memoryMinus() {
        if (state != 9 && currentTextOnScreen != "0" && currentTextOnScreen != "-")
            memoryNumber -= currentTextOnScreen;
    }
    function memoryClear() {
        memoryNumber = 0;
    }
    function memoryRemind() {
        if (memoryNumber != 0) {
            switch (state) {
                case 0:
                case 2:
                    currentTextOnScreen = memoryNumber;
                    updateScreen();
                    break;
                case 1:
                    currentTextOnScreen = memoryNumber;
                    updateScreen();
                    state = 2;
                    break;
                case 3:
                case 9:
                    ResetVariables();
                    currentTextOnScreen = memoryNumber;
                    updateScreen();
                    break;
            }
        }
    }

    // Clear/delete functions
    function clear() {
        resetVariables();
    }
    function clearScreen() {
        switch (state) {
            case 0:
            case 2:
                currentTextOnScreen = "0";
                updateScreen();
                break;
            case 1:
                currentTextOnScreen = "0";
                updateScreen();
                state = 0;
                break;
            case 3:
            case 9:
                ResetVariables();
                break;
        }
    }
    function backspace() {
        // check numberpressed
        switch (state) {
            case 0:
            case 2:
                // remove the last number/character in the display
                currentTextOnScreen = currentTextOnScreen.slice(0, currentTextOnScreen.length -1);
                // afterwards if no number exists, display "0"
                if (currentTextOnScreen == "") {
                    currentTextOnScreen = "0";
                }
                updateScreen();
                break;
            case 1:
                // remove the last number/character in the display
                currentTextOnScreen = currentTextOnScreen.slice(0, currentTextOnScreen.length - 1);
                // afterwards if no number exists, display "0"
                if (currentTextOnScreen == "") {
                    currentTextOnScreen = "0";
                }
                updateScreen();
                // update the first number variable
                firstNumber = currentTextOnScreen;
                break;
            case 3:
            case 9:
                // Do Nothing
                break;
        }
    }

    function error() {
        // set the display to read "e"
        currentTextOnScreen = "e";
        updateScreen();
        // set error state
        state = 9;
    }

    function resetVariables() {
        // reset all variables back to their starting values
        firstNumber = 0;
        secondNumber = 0;
        operator = "";
        currentTextOnScreen = "0";
        updateScreen();
        state = 0;
    }

    function updateScreen() {
        document.getElementById("screen").innerHTML = currentTextOnScreen;
    }

    function trimNumber() {
        // The screen is only large enough to display 15 characters in total.
            // If the number contains a decimal point and its more than 15 places back, it means the whole part of the number
            // is too large to fit on the screen and an error should be displayed

            // if the number is smaller than 15 characters, do nothing
        if (currentTextOnScreen.length > 15) {
            // the number is more than 25 characters and contains a decimal point
            if (currentTextOnScreen.includes('.')) {
                // remove all characters after the 25th character
                currentTextOnScreen = currentTextOnScreen.slice(15);
                // the number no longer contains a decimal point therefore is too large for the whole number to be displayed
                if (!currentTextOnScreen.includes('.')) {
                    // display an "e" at the end to signify an error
                    currentTextOnScreen += "e";
                    updateScreen();
                    // set the error state
                    state = 9;
                }
            }
            // the number is too large to fit in the screen, display an error
            else {
                // reduce the number down to its first 15 characters
                currentTextOnScreen = currentTextOnScreen.slice(15);
                // display an "e" at the end to signify an error
                currentTextOnScreen += "e";
                updateScreen();
                // set the error state
                state = 9;
            }
        }
    }

    // operation functions
    function addTwoNumbers(firstNum, secondNum) {
        try {
            currentTextOnScreen = +firstNum + +secondNum;
            updateScreen();
            trimNumber();
        }
        catch{
            error();
        }
    }
    function subtractTwoNumbers(firstNum, secondNum) {
        try {
            currentTextOnScreen = firstNum - secondNum;
            updateScreen();
            trimNumber();
        }
        catch{
            error();
        }
    }
    function divideTwoNumbers(firstNum, secondNum) {
        if (firstNum == 0 || secondNum == 0)
            resetVariables();
        else {
            try {
                currentTextOnScreen = firstNum / secondNum;
                updateScreen();
                trimNumber();
            }
            catch{
                error();
            }
        }
    }
    function multiplyTwoNumbers(firstNum, secondNum) {
        try {
            currentTextOnScreen = firstNum * secondNum;
            updateScreen();
            trimNumber();
        }
        catch{
            error();
        }
    }

});


