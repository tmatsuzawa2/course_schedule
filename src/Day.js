import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

class Day extends React.Component {
  
  getMargin() {
    return 20+15*this.props.index;
  }

  getBlocks() {
    let blockComponents = [];

    this.props.blocks.forEach((blockData)=>{

      let pxHeight = this.props.height*(blockData.end - blockData.start)/(this.props.end-this.props.start);
      let pxY = this.props.height*(blockData.start-this.props.start)/(this.props.end-this.props.start)
      blockComponents.push(<Card key={blockData.name} 
                                 style={{height:pxHeight,
                                         marginTop:pxY,
                                         marginLeft:'1px',
                                         backgroundColor:'#f0f6ff',
                                         position:'fixed',
                                         width:'calc('+this.props.width+' - 4px)'}}>{blockData.name}</Card>);
    })

    return blockComponents;
  }

  render() {
    let margin = 320+205*this.props.index;
    return (
          <div style={{marginLeft: margin, top: '50px', position: 'fixed'}}>
              <Card style={{borderRadius:0,
                          width:this.props.width,
                          textAlign:'center',
                          position:'relative',
                          marginLeft: '50px'}}>
              <Card.Header className='square'>{this.props.title}</Card.Header>
              <Card.Body style={{height:this.props.height,padding:0}}>
                {this.getBlocks()}
              </Card.Body>
           
              </Card>
            </div>)
  }

}

export default Day; 