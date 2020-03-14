import React from 'react';
import './App.css';
import Course from './Course';
import merge from 'lodash/merge';

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];

    for(const course of Object.entries(this.props.data)) {
      courses.push (
        <Course key={course[0]} data={course[1]} setCart={(carts) => this.setCart(carts)}/>
      )
    }

    return courses;
  }

  //Recieve value passed from Course, add the corresponding course info into cartContent, then pass to its parent 
  setCart(carts) {
    let contents = [];
    let checkName = 0;  //0 for no duplicate, 1 for duplicates
    let dup = {};

    for (const course of Object.values(this.props.cartContent)) {
      if (course.name === carts.name) {
        checkName = 1;
        dup = course;
      } else {
        contents.push(course);
      }
    }
    if (checkName === 0) {
      contents.push(carts);
    } else {
      merge(carts, dup);
      contents.push(carts);
    }
    this.props.setCart(contents);
  }

  render() {
    return (
      <div style={{margin: '5px'}}>
        {this.getCourses()}
      </div>
    )
  }
}

export default CourseArea;
