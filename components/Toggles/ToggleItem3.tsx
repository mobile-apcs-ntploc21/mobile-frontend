import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MyText from '../MyText';
import { TextStyles } from '@/styles/TextStyles';
import { colors } from '@/constants/theme';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';

export enum STATE {
  NULL,
  NO,
  YES
}

interface ToggleItem3Props {
  text: string;
  value?: STATE;
  onChange?: (value: STATE) => void;
}

const ToggleItem3 = (props: ToggleItem3Props) => {
  const [thisState, setThisState] = useState(STATE.NULL);

  const isControlled = props.value !== undefined;
  const state = isControlled ? props.value : thisState;

  const handleChange = (value: STATE) => {
    if (!isControlled) {
      setThisState(value);
    } else if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <View style={styles.container}>
      <MyText style={TextStyles.bodyXL}>{props.text}</MyText>
      <View style={styles.actionsContainer}>
        {state !== STATE.NULL && (
          <TouchableOpacity onPress={() => handleChange(STATE.NULL)}>
            <MyText style={styles.clear}>Clear</MyText>
          </TouchableOpacity>
        )}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.action,
              {
                backgroundColor:
                  state === STATE.NO ? colors.semantic_red : 'transparent'
              }
            ]}
            onPress={() => handleChange(STATE.NO)}
          >
            <AntDesign
              name="close"
              size={24}
              color={state === STATE.NO ? colors.white : colors.semantic_red}
            />
          </TouchableOpacity>
          <View style={styles.seperator} />
          <TouchableOpacity
            style={[
              styles.action,
              {
                backgroundColor:
                  state === STATE.YES ? colors.semantic_green : 'transparent'
              }
            ]}
            onPress={() => handleChange(STATE.YES)}
          >
            <Feather
              name="check"
              size={24}
              color={state === STATE.YES ? colors.white : colors.semantic_green}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ToggleItem3;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  actions: {
    overflow: 'hidden',
    width: 30 * 2 + 1,
    height: 30,
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: colors.gray03
  },
  clear: {
    ...TextStyles.bodyM,
    color: colors.gray02,
    textDecorationLine: 'underline'
  },
  action: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  seperator: {
    width: 1,
    height: 26,
    alignSelf: 'center',
    backgroundColor: colors.white
  }
});
