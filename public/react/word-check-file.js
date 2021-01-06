/*
 * The following code is just a test sample taken from 
 * https://reactjs.org/docs/add-react-to-a-website.html
 * Has nothing to do with the current superghost game set up
 */

'use strict';

const e = React.createElement;

class Word extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }
    console.log("test test test");

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

const domContainer = document.querySelector('#check-word');
ReactDOM.render(e(Word), domContainer);