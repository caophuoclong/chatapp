import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "Welcome": "Welcome to React and react-i18next",
      "Language": "Language",
      "Theme": "Theme",
      "Search": "Search",
      "LastActive": (time: string)=> `Active ${time} ago`,
      "Active": "Active now",
      "Option": "Options",
      "Setting": "Settings",
      "Contact": "Contacts",
      "Gender": "Gender",
      "DOB": "DOB",
      "Phone": "Phone",
      "Male": "Male", 
      "Female" :"Female",
      "Edit": "Edit",
      "Accept": "Accept",
      "Decline": "Decline",
      "Cancel": "Cancel",
      "Close": "Close",
      "AddFriend": "Add friend",
      "Username": "Username",
      "Password": "Password",
      "Message": "Message",
      "PersonalInfo": "Personal Info",
      "ShareContact": "Share Contact",
      "CommonGroup": "Common Group",
      "Report": "Report",
      "Block": "Block",
      "Search_second": "Search"

    }
  },
  vn: {
    translation: {
      "Welcome": "Chao mung ban den voi react-i18next",
      "Language": "Ngon ngu",
      "Theme": "Giao dien",
      "Search": "Tim kiem",
      "LastActive": (time: string)=> `Hoat dong ${time} truoc`,
      "Active": "Dang hoat dong",
      "Option": "Tuy chon",
      "Setting": "Cai Dat",
      "Contact": "Danh Ba",
      "Gender": "Gioi tinh",
      "DOB": "Ngay sinh",
      "Phone": "So dien thoai",
      "Male": "Nam", 
      "Female" :"Nu",
      "Edit": "Chinh sua",
      "Accept": "Dong y",
      "Decline": "Huy",
      "Cancel": "Huy",
      "Close": "Dong",
      "AddFriend": "Them Ban",
      "Username": "Ten dang nhap",
      "Password": "Mat khau",
      "Message": "Nhan tin",
      "PersonalInfo": "Thong tin ca nhan",
      "ShareContact": "Chia se danh ba",
      "CommonGroup": "Nhom chung",
      "Report": "Bao cao",
      "Block": "Chan",
      "Search_second": "Tim"
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;