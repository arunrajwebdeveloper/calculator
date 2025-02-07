import React, { useRef } from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import { useCalculator } from "./useCalculator";

addStyles();

function Calculator() {
  const mathFieldRef = useRef(null);

  const insertToMathField = (latex) => {
    if (mathFieldRef.current) {
      mathFieldRef.current.cmd(latex);
      mathFieldRef.current.focus();
    }
  };

  const {
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
    keepFocused,
  } = useCalculator();

  return (
    <div className="App master-column">
      <div className="calc-body special-calculator">
        <h1>Calculator</h1>

        <label className="input-section">
          <EditableMathField
            config={mathQuillConfig}
            latex={expression}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            // mathquillDidMount={keepFocused}

            mathquillDidMount={(mathField) =>
              (mathFieldRef.current = mathField)
            }
          />
          <div className="output">{result ? `= ${result}` : 0}</div>
        </label>

        {/* <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { label: "0", cmd: "0" },
            { label: "1", cmd: "1" },
            { label: "2", cmd: "2" },
            { label: "3", cmd: "3" },
            { label: "4", cmd: "4" },
            { label: "5", cmd: "5" },
            { label: "6", cmd: "6" },
            { label: "7", cmd: "7" },
            { label: "8", cmd: "8" },
            { label: "9", cmd: "9" },
            { label: "%", cmd: "%" },
            { label: "(", cmd: "(" },
            { label: ")", cmd: ")" },
            { label: "[", cmd: "[" },
            { label: "]", cmd: "]" },
            { label: "+", cmd: "+" },
            { label: "-", cmd: "-" },
            { label: "*", cmd: "*" },
            { label: "/", cmd: "/" },
            { label: "√", cmd: "\\sqrt" },
            { label: "ⁿ√", cmd: "\\nthroot" },
            { label: "π", cmd: "\\pi" },
            { label: "θ", cmd: "\\theta" },
            { label: "∑", cmd: "\\sum" },
            { label: "∫", cmd: "\\int" },
            { label: "a/b", cmd: "\\frac" },
            { label: "∞", cmd: "\\infty" },
          ].map((button, index) => (
            <button
              key={index}
              onClick={() => insertToMathField(button.cmd)}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              {button.label}
            </button>
          ))}
        </div> */}

        <div
          style={{
            display: "flex",
            gap: "5px",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "0", cmd: "0" },
            { label: "1", cmd: "1" },
            { label: "2", cmd: "2" },
            { label: "3", cmd: "3" },
            { label: "4", cmd: "4" },
            { label: "5", cmd: "5" },
            { label: "6", cmd: "6" },
            { label: "7", cmd: "7" },
            { label: "8", cmd: "8" },
            { label: "9", cmd: "9" },
            { label: "%", cmd: "%" },
            { label: "(", cmd: "(" },
            { label: ")", cmd: ")" },
            { label: "[", cmd: "[" },
            { label: "]", cmd: "]" },
            { label: "+", cmd: "+" },
            { label: "-", cmd: "-" },
            { label: "*", cmd: "*" },
            { label: "/", cmd: "/" },
            { label: "√", cmd: "\\sqrt" },
            { label: "ⁿ√", cmd: "\\nthroot" },
            { label: "π", cmd: "\\pi" },
            { label: "θ", cmd: "\\theta" },
            { label: "∑", cmd: "\\sum" },
            { label: "∫", cmd: "\\int" },
            { label: "a/b", cmd: "\\frac" },
            { label: "∞", cmd: "\\infty" },
            { label: "Δ", cmd: "\\Delta" },
            { label: "x₁", cmd: "x_1" },
            { label: "y₂", cmd: "y_2" },
            { label: "H₈", cmd: "H_8" },
            { label: "DΔ", cmd: "D\\Delta" },
          ].map((button, index) => (
            <button
              key={index}
              onClick={() => insertToMathField(button.cmd)}
              className="btn"
            >
              {button.label}
            </button>
          ))}
        </div>

        {customVariables?.length > 0 && (
          <div className="variables">
            <h4>Custom Variables</h4>
            <ul>
              {customVariables?.map((ele) => (
                <li key={`custom-vars-${ele?.label}-${ele?.value}`}>
                  <div
                    className="variable-value"
                    onClick={() => handleClick(ele?.label)} // value
                  >
                    {ele?.label} = {ele?.value}
                  </div>
                  <div
                    className="variable-remove"
                    onClick={() => removeVariable(ele?.label)}
                  >
                    ✕
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="button-section">
          <div className="left-section">
            {/* NUMBERS */}
            <div className="digits">
              {digitKeys?.map(({ label, value }) => (
                <div
                  key={`number-keys-${label}-${value}`}
                  onClick={() => handleClick(label)}
                  className="btn"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="defined-variables">
              {definedVariables?.map(({ label, value }) => (
                <div
                  key={`defined-vars-${label}-${value}`}
                  onClick={() => handleClick(label)} // value
                  className="btn"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="right-section">
            <div className="operations special">
              <div className="btn" onClick={backspace}>
                <svg viewBox="0 0 24 24" height="18" width="18">
                  <path
                    fill="#000"
                    d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"
                  ></path>
                </svg>
              </div>
              <div className="btn red-button" onClick={clearScreen}>
                AC
              </div>
              <div className="btn" onClick={() => handleClick("%")}>
                %
              </div>
              <div className="btn" onClick={() => handleClick("sin(x)")}>
                sin
              </div>
              <div className="btn" onClick={() => handleClick("cos(x)")}>
                cos
              </div>
              <div className="btn" onClick={() => handleClick("tan(x)")}>
                tan
              </div>
              <div className="btn" onClick={() => handleClick("{x}^{2}")}>
                <math xmlns="http://www.w3.org/1998/Math/MathML">
                  <semantics>
                    <msup>
                      <mi>x</mi>
                      <mn>2</mn>
                    </msup>
                  </semantics>
                </math>
              </div>
              <div className="btn" onClick={() => handleClick("{x}^{n}")}>
                <math xmlns="http://www.w3.org/1998/Math/MathML">
                  <semantics>
                    <msup>
                      <mi>x</mi>
                      <mn>n</mn>
                    </msup>
                  </semantics>
                </math>
              </div>
              <div className="btn" onClick={() => handleClick("\\sqrt{n}")}>
                <math xmlns="http://www.w3.org/1998/Math/MathML">
                  <semantics>
                    <msqrt>
                      <mi>a</mi>
                    </msqrt>
                  </semantics>
                </math>
              </div>
              <div className="btn" onClick={() => handleClick("\\sqrt[x]{n}")}>
                <math xmlns="http://www.w3.org/1998/Math/MathML">
                  <semantics>
                    <mroot>
                      <mi>a</mi>
                      <mi>n</mi>
                    </mroot>
                  </semantics>
                </math>
              </div>
              <div className="btn" onClick={() => handleClick("\\frac{x}{y}")}>
                <math xmlns="http://www.w3.org/1998/Math/MathML">
                  <semantics>
                    <mfrac>
                      <msup style={{ fontSize: "18px" }}>
                        <mi>x</mi>
                      </msup>
                      <msup style={{ fontSize: "18px" }}>
                        <mi>y</mi>
                      </msup>
                    </mfrac>
                  </semantics>
                </math>
              </div>
              <div
                className="btn"
                onClick={() => handleClick("\\left(\\right)")}
              >
                {"("}
              </div>
              <div
                className="btn"
                onClick={() => handleClick("\\left(\\right)")}
              >
                {")"}
              </div>
            </div>
            <div className="operations">
              {operationsKeys?.map(({ label, value }) => (
                <div
                  key={`number-keys-${label}-${value}`}
                  onClick={() => handleClick(value)}
                  className="btn"
                >
                  {label}
                </div>
              ))}
              <div className="btn red-button" onClick={calculate}>
                =
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
