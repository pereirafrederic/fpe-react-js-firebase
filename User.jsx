
import React, { Component, Fragment } from 'react';

import firebase from 'firebase';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      developers: []
    };

  }

  componentDidMount() {
    this.getUserData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.writeUserData();
    }
  }


  writeUserData = () => {
    firebase.database().ref('/').set(this.state);
    console.log('DATA SAVED');
  }

  getUserData = () => {
    let ref = firebase.database().ref('/');
    ref.on('value', snapshot => {
      const state = snapshot.val();
      this.setState(state);
    });
    console.log('DATA RETRIEVED');
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let name = this.refs.name.value;
    let role = this.refs.role.value;
    let uid = this.refs.uid.value;

    if (uid && name && role) {
      const { developers } = this.state;
      const devIndex = developers.findIndex(data => {
        return data.uid === uid
      });
      developers[devIndex].name = name;
      developers[devIndex].role = role;
      this.setState({ developers });
    }
    else if (name && role) {
      const uid = new Date().getTime().toString();
      const { developers } = this.state;
      developers.push({ uid, name, role })
      this.setState({ developers });
    }

    this.refs.name.value = '';
    this.refs.role.value = '';
    this.refs.uid.value = '';
  }

  removeData = (developer) => {
    const { developers } = this.state;
    const newState = developers.filter(data => {
      return data.uid !== developer.uid;
    });
    this.setState({ developers: newState });
  }

  updateData = (developer) => {
    this.refs.uid.value = developer.uid;
    this.refs.name.value = developer.name;
    this.refs.role.value = developer.role;
  }


  render() {
    const { developers } = this.state;
    return (<Fragment>
      <div className='row'>
        <div className='col-xl-12'>
          {
            developers
              .map(developer =>
                <div key={developer.uid} className="card float-left" style={{ width: '18rem', marginRight: '1rem' }}>
                  <div className="card-body">
                    <h5 className="card-title">{developer.name}</h5>
                    <p className="card-text">{developer.role}</p>
                    <button onClick={() => this.removeData(developer)} className="btn btn-link">Delete</button>
                    <button onClick={() => this.updateData(developer)} className="btn btn-link">Edit</button>
                  </div>
                </div>
              )
          }
        </div>
      </div>
      <div className='row'>
        <div className='col-xl-12'>
          <h1>Add new team member here</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="form-row">
              <input type='hidden' ref='uid' />
              <div className="form-group col-md-6">
                <label>Name</label>
                <input type="text" ref='name' className="form-control" placeholder="Name" />
              </div>
              <div className="form-group col-md-6">
                <label>Role</label>
                <input type="text" ref='role' className="form-control" placeholder="Role" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
          </form>
        </div>
      </div>
    </Fragment>
    );
  }
}
