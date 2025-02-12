export const Form = ({ definedVariables, handleChange }) => {
  return (
    <div className="values-lising">
      {Object.entries(definedVariables).map(([key, value]) => {
        return (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              fontFamily: "arial",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            <span style={{ fontWeight: 600 }}>{key}</span>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              style={{
                padding: "6px",
                fontFamily: "arial",
                fontSize: "16px",
                fontWeight: 500,
                width: "80px",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
