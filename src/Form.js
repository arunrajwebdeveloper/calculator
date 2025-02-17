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
              marginBottom: "10px",
              fontFamily: "arial",
              fontSize: "16px",
              fontWeight: 500,
              position: "relative",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                width: "35px",
                borderRight: "1px solid #000",
                userSelect: "none",
              }}
            >
              {key}
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              style={{
                padding: "6px 12px 6px 40px",
                fontFamily: "arial",
                fontSize: "16px",
                fontWeight: 500,
                width: "100%",
                bordert: "1px solid #000",
                outline: 0,
                textAlign: "right",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
