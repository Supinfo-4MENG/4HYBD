import {useState} from "react";
import './LanguageIcon.css'

interface LanguageIconProps {
    language: string;
    percentage: string;
}

const getLanguageColor = (language: string): string => {
    const colors: { [key: string]: string } = {
        JavaScript: '#f1e05a',
        TypeScript: '#3178c6',
        Python: '#3572A5',
        Java: '#b07219',
        HTML: '#e34c26',
        CSS: '#563d7c',
        PHP: '#4F5D95',
        Ruby: '#701516',
        Go: '#00ADD8',
        // Ajoutez d'autres langages selon vos besoins
    };
    return colors[language] || '#858585';
};

const getLanguageIcon = (language: string): string => {
    const formattedLang = language.toLowerCase();
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${formattedLang}/${formattedLang}-original.svg`;
};

const LanguageIcon: React.FC<LanguageIconProps> = ({ language, percentage }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const color = getLanguageColor(language);

    return (
        <div
            className="language-icon-container"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className="language-icon-wrapper">
                <img
                    src={getLanguageIcon(language)}
                    alt={language}
                    className="language-icon"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg';
                    }}
                />
                {showTooltip && (
                    <div className="tooltip">
                        {language}: {percentage}%
                    </div>
                )}
            </div>
            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color
                    }}
                />
            </div>
        </div>
    );
};

export default LanguageIcon;