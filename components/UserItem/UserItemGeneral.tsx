import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import UserItemBase, { UserItemBaseProps } from './UserItemBase';

interface UserItemGeneralProps extends UserItemBaseProps {}

const UserItemGeneral = (props: UserItemGeneralProps) => {
  return <UserItemBase showStatus {...props} />;
};

export default UserItemGeneral;

const styles = StyleSheet.create({});
