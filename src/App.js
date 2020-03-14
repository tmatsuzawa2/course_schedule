import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import CartArea from './CartArea';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab';
import SchedBar from './SchedBar';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: {},
      filteredCourses: {},
      //added state to store the courses in cart
      cartCourses: {}, 
      subjects: []
    };
  }

  componentDidMount() {
    fetch('https://mysqlcs639.cs.wisc.edu:5000/classes').then(
      res => res.json()
    ).then(data => this.setState({allCourses: data, filteredCourses: data, subjects: this.getSubjects(data)}));
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(const course of Object.values(data)) {
      if(subjects.indexOf(course.subject) === -1)
        subjects.push(course.subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }

  //added method to set state of carts
  setCart(carts) {
    this.setState({cartCourses: carts})
  }

  render() {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs variant="pills" defaultActiveKey="home" transition={false}>
          <Tab eventKey="home" title="Home">
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects}/>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.state.filteredCourses} cartContent = {this.state.cartCourses} setCart={(carts) => this.setCart(carts)}/>
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart">
            <CartArea data={this.state.cartCourses} cartContent = {this.state.cartCourses} setCart={(carts) => this.setCart(carts)}/>
          </Tab>
          <Tab eventKey="scheduler" title="Scheduler">
            <SchedBar data={this.state.cartCourses}></SchedBar>
          </Tab>
        </Tabs>
        
      </>
    )
  }
}

export default App;
