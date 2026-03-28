import { useState } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import Modal from "../components/Modal";
import Label from "../components/Label";

export default function InviteModal({ kid, pendingInvites, onCreateInvite, onRevokeInvite, onClose }) {
  const [inviteUrl, setInviteUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const kidInvites = (pendingInvites || []).filter((i) => i.child_id === kid?.id);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await onCreateInvite(kid.id);
      setInviteUrl(result.inviteUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = inviteUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!inviteUrl || !navigator.share) return;
    try {
      await navigator.share({
        title: `Help manage ${kid.name}'s schedule on Skeddo`,
        text: `I'd like you to help manage ${kid.name}'s schedule. Tap this link to join:`,
        url: inviteUrl,
      });
    } catch {
      // User cancelled share — that's fine
    }
  };

  return (
    <Modal onClose={onClose} centered>
      <h3 style={s.modalTitle}>Invite someone</h3>
      <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>
        Share this link with someone who helps manage <strong style={{ color: C.ink }}>{kid?.name}'s</strong> schedule.
        The link can only be used once and expires in 7 days.
      </p>

      {error && (
        <div style={{
          background: "#FEE2E2", color: "#991B1B", borderRadius: 8, padding: "8px 12px",
          fontSize: 13, fontFamily: "'Barlow', sans-serif", marginBottom: 12,
        }}>
          {error}
        </div>
      )}

      {!inviteUrl ? (
        <button
          style={{ ...s.primaryBtn, width: "100%", opacity: loading ? 0.6 : 1 }}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Invite Link"}
        </button>
      ) : (
        <div>
          <Label>Invite Link</Label>
          <div style={{
            background: "#F2F0EC", borderRadius: 10, padding: "10px 12px",
            fontFamily: "monospace", fontSize: 13, color: C.ink, wordBreak: "break-all",
            marginBottom: 12, border: `1px solid ${C.border}`,
          }}>
            {inviteUrl}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...s.primaryBtn, flex: 1 }} onClick={handleCopy}>
              {copied ? "Copied!" : "Copy Link"}
            </button>
            {navigator.share && (
              <button style={{ ...s.secondaryBtn, flex: 1 }} onClick={handleShare}>
                Share
              </button>
            )}
          </div>
        </div>
      )}

      {/* Existing pending invites */}
      {kidInvites.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <Label>Pending Invites</Label>
          {kidInvites.map((inv) => (
            <div key={inv.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 0", borderBottom: `1px solid ${C.border}`,
            }}>
              <div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.ink, fontWeight: 600 }}>
                  Pending invite
                </div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: C.muted }}>
                  Awaiting response &middot; expires {new Date(inv.expires_at).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => onRevokeInvite(inv.id)}
                style={{
                  background: "none", border: "none", color: C.danger,
                  fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <button style={s.secondaryBtn} onClick={onClose}>Done</button>
      </div>
    </Modal>
  );
}
