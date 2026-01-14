import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const BreadcrumbVisibilityContext = createContext({
  isHidden: false,
  hideBreadcrumbs: () => {},
  showBreadcrumbs: () => {},
});

export const BreadcrumbVisibilityProvider = ({ children }) => {
  const [hiddenRequests, setHiddenRequests] = useState(0);

  const hideBreadcrumbs = useCallback(() => {
    setHiddenRequests((prev) => prev + 1);
  }, []);

  const showBreadcrumbs = useCallback(() => {
    setHiddenRequests((prev) => Math.max(prev - 1, 0));
  }, []);

  const value = useMemo(
    () => ({
      isHidden: hiddenRequests > 0,
      hideBreadcrumbs,
      showBreadcrumbs,
    }),
    [hiddenRequests, hideBreadcrumbs, showBreadcrumbs],
  );

  return (
    <BreadcrumbVisibilityContext.Provider value={value}>
      {children}
    </BreadcrumbVisibilityContext.Provider>
  );
};

export const useBreadcrumbVisibility = () => useContext(BreadcrumbVisibilityContext);

export const useHideLayoutBreadcrumbs = (active = true) => {
  const { hideBreadcrumbs, showBreadcrumbs } = useBreadcrumbVisibility();
  useEffect(() => {
    if (!active) return;
    hideBreadcrumbs();
    return () => {
      showBreadcrumbs();
    };
  }, [active, hideBreadcrumbs, showBreadcrumbs]);
};
