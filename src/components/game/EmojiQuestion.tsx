interface EmojiQuestionProps {
  emojis: string[];
}

const EmojiQuestion = ({ emojis }: EmojiQuestionProps) => {
  return (
    <div className="text-center">
      <p className="question-title">
        ¿QUÉ PERSONAJE DESCRIBEN ESTOS SÍMBOLOS?
      </p>

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

      <p className="mt-2">
        Adivina al personaje!!
      </p>
    </div>
  );
};

export default EmojiQuestion;