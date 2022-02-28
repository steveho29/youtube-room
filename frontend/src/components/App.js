import React, { Component } from "react";
import { render } from  "react-dom";
import HomePage from "./Homepage";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { BrowserRouter, Switch, Route, Link, Redirect } from "react-router-dom";
export default class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            roomCode: null,
        }
        this.leaveRoom = this.leaveRoom.bind(this);
    }

    async componentDidMount() {
        fetch('/api/checkUserInRoom')
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    roomCode: data.roomCode,
                    
                })
            });
    }

    leaveRoom(){
        this.setState({
            roomCode: null,

        })
    }

    render(){
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/join'>
                        <RoomJoinPage />
                    </Route>
                    <Route path='/create'>
                        <CreateRoomPage />
                    </Route>
                    <Route path='/room/:roomCode' render={(props) => {
                        return (
                            <Room {...props} leaveRoomCallBack={this.leaveRoom} />
                        ) 
                    }}>
                    </Route>
                    <Route path='/' render={() =>{
                        return this.state.roomCode ? 
                        (<Redirect  to={`/room/${this.state.roomCode}`} />) : (<HomePage />)
                    }
                    } />
                </Switch>
            </BrowserRouter>
        )
    }
}

const appDiv = document.getElementById("app")
render(<App />, appDiv)