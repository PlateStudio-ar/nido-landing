// Public Supabase URL and publishable key. RLS and the restricted RPC protect data.
const endpoint = "https://eogddmfdgwnfxejdspru.supabase.co/rest/v1/rpc/studio_track";
const publicKey = "sb_publishable_SWJa9Q8jZDWcgYzc5xm11Q_J1doxXQZ";
const params = new URLSearchParams(location.search);
const campaign = Object.fromEntries(["source", "medium", "campaign", "content"].map(k => [k, (params.get("utm_" + k) || "").slice(0, k === "campaign" || k === "content" ? 120 : 80)]));
const send = event => {
  if (navigator.doNotTrack === "1" || navigator.globalPrivacyControl) return;
  void fetch(endpoint, { method: "POST", mode: "cors", keepalive: true,
    headers: { "content-type": "application/json", apikey: publicKey },
    body: JSON.stringify({ p_event: event, p_source: campaign.source, p_medium: campaign.medium, p_campaign: campaign.campaign, p_content: campaign.content })
  }).catch(() => {});
};
send("landing_view");
document.querySelectorAll('a[href^="https://nido-rho-gules.vercel.app/"]').forEach(link => {
  const target = new URL(link.href);
  for (const [key, value] of params) if (["utm_source", "utm_medium", "utm_campaign", "utm_content"].includes(key) && value) target.searchParams.set(key, value.slice(0, 120));
  link.href = target.toString();
});
