import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const Typography = StyleSheet.create({
  h1: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 28,
    color: Colors.text
  },
  h2: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 24,
    color: Colors.text
  },
  body: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text
  },
  bodyItalic: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 16,
    color: Colors.text
  },
  bodyBold: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: Colors.text
  },
  button: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text
  },
  input: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: Colors.text
  },
  label: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: Colors.text
  }
}); 