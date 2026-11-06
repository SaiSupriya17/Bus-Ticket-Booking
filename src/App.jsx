
import React, { useState } from "react";

// SearchBar Component
function SearchBar({ onSearch }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  function handleSearch(e) {
    e.preventDefault();

    if (!from || !to || !date) {
      alert("Please enter all journey details!");
      return;
    }

    if (from.toLowerCase() === to.toLowerCase()) {
      alert("Source and destination cannot be the same!");
      return;
    }

    onSearch({ from, to, date });
  }

  return (
    <div className="search-section">
      <h2>🔍 Search Your Bus</h2>

      <form onSubmit={handleSearch} className="search-form">
        <div className="input-group">
          <label>From</label>
          <input
            type="text"
            placeholder="Enter Source"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>To</label>
          <input
            type="text"
            placeholder="Enter Destination"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Journey Date</label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button className="search-btn" type="submit">
          Search Buses
        </button>
      </form>
    </div>
  );
}

// BusList Component
function BusList({ buses, onSelectBus, searchResult }) {
  return (
    <div className="bus-section">
      <h2>🚌 Available Buses</h2>

      {searchResult && (
        <div className="route-info">
          <strong>{searchResult.from}</strong>
          <span> ➜ </span>
          <strong>{searchResult.to}</strong>
          <p>Journey Date: {searchResult.date}</p>
        </div>
      )}

      <div className="bus-list">
        {buses.map((bus) => (
          <div className="bus-card" key={bus.id}>
            <div className="bus-icon">🚌</div>

            <div className="bus-details">
              <h3>{bus.name}</h3>
              <p>{bus.type}</p>
              <p>Departure: {bus.time}</p>
              <p>Arrival: {bus.arrival}</p>
              <p>Available Seats: {bus.available}</p>
            </div>

            <div className="bus-price">
              <h3>₹{bus.price}</h3>
              <span>Per Seat</span>

              <button
                className="select-btn"
                onClick={() => onSelectBus(bus)}
              >
                Select Bus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SeatSelection Component
function SeatSelection({
  bus,
  selectedSeats,
  bookedSeats,
  onSeatClick,
  onConfirm,
  onBack
}) {
  const total = selectedSeats.length * bus.price;

  return (
    <div className="seat-section">
      <button className="back-btn" onClick={onBack}>
        ← Back to Buses
      </button>

      <h2>🎫 Select Your Seats</h2>

      <div className="selected-bus">
        <h3>{bus.name}</h3>
        <p>{bus.type}</p>
        <p>Departure: {bus.time}</p>
        <p>Arrival: {bus.arrival}</p>
        <p>Price per seat: ₹{bus.price}</p>
      </div>

      <h3 className="seat-heading">Choose Your Seats</h3>

      <div className="seat-legend">
        <span><i className="available"></i> Available</span>
        <span><i className="chosen"></i> Selected</span>
        <span><i className="booked"></i> Booked</span>
      </div>

      <div className="bus-layout">
        <div className="driver">
          <span>🚍 Driver</span>
          <span>Steering</span>
        </div>

        <div className="seat-grid">
          {Array.from({ length: 20 }, (_, index) => {
            const seatNumber = index + 1;
            const isBooked = bookedSeats.includes(seatNumber);
            const isSelected = selectedSeats.includes(seatNumber);

            return (
              <button
                key={seatNumber}
                disabled={isBooked}
                onClick={() => onSeatClick(seatNumber)}
                className={`seat ${
                  isBooked
                    ? "booked"
                    : isSelected
                    ? "chosen"
                    : "available"
                }`}
              >
                {seatNumber}
              </button>
            );
          })}
        </div>
      </div>

      <div className="booking-summary">
        <h3>Booking Summary</h3>

        <p>
          Selected Seats:{" "}
          {selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "None"}
        </p>

        <p>Number of Seats: {selectedSeats.length}</p>

        <h2>Total Amount: ₹{total}</h2>

        <button
          className="confirm-btn"
          onClick={onConfirm}
          disabled={selectedSeats.length === 0}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="footer">
      <h2>🚌 Bus Booking</h2>
      <p>Book your bus tickets easily and travel comfortably.</p>
      <p>Contact: support@busbooking.com</p>
      <p>© 2026 Bus Ticket Booking. All Rights Reserved.</p>
    </footer>
  );
}

// Main App Component
function App() {
  const [buses] = useState([
    {
      id: 1,
      name: "APSRTC Express",
      type: "Non AC Seater",
      time: "08:00 AM",
      arrival: "02:00 PM",
      price: 450,
      available: 20
    },
    {
      id: 2,
      name: "Orange Travels",
      type: "AC Sleeper",
      time: "09:30 PM",
      arrival: "05:30 AM",
      price: 750,
      available: 20
    },
    {
      id: 3,
      name: "VRL Travels",
      type: "AC Seater",
      time: "10:00 PM",
      arrival: "06:00 AM",
      price: 600,
      available: 20
    }
  ]);

  const [searchResult, setSearchResult] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState({
    1: [3, 7],
    2: [2, 8, 12],
    3: [5, 10]
  });
  const [confirmation, setConfirmation] = useState(null);

  // Search buses
  function handleSearch(details) {
    setSearchResult(details);
    setSelectedBus(null);
    setSelectedSeats([]);
    setConfirmation(null);
  }

  // Select bus
  function handleSelectBus(bus) {
    setSelectedBus(bus);
    setSelectedSeats([]);
    setConfirmation(null);
  }

  // Select or deselect seats
  function handleSeatClick(seatNumber) {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(
        selectedSeats.filter((seat) => seat !== seatNumber)
      );
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  }

  // Confirm booking
  function handleConfirm() {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }

    const newBooking = {
      bus: selectedBus.name,
      seats: [...selectedSeats],
      total: selectedSeats.length * selectedBus.price,
      route: searchResult
    };

    setBookedSeats((previous) => ({
      ...previous,
      [selectedBus.id]: [
        ...(previous[selectedBus.id] || []),
        ...selectedSeats
      ]
    }));

    setConfirmation(newBooking);
    setSelectedSeats([]);
  }

  return (
    <div className="app">

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        body {
          background: #f2f5fa;
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          background: #123b65;
          color: white;
          padding: 25px 8%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .header h1 {
          font-size: 28px;
        }

        .header p {
          margin-top: 7px;
          color: #dce9f7;
        }

        .main-content {
          width: 90%;
          max-width: 1100px;
          margin: 35px auto;
          flex: 1;
        }

        .search-section,
        .bus-section,
        .seat-section {
          background: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.07);
        }

        h2 {
          color: #123b65;
          margin-bottom: 22px;
        }

        .search-form {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .input-group label {
          font-weight: bold;
          color: #333;
        }

        .input-group input {
          padding: 13px;
          border: 1px solid #ccd4df;
          border-radius: 7px;
          width: 100%;
          font-size: 14px;
        }

        .search-btn,
        .select-btn,
        .confirm-btn,
        .back-btn {
          border: none;
          padding: 13px 18px;
          border-radius: 7px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }

        .search-btn {
          grid-column: 1 / -1;
          background: #1478c8;
          color: white;
          font-size: 16px;
        }

        .search-btn:hover,
        .select-btn:hover {
          background: #0c5795;
        }

        .route-info {
          padding: 15px;
          background: #e8f3ff;
          color: #123b65;
          border-radius: 8px;
          margin-bottom: 20px;
          line-height: 1.8;
        }

        .bus-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .bus-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 20px;
          border: 1px solid #e0e5ed;
          border-radius: 10px;
          transition: 0.3s;
        }

        .bus-card:hover {
          border-color: #1478c8;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transform: translateY(-3px);
        }

        .bus-icon {
          font-size: 38px;
        }

        .bus-details {
          flex: 1;
        }

        .bus-details h3 {
          color: #123b65;
          margin-bottom: 8px;
        }

        .bus-details p {
          color: #666;
          font-size: 14px;
          margin-top: 6px;
        }

        .bus-price {
          text-align: right;
        }

        .bus-price h3 {
          color: #16834b;
          font-size: 22px;
          margin-bottom: 5px;
        }

        .bus-price span {
          color: #777;
          font-size: 12px;
        }

        .select-btn {
          display: block;
          background: #1478c8;
          color: white;
          margin-top: 12px;
        }

        .back-btn {
          background: #e8f3ff;
          color: #123b65;
          margin-bottom: 20px;
        }

        .selected-bus {
          background: #e8f3ff;
          padding: 18px;
          border-radius: 9px;
          color: #123b65;
          line-height: 1.8;
        }

        .seat-heading {
          margin-top: 25px;
          text-align: center;
        }

        .seat-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          margin: 20px 0;
        }

        .seat-legend span {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
        }

        .seat-legend i {
          display: inline-block;
          width: 17px;
          height: 17px;
          border-radius: 4px;
        }

        .available {
          background: #d8f5df;
          color: #167b36;
          border: 1px solid #28a745;
        }

        .chosen {
          background: #ff9f43;
          color: white;
          border: 1px solid #e67e22;
        }

        .booked {
          background: #d1d5db;
          color: #777;
          border: 1px solid #aaa;
        }

        .bus-layout {
          max-width: 350px;
          margin: 0 auto;
          padding: 20px;
          border: 2px solid #ccd4df;
          border-radius: 18px;
          background: #f8fafc;
        }

        .driver {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          border-bottom: 2px dashed #ccd4df;
          margin-bottom: 20px;
          color: #123b65;
          font-weight: bold;
        }

        .seat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          justify-items: center;
        }

        .seat {
          width: 48px;
          height: 45px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          font-size: 14px;
        }

        .seat:disabled {
          cursor: not-allowed;
        }

        .booking-summary {
          background: #f2f5fa;
          padding: 22px;
          margin-top: 25px;
          border-radius: 10px;
          line-height: 2;
          text-align: center;
        }

        .booking-summary h3 {
          color: #123b65;
        }

        .booking-summary h2 {
          color: #16834b;
          margin: 10px 0;
        }

        .confirm-btn {
          background: #16834b;
          color: white;
          width: 100%;
          font-size: 16px;
          margin-top: 12px;
        }

        .confirm-btn:hover {
          background: #106536;
        }

        .confirm-btn:disabled {
          background: #999;
          cursor: not-allowed;
        }

        .success-message {
          background: #e0f7e9;
          color: #167b36;
          border: 1px solid #8bd6a3;
          border-radius: 10px;
          padding: 22px;
          margin-top: 20px;
          line-height: 2;
        }

        .success-message h2 {
          color: #167b36;
        }

        .footer {
          background: #123b65;
          color: white;
          text-align: center;
          padding: 25px 15px;
          margin-top: auto;
        }

        .footer h2 {
          color: white;
          margin-bottom: 10px;
        }

        .footer p {
          font-size: 13px;
          color: #dce9f7;
          margin-top: 8px;
        }

        @media(max-width: 700px) {
          .search-form {
            grid-template-columns: 1fr;
          }

          .header {
            padding: 20px;
          }

          .main-content {
            width: 94%;
          }

          .search-section,
          .bus-section,
          .seat-section {
            padding: 18px;
          }

          .bus-card {
            flex-wrap: wrap;
          }

          .bus-price {
            width: 100%;
            text-align: left;
          }

          .seat-grid {
            gap: 10px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div>
          <h1>🚌 Bus Ticket Booking</h1>
          <p>Your Journey, Our Responsibility!</p>
        </div>
        <h3>Travel Safely ✨</h3>
      </header>

      {/* Main Content */}
      <main className="main-content">

        <SearchBar onSearch={handleSearch} />

        {confirmation ? (
          <div className="success-message">
            <h2>✅ Booking Confirmed!</h2>
            <p>Bus: {confirmation.bus}</p>
            <p>
              Route: {confirmation.route.from} to{" "}
              {confirmation.route.to}
            </p>
            <p>Date: {confirmation.route.date}</p>
            <p>Seats: {confirmation.seats.join(", ")}</p>
            <h3>Total Amount: ₹{confirmation.total}</h3>

            <button
              className="search-btn"
              onClick={() => {
                setConfirmation(null);
                setSelectedBus(null);
                setSelectedSeats([]);
              }}
            >
              Book Another Ticket
            </button>
          </div>
        ) : selectedBus ? (
          <SeatSelection
            bus={selectedBus}
            selectedSeats={selectedSeats}
            bookedSeats={bookedSeats[selectedBus.id] || []}
            onSeatClick={handleSeatClick}
            onConfirm={handleConfirm}
            onBack={() => {
              setSelectedBus(null);
              setSelectedSeats([]);
            }}
          />
        ) : (
          <BusList
            buses={buses}
            onSelectBus={handleSelectBus}
            searchResult={searchResult}
          />
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;
