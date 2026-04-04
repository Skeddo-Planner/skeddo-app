import { useState, useEffect, useRef } from "react";
import { C } from "./constants/brand";
import { uid } from "./constants/sampleData";
import { s } from "./styles/shared";
import { useAppData } from "./hooks/useAppData";
import { useAuth } from "./hooks/useAuth";

import Header from "./components/Header";
import TabBar from "./components/TabBar";
import DesktopSidebar from "./components/DesktopSidebar";
import useIsDesktop from "./hooks/useIsDesktop";
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
import ManualCostForm from "./modals/ManualCostForm";
import ProfileModal from "./modals/ProfileModal";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import InfoPage from "./pages/InfoPages";
import { trackEvent, trackPageView } from "./utils/analytics";
import { usePushNotifications } from "./hooks/usePushNotifications";
import { useChildAccess } from "./hooks/useChildAccess";
import { useCircles } from "./hooks/useCircles";
import usePlanAccess from "./hooks/usePlanAccess";
import InviteModal from "./modals/InviteModal";
import ChildSettingsModal from "./modals/ChildSettingsModal";
import InviteAcceptPage from "./pages/InviteAcceptPage";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";

// Check if this is an invite URL
const inviteMatch = window.location.pathname.match(/^\/invite\/([a-zA-Z0-9_-]+)$/);
const pendingInviteCode = inviteMatch ? inviteMatch[1] : null;

export default function Skeddo() {
  const { user, session, loading: authLoading, signOut, passwordRecovery, clearPasswordRecovery } = useAuth();
  const [authPage, setAuthPage] = useState("landing"); // 'landing' | 'signin' | 'signup' | 'app'
  const [hashError, setHashError] = useState(null);

  // BUG #5: detect expired OTP / auth error in URL hash on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    if (params.get("error")) {
      const desc = params.get("error_description");
      window.history.replaceState({}, "", "/");
      setHashError(desc ? decodeURIComponent(desc.replace(/\+/g, " ")) : "This link has expired. Please request a new one.");
      setAuthPage("signin");
    }
  }, []);

  // When user becomes authenticated, switch to app view.
  // When user signs out (was in "app"), return to landing.
  // Do NOT reset authPage when user is null and we're on signin/signup —
  // Supabase fires multiple auth state changes on load which would wipe out navigation.
  useEffect(() => {
    if (user && !passwordRecovery) {
      setAuthPage("app");
    } else if (!user) {
      setAuthPage((prev) => (prev === "app" ? "landing" : prev));
    }
  }, [user, passwordRecovery]);

  /* ── Track auth page views for GA4 ── */
  useEffect(() => {
    if (authPage === "landing") {
      trackPageView("/landing", "Skeddo - Welcome");
    } else if (authPage === "signin") {
      trackPageView("/signin", "Skeddo - Sign In");
    } else if (authPage === "signup") {
      trackPageView("/signup", "Skeddo - Sign Up");
    }
  }, [authPage]);

  /* ── Auth loading — large logo on dark background ── */
  if (authLoading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
        background: C.ink,
      }}>
        <img
          src="/skeddo-logo-dark.png"
          alt="Skeddo"
          style={{ width: "60%", maxWidth: 320, height: "auto" }}
        />
      </div>
    );
  }

  /* ── Invite accept page ── */
  if (pendingInviteCode) {
    const handleAcceptInvite = async (code) => {
      const token = session?.access_token;
      const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };

      // Try child invite first
      const childRes = await fetch("/api/invite-accept", {
        method: "POST", headers, body: JSON.stringify({ inviteCode: code }),
      });
      const childData = await childRes.json();

      if (childRes.ok) {
        window.history.replaceState({}, "", "/");
        return childData;
      }

      // If child invite failed, try as a referral code
      const refRes = await fetch("/api/referral-convert", {
        method: "POST", headers, body: JSON.stringify({ referralCode: code }),
      });
      const refData = await refRes.json();

      if (refRes.ok) {
        window.history.replaceState({}, "", "/");
        return refData;
      }

      // Both failed — throw the most relevant error
      throw new Error(childData.error || refData.error || "Invalid invite link");
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

  /* ── BUG #9: Password recovery flow — show set-password form ── */
  if (user && passwordRecovery) {
    return (
      <AuthPage
        mode="resetpassword"
        onNavigate={() => {}}
        onAuthSuccess={clearPasswordRecovery}
      />
    );
  }

  /* ── Not authenticated — show landing or auth pages ── */
  if (!user) {
    if (authPage === "signin" || authPage === "signup") {
      return (
        <AuthPage
          mode={authPage}
          onNavigate={(p) => { setHashError(null); setAuthPage(p); }}
          onAuthSuccess={() => setAuthPage("app")}
          initialError={hashError}
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
    saveProgram, deleteProgram, cycleStatus, setStatus, saveKid, deleteKid,
    manualCosts, saveManualCost, deleteManualCost,
    favorites, toggleFavorite, isFavorite,
    profile, setProfile, lastSynced,
  } = data;

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [findSimilarConfig, setFindSimilarConfig] = useState(null);
  const [toast, setToast] = useState(null);
  const [infoPage, setInfoPage] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const stepsBack = useRef(2);
  const popStateHandler = useRef(null);
  const pushNotifications = usePushNotifications();
  const childAccess = useChildAccess(userId, session);
  const circlesHook = useCircles(userId, session);
  const planAccess = usePlanAccess(profile.plan || "free", profile.isBetaUser);
  const isDesktop = useIsDesktop();

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

  /* ── Back button / swipe guard ── */
  useEffect(() => {
    // Push a guard entry so the first back press can be intercepted
    history.pushState({ skeddoGuard: true }, "");

    popStateHandler.current = () => {
      // Re-arm immediately so the app doesn't silently navigate away
      history.pushState({ skeddoGuard: true }, "");
      stepsBack.current++;
      setShowExitConfirm(true);
    };

    window.addEventListener("popstate", popStateHandler.current);
    return () => {
      if (popStateHandler.current) {
        window.removeEventListener("popstate", popStateHandler.current);
      }
    };
  }, []);

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    // Remove listener before navigating so the history.go() doesn't re-trigger the dialog
    if (popStateHandler.current) {
      window.removeEventListener("popstate", popStateHandler.current);
    }
    // Go back past all guard entries and the base skeddo.ca entry to the previous external site
    history.go(-stepsBack.current);
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
    // Guard is already re-armed by the popstate handler — nothing else needed
  };

  /* ── Scroll to top on tab switch ── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tab]);

  /* ── Send initial page_view on app load for GA4 ── */
  useEffect(() => {
    trackPageView("/home", "Skeddo - Home");
  }, []);

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
    trackEvent("view_program", { program_name: p.name, provider: p.provider || "" });
    setModal({ type: "programDetail", data: p });
  };

  const openDirectoryDetail = (p) => {
    trackEvent("view_program", { program_name: p.name, provider: p.provider || "" });
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

  const openAddCost = () => {
    setForm({ description: "", amount: "", category: "Other", kidId: kids[0]?.id || "", date: "" });
    setModal({ type: "costForm", isEdit: false });
  };

  const openEditCost = (cost) => {
    setForm({ ...cost });
    setModal({ type: "costForm", isEdit: true });
  };

  const handleSaveCost = () => {
    if (!form.description?.trim() || !form.amount) return;
    saveManualCost({ ...form, amount: Number(form.amount), id: form.id || undefined });
    setModal(null);
    showToast(form.id ? "Expense updated" : "Expense added");
  };

  const handleDeleteCost = () => {
    deleteManualCost(form.id);
    setModal(null);
    showToast("Expense deleted");
  };

  const openInviteModal = (kid) => {
    setModal({ type: "invite", data: kid });
  };

  const openChildSettings = (kid) => {
    setModal({ type: "childSettings", data: kid });
  };

  const handleInviteCoParent = () => {
    if (kids.length === 0) return;
    if (kids.length === 1) {
      openInviteModal(kids[0]);
    } else {
      // Multiple kids — show kid picker
      setModal({ type: "coparentKidPicker" });
    }
  };

  /* ── Modal actions ── */
  const handleSaveProgram = () => {
    if (!form.name?.trim()) return;
    // Gate: must assign to at least one kid
    if (kids.length > 0 && (!form.kidIds || form.kidIds.length === 0)) {
      showToast("Please assign this program to at least one child");
      return;
    }
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
        const token = session?.access_token;
        fetch("/api/notify-manual-program", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
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
            userId: userId || "",
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
    // Gate: free plan kid limit (only for new kids, not edits)
    saveKid({ ...form, name: form.name.trim(), id: form.id || uid() });
    setModal(null);
    showToast(form.id ? "Kid updated" : "Kid added");
  };

  const handleDeleteKid = (id) => {
    deleteKid(id);
    // Reset kid filter if the deleted kid was selected
    if (kidFilter === id) setKidFilter(null);
    setModal(null);
    showToast("Kid removed");
  };

  const handleAddToSchedule = (dirProgram) => {
    // Gate: must assign to at least one kid
    if (kids.length > 0 && (!dirProgram.kidIds || dirProgram.kidIds.length === 0)) {
      showToast("Please assign this program to at least one child");
      return;
    }
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
    // Send virtual page_view to GA4 so SPA tab changes appear in Pages and Screens
    trackPageView(`/${tabId}`, `Skeddo - ${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
  };

  const handleFindAlternatives = (program) => {
    setFindSimilarConfig({ category: program.category || "All", key: Date.now() });
    setStatusFilter("All");
    setTab("discover");
    trackPageView("/discover", "Skeddo - Discover");
  };

  const handleOnboardingComplete = (onboardedKids, profileData) => {
    onboardedKids.forEach((k) => saveKid(k));
    if (profileData) {
      setProfile((prev) => ({ ...prev, ...profileData }));
    }
    completeOnboarding();
  };

  // Desktop users skip the mobile-only OnboardingFlow; auto-mark as onboarded
  // so they won't hit it on mobile later either.
  useEffect(() => {
    if (loaded && !onboarded && isDesktop) {
      completeOnboarding();
    }
  }, [loaded, onboarded, isDesktop, completeOnboarding]);

  /* ── Loading state — large logo on dark background ── */
  if (!loaded) return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100dvh",
      background: C.ink,
    }}>
      <img
        src="/skeddo-logo-dark.png"
        alt="Skeddo"
        style={{ width: "60%", maxWidth: 320, height: "auto" }}
      />
    </div>
  );

  /* ── Onboarding (mobile only — desktop skips straight to the app) ── */
  if (!onboarded && !isDesktop) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} planAccess={planAccess} />;
  }

  /* ── Main App ── */
  return (
    <div style={s.app} className="skeddo-app-container">
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

      {/* Test-mode indicator for founders */}
      {planAccess.isTestMode && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 10000,
          background: planAccess.effectivePlan === "free" ? C.olive : C.seaGreen,
          color: C.white, textAlign: "center", padding: "4px 0",
          fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 700,
          letterSpacing: 0.5,
        }}>
          Testing: {planAccess.effectivePlan === "free" ? "Standard" : "Beta"}
        </div>
      )}

      <Header
        displayName={profile.displayName}
        onOpenProfile={() => setModal({ type: "profile" })}
        onOpenPage={(pageId) => setInfoPage(pageId)}
        onLogoClick={() => { setTab("home"); setInfoPage(null); }}
        onSignOut={onSignOut}
        unreadCount={childAccess.unreadCount}
        onOpenActivity={() => { childAccess.markActivityViewed(); setTab("home"); }}
        onInviteCoParent={handleInviteCoParent}
        tab={tab}
        setTab={(t) => handleNavigateToTab(t)}
        badges={{ circles: circlesHook.pendingCount }}
      />

      {/* Info pages (About, Privacy, etc.) */}
      {infoPage && (
        <InfoPage pageId={infoPage} onBack={() => setInfoPage(null)} />
      )}

      {!infoPage && isDesktop ? (
        /* ─── Desktop: sidebar + main content shell ─── */
        <div className="skeddo-desktop-shell">
          {tab !== "discover" && tab !== "home" && (
          <aside className="skeddo-sidebar" role="navigation" aria-label="Sidebar">
            <DesktopSidebar
              tab={tab}
              programs={programs}
              kids={kids}
              kidFilter={kidFilter}
              onKidFilter={setKidFilter}
              statusFilter={statusFilter}
              onStatusFilter={setStatusFilter}
              onOpenAddProgram={openAddProgram}
              budgetGoal={Number(profile.budgetGoal) || 0}
              committedCost={totalCostEnrolled}
              circlesHook={circlesHook}
            />
          </aside>
          )}
          <main className="skeddo-desktop-main skeddo-main">
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
                planAccess={planAccess}
                programs={programs}
                onInviteCoParent={handleInviteCoParent}
                profile={profile}
                circlesHook={circlesHook}
                childAccess={childAccess}
              />
            )}

            <div style={{ display: tab === "discover" ? "contents" : "none" }}>
              <DiscoverTab
                programs={programs}
                kids={kids}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                onAddToSchedule={handleAddToSchedule}
                onOpenDirectoryDetail={openDirectoryDetail}
                planAccess={planAccess}
                kidFilter={kidFilter}
                onKidFilter={setKidFilter}
                onOpenAddProgram={openAddProgram}
                circleSocialProof={circlesHook.circleSocialProof}
                findSimilar={findSimilarConfig}
              />
            </div>

            {tab === "schedule" && (
              <ScheduleTab
                programs={programs}
                kids={kids}
                kidFilter={kidFilter}
                onKidFilter={setKidFilter}
                onOpenDetail={openDetail}
                onNavigateToDiscover={() => handleNavigateToTab("discover")}
                onOpenAddProgram={openAddProgram}
                planAccess={planAccess}
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
                onSetStatus={setStatus}
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
                userId={userId}
                circlesHook={circlesHook}
                planAccess={planAccess}
                onInviteCoParent={handleInviteCoParent}
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
                manualCosts={manualCosts}
                onAddCost={openAddCost}
                onEditCost={openEditCost}
                userId={userId}
                planAccess={planAccess}
                onSaveKid={saveKid}
                onOpenDetail={openDetail}
                onFindAlternatives={handleFindAlternatives}
              />
            )}
          </main>
        </div>
      ) : !infoPage ? (
        /* ─── Mobile: original layout ─── */
        <>
          <main style={s.main} className="skeddo-main">
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
                planAccess={planAccess}
                programs={programs}
                onInviteCoParent={handleInviteCoParent}
                profile={profile}
                circlesHook={circlesHook}
                childAccess={childAccess}
              />
            )}

            <div style={{ display: tab === "discover" ? "contents" : "none" }}>
              <DiscoverTab
                programs={programs}
                kids={kids}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                onAddToSchedule={handleAddToSchedule}
                onOpenDirectoryDetail={openDirectoryDetail}
                planAccess={planAccess}
                kidFilter={kidFilter}
                onKidFilter={setKidFilter}
                onOpenAddProgram={openAddProgram}
                circleSocialProof={circlesHook.circleSocialProof}
                findSimilar={findSimilarConfig}
              />
            </div>

            {tab === "schedule" && (
              <ScheduleTab
                programs={programs}
                kids={kids}
                kidFilter={kidFilter}
                onKidFilter={setKidFilter}
                onOpenDetail={openDetail}
                onNavigateToDiscover={() => handleNavigateToTab("discover")}
                onOpenAddProgram={openAddProgram}
                planAccess={planAccess}
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
                onSetStatus={setStatus}
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
                userId={userId}
                circlesHook={circlesHook}
                planAccess={planAccess}
                onInviteCoParent={handleInviteCoParent}
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
                manualCosts={manualCosts}
                onAddCost={openAddCost}
                onEditCost={openEditCost}
                userId={userId}
                planAccess={planAccess}
                onSaveKid={saveKid}
                onOpenDetail={openDetail}
                onFindAlternatives={handleFindAlternatives}
              />
            )}
          </main>
          <TabBar tab={tab} setTab={(t) => handleNavigateToTab(t)} badges={{ circles: circlesHook.pendingCount }} />
        </>
      ) : null}

      {/* ─── MODALS ─── */}
      {modal?.type === "programDetail" && (() => {
        // Read from current programs state to avoid stale modal data
        const currentProgram = programs.find((p) => p.id === modal.data.id) || modal.data;
        return (
          <ProgramDetail
            program={currentProgram}
            kids={kids}
            onCycleStatus={() => cycleStatus(currentProgram.id)}
            onSetStatus={(status) => setStatus(currentProgram.id, status)}
            onEdit={() => openEditProgram(currentProgram)}
            onDelete={() => handleDeleteProgram(currentProgram.id)}
            onClose={() => setModal(null)}
            onSave={saveProgram}
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
          selectedKid={kidFilter ? kids.find((k) => k.id === kidFilter) : null}
          circlesHook={circlesHook}
          profile={profile}
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
          circlesHook={circlesHook}
          profile={profile}
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

      {modal?.type === "costForm" && (
        <ManualCostForm
          form={form}
          setForm={setForm}
          kids={kids}
          isEdit={modal.isEdit}
          onSave={handleSaveCost}
          onDelete={modal.isEdit ? handleDeleteCost : null}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.type === "coparentKidPicker" && (() => {
        const selected = modal.selectedKids || new Set();
        const allSelected = kids.length > 0 && selected.size === kids.length;
        const toggleKid = (kidId) => {
          const next = new Set(selected);
          if (next.has(kidId)) next.delete(kidId); else next.add(kidId);
          setModal({ ...modal, selectedKids: next });
        };
        const toggleAll = () => {
          if (allSelected) {
            setModal({ ...modal, selectedKids: new Set() });
          } else {
            setModal({ ...modal, selectedKids: new Set(kids.map((k) => k.id)) });
          }
        };
        const handleGenerate = async () => {
          const selectedKids = kids.filter((k) => selected.has(k.id));
          if (selectedKids.length === 0) return;
          try {
            // ONE API call creates ONE invite code for ALL selected kids
            const data = await childAccess.createInvite(selectedKids.map((k) => k.id));
            setModal({
              type: "coparentInviteResults",
              results: [{ kids: selectedKids, code: data.code || data.inviteUrl?.split("/").pop() }],
            });
          } catch (e) {
            showToast(e.message || "Failed to generate invite");
          }
        };
        return (
        <div className="modal-bg" style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(26,46,38,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }} onClick={() => setModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: C.cream, borderRadius: 16, padding: "24px 20px",
            maxWidth: 360, width: "100%", boxShadow: "0 12px 40px rgba(26,46,38,0.18)",
          }}>
            <h3 style={{
              fontFamily: "'Poppins', sans-serif", fontSize: 18, color: C.ink,
              marginBottom: 4,
            }}>Invite a co-parent</h3>
            <p style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 13, color: C.muted,
              marginBottom: 16, lineHeight: 1.5,
            }}>
              Select which kids' schedules to share:
            </p>
            {/* Select all */}
            <button
              onClick={toggleAll}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "none", border: "none", cursor: "pointer", width: "100%",
                padding: "8px 0", marginBottom: 4,
                fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
                color: C.muted, textAlign: "left",
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                border: `2px solid ${allSelected ? C.seaGreen : C.border}`,
                background: allSelected ? C.seaGreen : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 13, fontWeight: 700,
              }}>
                {allSelected ? "\u2713" : ""}
              </div>
              Select all
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {kids.map((k) => {
                const isChecked = selected.has(k.id);
                return (
                <button
                  key={k.id}
                  onClick={() => toggleKid(k.id)}
                  className="skeddo-card"
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: C.white, border: `1.5px solid ${isChecked ? C.seaGreen : C.border}`, borderRadius: 12,
                    padding: "12px 14px", cursor: "pointer", width: "100%",
                    fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600,
                    color: C.ink, textAlign: "left",
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                    border: `2px solid ${isChecked ? C.seaGreen : C.border}`,
                    background: isChecked ? C.seaGreen : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 13, fontWeight: 700,
                  }}>
                    {isChecked ? "\u2713" : ""}
                  </div>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: k.color || `linear-gradient(135deg, ${C.seaGreen}, ${C.blue})`,
                    color: C.cream, display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Poppins', sans-serif", fontSize: 14, flexShrink: 0,
                  }}>
                    {k.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  {k.name}
                </button>
                );
              })}
            </div>
            <button
              onClick={handleGenerate}
              disabled={selected.size === 0}
              style={{
                marginTop: 16, width: "100%", padding: "12px",
                background: selected.size === 0 ? C.muted : C.seaGreen,
                border: "none", borderRadius: 10,
                fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700,
                color: "#fff", cursor: selected.size === 0 ? "default" : "pointer",
                opacity: selected.size === 0 ? 0.5 : 1,
              }}
            >
              Generate Invite{selected.size > 1 ? "s" : ""}
            </button>
            <button
              onClick={() => setModal(null)}
              style={{
                marginTop: 8, width: "100%", padding: "10px",
                background: "none", border: `1.5px solid ${C.border}`, borderRadius: 10,
                fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
                color: C.muted, cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
        );
      })()}

      {modal?.type === "coparentInviteResults" && (() => {
        const r = modal.results[0] || {};
        const inviteKids = r.kids || [];
        const code = r.code || "";
        const url = `${window.location.origin}/invite/${code}`;
        const kidNames = inviteKids.map((k) => k.name).join(" & ");
        const shareText = `Join me on Skeddo to help manage ${kidNames}'s schedule!\n\n${url}`;
        return (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(26,46,38,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }} onClick={() => setModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: C.cream, borderRadius: 16, padding: "24px 20px",
            maxWidth: 400, width: "100%", boxShadow: "0 12px 40px rgba(26,46,38,0.18)",
          }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 18, color: C.ink, marginBottom: 4 }}>
              Invite Generated
            </h3>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: C.muted, marginBottom: 12, lineHeight: 1.5 }}>
              Share this link with your co-parent. They'll get access to {kidNames}'s schedule{inviteKids.length > 1 ? "s" : ""}.
            </p>
            {/* Kid chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {inviteKids.map((k) => (
                <span key={k.id} style={{
                  fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
                  background: (k.color || C.seaGreen) + "18", color: k.color || C.seaGreen,
                  padding: "4px 10px", borderRadius: 8,
                }}>{k.name}</span>
              ))}
            </div>
            {/* Invite link */}
            <div style={{
              background: C.white, borderRadius: 12, padding: "12px 14px",
              marginBottom: 14, border: `1.5px solid ${C.border}`,
            }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  readOnly value={url}
                  style={{
                    flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 13,
                    border: `1px solid ${C.border}`, borderRadius: 8,
                    padding: "8px 10px", color: C.ink, background: C.cream,
                  }}
                  onFocus={(e) => e.target.select()}
                />
                <button
                  onClick={() => {
                    if (navigator.clipboard) navigator.clipboard.writeText(url);
                    showToast("Link copied!");
                  }}
                  style={{
                    padding: "8px 12px", borderRadius: 8, border: "none",
                    background: C.seaGreen, color: "#fff",
                    fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >Copy</button>
              </div>
            </div>
            {/* Share button — uses native share sheet or falls back to copy */}
            <button
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({ title: "Join me on Skeddo", text: shareText, url });
                  } catch (e) { /* user cancelled */ }
                } else {
                  if (navigator.clipboard) navigator.clipboard.writeText(url);
                  showToast("Link copied!");
                }
              }}
              style={{
                width: "100%", padding: "12px", borderRadius: 10,
                border: `1.5px solid ${C.blue}`, background: C.white,
                fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700,
                color: C.blue, cursor: "pointer", minHeight: 44, marginBottom: 14,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Share Invite
            </button>
            <button
              onClick={() => setModal(null)}
              style={{
                width: "100%", padding: "12px",
                background: C.seaGreen, border: "none", borderRadius: 10,
                fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700,
                color: "#fff", cursor: "pointer",
              }}
            >Done</button>
          </div>
        </div>
        );
      })()}

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
          circlesHook={circlesHook}
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
          planAccess={planAccess}
          session={session}
          kids={kids}
          onEditKid={openEditKid}
          onDeleteKid={deleteKid}
          onAddKid={openAddKid}
        />
      )}

      {/* ── Exit confirmation dialog ── */}
      {showExitConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-dialog-title"
          style={{
            position: "fixed", inset: 0,
            background: "rgba(27,36,50,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24, zIndex: 9999,
            animation: "fadeBg 0.15s ease",
          }}
          onClick={handleCancelExit}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: C.cream, borderRadius: 20, padding: "32px 24px",
              maxWidth: 320, width: "100%", textAlign: "center",
              boxShadow: "0 16px 48px rgba(27,36,50,0.22)",
              animation: "slideIn 0.2s cubic-bezier(0.22, 0.61, 0.36, 1)",
            }}
          >
            <div
              id="exit-dialog-title"
              style={{
                fontFamily: "'Instrument Serif', 'Poppins', serif",
                fontSize: 24, color: C.ink, marginBottom: 10, lineHeight: 1.2,
              }}
            >
              Leave Skeddo?
            </div>
            <p style={{
              fontFamily: "'Barlow', sans-serif", fontSize: 15,
              color: C.muted, lineHeight: 1.5, marginBottom: 28,
            }}>
              Your current filters and view will be lost.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleCancelExit}
                autoFocus
                style={{
                  flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 15,
                  fontWeight: 700, border: `1.5px solid ${C.border}`,
                  borderRadius: 10, padding: "13px 0", cursor: "pointer",
                  background: C.white, color: C.ink, minHeight: 48,
                }}
              >
                Stay
              </button>
              <button
                onClick={handleConfirmExit}
                style={{
                  flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 15,
                  fontWeight: 700, border: "none", borderRadius: 10,
                  padding: "13px 0", cursor: "pointer",
                  background: C.seaGreen, color: "#fff", minHeight: 48,
                }}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 90,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.ink,
            color: C.cream,
            fontFamily: "'Barlow', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            padding: "12px 20px",
            borderRadius: 10,
            boxShadow: "0 4px 16px rgba(27,36,50,0.2)",
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
