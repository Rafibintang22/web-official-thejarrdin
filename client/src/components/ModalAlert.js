import { Modal } from "antd";
const info = () => {
  Modal.info({
    title: "This is a notification message",
    content: (
      <div>
        <p>some messages...some messages...</p>
        <p>some messages...some messages...</p>
      </div>
    ),
    onOk() {},
  });
};
const success = (message) => {
  Modal.success({
    content: message,
  });
};
const error = (message) => {
  Modal.error({
    title: "This is an error message",
    content: message,
  });
};
const warning = (message) => {
  Modal.warning({
    title: "This is a warning message",
    content: message,
  });
};

export default { info, success, error, warning };
