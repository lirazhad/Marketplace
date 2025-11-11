import React, { createContext, useContext, useRef, ReactNode, useCallback, useState } from 'react';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
} from '@gorhom/bottom-sheet';
import { View, StyleSheet } from 'react-native';

interface GlobalBottomSheetContextType {
  showBottomSheet: (content: ReactNode, snapPoints?: string[]) => void;
  hideBottomSheet: () => void;
  isVisible: boolean;
}

const GlobalBottomSheetContext = createContext<GlobalBottomSheetContextType>({
  showBottomSheet: () => {},
  hideBottomSheet: () => {},
  isVisible: false,
});

export const useGlobalBottomSheet = () => {
  const context = useContext(GlobalBottomSheetContext);
  if (!context) {
    throw new Error('useGlobalBottomSheet must be used within GlobalBottomSheetProvider');
  }
  return context;
};

interface GlobalBottomSheetProviderProps {
  children: ReactNode;
}

export const GlobalBottomSheetProvider: React.FC<GlobalBottomSheetProviderProps> = ({ children }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  const [content, setContent] = useState<ReactNode>(null);
  const [snapPoints, setSnapPoints] = useState<string[]>(['50%']);
  const [isVisible, setIsVisible] = useState(false);
  
  const showBottomSheet = useCallback((newContent: ReactNode, newSnapPoints: string[] = ['50%']) => {

    setContent(newContent);

    setSnapPoints(newSnapPoints);
    
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);
  
  const hideBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsVisible(false);
    setTimeout(() => setContent(null), 300);
  }, []);

  const renderBackground = useCallback(
    (props: BottomSheetBackgroundProps) => (
      <View
        {...props}
        style={[
          props.style,
          styles.background,
        ]}
      />
    ),
    []
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        onPress={hideBottomSheet}
      />
    ),
    [hideBottomSheet]
  );

  
  return (
    <GlobalBottomSheetContext.Provider
      value={{
        showBottomSheet,
        hideBottomSheet,
        isVisible,
      }}
    >
      <View style={styles.container}>
        {children}
        
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          enableOverDrag={false}
          onClose={hideBottomSheet}
          index={isVisible ? 0 : -1}
          backdropComponent={renderBackdrop}
          backgroundComponent={renderBackground}
        >
          <BottomSheetView
            style={[
              styles.sheetContainer,
            ]}
          >
            {content}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GlobalBottomSheetContext.Provider>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sheetContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  handle: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  background: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  indicator: {
    width: "20%",
    height: 3,
  },
});