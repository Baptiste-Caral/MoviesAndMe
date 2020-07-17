import React from 'react';
import { StyleSheet, View, Button, TextInput, FlatList, ActivityIndicator } from 'react-native';
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
     this.page = 0
     this.totalPages = 0
     this.searchedText = ''
  }
  searchTextInputChanged(text) {
    this.searchedText = text
  }

  _loadFilms() {
    
    if (this.searchedText.length > 0) {
      this.setState({ isLoading: true }) // start loader
      getFilmsFromApiWithSearchedText(this.searchedText, this.page+1)
      .then(data => {
        this.page = data.page
        this.totalPages = data.total_pages
        this.setState({
          films : [ ...this.state.films, ...data.results ],
          isLoading: false // stop loader
      })
      });
    }  
}
  _displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
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
          // scroll 
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (this.page < this.totalPages) {
              this._loadFilms()
            }
          }} 
        />
        {this._displayLoading()}
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
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
export default Search;