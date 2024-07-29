import { memo } from 'react';
import React from 'react-native';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  FlatList as RNFlatList,
} from 'react-native';
import { FlatList as GHFlatList } from 'react-native-gesture-handler';

const ItemTap = ({ index }: { index: number }) => {
  console.log('rendering', index);
  return (
    <View style={styles.staticBox}>
      <Text>{index}</Text>
    </View>
  );
};

const MemoizedItemTap = memo(ItemTap);

const data = new Array(50).fill('1');

export default function FlatListExample() {
  return (
    <SafeAreaView style={styles.fill}>
      <Text style={styles.topHeader}>Raw</Text>
      <View style={styles.container}>
        <View style={styles.fill}>
          <Text style={styles.header}>GH FlatList</Text>
          <GHFlatList
            data={data}
            style={styles.fill}
            renderItem={({ index }) => <ItemTap index={index} />}
          />
        </View>
        <View style={styles.fill}>
          <Text style={styles.header}>RN FlatList</Text>
          <RNFlatList
            data={data}
            style={styles.fill}
            renderItem={({ index }) => <ItemTap index={index} />}
          />
        </View>
      </View>
      <Text style={styles.topHeader}>Memoized</Text>
      <View style={styles.container}>
        <View style={styles.fill}>
          <Text style={styles.header}>GH FlatList</Text>
          <GHFlatList
            data={data}
            style={styles.fill}
            renderItem={({ index }) => <MemoizedItemTap index={index} />}
          />
        </View>
        <View style={styles.fill}>
          <Text style={styles.header}>RN FlatList</Text>
          <RNFlatList
            data={data}
            style={styles.fill}
            renderItem={({ index }) => <MemoizedItemTap index={index} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 5,
    borderColor: 'red',
    borderWidth: StyleSheet.hairlineWidth,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 5,
  },
  fill: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  staticBox: {
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'red',
    marginBottom: 20,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
