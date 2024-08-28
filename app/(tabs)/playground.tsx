import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import { colors, fonts } from '@/constants/theme';
import MyText from '@/components/MyText';
import { TextStyles } from '@/styles/TextStyles';
import { MyButtonBase, MyButtonText } from '@/components/MyButton';
import Accordion from '@/components/Accordion';
import Toggle from '@/components/Toggle';
import MyButtonIcon from '@/components/MyButton/MyButtonIcon';
import FriendIcon from '@/assets/icons/FriendIcon';
import MessageIcon from '@/assets/icons/MessageIcon';
import AddFriendIcon from '@/assets/icons/AddFriendIcon';
import DotsIcon from '@/assets/icons/DotsIcon';
import EditProfileIcon from '@/assets/icons/EditProfileIcon';
import EditStatusIcon from '@/assets/icons/EditStatusIcon';
import GroupIcon from '@/assets/icons/GroupIcon';
import SettingIcon from '@/assets/icons/SettingIcon';
import StarIcon from '@/assets/icons/StarIcon';
import MyButtonPress from '@/components/MyButton/MyButtonPress';
import TickIcon from '@/assets/icons/TickIcon';
import CrossIcon from '@/assets/icons/CrossIcon';
import { useAuth } from '@/context/AuthProvider';
import MyButtonTextIcon from '@/components/MyButton/MyButtonTextIcon';
import UserItemGeneral from '@/components/UserItem/UserItemGeneral';
import UserItemReqSent from '@/components/UserItem/UserItemReqSent';
import UserItemReqReceived from '@/components/UserItem/UserItemReqReceived';
import { StatusType } from '@/types/user_status';
import ButtonListBase from '@/components/ButtonList/ButtonListBase';
import ButtonListText from '@/components/ButtonList/ButtonListText';
import ButtonListRadio from '@/components/ButtonList/ButtonListRadio';
import { router } from 'expo-router';
import AddEmojiIcon from '@/assets/icons/AddEmojiIcon';
import ToggleItem3 from '@/components/Toggles/ToggleItem3';

const Playground = () => {
  const [selected, setSelected] = useState<string>();
  const handleValueChange = React.useCallback((value: string) => {
    setSelected(value);
  }, []);
  const { logout } = useAuth();

  return (
    <ScrollView>
      <View style={{
        borderRadius: 999,
        backgroundColor: colors.white,
        padding: 12,
      }}>
        <ToggleItem3 text="hello"/>
      </View>
      <MyButtonText
        title="Blocked List"
        onPress={() => router.navigate('/blocked')}
      />
      <TouchableOpacity onPress={() => router.navigate('/subPlayground')}>
        <MyText>Go to subplayground</MyText>
      </TouchableOpacity>
      <View style={{ padding: 16 }}>
        <ButtonListText
          heading="Lorem ipsum"
          items={Array.from({ length: 5 }, (_, index) => ({
            text: `Item ${index}`,
            onPress: () => console.log(`Item ${index} pressed`)
          }))}
        />
        <ButtonListRadio
          heading="Lorem ipsum"
          items={Array.from({ length: 5 }, (_, index) => ({
            value: `item-${index}`,
            label: `Item ${index}`
          }))}
          value={selected}
          onChange={handleValueChange}
        />
        <MyText>Selected value: {selected}</MyText>
      </View>
      <UserItemGeneral
        id="669340c737c91b8d1fbc98ce"
        username="johndoe"
        displayName="Subcription user status"
        showStatus
        subscribeToStatus
      />
      <UserItemGeneral
        id="123"
        username="johndoe"
        displayName="John Doe 1"
        showStatus
        onlineStatus={StatusType.ONLINE}
      />
      <UserItemGeneral
        id="123"
        username="johndoe"
        displayName="John Doe 1"
        showStatus
        onlineStatus={StatusType.IDLE}
      />
      <UserItemGeneral
        id="123"
        username="johndoe"
        displayName="John Doe 1"
        showStatus
        onlineStatus={StatusType.DO_NOT_DISTURB}
      />
      <UserItemGeneral
        id="123"
        username="johndoe"
        displayName="John Doe 1"
        showStatus
        onlineStatus={StatusType.INVISIBLE}
      />
      <UserItemReqSent id="123" username="johndoe" displayName="John Doe" />
      <UserItemReqReceived id="123" username="johndoe" displayName="John Doe" />
      <Accordion heading="(3) Requests Received">
        {Array.from({ length: 3 }, (_, index) => (
          <UserItemReqReceived
            key={index}
            id={index.toString()}
            username="johndoe"
            displayName="John Doe"
          />
        ))}
      </Accordion>
      <MyText style={TextStyles.h1}>Heading 1</MyText>
      <MyText style={TextStyles.h2}>Heading 2</MyText>
      <MyText style={TextStyles.h3}>Heading 3</MyText>
      <MyText style={TextStyles.bodyXL}>Body XL</MyText>
      <MyText>Body L</MyText>

      <MyButtonText title="Logout" onPress={() => logout()} />

      <MyButtonText
        title="Default"
        onPress={() => console.log('Default')}
        style={{ alignSelf: 'center' }}
      />
      <MyButtonText
        title="Reverse Style"
        onPress={() => console.log('Reverse Style')}
        style={{ alignSelf: 'center' }}
        reverseStyle
      />
      <MyButtonText
        title="Custom button"
        onPress={() => console.log('Custom button')}
        containerStyle={{ width: '90%', height: 100, borderRadius: 10 }}
        backgroundColor="plum"
        textStyle={TextStyles.h1}
      />
      <MyButtonTextIcon
        title="Button"
        onPress={() => console.log('Button with icon')}
        iconBefore={FriendIcon}
      />
      <View
        style={{
          flexDirection: 'row',
          columnGap: 10,
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <MyButtonIcon icon={FriendIcon} />
        <MyButtonIcon
          icon={MessageIcon}
          containerStyle={{
            width: 26,
            height: 26,
            padding: 4
          }}
        />
        <MyButtonIcon icon={AddFriendIcon} />
        <MyButtonIcon icon={DotsIcon} />
        <MyButtonIcon icon={EditProfileIcon} />
        <MyButtonIcon icon={EditStatusIcon} />
        <MyButtonIcon icon={GroupIcon} />
        <MyButtonIcon icon={SettingIcon} />
        <MyButtonIcon icon={StarIcon} />
        <MyButtonIcon icon={AddEmojiIcon} />
        <MyButtonPress
          comp={(props) => (
            <MyButtonIcon
              {...props}
              activeOpacity={1}
              icon={TickIcon}
              backgroundColor={colors.white}
              textColor={colors.semantic_green}
            />
          )}
        />
        <MyButtonPress
          comp={(props) => (
            <MyButtonIcon
              {...props}
              activeOpacity={1}
              icon={CrossIcon}
              backgroundColor={colors.white}
              textColor="red"
            />
          )}
        />
      </View>
      <Accordion heading="Heading" defaultOpen>
        <View style={{ rowGap: 10 }}>
          {Array.from({ length: 20 }, (_, index) => (
            <View
              key={index}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <View
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 45 / 2,
                  backgroundColor: colors.gray01
                }}
              />
              <MyText>User {index}</MyText>
            </View>
          ))}
        </View>
      </Accordion>
      <Toggle
        FirstFC={({ isSelected }) => (
          <MyText
            style={{
              color: isSelected ? colors.primary : colors.white
            }}
          >
            Default
          </MyText>
        )}
        SecondFC={({ isSelected }) => (
          <MyText
            style={{
              color: isSelected ? colors.primary : colors.white
            }}
          >
            Toggle
          </MyText>
        )}
      />
      <Toggle
        backgroundColor="plum"
        FirstFC={({ isSelected }) => (
          <MyText
            style={{
              color: isSelected ? 'blue' : colors.white
            }}
          >
            Custom
          </MyText>
        )}
        SecondFC={({ isSelected }) => (
          <MyText
            style={{
              color: isSelected ? 'blue' : colors.white
            }}
          >
            Toggle
          </MyText>
        )}
      />
    </ScrollView>
  );
};

export default Playground;
