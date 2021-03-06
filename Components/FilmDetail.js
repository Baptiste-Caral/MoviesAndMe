import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity } from 'react-native'
import { getFilmDetailFromApi } from '../API/TMDBapi'
import { getImageFromApi } from '../API/TMDBapi'
import numeral from 'numeral'
import moment from 'moment'
import { connect } from 'react-redux'

class FilmDetail extends React.Component {


  constructor(props) {
    super(props)
    this.state= {
      film: undefined,
      isLoading: true
    }
  }
componentDidMount() {
  getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
    this.setState(
      {
        film: data,
        isLoading: false
      }
    )
  })
}
_toggleFavorite() {
  const action = { type : "TOGGLE_FAVORITE", value: this.state.film }
  this.props.dispatch(action)
}
componentDidUpdate() {
  console.log(this.props.favoritesFilm);
}
_displayFavoriteImage() {
  var sourceImage = require('../Images/ic_favorite_border.png')
  if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !=-1) {
    sourceImage = require('../Images/ic_favorite.png')
  }
  return <Image
    source={sourceImage}
    style={styles.favorite_image}
  />
}
_displayFilm() {
  const film = this.state.film
  
  if (film != undefined) {
    const budget = '$' + numeral(film.budget).format('0,0[.]00');
    const date = moment(new Date(film.release_date)).format('DD/MM/YYYY')
    return (
      <ScrollView style={styles.scrollview_container}>
        <Image
          style={styles.image}
          source={{uri: getImageFromApi(film.backdrop_path)}}
        />
          <Text style={styles.title_text}>{film.title}</Text>
          <TouchableOpacity style={styles.favorite_container} onPress={() => this._toggleFavorite()}>{this._displayFavoriteImage()}</TouchableOpacity>
          <Text style={styles.description_text} >{film.overview}</Text>
          <Text style={styles.default_text}>Sorti le {date}</Text>
          <Text style={styles.default_text}>Note: {film.vote_average} / 10</Text>
          <Text style={styles.default_text}>Nombre de vote: {film.vote_count}</Text>
          <Text style={styles.default_text}>Budget: {budget}</Text>
          <Text style={styles.default_text}>Genre(s): {film.genres.map((genre) => {return genre.name}).join(' / ')}</Text>
          <Text style={styles.default_text}>Compagnie(s): {film.production_companies.map((companies) => {return companies.name}).join(' / ')}</Text>
      </ScrollView>
    )
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
    const idFilm = this.props.navigation.state.params.idFilm
    return (
      <View style={styles.main_container}>
        {this._displayFilm()}
        {this._displayLoading()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollview_container: {
    flex: 1
  },
  image: {
    height: 169,
    margin: 5,
    
  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 35,
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    marginBottom: 10,
    color: '#000000',
    textAlign: 'center'
  },
  description_text: {
    fontStyle: 'italic',
    color: '#666666',
    margin: 5,
    marginBottom: 15
  },
  default_text: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },
  favorite_container: {
    alignItems: 'center'
  },
  favorite_image: {
    width: 40,
    height: 40
  }
  
})
const mapStateToProps = (state) => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}

export default connect(mapStateToProps)(FilmDetail)