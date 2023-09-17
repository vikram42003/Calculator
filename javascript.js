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



"use strict";



console.log(calculate("2 + 4 !"));





function calculate(equation) {
  if (!Array.isArray(equation)) {
    equation = equation.trim().split(" ");
  }

  equation = parenthesis(equation);
  equation = exponent_order_factorial(equation);
  equation = multiplication_division(equation);
  equation = addition_subtraction(equation);
  
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
          console.log(equation);
          const subEquation = equation.slice(parenthesisStartIndex + 1, parenthesisEndIndex);
          const ans = calculate(subEquation);

          let toRemove = (parenthesisEndIndex + 1) - parenthesisStartIndex;
          equation.splice(parenthesisStartIndex, toRemove, ans);
          console.log(equation);
        }
        break;
      }
    }
  }

  return equation;
}

function exponent_order_factorial(equation) {
  for (let i = 0, length = equation.length; i < length; i++) {
    if (equation[i] === "^") {
      let ans = (+equation[i - 1]) ** +equation[i + 1];
      equation.splice(i - 1, 3, ans);
      i = 0;
      length = equation.length;
    }
  }

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

function multiplication_division(equation) {
  for (let i = 0, length = equation.length; i < length; i++) {
    if (equation[i] === "*") {
      let ans = +equation[i - 1] * +equation[i + 1];
      equation.splice(i - 1, 3, ans);
      i = 0;
      length = equation.length;
    }
    else if (equation[i] === "/") {
      let ans = +equation[i - 1] / +equation[i + 1];
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
      let ans = +equation[i - 1] + +equation[i + 1];
      equation.splice(i - 1, 3, ans);
      i = 0;
      length = equation.length;
    }
    else if (equation[i] === "-") {
      let ans = +equation[i - 1] - +equation[i + 1];
      equation.splice(i - 1, 3, ans);
      i = 0;
      length = equation.length;
    }
  }

  return equation;
}