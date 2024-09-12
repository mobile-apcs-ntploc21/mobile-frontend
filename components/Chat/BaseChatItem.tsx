import { Image, StyleSheet, Text, View } from 'react-native';
import React, { ReactNode } from 'react';
import { Message } from '@/types/chat';
import MyText from '../MyText';
import { colors } from '@/constants/theme';
import { TextStyles } from '@/styles/TextStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface ChatItemProps {
  message: Message;
  onLongPress?: () => void;
  displayedContents: ReactNode[];
}

const BaseChatItem = (props: ChatItemProps) => {
  const convertTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <TouchableOpacity style={styles.container} onLongPress={props.onLongPress}>
      <View style={styles.messageContainer}>
        <Image
          source={{ uri: props.message.author.avatar_url }}
          style={styles.avatarImg}
        />
        <View style={styles.innerContainer}>
          <View style={styles.messageHeader}>
            <MyText style={styles.displayName}>
              {props.message.author.display_name}
            </MyText>
            <MyText style={styles.timestamp}>
              {convertTimestamp(props.message.createdAt)}
            </MyText>
          </View>
          <View style={styles.messageContent}>
            <MyText style={styles.message}>
              {props.displayedContents.map((content, index) => (
                <React.Fragment key={index}>{content}</React.Fragment>
              ))}
              {props.message.is_modified && (
                <Text style={styles.editedText}> (edited)</Text>
              )}
            </MyText>
          </View>
          <View style={styles.reactionsContainer}></View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BaseChatItem;

const styles = StyleSheet.create({
  container: {},
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 8
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray03
  },
  innerContainer: {
    flex: 1,
    gap: 4
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  displayName: {
    ...TextStyles.h3
  },
  timestamp: {
    ...TextStyles.bodyM,
    color: colors.gray02
  },
  messageContent: {},
  message: {
    ...TextStyles.bodyL
  },
  editedText: {
    ...TextStyles.bodyS,
    color: colors.gray02
  },
  reactionsContainer: {}
});
