// ParkingSlot.js
import React, { useRef, useState } from "react";
import { useEffect } from "react";

const ParkingSlot = ({
  slot,
  isOccupied,
  onSlotClick,
  onAllocate,
  onFreeUp,
  allocatedDetails,
  onEditUser,
  setNewAllocation,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = () => {
    onSlotClick(slot);
    setShowMenu(false);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation(); // Prevents the click event from reaching the handleClick function
    setShowMenu(!showMenu);
  };

  const handleEditUser = () => {
    onEditUser(slot);
    setShowMenu(false);
  };
  const componentRef = useRef(null);

  const handleClickOutside = (event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      // Clicked outside the component
      setShowMenu(false);
    }
  };

  useEffect(() => {
    // Attach the event listener on component mount
    document.addEventListener("mousedown", handleClickOutside);

    // Detach the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      className="parking-slot-container"
      onClick={handleClick}
      ref={componentRef}
    >
      <div className={`parking-slot ${isOccupied ? "occupied" : "available"}`}>
        {isOccupied ? (
          <div className="slot-details">
            <p>Slot {slot} (Occupied)</p>
            <p>
              <span>Allocated to: </span>
              <span>{allocatedDetails.name}</span>
            </p>

            <p>click to view more details</p>
          </div>
        ) : (
          `Slot ${slot} (Available)`
        )}
      </div>

      <div className="menu-button" onClick={handleMenuClick}>
        &#8942; {/* Vertical ellipsis character */}
      </div>

      {showMenu && (
        <div className="slot-menu">
          {isOccupied ? (
            <>
              <button onClick={() => handleEditUser(slot)}>
                Edit User Details
              </button>
              <button onClick={() => setNewAllocation(slot)}>
                Allocate to Other Person
              </button>
              <button onClick={() => onFreeUp(slot)}>Free Up Slot</button>
            </>
          ) : (
            <button onClick={() => onAllocate(slot, true)}>Book Slot</button>
          )}
        </div>
      )}
    </div>
  );
};

export default ParkingSlot;
