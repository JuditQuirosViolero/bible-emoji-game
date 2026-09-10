interface EmojiDisplayProps {
    emojis: string[];
}

const EmojiDisplay = ({ emojis }: EmojiDisplayProps) => {
    return (
        <div className="emoji-display">
            {emojis.map((emoji, index) => {
                const esImagen = emoji.startsWith("/");

                return esImagen ? (
                    <img
                        key={index}
                        src={emoji}
                        alt=""
                        className="custom-emoji"
                    />
                ) : (
                    <span key={index}>{emoji}</span>
                );
            })}
        </div>
    );
};

export default EmojiDisplay;