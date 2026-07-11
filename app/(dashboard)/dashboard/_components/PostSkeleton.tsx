"use client";

interface PostSkeletonProps {
  darkMode: boolean;
  count?: number;
}

export default function PostSkeleton({ darkMode, count = 3 }: PostSkeletonProps) {
  const baseColor = darkMode ? "bg-[#1e293b]" : "bg-[#e2e8f0]";
  const secondaryColor = darkMode ? "bg-[#0f172a]" : "bg-[#f1f5f9]";

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => {
        // Alternate between text-only and text-with-image skeleton cards for variety
        const hasImage = idx % 2 === 1;

        return (
          <div
            key={idx}
            className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16 animate-pulse"
          >
            {/* Header / Top area */}
            <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
              <div className="_feed_inner_timeline_post_top" style={{ marginBottom: "16px" }}>
                <div className="_feed_inner_timeline_post_box" style={{ display: "flex", alignItems: "center" }}>
                  <div
                    className={`${baseColor} rounded-full`}
                    style={{
                      width: "44px",
                      height: "44px",
                      marginRight: "16px",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    {/* Author name placeholder */}
                    <div className={`${baseColor} rounded`} style={{ width: "140px", height: "14px", marginBottom: "6px" }} />
                    {/* Timestamp / Visibility placeholder */}
                    <div className={`${baseColor} rounded`} style={{ width: "80px", height: "10px" }} />
                  </div>
                </div>
                {/* Options button placeholder */}
                <div className={`${baseColor} rounded-full`} style={{ width: "24px", height: "24px" }} />
              </div>

              {/* Text content placeholders */}
              <div style={{ marginTop: "16px", marginBottom: "16px" }}>
                <div className={`${baseColor} rounded`} style={{ width: "100%", height: "12px", marginBottom: "8px" }} />
                <div className={`${baseColor} rounded`} style={{ width: "92%", height: "12px", marginBottom: "8px" }} />
                <div className={`${baseColor} rounded`} style={{ width: "65%", height: "12px" }} />
              </div>

              {/* Optional Image placeholder */}
              {hasImage && (
                <div
                  className={`${baseColor} rounded`}
                  style={{
                    width: "100%",
                    height: "220px",
                    marginTop: "16px",
                    marginBottom: "16px",
                  }}
                />
              )}
            </div>

            {/* Reactions / Stats bar */}
            <div
              className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1px solid ${darkMode ? "#1e293b" : "#f1f5f9"}`,
                paddingBottom: "12px",
                marginBottom: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div className={`${baseColor} rounded-full`} style={{ width: "18px", height: "18px" }} />
                <div className={`${baseColor} rounded-full`} style={{ width: "18px", height: "18px" }} />
                <div className={`${baseColor} rounded`} style={{ width: "40px", height: "12px", marginLeft: "6px" }} />
              </div>
              <div className={`${baseColor} rounded`} style={{ width: "80px", height: "12px" }} />
            </div>

            {/* Action buttons (Like, Comment, Share) */}
            <div
              className="_feed_inner_timeline_reaction"
              style={{
                display: "flex",
                justifyContent: "space-around",
                padding: "8px 24px",
                borderBottom: `1px solid ${darkMode ? "#1e293b" : "#f1f5f9"}`,
                marginBottom: "16px",
              }}
            >
              <div className={`${baseColor} rounded`} style={{ width: "60px", height: "14px" }} />
              <div className={`${baseColor} rounded`} style={{ width: "80px", height: "14px" }} />
              <div className={`${baseColor} rounded`} style={{ width: "60px", height: "14px" }} />
            </div>

            {/* Comment Area */}
            <div className="_feed_inner_timeline_cooment_area" style={{ padding: "0 24px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  className={`${baseColor} rounded-full`}
                  style={{
                    width: "32px",
                    height: "32px",
                    marginRight: "12px",
                    flexShrink: 0,
                  }}
                />
                <div
                  className={`${secondaryColor} rounded-pill`}
                  style={{
                    flexGrow: 1,
                    height: "36px",
                    borderRadius: "18px",
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
