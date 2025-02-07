import * as math from "mathjs";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

export const useCalculator = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [customVariables, setCustomVariables] = useImmer([]);
  const [definedVariables, setDefinedVariables] = useImmer([
    { label: "Kₖ", value: 10 },
    { label: "D₁", value: 20 },
    { label: "Tₓ", value: 20 },
    { label: "x₇", value: 20 },
    { label: "H₈", value: 20 },
    { label: "L₉", value: 20 },
    { label: "E", value: 30 },
    { label: "r", value: 40 },
    { label: "P₁", value: 50 },
    { label: "P₀", value: 60 },
    { label: "i", value: 10 },
    { label: "V₁", value: 70 },
    { label: "n", value: 20 },
    { label: "An", value: 20 },
    { label: "b", value: 30 },
    { label: "br", value: 60 },
    {
      label: "DΔ",
      value: 100,
    },
    {
      label: "PΔ",
      value: 40,
    },
    {
      label: "ΔH",
      value: 80,
    },
  ]);

  const digitKeys = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "0", value: "0" },
  ];

  const operationsKeys = [
    // { label: "÷", value: "\\div" },
    { label: "÷", value: "\\frac{}{}" },
    { label: "×", value: "\\times" },
    { label: "-", value: "-" },
    { label: "+", value: "+" },
    { label: ".", value: "." },
  ];

  const keepFocused = (mathfield) => {
    mathfield?.focus();
  };

  const mathQuillConfig = {
    restrictMismatchedBrackets: true,
    autoSubscriptNumerals: true,
    // handlers: {
    //   downOutOf: (mathField) => console.log("downOutOf"),
    //   upOutOf: (mathField) => console.log("upOutOf"),
    edit: (mathField) => mathField?.focus(),
    enter: (mathField) => console.log("enter"),
    enter: (mathField) => console.log(mathField.cmd()),
    // },
  };

  const findExistingVar = (keyname) => {
    return definedVariables?.find((key) => key?.label === keyname);
  };

  const handleVarValueChange = (key, value) => {
    setDefinedVariables((draft) => {
      const existingValue = draft?.find((ele) => ele?.label === key);
      if (existingValue) {
        // Object.assign(existingValue, {
        //   value,
        // });

        existingValue.value = value;
      }
    });
  };

  const removeVariable = (label) => {
    setCustomVariables((draft) => {
      const filtered = draft?.filter((ele) => ele?.label !== label);
      return filtered;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const input = expression.trim();
      const match = input.match(
        /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(-?\d*\.?\d+)$/
      );
      if (match) {
        const [_, variableName, value] = match;

        //Check is existing var name
        const existingItem = findExistingVar(variableName);

        if (!!existingItem) {
          if (parseInt(existingItem[1]) === parseInt(value)) {
            const text = `No change in value.`;
            if (window.confirm(text) == true) {
              return clearScreen();
            }
          }

          const text = `This action will replace your defined variable "${variableName}" value from ${existingItem[1]} to ${value}.`;
          if (window.confirm(text) == true) {
            return handleVarValueChange(variableName, value);
          } else {
            return;
          }
        }

        setCustomVariables((draft) => {
          return [
            ...draft,
            {
              label: variableName,
              value,
            },
          ];
        });
        clearScreen();
      } else {
        calculate();
      }
    }
  };

  const latexToMathjs = (latex) => {
    let mathjs = latex;

    // SPECIAL CHARACTERS
    const regex = /[a-zA-Z][\u2080-\u2089\u2090-\u209C]/g;
    const matches = mathjs.match(regex);

    if (matches?.length > 0) {
      matches.forEach((char) => {
        const character = definedVariables.find((ele) => ele?.label === char);
        mathjs = mathjs.replace(char, character?.value);
      });
    }
    // SPECIAL CHARACTERS END

    // Fractions
    mathjs = mathjs.replace(/\\frac{([^{}]+)}{([^{}]+)}/g, "($1)/($2)");

    // Roots
    mathjs = mathjs.replace(/\\sqrt{([^{}]+)}/g, "sqrt($1)");
    mathjs = mathjs.replace(/\\sqrt\[([^{}]+)\]{([^{}]+)}/g, "nthRoot($2, $1)");

    // Trigonometric functions
    mathjs = mathjs.replace(/\\sin\(([^)]+)\)/g, "sin($1)");
    mathjs = mathjs.replace(/\\cos\(([^)]+)\)/g, "cos($1)");
    mathjs = mathjs.replace(/\\tan\(([^)]+)\)/g, "tan($1)");

    // Logarithms
    mathjs = mathjs.replace(/\\log{([^{}]+)}/g, "log10($1)");
    mathjs = mathjs.replace(/\\ln{([^{}]+)}/g, "log($1)");

    // Constants
    mathjs = mathjs.replace(/\\pi/g, "PI");
    mathjs = mathjs.replace(/e/g, "e");

    // Operators
    mathjs = mathjs.replace(/\\cdot/g, "*");
    mathjs = mathjs.replace(/\\times/g, "*");
    mathjs = mathjs.replace(/\\div/g, "/");

    // Parentheses
    mathjs = mathjs.replace(/\\left\(/g, "(").replace(/\\right\)/g, ")");
    mathjs = mathjs.replace(/\\left\[/g, "[").replace(/\\right\]/g, "]");

    // Summation and Product
    mathjs = mathjs.replace(/\\sum_{([^{}]+)}\^([^{}]+) ([^ ]+)/g, "sum($3)");
    mathjs = mathjs.replace(/\\prod_{([^{}]+)}\^([^{}]+) ([^ ]+)/g, "prod($3)");

    // Absolute value
    mathjs = mathjs.replace(/\\left\|([^|]+)\\right\|/g, "abs($1)");

    // Statistical functions
    mathjs = mathjs.replace(/\\text{mean}\(([^)]+)\)/g, "mean($1)");
    mathjs = mathjs.replace(/\\text{median}\(([^)]+)\)/g, "median($1)");
    mathjs = mathjs.replace(/\\text{variance}\(([^)]+)\)/g, "var($1)");
    mathjs = mathjs.replace(/\\text{stdev}\(([^)]+)\)/g, "std($1)");
    mathjs = mathjs.replace(/\\text{cov}\(([^,]+), ([^)]+)\)/g, "cov($1, $2)");
    mathjs = mathjs.replace(/\\text{cor}\(([^,]+), ([^)]+)\)/g, "corr($1, $2)");

    // Percentage
    // mathjs = mathjs.replace(/\\%/g, "/100");

    // Replace standalone `\%` with `/100`
    mathjs = mathjs.replace(/([a-zA-Z0-9]+)\\%$/, "($1/100)");

    // Replace `\%` followed by a number or variable (e.g., "5\%100") with divide by that number
    mathjs = mathjs.replace(/([a-zA-Z0-9]+)\\%([a-zA-Z0-9]+)/g, "($1%$2)");

    // Modulo
    mathjs = mathjs.replace(
      /\\text{mod}\{([^{}]+)\}\{([^{}]+)\}/g,
      "mod($1, $2)"
    );

    return mathjs;
  };

  useEffect(() => {
    if (expression === "") {
      setResult("");
    }
  }, [expression]);

  const arrayToObject = (array) => {
    return array?.length > 0
      ? array?.reduce((acc, { label, value }) => {
          acc[label] = value;
          return acc;
        }, {})
      : {};
  };

  const handleClick = (input) => {
    setExpression((prevExpression) => prevExpression + ` ${input} `);
  };

  const handleChange = (e) => {
    const rawLatex = e?.latex();
    const formattedLatex = rawLatex?.replace(/\\cdot/g, "\\times");
    setExpression(formattedLatex);
    keepFocused(e);
  };

  const clearScreen = () => {
    setExpression("");
    setResult("");
  };

  const backspace = () => {
    const newExpression = expression.slice(0, -1);
    setExpression(newExpression);
  };

  const calculate = () => {
    try {
      const allVariables = {
        ...arrayToObject(customVariables),
        ...arrayToObject(definedVariables),
      };

      if (expression !== "") {
        const mathExpression = latexToMathjs(expression);
        const evaluateResult = math.evaluate(mathExpression, allVariables);

        // const code1 = math.compile(mathExpression);
        // const evaluateResult = code1.evaluate([allVariables]);

        if (typeof evaluateResult === "number" && !isNaN(evaluateResult)) {
          setResult(evaluateResult.toFixed(3).replace(/\.000$/, ""));
        } else {
          setResult("Error: Invalid expression");
        }
      }
    } catch (error) {
      setResult("Error: Invalid expression");
    }
  };

  console.log("expression :>> ", expression);

  return {
    definedVariables,
    digitKeys,
    operationsKeys,
    expression,
    result,
    handleClick,
    handleChange,
    clearScreen,
    backspace,
    calculate,
    handleKeyPress,
    mathQuillConfig,
    removeVariable,
    customVariables,
    setCustomVariables,
    keepFocused,
  };
};
