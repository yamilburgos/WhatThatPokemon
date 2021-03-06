import React, { Component } from 'react';
import './style.css';
import axios from 'axios';

class Pokedex extends Component {
  constructor(props) {
    super(props);
    this.state = { apiData: [], current: [], loading: false };
  }

  componentDidMount() {
    axios.get("https://pokeapi.co/api/v2/pokemon/?limit=151").then((allData) => {
        this.setState({ apiData: allData.data.results });
     });
  }

  getPokemonEntry(num) {
      if(this.canClickAgain()) {
          axios.get(this.state.apiData[num].url).then((allData) => {
            this.setState({ current: allData.data, loading: false });
          });
      }
  }

  makePokemonList() {
    this.indents = this.state.apiData.map((data, num) => {
        return this.createNumber(num + 1) + data.name;
    });

    return this.results = this.indents.map((data, num) => {
        return (<p onClick={() => this.getPokemonEntry(num)} key={num + 1} className="monEntry nameBullet">{data}</p>);
    });
  }

    createPokemonImages() {
    this.indents = [];

    if(this.state.current.id !== undefined) {
      this.indents.push(<img key="i1" className="pokeImage" src={this.state.current.sprites.front_default} alt=""></img>);
      this.indents.push(<img key="i2" className="pokeImage" src={this.state.current.sprites.front_shiny} alt=""></img>);
    }
  
    return this.indents;
  }

  createPokemonProfile() {
    this.indents = [];

    if(this.state.current.id !== undefined) {
      this.indents.push(<h3 key="a" className="monEntry focus">{this.createNumber(this.state.current.id) + this.state.current.name}</h3>);
      this.indents.push(<p key="b" className="monEntry">Weight: {this.state.current.weight / 10} kg</p>);
      this.indents.push(<p key="c" className="monEntry">Type: {this.checkData("Type", this.state.current.types.length)}</p>);
      this.indents.push(<p key="d" className="monEntry">Abilities: {this.checkData("Ability", this.state.current.abilities.length)}</p>);
    }
  
    return this.indents;
  }

  createPokemonMoveSet() {
    if(this.state.current.id !== undefined) {
        this.indents.push(<h3 key="e" className="monEntry focus">Move List:</h3>);

        return this.indents = this.state.current.moves.map((data, num) => {
          return (<li key={num + 1} className="monEntry moveBullet"> {this.checkMoves("Moves", this.state.current.moves.length, num)}</li>);
        });
    }
  }
  
  createNumber(pokemonIndex) {
    this.fullString = '' + pokemonIndex;
    
    while (this.fullString.length < 3) {
        this.fullString = '0' + this.fullString;
    }

    return this.fullString += ". ";
  }

  checkData(path, dataLength) {
    this.fullString = '';

    for (let i = dataLength - 1; i >= 0; i--) {
      this.sep = (i > 0) ? " / " : "";
      this.fullString += this.pickPath(path, this.state.current, i);
    }

    return this.fullString;
  }

  checkMoves(path, dataLength, i) {
    this.fullString = this.sep = '';
    return this.fullString += this.pickPath(path, this.state.current, i);
  }

  canClickAgain() {
    if(this.state.loading === false) {
        this.setState({ loading: true });
    }

    return (this.state.loading === false) ? true : false;     
  }

  pickPath(chosenPathway, apiInfo, num) {
    switch(chosenPathway) {
        case "Type":
          return apiInfo.types[num].type.name + this.sep;
        case "Ability":
          return apiInfo.abilities[num].ability.name + this.sep;
        default: // Moves
          return apiInfo.moves[num].move.name + this.sep;
    }
  }

  render() {
    return (
      <div>
        <h1 className="title">What's that Pokémon?</h1>
        <div className="columns monList">
          {this.makePokemonList()}
        </div>
        <div className="columns monProfile">
          {this.createPokemonImages()}
          {this.createPokemonProfile()}
          <div className="moveList">
            {this.createPokemonMoveSet()}
          </div>
        </div>
      </div>
    );
  }
}

export default Pokedex;