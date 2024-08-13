import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

export default function App() {
  return (
    <TouchableOpacity
      style={styles.touchable}
      onPress={() => console.log('onPress called')}>
      <FlatList
        horizontal
        pagingEnabled
        data={['green', 'blue']}
        renderItem={(data) => {
          return (
            <View style={[{ backgroundColor: data.item }, styles.container]} />
          );
        }}
      />
      <View style={styles.textarea}>
        <Text style={styles.title}>Clickable area</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 348,
    height: 348,
  },
  textarea: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
  },
  touchable: {
    margin: 'auto',
    width: 350,
    borderWidth: 1,
    borderColor: 'grey',
  },
});
