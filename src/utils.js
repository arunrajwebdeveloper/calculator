export const manageResultLength = (value, limit = 12) => {
  let result = value;
  let numericResult = parseFloat(result);
  if (result.length > limit) {
    if (Math.abs(numericResult) >= 1e12 || Math.abs(numericResult) < 1e-6) {
      result = numericResult.toExponential(6); // Use scientific notation
    } else {
      result = numericResult.toPrecision(limit); // Limit significant digits
    }
  }
  return result.toString();
};

export const limitResultLength = (value, limit = 12) => {
  let result = value;

  if (result.length > limit) {
    result = result.slice(0, limit);
  }

  return result;
};
