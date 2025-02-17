// import { evaluate, parse } from "mathjs";
import nerdamer from "nerdamer";
import { useEffect, useRef } from "react";
import { useImmer } from "use-immer";

// const initExpression = "\\frac{D+\\frac{r\\left(Z-D\\right)}{Kₖ}}{Kₖ}";
const initExpression = "";

export const useMathQuillKeyboard = () => {
  const mathFieldRef = useRef(null);

  // First, save the original E value from Nerdamer
  // const originalE = nerdamer("e").evaluate();

  const [expression, setExpression] = useImmer(initExpression);
  const [result, setResult] = useImmer(null);
  const [scope, setScope] = useImmer([]);

  console.log("expression :>> ", expression);

  const [definedVariables, setDefinedVariables] = useImmer([
    { label: "D", cmd: "18" },
    { label: "Kₖ", cmd: "0.15" },
    { label: "r", cmd: "0.25" },
    { label: "Z", cmd: "60" },
    { label: "E", cmd: "60" },
    { label: "D₁", cmd: "20" },
    { label: "Tₓ", cmd: "20" },
    { label: "x₇", cmd: "20" },
    { label: "H₈", cmd: "20" },
    { label: "L₉", cmd: "20" },
    { label: "P₁", cmd: "50" },
    { label: "P₀", cmd: "60" },
    { label: "i", cmd: "10" },
    { label: "V₁", cmd: "70" },
    { label: "n", cmd: "20" },
    { label: "An", cmd: "20" },
    { label: "b", cmd: "30" },
    { label: "br", cmd: "60" },
    {
      label: "DΔ",
      cmd: "100",
    },
    {
      label: "PΔ",
      cmd: "40",
    },
    {
      label: "ΔH",
      cmd: "80",
    },
  ]);

  const operationKeys = [
    { label: "0", cmd: "0", type: "digit" },
    { label: "1", cmd: "1", type: "digit" },
    { label: "2", cmd: "2", type: "digit" },
    { label: "3", cmd: "3", type: "digit" },
    { label: "4", cmd: "4", type: "digit" },
    { label: "5", cmd: "5", type: "digit" },
    { label: "6", cmd: "6", type: "digit" },
    { label: "7", cmd: "7", type: "digit" },
    { label: "8", cmd: "8", type: "digit" },
    { label: "9", cmd: "9", type: "digit" },
    { label: "%", cmd: "%", type: "operation" },
    { label: "(", cmd: "(", type: "operation" },
    { label: ")", cmd: ")", type: "operation" },
    { label: "[", cmd: "[", type: "operation" },
    { label: "]", cmd: "]", type: "operation" },
    { label: "+", cmd: "+", type: "operation" },
    { label: "-", cmd: "-", type: "operation" },
    { label: "*", cmd: "*", type: "operation" },
    { label: "÷", cmd: "÷", type: "operation" },
    // { label: "/", cmd: "/", type: "operation" },
    { label: "a/b", cmd: "\\frac", type: "operation" },
    { label: "√", cmd: "\\sqrt", type: "operation" },
    { label: "ⁿ√", cmd: "\\nthroot", type: "operation" },
    { label: "X\u207F", cmd: "^", type: "operation" },
    // { label: "π", cmd: "\\pi" },
    // { label: "θ", cmd: "\\theta" },
    // { label: "∑", cmd: "\\sum" },
    // { label: "∫", cmd: "\\int" },
    // { label: "∞", cmd: "\\infty" },
    // { label: "Δ", cmd: "\\Delta" },
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

  const insertToMathField = (latex) => {
    if (mathFieldRef.current) {
      mathFieldRef.current.cmd(latex);
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

    // // Fractions (handling nested fractions)
    // while (/\\frac{([^{}]+)}{([^{}]+)}/.test(mathjs)) {
    //   mathjs = mathjs.replace(/\\frac{([^{}]+)}{([^{}]+)}/g, "($1)/($2)");
    // }

    // // Roots
    // mathjs = mathjs.replace(/\\sqrt{([^{}]+)}/g, "sqrt($1)");
    // mathjs = mathjs.replace(/\\sqrt\[([^{}]+)\]{([^{}]+)}/g, "nthRoot($2, $1)");

    // // Constants
    // mathjs = mathjs.replace(/\\pi/g, "PI");
    // mathjs = mathjs.replace(/e/g, "e");

    // // Operators
    // mathjs = mathjs.replace(/\\cdot/g, "*");
    // mathjs = mathjs.replace(/\\times/g, "*");
    // mathjs = mathjs.replace(/\\div/g, "/");

    // // Parentheses
    // mathjs = mathjs.replace(/\\left\(/g, "(").replace(/\\right\)/g, ")");
    // mathjs = mathjs.replace(/\\left\[/g, "[").replace(/\\right\]/g, "]");

    // // Summation and Product
    // mathjs = mathjs.replace(/\\sum_{([^{}]+)}\^([^{}]+) ([^ ]+)/g, "sum($3)");
    // mathjs = mathjs.replace(/\\prod_{([^{}]+)}\^([^{}]+) ([^ ]+)/g, "prod($3)");

    // // Absolute value
    // mathjs = mathjs.replace(/\\left\|([^|]+)\\right\|/g, "abs($1)");

    // // Statistical functions
    // mathjs = mathjs.replace(/\\text{mean}\(([^)]+)\)/g, "mean($1)");
    // mathjs = mathjs.replace(/\\text{median}\(([^)]+)\)/g, "median($1)");
    // mathjs = mathjs.replace(/\\text{variance}\(([^)]+)\)/g, "var($1)");
    // mathjs = mathjs.replace(/\\text{stdev}\(([^)]+)\)/g, "std($1)");
    // mathjs = mathjs.replace(/\\text{cov}\(([^,]+), ([^)]+)\)/g, "cov($1, $2)");
    // mathjs = mathjs.replace(/\\text{cor}\(([^,]+), ([^)]+)\)/g, "corr($1, $2)");

    // // Percentage
    // mathjs = mathjs.replace(/([a-zA-Z0-9]+)\\%$/, "($1/100)");
    // mathjs = mathjs.replace(/([a-zA-Z0-9]+)\\%([a-zA-Z0-9]+)/g, "($1%$2)");

    // // Modulo
    // mathjs = mathjs.replace(
    //   /\\text{mod}\{([^{}]+)\}\{([^{}]+)\}/g,
    //   "mod($1, $2)"
    // );

    // **********************************************************
    // **********************************************************
    // **********************************************************

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

      console.log("parsedExpression :>> ", parsedExpression);

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
        // const evaluated = evaluate(parsedExpression, allScope);
        const evaluated = nerdamer(parsedExpression, allScope)
          .evaluate()
          .text();

        // const evaluated = parse(parsedExpression, {
        //   implicit: "hide",
        // })
        //   .compile()
        //   .evaluate(allScope);

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
  };
};
