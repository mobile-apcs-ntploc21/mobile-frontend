import { Platform, ToastAndroid } from 'react-native';

export function showAlert(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  } else {
    alert(message);
  }
}

import MyText from '@/components/MyText';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { Animated, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

const Notification = ({
  message,
  duration = 3000,
  isVisible = false
}: {
  message: string;
  duration?: number;
  isVisible?: boolean;
}) => {
  const visible = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      progress.setValue(0);
      Animated.timing(visible, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(visible, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }).start();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(visible, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start();

      return () => {};
    }
  }, [isVisible]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true
    }).start();
  }, [isVisible, duration]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: visible,
          transform: [
            {
              translateY: visible.interpolate({
                inputRange: [0, 1],
                outputRange: [500, -30] // Adjust the right value to move the notification up
              })
            }
          ]
        }
      ]}
    >
      <MyText style={styles.textStyles}>{message}</MyText>
      <Animated.View
        style={[
          styles.progressBar,
          {
            transform: [{ scaleX: progress }]
          }
        ]}
      />
    </Animated.View>
  );
};

const NotificationContext = createContext({
  showAlert: (message: string, duration?: number) => {}
});

export const NotificationProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [notification, setNotification] = useState({
    message: '',
    isVisible: false,
    duration: 3000
  });

  const showAlert = useCallback((message: any, duration = 3000) => {
    setNotification({ message, isVisible: true, duration });

    // Hide notification after duration
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }));
    }, duration);
  }, []);

  return (
    <NotificationContext.Provider value={{ showAlert }}>
      {children}
      <Notification {...notification} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'column',

    padding: 6,
    paddingLeft: 16,
    paddingRight: 16,
    position: 'absolute',
    alignContent: 'center',
    alignSelf: 'center',

    bottom: 0,

    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    zIndex: 9999
  },
  textStyles: {
    fontSize: 16
  },
  progressBar: {
    height: 2,
    bottom: -1,
    backgroundColor: colors.primary
  }
});
