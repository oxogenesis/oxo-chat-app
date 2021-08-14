import { StyleSheet } from 'react-native'

const my_styles = StyleSheet.create({
  TabSheet: {
    paddingBottom: 70
  },
  SearchBar: {
    height: 50,
    backgroundColor: 'powderblue'
  },
  Link: {
    color: 'blue',
    fontWeight: 'bold'
  },
  Bulletin: {
    borderStyle: 'solid'
  },
  BulletinContentHeader: {
    //lineHeight: 5
  },
  SeperateLine: {
    textAlign: 'center'
  },
  Avatar: {
    width: 50,
    height: 50,
    resizeMode: 'stretch',
  },
  container: {
    flex: 1,
    padding: 5,
  },
})

export { my_styles }