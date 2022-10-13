import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const maxYear = new Date().getFullYear() - 1;
const minYear = 1900;
const resources = {
  en: {
    translation: {
      "Welcome": "Welcome to React and react-i18next",
      "Language": "Language",
      "Theme": "Theme",
      "Search": "Search",
      "LastActive": (time: string)=> `Active ${time}`,
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
      "Send__Request__Success": "Send request success",
      "Send__Request__Fail": "Send request fail",
      "Friends__Request": "Friends request",
      "Reject": "Reject",
      "Went__wrong": "Something went wrong, please try again!",
      "Accept__Success": "Accept friend success",
      "Reject__Success": "Reject friend success",
      "Password__NotMatch": "Username or password not match",
      "Waitting": "Waitting",
      "Pending": "Pending",
      "Group": "Group",
      "Other": "Other",
      "Logout": "Logout",
      "Confirm__Logout": "Logout of this account?",
      "Success": "Success",
      "Sucess__Login": "Login successfully!",
      "Create__New__Group": "Create new group",
      "Group__Joined": "Joined groups",
      "Set__Group__Name": "Set group name",
      "New__Group": "New Group",
      "Fail": "Fail",
      "Create__Group__Fail": "Create group fail",
      "Create__Group__Success": "Create group success",
      "Find__Your__Account":"Find your account",
      "Find__Your__Account__Detail":"Please enter your email to find your account",
      "Send": "Send",
      "Invalid__Email": "Invalid Email",
      "Detail__Recover__Email": "An recover email was sent to you!",
      "Reset__Password": "Reset Password",
      "New__Password": "New Password",
      "Reset": "Reset",
      "At__Least__8": "At least 8 characters",
      "At__Least__Upper": "Include at least one uppercase letter",
      "At__Least__Num": "Include at least one number",
      "At__Least__Special": "Include at least one special charater (!@#$%&*)",
      "Password__Doesnot__Match": "Confirm password does not match",
      "Password__Matched": "Confirm password matched",
      "Email__Not__Exist": "Email does not exist",
      "Sent": "Sent",
      "Received": "Received",
      "Sending": "Sending",
      "Seen": "Seen",
      "Invalid__Password": "Invalid password",
      "Username__Required": "Username is required",
      "Password__Required": "Password is required",
      "Email__Required": "Email is required",
      "Request": "Request",
      "Year__Required": "Year is required",
      "Month__Required": "Month is required",
      "Date__Required": "Day is required",
      "Year__Max": `Year must be less than ${maxYear}`,
      "Year__Min": `Year must be greater than ${minYear}`,
      "Month__Max": "Month must be less than 12",
      "Month__Min": "Month must be greater than 0",
      "Day__Max": "Day must be less than 31",
      "Day__Min": "Day must be greater than 0",
      "Show__info": "Show info",
      "Date__30": "Date must be less than 30",
      "Date__31": "Date must be less than 31",
      "Date__29": "Date must be less than 29",
      "Phone__Invalid": "Phone number is invalid",
      "Success__Update__Info": "Update info success",
      "Fail__Update__Info": "Update info fail",
      "User__Not__Found": "User not found",
      "Display__Name": "Display name",
      "Required": "Required",
      "Back__To__Login": "Back to login",
      "Thanks__Title": "Verify your email successfully!",
      "Thanks__Content": "Your account has been verified successfully. Please login to continue.",
      "Thanks__Title__Error": "Something went wrong!",
      "Thanks__Content__Error": "Your account has been verified unsuccessfully or it has verified. Please try again.",
      "Notify__SentEmail": (email: string)=>`A verification email has been sent to ${email}. Please check your email to verify your account before you sign in.`,
      "Notify__Sent__Recover__Password": `A recover password email has been sent to your email. Please check your email to recover your password.`,
      "Not__Active": "Your account is not active. Please check your email to verify your account before you sign in.",
      "Member": "Member",
      "Members": "Members",
      "Confirm__Change__Group__Name": "Are you sure you want to change the group name? When you change the group name, all members will be notified when you confirm.",
      "Change__Group__Name": "Change group name",
      "Confirm" : "Confirm",
      "Update__Group__Name__Successfully": "Update group name successfully",
      "Update__Group__Name__Fail": "Update group name fail",
      "Change__Avatar": "Change avatar",
      "Remove__Avatar": "Remove avatar",
      "Emoji__Settings": "Emoji setting",
      "Emoji__Settings__Detail": "You can change the emoji for this chat"
    }
  },
  vn: {
    translation: {
      "Welcome": "Chao mung ban den voi react-i18next aw",
      "Language": "Ngôn ngữ",
      "Theme": "Giao diện",
      "Search": "Tìm kiếm",
      "LastActive": (time: string)=> `Hoạt động ${time}`,
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
      "Send__Request__Success": "Gửi yêu cầu thành công",
      "Send__Request__Fail": "Gửi yêu cầu thất bại",
      "Friends__Request": "Lời mời kết bạn",
      "Reject": "Từ chối",
      "Went__wrong": "Có lỗi xảy ra, vui lòng thử lại!",
      "Accept__Success": "Đồng ý kết bạn thành công",
      "Reject__Success": "Từ chối kết bạn thành công",
      "Password__NotMatch": "Tên đăng nhập hoặc mật khẩu không đúng",
      "Waitting": "Đang chờ",
      "Pending": "Đang chờ",
      "Group": "Nhóm",
      "Other": "Khác",
      "Logout": "Đăng xuất",
      "Confirm__Logout": "Đăng xuất khỏi tài khoản này?",
      "Success": "Thành công",
      "Success__Login": "Đăng nhập thành công!",
      "Create__New__Group": "Tạo nhóm mới",
      "Group__Joined": "Nhóm đang tham gia",
      "Set__Group__Name": "Tên nhóm",
      "New__Group": "Nhóm mới",
      "Fail": "Thất bại",
      "Create__Group__Fail": "Tạo nhóm thất bại",
      "Create__Group__Success": "Tạo nhóm thành công",
      "Find__Your__Account":"Tìm tài khoản của bạn",
      "Find__Your__Account__Detail":"Vui lòng nhập email của bạn để tìm kiếm tài khoản",
      "Send": "Gửi",
      "Invalid__Email": "Email chưa hợp lệ",
      "Detail__Recover__Email": "Email khôi phục mật khẩu đã được gửi đến email của bạn!",
      "Reset__Password": "Khôi phục mật khẩu",
      "New__Password": "Mật khẩu mới",
      "Reset": "Đặt lại",
      "At__Least__8": "Tối thiểu 8 ký tự",
      "At__Least__Upper": "Bao gồm ít nhất 1 ký tự hoa",
      "At__Least__Num": "Bao gồm ít nhất 1 số",
      "At__Least__Special": "Bao gồm ít nhất 1 ký tự đặc biệt (!@#$%&*)",
      "Password__Doesnot__Match": "Mật khẩu chưa trùng khớp",
      "Password__Matched": "Mật khẩu trùng khớp",
      "Email__Not__Exist": "Email không tồn tại",
      "Sent": "Đã gửi",
      "Received": "Đã nhận",
      "Sending": "Đang gửi",
      "Seen": "Đã xem",
      "Username__Required": "Tên đăng nhập không được để trống",
      "Password__Required": "Mật khẩu không được để trống",
      "Email__Required": "Email không được để trống",
      "Request": "Lời mời",
      "Year__Required": "Năm sinh không được để trống",
      "Month__Required": "Tháng sinh không được để trống",
      "Date__Required": "Ngày sinh không được để trống",
      "Year__Max": `Năm phải nhỏ hơn ${maxYear}`,
      "Year__Min": `Năm tối thiểu ${minYear}`,
      "Month__Max": "Tháng phải nhỏ hơn 12",
      "Month__Min": "Tháng phải tối thiểu 1",
      "Day__Max": "Ngày phải nhỏ hơn 31",
      "Day__Min": "Ngày phải tối thiểu 1",
      "Show__info": "Hiển thị thông tin",
      "Date__30": "Phải nhỏ hơn 30",
      "Date__31": "Phải nhỏ hơn 31",
      "Date__29": "Phải nhỏ hơn 29",
      "Phone__Invalid": "Số điện thoại không hợp lệ",
      "Success__Update__Info": "Cập nhật thông tin thành công",
      "Fail__Update__Info": "Cập nhật thông tin thất bại",
      "User__Not__Found": "Không tìm thấy người dùng",
      "Display__Name": "Tên hiển thị",
      "Invalid__Password": "Mật khẩu không hợp lệ",
      "Required": "Không được để trống",
      "Back__To__Login": "Trở về trang đăng nhập",
      "Thanks__Title": "Xác nhận thành công",
      "Thanks__Content": "Tài khoản của bạn đã được xác nhận thành công. Bạn có thể đăng nhập ngay bây giờ",
      "Thanks__Title__Error": "Có lỗi xảy ra!",
      "Thanks__Content__Error": "Xác thực tài khoản không thành công hoặc tài khoản đã được xác thực. Vui lòng thử lại",
      "Notify__SentEmail": (email: string) => `Một email xác nhận đã được gửi đến ${email}. Vui lòng kiểm tra email để xác nhận tài khoản trước khi đăng nhập`,
      "Notify__Sent__Recover__Password": "Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra email để đặt lại mật khẩu",
      "Not__Active": "Tài khoản chưa được kích hoạt, vui lòng kiểm tra email để kích hoạt tài khoản",
      "Members": "Thành viên",
      "Member": "Thành viên",
      "Confirm__Change__Group__Name": "Bạn có chắc chắn muốn đổi tên nhóm không? Tất cả các thành viên trong nhóm sẽ nhận được thông báo khi bạn xác nhận.",
      "Change__Group__Name": "Đổi tên nhóm",
      "Confirm": "Xác nhận",
      "Update__Group__Name__Successfully": "Đổi tên nhóm thành công",
      "Update__Group__Name__Fail": "Đổi tên nhóm thất bại",
      "Change__Avatar": "Đổi ảnh đại diện",
      "Remove__Avatar": "Xóa ảnh đại diện",
      "Emoji__Settings": "Thay đổi biểu tượng cảm xúc",
      "Emoji__Settings__Detail": "Bạn có thể thay đổi biểu tượng cảm xúc cho nhóm này",
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