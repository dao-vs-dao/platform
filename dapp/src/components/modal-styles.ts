const content = {
    width: "min(350px, 75vw)",
    left: "calc(50% - min(350px, 75vw) / 2 - 30px)",
    top: "20%",
    height: "fit-content",
    maxHeight: "80vh",
    padding: "30px",
    overflow: "unset",
    color: "var(--white)",
    background: "#110025",
    border: "1px solid rgba(217, 203, 255, 0.3)",
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.08)",
    borderRadius: "8px",
};

const overlay = {
    backgroundColor: "#000A"
};

export const modalStyles = { content, overlay };
