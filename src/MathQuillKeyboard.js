import React from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import "./MathQuillKeyboard.css";
import { useMathQuillKeyboard } from "./useMathQuillKeyboard";
import { Form } from "./Form";
import { equal, clear } from "./images";

addStyles();

const MathQuillKeyboard = () => {
  const {
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
  } = useMathQuillKeyboard();

  return (
    <>
      <div className="page-wrap">
        <div className="wrp">
          <div className="math-field-element">
            <EditableMathField
              config={mathQuillConfig}
              latex={expression}
              onChange={(mathField) => {
                let exp = mathField.latex();
                exp = exp?.replace(/\\cdot/g, "\\times");
                setExpression(exp);
              }}
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
            <span className={`${error ? "invalid" : ""}`}>{result ?? 0}</span>
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

            <div style={{ width: 160 }}>
              {definedVariables?.map((button, index) => (
                <button
                  key={`definedVariables-${index}`}
                  onClick={() => insertToMathField(button.label)}
                  className="key-btn"
                >
                  {button.label}
                </button>
              ))}
            </div>

            {/* Numbers */}

            <div style={{ width: 160 }}>
              {numbers?.map((button, index) => (
                <button
                  key={`numberKeys-${index}`}
                  onClick={() => insertToMathField(button.cmd)}
                  className="key-btn digit"
                >
                  {Object(button).hasOwnProperty("icon") ? (
                    <img src={button.icon} />
                  ) : (
                    button.label
                  )}
                </button>
              ))}
            </div>

            {/* OPERATORS KEYS */}
            <div style={{ width: 160 }}>
              {operationKeys?.map((button, index) => (
                <button
                  key={`operationKeys-${index}`}
                  onClick={() => insertToMathField(button.cmd)}
                  className="key-btn operation"
                >
                  {Object(button).hasOwnProperty("icon") ? (
                    <img src={button.icon} />
                  ) : (
                    button.label
                  )}
                </button>
              ))}
            </div>

            {/* BASIC OPERATORS KEYS */}
            <div style={{ width: 50 }}>
              {basicOperation?.map((button, index) => (
                <button
                  key={`basic-operationKeys-${index}`}
                  onClick={() => insertToMathField(button.cmd)}
                  className="key-btn basic-operation"
                >
                  {Object(button).hasOwnProperty("icon") ? (
                    <img src={button.icon} />
                  ) : (
                    button.label
                  )}
                </button>
              ))}
            </div>

            <div style={{ width: 50 }}>
              <button
                onClick={clearScreen}
                className="key-btn other-operation ac"
              >
                AC
              </button>
              <button
                onClick={backspace}
                className="key-btn other-operation clear"
              >
                <img style={{ width: 28, height: 28 }} src={clear} />
              </button>
              <button
                onClick={processInput}
                className="key-btn other-operation equal"
              >
                <img src={equal} />
              </button>
            </div>
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
