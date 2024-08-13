import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

export default function App() {
  return (
    <TouchableOpacity
      hitSlop={7}
      style={styles.touchable}
      onPress={() => console.log('onPress called')}>
      <FlatList
        hitSlop={6}
        horizontal
        pagingEnabled
        data={[
          { color: 'green', slop: 4 },
          { color: 'blue', slop: 5 },
        ]}
        renderItem={(data) => {
          return (
            <View
              hitSlop={data.item.slop}
              style={[{ backgroundColor: data.item.color }, styles.container]}
            />
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
