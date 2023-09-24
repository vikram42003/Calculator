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



"use strict";

const equation = [];
let currentNum = "";

addEventListeners();


function addEventListeners() {
  numbers_EL();
  opp_2operand_EL();
  clear_EL();
  equals_EL();
}

function numbers_EL() {
  const button_numbers = document.querySelectorAll(".numbers");

  button_numbers.forEach((button) => button.addEventListener("click", addToCurrentnum));
}

function addToCurrentnum(event) {
  // Register the pressed number by adding it to currentNum by extracting last character of ID name
  currentNum += event.target.id.slice(-1);
}

function opp_2operand_EL() {
  const opp_2 = document.querySelectorAll(".operators_2");

  opp_2.forEach((button) => button.addEventListener("click", addOpp_2));
}

function addOpp_2(event) {
  const prevItem = equation[equation.length - 1];
  
  if (prevItem === "+" || prevItem === "-" || prevItem === "*" || prevItem === "/" || prevItem === "%") {
    console.log("trig");
  }
  else {
    // add the number and then the pressed operator to the equation
    equation.push(+currentNum);
    currentNum = "";
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

function equals_EL() {
  const equals = document.getElementById("button_equals");

  equals.addEventListener("click", displayAnswer);
}

function displayAnswer() {
  equation.push(+currentNum);
  currentNum = "";

  const answer = calculate(equation);
  console.log(answer);
  // Emptying the array
  equation.length = 0;
  equation.push(answer);
}


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