import { useEffect, useState } from "react";

const AdComponent = ({ slot }) => {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense blocked or error:", e);
      setBlocked(true);
    }
  }, []);

  return (
    <div className="my-4 text-center">
      {!blocked ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-8127433826166594"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      ) : (
        <div style={{ padding: "20px", background: "#f8f9fa", borderRadius: "8px" }}>
          <small>Ad blocked — please disable AdBlock to support us ❤️</small>
        </div>
      )}
    </div>
  );
};

export default AdComponent;
