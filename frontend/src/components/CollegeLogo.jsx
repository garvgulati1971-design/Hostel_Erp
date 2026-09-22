import React from "react";
import collegeLogoSvg from "../assets/college-logo.svg";

export default function CollegeLogo({ size = "md", showText = true, layout = "horizontal", subText = "Directorate of Student Affairs & Hostels" }) {
    const sizeMap = {
        xs: 28,
        sm: 40,
        md: 52,
        lg: 72,
        xl: 96
    };

    const px = sizeMap[size] || 52;

    return (
        <div className={`college-branding-lockup ${layout}`}>
            <img 
                src={collegeLogoSvg} 
                alt="SRM Institute of Science and Technology Crest" 
                width={px} 
                height={px} 
                className="college-crest-img"
            />
            {showText && (
                <div className="branding-text-block">
                    <div className="university-name">SRM INSTITUTE OF SCIENCE &amp; TECHNOLOGY</div>
                    <div className="portal-sub-title">CENTRAL HOSTEL ERP PORTAL</div>
                    {subText && <div className="campus-badge">{subText}</div>}
                </div>
            )}
        </div>
    );
}
