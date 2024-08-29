import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ColorPicker, {
  HueCircular,
  Panel1,
  returnedResults,
  Swatches
} from 'reanimated-color-picker';
import { colors } from '@/constants/theme';

const MyColorPicker = ({
  color,
  handleChange
}: {
  color: string;
  handleChange: (color: string) => void;
}) => {
  return (
    <ColorPicker
      value={color}
      sliderThickness={20}
      thumbSize={24}
      onComplete={(color: returnedResults) => handleChange(color.hex)}
    >
      <View style={styles.container}>
        <HueCircular
          style={styles.hueStyle}
          containerStyle={styles.hueContainer}
          thumbShape="pill"
        >
          <Panel1 style={styles.panelStyle} boundedThumb />
        </HueCircular>
        <Swatches
          swatchStyle={styles.swatchStyle}
          style={styles.swatchContainer}
          colors={[
            '#A7B1C2',
            '#F04343',
            '#DD8A3E',
            '#E4CA3E',
            '#33CF67',
            '#43A7F0',
            '#434AF0',
            '#B943F0',
            '#FF4BCD'
          ]}
        />
      </View>
    </ColorPicker>
  );
};

export default MyColorPicker;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16
  },
  hueContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray03
  },
  hueStyle: {
    width: 320,
    height: 320
  },
  panelStyle: {
    width: '70%',
    height: '70%',
    borderRadius: 16
  },
  swatchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    rowGap: 8,
    columnGap: 8
  },
  swatchStyle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    elevation: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    marginTop: 0
  }
});
