/*  CALCULATOR V2  */

/* EDGE CASE LIST
    To think about edgecases, only concern yourself with the last pressed key on the calculator for every single key
  1)Numbers
    -no number has been entered but "." is pressed then add a 0 before it. Eg. make it 0.
    -if a number is pressed after an ENDABLE then add a "*" sign before adding the number. Eg. 2! 2 will become 2! * 2
  2)Pi
    -if pi is pressed after an ENDABLE then add a "*" before it. Eg. ππ will become π * π
  3)factorial (1 operand operator)
    -if "!" is pressed and the element before it is NOT a number OR "π" OR ")" then do nothing
  4)Operators (+, -, *, /, %, ^)
    --- ADD SUPPORT FOR NEGATIVE NUMBERS !!!!
    -if any number is divided by zero such that the answer is Infinity then display infinity and then reset currentNum to ""
    instead of "answer" variable in order to start anew
    -if an operator is pressed and the element before it is NOT a number or an ENDABLE then do nothing
    -if an operators is pressed after another operator(NON_ENDABLES) then replace that operator with the new
    operator in the equations array. Eg. in 2+3+ , if * is pressed then it will be 2+3*
    -if an operator is pressed after an ENDABLE then skip adding currentNum since it will be empty and just add operator
  5)Parenthesis
    -if opening parenthesis("(") is pressed after a number then add a "*"
    -if "(" is pressed after "!" or "π" then add a "*" before it. Eg. 2!(2) will become 2! * (2)
    -if ")" is pressed right after "(" then remove the "(" and then do nothing since it will make no difference
    Eg. 2 + (), will become 2 +
    -if the element before ")" is a NON_ENDABLE then do nothing since it will make the equation invalid
    -dont allow the user to enter more closing brackets than the opening brackets
  6)Equals (=)
    -if one or less than one elements have been entered then do nothing
    -auto close all unclosed opening brackets when equals is pressed
    -if the equation ends at an operator (NON_ENDABLE) then do nothing
    -if the equation ends at a "(" then just pop it out before running the checks
    -convert the "π" to the value of pi upto 6 digits
    -if the answer is "Infinity" then allClear everything and DONT store the last answer "Infinity" in currentNum
    -cut off long decimal answers upto 6 digis precision without rounding
    -remove trailing zeros after the decimal point and also the decimal point if everything after it has been removed
*/

"use strict";

const NON_ENDABLES = ["+", "-", "*", "/", "%", "^"];
// opening bracket "(" is not included in ENDABLES because it is handled as a special case
const ENDABLES = ["!", "π", ")"];
let openingBrackets = 0;
let closingBrackets = 0;

let equation = [];
let currentNum = "";

addEventListeners();



function addEventListeners() {
  keyPress_EL();
  numbers_EL();
  pi_EL();
  opp_1operand_EL();
  operators_EL();
  parenthesis_EL();
  clear_EL();
  equals_EL();
}

function keyPress_EL() {
  document.addEventListener("keydown", (event) => {
    if (isFinite(event.key) || event.key === ".") {
      addToCurrentnum(event);
    }
    else if (NON_ENDABLES.includes(event.key)) {
      addOperators(event);
    }

    switch (event.key) {
      case "Enter":
        printResult();
        return;
      case "`":
        addPi();
        return;
      case "(":
        addOpenParenthesis();
        return;
      case ")":
        addCloseParenthesis();
        return;
      case "!":
        addOpp_1();
        return;
      case "Backspace":
        clearEntry();
        return;
      case "Delete":
        allClear();
        return;
    };
  })
}

function printFullEquation() {
  const displayText = document.querySelector(".display-text");

  displayText.textContent = `${equation.join(" ")} ${currentNum}`;
  // Make the p scroll left incase the equation is long so that the user is looking at the latest input after every input
  displayText.scrollLeft = displayText.scrollWidth;
}

function numbers_EL() {
  const button_numbers = document.querySelectorAll(".numbers");

  button_numbers.forEach((button) => button.addEventListener("click", addToCurrentnum));
}

function addToCurrentnum(event) {
  const key = event.key ? event.key : event.target.id.slice(-1);

  if (ENDABLES.includes(equation[equation.length - 1])) {
    equation.push("*");
  }
  if (currentNum === "" && key === ".") {
    currentNum += "0.";
  }
  currentNum += key;
  printFullEquation();
}

function pi_EL() {
  const button_pi = document.getElementById("button_pi");

  button_pi.addEventListener("click", addPi);
}

function addPi() {
  if (ENDABLES.includes(equation[equation.length - 1])) {
    equation.push("*");
  }
  equation.push("π");
  printFullEquation();
}

function opp_1operand_EL() {
  const button_fact = document.getElementById("button_fact");

  button_fact.addEventListener("click", addOpp_1);
}

function addOpp_1() {
  if (currentNum || isFinite(equation[equation.length - 1]) 
      || equation[equation.lenght - 1] === ")" || equation[equation.length - 1] === "π") {
    if (currentNum) {
      equation.push(+currentNum);
      currentNum = "";
    }
    equation.push("!");
  }
  printFullEquation();
}

function operators_EL() {
  const operators = document.querySelectorAll(".operators_2");

  operators.forEach((button) => button.addEventListener("click", addOperators));
}

function addOperators(event) {
  const key = event.key ? event.key : event.target.id.slice(-1);
  if (currentNum || isFinite(equation[equation.length - 1]) || ENDABLES.includes(equation[equation.length - 1])) {
    if (currentNum) {
      equation.push(+currentNum);
      currentNum = "";
    }
    if (NON_ENDABLES.includes(equation[equation.length - 1])) {
      equation.pop();
    }
    equation.push(key);
  }
  printFullEquation();
}

function parenthesis_EL() {
  const button_open = document.getElementById("button_open");
  const button_close = document.getElementById("button_close");

  button_open.addEventListener("click", addOpenParenthesis);
  button_close.addEventListener("click", addCloseParenthesis);
}

function addOpenParenthesis() {
  if (currentNum) {
    equation.push(+currentNum);
    currentNum = "";
    equation.push("*");
  }
  if (equation[equation.length - 1] === "π" || equation[equation.length - 1] === "!") {
    equation.push("*");
  }
  openingBrackets++;
  equation.push("(");
  printFullEquation();
}

function addCloseParenthesis() {
  if (closingBrackets >= openingBrackets) {
    return;
  }
  if (equation[equation.length - 1] === "(") {
    equation.pop();
  }
  if (currentNum || ENDABLES.includes(equation[equation.length - 1])) {
    if (currentNum) {
      equation.push(+currentNum);
      currentNum = "";
    }
    closingBrackets++;
    equation.push(")");
  }
  printFullEquation();
}

function clear_EL() {
  const button_AC = document.getElementById("button_AC");
  const button_CE = document.getElementById("button_CE");

  button_AC.addEventListener("click", allClear);
  button_CE.addEventListener("click", clearEntry);
}

function allClear() {
  equation.length = 0;
  currentNum = "";
  openingBrackets = 0;
  closingBrackets = 0;
  printFullEquation();
}

function clearEntry() {
  if (equation[equation.length - 1] === "(") openingBrackets--;
  else if (equation[equation.length - 1] === ")") closingBrackets--;

  if (currentNum === "") equation.pop();
  else currentNum = currentNum.slice(0, -1);
  printFullEquation();
}

function equals_EL() {
  const equals = document.getElementById("button_equals");

  equals.addEventListener("click", printResult);
}

function printResult() {
  if (equation.length > 1) {
    if (equation[equation.length - 1] === "(") {
      equation.pop();
    }
    
    if (currentNum || ENDABLES.includes(equation[equation.length - 1])) {
      if (currentNum) {
        equation.push(+currentNum);
        currentNum = "";
      }

      while (openingBrackets > closingBrackets) {
        equation.push(")");
        closingBrackets++;
      }

      // Converting the "π" symbol to the value of pi upto 6 digits precision WITHOUT ROUNDING 
      equation = equation.map(element => element === "π" ? Number(Math.trunc(Math.PI * 1000000) / 1000000) : element);

      let answer = String(calculate(equation));

      console.log(answer);

      if (answer === "Infinity") {
        printFullEquation();
        allClear();
        return;
      }

      allClear();
      // if the decimal part of the answer is longer than 6 digits then truncate it upto 6 digits without rounding it off
      // and also removing trailing zeros after the decimal point and also the decimal point if everything after it has been removed
      if (answer.slice(0, answer.indexOf(".") + 7).length > 6) {
        answer = answer.slice(0, answer.indexOf(".") + 7);
        while (answer.endsWith("0")) {
          answer = answer.slice(0, -1);
        }
        if (answer[answer.length - 1] === ".") {
          answer = answer.slice(0, -1);
        }
      }
      currentNum = answer;
    }
  }
  printFullEquation();
}


// console.log(calculate("( 5 + 3 ) * 2 ! - 4 ^ 2"));





function calculate(equation) {
  if(!equation) {
    return;
  }

  const flags = {
    par: 0,
    exp_fact: 0,
    mul_div_mod: 0,
    add_sub: 0
  }

  equation.forEach((element) => {
    if (element === "(" || element === ")") {
      flags.par++;
    }
    else if (element === "^" || element === "!") {
      flags.exp_fact++;
    }
    else if (element === "*" || element === "/" || element === "%") {
      flags.mul_div_mod++;
    }
    else if (element === "+" || element === "-") {
      flags.add_sub++;
    }
  })

  // If the flag is true which means that the corresponding operation needs to be performed
  // Then run the function and update equation, else do nothing (undefined is equal to doing nothing)
  flags.par ? equation = parenthesis(equation) : undefined;
  flags.exp_fact ? equation = exponent_factorial(equation) : undefined;
  flags.mul_div_mod ? equation = multiplication_division_modulus(equation) : undefined;
  flags.add_sub ? equation = addition_subtraction(equation) : undefined;
  
  return +equation;
}

function parenthesis(equation) {
  let parenthesisPairs = 0;

  for (let i = 0; i < equation.length; i++) {
    if (equation[i] === "(" || equation[i] === ")") {
      parenthesisPairs++;
    }
  }

  parenthesisPairs /= 2;

  for (let j = 0; j < parenthesisPairs; j++) {
    let parenthesisStartIndex = -1, parenthesisEndIndex = -1;

    for(let i = 0, length = equation.length; i < length; i++) {
      if (equation[i] === "(") {
        parenthesisStartIndex = i;
      }
      else if (equation[i] === ")") {
        parenthesisEndIndex = i;
        if (parenthesisStartIndex !== -1 && parenthesisEndIndex !== -1) {
          const subEquation = equation.slice(parenthesisStartIndex + 1, parenthesisEndIndex);
          const ans = calculate(subEquation);

          let toRemove = (parenthesisEndIndex + 1) - parenthesisStartIndex;
          equation.splice(parenthesisStartIndex, toRemove, ans);
        }
        break;
      }
    }
  }

  return equation;
}

function exponent_factorial(equation) {
  // Exponent
  for (let i = 0, length = equation.length; i < length; i++) {
    if (equation[i] === "^") {
      let ans = equation[i - 1] ** equation[i + 1];
      equation.splice(i - 1, 3, ans);
      i = 0;
      length = equation.length;
    }
  }

  // Factorial
  for (let i = 0, length = equation.length; i < length; i++) {
    if (equation[i] === "!") {
      let ans = 1, num = equation[i - 1];
      for (let i = 2; i <= num; i++) {
        ans *= i;
      }

      equation.splice(i - 1, 2, ans);
      i = 0;
      length = equation.length;
    }
  }

  return equation;
}

function multiplication_division_modulus(equation) {
  for (let i = 0, length = equation.length; i < length; i++) {
    if (equation[i] === "*") {
      let ans = equation[i - 1] * equation[i + 1];
      equation.splice(i - 1, 3, ans);
      i = 0;
      length = equation.length;
    }
    else if (equation[i] === "/") {
      let ans = equation[i - 1] / equation[i + 1];
      equation.splice(i - 1, 3, ans);
      i = 0;
      length = equation.length;
    }
    else if (equation[i] === "%") {
      let ans = equation[i - 1] % equation[i + 1];
      equation.splice(i - 1, 3, ans);
      i = 0;
      length = equation.length;
    }
  }

  return equation;
}

function addition_subtraction(equation) {
  for (let i = 0, length = equation.length; i < length; i++) {
    if (equation[i] === "+") {
      let ans = equation[i - 1] + equation[i + 1];
      equation.splice(i - 1, 3, ans);
      i = 0;
      length = equation.length;
    }
    else if (equation[i] === "-") {
      let ans = equation[i - 1] - equation[i + 1];
      equation.splice(i - 1, 3, ans);
      i = 0;
      length = equation.length;
    }
  }

  return equation;
}