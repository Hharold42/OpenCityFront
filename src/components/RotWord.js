import React from "react";

const RotWord = ({ word }) => {
  return (
    <div>
      {word.split("").map((char, index) => (
        <div key={index} className="">
          {char}
        </div>
      ))}
    </div>
  );
};

export default RotWord;
