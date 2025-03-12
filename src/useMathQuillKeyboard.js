// import { evaluate, parse } from "mathjs";
import nerdamer from "nerdamer";
import { useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import { limitResultLength, manageResultLength } from "./utils";
import {
  plus,
  minus,
  multiply,
  divide,
  dot,
  percent,
  squareLeft,
  squareRight,
  bracketRoundLeft,
  bracketRoundRight,
  slash,
  squareRoot,
  nthRoot,
  power,
} from "./images";

const MAX_DIGITS = 16;

export const useMathQuillKeyboard = () => {
  const mathFieldRef = useRef(null);

  // First, save the original E value from Nerdamer
  // const originalE = nerdamer("e").evaluate();

  const [expression, setExpression] = useImmer("");
  const [result, setResult] = useImmer(null);
  const [scope, setScope] = useImmer([]);
  const [error, setError] = useImmer(false);

  console.log("expression :>> ", expression);

  const [definedVariables, setDefinedVariables] = useImmer([
    { label: "D", cmd: "240000" },
    { label: "Kₑ", cmd: "15%" },
    { label: "g", cmd: "7%" },
    { label: "D₁", cmd: "4.50" },
    { label: "n", cmd: "5" },
    { label: "I", cmd: "20000" },
    { label: "NP", cmd: "1600" },
    { label: "t", cmd: "0.50" },
    { label: "RV", cmd: "550000" },
    { label: "MP", cmd: "95" },
    { label: "EPS", cmd: "20" },
    { label: "b", cmd: "0.60" },
    // { label: "r", cmd: "0.25" },
    // { label: "E", cmd: "60" },
    // { label: "D₀", cmd: "2" },
    // { label: "P₀", cmd: "120" },
    // {
    //   label: "Δn",
    //   cmd: "5882",
    // },
    // { label: "P₁", cmd: "102" },

    // { label: "L₉", cmd: "20" },
    // { label: "P₀", cmd: "60" },
    // { label: "i", cmd: "10" },
    // { label: "V₁", cmd: "70" },
    // { label: "An", cmd: "20" },
    // { label: "b", cmd: "30" },
    // { label: "br", cmd: "60" },
    // {
    //   label: "DΔ",
    //   cmd: "100",
    // },
    // {
    //   label: "PΔ",
    //   cmd: "40",
    // },
  ]);

  const numbers = [
    { label: "1", cmd: "1", type: "digit" },
    { label: "2", cmd: "2", type: "digit" },
    { label: "3", cmd: "3", type: "digit" },
    { label: "4", cmd: "4", type: "digit" },
    { label: "5", cmd: "5", type: "digit" },
    { label: "6", cmd: "6", type: "digit" },
    { label: "7", cmd: "7", type: "digit" },
    { label: "8", cmd: "8", type: "digit" },
    { label: "9", cmd: "9", type: "digit" },
    { label: "0", cmd: "0", type: "digit" },
    { label: ".", cmd: ".", type: "digit", icon: dot },
  ];

  const operationKeys = [
    { label: "%", cmd: "%", type: "operation", icon: percent },
    { label: "(", cmd: "(", type: "operation", icon: bracketRoundLeft },
    { label: ")", cmd: ")", type: "operation", icon: bracketRoundRight },
    { label: "[", cmd: "[", type: "operation", icon: squareLeft },
    { label: "]", cmd: "]", type: "operation", icon: squareRight },
    { label: "/", cmd: "/", type: "operation", icon: slash },
    // { label: "a/b", cmd: "\\frac", type: "operation" },
    { label: "√", cmd: "\\sqrt", type: "operation", icon: squareRoot },
    { label: "ⁿ√", cmd: "\\nthroot", type: "operation", icon: nthRoot },
    { label: "X\u207F", cmd: "^", type: "operation", icon: power },
    // { label: "π", cmd: "\\pi" },
    // { label: "θ", cmd: "\\theta" },
    // { label: "∑", cmd: "\\sum" },
    // { label: "∫", cmd: "\\int" },
    // { label: "∞", cmd: "\\infty" },
    // { label: "Δ", cmd: "\\Delta" },
  ];

  const basicOperation = [
    { label: "÷", cmd: "÷", type: "operation", icon: divide },
    { label: "*", cmd: "\\cdot", type: "operation", icon: multiply },
    { label: "-", cmd: "-", type: "operation", icon: minus },
    { label: "+", cmd: "+", type: "operation", icon: plus },
  ];

  // Temporarily modify Nerdamer's core constants
  const assignVariables = (array = [], key = "") => {
    const existingKey = array?.find((item) => item?.label === key);
    if (existingKey) {
      return existingKey?.cmd;
    }
    return 0;
  };

  nerdamer.setConstant("E", assignVariables(definedVariables, "E"));
  nerdamer.setConstant("e", assignVariables(definedVariables, "e"));

  const mathQuillConfig = {
    restrictMismatchedBrackets: true, // Ensures brackets are always matched
    autoSubscriptNumerals: true, // Auto subscript for numerals (V1 → V₁)
    charsThatBreakOutOfSupSub: "+-=<>", // Allow breaking out of sub/superscript
    spaceBehavesLikeTab: true, // Makes space key navigate fields (for fractions, roots, etc.)
    leftRightIntoCmdGoes: "up", // Moves cursor out of fractions/superscripts properly
    supSubsRequireOperand: true, // Prevents accidental subscripts/superscripts without a base
  };

  const findExistingVar = (keyname) => {
    return definedVariables?.find((key) => key?.label === keyname);
  };

  const removeVariable = (label) => {
    setScope((draft) => {
      const filtered = draft?.filter((ele) => ele?.label !== label);
      return filtered;
    });
  };

  // const insertToMathField = (latex) => {
  //   if (mathFieldRef.current) {
  //     latex = latex?.replace(/\\cdot/g, "\\times");
  //     mathFieldRef.current.cmd(latex);
  //     mathFieldRef.current.focus();
  //   }
  // };

  const insertToMathField = (latex) => {
    if (mathFieldRef.current) {
      latex = latex?.replace(/\\cdot/g, "\\times");
      if (latex === "+" || latex === "-") {
        mathFieldRef.current.write(latex);
      } else {
        mathFieldRef.current.cmd(latex);
      }
      mathFieldRef.current.focus();
    }
  };

  const arrayToObject = (array) => {
    return array?.length > 0
      ? array?.reduce((acc, { label, cmd }) => {
          acc[label] = cmd;
          return acc;
        }, {})
      : {};
  };

  const latexToMathjs = (latex) => {
    let mathjs = latex;

    // SPECIAL CHARACTERS
    // const regex = /[a-zA-Z][\u2080-\u2089\u2090-\u209C]/g;
    const regex = /[a-zA-Z][₀-₉ₐ-ₜ]/g;

    const matches = mathjs.match(regex);

    if (matches?.length > 0) {
      matches?.forEach((char) => {
        const character = definedVariables?.find((ele) => ele?.label === char);
        if (character) {
          mathjs = mathjs.replace(char, character?.cmd);
        }
      });
    }

    // Fractions (handling nested fractions)

    // For Nerdamer

    // Fractions (handling nested fractions)
    while (/\\frac{([^{}]+)}{([^{}]+)}/.test(mathjs)) {
      mathjs = mathjs.replace(/\\frac{([^{}]+)}{([^{}]+)}/g, "($1)/($2)");
    }

    // Roots
    mathjs = mathjs.replace(/\\sqrt{([^{}]+)}/g, "sqrt($1)");
    mathjs = mathjs.replace(/\\sqrt\[([^{}]+)\]{([^{}]+)}/g, "($2)^(1/($1))"); // nthRoot as exponentiation

    // Constants
    mathjs = mathjs.replace(/\\pi/g, "pi");

    // Operators
    mathjs = mathjs.replace(/\\cdot/g, "*");
    mathjs = mathjs.replace(/\\times/g, "*");
    mathjs = mathjs.replace(/\\div/g, "/");

    // Ensure exponents `{}` are pre-evaluated before passing to Nerdamer
    mathjs = mathjs.replace(
      /(\d+|\w+)\^\{([^{}]+)\}/g,
      (match, base, exponent) => {
        try {
          let evaluatedExponent = nerdamer(exponent).evaluate().text(); // Evaluate the exponent first
          return `(${base}^(${evaluatedExponent}))`; // Nerdamer understands this format
        } catch (error) {
          return match; // If error, return the original match
        }
      }
    );

    // Parentheses
    mathjs = mathjs.replace(/\\left\(/g, "(").replace(/\\right\)/g, ")");
    mathjs = mathjs.replace(/\\left\[/g, "[").replace(/\\right\]/g, "]");

    // Summation and Product
    mathjs = mathjs.replace(/\\sum_{([^{}]+)}\^([^{}]+) ([^ ]+)/g, "sum($3)");
    mathjs = mathjs.replace(
      /\\prod_{([^{}]+)}\^([^{}]+) ([^ ]+)/g,
      "product($3)"
    );

    // Absolute value
    mathjs = mathjs.replace(/\\left\|([^|]+)\\right\|/g, "abs($1)");

    // Statistical functions
    mathjs = mathjs.replace(/\\text{mean}\(([^)]+)\)/g, "mean($1)");
    mathjs = mathjs.replace(/\\text{median}\(([^)]+)\)/g, "median($1)");
    mathjs = mathjs.replace(/\\text{variance}\(([^)]+)\)/g, "variance($1)");
    mathjs = mathjs.replace(/\\text{stdev}\(([^)]+)\)/g, "std($1)");
    mathjs = mathjs.replace(/\\text{cov}\(([^,]+), ([^)]+)\)/g, "cov($1, $2)");
    mathjs = mathjs.replace(/\\text{cor}\(([^,]+), ([^)]+)\)/g, "corr($1, $2)");

    // Percentage
    mathjs = mathjs.replace(/([a-zA-Z0-9]+)\\%/g, "($1/100)");

    // Modulo
    mathjs = mathjs.replace(
      /\\text{mod}\{([^{}]+)\}\{([^{}]+)\}/g,
      "mod($1, $2)"
    );

    return mathjs;
  };

  useEffect(() => {
    if (expression === "") {
      if (mathFieldRef.current) {
        mathFieldRef.current.latex(""); // Clears MathQuill input
      }

      setResult(null);
    }
  }, [expression]);

  useEffect(() => {
    setError(result === "Error: Invalid expression");
  }, [result]);

  const clearScreen = () => {
    if (mathFieldRef.current) {
      mathFieldRef.current.latex(""); // Clears MathQuill input
    }
    setExpression("");
    setResult(null);
  };

  const backspace = () => {
    if (mathFieldRef.current) {
      const mathField = mathFieldRef.current;
      mathField.keystroke("Backspace"); // Deletes based on cursor position
      setExpression(mathField.latex());
    }
  };

  const processInput = () => {
    try {
      const allScope = {
        ...arrayToObject(scope),
        ...arrayToObject(definedVariables),
      };

      const parsedExpression = latexToMathjs(expression);

      if (parsedExpression.includes("=")) {
        const [varName, cmd] = parsedExpression.split("=");
        if (varName && cmd) {
          //Check is existing definedVariables
          const existingItem = findExistingVar(varName);
          // const newCmd = evaluate(cmd.trim(), allScope);
          const newCmd = nerdamer(cmd.trim(), allScope).evaluate().text();

          // const newCmd = parse(cmd.trim(), { implicit: "hide" })
          //   .compile()
          //   .evaluate(allScope);

          if (!!existingItem) {
            if (parseInt(existingItem?.cmd) === parseInt(newCmd)) {
              const text = `No change in value.`;
              if (window.confirm(text) == true) {
                return clearScreen();
              }
            }

            const text = `This action will replace your defined variable "${varName}" value from ${existingItem?.cmd} to ${newCmd}.`;
            if (window.confirm(text) == true) {
              setDefinedVariables((draft) => {
                const existingValue = draft?.find(
                  (ele) => ele?.label === varName
                );

                if (existingValue) {
                  existingValue.cmd = newCmd;
                }
              });
            } else {
              return;
            }
          } else {
            setScope((draft) => {
              return [
                ...draft,
                {
                  label: varName,
                  cmd: newCmd,
                },
              ];
            });
          }

          setExpression("");
        }
      } else {
        let evaluated = nerdamer(parsedExpression, allScope).evaluate().text();

        // Uses scientific notation for large/small values.
        evaluated = manageResultLength(evaluated, MAX_DIGITS);

        // Slice result length
        // evaluated = limitResultLength(evaluated, MAX_DIGITS);
        setResult(evaluated);
      }
    } catch (error) {
      setResult("Error: Invalid expression");
    }
  };

  const handleDefinedVariableValueChange = (key, value) => {
    setDefinedVariables((draft) => {
      const existingValue = draft?.find((ele) => ele?.label === key);

      if (existingValue) {
        existingValue.cmd = value ?? 0;
      }
    });
  };

  // Restore original E value
  // nerdamer.setConstant("E", originalE);

  return {
    definedVariables,
    operationKeys,
    basicOperation,
    numbers,
    expression,
    result,
    mathFieldRef,
    scope,
    insertToMathField,
    setExpression,
    clearScreen,
    backspace,
    processInput,
    mathQuillConfig,
    removeVariable,
    handleDefinedVariableValueChange,
    arrayToObject,
    error,
  };
};
