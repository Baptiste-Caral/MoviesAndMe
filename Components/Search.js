import React from 'react';
import { StyleSheet, View, Button, TextInput, FlatList } from 'react-native';
import FilmItem from './FilmItem';
import { getFilmsFromApiWithSearchedText } from '../API/TMDBapi';


const Separator = () => (
  <View style={styles.separator} />
);

class Search extends React.Component {

  constructor(props) {
    super(props)
    this.state= { 
      films: [],
      isLoading: false
     }
     this.searchedText = ''
  }
  searchTextInputChanged(text) {
    this.searchedText = text
  }

  _loadFilms() {
    this.setState({ isLoading: true })
    if (this.searchedText.length > 0) {
      getFilmsFromApiWithSearchedText(this.searchedText)
      .then(data => this.setState({
        films : data.results,
        isLoading: false
      }));
    }
    
}
  
  render() {
    console.log(this.state.isLoading);
    return (
      <View style={styles.view}>
        <TextInput onSubmitEditing={() => this._loadFilms()} onChangeText={(text) => {this.searchTextInputChanged(text)}} style={styles.textinput} placeholder='Titre du film' />
        <Separator />
        <Button color='#F0C70D' style={styles.searchButton} title='Rechercher' onPress={() => this._loadFilms()} />
        <FlatList
          data={this.state.films}
          keyExtractor= {(item) => item.id.toString()}
          renderItem={({item}) => <FilmItem film={item} />}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  view: {
    marginTop: 50,
    flex: 1
  },
  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    paddingLeft: 5,
    borderRadius: 10
  },
  separator: {
    marginVertical: 2,
    borderBottomColor: '#737373',
  
  },
})
export default Search;