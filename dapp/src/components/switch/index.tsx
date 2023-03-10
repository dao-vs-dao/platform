import React from "react";
import "./styles.css";

interface ISwitchProps {
    value: boolean;
    setValue: (value: boolean) => void;
    disabled?: boolean;
}

export const Switch = ({ value, setValue, disabled }: ISwitchProps) => (
    <label className={`switch ${disabled ? "switch--disabled" : ""}`}>
        <input type="checkbox" checked={value} onChange={() => !disabled && setValue(!value)} />
        <span className="slider round"></span>
    </label>
);
