"use client";

interface RightSidebarProps {
  darkMode: boolean;
}

const friendsList = [
  { name: "Steve Jobs", role: "CEO of Apple", img: "/assets/images/people1.png", online: false, time: "5 minute ago" },
  { name: "Ryan Roslansky", role: "CEO of Linkedin", img: "/assets/images/people2.png", online: true },
  { name: "Dylan Field", role: "CEO of Figma", img: "/assets/images/people3.png", online: true },
  { name: "Steve Jobs", role: "CEO of Apple", img: "/assets/images/people1.png", online: false, time: "5 minute ago" },
  { name: "Ryan Roslansky", role: "CEO of Linkedin", img: "/assets/images/people2.png", online: true },
  { name: "Dylan Field", role: "CEO of Figma", img: "/assets/images/people3.png", online: true },
  { name: "Dylan Field", role: "CEO of Figma", img: "/assets/images/people3.png", online: true },
  { name: "Steve Jobs", role: "CEO of Apple", img: "/assets/images/people1.png", online: false, time: "5 minute ago" },
];

export default function RightSidebar({ darkMode }: RightSidebarProps) {
  const cardBg = darkMode ? "bg-[#1a1a2e]" : "bg-white";

  return (
    <div className="flex flex-col gap-4">
      {/* Block 1: You Might Like */}
      <div className={`${cardBg} p-6 rounded-[6px] transition-all duration-200`}>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-medium text-[#212121] leading-[1.4] m-0">You Might Like</h4>
          <a href="#0" className="text-[#1890FF] font-medium text-xs">See All</a>
        </div>
        <hr className="bg-[#DFDFDF] border-0 h-[1px] my-1 mx-0 mb-6" />

        <div className="flex flex-col">
          <div className="flex items-center mb-6">
            <div className="mr-5 flex-shrink-0">
              <a href="#">
                <img
                  src="/assets/images/Avatar.png"
                  alt="Avatar"
                  className="rounded-full object-cover"
                  style={{ width: "50px", height: "50px" }}
                />
              </a>
            </div>
            <div>
              <a href="#">
                <h4 className="font-medium text-base text-[#212121] leading-6 m-0">Radovan SkillArena</h4>
              </a>
              <p className="font-normal text-xs text-[#767676] leading-[18px] m-0">Founder &amp; CEO at Trophy</p>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              className="rounded-[6px] border border-[#f1f1f1] bg-transparent font-medium text-sm text-[#959eae] leading-[22px] py-[9px] px-10 transition-all duration-200 hover:bg-[#377DFF] hover:text-white"
            >
              Ignore
            </button>
            <button
              type="button"
              className="rounded-[6px] bg-[#377DFF] text-white border border-transparent font-medium text-sm leading-[22px] py-[9px] px-10 transition-all duration-200 hover:bg-[#1890FF]"
            >
              Follow
            </button>
          </div>
        </div>
      </div>

      {/* Block 2: Your Friends */}
      <div className={`${cardBg} p-6 pb-1.5 rounded-[6px] transition-all duration-200`}>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-medium text-[#212121] leading-[1.4] m-0">Your Friends</h4>
          <a href="#" className="text-[#1890FF] font-medium text-xs">See All</a>
        </div>

        {/* Search */}
        <form className="relative mb-6">
          <svg
            className="absolute"
            style={{ top: "12px", left: "18px" }}
            xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17"
          >
            <circle cx="7" cy="7" r="6" stroke="#666" />
            <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
          </svg>
          <input
            type="search"
            placeholder="input search text"
            className="bg-[#F5F5F5] border border-[#F5F5F5] focus:border-[#1890FF] focus:outline-none transition-all duration-200 rounded-[32px] w-full text-xs"
            style={{
              height: "40px",
              padding: "7px 47px",
              fontFamily: "Poppins",
              color: "rgba(0,0,0,0.25)",
            }}
          />
        </form>

        {/* Friends */}
        <div className="flex flex-col gap-0 max-h-[420px] overflow-y-auto">
          {friendsList.map((friend, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-1.5 rounded-[8px] transition-all duration-200 hover:bg-[#e4e6e9] mb-6"
            >
              <div className="flex items-center">
                <div className="mr-4 flex-shrink-0">
                  <a href="#">
                    <img
                      src={friend.img}
                      alt={friend.name}
                      className="rounded-full object-cover"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </a>
                </div>
                <div>
                  <a href="#">
                    <h4 className="font-medium text-sm text-[#212121] leading-[1.4] m-0">{friend.name}</h4>
                  </a>
                  <p className="font-light text-[11px] text-[#212121] leading-[1.4] m-0">{friend.role}</p>
                </div>
              </div>

              <div className="flex-shrink-0">
                {friend.online ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
                    <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
                  </svg>
                ) : (
                  <span className="font-normal text-[11px] text-black/50 leading-[21px]">{friend.time}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
