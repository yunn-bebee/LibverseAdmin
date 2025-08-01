import React from "react";
import Button from "@mui/material/Button";
import { twMerge } from "tailwind-merge";

type CustomButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    variant?: "contained" | "outlined" | "text";
    type?: "button" | "submit" | "reset";
};

// Custom color: Indigo gradient with hover effect
const customStyles =
    "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:from-indigo-600 hover:to-pink-600 focus:ring-2 focus:ring-indigo-400 rounded-lg px-4 py-2 transition-all duration-200";

export const CustomButton: React.FC<CustomButtonProps> = ({
    children,
    onClick,
    disabled = false,
    className = "",
    variant = "contained",
    type = "button",
}) => {
    return (
        <Button
            type={type}
            onClick={onClick}
            disabled={disabled}
            variant={variant}
            className={twMerge(customStyles, className)}
            disableElevation
        >
            {children}
        </Button>
    );
};
