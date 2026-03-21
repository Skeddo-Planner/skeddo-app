import { useState, useEffect } from "react";
import { C } from "./constants/brand";
import { uid } from "./constants/sampleData";
import { s } from "./styles/shared";
import { useAppData } from "./hooks/useAppData";
import { useAuth } from "./hooks/useAuth";

import Header from "./components/Header";
import TabBar from "./components/TabBar";
import HomeTab from "./tabs/HomeTab";
import DiscoverTab from "./tabs/DiscoverTab";
import ScheduleTab from "./tabs/ScheduleTab";
import ProgramsTab from "./tabs/ProgramsTab";
import BudgetTab from "./tabs/BudgetTab";
import CirclesTab from "./tabs/CirclesTab";
import ProgramDetail from "./modals/ProgramDetail";
import DirectoryDetail from "./modals/DirectoryDetail";
import ProgramForm from "./modals/ProgramForm";
import KidForm from "./modals/KidForm";
import ProfileModal from "./modals/ProfileModal";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import InfoPage from "./pages/InfoPages";
import { usePushNotifications } from "./hooks/usePushNotifications";
import { useChildAccess } from "./hooks/useChildAccess";
import InviteModal from "./modals/InviteModal";
import ChildSettingsModal from "./modals/ChildSettingsModal";
import InviteAcceptPage from "./pages/InviteAcceptPage";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ComingSoonPage from "./pages/ComingSoonPage";

/* Bypass Coming Soon page if: ?preview=true, app.skeddo.ca subdomain, or past launch date */
const isPreview =
  new URLSearchParams(window.location.search).get("preview") === "true" ||
  window.location.hostname === "app.skeddo.ca" ||
  new Date() >= new Date("2026-04-01T00:00:00-07:00");

// Check if this is an invite URL
const inviteMatch = window.location.pathname.match(/^\/invite\/([a-zA-Z0-9_-]+)$/);
const pendingInviteCode = inviteMatch ? inviteMatch[1] : null;

export default function Skeddo() {
  const { user, session, loading: authLoading, signOut } = useAuth();
  const [authPage, setAuthPage] = useState("landing"); // 'landing' | 'signin' | 'signup' | 'app'

  // When user becomes authenticated, switch to app view
  useEffect(() => {
    if (user) setAuthPage("app");
    else setAuthPage("landing");
  }, [user]);

  /* ── Coming Soon page for public visitors ── */
  if (!isPreview) {
    return <ComingSoonPage />;
  }

  /* ── Auth loading spinner ── */
  if (authLoading) {
    return (
      <div style={{
        ...s.app,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        paddingBottom: 0,
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Barlow:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${C.cream}; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
        <div style={{ textAlign: "center", animation: "pulse 1.8s ease-in-out infinite" }}>
          <img
            src="/skeddo-logo-dark.png"
            alt="Skeddo"
            style={{ height: 64, width: "auto", borderRadius: 14, marginBottom: 16 }}
          />
          <div style={{
            color: C.muted,
            fontSize: 13,
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 600,
          }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  /* ── Invite accept page ── */
  if (pendingInviteCode) {
    const handleAcceptInvite = async (code) => {
      const token = session?.access_token;
      const res = await fetch("/api/invite-accept", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ inviteCode: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      // Clear invite from URL after accepting
      window.history.replaceState({}, "", "/");
      return data;
    };

    if (!user) {
      return (
        <InviteAcceptPage
          inviteCode={pendingInviteCode}
          session={null}
          onAccept={handleAcceptInvite}
          onSignIn={() => setAuthPage("signin")}
          onSignUp={() => setAuthPage("signup")}
        />
      );
    }

    return (
      <InviteAcceptPage
        inviteCode={pendingInviteCode}
        session={session}
        onAccept={handleAcceptInvite}
      />
    );
  }

  /* ── Not authenticated — show landing or auth pages ── */
  if (!user) {
    if (authPage === "signin" || authPage === "signup") {
      return (
        <AuthPage
          mode={authPage}
          onNavigate={setAuthPage}
          onAuthSuccess={() => setAuthPage("app")}
        />
      );
    }
    // Default: landing page
    return <LandingPage onNavigate={setAuthPage} />;
  }

  /* ── Authenticated — show the app ── */
  return <SkedDoApp onSignOut={signOut} userEmail={user?.email} userId={user?.id} session={session} />;
}


/* ── The existing app, extracted into its own component ── */
function SkedDoApp({ onSignOut, userEmail, userId, session }) {
  const data = useAppData(userId);
  const {
    programs, kids, loaded, tab, setTab, onboarded, completeOnboarding,
    statusFilter, setStatusFilter, catFilter, setCatFilter,
    searchQuery, setSearchQuery,
    kidFilter, setKidFilter,
    enrolledPrograms, waitlistPrograms, exploringPrograms,
    totalCostEnrolled, totalCostAll, filteredPrograms,
    saveProgram, deleteProgram, cycleStatus, saveKid, deleteKid,
    favorites, toggleFavorite, isFavorite,
    profile, setProfile, lastSynced,
  } = data;

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);
  const [infoPage, setInfoPage] = useState(null);
  const pushNotifications = usePushNotifications();
  const childAccess = useChildAccess(userId, session);

  // Merge shared kids into the kids list
  const allKids = [...kids, ...childAccess.sharedKids.filter((sk) => !kids.some((k) => k.id === sk.id))];

  /* ── PWA Install Prompt ── */
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );

  useEffect(() => {
    const mq = window.matchMedia("(display-mode: standalone)");
    const mqHandler = (e) => setIsStandalone(e.matches);
    mq.addEventListener("change", mqHandler);

    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      // beforeinstallprompt only fires when NOT installed — override stale standalone state
      setIsStandalone(false);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setShowInstallBanner(false);
      setIsStandalone(true);
    };
    window.addEventListener("appinstalled", installedHandler);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS && !window.navigator.standalone) {
      setShowInstallBanner(true);
    }

    // On Android/desktop, always show banner after 3s as fallback.
    // If beforeinstallprompt fires first, the Install button will appear.
    // If not (e.g. after cross-browser uninstall), show manual instructions.
    // The banner hides itself when actually running as standalone PWA.
    let timer;
    if (!isIOS) {
      timer = setTimeout(() => {
        setShowInstallBanner(true);
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
      mq.removeEventListener("change", mqHandler);
    };
  }, [isStandalone]);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    // Call prompt() synchronously in the click handler so Android Chrome
    // recognizes the user gesture (async wrappers can lose gesture context)
    const promptEvent = installPrompt;
    setInstallPrompt(null);
    promptEvent.prompt();
    promptEvent.userChoice.then((result) => {
      if (result.outcome === "accepted") {
        setShowInstallBanner(false);
        setIsStandalone(true);
      }
    });
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  /* ── Scroll to top on tab switch ── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  /* ── Modal openers ── */
  const openAddProgram = () => {
    setForm({
      name: "", provider: "", category: "Sports", status: "Exploring",
      cost: "", days: "", times: "", startDate: "", endDate: "",
      kidIds: [], notes: "", seasonType: "", ageMin: "", ageMax: "",
      location: "", neighbourhood: "", registrationUrl: "",
    });
    setModal({ type: "programForm", isEdit: false });
  };

  const openEditProgram = (p) => {
    setForm({ ...p });
    setModal({ type: "programForm", isEdit: true });
  };

  const openDetail = (p) => {
    setModal({ type: "programDetail", data: p });
  };

  const openDirectoryDetail = (p) => {
    setModal({ type: "directoryDetail", data: p });
  };

  const openAddKid = () => {
    setForm({ name: "", age: "", notes: "" });
    setModal({ type: "kidForm", isEdit: false });
  };

  const openEditKid = (k) => {
    setForm({ ...k });
    setModal({ type: "kidForm", isEdit: true });
  };

  const openInviteModal = (kid) => {
    setModal({ type: "invite", data: kid });
  };

  const openChildSettings = (kid) => {
    setModal({ type: "childSettings", data: kid });
  };

  /* ── Modal actions ── */
  const handleSaveProgram = () => {
    if (!form.name?.trim()) return;
    const isNew = !form.id;
    saveProgram({
      ...form,
      name: form.name.trim(),
      cost: Number(form.cost) || 0,
      kidIds: form.kidIds || [],
      id: form.id || uid(),
    });
    setModal(null);
    showToast(isNew ? "Program added" : "Program updated");

    // Notify founders when a user manually adds a new program
    // (so they can verify and add it to the directory for all users)
    if (isNew) {
      try {
        fetch("/api/notify-manual-program", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            programName: form.name.trim(),
            provider: form.provider || "",
            category: form.category || "",
            cost: form.cost || "",
            days: form.days || "",
            times: form.times || "",
            startDate: form.startDate || "",
            endDate: form.endDate || "",
            ageMin: form.ageMin || "",
            ageMax: form.ageMax || "",
            location: form.location || "",
            neighbourhood: form.neighbourhood || "",
            registrationUrl: form.registrationUrl || "",
            userEmail: userEmail || "",
            userName: profile.displayName || "",
          }),
        }).catch(() => {}); // fire-and-forget, don't block the user
      } catch {}
    }
  };

  const handleDeleteProgram = (id) => {
    deleteProgram(id);
    setModal(null);
    showToast("Program deleted");
  };

  const handleSaveKid = () => {
    if (!form.name?.trim()) return;
    saveKid({ ...form, name: form.name.trim(), id: form.id || uid() });
    setModal(null);
    showToast(form.id ? "Kid updated" : "Kid added");
  };

  const handleDeleteKid = (id) => {
    deleteKid(id);
    setModal(null);
    showToast("Kid removed");
  };

  const handleAddToSchedule = (dirProgram) => {
    saveProgram({
      id: uid(),
      name: dirProgram.name,
      provider: dirProgram.provider || "",
      category: dirProgram.category || "Sports",
      status: dirProgram.status || "Exploring",
      cost: dirProgram.cost === "TBD" ? 0 : Number(dirProgram.cost) || 0,
      days: dirProgram.days || "",
      times: dirProgram.startTime && dirProgram.endTime
        ? `${dirProgram.startTime}\u2013${dirProgram.endTime}`
        : dirProgram.times || "",
      startDate: dirProgram.startDate || "",
      endDate: dirProgram.endDate || "",
      kidIds: dirProgram.kidIds || [],
      seasonType: dirProgram.campType || dirProgram.seasonType || "",
      ageMin: dirProgram.ageMin || "",
      ageMax: dirProgram.ageMax || "",
      location: dirProgram.address || dirProgram.location || "",
      neighbourhood: dirProgram.neighbourhood || "",
      registrationUrl: dirProgram.registrationUrl || "",
      notes: "",
    });
    setModal(null);
    showToast("Added to your schedule");
  };

  const handleNavigateToTab = (tabId, statusFilterVal, kidId) => {
    setTab(tabId);
    if (statusFilterVal) setStatusFilter(statusFilterVal);
    else { setStatusFilter("All"); setCatFilter("All"); }
    setKidFilter(kidId || null);
  };

  const handleOnboardingComplete = (onboardedKids, profileData) => {
    onboardedKids.forEach((k) => saveKid(k));
    if (profileData) {
      setProfile((prev) => ({ ...prev, ...profileData }));
    }
    completeOnboarding();
  };

  /* ── Loading state ── */
  if (!loaded) return (
    <div style={{
      ...s.app,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      paddingBottom: 0,
    }}>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      <div style={{ textAlign: "center", animation: "pulse 1.8s ease-in-out infinite" }}>
        <img
          src="/skeddo-logo-dark.png"
          alt="Skeddo"
          style={{ height: 64, width: "auto", borderRadius: 14, marginBottom: 16 }}
        />
        <div style={{ color: C.muted, fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 600 }}>
          Loading your planner...
        </div>
      </div>
    </div>
  );

  /* ── Onboarding ── */
  if (!onboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  /* ── Main App ── */
  return (
    <div style={s.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Barlow:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.cream}; }
        .skeddo-card { transition: transform 0.15s ease, box-shadow 0.15s ease; cursor: pointer; }
        .skeddo-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,46,38,0.08); }
        .skeddo-card:active { transform: scale(0.98); }
        .tab-btn { transition: all 0.15s ease; }
        .tab-btn:hover { background: rgba(58,158,106,0.06); }
        .chip-btn { transition: all 0.12s ease; }
        .chip-btn:hover { transform: scale(1.04); }
        .modal-bg { animation: fadeBg 0.2s ease; }
        .modal-content { animation: slideIn 0.25s cubic-bezier(0.22, 0.61, 0.36, 1); }
        @keyframes fadeBg { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .tab-content { animation: fadeIn 0.2s ease; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: ${C.seaGreen} !important; box-shadow: 0 0 0 3px rgba(58,158,106,0.12); }
        .status-chip { cursor: pointer; user-select: none; transition: all 0.12s; }
        .status-chip:hover { filter: brightness(0.95); transform: scale(1.05); }
        .status-chip:active { transform: scale(0.9); animation: chipFlash 0.3s ease; }
        @keyframes chipFlash { 0% { box-shadow: 0 0 0 0 rgba(58,158,106,0.4); } 50% { box-shadow: 0 0 0 6px rgba(58,158,106,0); } 100% { box-shadow: 0 0 0 0 transparent; } }
        .del-btn:hover { background: ${C.danger} !important; color: white !important; }
        .progress-bar { transition: width 0.6s cubic-bezier(0.22, 0.61, 0.36, 1); }
      `}</style>

      <Header
        displayName={profile.displayName}
        onOpenProfile={() => setModal({ type: "profile" })}
        onOpenPage={(pageId) => setInfoPage(pageId)}
        onLogoClick={() => { setTab("home"); setInfoPage(null); }}
        unreadCount={childAccess.unreadCount}
        onOpenActivity={() => { childAccess.markActivityViewed(); setTab("home"); }}
      />

      {/* Info pages (About, Privacy, etc.) */}
      {infoPage && (
        <InfoPage pageId={infoPage} onBack={() => setInfoPage(null)} />
      )}

      {!infoPage && <main style={s.main}>
        {tab === "home" && (
          <HomeTab
            enrolledPrograms={enrolledPrograms}
            waitlistPrograms={waitlistPrograms}
            exploringPrograms={exploringPrograms}
            totalCostEnrolled={totalCostEnrolled}
            kids={kids}
            onOpenDetail={openDetail}
            onCycleStatus={cycleStatus}
            onNavigateToTab={handleNavigateToTab}
            onOpenAddProgram={openAddProgram}
            onOpenAddKid={openAddKid}
            onEditKid={openEditKid}
            installPrompt={installPrompt}
            showInstallBanner={showInstallBanner}
            onInstallClick={handleInstallClick}
            onDismissInstall={() => setShowInstallBanner(false)}
            activityLog={childAccess.activityLog}
          />
        )}

        {tab === "discover" && (
          <DiscoverTab
            programs={programs}
            kids={kids}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            onAddToSchedule={handleAddToSchedule}
            onOpenDirectoryDetail={openDirectoryDetail}
          />
        )}

        {tab === "schedule" && (
          <ScheduleTab
            programs={programs}
            kids={kids}
            kidFilter={kidFilter}
            onKidFilter={setKidFilter}
            onOpenDetail={openDetail}
            onNavigateToDiscover={() => handleNavigateToTab("discover")}
          />
        )}

        {tab === "programs" && (
          <ProgramsTab
            filteredPrograms={filteredPrograms}
            statusFilter={statusFilter}
            catFilter={catFilter}
            kids={kids}
            kidFilter={kidFilter}
            onKidFilter={setKidFilter}
            onStatusFilter={setStatusFilter}
            onCatFilter={setCatFilter}
            onOpenDetail={openDetail}
            onCycleStatus={cycleStatus}
            onOpenAddProgram={openAddProgram}
            searchQuery={searchQuery}
            onSearchQuery={setSearchQuery}
          />
        )}

        {tab === "circles" && (
          <CirclesTab
            programs={programs}
            kids={kids}
            profile={profile}
            showToast={showToast}
          />
        )}

        {tab === "budget" && (
          <BudgetTab
            programs={programs}
            kids={kids}
            kidFilter={kidFilter}
            onKidFilter={setKidFilter}
            enrolledPrograms={enrolledPrograms}
            waitlistPrograms={waitlistPrograms}
            exploringPrograms={exploringPrograms}
            totalCostEnrolled={totalCostEnrolled}
            totalCostAll={totalCostAll}
            budgetGoal={Number(profile.budgetGoal) || 0}
          />
        )}
      </main>}

      {!infoPage && <TabBar tab={tab} setTab={(t) => handleNavigateToTab(t)} />}

      {/* ─── MODALS ─── */}
      {modal?.type === "programDetail" && (() => {
        // Read from current programs state to avoid stale modal data
        const currentProgram = programs.find((p) => p.id === modal.data.id) || modal.data;
        return (
          <ProgramDetail
            program={currentProgram}
            kids={kids}
            onCycleStatus={() => {
              cycleStatus(currentProgram.id);
            }}
            onEdit={() => openEditProgram(currentProgram)}
            onDelete={() => handleDeleteProgram(currentProgram.id)}
            onClose={() => setModal(null)}
          />
        );
      })()}

      {modal?.type === "directoryDetail" && (
        <DirectoryDetail
          program={modal.data}
          userPrograms={programs}
          kids={kids}
          onAddToSchedule={handleAddToSchedule}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "programForm" && (
        <ProgramForm
          form={form}
          setForm={setForm}
          kids={kids}
          isEdit={modal.isEdit}
          onSave={handleSaveProgram}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "kidForm" && (
        <KidForm
          form={form}
          setForm={setForm}
          isEdit={modal.isEdit}
          onSave={handleSaveKid}
          onDelete={modal.isEdit ? () => handleDeleteKid(form.id) : null}
          onClose={() => setModal(null)}
          coParents={modal.isEdit ? childAccess.getCoParents(form.id).concat(
            // Include self in the list
            [{ userId, displayName: profile.displayName || "You", role: (childAccess.childAccessMap[form.id] || []).find(a => a.userId === userId)?.role || "creator", joinedAt: null }]
          ) : null}
          onManageAccess={(kid) => { setModal(null); setTimeout(() => openChildSettings(kid), 100); }}
          onInvite={(kid) => { setModal(null); setTimeout(() => openInviteModal(kid), 100); }}
        />
      )}

      {modal?.type === "invite" && (
        <InviteModal
          kid={modal.data}
          pendingInvites={childAccess.pendingInvites}
          onCreateInvite={childAccess.createInvite}
          onRevokeInvite={childAccess.revokeInvite}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "childSettings" && (
        <ChildSettingsModal
          kid={modal.data}
          coParents={[
            ...(childAccess.childAccessMap[modal.data.id] || []),
          ]}
          userId={userId}
          onRemoveAccess={childAccess.removeAccess}
          onInvite={(kid) => { setModal(null); setTimeout(() => openInviteModal(kid), 100); }}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "profile" && (
        <ProfileModal
          profile={profile}
          setProfile={setProfile}
          email={userEmail}
          lastSynced={lastSynced}
          onSignOut={onSignOut}
          onClose={() => setModal(null)}
          pushNotifications={pushNotifications}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.ink,
            color: C.cream,
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            padding: "10px 20px",
            borderRadius: 10,
            boxShadow: "0 4px 16px rgba(26,46,38,0.2)",
            zIndex: 9999,
            animation: "fadeIn 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          &#10003; {toast}
        </div>
      )}
    </div>
  );
}
