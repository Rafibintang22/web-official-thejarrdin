import { UserOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Input } from "antd";
import { threelogo } from "../../public/assets/images";
import { useState } from "react";

function Login() {
  const [noTelp, setNoTelp] = useState("");
  const [otp, setOtp] = useState("");
  const handleChangeNoTelp = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      setNoTelp(inputValue);
    }
  };

  const handleChangeOtp = (e) => {
    const { value: inputValue } = e;
    const reg = /^-?\d*(\.\d*)?$/;

    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      console.log(inputValue);
      setOtp(inputValue);
    }
  };

  const listOfStep = [
    {
      judul: "Insert noTelp",
      urut: 1,
    },
    {
      judul: "Insert otp",
      urut: 2,
    },
  ];

  const [isActiveStep, setActiveStep] = useState(1);
  const formStepDisplay = () => {
    if (isActiveStep === 1) {
      return (
        <ConfigProvider
          theme={{
            token: {
              colorTextPlaceholder: "#b6b6b6",
            },
          }}
        >
          <Input
            size="large"
            className="bg-transparent text-light"
            placeholder="no telepon"
            prefix={<UserOutlined />}
            onChange={(e) => handleChangeNoTelp(e)}
            value={noTelp}
          />
        </ConfigProvider>
      );
    } else if (isActiveStep === 2) {
      return (
        <>
          <div className="d-flex flex-column justify-content-center">
            <p className="text-light" style={{ fontSize: "0.9rem" }}>
              Masukan kode yang dikirimkan melalui Whattsap anda
            </p>
            <p className="text-light" style={{ fontSize: "0.8rem" }}>
              Waktu anda untuk memasukan kode ( 04 : 58 )
            </p>
          </div>
          <Input.OTP
            length={6}
            size="large"
            className="bg-transparent"
            onChange={(e) => handleChangeOtp(e)}
            value={otp}
          />
        </>
      );
    }
  };

  console.log(noTelp);
  console.log(otp);

  return (
    <div className="container-login d-flex w-100 h-100 flex-column p-4">
      <div
        className="container d-flex justify-content-center align-items-center flex-column flex-wrap h-100 w-25 gap-5"
        style={{ zIndex: "99" }}
      >
        <h5 className="text-light text-uppercase fw-semibold">Login Member</h5>
        {listOfStep.map((step) => (
          <>{isActiveStep === step.urut && formStepDisplay()}</>
        ))}
        <div className="d-flex w-100 gap-2 flex-column">
          <Button
            type="primary"
            className="w-100"
            size="large"
            onClick={() => setActiveStep(isActiveStep + 1)}
          >
            Selanjutnya
          </Button>
          <Button
            className="w-100 bg-transparent text-light"
            size="large"
            onClick={() => (window.location.href = "https://www.thejarrdin.com")}
          >
            Kembali
          </Button>
        </div>
      </div>

      <div className="footer container d-flex w-100 justify-content-center" style={{ zIndex: 99 }}>
        <img src={threelogo} alt="3 logo" style={{ width: "250px", height: "50px" }} />
      </div>
    </div>
  );
}

export default Login;
