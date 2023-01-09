export const mailBody = (url: string, name: string): IMail => {
  return {
    vn: {
      recoveryPassword: `<p>Xin chào <b>${name}</b>,</p>
    <p>Bạn nhận được email này bởi vì chúng tôi nhận được yêu cầu đặt lại mật
      khẩu của bạn.
    </p>
    <div class='container'>
      <a
        href='${url}'
        style='
                    display: inline-block;
                    background-color: #2563EB; /* Green */
                    border: none;
                    color: white;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius: 5px;
                    '
      >Đặt lại</a>
    </div>

    <p>Nếu bạn không thực hiện hành động này vui lòng bỏ qua email.</p>
    <p>Thân chào,</p>
    <p>Bebes's team</p>`,
      confirmation: `
        <p>Xin chào <b>${name}</b>,</p>
    <p>Vui lòng nhấn vào nút phía dưới để xác thực tài khoản!</p>
    <div class='container'>
      <a
        href='${url}'
        style='
                      display: inline-block;
                      background-color: #2563EB; /* Green */
                      border: none;
                      color: white;
                      padding: 15px 32px;
                      text-align: center;
                      text-decoration: none;
                      display: inline-block;
                      font-size: 16px;
                      border-radius: 5px;
                      '
      >Confirm</a>
    </div>

    <p>Nếu không phải bạn đăng ký, vui lòng bỏ qua thư này</p>
    <p>Thân chào,</p>
    <p>Bebes's team</p>`,
    },
    en: {
      confirmation: `
         <p>Hello <b>${name}}</b>,</p>
    <p>Please click below to confirm your email</p>
    <div class='container'>
      <a
        href='${url}'
        style='
                    display: inline-block;
                    background-color: #2563EB; /* Green */
                    border: none;
                    color: white;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius: 5px;
                    '
      >Confirm</a>
    </div>

    <p>If you did not create an account, no further action is required.</p>
    <p>Regard,</p>
    <p>Bebes's team</p>
        `,
      recoveryPassword: `<p>Hello <b>${name}</b>,</p>
    <p>You are receiving this email because we received a password reset request
      for your account.
    </p>
    <div class='container'>
      <a
        href='${url}'
        style='
                    display: inline-block;
                    background-color: #2563EB; /* Green */
                    border: none;
                    color: white;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius: 5px;
                    '
      >Reset</a>
    </div>

    <p>If you did not request a password reset, no further action is required.</p>
    <p>Regard,</p>
    <p>Bebes's team</p>`,
    },
  };
};

export const mailSubject = (): IMail => {
  return {
    en: {
      confirmation: "'Welcome to Bebes! Confirm your email'",
      recoveryPassword: 'Recovery your password email from Bebes Chat',
    },
    vn: {
      confirmation: 'Chào mừng bạn đến với Bebes! Xác nhận email của bạn',
      recoveryPassword: 'Khôi phục mật khẩu email từ Bebes Chat',
    },
  };
};

export interface IMail {
  en: {
    confirmation: string;
    recoveryPassword: string;
  };
  vn: {
    confirmation: string;
    recoveryPassword: string;
  };
}

export enum FriendShipFlag {
  SENDER = "sender",
  TARGET = "target"

}