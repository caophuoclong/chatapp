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
      "Search_second": "Search",
      "Login": "Login",
      "Register": "Register",
      "Details__Login": "Please enter your username and password",
      "Forgot__Password": "Forgot password?",
      "Not__Registered": "Not a member yet? ",
      "Already__User": "Already a user?",
      "Confirm__Password": "Confirm password",
      "IsExist": (t: string)=> `${t} is already exist`,
      "Success__Register": "Register success",
      "Error__Register": "Register error",
      "Error": "Error",
      "Friends": "Friends",
      "Info__Conversation": "Info conversation",
      "Show__Info": "Show info",
      "Delete__Friend": "Delete friend",

    }
  },
  vn: {
    translation: {
      "Welcome": "Chao mung ban den voi react-i18next aw",
      "Language": "Ngôn ngữ",
      "Theme": "Giao diện",
      "Search": "Tìm kiếm",
      "LastActive": (time: string)=> `Hoạt động ${time} trước`,
      "Active": "Đang hoạt động",
      "Option": "Tùy chọn",
      "Setting": "Cài Đặt",
      "Contact": "Danh bạ",
      "Gender": "Giới tính",
      "DOB": "Ngày sinh",
      "Phone": "Số điện thoại",
      "Male": "Nam", 
      "Female" :"Nữ",
      "Edit": "Chỉnh sửa",
      "Accept": "Đồng ý",
      "Decline":"Huỷ",
      "Cancel": "Huỷ",
      "Close": "Đóng",
      "AddFriend": "Thêm bạn",
      "Username": "Tên đăng nhập",
      "Password": "Mật khẩu",
      "Message": "Nhắn tin",
      "PersonalInfo": "Thông tin cá nhân",
      "ShareContact": "Chia sẻ người dùng",
      "CommonGroup": "Nhóm chung",
      "Report": "Báo cáo",
      "Block": "Chặn",
      "Search_second": "Tìm",
      "Login": "Đăng nhập",
      "Details__Login": "Vui lòng nhập tên đăng nhập và mật khẩu",
      "Register": "Đăng ký",
      "Forgot__Password": "Quên mật khẩu?",
      "Not__Registered": "Bạn chưa đăng ký? ",
      "Already__User": "Bạn đã có tài khoản?",
      "Confirm__Password": "Nhập lại mật khẩu",
      "IsExist": (t: string)=> `${t} đã tồn tại`,
      "Success__Register": "Đăng ký thành công",
      "Error__Register": "Đăng ký thất bại",
      "Error": "Lỗi",
      "Friends": "Bạn bè",
      "Info__Conversation": "Thông tin cuộc hội thoại",
      "Show__Info": "Xem thông tin",
      "Delete__Friend": "Xóa bạn",
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