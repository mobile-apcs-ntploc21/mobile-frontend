import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import BaseChatInput, { BaseChatInputProps } from './BaseChatInput';
import useServer from '@/hooks/useServer';
import { ServerProfile } from '@/types';
import { Channel, Emoji, Role } from '@/types/server';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { DefaultProfileImage } from '@/constants/images';
import { TextStyles } from '@/styles/TextStyles';
import MyText from '../MyText';
import { colors, fonts } from '@/constants/theme';
import { handleError } from '@apollo/client/link/http/parseAndCheckHttpResponse';
import IconWithSize from '../IconWithSize';
import CrossIcon from '@/assets/icons/CrossIcon';

const MemberSuggestion = ({ member }: { member: ServerProfile }) => {
  return (
    <View style={styles.suggestionContainer}>
      <Image
        source={
          member.avatar_url ? { uri: member.avatar_url } : DefaultProfileImage
        }
        style={styles.avatarImg}
      />
      <View style={styles.suggestionTextContainer}>
        <MyText style={styles.suggestionText}>{member.display_name}</MyText>
        <MyText style={styles.suggestionSubText}>@{member.username}</MyText>
      </View>
    </View>
  );
};

const RoleSuggestion = ({ role }: { role: Role }) => {
  return (
    <View style={styles.suggestionContainer}>
      <View style={styles.suggestionTextContainer}>
        <MyText style={styles.suggestionText}>
          @{role.default ? 'everyone' : role.name}
        </MyText>
        <MyText style={styles.suggestionSubText}>
          {role.default
            ? 'Mention every user in this server'
            : 'Mention users with this role'}
        </MyText>
      </View>
    </View>
  );
};

const ChannelSuggestion = ({ channel }: { channel: Channel }) => {
  return (
    <View style={styles.suggestionContainer}>
      <MyText style={styles.suggestionText}>#{channel.name}</MyText>
    </View>
  );
};

const EmojiSuggestion = ({ emoji }: { emoji: Emoji }) => {
  return (
    <View style={styles.suggestionContainer}>
      <Image source={{ uri: emoji.image_url }} style={styles.emojiImg} />
      <MyText style={styles.suggestionText}>:{emoji.name}:</MyText>
    </View>
  );
};

interface ServerChatInputProps
  extends Omit<BaseChatInputProps, 'mentions' | 'emojis' | 'channels'> {
  mode:
    | {
        type: 'edit';
      }
    | {
        type: 'reply';
        replyTo: string;
      }
    | null;
  onCancelMode?: () => void;
}

const ServerChatInput = (props: ServerChatInputProps) => {
  const { emojis, members, roles, categories } = useServer();
  const channels = useMemo(() => {
    return categories.map((category) => category.channels).flat();
  }, [categories]);

  const [lastWord, setLastWord] = React.useState<string | null>(null);

  useEffect(() => {
    if (!props.value) {
      setLastWord(null);
      return;
    }
    const lastWord = props.value.split(' ').pop();
    if (lastWord === undefined) {
      setLastWord(null);
      return;
    }
    if (
      lastWord.startsWith('@') ||
      lastWord.startsWith('#') ||
      lastWord.startsWith(':')
    ) {
      setLastWord(lastWord);
    } else {
      setLastWord(null);
    }
  }, [props.value]);

  const suggestions = useMemo(() => {
    if (!lastWord) return [];
    const suggestionList: {
      name: string;
      subname?: string;
      component: React.ReactNode;
    }[] = [
      ...members.map((member) => ({
        name: `@${member.username}`,
        subname: `@${member.display_name}`,
        component: <MemberSuggestion member={member} />
      })),
      ...roles.map((role) => ({
        name: `@${role.default ? 'everyone' : role.name}`,
        component: <RoleSuggestion role={role} />
      })),
      ...channels.map((channel) => ({
        name: `#${channel.name}`,
        component: <ChannelSuggestion channel={channel} />
      })),
      ...emojis.map((emoji) => ({
        name: `:${emoji.name}:`,
        component: <EmojiSuggestion emoji={emoji} />
      }))
    ];
    return suggestionList.filter(
      (suggestion) =>
        suggestion.name
          .toLocaleLowerCase()
          .startsWith(lastWord.toLocaleLowerCase()) ||
        suggestion.subname
          ?.toLocaleLowerCase()
          .startsWith(lastWord.toLocaleLowerCase())
    );
  }, [lastWord, members, channels, emojis]);

  const handleSuggestionPress = (suggestion: string) => {
    if (!lastWord) return;
    if (!props.value) return;
    const newText = props.value
      .split(' ')
      .slice(0, -1)
      .join(' ')
      .concat(` ${suggestion} `);
    props.onChange?.(newText);
  };

  return (
    <View>
      <FlatList
        keyboardShouldPersistTaps="always"
        data={suggestions}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSuggestionPress(item.name)}>
            {item.component}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name}
        style={styles.suggestionsList}
      />
      {props.mode && (
        <View style={styles.modeContainer}>
          {props.mode.type === 'edit' ? (
            <MyText style={styles.modeText}>Editing</MyText>
          ) : (
            <Text>
              <MyText style={styles.modeText}>Replying to </MyText>
              <MyText style={{ fontFamily: fonts.bold }}>
                {props.mode.replyTo}
              </MyText>
            </Text>
          )}
          <TouchableOpacity onPress={props.onCancelMode}>
            <IconWithSize icon={CrossIcon} size={16} />
          </TouchableOpacity>
        </View>
      )}
      <BaseChatInput
        {...props}
        // mentions both members and roles
        mentions={[
          ...members.map((member) => member.username),
          ...roles.map((role) => (role.default ? 'everyone' : role.name))
        ]}
        emojis={emojis.map((emoji) => emoji.name)}
        channels={channels.map((channel) => channel.name)}
      />
    </View>
  );
};

export default ServerChatInput;

const styles = StyleSheet.create({
  suggestionsList: {
    maxHeight: 176
  },
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
    backgroundColor: colors.gray04
  },
  avatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  emojiImg: {
    width: 24,
    height: 24
  },
  suggestionTextContainer: {
    flexDirection: 'column',
    gap: 4
  },
  suggestionText: {
    fontSize: 12,
    fontFamily: fonts.bold
  },
  suggestionSubText: {
    fontSize: 10,
    color: colors.gray02
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: colors.gray04
  },
  modeText: {
    fontSize: 12
  }
});
