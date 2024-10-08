import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import RoleIcon from '@/assets/icons/RoleIcon';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import { getData } from '@/utils/api';
import useServers from '@/hooks/useServers';
import { Role } from '@/types/server';

const RoleItem = ({ role }: { role: Role }) => {
  return (
    <View style={styles.roleItem}>
      <View style={styles.roleIcon}>
        <View style={styles.iconWrapper}>
          <RoleIcon color={role.color} />
        </View>
        <Text style={styles.memberCount}>{role.number_of_users}</Text>
      </View>
      <Text style={styles.roleTitle}>{role.name}</Text>
    </View>
  );
};

export default RoleItem;

const styles = StyleSheet.create({
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  roleIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40
  },
  iconWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  memberCount: {
    ...TextStyles.bodyS,
    color: colors.black
  },
  roleTitle: {
    ...TextStyles.bodyXL,
    color: colors.black
  }
});
