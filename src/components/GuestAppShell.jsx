import { useState, useEffect, useCallback, Suspense } from "react";
import { C } from "../constants/brand";
import { s } from "../styles/shared";
import Header from "./Header";
import TabBar from "./TabBar";
import GuestTabPreview from "./GuestTabPreview";
import useIsDesktop from "../hooks/useIsDesktop";
import lazyWithReload from "../utils/lazyWithReload";
import { trackEvent } from "../utils/analytics";

const DiscoverTab = lazyWithReload(() => import("../tabs/DiscoverTab"));
const DirectoryDetail = lazyWithReload(() => import("../modals/DirectoryDetail"));

const VALID_TABS = new Set(["discover", "schedule", "programs", "circles", "budget"]);
const GATED_TABS = new Set(["schedule", "programs", "circles", "budget"]);

/**
 * GuestAppShell — renders the real app interface for unauthenticated users.
 * Search tab works fully; other tabs show sample previews with signup CTAs.
 */
export default function GuestAppShell({ onNavigate }) {
  const isDesktop = useIsDesktop();
  const [modal, setModal] = useState(null);

  // Tab routing — default to "discover" (Search) for guests
  const hashTab = window.location.hash.replace("#", "");
  const [tab, setTabRaw] = useState(VALID_TABS.has(hashTab) ? hashTab : "discover");

  const setTab = useCallback((newTab) => {
    setTabRaw(newTab);
    history.replaceState(null, "", "#" + newTab);
  }, []);

  useEffect(() => {
    // Set initial hash if none
    if (!window.location.hash) {
      history.replaceState(null, "", "#discover");
    }
    const onHash = () => {
      const h = window.location.hash.replace("#", "");
      if (VALID_TABS.has(h)) setTabRaw(h);
      else if (!h) setTabRaw("discover");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const handleSignUp = () => onNavigate("signup");
  const handleSignIn = () => onNavigate("signin");

  const openDirectoryDetail = useCallback((p) => {
    trackEvent("view_program", { program_name: p.name, provider: p.provider || "" });
    setModal({ type: "directoryDetail", data: p });
  }, []);

  const renderTabContent = () => {
    if (tab === "discover") {
      return (
        <div style={{ display: "contents" }}>
          <Suspense fallback={null}>
            <DiscoverTab
              programs={[]}
              kids={[]}
              favorites={[]}
              toggleFavorite={() => {}}
              isFavorite={() => false}
              onAddToSchedule={handleSignUp}
              onOpenDirectoryDetail={openDirectoryDetail}
              planAccess={{ effectivePlan: "free", isTestMode: false, canUse: () => true }}
              kidFilter={null}
              onKidFilter={() => {}}
              onOpenAddProgram={handleSignUp}
              circleSocialProof={{}}
              findSimilar={null}
              isGuest={true}
              onGuestSignUp={handleSignUp}
            />
          </Suspense>
        </div>
      );
    }

    if (GATED_TABS.has(tab)) {
      return <GuestTabPreview tabId={tab} onSignUp={handleSignUp} />;
    }

    return null;
  };

  return (
    <div style={s.app} className="skeddo-app-container">
      <Header
        isGuest={true}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onLogoClick={() => setTab("discover")}
        tab={tab}
        setTab={setTab}
        badges={{}}
      />

      <Suspense fallback={null}>
        {isDesktop ? (
          <div className="skeddo-desktop-shell">
            <main className="skeddo-desktop-main skeddo-main">
              {renderTabContent()}
            </main>
          </div>
        ) : (
          <>
            <main style={s.main} className="skeddo-main">
              {renderTabContent()}
            </main>
            <TabBar tab={tab} setTab={setTab} badges={{}} />
          </>
        )}
      </Suspense>

      {modal?.type === "directoryDetail" && (
        <Suspense fallback={null}>
          <DirectoryDetail
            program={modal.data}
            userPrograms={[]}
            kids={[]}
            onAddToSchedule={handleSignUp}
            onClose={() => setModal(null)}
            selectedKid={null}
            circlesHook={null}
            profile={null}
          />
        </Suspense>
      )}
    </div>
  );
}
