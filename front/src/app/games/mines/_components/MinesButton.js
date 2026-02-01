import React from "react";

const MinesButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={`
        w-full h-full
        rounded-xl relative overflow-hidden
        transition-all duration-200 transform
        ${disabled 
          ? "bg-slate-800/60 cursor-default border border-white/5 opacity-50" 
          : "bg-slate-700 hover:bg-slate-600 hover:-translate-y-1 hover:shadow-indigo-500/20 border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 cursor-pointer"
        }
      `}
    >
       {!disabled && (
           <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
       )}
    </button>
  );
};

export default MinesButton;
