import React, { useState, useEffect } from 'react';
import './App.css';

// Mock data for candidates
const candidates = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Michael Johnson' },
];

// Mock data for engineers' availability
const engineerAvailability = {
  1: { // Engineer ID 1
    name: 'Alex Chen',
    slots: [
      '2025-05-12T09:00:00',
      '2025-05-12T10:00:00',
      '2025-05-12T11:00:00',
      '2025-05-13T14:00:00',
      '2025-05-13T15:00:00',
      '2025-05-14T10:00:00',
    ]
  },
  2: { // Engineer ID 2
    name: 'Sarah Williams',
    slots: [
      '2025-05-12T13:00:00',
      '2025-05-12T14:00:00',
      '2025-05-13T09:00:00',
      '2025-05-14T11:00:00',
      '2025-05-14T14:00:00',
    ]
  },
  3: { // Engineer ID 3
    name: 'David Kim',
    slots: [
      '2025-05-12T15:00:00',
      '2025-05-13T10:00:00',
      '2025-05-13T11:00:00',
      '2025-05-14T09:00:00',
      '2025-05-14T13:00:00',
    ]
  }
};

// Mock data for candidate availability
const candidateAvailability = {
  1: [ // Candidate ID 1
    '2025-05-12T09:00:00',
    '2025-05-12T10:00:00',
    '2025-05-13T14:00:00',
    '2025-05-14T10:00:00',
    '2025-05-14T11:00:00',
  ],
  2: [ // Candidate ID 2
    '2025-05-12T13:00:00',
    '2025-05-13T09:00:00',
    '2025-05-13T15:00:00',
    '2025-05-14T14:00:00',
  ],
  3: [ // Candidate ID 3
    '2025-05-12T15:00:00',
    '2025-05-13T10:00:00',
    '2025-05-14T09:00:00',
    '2025-05-14T13:00:00',
  ]
};

function App() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableEngineers, setAvailableEngineers] = useState([]);
  const [confirmation, setConfirmation] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Get days of the current week
  const getWeekDays = () => {
    const startDate = new Date(currentWeek);
    startDate.setDate(startDate.getDate() - startDate.getDay() + (startDate.getDay() === 0 ? -6 : 1)); // Start with Monday

    const days = [];
    for (let i = 0; i < 5; i++) { // Monday to Friday
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Generate time slots from 9 AM to 5 PM
  const generateTimeSlots = (date) => {
    const slots = [];
    const startTime = new Date(date);
    startTime.setHours(9, 0, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(18, 0, 0, 0);

    while (startTime < endTime) {
      slots.push(new Date(startTime));
      startTime.setMinutes(startTime.getMinutes() + 30);
    }

    return slots;
  };

  // Find common availability slots
  useEffect(() => {
    if (!selectedCandidate) return;

    const candidateSlots = candidateAvailability[selectedCandidate.id];
    const commonSlots = [];
    const engineersAvailable = {};

    // Check each engineer's availability against candidate's
    Object.entries(engineerAvailability).forEach(([engineerId, engineer]) => {
      engineer.slots.forEach(slot => {
        if (candidateSlots.includes(slot)) {
          commonSlots.push(slot);
          if (!engineersAvailable[slot]) {
            engineersAvailable[slot] = [];
          }
          engineersAvailable[slot].push(engineer);
        }
      });
    });
    //console.log("commonSlots", commonSlots);
    setAvailableSlots([...new Set(commonSlots)]);
    setAvailableEngineers(engineersAvailable);
  }, [selectedCandidate]);

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setConfirmation(null);
  };

  // Confirm interview
  const handleConfirm = () => {
    if (!selectedSlot || !selectedCandidate) return;

    const engineers = availableEngineers[selectedSlot];
    const randomEngineer = engineers[Math.floor(Math.random() * engineers.length)];

    setConfirmation({
      candidate: selectedCandidate.name,
      engineer: randomEngineer.name,
      date: new Date(selectedSlot).toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
  };

  // Navigate weeks
  const changeWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
    setSelectedSlot(null);
    setConfirmation(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Interview Scheduler</h1>
      </header>

      <main>
        <div className="candidate-selector">
          <label htmlFor="candidate">Select Candidate:</label>
          <select
            id="candidate"
            onChange={(e) => setSelectedCandidate(candidates.find(c => c.id === parseInt(e.target.value)))}
            value={selectedCandidate?.id || ''}
          >
            <option value="">-- Select a candidate --</option>
            {candidates.map(candidate => (
              <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
            ))}
          </select>
        </div>

        {selectedCandidate && (
          <div className="calendar-container">
            <div className="week-navigation">
              <button onClick={() => changeWeek('prev')}>Previous Week</button>
              <h2>Week of {currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h2>
              <button onClick={() => changeWeek('next')}>Next Week</button>
            </div>

            <div className="calendar">
              {getWeekDays().map((day, dayIndex) => (
                <div key={dayIndex} className="day-column">
                  <div className="day-header">
                    {day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>

                  {generateTimeSlots(day).map((timeSlot, slotIndex) => {
                    const slotString = timeSlot.toISOString().slice(0, -5);
                    const isAvailable = availableSlots.includes(slotString);
                    const isSelected = selectedSlot === slotString;
                    console.log("availableSlots", availableSlots, day);
                    //console.log("timeSlot", timeSlot);
                    console.log("slotString", slotString);
                    return (
                      <div
                        key={slotIndex}
                        className={`time-slot ${isAvailable ? 'available' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => isAvailable && handleSlotSelect(slotString)}
                      >
                        {timeSlot.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        {isAvailable && (
                          <div className="engineer-count">
                            {availableEngineers[slotString]?.length || 0} engineer(s) available
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSlot && (
          <div className="confirmation-section">
            <h3>Selected Time Slot:</h3>
            <p>
              {new Date(selectedSlot).toLocaleString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>

            <h4>Available Engineers:</h4>
            <ul>
              {availableEngineers[selectedSlot]?.map((engineer, index) => (
                <li key={index}>{engineer.name}</li>
              ))}
            </ul>

            <button onClick={handleConfirm}>Confirm Interview</button>
          </div>
        )}

        {confirmation && (
          <div className="confirmation-message">
            <h3>Interview Scheduled!</h3>
            <p><strong>Candidate:</strong> {confirmation.candidate}</p>
            <p><strong>Engineer:</strong> {confirmation.engineer}</p>
            <p><strong>Time:</strong> {confirmation.date}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
