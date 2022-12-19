import moment from "moment";
import * as yup from "yup";
import i18n from "~/i18n";
const {t} = i18n;
export const schema = yup.object().shape({
    email: yup
      .string()
      .email(t('Invalid__Email'))
      .required(t('Email__Required')),
    name: yup.string().required(t('Name__Required')),
    date: yup
      .number()
      .typeError(t('Date__Required'))
      .required(t('Date__Required'))
      .test('is-date', t('Date__29'), function (value) {
        const month = this.parent.month;
        const year = this.parent.year;
        const isLeapYear = moment(year).isLeapYear();
        if (month < 1 || month > 12) return true;
        if (month === 2 && value) {
          if (isLeapYear) {
            return +value <= 29;
          }
          return +value <= 28;
        }
        return true;
      })
      .test('is-31', t('Date__31'), function (value) {
        const month = this.parent.month;
        if (
          (month === 1 ||
            month === 3 ||
            month === 5 ||
            month === 7 ||
            month === 8 ||
            month === 10 ||
            month === 12) &&
          value
        ) {
          return +value <= 31;
        }
        return true;
      })
      .test('is-30', t('Date__30'), function (value) {
        const month = this.parent.month;
        if (
          (month === 4 || month === 6 || month === 9 || month === 11) &&
          value
        ) {
          return +value <= 30;
        }
        return true;
      }),
    month: yup
      .number()
      .typeError(t('Month__Required'))
      .required(t('Month__Required'))
      .max(12)
      .min(1),
    year: yup
      .number()
      .typeError(t('Year__Required'))
      .required(t('Year__Required'))
      .max(new Date().getFullYear() - 1, t('Year__Max'))
      .min(1900, t('Year__Min')),
    phone: yup
      .string()
      .test('is-phone', t('Phone__Invalid'), function (value) {
        const reg = new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/);
        if (value) {
          return reg.test(value);
        }
        return true;
      })
      .nullable(),
  });