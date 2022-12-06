import React, {useEffect, useRef, useState} from "react";
import {APPLE_START, CANVAS_SIZE, DIRECTIONS, SCALE, SNAKE_START, SPEED} from "../../utils/constants";
import {useInterval} from "../../utils/useInterval";
import './gameField.css'
import {getUserByName, setNewRecord} from "../../services";

const GameField = ({user}) => {
    const canvasRef = useRef(null)
    const wrapperRef = useRef(null)
    const [snake, setSnake] = useState(SNAKE_START)
    const [apple, setApple] = useState(APPLE_START)
    const [appleFeed, setAppleFeed] = useState(1)
    const [dir, setDir] = useState([0, -1])
    const [speed, setSpeed] = useState(null)
    const [isInGame, setIsInGame] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [points, setPoints] = useState(0)
    const [record, setRecord] = useState(0)

    const startGame = () => {
        setSnake(SNAKE_START)
        setApple(APPLE_START)
        setDir([0, -1])
        setSpeed(SPEED)
        setIsInGame(true)
    }

    const pauseGame = () => {
        if(isPaused){
            setIsPaused(false)
        }else{
            setIsPaused(true)
        }
    }

    const endGame = () => {
        updateRecord()
        setSpeed(null)
        setIsInGame(false)
        setPoints(0)
    }

    const moveSnake = ({keyCode}) => {
        if(keyCode >= 37 && keyCode <= 40){
            setDir(DIRECTIONS[keyCode])
        }
    }

    const createApple = () => {
        return apple.map((_, i) => Math.floor(Math.random() * (CANVAS_SIZE[i]) / SCALE))
    }

    const checkCollision = (piece, snk = snake) => {
        if(piece[0] * SCALE >= CANVAS_SIZE[0] ||
            piece[0] < 0 ||
            piece[1] * SCALE >= CANVAS_SIZE[1] ||
            piece[1] < 0
        ){
            return true;
        }
        for(const segment of snk){
            if(piece[0] === segment[0] && piece[1] === segment[1]){
                return true;
            }
        }
        return false;
    }

    const checkForPoints = (points) => {
        if(points >= 50 && Math.floor(points / 10) % 5 === 0 && speed > 100){
            setSpeed(speed => speed - 100)
        }
    }

    const setNewAppleFeed = () => {
        if(appleFeed === 1){
            setAppleFeed(5)
        }else if(appleFeed === 5){
            setAppleFeed(10)
        }else{
            setAppleFeed(1)
        }
    }

    const checkAppleCollision = (newSnake) => {
        if(newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]){
            setPoints(pts => pts + appleFeed)
            setNewAppleFeed()
            let newApple = createApple()
            while(checkCollision(newApple, newSnake)){
                newApple = createApple()
            }
            setApple(newApple)
            return true
        }
        return false
    }

    const gameLoop = () => {
        if(!isPaused){
            const snakeCopy = JSON.parse(JSON.stringify(snake))
            const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]]
            snakeCopy.unshift(newSnakeHead)
            if(checkCollision(newSnakeHead)){
                endGame()
            }
            if(!checkAppleCollision(snakeCopy)){
                snakeCopy.pop()
            }
            setSnake(snakeCopy)
        }
    }

    const updateRecord = async () => {
        if(points > record){
            setRecord(points)
            await setNewRecord(points, user.name)
        }
    }

    useEffect(() => {
        async function checkUser(){
            const found = await getUserByName(user.name)
            if(found){
                setRecord(found.data.recordPoints)
            }
        }
        checkUser()
    }, [user.name])

    useEffect(() => {
        checkForPoints(points)
    }, [points])

    useEffect(() => {
        wrapperRef.current.focus()
        const context = canvasRef.current.getContext('2d')
        context.setTransform(SCALE, 0, 0, SCALE, 0, 0)
        context.clearRect(0,0, CANVAS_SIZE[0], CANVAS_SIZE[1])
        context.fillStyle = 'green'
        snake.forEach(([x,y]) => context.fillRect(x, y, 1, 1))
        context.fillStyle = 'red'
        context.fillRect(apple[0], apple[1], 1, 1)
    }, [snake, apple, isInGame])

    useInterval(() => gameLoop(), speed);

    return (
        <div ref={wrapperRef} className={'wrapper'} onKeyDown={e => moveSnake(e)} tabIndex={0}>
            <div className={'board'} role={'button'} tabIndex={1}>
                <h2 className={'userRecord'}>Your record: {record}</h2>
                <h2 className={'userPoints'}>Points: {points}</h2>
                <canvas
                    className={'canvas'}
                    ref={canvasRef}
                    width={`${CANVAS_SIZE[0]} px`}
                    height={`${CANVAS_SIZE[1]} px`}
                />
            </div>
            <div className={'buttons'}>
                <button disabled={isInGame} onClick={startGame} className={'ruleGame startBtn'}>Start</button>
                <button disabled={!isInGame} onClick={pauseGame} className={'ruleGame pauseBtn'}>{isPaused ? 'Continue' : 'Pause'}</button>
            </div>
        </div>
    )
}
export default GameField