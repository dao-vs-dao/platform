import React from "react";
import "./styles.css";

export enum TooltipSize {
    Small = 1,
    Medium = 2,
    Large = 3
}

interface ITooltipProps {
    children: any;
    size?: TooltipSize;
    iconComponent?: JSX.Element;
    extraTooltipStyles?: { [key: string]: string };
}

export const Tooltip = ({
    children,
    size,
    iconComponent,
    extraTooltipStyles
}: ITooltipProps): JSX.Element => (
    <div className="tooltip" style={extraTooltipStyles}>
        {iconComponent || <div className={"tooltip__icon "} />}
        <div className={"tooltip__content " + sizeToClass(size)}>{children}</div>
    </div>
);

const sizeToClass = (size?: TooltipSize) =>
    size === undefined || size === TooltipSize.Medium
        ? ""
        : size === TooltipSize.Small
        ? "tooltip__content--small "
        : "tooltip__content--large ";
