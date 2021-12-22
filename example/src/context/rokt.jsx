import React, {
  createContext, useContext, useMemo,
} from 'react';

export const RoktContext = createContext();
export const RoktContextConsumer = RoktContext.Consumer;

export function useRokt() {
  return useContext(RoktContext);
}

export function RoktContextProvider({
  children,
  tagId,
  sandbox = false,
  windowRef = window,
}) {
  const roktWrapper = useMemo(() => {
    const roktLoaded = new Promise((resolve) => {
      windowRef._ROKT_ = 'rokt';
      windowRef.rokt = {
        id: tagId,
        lc: [
          (rokt) =>
              rokt.init({
                skipInitialSelection: true,
                sandbox,
              }),
          (rokt) => resolve(rokt),
        ],
        it: new Date(),
      };

      const target = windowRef.document.head || windowRef.document.body;
      const script = windowRef.document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://apps.rokt.com/wsdk/integrations/snippet.js';
      script.crossOrigin = 'anonymous';
      script.async = true;
      target.appendChild(script);
    });

    function setAttributes(attributes) {
      roktLoaded.then((rokt) => {
        rokt.setAttributes(attributes);
      });
    }

    function triggerPageChange(pageIdentifier) {
      roktLoaded.then((rokt) => {
        rokt.triggerPageChange({
          pageIdentifier,
        });
      });
    }

    function closeAll() {
      roktLoaded.then((rokt) => {
        rokt.closeAll();
      });
    }

    return {
      setAttributes, triggerPageChange, closeAll,
    };
  }, [tagId, sandbox]);

  return (
    <RoktContext.Provider value={roktWrapper}>
      {children}
    </RoktContext.Provider>
  );
}
