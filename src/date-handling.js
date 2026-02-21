import { parse, isBefore, startOfToday, isValid, differenceInCalendarDays } from "date-fns";

class dateHandler {
    constructor(dueDateInput) {
        this.date = this.parseDate(dueDateInput);
    }

    parseDate(input) {
        if (!input) return null;

        const parsed = parse(input, "dd-MM-yyyy", new Date());

        if (!isValid(parsed)) {
            console.error("Invalid date format");
            return null;
        }

        return parsed;
    }

    isPastDate() {
        if (!this.date) return false;
        return isBefore(this.date, startOfToday());
    }

    getValidatedDate() {
        if (!this.date) return null;
        if (this.isPastDate()) {
            console.warn("Date is in the past");
            return null;
        }
        return this.date;
    }

    daysUntilDue() {
        if (!this.date) return null;
        console.log(this.date)
        const today = new Date();
        return differenceInCalendarDays(this.date, today);
    }

    dueDateString() {
        const days = this.daysUntilDue();
        if (days === null) return "";
        if (days > 1) return `Due in ${days} days`;
        if (days === 1) return "Due tomorrow";
        if (days === 0) return "Due today";
        if (days === -1) return "Overdue by 1 day";
        return `Overdue by ${Math.abs(days)} days`;
    }
}

export { dateHandler };