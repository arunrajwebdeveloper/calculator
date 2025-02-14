import React from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import "./MathQuillKeyboard.css";
import { useMathQuillKeyboard } from "./useMathQuillKeyboard";
import { Form } from "./Form";

addStyles();

const MathQuillKeyboard = () => {
  const {
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
  } = useMathQuillKeyboard();

  return (
    <>
      <div className="page-wrap">
        <div className="wrp">
          <div className="math-field-element">
            <EditableMathField
              config={mathQuillConfig}
              latex={expression}
              onChange={(mathField) => setExpression(mathField.latex())}
              mathquillDidMount={(mathField) => {
                mathFieldRef.current = mathField;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  processInput();
                }
              }}
            />
          </div>
          <div className="result-span">
            {/* <span>P=</span> */}
            <span>{result ?? 0}</span>
          </div>

          {/* VARIABLES */}
          {scope?.length > 0 && (
            <div className="variable-list">
              {scope?.map((v, index) => (
                <div className="variable-item">
                  <button
                    key={`custom-variable-${index}`}
                    onClick={() => insertToMathField(v.label)}
                    className="variable-item"
                  >
                    {`${v?.label}=${v?.cmd}`}
                  </button>
                  <button
                    className="var-clear"
                    onClick={() => removeVariable(v?.label)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="btn-keys">
            {/* DEFINED VARIABLES */}

            {definedVariables?.map((button, index) => (
              <button
                key={`definedVariables-${index}`}
                onClick={() => insertToMathField(button.label)}
                className="key-btn"
              >
                {button.label}
              </button>
            ))}

            {/* OPERATORS KEYS */}
            {operationKeys?.map((button, index) => (
              <button
                key={`operationKeys-${index}`}
                onClick={() => insertToMathField(button.cmd)}
                className={`key-btn ${
                  button?.type === "digit"
                    ? "digit"
                    : button?.type === "operation"
                    ? "operation"
                    : ""
                }`}
              >
                {button.label}
              </button>
            ))}

            <button onClick={clearScreen} className="key-btn other-operation">
              AC
            </button>
            <button onClick={backspace} className="key-btn other-operation">
              <svg viewBox="0 0 24 24" height="18" width="18">
                <path
                  fill="#000"
                  d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"
                ></path>
              </svg>
            </button>
            <button onClick={processInput} className="key-btn other-operation">
              =
            </button>
          </div>
        </div>

        {/* ------------------ */}
        <Form
          definedVariables={arrayToObject(definedVariables)}
          handleChange={handleDefinedVariableValueChange}
        />
      </div>

      {/* NOTE: */}

      <div className="footer-note">
        <p>
          NOTE: if you have a physical keyboard attached, you can use that too.
          For example, try <kbd>^</kbd>, <kbd>*</kbd>, <kbd>(</kbd> and
          <kbd>/</kbd>. Use Shift + Left for selection mode.
        </p>
      </div>
    </>
  );
};

export default MathQuillKeyboard;
