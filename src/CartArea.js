import React from 'react';
import './App.css';
import Cart from './Cart';

class CartArea extends React.Component {
  getCourses() {
    let courses = [];

    for(const course of Object.entries(this.props.data)) {
        courses.push (
            <Cart key={course[0]} data={course[1]} setCart={(carts) => this.setCart(carts)}/>
        )
    }

    return courses;
  }

  //Recieve value passed from Course, remove the corresponding course info from cartContent, then pass to its parent 
  setCart(carts) {
    let contents = [];
    let dup = {};
    
    for (const course of Object.values(this.props.cartContent)) {
      if (course.name === carts.name) {
        dup = course;
        for (const section of Object.entries(carts.sections)) {
            for (const subsection of Object.entries(section[1].subsections)) {
              delete dup.sections[section[0]].subsections[subsection[0]];
            }
            if (Object.entries(dup.sections[section[0]].subsections).length === 0) { 
              delete dup.sections[section[0]];
            }
        }
        if (Object.entries(dup.sections).length !== 0) {
          contents.push(dup);
        }
      } else {
        contents.push(course);
      }
    }
    this.props.setCart(contents);
  }

  render() {
    return (
      <div style={{margin: '50px'}}>
        <h1> My Cart </h1>
        {this.getCourses()}
      </div>
    )
  }
}

export default CartArea;
