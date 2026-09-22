import React, { useState, useEffect } from "react";
import "./ThemeSelector.css";

export const THEME_OPTIONS = [
    {
        id: "srm",
        name: "SRM Royal Crimson & Gold",
        subtitle: "Official SRM University Identity",
        primary: "#8b1528",
        gold: "#d4af37",
        background: "#0e080b",
        card: "#23141d",
        tag: "Official"
    },
    {
        id: "navy",
        name: "Oxford Academic Navy",
        subtitle: "Collegiate Sapphire & Brass",
        primary: "#1d4ed8",
        gold: "#d4af37",
        background: "#0a0f1d",
        card: "#141f36",
        tag: "Standard"
    },
    {
        id: "slate",
        name: "Engineering Tech Slate",
        subtitle: "Modern Campus Cyan & Slate",
        primary: "#0284c7",
        gold: "#38bdf8",
        background: "#0b111e",
        card: "#17233d",
        tag: "Modern"
    },
    {
        id: "light",
        name: "Executive Light Portal",
        subtitle: "Daytime Institutional Alabaster",
        primary: "#1e3a8a",
        gold: "#b45309",
        background: "#f3f5f9",
        card: "#ffffff",
        tag: "Light ERP"
    }
];

export default function ThemeSelector({ currentTheme, onSelectTheme }) {
    const [isOpen, setIsOpen] = useState(false);

    const activeThemeObj = THEME_OPTIONS.find(t => t.id === currentTheme) || THEME_OPTIONS[0];

    return (
        <div className="theme-selector-wrapper">
            <button 
                type="button" 
                className="theme-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                title="Change Campus Portal Color Theme"
            >
                <span className="theme-swatch-mini" style={{ background: activeThemeObj.primary, borderColor: activeThemeObj.gold }}></span>
                <span className="theme-btn-label">🎨 Palette: <strong>{activeThemeObj.name.split(" ")[0]}</strong></span>
                <span className="theme-arrow">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
                <>
                    <div className="theme-backdrop" onClick={() => setIsOpen(false)} />
                    <div className="theme-dropdown-panel fade-in">
                        <div className="theme-panel-header">
                            <div>
                                <h4>🏛️ University Portal Color Palettes</h4>
                                <p>Select your preferred realistic institutional theme</p>
                            </div>
                            <span className="badge badge-gold">4 STYLES</span>
                        </div>

                        <div className="theme-options-list">
                            {THEME_OPTIONS.map(theme => {
                                const isSelected = theme.id === currentTheme;
                                return (
                                    <div 
                                        key={theme.id}
                                        className={`theme-option-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            onSelectTheme(theme.id);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div className="theme-swatches-row">
                                            <span className="swatch" style={{ background: theme.primary }} title="Primary Action Color"></span>
                                            <span className="swatch" style={{ background: theme.gold }} title="Laurel Gold Accent"></span>
                                            <span className="swatch" style={{ background: theme.card }} title="Portal Card Surface"></span>
                                            <span className="swatch" style={{ background: theme.background }} title="App Canvas"></span>
                                        </div>

                                        <div className="theme-info">
                                            <div className="theme-title-row">
                                                <strong>{theme.name}</strong>
                                                <span className={`theme-tag ${theme.id === 'srm' ? 'tag-srm' : ''}`}>{theme.tag}</span>
                                            </div>
                                            <small>{theme.subtitle}</small>
                                        </div>

                                        {isSelected && (
                                            <span className="theme-check-icon">✓</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="theme-panel-footer">
                            <small>💡 Applied instantly across all modules & cached in local session.</small>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
