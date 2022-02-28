import { Grid, TextField, Typography, Button } from "@material-ui/core";
import React, { Component } from "react"
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
class RoomJoinPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            roomCode: "",
            error: "",
        };

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleEnterButtonPressed = this.handleEnterButtonPressed.bind(this);
    }
    
    handleTextChange(e){
        this.setState({
            roomCode: e.target.value,
        })
    }
    
    handleEnterButtonPressed(e){
        
        fetch('/api/get-room?code='+this.state.roomCode)
            .then((response) => {
                if (response.ok) {
                    this.props.history.push(`/room/${this.state.roomCode}`);
                }
                else {
                    this.setState({
                        error: "Room Not Found",
                    })
                }
            })
    }
    render (){
        return (
            <Grid container spacing={1} align="center">
                <Grid item xs={12} >
                    <Typography variant="h4" component="h4">
                        Join A Room
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={this.state.error}
                        label="Code"
                        placeholder="Enter a Room Code"
                        value={this.state.roomCode}
                        helperText={this.state.error}
                        variant="outlined"
                        onChange = {this.handleTextChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={this.handleEnterButtonPressed} component={Link}>Enter Room</Button>
                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained" color="secondary" to="/" component={Link}>Back</Button>
                </Grid>
            </Grid>
        );
    }
}

export default withRouter(RoomJoinPage);