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



console.log(calculate("( 10 - 2 ) * ( 3 + 1 )"));





function calculate(equation) {
  if (!Array.isArray(equation)) {
    equation = equation.trim().split(" ");
  }
  console.log(equation);

  equation = parenthesis(equation);
  console.log(equation);
  equation = exponent_order(equation);
  equation = multiplication_division(equation);
  equation = addition_subtraction(equation);
  
  return +equation;
}

function parenthesis(equation) {
  let parenthesisStartIndex = -1, parenthesisEndIndex = -1;
  for(let i = 0; i < equation.length; i++) {
    if (equation[i] === "(") {
      parenthesisStartIndex = i;
    }
    else if (equation[i] === ")") {
      parenthesisEndIndex = i;
      if (parenthesisStartIndex !== -1 && parenthesisEndIndex !== -1) {
        const subEquation = equation.slice(parenthesisStartIndex + 1, parenthesisEndIndex);
        console.log(subEquation);
        const ans = calculate(subEquation);
        equation.splice(parenthesisStartIndex, parenthesisEndIndex + 1, ans);
      }
    }
  }

  if (parenthesisStartIndex !== -1 && parenthesisEndIndex !== -1) {
    const subEquation = equation.slice(parenthesisStartIndex + 1, parenthesisEndIndex);
    console.log(subEquation);
    const ans = calculate(subEquation);
    equation.splice(parenthesisStartIndex, parenthesisEndIndex + 1, ans);
  }

  return equation;
}

function exponent_order(equation) {
  for (let i = 0, length = equation.length; i < length; i++) {
    if (equation[i] === "^") {
      let ans = (+equation[i - 1]) ** +equation[i + 1];
      equation.splice(i - 1, 3, ans);
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