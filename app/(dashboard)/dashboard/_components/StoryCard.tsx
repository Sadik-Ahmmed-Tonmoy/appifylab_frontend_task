"use client";

interface StoryCardProps {
  darkMode: boolean;
}

export default function StoryCard({ darkMode }: StoryCardProps) {
  return (
    <div className="mb-4">
      {/* For Desktop view */}
      <div className="hidden md:block relative mb-4">
        {/* Story Arrow */}
        <div className="absolute top-1/2 right-[-5px] z-[18] -translate-y-1/2">
          <button
            type="button"
            className="bg-[#1890FF] border border-[#F0F2F5] rounded-full w-6 h-6 flex items-center justify-center p-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
              <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* Your Story */}
          <div className="rounded-[6px] overflow-hidden relative cursor-pointer group transition-all duration-200">
            <div className="relative">
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 rounded-[6px] z-10" />
              <img src="/assets/images/card_ppl1.png" alt="Your Story" className="w-full object-cover rounded-[6px]" />
              <div className="bg-[#112032] rounded-[25.5px_25.5px_6px_6px] pt-[30px] pb-[10px] z-10 absolute bottom-0 left-0 right-0">
                <div className="absolute top-[-12px] left-1/2 -translate-x-1/2">
                  <button className="bg-[#1890FF] border-2 border-[#112032] rounded-full w-8 h-8 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                      <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                    </svg>
                  </button>
                </div>
                <p className="text-center text-white text-xs font-medium leading-[19px] m-0">Your Story</p>
              </div>
            </div>
          </div>

          {/* Story 2 */}
          <div className="rounded-[6px] overflow-hidden relative cursor-pointer group transition-all duration-200">
            <div className="relative">
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 rounded-[6px] z-10 transition-all duration-200" />
              <img src="/assets/images/card_ppl2.png" alt="Ryan Roslansky" className="w-full object-cover rounded-[6px]" />
              <div className="absolute bottom-0 left-0 right-0 z-10 pb-[10px]">
                <p className="text-center text-white text-xs font-medium leading-[19px] m-0">Ryan Roslansky</p>
              </div>
              <div className="absolute top-3 right-3 z-10">
                <img src="/assets/images/mini_pic.png" alt="mini" className="border-2 border-white rounded-full w-[28px] bg-[#C4C4C4]" />
              </div>
            </div>
          </div>

          {/* Story 3 */}
          <div className="rounded-[6px] overflow-hidden relative cursor-pointer group transition-all duration-200">
            <div className="relative">
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 rounded-[6px] z-10 transition-all duration-200" />
              <img src="/assets/images/card_ppl3.png" alt="Ryan Roslansky" className="w-full object-cover rounded-[6px]" />
              <div className="absolute bottom-0 left-0 right-0 z-10 pb-[10px]">
                <p className="text-center text-white text-xs font-medium leading-[19px] m-0">Ryan Roslansky</p>
              </div>
              <div className="absolute top-3 right-3 z-10">
                <img src="/assets/images/mini_pic.png" alt="mini" className="border-2 border-white rounded-full w-[28px] bg-[#C4C4C4]" />
              </div>
            </div>
          </div>

          {/* Story 4 */}
          <div className="rounded-[6px] overflow-hidden relative cursor-pointer group transition-all duration-200">
            <div className="relative">
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 rounded-[6px] z-10 transition-all duration-200" />
              <img src="/assets/images/card_ppl4.png" alt="Ryan Roslansky" className="w-full object-cover rounded-[6px]" />
              <div className="absolute bottom-0 left-0 right-0 z-10 pb-[10px]">
                <p className="text-center text-white text-xs font-medium leading-[19px] m-0">Ryan Roslansky</p>
              </div>
              <div className="absolute top-3 right-3 z-10">
                <img src="/assets/images/mini_pic.png" alt="mini" className="border-2 border-white rounded-full w-[28px] bg-[#C4C4C4]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* For Mobile view */}
      <div className="block md:hidden mb-4">
        <div className="overflow-x-auto whitespace-nowrap py-1">
          <ul className="flex items-center gap-4 list-none p-0 m-0">
            {/* Own Story */}
            <li className="inline-block">
              <a href="#0" className="flex flex-col items-center">
                <div className="relative w-[56px] h-[56px]">
                  <img src="/assets/images/mobile_story_img.png" alt="Your Story" className="w-full h-full rounded-full object-cover" />
                  <div className="absolute bottom-0 right-0">
                    <button className="bg-[#1890FF] rounded-full border border-white w-4 h-4 flex items-center justify-center p-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none" viewBox="0 0 12 12">
                        <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-[#666666] font-medium leading-[1.4] mt-1 m-0">Your Story</p>
              </a>
            </li>

            {/* Active Friend Story */}
            {[1, 2, 3, 4].map((story, i) => (
              <li key={i} className="inline-block">
                <a href="#0" className="flex flex-col items-center">
                  <div className={`p-[2px] rounded-full ${i % 2 === 0 ? "border-2 border-[#1890FF]" : "border-2 border-transparent"}`}>
                    <img
                      src={i % 2 === 0 ? "/assets/images/mobile_story_img1.png" : "/assets/images/mobile_story_img2.png"}
                      alt="Friend"
                      className="w-[50px] h-[50px] rounded-full object-cover"
                    />
                  </div>
                  <p className="text-[11px] text-[#666666] leading-[1.4] mt-1 m-0">Ryan...</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
