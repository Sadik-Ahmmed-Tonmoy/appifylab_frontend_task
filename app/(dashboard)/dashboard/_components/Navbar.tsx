"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface NavbarProps {
  userName?: string;
}

export default function Navbar({ userName = "Dylan Field" }: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifyRef.current && !notifyRef.current.contains(e.target as Node)) setNotifyOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* Desktop Navbar - fixed top */}
      <nav
        className="hidden lg:flex items-center bg-white fixed top-0 left-0 right-0 z-[1030]"
        style={{ boxShadow: "0px 4px 16px #F0F2F5", paddingTop: "10px" }}
      >
        <div className="w-full max-w-[1320px] mx-auto px-4">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex items-center mr-auto">
              <Link href="/dashboard" className="navbar-brand">
                <img src="/assets/images/logo.svg" alt="BuddyScript" style={{ maxWidth: "169px", height: "auto", display: "block" }} />
              </Link>
            </div>

            {/* Search */}
            <div className="ml-auto relative">
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
                className="bg-[#F5F5F5] border border-[#F5F5F5] focus:border-[#1890FF] focus:outline-none transition-all duration-200"
                style={{
                  borderRadius: "32px",
                  width: "424px",
                  height: "40px",
                  padding: "7px 47px",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  color: "rgba(0,0,0,0.25)",
                }}
              />
            </div>

            {/* Nav Icons */}
            <ul className="flex items-center mb-0 ml-auto" style={{ marginRight: "8px" }}>
              {/* Home - active */}
              <li className="relative" style={{ margin: "0 12px" }}>
                <Link
                  href="/dashboard"
                  className="relative block transition-all duration-200"
                  style={{ padding: "22px 16px 26px" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" fill="none" viewBox="0 0 18 21">
                    <path stroke="#1890FF" strokeWidth="1.5" strokeOpacity="1" d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z" />
                    <path stroke="#1890FF" strokeOpacity="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857" />
                  </svg>
                  {/* Active underline */}
                  <span className="absolute bottom-0 left-0 w-full" style={{ height: "2px", background: "#00ACFF" }} />
                </Link>
              </li>

              {/* Friends */}
              <li className="relative" style={{ margin: "0 12px" }}>
                <a href="#" className="relative block transition-all duration-200 group" style={{ padding: "22px 16px 26px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="20" fill="none" viewBox="0 0 26 20">
                    <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M12.79 12.15h.429c2.268.015 7.45.243 7.45 3.732 0 3.466-5.002 3.692-7.415 3.707h-.894c-2.268-.015-7.452-.243-7.452-3.727 0-3.47 5.184-3.697 7.452-3.711l.297-.001h.132zm0 1.75c-2.792 0-6.12.34-6.12 1.962 0 1.585 3.13 1.955 5.864 1.976l.255.002c2.792 0 6.118-.34 6.118-1.958 0-1.638-3.326-1.982-6.118-1.982zm9.343-2.224c2.846.424 3.444 1.751 3.444 2.79 0 .636-.251 1.794-1.931 2.43a.882.882 0 01-1.137-.506.873.873 0 01.51-1.13c.796-.3.796-.633.796-.793 0-.511-.654-.868-1.944-1.06a.878.878 0 01-.741-.996.886.886 0 011.003-.735zm-17.685.735a.878.878 0 01-.742.997c-1.29.19-1.944.548-1.944 1.059 0 .16 0 .491.798.793a.873.873 0 01-.314 1.693.897.897 0 01-.313-.057C.25 16.259 0 15.1 0 14.466c0-1.037.598-2.366 3.446-2.79.485-.06.929.257 1.002.735zM12.789 0c2.96 0 5.368 2.392 5.368 5.33 0 2.94-2.407 5.331-5.368 5.331h-.031a5.329 5.329 0 01-3.782-1.57 5.253 5.253 0 01-1.553-3.764C7.423 2.392 9.83 0 12.789 0zm0 1.75c-1.987 0-3.604 1.607-3.604 3.58a3.526 3.526 0 001.04 2.527 3.58 3.58 0 002.535 1.054l.03.875v-.875c1.987 0 3.605-1.605 3.605-3.58S14.777 1.75 12.789 1.75z" clipRule="evenodd" />
                  </svg>
                  <span className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-all duration-200" style={{ height: "2px", background: "#00ACFF" }} />
                </a>
              </li>

              {/* Notifications */}
              <li className="relative" ref={notifyRef} style={{ margin: "0 12px" }}>
                <span
                  id="_notify_btn"
                  onClick={() => setNotifyOpen(!notifyOpen)}
                  className="relative block transition-all duration-200 group cursor-pointer"
                  style={{ padding: "22px 16px 26px" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                    <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd" />
                  </svg>
                  <span
                    className="absolute flex items-center justify-center text-white bg-[#1890FF] border border-white"
                    style={{ borderRadius: "9px", minWidth: "17px", height: "17px", fontSize: "11px", top: "16px", right: "10px", padding: "3px" }}
                  >6</span>
                  <span className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-all duration-200" style={{ height: "2px", background: "#00ACFF" }} />

                  {/* Notification Dropdown */}
                  {notifyOpen && (
                    <div
                      id="_notify_drop"
                      className="absolute bg-white"
                      style={{
                        boxShadow: "rgba(149,157,165,0.2) 0px 8px 24px",
                        padding: "16px",
                        width: "400px",
                        left: "-110px",
                        top: "32px",
                        height: "calc(100vh - 90px)",
                        overflowY: "auto",
                        borderRadius: "6px",
                        zIndex: 100,
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between" style={{ marginBottom: "20px" }}>
                        <h4 style={{ fontSize: "20px", fontWeight: 600, color: "#212121", lineHeight: "1.2" }}>Notifications</h4>
                        <div className="relative">
                          <button className="border-none bg-transparent outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                              <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                              <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                              <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-5">
                        <button className="border border-[#f1f1f1] text-[#1890FF] bg-[#1890ff26]" style={{ height: "36px", padding: "8px", borderRadius: "6px", fontSize: "16px", fontWeight: 500 }}>All</button>
                        <button className="border border-[#f1f1f1] text-[#212121]" style={{ height: "36px", padding: "8px", borderRadius: "6px", fontSize: "16px", fontWeight: 500 }}>Unread</button>
                      </div>
                      <div style={{ marginTop: "20px" }}>
                        {[
                          { img: "/assets/images/friend-req.png", name: "Steve Jobs", text: "posted a link in your timeline." },
                          { img: "/assets/images/profile-1.png", name: "An admin", text: " changed the name of the group Freelacer usa to Freelacer usa" },
                          { img: "/assets/images/friend-req.png", name: "Steve Jobs", text: "posted a link in your timeline." },
                          { img: "/assets/images/profile-1.png", name: "An admin", text: " changed the name of the group Freelacer usa to Freelacer usa" },
                        ].map((n, i) => (
                          <div key={i} className="flex items-center cursor-pointer transition-all duration-200 hover:bg-[#66666621]" style={{ marginBottom: "16px", padding: "6px" }}>
                            <div style={{ flex: "0 0 56px", marginRight: "12px" }}>
                              <img src={n.img} alt="" style={{ maxWidth: "56px", height: "56px", borderRadius: "50%", objectFit: "cover" }} />
                            </div>
                            <div>
                              <p style={{ fontSize: "14px", fontWeight: 500, color: "#666666", lineHeight: "1.6" }}>
                                <span style={{ color: "#212121" }}>{n.name}</span> {n.text}
                              </p>
                              <div><span style={{ color: "#1890FF", lineHeight: "1.2", fontWeight: 600, fontSize: "0.8125rem" }}>42 minutes ago</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </span>
              </li>

              {/* Chat */}
              <li className="relative" style={{ margin: "0 12px" }}>
                <a href="#" className="relative block transition-all duration-200 group" style={{ padding: "22px 16px 26px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" fill="none" viewBox="0 0 23 22">
                    <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M11.43 0c2.96 0 5.743 1.143 7.833 3.22 4.32 4.29 4.32 11.271 0 15.562C17.145 20.886 14.293 22 11.405 22c-1.575 0-3.16-.33-4.643-1.012-.437-.174-.847-.338-1.14-.338-.338.002-.793.158-1.232.308-.9.307-2.022.69-2.852-.131-.826-.822-.445-1.932-.138-2.826.152-.44.307-.895.307-1.239 0-.282-.137-.642-.347-1.161C-.57 11.46.322 6.47 3.596 3.22A11.04 11.04 0 0111.43 0zm0 1.535A9.5 9.5 0 004.69 4.307a9.463 9.463 0 00-1.91 10.686c.241.592.474 1.17.474 1.77 0 .598-.207 1.201-.39 1.733-.15.439-.378 1.1-.231 1.245.143.147.813-.085 1.255-.235.53-.18 1.133-.387 1.73-.391.597 0 1.161.225 1.758.463 3.655 1.679 7.98.915 10.796-1.881 3.716-3.693 3.716-9.7 0-13.391a9.5 9.5 0 00-6.74-2.77zm4.068 8.867c.57 0 1.03.458 1.03 1.024 0 .566-.46 1.023-1.03 1.023a1.023 1.023 0 11-.01-2.047h.01zm-4.131 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.03 1.03 0 01-1.035-1.024c0-.566.455-1.023 1.025-1.023h.01zm-4.132 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.022 1.022 0 11-.01-2.047h.01z" clipRule="evenodd" />
                  </svg>
                  <span
                    className="absolute flex items-center justify-center text-white bg-[#1890FF] border border-white"
                    style={{ borderRadius: "9px", minWidth: "17px", height: "17px", fontSize: "11px", top: "16px", right: "10px", padding: "3px" }}
                  >2</span>
                  <span className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-all duration-200" style={{ height: "2px", background: "#00ACFF" }} />
                </a>
              </li>
            </ul>

            {/* Profile */}
            <div className="relative flex items-center" ref={profileRef}>
              <div className="flex items-center cursor-pointer" onClick={() => setProfileOpen(!profileOpen)}>
                <div style={{ margin: "0 8px 0 0", width: "24px" }}>
                  <img src="/assets/images/profile.png" alt="Profile" style={{ maxWidth: "24px", borderRadius: "50%", objectFit: "cover" }} />
                </div>
                <div className="flex items-center cursor-pointer">
                  <p style={{ fontWeight: "normal", fontSize: "16px", lineHeight: "24px", color: "#212121", margin: 0 }}>{userName}</p>
                  <button className="border-transparent bg-transparent" style={{ margin: "-3px 0 0 8px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6">
                      <path fill="#112032" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 bg-white"
                  style={{ top: "52px", width: "240px", borderRadius: "6px", boxShadow: "rgba(149,157,165,0.2) 0px 8px 24px", zIndex: 100 }}
                >
                  <div className="flex items-center" style={{ padding: "16px" }}>
                    <div style={{ marginRight: "12px" }}>
                      <img src="/assets/images/profile.png" alt="" style={{ maxWidth: "44px", borderRadius: "50%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "16px", fontWeight: 500, color: "#212121" }}>{userName}</h4>
                      <a href="#" style={{ color: "#1890FF", fontSize: "13px" }}>View Profile</a>
                    </div>
                  </div>
                  <hr style={{ margin: "0" }} />
                  <ul style={{ padding: "8px 0", listStyle: "none" }}>
                    {[
                      { icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" fill="none" viewBox="0 0 18 19"><path fill="#377DFF" d="M9.584 0c.671 0 1.315.267 1.783.74.468.473.721 1.112.7 1.709l.009.14a.985.985 0 00.136.395c.145.242.382.418.659.488.276.071.57.03.849-.13l.155-.078c1.165-.538 2.563-.11 3.21.991l.58.99a.695.695 0 01.04.081l.055.107c.519 1.089.15 2.385-.838 3.043l-.244.15a1.046 1.046 0 00-.313.339 1.042 1.042 0 00-.11.805c.074.272.255.504.53.66l.158.1c.478.328.823.812.973 1.367.17.626.08 1.292-.257 1.86l-.625 1.022-.094.144c-.735 1.038-2.16 1.355-3.248.738l-.129-.066a1.123 1.123 0 00-.412-.095 1.087 1.087 0 00-.766.31c-.204.2-.317.471-.316.786l-.008.163C11.956 18.022 10.88 19 9.584 19h-1.17c-1.373 0-2.486-1.093-2.484-2.398l-.008-.14a.994.994 0 00-.14-.401 1.066 1.066 0 00-.652-.493 1.12 1.12 0 00-.852.127l-.169.083a2.526 2.526 0 01-1.698.122 2.47 2.47 0 01-1.488-1.154l-.604-1.024-.08-.152a2.404 2.404 0 01.975-3.132l.1-.061c.292-.199.467-.527.467-.877 0-.381-.207-.733-.569-.94l-.147-.092a2.419 2.419 0 01-.724-3.236l.615-.993a2.503 2.503 0 013.366-.912l.126.066c.13.058.269.089.403.09a1.08 1.08 0 001.086-1.068l.008-.185c.049-.57.301-1.106.713-1.513A2.5 2.5 0 018.414 0h1.17z"/></svg>, label: "Settings" },
                      { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19a9 9 0 100-18 9 9 0 000 18zM7.38 7.3a2.7 2.7 0 015.248.9c0 1.8-2.7 2.7-2.7 2.7M10 14.5h.009"/></svg>, label: "Help & Support" },
                      { icon: <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19"><path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.667 18H2.889A1.889 1.889 0 011 16.111V2.89A1.889 1.889 0 012.889 1h3.778M13.277 14.222L18 9.5l-4.723-4.722M18 9.5H6.667"/></svg>, label: "Log Out", isLogout: true },
                    ].map((item, i) => (
                      <li key={i}>
                        {item.isLogout ? (
                          <button
                            onClick={() => signOut({ callbackUrl: "/auth/login" })}
                            className="flex items-center justify-between w-full text-left transition-all duration-200 hover:bg-[#f5f5f5]"
                            style={{ padding: "10px 16px", fontSize: "14px", color: "#212121", border: "none", background: "transparent" }}
                          >
                            <div className="flex items-center gap-3">{item.icon} {item.label}</div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10"><path fill="#112032" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" opacity=".5"/></svg>
                          </button>
                        ) : (
                          <a href="#" className="flex items-center justify-between transition-all duration-200 hover:bg-[#f5f5f5]" style={{ padding: "10px 16px", fontSize: "14px", color: "#212121" }}>
                            <div className="flex items-center gap-3">{item.icon} {item.label}</div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none" viewBox="0 0 6 10"><path fill="#112032" d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z" opacity=".5"/></svg>
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between bg-white fixed top-0 left-0 right-0 z-[1030]" style={{ padding: "16px 16px 0" }}>
        <div style={{ marginBottom: "16px" }} className="flex items-center justify-between w-full">
          <Link href="/dashboard">
            <img src="/assets/images/logo.svg" alt="Logo" style={{ maxWidth: "120px", display: "block" }} />
          </Link>
          <div className="flex items-center">
            <a href="#" style={{ display: "block", marginRight: "16px", cursor: "pointer" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                <circle cx="7" cy="7" r="6" stroke="#666" />
                <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white z-[1030]" style={{ borderTop: "1px solid #F0F2F5" }}>
        <ul className="flex items-center justify-around py-2" style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
          <li>
            <Link href="/dashboard" className="flex flex-col items-center p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="27" fill="none" viewBox="0 0 24 27">
                <path fill="#1890FF" stroke="#1890FF" strokeWidth="1.5" d="M1 13.042c0-2.094 0-3.141.431-4.061.432-.92 1.242-1.602 2.862-2.965l1.571-1.321C8.792 2.232 10.256 1 12 1c1.744 0 3.208 1.232 6.136 3.695l1.572 1.321c1.62 1.363 2.43 2.044 2.86 2.965.432.92.432 1.967.432 4.06v6.54c0 2.908 0 4.362-.92 5.265-.921.904-2.403.904-5.366.904H7.286c-2.963 0-4.445 0-5.365-.904C1 23.944 1 22.49 1 19.581v-6.54z" />
                <path fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.07 18.497h5.857v7.253H9.07v-7.253z" />
              </svg>
            </Link>
          </li>
          <li>
            <a href="#" className="flex flex-col items-center p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="27" height="20" fill="none" viewBox="0 0 27 20">
                <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M13.334 12.405h.138l.31.001c2.364.015 7.768.247 7.768 3.81 0 3.538-5.215 3.769-7.732 3.784h-.932c-2.364-.015-7.77-.247-7.77-3.805 0-3.543 5.405-3.774 7.77-3.789l.31-.001h.138zM13.334 0c3.086 0 5.596 2.442 5.596 5.442 0 3.001-2.51 5.443-5.596 5.443H13.3c-3.085 0-5.596-2.442-5.596-5.443 0-3 2.51-5.442 5.596-5.442z" clipRule="evenodd" />
              </svg>
            </a>
          </li>
          <li>
            <button className="relative flex flex-col items-center p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="27" fill="none" viewBox="0 0 25 27">
                <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M12.663 0c5.768 0 9.642 4.251 9.642 8.22 0 2.043.549 2.909 1.131 3.827.576.906 1.229 1.935 1.229 3.88-.453 4.97-5.935 5.375-12.002 5.375-6.067 0-11.55-.405-11.998-5.296-.004-2.024.649-3.053 1.225-3.959l.203-.324c.501-.814.928-1.7.928-3.502C3.022 4.25 6.897 0 12.664 0z" clipRule="evenodd" />
              </svg>
              <span className="absolute flex items-center justify-center text-white bg-[#1890FF] border border-white" style={{ borderRadius: "9px", minWidth: "17px", height: "17px", fontSize: "10px", top: "4px", right: "4px", padding: "2px" }}>6</span>
            </button>
          </li>
          <li>
            <a href="#" className="relative flex flex-col items-center p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M12.002 0c3.208 0 6.223 1.239 8.487 3.489 4.681 4.648 4.681 12.211 0 16.86-2.294 2.28-5.384 3.486-8.514 3.486-1.706 0-3.423-.358-5.03-1.097-.474-.188-.917-.366-1.235-.366-.366.003-.859.171-1.335.334-.976.333-2.19.748-3.09-.142-.895-.89-.482-2.093-.149-3.061.164-.477.333-.97.333-1.342 0-.306-.149-.697-.376-1.259C-1 12.417-.032 7.011 3.516 3.49A11.96 11.96 0 0112.002 0z" clipRule="evenodd" />
              </svg>
              <span className="absolute flex items-center justify-center text-white bg-[#1890FF] border border-white" style={{ borderRadius: "9px", minWidth: "17px", height: "17px", fontSize: "10px", top: "4px", right: "4px", padding: "2px" }}>2</span>
            </a>
          </li>
          <li>
            <button className="flex flex-col items-center p-2 border-none bg-transparent">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" fill="none" viewBox="0 0 18 14">
                <path stroke="#666" strokeLinecap="round" strokeWidth="1.5" d="M1 1h16M1 7h16M1 13h16" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
