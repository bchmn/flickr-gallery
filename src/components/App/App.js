import React from 'react';
import './App.scss';
import Gallery from '../Gallery';
import FontAwesome from 'react-fontawesome';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'art',
      virtualList: false
    };
  }

  toggleVirtualList = () => {
    debugger;
    this.setState({
      virtualList: !this.state.virtualList
    })
  }

  render() {
    return (
      <div className="app-root">
        <FontAwesome className="app-icon" name="magic" onClick={this.toggleVirtualList}/>
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={event => this.setState({tag: event.target.value})} value={this.state.tag}/>
        </div>
        <Gallery tag={this.state.tag} virtualList={this.state.virtualList}/>
      </div>
    );
  }
}

export default App;
