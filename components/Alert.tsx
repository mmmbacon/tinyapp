type AlertProps = {
  success: boolean;
  message?: string;
};

export default function Alert({ success, message }: AlertProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="container-fluid">
      <div className="col">
        <div className="row">
          <div
            id={success ? "fadeAlert" : "fadeAlert"}
            className={`alert ${success ? "alert-success" : "alert-danger"} fixed-bottom w-100`}
            style={{ opacity: 0 }}
            role="alert"
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}
