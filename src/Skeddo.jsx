import { useState, useEffect } from "react";
import { C } from "./constants/brand";
import { uid } from "./constants/sampleData";
import { s } from "./styles/shared";
import { useAppData, fmt$ } from "./hooks/useAppData";
import { useAuth } from "./hooks/useAuth";

import Header from "./components/Header";
import TabBar from "./components/TabBar";
import HomeTab from "./tabs/HomeTab";
import DiscoverTab from "./tabs/DiscoverTab";
import ScheduleTab from "./tabs/ScheduleTab";
import ProgramsTab from "./tabs/ProgramsTab";
import BudgetTab from "./tabs/BudgetTab";
import ProgramDetail from "./modals/ProgramDetail";
import DirectoryDetail from "./modals/DirectoryDetail";
import ProgramForm from "./modals/ProgramForm";
import KidForm from "./modals/KidForm";
import ProfileModal from "./modals/ProfileModal";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ComingSoonPage from "./pages/ComingSoonPage";

/* Check for ?preview=true to bypass the Coming Soon page */
const isPreview = new URLSearchParams(window.location.search).get("preview") === "true";

export default function Skeddo() {
  const { user, loading: authLoading, signOut } = useAuth();
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
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@400;500;600;700;800&display=swap');
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
  return <SkedDoApp onSignOut={signOut} userEmail={user?.email} />;
}


/* ── The existing app, extracted into its own component ── */
function SkedDoApp({ onSignOut, userEmail }) {
  const data = useAppData();
  const {
    programs, kids, loaded, tab, setTab, onboarded, completeOnboarding,
    statusFilter, setStatusFilter, catFilter, setCatFilter,
    enrolledPrograms, waitlistPrograms, exploringPrograms,
    totalCostEnrolled, totalCostAll, filteredPrograms,
    saveProgram, deleteProgram, cycleStatus, saveKid, deleteKid,
    favorites, toggleFavorite, isFavorite,
    profile, setProfile,
  } = data;

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

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

  /* ── Modal actions ── */
  const handleSaveProgram = () => {
    if (!form.name?.trim()) return;
    saveProgram({
      ...form,
      name: form.name.trim(),
      cost: Number(form.cost) || 0,
      kidIds: form.kidIds || [],
      id: form.id || uid(),
    });
    setModal(null);
  };

  const handleDeleteProgram = (id) => {
    deleteProgram(id);
    setModal(null);
  };

  const handleSaveKid = () => {
    if (!form.name?.trim()) return;
    saveKid({ ...form, name: form.name.trim(), id: form.id || uid() });
    setModal(null);
  };

  const handleDeleteKid = (id) => {
    deleteKid(id);
    setModal(null);
  };

  const handleAddToSchedule = (dirProgram) => {
    saveProgram({
      id: uid(),
      name: dirProgram.name,
      provider: dirProgram.provider || "",
      category: dirProgram.category || "Sports",
      status: dirProgram.status || "Exploring",
      cost: Number(dirProgram.cost) || 0,
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
  };

  const handleNavigateToTab = (tabId, statusFilterVal) => {
    setTab(tabId);
    if (statusFilterVal) setStatusFilter(statusFilterVal);
    else { setStatusFilter("All"); setCatFilter("All"); }
  };

  const handleOnboardingComplete = (onboardedKids) => {
    onboardedKids.forEach((k) => saveKid(k));
    completeOnboarding();
  };

  /* ── Loading state ── */
  if (!loaded) return (
    <div style={{ ...s.app, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ ...s.logoMark, fontSize: 32, marginBottom: 12, color: C.ink }}>
          sked<em style={{ color: C.olive }}>do</em>
        </div>
        <div style={{ color: C.muted, fontSize: 13, fontFamily: "'Barlow', sans-serif", fontWeight: 600 }}>
          Loading your summer...
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
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@400;500;600;700;800&display=swap');
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
        .status-chip:active { transform: scale(0.95); }
        .del-btn:hover { background: ${C.danger} !important; color: white !important; }
        .progress-bar { transition: width 0.6s cubic-bezier(0.22, 0.61, 0.36, 1); }
      `}</style>

      <Header
        displayName={profile.displayName}
        onOpenProfile={() => setModal({ type: "profile" })}
      />

      <main style={s.main}>
        {tab === "home" && (
          <HomeTab
            enrolledPrograms={enrolledPrograms}
            waitlistPrograms={waitlistPrograms}
            exploringPrograms={exploringPrograms}
            totalCostEnrolled={totalCostEnrolled}
            kids={kids}
            fmt$={fmt$}
            onOpenDetail={openDetail}
            onCycleStatus={cycleStatus}
            onNavigateToTab={handleNavigateToTab}
            onOpenAddProgram={openAddProgram}
            onOpenAddKid={openAddKid}
            onEditKid={openEditKid}
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
            onOpenDetail={openDetail}
          />
        )}

        {tab === "programs" && (
          <ProgramsTab
            filteredPrograms={filteredPrograms}
            statusFilter={statusFilter}
            catFilter={catFilter}
            kids={kids}
            onStatusFilter={setStatusFilter}
            onCatFilter={setCatFilter}
            onOpenDetail={openDetail}
            onCycleStatus={cycleStatus}
            onOpenAddProgram={openAddProgram}
          />
        )}

        {tab === "budget" && (
          <BudgetTab
            programs={programs}
            kids={kids}
            enrolledPrograms={enrolledPrograms}
            waitlistPrograms={waitlistPrograms}
            exploringPrograms={exploringPrograms}
            totalCostEnrolled={totalCostEnrolled}
            totalCostAll={totalCostAll}
            fmt$={fmt$}
          />
        )}
      </main>

      <TabBar tab={tab} setTab={(t) => handleNavigateToTab(t)} />

      {/* ─── MODALS ─── */}
      {modal?.type === "programDetail" && (
        <ProgramDetail
          program={modal.data}
          kids={kids}
          onCycleStatus={() => {
            cycleStatus(modal.data.id);
            const order = ["Enrolled", "Waitlist", "Exploring"];
            const idx = order.indexOf(modal.data.status);
            setModal({ ...modal, data: { ...modal.data, status: order[(idx + 1) % 3] } });
          }}
          onEdit={() => openEditProgram(modal.data)}
          onDelete={() => handleDeleteProgram(modal.data.id)}
          onClose={() => setModal(null)}
          fmt$={fmt$}
        />
      )}

      {modal?.type === "directoryDetail" && (
        <DirectoryDetail
          program={modal.data}
          userPrograms={programs}
          kids={kids}
          onAddToSchedule={handleAddToSchedule}
          onClose={() => setModal(null)}
          fmt$={fmt$}
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
        />
      )}

      {modal?.type === "profile" && (
        <ProfileModal
          profile={profile}
          setProfile={setProfile}
          email={userEmail}
          onSignOut={onSignOut}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
