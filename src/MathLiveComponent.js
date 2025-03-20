import React, { useEffect, useRef, useState } from "react";
import "mathlive";
import { ComputeEngine } from "@cortex-js/compute-engine";

const MathLiveComponent = () => {
  const mathFieldRef = useRef(null);
  const [latex, setLatex] = useState("");
  const [result, setResult] = useState("");
  const ce = new ComputeEngine(); // Initialize Compute Engine

  useEffect(() => {
    if (mathFieldRef.current) {
      mathFieldRef.current.value = "\\frac{4}{2} + 3";
      mathFieldRef.current.addEventListener("input", (e) => {
        setLatex(e.target.value);
      });
    }
  }, []);

  const calculateResult = () => {
    if (mathFieldRef.current) {
      const latexInput = mathFieldRef.current.getValue("latex"); // Get LaTeX input
      try {
        const expr = ce.parse(latexInput); // Parse LaTeX with Compute Engine
        setResult(expr.evaluate().toString()); // Compute result
      } catch (error) {
        setResult("Invalid Expression");
      }
    }
  };

  return (
    <div>
      <math-field
        ref={mathFieldRef}
        style={{ fontSize: "20px", width: "100%" }}
      ></math-field>
      <button onClick={calculateResult}>Calculate</button>
      <p>LaTeX Output: {latex}</p>
      <p>Result: {result}</p>
    </div>
  );
};

export default MathLiveComponent;
