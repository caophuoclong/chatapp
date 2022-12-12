import moment from "moment"
import i18n from "~/i18n";
export const dailyFromNow = (timestamp: number)=>{
    const x = {
        sameDay: `HH:mm [${i18n.t("Today")}]`,
        lastDay: `HH:mm [${i18n.t("Yesterday")}]`,
        lastWeek: `dddd, HH:mm DD/MM/YYYY`,
        sameElse: 'HH:mm DD/MM/YYYY'
    }
    return moment(timestamp).calendar(null, x)
}