// ParkingManagementSystem.js
import React, { useState } from "react";
import ParkingSlot from "./ParkingSlot";

const ParkingManagementSystem = () => {
  const initialSlots = Array.from({ length: 50 }, (_, index) => ({
    id: index,
    slotNo: index,
    allocated_to: null,
    allocated_time: null,
    free_up_time: null,
  }));

  const [slots, setSlots] = useState(initialSlots);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [inputName, setInputName] = useState("");
  const [inputPhno, setInputPhno] = useState("");
  const [isEditing, setIsEditing] = useState(-1);
  const [newAllocation, setNewAllocation] = useState(-1);
  const handleAddSlots = () => {
    const newSlots = Array.from({ length: 10 }, (_, index) => ({
      id: slots.length + index,
      slotNo: slots.length + index,
      allocated_to: null,
      allocated_time: null,
    }));
    setSlots([...slots, ...newSlots]);
  };
  const getNextAvailableSlot = () => {
    const nextAvailableSlot = slots.find((slot) => !slot.allocated_to);
    return nextAvailableSlot ? nextAvailableSlot.slotNo : null;
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    const selectedSlotData = slots[slot];
    if (isEditing !== -1) setIsEditing(-1);
    if (newAllocation !== -1) setNewAllocation(-1);
    if (selectedSlotData.allocated_to) {
      setInputName(selectedSlotData.allocated_to.name);
      setInputPhno(selectedSlotData.allocated_to.phno || "");
    } else {
      setInputName("");
      setInputPhno("");
    }
  };

  const handleAllocate = (slotNo, menuBookSlot = false) => {
    if (menuBookSlot) {
      setInputName("");
      alert("Please enter a name.");
      return;
    }

    if (inputName.trim() === "") {
      alert("Please enter a name.");
      return;
    }

    const updatedSlots = slots.map((slot) =>
      slot.slotNo === slotNo
        ? {
            ...slot,
            allocated_to: { name: inputName, phno: inputPhno },
            allocated_time: new Date(),
          }
        : slot
    );

    setSlots(updatedSlots);
    // setSelectedSlot(null);

    setInputName("");
    setInputPhno("");
    setNewAllocation(-1);
  };

  const handleFreeUp = (slotNo) => {
    // Calculate charge and display
    const allocate = slots[slotNo].allocated_time.toLocaleTimeString();
    const freeup = new Date().toLocaleTimeString();

    const startTime = slots[slotNo].allocated_time;
    const endTime = new Date();
    const timeDifferenceInMillis = endTime - startTime;

    const hours = Math.floor(timeDifferenceInMillis / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifferenceInMillis % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifferenceInMillis % (1000 * 60)) / 1000);

    const charge = hours * 10; // INR 10/hour
    const shouldProceed = window.confirm(
      `Parking charges: 10 Rupess per hour\nAlloted Time: ${allocate}\nFree Up time: ${freeup}\nYour time of usage: ${hours}:${minutes}:${seconds}\nParking charge for Slot ${slotNo}: ₹ ${charge}`
    );

    if (shouldProceed) {
      setInputName("");
      const updatedSlots = slots.map((slot) =>
        slot.slotNo === slotNo
          ? {
              ...slot,
              allocated_to: null,
              allocated_time: null,
            }
          : slot
      );
      setSlots(updatedSlots);
      setInputName("");
      setInputPhno("");
      const nextAvailableSlot = getNextAvailableSlot();
      if (nextAvailableSlot !== null) {
        setSelectedSlot(nextAvailableSlot);
      }
    }

    handleSlotClick(getNextAvailableSlot());
  };

  const handleEditUser = (slotNo) => {
    const selectedSlot = slots.find((slot) => slot.slotNo === slotNo);
    console.log("clicked on edit task", slotNo);
    if (!selectedSlot) {
      alert("Invalid slot.");
      return;
    }
    setIsEditing(slotNo);

    // handleSlotClick(slotNo);
  };
  const saveChanges = () => {
    const updatedSlots = slots.map((slot) =>
      slot.slotNo === selectedSlot
        ? {
            ...slot,
            allocated_to: { name: inputName, phno: inputPhno },
          }
        : slot
    );

    setSlots(updatedSlots);
    setIsEditing(-1);
    setNewAllocation(-1);
  };

  return (
    <div className="container">
      <div className="slotsArea">
        <h1>Parking Management System</h1>
        <div className="parking-lot">
          {slots.map((slot) => (
            <ParkingSlot
              key={slot.slotNo}
              slot={slot.slotNo}
              isOccupied={slot.allocated_to !== null}
              allocatedDetails={slot.allocated_to || {}}
              onSlotClick={() => handleSlotClick(slot.slotNo)}
              onAllocate={handleAllocate}
              onFreeUp={handleFreeUp}
              onEditUser={handleEditUser}
              setNewAllocation={setNewAllocation}
            />
          ))}
        </div>
      </div>
      <div className="dummy">
        <div className="mainFunc-div">
          {selectedSlot !== null && (
            <div>
              {/* ... (existing code) */}

              {isEditing === selectedSlot ? (
                <>
                  <h3>Slot No: {selectedSlot}</h3>
                  <h3>Edit User Details</h3>
                  <div className="input-container">
                    <div>
                      <label>Name:</label>
                      <input
                        type="text"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label>Phone:</label>
                      <input
                        type="text"
                        value={inputPhno}
                        onChange={(e) => setInputPhno(e.target.value)}
                      />
                    </div>
                    <button onClick={saveChanges}>Save Changes</button>
                  </div>
                </>
              ) : (
                <div className="slot-details">
                  <h3>Slot No: {selectedSlot}</h3>
                  {slots[selectedSlot].allocated_to && (
                    <div className="details-container">
                      <p>
                        <span>Allocated to:</span>{" "}
                        <span> {slots[selectedSlot].allocated_to.name}</span>
                      </p>
                      <p>
                        <span> Phone Number:</span>

                        <span>
                          {" "}
                          {slots[selectedSlot].allocated_to.phno || "N/A"}
                        </span>
                      </p>
                      <p>
                        <span> Allocated Time:</span>{" "}
                        <span>
                          {slots[selectedSlot].allocated_time.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {((selectedSlot !== null && !slots[selectedSlot].allocated_to) ||
            newAllocation !== -1) && (
            <>
              {newAllocation !== -1 ? <h3>Assign to new user</h3> : null}
              <div className="input-container">
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                  />
                </div>
                <div>
                  <label>Phone:</label>
                  <input
                    type="text"
                    value={inputPhno}
                    onChange={(e) => setInputPhno(e.target.value)}
                  />
                </div>

                <button onClick={() => handleAllocate(selectedSlot)}>
                  Allocate
                </button>
              </div>{" "}
            </>
          )}
          {getNextAvailableSlot() !== selectedSlot &&
          getNextAvailableSlot() !== null ? (
            <button
              onClick={() => {
                handleSlotClick(getNextAvailableSlot());
              }}
            >
              Go to available slot No: {getNextAvailableSlot()}
            </button>
          ) : null}
          {getNextAvailableSlot() === null ? (
            <button onClick={handleAddSlots}>
              no available slots add next 10 slots
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ParkingManagementSystem;
