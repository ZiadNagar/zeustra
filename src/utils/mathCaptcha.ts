type MathOperator = "+" | "-";

export type MathChallenge = {
  question: string;
  answer: string;
};

export type MathValidationResult = {
  valid: boolean;
  error?: string;
};

export const generateMathChallenge = (): MathChallenge => {
  const operators: MathOperator[] = ["+", "-"];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let num1;
  let num2;
  let answer;

  if (operator === "+") {
    num1 = Math.floor(Math.random() * 5) + 1;
    num2 = Math.floor(Math.random() * (10 - num1)) + 1;
    answer = num1 + num2;
  } else {
    num1 = Math.floor(Math.random() * 5) + 5;
    num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
    answer = num1 - num2;
  }

  return {
    question: `${num1} ${operator} ${num2} = ?`,
    answer: answer.toString(),
  };
};

export const validateMathAnswer = (
  input: string,
  challenge: MathChallenge,
): MathValidationResult => {
  if (!input || !String(input).trim()) {
    return { valid: false, error: "Please solve the math answer" };
  }

  const normalized = String(input).trim();
  if (normalized !== String(challenge?.answer)) {
    return { valid: false, error: "Incorrect answer" };
  }

  return { valid: true };
};

export default {
  generateMathChallenge,
  validateMathAnswer,
};
