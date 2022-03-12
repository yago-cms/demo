import { useState } from "react";

export const getDateString = (date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, -8);
};