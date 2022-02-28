import { AppBar, Toolbar, Typography, InputBase, Box } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React, { Component } from "react";
import useStyles from './styles.js';


export default class Header extends Component {
  classes = useStyles();
  render () {
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h5" className={classes.title}>
          Travel Advisor
        </Typography>
        <Box display="flex">
          <Typography variant="h6" className={classes.title}>
            Explore new places
          </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
              </div>
            </div>
        </Box>
      </Toolbar>
    </AppBar>
  }
}
