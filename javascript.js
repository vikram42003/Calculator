/*  CALCULATOR V1
  1)Take input from the user one button at a time
  2)Read the input -
    -If input does not end on a number then display message "input incomplete"
      OR the "=" button does nothing
  3)Evaluate input using PEDMAS/BODMAS- eg. 3 - 9 + 3 * 2² / (2 + 2)
    -Evaluate PARENTHESIS/BRACKETS and return evaluated calcualtion eg. 3 - 9 + 3 * 2² / 4
    -Evaluate EXPONENTS/ORDER and return evaluated calculation eg. 3 - 9 + 3 * 4 / 4
    -Evaluate MULTIPLICATIONS AND DIVISIONS FROM LEFT TO RIGHT and return evaluated calculation eg. 3 - 9 + 3
    -Evaluate ADDITIONS AND SUBTRACTIONS FROM LEFT TO RIGHT and return evaluated calculation eg. -3
  4)Display the final result
*/

/* DA PLAN
  1)if it a number add it to current num as a string to like build up the number
    -treat dots the same
  2)if it a 2 OPERAND OPP like +, -, *, /, %
    -check if the latest item on the array IS NOT a 2 operand opp, if it is then do nothing
    -convert the currentNum to a number and add it to the equation array
    -after the number, add the opp to the array
  3)on pressing = button
    -convert the currentNum to number and add it to array
    -calculate the results
    -reset currentNum and the array
    -add the result to the array so that it may be used to do future calculations
*/


// close any open parenthesis before passing the equation to calculate

// IDEA
// add a non-endable characters array of operators on which the equation cannot end like (+, -, *, /, %, ^)
// add another array of endables like (numbers, !, "(", ")")
// use this to do all the validity checks


/* EDGE CASE LIST
    To think about edgecases, only concern yourself with the last pressed key on the calculator for every single key
  1)Numbers
    -no number has been entered but "." is pressed then add a 0 before it. Eg. make it 0.
    -if a number is pressed after an ENDABLE then add a "*" sign before adding the number. Eg. 2! 2 will become 2! * 2
  2)Pi
    -if pi is pressed after an ENDABLE then add a "*" before it. Eg. ππ will become π * π
  3)factorial (1 operand operator)
    -if "!" is pressed and the element before it is NOT a number OR an ENDABLE then do nothing
    -if "!" button is pressed after an ENDABLE then add a "*" before it
  4)Operators (+, -, *, /, %, ^)
    -if an operator is pressed and the element before it is NOT a number or an ENDABLE then do nothing
    -if an operators is pressed after another operator(NON_ENDABLES) then replace that operator with the new
    operator in the equations array. Eg. in 2+3+ , if * is pressed then it will be 2+3*
    -if an operator is pressed after an ENDABLE then skip adding currentNum since it will be empty and just add operator
*/

"use strict";

const NON_ENDABLES = ["+", "-", "*", "/", "%", "^"];
// opening bracket "(" is not included in ENDABLES because it is handled as a special case
const ENDABLES = ["!", "π", ")"];

const equation = [];
let currentNum = "";

// addEventListeners();



function addEventListeners() {
  numbers_EL();
  pi_EL();
  opp_1operand_EL();
  operators_EL();
  // parenthesis_EL();
  clear_EL();
  // equals_EL();
}

function numbers_EL() {
  const button_numbers = document.querySelectorAll(".numbers");

  button_numbers.forEach((button) => button.addEventListener("click", addToCurrentnum));
}

function addToCurrentnum(event) {
  if (ENDABLES.includes(equation[equation.length - 1])) {
    equation.push("*");
  }
  if (currentNum === "" && event.target.id.slice(-1)) {
    currentNum += "0.";
  }
  currentNum += event.target.id.slice(-1);
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
}

function opp_1operand_EL() {
  const button_fact = document.getElementById("button_fact");

  button_fact.addEventListener("click", addOpp_1);
}

function addOpp_1() {
  if (currentNum !== "" || ENDABLES.includes(equation[equation.length - 1])) {
    if (ENDABLES.includes(equation[equation.length - 1])) {
      equation.push("*");
    }
    if (currentNum !== "") {
      equation.push(+currentNum);
      currentNum = "";
    }
    equation.push("!");
  }
}

function operators_EL() {
  const operators = document.querySelectorAll(".operators_2");

  operators.forEach((button) => button.addEventListener("click", addOperators));
}

function addOperators(event) {
  if (currentNum !== "" || ENDABLES.includes(equation[equation.length - 1])) {
    if (NON_ENDABLES.includes(equation[equation.length - 1])) {
      equation.pop();
      equation.push(event.target.id.slice(-1));
      return;
    }
    if (currentNum !== "") {
      equation.push(+currentNum);
      currentNum = "";
    }
    equation.push(event.target.id.slice(-1));
  }
}

function clear_EL() {
  const button_AC = document.getElementById("button_AC");
  const button_CE = document.getElementById("button_CE");

  button_AC.addEventListener("click", () => {
    equation = [];
    currentNum = "";
  });
  button_CE.addEventListener("click", () => {
    if (currentNum === "") equation.pop();
    else currentNum = currentNum.slice(0, -1);
  });
}

// function addToCurrentnum(event) {
//   // Register the pressed number by adding it to currentNum by extracting last character of ID name
//   //EDGECASE: If a number is pressed after closing bracket or pi then put a multiply sign in between
//   //Eg. (2+2)2 will become (2+2) * 2, π2 will become π * 2, so that it can work with calcuator function 
//   if (equation[equation.length - 1] === ")" || equation[equation.length - 1] === "π") {
//     equation.push("*");
//   }

//   if (currentNum === "" || event.target.id.slice(-1) === ".") {
//     currentNum = "0."
//   }
//   currentNum += event.target.id.slice(-1);
// }

// function addPi() {
//   // Calculate function will convert it to the actual value of pi so add it as a string here
//   // EDGECASE: pi is pressed right after a number, after closing brackets or after another pi
//   // Eg. 2π will become 2 * π, (1+1)π will become (1+1) * π, πππ will become π * π * π
//   if (!currentNum === "" || equation[equation.length - 1] === ")" || equation[equation.length - 1] === "π") {
//     currentNum ? equation.push(+currentNum) : null;
//     currentNum ? currentNum = "" : null;
//     equation.push("*");
//   }
//   equation.push("π");
// }

// function addOpp_1() {
//   if (!currentNum === "" || equation[equation.length - 1] === ")") {
//     currentNum ? equation.push(+currentNum) : null;
//     currentNum ? currentNum = "" : null;
//     equation.push("!");
//   }
// }

// function addOpp_2(event) {
//   /*EDGECASE: If user presses operator before entering any number then do nothing
//     EDGECASE: But do allow operators after a ")" because in that case the equation in brackets will become an
//     an operand for the opeartor. eg. (1+1) * 2 will become 2 * 2 after brackets are evaluated so do allow this rule
//     The opening brackets "(" will be handled by brackets function 2 * (1 + 1)
//     EDGECASE: Allow an operator input to be registered incase the previous element is the unary factorial("!") opreator
//     Eg. allow something like "5! + 3" to be legal
//   */
//   if (!currentNum === "" || equation[equation.length - 1] === ")" || equation[equation.length - 1] === "!") {
//     currentNum ? equation.push(+currentNum) : null;
//     currentNum ? currentNum = "" : null;
//     equation.push(event.target.id.slice(-1));
//   }
// }

// function parenthesis_EL() {
//   const button_open = document.getElementById("button_open");
//   const button_close = document.getElementById("button_close");

//   button_open.addEventListener("click", addOpenParenthesis);
//   button_close.addEventListener("click", addCloseParenthesis);
// }

// function addOpenParenthesis() {

// }

// function equals_EL() {
//   const equals = document.getElementById("button_equals");

//   equals.addEventListener("click", displayAnswer);
// }

// function displayAnswer() {
//   equation.push(+currentNum);
//   currentNum = "";

//   const answer = calculate(equation);
//   console.log(answer);
//   // Emptying the array
//   equation.length = 0;
//   equation.push(answer);
// }


// console.log(calculate("( 4 / 3 ) * π * 2 ^ 3"));





function calculate(equation) {
  if(!equation) {
    return;
  }

  // Convert the string to an array of numbers for each number or numberlike element
  if (!Array.isArray(equation)) {
    equation = equation.trim().split(" ").map(element => {
      if (element === "π") return Number(Math.PI.toPrecision(7));
      return Number(element) ? Number(element) : element
    });
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