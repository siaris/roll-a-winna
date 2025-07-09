import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Type definitions
type Participant = string;

interface RouletteItemProps {
  index: number;
  itemCount: number;
}

interface RouletteWheelProps {
  rotation: number;
  itemCount: number;
}

const Roulette: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([
    'John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 
    'Charlie Wilson', 'Diana Miller', 'Evan Davis'
  ]);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [newParticipant, setNewParticipant] = useState<string>('');

  const handleSpin = (): void => {
    if (isSpinning || participants.length === 0) return;
    
    setIsSpinning(true);
    setWinner(null);
    
    // Putaran acak antara 5-10 putaran
    const spins = 5 + Math.floor(Math.random() * 5);
    const totalRotation = rotation + (spins * 360) + (Math.floor(Math.random() * 360));
    
    setRotation(totalRotation);
  };

  const handleAddParticipant = (): void => {
    if (newParticipant.trim() === '') return;
    setParticipants([...participants, newParticipant.trim()]);
    setNewParticipant('');
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleAddParticipant();
    }
  };

  useEffect(() => {
    if (!isSpinning) return;
    
    const timer = setTimeout(() => {
      setIsSpinning(false);
      // Hitung pemenang berdasarkan rotasi akhir
      const segmentAngle = 360 / participants.length;
      const normalizedRotation = rotation % 360;
      const winningIndex = Math.floor(((360 - normalizedRotation) % 360) / segmentAngle);
      setWinner(participants[winningIndex]);
    }, 5000); // Sesuaikan dengan durasi animasi CSS
    
    return () => clearTimeout(timer);
  }, [isSpinning, rotation, participants]);

  return (
    <Container>
      <h1>Door Prize Roulette</h1>
      
      <RouletteWheel rotation={rotation} itemCount={participants.length}>
        {participants.map((participant, index) => (
          <RouletteItem key={index} index={index} itemCount={participants.length}>
            {participant}
          </RouletteItem>
        ))}
        <CenterPin />
      </RouletteWheel>
      
      <SpinButton 
        onClick={handleSpin} 
        disabled={isSpinning || participants.length === 0}
      >
        {isSpinning ? 'Memutar...' : 'Putar Roulette'}
      </SpinButton>
      
      {winner && (
        <WinnerDisplay>
          <h2>Selamat Kepada:</h2>
          <WinnerName>{winner}</WinnerName>
        </WinnerDisplay>
      )}
      
      <ParticipantForm>
        <input
          type="text"
          value={newParticipant}
          onChange={(e) => setNewParticipant(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nama Peserta Baru"
        />
        <button onClick={handleAddParticipant}>Tambah Peserta</button>
      </ParticipantForm>
      
      <ParticipantList>
        <h3>Daftar Peserta ({participants.length})</h3>
        <ul>
          {participants.map((participant, index) => (
            <li key={index}>{participant}</li>
          ))}
        </ul>
      </ParticipantList>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const RouletteWheel = styled.div<RouletteWheelProps>`
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: #f5f5f5;
  border: 8px solid #333;
  margin: 30px 0;
  overflow: hidden;
  transition: transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
  transform: rotate(${props => props.rotation}deg);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

const RouletteItem = styled.div<RouletteItemProps>`
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: 100% 100%;
  transform: rotate(${props => (props.index * 360 / props.itemCount)}deg) 
             skewY(${props => (90 - (360 / props.itemCount))}deg);
  background: ${props => `hsl(${props.index * (360 / props.itemCount)}, 70%, 70%)`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-align: center;
  padding-bottom: 100px;
  box-sizing: border-box;
  color: #333;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CenterPin = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  background: #333;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  &::after {
    content: '';
    position: absolute;
    top: -20px;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 20px solid red;
    transform: translateX(-50%);
  }
`;

const SpinButton = styled.button`
  padding: 12px 24px;
  font-size: 18px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 20px 0;
  transition: background 0.3s;
  
  &:hover {
    background: #45a049;
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const WinnerDisplay = styled.div`
  margin: 20px 0;
  text-align: center;
`;

const WinnerName = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #e91e63;
  margin: 10px 0;
  padding: 10px 20px;
  background: #f8f8f8;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const ParticipantForm = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
  
  input {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    flex-grow: 1;
  }
  
  button {
    padding: 8px 16px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background: #0b7dda;
    }
  }
`;

const ParticipantList = styled.div`
  width: 100%;
  max-width: 500px;
  margin-top: 20px;
  
  h3 {
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
  }
  
  ul {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    
    li {
      padding: 8px;
      background: #f5f5f5;
      border-radius: 4px;
    }
  }
`;

export default Roulette;