/* Super simple hangman game made in React. CC. 2020 

Thanks to:
Wikimedia foundation for the nice pictures
Creators of an-array-of-english-words for the random words
*/

let wordArray = [];

fetch("./words.json").then(a => a.json())
  .then(data => wordArray = data)
  .then(() => {
	
function randomWords() {
	return wordArray[Math.floor(Math.random()*wordArray.length)];	
}

class Application extends React.Component {
	constructor(props) {
		super (props);
		this.resetWord = this.resetWord.bind(this);
		this.revealWord = this.revealWord.bind(this);
		this.newInput = this.newInput.bind(this);
		this.textHandleChange = this.textHandleChange.bind(this);
		this.failState = this.failState.bind(this);
		this.state = {
			fails: 0, 
			successes: 0, 
			word: randomWords().toUpperCase(), 
			input: "",
			inputHistory: [],
			correctGuesses: [],
			incorrectGuesses: []
		}
		this.initState = this.state;
	}
	
	//Methods
	componentDidUpdate(prevProps, prevState) {
		if(JSON.stringify(this.state) != JSON.stringify(prevState)) {
			this.setState(state => ({
			correctGuesses: state.inputHistory.filter(a => state.word.includes(a)),
			incorrectGuesses: state.inputHistory.filter(a => state.word.includes(a) == false)
		}));
		this.setState(state => ({
			fails: state.incorrectGuesses.length
		}));
		this.failState(this.state.fails); //The state that gets fed into failState is outdated
		this.winState(this.state.word, this.state.correctGuesses)
		}	
	}
	resetWord() {
		this.setState(this.initState);
		this.setState({word: randomWords().toUpperCase()});
	}
	revealWord() {
		alert(`The word is ${this.state.word}`);
		this.resetWord();
	}
	failState(number) {
		if(number == 6) {
			alert(`WOMP WOMP. You lost the game! The correct word was ${this.state.word}.`);
		}
	}
	winState(word, correctGuesses){
		let splitWord = word.split("");
		let wordCheck = splitWord.map(x => {
			if(correctGuesses.includes(x)) {
				return x
			} else {
				return "";
			}
		});
		if(wordCheck.join("") == word) {
			alert("AY! You guessed the right letters!")
			this.resetWord();
		}
	}
	textHandleChange(event) {
		if(this.state.fails < 6){
			this.setState({input: event.target.value})
		}
	}
	newInput(event) {
		event.preventDefault();
		this.setState(state => ({
			inputHistory: [...state.inputHistory, state.input.toUpperCase()],
			input: "",
		}));
	}
	
	//Rendering
	render() {
		return (
		  <div id="reactContainer">
			<h1 id="title">Hangman</h1>
			<ControlPanel reset={this.resetWord} reveal={this.revealWord}/>
			<ManWindow fails={this.state.fails} />
			<LetterGaps word={this.state.word} correctInputs={this.state.correctGuesses} incorrectInputs={this.state.incorrectGuesses}/>
			<InputSection input={this.state.input} inputUpdate={this.newInput} textHandler={this.textHandleChange}/>
		  </div>
		);
	}
}

class ControlPanel extends React.Component {
  	constructor(props) {
    	super (props);
  	}
	render() {
		return (
			<div id="controlPanel">
				<button onClick={this.props.reset}>Reset</button>
				<button onClick={this.props.reveal}>Reveal</button>
			</div>
		);
	}
}

class ManWindow extends React.Component {
	constructor(props) {
		super(props);
	}
	
	picture = <img src={`https://upload.wikimedia.org/wikipedia/commons/8/8b/Hangman-0.png`}/>
	
	person(fails) {
		switch (fails) {
			case 1:
				this.picture = <img src={`https://upload.wikimedia.org/wikipedia/commons/3/30/Hangman-1.png`}/>
				break;
			case 2:
				this.picture = <img src={`https://upload.wikimedia.org/wikipedia/commons/7/70/Hangman-2.png`}/>
				break;
			case 3:
				this.picture = <img src={`https://upload.wikimedia.org/wikipedia/commons/9/97/Hangman-3.png`}/>
				break;
			case 4:
				this.picture = <img src={`https://upload.wikimedia.org/wikipedia/commons/2/27/Hangman-4.png`}/>
				break;
			case 5:
				this.picture = <img src={`https://upload.wikimedia.org/wikipedia/commons/6/6b/Hangman-5.png`}/>
				break;
			case 6:
				this.picture = <img src={`https://upload.wikimedia.org/wikipedia/commons/d/d6/Hangman-6.png`}/>
				break;
			default:
				this.picture = <img src={`https://upload.wikimedia.org/wikipedia/commons/8/8b/Hangman-0.png`}/>
				break;
		}
	}
  
	render () {
		return <div id="pictureFrame">{this.picture}{this.person(this.props.fails)}</div>
	}
}

class LetterGaps extends React.Component {
	constructor(props) {
		super(props);
		this.numberOfGaps = this.numberOfGaps.bind(this)
  	}
	numberOfGaps() {
		console.log(this.props.word)
		let arrayOfGaps = [];
		for(let letter of this.props.word) {
			if(this.props.correctInputs.includes(letter)) {
				arrayOfGaps.push(<div><p class="gap">{letter}</p></div>," ")
			} else {
				arrayOfGaps.push(<div><p class="gap">_</p></div>," ")
			}
		}
		return arrayOfGaps;
	}
	
	render () {
		return (
			<div id="letterGaps">
				<div id="gaps">{this.numberOfGaps()}</div>
				<div id="errorbox"><p id="errors">{this.props.incorrectInputs.join(" ")}</p></div>
			</div>
		)
	}
}

class InputSection extends React.Component {
	constructor(props) {
		super(props);
  	}
	render() {
		return (
			<form id="inputform" onSubmit={this.props.inputUpdate}>
				<input id="inputbox" type="text" maxLength="1" value={this.props.input} onChange={this.props.textHandler}/>
				<button id="submitButton" type="submit">></button>
			</form>
		)
	}
}

ReactDOM.render(<Application />, document.getElementById('container'));})
