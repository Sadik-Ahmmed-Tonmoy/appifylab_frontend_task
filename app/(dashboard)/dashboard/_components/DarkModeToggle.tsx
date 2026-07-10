"use client";

interface DarkModeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export default function DarkModeToggle({ darkMode, onToggle }: DarkModeToggleProps) {
  return (
    <div className="_layout_mode_swithing_btn">
      <button
        type="button"
        onClick={onToggle}
        className="_layout_swithing_btn_link"
        aria-label="Toggle dark mode"
      >
        <div className="_layout_swithing_btn">
          <div className="_layout_swithing_btn_round"></div>
        </div>
        <div className="_layout_change_btn_ic1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" fill="none" viewBox="0 0 14 15">
            <path fill="#000" d="M12.91 9.38a6.562 6.562 0 01-6.79-6.559c0-.492.058-.971.168-1.434C3.069 1.83 1 4.707 1 8.083c0 3.738 3.134 6.767 7 6.767 3.493 0 6.425-2.022 7.747-4.912a6.93 6.93 0 01-2.837.442z" />
          </svg>
        </div>
        <div className="_layout_change_btn_ic2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" fill="none" viewBox="0 0 16 17">
            <path fill="#fff" fillRule="evenodd" d="M8 3.35a.65.65 0 01.65.65V5.3a.65.65 0 01-1.3 0V4a.65.65 0 01.65-.65zm-2.934.829a.65.65 0 01.92 0l.919.919a.65.65 0 11-.92.92l-.919-.92a.65.65 0 010-.919zm5.868 0a.65.65 0 010 .919l-.919.92a.65.65 0 11-.92-.92l.92-.919a.65.65 0 01.919 0zM8 6.6a1.9 1.9 0 100 3.8 1.9 1.9 0 000-3.8zM4.8 8.5a3.2 3.2 0 116.4 0 3.2 3.2 0 01-6.4 0zM3.35 8.5c0-.36.29-.65.65-.65h1.3a.65.65 0 110 1.3H4a.65.65 0 01-.65-.65zm8.7 0c0-.36.29-.65.65-.65h1.3a.65.65 0 110 1.3h-1.3a.65.65 0 01-.65-.65zm-7.984 2.016a.65.65 0 01.92 0l.919.919a.65.65 0 11-.92.92l-.919-.92a.65.65 0 010-.919zm5.868 0a.65.65 0 010 .919l-.919.92a.65.65 0 11-.92-.92l.92-.919a.65.65 0 01.919 0zM8 11.7a.65.65 0 01.65.65V13.7a.65.65 0 01-1.3 0V12.35a.65.65 0 01.65-.65z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
    </div>
  );
}
