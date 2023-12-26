//css
import './App.css'

//react
import { useCallback, useEffect, useState } from 'react'

//data
import {wordsList} from './data/words'

//components
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'


const stages = [
  {id: 1, name:"start"},
  {id: 2, name:"game"},
  {id: 3, name:"end"},
];
const guessesQty = 3

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    //pegar categoria aleatorio
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    console.log(category)

    //pegar palavra da categoria
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word)

    return {word, category}
  }, [words])

  //inicia a pagina do game
  const startGame = useCallback(() => {
    //resetar os states
    clearLetterStates()

    //pick wor e pick category
    const {word, category} = pickWordAndCategory()

    //criar um array de letras
    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    console.log(word, category)
    console.log(wordLetters)

    //fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  //entrada de letras
  const verifyLetter = (letter) => {
    //console.log(letter)
    const normalizedLetter = letter.toLowerCase()

    //verificar se a letra ja foi utilizada de alguma maneira
    if(
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)){
      return
    }
    //verifica se a letra digitada contem na palavra,
    //se contem, ele vai com spreadOperator colocar a nova letra
    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    }else{
      setWrongLetters((actualWrongetters) => [
        ...actualWrongetters,
        normalizedLetter
      ])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])

  }

  useEffect(() => {
    if(guesses <= 0){
      //reset all states
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(() => {

    //tira as letras repetidas e deixa so a primeira
    const uniqueLetters = [... new Set(letters)]

    //se forem iguais a palavra esta correta entao o ganhou
    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name){
      setScore((actualScore) => actualScore += 100)

      //reinicia o jogo
      startGame()
    } 
  }), [guessedLetters, letters, startGame]


  //restart game
  const retry = () => {

    setScore(0)
    setGuesses(guessesQty)


    setGameStage(stages[0].name)
  }


  return (
    <div className='App'>
     {gameStage === "start" && <StartScreen startGame={startGame} />}
     {gameStage === "game" && <Game 
     verifyLetter={verifyLetter} 
     pickedWord={pickedWord}
      pickedCategory={pickedCategory} 
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />}
     {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  )
}

export default App
