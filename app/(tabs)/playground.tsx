import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  NativeEventEmitter,
  StatusBar
} from 'react-native';
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
import ButtonListToggle from '@/components/ButtonList/ButtonListToggle';
import ToggleItem3 from '@/components/Toggles/ToggleItem3';
import MyList from '@/components/MyList';
import ReorderItem from '@/components/reordering/ReorderItem';
import EmojiIcon from '@/assets/icons/EmojiIcon';
import ImageIcon from '@/assets/icons/ImageIcon';
import MicIcon from '@/assets/icons/MicIcon';
import PlusIcon from '@/assets/icons/PlusIcon';
import VnpayMerchant, {
  VnpayMerchantModule
} from '@/react-native-vnpay-merchant';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { postData } from '@/utils/api';
import * as Linking from 'expo-linking';
import config from '@/utils/config';

const Playground = () => {
  const [text, setText] = useState('OpenSDK');
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
      >
        <TouchableOpacity
          style={{
            paddingHorizontal: 24,
            paddingVertical: 10,
            backgroundColor: colors.primary,
            borderRadius: 10
          }}
          onPress={async () => {
            const response = await postData('/api/v1/payments/create-order', {
              packageId: '675bb7d389e39febf8198f8a',
              returnUrl: 'myapp://subPlayground'
            });

            console.log(response.data.paymentUrl);

            VnpayMerchant.show({
              isSandbox: true,
              paymentUrl: response.data.paymentUrl,
              tmn_code: config.VNPAY_TMN_CODE,
              backAlert: 'Bạn có chắc chắn trở lại ko?',
              title: 'VNPAY',
              iconBackName: 'ic_close',
              beginColor: 'ffffff',
              endColor: 'ffffff',
              titleColor: '000000',
              scheme: 'com.orantio.Orantio'
            });
          }}
        >
          <Text style={{ color: colors.white }}>{text}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
  // const [selected, setSelected] = useState<string>();
  // const handleValueChange = React.useCallback((value: string) => {
  //   setSelected(value);
  // }, []);
  // const { logout } = useAuth();

  // const [toggleList, setToggleList] = useState(
  //   Array.from({ length: 5 }, (_, index) => ({
  //     value: `item-${index}`,
  //     isOn: false
  //   }))
  // );

  // return (
  //   <ScrollView>
  //     <MyButtonText
  //       title="SubPlayground"
  //       onPress={() => router.navigate('/subPlayground')}
  //     />
  //     <MyButtonIcon icon={EmojiIcon} />
  //     <MyButtonIcon icon={ImageIcon} />
  //     <MyButtonIcon icon={MicIcon} />
  //     <MyButtonIcon icon={PlusIcon} />
  //     <ButtonListToggle
  //       heading="Lorem ipsum"
  //       items={toggleList.map((item, index) => ({
  //         value: item.value,
  //         label: `Item ${index}`,
  //         isOn: item.isOn,
  //         onChange: (isOn) => {
  //           setToggleList((prev) =>
  //             prev.map((prevItem) =>
  //               prevItem.value === item.value ? { ...prevItem, isOn } : prevItem
  //             )
  //           );
  //         }
  //       }))}
  //     />
  //     <MyButtonText
  //       title="Binding test"
  //       onPress={() =>
  //         setToggleList((prev) =>
  //           prev.map((item) => ({ ...item, isOn: !item.isOn }))
  //         )
  //       }
  //     />
  //     <MyList
  //       heading="Hello"
  //       items={Array.from({ length: 5 }, (_, index) => (
  //         <ToggleItem3 text={`Item ${index}`} />
  //       ))}
  //     />
  //     <View
  //       style={{
  //         height: 40,
  //         backgroundColor: 'white',
  //         borderRadius: 20,
  //         justifyContent: 'center',
  //         paddingHorizontal: 16
  //       }}
  //     >
  //       <ReorderItem text="Hello" onPressUp={() => {}} onPressDown={() => {}} />
  //     </View>
  //     <MyButtonText
  //       title="Blocked List"
  //       onPress={() => router.navigate('/blocked')}
  //     />
  //     <View style={{ padding: 16 }}>
  //       <ButtonListText
  //         heading="Lorem ipsum"
  //         items={Array.from({ length: 5 }, (_, index) => ({
  //           text: `Item ${index}`,
  //           onPress: () => console.log(`Item ${index} pressed`)
  //         }))}
  //       />
  //       <ButtonListRadio
  //         heading="Lorem ipsum"
  //         items={Array.from({ length: 5 }, (_, index) => ({
  //           value: `item-${index}`,
  //           label: `Item ${index}`
  //         }))}
  //         value={selected}
  //         onChange={handleValueChange}
  //       />
  //       <MyText>Selected value: {selected}</MyText>
  //     </View>
  //     <UserItemGeneral
  //       id="669340c737c91b8d1fbc98ce"
  //       username="johndoe"
  //       displayName="Subcription user status"
  //       showStatus
  //       subscribeToStatus
  //     />
  //     <UserItemGeneral
  //       id="123"
  //       username="johndoe"
  //       displayName="John Doe 1"
  //       showStatus
  //       onlineStatus={StatusType.ONLINE}
  //     />
  //     <UserItemGeneral
  //       id="123"
  //       username="johndoe"
  //       displayName="John Doe 1"
  //       showStatus
  //       onlineStatus={StatusType.IDLE}
  //     />
  //     <UserItemGeneral
  //       id="123"
  //       username="johndoe"
  //       displayName="John Doe 1"
  //       showStatus
  //       onlineStatus={StatusType.DO_NOT_DISTURB}
  //     />
  //     <UserItemGeneral
  //       id="123"
  //       username="johndoe"
  //       displayName="John Doe 1"
  //       showStatus
  //       onlineStatus={StatusType.INVISIBLE}
  //     />
  //     <UserItemReqSent id="123" username="johndoe" displayName="John Doe" />
  //     <UserItemReqReceived id="123" username="johndoe" displayName="John Doe" />
  //     <Accordion heading="(3) Requests Received">
  //       {Array.from({ length: 3 }, (_, index) => (
  //         <UserItemReqReceived
  //           key={index}
  //           id={index.toString()}
  //           username="johndoe"
  //           displayName="John Doe"
  //         />
  //       ))}
  //     </Accordion>
  //     <MyText style={TextStyles.h1}>Heading 1</MyText>
  //     <MyText style={TextStyles.h2}>Heading 2</MyText>
  //     <MyText style={TextStyles.h3}>Heading 3</MyText>
  //     <MyText style={TextStyles.bodyXL}>Body XL</MyText>
  //     <MyText>Body L</MyText>
  //     <MyButtonText title="Logout" onPress={() => logout()} />
  //     <MyButtonText
  //       title="Default"
  //       onPress={() => console.log('Default')}
  //       style={{ alignSelf: 'center' }}
  //     />
  //     <MyButtonText
  //       title="Reverse Style"
  //       onPress={() => console.log('Reverse Style')}
  //       style={{ alignSelf: 'center' }}
  //       reverseStyle
  //     />
  //     <MyButtonText
  //       title="Custom button"
  //       onPress={() => console.log('Custom button')}
  //       containerStyle={{ width: '90%', height: 100, borderRadius: 10 }}
  //       backgroundColor="plum"
  //       textStyle={TextStyles.h1}
  //     />
  //     <MyButtonTextIcon
  //       title="Button"
  //       onPress={() => console.log('Button with icon')}
  //       iconBefore={FriendIcon}
  //     />
  //     <View
  //       style={{
  //         flexDirection: 'row',
  //         columnGap: 10,
  //         alignItems: 'center',
  //         flexWrap: 'wrap'
  //       }}
  //     >
  //       <MyButtonIcon icon={FriendIcon} />
  //       <MyButtonIcon
  //         icon={MessageIcon}
  //         containerStyle={{
  //           width: 26,
  //           height: 26,
  //           padding: 4
  //         }}
  //       />
  //       <MyButtonIcon icon={AddFriendIcon} />
  //       <MyButtonIcon icon={DotsIcon} />
  //       <MyButtonIcon icon={EditProfileIcon} />
  //       <MyButtonIcon icon={EditStatusIcon} />
  //       <MyButtonIcon icon={GroupIcon} />
  //       <MyButtonIcon icon={SettingIcon} />
  //       <MyButtonIcon icon={StarIcon} />
  //       <MyButtonIcon icon={AddEmojiIcon} />
  //       <MyButtonPress
  //         comp={(props) => (
  //           <MyButtonIcon
  //             {...props}
  //             activeOpacity={1}
  //             icon={TickIcon}
  //             backgroundColor={colors.white}
  //             textColor={colors.semantic_green}
  //           />
  //         )}
  //       />
  //       <MyButtonPress
  //         comp={(props) => (
  //           <MyButtonIcon
  //             {...props}
  //             activeOpacity={1}
  //             icon={CrossIcon}
  //             backgroundColor={colors.white}
  //             textColor="red"
  //           />
  //         )}
  //       />
  //     </View>
  //     <Accordion heading="Heading" defaultOpen>
  //       <View style={{ rowGap: 10 }}>
  //         {Array.from({ length: 20 }, (_, index) => (
  //           <View
  //             key={index}
  //             style={{ flexDirection: 'row', alignItems: 'center' }}
  //           >
  //             <View
  //               style={{
  //                 width: 45,
  //                 height: 45,
  //                 borderRadius: 45 / 2,
  //                 backgroundColor: colors.gray01
  //               }}
  //             />
  //             <MyText>User {index}</MyText>
  //           </View>
  //         ))}
  //       </View>
  //     </Accordion>
  //     <Toggle
  //       FirstFC={({ isSelected }) => (
  //         <MyText
  //           style={{
  //             color: isSelected ? colors.primary : colors.white
  //           }}
  //         >
  //           Default
  //         </MyText>
  //       )}
  //       SecondFC={({ isSelected }) => (
  //         <MyText
  //           style={{
  //             color: isSelected ? colors.primary : colors.white
  //           }}
  //         >
  //           Toggle
  //         </MyText>
  //       )}
  //     />
  //     <Toggle
  //       backgroundColor="plum"
  //       FirstFC={({ isSelected }) => (
  //         <MyText
  //           style={{
  //             color: isSelected ? 'blue' : colors.white
  //           }}
  //         >
  //           Custom
  //         </MyText>
  //       )}
  //       SecondFC={({ isSelected }) => (
  //         <MyText
  //           style={{
  //             color: isSelected ? 'blue' : colors.white
  //           }}
  //         >
  //           Toggle
  //         </MyText>
  //       )}
  //     />
  //   </ScrollView>
  // );
};

export default Playground;
