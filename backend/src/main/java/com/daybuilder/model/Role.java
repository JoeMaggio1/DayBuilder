package com.daybuilder.model;

// DAYB-88: The two roles a DayBuilder user can have.
// Stored in the database as text ("USER" / "ADMIN"), not as a number.
public enum Role {
    USER,
    ADMIN
}
