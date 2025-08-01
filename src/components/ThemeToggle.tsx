import React from "react";
import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export interface ThemeToggleProps {
    mode: "light" | "dark";
    onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ mode, onToggle }) => {
    return (
        <IconButton
            onClick={onToggle}
            color="inherit"
            className="transition-colors duration-300"
            aria-label="Toggle dark mode"
        >
            {mode === "dark" ? (
                <Brightness7Icon className="text-yellow-400" />
            ) : (
                <Brightness4Icon className="text-gray-800" />
            )}
        </IconButton>
    );
};

export default ThemeToggle;
