import './StartScreen.css'

const StartScreen = ({startGame}) => {
    return(
        <div className='start'>
            <h1>Palavra <br /> SECRETA</h1>
            <button onClick={startGame}>GO</button>
        </div>
    )
}

export default StartScreen