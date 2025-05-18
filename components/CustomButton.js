import { Button, IconButton } from '@react-native-material/core';
import { View } from 'react-native';
import { MaterialIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

export default function CustomButton({ title, icon, onPress, style, color }) {
  if (icon && !title) {
    const IconComponent = {
      MaterialIcons,
      AntDesign,
      FontAwesome5
    }[icon.type];

    return (
      <View style={{ width: 'auto', ...style }}>
        <IconButton
          icon={props => (
            <IconComponent 
              name={icon.name} 
              size={icon.size || 24} 
              color={props.color}
            />
          )}
          onPress={onPress}
          color={color}
        />
      </View>
    );
  }

  return (
    <View style={{ width: '100%', ...style }}>
      <Button 
        title={title}
        onPress={onPress}
        leading={icon}
        color={color}
        tintColor={Colors.onPrimary}
        titleStyle={Typography.button}
      />
    </View>
  );
}
